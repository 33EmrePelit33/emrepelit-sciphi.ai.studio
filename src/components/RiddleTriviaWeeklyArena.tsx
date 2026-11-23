import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Brain,
  CheckCircle2,
  CircleDashed,
  HelpCircle,
  Languages,
  Play,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Trash2,
  Trophy,
  Volume2,
  VolumeX,
  XCircle,
  ArrowRight,
} from 'lucide-react';
import type { LanguageCode } from '../types';
import { WORLD_LANGUAGES } from '../i18n/translations';
import {
  ARENA_QUESTION_BANK,
  ARENA_SCORING,
  ARENA_UI_STRINGS,
  type ArenaQuestionItem,
} from '../data/riddleTriviaBank';

type GamePhase = 'MENU' | 'PLAYING' | 'SUMMARY';
type GameMode = 'all' | 'riddle' | 'qa';

interface AnswerRecord {
  questionId: string;
  choiceIndex: number | null; // null = blank (+20)
  outcome: 'correct' | 'blank' | 'wrong';
  points: number;
}

interface WeeklyTopEntry {
  id: string;
  nickname: string;
  score: number;
  correctCount: number;
  blankCount: number;
  wrongCount: number;
  totalQuestions: number;
  language: LanguageCode;
  updatedAt: string;
}

interface WeeklyArchiveMeta {
  weekId: string;
  weekLabel: string;
  participantsCount: number;
}

interface LeaderboardResponse {
  success: boolean;
  currentWeekId: string;
  weekId: string;
  weekLabel: string;
  top5: WeeklyTopEntry[];
  totalParticipants: number;
  weeks: WeeklyArchiveMeta[];
}

interface RiddleTriviaWeeklyArenaProps {
  language: LanguageCode;
  onOpenKvkkModal?: () => void;
  onArenaPlayedMeasured?: (summary: string, score: number) => void;
}

function playFeedbackTone(kind: 'correct' | 'blank' | 'wrong' | 'finish', enabled: boolean) {
  if (!enabled || typeof window === 'undefined') return;
  try {
    const AudioCtx =
      window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (kind === 'correct') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.14);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.23);
    } else if (kind === 'blank') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (kind === 'wrong') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(195, now + 0.18);
      gain.gain.setValueAtTime(0.055, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.21);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.09);
      osc.frequency.setValueAtTime(783.99, now + 0.18);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.34);
      osc.start(now);
      osc.stop(now + 0.35);
    }
    window.setTimeout(() => {
      void ctx.close().catch(() => {});
    }, 450);
  } catch {
    // Audio playback optional
  }
}

