import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  LogOut,
  MinusCircle,
  Play,
  RotateCcw,
  ShieldCheck,
  Trophy,
  UserCheck,
  XCircle,
} from 'lucide-react';
import type { Article, LanguageCode } from '../types';
import { getLocalizedText } from '../i18n/translations';
import type { TranslatedArticleContent } from '../utils/articleLearningEngine';
import {
  EXAM_DURATION_SECONDS,
  EXAM_MAX_DIFFICULTY,
  EXAM_MIN_DIFFICULTY,
  EXAM_POINTS_BLANK,
  EXAM_POINTS_CORRECT,
  EXAM_POINTS_WRONG,
  EXAM_TOTAL_QUESTIONS,
  buildAdaptiveExamQuestionPool,
  computeExamScoreBreakdown,
  formatExamDurationMs,
  getExamUiStrings,
  selectNextAdaptiveQuestion,
  type AdaptiveExamAnswerRecord,
  type AdaptiveExamQuestion,
} from '../utils/articleAdaptiveExamEngine';
import type { MonthlyStandingItem } from './MonthlyExamLeaderboard';

type ExamPhase = 'IDLE' | 'USERNAME_GATE' | 'PLAYING' | 'SUMMARY';

interface StoredParticipant {
  username: string;
  ownerToken?: string;
}

interface ArticleAdaptiveExamModuleProps {
  article: Article;
  language: LanguageCode;
  translatedArticle?: TranslatedArticleContent | null;
  getAuthToken?: () => Promise<string | null>;
  onOpenLeaderboard?: () => void;
  onExamCompletedMeasured?: (articleId: string, score: number, correctCount: number) => void;
}

const PUBLIC_USERNAME_KEY = 'sciphil_exam_public_username_v1';

// Held strictly in JS memory (never persisted in localStorage/sessionStorage);
// server also persists ownership via HttpOnly; Secure; SameSite=None; Partitioned cookie.
let inMemoryExamOwnerToken: string | undefined;

function loadStoredParticipant(): StoredParticipant | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(PUBLIC_USERNAME_KEY);
    if (raw && raw.trim().length >= 3) {
      return {
        username: raw.trim(),
        ownerToken: inMemoryExamOwnerToken,
      };
    }
  } catch {
    // Ignore storage read error
  }
  return null;
}

function saveStoredParticipant(p: StoredParticipant | null): void {
  if (typeof window === 'undefined') return;
  inMemoryExamOwnerToken = p?.ownerToken || inMemoryExamOwnerToken;
  try {
    if (!p) {
      inMemoryExamOwnerToken = undefined;
      window.localStorage.removeItem(PUBLIC_USERNAME_KEY);
    } else {
      window.localStorage.setItem(PUBLIC_USERNAME_KEY, p.username);
    }
    window.dispatchEvent(new CustomEvent('sciphil:exam-username-updated', { detail: p }));
  } catch {
    // Ignore storage write error
  }
}

