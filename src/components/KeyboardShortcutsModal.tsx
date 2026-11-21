import React from 'react';
import { Keyboard, X } from 'lucide-react';
import type { LanguageCode } from '../types';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  if (!isOpen) return null;

  const isTr = language === 'tr';
  const shortcuts = [
    {
      keys: ['Ctrl / ⌘', 'K'],
      label: isTr ? 'Hızlı Arama, Makale & Denklem Paleti' : 'Quick Search, Essay & Equation Palette',
    },
    {
      keys: ['F'],
      label: isTr ? 'Odak (Zen) Okuma Modunu Aç / Kapat' : 'Toggle Focus (Zen) Reading Mode',
    },
    {
      keys: ['J'],
      label: isTr ? 'Sayfadaki Sonraki Makaleye Geç' : 'Jump to Next Essay on Page',
    },
    {
      keys: ['K'],
      label: isTr ? 'Sayfadaki Önceki Makaleye Geç' : 'Jump to Previous Essay on Page',
    },
    {
      keys: ['N'],
      label: isTr ? 'Kişisel Okuma Notlarını Aç / Kapat' : 'Toggle Personal Reading Notes',
    },
    {
      keys: ['M'],
      label: isTr ? 'Aktif Makalenin Sesli Anlatımına Git' : 'Jump to Active Essay Audio Narrator',
    },
    {
      keys: ['?'],
      label: isTr ? 'Klavye Kısayolları Rehberini Aç / Kapat' : 'Toggle Keyboard Shortcuts Guide',
    },
    {
      keys: ['Esc'],
      label: isTr ? 'Açık Pencereyi veya Odak Modunu Kapat' : 'Close Active Modal or Focus Mode',
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isTr ? 'Araştırmacı Klavye Kısayolları' : 'Researcher Keyboard Shortcuts'}
      className="no-print fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-[#FBF9F5] text-stone-900 border border-stone-300 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 bg-white border-b border-stone-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Keyboard aria-hidden="true" className="w-4 h-4 text-[#1E3A8A]" />
            <h2 className="font-editorial text-xl font-semibold text-stone-900">
              {isTr ? 'Araştırmacı Klavye Kısayolları' : 'Researcher Keyboard Shortcuts'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={isTr ? 'Kapat' : 'Close'}
            className="p-1.5 text-stone-600 hover:text-stone-950 border border-stone-200 hover:border-stone-400 rounded-xs transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {shortcuts.map((item) => (
            <div
              key={item.keys.join('+')}
              className="flex items-center justify-between gap-3 bg-white border border-stone-200 px-3.5 py-2.5"
            >
              <span className="text-xs font-sans text-stone-700 leading-snug">{item.label}</span>
              <div className="flex items-center gap-1 shrink-0">
                {item.keys.map((k) => (
                  <kbd
                    key={k}
                    className="px-2 py-0.5 text-[11px] font-mono font-semibold bg-[#F2EFE7] text-stone-900 border border-stone-300 rounded-xs"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="px-5 py-3 bg-[#F2EFE7] border-t border-stone-200 text-[11px] font-mono text-stone-600">
          {isTr
            ? 'Not: Kısayollar metin kutuları veya soru-cevap alanlarına yazı yazarken otomatik olarak devre dışı kalır.'
            : 'Note: Shortcuts are automatically paused while typing inside form inputs or text fields.'}
        </div>
      </div>
    </div>
  );
};
