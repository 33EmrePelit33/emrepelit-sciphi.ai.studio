import React, { useMemo, useState } from 'react';
import katex from 'katex';
import { Check, Copy } from 'lucide-react';

interface MathFormulaProps {
  tex: string;
  displayMode?: boolean;
  className?: string;
  showCopyButton?: boolean;
  darkSurface?: boolean;
}

export const MathFormula: React.FC<MathFormulaProps> = ({
  tex,
  displayMode = false,
  className = '',
  showCopyButton = false,
  darkSurface = false,
}) => {
  const [copied, setCopied] = useState(false);

  const renderedHtml = useMemo(() => {
    const cleaned = (tex || '').trim();
    if (!cleaned) return '';
    try {
      return katex.renderToString(cleaned, {
        displayMode,
        throwOnError: false,
        strict: false,
        trust: false,
        output: 'htmlAndMathml',
      });
    } catch {
      return '';
    }
  }, [tex, displayMode]);

  const handleCopyLatex = async () => {
    if (!tex) return;
    try {
      await navigator.clipboard.writeText(tex);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback ignored in restricted frames
    }
  };

  if (!tex) return null;

  return (
    <span
      className={`inline-flex items-center gap-2 max-w-full overflow-x-auto align-middle ${
        displayMode ? 'w-full justify-between' : ''
      } ${className}`}
    >
      {renderedHtml ? (
        <span
          className="katex-rendered leading-normal"
          dangerouslySetInnerHTML={{ __html: renderedHtml }}
        />
      ) : (
        <code className="font-mono text-xs break-all">{tex}</code>
      )}

      {showCopyButton && (
        <button
          type="button"
          onClick={handleCopyLatex}
          title="LaTeX Formülünü Kopyala"
          aria-label="LaTeX formülünü panoya kopyala"
          className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono rounded-xs border transition-colors shrink-0 cursor-pointer ${
            darkSurface
              ? 'bg-slate-800 border-slate-700 text-slate-200 hover:border-amber-400 hover:text-amber-300'
              : 'bg-white border-stone-300 text-stone-700 hover:border-[#1E3A8A] hover:text-[#1E3A8A]'
          }`}
        >
          {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Kopyalandı' : 'LaTeX'}</span>
        </button>
      )}
    </span>
  );
};
