import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Film,
  Volume2,
  VolumeX,
  FileText,
  Download,
  ShieldCheck,
  Loader2,
  Sparkles,
  Globe,
  Mic,
  UserCheck,
  Sliders,
  Maximize2,
  Minimize2,
  Subtitles,
} from 'lucide-react';
import { Article, LanguageCode } from '../types';
import { WORLD_LANGUAGES, getLanguageMeta, getLocalizedArray, getLocalizedText } from '../i18n/translations';
import {
  ExplainerVideoScene,
  TranslatedArticleContent,
  buildArticleComprehensiveVideo,
  getLearningUiStrings,
} from '../utils/articleLearningEngine';
import {
  INTONATION_PRESETS,
  DEFAULT_USER_INTONATION,
  UserIntonationConfig,
  getCulturalVoiceProfile,
  getLocalizedIntonationLabels,
  loadUserIntonationConfig,
  saveUserIntonationConfig,
  buildTtsIntonationDirective,
  selectBestCulturalVoice,
  estimateSpeechDurationSec,
  sanitizeTextForUninterruptedSpeech,
  splitSafeUtteranceChunks,
  toPlainSpokenFallback,
} from '../utils/culturalVoiceEngine';
import {
  drawEverydayNarrativeStage,
  drawSymbolicAvatarEmblem,
  getEverydayStoryProfile,
  getSymbolicFigureKvkkNotice,
} from '../utils/everydayStoryVideoEngine';

export interface VideoWatchProgressPayload {
  playsDelta: number;
  watchSecondsDelta: number;
  maxPositionSec: number;
  durationSec: number;
  completed: boolean;
}

interface ArticleExplainerVideoProps {
  article: Article;
  language: LanguageCode;
  onVideoMeasured?: (articleId: string) => void;
  onVideoWatchProgress?: (articleId: string, payload: VideoWatchProgressPayload) => void;
  articleVideoStats?: {
    plays: number;
    watchSeconds: number;
    completions?: number;
    maxPositionSec?: number;
    videoDurationSec?: number;
  };
}

interface StageProbePulse {
  x: number;
  y: number;
  bornAtMs: number;
}

interface NarrationQueueItem {
  globalIndex: number;
  sceneIndex: number;
  sentenceIndex: number;
  isSceneStart: boolean;
  text: string;
  startSec: number;
  endSec: number;
  estSec: number;
}

const VIDEO_I18N_CACHE_KEY = 'sciphil_video_i18n_v1';
const memoryTranslationCache = new Map<string, TranslatedArticleContent>();

function loadPersistedTranslation(cacheKey: string): TranslatedArticleContent | null {
  if (memoryTranslationCache.has(cacheKey)) {
    return memoryTranslationCache.get(cacheKey) || null;
  }
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(VIDEO_I18N_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Record<string, TranslatedArticleContent>;
    if (parsed && parsed[cacheKey]) {
      memoryTranslationCache.set(cacheKey, parsed[cacheKey]);
      return parsed[cacheKey];
    }
  } catch {
    // ignore storage errors
  }
  return null;
}

function savePersistedTranslation(cacheKey: string, content: TranslatedArticleContent) {
  memoryTranslationCache.set(cacheKey, content);
  if (typeof window === 'undefined') return;
  try {
    const raw = window.localStorage.getItem(VIDEO_I18N_CACHE_KEY);
    const parsed: Record<string, TranslatedArticleContent> = raw ? JSON.parse(raw) : {};
    const keys = Object.keys(parsed);
    if (keys.length > 48) {
      // Keep cache compact by pruning oldest entries
      keys.slice(0, keys.length - 40).forEach((k) => delete parsed[k]);
    }
    parsed[cacheKey] = content;
    window.localStorage.setItem(VIDEO_I18N_CACHE_KEY, JSON.stringify(parsed));
  } catch {
    // ignore storage quota errors
  }
}

function hashArticleSeed(id: string): number {
  let h = 5381;
  for (let i = 0; i < id.length; i++) {
    h = (h * 33) ^ id.charCodeAt(i);
  }
  return Math.abs(h);
}

function formatMmSs(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const cleaned = String(text || '').replace(/\s+/g, ' ').trim();
  if (!cleaned) return [];

  // Support CJK scripts without spaces cleanly as well as Latin/Cyrillic/Arabic
  const hasSpaces = /\s/.test(cleaned);
  if (!hasSpaces && cleaned.length > 24) {
    const lines: string[] = [];
    let current = '';
    for (const ch of cleaned) {
      const test = current + ch;
      if (ctx.measureText(test).width > maxWidth && current) {
        lines.push(current);
        current = ch;
      } else {
        current = test;
      }
    }
    if (current) lines.push(current);
    return lines;
  }

  const words = cleaned.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function drawConceptTag(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string,
  accentColor: string,
  bgColor = 'rgba(2, 6, 23, 0.86)'
) {
  ctx.save();
  ctx.font = 'bold 10px monospace';
  const padX = 6;
  const tw = ctx.measureText(text).width;
  const boxW = tw + padX * 2;
  const boxH = 18;
  const left = x - boxW / 2;
  const top = y - boxH / 2;

  ctx.fillStyle = bgColor;
  ctx.fillRect(left, top, boxW, boxH);
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 1;
  ctx.strokeRect(left, top, boxW, boxH);

  ctx.fillStyle = accentColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y + 0.5);
  ctx.restore();
}

function drawAnalogClockEntity(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  angleRad: number,
  ringColor: string,
  label: string
) {
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
  ctx.strokeStyle = ringColor;
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(a) * (radius - 4), y + Math.sin(a) * (radius - 4));
    ctx.lineTo(x + Math.cos(a) * (radius - 1.5), y + Math.sin(a) * (radius - 1.5));
    ctx.stroke();
  }

  ctx.strokeStyle = '#F8FAFC';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(
    x + Math.cos(angleRad - Math.PI / 2) * (radius - 5),
    y + Math.sin(angleRad - Math.PI / 2) * (radius - 5)
  );
  ctx.stroke();

  ctx.strokeStyle = ringColor;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(
    x + Math.cos(angleRad * 0.25 - Math.PI / 2) * (radius - 9),
    y + Math.sin(angleRad * 0.25 - Math.PI / 2) * (radius - 9)
  );
  ctx.stroke();

  drawConceptTag(ctx, x, y + radius + 14, label, ringColor);
  ctx.restore();
}

