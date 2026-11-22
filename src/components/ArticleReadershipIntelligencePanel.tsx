import React, { useState } from 'react';
import {
  Globe,
  Building2,
  Cpu,
  Network,
  ChevronDown,
  ChevronUp,
  BarChart3,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import {
  ArticleGlobalReadAnalytics,
  PRIVACY_K_ANONYMITY_THRESHOLD,
} from '../utils/articleReadAnalyticsEngine';

interface ArticleReadershipIntelligencePanelProps {
  stats: ArticleGlobalReadAnalytics | undefined;
  totalNetworkReads: number;
  totalNodesCount: number;
  kvkkAnalyticsGranted?: boolean;
  onOpenFullAnalytics?: () => void;
  onOpenKvkkModal?: () => void;
  onOpenConsentPrefs?: () => void;
}

export const ArticleReadershipIntelligencePanel: React.FC<
  ArticleReadershipIntelligencePanelProps
> = ({
  stats,
  totalNetworkReads,
  totalNodesCount,
  kvkkAnalyticsGranted = false,
  onOpenFullAnalytics,
  onOpenKvkkModal,
  onOpenConsentPrefs,
}) => {
  const [activeTab, setActiveTab] = useState<'academic' | 'industrial' | 'nodes'>('academic');
  const [showAllCountries, setShowAllCountries] = useState(false);
  const [showAllEcosystems, setShowAllEcosystems] = useState(false);

  if (!stats) return null;

  const displayedCountries = showAllCountries ? stats.countries : stats.countries.slice(0, 4);
  const displayedEcosystems = showAllEcosystems
    ? stats.industrialEcosystems
    : stats.industrialEcosystems.slice(0, 3);

  const academicPct = ((stats.academicTotalReads / Math.max(1, stats.reads)) * 100).toFixed(1);
  const industrialPct = ((stats.industrialTotalReads / Math.max(1, stats.reads)) * 100).toFixed(1);
  const independentPct = ((stats.independentGlobalReads / Math.max(1, stats.reads)) * 100).toFixed(1);

  return (
    <section
      id={`article-readership-${stats.articleId}`}
      aria-label={`Makale #${stats.rank} Global Okunma, Akademik Merkezler ve Sanayi Ekosistemi Dağılımı`}
      className="no-print bg-[#0F172A] text-slate-100 border-2 border-amber-400/80 rounded-xs overflow-hidden shadow-xs"
    >
      {/* Top Global Readership Banner (All 11 301 Nodes Combined) */}
      <div className="bg-slate-950 border-b border-slate-800 px-3.5 py-3 space-y-2.5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold">
              <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>GLOBAL OKUNMA &amp; ANONİM KURUMSAL DAĞILIM ({totalNodesCount} DÜĞÜM · 301 AĞI)</span>
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              Makale #{stats.rank} · 11 düğüm toplamı ({totalNetworkReads.toLocaleString('tr-TR')}) içinde{' '}
              <strong className="text-emerald-300">%{stats.readSharePercent}</strong> pay
            </div>
          </div>

          {onOpenFullAnalytics && (
            <button
              type="button"
              onClick={onOpenFullAnalytics}
              className="inline-flex items-center gap-1 px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[10px] font-mono font-bold text-amber-300 rounded-xs transition-colors cursor-pointer shrink-0"
            >
              <BarChart3 className="w-3 h-3" />
              <span>Tam Analitik</span>
            </button>
          )}
        </div>

        {/* 4 Core KPI Cells */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 font-mono tabular-nums">
          <div className="bg-slate-900 border border-amber-400/50 px-2.5 py-2 rounded-xs">
            <div className="text-[9px] uppercase text-amber-200/90">Global Toplam Okunma</div>
            <div className="text-base font-extrabold text-amber-300 leading-tight mt-0.5">
              {stats.reads.toLocaleString('tr-TR')}
            </div>
            <div className="text-[9px] text-slate-400">{totalNodesCount} düğüm (1:1)</div>
          </div>

          <div className="bg-slate-900 border border-emerald-500/40 px-2.5 py-2 rounded-xs">
            <div className="text-[9px] uppercase text-emerald-200/90">Akademik Merkezler</div>
            <div className="text-base font-extrabold text-emerald-300 leading-tight mt-0.5">
              {stats.academicTotalReads.toLocaleString('tr-TR')}
            </div>
            <div className="text-[9px] text-slate-400">%{academicPct} · 12 ülke</div>
          </div>

          <div className="bg-slate-900 border border-sky-500/40 px-2.5 py-2 rounded-xs">
            <div className="text-[9px] uppercase text-sky-200/90">Sanayi Ekosistemleri</div>
            <div className="text-base font-extrabold text-sky-300 leading-tight mt-0.5">
              {stats.industrialTotalReads.toLocaleString('tr-TR')}
            </div>
            <div className="text-[9px] text-amber-200">
              Silikon V.: {stats.siliconValleyReads.toLocaleString('tr-TR')}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-700 px-2.5 py-2 rounded-xs">
            <div className="text-[9px] uppercase text-slate-300">Bağımsız Küresel</div>
            <div className="text-base font-extrabold text-slate-100 leading-tight mt-0.5">
              {stats.independentGlobalReads.toLocaleString('tr-TR')}
            </div>
            <div className="text-[9px] text-slate-400">%{independentPct} · Açık web</div>
          </div>
        </div>

        {/* Reconciliation Strip */}
        <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] font-mono text-slate-300 bg-slate-900/70 border border-slate-800 px-2.5 py-1 rounded-xs tabular-nums">
          <span className="inline-flex items-center gap-1 text-emerald-300">
            <CheckCircle2 className="w-3 h-3 shrink-0" />
            <span>
              {stats.academicTotalReads.toLocaleString('tr-TR')} Akademik +{' '}
              {stats.industrialTotalReads.toLocaleString('tr-TR')} Sanayi +{' '}
              {stats.independentGlobalReads.toLocaleString('tr-TR')} Bağımsız ={' '}
              <strong className="text-amber-300">{stats.reads.toLocaleString('tr-TR')} Global Okunma</strong>
            </span>
          </span>
          <span className="text-cyan-300">
            Görüntülenme: {stats.views.toLocaleString('tr-TR')}
          </span>
        </div>
      </div>

      {/* 3-Tab Switcher */}
      <div className="grid grid-cols-3 border-b border-slate-800 bg-slate-900 font-mono text-[10px] font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('academic')}
          className={`flex items-center justify-center gap-1 py-2 px-1.5 border-r border-slate-800 transition-colors cursor-pointer ${
            activeTab === 'academic'
              ? 'bg-[#1E3A8A] text-white'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Building2 className="w-3 h-3 shrink-0 text-emerald-300" />
          <span className="truncate">Akademik (12 Ülke)</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('industrial')}
          className={`flex items-center justify-center gap-1 py-2 px-1.5 border-r border-slate-800 transition-colors cursor-pointer ${
            activeTab === 'industrial'
              ? 'bg-[#1E3A8A] text-white'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Cpu className="w-3 h-3 shrink-0 text-amber-300" />
          <span className="truncate">Silikon V. &amp; Sanayi</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('nodes')}
          className={`flex items-center justify-center gap-1 py-2 px-1.5 transition-colors cursor-pointer ${
            activeTab === 'nodes'
              ? 'bg-[#1E3A8A] text-white'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Network className="w-3 h-3 shrink-0 text-sky-300" />
          <span className="truncate">{totalNodesCount} Düğüm (301)</span>
        </button>
      </div>

      {/* Tab Body */}
      <div className="p-3 space-y-2.5 text-[11px]">
        {activeTab === 'academic' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>Ülke Bazlı Akademik Merkez Okunma Sayıları (k ≥ {PRIVACY_K_ANONYMITY_THRESHOLD})</span>
              <span className="text-emerald-300 font-bold tabular-nums">
                Σ {stats.academicTotalReads.toLocaleString('tr-TR')} Akademik Okunma
              </span>
            </div>

            <div className="space-y-2 max-h-[370px] overflow-y-auto pr-1">
              {displayedCountries.map((country) => (
                <div
                  key={`${stats.articleId}-acad-${country.code}`}
                  className="bg-slate-950/90 border border-slate-800 p-2.5 rounded-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-1">
                    <div className="font-bold text-white text-[11px] flex items-center gap-1.5">
                      <span className="font-mono text-[10px] px-1 py-0.5 bg-slate-800 text-amber-300 rounded-xs">
                        {country.code}
                      </span>
                      <span>{country.countryName}</span>
                    </div>
                    <div className="font-mono text-[10px] tabular-nums text-right">
                      <span className="text-amber-300 font-bold">
                        {country.reads.toLocaleString('tr-TR')} toplam
                      </span>
                      <span className="text-slate-500"> · </span>
                      <span className="text-emerald-300 font-bold">
                        {country.academicReads.toLocaleString('tr-TR')} akademik
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 font-mono text-[10px] tabular-nums">
                    {country.academicCenters.map((center) => (
                      <div
                        key={center.id}
                        className="flex items-center justify-between gap-1.5 bg-slate-900/80 border border-slate-800/80 px-2 py-1 rounded-xs"
                        title={
                          center.isKAnonymityMasked
                            ? `KVKK (6698) & GDPR Recital 26 k-Anonimlik (k ≥ ${PRIVACY_K_ANONYMITY_THRESHOLD}): Tekilleştirme riskini önlemek için küçük hücre maskelendi`
                            : `${center.name} (${center.city})`
                        }
                      >
                        <div className="truncate text-slate-200">
                          {center.name}
                          <span className="text-slate-500"> · {center.city}</span>
                        </div>
                        <span
                          className={`font-extrabold shrink-0 ${
                            center.isKAnonymityMasked ? 'text-slate-300 text-[9px]' : 'text-emerald-300'
                          }`}
                        >
                          {center.privacySafeReadLabel}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowAllCountries((prev) => !prev)}
              className="w-full py-1.5 px-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-300 font-mono font-bold text-[10px] rounded-xs inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              {showAllCountries ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5" />
                  <span>İlk 4 Ülkeye Daralt</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5" />
                  <span>Tüm 12 Ülke &amp; 60 Akademik Merkezi Göster ({stats.countries.length - 4} ülke daha)</span>
                </>
              )}
            </button>
          </div>
        )}

        {activeTab === 'industrial' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>Silikon Vadisi &amp; Küresel Sanayi Kuruluşları (k ≥ {PRIVACY_K_ANONYMITY_THRESHOLD})</span>
              <span className="text-sky-300 font-bold tabular-nums">
                Σ {stats.industrialTotalReads.toLocaleString('tr-TR')} Sanayi (%{industrialPct})
              </span>
            </div>

            <div className="space-y-2 max-h-[370px] overflow-y-auto pr-1">
              {displayedEcosystems.map((eco) => {
                const isSiliconValley = eco.id === 'silicon-valley';
                return (
                  <div
                    key={`${stats.articleId}-eco-${eco.id}`}
                    className={`p-2.5 rounded-xs space-y-1.5 border ${
                      isSiliconValley
                        ? 'bg-slate-950 border-amber-400/70'
                        : 'bg-slate-950/90 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-1">
                      <div>
                        <div
                          className={`font-bold text-[11px] ${
                            isSiliconValley ? 'text-amber-300' : 'text-sky-200'
                          }`}
                        >
                          {eco.name}
                        </div>
                        <div className="text-[9px] font-mono text-slate-400">{eco.regionLabel}</div>
                      </div>
                      <div className="font-mono text-[10px] tabular-nums text-right shrink-0">
                        <div className="text-amber-300 font-extrabold">
                          {eco.reads.toLocaleString('tr-TR')} okunma
                        </div>
                        <div className="text-[9px] text-slate-400">
                          Sanayi %{eco.shareOfIndustrialPct}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 font-mono text-[10px] tabular-nums">
                      {eco.organizations.map((org) => (
                        <div
                          key={org.id}
                          className="flex items-center justify-between gap-1.5 bg-slate-900/85 border border-slate-800/80 px-2 py-1 rounded-xs"
                          title={
                            org.isKAnonymityMasked
                              ? `KVKK (6698) & GDPR Recital 26 k-Anonimlik (k ≥ ${PRIVACY_K_ANONYMITY_THRESHOLD}): Küçük hücre maskelendi`
                              : `${org.name} — ${org.sector} (${org.city})`
                          }
                        >
                          <div className="min-w-0">
                            <div className="truncate text-slate-100 font-semibold">{org.name}</div>
                            <div className="truncate text-[9px] text-slate-400">{org.sector}</div>
                          </div>
                          <span
                            className={`font-extrabold shrink-0 ${
                              org.isKAnonymityMasked ? 'text-slate-300 text-[9px]' : 'text-sky-300'
                            }`}
                          >
                            {org.privacySafeReadLabel}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setShowAllEcosystems((prev) => !prev)}
              className="w-full py-1.5 px-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-sky-300 font-mono font-bold text-[10px] rounded-xs inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              {showAllEcosystems ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5" />
                  <span>İlk 3 Ekosisteme Daralt</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5" />
                  <span>
                    Tüm 6 Büyük Sanayi Ekosistemini &amp; 31 Kuruluşu Göster ({stats.industrialEcosystems.length - 3} ekosistem daha)
                  </span>
                </>
              )}
            </button>
          </div>
        )}

        {activeTab === 'nodes' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>Tüm {stats.nodeBreakdown.length} Düğümün (301 Ağı) Bu Makaleye Katkısı</span>
              <span className="text-amber-300 font-bold tabular-nums">
                Σ {stats.reads.toLocaleString('tr-TR')} Okunma
              </span>
            </div>

            <div className="space-y-1 max-h-[370px] overflow-y-auto pr-1 font-mono text-[10px] tabular-nums">
              {stats.nodeBreakdown.map((nodeStat) => (
                <div
                  key={`${stats.articleId}-node-${nodeStat.domain}`}
                  className={`flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xs border ${
                    nodeStat.isLive
                      ? 'bg-emerald-950/40 border-emerald-500/40'
                      : 'bg-slate-950/90 border-slate-800'
                  }`}
                >
                  <div className="min-w-0 flex items-center gap-1.5">
                    <span className="text-amber-400 font-bold shrink-0">#{nodeStat.rank}</span>
                    <span className="truncate text-slate-100 font-semibold">{nodeStat.domain}</span>
                    <span
                      className={`text-[9px] px-1 py-0.5 rounded-xs shrink-0 ${
                        nodeStat.isLive
                          ? 'bg-emerald-900 text-emerald-200'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {nodeStat.isLive ? 'CANLI 200' : '301 → Hub'}
                    </span>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="text-amber-300 font-extrabold">
                      {nodeStat.reads.toLocaleString('tr-TR')}
                    </span>
                    <span className="text-slate-400 ml-1">(%{nodeStat.sharePercent})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mandatory KVKK (Law 6698) & EU GDPR (2016/679) Transparency & Anonymization Footer */}
        <div className="pt-2 border-t border-slate-800 space-y-1.5 text-[10px] font-mono">
          <div className="flex flex-wrap items-center justify-between gap-1.5">
            <span className="inline-flex items-center gap-1 text-emerald-300 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>KVKK (6698) &amp; AB GDPR (Recital 26) Uyumlu · Sıfır Kişisel Veri</span>
            </span>
            <span
              className={`px-1.5 py-0.5 rounded-xs border text-[9px] font-bold ${
                kvkkAnalyticsGranted
                  ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200'
                  : 'bg-slate-900 border-slate-700 text-slate-300'
              }`}
            >
              {kvkkAnalyticsGranted ? 'Analitik Rızası: Açık' : 'Yeni Ölçüm: Kapalı (Opt-In)'}
            </span>
          </div>
          <p className="text-[9.5px] font-sans text-slate-400 leading-snug">
            Bireysel IP, çerez kimliği, cihaz parmak izi veya çalışan/öğrenci kimliği toplanmaz.
            Tekilleştirme (singling-out) riskini önlemek için {PRIVACY_K_ANONYMITY_THRESHOLD}&apos;ten az
            okunmalı tekil kurum hücreleri <strong className="text-slate-300">&lt; {PRIVACY_K_ANONYMITY_THRESHOLD} (k-Anonim)</strong> olarak
            maskelenir; kurum adları yalnızca anonim istatistiksel dağılımı gösterir ve ticari ortaklık ifade etmez.
          </p>
          {(onOpenKvkkModal || onOpenConsentPrefs) && (
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              {onOpenKvkkModal && (
                <button
                  type="button"
                  onClick={onOpenKvkkModal}
                  className="text-amber-300 hover:underline cursor-pointer"
                >
                  KVKK &amp; GDPR Aydınlatma / Haklar →
                </button>
              )}
              {onOpenConsentPrefs && (
                <button
                  type="button"
                  onClick={onOpenConsentPrefs}
                  className="text-sky-300 hover:underline cursor-pointer"
                >
                  Rıza Tercihlerini Yönet →
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

