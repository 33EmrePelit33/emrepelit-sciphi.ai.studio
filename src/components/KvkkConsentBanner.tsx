import React, { useState, useEffect } from 'react';
import { ShieldCheck, SlidersHorizontal, Check, X, FileText } from 'lucide-react';
import { LanguageCode } from '../types';
import { GovernanceTab } from './GovernanceLegalModal';

export interface KvkkConsentState {
  status: 'pending' | 'accepted' | 'rejected';
  analytics: boolean;
  externalTelemetry: boolean;
  updatedAt: string;
}

export const KVKK_CONSENT_STORAGE_KEY = 'sciphil_kvkk_consent_v1';

export const DEFAULT_KVKK_CONSENT: KvkkConsentState = {
  status: 'pending',
  analytics: false,
  externalTelemetry: false,
  updatedAt: '',
};

interface KvkkConsentBannerProps {
  consent: KvkkConsentState;
  forceManageOpen: boolean;
  onCloseManage: () => void;
  onUpdateConsent: (next: KvkkConsentState) => void;
  onOpenLegalTab: (tab: GovernanceTab) => void;
  language: LanguageCode;
}

const BANNER_COPY: Record<
  'tr' | 'en',
  {
    badge: string;
    title: string;
    body: string;
    acceptAll: string;
    rejectAll: string;
    managePrefs: string;
    savePrefs: string;
    kvkkLink: string;
    privacyLink: string;
    essentialTitle: string;
    essentialDesc: string;
    essentialTag: string;
    analyticsTitle: string;
    analyticsDesc: string;
    externalTitle: string;
    externalDesc: string;
  }
> = {
  tr: {
    badge: '6698 Sayılı KVKK & Açık Rıza Bildirimi',
    title: 'Okuma Süresi ve Etkileşim Analitiği Tercihleriniz',
    body: 'Bu bağımsız bilim ve felsefe arşivinde oturum süresi, okunma istatistikleri ve isteğe bağlı harici analitik ölçümü yalnızca açık rızanız (opt-in) ile etkinleştirilir. Reddetmeniz durumunda hiçbir analitik telemetrisi kaydedilmez; yalnızca dil seçimi gibi temel tarayıcı tercihleri korunur.',
    acceptAll: 'Kabul Et',
    rejectAll: 'Reddet',
    managePrefs: 'Tercihleri Yönet',
    savePrefs: 'Seçili Tercihleri Kaydet',
    kvkkLink: 'KVKK (6698) Aydınlatma Metni',
    privacyLink: 'Gizlilik Politikası',
    essentialTitle: 'Zorunlu Yerel Tercihler',
    essentialDesc: 'Seçilen arayüz dili, okuma yazı boyutu ve yer imleri (yalnızca kendi tarayıcınızda saklanır).',
    essentialTag: 'Her Zaman Aktif',
    analyticsTitle: 'Birinci Taraf Okunma Süresi & Etkileşim Analitiği',
    analyticsDesc: 'Hangi makalelerin ne kadar süre okunduğunu ve simülasyon kullanımını ölçen sunucu sayaçları.',
    externalTitle: 'İsteğe Bağlı Harici Ölçüm (GA4 / Cloudflare)',
    externalDesc: 'Site yöneticisi tarafından tanımlanmış harici trafik ölçüm betiklerini yalnızca açık rızayla yükler.',
  },
  en: {
    badge: 'KVKK Law No. 6698 & GDPR Opt-In Notice',
    title: 'Reading Time & Interaction Analytics Preferences',
    body: 'Reading duration, session telemetry, and optional external analytics on this independent archive are strictly disabled until you grant explicit opt-in consent. If you decline, no analytics telemetry is recorded and only essential local UI preferences remain active.',
    acceptAll: 'Kabul Et / Accept',
    rejectAll: 'Reddet / Reject',
    managePrefs: 'Tercihleri Yönet / Manage',
    savePrefs: 'Save Selected Preferences',
    kvkkLink: 'KVKK (Law 6698) Notice',
    privacyLink: 'Privacy Policy',
    essentialTitle: 'Essential Local Preferences',
    essentialDesc: 'UI language selection, typography scale, and local bookmarks stored only in your browser.',
    essentialTag: 'Always Active',
    analyticsTitle: 'First-Party Reading Time & Interaction Analytics',
    analyticsDesc: 'Aggregate reading duration and simulation interaction counters.',
    externalTitle: 'Optional External Analytics (GA4 / Cloudflare)',
    externalDesc: 'Loads owner-configured external traffic measurement scripts only with explicit consent.',
  },
};

