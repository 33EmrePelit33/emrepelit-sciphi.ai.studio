import React, { useMemo, useState } from 'react';
import { ArrowUpRight, Compass, Network, Search } from 'lucide-react';
import { Article, LanguageCode } from '../types';
import { getLocalizedText } from '../i18n/translations';
import { detectEntrySourceLanguage, getLocalizedArticlePath } from '../utils/articleLocale';

interface KnowledgeGraphProps {
  articles: Article[];
  language: LanguageCode;
  onSelectArticle: (articleId: string) => void;
}

interface ConceptDef {
  id: string;
  label: string;
  shortLabel: string;
  color: string;
  keywords: RegExp;
  description: string;
}

const CONCEPTS: ConceptDef[] = [
  {
    id: 'entropy',
    label: 'Entropi & Termodinamik',
    shortLabel: 'Entropi',
    color: '#9A3412',
    keywords: /entrop|termodinamik|boltzmann|landauer|ısı|termodin/i,
    description: 'Bilgi maliyeti, geri döndürülemezlik, zamanın termodinamik oku ve Landauer sınırı.',
  },
  {
    id: 'quantum',
    label: 'Kuantum Mekaniği & Gözlemci',
    shortLabel: 'Kuantum',
    color: '#1E3A8A',
    keywords: /kuantum|quantum|quanten|quantique|cuántic|gözlemci|dalga|dolanık|süperpozisyon|heisenberg|bell/i,
    description: 'Dalga fonksiyonu çökmesi, dolanıklık, dekoherans ve gözlemci-sistem etkileşimi.',
  },
  {
    id: 'consciousness',
    label: 'Bilinç, Zihin & Yapay Zeka',
    shortLabel: 'Bilinç & YZ',
    color: '#047857',
    keywords: /bilinç|zihin|şuur|conscious|yapay zeka|llm|silikon|beyin|algı|idrak|qualia/i,
    description: 'Biyolojik ve silikon temelli biliş, öznel deneyim, sinir ağları ve anlam inşası.',
  },
  {
    id: 'spacetime',
    label: 'Kozmoloji & Uzay-Zaman',
    shortLabel: 'Uzay-Zaman',
    color: '#6D28D9',
    keywords: /zaman|uzay|evren|kozmo|görelilik|kara delik|kütleçekim|yerçekim|spacetime|universe|time|temps|zeit/i,
    description: 'Blok evren, kütleçekim geometrisi, kozmolojik genişleme ve zamansal asimetri.',
  },
  {
    id: 'simulation',
    label: 'Simülasyon & Holografik Evren',
    shortLabel: 'Simülasyon',
    color: '#B45309',
    keywords: /simülasyon|simulation|hologra|enformasyon|kod|algoritma|digital|sanal/i,
    description: 'Holografik sınır ilkesi, hesaplanabilir fizik ve gerçekliğin enformasyonel dokusu.',
  },
  {
    id: 'particle',
    label: 'Parçacık Fiziği & Higgs',
    shortLabel: 'Higgs & Madde',
    color: '#0F766E',
    keywords: /higgs|parçacık|bozon|fermiyon|simetri|foton|atom|madde|vakum/i,
    description: 'Kendiliğinden simetri kırılması, kütle kazanımı, kuantum alanları ve vakum yapısı.',
  },
  {
    id: 'determinism',
    label: 'Kader, Özgür İrade & Kaos',
    shortLabel: 'Determinizm',
    color: '#BE123C',
    keywords: /kader|özgür irade|determin|kaos|olup bit|nedensellik|seçim|free will|destiny/i,
    description: 'Belirlenimcilik, kaotik duyarlılık, öngörülemezlik ve nedensellik ağları.',
  },
  {
    id: 'epistemology',
    label: 'Epistemoloji, Din & Varlık',
    shortLabel: 'Epistemoloji',
    color: '#334155',
    keywords: /epistem|felsefe|ontoloji|hakikat|bilgi|yarat|tanrı|peygamber|inanç|anlam|varlık/i,
    description: 'Bilginin sınırları, bilimsel yöntem, anlam arayışı ve metafizik temeller.',
  },
];

