import React, { useState, useMemo, useEffect } from 'react';
import {
  CheckCircle2,
  CircleDot,
  RotateCcw,
  GraduationCap,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { Article, LanguageCode } from '../types';
import { getLocalizedText } from '../i18n/translations';
import {
  buildArticleQuizQuestions,
  getLearningUiStrings,
} from '../utils/articleLearningEngine';

interface ArticleQuizModuleProps {
  article: Article;
  language: LanguageCode;
  onQuizCompletedMeasured?: (articleId: string, correctCount: number, totalCount: number) => void;
}

export const ArticleQuizModule: React.FC<ArticleQuizModuleProps> = ({
  article,
  language,
  onQuizCompletedMeasured,
}) => {
  const ui = getLearningUiStrings(language);
  const articleTitle = getLocalizedText(article.title, language);
  const questions = useMemo(
    () => buildArticleQuizQuestions(article, language),
    [article, language]
  );

  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [reportedCompletion, setReportedCompletion] = useState<boolean>(false);

  // Reset quiz cleanly when article or language changes
  useEffect(() => {
    setCurrentIdx(0);
    setSelectedAnswers({});
    setReportedCompletion(false);
  }, [article.id, language]);

  const activeQ = questions[currentIdx] || questions[0];
  const answeredCount = Object.keys(selectedAnswers).length;
  const correctCount = questions.reduce(
    (acc, q) => (selectedAnswers[q.id] === q.correctIndex ? acc + 1 : acc),
    0
  );
  const isFinished = answeredCount === questions.length;
  const currentSelected = activeQ ? selectedAnswers[activeQ.id] : undefined;
  const isCurrentAnswered = typeof currentSelected === 'number';
  const isCurrentCorrect = isCurrentAnswered && currentSelected === activeQ.correctIndex;

  useEffect(() => {
    if (isFinished && !reportedCompletion) {
      setReportedCompletion(true);
      onQuizCompletedMeasured?.(article.id, correctCount, questions.length);
    }
  }, [isFinished, reportedCompletion, article.id, correctCount, questions.length, onQuizCompletedMeasured]);

  const handleSelectOption = (optIdx: number) => {
    if (!activeQ || isCurrentAnswered) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [activeQ.id]: optIdx,
    }));
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setCurrentIdx(0);
    setReportedCompletion(false);
  };

  if (!activeQ) return null;

  return (
    <div className="bg-[#FBF9F5] border border-stone-300 rounded-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-[#F2EFE7] border-b border-stone-300 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <GraduationCap className="w-4 h-4 text-[#1E3A8A] shrink-0" />
          <div className="min-w-0">
            <h4 className="text-sm font-editorial font-bold text-stone-900 truncate">
              {ui.quizTitlePrefix} — {articleTitle}
            </h4>
            <p className="text-[11px] font-sans text-stone-600">{ui.quizSubtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono tabular-nums shrink-0">
          <span className="text-stone-700 font-semibold">
            {ui.questionLabel} {currentIdx + 1} / {questions.length}
          </span>
          <span className="text-stone-400">·</span>
          <span className="text-emerald-800 font-bold">
            {ui.scoreLabel}: {correctCount} / {answeredCount || questions.length}
          </span>
          {answeredCount > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 rounded-xs cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{ui.resetQuizBtn}</span>
            </button>
          )}
        </div>
      </div>

      {/* Question Stepper Pills (Interactive Segmented Navigation) */}
      <div className="px-4 pt-3 flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
        {questions.map((q, idx) => {
          const ans = selectedAnswers[q.id];
          const isAns = typeof ans === 'number';
          const isRight = isAns && ans === q.correctIndex;
          const isCurrent = idx === currentIdx;
          return (
            <button
              key={q.id}
              type="button"
              onClick={() => setCurrentIdx(idx)}
              className={`px-2.5 py-1 rounded-xs border transition-colors cursor-pointer tabular-nums ${
                isCurrent
                  ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] font-bold'
                  : isAns
                    ? isRight
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-400 font-semibold'
                      : 'bg-amber-50 text-amber-950 border-amber-400 font-semibold'
                    : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
              }`}
            >
              {isAns ? (isRight ? '✓ ' : '○ ') : ''}
              {ui.questionLabel} {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Active Question Body */}
      <div className="p-4 space-y-3">
        <p className="text-sm font-academic-body font-semibold text-stone-900 leading-relaxed">
          {activeQ.prompt}
        </p>

        <div className="grid grid-cols-1 gap-2">
          {activeQ.options.map((opt, idx) => {
            const letter = ['A', 'B', 'C', 'D'][idx] || String(idx + 1);
            const isSelected = currentSelected === idx;
            const isCorrectOpt = idx === activeQ.correctIndex;

            let optionClasses =
              'bg-white hover:bg-stone-50 border-stone-300 text-stone-800';
            if (isCurrentAnswered) {
              if (isCorrectOpt) {
                optionClasses =
                  'bg-emerald-50 border-emerald-600 text-emerald-950 font-semibold';
              } else if (isSelected) {
                optionClasses =
                  'bg-amber-50 border-amber-600 text-amber-950';
              } else {
                optionClasses = 'bg-stone-50 border-stone-200 text-stone-500';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={isCurrentAnswered}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left px-3.5 py-2.5 text-xs sm:text-sm font-sans border rounded-xs transition-colors flex items-start gap-2.5 ${
                  isCurrentAnswered ? 'cursor-default' : 'cursor-pointer'
                } ${optionClasses}`}
              >
                <span className="font-mono font-bold shrink-0 px-1.5 py-0.5 bg-stone-100 text-stone-800 border border-stone-300 rounded-xs text-[11px]">
                  {letter}
                </span>
                <span className="flex-1 leading-relaxed">{opt}</span>
                {isCurrentAnswered && isCorrectOpt && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                )}
                {isCurrentAnswered && isSelected && !isCorrectOpt && (
                  <CircleDot className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Rich Conceptual Feedback & Explanation */}
        {isCurrentAnswered && (
          <div
            className={`p-3.5 border rounded-xs space-y-2 text-xs ${
              isCurrentCorrect
                ? 'bg-emerald-50/90 border-emerald-500 text-emerald-950'
                : 'bg-amber-50/90 border-amber-500 text-amber-950'
            }`}
          >
            <div className="font-mono font-bold">
              {isCurrentCorrect ? ui.correctBadge : ui.reviewBadge}
            </div>
            <p className="font-sans leading-relaxed">{activeQ.explanation}</p>
            <p className="font-sans text-[11px] opacity-85 italic">{activeQ.freedomNote}</p>

            <div className="pt-1 flex flex-wrap items-center justify-between gap-2">
              {currentIdx < questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentIdx((i) => Math.min(questions.length - 1, i + 1))}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#1E3A8A] hover:bg-[#172E6E] text-white font-mono text-xs font-semibold rounded-xs cursor-pointer"
                >
                  <span>{ui.nextQuestionBtn}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                isFinished && (
                  <span className="font-mono font-bold text-emerald-900">
                    ✓ {ui.completedBanner} ({correctCount} / {questions.length})
                  </span>
                )
              )}
            </div>
          </div>
        )}

        {/* Legal & Freedom-of-Thought Assurance */}
        <div className="pt-1.5 border-t border-stone-200 flex items-start gap-1.5 text-[11px] text-stone-600">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
          <span>{ui.freedomQuizNote}</span>
        </div>
      </div>
    </div>
  );
};
