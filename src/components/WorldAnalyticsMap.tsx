import React, { useMemo, useState } from 'react';
import { Eye, BookOpen, Globe, MapPin, ArrowUpDown, Layers } from 'lucide-react';

export interface RegionMetricTotals {
  tr: { reads: number; views: number };
  eu: { reads: number; views: number };
  amer: { reads: number; views: number };
  asia: { reads: number; views: number };
  menaOther: { reads: number; views: number };
}

export interface CountryMetricRow {
  code: string;
  countryName: string;
  regionKey: 'tr' | 'eu' | 'amer' | 'asia' | 'menaOther';
  regionLabel: string;
  baseShare: number;
  academicHubs: string;
  reads: number;
  views: number;
  sharePct: number;
}

interface WorldAnalyticsMapProps {
  regionTotals: RegionMetricTotals;
  countryTotals: CountryMetricRow[];
  totalReads: number;
  totalViews: number;
  compact?: boolean;
}

interface CountryMarkerGeo {
  code: string;
  x: number;
  y: number;
  shortLabel: string;
}

const COUNTRY_MARKERS: Record<string, CountryMarkerGeo> = {
  TR: { code: 'TR', x: 566, y: 186, shortLabel: 'TR' },
  DE: { code: 'DE', x: 516, y: 148, shortLabel: 'DE' },
  GB: { code: 'GB', x: 482, y: 141, shortLabel: 'UK' },
  FR: { code: 'FR', x: 493, y: 162, shortLabel: 'FR' },
  CH: { code: 'CH', x: 508, y: 161, shortLabel: 'CH/NL' },
  ES_IT: { code: 'ES_IT', x: 498, y: 181, shortLabel: 'ES/IT' },
  US: { code: 'US', x: 215, y: 184, shortLabel: 'US' },
  CA_BR: { code: 'CA_BR', x: 292, y: 312, shortLabel: 'CA/BR' },
  AZ_TRK: { code: 'AZ_TRK', x: 632, y: 184, shortLabel: 'AZ/TRK' },
  JP_KR: { code: 'JP_KR', x: 836, y: 192, shortLabel: 'JP/KR' },
  CN_IN: { code: 'CN_IN', x: 742, y: 224, shortLabel: 'CN/IN' },
  MENA_RU_OC: { code: 'MENA_RU_OC', x: 604, y: 232, shortLabel: 'MENA/OC' },
};

const REGION_META: Record<
  'tr' | 'eu' | 'amer' | 'asia' | 'menaOther',
  {
    name: string;
    subtitle: string;
    accentHex: string;
    borderClass: string;
    badgeClass: string;
    barReadsClass: string;
    barViewsClass: string;
  }
> = {
  tr: {
    name: 'Türkiye',
    subtitle: 'Anadolu & Marmara Akademik Merkezi',
    accentHex: '#10b981',
    borderClass: 'border-emerald-500/60',
    badgeClass: 'bg-emerald-950 text-emerald-300 border-emerald-500/50',
    barReadsClass: 'bg-emerald-400',
    barViewsClass: 'bg-cyan-400',
  },
  eu: {
    name: 'Avrupa',
    subtitle: 'Almanya, BK, Fransa, İsviçre, İspanya & İtalya',
    accentHex: '#38bdf8',
    borderClass: 'border-sky-500/60',
    badgeClass: 'bg-sky-950 text-sky-300 border-sky-500/50',
    barReadsClass: 'bg-sky-400',
    barViewsClass: 'bg-cyan-300',
  },
  amer: {
    name: 'Amerika',
    subtitle: 'ABD, Kanada & Latin Amerika',
    accentHex: '#f59e0b',
    borderClass: 'border-amber-500/60',
    badgeClass: 'bg-amber-950 text-amber-300 border-amber-500/50',
    barReadsClass: 'bg-amber-400',
    barViewsClass: 'bg-cyan-400',
  },
  asia: {
    name: 'Asya-Pasifik & Türk Devletleri',
    subtitle: 'Azerbaycan, Türk Devletleri, Japonya, Kore, Çin, Hindistan',
    accentHex: '#a855f7',
    borderClass: 'border-purple-500/60',
    badgeClass: 'bg-purple-950 text-purple-300 border-purple-500/50',
    barReadsClass: 'bg-purple-400',
    barViewsClass: 'bg-cyan-400',
  },
  menaOther: {
    name: 'Orta Doğu, K. Afrika, Rusya & Okyanusya',
    subtitle: 'MENA, Moskova, Sidney & Melbourne',
    accentHex: '#f43f5e',
    borderClass: 'border-rose-500/60',
    badgeClass: 'bg-rose-950 text-rose-300 border-rose-500/50',
    barReadsClass: 'bg-rose-400',
    barViewsClass: 'bg-cyan-400',
  },
};