export const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({
  articles,
  language,
  onSelectArticle,
}) => {
  const [selectedConceptId, setSelectedConceptId] = useState<string>('entropy');
  const [hoveredConceptId, setHoveredConceptId] = useState<string | null>(null);
  const [conceptFilterText, setConceptFilterText] = useState<string>('');

  const graphData = useMemo(() => {
    const conceptArticlesMap: Record<string, Article[]> = {};
    const edgesMap: Record<string, number> = {};

    CONCEPTS.forEach((c) => {
      conceptArticlesMap[c.id] = [];
    });

    articles.forEach((art) => {
      const haystack = [
        getLocalizedText(art.title, 'tr'),
        getLocalizedText(art.title, 'en'),
        getLocalizedText(art.abstract, 'tr'),
        getLocalizedText(art.abstract, 'en'),
        art.category,
      ].join(' ');

      const matchedIds: string[] = [];
      CONCEPTS.forEach((c) => {
        if (c.keywords.test(haystack)) {
          conceptArticlesMap[c.id].push(art);
          matchedIds.push(c.id);
        }
      });

      if (matchedIds.length === 0) {
        conceptArticlesMap.epistemology.push(art);
        matchedIds.push('epistemology');
      }

      for (let i = 0; i < matchedIds.length; i++) {
        for (let j = i + 1; j < matchedIds.length; j++) {
          const key = [matchedIds[i], matchedIds[j]].sort().join('::');
          edgesMap[key] = (edgesMap[key] || 0) + 1;
        }
      }
    });

    const cx = 320;
    const cy = 200;
    const rx = 215;
    const ry = 142;

    const nodes = CONCEPTS.map((c, idx) => {
      const angle = (idx / CONCEPTS.length) * Math.PI * 2 - Math.PI / 2;
      const count = conceptArticlesMap[c.id].length;
      const radius = Math.max(20, Math.min(38, 16 + Math.sqrt(count) * 1.6));
      return {
        ...c,
        x: cx + rx * Math.cos(angle),
        y: cy + ry * Math.sin(angle),
        count,
        radius,
      };
    });

    const edges = Object.entries(edgesMap)
      .map(([pairKey, weight]) => {
        const [sourceId, targetId] = pairKey.split('::');
        const source = nodes.find((n) => n.id === sourceId);
        const target = nodes.find((n) => n.id === targetId);
        if (!source || !target) return null;
        return { pairKey, source, target, weight };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item));

    return { nodes, edges, conceptArticlesMap };
  }, [articles]);

  const activeConcept =
    graphData.nodes.find((n) => n.id === selectedConceptId) || graphData.nodes[0];

  const connectedArticles = useMemo(() => {
    const list = graphData.conceptArticlesMap[activeConcept.id] || [];
    const q = conceptFilterText.trim().toLowerCase();
    if (!q) return list;
    return list.filter((art) => {
      const t = getLocalizedText(art.title, language).toLowerCase();
      const abs = getLocalizedText(art.abstract, language).toLowerCase();
      return t.includes(q) || abs.includes(q);
    });
  }, [graphData, activeConcept.id, conceptFilterText, language]);

  const focusId = hoveredConceptId || selectedConceptId;

  return (
    <section
      id="knowledge-graph"
      aria-label="Etkileşimli Kavram ve Felsefi-Bilimsel Ağ Grafiği"
      className="bg-white border border-stone-300 p-6 lg:p-8 space-y-6"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#1E3A8A] font-semibold">
            <Network className="w-4 h-4" />
            <span>KÜLLİYAT KAVRAM HARİTASI · {articles.length} MAKALE ANLAMSAL BAĞLANTI AĞI</span>
          </div>
          <h2 className="text-2xl font-editorial font-semibold text-stone-900">
            Etkileşimli Bilim &amp; Felsefe Kavram Grafiği (Knowledge Graph)
          </h2>
          <p className="text-xs text-stone-600 max-w-3xl leading-relaxed">
            Makaleler arasındaki temel fiziksel ve felsefi kavşakları (Entropi, Kuantum Mekaniği, Bilinç, Simülasyon Hipotezi, Uzay-Zaman) keşfedin. Herhangi bir kavram düğümüne tıklayarak ilgili makalelere doğrudan geçiş yapabilirsiniz.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {graphData.nodes.map((node) => (
            <button
              key={node.id}
              type="button"
              onClick={() => setSelectedConceptId(node.id)}
              onMouseEnter={() => setHoveredConceptId(node.id)}
              onMouseLeave={() => setHoveredConceptId(null)}
              className={`px-2.5 py-1 text-[11px] font-mono rounded-xs border transition-colors cursor-pointer whitespace-nowrap ${
                selectedConceptId === node.id
                  ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] font-bold'
                  : 'bg-[#FBF9F5] text-stone-700 border-stone-300 hover:border-[#1E3A8A]'
              }`}
            >
              {node.shortLabel} ({node.count})
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Interactive SVG Constellation Canvas */}
        <div className="lg:col-span-7 bg-[#0B1120] border border-slate-800 rounded-xs p-4 flex flex-col justify-between">
          <svg
            viewBox="0 0 640 400"
            className="w-full h-80 lg:h-[360px]"
            role="img"
            aria-label="Emre Pelit Külliyatı Kavram İlişki Ağı"
          >
            {/* Central Hub Anchor */}
            <circle cx="320" cy="200" r="24" fill="#1E3A8A" stroke="#F59E0B" strokeWidth="2" />
            <text
              x="320"
              y="197"
              textAnchor="middle"
              fill="#FFFFFF"
              className="text-[10px] font-mono font-bold"
            >
              Sci-Phil
            </text>
            <text
              x="320"
              y="210"
              textAnchor="middle"
              fill="#FCD34D"
              className="text-[9px] font-mono"
            >
              {articles.length} Makale
            </text>

            {/* Spokes from center to concept nodes */}
            {graphData.nodes.map((node) => {
              const isFocus = focusId === node.id;
              return (
                <line
                  key={`hub-${node.id}`}
                  x1="320"
                  y1="200"
                  x2={node.x}
                  y2={node.y}
                  stroke={isFocus ? '#F59E0B' : '#1E293B'}
                  strokeWidth={isFocus ? 2 : 1}
                  strokeDasharray={isFocus ? undefined : '3 3'}
                />
              );
            })}

            {/* Inter-concept co-occurrence edges */}
            {graphData.edges.map((edge) => {
              const touchesFocus =
                edge.source.id === focusId || edge.target.id === focusId;
              const strokeWidth = Math.min(4.5, 0.8 + edge.weight * 0.04);
              return (
                <line
                  key={edge.pairKey}
                  x1={edge.source.x}
                  y1={edge.source.y}
                  x2={edge.target.x}
                  y2={edge.target.y}
                  stroke={touchesFocus ? '#38BDF8' : '#334155'}
                  strokeOpacity={touchesFocus ? 0.85 : 0.28}
                  strokeWidth={touchesFocus ? Math.max(1.5, strokeWidth) : strokeWidth}
                />
              );
            })}

            {/* Concept Nodes */}
            {graphData.nodes.map((node) => {
              const isSelected = selectedConceptId === node.id;
              const isHovered = hoveredConceptId === node.id;
              return (
                <g
                  key={node.id}
                  onClick={() => setSelectedConceptId(node.id)}
                  onMouseEnter={() => setHoveredConceptId(node.id)}
                  onMouseLeave={() => setHoveredConceptId(null)}
                  className="cursor-pointer"
                  role="button"
                  tabIndex={0}
                  aria-label={`${node.label}: ${node.count} makale`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedConceptId(node.id);
                    }
                  }}
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.radius + (isSelected || isHovered ? 4 : 0)}
                    fill={node.color}
                    fillOpacity={isSelected ? 0.96 : 0.82}
                    stroke={isSelected ? '#F59E0B' : '#94A3B8'}
                    strokeWidth={isSelected ? 3 : 1.5}
                  />
                  <text
                    x={node.x}
                    y={node.y - 2}
                    textAnchor="middle"
                    fill="#FFFFFF"
                    className="text-[10px] font-mono font-bold pointer-events-none"
                  >
                    {node.shortLabel}
                  </text>
                  <text
                    x={node.x}
                    y={node.y + 11}
                    textAnchor="middle"
                    fill="#FDE68A"
                    className="text-[9px] font-mono pointer-events-none"
                  >
                    {node.count} yazı
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-300">
            <span>
              Seçili Düğüm: <strong className="text-amber-300">{activeConcept.label}</strong>
            </span>
            <span>Bağlantı Çizgileri = Ortak Kavram Kesişim Yoğunluğu</span>
          </div>
        </div>

        {/* Connected Articles Inspector */}
        <div className="lg:col-span-5 bg-[#FBF9F5] border border-stone-300 p-4 flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#1E3A8A]">
                <Compass className="w-4 h-4" />
                <span>{activeConcept.label}</span>
              </div>
              <span className="text-[11px] font-mono text-stone-600 tabular-nums">
                {connectedArticles.length} İlgili Çalışma
              </span>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">{activeConcept.description}</p>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={conceptFilterText}
                onChange={(e) => setConceptFilterText(e.target.value)}
                placeholder={`${activeConcept.shortLabel} kümesinde filtrele...`}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-stone-300 focus:outline-none focus:border-[#1E3A8A]"
              />
            </div>
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-stone-200 border border-stone-200 bg-white">
            {connectedArticles.slice(0, 40).map((art) => {
              const titleStr = getLocalizedText(art.title, language);
              const artLang =
                art.sourceLang ||
                detectEntrySourceLanguage(
                  getLocalizedText(art.title, 'tr'),
                  getLocalizedText(art.abstract, 'tr')
                );
              const canonicalHref = getLocalizedArticlePath(artLang, art.slug);
              return (
                <div key={art.id} className="p-2.5 hover:bg-[#FBF9F5] transition-colors">
                  <a
                    href={canonicalHref}
                    onClick={(e) => {
                      e.preventDefault();
                      onSelectArticle(art.id);
                    }}
                    className="group flex items-start justify-between gap-2 text-xs font-medium text-stone-900 hover:text-[#1E3A8A]"
                  >
                    <span className="leading-snug line-clamp-2 group-hover:underline">
                      {titleStr}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 shrink-0 text-stone-400 group-hover:text-[#1E3A8A] mt-0.5" />
                  </a>
                  <div className="mt-1 text-[10px] font-mono text-stone-500 flex items-center gap-1.5">
                    <span>{art.publishedAt}</span>
                    <span aria-hidden="true">·</span>
                    <span>{art.readTimeMinutes} dk</span>
                    <span aria-hidden="true">·</span>
                    <span className="truncate">{art.category}</span>
                  </div>
                </div>
              );
            })}
            {connectedArticles.length === 0 && (
              <div className="p-4 text-xs text-stone-500 text-center">
                Bu filtre ile eşleşen kavram makalesi bulunamadı.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
