import React, { useMemo, useState } from 'react';
import { Check, Copy, Download, Quote } from 'lucide-react';
import { Article, LanguageCode } from '../types';
import { getLocalizedText } from '../i18n/translations';
import { detectEntrySourceLanguage, getLocalizedArticlePath } from '../utils/articleLocale';

type CitationFormat = 'bibtex' | 'apa' | 'mla';

interface CitationExportBoxProps {
  article: Article;
  language: LanguageCode;
  onCitationExported?: (format: CitationFormat) => void;
  compact?: boolean;
}

export const CitationExportBox: React.FC<CitationExportBoxProps> = ({
  article,
  language,
  onCitationExported,
  compact = false,
}) => {
  const [format, setFormat] = useState<CitationFormat>('apa');
  const [copied, setCopied] = useState(false);

  const title = getLocalizedText(article.title, language);
  const year = (article.publishedAt || '2026-11-01').slice(0, 4);
  const archiveCode = `SCIPHIL-#${article.figureNumber.replace(/[^0-9]/g, '') || article.id.slice(-3)}`;

  const canonicalUrl = useMemo(() => {
    const srcLang =
      article.sourceLang ||
      detectEntrySourceLanguage(
        getLocalizedText(article.title, 'tr'),
        getLocalizedText(article.abstract, 'tr')
      );
    return `https://emrepelit-sciphi.ai.studio${getLocalizedArticlePath(srcLang, article.slug)}`;
  }, [article]);

  const citations = useMemo<Record<CitationFormat, string>>(() => {
    const cleanKey = `Pelit_${year}_${article.id.replace(/[^a-zA-Z0-9]/g, '_')}`;

    const bibtex = `@article{${cleanKey},
  author = {Pelit, Emre},
  title = {{${title}}},
  journal = {Emre Pelit — Sci-Phil Bilim, Felsefe ve Simülasyon Arşivi},
  year = {${year}},
  note = {Arşiv Sicili: ${archiveCode} | Münhasır Yazar: Emre Pelit},
  url = {${canonicalUrl}}
}`;

    const formattedDate = article.publishedAt || `${year}-11-01`;
    const apa = `Pelit, E. (${formattedDate}). ${title}. Emre Pelit — Sci-Phil Bilim, Felsefe ve Simülasyon Arşivi (${archiveCode}). ${canonicalUrl}`;

    const mlaDateParts = formattedDate.split('-');
    const mlaDate =
      mlaDateParts.length === 3
        ? `${mlaDateParts[2]}.${mlaDateParts[1]}.${mlaDateParts[0]}`
        : year;
    const mla = `Pelit, Emre. "${title}." Emre Pelit — Sci-Phil Bilim, Felsefe ve Simülasyon Arşivi, ${archiveCode}, ${mlaDate}, ${canonicalUrl}.`;

    return { bibtex, apa, mla };
  }, [article, archiveCode, canonicalUrl, title, year]);

  const activeText = citations[format];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeText);
      setCopied(true);
      onCitationExported?.(format);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard fallback in restricted frames
    }
  };

  const handleDownloadBib = () => {
    const blob = new Blob([citations.bibtex], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Pelit_${article.slug.slice(0, 48)}.bib`;
    a.click();
    URL.revokeObjectURL(url);
    onCitationExported?.('bibtex');
  };

  return (
    <div
      className={`border border-stone-300 bg-[#FBF9F5] rounded-xs ${
        compact ? 'p-3 space-y-2' : 'p-4 space-y-2.5'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-stone-800">
          <Quote className="w-3.5 h-3.5 text-[#1E3A8A]" />
          <span>Kaynakça &amp; Atıf Oluşturucu ({archiveCode})</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <div
            role="tablist"
            aria-label="Atıf Formatı Seçimi"
            className="inline-flex items-center p-0.5 bg-stone-200/80 rounded-xs border border-stone-300"
          >
            {(
              [
                { id: 'apa', label: 'APA 7' },
                { id: 'mla', label: 'MLA 9' },
                { id: 'bibtex', label: 'BibTeX' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={format === tab.id}
                onClick={() => setFormat(tab.id)}
                className={`px-2.5 py-1 text-[11px] font-mono rounded-xs transition-colors cursor-pointer whitespace-nowrap ${
                  format === tab.id
                    ? 'bg-white text-[#1E3A8A] font-bold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono font-semibold text-white bg-[#1E3A8A] hover:bg-[#172E6E] rounded-xs transition-colors cursor-pointer whitespace-nowrap"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Kopyalandı' : 'Tek Tıkla Kopyala'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadBib}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono text-stone-700 bg-white hover:bg-stone-100 border border-stone-300 rounded-xs transition-colors cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3 h-3" />
            <span>.bib</span>
          </button>
        </div>
      </div>

      <pre className="p-2.5 bg-white border border-stone-200 text-[11px] font-mono text-stone-800 whitespace-pre-wrap break-all leading-relaxed select-all">
        {activeText}
      </pre>
    </div>
  );
};