function formatClock(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function formatTimeOfDay(iso: string, lang: LanguageCode): string {
  try {
    return new Intl.DateTimeFormat(lang, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date(iso));
  } catch {
    return iso.slice(11, 19);
  }
}

export const ArticleAdaptiveExamModule: React.FC<ArticleAdaptiveExamModuleProps> = ({
  article,
  language,
  translatedArticle = null,
  getAuthToken,
  onOpenLeaderboard,
  onExamCompletedMeasured,
}) => {
  const ui = getExamUiStrings(language);
  const articleTitle =
    translatedArticle?.title || getLocalizedText(article.title, language) || article.slug;

  // Build the 60-question adaptive pool lazily only when exam is opened
  const [phase, setPhase] = useState<ExamPhase>('IDLE');
  const questionPool = useMemo(() => {
    if (phase === 'IDLE') return [];
    return buildAdaptiveExamQuestionPool(article, language, translatedArticle);
  }, [phase, article, language, translatedArticle]);

  // Persistent claimed username state (synced across articles)
  const [participant, setParticipant] = useState<StoredParticipant | null>(() =>
    loadStoredParticipant()
  );
  const [usernameInput, setUsernameInput] = useState<string>('');
  const [claimingUsername, setClaimingUsername] = useState<boolean>(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [usernameTakenCollision, setUsernameTakenCollision] = useState<boolean>(false);
  const [usernameSuggestions, setUsernameSuggestions] = useState<string[]>([]);

  // Active exam state
  const [currentDifficulty, setCurrentDifficulty] = useState<number>(EXAM_MIN_DIFFICULTY);
  const [activeQuestion, setActiveQuestion] = useState<AdaptiveExamQuestion | null>(null);
  const [askedQuestionIds, setAskedQuestionIds] = useState<Set<string>>(() => new Set());
  const [records, setRecords] = useState<AdaptiveExamAnswerRecord[]>([]);
  const [currentAnswerRecord, setCurrentAnswerRecord] = useState<AdaptiveExamAnswerRecord | null>(
    null
  );
  const [lastDifficultyDelta, setLastDifficultyDelta] = useState<number>(0);
  const [secondsLeft, setSecondsLeft] = useState<number>(EXAM_DURATION_SECONDS);
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);
  const [exitedEarly, setExitedEarly] = useState<boolean>(false);
  const [timedOut, setTimedOut] = useState<boolean>(false);

  // Submission & monthly standing state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [savedStanding, setSavedStanding] = useState<MonthlyStandingItem | null>(null);
  const [savedTop5, setSavedTop5] = useState<MonthlyStandingItem[]>([]);
  const [saveError, setSaveError] = useState<boolean>(false);
  const [completedTiming, setCompletedTiming] = useState<{
    startedAtIso: string;
    endedAtIso: string;
    durationMs: number;
  } | null>(null);

  const finalizedRef = useRef<boolean>(false);
  const recordsRef = useRef<AdaptiveExamAnswerRecord[]>(records);
  recordsRef.current = records;
  const secondsLeftRef = useRef<number>(secondsLeft);
  secondsLeftRef.current = secondsLeft;
  const examStartedAtMsRef = useRef<number>(0);
  const examSessionIdRef = useRef<string | null>(null);

  // Keep participant synced when updated from another article card on the page
  useEffect(() => {
    const syncHandler = () => {
      setParticipant(loadStoredParticipant());
    };
    window.addEventListener('sciphil:exam-username-updated', syncHandler);
    return () => window.removeEventListener('sciphil:exam-username-updated', syncHandler);
  }, []);

  // Reset exam state if user switches article
  useEffect(() => {
    setPhase('IDLE');
    setRecords([]);
    setActiveQuestion(null);
    setCurrentAnswerRecord(null);
    setShowExitConfirm(false);
    setExitedEarly(false);
    setTimedOut(false);
    setSavedStanding(null);
    setSavedTop5([]);
    setSaveError(false);
    setCompletedTiming(null);
    examStartedAtMsRef.current = 0;
    examSessionIdRef.current = null;
    finalizedRef.current = false;
  }, [article.id]);

  // If language changes mid-exam while on a question, update the displayed question text seamlessly
  useEffect(() => {
    if (phase !== 'PLAYING' || !activeQuestion || questionPool.length === 0) return;
    const match = questionPool.find((q) => q.id === activeQuestion.id);
    if (match) {
      setActiveQuestion(match);
    }
  }, [language, phase, activeQuestion, questionPool]);

  const buildAuthHeaders = useCallback(async (): Promise<Record<string, string>> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Requested-With': 'SciPhilExam',
    };
    if (inMemoryExamOwnerToken) {
      headers['X-Exam-Owner-Token'] = inMemoryExamOwnerToken;
    }
    if (getAuthToken) {
      const idToken = await getAuthToken().catch(() => null);
      if (idToken) headers.Authorization = `Bearer ${idToken}`;
    }
    return headers;
  }, [getAuthToken]);

  const startFreshExamSession = useCallback(
    (poolOverride?: AdaptiveExamQuestion[], usernameOverride?: string) => {
      const activePool =
        poolOverride && poolOverride.length > 0
          ? poolOverride
          : buildAdaptiveExamQuestionPool(article, language, translatedArticle);
      const firstQ = selectNextAdaptiveQuestion(activePool, EXAM_MIN_DIFFICULTY, new Set());
      if (!firstQ) return;

      const startMs = Date.now();
      finalizedRef.current = false;
      examStartedAtMsRef.current = startMs;
      examSessionIdRef.current = null;

      setCurrentDifficulty(EXAM_MIN_DIFFICULTY);
      setAskedQuestionIds(new Set([firstQ.id]));
      setActiveQuestion(firstQ);
      setRecords([]);
      setCurrentAnswerRecord(null);
      setLastDifficultyDelta(0);
      setSecondsLeft(EXAM_DURATION_SECONDS);
      setShowExitConfirm(false);
      setExitedEarly(false);
      setTimedOut(false);
      setSavedStanding(null);
      setSavedTop5([]);
      setSaveError(false);
      setCompletedTiming(null);
      setPhase('PLAYING');

      // Register server-authoritative start timestamp in the background
      const activeUsername = usernameOverride || loadStoredParticipant()?.username || participant?.username;
      if (activeUsername) {
        void (async () => {
          try {
            const headers = await buildAuthHeaders();
            const res = await fetch('/api/exams/start', {
              method: 'POST',
              headers,
              credentials: 'same-origin',
              body: JSON.stringify({
                username: activeUsername,
                articleId: article.id,
              }),
            });
            if (res.ok) {
              const data = await res.json();
              if (data?.ok && typeof data.sessionId === 'string') {
                examSessionIdRef.current = data.sessionId;
              }
            }
          } catch {
            // Non-fatal: falls back to validated start/end timestamps
          }
        })();
      }
    },
    [article, buildAuthHeaders, language, participant?.username, translatedArticle]
  );

  const finalizeAndSubmitExam = useCallback(
    async (
      finalRecords: AdaptiveExamAnswerRecord[],
      wasEarlyExit: boolean,
      wasTimeout: boolean
    ) => {
      if (finalizedRef.current) return;
      finalizedRef.current = true;

      // Pad any remaining questions up to 20 as unanswered_exit (+10 pts each)
      const padded: AdaptiveExamAnswerRecord[] = [...finalRecords];
      while (padded.length < EXAM_TOTAL_QUESTIONS) {
        padded.push({
          questionIndex: padded.length + 1,
          questionId: `exit-blank-${padded.length + 1}`,
          difficulty: currentDifficulty,
          selectedOptionIndex: null,
          outcome: 'unanswered_exit',
          pointsDelta: EXAM_POINTS_BLANK,
        });
      }

      const endedAtMs = Date.now();
      const startedAtMs =
        examStartedAtMsRef.current > 0 && examStartedAtMsRef.current <= endedAtMs
          ? examStartedAtMsRef.current
          : endedAtMs - Math.max(1000, (EXAM_DURATION_SECONDS - secondsLeftRef.current) * 1000);
      const localDurationMs = Math.max(
        100,
        Math.min(EXAM_DURATION_SECONDS * 1000, endedAtMs - startedAtMs)
      );
      const startedAtIso = new Date(startedAtMs).toISOString();
      const endedAtIso = new Date(endedAtMs).toISOString();
      const elapsedSeconds = Math.max(1, Math.min(EXAM_DURATION_SECONDS, Math.round(localDurationMs / 1000)));
      const sessionIdToSubmit = examSessionIdRef.current;
      examSessionIdRef.current = null;

      setCompletedTiming({
        startedAtIso,
        endedAtIso,
        durationMs: localDurationMs,
      });
      setRecords(padded);
      setExitedEarly(wasEarlyExit);
      setTimedOut(wasTimeout);
      setShowExitConfirm(false);
      setPhase('SUMMARY');

      const localSummary = computeExamScoreBreakdown(padded, EXAM_TOTAL_QUESTIONS);
      onExamCompletedMeasured?.(article.id, localSummary.totalScore, localSummary.correctCount);

      const activePart = loadStoredParticipant() || participant;
      if (!activePart?.username) return;

      setIsSubmitting(true);
      setSaveError(false);
      try {
        const headers = await buildAuthHeaders();
        const res = await fetch('/api/exams/submit', {
          method: 'POST',
          headers,
          credentials: 'same-origin',
          body: JSON.stringify({
            username: activePart.username,
            articleId: article.id,
            articleTitle,
            language,
            sessionId: sessionIdToSubmit || undefined,
            startedAt: startedAtIso,
            endedAt: endedAtIso,
            durationMs: localDurationMs,
            durationSeconds: elapsedSeconds,
            answers: padded.map((r) => ({
              questionId: r.questionId,
              difficulty: r.difficulty,
              outcome: r.outcome,
            })),
            exitedEarly: wasEarlyExit || wasTimeout,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.ok) {
            if (
              data.attempt &&
              typeof data.attempt.durationMs === 'number' &&
              typeof data.attempt.startedAt === 'string' &&
              typeof data.attempt.endedAt === 'string'
            ) {
              setCompletedTiming({
                startedAtIso: data.attempt.startedAt,
                endedAtIso: data.attempt.endedAt,
                durationMs: data.attempt.durationMs,
              });
            }
            if (data.myStanding) setSavedStanding(data.myStanding);
            if (Array.isArray(data.top10)) setSavedTop5(data.top10.slice(0, 5));
            window.dispatchEvent(new CustomEvent('sciphil:monthly-exam-leaderboard-updated'));
          } else {
            setSaveError(true);
          }
        } else {
          setSaveError(true);
        }
      } catch {
        setSaveError(true);
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      article.id,
      articleTitle,
      buildAuthHeaders,
      currentDifficulty,
      language,
      onExamCompletedMeasured,
      participant,
    ]
  );

  // Drift-free countdown timer derived from exact start timestamp while PLAYING
  useEffect(() => {
    if (phase !== 'PLAYING') return;
    const timer = window.setInterval(() => {
      const startMs = examStartedAtMsRef.current || Date.now();
      const elapsedSec = Math.floor((Date.now() - startMs) / 1000);
      const remaining = Math.max(0, EXAM_DURATION_SECONDS - elapsedSec);
      setSecondsLeft(remaining);
      if (remaining <= 0) {
        window.clearInterval(timer);
        void finalizeAndSubmitExam(recordsRef.current, true, true);
      }
    }, 500);
    return () => window.clearInterval(timer);
  }, [phase, finalizeAndSubmitExam]);

  const handleOpenExamClick = async () => {
    const existing = loadStoredParticipant();
    if (existing?.username && inMemoryExamOwnerToken) {
      setParticipant(existing);
      startFreshExamSession(undefined, existing.username);
      return;
    }
    try {
      const headers = await buildAuthHeaders();
      const meRes = await fetch('/api/exams/me', { headers, credentials: 'same-origin' });
      if (meRes.ok) {
        const meData = await meRes.json();
        if (meData?.ok && typeof meData.username === 'string' && meData.username.length >= 3) {
          const synced: StoredParticipant = { username: meData.username };
          saveStoredParticipant(synced);
          setParticipant(synced);
          startFreshExamSession(undefined, synced.username);
          return;
        }
      }
    } catch {
      // Fall through to username gate
    }
    setUsernameInput(existing?.username || '');
    setUsernameError(null);
    setUsernameTakenCollision(false);
    setUsernameSuggestions([]);
    setPhase('USERNAME_GATE');
  };

  const handleClaimUsername = async (candidateRaw: string) => {
    const clean = candidateRaw.trim().replace(/\s+/g, '_');
    setUsernameError(null);
    setUsernameTakenCollision(false);
    setUsernameSuggestions([]);

    if (clean.length < 3 || clean.length > 24) {
      setUsernameError(ui.usernameInvalidShort);
      return;
    }
    if (clean.includes('@') || /\+?\d[\d\s-]{6,}/.test(clean) || /https?:\/\/|www\./i.test(clean)) {
      setUsernameError(ui.usernameInvalidPii);
      return;
    }

    setClaimingUsername(true);
    try {
      const headers = await buildAuthHeaders();
      const existing = loadStoredParticipant();
      const res = await fetch('/api/exams/username/claim', {
        method: 'POST',
        headers,
        credentials: 'same-origin',
        body: JSON.stringify({
          username: clean,
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data?.ok && data?.username) {
        const claimed: StoredParticipant = {
          username: data.username,
          ownerToken: data.ownerToken || existing?.ownerToken,
        };
        saveStoredParticipant(claimed);
        setParticipant(claimed);
        startFreshExamSession(undefined, claimed.username);
        return;
      }

      if (res.status === 409 || data?.code === 'USERNAME_TAKEN') {
        setUsernameTakenCollision(true);
        setUsernameSuggestions(Array.isArray(data?.suggestions) ? data.suggestions.slice(0, 3) : []);
        setUsernameError(ui.usernameTakenWarning);
        return;
      }

      setUsernameError(data?.error || ui.usernameInvalidShort);
    } catch {
      setUsernameError(ui.scoreSaveError);
    } finally {
      setClaimingUsername(false);
    }
  };

  const handleRecordAnswer = (optionIdx: number | null) => {
    if (!activeQuestion || currentAnswerRecord) return;

    let outcome: 'correct' | 'wrong' | 'blank' = 'blank';
    let pointsDelta = EXAM_POINTS_BLANK;
    let nextDiff = currentDifficulty;
    let delta = 0;

    if (optionIdx === null) {
      outcome = 'blank';
      pointsDelta = EXAM_POINTS_BLANK;
      nextDiff = Math.max(EXAM_MIN_DIFFICULTY, currentDifficulty - 1);
      delta = nextDiff - currentDifficulty;
    } else if (optionIdx === activeQuestion.correctIndex) {
      outcome = 'correct';
      pointsDelta = EXAM_POINTS_CORRECT;
      nextDiff = Math.min(EXAM_MAX_DIFFICULTY, currentDifficulty + 1);
      delta = nextDiff - currentDifficulty;
    } else {
      outcome = 'wrong';
      pointsDelta = EXAM_POINTS_WRONG;
      nextDiff = Math.max(EXAM_MIN_DIFFICULTY, currentDifficulty - 1);
      delta = nextDiff - currentDifficulty;
    }

    const rec: AdaptiveExamAnswerRecord = {
      questionIndex: records.length + 1,
      questionId: activeQuestion.id,
      difficulty: activeQuestion.difficulty,
      selectedOptionIndex: optionIdx,
      outcome,
      pointsDelta,
    };

    const updated = [...records, rec];
    setRecords(updated);
    setCurrentAnswerRecord(rec);
    setLastDifficultyDelta(delta);
    setCurrentDifficulty(nextDiff);
  };

  const handleNextOrFinish = () => {
    if (!currentAnswerRecord) return;
    if (records.length >= EXAM_TOTAL_QUESTIONS) {
      void finalizeAndSubmitExam(records, false, false);
      return;
    }
    const nextQ = selectNextAdaptiveQuestion(questionPool, currentDifficulty, askedQuestionIds);
    if (!nextQ) {
      void finalizeAndSubmitExam(records, false, false);
      return;
    }
    const nextAsked = new Set(askedQuestionIds);
    nextAsked.add(nextQ.id);
    setAskedQuestionIds(nextAsked);
    setActiveQuestion(nextQ);
    setCurrentAnswerRecord(null);
  };

  const liveScore = useMemo(
    () => records.reduce((sum, r) => sum + r.pointsDelta, 0),
    [records]
  );

  const summary = useMemo(
    () => computeExamScoreBreakdown(records, EXAM_TOTAL_QUESTIONS),
    [records]
  );

  const remainingQuestionsCount = Math.max(0, EXAM_TOTAL_QUESTIONS - records.length);
  const earlyExitBonusPoints = remainingQuestionsCount * EXAM_POINTS_BLANK;
  const elapsedSecondsDisplay = Math.max(0, EXAM_DURATION_SECONDS - secondsLeft);

  const jumpToLeaderboard = () => {
    if (onOpenLeaderboard) {
      onOpenLeaderboard();
      return;
    }
    document
      .getElementById('monthly-exam-leaderboard')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // ==================== IDLE COMPACT LAUNCH CARD ====================
  if (phase === 'IDLE') {
    return (
      <div className="bg-[#FBF9F5] border border-stone-300 rounded-sm p-4 sm:p-5 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600 font-sans">
              <span className="font-semibold text-[#1E3A8A]">{ui.badgeTitle}</span>
              {participant?.username && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono text-stone-800">
                    {ui.usernameActiveLabel}: <strong>@{participant.username}</strong>
                  </span>
                </>
              )}
            </div>
            <h4 className="text-base font-editorial font-bold text-stone-900 leading-snug">
              {ui.cardTitle} — {articleTitle}
            </h4>
            <p className="text-xs font-sans text-stone-600 leading-relaxed max-w-3xl">
              {ui.cardSubtitle}
            </p>
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-mono text-stone-700 tabular-nums pt-0.5">
              <span className="text-emerald-800 font-semibold">{ui.ruleCorrect}</span>
              <span aria-hidden="true" className="text-stone-400">·</span>
              <span className="text-stone-700 font-semibold">{ui.ruleBlank}</span>
              <span aria-hidden="true" className="text-stone-400">·</span>
              <span className="text-amber-800 font-semibold">{ui.ruleWrong}</span>
              <span aria-hidden="true" className="text-stone-400">·</span>
              <span>{ui.ruleDuration}</span>
              <span aria-hidden="true" className="text-stone-400">·</span>
              <span>{ui.ruleAdaptive}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleOpenExamClick}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#1E3A8A] hover:bg-[#172D6B] rounded-xs transition-colors cursor-pointer whitespace-nowrap"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{ui.startExamBtn}</span>
            </button>
            <button
              type="button"
              onClick={jumpToLeaderboard}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium text-stone-800 bg-white hover:bg-stone-100 border border-stone-300 rounded-xs transition-colors cursor-pointer whitespace-nowrap"
            >
              <Trophy className="w-3.5 h-3.5 text-[#1E3A8A]" />
              <span>{ui.openLeaderboardBtn}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==================== USERNAME RESERVATION GATE ====================
  if (phase === 'USERNAME_GATE') {
    return (
      <div className="bg-[#FBF9F5] border border-stone-300 rounded-sm overflow-hidden">
        <div className="px-4 py-3 bg-[#F2EFE7] border-b border-stone-300 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <UserCheck className="w-4 h-4 text-[#1E3A8A] shrink-0" />
            <h4 className="text-sm font-editorial font-bold text-stone-900 truncate">
              {ui.usernameGateTitle}
            </h4>
          </div>
          <button
            type="button"
            onClick={() => setPhase('IDLE')}
            className="px-2.5 py-1 text-xs font-sans text-stone-700 bg-white hover:bg-stone-100 border border-stone-300 rounded-xs cursor-pointer"
          >
            {ui.closeExamBtn}
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-xs sm:text-sm font-sans text-stone-700 leading-relaxed">
            {ui.usernameGateSubtitle}
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void handleClaimUsername(usernameInput);
            }}
            className="space-y-3"
          >
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="flex-1 space-y-1">
                <label className="block text-xs font-sans font-semibold text-stone-800">
                  {ui.usernameInputLabel}
                </label>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => {
                    setUsernameInput(e.target.value);
                    if (usernameError) setUsernameError(null);
                  }}
                  maxLength={24}
                  placeholder={ui.usernamePlaceholder}
                  autoComplete="off"
                  className="w-full px-3.5 py-2.5 text-sm font-mono bg-white border border-stone-300 rounded-xs text-stone-900 focus:outline-none focus:border-[#1E3A8A]"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={claimingUsername || usernameInput.trim().length < 3}
                  className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-white bg-[#1E3A8A] hover:bg-[#172D6B] rounded-xs transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
                >
                  {claimingUsername ? ui.usernameChecking : ui.usernameSubmitBtn}
                </button>
              </div>
            </div>
            <p className="text-[11px] font-sans text-stone-500">{ui.usernameHint}</p>
          </form>

          {/* Collision Warning + 3 Available Similar Suggestions + Custom Username Option */}
          {usernameError && (
            <div className="p-4 bg-amber-50 border border-amber-400 rounded-xs space-y-3">
              <div className="flex items-start gap-2.5 text-xs sm:text-sm font-sans text-amber-950">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="leading-relaxed font-medium">{usernameError}</p>
              </div>

              {usernameTakenCollision && usernameSuggestions.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-amber-300/70">
                  <p className="text-xs font-sans font-semibold text-stone-800">
                    {ui.usernameSuggestionsLabel}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {usernameSuggestions.map((sug) => (
                      <button
                        key={sug}
                        type="button"
                        disabled={claimingUsername}
                        onClick={() => {
                          setUsernameInput(sug);
                          void handleClaimUsername(sug);
                        }}
                        className="px-3 py-1.5 text-xs font-mono font-semibold text-[#1E3A8A] bg-white hover:bg-[#EEF2FA] border border-[#1E3A8A]/40 rounded-xs transition-colors cursor-pointer"
                      >
                        @{sug}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] font-sans text-stone-700 pt-1">
                    {ui.usernameCustomOptionLabel}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex items-start gap-2 text-[11px] font-sans text-stone-600 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
            <span>{ui.usernameKvkkNote}</span>
          </div>
        </div>
      </div>
    );
  }

  // ==================== ACTIVE 20-QUESTION ADAPTIVE EXAM ====================
  if (phase === 'PLAYING' && activeQuestion) {
    const qNumber = currentAnswerRecord ? records.length : records.length + 1;
    const isLowTime = secondsLeft <= 120;
    const activeTierLabel =
      ui.difficultyTiers[
        Math.max(0, Math.min(9, activeQuestion.difficulty - 1))
      ] || `${activeQuestion.difficulty}/10`;

    return (
      <div className="bg-[#FBF9F5] border border-stone-300 rounded-sm overflow-hidden">
        {/* Top Telemetry Strip */}
        <div className="px-4 py-3 bg-[#F2EFE7] border-b border-stone-300 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono tabular-nums">
            <span className="font-bold text-stone-900">
              {ui.questionLabel} {qNumber} / {EXAM_TOTAL_QUESTIONS}
            </span>
            <span aria-hidden="true" className="text-stone-400">·</span>
            <span className="font-semibold text-[#1E3A8A]">
              {ui.difficultyLabel}: {activeTierLabel}
            </span>
            <span aria-hidden="true" className="text-stone-400">·</span>
            <span
              className={`inline-flex items-center gap-1 font-bold ${
                isLowTime ? 'text-red-700' : 'text-stone-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              {formatClock(secondsLeft)}
            </span>
            <span aria-hidden="true" className="text-stone-400">·</span>
            <span className="font-bold text-emerald-800">
              {ui.liveScoreLabel}: {liveScore >= 0 ? `+${liveScore}` : liveScore} {ui.pointsUnit}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {participant?.username && (
              <span className="text-xs font-mono text-stone-600 hidden sm:inline">
                @{participant.username}
              </span>
            )}
            <button
              type="button"
              onClick={() => setShowExitConfirm((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-950 bg-white hover:bg-amber-50 border border-amber-400 rounded-xs transition-colors cursor-pointer whitespace-nowrap"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{ui.exitExamBtn}</span>
            </button>
          </div>
        </div>

        {/* Adaptive Progress Strip (20 compact slots) */}
        <div className="px-4 pt-3 pb-1 flex items-center gap-1" aria-hidden="true">
          {Array.from({ length: EXAM_TOTAL_QUESTIONS }).map((_, idx) => {
            const rec = records[idx];
            let barClass = 'bg-stone-200';
            if (rec) {
              if (rec.outcome === 'correct') barClass = 'bg-emerald-600';
              else if (rec.outcome === 'wrong') barClass = 'bg-red-500';
              else barClass = 'bg-amber-400';
            } else if (idx === qNumber - 1) {
              barClass = 'bg-[#1E3A8A]';
            }
            return <div key={idx} className={`h-1.5 flex-1 rounded-xs ${barClass}`} />;
          })}
        </div>

        {/* Early Exit Inline Confirmation Banner */}
        {showExitConfirm && (
          <div className="mx-4 mt-3 p-3.5 bg-amber-50 border border-amber-400 rounded-xs space-y-2.5">
            <div className="flex items-start gap-2 text-xs font-sans text-amber-950">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold">{ui.exitConfirmTitle}</p>
                <p className="leading-relaxed">
                  {ui.exitConfirmBody
                    .replace('{remaining}', String(remainingQuestionsCount))
                    .replace('{bonus}', String(earlyExitBonusPoints))}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => void finalizeAndSubmitExam(records, true, false)}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-xs cursor-pointer"
              >
                {ui.exitConfirmYesBtn}
              </button>
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="px-3.5 py-2 text-xs font-medium text-stone-800 bg-white hover:bg-stone-100 border border-stone-300 rounded-xs cursor-pointer"
              >
                {ui.exitConfirmNoBtn}
              </button>
            </div>
          </div>
        )}

        {/* Question Body */}
        <div className="p-4 sm:p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-600 font-sans">
            <span>
              {activeQuestion.topicTag} · {ui.difficultyLabel} {activeQuestion.difficulty}/10
            </span>
            <span className="font-mono tabular-nums text-[11px] text-stone-500">
              {ui.ruleCorrect} · {ui.ruleBlank} · {ui.ruleWrong}
            </span>
          </div>

          <p className="text-sm sm:text-base font-academic-body font-semibold text-stone-900 leading-relaxed">
            {activeQuestion.prompt}
          </p>

          <div className="grid grid-cols-1 gap-2">
            {activeQuestion.options.map((opt, idx) => {
              const letter = ['A', 'B', 'C', 'D'][idx] || String(idx + 1);
              const isAnswered = Boolean(currentAnswerRecord);
              const isSelected = currentAnswerRecord?.selectedOptionIndex === idx;
              const isCorrectOpt = idx === activeQuestion.correctIndex;

              let optClass = 'bg-white hover:bg-stone-50 border-stone-300 text-stone-800';
              if (isAnswered) {
                if (isCorrectOpt) {
                  optClass = 'bg-emerald-50 border-emerald-600 text-emerald-950 font-semibold';
                } else if (isSelected) {
                  optClass = 'bg-red-50 border-red-500 text-red-950';
                } else {
                  optClass = 'bg-stone-50 border-stone-200 text-stone-500';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => handleRecordAnswer(idx)}
                  className={`w-full text-left px-3.5 py-2.5 text-xs sm:text-sm font-sans border rounded-xs transition-colors flex items-start gap-2.5 ${
                    isAnswered ? 'cursor-default' : 'cursor-pointer'
                  } ${optClass}`}
                >
                  <span className="font-mono font-bold shrink-0 px-1.5 py-0.5 bg-stone-100 text-stone-800 border border-stone-300 rounded-xs text-[11px]">
                    {letter}
                  </span>
                  <span className="flex-1 leading-relaxed">{opt}</span>
                  {isAnswered && isCorrectOpt && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  )}
                  {isAnswered && isSelected && !isCorrectOpt && (
                    <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Action Row Before Answering: Leave Blank (+10) */}
          {!currentAnswerRecord && (
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleRecordAnswer(null)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-stone-800 bg-white hover:bg-stone-100 border border-stone-300 rounded-xs transition-colors cursor-pointer"
              >
                <MinusCircle className="w-3.5 h-3.5 text-stone-600" />
                <span>{ui.leaveBlankBtn}</span>
              </button>
            </div>
          )}

          {/* Immediate Feedback & Adaptive Next Step */}
          {currentAnswerRecord && (
            <div
              className={`p-3.5 border rounded-xs space-y-2.5 text-xs ${
                currentAnswerRecord.outcome === 'correct'
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                  : currentAnswerRecord.outcome === 'wrong'
                    ? 'bg-red-50 border-red-400 text-red-950'
                    : 'bg-amber-50 border-amber-400 text-amber-950'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 font-sans font-bold">
                <span className="inline-flex items-center gap-1.5">
                  {currentAnswerRecord.outcome === 'correct' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  ) : currentAnswerRecord.outcome === 'wrong' ? (
                    <XCircle className="w-4 h-4 text-red-600" />
                  ) : (
                    <MinusCircle className="w-4 h-4 text-amber-700" />
                  )}
                  <span>
                    {currentAnswerRecord.outcome === 'correct'
                      ? ui.feedbackCorrect
                      : currentAnswerRecord.outcome === 'wrong'
                        ? ui.feedbackWrong
                        : ui.feedbackBlank}
                  </span>
                </span>

                <span className="inline-flex items-center gap-1 font-mono text-[11px]">
                  {currentAnswerRecord.outcome === 'correct' ? (
                    <>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>
                        {lastDifficultyDelta > 0
                          ? ui.difficultyUpNotice
                          : ui.difficultyMaxNotice}
                      </span>
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="w-3.5 h-3.5" />
                      <span>
                        {lastDifficultyDelta < 0
                          ? ui.difficultyDownNotice
                          : ui.difficultyMinNotice}
                      </span>
                    </>
                  )}
                </span>
              </div>

              <p className="font-sans leading-relaxed">{activeQuestion.explanation}</p>

              <div className="pt-1 flex justify-end">
                <button
                  type="button"
                  onClick={handleNextOrFinish}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1E3A8A] hover:bg-[#172D6B] rounded-xs transition-colors cursor-pointer"
                >
                  <span>
                    {records.length >= EXAM_TOTAL_QUESTIONS
                      ? ui.finishExamBtn
                      : ui.nextQuestionBtn}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==================== EXAM SUMMARY & MONTHLY LEADERBOARD RESULT ====================
  return (
    <div className="bg-[#FBF9F5] border border-stone-300 rounded-sm overflow-hidden">
      <div className="px-4 py-3 bg-[#F2EFE7] border-b border-stone-300 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-[#1E3A8A] shrink-0" />
          <h4 className="text-sm font-editorial font-bold text-stone-900">
            {ui.summaryTitle}
          </h4>
          {participant?.username && (
            <span className="text-xs font-mono text-stone-700">· @{participant.username}</span>
          )}
        </div>
        <div className="text-xs font-mono text-stone-600">
          {isSubmitting
            ? ui.savingScoreLabel
            : saveError
              ? ui.scoreSaveError
              : ui.scoreSavedBadge}
        </div>
      </div>

      <div className="p-5 space-y-5">
        {(exitedEarly || timedOut) && (
          <div className="p-3 bg-amber-50 border border-amber-300 rounded-xs text-xs font-sans text-amber-950">
            {timedOut ? ui.timeoutTitle : ui.summaryEarlyExitNote}
          </div>
        )}

        {/* Score Breakdown Table */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white border border-stone-200 rounded-xs p-4 space-y-2.5 text-xs font-sans tabular-nums">
            <div className="flex items-center justify-between py-1 border-b border-stone-100">
              <span className="text-stone-700">{ui.summaryCorrectRow}</span>
              <span className="font-mono font-bold text-emerald-800">
                {summary.correctCount} × +50 = +{summary.correctCount * EXAM_POINTS_CORRECT}{' '}
                {ui.pointsUnit}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-stone-100">
              <span className="text-stone-700">
                {ui.summaryBlankRow}
                {summary.exitBlankCount > 0 && (
                  <span className="text-[11px] text-stone-500 ml-1">
                    ({summary.exitBlankCount} {ui.summaryExitBlankNote})
                  </span>
                )}
              </span>
              <span className="font-mono font-bold text-stone-800">
                {summary.totalBlankCount} × +10 = +{summary.totalBlankCount * EXAM_POINTS_BLANK}{' '}
                {ui.pointsUnit}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-stone-100">
              <span className="text-stone-700">{ui.summaryWrongRow}</span>
              <span className="font-mono font-bold text-red-700">
                {summary.wrongCount} × -10 = -{summary.wrongCount * Math.abs(EXAM_POINTS_WRONG)}{' '}
                {ui.pointsUnit}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1.5 text-sm font-bold text-stone-900">
              <span>{ui.summaryTotalRow}</span>
              <span className="font-mono text-[#1E3A8A]">
                {summary.totalScore >= 0 ? `+${summary.totalScore}` : summary.totalScore}{' '}
                {ui.pointsUnit}
              </span>
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-xs p-4 space-y-2.5 text-xs font-sans tabular-nums">
            <div className="flex items-center justify-between py-1 border-b border-stone-100">
              <span className="text-stone-700">{ui.summaryTimeRow}</span>
              <span className="font-mono font-bold text-[#1E3A8A]">
                {completedTiming
                  ? formatExamDurationMs(completedTiming.durationMs, true)
                  : formatClock(elapsedSecondsDisplay)}
              </span>
            </div>
            {completedTiming && (
              <div className="flex items-center justify-between py-1 border-b border-stone-100">
                <span className="text-stone-700">{ui.summaryStartEndRow}</span>
                <span className="font-mono text-[11px] text-stone-600">
                  {formatTimeOfDay(completedTiming.startedAtIso, language)} →{' '}
                  {formatTimeOfDay(completedTiming.endedAtIso, language)}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between py-1 border-b border-stone-100">
              <span className="text-stone-700">{ui.summaryPeakDiffRow}</span>
              <span className="font-mono font-semibold text-stone-900">
                {summary.peakDifficulty} / 10
              </span>
            </div>
            {savedStanding && (
              <>
                <div className="flex items-center justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-700">{ui.summaryMonthlyRankRow}</span>
                  <span className="font-mono font-bold text-[#1E3A8A]">
                    #{savedStanding.rank}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-stone-700">{ui.summaryMonthlyTotalRow}</span>
                  <span className="font-mono font-bold text-emerald-800">
                    {savedStanding.totalScore.toLocaleString(language)} {ui.pointsUnit}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Adaptive Difficulty Curve Visualization (Inline SVG) */}
        <div className="bg-white border border-stone-200 rounded-xs p-4 space-y-2">
          <div className="text-xs font-sans font-semibold text-stone-800">
            {ui.summaryCurveTitle}
          </div>
          <svg
            viewBox="0 0 420 96"
            className="w-full h-24 overflow-visible"
            role="img"
            aria-label={ui.summaryCurveTitle}
          >
            {[1, 5, 10].map((lvl) => {
              const y = 84 - ((lvl - 1) / 9) * 72;
              return (
                <g key={lvl}>
                  <line x1="24" y1={y} x2="412" y2={y} stroke="#E7E5E4" strokeWidth="1" />
                  <text
                    x="18"
                    y={y + 3}
                    textAnchor="end"
                    fontSize="9"
                    fill="#78716C"
                    fontFamily="monospace"
                  >
                    {lvl}
                  </text>
                </g>
              );
            })}
            {records.length > 1 && (
              <polyline
                fill="none"
                stroke="#1E3A8A"
                strokeWidth="2"
                points={records
                  .map((r, i) => {
                    const x = 30 + (i / Math.max(1, EXAM_TOTAL_QUESTIONS - 1)) * 376;
                    const y = 84 - ((r.difficulty - 1) / 9) * 72;
                    return `${x.toFixed(1)},${y.toFixed(1)}`;
                  })
                  .join(' ')}
              />
            )}
            {records.map((r, i) => {
              const x = 30 + (i / Math.max(1, EXAM_TOTAL_QUESTIONS - 1)) * 376;
              const y = 84 - ((r.difficulty - 1) / 9) * 72;
              const fill =
                r.outcome === 'correct'
                  ? '#059669'
                  : r.outcome === 'wrong'
                    ? '#DC2626'
                    : '#D97706';
              return <circle key={i} cx={x} cy={y} r="3.5" fill={fill} />;
            })}
          </svg>
        </div>

        {/* Mini Monthly Top 5 Preview */}
        {savedTop5.length > 0 && (
          <div className="bg-white border border-stone-200 rounded-xs p-3.5 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs font-sans font-semibold text-stone-800">
                {ui.leaderboardTitle} (Top 5)
              </div>
              <div className="text-[11px] font-sans text-stone-500">
                {ui.leaderboardTieBreakNote}
              </div>
            </div>
            <div className="divide-y divide-stone-100 text-xs font-mono tabular-nums">
              {savedTop5.map((row) => {
                const rowDurMs = row.totalDurationMs ?? (row.totalDurationSeconds || 0) * 1000;
                return (
                  <div
                    key={row.username}
                    className="py-1.5 flex items-center justify-between gap-2"
                  >
                    <span className="text-stone-800">
                      <strong>#{row.rank}</strong> @{row.username}
                    </span>
                    <span className="flex items-center gap-2.5 whitespace-nowrap">
                      <span className="text-stone-500 text-[11px]">
                        {formatExamDurationMs(rowDurMs, true)}
                      </span>
                      <span className="font-bold text-emerald-800">
                        {row.totalScore.toLocaleString(language)} {ui.pointsUnit}
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => startFreshExamSession()}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1E3A8A] hover:bg-[#172D6B] rounded-xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{ui.retakeExamBtn}</span>
            </button>
            <button
              type="button"
              onClick={jumpToLeaderboard}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-stone-800 bg-white hover:bg-stone-100 border border-stone-300 rounded-xs cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5 text-[#1E3A8A]" />
              <span>{ui.openLeaderboardBtn}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setUsernameInput('');
                setUsernameError(null);
                setUsernameTakenCollision(false);
                setUsernameSuggestions([]);
                setPhase('USERNAME_GATE');
              }}
              className="px-3 py-2 text-xs font-medium text-stone-700 bg-white hover:bg-stone-100 border border-stone-300 rounded-xs cursor-pointer"
            >
              {ui.usernameChangeBtn}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setPhase('IDLE')}
            className="px-3.5 py-2 text-xs font-medium text-stone-700 bg-white hover:bg-stone-100 border border-stone-300 rounded-xs cursor-pointer"
          >
            {ui.closeExamBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
