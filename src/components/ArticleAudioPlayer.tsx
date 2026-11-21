import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  Volume2,
  Square,
  Pause,
  Play,
  Download,
  Loader2,
  FileText,
  Globe,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Sliders,
  ShieldCheck,
} from 'lucide-react';
import { Article, LanguageCode } from '../types';
import {
  UI_TEXT,
  WORLD_LANGUAGES,
  getLanguageMeta,
  getLocalizedText,
  getLocalizedArray,
} from '../i18n/translations';
import { getOptimalVoiceProfileForArticle } from '../utils/articleAnalysisEngine';
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

interface ArticleAudioPlayerProps {
  article: Article;
  language: LanguageCode;
  voicePersona: 'Kore' | 'Charon' | 'Fenrir' | 'Puck' | 'Zephyr';
  compact?: boolean;
  onAudioMeasured?: (articleId: string, minutesDelta: number) => void;
}

interface TranscriptSegment {
  index: number;
  sectionLabel: string;
  isSectionStart: boolean;
  text: string;
  startChar: number;
  endChar: number;
}

export const ArticleAudioPlayer: React.FC<ArticleAudioPlayerProps> = ({
  article,
  language,
  voicePersona,
  compact = false,
  onAudioMeasured,
}) => {
  const [audioLang, setAudioLang] = useState<LanguageCode>(language);
  const [culturalPersonaIndex, setCulturalPersonaIndex] = useState<0 | 1>(0);
  const [browserVoices, setBrowserVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'playing' | 'paused'>('idle');
  const [scope, setScope] = useState<'full' | 'abstract'>('full');
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0);
  const [wavDataUrl, setWavDataUrl] = useState<string | null>(null);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number>(0);
  const [showTranscript, setShowTranscript] = useState<boolean>(!compact);
  const [showIntonationPanel, setShowIntonationPanel] = useState<boolean>(false);
  const [userIntonation, setUserIntonation] = useState<UserIntonationConfig>(() =>
    loadUserIntonationConfig()
  );
  const [dynamicTranslations, setDynamicTranslations] = useState<
    Partial<
      Record<
        LanguageCode,
        {
          title: string;
          subtitle: string;
          abstract: string;
          keyFindings: string[];
          contentParagraphs: string[];
          methodologyNote: string;
        }
      >
    >
  >({});

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const activeSentenceRef = useRef<HTMLButtonElement | null>(null);
  const queueTimerRef = useRef<number | null>(null);
  const speakDelayRef = useRef<number | null>(null);
  const utteranceWatchdogRef = useRef<number | null>(null);
  const utteranceHeartbeatRef = useRef<number | null>(null);
  const speakSessionIdRef = useRef<number>(0);
  const isPlayingQueueRef = useRef<boolean>(false);
  const currentSegmentIndexRef = useRef<number>(0);

  const updateUserIntonation = useCallback((next: UserIntonationConfig) => {
    setUserIntonation(next);
    saveUserIntonationConfig(next);
  }, []);

  const t = UI_TEXT[language].article;
  const audioLangMeta = getLanguageMeta(audioLang);
  const intonationUi = useMemo(() => getLocalizedIntonationLabels(audioLang), [audioLang]);

  // Content-matched prosody & purely synthetic cultural acoustic profile tailored to the article & chosen language
  const voiceProfile = useMemo(
    () => getOptimalVoiceProfileForArticle(article, audioLang),
    [article, audioLang]
  );
  const culturalProfile = useMemo(() => getCulturalVoiceProfile(audioLang), [audioLang]);
  const activeCulturalPersona =
    culturalProfile.personas[culturalPersonaIndex] || culturalProfile.personas[0];

  const effectiveVoicePersona =
    activeCulturalPersona.geminiVoiceFallback || voiceProfile.persona || voicePersona;
  const effectiveSpeechRate = Number(
    Math.min(
      2.0,
      Math.max(
        0.55,
        ((voiceProfile.recommendedRate + activeCulturalPersona.rateMultiplier) / 2) *
          userIntonation.rate *
          speedMultiplier
      )
    ).toFixed(2)
  );

  const clearAudioGuards = useCallback(() => {
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

  const stopNarration = useCallback(() => {
    speakSessionIdRef.current += 1;
    isPlayingQueueRef.current = false;
    if (typeof window !== 'undefined') {
      if (queueTimerRef.current !== null) {
        window.clearTimeout(queueTimerRef.current);
        queueTimerRef.current = null;
      }
      if (speakDelayRef.current !== null) {
        window.clearTimeout(speakDelayRef.current);
        speakDelayRef.current = null;
      }
    }
    clearAudioGuards();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    setStatus('idle');
    setProgressPercent(0);
    setActiveSentenceIndex(0);
    currentSegmentIndexRef.current = 0;
  }, [clearAudioGuards]);

  // Sync audio language when site language changes
  useEffect(() => {
    stopNarration();
    setAudioLang(language);
  }, [language, stopNarration]);

  // Warm up browser voices
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const warmVoices = () => {
      try {
        const list = window.speechSynthesis.getVoices();
        if (list && list.length > 0) setBrowserVoices(list);
      } catch {}
    };
    warmVoices();
    window.speechSynthesis.addEventListener?.('voiceschanged', warmVoices);
    return () => {
      window.speechSynthesis.removeEventListener?.('voiceschanged', warmVoices);
    };
  }, []);

  useEffect(() => {
    if (status !== 'playing' || typeof window === 'undefined') return;
    // Only recover accidental browser pause — NEVER call pause() mid-utterance
    const recoveryId = window.setInterval(() => {
      if (isPlayingQueueRef.current && 'speechSynthesis' in window && window.speechSynthesis.paused) {
        try {
          window.speechSynthesis.resume();
        } catch {}
      }
    }, 2500);
    const minuteMeterId = window.setInterval(() => {
      onAudioMeasured?.(article.id, 1);
    }, 60000);
    return () => {
      window.clearInterval(recoveryId);
      window.clearInterval(minuteMeterId);
    };
  }, [status, article.id, onAudioMeasured]);

  useEffect(() => {
    return () => {
      speakSessionIdRef.current += 1;
      isPlayingQueueRef.current = false;
      if (typeof window !== 'undefined') {
        if (queueTimerRef.current !== null) window.clearTimeout(queueTimerRef.current);
        if (speakDelayRef.current !== null) window.clearTimeout(speakDelayRef.current);
      }
      clearAudioGuards();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
        } catch {}
      }
    };
  }, [clearAudioGuards]);

  // Resolve localized content in the chosen audio language (from native bundle or dynamic AI translation cache)
  const resolvedContent = useMemo(() => {
    const cached = dynamicTranslations[audioLang];
    if (cached) {
      return cached;
    }
    return {
      title: getLocalizedText(article.title, audioLang),
      subtitle: getLocalizedText(article.subtitle, audioLang),
      abstract: getLocalizedText(article.abstract, audioLang),
      keyFindings: getLocalizedArray(article.keyFindings, audioLang),
      contentParagraphs: getLocalizedArray(article.contentParagraphs, audioLang),
      methodologyNote: getLocalizedText(article.simulation.methodologyNote, audioLang),
    };
  }, [article, audioLang, dynamicTranslations]);

  const buildTranscriptSegments = useCallback(
    (
      content: {
        title: string;
        subtitle: string;
        abstract: string;
        keyFindings: string[];
        contentParagraphs: string[];
        methodologyNote: string;
      },
      targetScope: 'full' | 'abstract',
      targetLangCode: LanguageCode
    ): TranscriptSegment[] => {
      const isTr = targetLangCode === 'tr';
      const rawItems: { sectionLabel: string; isSectionStart: boolean; text: string }[] = [
        {
          sectionLabel: isTr ? 'BAŞLIK & KÜNYE' : 'TITLE & METADATA',
          isSectionStart: true,
          text: isTr
            ? `${content.title}. ${content.subtitle}. Münhasır Yazar ve Eser Sahibi: Emre Pelit. Disiplin: ${article.category}.`
            : `${content.title}. ${content.subtitle}. Author: Emre Pelit. Category: ${article.category}.`,
        },
      ];

      const splitIntoSentences = (paragraph: string): string[] => {
        const cleaned = paragraph.replace(/\s+/g, ' ').trim();
        if (!cleaned) return [];
        const matches = cleaned.match(/[^.!?。！？]+[.!?。！？]+|\S+/g);
        return matches ? matches.map((s) => s.trim()).filter(Boolean) : [cleaned];
      };

      splitIntoSentences(content.abstract).forEach((s, idx) => {
        rawItems.push({
          sectionLabel: isTr ? 'ÖZET' : 'ABSTRACT',
          isSectionStart: idx === 0,
          text: s,
        });
      });

      if (targetScope === 'full') {
        content.keyFindings.forEach((finding, fIdx) => {
          rawItems.push({
            sectionLabel: isTr ? `BULGU ${fIdx + 1}` : `FINDING ${fIdx + 1}`,
            isSectionStart: fIdx === 0,
            text: isTr
              ? `Temel Bulgu ${fIdx + 1}: ${finding}`
              : `Key Finding ${fIdx + 1}: ${finding}`,
          });
        });

        content.contentParagraphs.forEach((para, pIdx) => {
          splitIntoSentences(para).forEach((s, sIdx) => {
            rawItems.push({
              sectionLabel: isTr ? `BÖLÜM ${pIdx + 1}` : `SECTION ${pIdx + 1}`,
              isSectionStart: sIdx === 0,
              text: s,
            });
          });
        });

        if (content.methodologyNote) {
          splitIntoSentences(content.methodologyNote).forEach((s, mIdx) => {
            rawItems.push({
              sectionLabel: isTr ? 'SİMÜLASYON' : 'SIMULATION',
              isSectionStart: mIdx === 0,
              text: s,
            });
          });
        }

        rawItems.push({
          sectionLabel: isTr ? 'SONUÇ & TELİF' : 'CONCLUSION',
          isSectionStart: true,
          text: isTr
            ? `Bu makalenin tamamı Emre Pelit tarafından kaleme alınmış olup tüm bilimsel ve felsefi telif hakları münhasıran Emre Pelit'e aittir.`
            : `This complete monograph is authored exclusively by Emre Pelit. All rights reserved.`,
        });
      }

      let cursor = 0;
      return rawItems.map((item, idx) => {
        const startChar = cursor;
        const endChar = startChar + item.text.length;
        cursor = endChar + 1;
        return {
          index: idx,
          sectionLabel: item.sectionLabel,
          isSectionStart: item.isSectionStart,
          text: item.text,
          startChar,
          endChar,
        };
      });
    },
    [article.category]
  );

  // Split entire article into sentence-level synchronized transcript segments (Title + Abstract + Key Findings + All Body Paragraphs + Simulation Model + References)
  const transcriptSegments = useMemo<TranscriptSegment[]>(
    () => buildTranscriptSegments(resolvedContent, scope, audioLang),
    [buildTranscriptSegments, resolvedContent, scope, audioLang]
  );

  // Auto-scroll active sentence inside transcript box while playing
  useEffect(() => {
    if (status === 'playing' && activeSentenceRef.current) {
      activeSentenceRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [activeSentenceIndex, status]);

  const ensureLanguageContent = async (targetLang: LanguageCode) => {
    const hasNative = Boolean(article.title[targetLang] && article.abstract[targetLang]);
    if (hasNative || dynamicTranslations[targetLang]) {
      return {
        title: dynamicTranslations[targetLang]?.title || getLocalizedText(article.title, targetLang),
        subtitle:
          dynamicTranslations[targetLang]?.subtitle || getLocalizedText(article.subtitle, targetLang),
        abstract:
          dynamicTranslations[targetLang]?.abstract || getLocalizedText(article.abstract, targetLang),
        keyFindings:
          dynamicTranslations[targetLang]?.keyFindings ||
          getLocalizedArray(article.keyFindings, targetLang),
        contentParagraphs:
          dynamicTranslations[targetLang]?.contentParagraphs ||
          getLocalizedArray(article.contentParagraphs, targetLang),
        methodologyNote:
          dynamicTranslations[targetLang]?.methodologyNote ||
          getLocalizedText(article.simulation.methodologyNote, targetLang),
      };
    }

    try {
      const res = await fetch('/api/ai/translate-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: getLocalizedText(article.title, 'tr'),
          subtitle: getLocalizedText(article.subtitle, 'tr'),
          abstract: getLocalizedText(article.abstract, 'tr'),
          keyFindings: getLocalizedArray(article.keyFindings, 'tr'),
          contentParagraphs: getLocalizedArray(article.contentParagraphs, 'tr'),
          targetLanguage: targetLang,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const bundle = {
          title: data.title || getLocalizedText(article.title, targetLang),
          subtitle: data.subtitle || getLocalizedText(article.subtitle, targetLang),
          abstract: data.abstract || getLocalizedText(article.abstract, targetLang),
          keyFindings: data.keyFindings || getLocalizedArray(article.keyFindings, targetLang),
          contentParagraphs:
            data.contentParagraphs || getLocalizedArray(article.contentParagraphs, targetLang),
          methodologyNote: getLocalizedText(article.simulation.methodologyNote, targetLang),
        };
        setDynamicTranslations((prev) => ({ ...prev, [targetLang]: bundle }));
        return bundle;
      }
    } catch {
      // Fallback to resolved content
    }
    return resolvedContent;
  };

  /**
   * Uninterrupted sequential narration engine: normalizes all alphanumeric codes, equations, symbols,
   * and unicode characters into natural spoken sub-chunks with post-cancel settling delay, silent-drop
   * heartbeat recovery, and automatic plain-text fallback retry so narration never stalls.
   */
  const speakSegmentQueue = useCallback(
    (segmentsList: TranscriptSegment[], startIdx: number, targetLangCode: LanguageCode) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        setStatus('idle');
        return;
      }

      speakSessionIdRef.current += 1;
      const mySessionId = speakSessionIdRef.current;

      if (queueTimerRef.current !== null) {
        window.clearTimeout(queueTimerRef.current);
        queueTimerRef.current = null;
      }
      if (speakDelayRef.current !== null) {
        window.clearTimeout(speakDelayRef.current);
        speakDelayRef.current = null;
      }
      clearAudioGuards();

      try {
        window.speechSynthesis.cancel();
      } catch {}

      if (startIdx >= segmentsList.length) {
        isPlayingQueueRef.current = false;
        setStatus('idle');
        setProgressPercent(100);
        return;
      }

      isPlayingQueueRef.current = true;
      setStatus('playing');
      setShowTranscript(true);

      const targetCultural = getCulturalVoiceProfile(targetLangCode);
      const targetPersona =
        targetCultural.personas[culturalPersonaIndex] || targetCultural.personas[0];

      const speakSegAt = (segIdx: number) => {
        if (!isPlayingQueueRef.current || speakSessionIdRef.current !== mySessionId) return;
        if (segIdx >= segmentsList.length) {
          isPlayingQueueRef.current = false;
          clearAudioGuards();
          setStatus('idle');
          setProgressPercent(100);
          return;
        }

        currentSegmentIndexRef.current = segIdx;
        setActiveSentenceIndex(segIdx);
        const totalCount = Math.max(1, segmentsList.length);
        setProgressPercent(Math.min(99, Math.round((segIdx / totalCount) * 100)));

        const currentSeg = segmentsList[segIdx];
        const subChunks = splitSafeUtteranceChunks(currentSeg.text, targetLangCode);

        const advanceToNextSeg = () => {
          if (!isPlayingQueueRef.current || speakSessionIdRef.current !== mySessionId) return;
          clearAudioGuards();
          const nextIdx = segIdx + 1;
          if (nextIdx >= segmentsList.length) {
            speakSegAt(nextIdx);
            return;
          }
          const nextSeg = segmentsList[nextIdx];
          const pauseMs = Math.max(
            85,
            Math.min(
              1800,
              Math.round(
                (nextSeg.isSectionStart
                  ? voiceProfile.sectionPauseMs
                  : voiceProfile.sentencePauseMs) * userIntonation.pauseScale
              )
            )
          );
          queueTimerRef.current = window.setTimeout(() => {
            if (isPlayingQueueRef.current && speakSessionIdRef.current === mySessionId) {
              speakSegAt(nextIdx);
            }
          }, pauseMs);
        };

        if (subChunks.length === 0) {
          queueTimerRef.current = window.setTimeout(advanceToNextSeg, 50);
          return;
        }

        const speakSub = (subIdx: number, attempt: number) => {
          if (!isPlayingQueueRef.current || speakSessionIdRef.current !== mySessionId) return;
          if (subIdx >= subChunks.length) {
            advanceToNextSeg();
            return;
          }
          clearAudioGuards();

          const spokenText =
            attempt === 0 ? subChunks[subIdx] : toPlainSpokenFallback(subChunks[subIdx]);
          if (!spokenText) {
            speakSub(subIdx + 1, 0);
            return;
          }

          const effectiveRate = Number(
            Math.min(
              2.0,
              Math.max(0.55, targetPersona.rateMultiplier * userIntonation.rate * speedMultiplier)
            ).toFixed(2)
          );

          const utterance = new SpeechSynthesisUtterance(spokenText);
          utterance.lang = targetCultural.bcp47;
          utterance.rate = effectiveRate;
          utterance.pitch = Number(
            Math.min(1.8, Math.max(0.5, targetPersona.pitch * userIntonation.pitch)).toFixed(2)
          );
          utterance.volume = Math.min(1.0, Math.max(0.15, userIntonation.volume));

          if (attempt === 0) {
            const voices =
              browserVoices.length > 0 ? browserVoices : window.speechSynthesis.getVoices();
            const culturalPick = selectBestCulturalVoice(
              voices,
              targetLangCode,
              culturalPersonaIndex
            );
            if (culturalPick.voice) {
              utterance.voice = culturalPick.voice;
            }
          }

          let settled = false;
          let hasStarted = false;
          let quietAfterStart = 0;
          let quietBeforeStart = 0;

          const settle = (retryCurrent: boolean) => {
            if (settled) return;
            settled = true;
            clearAudioGuards();
            if (!isPlayingQueueRef.current || speakSessionIdRef.current !== mySessionId) return;

            if (retryCurrent && attempt < 1) {
              try {
                window.speechSynthesis.cancel();
              } catch {}
              queueTimerRef.current = window.setTimeout(() => {
                if (isPlayingQueueRef.current && speakSessionIdRef.current === mySessionId) {
                  speakSub(subIdx, attempt + 1);
                }
              }, 85);
              return;
            }

            if (subIdx + 1 < subChunks.length) {
              queueTimerRef.current = window.setTimeout(() => {
                if (isPlayingQueueRef.current && speakSessionIdRef.current === mySessionId) {
                  speakSub(subIdx + 1, 0);
                }
              }, 55);
            } else {
              advanceToNextSeg();
            }
          };

          utterance.onstart = () => {
            hasStarted = true;
            quietAfterStart = 0;
          };

          utterance.onend = () => settle(false);

          utterance.onerror = (ev) => {
            if (!isPlayingQueueRef.current || speakSessionIdRef.current !== mySessionId) return;
            if (ev.error === 'canceled' || ev.error === 'interrupted') {
              if (attempt < 1) settle(true);
              return;
            }
            settle(attempt < 1);
          };

          const estSec = Math.max(
            2,
            estimateSpeechDurationSec(spokenText, targetLangCode, effectiveRate, 1.0)
          );
          utteranceWatchdogRef.current = window.setTimeout(() => {
            if (settled) return;
            try {
              window.speechSynthesis.cancel();
            } catch {}
            settle(false);
          }, Math.max(7500, Math.round(estSec * 2200 + 4500)));

          utteranceHeartbeatRef.current = window.setInterval(() => {
            if (settled || !isPlayingQueueRef.current || speakSessionIdRef.current !== mySessionId) {
              clearAudioGuards();
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
                  quietAfterStart += 1;
                  if (quietAfterStart >= 2) settle(false);
                } else {
                  quietAfterStart = 0;
                }
              } else {
                if (!busy) {
                  quietBeforeStart += 1;
                  if (quietBeforeStart >= 3) settle(attempt < 1);
                } else {
                  hasStarted = true;
                }
              }
            } catch {}
          }, 850);

          utteranceRef.current = utterance;
          try {
            window.speechSynthesis.speak(utterance);
          } catch {
            settle(attempt < 1);
          }
        };

        speakSub(0, 0);
      };

      // 55ms post-cancel settling delay prevents Chrome/Safari from dropping the initial utterance
      speakDelayRef.current = window.setTimeout(() => {
        if (isPlayingQueueRef.current && speakSessionIdRef.current === mySessionId) {
          speakSegAt(startIdx);
        }
      }, 55);
    },
    [
      browserVoices,
      clearAudioGuards,
      culturalPersonaIndex,
      speedMultiplier,
      userIntonation,
      voiceProfile.sectionPauseMs,
      voiceProfile.sentencePauseMs,
    ]
  );

  const startNarrationFromSegment = async (segmentIndex = 0, forcedLang?: LanguageCode) => {
    const targetLang = forcedLang || audioLang;
    setStatus('loading');
    setScope('full');
    setShowTranscript(true);
    setActiveSentenceIndex(segmentIndex);
    onAudioMeasured?.(article.id, 3);

    const freshContent = await ensureLanguageContent(targetLang);
    const freshSegments = buildTranscriptSegments(freshContent, 'full', targetLang);

    // Start uninterrupted sequential full-article narration with article-matched prosody
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speakSegmentQueue(freshSegments, segmentIndex, targetLang);
      return;
    }

    // Fallback to server Gemini TTS if browser lacks speechSynthesis
    try {
      const remainingText = sanitizeTextForUninterruptedSpeech(
        freshSegments
          .slice(segmentIndex)
          .map((s) => s.text)
          .join(' '),
        targetLang
      );
      const response = await fetch('/api/ai/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: remainingText,
          voiceName: effectiveVoicePersona,
          languageCode: targetLang,
          intonationStyle: buildTtsIntonationDirective(
            userIntonation,
            targetLang,
            activeCulturalPersona
          ),
        }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data?.audioBase64) {
          const dataUrl = `data:audio/wav;base64,${data.audioBase64}`;
          setWavDataUrl(dataUrl);
          const audio = new Audio(dataUrl);
          audio.playbackRate = effectiveSpeechRate;
          audio.volume = Math.min(1.0, Math.max(0.2, userIntonation.volume));
          audio.onended = () => {
            setStatus('idle');
            setProgressPercent(100);
          };
          audioRef.current = audio;
          setStatus('playing');
          await audio.play();
          return;
        }
      }
      setStatus('idle');
    } catch {
      setStatus('idle');
    }
  };

  const handleTogglePlay = async () => {
    if (status === 'playing') {
      isPlayingQueueRef.current = false;
      if (queueTimerRef.current !== null && typeof window !== 'undefined') {
        window.clearTimeout(queueTimerRef.current);
      }
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
      } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.pause();
      }
      setStatus('paused');
      return;
    }

    if (status === 'paused') {
      isPlayingQueueRef.current = true;
      if (audioRef.current && audioRef.current.paused && audioRef.current.src) {
        audioRef.current.playbackRate = effectiveSpeechRate;
        await audioRef.current.play();
        setStatus('playing');
        return;
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
          setStatus('playing');
        } else {
          speakSegmentQueue(transcriptSegments, currentSegmentIndexRef.current, audioLang);
        }
        return;
      }
    }

    await startNarrationFromSegment(0);
  };

  // When the user opens the audio engine / transcript panel, immediately narrate the entire article
  const handleToggleAndStartFullEngine = async () => {
    if (!showTranscript) {
      setShowTranscript(true);
      setScope('full');
      if (status === 'idle') {
        await startNarrationFromSegment(0);
      }
    } else {
      setShowTranscript(false);
    }
  };

  const handleAudioLanguageChange = async (newLang: LanguageCode) => {
    const wasPlaying = status === 'playing' || status === 'loading';
    stopNarration();
    setAudioLang(newLang);
    if (wasPlaying) {
      await startNarrationFromSegment(0, newLang);
    } else {
      await ensureLanguageContent(newLang);
    }
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeedMultiplier(newSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = Number((voiceProfile.recommendedRate * newSpeed).toFixed(2));
    }
    if (status === 'playing') {
      speakSegmentQueue(transcriptSegments, currentSegmentIndexRef.current, audioLang);
    }
  };

  return (
    <div className="border border-stone-300 bg-[#F5F1E8] p-3.5 rounded-sm space-y-3">
      {/* Purely Synthetic Cultural Voice & User-Controlled Intonation Banner */}
      <div className="bg-[#0F172A] text-white px-3 py-2 rounded-xs space-y-2 text-[11px] font-mono">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-amber-300 font-bold">
              {culturalProfile.stageLabels.narratorPrefix.toUpperCase()} ({audioLangMeta.shortLabel}):
            </span>
            <div className="inline-flex items-center bg-slate-900 border border-slate-700 rounded-xs p-0.5">
              {culturalProfile.personas.map((p, idx) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setCulturalPersonaIndex(idx as 0 | 1);
                    if (status === 'playing') {
                      stopNarration();
                    }
                  }}
                  className={`px-1.5 py-0.5 text-[10px] rounded-xs cursor-pointer transition-colors ${
                    culturalPersonaIndex === idx
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                  title={`${p.roleTitleNative} — ${p.cadenceNote}`}
                >
                  {p.name}
                </button>
              ))}
            </div>
            <span className="px-1.5 py-0.5 bg-slate-950 border border-emerald-500/40 text-emerald-300 text-[9px] rounded-xs">
              {intonationUi.syntheticBadge}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowIntonationPanel((prev) => !prev)}
              className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] rounded-xs border cursor-pointer transition-colors ${
                showIntonationPanel
                  ? 'bg-sky-500/20 border-sky-400 text-sky-200 font-bold'
                  : 'bg-slate-950 border-slate-700 text-slate-200 hover:border-sky-400/60'
              }`}
            >
              <Sliders className="w-3 h-3 text-sky-400 shrink-0" />
              <span>{intonationUi.panelTitle}</span>
            </button>
            <span className="text-emerald-300 hidden sm:inline">
              ({transcriptSegments.length})
            </span>
          </div>
        </div>

        {/* User-Controlled Intonation Panel */}
        {showIntonationPanel && (
          <div
            dir={audioLangMeta.dir}
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
                      onClick={() => {
                        updateUserIntonation({
                          presetId: preset.id,
                          pitch: preset.pitch,
                          rate: preset.rate,
                          pauseScale: preset.pauseScale,
                          volume: preset.volume,
                        });
                        if (status === 'playing') stopNarration();
                      }}
                      className={`px-2 py-0.5 text-[10px] rounded-xs border transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-sky-500 text-slate-950 border-sky-400 font-bold'
                          : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
                      }`}
                    >
                      {preset.labels[audioLang] || preset.labels.en}
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => updateUserIntonation({ ...DEFAULT_USER_INTONATION })}
                className="px-2 py-0.5 text-[10px] bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xs cursor-pointer"
              >
                {intonationUi.resetBtn}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[10px]">
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
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Primary Play / Pause / Stop / Audio Language Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleTogglePlay}
            disabled={status === 'loading'}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-white bg-[#1E3A8A] hover:bg-[#172E6E] transition-colors rounded-sm whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-60"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{t.generatingVoice}</span>
              </>
            ) : status === 'playing' ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Duraklat ({progressPercent}%)</span>
              </>
            ) : status === 'paused' ? (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Devam Et ({progressPercent}%)</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5" />
                <span>
                  Makalenin Tümünü Seslendir ({audioLangMeta.shortLabel} · {transcriptSegments.length} Cümle)
                </span>
              </>
            )}
          </button>

          {(status === 'playing' || status === 'paused') && (
            <button
              type="button"
              onClick={stopNarration}
              className="inline-flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium text-stone-700 bg-white border border-stone-300 hover:bg-stone-100 transition-colors rounded-sm whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Square className="w-3 h-3" />
              <span>{t.stopListening}</span>
            </button>
          )}

          {/* Dedicated Multi-Language Audio Selector (12 Major World Languages) */}
          <div className="inline-flex items-center gap-1.5 bg-white border border-stone-300 px-2.5 py-1.5 rounded-sm">
            <Globe className="w-3.5 h-3.5 text-[#1E3A8A] shrink-0" />
            <label
              htmlFor={`audio-lang-${article.id}-${compact ? 'c' : 'f'}`}
              className="text-[11px] font-mono text-stone-600 whitespace-nowrap"
            >
              {t.selectAudioLang}
            </label>
            <select
              id={`audio-lang-${article.id}-${compact ? 'c' : 'f'}`}
              value={audioLang}
              onChange={(e) => handleAudioLanguageChange(e.target.value as LanguageCode)}
              className="text-xs font-mono font-semibold text-stone-900 bg-transparent focus:outline-none cursor-pointer"
            >
              {WORLD_LANGUAGES.map((wl) => (
                <option key={wl.code} value={wl.code}>
                  {wl.shortLabel} — {wl.nativeName}
                </option>
              ))}
            </select>
          </div>

          {/* Toggle Synchronized Transcript & Auto-Start Full Article Narration When Opened */}
          <button
            type="button"
            onClick={handleToggleAndStartFullEngine}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono border rounded-sm transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              showTranscript
                ? 'bg-stone-900 text-white border-stone-900'
                : 'bg-white text-stone-800 border-stone-300 hover:bg-stone-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>
              {showTranscript
                ? `${t.hideTranscript} (${transcriptSegments.length})`
                : `Seslendirme Motorunu Aç & Tümünü Seslendir (${transcriptSegments.length})`}
            </span>
            {showTranscript ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          {wavDataUrl && (
            <a
              href={wavDataUrl}
              download={`${article.slug}-${audioLang}.wav`}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono text-stone-700 bg-white border border-stone-300 hover:bg-stone-100 transition-colors rounded-sm whitespace-nowrap shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>WAV</span>
            </a>
          )}
        </div>

        {/* Scope & Playback Speed Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="inline-flex items-center bg-stone-200/80 p-0.5 rounded-sm">
            <button
              type="button"
              onClick={() => {
                stopNarration();
                setScope('full');
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                scope === 'full'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t.fullScope}
            </button>
            <button
              type="button"
              onClick={() => {
                stopNarration();
                setScope('abstract');
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                scope === 'abstract'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t.abstractScope}
            </button>
          </div>

          <div className="inline-flex items-center bg-stone-200/80 p-0.5 rounded-sm font-mono tabular-nums">
            {[0.85, 1.0, 1.25, 1.5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleSpeedChange(s)}
                className={`px-2 py-1 text-[11px] rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  speedMultiplier === s
                    ? 'bg-white text-stone-900 font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live Visual Narration Progress Bar */}
      <div className="space-y-1">
        <div className="w-full h-1.5 bg-stone-200 rounded-xs overflow-hidden">
          <div
            className="h-full bg-[#1E3A8A] transition-all duration-300"
            style={{ width: `${Math.max(status === 'playing' ? 4 : 0, progressPercent)}%` }}
          />
        </div>
      </div>

      {/* Live Synchronized Audio Transcript Panel */}
      {showTranscript && (
        <div
          dir={audioLangMeta.dir}
          className="bg-white border border-stone-300 rounded-sm overflow-hidden"
        >
          <div className="px-3.5 py-2 bg-stone-100 border-b border-stone-200 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-stone-700">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#1E3A8A]" />
              <span className="font-semibold text-stone-900">
                {t.liveTranscriptTitle} — {audioLangMeta.nativeName} ({audioLangMeta.speechLang}) · {voiceProfile.styleTitle}
              </span>
            </div>
            <span className="text-stone-500">
              {({
                tr: 'Tüm Makale Seslendirme Akışı · Aktif Cümle',
                en: 'Full Article Audio Stream · Active Sentence',
                es: 'Flujo de Audio Completo · Oración Activa',
                de: 'Volltext-Audiostream · Aktiver Satz',
                fr: 'Flux Audio Complet · Phrase Active',
                ru: 'Полный аудиопоток · Активное предложение',
                ar: 'بث صوتي كامل للمقال · الجملة النشطة',
                zh: '全文音频流 · 当前句',
                ja: '記事全文音声ストリーム · 現在の文',
                pt: 'Fluxo de Áudio Completo · Frase Ativa',
                it: 'Flusso Audio Completo · Frase Attiva',
                ko: '전체 논문 오디오 스트림 · 현재 문장',
              }[language] || 'Full Article Audio Stream · Active Sentence')}
              : {activeSentenceIndex + 1}/{transcriptSegments.length}
            </span>
          </div>

          <div className="max-h-56 overflow-y-auto p-3.5 space-y-1.5 font-academic-body text-sm leading-relaxed">
            {transcriptSegments.map((seg) => {
              const isCurrent =
                (status === 'playing' || status === 'paused') &&
                activeSentenceIndex === seg.index;
              return (
                <button
                  key={seg.index}
                  ref={isCurrent ? activeSentenceRef : null}
                  type="button"
                  onClick={() => startNarrationFromSegment(seg.index)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-sm transition-colors flex items-baseline gap-2.5 cursor-pointer ${
                    isCurrent
                      ? 'bg-[#1E3A8A]/12 text-stone-950 font-semibold border-l-4 border-[#1E3A8A]'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span className="font-mono text-[10px] uppercase tracking-wider text-stone-400 shrink-0 w-24">
                    [{seg.sectionLabel}]
                  </span>
                  <span className="flex-1">{seg.text}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {!compact && (
        <div className="pt-1.5 border-t border-stone-300/60 space-y-1.5 text-[11px] text-stone-600">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span>
              {activeCulturalPersona.name} · {t.selectAudioLang}{' '}
              <strong className="font-mono text-stone-900">
                {audioLangMeta.nativeName} ({audioLangMeta.shortLabel})
              </strong>{' '}
              · {intonationUi.syntheticBadge}
            </span>
            <span className="font-mono tabular-nums text-stone-500">
              {({
                tr: 'Emre Pelit Telifi · Tam Makale İlerlemesi',
                en: '© Emre Pelit · Full Article Progress',
                es: '© Emre Pelit · Progreso Completo',
                de: '© Emre Pelit · Gesamtfortschritt',
                fr: '© Emre Pelit · Progression Complète',
                ru: '© Emre Pelit · Прогресс статьи',
                ar: '© إمري بيليت · التقدم الكامل',
                zh: '© Emre Pelit · 全文进度',
                ja: '© Emre Pelit · 全文進捗',
                pt: '© Emre Pelit · Progresso Completo',
                it: '© Emre Pelit · Avanzamento Completo',
                ko: '© Emre Pelit · 전체 진행률',
              }[language] || '© Emre Pelit · Full Article Progress')}
              : {progressPercent}%
            </span>
          </div>
          <div className="flex items-start gap-1.5 text-[10px] text-stone-500 leading-snug">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
            <span>{intonationUi.zeroLiabilityVoiceDisclaimer}</span>
          </div>
        </div>
      )}
    </div>
  );
};
