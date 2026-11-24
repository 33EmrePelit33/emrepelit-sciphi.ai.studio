import React, { useEffect, useState } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  FileText,
  Cpu,
  Scale,
  BookMarked,
  Download,
  Trash2,
  RotateCcw,
  SlidersHorizontal,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { LanguageCode } from '../types';
import type { KvkkConsentState } from './KvkkConsentBanner';

export type GovernanceTab = 'privacy' | 'terms' | 'imprint' | 'kvkk' | 'disclaimer' | 'methodology';

interface GovernanceLegalModalProps {
  isOpen: boolean;
  activeTab: GovernanceTab;
  onSelectTab: (tab: GovernanceTab) => void;
  onClose: () => void;
  language: LanguageCode;
  totalArticlesCount: number;
  kvkkConsent?: KvkkConsentState;
  getAuthToken?: () => string | null;
  onWithdrawConsent?: () => void;
  onOpenConsentBanner?: () => void;
}

type GovernanceTabLabels = Record<GovernanceTab, string> & {
  modalTitle: string;
  independentBadge: string;
  close: string;
};

const TAB_LABELS: Partial<Record<LanguageCode, GovernanceTabLabels>> & { en: GovernanceTabLabels } = {
  tr: {
    modalTitle: 'Yönetişim, Gizlilik, KVKK (6698) & AB GDPR (2016/679), Künye & Metodoloji',
    independentBadge: 'Bağımsız Yazar Arşivi · KVKK & GDPR Uyumlu',
    privacy: 'Gizlilik & GDPR',
    terms: 'Kullanım Koşulları',
    imprint: 'Künye',
    kvkk: 'KVKK (6698) & Haklar',
    disclaimer: 'Sorumluluk Reddi',
    methodology: 'YZ & Telemetri Metodolojisi',
    close: 'Kapat (ESC)',
  },
  en: {
    modalTitle: 'Governance, Privacy & GDPR (2016/679), Terms, Imprint, KVKK (6698) & Methodology',
    independentBadge: 'Independent Author Archive · KVKK & GDPR Compliant',
    privacy: 'Privacy & GDPR',
    terms: 'Terms of Use',
    imprint: 'Imprint',
    kvkk: 'KVKK (6698) & Rights',
    disclaimer: 'Scientific Disclaimer',
    methodology: 'AI & Telemetry Methodology',
    close: 'Close (ESC)',
  },
  es: {
    modalTitle: 'Gobernanza, Privacidad y RGPD, Condiciones, Aviso Legal, KVKK y Metodología',
    independentBadge: 'Archivo Independiente · Cumplimiento KVKK y RGPD',
    privacy: 'Privacidad y RGPD',
    terms: 'Condiciones de Uso',
    imprint: 'Aviso Legal',
    kvkk: 'KVKK (6698) y Derechos',
    disclaimer: 'Descargo Científico',
    methodology: 'Metodología IA y Telemetría',
    close: 'Cerrar (ESC)',
  },
  de: {
    modalTitle: 'Governance, Datenschutz & DSGVO, Nutzungsbedingungen, Impressum, KVKK & Methodik',
    independentBadge: 'Unabhängiges Autorenarchiv · KVKK- & DSGVO-konform',
    privacy: 'Datenschutz & DSGVO',
    terms: 'Nutzungsbedingungen',
    imprint: 'Impressum',
    kvkk: 'KVKK (6698) & Rechte',
    disclaimer: 'Haftungsausschluss',
    methodology: 'KI- & Telemetrie-Methodik',
    close: 'Schließen (ESC)',
  },
  fr: {
    modalTitle: 'Gouvernance, Confidentialité & RGPD, Conditions, Mentions Légales, KVKK & Méthodologie',
    independentBadge: "Archive Indépendante d'Auteur · Conforme KVKK & RGPD",
    privacy: 'Confidentialité & RGPD',
    terms: 'Conditions d’Utilisation',
    imprint: 'Mentions Légales',
    kvkk: 'KVKK (6698) & Droits',
    disclaimer: 'Avertissement',
    methodology: 'Méthodologie IA & Télémétrie',
    close: 'Fermer (ESC)',
  },
  ru: {
    modalTitle: 'Управление, Конфиденциальность и GDPR, Условия, Выходные данные и KVKK',
    independentBadge: 'Независимый авторский архив · KVKK и GDPR',
    privacy: 'Конфиденциальность и GDPR',
    terms: 'Условия использования',
    imprint: 'Выходные данные',
    kvkk: 'KVKK (6698) и права',
    disclaimer: 'Отказ от ответственности',
    methodology: 'Методология ИИ и телеметрии',
    close: 'Закрыть (ESC)',
  },
  ar: {
    modalTitle: 'الحوكمة والخصوصية وGDPR وشروط الاستخدام وبيانات النشر وKVKK والمنهجية',
    independentBadge: 'أرشيف مؤلف مستقل · متوافق مع KVKK وGDPR',
    privacy: 'الخصوصية وGDPR',
    terms: 'شروط الاستخدام',
    imprint: 'بيانات الناشر',
    kvkk: 'KVKK (6698) والحقوق',
    disclaimer: 'إخلاء المسؤولية العلمية',
    methodology: 'منهجية الذكاء الاصطناعي والقياس',
    close: 'إغلاق (ESC)',
  },
  zh: {
    modalTitle: '治理、隐私与 GDPR、使用条款、版权声明、KVKK 与方法论',
    independentBadge: '独立作者档案 · 符合 KVKK 与 GDPR',
    privacy: '隐私与 GDPR',
    terms: '使用条款',
    imprint: '版权与出版信息',
    kvkk: 'KVKK (6698) 与权利',
    disclaimer: '免责声明',
    methodology: 'AI 与遥测方法论',
    close: '关闭 (ESC)',
  },
  ja: {
    modalTitle: 'ガバナンス・プライバシーとGDPR・利用規約・奥付・KVKK・方法論',
    independentBadge: '独立著者アーカイブ · KVKK・GDPR準拠',
    privacy: 'プライバシー・GDPR',
    terms: '利用規約',
    imprint: '奥付・運営者情報',
    kvkk: 'KVKK (6698)・権利',
    disclaimer: '免責事項',
    methodology: 'AI・計測方法論',
    close: '閉じる (ESC)',
  },
  pt: {
    modalTitle: 'Governança, Privacidade e RGPD, Termos, Expediente, KVKK e Metodologia',
    independentBadge: 'Arquivo Independente · Conformidade KVKK e RGPD',
    privacy: 'Privacidade e RGPD',
    terms: 'Termos de Uso',
    imprint: 'Expediente',
    kvkk: 'KVKK (6698) e Direitos',
    disclaimer: 'Aviso Legal',
    methodology: 'Metodologia IA e Telemetria',
    close: 'Fechar (ESC)',
  },
  it: {
    modalTitle: 'Governance, Privacy e GDPR, Termini, Colophon, KVKK e Metodologia',
    independentBadge: 'Archivio Indipendente · Conforme KVKK e GDPR',
    privacy: 'Privacy e GDPR',
    terms: 'Termini d’Uso',
    imprint: 'Colophon',
    kvkk: 'KVKK (6698) e Diritti',
    disclaimer: 'Esclusione di Responsabilità',
    methodology: 'Metodologia IA e Telemetria',
    close: 'Chiudi (ESC)',
  },
  ko: {
    modalTitle: '거버넌스, 개인정보 및 GDPR, 이용약관, 판권 정보, KVKK 및 방법론',
    independentBadge: '독립 저자 아카이브 · KVKK 및 GDPR 준수',
    privacy: '개인정보 및 GDPR',
    terms: '이용약관',
    imprint: '판권 정보',
    kvkk: 'KVKK (6698) 및 권리',
    disclaimer: '과학적 면책 조항',
    methodology: 'AI 및 원격 측정 방법론',
    close: '닫기 (ESC)',
  },
};