export const ArticleExplainerVideo: React.FC<ArticleExplainerVideoProps> = ({
  article,
  language,
  onVideoMeasured,
  onVideoWatchProgress,
  articleVideoStats,
}) => {
  const [videoLang, setVideoLang] = useState<LanguageCode>(language);
  const [personaIndex, setPersonaIndex] = useState<0 | 1>(0);
  const [manualVoiceUri, setManualVoiceUri] = useState<string>('');
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [translatedMap, setTranslatedMap] = useState<
    Partial<Record<LanguageCode, TranslatedArticleContent>>
  >({});
  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  const [currentTime, setCurrentTime] = useState<number>(0);
  const [sessionWatchedSec, setSessionWatchedSec] = useState<number>(0);
  const [actualCompletedDurationSec, setActualCompletedDurationSec] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 1.25 | 1.5 | 2>(1);
  // Voiceover is ON by default so the video narrates the full comprehensive summary start-to-finish
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [showScript, setShowScript] = useState<boolean>(false);
  const [showIntonationPanel, setShowIntonationPanel] = useState<boolean>(false);
  const [userIntonation, setUserIntonation] = useState<UserIntonationConfig>(() =>
    loadUserIntonationConfig()
  );
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingModeNote, setRecordingModeNote] = useState<string>('');
  const [activeQueueIndex, setActiveQueueIndex] = useState<number>(0);
  const [interactionTick, setInteractionTick] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number | null>(null);
  const measuredOnceRef = useRef<boolean>(false);
  const pendingWatchSecRef = useRef<number>(0);
  const sessionWatchedSecRef = useRef<number>(0);
  const maxPositionSecRef = useRef<number>(0);
  const completedReportedRef = useRef<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordTimerRef = useRef<number | null>(null);
  const recordingAudioCtxRef = useRef<AudioContext | null>(null);
  const recordingAudioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const probePulsesRef = useRef<StageProbePulse[]>([]);
  const activeSentenceBtnRef = useRef<HTMLButtonElement | null>(null);

  // Speaker-driven queue refs so playback never cuts the narrator off early
  const isSpeakingQueueRef = useRef<boolean>(false);
  const speakSessionIdRef = useRef<number>(0);
  const queuePauseTimerRef = useRef<number | null>(null);
  const speakStartDelayRef = useRef<number | null>(null);
  const utteranceWatchdogRef = useRef<number | null>(null);
  const utteranceHeartbeatRef = useRef<number | null>(null);
  const activeQueueIndexRef = useRef<number>(0);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const updateUserIntonation = useCallback((next: UserIntonationConfig) => {
    setUserIntonation(next);
    saveUserIntonationConfig(next);
  }, []);

  const ui = getLearningUiStrings(videoLang);
  const intonationUi = useMemo(() => getLocalizedIntonationLabels(videoLang), [videoLang]);
  const voiceProfile = useMemo(() => getCulturalVoiceProfile(videoLang), [videoLang]);
  const activePersona = voiceProfile.personas[personaIndex] || voiceProfile.personas[0];
  const videoLangMeta = getLanguageMeta(videoLang);

  const selectedVoiceInfo = useMemo(
    () => selectBestCulturalVoice(availableVoices, videoLang, personaIndex, manualVoiceUri || undefined),
    [availableVoices, videoLang, personaIndex, manualVoiceUri]
  );

  // Build unrestricted comprehensive summary bundle in the active videoLang
  const translatedOverride = translatedMap[videoLang];
  const videoBundle = useMemo(
    () => buildArticleComprehensiveVideo(article, videoLang, translatedOverride),
    [article, videoLang, translatedOverride]
  );

  const scenes = videoBundle.scenes;
  const articleTitle = videoBundle.articleTitle;
  const articleSeed = useMemo(() => hashArticleSeed(article.id), [article.id]);

  // Flatten all comprehensive summary sentences into an ordered narration queue
  const narrationQueue = useMemo<NarrationQueueItem[]>(() => {
    const items: NarrationQueueItem[] = [];
    let cursorSec = 0;
    let globalIndex = 0;
    scenes.forEach((sc) => {
      const sentences =
        sc.narrationSentences && sc.narrationSentences.length > 0
          ? sc.narrationSentences
          : [sc.narrationText || sc.caption];
      sentences.forEach((sentence, sIdx) => {
        const estSec = Math.max(
          2,
          estimateSpeechDurationSec(
            sentence,
            videoLang,
            activePersona.rateMultiplier * userIntonation.rate,
            userIntonation.pauseScale
          )
        );
        items.push({
          globalIndex,
          sceneIndex: sc.index,
          sentenceIndex: sIdx,
          isSceneStart: sIdx === 0,
          text: sentence,
          startSec: cursorSec,
          endSec: cursorSec + estSec,
          estSec,
        });
        cursorSec += estSec;
        globalIndex += 1;
      });
    });
    return items;
  }, [scenes, videoLang, activePersona.rateMultiplier, userIntonation.rate, userIntonation.pauseScale]);

  const totalEstimatedDurationSec = useMemo(() => {
    if (narrationQueue.length > 0) {
      return Math.max(30, narrationQueue[narrationQueue.length - 1].endSec);
    }
    return Math.max(30, videoBundle.totalEstimatedDurationSec);
  }, [narrationQueue, videoBundle.totalEstimatedDurationSec]);

  const effectiveTotalDurationSec = actualCompletedDurationSec || totalEstimatedDurationSec;

  const speechSupported =
    typeof window !== 'undefined' && 'speechSynthesis' in window;

  const activeQueueItem = narrationQueue[activeQueueIndex] || narrationQueue[0] || null;

  const activeScene: ExplainerVideoScene = useMemo(() => {
    if (isPlaying && voiceEnabled && speechSupported && activeQueueItem) {
      return scenes[activeQueueItem.sceneIndex] || scenes[0];
    }
    return (
      scenes.find((s) => currentTime >= s.startSec && currentTime < s.endSec) ||
      scenes[scenes.length - 1]
    );
  }, [scenes, currentTime, isPlaying, voiceEnabled, speechSupported, activeQueueItem]);

  const clearUtteranceGuards = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (utteranceWatchdogRef.current !== null) {
      window.clearTimeout(utteranceWatchdogRef.current);
      utteranceWatchdogRef.current = null;
    }
    if (utteranceHeartbeatRef.current !== null) {
      window.clearInterval(utteranceHeartbeatRef.current);
      utteranceHeartbeatRef.current = null;
    }
  }, []);

  const stopSpeechQueue = useCallback(() => {
    speakSessionIdRef.current += 1;
    isSpeakingQueueRef.current = false;
    if (typeof window !== 'undefined') {
      if (queuePauseTimerRef.current !== null) {
        window.clearTimeout(queuePauseTimerRef.current);
        queuePauseTimerRef.current = null;
      }
      if (speakStartDelayRef.current !== null) {
        window.clearTimeout(speakStartDelayRef.current);
        speakStartDelayRef.current = null;
      }
    }
    clearUtteranceGuards();
    currentUtteranceRef.current = null;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore cancel errors
      }
    }
  }, [clearUtteranceGuards]);

  const flushWatchProgress = useCallback(
    (opts?: { forcePlaysDelta?: number; completed?: boolean; minSeconds?: number }) => {
      const playsDelta = opts?.forcePlaysDelta || 0;
      const wholeSec = Math.floor(pendingWatchSecRef.current);
      const minSec = opts?.minSeconds ?? 1;
      const completed = Boolean(opts?.completed && !completedReportedRef.current);
      if (playsDelta <= 0 && wholeSec < minSec && !completed) return;

      if (wholeSec > 0) {
        pendingWatchSecRef.current = Math.max(0, pendingWatchSecRef.current - wholeSec);
      }
      if (completed) {
        completedReportedRef.current = true;
      }
      const durationToReport = Math.max(1, Math.round(effectiveTotalDurationSec));
      onVideoWatchProgress?.(article.id, {
        playsDelta,
        watchSecondsDelta: wholeSec,
        maxPositionSec: Math.min(durationToReport, Math.floor(maxPositionSecRef.current)),
        durationSec: durationToReport,
        completed,
      });
    },
    [article.id, onVideoWatchProgress, effectiveTotalDurationSec]
  );

  // Load browser SpeechSynthesis voices (including asynchronous voiceschanged event)
  useEffect(() => {
    if (!speechSupported) return;
    const syncVoices = () => {
      try {
        const list = window.speechSynthesis.getVoices();
        if (list && list.length > 0) {
          setAvailableVoices(list);
        }
      } catch {
        // ignore
      }
    };
    syncVoices();
    window.speechSynthesis.addEventListener?.('voiceschanged', syncVoices);
    return () => {
      window.speechSynthesis.removeEventListener?.('voiceschanged', syncVoices);
    };
  }, [speechSupported]);

  // Strictly non-photographic symbolic illustrations only (zero real-person portrait preload — KVKK & GDPR compliant)

  // Sync video language when top-level site language changes
  useEffect(() => {
    stopSpeechQueue();
    setIsPlaying(false);
    setVideoLang(language);
    setManualVoiceUri('');
    setCurrentTime(0);
    setActiveQueueIndex(0);
    activeQueueIndexRef.current = 0;
    setActualCompletedDurationSec(null);
  }, [language, stopSpeechQueue]);

  // Reset playback state cleanly if article switches
  useEffect(() => {
    stopSpeechQueue();
    setIsPlaying(false);
    setCurrentTime(0);
    setActiveQueueIndex(0);
    activeQueueIndexRef.current = 0;
    setActualCompletedDurationSec(null);
    measuredOnceRef.current = false;
    completedReportedRef.current = false;
    maxPositionSecRef.current = 0;
    sessionWatchedSecRef.current = 0;
    setSessionWatchedSec(0);
    probePulsesRef.current = [];
  }, [article.id, stopSpeechQueue]);

  // Fetch & cache real 12-language article translation when videoLang is not natively populated
  useEffect(() => {
    const hasNative = Boolean(
      article.title[videoLang] &&
        article.abstract[videoLang] &&
        article.contentParagraphs[videoLang]?.length
    );
    if (hasNative) {
      setIsTranslating(false);
      return;
    }

    const cacheKey = `${article.id}::${videoLang}`;
    const persisted = loadPersistedTranslation(cacheKey);
    if (persisted) {
      setTranslatedMap((prev) => (prev[videoLang] ? prev : { ...prev, [videoLang]: persisted }));
      setIsTranslating(false);
      return;
    }

    let cancelled = false;
    setIsTranslating(true);
    fetch('/api/ai/translate-article', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        articleId: article.id,
        title: getLocalizedText(article.title, 'tr'),
        subtitle: getLocalizedText(article.subtitle, 'tr'),
        abstract: getLocalizedText(article.abstract, 'tr'),
        keyFindings: getLocalizedArray(article.keyFindings, 'tr'),
        contentParagraphs: getLocalizedArray(article.contentParagraphs, 'tr'),
        targetLanguage: videoLang,
      }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        const bundle: TranslatedArticleContent = {
          title: data.title || getLocalizedText(article.title, videoLang),
          subtitle: data.subtitle || getLocalizedText(article.subtitle, videoLang),
          abstract: data.abstract || getLocalizedText(article.abstract, videoLang),
          keyFindings:
            Array.isArray(data.keyFindings) && data.keyFindings.length > 0
              ? data.keyFindings
              : getLocalizedArray(article.keyFindings, videoLang),
          contentParagraphs:
            Array.isArray(data.contentParagraphs) && data.contentParagraphs.length > 0
              ? data.contentParagraphs
              : getLocalizedArray(article.contentParagraphs, videoLang),
          methodologyNote: getLocalizedText(article.simulation.methodologyNote, videoLang),
        };
        savePersistedTranslation(cacheKey, bundle);
        setTranslatedMap((prev) => ({ ...prev, [videoLang]: bundle }));
      })
      .catch(() => {
        // Fallback to native 12-language structured summary builder seamlessly
      })
      .finally(() => {
        if (!cancelled) setIsTranslating(false);
      });

    return () => {
      cancelled = true;
    };
  }, [article, videoLang]);

  // Cleanup speech & recording on unmount
  useEffect(() => {
    return () => {
      stopSpeechQueue();
      if (recordTimerRef.current !== null && typeof window !== 'undefined') {
        window.clearTimeout(recordTimerRef.current);
      }
      if (recordingAudioSourceRef.current) {
        try {
          recordingAudioSourceRef.current.stop();
        } catch {
          // ignore
        }
        recordingAudioSourceRef.current = null;
      }
      if (recordingAudioCtxRef.current) {
        try {
          recordingAudioCtxRef.current.close();
        } catch {
          // ignore
        }
        recordingAudioCtxRef.current = null;
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try {
          mediaRecorderRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, [stopSpeechQueue]);

  // Gentle SpeechSynthesis paused-state recovery (NEVER calls pause(), which stutters/kills neural voices)
  useEffect(() => {
    if (!isPlaying || !voiceEnabled || !speechSupported) return;
    const recoveryId = window.setInterval(() => {
      try {
        if (isSpeakingQueueRef.current && window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      } catch {
        // ignore
      }
    }, 2500);
    return () => window.clearInterval(recoveryId);
  }, [isPlaying, voiceEnabled, speechSupported]);

  // Auto-scroll active sentence inside expandable script panel
  useEffect(() => {
    if (showScript && isPlaying && activeSentenceBtnRef.current) {
      activeSentenceBtnRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeQueueIndex, showScript, isPlaying]);

  // Keep fresh playback configuration in refs so voiceschanged / intonation tweaks never cancel active speech mid-word
  const availableVoicesRef = useRef(availableVoices);
  const userIntonationRef = useRef(userIntonation);
  const playbackSpeedRef = useRef(playbackSpeed);
  const personaIndexRef = useRef(personaIndex);
  const manualVoiceUriRef = useRef(manualVoiceUri);
  const videoLangRef = useRef(videoLang);
  const voiceProfileRef = useRef(voiceProfile);
  const activePersonaRef = useRef(activePersona);
  const narrationQueueRef = useRef(narrationQueue);
  const totalEstimatedDurationSecRef = useRef(totalEstimatedDurationSec);
  const flushWatchProgressRef = useRef(flushWatchProgress);

  availableVoicesRef.current = availableVoices;
  userIntonationRef.current = userIntonation;
  playbackSpeedRef.current = playbackSpeed;
  personaIndexRef.current = personaIndex;
  manualVoiceUriRef.current = manualVoiceUri;
  videoLangRef.current = videoLang;
  voiceProfileRef.current = voiceProfile;
  activePersonaRef.current = activePersona;
  narrationQueueRef.current = narrationQueue;
  totalEstimatedDurationSecRef.current = totalEstimatedDurationSec;
  flushWatchProgressRef.current = flushWatchProgress;

  // Speak comprehensive summary seamlessly without interruptions on any alphanumeric/symbol/unicode character.
  // Video duration adapts strictly to when the speaker finishes the final sentence!
  const speakQueueFromIndex = useCallback(
    (startIndex: number) => {
      if (!speechSupported || narrationQueueRef.current.length === 0) return;

      stopSpeechQueue();
      const mySessionId = speakSessionIdRef.current;
      isSpeakingQueueRef.current = true;

      const speakItem = (idx: number) => {
        if (!isSpeakingQueueRef.current || speakSessionIdRef.current !== mySessionId) return;
        const queue = narrationQueueRef.current;

        if (idx >= queue.length) {
          isSpeakingQueueRef.current = false;
          clearUtteranceGuards();
          const finalDuration = Math.max(
            totalEstimatedDurationSecRef.current,
            Math.round(sessionWatchedSecRef.current)
          );
          setActualCompletedDurationSec(finalDuration);
          setCurrentTime(totalEstimatedDurationSecRef.current);
          maxPositionSecRef.current = finalDuration;
          setIsPlaying(false);
          flushWatchProgressRef.current({ completed: true, minSeconds: 1 });
          return;
        }

        const item = queue[idx];
        activeQueueIndexRef.current = idx;
        setActiveQueueIndex(idx);
        setCurrentTime(item.startSec);

        const lang = videoLangRef.current;
        const subChunks = splitSafeUtteranceChunks(item.text, lang);

        const advanceToNextSentence = () => {
          if (!isSpeakingQueueRef.current || speakSessionIdRef.current !== mySessionId) return;
          clearUtteranceGuards();
          const nextIdx = idx + 1;
          const liveQueue = narrationQueueRef.current;
          if (nextIdx >= liveQueue.length) {
            speakItem(nextIdx);
            return;
          }
          const nextItem = liveQueue[nextIdx];
          const prof = voiceProfileRef.current;
          const pauseMs = Math.round(
            ((nextItem.isSceneStart ? prof.sectionPauseMs : prof.sentencePauseMs) *
              userIntonationRef.current.pauseScale) /
              playbackSpeedRef.current
          );
          queuePauseTimerRef.current = window.setTimeout(() => {
            if (isSpeakingQueueRef.current && speakSessionIdRef.current === mySessionId) {
              speakItem(nextIdx);
            }
          }, Math.max(85, Math.min(1800, pauseMs)));
        };

        // If a sentence contained only non-speakable symbols, skip cleanly without pausing
        if (subChunks.length === 0) {
          queuePauseTimerRef.current = window.setTimeout(advanceToNextSentence, 60);
          return;
        }

        const speakSubChunk = (subIdx: number, attempt: number) => {
          if (!isSpeakingQueueRef.current || speakSessionIdRef.current !== mySessionId) return;
          if (subIdx >= subChunks.length) {
            advanceToNextSentence();
            return;
          }

          clearUtteranceGuards();

          const rawChunk = subChunks[subIdx];
          const spokenText =
            attempt === 0 ? rawChunk : toPlainSpokenFallback(rawChunk);

          if (!spokenText) {
            speakSubChunk(subIdx + 1, 0);
            return;
          }

          const prof = voiceProfileRef.current;
          const persona = activePersonaRef.current;
          const intonation = userIntonationRef.current;
          const speed = playbackSpeedRef.current;

          const effectiveRate = Number(
            Math.min(
              2.0,
              Math.max(0.55, persona.rateMultiplier * intonation.rate * speed)
            ).toFixed(2)
          );

          const utter = new SpeechSynthesisUtterance(spokenText);
          utter.lang = prof.bcp47;
          utter.rate = effectiveRate;
          utter.pitch = Number(
            Math.min(1.8, Math.max(0.5, persona.pitch * intonation.pitch)).toFixed(2)
          );
          utter.volume = Math.min(1.0, Math.max(0.15, intonation.volume));

          // On primary attempt pick best synthetic cultural voice; on retry (attempt > 0) let OS default voice handle any stubborn voice error
          if (attempt === 0) {
            const liveVoices =
              availableVoicesRef.current.length > 0
                ? availableVoicesRef.current
                : window.speechSynthesis.getVoices();
            const picked = selectBestCulturalVoice(
              liveVoices,
              lang,
              personaIndexRef.current,
              manualVoiceUriRef.current || undefined
            );
            if (picked.voice) {
              utter.voice = picked.voice;
            }
          }

          let settled = false;
          let hasStarted = false;
          let quietPollsAfterStart = 0;
          let quietPollsBeforeStart = 0;

          const settleAndProceed = (retryCurrentChunk: boolean) => {
            if (settled) return;
            settled = true;
            clearUtteranceGuards();
            if (!isSpeakingQueueRef.current || speakSessionIdRef.current !== mySessionId) return;

            if (retryCurrentChunk && attempt < 1) {
              try {
                window.speechSynthesis.cancel();
              } catch {
                // ignore
              }
              queuePauseTimerRef.current = window.setTimeout(() => {
                if (isSpeakingQueueRef.current && speakSessionIdRef.current === mySessionId) {
                  speakSubChunk(subIdx, attempt + 1);
                }
              }, 85);
              return;
            }

            if (subIdx + 1 < subChunks.length) {
              queuePauseTimerRef.current = window.setTimeout(() => {
                if (isSpeakingQueueRef.current && speakSessionIdRef.current === mySessionId) {
                  speakSubChunk(subIdx + 1, 0);
                }
              }, 55);
            } else {
              advanceToNextSentence();
            }
          };

          utter.onstart = () => {
            hasStarted = true;
            quietPollsAfterStart = 0;
          };

          utter.onend = () => {
            settleAndProceed(false);
          };

          utter.onerror = (ev) => {
            if (!isSpeakingQueueRef.current || speakSessionIdRef.current !== mySessionId) return;
            // If Chrome/Safari spuriously emitted canceled/interrupted while our session is STILL active, recover cleanly!
            if (ev.error === 'canceled' || ev.error === 'interrupted') {
              if (attempt < 1) {
                settleAndProceed(true);
              }
              return;
            }
            // Retry once with ultra-plain alphanumeric text & OS default voice, otherwise advance cleanly
            settleAndProceed(attempt < 1);
          };

          // Completion & silent-drop watchdog so narration can NEVER freeze on any character or browser quirk
          const estChunkSec = Math.max(
            2,
            estimateSpeechDurationSec(spokenText, lang, effectiveRate, 1.0)
          );
          const maxChunkWaitMs = Math.max(7500, Math.round(estChunkSec * 2200 + 4500));
          utteranceWatchdogRef.current = window.setTimeout(() => {
            if (settled) return;
            try {
              window.speechSynthesis.cancel();
            } catch {
              // ignore
            }
            settleAndProceed(false);
          }, maxChunkWaitMs);

          // Heartbeat detects browsers that finish speaking silently without firing onend, or stall before starting
          utteranceHeartbeatRef.current = window.setInterval(() => {
            if (settled || !isSpeakingQueueRef.current || speakSessionIdRef.current !== mySessionId) {
              clearUtteranceGuards();
              return;
            }
            try {
              if (window.speechSynthesis.paused) {
                window.speechSynthesis.resume();
                return;
              }
              const busy = window.speechSynthesis.speaking || window.speechSynthesis.pending;
              if (hasStarted) {
                if (!busy) {
                  quietPollsAfterStart += 1;
                  if (quietPollsAfterStart >= 2) {
                    settleAndProceed(false);
                  }
                } else {
                  quietPollsAfterStart = 0;
                }
              } else {
                if (!busy) {
                  quietPollsBeforeStart += 1;
                  if (quietPollsBeforeStart >= 3) {
                    settleAndProceed(attempt < 1);
                  }
                } else {
                  hasStarted = true;
                }
              }
            } catch {
              // ignore polling error
            }
          }, 850);

          currentUtteranceRef.current = utter;
          try {
            window.speechSynthesis.speak(utter);
          } catch {
            settleAndProceed(attempt < 1);
          }
        };

        speakSubChunk(0, 0);
      };

      const safeStart = Math.max(0, Math.min(startIndex, narrationQueueRef.current.length - 1));
      // 55ms post-cancel settling delay prevents Chrome/Safari from auto-canceling the brand-new utterance
      speakStartDelayRef.current = window.setTimeout(() => {
        if (isSpeakingQueueRef.current && speakSessionIdRef.current === mySessionId) {
          speakItem(safeStart);
        }
      }, 55);
    },
    [speechSupported, stopSpeechQueue, clearUtteranceGuards]
  );

  // Start/stop speaker queue cleanly when play/voice/language/article switches (without mid-sentence restarts on voice list load)
  const queueReady = narrationQueue.length > 0;
  useEffect(() => {
    if (isPlaying && voiceEnabled && speechSupported && queueReady) {
      speakQueueFromIndex(activeQueueIndexRef.current);
      return () => {
        stopSpeechQueue();
      };
    }
    stopSpeechQueue();
    return undefined;
  }, [
    isPlaying,
    voiceEnabled,
    speechSupported,
    queueReady,
    videoLang,
    article.id,
    personaIndex,
    manualVoiceUri,
    speakQueueFromIndex,
    stopSpeechQueue,
  ]);

  // Draw crisp 960x540 animated-entity explainer frame natively in all 12 languages (including Arabic RTL)
  const drawFrame = useCallback(
    (tSec: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const W = 960;
      const H = 540;
      const labels = voiceProfile.stageLabels;
      const isRtl = voiceProfile.dir === 'rtl';

      const queueItem =
        isPlaying && voiceEnabled && speechSupported
          ? narrationQueue[activeQueueIndex] || narrationQueue[0]
          : narrationQueue.find((q) => tSec >= q.startSec && tSec < q.endSec) ||
            narrationQueue[narrationQueue.length - 1];

      const scene =
        (queueItem ? scenes[queueItem.sceneIndex] : null) ||
        scenes.find((s) => tSec >= s.startSec && tSec < s.endSec) ||
        scenes[scenes.length - 1];

      const sceneDuration = Math.max(1, scene.endSec - scene.startSec);
      const sceneProgress = Math.min(1, Math.max(0, (tSec - scene.startSec) / sceneDuration));
      const phase = tSec * 1.45 + (articleSeed % 23) * 0.37;

      const nowMs = Date.now();
      probePulsesRef.current = probePulsesRef.current.filter((p) => nowMs - p.bornAtMs < 1800);
      const latestProbe = probePulsesRef.current[probePulsesRef.current.length - 1] || null;
      const probeBoost = latestProbe
        ? Math.max(0, 1 - (nowMs - latestProbe.bornAtMs) / 1800)
        : 0;

      const chapterFactor = (scene.index + 1) / Math.max(1, scenes.length);
      const chips = scene.conceptChips;
      const chip0 = chips[0] || article.category;
      const chip1 = chips[1] || labels.summaryBadge;
      const chip2 = chips[2] || labels.pipelineStages[3];

      // 1. Deep studio backdrop
      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, '#060B17');
      grad.addColorStop(0.55, '#0F172A');
      grad.addColorStop(1, '#111827');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Subtle architectural coordinate grid
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.07)';
      ctx.lineWidth = 1;
      for (let gx = 40; gx < W; gx += 60) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, H);
        ctx.stroke();
      }
      for (let gy = 40; gy < H; gy += 60) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(W, gy);
        ctx.stroke();
      }

      // 2. Right-side Interactive Moving-Entity Theater (480×314)
      const stageX = 456;
      const stageY = 66;
      const stageW = 480;
      const stageH = 314;
      const animH = stageH - 58;
      const cx = stageX + stageW / 2;
      const cy = stageY + animH / 2 + 6;
      const simType = scene.visualTheme;

      const stageGrad = ctx.createRadialGradient(cx, cy, 18, cx, cy, 260);
      stageGrad.addColorStop(0, 'rgba(30, 41, 59, 0.92)');
      stageGrad.addColorStop(1, 'rgba(7, 12, 24, 0.96)');
      ctx.fillStyle = stageGrad;
      ctx.fillRect(stageX, stageY, stageW, stageH);
      ctx.strokeStyle = scene.isConclusionScene
        ? 'rgba(52, 211, 153, 0.7)'
        : 'rgba(56, 189, 248, 0.42)';
      ctx.lineWidth = 1.6;
      ctx.strokeRect(stageX, stageY, stageW, stageH);

      // Stage top role badge
      ctx.fillStyle = 'rgba(2, 6, 23, 0.8)';
      ctx.fillRect(stageX + 1, stageY + 1, stageW - 2, 24);
      ctx.fillStyle = '#38BDF8';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`⚡ ${scene.entityRoleTag.slice(0, 62)}`, stageX + 10, stageY + 16);

      // Clip inside animated entity stage
      ctx.save();
      ctx.beginPath();
      ctx.rect(stageX + 3, stageY + 26, stageW - 6, animH - 26);
      ctx.clip();

      // Render everyday-life story plot with familiar daily objects & strictly symbolic illustrated human figures
      const everydayProfile = getEverydayStoryProfile(simType, videoLang);
      const activeStoryAct =
        everydayProfile.acts[scene.index] || everydayProfile.acts[everydayProfile.acts.length - 1];
      drawEverydayNarrativeStage({
        ctx,
        simType,
        sceneIndex: scene.index,
        stageX,
        stageY,
        stageW,
        animH,
        phase,
        sceneProgress,
        probeBoost,
        act: activeStoryAct,
        chips: [chip0, chip1, chip2],
        language: videoLang,
      });

      // Interactive viewer click probe ripples
      for (const pulse of probePulsesRef.current) {
        const ageFrac = (nowMs - pulse.bornAtMs) / 1800;
        if (ageFrac >= 0 && ageFrac <= 1) {
          ctx.strokeStyle = `rgba(52, 211, 153, ${(1 - ageFrac).toFixed(2)})`;
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.arc(pulse.x, pulse.y, 10 + ageFrac * 78, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      ctx.restore();

      // Stage footer: Live Equation + What Moving Entities Are Explaining Right Now
      ctx.fillStyle = '#090F1E';
      ctx.fillRect(stageX, stageY + animH, stageW, 58);
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
      ctx.strokeRect(stageX, stageY + animH, stageW, 58);

      ctx.fillStyle = '#FCD34D';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'left';
      const eqSlice =
        scene.keyEquation.length > 52 ? `${scene.keyEquation.slice(0, 52)}…` : scene.keyEquation;
      ctx.fillText(`ƒ: ${eqSlice}`, stageX + 10, stageY + animH + 17);

      ctx.fillStyle = '#CBD5E1';
      ctx.font = '11px sans-serif';
      ctx.save();
      ctx.direction = voiceProfile.dir;
      ctx.textAlign = isRtl ? 'right' : 'left';
      const beatX = isRtl ? stageX + stageW - 10 : stageX + 10;
      const beatLines = wrapCanvasText(ctx, scene.entityStoryBeat, stageW - 20).slice(0, 2);
      beatLines.forEach((bl, bIdx) => {
        ctx.fillText(bl, beatX, stageY + animH + 34 + bIdx * 15);
      });
      ctx.restore();

      // 3. Top Header Strip inside video frame
      ctx.fillStyle = '#10B981';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(
        `${article.figureNumber} · ${videoLangMeta.shortLabel} (${voiceProfile.nativeName}) · ${labels.summaryBadge}`,
        26,
        34
      );

      ctx.fillStyle = '#CBD5E1';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(
        `${labels.chapterPrefix} ${scene.index + 1}/${scenes.length} · ${formatMmSs(tSec)} / ~${formatMmSs(effectiveTotalDurationSec)}`,
        W - 26,
        34
      );
      ctx.textAlign = 'left';

      ctx.strokeStyle = 'rgba(148, 163, 184, 0.22)';
      ctx.beginPath();
      ctx.moveTo(26, 48);
      ctx.lineTo(W - 26, 48);
      ctx.stroke();

      // 4. Left Editorial Column + Emre Pelit CV Portrait + Cultural Narrator Badge
      const leftX = 26;
      const leftW = 410;
      let textStartY = 82;

      if (scene.showAuthorPortrait) {
        const avatarRadius = 30;
        const avatarCx = 58;
        const avatarCy = 98;

        // Strictly symbolic geometric illustrated character emblem (ZERO real-person photo — KVKK & GDPR compliant)
        drawSymbolicAvatarEmblem(ctx, avatarCx, avatarCy, avatarRadius, phase);

        ctx.fillStyle = '#FCD34D';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(labels.authorBanner.slice(0, 44), 100, 89);

        ctx.fillStyle = '#38BDF8';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(`${labels.narratorPrefix}: ${activePersona.name}`, 100, 106);

        ctx.fillStyle = '#34D399';
        ctx.font = '10px sans-serif';
        ctx.fillText(
          (videoLang === 'tr'
            ? 'Temsili Çizim Figür · Gerçek Kişi Fotoğrafı Yok'
            : 'Symbolic Illustrated Figure · No Real Photos'
          ).slice(0, 48),
          100,
          122
        );

        textStartY = 152;
      } else {
        // Show active narrator strip on every chapter
        ctx.fillStyle = '#38BDF8';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(
          `🎙 ${labels.narratorPrefix}: ${activePersona.name} · ${labels.speakerSynced}`,
          leftX,
          76
        );
        textStartY = 98;
      }

      // RTL-aware Editorial Text Block (Heading, Title, Bullet Points)
      ctx.save();
      ctx.direction = voiceProfile.dir;
      ctx.textAlign = isRtl ? 'right' : 'left';
      const editorialAnchorX = isRtl ? leftX + leftW : leftX;

      ctx.fillStyle = scene.isConclusionScene ? '#34D399' : '#38BDF8';
      ctx.font = 'bold 13px monospace';
      const headSlice =
        scene.heading.length > 48 ? `${scene.heading.slice(0, 48)}…` : scene.heading;
      ctx.fillText(headSlice, editorialAnchorX, textStartY);

      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 19px Georgia, serif';
      const titleLines = wrapCanvasText(ctx, articleTitle, leftW).slice(0, 3);
      let cursorY = textStartY + 26;
      titleLines.forEach((line) => {
        ctx.fillText(line, editorialAnchorX, cursorY);
        cursorY += 24;
      });

      cursorY += 8;
      scene.bulletPoints.forEach((bp, bpIdx) => {
        const revealAlpha = sceneProgress > bpIdx * 0.14 ? 1 : 0.45;
        ctx.fillStyle = `rgba(226, 232, 240, ${revealAlpha})`;
        ctx.font = '13px sans-serif';
        const bpLines = wrapCanvasText(ctx, `• ${bp}`, leftW).slice(0, 3);
        bpLines.forEach((bLine) => {
          if (cursorY < 372) {
            ctx.fillText(bLine, editorialAnchorX, cursorY);
            cursorY += 18;
          }
        });
        cursorY += 5;
      });
      ctx.restore();

      // 5. Bottom Live Spoken-Sentence Caption Band (high-contrast measured scrim + RTL aware)
      ctx.fillStyle = 'rgba(2, 6, 23, 0.95)';
      ctx.fillRect(24, H - 138, W - 48, 100);
      ctx.strokeStyle = isPlaying && voiceEnabled
        ? 'rgba(52, 211, 153, 0.72)'
        : 'rgba(56, 189, 248, 0.42)';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(24, H - 138, W - 48, 100);

      // Tiny live speaker status tag inside caption band
      ctx.fillStyle = isPlaying && voiceEnabled ? '#34D399' : '#38BDF8';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'left';
      const sentenceBadge = queueItem
        ? `${labels.liveReading} · ${queueItem.globalIndex + 1}/${narrationQueue.length} · ${activePersona.name}`
        : `${labels.summaryBadge} · ${activePersona.name}`;
      ctx.fillText(sentenceBadge.slice(0, 92), 38, H - 122);

      const liveCaptionText = queueItem?.text || scene.caption;
      ctx.save();
      ctx.direction = voiceProfile.dir;
      ctx.textAlign = isRtl ? 'right' : 'left';
      ctx.fillStyle = '#F8FAFC';
      ctx.font = '14px sans-serif';
      const capAnchorX = isRtl ? W - 40 : 40;
      const capLines = wrapCanvasText(ctx, liveCaptionText, W - 84).slice(0, 3);
      let capY = H - 100;
      capLines.forEach((cl) => {
        ctx.fillText(cl, capAnchorX, capY);
        capY += 22;
      });
      ctx.restore();

      // 6. Dynamic Speaker-Synced Progress Bar Strip with Chapter Markers
      const barX = 24;
      const barY = H - 24;
      const barW = W - 48;
      const progressFrac = Math.min(1, Math.max(0, tSec / Math.max(1, effectiveTotalDurationSec)));
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(barX, barY, barW, 7);
      ctx.fillStyle = '#10B981';
      ctx.fillRect(barX, barY, Math.round(progressFrac * barW), 7);

      ctx.fillStyle = 'rgba(2, 6, 23, 0.8)';
      scenes.forEach((sc, idx) => {
        if (idx === 0) return;
        const tickFrac = Math.min(1, sc.startSec / Math.max(1, effectiveTotalDurationSec));
        const tickX = barX + Math.round(tickFrac * barW);
        ctx.fillRect(tickX, barY, 1.5, 7);
      });
    },
    [
      scenes,
      narrationQueue,
      activeQueueIndex,
      isPlaying,
      voiceEnabled,
      speechSupported,
      voiceProfile,
      activePersona.name,
      videoLangMeta.shortLabel,
      article.figureNumber,
      article.category,
      articleSeed,
      articleTitle,
      effectiveTotalDurationSec,
      videoLang,
    ]
  );

  // Redraw canvas whenever currentTime, active sentence, or viewer click probe updates
  useEffect(() => {
    drawFrame(currentTime);
  }, [currentTime, activeQueueIndex, interactionTick, drawFrame]);

  // Smooth animation loop when playing:
  // - When voiceEnabled & speechSupported: smoothly interpolates within the active spoken sentence
  //   so the video NEVER finishes before the narrator finishes reading the last sentence.
  // - When muted/unsupported: advances across totalEstimatedDurationSec at playbackSpeed.
  useEffect(() => {
    if (!isPlaying) {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      lastFrameTimeRef.current = null;
      flushWatchProgress({ minSeconds: 2 });
      return;
    }

    const tick = (nowMs: number) => {
      if (lastFrameTimeRef.current === null) {
        lastFrameTimeRef.current = nowMs;
      }
      const realDeltaSec = Math.min(0.5, Math.max(0, (nowMs - lastFrameTimeRef.current) / 1000));
      const deltaSec = realDeltaSec * playbackSpeed;
      lastFrameTimeRef.current = nowMs;

      pendingWatchSecRef.current += realDeltaSec;
      sessionWatchedSecRef.current += realDeltaSec;
      const flooredSession = Math.floor(sessionWatchedSecRef.current);
      setSessionWatchedSec((prev) => (prev === flooredSession ? prev : flooredSession));

      if (pendingWatchSecRef.current >= 10) {
        flushWatchProgress({ minSeconds: 10 });
      }

      if (voiceEnabled && speechSupported) {
        const activeItem = narrationQueue[activeQueueIndexRef.current];
        if (activeItem) {
          setCurrentTime((prev) => {
            const ceiling = Math.max(activeItem.startSec, activeItem.endSec - 0.08);
            const next = Math.min(ceiling, Math.max(activeItem.startSec, prev + deltaSec));
            if (next > maxPositionSecRef.current) {
              maxPositionSecRef.current = next;
            }
            return next;
          });
        }
        // Keep entity animation alive even while waiting on a long spoken sentence
        setInteractionTick((v) => (v + 1) % 100000);
      } else {
        setCurrentTime((prev) => {
          const next = prev + deltaSec;
          if (next > maxPositionSecRef.current) {
            maxPositionSecRef.current = Math.min(totalEstimatedDurationSec, next);
          }
          // Keep activeQueueIndex synced in muted mode
          const matchingIdx = narrationQueue.findIndex(
            (q) => next >= q.startSec && next < q.endSec
          );
          if (matchingIdx >= 0 && matchingIdx !== activeQueueIndexRef.current) {
            activeQueueIndexRef.current = matchingIdx;
            setActiveQueueIndex(matchingIdx);
          }
          if (next >= totalEstimatedDurationSec) {
            setIsPlaying(false);
            flushWatchProgress({ completed: true, minSeconds: 1 });
            return totalEstimatedDurationSec;
          }
          return next;
        });
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      flushWatchProgress({ minSeconds: 2 });
    };
  }, [
    isPlaying,
    playbackSpeed,
    voiceEnabled,
    speechSupported,
    narrationQueue,
    totalEstimatedDurationSec,
    flushWatchProgress,
  ]);

  const handleCanvasStageClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / Math.max(1, rect.width);
    const scaleY = canvas.height / Math.max(1, rect.height);
    const cx = (e.clientX - rect.left) * scaleX;
    const cy = (e.clientY - rect.top) * scaleY;

    if (cx >= 456 && cx <= 936 && cy >= 66 && cy <= 324) {
      probePulsesRef.current.push({ x: cx, y: cy, bornAtMs: Date.now() });
      setInteractionTick((v) => v + 1);
      if (!isPlaying) {
        let frames = 0;
        const pulseStep = () => {
          frames += 1;
          setInteractionTick((v) => v + 1);
          if (frames < 36) requestAnimationFrame(pulseStep);
        };
        requestAnimationFrame(pulseStep);
      }
    }
  };

  const jumpToQueueIndex = (targetIdx: number, autoPlay?: boolean) => {
    const safeIdx = Math.max(0, Math.min(targetIdx, Math.max(0, narrationQueue.length - 1)));
    const targetItem = narrationQueue[safeIdx];
    activeQueueIndexRef.current = safeIdx;
    setActiveQueueIndex(safeIdx);
    if (targetItem) {
      setCurrentTime(targetItem.startSec);
    }
    if (autoPlay || isPlaying) {
      if (!measuredOnceRef.current) {
        measuredOnceRef.current = true;
        onVideoMeasured?.(article.id);
        flushWatchProgress({ forcePlaysDelta: 1, minSeconds: 0 });
      }
      setIsPlaying(true);
      if (voiceEnabled && speechSupported) {
        speakQueueFromIndex(safeIdx);
      }
    }
  };

  const handleJumpToChapter = (sceneIndex: number) => {
    const firstSentenceIdx = narrationQueue.findIndex((q) => q.sceneIndex === sceneIndex);
    if (firstSentenceIdx >= 0) {
      jumpToQueueIndex(firstSentenceIdx);
    } else {
      const sc = scenes[sceneIndex];
      if (sc) setCurrentTime(sc.startSec);
    }
  };

  const handleTimelineScrub = (nextSec: number) => {
    setCurrentTime(nextSec);
    const matchIdx = narrationQueue.findIndex((q) => nextSec >= q.startSec && nextSec < q.endSec);
    const targetIdx =
      matchIdx >= 0
        ? matchIdx
        : nextSec >= totalEstimatedDurationSec
          ? Math.max(0, narrationQueue.length - 1)
          : 0;
    activeQueueIndexRef.current = targetIdx;
    setActiveQueueIndex(targetIdx);
    if (isPlaying && voiceEnabled && speechSupported) {
      speakQueueFromIndex(targetIdx);
    }
  };

  const handleTogglePlay = () => {
    if (!measuredOnceRef.current) {
      measuredOnceRef.current = true;
      onVideoMeasured?.(article.id);
      flushWatchProgress({ forcePlaysDelta: 1, minSeconds: 0 });
    }
    if (!isPlaying) {
      if (
        currentTime >= totalEstimatedDurationSec - 0.5 ||
        activeQueueIndexRef.current >= narrationQueue.length
      ) {
        setCurrentTime(0);
        activeQueueIndexRef.current = 0;
        setActiveQueueIndex(0);
        setActualCompletedDurationSec(null);
      }
      setIsPlaying(true);
    } else {
      stopSpeechQueue();
      setIsPlaying(false);
    }
  };

  const handleRestart = () => {
    stopSpeechQueue();
    setCurrentTime(0);
    activeQueueIndexRef.current = 0;
    setActiveQueueIndex(0);
    setActualCompletedDurationSec(null);
    if (!measuredOnceRef.current) {
      measuredOnceRef.current = true;
      onVideoMeasured?.(article.id);
      flushWatchProgress({ forcePlaysDelta: 1, minSeconds: 0 });
    }
    setIsPlaying(true);
    if (voiceEnabled && speechSupported) {
      // Wait a microtask so state settles cleanly before speaking from sentence 0
      window.setTimeout(() => speakQueueFromIndex(0), 30);
    }
  };

  const handleVideoLanguageSwitch = (nextLang: LanguageCode) => {
    const wasPlaying = isPlaying;
    stopSpeechQueue();
    setIsPlaying(false);
    setVideoLang(nextLang);
    setManualVoiceUri('');
    setCurrentTime(0);
    activeQueueIndexRef.current = 0;
    setActiveQueueIndex(0);
    setActualCompletedDurationSec(null);
    if (wasPlaying) {
      window.setTimeout(() => setIsPlaying(true), 80);
    }
  };

  const cleanupRecordingAudio = useCallback(() => {
    if (recordingAudioSourceRef.current) {
      try {
        recordingAudioSourceRef.current.onended = null;
        recordingAudioSourceRef.current.stop();
      } catch {
        // ignore
      }
      recordingAudioSourceRef.current = null;
    }
    if (recordingAudioCtxRef.current) {
      try {
        recordingAudioCtxRef.current.close();
      } catch {
        // ignore
      }
      recordingAudioCtxRef.current = null;
    }
  }, []);

  const handleExportWebm = async () => {
    if (isRecording && mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      if (recordTimerRef.current !== null) {
        window.clearTimeout(recordTimerRef.current);
        recordTimerRef.current = null;
      }
      cleanupRecordingAudio();
      mediaRecorderRef.current.stop();
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas || typeof MediaRecorder === 'undefined' || !('captureStream' in canvas)) {
      return;
    }

    setIsRecording(true);
    setRecordingModeNote(
      videoLang === 'tr' ? 'Sentetik ses hazırlanıyor…' : 'Preparing synthetic audio…'
    );

    const videoStream = canvas.captureStream(30);
    let combinedStream: MediaStream = videoStream;
    let hasMuxedAudio = false;
    let decodedAudioBuffer: AudioBuffer | null = null;
    let audioCtx: AudioContext | null = null;
    let audioDest: MediaStreamAudioDestinationNode | null = null;

    // Attempt to mux real synthetic TTS audio (with user's chosen language, cultural profile & intonation)
    if (voiceEnabled && typeof window !== 'undefined') {
      const AudioCtxCtor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxCtor) {
        try {
          const sliceText = sanitizeTextForUninterruptedSpeech(
            narrationQueue
              .slice(activeQueueIndexRef.current)
              .map((q) => q.text)
              .join(' '),
            videoLang
          ).slice(0, 2600);
          if (sliceText.trim().length > 0) {
            const ttsRes = await fetch('/api/ai/tts', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                text: sliceText,
                voiceName: activePersona.geminiVoiceFallback,
                languageCode: videoLang,
                intonationStyle: buildTtsIntonationDirective(userIntonation, videoLang, activePersona),
              }),
            });
            if (ttsRes.ok) {
              const ttsData = await ttsRes.json();
              if (ttsData?.audioBase64) {
                const binaryStr = window.atob(ttsData.audioBase64);
                const bytes = new Uint8Array(binaryStr.length);
                for (let i = 0; i < binaryStr.length; i++) {
                  bytes[i] = binaryStr.charCodeAt(i);
                }
                audioCtx = new AudioCtxCtor();
                recordingAudioCtxRef.current = audioCtx;
                decodedAudioBuffer = await audioCtx.decodeAudioData(bytes.buffer.slice(0));
                audioDest = audioCtx.createMediaStreamDestination();
                combinedStream = new MediaStream([
                  ...videoStream.getVideoTracks(),
                  ...audioDest.stream.getAudioTracks(),
                ]);
                hasMuxedAudio = true;
              }
            }
          }
        } catch {
          cleanupRecordingAudio();
          audioCtx = null;
          audioDest = null;
          decodedAudioBuffer = null;
          hasMuxedAudio = false;
        }
      }
    }

    const mimeCandidates = hasMuxedAudio
      ? ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm']
      : ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'];
    const mimeType =
      mimeCandidates.find((m) => MediaRecorder.isTypeSupported(m)) || 'video/webm';

    const recorder = new MediaRecorder(combinedStream, { mimeType });
    mediaRecorderRef.current = recorder;
    const chunks: Blob[] = [];

    recorder.ondataavailable = (ev) => {
      if (ev.data && ev.data.size > 0) chunks.push(ev.data);
    };
    recorder.onstop = () => {
      cleanupRecordingAudio();
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${article.slug || article.id}-summary-${videoLang}${hasMuxedAudio ? '-audio' : ''}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      mediaRecorderRef.current = null;
      setIsRecording(false);
      setRecordingModeNote('');
    };

    if (hasMuxedAudio && audioCtx && audioDest && decodedAudioBuffer) {
      // Mute browser speechSynthesis temporarily so muxed studio audio plays cleanly without echo
      stopSpeechQueue();
      setIsPlaying(true);
      const source = audioCtx.createBufferSource();
      source.buffer = decodedAudioBuffer;
      source.playbackRate.value = Math.min(
        2.0,
        Math.max(0.6, userIntonation.rate * playbackSpeed)
      );
      const gain = audioCtx.createGain();
      gain.gain.value = Math.min(1.0, Math.max(0.2, userIntonation.volume));
      source.connect(gain);
      gain.connect(audioDest);
      gain.connect(audioCtx.destination);
      recordingAudioSourceRef.current = source;

      source.onended = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop();
        }
      };

      recorder.start(500);
      source.start(0);
      setRecordingModeNote(
        videoLang === 'tr'
          ? 'Ses + Görüntü Kaydediliyor (Bitirmek için tıklayın)'
          : 'Recording Audio + Video (Click to finish)'
      );
    } else {
      setIsPlaying(true);
      recorder.start(500);
      setRecordingModeNote(
        videoLang === 'tr'
          ? 'Görsel Kayıt Aktif (Süre sınırı yok · Bitirmek için tıklayın)'
          : 'Visual Recording Active (Unrestricted · Click to finish)'
      );
    }
  };

  const stageContainerRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    const onFsChange = () => {
      const currentFs = document.fullscreenElement;
      setIsFullscreen(Boolean(currentFs && stageContainerRef.current && currentFs === stageContainerRef.current));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const handleToggleFullscreen = useCallback(() => {
    const el = stageContainerRef.current;
    if (!el) return;
    if (document.fullscreenElement === el) {
      document.exitFullscreen?.().catch(() => {});
    } else if (el.requestFullscreen) {
      el.requestFullscreen().catch(() => {});
    }
  }, []);

  const formatSubtitleTimestamp = (sec: number, format: 'srt' | 'vtt'): string => {
    const safe = Math.max(0, Number.isFinite(sec) ? sec : 0);
    const hrs = Math.floor(safe / 3600);
    const mins = Math.floor((safe % 3600) / 60);
    const secs = Math.floor(safe % 60);
    const ms = Math.round((safe - Math.floor(safe)) * 1000);
    const pad2 = (n: number) => String(n).padStart(2, '0');
    const pad3 = (n: number) => String(Math.min(999, Math.max(0, n))).padStart(3, '0');
    const sep = format === 'srt' ? ',' : '.';
    return `${pad2(hrs)}:${pad2(mins)}:${pad2(secs)}${sep}${pad3(ms)}`;
  };

  const handleExportSubtitles = (format: 'srt' | 'vtt') => {
    const lines: string[] = [];
    if (format === 'vtt') {
      lines.push('WEBVTT');
      lines.push(`NOTE ${articleTitle} (${videoLangMeta.nativeName}) — Emre Pelit Sci-Phil`);
      lines.push('');
    }
    narrationQueue.forEach((item, idx) => {
      const start = formatSubtitleTimestamp(item.startSec, format);
      const end = formatSubtitleTimestamp(Math.max(item.startSec + 1.2, item.endSec), format);
      if (format === 'srt') {
        lines.push(String(idx + 1));
      }
      lines.push(`${start} --> ${end}`);
      lines.push(item.text.trim());
      lines.push('');
    });
    const content = lines.join('\n');
    const mime = format === 'vtt' ? 'text/vtt;charset=utf-8' : 'application/x-subrip;charset=utf-8';
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${article.slug || article.id}-subtitles-${videoLang}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePlayerKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const tag = (e.target as HTMLElement | null)?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const key = e.key.toLowerCase();
    if (key === ' ' || key === 'k') {
      e.preventDefault();
      handleTogglePlay();
    } else if (key === 'f') {
      e.preventDefault();
      handleToggleFullscreen();
    } else if (key === 'm') {
      e.preventDefault();
      const next = !voiceEnabled;
      setVoiceEnabled(next);
      if (!next) {
        stopSpeechQueue();
      }
    } else if (key === 'r') {
      e.preventDefault();
      handleRestart();
    }
  };

  const watchCompletionPct = Math.min(
    100,
    Math.round(
      (Math.max(currentTime, sessionWatchedSec) / Math.max(1, effectiveTotalDurationSec)) * 100
    )
  );

  return (
    <div
      ref={stageContainerRef}
      tabIndex={0}
      onKeyDown={handlePlayerKeyDown}
      aria-label={`${ui.videoTitlePrefix}: ${articleTitle} (Space: Oynat/Duraklat, F: Tam Ekran, M: Ses, R: Başa Sar)`}
      className="bg-[#0F172A] text-slate-100 border border-slate-700 rounded-sm overflow-hidden focus:outline-none focus:ring-2 focus:ring-emerald-400/70"
    >
      {/* Compact Video Header + Inline 12-Language Switcher */}
      <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2 min-w-0">
          <Film className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-bold text-emerald-300 truncate">
            {ui.videoTitlePrefix}: {articleTitle}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-300 shrink-0 tabular-nums">
          {/* 12-Language Video & Voice Selector */}
          <label className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-slate-900 border border-sky-500/50 rounded-xs text-[10px]">
            <Globe className="w-3 h-3 text-sky-400 shrink-0" />
            <span className="text-sky-200 hidden sm:inline">{ui.videoLangLabel}:</span>
            <select
              aria-label={ui.videoLangLabel}
              value={videoLang}
              onChange={(e) => handleVideoLanguageSwitch(e.target.value as LanguageCode)}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
            >
              {WORLD_LANGUAGES.map((wl) => (
                <option key={wl.code} value={wl.code} className="bg-slate-900 text-slate-100">
                  {wl.shortLabel} · {wl.nativeName}
                </option>
              ))}
            </select>
          </label>

          <span className="px-2 py-0.5 bg-cyan-950/90 border border-cyan-500/50 text-cyan-200 rounded-xs text-[10px] font-bold">
            {voiceProfile.stageLabels.viewsLabel}:{' '}
            {(articleVideoStats?.plays || 0).toLocaleString('tr-TR')} ·{' '}
            {formatMmSs(Math.min(effectiveTotalDurationSec, sessionWatchedSec))} / ~
            {formatMmSs(effectiveTotalDurationSec)} (%{watchCompletionPct})
          </span>

          <span className="px-2 py-0.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 rounded-xs text-[10px] font-bold">
            ~{formatMmSs(effectiveTotalDurationSec)} · {scenes.length}{' '}
            {voiceProfile.stageLabels.chapterPrefix} · {ui.durationAutoBadge}
          </span>

          <span
            title={getSymbolicFigureKvkkNotice(videoLang)}
            className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 border border-emerald-400/70 text-emerald-300 shrink-0"
            aria-label={getSymbolicFigureKvkkNotice(videoLang)}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" aria-hidden="true">
              <circle cx="12" cy="7.5" r="3.2" fill="#FDE68A" />
              <path d="M6.5 19.5C7 15.2 9.2 13 12 13C14.8 13 17 15.2 17.5 19.5" stroke="#38BDF8" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </span>
        </div>
      </div>

      {/* Everyday-Life Story Plot & Symbolic Figure KVKK/GDPR Strip */}
      <div className="px-4 py-1.5 bg-slate-950/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-slate-300">
        <span>
          <strong className="text-amber-300">
            {videoLang === 'tr' ? 'Olay Kurgusu:' : 'Story Plot:'}
          </strong>{' '}
          {getEverydayStoryProfile(article.simulation?.type || 'consciousness', videoLang).storyTitle}
          {' · '}
          <span className="text-sky-300">
            {getEverydayStoryProfile(article.simulation?.type || 'consciousness', videoLang).objectsSummary}
          </span>
        </span>
        <span className="text-emerald-300">{getSymbolicFigureKvkkNotice(videoLang)}</span>
      </div>

      {/* Purely Synthetic Cultural Voice & User-Controlled Intonation Strip */}
      <div className="px-4 py-2 bg-slate-900/95 border-b border-slate-800 space-y-2 text-[11px] font-mono">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            <span className="inline-flex items-center gap-1.5 text-amber-300 font-bold">
              <Mic className="w-3.5 h-3.5 shrink-0" />
              <span>{ui.culturalNarratorLabel}:</span>
            </span>
            <div className="inline-flex items-center bg-slate-950 border border-slate-700 rounded-xs p-0.5">
              {voiceProfile.personas.map((p, idx) => {
                const selected = personaIndex === idx;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setPersonaIndex(idx as 0 | 1);
                      setManualVoiceUri('');
                    }}
                    className={`px-2 py-0.5 text-[10px] rounded-xs transition-colors cursor-pointer ${
                      selected
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'text-slate-300 hover:text-white'
                    }`}
                    title={`${p.roleTitleNative} — ${p.cadenceNote}`}
                  >
                    {p.name}
                  </button>
                );
              })}
            </div>
            <span className="px-1.5 py-0.5 bg-slate-950 border border-emerald-500/40 text-emerald-300 text-[9px] rounded-xs">
              {intonationUi.syntheticBadge}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isTranslating && (
              <span className="inline-flex items-center gap-1 text-[10px] text-amber-300">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>{ui.translatingBadge}</span>
              </span>
            )}

            <button
              type="button"
              onClick={() => setShowIntonationPanel((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] rounded-xs border transition-colors cursor-pointer ${
                showIntonationPanel
                  ? 'bg-sky-500/20 border-sky-400 text-sky-200 font-bold'
                  : 'bg-slate-950 border-slate-700 text-slate-200 hover:border-sky-400/60'
              }`}
            >
              <Sliders className="w-3 h-3 text-sky-400 shrink-0" />
              <span>{intonationUi.panelTitle}</span>
            </button>

            {selectedVoiceInfo.availableVoicesForLang.length > 0 ? (
              <label className="inline-flex items-center gap-1.5 text-[10px] text-slate-300">
                <UserCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                <select
                  aria-label={ui.voiceSelectLabel}
                  value={manualVoiceUri || selectedVoiceInfo.voice?.voiceURI || ''}
                  onChange={(e) => setManualVoiceUri(e.target.value)}
                  className="bg-slate-950 border border-slate-700 text-slate-200 px-1.5 py-0.5 rounded-xs max-w-[180px] truncate cursor-pointer"
                >
                  {selectedVoiceInfo.availableVoicesForLang.map((v) => (
                    <option key={v.voiceURI} value={v.voiceURI}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <span className="text-[10px] text-slate-400">
                {voiceProfile.bcp47} · {activePersona.name}
              </span>
            )}
          </div>
        </div>

        {/* User-Controlled Speech Intonation Studio (Presets + Pitch / Rate / Pause / Volume) */}
        {showIntonationPanel && (
          <div
            dir={voiceProfile.dir}
            className="p-2.5 bg-slate-950 border border-sky-500/35 rounded-xs space-y-2.5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] text-sky-300 font-bold mr-1">
                  {intonationUi.presetLabel}:
                </span>
                {INTONATION_PRESETS.map((preset) => {
                  const isActive = userIntonation.presetId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() =>
                        updateUserIntonation({
                          presetId: preset.id,
                          pitch: preset.pitch,
                          rate: preset.rate,
                          pauseScale: preset.pauseScale,
                          volume: preset.volume,
                        })
                      }
                      className={`px-2 py-0.5 text-[10px] rounded-xs border transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-sky-500 text-slate-950 border-sky-400 font-bold'
                          : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
                      }`}
                    >
                      {preset.labels[videoLang] || preset.labels.en}
                    </button>
                  );
                })}
                {userIntonation.presetId === 'custom' && (
                  <span className="px-1.5 py-0.5 text-[9px] bg-amber-500/20 border border-amber-400/50 text-amber-200 rounded-xs">
                    {intonationUi.customTag}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => updateUserIntonation({ ...DEFAULT_USER_INTONATION })}
                className="px-2 py-0.5 text-[10px] bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xs cursor-pointer"
              >
                {intonationUi.resetBtn}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-[10px]">
              <label className="space-y-1 block">
                <div className="flex items-center justify-between text-slate-300 tabular-nums">
                  <span>{intonationUi.pitchLabel}</span>
                  <span className="text-sky-300 font-bold">{userIntonation.pitch.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min={0.7}
                  max={1.35}
                  step={0.02}
                  value={userIntonation.pitch}
                  onChange={(e) =>
                    updateUserIntonation({
                      ...userIntonation,
                      presetId: 'custom',
                      pitch: Number(e.target.value),
                    })
                  }
                  className="w-full accent-sky-400 cursor-pointer h-1.5 bg-slate-800 rounded-xs"
                />
              </label>

              <label className="space-y-1 block">
                <div className="flex items-center justify-between text-slate-300 tabular-nums">
                  <span>{intonationUi.rateLabel}</span>
                  <span className="text-emerald-300 font-bold">{userIntonation.rate.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min={0.7}
                  max={1.75}
                  step={0.05}
                  value={userIntonation.rate}
                  onChange={(e) =>
                    updateUserIntonation({
                      ...userIntonation,
                      presetId: 'custom',
                      rate: Number(e.target.value),
                    })
                  }
                  className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-slate-800 rounded-xs"
                />
              </label>

              <label className="space-y-1 block">
                <div className="flex items-center justify-between text-slate-300 tabular-nums">
                  <span>{intonationUi.pauseLabel}</span>
                  <span className="text-amber-300 font-bold">
                    {userIntonation.pauseScale.toFixed(2)}x
                  </span>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={1.8}
                  step={0.05}
                  value={userIntonation.pauseScale}
                  onChange={(e) =>
                    updateUserIntonation({
                      ...userIntonation,
                      presetId: 'custom',
                      pauseScale: Number(e.target.value),
                    })
                  }
                  className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-xs"
                />
              </label>

              <label className="space-y-1 block">
                <div className="flex items-center justify-between text-slate-300 tabular-nums">
                  <span>{intonationUi.volumeLabel}</span>
                  <span className="text-cyan-300 font-bold">
                    {Math.round(userIntonation.volume * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0.2}
                  max={1.0}
                  step={0.05}
                  value={userIntonation.volume}
                  onChange={(e) =>
                    updateUserIntonation({
                      ...userIntonation,
                      presetId: 'custom',
                      volume: Number(e.target.value),
                    })
                  }
                  className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-xs"
                />
              </label>
            </div>

            <div className="text-[10px] font-sans text-slate-400 leading-snug">
              {intonationUi.zeroLiabilityVoiceDisclaimer}
            </div>
          </div>
        )}
      </div>

      {/* 16:9 HTML5 Interactive Animated-Entity Video Stage */}
      <div className="relative bg-[#060B17]">
        <canvas
          ref={canvasRef}
          width={960}
          height={540}
          onClick={handleCanvasStageClick}
          className="w-full h-auto block aspect-[16/9] cursor-crosshair"
          aria-label={`${ui.videoTitlePrefix} - ${articleTitle}`}
        />

        {!isPlaying && (
          <button
            type="button"
            onClick={handleTogglePlay}
            aria-label={ui.playBtn}
            className="absolute inset-0 flex items-center justify-center bg-slate-950/25 hover:bg-slate-950/10 transition-colors cursor-pointer group"
          >
            <span className="inline-flex items-center gap-2.5 px-5 py-3 bg-emerald-500 group-hover:bg-emerald-400 text-slate-950 font-mono text-xs sm:text-sm font-extrabold rounded-sm shadow-lg transition-transform group-hover:scale-105">
              <Play className="w-4 h-4 fill-current" />
              <span>
                {ui.playBtn} (~{formatMmSs(effectiveTotalDurationSec)} · {videoLangMeta.shortLabel}{' '}
                · {activePersona.name})
              </span>
            </span>
          </button>
        )}
      </div>

      {/* Interactive Player Controls + Speaker-Synced Timeline Scrubber */}
      <div className="p-3.5 bg-slate-900 border-t border-slate-800 space-y-3 font-mono text-xs">
        {/* Live Entity Interaction Explainer Bar */}
        <div
          dir={voiceProfile.dir}
          className="px-3 py-2 bg-slate-950/90 border border-sky-500/30 rounded-xs flex flex-wrap items-center justify-between gap-2 text-[11px]"
        >
          <div className="flex items-start gap-2 min-w-0">
            <Sparkles className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
            <div className="font-sans text-slate-200 leading-snug">
              <strong className="font-mono text-sky-300 mr-1.5">
                [{formatMmSs(activeScene.startSec)}–{formatMmSs(activeScene.endSec)}]
              </strong>
              <span>{activeScene.entityStoryBeat}</span>
            </div>
          </div>
          <span className="text-[10px] text-emerald-300/90 shrink-0">
            {voiceProfile.stageLabels.clickTip}
          </span>
        </div>

        {/* Dynamic Speaker-Synced Timeline Scrubber (No Fixed Duration Cap) */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] tabular-nums text-slate-300">
            <span className="text-emerald-300 font-bold truncate">
              {activeScene.heading} · ({activeQueueIndex + 1}/{Math.max(1, narrationQueue.length)})
            </span>
            <span className="shrink-0 ml-2">
              {formatMmSs(currentTime)} / ~{formatMmSs(effectiveTotalDurationSec)}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={totalEstimatedDurationSec}
            step={0.5}
            value={Math.min(currentTime, totalEstimatedDurationSec)}
            aria-label={ui.durationAutoBadge}
            onChange={(e) => handleTimelineScrub(Number(e.target.value))}
            className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-slate-800 rounded-xs"
          />
        </div>

        {/* Transport & Accessibility Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={handleTogglePlay}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xs cursor-pointer transition-colors"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? ui.pauseBtn : ui.playBtn}</span>
            </button>

            <button
              type="button"
              onClick={handleRestart}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xs cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{ui.restartBtn}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const next = !voiceEnabled;
                setVoiceEnabled(next);
                if (!next) {
                  stopSpeechQueue();
                }
              }}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 border rounded-xs cursor-pointer transition-colors ${
                voiceEnabled
                  ? 'bg-sky-500/20 border-sky-400 text-sky-200 font-bold'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {voiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{voiceEnabled ? ui.voiceOnBtn : ui.voiceOffBtn}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowScript((p) => !p)}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 border rounded-xs cursor-pointer transition-colors ${
                showScript
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold'
                  : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>
                {ui.scriptToggleBtn} ({narrationQueue.length})
              </span>
            </button>

            <button
              type="button"
              onClick={handleExportWebm}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 border rounded-xs cursor-pointer transition-colors ${
                isRecording
                  ? 'bg-amber-950 hover:bg-amber-900 text-amber-200 border-amber-400'
                  : 'bg-slate-800 hover:bg-slate-700 text-emerald-300 border-emerald-500/40'
              }`}
            >
              {isRecording ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>{isRecording ? ui.stopRecordingBtn : ui.exportWebmBtn}</span>
            </button>

            <button
              type="button"
              onClick={() => handleExportSubtitles('srt')}
              title={`${videoLangMeta.nativeName} (.SRT) altyazı dosyasını indir`}
              className="inline-flex items-center gap-1 px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-500/40 rounded-xs cursor-pointer transition-colors"
            >
              <Subtitles className="w-3.5 h-3.5" />
              <span>.SRT ({videoLangMeta.shortLabel})</span>
            </button>

            <button
              type="button"
              onClick={() => handleExportSubtitles('vtt')}
              title={`${videoLangMeta.nativeName} (.VTT) web altyazı dosyasını indir`}
              className="inline-flex items-center gap-1 px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 rounded-xs cursor-pointer transition-colors"
            >
              <Subtitles className="w-3.5 h-3.5" />
              <span>.VTT</span>
            </button>

            <button
              type="button"
              onClick={handleToggleFullscreen}
              title={isFullscreen ? 'Tam ekrandan çık (F)' : 'Tam ekran (F)'}
              aria-label={isFullscreen ? 'Tam ekrandan çık' : 'Tam ekran'}
              className="inline-flex items-center gap-1 px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xs cursor-pointer transition-colors"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isFullscreen ? 'Çık' : 'Tam Ekran'}</span>
            </button>

            <span
              className="hidden xl:inline-flex items-center px-2 py-1 bg-slate-950 border border-slate-800 text-slate-400 text-[10px] rounded-xs"
              title="Klavye kısayolları: Space (Oynat/Duraklat), F (Tam Ekran), M (Ses), R (Başa Sar)"
            >
              Kısayol: Space · F · M · R
            </span>

            {recordingModeNote && (
              <span className="px-2 py-1 bg-amber-950/70 border border-amber-500/40 text-amber-200 text-[10px] rounded-xs">
                {recordingModeNote}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 tabular-nums">
            <select
              aria-label="Video oynatma hızı"
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(Number(e.target.value) as 1 | 1.25 | 1.5 | 2)}
              className="px-2 py-1 bg-slate-950 border border-slate-700 text-slate-200 rounded-xs cursor-pointer"
            >
              <option value={1}>1.0x</option>
              <option value={1.25}>1.25x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2.0x</option>
            </select>
          </div>
        </div>

        {/* Interactive Comprehensive-Summary Chapter Jump Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {scenes.map((sc) => {
            const active = activeScene.index === sc.index;
            return (
              <button
                key={sc.index}
                type="button"
                onClick={() => handleJumpToChapter(sc.index)}
                className={`px-2 py-1.5 text-left text-[10px] rounded-xs border transition-colors cursor-pointer truncate ${
                  active
                    ? 'bg-emerald-950 border-emerald-400 text-emerald-200 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
                title={`${formatMmSs(sc.startSec)}–${formatMmSs(sc.endSec)} · ${sc.heading}`}
              >
                {formatMmSs(sc.startSec)} · {sc.heading}
              </button>
            );
          })}
        </div>

        {/* Historical Scientists' Perspectives Strip (Symbolic Initials Medallions Only — Zero Real-Person Photos) */}
        <div
          dir={voiceProfile.dir}
          className="bg-slate-950/90 border border-amber-500/30 rounded-xs p-3 space-y-2.5"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-amber-300 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{videoBundle.historicalScientists.sectionTitle}</span>
            </div>
            <button
              type="button"
              onClick={() => handleJumpToChapter(1)}
              className="px-2 py-0.5 text-[10px] font-mono bg-amber-500/15 hover:bg-amber-500/25 text-amber-200 border border-amber-500/40 rounded-xs cursor-pointer transition-colors"
            >
              {videoLang === 'tr' ? '▶ Videoda Dinle (Bölüm 2)' : '▶ Listen in Video (Ch. 2)'}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {videoBundle.historicalScientists.thinkers.map((thinker) => (
              <div
                key={thinker.name}
                className="p-2.5 bg-slate-900/90 border border-slate-800 rounded-xs space-y-1.5"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center font-mono text-[10px] font-extrabold text-slate-950 shrink-0"
                    style={{ backgroundColor: thinker.accentColor }}
                    aria-hidden="true"
                  >
                    {thinker.monogram}
                  </span>
                  <div className="min-w-0">
                    <div className="text-[11px] font-sans font-bold text-slate-100 truncate">
                      {thinker.name}
                    </div>
                    <div className="text-[9.5px] font-mono text-slate-400">{thinker.era}</div>
                  </div>
                </div>
                <p className="text-[11px] font-sans text-slate-300 leading-relaxed">
                  {thinker.coreThought}
                </p>
                <p className="text-[10px] font-sans text-emerald-300/90 leading-snug border-t border-slate-800 pt-1">
                  {thinker.bridgeToArticle}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Expandable Full Comprehensive Summary & Synchronized Click-to-Jump Sentence Script */}
        {showScript && (
          <div
            dir={voiceProfile.dir}
            className="bg-slate-950 border border-slate-800 p-3 rounded-xs space-y-3 max-h-72 overflow-y-auto text-[11px] font-sans text-slate-200"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800 text-[10px] font-mono text-slate-400">
              <span>
                {voiceProfile.stageLabels.summaryBadge} · {videoLangMeta.nativeName} ·{' '}
                {activePersona.name}
              </span>
              <span>
                {videoBundle.totalWords} · {narrationQueue.length} · ~
                {formatMmSs(effectiveTotalDurationSec)}
              </span>
            </div>

            {scenes.map((sc) => {
              const sceneItems = narrationQueue.filter((q) => q.sceneIndex === sc.index);
              return (
                <div
                  key={`script-${sc.index}`}
                  className="border-b border-slate-800/80 last:border-0 pb-2.5 last:pb-0 space-y-1.5"
                >
                  <div className="font-mono font-bold text-cyan-300 text-[10px] flex items-center justify-between gap-2">
                    <span>
                      [{formatMmSs(sc.startSec)}–{formatMmSs(sc.endSec)}] {sc.heading}
                    </span>
                    <span className="text-slate-500">~{sc.estimatedDurationSec}s</span>
                  </div>
                  <div className="text-emerald-300/90 text-[10px] font-mono">
                    ⚡ {sc.entityStoryBeat}
                  </div>
                  <div className="space-y-1">
                    {sceneItems.map((qItem) => {
                      const isCurrentSentence = qItem.globalIndex === activeQueueIndex;
                      return (
                        <button
                          key={`sent-${qItem.globalIndex}`}
                          ref={isCurrentSentence ? activeSentenceBtnRef : null}
                          type="button"
                          onClick={() => jumpToQueueIndex(qItem.globalIndex, true)}
                          className={`w-full text-start px-2 py-1 rounded-xs leading-relaxed transition-colors cursor-pointer block ${
                            isCurrentSentence
                              ? 'bg-emerald-500/20 border-l-2 border-emerald-400 text-white font-semibold'
                              : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                          }`}
                        >
                          <span className="font-mono text-[9px] text-slate-500 mr-1.5">
                            [{formatMmSs(qItem.startSec)}]
                          </span>
                          {qItem.text}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Explicit Zero-Liability Educational & Freedom of Thought Notice */}
        <div
          dir={voiceProfile.dir}
          className="flex items-start gap-2 pt-1 text-[10px] text-slate-400 font-sans leading-relaxed"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
          <span>{ui.legalAndFreedomNote}</span>
        </div>
      </div>
    </div>
  );
};
