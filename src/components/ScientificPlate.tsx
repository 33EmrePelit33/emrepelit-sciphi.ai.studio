import React, { useState, useEffect } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { Article, LanguageCode } from '../types';
import { buildScientificPlateDataUri } from '../data/initialData';
import { getLocalizedText } from '../i18n/translations';
import { MathFormula } from './MathFormula';

interface ScientificPlateProps {
  article: Article;
  language: LanguageCode;
}

type PlateLabelSet = { toggleTitle: string; standardView: string; wideView: string; modelTag: string };
const PLATE_LABELS: Partial<Record<LanguageCode, PlateLabelSet>> & { en: PlateLabelSet } = {
  tr: {
    toggleTitle: 'Plaka Ölçeğini Değiştir',
    standardView: 'Standart Görünüm',
    wideView: 'Geniş Plaka',
    modelTag: 'Teorik Model Plakası',
  },
  en: {
    toggleTitle: 'Toggle Plate Scale',
    standardView: 'Standard View',
    wideView: 'Wide Plate',
    modelTag: 'Conceptual Model Plate',
  },
  es: {
    toggleTitle: 'Cambiar Escala de Lámina',
    standardView: 'Vista Estándar',
    wideView: 'Lámina Amplia',
    modelTag: 'Modelo Teórico',
  },
  de: {
    toggleTitle: 'Tafelmaßstab Umschalten',
    standardView: 'Standardansicht',
    wideView: 'Breitformat',
    modelTag: 'Theoretisches Modell',
  },
  fr: {
    toggleTitle: 'Changer l’Échelle',
    standardView: 'Vue Standard',
    wideView: 'Planche Large',
    modelTag: 'Modèle Théorique',
  },
  ru: {
    toggleTitle: 'Изменить масштаб',
    standardView: 'Стандартный вид',
    wideView: 'Широкий вид',
    modelTag: 'Теоретическая модель',
  },
  ar: {
    toggleTitle: 'تغيير مقياس اللوحة',
    standardView: 'عرض قياسي',
    wideView: 'لوحة واسعة',
    modelTag: 'نموذج نظري',
  },
  zh: {
    toggleTitle: '切换图版比例',
    standardView: '标准视图',
    wideView: '宽幅图版',
    modelTag: '理论模型图版',
  },
  ja: {
    toggleTitle: 'プレート倍率を切替',
    standardView: '標準表示',
    wideView: '拡大プレート',
    modelTag: '理論モデル図版',
  },
  pt: {
    toggleTitle: 'Alternar Escala da Prancha',
    standardView: 'Visão Padrão',
    wideView: 'Prancha Ampla',
    modelTag: 'Modelo Teórico',
  },
  it: {
    toggleTitle: 'Cambia Scala Tavola',
    standardView: 'Vista Standard',
    wideView: 'Tavola Ampia',
    modelTag: 'Modello Teorico',
  },
  ko: {
    toggleTitle: '도판 비율 전환',
    standardView: '기본 보기',
    wideView: '확대 도판',
    modelTag: '이론 모델 도판',
  },
};

export const ScientificPlate: React.FC<ScientificPlateProps> = ({ article, language }) => {
  const [expanded, setExpanded] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>(article.imageUrl);
  const plateT = PLATE_LABELS[language] || PLATE_LABELS.en;

  useEffect(() => {
    setImgSrc(article.imageUrl);
  }, [article.imageUrl]);


  const fallbackSvgUri = buildScientificPlateDataUri(
    article.simulation.type,
    article.figureNumber,
    getLocalizedText(article.title, 'en'),
    article.simulation.equationLatex.slice(0, 32)
  );

  const caption = getLocalizedText(article.figureCaption, language);

  return (
    <figure className="border border-stone-300 bg-[#0F172A] overflow-hidden rounded-sm">
      <div className={`relative w-full overflow-hidden transition-opacity ${expanded ? 'aspect-[16/10]' : 'aspect-[16/9]'}`}>
        <img
          src={imgSrc || fallbackSvgUri}
          alt={`${article.figureNumber} - ${getLocalizedText(article.title, language)}`}
          width={1280}
          height={720}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => {
            if (imgSrc !== fallbackSvgUri) {
              setImgSrc(fallbackSvgUri);
            }
          }}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30 pointer-events-none" />

        <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-slate-300">
          <span>
            {article.figureNumber} · {plateT.modelTag}
          </span>
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-sm cursor-pointer transition-colors"
            title={plateT.toggleTitle}
          >
            {expanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{expanded ? plateT.standardView : plateT.wideView}</span>
          </button>
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-end justify-between gap-2 text-xs text-slate-200 pointer-events-none">
          <span className="font-mono text-[11px] text-amber-300 bg-slate-950/85 px-2.5 py-1 border border-slate-800 max-w-full overflow-x-auto">
            <MathFormula tex={article.simulation.equationLatex} darkSurface={true} />
          </span>
          <span className="font-mono text-[11px] text-slate-300 bg-slate-950/80 px-2 py-0.5">
            SHA-256: {article.sha256Signature.slice(0, 12)}…
          </span>
        </div>
      </div>

      <figcaption className="px-4 py-3 bg-[#F5F2EB] border-t border-stone-300 text-xs font-academic-body italic text-stone-700 leading-relaxed">
        {caption}
      </figcaption>
    </figure>
  );
};