export const RiddleTriviaWeeklyArena: React.FC<RiddleTriviaWeeklyArenaProps> = ({
  language,
  onOpenKvkkModal,
  onArenaPlayedMeasured,
}) => {
  const [arenaLang, setArenaLang] = useState<LanguageCode>(language);
  const [phase, setPhase] = useState<GamePhase>('MENU');
  const [mode, setMode] = useState<GameMode>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [showClue, setShowClue] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Weekly Top 5 leaderboard state
  const [selectedWeekId, setSelectedWeekId] = useState<string>('current');
  const [leaderboard, setLeaderboard] = useState<LeaderboardResponse | null>(null);
  const [loadingBoard, setLoadingBoard] = useState<boolean>(false);

  // Submission & GDPR/KVKK opt-in state (strictly in-memory; zero pre-consent localStorage writes)
  const [nickname, setNickname] = useState<string>('');
  const [consentChecked, setConsentChecked] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [submitNotice, setSubmitNotice] = useState<string>('');
  const [lastReceipt, setLastReceipt] = useState<{
    entryId: string;
    weekId: string;
    erasureToken: string;
    nickname: string;
    rank: number | null;
  } | null>(null);

  const arenaSectionRef = useRef<HTMLElement | null>(null);

  // Keep arena language synced if user switches the main site language while in MENU
  useEffect(() => {
    setArenaLang(language);
  }, [language]);

  const ui = ARENA_UI_STRINGS[arenaLang] || ARENA_UI_STRINGS.tr;
  const isRtl = arenaLang === 'ar';

  const activeQuestions = useMemo<ArenaQuestionItem[]>(() => {
    if (mode === 'riddle') return ARENA_QUESTION_BANK.filter((q) => q.type === 'riddle');
    if (mode === 'qa') return ARENA_QUESTION_BANK.filter((q) => q.type === 'qa');
    return ARENA_QUESTION_BANK;
  }, [mode]);

  const fetchLeaderboard = useCallback(async (weekQuery: string = 'current') => {
    setLoadingBoard(true);
    try {
      const res = await fetch(
        `/api/arena/leaderboard?week=${encodeURIComponent(weekQuery)}`
      );
      if (res.ok) {
        const data = (await res.json()) as LeaderboardResponse;
        if (data?.success) {
          setLeaderboard(data);
        }
      }
    } catch {
      // Non-blocking fallback
    } finally {
      setLoadingBoard(false);
    }
  }, []);

  useEffect(() => {
    void fetchLeaderboard(selectedWeekId);
  }, [selectedWeekId, fetchLeaderboard]);

  useEffect(() => {
    const onLiveUpdate = () => {
      void fetchLeaderboard(selectedWeekId);
    };
    window.addEventListener('sciphil:arena-leaderboard-updated', onLiveUpdate);
    return () => window.removeEventListener('sciphil:arena-leaderboard-updated', onLiveUpdate);
  }, [selectedWeekId, fetchLeaderboard]);

  const stats = useMemo(() => {
    let correct = 0;
    let blank = 0;
    let wrong = 0;
    let score = 0;
    for (const a of answers) {
      if (a.outcome === 'correct') correct += 1;
      else if (a.outcome === 'blank') blank += 1;
      else wrong += 1;
      score += a.points;
    }
    return { correct, blank, wrong, score };
  }, [answers]);

  const currentQuestion = activeQuestions[currentIndex] || null;
  const currentAnswer = currentQuestion
    ? answers.find((a) => a.questionId === currentQuestion.id) || null
    : null;

  const handleStartGame = (nextMode: GameMode = mode) => {
    setMode(nextMode);
    setCurrentIndex(0);
    setAnswers([]);
    setShowClue(false);
    setSubmitError('');
    setSubmitNotice('');
    setPhase('PLAYING');
  };

  const handleAnswer = useCallback(
    (choiceIndex: number | null) => {
      if (!currentQuestion || currentAnswer) return;
      let outcome: 'correct' | 'blank' | 'wrong';
      let points: number;
      if (choiceIndex === null) {
        outcome = 'blank';
        points = ARENA_SCORING.BLANK;
      } else if (choiceIndex === currentQuestion.correctIndex) {
        outcome = 'correct';
        points = ARENA_SCORING.CORRECT;
      } else {
        outcome = 'wrong';
        points = ARENA_SCORING.WRONG;
      }

      playFeedbackTone(outcome, soundEnabled);
      setAnswers((prev) => [
        ...prev,
        {
          questionId: currentQuestion.id,
          choiceIndex,
          outcome,
          points,
        },
      ]);
    },
    [currentQuestion, currentAnswer, soundEnabled]
  );

  const handleNextOrFinish = useCallback(() => {
    if (currentIndex + 1 < activeQuestions.length) {
      setCurrentIndex((i) => i + 1);
      setShowClue(false);
    } else {
      playFeedbackTone('finish', soundEnabled);
      setPhase('SUMMARY');
      const finalScore = answers.reduce((acc, item) => acc + item.points, 0);
      onArenaPlayedMeasured?.(
        `Bilmece & Soru-Cevap Arenası (${mode}): ${finalScore} Puan`,
        finalScore
      );
    }
  }, [currentIndex, activeQuestions.length, soundEnabled, answers, mode, onArenaPlayedMeasured]);

  // Keyboard accessibility while actively playing (1-4 to pick option, B for blank, Enter for next)
  useEffect(() => {
    if (phase !== 'PLAYING') return;
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')) {
        return;
      }
      if (!currentAnswer) {
        if (e.key === '1' || e.key === '2' || e.key === '3' || e.key === '4') {
          e.preventDefault();
          handleAnswer(Number(e.key) - 1);
        } else if (e.key.toLowerCase() === 'b') {
          e.preventDefault();
          handleAnswer(null);
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleNextOrFinish();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [phase, currentAnswer, handleAnswer, handleNextOrFinish]);

  const handlePublishToLeaderboard = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitNotice('');

    const cleanName = nickname.trim();
    if (cleanName.length < 2 || cleanName.length > 24) {
      setSubmitError(
        arenaLang === 'tr'
          ? 'Takma ad en az 2, en fazla 24 karakter olmalıdır.'
          : 'Alias must be between 2 and 24 characters.'
      );
      return;
    }
    if (cleanName.includes('@') || /\+?\d[\d\s-]{6,}/.test(cleanName)) {
      setSubmitError(
        arenaLang === 'tr'
          ? 'KVKK/GDPR veri minimizasyonu gereği e-posta adresi veya telefon numarası girilmemelidir; yalnızca takma ad kullanın.'
          : 'Under GDPR/KVKK data minimization, please use a pseudonymous alias without email or phone numbers.'
      );
      return;
    }
    if (!consentChecked) {
      setSubmitError(
        arenaLang === 'tr'
          ? 'Haftalık listede yayınlamak için KVKK/GDPR açık rıza onay kutusunu işaretlemelisiniz.'
          : 'Please tick the GDPR/KVKK opt-in consent box before publishing to the weekly list.'
      );
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/arena/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname: cleanName,
          language: arenaLang,
          mode,
          leaderboardConsentAccepted: true,
          answers: answers.map((a) => ({
            questionId: a.questionId,
            choiceIndex: a.choiceIndex,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        setSubmitError(data?.error || 'Kayıt sırasında bir hata oluştu.');
        return;
      }
      setLastReceipt({
        entryId: data.entryId,
        weekId: data.weekId,
        erasureToken: data.erasureToken,
        nickname: cleanName,
        rank: data.rank ?? null,
      });
      setSubmitNotice(ui.publishedNotice);
      setSelectedWeekId('current');
      await fetchLeaderboard('current');
    } catch {
      setSubmitError(
        arenaLang === 'tr'
          ? 'Sunucuya bağlanılamadı; lütfen tekrar deneyin.'
          : 'Could not reach server; please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEraseOwnEntry = async () => {
    if (!lastReceipt) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/arena/entry', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weekId: lastReceipt.weekId,
          entryId: lastReceipt.entryId,
          erasureToken: lastReceipt.erasureToken,
        }),
      });
      const data = await res.json();
      if (res.ok && data?.success) {
        setLastReceipt(null);
        setSubmitNotice(ui.erasedNotice);
        await fetchLeaderboard(selectedWeekId);
      } else {
        setSubmitError(data?.error || 'Silme işlemi tamamlanamadı.');
      }
    } catch {
      setSubmitError('Silme isteği gönderilemedi.');
    } finally {
      setSubmitting(false);
    }
  };

  const activeLocalized = currentQuestion
    ? currentQuestion.content[arenaLang] || currentQuestion.content.tr
    : null;

  return (
    <section
      id="interactive-arena"
      ref={arenaSectionRef}
      dir={isRtl ? 'rtl' : 'ltr'}
      aria-label={ui.title}
      className="no-print scroll-mt-24 bg-[#FBF9F5] border border-stone-300 p-5 sm:p-7 space-y-6"
    >
      {/* Editorial Section Header & Language Control Bar */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-5 border-b border-stone-300">
        <div className="space-y-1.5 max-w-3xl">
          <div className="text-xs font-mono text-[#1E3A8A] font-semibold">
            {ui.sectionKicker} · {ui.mediumDifficultyLabel}
          </div>
          <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-stone-950 leading-tight">
            {ui.title}
          </h2>
          <p className="text-sm text-stone-700 leading-relaxed">{ui.subtitle}</p>
        </div>

        {/* Instant 12-Language Switcher + Sound Toggle */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <label className="inline-flex items-center gap-2 text-xs font-mono text-stone-700 bg-white border border-stone-300 px-3 py-2 rounded-xs">
            <Languages className="w-4 h-4 text-[#1E3A8A] shrink-0" />
            <span className="whitespace-nowrap">{ui.displayLangLabel}:</span>
            <select
              aria-label={ui.displayLangLabel}
              value={arenaLang}
              onChange={(e) => setArenaLang(e.target.value as LanguageCode)}
              className="bg-transparent font-bold text-stone-900 focus:outline-none cursor-pointer"
            >
              {WORLD_LANGUAGES.map((lang) => (
                <option key={`arena-lang-${lang.code}`} value={lang.code}>
                  {lang.nativeName} ({lang.shortLabel})
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={() => setSoundEnabled((s) => !s)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono text-stone-700 bg-white border border-stone-300 hover:border-stone-500 rounded-xs cursor-pointer transition-colors whitespace-nowrap"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#1E3A8A]" />
            ) : (
              <VolumeX className="w-4 h-4 text-stone-400" />
            )}
            <span>{soundEnabled ? ui.soundOn : ui.soundOff}</span>
          </button>
        </div>
      </div>

      {/* Scoring Rules Strip (Unboxed clean tabular typography) */}
      <div className="flex flex-wrap items-center justify-between gap-3 py-2.5 px-4 bg-[#0F172A] text-slate-100 rounded-xs font-mono text-xs tabular-nums">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <span className="text-amber-300 font-bold">{ui.scoringRuleLabel}:</span>
          <span className="text-emerald-300 font-semibold">✓ {ui.correctPts}</span>
          <span className="text-sky-300 font-semibold">○ {ui.blankPts}</span>
          <span className="text-rose-300 font-semibold">✕ {ui.wrongPts}</span>
        </div>
        <div className="text-slate-300 text-[11px]">{ui.openParticipationNote}</div>
      </div>

      {/* Main 2-Column Layout: Left = Game Arena (7 cols), Right = Weekly Top 5 Leaderboard (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Interactive Riddle-Puzzle & Q&A Arena */}
        <div className="lg:col-span-7 bg-white border border-stone-300 p-5 sm:p-6 space-y-5">
          {/* Mode Selector Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-stone-200">
            <div
              role="tablist"
              aria-label="Oyun Modu"
              className="inline-flex flex-wrap items-center gap-1 p-1 bg-stone-100 border border-stone-200 rounded-xs"
            >
              {(
                [
                  { id: 'all', label: ui.modeAll },
                  { id: 'riddle', label: ui.modeRiddles },
                  { id: 'qa', label: ui.modeQa },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={mode === tab.id}
                  onClick={() => {
                    setMode(tab.id);
                    if (phase !== 'MENU') {
                      setCurrentIndex(0);
                      setAnswers([]);
                      setShowClue(false);
                      setPhase('MENU');
                    }
                  }}
                  className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-xs transition-colors cursor-pointer whitespace-nowrap ${
                    mode === tab.id
                      ? 'bg-[#1E3A8A] text-white'
                      : 'text-stone-700 hover:text-stone-950'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {phase !== 'MENU' && (
              <div className="flex items-center gap-3 font-mono text-xs tabular-nums">
                <span className="text-stone-600">
                  {ui.scoreLabel}:{' '}
                  <strong
                    className={
                      stats.score >= 0 ? 'text-[#1E3A8A] text-sm' : 'text-rose-700 text-sm'
                    }
                  >
                    {stats.score >= 0 ? `+${stats.score}` : stats.score}
                  </strong>
                </span>
              </div>
            )}
          </div>

          {/* PHASE 1: MENU */}
          {phase === 'MENU' && (
            <div className="space-y-5 py-2">
              <div className="space-y-2">
                <h3 className="text-xl font-editorial font-bold text-stone-950 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-[#1E3A8A] shrink-0" />
                  <span>
                    {mode === 'riddle'
                      ? ui.modeRiddles
                      : mode === 'qa'
                      ? ui.modeQa
                      : ui.modeAll}
                  </span>
                </h3>
                <p className="text-sm text-stone-700 leading-relaxed">
                  {arenaLang === 'tr'
                    ? `Bu turda ${activeQuestions.length} adet orta zorlukta içerik uyumlu soru/bilmece yer alır. Emin olmadığınız soruyu yanlış işaretleyip -20 puan kaybetmek yerine "Boş Bırak" seçeneğiyle +20 puan koruyabilirsiniz.`
                    : `This round contains ${activeQuestions.length} medium-difficulty corpus-aligned challenges. If you are unsure, leaving a question blank awards +20 points instead of risking -20 for a wrong guess.`}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs tabular-nums">
                <div className="border border-stone-200 bg-[#FBF9F5] p-3.5 space-y-1">
                  <div className="text-emerald-800 font-bold">✓ {ui.correctPts}</div>
                  <div className="text-[11px] text-stone-600">
                    {arenaLang === 'tr' ? 'Her doğru çözümde' : 'Per correct answer'}
                  </div>
                </div>
                <div className="border border-stone-200 bg-[#FBF9F5] p-3.5 space-y-1">
                  <div className="text-sky-800 font-bold">○ {ui.blankPts}</div>
                  <div className="text-[11px] text-stone-600">
                    {arenaLang === 'tr' ? 'Stratejik boş bırakmada' : 'Strategic blank skip'}
                  </div>
                </div>
                <div className="border border-stone-200 bg-[#FBF9F5] p-3.5 space-y-1">
                  <div className="text-rose-800 font-bold">✕ {ui.wrongPts}</div>
                  <div className="text-[11px] text-stone-600">
                    {arenaLang === 'tr' ? 'Her yanlış yanıtta' : 'Per wrong answer'}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => handleStartGame(mode)}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-[#1E3A8A] hover:bg-blue-900 text-white font-mono text-xs font-bold rounded-xs cursor-pointer transition-colors whitespace-nowrap"
                >
                  <Play className="w-4 h-4" />
                  <span>{ui.startBtn}</span>
                </button>
                <span className="text-xs text-stone-600 font-mono">
                  {arenaLang === 'tr'
                    ? 'Klavye kısayolları: 1–4 Seç · B Boş Bırak · Enter İleri'
                    : 'Keyboard: 1–4 Choose · B Blank · Enter Next'}
                </span>
              </div>
            </div>
          )}

          {/* PHASE 2: ACTIVE PLAY */}
          {phase === 'PLAYING' && currentQuestion && activeLocalized && (
            <div className="space-y-5">
              {/* Progress HUD */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-stone-600 tabular-nums">
                  <span>
                    {ui.questionProgress} <strong>{currentIndex + 1}</strong> / {activeQuestions.length} ·{' '}
                    <span className="text-[#1E3A8A] font-semibold">
                      {currentQuestion.type === 'riddle' ? ui.riddleTag : ui.qaTag}
                    </span>{' '}
                    · {activeLocalized.category}
                  </span>
                  <span>
                    ✓ {stats.correct} · ○ {stats.blank} · ✕ {stats.wrong}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-stone-200 overflow-hidden">
                  <div
                    className="h-full bg-[#1E3A8A] transition-transform duration-200 origin-left"
                    style={{
                      transform: `scaleX(${(currentIndex + (currentAnswer ? 1 : 0)) / Math.max(1, activeQuestions.length)})`,
                    }}
                  />
                </div>
              </div>

              {/* Prompt Card */}
              <div className="bg-[#FBF9F5] border border-stone-300 p-4 sm:p-5 space-y-3">
                <p className="text-base sm:text-lg font-academic-body text-stone-950 leading-relaxed font-medium">
                  {activeLocalized.prompt}
                </p>

                {!currentAnswer && (
                  <div className="pt-1">
                    {!showClue ? (
                      <button
                        type="button"
                        onClick={() => setShowClue(true)}
                        className="inline-flex items-center gap-1.5 text-xs font-mono text-[#1E3A8A] hover:underline cursor-pointer"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>{ui.clueBtn}</span>
                      </button>
                    ) : (
                      <div className="text-xs text-stone-700 bg-white border border-stone-200 p-2.5 leading-relaxed">
                        <strong className="text-[#1E3A8A] font-mono">İpucu / Clue:</strong>{' '}
                        {activeLocalized.clue}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 4 Choice Buttons (44px+ accessible targets) */}
              <div className="grid grid-cols-1 gap-2.5">
                {activeLocalized.options.map((optionText, idx) => {
                  const isPicked = currentAnswer?.choiceIndex === idx;
                  const isCorrectOption = idx === currentQuestion.correctIndex;
                  const letter = ['A', 'B', 'C', 'D'][idx];

                  let buttonClasses =
                    'bg-white border-stone-300 text-stone-900 hover:border-[#1E3A8A] hover:bg-blue-50/40';
                  let statusLabel = '';

                  if (currentAnswer) {
                    if (isCorrectOption) {
                      buttonClasses = 'bg-emerald-50 border-emerald-600 text-emerald-950 font-semibold';
                      statusLabel = isPicked ? '✓ +50' : '✓';
                    } else if (isPicked && !isCorrectOption) {
                      buttonClasses = 'bg-rose-50 border-rose-600 text-rose-950 font-semibold';
                      statusLabel = '✕ -20';
                    } else {
                      buttonClasses = 'bg-stone-50 border-stone-200 text-stone-500';
                    }
                  }

                  return (
                    <button
                      key={`${currentQuestion.id}-opt-${idx}`}
                      type="button"
                      disabled={Boolean(currentAnswer)}
                      onClick={() => handleAnswer(idx)}
                      className={`w-full min-h-[48px] text-left px-4 py-3 border rounded-xs flex items-center justify-between gap-3 transition-colors cursor-pointer disabled:cursor-default ${buttonClasses}`}
                    >
                      <span className="flex items-start gap-3 text-sm leading-snug">
                        <span className="font-mono font-bold text-xs px-1.5 py-0.5 bg-stone-100 border border-stone-300 text-stone-800 shrink-0">
                          {letter}
                        </span>
                        <span>{optionText}</span>
                      </span>
                      {statusLabel && (
                        <span className="font-mono text-xs font-bold shrink-0 tabular-nums">
                          {statusLabel}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Action Footer: Leave Blank (+20) OR Explanation + Next */}
              {!currentAnswer ? (
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => handleAnswer(null)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-sky-50 hover:bg-sky-100 border border-sky-400 text-sky-950 font-mono text-xs font-bold rounded-xs cursor-pointer transition-colors whitespace-nowrap"
                  >
                    <CircleDashed className="w-4 h-4" />
                    <span>{ui.skipBlankBtn}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhase('MENU')}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono text-stone-600 hover:text-stone-950 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{arenaLang === 'tr' ? 'Menüye Dön' : 'Back to Menu'}</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3 pt-2 border-t border-stone-200">
                  <div
                    className={`p-3.5 border text-xs leading-relaxed space-y-1 ${
                      currentAnswer.outcome === 'correct'
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                        : currentAnswer.outcome === 'blank'
                        ? 'bg-sky-50 border-sky-400 text-sky-950'
                        : 'bg-rose-50 border-rose-400 text-rose-950'
                    }`}
                  >
                    <div className="font-mono font-bold flex items-center gap-1.5">
                      {currentAnswer.outcome === 'correct' ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                          <span>{ui.correctPts}</span>
                        </>
                      ) : currentAnswer.outcome === 'blank' ? (
                        <>
                          <CircleDashed className="w-4 h-4 text-sky-700" />
                          <span>{ui.blankPts}</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-rose-700" />
                          <span>{ui.wrongPts}</span>
                        </>
                      )}
                    </div>
                    <p className="text-stone-800">{activeLocalized.explanation}</p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleNextOrFinish}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1E3A8A] hover:bg-blue-900 text-white font-mono text-xs font-bold rounded-xs cursor-pointer transition-colors whitespace-nowrap"
                    >
                      <span>
                        {currentIndex + 1 < activeQuestions.length ? ui.nextBtn : ui.finishBtn}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PHASE 3: ROUND SUMMARY & OPT-IN WEEKLY TOP 5 SUBMISSION */}
          {phase === 'SUMMARY' && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-xl font-editorial font-bold text-stone-950">
                  {ui.summaryTitle}
                </h3>
                <button
                  type="button"
                  onClick={() => handleStartGame(mode)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-900 font-mono text-xs font-bold rounded-xs cursor-pointer transition-colors whitespace-nowrap"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{ui.playAgainBtn}</span>
                </button>
              </div>

              {/* Tabular Score Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono tabular-nums">
                <div className="border border-stone-300 bg-[#0F172A] text-white p-3.5">
                  <div className="text-[11px] text-amber-300">{ui.scoreLabel}</div>
                  <div className="text-2xl font-bold mt-0.5">
                    {stats.score >= 0 ? `+${stats.score}` : stats.score}
                  </div>
                </div>
                <div className="border border-stone-200 bg-emerald-50/70 p-3.5">
                  <div className="text-[11px] text-emerald-900">{ui.correctLabel} (+50)</div>
                  <div className="text-xl font-bold text-emerald-950 mt-0.5">
                    {stats.correct} <span className="text-xs font-normal">(+{stats.correct * 50})</span>
                  </div>
                </div>
                <div className="border border-stone-200 bg-sky-50/70 p-3.5">
                  <div className="text-[11px] text-sky-900">{ui.blankLabel} (+20)</div>
                  <div className="text-xl font-bold text-sky-950 mt-0.5">
                    {stats.blank} <span className="text-xs font-normal">(+{stats.blank * 20})</span>
                  </div>
                </div>
                <div className="border border-stone-200 bg-rose-50/70 p-3.5">
                  <div className="text-[11px] text-rose-900">{ui.wrongLabel} (-20)</div>
                  <div className="text-xl font-bold text-rose-950 mt-0.5">
                    {stats.wrong} <span className="text-xs font-normal">(-{stats.wrong * 20})</span>
                  </div>
                </div>
              </div>

              {/* Opt-in Weekly Leaderboard Form (KVKK 6698 & EU GDPR Art. 6(1)(a) & Art. 17) */}
              {!lastReceipt ? (
                <form
                  onSubmit={handlePublishToLeaderboard}
                  className="bg-[#FBF9F5] border border-stone-300 p-4 space-y-3.5"
                >
                  <div className="space-y-1">
                    <label
                      htmlFor="arena-nickname-input"
                      className="block text-xs font-mono font-bold text-stone-900"
                    >
                      {ui.nicknameLabel}
                    </label>
                    <input
                      id="arena-nickname-input"
                      type="text"
                      maxLength={24}
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      placeholder={ui.nicknamePlaceholder}
                      className="w-full px-3 py-2.5 text-sm bg-white border border-stone-300 rounded-xs text-stone-950 focus:outline-none focus:border-[#1E3A8A]"
                    />
                  </div>

                  <label className="flex items-start gap-2.5 text-xs text-stone-700 leading-relaxed cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentChecked}
                      onChange={(e) => setConsentChecked(e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-[#1E3A8A] shrink-0 cursor-pointer"
                    />
                    <span>{ui.consentLabel}</span>
                  </label>

                  {submitError && (
                    <div className="text-xs font-mono text-rose-800 bg-rose-50 border border-rose-300 p-2.5">
                      {submitError}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1E3A8A] hover:bg-blue-900 text-white font-mono text-xs font-bold rounded-xs cursor-pointer transition-colors disabled:opacity-60 whitespace-nowrap"
                    >
                      <Trophy className="w-4 h-4 text-amber-300" />
                      <span>{submitting ? '...' : ui.publishScoreBtn}</span>
                    </button>
                    <span className="text-[11px] text-stone-600">{ui.privateOnlyNote}</span>
                  </div>
                </form>
              ) : (
                <div className="bg-emerald-50 border border-emerald-400 p-4 space-y-3 text-xs">
                  <div className="font-mono font-bold text-emerald-950 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>
                      {submitNotice || ui.publishedNotice} ({lastReceipt.nickname}
                      {lastReceipt.rank ? ` · #${lastReceipt.rank}` : ''})
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={handleEraseOwnEntry}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-rose-50 border border-rose-400 text-rose-800 font-mono text-[11px] font-bold rounded-xs cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{ui.eraseMyEntryBtn}</span>
                    </button>
                  </div>
                </div>
              )}

              {submitNotice && !lastReceipt && (
                <div className="text-xs font-mono text-emerald-900 bg-emerald-50 border border-emerald-300 p-2.5">
                  {submitNotice}
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Weekly Top 5 Leaderboard */}
        <aside className="lg:col-span-5 bg-white border border-stone-300 p-5 sm:p-6 space-y-4">
          <div className="flex items-start justify-between gap-2 pb-3 border-b border-stone-200">
            <div className="space-y-0.5">
              <h3 className="text-lg font-editorial font-bold text-stone-950 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{ui.leaderboardTitle}</span>
              </h3>
              <p className="text-xs text-stone-600">{ui.leaderboardSubtitle}</p>
            </div>
            <button
              type="button"
              onClick={() => void fetchLeaderboard(selectedWeekId)}
              aria-label="Haftalık listeyi yenile"
              className="p-2 text-stone-600 hover:text-[#1E3A8A] border border-stone-200 rounded-xs cursor-pointer transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingBoard ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Week Selector (Current + Past Weekly Archives) */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <label className="inline-flex items-center gap-2 text-stone-700">
              <span>{ui.weekLabel}:</span>
              <select
                value={selectedWeekId}
                onChange={(e) => setSelectedWeekId(e.target.value)}
                className="bg-[#FBF9F5] border border-stone-300 px-2.5 py-1.5 rounded-xs text-stone-900 font-semibold cursor-pointer"
              >
                <option value="current">
                  {ui.currentWeekLabel}
                  {leaderboard?.currentWeekId ? ` (${leaderboard.currentWeekId})` : ''}
                </option>
                {(leaderboard?.weeks || [])
                  .filter((w) => w.weekId !== leaderboard?.currentWeekId)
                  .map((w) => (
                    <option key={w.weekId} value={w.weekId}>
                      {w.weekId} · {w.weekLabel} ({w.participantsCount})
                    </option>
                  ))}
              </select>
            </label>
            {leaderboard?.weekLabel && (
              <span className="text-[11px] text-stone-500 tabular-nums">
                {leaderboard.weekLabel}
              </span>
            )}
          </div>

          {/* Top 5 Table */}
          {leaderboard && leaderboard.top5.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-mono text-xs tabular-nums">
                <thead>
                  <tr className="border-b border-stone-300 text-[11px] text-stone-500">
                    <th className="py-2 pr-2 font-semibold">{ui.rankCol}</th>
                    <th className="py-2 px-2 font-semibold">{ui.playerCol}</th>
                    <th className="py-2 px-2 text-right font-semibold">{ui.breakdownCol}</th>
                    <th className="py-2 pl-2 text-right font-semibold">{ui.scoreCol}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {leaderboard.top5.map((entry, idx) => (
                    <tr
                      key={entry.id}
                      className={idx === 0 ? 'bg-amber-50/70' : 'hover:bg-stone-50'}
                    >
                      <td className="py-2.5 pr-2 font-bold text-stone-900">#{idx + 1}</td>
                      <td className="py-2.5 px-2">
                        <div className="font-semibold text-stone-950 truncate max-w-[140px]">
                          {entry.nickname}
                        </div>
                        <div className="text-[10px] text-stone-500 uppercase">
                          {entry.language}
                        </div>
                      </td>
                      <td className="py-2.5 px-2 text-right text-[11px] text-stone-600 whitespace-nowrap">
                        <span className="text-emerald-700 font-semibold">{entry.correctCount}</span>/
                        <span className="text-sky-700 font-semibold">{entry.blankCount}</span>/
                        <span className="text-rose-700 font-semibold">{entry.wrongCount}</span>
                      </td>
                      <td className="py-2.5 pl-2 text-right font-bold text-[#1E3A8A] text-sm whitespace-nowrap">
                        {entry.score >= 0 ? `+${entry.score}` : entry.score}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 px-4 text-center border border-dashed border-stone-300 bg-[#FBF9F5] text-xs text-stone-600">
              {loadingBoard ? '...' : ui.emptyLeaderboard}
            </div>
          )}

          {/* KVKK / GDPR Privacy Guarantee Footer */}
          <div className="pt-3 border-t border-stone-200 flex items-start gap-2 text-[11px] text-stone-600 leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span>
                {arenaLang === 'tr'
                  ? 'KVKK (6698) & AB GDPR uyumlu: Yalnızca rıza ile seçilen takma ad ve haftalık oyun puanı saklanır; e-posta, gerçek ad veya IP adresi tutulmaz.'
                  : 'GDPR & KVKK compliant: Only opt-in pseudonymous aliases and weekly scores are stored; zero email, real name, or IP retention.'}
              </span>{' '}
              {onOpenKvkkModal && (
                <button
                  type="button"
                  onClick={onOpenKvkkModal}
                  className="text-[#1E3A8A] font-semibold underline cursor-pointer"
                >
                  KVKK / GDPR
                </button>
              )}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};
