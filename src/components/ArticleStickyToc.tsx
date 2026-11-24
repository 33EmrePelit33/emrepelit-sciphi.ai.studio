import React, { useEffect, useMemo, useState } from 'react';
import { BookOpen, Clock, ListTree } from 'lucide-react';
import type { LanguageCode } from '../types';

interface ArticleStickyTocProps {
  articleId: string;
  paragraphs: string[];
  readTimeMinutes: number;
  language: LanguageCode;
}

interface TocSection {
  id: string;
  label: string;
  shortLabel: string;
}

type TocI18nStrings = {
  heading: string;
  remaining: (mins: number) => string;
  completed: string;
  summary: string;
  sectionPrefix: string;
  citations: string;
  qa: string;
  progressLabel: string;
};

const TOC_I18N: Partial<Record<LanguageCode, TocI18nStrings>> & { en: TocI18nStrings } = {
  tr: {
    heading: 'Yapışkan İçindekiler',
    remaining: (m) => (m <= 1 ? '< 1 dk kaldı' : `~${m} dk kaldı`),
    completed: 'Okuma tamamlandı',
    summary: 'Yönetici Özeti & Sav',
    sectionPrefix: 'Bölüm',
    citations: 'Kaynakça & Atıf',
    qa: 'Soru-Cevap (FAQ)',
    progressLabel: 'İlerleme',
  },
  en: {
    heading: 'Sticky Contents',
    remaining: (m) => (m <= 1 ? '< 1 min left' : `~${m} min left`),
    completed: 'Reading complete',
    summary: 'Executive Summary & Thesis',
    sectionPrefix: 'Section',
    citations: 'References & Citations',
    qa: 'Q&A (FAQ)',
    progressLabel: 'Progress',
  },
  es: {
    heading: 'Índice Fijo',
    remaining: (m) => (m <= 1 ? '< 1 min restante' : `~${m} min restantes`),
    completed: 'Lectura completada',
    summary: 'Resumen y Tesis',
    sectionPrefix: 'Sección',
    citations: 'Referencias y Citas',
    qa: 'Preguntas y Respuestas',
    progressLabel: 'Progreso',
  },
  de: {
    heading: 'Inhaltsverzeichnis',
    remaining: (m) => (m <= 1 ? '< 1 Min. übrig' : `~${m} Min. übrig`),
    completed: 'Lektüre abgeschlossen',
    summary: 'Zusammenfassung & These',
    sectionPrefix: 'Abschnitt',
    citations: 'Quellen & Zitate',
    qa: 'Fragen & Antworten',
    progressLabel: 'Fortschritt',
  },
  fr: {
    heading: 'Sommaire Fixe',
    remaining: (m) => (m <= 1 ? '< 1 min restante' : `~${m} min restantes`),
    completed: 'Lecture terminée',
    summary: 'Résumé & Thèse',
    sectionPrefix: 'Section',
    citations: 'Références & Citations',
    qa: 'Questions & Réponses',
    progressLabel: 'Progression',
  },
  ru: {
    heading: 'Оглавление',
    remaining: (m) => (m <= 1 ? '< 1 мин осталось' : `~${m} мин осталось`),
    completed: 'Чтение завершено',
    summary: 'Резюме и тезис',
    sectionPrefix: 'Раздел',
    citations: 'Источники и цитаты',
    qa: 'Вопросы и ответы',
    progressLabel: 'Прогресс',
  },
  ar: {
    heading: 'فهرس المحتويات',
    remaining: (m) => (m <= 1 ? 'أقل من دقيقة' : `~${m} دقيقة متبقية`),
    completed: 'اكتملت القراءة',
    summary: 'الملخص والأطروحة',
    sectionPrefix: 'القسم',
    citations: 'المراجع والاقتباسات',
    qa: 'الأسئلة والأجوبة',
    progressLabel: 'التقدم',
  },
  zh: {
    heading: '固定目录',
    remaining: (m) => (m <= 1 ? '剩余不足 1 分钟' : `剩余约 ${m} 分钟`),
    completed: '阅读完成',
    summary: '核心摘要与论点',
    sectionPrefix: '第',
    citations: '参考文献与引用',
    qa: '问答 (FAQ)',
    progressLabel: '进度',
  },
  ja: {
    heading: '固定目次',
    remaining: (m) => (m <= 1 ? '残り1分未満' : `残り約${m}分`),
    completed: '読了',
    summary: '要旨と中核命題',
    sectionPrefix: 'セクション',
    citations: '参考文献と引用',
    qa: 'Q&A (よくある質問)',
    progressLabel: '進捗',
  },
  pt: {
    heading: 'Índice Fixo',
    remaining: (m) => (m <= 1 ? '< 1 min restante' : `~${m} min restantes`),
    completed: 'Leitura concluída',
    summary: 'Resumo e Tese',
    sectionPrefix: 'Seção',
    citations: 'Referências e Citações',
    qa: 'Perguntas e Respostas',
    progressLabel: 'Progresso',
  },
  it: {
    heading: 'Indice Fisso',
    remaining: (m) => (m <= 1 ? '< 1 min rimasto' : `~${m} min rimasti`),
    completed: 'Lettura completata',
    summary: 'Sintesi e Tesi',
    sectionPrefix: 'Sezione',
    citations: 'Riferimenti e Citazioni',
    qa: 'Domande e Risposte',
    progressLabel: 'Avanzamento',
  },
  ko: {
    heading: '고정 목차',
    remaining: (m) => (m <= 1 ? '1분 미만 남음' : `약 ${m}분 남음`),
    completed: '읽기 완료',
    summary: '요약 및 핵심 논지',
    sectionPrefix: '섹션',
    citations: '참고문헌 및 인용',
    qa: '질의응답 (FAQ)',
    progressLabel: '진행률',
  },
};

