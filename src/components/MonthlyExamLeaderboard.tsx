import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, RefreshCw, Calendar, Clock, Award } from 'lucide-react';
import type { LanguageCode } from '../types';
import { formatExamDurationMs, getExamUiStrings } from '../utils/articleAdaptiveExamEngine';

export interface MonthlyStandingItem {
  rank: number;
  username: string;
  totalScore: number;
  totalDurationMs?: number;
  totalDurationSeconds?: number;
  examsCompleted: number;
  totalCorrect: number;
  totalBlank: number;
  totalWrong: number;
  bestSingleExamScore: number;
  peakDifficulty: number;
  lastAttemptAt: string;
}

interface MonthArchiveMeta {
  monthId: string;
  isFinalized: boolean;
  participantsCount: number;
}

interface LeaderboardApiResponse {
  ok: boolean;
  currentMonthId: string;
  monthId: string;
  isFinalizedMonth: boolean;
  monthEndIso: string;
  daysRemainingInMonth: number;
  hoursRemainingInMonth: number;
  rankings: MonthlyStandingItem[];
  totalParticipants: number;
  availableMonths: MonthArchiveMeta[];
  myStanding: MonthlyStandingItem | null;
}

interface MonthlyExamLeaderboardProps {
  language: LanguageCode;
  getAuthToken?: () => Promise<string | null>;
}

const PUBLIC_USERNAME_KEY = 'sciphil_exam_public_username_v1';

function readStoredUsername(): string {
  if (typeof window === 'undefined') return '';
  try {
    const raw = window.localStorage.getItem(PUBLIC_USERNAME_KEY);
    if (raw && raw.trim().length >= 3) return raw.trim();
  } catch {
    // Ignore storage read failure
  }
  return '';
}

function formatMonthLabel(monthId: string, lang: LanguageCode): string {
  const m = /^(\d{4})-(\d{2})$/.exec(monthId);
  if (!m) return monthId;
  try {
    const dt = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, 15));
    return new Intl.DateTimeFormat(lang, {
      year: 'numeric',
      month: 'long',
      timeZone: 'UTC',
    }).format(dt);
  } catch {
    return monthId;
  }
}

