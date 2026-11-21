import React, { useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Compass,
  GitBranch,
  Layers,
  ListOrdered,
  Network,
  Search,
  X,
} from 'lucide-react';
import type { Article, LanguageCode } from '../types';
import { getLocalizedText } from '../i18n/translations';
import { detectEntrySourceLanguage, getLocalizedArticlePath } from '../utils/articleLocale';
import { buildTopicConceptAtlas } from '../utils/topicContinuationEngine';

interface TopicSeparatorConceptMapProps {
  articles: Article[];
  language: LanguageCode;
  activeAppliedTopicId: string | null;
  onSelectArticle: (articleId: string) => void;
  onApplyContinuationToCorpus: (
    topicId: string,
    topicLabel: string,
    orderedArticleIds: string[]
  ) => void;
  onClearAppliedContinuation: () => void;
}

export const TopicSeparatorConceptMap: React.FC<TopicSeparatorConceptMapProps> = ({
  articles,
  language,
  activeAppliedTopicId,
  onSelectArticle,
  onApplyContinuationToCorpus,
  onClearAppliedContinuation,
}) => {
  const isTr = language === 'tr';
  const [uniqueWorksOnly, setUniqueWorksOnly] = useState<boolean>(true);
  const [mapMode, setMapMode] = useState<'atlas' | 'sequence'>('atlas');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('bilinc-yapay-zeka');
  const [selectedSubConceptId, setSelectedSubConceptId] = useState<string | null>(null);
  const [hoveredTopicId, setHoveredTopicId] = useState<string | null>(null);
  const [hoveredSubConceptId, setHoveredSubConceptId] = useState<string | null>(null);
  const [sequenceSearch, setSequenceSearch] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState<number>(16);

  const atlas = useMemo(
    () => buildTopicConceptAtlas(articles, language, uniqueWorksOnly),
    [articles, language, uniqueWorksOnly]
  );

  const activeCluster = useMemo(() => {
    const found = atlas.topics.find((c) => c.topic.id === selectedTopicId);
    if (found && found.orderedItems.length > 0) return found;
    return atlas.topics.find((c) => c.orderedItems.length > 0) || atlas.topics[0];
  }, [atlas.topics, selectedTopicId]);

  const selectedSubConceptObj = useMemo(
    () => atlas.subConcepts.find((sc) => sc.id === selectedSubConceptId) || null,
    [atlas.subConcepts, selectedSubConceptId]
  );

  // Filtered continuation list for the right panel
  const filteredSequence = useMemo(() => {
    const base = activeCluster?.orderedItems || [];
    const q = sequenceSearch.trim().toLowerCase();
    return base.filter((item) => {
      if (selectedSubConceptId && !item.matchedSubConceptIds.includes(selectedSubConceptId)) {
        return false;
      }
      if (!q) return true;
      const title = getLocalizedText(item.article.title, language).toLowerCase();
      const abs = getLocalizedText(item.article.abstract, language).toLowerCase();
      const bridges = [...item.bridgeSubConcepts, ...item.bridgeKeywords].join(' ').toLowerCase();
      return title.includes(q) || abs.includes(q) || bridges.includes(q);
    });
  }, [activeCluster, selectedSubConceptId, sequenceSearch, language]);

  // Compute deterministic two-ring SVG coordinates for the 9 Topics (outer) + 24 Sub-Concepts (inner)
  const svgGeometry = useMemo(() => {
    const cx = 420;
    const cy = 265;
    const outerRx = 318;
    const outerRy = 205;
    const innerRx = 186;
    const innerRy = 118;

    const topicNodes = atlas.topics.map((cluster, idx) => {
      const angle = (idx / atlas.topics.length) * Math.PI * 2 - Math.PI / 2;
      const count = cluster.orderedItems.length;
      const radius = Math.max(22, Math.min(36, 17 + Math.sqrt(count) * 2.6));
      return {
        id: cluster.topic.id,
        orderNumber: cluster.topic.orderNumber,
        label: isTr ? cluster.topic.labelTr : cluster.topic.labelEn,
        shortLabel: isTr ? cluster.topic.shortLabelTr : cluster.topic.shortLabelEn,
        color: cluster.topic.color,
        count,
        radius,
        angle,
        x: cx + outerRx * Math.cos(angle),
        y: cy + outerRy * Math.sin(angle),
      };
    });

    const topicNodeMap = new Map(topicNodes.map((n) => [n.id, n]));

    // Place each topic's sub-concepts clustered along an arc near their parent topic's angle
    const subNodesByTopic = new Map<string, typeof atlas.subConcepts>();
    atlas.subConcepts.forEach((sc) => {
      const list = subNodesByTopic.get(sc.topicId) || [];
      list.push(sc);
      subNodesByTopic.set(sc.topicId, list);
    });

    const subNodes: Array<{
      id: string;
      topicId: string;
      label: string;
      color: string;
      count: number;
      radius: number;
      x: number;
      y: number;
    }> = [];

    for (const tNode of topicNodes) {
      const kids = subNodesByTopic.get(tNode.id) || [];
      const spread = 0.24;
      kids.forEach((sc, kIdx) => {
        const offset = kids.length > 1 ? (kIdx - (kids.length - 1) / 2) * spread : 0;
        const a = tNode.angle + offset;
        const radialMod = kIdx % 2 === 0 ? 1.0 : 0.76;
        subNodes.push({
          id: sc.id,
          topicId: sc.topicId,
          label: isTr ? sc.labelTr : sc.labelEn,
          color: sc.color,
          count: sc.count,
          radius: Math.max(6.5, Math.min(13.5, 5.5 + Math.sqrt(sc.count) * 0.9)),
          x: cx + innerRx * radialMod * Math.cos(a),
          y: cy + innerRy * radialMod * Math.sin(a),
        });
      });
    }

    const subNodeMap = new Map(subNodes.map((n) => [n.id, n]));

    return { cx, cy, topicNodes, topicNodeMap, subNodes, subNodeMap };
  }, [atlas.topics, atlas.subConcepts, isTr]);

  // Compute serpentine continuation flowchart layout for active topic's ordered sequence
  const sequenceFlowNodes = useMemo(() => {
    const items = filteredSequence.slice(0, 12);
    const cols = 4;
    const startX = 112;
    const stepX = 205;
    const startY = 104;
    const stepY = 152;

    return items.map((item, idx) => {
      const row = Math.floor(idx / cols);
      const colInRow = idx % cols;
      const col = row % 2 === 0 ? colInRow : cols - 1 - colInRow;
      return {
        item,
        x: startX + col * stepX,
        y: startY + row * stepY,
        titleShort:
          getLocalizedText(item.article.title, language).slice(0, 36) +
          (getLocalizedText(item.article.title, language).length > 36 ? '…' : ''),
      };
    });
  }, [filteredSequence, language]);

  const focusTopicId = hoveredTopicId || activeCluster?.topic.id || null;
  const focusSubId = hoveredSubConceptId || selectedSubConceptId;
  const isCurrentTopicApplied = activeAppliedTopicId === activeCluster?.topic.id;

  const handleSelectTopic = (topicId: string) => {
    setSelectedTopicId(topicId);
    setSelectedSubConceptId(null);
    setVisibleCount(16);
  };

  return (
    <section
      id="topic-separator-map"
      aria-label={
        isTr
          ? 'Konu Ayıracı, Kapsamlı Kavram Haritası ve İçerik Devamlılık Sıralaması'
          : 'Topic Separator, Comprehensive Concept Map & Sequential Continuation Order'
      }
      className="no-print bg-white border border-stone-300 p-5 sm:p-6 lg:p-8 space-y-6"
    >
      {/* Editorial Section Header */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 pb-5 border-b border-stone-200">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#1E3A8A] font-semibold">
            <Network aria-hidden="true" className="w-4 h-4 shrink-0" />
            <span>
              {isTr
                ? `KONU AYIRACI · 9 ANA DİSİPLİN · ${atlas.subConcepts.length} ALT KAVRAM · ${atlas.scopedArticlesCount} MAKALE`
                : `TOPIC SEPARATOR · 9 DOMAINS · ${atlas.subConcepts.length} SUB-CONCEPTS · ${atlas.scopedArticlesCount} ESSAYS`}
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-editorial font-semibold text-stone-900 leading-tight">
            {isTr
              ? 'Konu Ayıracı, Kapsamlı Kavram Haritası & İçerik Devamlılık Zinciri'
              : 'Thematic Topic Separator, Concept Atlas & Content Continuation Sequence'}
          </h3>
          <p className="text-xs sm:text-sm font-academic-body text-stone-600 max-w-3xl leading-relaxed">
            {isTr
              ? 'Külliyattaki tüm makaleler metin içeriklerine göre 9 ana konuya ayrılır; her konu içinde makaleler temel çerçeveden kuramsal mekanizmaya, çapraz sentezden ileri felsefi ufka doğru birbirinin devamı niteliğinde sıralanır.'
              : 'All archive essays are classified by text content into 9 thematic domains and sequentially ordered from foundational framing through theoretical mechanisms to cross-domain synthesis.'}
          </p>
        </div>

        {/* Interactive Mode & Scope Segmented Controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div
            role="group"
            aria-label={isTr ? 'Harita görünüm modu' : 'Map view mode'}
            className="inline-flex items-center gap-1 bg-[#F2EFE7] p-1 border border-stone-300"
          >
            <button
              type="button"
              onClick={() => setMapMode('atlas')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono transition-colors cursor-pointer whitespace-nowrap ${
                mapMode === 'atlas'
                  ? 'bg-[#1E3A8A] text-white font-semibold'
                  : 'text-stone-700 hover:text-stone-950'
              }`}
            >
              <Network aria-hidden="true" className="w-3.5 h-3.5" />
              <span>{isTr ? 'Kavram Atlası (9+24)' : 'Concept Atlas (9+24)'}</span>
            </button>
            <button
              type="button"
              onClick={() => setMapMode('sequence')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono transition-colors cursor-pointer whitespace-nowrap ${
                mapMode === 'sequence'
                  ? 'bg-[#1E3A8A] text-white font-semibold'
                  : 'text-stone-700 hover:text-stone-950'
              }`}
            >
              <GitBranch aria-hidden="true" className="w-3.5 h-3.5" />
              <span>{isTr ? 'Devamlılık Akış Şeması' : 'Continuation Flowchart'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setUniqueWorksOnly((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono border border-stone-300 bg-[#FBF9F5] hover:border-[#1E3A8A] text-stone-800 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Layers aria-hidden="true" className="w-3.5 h-3.5 text-[#1E3A8A]" />
            <span>
              {uniqueWorksOnly
                ? isTr
                  ? `Özgün Eserler (${atlas.scopedArticlesCount})`
                  : `Distinct Works (${atlas.scopedArticlesCount})`
                : isTr
                  ? `Tüm Edisyonlar (${atlas.scopedArticlesCount})`
                  : `All Editions (${atlas.scopedArticlesCount})`}
            </span>
          </button>
        </div>
      </div>

      {/* Thematic Topic Separator Bar (Konu Ayıracı — 9 Disciplines) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] font-mono text-stone-500">
          <span>
            {isTr
              ? 'KONU AYIRACI — BİR KONU SEÇEREK KAVRAM BAĞLANTILARINI VE ARDIŞIK OKUMA ZİNCİRİNİ GÖRÜN'
              : 'TOPIC SEPARATOR — SELECT A DOMAIN TO INSPECT CONCEPT BRIDGES & CONTINUATION SEQUENCE'}
          </span>
          <span className="tabular-nums hidden sm:inline">
            {atlas.topicEdges.length} {isTr ? 'Konular Arası Kavramsal Köprü' : 'Cross-Domain Bridges'}
          </span>
        </div>

        <div
          role="tablist"
          aria-label={isTr ? 'Makale Konu Ayıracı' : 'Article Topic Separator'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2"
        >
          {atlas.topics.map((cluster) => {
            const isActive = activeCluster?.topic.id === cluster.topic.id;
            const label = isTr ? cluster.topic.labelTr : cluster.topic.labelEn;
            return (
              <button
                key={cluster.topic.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleSelectTopic(cluster.topic.id)}
                onMouseEnter={() => setHoveredTopicId(cluster.topic.id)}
                onMouseLeave={() => setHoveredTopicId(null)}
                className={`text-left px-3.5 py-2.5 border transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                  isActive
                    ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                    : 'bg-[#FBF9F5] text-stone-800 border-stone-200 hover:border-stone-400 hover:bg-stone-100/80'
                }`}
              >
                <div className="min-w-0 flex items-baseline gap-2">
                  <span
                    className={`font-mono text-[11px] font-bold tabular-nums shrink-0 ${
                      isActive ? 'text-amber-300' : 'text-stone-400'
                    }`}
                  >
                    {cluster.topic.orderNumber}.
                  </span>
                  <span className="text-xs font-medium truncate">{label}</span>
                </div>
                <span
                  className={`font-mono text-[11px] tabular-nums shrink-0 ${
                    isActive ? 'text-amber-200 font-bold' : 'text-stone-500'
                  }`}
                >
                  {cluster.orderedItems.length} {isTr ? 'eser' : 'essays'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 2-Column Interactive Workspace: Left Concept Map (7 cols) + Right Continuation Sequence (5 cols) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        {/* LEFT COLUMN: Comprehensive Interactive SVG Concept Map / Continuation Flowchart */}
        <div className="xl:col-span-7 bg-[#0B1120] border border-slate-800 p-4 flex flex-col justify-between gap-3">
          {mapMode === 'atlas' ? (
            <svg
              viewBox="0 0 840 530"
              className="w-full h-[380px] sm:h-[460px] lg:h-[510px]"
              role="img"
              aria-label={
                isTr
                  ? '9 Ana Konu ve 24 Alt Kavramdan Oluşan Kapsamlı Bilim ve Felsefe Kavram Haritası'
                  : 'Comprehensive 9-Topic and 24-Sub-Concept Science and Philosophy Concept Map'
              }
            >
              {/* Subtle orbital reference ellipses */}
              <ellipse
                cx={svgGeometry.cx}
                cy={svgGeometry.cy}
                rx="318"
                ry="205"
                fill="none"
                stroke="#1E293B"
                strokeWidth="1"
                strokeDasharray="4 5"
              />
              <ellipse
                cx={svgGeometry.cx}
                cy={svgGeometry.cy}
                rx="186"
                ry="118"
                fill="none"
                stroke="#1E293B"
                strokeWidth="1"
                strokeDasharray="2 4"
              />

              {/* Cross-topic conceptual bridge arcs */}
              {atlas.topicEdges.map((edge) => {
                const s = svgGeometry.topicNodeMap.get(edge.sourceId);
                const t = svgGeometry.topicNodeMap.get(edge.targetId);
                if (!s || !t) return null;
                const touchesFocus =
                  edge.sourceId === focusTopicId || edge.targetId === focusTopicId;
                const midX = (s.x + t.x) / 2 + (svgGeometry.cx - (s.x + t.x) / 2) * 0.25;
                const midY = (s.y + t.y) / 2 + (svgGeometry.cy - (s.y + t.y) / 2) * 0.25;
                return (
                  <path
                    key={`te-${edge.sourceId}-${edge.targetId}`}
                    d={`M ${s.x} ${s.y} Q ${midX} ${midY} ${t.x} ${t.y}`}
                    fill="none"
                    stroke={touchesFocus ? '#38BDF8' : '#334155'}
                    strokeOpacity={touchesFocus ? 0.62 : 0.16}
                    strokeWidth={
                      touchesFocus
                        ? Math.min(3.4, 1.1 + edge.weight * 0.12)
                        : Math.min(1.6, 0.5 + edge.weight * 0.04)
                    }
                  />
                );
              })}

              {/* Sub-concept to sub-concept co-occurrence links */}
              {atlas.subConceptEdges.map((edge) => {
                const s = svgGeometry.subNodeMap.get(edge.sourceId);
                const t = svgGeometry.subNodeMap.get(edge.targetId);
                if (!s || !t) return null;
                const touchesSub =
                  focusSubId
                    ? edge.sourceId === focusSubId || edge.targetId === focusSubId
                    : s.topicId === focusTopicId || t.topicId === focusTopicId;
                if (!touchesSub) return null;
                return (
                  <line
                    key={`se-${edge.sourceId}-${edge.targetId}`}
                    x1={s.x}
                    y1={s.y}
                    x2={t.x}
                    y2={t.y}
                    stroke={focusSubId ? '#F59E0B' : '#64748B'}
                    strokeOpacity={focusSubId ? 0.72 : 0.3}
                    strokeWidth={Math.min(2.2, 0.7 + edge.weight * 0.08)}
                  />
                );
              })}

              {/* Spokes linking each sub-concept to its parent topic node */}
              {svgGeometry.subNodes.map((sc) => {
                const parent = svgGeometry.topicNodeMap.get(sc.topicId);
                if (!parent) return null;
                const isActiveBranch =
                  sc.topicId === focusTopicId || sc.id === focusSubId;
                return (
                  <line
                    key={`branch-${sc.id}`}
                    x1={parent.x}
                    y1={parent.y}
                    x2={sc.x}
                    y2={sc.y}
                    stroke={isActiveBranch ? '#F59E0B' : '#1E293B'}
                    strokeOpacity={isActiveBranch ? 0.68 : 0.32}
                    strokeWidth={isActiveBranch ? 1.4 : 0.8}
                  />
                );
              })}

              {/* Center Sci-Phil Core Anchor */}
              <circle
                cx={svgGeometry.cx}
                cy={svgGeometry.cy}
                r="34"
                fill="#0F172A"
                stroke="#F59E0B"
                strokeWidth="2"
              />
              <text
                x={svgGeometry.cx}
                y={svgGeometry.cy - 4}
                textAnchor="middle"
                fill="#F8FAFC"
                className="text-[11px] font-mono font-bold"
              >
                Sci-Phil
              </text>
              <text
                x={svgGeometry.cx}
                y={svgGeometry.cy + 11}
                textAnchor="middle"
                fill="#FCD34D"
                className="text-[9.5px] font-mono"
              >
                {atlas.scopedArticlesCount} {isTr ? 'Eser' : 'Works'}
              </text>

              {/* Inner Ring: 24 Granular Sub-Concept Nodes */}
              {svgGeometry.subNodes.map((sc) => {
                const isParentFocused = sc.topicId === focusTopicId;
                const isSelectedSub = selectedSubConceptId === sc.id;
                const isHoveredSub = hoveredSubConceptId === sc.id;
                const highlight = isSelectedSub || isHoveredSub;
                return (
                  <g
                    key={sc.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`${sc.label} (${sc.count})`}
                    onClick={() => {
                      if (selectedTopicId !== sc.topicId) {
                        setSelectedTopicId(sc.topicId);
                      }
                      setSelectedSubConceptId((prev) => (prev === sc.id ? null : sc.id));
                    }}
                    onMouseEnter={() => setHoveredSubConceptId(sc.id)}
                    onMouseLeave={() => setHoveredSubConceptId(null)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedTopicId(sc.topicId);
                        setSelectedSubConceptId((prev) => (prev === sc.id ? null : sc.id));
                      }
                    }}
                    className="cursor-pointer"
                  >
                    <circle
                      cx={sc.x}
                      cy={sc.y}
                      r={sc.radius + (highlight ? 3 : 0)}
                      fill={highlight ? '#F59E0B' : sc.color}
                      fillOpacity={isParentFocused || highlight ? 0.95 : 0.45}
                      stroke={highlight ? '#FFFFFF' : isParentFocused ? '#CBD5E1' : '#334155'}
                      strokeWidth={highlight ? 2 : 1}
                    />
                    {(isParentFocused || highlight) && (
                      <text
                        x={sc.x}
                        y={sc.y - sc.radius - 5}
                        textAnchor="middle"
                        fill={highlight ? '#FDE68A' : '#E2E8F0'}
                        className="text-[9.5px] font-mono font-semibold pointer-events-none"
                      >
                        {sc.label} ({sc.count})
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Outer Ring: 9 Primary Thematic Topic Nodes */}
              {svgGeometry.topicNodes.map((node) => {
                const isSelected = activeCluster?.topic.id === node.id;
                const isHovered = hoveredTopicId === node.id;
                return (
                  <g
                    key={node.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`${node.orderNumber}. ${node.label} (${node.count})`}
                    onClick={() => handleSelectTopic(node.id)}
                    onMouseEnter={() => setHoveredTopicId(node.id)}
                    onMouseLeave={() => setHoveredTopicId(null)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSelectTopic(node.id);
                      }
                    }}
                    className="cursor-pointer"
                  >
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.radius + (isSelected || isHovered ? 4 : 0)}
                      fill={node.color}
                      fillOpacity={isSelected ? 1 : 0.85}
                      stroke={isSelected ? '#F59E0B' : '#94A3B8'}
                      strokeWidth={isSelected ? 3 : 1.5}
                    />
                    <text
                      x={node.x}
                      y={node.y - 3}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      className="text-[10px] font-mono font-bold pointer-events-none"
                    >
                      {node.orderNumber}. {node.shortLabel}
                    </text>
                    <text
                      x={node.x}
                      y={node.y + 11}
                      textAnchor="middle"
                      fill="#FDE68A"
                      className="text-[9.5px] font-mono pointer-events-none"
                    >
                      {node.count} {isTr ? 'makale' : 'essays'}
                    </text>
                  </g>
                );
              })}
            </svg>
          ) : (
            /* Directed Continuation Flowchart SVG View (01 → 02 → 03 ...) */
            <svg
              viewBox="0 0 840 530"
              className="w-full h-[380px] sm:h-[460px] lg:h-[510px]"
              role="img"
              aria-label={
                isTr
                  ? `${activeCluster?.topic.labelTr} devamlılık okuma akış şeması`
                  : `${activeCluster?.topic.labelEn} sequential continuation flowchart`
              }
            >
              <text
                x="28"
                y="34"
                fill="#FCD34D"
                className="text-[11px] font-mono font-bold uppercase"
              >
                {activeCluster?.topic.orderNumber}.{' '}
                {isTr ? activeCluster?.topic.labelTr : activeCluster?.topic.labelEn} —{' '}
                {isTr ? 'İÇERİK TEMELLİ DEVAMLILIK AKIŞI (İLK 12 BÖLÜM)' : 'CONTENT CONTINUATION FLOW (FIRST 12 STEPS)'}
              </text>

              {/* Directed connector lines between sequential articles */}
              {sequenceFlowNodes.map((node, idx) => {
                if (idx === sequenceFlowNodes.length - 1) return null;
                const next = sequenceFlowNodes[idx + 1];
                const midX = (node.x + next.x) / 2;
                const midY = (node.y + next.y) / 2;
                return (
                  <g key={`flow-edge-${node.item.article.id}`}>
                    <line
                      x1={node.x}
                      y1={node.y}
                      x2={next.x}
                      y2={next.y}
                      stroke="#38BDF8"
                      strokeWidth="2"
                      strokeOpacity="0.8"
                    />
                    {next.item.continuityPercentWithPrev !== null && (
                      <text
                        x={midX}
                        y={midY - 7}
                        textAnchor="middle"
                        fill="#7DD3FC"
                        className="text-[9.5px] font-mono font-bold"
                      >
                        %{next.item.continuityPercentWithPrev}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Sequential article cards inside SVG */}
              {sequenceFlowNodes.map((node) => (
                <g
                  key={`flow-node-${node.item.article.id}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectArticle(node.item.article.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectArticle(node.item.article.id);
                    }
                  }}
                  className="cursor-pointer"
                >
                  <rect
                    x={node.x - 84}
                    y={node.y - 38}
                    width="168"
                    height="76"
                    rx="3"
                    fill="#111827"
                    stroke={activeCluster?.topic.color || '#1E3A8A'}
                    strokeWidth="2"
                  />
                  <text
                    x={node.x - 74}
                    y={node.y - 20}
                    fill="#FCD34D"
                    className="text-[10px] font-mono font-bold"
                  >
                    #{String(node.item.sequenceNumber).padStart(2, '0')} · Aşama {node.item.stage}
                  </text>
                  <text
                    x={node.x - 74}
                    y={node.y - 1}
                    fill="#F8FAFC"
                    className="text-[10px] font-sans font-semibold"
                  >
                    {node.titleShort.slice(0, 22)}
                  </text>
                  <text
                    x={node.x - 74}
                    y={node.y + 13}
                    fill="#CBD5E1"
                    className="text-[9.5px] font-sans"
                  >
                    {node.titleShort.slice(22, 44)}
                  </text>
                  <text
                    x={node.x - 74}
                    y={node.y + 29}
                    fill="#94A3B8"
                    className="text-[8.5px] font-mono"
                  >
                    {(node.item.bridgeSubConcepts[0] || node.item.matchedSubConceptLabels[0] || '').slice(0, 24)}
                  </text>
                </g>
              ))}
            </svg>
          )}

          {/* Interactive Sub-Concept Filter Bar inside Map Footer */}
          <div className="pt-3 border-t border-slate-800 space-y-2 text-[11px] font-mono">
            <div className="flex flex-wrap items-center justify-between gap-2 text-slate-300">
              <span>
                {isTr ? 'Aktif Konu:' : 'Active Topic:'}{' '}
                <strong className="text-amber-300">
                  {activeCluster?.topic.orderNumber}.{' '}
                  {isTr ? activeCluster?.topic.labelTr : activeCluster?.topic.labelEn}
                </strong>
              </span>
              {selectedSubConceptObj ? (
                <button
                  type="button"
                  onClick={() => setSelectedSubConceptId(null)}
                  className="inline-flex items-center gap-1 text-amber-300 hover:text-white cursor-pointer"
                >
                  <span>
                    {isTr ? 'Alt Kavram:' : 'Sub-Concept:'}{' '}
                    {isTr ? selectedSubConceptObj.labelTr : selectedSubConceptObj.labelEn}
                  </span>
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <span className="text-slate-400">
                  {isTr
                    ? 'İç halkadaki alt kavramlara tıklayarak zinciri daraltabilirsiniz'
                    : 'Click any inner sub-concept node to filter the continuation chain'}
                </span>
              )}
            </div>

            {/* Active Topic Sub-Concepts Quick Selector */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
              <span className="text-slate-400">{isTr ? 'Alt Kavramlar:' : 'Sub-Concepts:'}</span>
              {atlas.subConcepts
                .filter((sc) => sc.topicId === activeCluster?.topic.id)
                .map((sc) => {
                  const activeSub = selectedSubConceptId === sc.id;
                  return (
                    <button
                      key={`sc-btn-${sc.id}`}
                      type="button"
                      onClick={() => setSelectedSubConceptId((prev) => (prev === sc.id ? null : sc.id))}
                      className={`underline-offset-4 transition-colors cursor-pointer ${
                        activeSub
                          ? 'text-amber-300 font-bold underline'
                          : 'text-slate-300 hover:text-white hover:underline'
                      }`}
                    >
                      {isTr ? sc.labelTr : sc.labelEn} ({sc.count})
                    </button>
                  );
                })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Content-Based Sequential Continuation Chain (Birbirinin Devamı Niteliğinde Sıra) */}
        <div className="xl:col-span-5 bg-[#FBF9F5] border border-stone-300 p-4 flex flex-col justify-between gap-3">
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#1E3A8A]">
                  <ListOrdered aria-hidden="true" className="w-4 h-4 shrink-0" />
                  <span>
                    {isTr ? 'İçerik Devamlılık Sırası' : 'Content Continuation Sequence'}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-stone-600 tabular-nums">
                  {filteredSequence.length} {isTr ? 'makale' : 'essays'} · ~{activeCluster?.totalReadMinutes || 0} dk
                </span>
              </div>
              <p className="text-xs font-academic-body text-stone-700 leading-relaxed">
                {isTr ? activeCluster?.topic.descriptionTr : activeCluster?.topic.descriptionEn}
              </p>
            </div>

            {/* Apply Continuation Order to Main Corpus Feed */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (!activeCluster) return;
                  if (isCurrentTopicApplied) {
                    onClearAppliedContinuation();
                  } else {
                    onApplyContinuationToCorpus(
                      activeCluster.topic.id,
                      `${activeCluster.topic.orderNumber}. ${
                        isTr ? activeCluster.topic.labelTr : activeCluster.topic.labelEn
                      }`,
                      filteredSequence.map((item) => item.article.id)
                    );
                  }
                }}
                className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-mono font-semibold transition-colors cursor-pointer ${
                  isCurrentTopicApplied
                    ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                    : 'bg-[#1E3A8A] hover:bg-[#172E6E] text-white'
                }`}
              >
                <Compass aria-hidden="true" className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {isCurrentTopicApplied
                    ? isTr
                      ? 'Devamlılık Sırası Külliyatta Aktif (Sıfırla)'
                      : 'Applied to Corpus (Reset)'
                    : isTr
                      ? 'Bu Devamlılık Sırasını Külliyata Uygula'
                      : 'Apply Sequence to Corpus Feed'}
                </span>
              </button>
            </div>

            {/* Search within current topic sequence */}
            <div className="relative">
              <Search
                aria-hidden="true"
                className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2"
              />
              <input
                type="search"
                value={sequenceSearch}
                onChange={(e) => setSequenceSearch(e.target.value)}
                placeholder={
                  isTr
                    ? `${activeCluster?.topic.shortLabelTr} zincirinde başlık veya köprü kavram ara…`
                    : `Filter ${activeCluster?.topic.shortLabelEn} continuation chain…`
                }
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-stone-300 focus:outline-none focus:border-[#1E3A8A]"
              />
            </div>
          </div>

          {/* Sequential Ordered Essay Chain with Explicit Continuation Bridges */}
          <div className="max-h-[420px] overflow-y-auto border border-stone-200 bg-white divide-y divide-stone-200">
            {filteredSequence.slice(0, visibleCount).map((item, idx) => {
              const titleStr = getLocalizedText(item.article.title, language);
              const artLang =
                item.article.sourceLang ||
                detectEntrySourceLanguage(
                  getLocalizedText(item.article.title, 'tr'),
                  getLocalizedText(item.article.abstract, 'tr')
                );
              const canonicalHref = getLocalizedArticlePath(artLang, item.article.slug);

              return (
                <div key={item.article.id} className="p-3 space-y-1.5 hover:bg-[#FBF9F5] transition-colors">
                  {/* Continuation connector explaining why this article follows the previous one */}
                  {idx > 0 && item.continuityPercentWithPrev !== null && (
                    <div className="pb-1.5 mb-1.5 border-b border-stone-100 flex items-start gap-1.5 text-[11px] font-mono text-stone-600">
                      <ArrowDown aria-hidden="true" className="w-3.5 h-3.5 text-[#1E3A8A] shrink-0 mt-0.5" />
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 text-[#1E3A8A] font-semibold">
                          <span className="tabular-nums">
                            {isTr ? 'Devam Uyumu' : 'Continuity'}: %{item.continuityPercentWithPrev}
                          </span>
                          {item.bridgeSubConcepts.length > 0 && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="truncate">{item.bridgeSubConcepts.join(' · ')}</span>
                            </>
                          )}
                        </div>
                        <p className="text-[10.5px] font-sans text-stone-500 leading-snug">
                          {isTr ? item.transitionReasonTr : item.transitionReasonEn}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Sequence number + Stage + Title */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 text-[10.5px] font-mono text-stone-500 tabular-nums">
                        <span className="font-bold text-[#1E3A8A]">
                          {String(item.sequenceNumber).padStart(2, '0')}.
                        </span>
                        <span>{isTr ? item.stageLabelTr : item.stageLabelEn}</span>
                        <span aria-hidden="true">·</span>
                        <span>{item.article.readTimeMinutes} dk</span>
                      </div>

                      <a
                        href={canonicalHref}
                        onClick={(e) => {
                          e.preventDefault();
                          onSelectArticle(item.article.id);
                        }}
                        className="group inline-flex items-start gap-1 text-sm font-editorial font-semibold text-stone-900 hover:text-[#1E3A8A] leading-snug"
                      >
                        <span className="group-hover:underline">{titleStr}</span>
                        <ArrowUpRight
                          aria-hidden="true"
                          className="w-3.5 h-3.5 shrink-0 text-stone-400 group-hover:text-[#1E3A8A] mt-0.5"
                        />
                      </a>
                    </div>
                  </div>

                  {/* Clean unboxed sub-concepts & publication metadata */}
                  <div className="text-[10.5px] font-mono text-stone-500 flex flex-wrap items-center gap-1.5">
                    <span className="tabular-nums">{item.article.publishedAt}</span>
                    {item.matchedSubConceptLabels.slice(0, 3).map((lbl) => (
                      <React.Fragment key={`${item.article.id}-${lbl}`}>
                        <span aria-hidden="true">·</span>
                        <span>{lbl}</span>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              );
            })}

            {filteredSequence.length > visibleCount && (
              <div className="p-2.5 text-center bg-[#FBF9F5]">
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + 20)}
                  className="text-xs font-mono font-semibold text-[#1E3A8A] hover:underline cursor-pointer"
                >
                  {isTr
                    ? `Devamını Göster (+${filteredSequence.length - visibleCount} makale daha)`
                    : `Show More (+${filteredSequence.length - visibleCount} more essays)`}
                </button>
              </div>
            )}

            {filteredSequence.length === 0 && (
              <div className="p-6 text-center text-xs font-mono text-stone-500">
                {isTr
                  ? 'Seçili alt kavram veya arama filtresiyle eşleşen makale bulunamadı.'
                  : 'No essays match the selected sub-concept or filter.'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cross-Topic Conceptual Bridges Footer Strip */}
      {activeCluster && activeCluster.topBridgedTopics.length > 0 && (
        <div className="pt-4 border-t border-stone-200 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="text-xs font-mono text-stone-600 shrink-0">
            {isTr
              ? 'Bu Konudan Geçiş Yapılan Komşu Disiplinler:'
              : 'Bridged Neighboring Disciplines:'}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {activeCluster.topBridgedTopics.map((bridge) => (
              <button
                key={bridge.topicId}
                type="button"
                onClick={() => handleSelectTopic(bridge.topicId)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-[#FBF9F5] hover:bg-stone-100 border border-stone-300 hover:border-[#1E3A8A] text-stone-800 transition-colors cursor-pointer"
              >
                <span>{isTr ? bridge.labelTr : bridge.labelEn}</span>
                <span aria-hidden="true" className="text-stone-400">·</span>
                <span className="text-[#1E3A8A] font-semibold tabular-nums">
                  {bridge.sharedWeight} {isTr ? 'köprü' : 'links'}
                </span>
                <ArrowRight aria-hidden="true" className="w-3 h-3 text-stone-400" />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