export const ArticleStickyToc: React.FC<ArticleStickyTocProps> = ({
  articleId,
  paragraphs,
  readTimeMinutes,
  language,
}) => {
  const ui = TOC_I18N[language] || TOC_I18N.en;
  const [activeId, setActiveId] = useState<string>(`para-${articleId}-1`);
  const [progressPct, setProgressPct] = useState<number>(0);

  const sections = useMemo<TocSection[]>(() => {
    const items: TocSection[] = [
      { id: articleId, label: ui.summary, shortLabel: ui.summary },
    ];
    paragraphs.forEach((p, idx) => {
      const cleanSnippet = p.replace(/\s+/g, ' ').trim().slice(0, 44);
      const secNum = language === 'zh' ? `${ui.sectionPrefix}${idx + 1}节` : `${ui.sectionPrefix} ${idx + 1}`;
      items.push({
        id: `para-${articleId}-${idx + 1}`,
        label: `${secNum}: ${cleanSnippet}${p.length > 44 ? '…' : ''}`,
        shortLabel: secNum,
      });
    });
    items.push({
      id: `citations-${articleId}`,
      label: ui.citations,
      shortLabel: ui.citations,
    });
    items.push({
      id: `article-qa-${articleId}`,
      label: ui.qa,
      shortLabel: ui.qa,
    });
    return items;
  }, [articleId, paragraphs, ui, language]);

  useEffect(() => {
    const bodyEl = document.getElementById(`paper-body-${articleId}`);
    if (!bodyEl) return;

    const handleScroll = () => {
      const rect = bodyEl.getBoundingClientRect();
      const totalScrollable = Math.max(1, bodyEl.offsetHeight - window.innerHeight * 0.45);
      const scrolled = Math.max(0, window.innerHeight * 0.25 - rect.top);
      const pct = Math.max(0, Math.min(100, Math.round((scrolled / totalScrollable) * 100)));
      setProgressPct(pct);

      let currentSectionId = sections[0]?.id || articleId;
      for (const sec of sections) {
        const el = document.getElementById(sec.id);
        if (el) {
          const top = el.getBoundingClientRect().top;
          if (top <= 165) {
            currentSectionId = sec.id;
          }
        }
      }
      setActiveId(currentSectionId);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [articleId, sections]);

  const remainingMinutes = Math.max(
    0,
    Math.ceil(readTimeMinutes * ((100 - progressPct) / 100))
  );

  const handleJump = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(targetId);
    }
  };

  return (
    <div
      aria-label={ui.heading}
      className="no-print bg-[#FBF9F5] border border-stone-300 p-4 space-y-3 lg:sticky lg:top-20 shadow-xs"
    >
      <div className="flex items-center justify-between gap-2 border-b border-stone-200 pb-2">
        <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-[#1E3A8A]">
          <ListTree className="w-3.5 h-3.5 shrink-0" />
          <span>{ui.heading}</span>
        </div>
        <div className="flex items-center gap-1 font-mono text-[11px] font-semibold text-stone-700">
          <Clock className="w-3 h-3 text-[#1E3A8A] shrink-0" />
          <span>{progressPct >= 98 ? ui.completed : ui.remaining(remainingMinutes)}</span>
        </div>
      </div>

      {/* Article-specific live reading progress bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[10px] font-mono text-stone-500">
          <span className="inline-flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            {ui.progressLabel}
          </span>
          <span className="font-semibold text-stone-700">%{progressPct}</span>
        </div>
        <div className="w-full h-1.5 bg-stone-200 overflow-hidden">
          <div
            className="h-full bg-[#1E3A8A] transition-all duration-150"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Section jump list */}
      <nav aria-label={ui.heading} className="max-h-64 overflow-y-auto pr-1 space-y-1">
        {sections.map((sec, idx) => {
          const isActive = activeId === sec.id;
          return (
            <a
              key={sec.id}
              href={`#${sec.id}`}
              onClick={(e) => handleJump(e, sec.id)}
              aria-current={isActive ? 'location' : undefined}
              className={`block px-2 py-1.5 text-[11px] font-mono border-l-2 transition-colors ${
                isActive
                  ? 'border-[#1E3A8A] bg-blue-50/70 text-[#1E3A8A] font-semibold'
                  : 'border-transparent text-stone-600 hover:text-stone-900 hover:border-stone-400 hover:bg-stone-100/70'
              }`}
            >
              <span className="line-clamp-1">
                {idx + 1}. {sec.label}
              </span>
            </a>
          );
        })}
      </nav>
    </div>
  );
};