export const MonthlyExamLeaderboard: React.FC<MonthlyExamLeaderboardProps> = ({
  language,
  getAuthToken,
}) => {
  const ui = getExamUiStrings(language);
  const [selectedMonth, setSelectedMonth] = useState<string>('current');
  const [data, setData] = useState<LeaderboardApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeUsername, setActiveUsername] = useState<string>(() => readStoredUsername());

  const fetchLeaderboard = useCallback(
    async (monthParam: string) => {
      setLoading(true);
      try {
        const storedName = readStoredUsername();
        const params = new URLSearchParams({ month: monthParam });
        if (storedName) params.set('username', storedName);

        const headers: Record<string, string> = {};
        if (getAuthToken) {
          const idToken = await getAuthToken().catch(() => null);
          if (idToken) headers.Authorization = `Bearer ${idToken}`;
        }

        const res = await fetch(`/api/exams/leaderboard?${params.toString()}`, {
          headers,
          credentials: 'same-origin',
        });
        if (res.ok) {
          const json: LeaderboardApiResponse = await res.json();
          if (json?.ok) {
            setData(json);
          }
        }
      } catch {
        // Non-fatal
      } finally {
        setLoading(false);
      }
    },
    [getAuthToken]
  );

  useEffect(() => {
    void fetchLeaderboard(selectedMonth);
  }, [selectedMonth, fetchLeaderboard]);

  useEffect(() => {
    const handleUpdate = () => {
      setActiveUsername(readStoredUsername());
      void fetchLeaderboard(selectedMonth);
    };
    window.addEventListener('sciphil:monthly-exam-leaderboard-updated', handleUpdate);
    window.addEventListener('sciphil:exam-username-updated', handleUpdate);
    return () => {
      window.removeEventListener('sciphil:monthly-exam-leaderboard-updated', handleUpdate);
      window.removeEventListener('sciphil:exam-username-updated', handleUpdate);
    };
  }, [selectedMonth, fetchLeaderboard]);

  const countdownText = ui.leaderboardCountdownLabel
    .replace('{days}', String(data?.daysRemainingInMonth ?? 0))
    .replace('{hours}', String(data?.hoursRemainingInMonth ?? 0));

  const displayMonthName = data?.monthId ? formatMonthLabel(data.monthId, language) : '';

  return (
    <section
      id="monthly-exam-leaderboard"
      className="no-print bg-[#FBF9F5] border border-stone-300 rounded-sm overflow-hidden scroll-mt-24"
    >
      {/* Header Bar */}
      <div className="px-5 py-4 bg-[#F2EFE7] border-b border-stone-300 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600 font-sans">
            <Trophy className="w-4 h-4 text-[#1E3A8A] shrink-0" />
            <span className="font-semibold text-[#1E3A8A]">
              {data?.isFinalizedMonth
                ? ui.leaderboardFinalizedMonthBadge
                : ui.leaderboardCurrentMonthBadge}
            </span>
            {displayMonthName && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-medium text-stone-800">{displayMonthName}</span>
              </>
            )}
            {data && !data.isFinalizedMonth && (
              <>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1 font-mono tabular-nums text-stone-700">
                  <Clock className="w-3.5 h-3.5 text-stone-500" />
                  {countdownText}
                </span>
              </>
            )}
          </div>
          <h2 className="text-xl font-editorial font-bold text-stone-900">
            {ui.leaderboardTitle}
          </h2>
          <p className="text-xs sm:text-sm font-sans text-stone-600 max-w-3xl leading-relaxed">
            {ui.leaderboardSubtitle}
          </p>
          <p className="text-xs font-sans text-[#1E3A8A]/90 font-medium leading-snug">
            {ui.leaderboardTieBreakNote}
          </p>
        </div>

        {/* Controls: Month Selector + Refresh */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <label className="inline-flex items-center gap-2 text-xs font-sans text-stone-700 bg-white border border-stone-300 px-3 py-2 rounded-xs">
            <Calendar className="w-3.5 h-3.5 text-stone-500 shrink-0" />
            <span className="whitespace-nowrap">{ui.leaderboardMonthLabel}:</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent font-mono font-semibold text-stone-900 focus:outline-none cursor-pointer"
            >
              {(data?.availableMonths || []).length > 0 ? (
                data!.availableMonths.map((m) => (
                  <option key={m.monthId} value={m.monthId === data?.currentMonthId ? 'current' : m.monthId}>
                    {formatMonthLabel(m.monthId, language)} ({m.participantsCount})
                  </option>
                ))
              ) : (
                <option value="current">{displayMonthName || ui.leaderboardMonthLabel}</option>
              )}
            </select>
          </label>

          <button
            type="button"
            onClick={() => void fetchLeaderboard(selectedMonth)}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-stone-800 bg-white hover:bg-stone-100 border border-stone-300 rounded-xs transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{ui.leaderboardRefreshBtn}</span>
          </button>
        </div>
      </div>

      {/* Caller's Own Standing Bar (if participating) */}
      {data?.myStanding && (
        <div className="px-5 py-3 bg-[#EEF2FA] border-b border-stone-300 flex flex-wrap items-center justify-between gap-3 text-xs font-sans">
          <div className="flex items-center gap-2 text-stone-900">
            <Award className="w-4 h-4 text-[#1E3A8A] shrink-0" />
            <span className="font-semibold">{ui.leaderboardYourStanding}:</span>
            <span className="font-mono font-bold text-[#1E3A8A]">@{data.myStanding.username}</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 font-mono tabular-nums text-stone-800">
            <span>
              {ui.leaderboardRankCol}: <strong>#{data.myStanding.rank}</strong>
            </span>
            <span aria-hidden="true" className="text-stone-400">·</span>
            <span>
              {ui.leaderboardScoreCol}:{' '}
              <strong className="text-emerald-800">
                {data.myStanding.totalScore.toLocaleString(language)} {ui.pointsUnit}
              </strong>
            </span>
            <span aria-hidden="true" className="text-stone-400">·</span>
            <span>
              {ui.leaderboardTimeCol}:{' '}
              <strong>
                {formatExamDurationMs(
                  data.myStanding.totalDurationMs ?? (data.myStanding.totalDurationSeconds || 0) * 1000,
                  true
                )}
              </strong>
            </span>
            <span aria-hidden="true" className="text-stone-400">·</span>
            <span>
              {ui.leaderboardExamsCol}: <strong>{data.myStanding.examsCompleted}</strong>
            </span>
          </div>
        </div>
      )}

      {/* Rankings Table */}
      <div className="p-5">
        {!data || data.rankings.length === 0 ? (
          <div className="py-8 px-4 text-center border border-dashed border-stone-300 rounded-xs bg-white space-y-2">
            <p className="text-sm font-sans text-stone-700">{ui.leaderboardEmpty}</p>
            <p className="text-xs font-mono text-stone-500 tabular-nums">
              {ui.ruleCorrect} · {ui.ruleBlank} · {ui.ruleWrong} · {ui.ruleAdaptive}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-stone-200 rounded-xs bg-white">
            <table className="w-full text-left border-collapse text-xs sm:text-sm font-sans tabular-nums">
              <thead>
                <tr className="bg-[#F6F3EC] border-b border-stone-200 text-stone-600 text-xs">
                  <th className="py-2.5 px-3.5 font-semibold">{ui.leaderboardRankCol}</th>
                  <th className="py-2.5 px-3.5 font-semibold">{ui.leaderboardUserCol}</th>
                  <th className="py-2.5 px-3.5 font-semibold text-right">{ui.leaderboardScoreCol}</th>
                  <th className="py-2.5 px-3.5 font-semibold text-right">{ui.leaderboardTimeCol}</th>
                  <th className="py-2.5 px-3.5 font-semibold text-right">{ui.leaderboardExamsCol}</th>
                  <th className="py-2.5 px-3.5 font-semibold text-right">{ui.leaderboardCorrectCol}</th>
                  <th className="py-2.5 px-3.5 font-semibold text-right">{ui.leaderboardPeakCol}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {data.rankings.map((row) => {
                  const isMe =
                    activeUsername &&
                    row.username.toLowerCase() === activeUsername.toLowerCase();
                  const rowDurMs = row.totalDurationMs ?? (row.totalDurationSeconds || 0) * 1000;
                  return (
                    <tr
                      key={`${data.monthId}-${row.username}`}
                      className={isMe ? 'bg-[#EEF2FA]' : 'hover:bg-stone-50/80'}
                    >
                      <td className="py-2.5 px-3.5 font-mono font-bold text-stone-800 whitespace-nowrap">
                        {row.rank === 1
                          ? '#1'
                          : row.rank === 2
                            ? '#2'
                            : row.rank === 3
                              ? '#3'
                              : `#${row.rank}`}
                      </td>
                      <td className="py-2.5 px-3.5 font-mono font-semibold text-stone-900">
                        @{row.username}
                      </td>
                      <td className="py-2.5 px-3.5 font-mono font-bold text-right text-emerald-800 whitespace-nowrap">
                        {row.totalScore.toLocaleString(language)} {ui.pointsUnit}
                      </td>
                      <td className="py-2.5 px-3.5 font-mono text-right text-[#1E3A8A] font-medium whitespace-nowrap">
                        {formatExamDurationMs(rowDurMs, true)}
                      </td>
                      <td className="py-2.5 px-3.5 font-mono text-right text-stone-700">
                        {row.examsCompleted}
                      </td>
                      <td className="py-2.5 px-3.5 font-mono text-right text-stone-700">
                        {row.totalCorrect}
                      </td>
                      <td className="py-2.5 px-3.5 font-mono text-right text-stone-700">
                        {row.peakDifficulty}/10
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500 font-sans">
          <span>{ui.usernameKvkkNote}</span>
          <span className="font-mono tabular-nums">
            {data?.totalParticipants ?? 0} {ui.leaderboardParticipantsUnit}
          </span>
        </div>
      </div>
    </section>
  );
};
