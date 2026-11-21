import React, { useMemo } from 'react';
import { ArrowRight, Compass } from 'lucide-react';
import type { Article, LanguageCode } from '../types';
import { getLocalizedText } from '../i18n/translations';

interface RelatedArticlesStripProps {
  currentArticle: Article;
  allArticles: Article[];
  language: LanguageCode;
  onSelectArticle: (articleId: string) => void;
}

const STOP_WORDS = new Set([
  'bir', 've', 'ile', 'için', 'olan', 'olarak', 'gibi', 'daha', 'değil', 'ancak', 'fakat', 'üzerine',
  'nedir', 'neden', 'kadar', 'veya', 'ama', 'the', 'and', 'for', 'with', 'that', 'this', 'from', 'into',
  'about', 'between', 'what', 'when', 'where', 'which', 'their', 'there', 'have', 'been', 'will', 'would',
]);

function extractTokens(text: string): Set<string> {
  const words = text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 4 && !STOP_WORDS.has(w));
  return new Set(words);
}

export const RelatedArticlesStrip: React.FC<RelatedArticlesStripProps> = ({
  currentArticle,
  allArticles,
  language,
  onSelectArticle,
}) => {
  const relatedArticles = useMemo(() => {
    const baseText = `${getLocalizedText(currentArticle.title, language)} ${getLocalizedText(
      currentArticle.abstract,
      language
    )}`;
    const baseTokens = extractTokens(baseText);

    const scored = allArticles
      .filter((candidate) => candidate.id !== currentArticle.id)
      .map((candidate) => {
        let score = 0;
        if (candidate.category === currentArticle.category) score += 4;
        if (candidate.simulation?.type && candidate.simulation.type === currentArticle.simulation?.type) {
          score += 3;
        }
        if (candidate.sourceLang && candidate.sourceLang === currentArticle.sourceLang) {
          score += 1.5;
        }

        const candText = `${getLocalizedText(candidate.title, language)} ${getLocalizedText(
          candidate.abstract,
          language
        )}`;
        const candTokens = extractTokens(candText);
        let shared = 0;
        for (const token of baseTokens) {
          if (candTokens.has(token)) {
            shared += 1;
            if (shared >= 6) break;
          }
        }
        score += shared * 2;
        return { article: candidate, score, shared };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    return scored;
  }, [currentArticle, allArticles, language]);

  if (relatedArticles.length === 0) return null;

  const heading =
    language === 'tr'
      ? 'Kavramsal Okuma Rotası — İlgili Makaleler'
      : 'Conceptual Reading Path — Related Essays';
  const subLabel =
    language === 'tr'
      ? 'Aynı tema, ortak kavramlar ve simülasyon modeli temelinde önerilen devam okumaları'
      : 'Recommended continuation essays matched by discipline, shared concepts, and simulation model';

  return (
    <section
      aria-label={heading}
      className="no-print pt-6 border-t border-stone-200 space-y-3"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#1E3A8A] font-semibold">
          <Compass aria-hidden="true" className="w-3.5 h-3.5 shrink-0" />
          <span>{heading}</span>
        </div>
        <p className="text-xs text-stone-500">{subLabel}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {relatedArticles.map(({ article: rel }) => {
          const relTitle = getLocalizedText(rel.title, language);
          const relAbstract = getLocalizedText(rel.abstract, language);
          return (
            <button
              key={rel.id}
              type="button"
              onClick={() => onSelectArticle(rel.id)}
              className="group text-left bg-[#FBF9F5] hover:bg-stone-100/90 border border-stone-200 hover:border-[#1E3A8A]/60 p-4 flex flex-col justify-between gap-3 transition-colors cursor-pointer"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-stone-500 truncate">
                  <span className="truncate">{rel.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums shrink-0">{rel.readTimeMinutes} dk</span>
                </div>
                <h4 className="font-editorial text-base font-semibold text-stone-900 group-hover:text-[#1E3A8A] leading-snug line-clamp-2 transition-colors">
                  {relTitle}
                </h4>
                <p className="text-xs font-academic-body text-stone-600 line-clamp-2 leading-relaxed">
                  {relAbstract}
                </p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-stone-200/70 text-[11px] font-mono text-[#1E3A8A] font-semibold">
                <span>{language === 'tr' ? 'Okumaya Geç' : 'Read Essay'}</span>
                <ArrowRight
                  aria-hidden="true"
                  className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
                />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