export const GovernanceLegalModal: React.FC<GovernanceLegalModalProps> = ({
  isOpen,
  activeTab,
  onSelectTab,
  onClose,
  language,
  totalArticlesCount,
  kvkkConsent,
  getAuthToken,
  onWithdrawConsent,
  onOpenConsentBanner,
}) => {
  const [rightsStatusMessage, setRightsStatusMessage] = useState<string | null>(null);
  const [rightsErrorMessage, setRightsErrorMessage] = useState<string | null>(null);
  const [isExportingData, setIsExportingData] = useState<boolean>(false);
  const [isDeletingData, setIsDeletingData] = useState<boolean>(false);
  const [confirmEraseArmed, setConfirmEraseArmed] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const labels = TAB_LABELS[language] || TAB_LABELS.en;
  const isTurkish = language === 'tr';

  const handleExportMyData = async () => {
    setIsExportingData(true);
    setRightsErrorMessage(null);
    setRightsStatusMessage(null);
    try {
      const localBrowserData: Record<string, string | null> = {};
      if (typeof window !== 'undefined') {
        for (let i = 0; i < window.localStorage.length; i += 1) {
          const key = window.localStorage.key(i);
          if (key) {
            localBrowserData[key] = window.localStorage.getItem(key);
          }
        }
      }

      let serverAccountExport: unknown = null;
      const token = getAuthToken ? getAuthToken() : null;
      if (token) {
        const res = await fetch('/api/privacy/export-my-data', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          serverAccountExport = await res.json();
        }
      }

      const bundle = {
        legalStandards: ['KVKK (Turkish Law No. 6698, Art. 11)', 'GDPR (EU 2016/679, Art. 15 & Art. 20)'],
        exportedAtUtc: new Date().toISOString(),
        dataController: {
          name: 'Emre Pelit',
          location: 'Mersin, Türkiye',
          contactEmail: 'emrepelit39@gmail.com',
        },
        consentState: kvkkConsent || null,
        browserLocalStorageRecords: localBrowserData,
        authenticatedServerRecords: serverAccountExport
          ? serverAccountExport
          : isTurkish
            ? 'Oturum açılmadığı için sunucuda hesabınıza bağlı kişisel kayıt bulunmamaktadır.'
            : 'No signed-in session active; no account-linked server records were retrieved.',
      };

      const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `emrepelit-sciphi-kvkk-gdpr-data-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setRightsStatusMessage(
        isTurkish
          ? 'KVKK m.11 & GDPR m.20 veri dışa aktarım dosyanız (JSON) başarıyla indirildi.'
          : 'Your KVKK Art. 11 & GDPR Art. 20 personal data export (JSON) has been downloaded.'
      );
    } catch {
      setRightsErrorMessage(
        isTurkish
          ? 'Veri dışa aktarım sırasında beklenmeyen bir hata oluştu.'
          : 'An unexpected error occurred while exporting your data.'
      );
    } finally {
      setIsExportingData(false);
    }
  };

  const handleEraseAllMyData = async () => {
    if (!confirmEraseArmed) {
      setConfirmEraseArmed(true);
      setRightsStatusMessage(null);
      setRightsErrorMessage(null);
      return;
    }
    setIsDeletingData(true);
    setRightsErrorMessage(null);
    setRightsStatusMessage(null);
    try {
      let serverErased = false;
      const token = getAuthToken ? getAuthToken() : null;
      if (token) {
        const res = await fetch('/api/privacy/delete-my-data', {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          serverErased = true;
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('sciphil:arena-leaderboard-updated'));
          }
        }
      }

      if (typeof window !== 'undefined') {
        window.localStorage.clear();
        window.sessionStorage.clear();
      }
      if (onWithdrawConsent) {
        onWithdrawConsent();
      }

      setConfirmEraseArmed(false);
      setRightsStatusMessage(
        isTurkish
          ? serverErased
            ? 'Tüm tarayıcı verileriniz ve oturumunuza bağlı sunucu kayıtlarınız (GDPR m.17 / KVKK m.7) kalıcı olarak silindi ve tüm açık rızalar geri çekildi.'
            : 'Tüm tarayıcı yerel verileriniz kalıcı olarak silindi ve tüm açık rızalar geri çekildi. E-posta ile gönderdiğiniz eski soruların sunucudan silinmesi için emrepelit39@gmail.com adresine yazabilirsiniz.'
          : serverErased
            ? 'All browser data and your signed-in server records have been permanently erased (GDPR Art. 17 / KVKK Art. 7) and all consent withdrawn.'
            : 'All browser local storage data has been permanently erased and all optional consent withdrawn. To erase voluntary non-signed-in Q&A emails, contact emrepelit39@gmail.com.'
      );
    } catch {
      setRightsErrorMessage(
        isTurkish
          ? 'Silme işlemi tamamlanırken hata oluştu; lütfen emrepelit39@gmail.com üzerinden başvurun.'
          : 'An error occurred during erasure; please contact emrepelit39@gmail.com.'
      );
    } finally {
      setIsDeletingData(false);
    }
  };

  const renderDataSubjectRightsCenter = () => (
    <div className="mt-4 bg-white border-2 border-[#1E3A8A] rounded-xs p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-[#1E3A8A] font-mono text-xs font-extrabold uppercase">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>
            {isTurkish
              ? 'KVKK Madde 11 & GDPR Madde 7(3) / 15 / 17 / 20 Self-Servis Veri Sahibi Hakları Merkezi'
              : 'KVKK Art. 11 & GDPR Art. 7(3) / 15 / 17 / 20 Self-Service Data Subject Rights Center'}
          </span>
        </div>
        {kvkkConsent && (
          <span className="font-mono text-[10px] px-2 py-0.5 rounded-xs bg-stone-100 border border-stone-300 text-stone-700">
            {isTurkish ? 'Rıza Durumu:' : 'Consent Status:'}{' '}
            <strong>
              {kvkkConsent.status === 'accepted'
                ? isTurkish
                  ? 'Açık Rıza Verildi'
                  : 'Accepted'
                : kvkkConsent.status === 'rejected'
                  ? isTurkish
                    ? kvkkConsent.gpcHonored
                      ? 'Reddedildi (GPC/DNT)'
                      : 'Reddedildi (Yalnızca Zorunlu)'
                    : kvkkConsent.gpcHonored
                      ? 'Rejected (GPC/DNT)'
                      : 'Rejected (Essential Only)'
                  : isTurkish
                    ? 'Beklemede (Takip Kapalı)'
                    : 'Pending (Trackers Off)'}
            </strong>
          </span>
        )}
      </div>

      <p className="text-xs text-stone-700">
        {isTurkish
          ? 'Herhangi bir yazışmaya gerek kalmadan tarayıcınızdaki ve (Google ile giriş yaptıysanız) hesabınıza bağlı sunucu kayıtlarınızı JSON formatında indirebilir, açık rızanızı tek tıkla geri çekebilir veya tüm verilerinizi kalıcı olarak silebilirsiniz.'
          : 'Without waiting for manual correspondence, you can download your browser and (if signed in) server-side personal data in JSON format, withdraw optional consent immediately, or permanently erase all stored data.'}
      </p>

      <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
        <button
          type="button"
          onClick={() => void handleExportMyData()}
          disabled={isExportingData}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#1E3A8A] hover:bg-[#172E6E] text-white font-bold rounded-xs cursor-pointer transition-colors disabled:opacity-60"
        >
          <Download className="w-3.5 h-3.5" />
          <span>
            {isExportingData
              ? isTurkish
                ? 'Hazırlanıyor...'
                : 'Exporting...'
              : isTurkish
                ? 'Verilerimi İndir (JSON — GDPR m.20)'
                : 'Export My Data (JSON — GDPR Art. 20)'}
          </span>
        </button>

        {onWithdrawConsent && (
          <button
            type="button"
            onClick={() => {
              onWithdrawConsent();
              setConfirmEraseArmed(false);
              setRightsErrorMessage(null);
              setRightsStatusMessage(
                isTurkish
                  ? 'Açık rızanız geri çekildi (GDPR Madde 7(3)). Harici yazı tipleri ve isteğe bağlı analitik anında devre dışı bırakıldı.'
                  : 'Your consent has been withdrawn (GDPR Art. 7(3)). External fonts and optional analytics were disabled immediately.'
              );
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-stone-800 hover:bg-stone-700 text-white font-bold rounded-xs cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>
              {isTurkish ? 'Açık Rızayı Geri Çek (GDPR m.7)' : 'Withdraw Consent (GDPR Art. 7)'}
            </span>
          </button>
        )}

        {onOpenConsentBanner && (
          <button
            type="button"
            onClick={onOpenConsentBanner}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-900 border border-stone-400 font-bold rounded-xs cursor-pointer transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{isTurkish ? 'Tercihleri Yönet' : 'Manage Preferences'}</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => void handleEraseAllMyData()}
          disabled={isDeletingData}
          className={`inline-flex items-center gap-1.5 px-3 py-2 font-bold rounded-xs cursor-pointer transition-colors disabled:opacity-60 ${
            confirmEraseArmed
              ? 'bg-red-700 hover:bg-red-800 text-white border-2 border-red-950'
              : 'bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-400'
          }`}
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>
            {isDeletingData
              ? isTurkish
                ? 'Siliniyor...'
                : 'Erasing...'
              : confirmEraseArmed
                ? isTurkish
                  ? 'Eminim — Tüm Verilerimi Kalıcı Sil!'
                  : 'Confirm — Permanently Erase All My Data!'
                : isTurkish
                  ? 'Tüm Verilerimi Sil (GDPR m.17 / KVKK m.7)'
                  : 'Delete All My Data (GDPR Art. 17)'}
          </span>
        </button>

        {confirmEraseArmed && (
          <button
            type="button"
            onClick={() => setConfirmEraseArmed(false)}
            className="px-2.5 py-2 text-stone-700 hover:text-stone-900 underline cursor-pointer"
          >
            {isTurkish ? 'Vazgeç' : 'Cancel'}
          </button>
        )}
      </div>

      {rightsStatusMessage && (
        <div className="flex items-start gap-2 p-2.5 bg-emerald-50 border border-emerald-400 text-emerald-950 text-xs rounded-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <span>{rightsStatusMessage}</span>
        </div>
      )}
      {rightsErrorMessage && (
        <div className="flex items-start gap-2 p-2.5 bg-rose-50 border border-rose-400 text-rose-950 text-xs rounded-xs">
          <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
          <span>{rightsErrorMessage}</span>
        </div>
      )}
    </div>
  );

  return (
    <div
      id="governance-legal-modal"
      role="dialog"
      aria-modal="true"
      aria-label={labels.modalTitle}
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs overflow-y-auto p-3 sm:p-6 flex items-start justify-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-[#FBF9F5] border-2 border-stone-900 shadow-2xl rounded-xs overflow-hidden my-6 text-stone-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#0F172A] text-white px-5 py-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-400 text-slate-950 font-mono text-[10px] font-extrabold rounded-xs uppercase">
              <Scale className="w-3 h-3" />
              <span>{labels.independentBadge}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-editorial font-bold text-white">
              {labels.modalTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold rounded-xs cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
            <span>{labels.close}</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-[#F2EFE7] border-b border-stone-300 px-5 py-2.5 flex flex-wrap gap-2 font-mono text-xs">
          {(
            [
              { id: 'privacy', icon: Lock, label: labels.privacy },
              { id: 'terms', icon: Scale, label: labels.terms },
              { id: 'imprint', icon: BookMarked, label: labels.imprint },
              { id: 'kvkk', icon: ShieldCheck, label: labels.kvkk },
              { id: 'disclaimer', icon: FileText, label: labels.disclaimer },
              { id: 'methodology', icon: Cpu, label: labels.methodology },
            ] as const
          ).map((item) => {
            const IconComp = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xs border font-semibold cursor-pointer transition-colors ${
                  active
                    ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                    : 'bg-white text-stone-800 border-stone-300 hover:border-[#1E3A8A]'
                }`}
              >
                <IconComp className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 space-y-5 text-sm leading-relaxed font-academic-body text-stone-800 max-h-[70vh] overflow-y-auto">
          {activeTab === 'privacy' && (
            <div className="space-y-3">
              <h3 className="text-xl font-editorial font-bold text-stone-900">
                {isTurkish
                  ? 'Gizlilik Politikası ve AB GDPR (2016/679) Uyumluluk Beyanı'
                  : 'Privacy Policy & EU GDPR (Regulation 2016/679) Compliance Statement'}
              </h3>
              <p className="text-xs font-mono bg-stone-100 border border-stone-300 p-3">
                {isTurkish
                  ? 'Veri Sorumlusu (Data Controller): Emre Pelit | Konum: Mersin, Türkiye | Resmi İletişim: emrepelit39@gmail.com | Mevzuat: AB GDPR (2016/679) & 6698 Sayılı KVKK'
                  : 'Data Controller: Emre Pelit | Location: Mersin, Türkiye | Contact: emrepelit39@gmail.com | Frameworks: EU GDPR (2016/679) & Turkish Law No. 6698 (KVKK)'}
              </p>
              <p>
                {isTurkish
                  ? 'Emre Pelit — Sci-Phil Bilim, Felsefe ve Simülasyon Arşivi (emrepelit-sciphi.ai.studio), "Tasarım ve Varsayılan Olarak Gizlilik" (Privacy by Design & by Default — GDPR Madde 25) ilkesiyle geliştirilmiştir. Reklam ağı, üçüncü taraf veri simsarlığı veya izinsiz davranışsal profilleme bulunmamaktadır.'
                  : 'Emre Pelit — Sci-Phil Science, Philosophy & Simulation Archive (emrepelit-sciphi.ai.studio) is engineered under Privacy by Design & by Default (GDPR Art. 25). Zero advertising trackers, data brokers, or unauthorized profiling scripts exist on this platform.'}
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
                <li>
                  <strong>{isTurkish ? 'Rıza Öncesi Sıfır Üçüncü Taraf İsteği & Google Fonts İzolasyonu:' : 'Zero Pre-Consent Third-Party Requests & Google Fonts Isolation:'}</strong>{' '}
                  {isTurkish
                    ? 'Açık rızanız (opt-in) alınmadan ne Google Fonts ne de harici analitik/telemetri betikleri yüklenir; dolayısıyla AB ve Türkiye ziyaretçilerinin IP adresleri rıza dışı üçüncü taraf sunuculara aktarılmaz. Tarayıcınızın Global Privacy Control (GPC) ve Do Not Track (DNT) sinyalleri otomatik olarak tanınır.'
                    : 'Neither Google Fonts nor optional external analytics scripts load prior to explicit opt-in consent, ensuring zero pre-consent visitor IP transfer to third-party CDNs. Browser Global Privacy Control (GPC) and Do Not Track (DNT) signals are respected automatically.'}
                </li>
                <li>
                  <strong>{isTurkish ? 'Alt İşleyiciler ve Uluslararası Veri Aktarımı (GDPR Bölüm V / KVKK m.9):' : 'Sub-Processors & International Transfers (GDPR Ch. V / KVKK Art. 9):'}</strong>{' '}
                  {isTurkish
                    ? '(1) Google Cloud Platform (Avrupa — europe-west2): Uygulama barındırma, isteğe bağlı oturum açmış okur yer imleri ve gönüllü soru kayıtları. (2) Firebase Authentication (Yalnızca Google ile gönüllü giriş yapanlar için): Kimlik doğrulama ve cihazlar arası yer imi eşitleme. (3) Sunucu Tarafı Yapay Zeka (/api/*): Soru-cevap ve 12 dil çeviri yanıtları istemci anahtarı olmadan yalnızca sunucu tarafından yürütülür. Üçüncü taraf e-posta bildirim rölesine okur e-posta adresi kesinlikle gönderilmez (veri minimizasyonu).'
                    : '(1) Google Cloud Platform (Europe — europe-west2): Application hosting, optional signed-in bookmarks, and voluntary Q&A submissions. (2) Firebase Authentication (strictly opt-in Google Sign-In): Cross-device bookmark sync. (3) Server-side AI (/api/*): On-demand Q&A and 12-language translation isolated server-side. Raw reader email PII is stripped from uncontracted third-party relay fallbacks (GDPR Art. 5(1)(c) data minimization).'}
                </li>
                <li>
                  <strong>{isTurkish ? 'Saklama Süreleri (GDPR Madde 5(1)(e) / KVKK m.7):' : 'Data Retention Periods (GDPR Art. 5(1)(e) / KVKK Art. 7):'}</strong>{' '}
                  {isTurkish
                    ? 'Tarayıcı yerel tercihleri (dil, tema, rıza seçimi) kullanıcı silene kadar; Google ile giriş yapanların yer imi kayıtları silme talebine kadar; gönüllü Soru/İtiraz kayıtları en fazla 12 ay veya silme talebine kadar saklanır; anonim kümülatif okunma/görüntülenme sayaçları kişisel veri içermez.'
                    : 'Browser preferences remain until cleared; signed-in bookmark records remain until deletion is requested; voluntary Q&A submissions are retained for a maximum of 12 months or erased immediately upon request; aggregate reading counters contain zero personal identifiers.'}
                </li>
                <li>
                  <strong>{isTurkish ? 'Anonim Makale Okunma, Akademik Merkez & Sanayi Ekosistemi Dağılımı (GDPR Recital 26 / KVKK m.28/1-b):' : 'Anonymized Per-Article Academic Hub & Industrial Ecosystem Analytics (GDPR Recital 26 / KVKK Art. 28/1-b):'}</strong>{' '}
                  {isTurkish
                    ? 'Her makalenin yanında ve Analitik panelinde gösterilen 11 düğüm toplam okunmaları, 12 ülke / 60 akademik merkez ve Silikon Vadisi dâhil 6 küresel sanayi ekosistemi (31 kuruluş) dağılımları kesinlikle kişisel veri (PII), bireysel IP adresi, cihaz parmak izi, çerez kimliği veya çalışan/öğrenci profili içermez. Tekilleştirme (singling-out) riskini önlemek için 5’ten az okunmaya sahip tekil kurum hücreleri otomatik olarak "< 5 (k-Anonim)" şeklinde maskelenir (k ≥ 5). Kurum adları yalnızca anonim istatistiksel dağılımı temsil eder; herhangi bir kurumsal ortaklık, sponsorluk veya bireysel takip anlamına gelmez. Yeni tarayıcı ölçümleri ve analitik localStorage kayıtları yalnızca açık rızanızla (opt-in) çalışır ve rıza geri çekildiğinde otomatik silinir.'
                    : 'Per-article 11-node global read totals, 12-country / 60 academic hub distributions, and Silicon Valley / 6 global industrial ecosystem breakdowns contain zero personal data (PII), IP addresses, browser fingerprints, cookies, or employee/student profiles. To prevent singling-out under GDPR Recital 26 and KVKK anonymization guidelines, institutional cells below 5 reads are automatically masked as "< 5 (k-Anonim)" (k ≥ 5). Listed institution names represent anonymized statistical distribution only and do not imply endorsement or individual tracking. Browser analytics recording and non-essential analytics localStorage remain strictly opt-in and are purged immediately upon consent withdrawal (GDPR Art. 7(3)).'}
                </li>
                <li>
                  <strong>{isTurkish ? 'Denetim Makamına Şikayet Hakkı (GDPR Madde 77 / KVKK m.14):' : 'Right to Lodge a Complaint (GDPR Art. 77 / KVKK Art. 14):'}</strong>{' '}
                  {isTurkish
                    ? 'Türkiye’de Kişisel Verileri Koruma Kurumu’na (kvkk.gov.tr), AB/AEA’da ise ikamet ettiğiniz üye devletin ulusal Veri Koruma Otoritesi’ne (edpb.europa.eu) şikayette bulunma hakkınız her zaman saklıdır.'
                    : 'You retain the right to lodge a complaint with the Turkish Data Protection Authority (kvkk.gov.tr) or your local EU/EEA supervisory authority (edpb.europa.eu).'}
                </li>
              </ul>

              {renderDataSubjectRightsCenter()}
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-3">
              <h3 className="text-xl font-editorial font-bold text-stone-900">
                {isTurkish ? 'Kullanım Koşulları ve Telif Hakları' : 'Terms of Use & Authorship Terms'}
              </h3>
              <p>
                {isTurkish
                  ? 'emrepelit-sciphi.ai.studio adresinde sunulan tüm özgün bilim ve felsefe makaleleri, çok dilli edisyonlar, görsel simülasyon plakaları ve etkileşimli analiz araçları bağımsız yazar Emre Pelit tarafından oluşturulmuştur.'
                  : 'All original science and philosophy essays, multilingual editions, mathematical simulation plates, and interactive analysis tools hosted on emrepelit-sciphi.ai.studio are created by independent author Emre Pelit.'}
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
                <li>
                  <strong>{isTurkish ? 'Akademik Atıf & Okuma Hakkı:' : 'Scholarly Citation & Reading Rights:'}</strong>{' '}
                  {isTurkish
                    ? 'Tüm içerikler açık erişimlidir; yazar adı (Emre Pelit) ve kanonik kaynak URL (emrepelit-sciphi.ai.studio) açıkça belirtilerek akademik çalışmalarda, kaynakçalarda ve bilimsel tartışmalarda serbestçe atıf yapılabilir.'
                    : 'All content is open access and may be freely read, cited, and referenced in scholarly work provided Emre Pelit and the canonical URL (emrepelit-sciphi.ai.studio) are attributed.'}
                </li>
                <li>
                  <strong>{isTurkish ? 'Ticari Çoğaltma & Değişiklik Yasağı:' : 'Prohibition on Unattributed Alteration:'}</strong>{' '}
                  {isTurkish
                    ? 'Eser sahibinin yazılı izni olmadan makale metinlerinin veya simülasyonların yazarlık bilgisi silinerek ticari amaçla yeniden yayımlanması yasaktır.'
                    : 'Republishing essays or simulations commercially or stripping original authorship attribution without prior written consent is prohibited.'}
                </li>
                <li>
                  <strong>{isTurkish ? 'Yapay Zeka & Sistem Güvenliği:' : 'Automated Access & System Integrity:'}</strong>{' '}
                  {isTurkish
                    ? 'Arama motoru ve yapay zeka indeks botlarına /robots.txt, /llms-full.txt ve /sitemap_index.xml üzerinden izin verilmektedir; ancak sunucu istatistiklerini manipüle etmeye yönelik otomatik istekler Zero-Trust WAF ile engellenir.'
                    : 'Search engines and AI indexers are explicitly permitted via /robots.txt, /llms-full.txt, and /sitemap_index.xml, while automated abuse attempting to alter server telemetry is blocked by the Zero-Trust WAF.'}
                </li>
              </ul>
            </div>
          )}

          {activeTab === 'imprint' && (
            <div className="space-y-3">
              <h3 className="text-xl font-editorial font-bold text-stone-900">
                {isTurkish ? 'Künye & Resmi Yazar İletişim Bilgileri' : 'Imprint & Official Publisher Contact'}
              </h3>
              <div className="bg-stone-100 border border-stone-300 p-4 font-mono text-xs space-y-1.5">
                <div><strong>{isTurkish ? 'Yayın Adı:' : 'Archive Name:'}</strong> Emre Pelit — Sci-Phil Bilim, Felsefe ve Simülasyon Arşivi</div>
                <div><strong>{isTurkish ? 'Münhasır Yazar & Veri Sorumlusu:' : 'Sole Author & Data Controller:'}</strong> Emre Pelit (Mersin Üniversitesi &amp; Anadolu Üniversitesi AÖF)</div>
                <div><strong>{isTurkish ? 'Konum:' : 'Location:'}</strong> Mersin, Türkiye</div>
                <div><strong>{isTurkish ? 'KVKK & GDPR İletişim E-Postası:' : 'KVKK & GDPR Contact Email:'}</strong> emrepelit39@gmail.com</div>
                <div><strong>{isTurkish ? 'Kanonik Ana Hub (HTTP 200):' : 'Canonical Main Hub (HTTP 200):'}</strong> https://emrepelit-sciphi.ai.studio</div>
                <div><strong>{isTurkish ? 'Kaynak Blog Arşivi:' : 'Source CMS Archive:'}</strong> https://emrepelit7337.blogspot.com ({totalArticlesCount} Makale)</div>
                <div><strong>GitHub:</strong> https://github.com/emrepelit109 (Pasif Arşiv: emrepelit.github.io/science-philosophy)</div>
                <div><strong>YouTube &amp; LinkedIn:</strong> https://www.youtube.com/@science_only · https://www.linkedin.com/in/emrepelit109</div>
              </div>
              <p className="text-xs text-stone-600">
                {isTurkish
                  ? 'Bu platform bağımsız kişisel bilim ve felsefe güncesidir; herhangi bir dergi, enstitü veya kamu kurumu sıfatı taşımaz.'
                  : 'This platform operates strictly as an independent personal science and philosophy archive and does not claim affiliation with an external journal or accredited institute.'}
              </p>
            </div>
          )}

          {activeTab === 'kvkk' && (
            <div className="space-y-3">
              <h3 className="text-xl font-editorial font-bold text-stone-900">
                {isTurkish
                  ? '6698 Sayılı KVKK & AB GDPR (2016/679) Aydınlatma Metni'
                  : 'KVKK (Turkish Law No. 6698) & EU GDPR (2016/679) Data Protection Notice'}
              </h3>
              <p className="text-xs font-mono bg-stone-100 border border-stone-300 p-3">
                {isTurkish
                  ? 'Veri Sorumlusu: Emre Pelit | Resmi İletişim: emrepelit39@gmail.com | Konum: Mersin, Türkiye | Resmi Alan Adı: https://emrepelit-sciphi.ai.studio'
                  : 'Data Controller: Emre Pelit | Official Contact: emrepelit39@gmail.com | Location: Mersin, Türkiye | Canonical Domain: https://emrepelit-sciphi.ai.studio'}
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
                <li>
                  <strong>{isTurkish ? 'İşlenen Veri Kategorileri ve Hukuki Sebepler (KVKK m.5 / GDPR m.6):' : 'Data Categories & Legal Bases (KVKK Art. 5 / GDPR Art. 6):'}</strong>{' '}
                  {isTurkish
                    ? 'Güvenlik (WAF / hız sınırı) ve temel erişim sürekliliği KVKK m.5/2-(f) & GDPR m.6(1)(f) meşru menfaat; isteğe bağlı analitik, harici yazı tipleri (Google Fonts) ve Soru/İtiraz formunda gönüllü ad/e-posta/soru iletimi ise KVKK m.5/1 & GDPR m.6(1)(a) açık rıza (işaretlenmemiş onay kutusu ile) kapsamında işlenir. İsteğe bağlı Google ile girişte yer imi eşitlemesi KVKK m.5/2-(c) & GDPR m.6(1)(b) talep edilen hizmetin ifası hukuki sebebine dayanır.'
                    : 'WAF security and core access continuity rely on legitimate interest (KVKK Art. 5/2-f, GDPR Art. 6(1)(f)). Optional analytics, external Google Fonts, and voluntary Q&A submissions (via an unchecked consent checkbox) rely strictly on explicit consent (KVKK Art. 5/1, GDPR Art. 6(1)(a)). Optional Google Sign-In bookmark sync relies on performance of a requested service (KVKK Art. 5/2-c, GDPR Art. 6(1)(b)).'}
                </li>
                <li>
                  <strong>{isTurkish ? 'Yurt İçi / Yurt Dışı Aktarım ve Veri Minimizasyonu (KVKK m.9 / GDPR m.44-49):' : 'Data Transfers & Minimization (KVKK Art. 9 / GDPR Art. 44-49):'}</strong>{' '}
                  {isTurkish
                    ? 'Uygulama ve opsiyonel hesap/soru kayıtları Avrupa (europe-west2) güvenli bulut altyapısında barındırılır. Yapay zeka yanıtları sunucu tarafında (/api/*) izole edilir. Soru/İtiraz e-postanız hiçbir zaman kamuya veya sözleşmesiz üçüncü taraf rölelere açılmaz; yalnızca veri sorumlusu Emre Pelit’in (emrepelit39@gmail.com) erişebileceği birinci taraf kuyrukta korunur.'
                    : 'Hosting and optional signed-in/Q&A records reside in the European cloud region (europe-west2). AI requests run strictly server-side (/api/*). Reader emails are never disclosed publicly or transmitted to uncontracted third-party relays, remaining strictly in the first-party controller queue for emrepelit39@gmail.com.'}
                </li>
                <li>
                  <strong>{isTurkish ? 'Anonim Hale Getirme ve k-Anonimlik Güvencesi (KVKK m.3, m.7, m.28/1-b & GDPR Recital 26):' : 'Anonymization & k-Anonymity Safeguards (KVKK Art. 3, 7, 28/1-b & GDPR Recital 26):'}</strong>{' '}
                  {isTurkish
                    ? '11 düğümlü 301 ağında her makale için hesaplanan küresel okunma sayıları ile akademik merkez ve Silikon Vadisi / sanayi kuruluşu dağılımları kişisel veri olmaksızın anonim toplulaştırma esasına dayanır. Bireysel okur kimliğini tekilleştirebilecek 5’in altındaki kurum hücreleri (< 5) k-anonimlik kuralıyla maskelenir; açık rıza (opt-in) verilmeden tarayıcınızda hiçbir analitik localStorage kaydı oluşturulmaz ve rıza geri çekildiğinde tüm analitik kayıtlar anında temizlenir.'
                    : 'Per-article global read counts across all 11 network nodes and academic/industrial ecosystem breakdowns operate strictly on anonymized aggregate data with zero PII. Institutional cells below 5 reads are suppressed via k-anonymity (k ≥ 5) to eliminate singling-out risks; zero non-essential analytics localStorage keys are written prior to explicit opt-in consent, and withdrawal purges them immediately.'}
                </li>
                <li>
                  <strong>{isTurkish ? 'KVKK Madde 11 & GDPR Madde 15–22 Kapsamındaki Haklarınız:' : 'Your Rights under KVKK Art. 11 & GDPR Art. 15–22:'}</strong>{' '}
                  {isTurkish
                    ? 'Verilerinizin işlenip işlenmediğini öğrenme, JSON formatında erişim/taşınabilirlik, düzeltme, silinme/yok edilme (KVKK m.7 / GDPR m.17), işlemeye itiraz etme ve açık rızayı dilediğiniz an geri çekme (GDPR m.7(3)) haklarını aşağıdaki Self-Servis panelden anında veya emrepelit39@gmail.com adresine başvurarak en geç 30 gün içinde ücretsiz kullanabilirsiniz.'
                    : 'You may exercise your rights to access, export in JSON (portability), rectify, erase (KVKK Art. 7 / GDPR Art. 17), object, or withdraw consent (GDPR Art. 7(3)) instantly via the Self-Service Rights Center below or free of charge within 30 days by contacting emrepelit39@gmail.com.'}
                </li>
              </ul>

              {renderDataSubjectRightsCenter()}
            </div>
          )}

          {activeTab === 'disclaimer' && (
            <div className="space-y-3">
              <h3 className="text-xl font-editorial font-bold text-stone-900">
                {isTurkish
                  ? 'Bilimsel Sorumluluk Reddi ve Bağımsız Yayın Statüsü Beyanı'
                  : 'Scientific Disclaimer & Independent Archive Status'}
              </h3>
              <div className="bg-amber-50 border-l-4 border-amber-500 p-3.5 text-xs sm:text-sm text-stone-900">
                <strong>{isTurkish ? 'Açık Kurumsal Beyan:' : 'Explicit Status Disclosure:'}</strong>{' '}
                {isTurkish
                  ? `Emre Pelit — Sci-Phil Platformu, hakemli (peer-reviewed) bir akademik dergi veya akredite bir araştırma enstitüsü değildir; bağımsız yazar Emre Pelit’in emrepelit7337.blogspot.com kaynaklı ${totalArticlesCount} özgün bilim ve felsefe denemesi ile bunlara eşlik eden deneysel kuramsal simülasyon modellerinin birleştirilmiş kişisel arşividir.`
                  : `Emre Pelit — Sci-Phil is NOT a peer-reviewed academic journal or accredited research institute. It is an independent personal archive presenting ${totalArticlesCount} original science & philosophy essays by Emre Pelit (synced from emrepelit7337.blogspot.com) alongside exploratory mathematical simulation models.`}
              </div>
              <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
                <li>
                  <strong>{isTurkish ? 'Literatür ve Kavram Ayrımı:' : 'Literature vs. Exploratory Synthesis:'}</strong>{' '}
                  {isTurkish
                    ? 'Her makalenin analiz ekranında listelenen tarihsel bilim insanları ve yerleşik kabuller (Max Planck, Emmy Noether, Jacob Bekenstein, Kurt Gödel, Henri Poincaré vb.) literatürdeki köklü referansları özetler; yazarın kendi tezi ve görsel/matematiksel simülasyon plakaları ise etkileşimli kavramsal modellerdir ve deneysel laboratuvar verisi yerine geçmez.'
                    : 'Historical scientists and established consensuses cited on each analysis view summarize canonical literature; the author’s original essay thesis and interactive simulation plates represent exploratory conceptual models rather than clinical or laboratory measurements.'}
                </li>
                <li>
                  <strong>{isTurkish ? 'Kayıtlı Tanımlayıcılar:' : 'Repository Identifiers:'}</strong>{' '}
                  {isTurkish
                    ? 'Sayfalarda yer alan arşiv sıra numaraları (#1–#316) ve dahili külliyat referans kodları yalnızca arşiv içi tekil indeksleme ile kanonik URL çözümlemesi amacıyla kullanılır.'
                    : 'Archive sequence numbers (#1–#316) and internal corpus reference codes serve solely for internal archive indexing and canonical URL resolution.'}
                </li>
              </ul>
            </div>
          )}

          {activeTab === 'methodology' && (
            <div className="space-y-3">
              <h3 className="text-xl font-editorial font-bold text-stone-900">
                {isTurkish
                  ? 'Yapay Zeka Modelleri, Sunucu Telemetrisi ve 301 Konsolidasyon Mimarisi'
                  : 'AI Models, Server Telemetry & 301 Consolidation Architecture'}
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
                <li>
                  <strong>{isTurkish ? 'Sunucu Tarafı Yapay Zeka (API İzolasyonu):' : 'Server-Side AI Execution:'}</strong>{' '}
                  {isTurkish
                    ? 'İçerik analizi, çeviri ve 12 dil seslendirme uç noktaları yalnızca Node.js/Express sunucu tarafındaki korumalı /api/* rotalarında hız sınırlandırması (rate-limiting) ile çalışır. API anahtarları hiçbir zaman istemci tarayıcıya gönderilmez.'
                    : 'AI analysis, translation, and 12-language TTS run strictly behind rate-limited backend /api/* proxy endpoints. API keys are never exposed to the browser.'}
                </li>
                <li>
                  <strong>{isTurkish ? 'Ölçüm, 11 Düğüm Mutabakatı ve KVKK/GDPR Anonimleştirme Şeffaflığı:' : 'Telemetry, 11-Node Reconciliation & KVKK/GDPR Anonymization Transparency:'}</strong>{' '}
                  {isTurkish
                    ? 'Analitik panelindeki 11 düğüm toplamı (3 canlı + 8 senkron 301 düğümü) ile 318+ makale dökümü, 12 ülke / 60 akademik merkez ve Silikon Vadisi dâhil 6 küresel sanayi ekosistemi (31 kuruluş) kümülatif toplamları matematiksel olarak %100 birebir eşitlenir. Tüm kurumsal dağılımlar kişisel veri (IP/çerez/kimlik) barındırmaz; tekil makalelerde 5’in altındaki kurum hücreleri KVKK ve GDPR Recital 26 uyarınca "< 5 (k-Anonim)" olarak maskelenir ve yeni tarayıcı ölçümleri yalnızca açık rıza (opt-in) ile etkinleştirilir.'
                    : 'All 11-node totals (3 live + 8 synchronized 301 nodes), 318+ per-article breakdowns, 12-country / 60 academic hubs, and Silicon Valley / 6 global industrial ecosystems reconcile with exact integer arithmetic. All institutional breakdowns are strictly non-PII, enforce k ≥ 5 small-cell masking under GDPR Recital 26 & KVKK, and gate live browser measurement strictly behind opt-in consent.'}
                </li>
                <li>
                  <strong>{isTurkish ? 'Cloud Run, Özel Alan Adı ve Gerçek HTTP 301:' : 'Cloud Run, Custom Domains & HTTP 301 Consolidation:'}</strong>{' '}
                  {isTurkish
                    ? 'Bu portal (#8 emrepelit-sciphi.ai.studio) kanonik Ana Hub olarak HTTP 200 OK yanıtı verir. Aynı sunucu içindeki ?article=... ve eski yol varyantları 1:1 HTTP 301 kalıcı yönlendirme döndürür. Kardeş *.ai.studio alt alan adlarının harici DNS düzeyinde tam 301 birleşimi ise faturalandırmalı Google Cloud Run özel alan adı eşlemesi (Custom Domain) ve Cloudflare Page/Redirect Rules ile tamamlanır.'
                    : 'This portal (#8 emrepelit-sciphi.ai.studio) serves HTTP 200 OK as Canonical Main Hub. Legacy query/path routes return 1:1 HTTP 301 internally, while external *.ai.studio host consolidation is designed for Cloud Run Custom Domain / Cloudflare 301 Edge Rules.'}
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
