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
  const [status, setStatus] = useState<'idle' | 'loading' | 'playing' | 'paused'>('idle');
  const [scope, setScope] = useState<'full' | 'abstract'>('full');
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0);
  const [wavDataUrl, setWavDataUrl] = useState<string | null>(null);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number>(0);
  const [showTranscript, setShowTranscript] = useState<boolean>(!compact);
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
  const isPlayingQueueRef = useRef<boolean>(false);
  const currentSegmentIndexRef = useRef<number>(0);

  const t = UI_TEXT[language].article;
  const audioLangMeta = getLanguageMeta(audioLang);

  // Content-matched prosody & voice profile tailored specifically to this article's subject matter
  const voiceProfile = useMemo(
    () => getOptimalVoiceProfileForArticle(article, audioLang),
    [article, audioLang]
  );

  const effectiveVoicePersona = voiceProfile.persona || voicePersona;
  const effectiveSpeechRate = Number((voiceProfile.recommendedRate * speedMultiplier).toFixed(2));
  const effectivePitch = voiceProfile.recommendedPitch;

  const stopNarration = useCallback(() => {
    isPlayingQueueRef.current = false;
    if (queueTimerRef.current !== null && typeof window !== 'undefined') {
      window.clearTimeout(queueTimerRef.current);
      queueTimerRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setStatus('idle');
    setProgressPercent(0);
    setActiveSentenceIndex(0);
    currentSegmentIndexRef.current = 0;
  }, []);

  // Sync audio language when site language changes
  useEffect(() => {
    stopNarration();
    setAudioLang(language);
  }, [language, stopNarration]);

  useEffect(() => {
    return () => {
      isPlayingQueueRef.current = false;
      if (queueTimerRef.current !== null && typeof window !== 'undefined') {
        window.clearTimeout(queueTimerRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

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
   * Sequential segment-by-segment narration engine that guarantees the ENTIRE article
   * (every paragraph and sentence from startIdx to transcriptSegments.length - 1) is
   * narrated without browser utterance length cutoffs, using the article's tailored prosody profile.
   */
  const speakSegmentQueue = useCallback(
    (segmentsList: TranscriptSegment[], startIdx: number, targetLangCode: LanguageCode) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        setStatus('idle');
        return;
      }

      if (startIdx >= segmentsList.length) {
        isPlayingQueueRef.current = false;
        setStatus('idle');
        setProgressPercent(100);
        return;
      }

      window.speechSynthesis.cancel();
      isPlayingQueueRef.current = true;
      currentSegmentIndexRef.current = startIdx;
      setActiveSentenceIndex(startIdx);

      const totalCount = Math.max(1, segmentsList.length);
      setProgressPercent(Math.min(99, Math.round((startIdx / totalCount) * 100)));

      const currentSeg = segmentsList[startIdx];
      const meta = getLanguageMeta(targetLangCode);
      const utterance = new SpeechSynthesisUtterance(currentSeg.text);
      utterance.lang = meta.speechLang;
      utterance.rate = effectiveSpeechRate;
      utterance.pitch = effectivePitch;

      const voices = window.speechSynthesis.getVoices();
      const matchedVoice =
        voices.find((v) => v.lang.toLowerCase() === meta.speechLang.toLowerCase()) ||
        voices.find((v) => v.lang.toLowerCase().startsWith(targetLangCode.toLowerCase()));
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onend = () => {
        if (!isPlayingQueueRef.current) return;
        const nextIdx = startIdx + 1;
        if (nextIdx < segmentsList.length) {
          const nextSeg = segmentsList[nextIdx];
          const pauseMs = nextSeg.isSectionStart
            ? voiceProfile.sectionPauseMs
            : voiceProfile.sentencePauseMs;
          queueTimerRef.current = window.setTimeout(() => {
            if (isPlayingQueueRef.current) {
              speakSegmentQueue(segmentsList, nextIdx, targetLangCode);
            }
          }, pauseMs);
        } else {
          isPlayingQueueRef.current = false;
          setStatus('idle');
          setProgressPercent(100);
        }
      };

      utterance.onerror = () => {
        if (!isPlayingQueueRef.current) return;
        const nextIdx = startIdx + 1;
        if (nextIdx < segmentsList.length) {
          speakSegmentQueue(segmentsList, nextIdx, targetLangCode);
        } else {
          isPlayingQueueRef.current = false;
          setStatus('idle');
        }
      };

      utteranceRef.current = utterance;
      setStatus('playing');
      setShowTranscript(true);
      window.speechSynthesis.speak(utterance);
    },
    [effectiveSpeechRate, effectivePitch, voiceProfile.sectionPauseMs, voiceProfile.sentencePauseMs]
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
      const remainingText = freshSegments
        .slice(segmentIndex)
        .map((s) => s.text)
        .join(' ');
      const response = await fetch('/api/ai/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: remainingText,
          voiceName: effectiveVoicePersona,
          languageCode: targetLang,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data?.audioBase64) {
          const dataUrl = `data:audio/wav;base64,${data.audioBase64}`;
          setWavDataUrl(dataUrl);
          const audio = new Audio(dataUrl);
          audio.playbackRate = effectiveSpeechRate;
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
      {/* Content-Matched Adaptive Voice & Prosody Banner */}
      <div className="bg-[#0F172A] text-white px-3 py-2 rounded-xs flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
        <div className="flex flex-wrap items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="text-amber-300 font-bold">
            MAKALEYE ÖZEL SESLENDİRME BİÇİMİ ({article.category}):
          </span>
          <span className="text-slate-100">{voiceProfile.styleTitle}</span>
        </div>
        <span className="text-emerald-300">
          Persona: {effectiveVoicePersona} · Ton: {voiceProfile.acousticToneLabel} · Tam Metin ({transcriptSegments.length} Cümle)
        </span>
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
        <div className="pt-1 border-t border-stone-300/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-600">
          <span>
            {voiceProfile.styleDescription} · {t.selectAudioLang}{' '}
            <strong className="font-mono text-stone-900">
              {audioLangMeta.nativeName} ({audioLangMeta.shortLabel})
            </strong>{' '}
            · Persona: <strong className="font-mono text-stone-800">{effectiveVoicePersona}</strong>
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
      )}
    </div>
  );
};