export const KvkkConsentBanner: React.FC<KvkkConsentBannerProps> = ({
  consent,
  forceManageOpen,
  onCloseManage,
  onUpdateConsent,
  onOpenLegalTab,
  language,
}) => {
  const [showPreferences, setShowPreferences] = useState<boolean>(false);
  const [draftAnalytics, setDraftAnalytics] = useState<boolean>(consent.analytics);
  const [draftExternal, setDraftExternal] = useState<boolean>(consent.externalTelemetry);

  useEffect(() => {
    setDraftAnalytics(consent.analytics);
    setDraftExternal(consent.externalTelemetry);
  }, [consent.analytics, consent.externalTelemetry]);

  useEffect(() => {
    if (forceManageOpen) {
      setShowPreferences(true);
    }
  }, [forceManageOpen]);

  const isVisible = consent.status === 'pending' || forceManageOpen;
  if (!isVisible) return null;

  const t = language === 'tr' ? BANNER_COPY.tr : BANNER_COPY.en;

  const handleAcceptAll = () => {
    onUpdateConsent({
      status: 'accepted',
      analytics: true,
      externalTelemetry: true,
      updatedAt: new Date().toISOString(),
    });
    setShowPreferences(false);
    onCloseManage();
  };

  const handleRejectAll = () => {
    onUpdateConsent({
      status: 'rejected',
      analytics: false,
      externalTelemetry: false,
      updatedAt: new Date().toISOString(),
    });
    setShowPreferences(false);
    onCloseManage();
  };

  const handleSaveCustom = () => {
    onUpdateConsent({
      status: draftAnalytics || draftExternal ? 'accepted' : 'rejected',
      analytics: draftAnalytics,
      externalTelemetry: draftExternal,
      updatedAt: new Date().toISOString(),
    });
    setShowPreferences(false);
    onCloseManage();
  };

  return (
    <aside
      id="kvkk-consent-banner"
      role="dialog"
      aria-live="polite"
      aria-label={t.badge}
      className="fixed bottom-0 inset-x-0 z-50 border-t-2 border-stone-900 bg-[#FBF9F5]/95 backdrop-blur-md shadow-2xl text-stone-900"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1.5 max-w-4xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#1E3A8A] text-white font-mono text-[11px] font-bold rounded-xs uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t.badge}</span>
              </span>
              <button
                type="button"
                onClick={() => onOpenLegalTab('kvkk')}
                className="inline-flex items-center gap-1 text-[11px] font-mono underline text-[#1E3A8A] hover:text-stone-900 cursor-pointer"
              >
                <FileText className="w-3 h-3" />
                <span>{t.kvkkLink}</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenLegalTab('privacy')}
                className="inline-flex items-center gap-1 text-[11px] font-mono underline text-[#1E3A8A] hover:text-stone-900 cursor-pointer"
              >
                <span>{t.privacyLink}</span>
              </button>
            </div>
            <h3 className="text-sm sm:text-base font-editorial font-bold text-stone-900">
              {t.title}
            </h3>
            <p className="text-xs sm:text-sm font-academic-body text-stone-700 leading-relaxed">
              {t.body}
            </p>
          </div>

          {/* Equal-prominence action buttons (6698 KVKK compliant) */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleRejectAll}
              className="px-4 py-2.5 text-xs font-mono font-bold border-2 border-stone-900 bg-white text-stone-900 hover:bg-stone-100 rounded-xs cursor-pointer transition-colors"
            >
              {t.rejectAll}
            </button>
            <button
              type="button"
              onClick={() => setShowPreferences((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-mono font-bold border-2 border-stone-700 bg-[#F2EFE7] text-stone-900 hover:bg-stone-200 rounded-xs cursor-pointer transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{t.managePrefs}</span>
            </button>
            <button
              type="button"
              onClick={handleAcceptAll}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-mono font-bold border-2 border-[#1E3A8A] bg-[#1E3A8A] text-white hover:bg-[#172554] rounded-xs cursor-pointer transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{t.acceptAll}</span>
            </button>
            {forceManageOpen && consent.status !== 'pending' && (
              <button
                type="button"
                onClick={onCloseManage}
                aria-label="Kapat"
                className="p-2 text-stone-600 hover:text-stone-900 border border-stone-300 rounded-xs cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {showPreferences && (
          <div className="border border-stone-300 bg-white p-3.5 rounded-xs space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="border border-stone-200 bg-stone-50 p-3 rounded-xs space-y-1">
                <div className="flex items-center justify-between gap-2 font-mono font-bold text-stone-900">
                  <span>{t.essentialTitle}</span>
                  <span className="px-1.5 py-0.5 bg-stone-200 text-stone-800 text-[10px] rounded-xs">
                    {t.essentialTag}
                  </span>
                </div>
                <p className="text-stone-600 leading-relaxed">{t.essentialDesc}</p>
              </div>

              <label className="border border-stone-300 bg-[#FBF9F5] p-3 rounded-xs space-y-1 cursor-pointer hover:border-[#1E3A8A] transition-colors">
                <div className="flex items-center justify-between gap-2 font-mono font-bold text-stone-900">
                  <span>{t.analyticsTitle}</span>
                  <input
                    type="checkbox"
                    checked={draftAnalytics}
                    onChange={(e) => setDraftAnalytics(e.target.checked)}
                    className="w-4 h-4 accent-[#1E3A8A] cursor-pointer"
                  />
                </div>
                <p className="text-stone-600 leading-relaxed">{t.analyticsDesc}</p>
              </label>

              <label className="border border-stone-300 bg-[#FBF9F5] p-3 rounded-xs space-y-1 cursor-pointer hover:border-[#1E3A8A] transition-colors">
                <div className="flex items-center justify-between gap-2 font-mono font-bold text-stone-900">
                  <span>{t.externalTitle}</span>
                  <input
                    type="checkbox"
                    checked={draftExternal}
                    onChange={(e) => setDraftExternal(e.target.checked)}
                    className="w-4 h-4 accent-[#1E3A8A] cursor-pointer"
                  />
                </div>
                <p className="text-stone-600 leading-relaxed">{t.externalDesc}</p>
              </label>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleSaveCustom}
                className="px-4 py-2 text-xs font-mono font-bold bg-[#1E3A8A] hover:bg-[#172554] text-white rounded-xs cursor-pointer transition-colors"
              >
                {t.savePrefs}
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
