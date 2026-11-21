import React, { useEffect, useRef, useState } from 'react';
import { Check, Copy, FileText, Link2, Share2 } from 'lucide-react';
import type { Article, LanguageCode } from '../types';
import { getLocalizedText } from '../i18n/translations';
import { detectEntrySourceLanguage, getLocalizedArticlePath } from '../utils/articleLocale';

interface ArticleShareMenuProps {
  article: Article;
  language: LanguageCode;
  onNotify: (message: string) => void;
}

export const ArticleShareMenu: React.FC<ArticleShareMenuProps> = ({
  article,
  language,
  onNotify,
}) => {
  const [open, setOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const handleOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  const title = getLocalizedText(article.title, language);
  const sourceLang =
    article.sourceLang ||
    detectEntrySourceLanguage(
      getLocalizedText(article.title, 'tr'),
      getLocalizedText(article.abstract, 'tr')
    );
  const canonicalUrl = `https://emrepelit-sciphi.ai.studio${getLocalizedArticlePath(
    sourceLang,
    article.slug
  )}`;
  const year = (article.publishedAt || '2026').slice(0, 4);

  const apaCitation = `Pelit, E. (${year}). ${title}. Emre Pelit — Sci-Phil Bilim, Felsefe ve Simülasyon Arşivi. ${canonicalUrl}`;
  const bibtexKey = `pelit${year}_${article.slug.replace(/[^a-z0-9]/gi, '').slice(0, 18)}`;
  const bibtexCitation = `@article{${bibtexKey},\n  author = {Emre Pelit},\n  title = {${title}},\n  year = {${year}},\n  publisher = {Emre Pelit Sci-Phil Archive},\n  url = {${canonicalUrl}}\n}`;

  const copyText = async (key: string, text: string, successTr: string, successEn: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      onNotify(language === 'tr' ? successTr : successEn);
      setTimeout(() => setCopiedKey(null), 1800);
      setOpen(false);
    } catch {
      onNotify(language === 'tr' ? 'Panoya kopyalama desteklenmedi.' : 'Clipboard copy unavailable.');
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: `${title} — Emre Pelit`,
          text: getLocalizedText(article.abstract, language).slice(0, 180),
          url: canonicalUrl,
        });
        setOpen(false);
        return;
      } catch {
        // User canceled or unavailable — fall through to copy
      }
    }
    await copyText(
      'link',
      canonicalUrl,
      'Kanonik makale bağlantısı panoya kopyalandı.',
      'Canonical essay link copied to clipboard.'
    );
  };

  const isTr = language === 'tr';

  return (
    <div ref={menuRef} className="relative inline-block">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-mono text-stone-700 bg-white border border-stone-300 hover:border-[#1E3A8A] hover:text-[#1E3A8A] rounded-sm transition-colors cursor-pointer whitespace-nowrap"
      >
        <Share2 aria-hidden="true" className="w-3.5 h-3.5" />
        <span>{isTr ? 'Paylaş / Atıf' : 'Share / Cite'}</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 sm:right-0 sm:left-auto mt-1.5 w-64 bg-white border border-stone-300 shadow-lg z-40 py-1 text-xs font-mono text-stone-800"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() =>
              copyText(
                'link',
                canonicalUrl,
                'Kanonik makale bağlantısı panoya kopyalandı.',
                'Canonical essay link copied.'
              )
            }
            className="w-full px-3.5 py-2 text-left hover:bg-[#FBF9F5] flex items-center justify-between gap-2 cursor-pointer"
          >
            <span className="inline-flex items-center gap-2">
              <Link2 aria-hidden="true" className="w-3.5 h-3.5 text-[#1E3A8A]" />
              <span>{isTr ? 'Kanonik Bağlantıyı Kopyala' : 'Copy Canonical Link'}</span>
            </span>
            {copiedKey === 'link' && <Check className="w-3.5 h-3.5 text-emerald-700" />}
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={() =>
              copyText(
                'apa',
                apaCitation,
                'APA akademik atıf formatı panoya kopyalandı.',
                'APA citation copied to clipboard.'
              )
            }
            className="w-full px-3.5 py-2 text-left hover:bg-[#FBF9F5] flex items-center justify-between gap-2 cursor-pointer"
          >
            <span className="inline-flex items-center gap-2">
              <Copy aria-hidden="true" className="w-3.5 h-3.5 text-[#1E3A8A]" />
              <span>{isTr ? 'APA Atıf Kopyala' : 'Copy APA Citation'}</span>
            </span>
            {copiedKey === 'apa' && <Check className="w-3.5 h-3.5 text-emerald-700" />}
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={() =>
              copyText(
                'bibtex',
                bibtexCitation,
                'BibTeX atıf kaydı panoya kopyalandı.',
                'BibTeX entry copied to clipboard.'
              )
            }
            className="w-full px-3.5 py-2 text-left hover:bg-[#FBF9F5] flex items-center justify-between gap-2 cursor-pointer"
          >
            <span className="inline-flex items-center gap-2">
              <FileText aria-hidden="true" className="w-3.5 h-3.5 text-[#1E3A8A]" />
              <span>{isTr ? 'BibTeX Kopyala' : 'Copy BibTeX'}</span>
            </span>
            {copiedKey === 'bibtex' && <Check className="w-3.5 h-3.5 text-emerald-700" />}
          </button>

          <div className="my-1 border-t border-stone-200" />

          <button
            type="button"
            role="menuitem"
            onClick={handleNativeShare}
            className="w-full px-3.5 py-2 text-left hover:bg-[#FBF9F5] flex items-center gap-2 text-[#1E3A8A] font-semibold cursor-pointer"
          >
            <Share2 aria-hidden="true" className="w-3.5 h-3.5" />
            <span>{isTr ? 'Cihazla Paylaş…' : 'Share via Device…'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