export const WorldAnalyticsMap: React.FC<WorldAnalyticsMapProps> = ({
  regionTotals,
  countryTotals,
  totalReads,
  totalViews,
  compact = false,
}) => {
  const [metricMode, setMetricMode] = useState<'both' | 'reads' | 'views'>('both');
  const [selectedRegion, setSelectedRegion] = useState<'all' | 'tr' | 'eu' | 'amer' | 'asia' | 'menaOther'>('all');
  const [hoveredCountryCode, setHoveredCountryCode] = useState<string | null>('TR');
  const [sortBy, setSortBy] = useState<'reads' | 'views' | 'share'>('reads');

  const safeTotalReads = Math.max(1, totalReads);
  const safeTotalViews = Math.max(1, totalViews);

  const regionRows = useMemo(() => {
    const keys: Array<'tr' | 'eu' | 'amer' | 'asia' | 'menaOther'> = [
      'tr',
      'eu',
      'amer',
      'asia',
      'menaOther',
    ];
    return keys.map((key) => {
      const stats = regionTotals[key];
      const readsPct = Number(((stats.reads / safeTotalReads) * 100).toFixed(1));
      const viewsPct = Number(((stats.views / safeTotalViews) * 100).toFixed(1));
      const readToViewPct = Number(((stats.reads / Math.max(1, stats.views)) * 100).toFixed(1));
      return {
        key,
        ...REGION_META[key],
        reads: stats.reads,
        views: stats.views,
        readsPct,
        viewsPct,
        readToViewPct,
      };
    });
  }, [regionTotals, safeTotalReads, safeTotalViews]);

  const maxRegionReads = Math.max(1, ...regionRows.map((r) => r.reads));
  const maxRegionViews = Math.max(1, ...regionRows.map((r) => r.views));
  const maxCountryMetric = Math.max(
    1,
    ...countryTotals.map((c) => (metricMode === 'views' ? c.views : c.reads))
  );

  const sortedCountries = useMemo(() => {
    const filtered =
      selectedRegion === 'all'
        ? countryTotals
        : countryTotals.filter((c) => c.regionKey === selectedRegion);
    return [...filtered].sort((a, b) => {
      if (sortBy === 'views') return b.views - a.views;
      if (sortBy === 'share') return b.sharePct - a.sharePct;
      return b.reads - a.reads;
    });
  }, [countryTotals, selectedRegion, sortBy]);

  const activeCountry = useMemo(() => {
    return (
      countryTotals.find((c) => c.code === hoveredCountryCode) ||
      countryTotals[0] ||
      null
    );
  }, [countryTotals, hoveredCountryCode]);

  const getRegionFillOpacity = (regionKey: 'tr' | 'eu' | 'amer' | 'asia' | 'menaOther') => {
    const stats = regionTotals[regionKey];
    const ratio =
      metricMode === 'views'
        ? stats.views / maxRegionViews
        : stats.reads / maxRegionReads;
    const base = 0.2 + ratio * 0.55;
    if (selectedRegion !== 'all' && selectedRegion !== regionKey) return 0.12;
    return Number(Math.min(0.82, base).toFixed(2));
  };

  return (
    <div className="bg-slate-950 border-2 border-cyan-500/60 rounded-xs p-4 sm:p-5 space-y-5 font-mono text-xs text-slate-100">
      {/* Header & Metric Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-cyan-400 text-slate-950 font-extrabold text-[10px] rounded-xs uppercase">
              <Globe className="w-3.5 h-3.5" />
              <span>KÜRESEL DÜNYA HARİTASI &amp; BÖLGESEL OKUNMA / GÖRÜNTÜLENME ÇİZELGESİ</span>
            </span>
            <span className="text-[10px] text-emerald-300 font-bold">
              5 Ana Dünya Bölgesi · 12 Ülke Kümesi · %100 Toplam Mutabakatı
            </span>
          </div>
          <p className="text-[11px] text-slate-300">
            Harita üzerindeki kıta bölgelerine veya akademik merkez işaretçilerine tıklayarak bölgeler arası okunma ve görüntülenme dağılımını canlı inceleyin.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
          {(
            [
              { id: 'both', label: 'Birleşik (Ok. + Gör.)', icon: Layers },
              { id: 'reads', label: 'Okunma Yoğunluğu', icon: BookOpen },
              { id: 'views', label: 'Görüntülenme Yoğunluğu', icon: Eye },
            ] as const
          ).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setMetricMode(id)}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-bold rounded-xs border transition-colors cursor-pointer ${
                metricMode === id
                  ? 'bg-emerald-400 text-slate-950 border-emerald-300'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive World Map + Live Focus HUD */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
        <div className="xl:col-span-8 bg-[#071120] border border-slate-800 rounded-xs p-3 relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2 text-[10px] text-slate-400">
            <span>İnteraktif Dünya Isı &amp; Merkez Haritası (WGS84 Projeksiyon)</span>
            <div className="flex flex-wrap items-center gap-2">
              {selectedRegion !== 'all' && (
                <button
                  type="button"
                  onClick={() => setSelectedRegion('all')}
                  className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 rounded-xs cursor-pointer"
                >
                  Tüm Dünyayı Göster ✕
                </button>
              )}
              <span className="text-amber-300 font-bold tabular-nums">
                {totalReads.toLocaleString('tr-TR')} Okunma
              </span>
              <span>·</span>
              <span className="text-cyan-300 font-bold tabular-nums">
                {totalViews.toLocaleString('tr-TR')} Görüntülenme
              </span>
            </div>
          </div>

          <svg
            viewBox="0 0 1000 480"
            role="img"
            aria-label="Dünya bölgelerine göre okunma ve görüntülenme dağılımı haritası"
            className="w-full h-auto block select-none"
          >
            <defs>
              <radialGradient id="oceanGlow" cx="50%" cy="42%" r="60%">
                <stop offset="0%" stopColor="#0f2342" />
                <stop offset="100%" stopColor="#060d19" />
              </radialGradient>
              <filter id="markerGlow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Ocean backdrop */}
            <rect x="0" y="0" width="1000" height="480" fill="url(#oceanGlow)" rx="4" />

            {/* Scientific Latitude / Longitude Graticule */}
            {[80, 160, 240, 320, 400].map((y) => (
              <line
                key={`lat-${y}`}
                x1="0"
                y1={y}
                x2="1000"
                y2={y}
                stroke="#1e293b"
                strokeWidth={y === 240 ? '1.1' : '0.6'}
                strokeDasharray={y === 240 ? '4 4' : '2 6'}
              />
            ))}
            {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((x) => (
              <line
                key={`lon-${x}`}
                x1={x}
                y1="0"
                x2={x}
                y2="480"
                stroke="#1e293b"
                strokeWidth="0.6"
                strokeDasharray="2 6"
              />
            ))}

            {/* AMER: North & South America */}
            <g
              className="cursor-pointer transition-opacity"
              onClick={() => setSelectedRegion((prev) => (prev === 'amer' ? 'all' : 'amer'))}
              onMouseEnter={() => setHoveredCountryCode('US')}
            >
              {/* North America */}
              <path
                d="M 74,78 L 138,62 L 222,58 L 285,78 L 316,112 L 288,150 L 266,188 L 245,212 L 224,232 L 204,244 L 185,224 L 160,192 L 134,158 L 112,126 L 80,104 Z"
                fill={REGION_META.amer.accentHex}
                fillOpacity={getRegionFillOpacity('amer')}
                stroke="#fbbf24"
                strokeWidth={selectedRegion === 'amer' ? '2' : '1'}
              />
              {/* Greenland */}
              <path
                d="M 326,38 L 386,34 L 402,68 L 368,94 L 336,78 Z"
                fill={REGION_META.amer.accentHex}
                fillOpacity={getRegionFillOpacity('amer') * 0.7}
                stroke="#fbbf24"
                strokeWidth="0.8"
              />
              {/* South America */}
              <path
                d="M 244,254 L 296,262 L 344,298 L 352,334 L 322,382 L 298,426 L 274,442 L 264,404 L 254,352 L 236,304 Z"
                fill={REGION_META.amer.accentHex}
                fillOpacity={getRegionFillOpacity('amer')}
                stroke="#fbbf24"
                strokeWidth={selectedRegion === 'amer' ? '2' : '1'}
              />
            </g>

            {/* EU: Western, Central, Northern & Southern Europe */}
            <g
              className="cursor-pointer transition-opacity"
              onClick={() => setSelectedRegion((prev) => (prev === 'eu' ? 'all' : 'eu'))}
              onMouseEnter={() => setHoveredCountryCode('DE')}
            >
              {/* Continental Europe */}
              <path
                d="M 464,174 L 472,146 L 494,126 L 516,96 L 548,88 L 570,106 L 566,144 L 552,172 L 532,184 L 510,180 L 486,188 Z"
                fill={REGION_META.eu.accentHex}
                fillOpacity={getRegionFillOpacity('eu')}
                stroke="#7dd3fc"
                strokeWidth={selectedRegion === 'eu' ? '2' : '1'}
              />
              {/* UK & Ireland */}
              <path
                d="M 470,130 L 484,126 L 490,146 L 474,152 Z"
                fill={REGION_META.eu.accentHex}
                fillOpacity={getRegionFillOpacity('eu')}
                stroke="#7dd3fc"
                strokeWidth="1"
              />
            </g>

            {/* TR: Turkey / Anatolia Distinct Focal Hub */}
            <g
              className="cursor-pointer transition-opacity"
              onClick={() => setSelectedRegion((prev) => (prev === 'tr' ? 'all' : 'tr'))}
              onMouseEnter={() => setHoveredCountryCode('TR')}
            >
              <path
                d="M 544,178 L 588,176 L 594,192 L 574,198 L 546,194 Z"
                fill={REGION_META.tr.accentHex}
                fillOpacity={Math.min(0.95, getRegionFillOpacity('tr') + 0.15)}
                stroke="#6ee7b7"
                strokeWidth="2"
              />
            </g>

            {/* MENA_RU_OC: Africa, Middle East, Northern Russia & Oceania */}
            <g
              className="cursor-pointer transition-opacity"
              onClick={() => setSelectedRegion((prev) => (prev === 'menaOther' ? 'all' : 'menaOther'))}
              onMouseEnter={() => setHoveredCountryCode('MENA_RU_OC')}
            >
              {/* Africa */}
              <path
                d="M 468,208 L 528,206 L 568,224 L 594,264 L 584,316 L 554,376 L 528,396 L 508,354 L 494,296 L 460,262 Z"
                fill={REGION_META.menaOther.accentHex}
                fillOpacity={getRegionFillOpacity('menaOther')}
                stroke="#fda4af"
                strokeWidth={selectedRegion === 'menaOther' ? '2' : '0.9'}
              />
              {/* Arabian Peninsula / Middle East */}
              <path
                d="M 576,204 L 622,208 L 634,242 L 602,260 L 580,236 Z"
                fill={REGION_META.menaOther.accentHex}
                fillOpacity={getRegionFillOpacity('menaOther')}
                stroke="#fda4af"
                strokeWidth="0.9"
              />
              {/* Northern Russia / Siberia */}
              <path
                d="M 572,82 L 674,66 L 788,70 L 882,92 L 866,132 L 774,136 L 680,142 L 578,144 Z"
                fill={REGION_META.menaOther.accentHex}
                fillOpacity={getRegionFillOpacity('menaOther') * 0.85}
                stroke="#fda4af"
                strokeWidth="0.9"
              />
              {/* Australia & New Zealand */}
              <path
                d="M 768,332 L 834,324 L 870,356 L 858,400 L 802,406 L 766,374 Z"
                fill={REGION_META.menaOther.accentHex}
                fillOpacity={getRegionFillOpacity('menaOther')}
                stroke="#fda4af"
                strokeWidth="1"
              />
              <path
                d="M 896,406 L 912,396 L 916,422 L 898,430 Z"
                fill={REGION_META.menaOther.accentHex}
                fillOpacity={getRegionFillOpacity('menaOther')}
                stroke="#fda4af"
                strokeWidth="0.8"
              />
            </g>

            {/* ASIA: Caucasus, Central Asia, South Asia, East Asia, Japan & Korea */}
            <g
              className="cursor-pointer transition-opacity"
              onClick={() => setSelectedRegion((prev) => (prev === 'asia' ? 'all' : 'asia'))}
              onMouseEnter={() => setHoveredCountryCode('AZ_TRK')}
            >
              {/* Central Asia, China, India & SE Asia */}
              <path
                d="M 596,154 L 688,146 L 788,146 L 826,184 L 808,236 L 772,276 L 732,262 L 704,284 L 678,248 L 636,216 L 602,192 Z"
                fill={REGION_META.asia.accentHex}
                fillOpacity={getRegionFillOpacity('asia')}
                stroke="#d8b4fe"
                strokeWidth={selectedRegion === 'asia' ? '2' : '1'}
              />
              {/* Japan & Korea */}
              <path
                d="M 822,172 L 848,166 L 860,196 L 836,210 Z"
                fill={REGION_META.asia.accentHex}
                fillOpacity={getRegionFillOpacity('asia')}
                stroke="#d8b4fe"
                strokeWidth="1"
              />
              {/* Maritime SE Asia */}
              <path
                d="M 744,296 L 808,296 L 822,314 L 752,316 Z"
                fill={REGION_META.asia.accentHex}
                fillOpacity={getRegionFillOpacity('asia') * 0.8}
                stroke="#d8b4fe"
                strokeWidth="0.8"
              />
            </g>

            {/* Academic Network Connection Arcs from Turkey Hub to Major Global Hubs */}
            {(['US', 'DE', 'GB', 'JP_KR', 'CN_IN', 'AZ_TRK', 'CA_BR'] as const).map((targetCode) => {
              const from = COUNTRY_MARKERS.TR;
              const to = COUNTRY_MARKERS[targetCode];
              if (!from || !to) return null;
              const midX = (from.x + to.x) / 2;
              const midY = Math.min(from.y, to.y) - 36;
              return (
                <path
                  key={`arc-${targetCode}`}
                  d={`M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`}
                  fill="none"
                  stroke="#38bdf8"
                  strokeOpacity="0.28"
                  strokeWidth="1"
                  strokeDasharray="3 4"
                />
              );
            })}

            {/* Proportional Data Markers for All 12 Countries / Regional Hubs */}
            {countryTotals.map((c) => {
              const marker = COUNTRY_MARKERS[c.code];
              if (!marker) return null;
              const val = metricMode === 'views' ? c.views : c.reads;
              const norm = Math.sqrt(val / maxCountryMetric);
              const radius = Math.max(5.5, Math.min(18, 5.5 + norm * 12.5));
              const isSelected = hoveredCountryCode === c.code;
              const regionColor = REGION_META[c.regionKey].accentHex;
              const dimmed = selectedRegion !== 'all' && selectedRegion !== c.regionKey;

              return (
                <g
                  key={c.code}
                  className="cursor-pointer"
                  opacity={dimmed ? 0.25 : 1}
                  onMouseEnter={() => setHoveredCountryCode(c.code)}
                  onClick={() => {
                    setHoveredCountryCode(c.code);
                    setSelectedRegion(c.regionKey);
                  }}
                >
                  <circle
                    cx={marker.x}
                    cy={marker.y}
                    r={radius + 4}
                    fill={regionColor}
                    fillOpacity={isSelected ? 0.35 : 0.16}
                  />
                  <circle
                    cx={marker.x}
                    cy={marker.y}
                    r={radius}
                    fill={metricMode === 'views' ? '#22d3ee' : regionColor}
                    fillOpacity="0.88"
                    stroke={isSelected ? '#ffffff' : '#0f172a'}
                    strokeWidth={isSelected ? '2.2' : '1.2'}
                    filter="url(#markerGlow)"
                  />
                  <text
                    x={marker.x}
                    y={marker.y + radius + 11}
                    textAnchor="middle"
                    fill={isSelected ? '#fde68a' : '#e2e8f0'}
                    fontSize="9.5"
                    fontWeight="700"
                  >
                    {marker.shortLabel} (%{c.sharePct})
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Map Legend */}
          <div className="mt-2 pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[10px]">
            <div className="flex flex-wrap items-center gap-3">
              {regionRows.map((r) => (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => setSelectedRegion((prev) => (prev === r.key ? 'all' : r.key))}
                  className={`inline-flex items-center gap-1.5 cursor-pointer transition-opacity ${
                    selectedRegion !== 'all' && selectedRegion !== r.key ? 'opacity-40' : 'opacity-100'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: r.accentHex }}
                  />
                  <span className="text-slate-200 font-semibold">{r.name}</span>
                  <span className="text-slate-400">(%{r.readsPct})</span>
                </button>
              ))}
            </div>
            <span className="text-slate-400">Daire boyutu = Okunma / Görüntülenme hacmi</span>
          </div>
        </div>

        {/* Right Side: Live Focused Country / Hub Inspector + 5-Region Comparative Bar Chart */}
        <div className="xl:col-span-4 space-y-3">
          {activeCountry && (
            <div className="bg-slate-900 border border-amber-400/60 p-3.5 rounded-xs space-y-2">
              <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
                <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span>{activeCountry.countryName}</span>
                </div>
                <span className="px-2 py-0.5 bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-[10px] font-bold rounded-xs">
                  {activeCountry.regionLabel} · %{activeCountry.sharePct}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 tabular-nums">
                <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-xs">
                  <div className="text-[10px] text-slate-400 uppercase">Okunma Sayısı</div>
                  <div className="text-base font-extrabold text-amber-300">
                    {activeCountry.reads.toLocaleString('tr-TR')}
                  </div>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-xs">
                  <div className="text-[10px] text-slate-400 uppercase">Görüntülenme</div>
                  <div className="text-base font-extrabold text-cyan-300">
                    {activeCountry.views.toLocaleString('tr-TR')}
                  </div>
                </div>
              </div>
              <div className="text-[10px] text-slate-300 leading-relaxed">
                <span className="text-slate-400 font-semibold">Öne Çıkan Akademik Merkezler: </span>
                {activeCountry.academicHubs}
              </div>
            </div>
          )}

          {/* 5-Region Dual Bar Chart */}
          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xs space-y-2.5">
            <div className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider border-b border-slate-800 pb-1.5">
              5 Ana Bölge Karşılaştırma Grafiği
            </div>
            <div className="space-y-2.5">
              {regionRows.map((r) => {
                const readsWidth = Math.max(4, Math.round((r.reads / maxRegionReads) * 100));
                const viewsWidth = Math.max(4, Math.round((r.views / maxRegionViews) * 100));
                const isSelected = selectedRegion === r.key;
                return (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => setSelectedRegion((prev) => (prev === r.key ? 'all' : r.key))}
                    className={`w-full text-left p-2 rounded-xs border transition-colors cursor-pointer space-y-1 ${
                      isSelected
                        ? `${r.borderClass} bg-slate-800/90`
                        : 'border-slate-800/80 bg-slate-950/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-[11px]">
                      <span className="font-bold text-slate-100 truncate">{r.name}</span>
                      <span className="text-emerald-300 font-bold tabular-nums shrink-0">
                        %{r.readsPct}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[10px] tabular-nums">
                        <span className="w-12 text-amber-300 shrink-0">Okunma</span>
                        <div className="flex-1 h-2 bg-slate-800 rounded-xs overflow-hidden">
                          <div
                            className={`h-full ${r.barReadsClass}`}
                            style={{ width: `${readsWidth}%` }}
                          />
                        </div>
                        <span className="w-16 text-right text-amber-300 font-bold shrink-0">
                          {r.reads.toLocaleString('tr-TR')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] tabular-nums">
                        <span className="w-12 text-cyan-300 shrink-0">Görünt.</span>
                        <div className="flex-1 h-2 bg-slate-800 rounded-xs overflow-hidden">
                          <div
                            className={`h-full ${r.barViewsClass} opacity-85`}
                            style={{ width: `${viewsWidth}%` }}
                          />
                        </div>
                        <span className="w-16 text-right text-cyan-300 font-bold shrink-0">
                          {r.views.toLocaleString('tr-TR')}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Full Regional & Country Breakdown Table (Çizelge) */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-xs overflow-hidden">
        <div className="px-3.5 py-2.5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="text-[11px] font-bold text-emerald-300 uppercase">
            Dünya Bölgeleri &amp; 12 Ülke Kümesi Okunma / Görüntülenme Çizelgesi
            {selectedRegion !== 'all' ? ` · Filtre: ${REGION_META[selectedRegion].name}` : ''}
          </div>
          <div className="flex items-center gap-1.5 text-[10px]">
            <ArrowUpDown className="w-3 h-3 text-slate-400" />
            {(
              [
                { id: 'reads', label: 'Okunmaya Göre' },
                { id: 'views', label: 'Görüntülenmeye Göre' },
                { id: 'share', label: 'Paya Göre (%)' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSortBy(opt.id)}
                className={`px-2 py-0.5 rounded-xs border cursor-pointer ${
                  sortBy === opt.id
                    ? 'bg-cyan-400 text-slate-950 border-cyan-300 font-bold'
                    : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[11px] tabular-nums">
            <thead>
              <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase text-[10px]">
                <th className="py-2 px-3">#</th>
                <th className="py-2 px-3">Bölge / Ülke Kümesi</th>
                <th className="py-2 px-3">Kıta / Ana Bölge</th>
                <th className="py-2 px-3 text-right">Okunma Sayısı</th>
                <th className="py-2 px-3 text-right">Görüntülenme Sayısı</th>
                <th className="py-2 px-3 text-right">Küresel Pay</th>
                {!compact && <th className="py-2 px-3 hidden lg:table-cell">Akademik Merkezler</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {sortedCountries.map((row, idx) => {
                const isHighlighted = hoveredCountryCode === row.code;
                return (
                  <tr
                    key={row.code}
                    onMouseEnter={() => setHoveredCountryCode(row.code)}
                    onClick={() => setHoveredCountryCode(row.code)}
                    className={`cursor-pointer transition-colors ${
                      isHighlighted ? 'bg-slate-800/85' : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-2 px-3 text-slate-400 font-bold">{idx + 1}</td>
                    <td className="py-2 px-3 font-bold text-slate-100">
                      <span className="inline-flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: REGION_META[row.regionKey].accentHex }}
                        />
                        <span>{row.countryName}</span>
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <span
                        className={`px-2 py-0.5 text-[10px] border rounded-xs ${
                          REGION_META[row.regionKey].badgeClass
                        }`}
                      >
                        {row.regionLabel}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right font-extrabold text-amber-300">
                      {row.reads.toLocaleString('tr-TR')}
                    </td>
                    <td className="py-2 px-3 text-right font-bold text-cyan-300">
                      {row.views.toLocaleString('tr-TR')}
                    </td>
                    <td className="py-2 px-3 text-right font-bold text-emerald-300">
                      %{row.sharePct.toFixed(2)}
                    </td>
                    {!compact && (
                      <td className="py-2 px-3 text-slate-400 text-[10px] hidden lg:table-cell">
                        {row.academicHubs}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-slate-950 border-t-2 border-emerald-500/60 font-extrabold text-slate-100">
                <td colSpan={3} className="py-2.5 px-3 text-emerald-300 uppercase">
                  KÜRESEL TOPLAM ({selectedRegion === 'all' ? 'TÜM DÜNYA' : REGION_META[selectedRegion].name})
                </td>
                <td className="py-2.5 px-3 text-right text-amber-300">
                  {sortedCountries.reduce((acc, r) => acc + r.reads, 0).toLocaleString('tr-TR')}
                </td>
                <td className="py-2.5 px-3 text-right text-cyan-300">
                  {sortedCountries.reduce((acc, r) => acc + r.views, 0).toLocaleString('tr-TR')}
                </td>
                <td className="py-2.5 px-3 text-right text-emerald-300">
                  %
                  {selectedRegion === 'all'
                    ? '100.00'
                    : sortedCountries.reduce((acc, r) => acc + r.sharePct, 0).toFixed(2)}
                </td>
                {!compact && <td className="py-2.5 px-3 hidden lg:table-cell" />}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
