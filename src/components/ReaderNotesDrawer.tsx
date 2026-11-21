import React, { useEffect, useState } from 'react';
import { BookMarked, Download, Plus, ShieldCheck, Trash2, X } from 'lucide-react';
import type { LanguageCode } from '../types';

export const READER_NOTES_STORAGE_KEY = 'emre_pelit_reader_notes_v1';

export interface ReaderNoteItem {
  id: string;
  articleId: string;
  articleTitle: string;
  text: string;
  quote?: string;
  createdAt: string;
}

interface ReaderNotesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeArticleId: string;
  activeArticleTitle: string;
  language: LanguageCode;
  onNotify: (message: string) => void;
  onJumpToArticle?: (articleId: string) => void;
}

function loadNotes(): ReaderNoteItem[] {
  try {
    const raw = window.localStorage.getItem(READER_NOTES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export const ReaderNotesDrawer: React.FC<ReaderNotesDrawerProps> = ({
  isOpen,
  onClose,
  activeArticleId,
  activeArticleTitle,
  language,
  onNotify,
  onJumpToArticle,
}) => {
  const [notes, setNotes] = useState<ReaderNoteItem[]>(() =>
    typeof window !== 'undefined' ? loadNotes() : []
  );
  const [noteText, setNoteText] = useState('');
  const [quoteText, setQuoteText] = useState('');
  const [scopeFilter, setScopeFilter] = useState<'current' | 'all'>('current');

  useEffect(() => {
    if (isOpen) {
      setNotes(loadNotes());
    }
  }, [isOpen]);

  const persistNotes = (next: ReaderNoteItem[]) => {
    setNotes(next);
    try {
      window.localStorage.setItem(READER_NOTES_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage quota issues
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = noteText.trim();
    if (!clean) return;
    const item: ReaderNoteItem = {
      id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      articleId: activeArticleId || 'archive',
      articleTitle: activeArticleTitle || 'Sci-Phil Arşivi',
      text: clean,
      quote: quoteText.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
    persistNotes([item, ...notes]);
    setNoteText('');
    setQuoteText('');
    onNotify(
      language === 'tr'
        ? 'Kişisel not tarayıcınıza kaydedildi (sunucuya gönderilmez).'
        : 'Personal note saved locally in your browser.'
    );
  };

  const handleDeleteNote = (id: string) => {
    persistNotes(notes.filter((n) => n.id !== id));
    onNotify(language === 'tr' ? 'Not silindi.' : 'Note deleted.');
  };

  const handleExport = (format: 'md' | 'json') => {
    const targetNotes =
      scopeFilter === 'current' && activeArticleId
        ? notes.filter((n) => n.articleId === activeArticleId)
        : notes;
    if (targetNotes.length === 0) {
      onNotify(
        language === 'tr'
          ? 'Dışa aktarılacak kayıtlı not bulunmuyor.'
          : 'No saved notes to export.'
      );
      return;
    }

    let content = '';
    let mime = 'text/markdown;charset=utf-8';
    let ext = 'md';
    if (format === 'json') {
      content = JSON.stringify(
        {
          platform: 'emrepelit-sciphi.ai.studio',
          storageScope: 'local-browser-only',
          exportedAt: new Date().toISOString(),
          notes: targetNotes,
        },
        null,
        2
      );
      mime = 'application/json;charset=utf-8';
      ext = 'json';
    } else {
      content = [
        '# Emre Pelit Sci-Phil — Kişisel Okuma Notlarım',
        `Dışa Aktarım: ${new Date().toISOString()}`,
        '',
        ...targetNotes.flatMap((n) => [
          `## ${n.articleTitle}`,
          `- Tarih: ${n.createdAt.slice(0, 16).replace('T', ' ')}`,
          ...(n.quote ? [`> "${n.quote}"`, ''] : []),
          n.text,
          '',
          '---',
          '',
        ]),
      ].join('\n');
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sciphil-okuma-notlarim-${new Date().toISOString().slice(0, 10)}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onNotify(
      language === 'tr'
        ? `Notlarınız .${ext} dosyası olarak indirildi.`
        : `Notes exported as .${ext}.`
    );
  };

  if (!isOpen) return null;

  const displayedNotes =
    scopeFilter === 'current' && activeArticleId
      ? notes.filter((n) => n.articleId === activeArticleId)
      : notes;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={language === 'tr' ? 'Kişisel Okuma Notları ve Alıntılar' : 'Personal Reading Notes'}
      className="no-print fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex justify-end"
      onClick={onClose}
    >
      <aside
        className="w-full max-w-md bg-[#FBF9F5] text-stone-900 border-l border-stone-300 h-full flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between gap-3 bg-white">
          <div className="flex items-center gap-2 min-w-0">
            <BookMarked aria-hidden="true" className="w-4 h-4 text-[#1E3A8A] shrink-0" />
            <div className="min-w-0">
              <h2 className="font-editorial text-lg font-semibold text-stone-900 leading-tight truncate">
                {language === 'tr' ? 'Kişisel Okuma Notları' : 'Personal Reading Notes'}
              </h2>
              <p className="text-[11px] font-mono text-stone-500 flex items-center gap-1">
                <ShieldCheck aria-hidden="true" className="w-3 h-3 text-emerald-700 shrink-0" />
                <span>
                  {language === 'tr'
                    ? '%100 Cihaz İçi · Sunucuya Aktarılmaz (KVKK/GDPR)'
                    : '100% On-Device · Never Uploaded'}
                </span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={language === 'tr' ? 'Notlar panelini kapat' : 'Close notes panel'}
            className="p-2 text-stone-600 hover:text-stone-950 border border-stone-200 hover:border-stone-400 rounded-xs transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* New Note Form */}
        <form onSubmit={handleAddNote} className="p-4 border-b border-stone-200 bg-white space-y-2.5">
          <div className="text-[11px] font-mono text-stone-500 truncate">
            {language === 'tr' ? 'Aktif Makale:' : 'Active Essay:'}{' '}
            <strong className="text-stone-800">{activeArticleTitle}</strong>
          </div>
          <input
            type="text"
            value={quoteText}
            onChange={(e) => setQuoteText(e.target.value)}
            maxLength={400}
            placeholder={
              language === 'tr'
                ? 'İsteğe bağlı makale alıntısı veya denklem referansı…'
                : 'Optional quote or equation reference…'
            }
            className="w-full px-3 py-2 text-xs bg-[#FBF9F5] border border-stone-300 focus:border-[#1E3A8A] focus:outline-none rounded-xs font-academic-body"
          />
          <textarea
            rows={3}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            maxLength={2000}
            placeholder={
              language === 'tr'
                ? 'Bu makaleyle ilgili gözleminizi, eleştirinizi veya araştırma notunuzu yazın…'
                : 'Write your observation, critique, or research note…'
            }
            className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-stone-300 focus:border-[#1E3A8A] focus:outline-none rounded-xs font-academic-body resize-none"
          />
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-mono text-stone-500 tabular-nums">
              {notes.length} {language === 'tr' ? 'kayıtlı not' : 'saved notes'}
            </span>
            <button
              type="submit"
              disabled={!noteText.trim()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-mono font-semibold text-white bg-[#1E3A8A] hover:bg-[#172E6E] disabled:opacity-40 rounded-xs transition-colors cursor-pointer"
            >
              <Plus aria-hidden="true" className="w-3.5 h-3.5" />
              <span>{language === 'tr' ? 'Notu Kaydet' : 'Save Note'}</span>
            </button>
          </div>
        </form>

        {/* Filter & Export Controls */}
        <div className="px-4 py-2.5 border-b border-stone-200 flex flex-wrap items-center justify-between gap-2 bg-[#F2EFE7] text-xs font-mono">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setScopeFilter('current')}
              className={`px-2.5 py-1 rounded-xs transition-colors cursor-pointer ${
                scopeFilter === 'current'
                  ? 'bg-[#1E3A8A] text-white font-semibold'
                  : 'bg-white text-stone-700 border border-stone-300 hover:bg-stone-100'
              }`}
            >
              {language === 'tr' ? 'Bu Makale' : 'This Essay'}
            </button>
            <button
              type="button"
              onClick={() => setScopeFilter('all')}
              className={`px-2.5 py-1 rounded-xs transition-colors cursor-pointer ${
                scopeFilter === 'all'
                  ? 'bg-[#1E3A8A] text-white font-semibold'
                  : 'bg-white text-stone-700 border border-stone-300 hover:bg-stone-100'
              }`}
            >
              {language === 'tr' ? `Tümü (${notes.length})` : `All (${notes.length})`}
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleExport('md')}
              className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-stone-300 hover:border-[#1E3A8A] text-stone-800 rounded-xs transition-colors cursor-pointer"
            >
              <Download aria-hidden="true" className="w-3 h-3" />
              <span>.MD</span>
            </button>
            <button
              type="button"
              onClick={() => handleExport('json')}
              className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-stone-300 hover:border-[#1E3A8A] text-stone-800 rounded-xs transition-colors cursor-pointer"
            >
              <Download aria-hidden="true" className="w-3 h-3" />
              <span>.JSON</span>
            </button>
          </div>
        </div>

        {/* Saved Notes List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {displayedNotes.length === 0 ? (
            <div className="text-center py-10 space-y-2 text-stone-500">
              <p className="font-editorial text-base text-stone-700">
                {language === 'tr' ? 'Henüz kayıtlı not bulunmuyor.' : 'No notes recorded yet.'}
              </p>
              <p className="text-xs font-mono">
                {language === 'tr'
                  ? 'Notlarınız yalnızca bu tarayıcıda saklanır ve KVKK/GDPR Veri Dışa Aktar & Sil araçlarıyla yönetilebilir.'
                  : 'Notes stay strictly in this browser and are included in your GDPR Export & Erasure controls.'}
              </p>
            </div>
          ) : (
            displayedNotes.map((item) => (
              <article
                key={item.id}
                className="bg-white border border-stone-200 p-3.5 space-y-2"
              >
                <div className="flex items-start justify-between gap-2 text-[11px] font-mono text-stone-500">
                  <button
                    type="button"
                    onClick={() => {
                      if (onJumpToArticle && item.articleId) {
                        onJumpToArticle(item.articleId);
                        onClose();
                      }
                    }}
                    className="text-left text-[#1E3A8A] hover:underline font-semibold line-clamp-1 cursor-pointer"
                  >
                    {item.articleTitle}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteNote(item.id)}
                    aria-label={language === 'tr' ? 'Notu sil' : 'Delete note'}
                    className="text-stone-400 hover:text-red-700 transition-colors cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                {item.quote && (
                  <blockquote className="text-xs font-editorial italic text-stone-600 py-1.5 border-y border-stone-200">
                    “{item.quote}”
                  </blockquote>
                )}
                <p className="text-sm font-academic-body text-stone-800 whitespace-pre-wrap leading-relaxed">
                  {item.text}
                </p>
                <div className="text-[10px] font-mono text-stone-400 tabular-nums">
                  {new Date(item.createdAt).toLocaleString(language === 'tr' ? 'tr-TR' : 'en-US')}
                </div>
              </article>
            ))
          )}
        </div>
      </aside>
    </div>
  );
};
