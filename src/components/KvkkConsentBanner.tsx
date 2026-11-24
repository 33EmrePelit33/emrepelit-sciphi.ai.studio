import React, { useState, useEffect } from 'react';
import { ShieldCheck, SlidersHorizontal, Check, X, FileText } from 'lucide-react';
import { LanguageCode } from '../types';
import { GovernanceTab } from './GovernanceLegalModal';

export interface KvkkConsentState {
  status: 'pending' | 'accepted' | 'rejected';
  analytics: boolean;
  externalTelemetry: boolean;
  externalFonts?: boolean;
  gpcHonored?: boolean;
  updatedAt: string;
}

export const KVKK_CONSENT_STORAGE_KEY = 'sciphil_kvkk_consent_v1';

export const DEFAULT_KVKK_CONSENT: KvkkConsentState = {
  status: 'pending',
  analytics: false,
  externalTelemetry: false,
  externalFonts: false,
  gpcHonored: false,
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

interface BannerStrings {
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
  gpcNotice: string;
}

const BANNER_COPY: Partial<Record<LanguageCode, BannerStrings>> & { en: BannerStrings } = {
  tr: {
    badge: '6698 Sayılı KVKK & AB GDPR Açık Rıza Merkezi',
    title: 'Kişisel Veri, Çerez ve Tercih Yönetimi',
    body: 'Bu bağımsız bilim ve felsefe arşivinde analitik ölçüm, harici yazı tipleri (Google Fonts) ve isteğe bağlı telemetri açık rızanız (opt-in) olmadan kesinlikle çalıştırılmaz. "Tümünü Reddet" ve "Tümünü Kabul Et" seçenekleri eşit haklara sahiptir; rızanızı dilediğiniz an geri çekebilir veya verilerinizi silebilirsiniz.',
    acceptAll: 'Tümünü Kabul Et',
    rejectAll: 'Tümünü Reddet',
    managePrefs: 'Tercihleri Yönet',
    savePrefs: 'Seçili Tercihleri Kaydet',
    kvkkLink: 'KVKK & GDPR Haklarınız',
    privacyLink: 'Gizlilik Politikası',
    essentialTitle: 'Zorunlu Teknik Depolama (Açık Rıza Gerektirmez)',
    essentialDesc: 'Dil tercihi, okuma teması, güvenlik/WAF koruması ve bu onay kaydı (KVKK m.5/2-f · GDPR Art. 6/1-f).',
    essentialTag: 'Zorunlu',
    analyticsTitle: 'Birinci Taraf Okuma & Etkileşim Analitiği',
    analyticsDesc: 'Anonim okuma süresi ve simülasyon etkileşim sayaçları (KVKK m.5/1 · GDPR Art. 6/1-a).',
    externalTitle: 'Harici Yazı Tipleri (Google Fonts) & İsteğe Bağlı Telemetri',
    externalDesc: 'Üçüncü taraf sunuculara (Google Fonts / isteğe bağlı GA4) yalnızca açık rızanızla bağlantı kurulur.',
    gpcNotice: 'Tarayıcınızın "Global Privacy Control / Do Not Track" gizlilik sinyali otomatik olarak saygı gördü.',
  },
  en: {
    badge: 'GDPR (EU 2016/679) & KVKK (Law 6698) Consent Center',
    title: 'Privacy, Cookie & Data Preferences',
    body: 'Analytics, external web fonts (Google Fonts), and optional third-party telemetry remain strictly disabled until you grant explicit opt-in consent. Reject All and Accept All carry equal weight, and you may withdraw consent or delete your data at any time.',
    acceptAll: 'Accept All',
    rejectAll: 'Reject All',
    managePrefs: 'Manage Preferences',
    savePrefs: 'Save Preferences',
    kvkkLink: 'GDPR & KVKK Rights',
    privacyLink: 'Privacy Policy',
    essentialTitle: 'Strictly Necessary Storage',
    essentialDesc: 'Language preference, reading theme, security/WAF protection, and this consent record (GDPR Art. 6(1)(f)).',
    essentialTag: 'Required',
    analyticsTitle: 'First-Party Reading & Simulation Analytics',
    analyticsDesc: 'Aggregate reading duration and simulation counters (GDPR Art. 6(1)(a) Opt-In).',
    externalTitle: 'External Web Fonts (Google Fonts) & Optional Telemetry',
    externalDesc: 'Connects to external font/telemetry providers strictly after your explicit opt-in consent.',
    gpcNotice: 'Your browser Global Privacy Control / Do Not Track signal was automatically respected.',
  },
  es: {
    badge: 'Centro de Consentimiento RGPD (UE 2016/679) y KVKK',
    title: 'Preferencias de Privacidad y Cookies',
    body: 'Las analíticas, fuentes externas (Google Fonts) y telemetría opcional permanecen desactivadas hasta su consentimiento explícito. Puede rechazar todo o revocar su consentimiento en cualquier momento.',
    acceptAll: 'Aceptar Todo',
    rejectAll: 'Rechazar Todo',
    managePrefs: 'Configurar',
    savePrefs: 'Guardar Preferencias',
    kvkkLink: 'Derechos RGPD y KVKK',
    privacyLink: 'Política de Privacidad',
    essentialTitle: 'Almacenamiento Estrictamente Necesario',
    essentialDesc: 'Idioma, tema de lectura, seguridad WAF y registro de consentimiento.',
    essentialTag: 'Obligatorio',
    analyticsTitle: 'Analítica Propia de Lectura',
    analyticsDesc: 'Contadores agregados de lectura y simulaciones científicas.',
    externalTitle: 'Fuentes Externas (Google Fonts) y Telemetría Opcional',
    externalDesc: 'Solo carga recursos de terceros tras su consentimiento explícito.',
    gpcNotice: 'Señal Global Privacy Control / Do Not Track respetada automáticamente.',
  },
  de: {
    badge: 'DSGVO (EU 2016/679) & KVKK Einwilligungszentrum',
    title: 'Datenschutz- und Cookie-Einstellungen',
    body: 'Analysen, externe Schriftarten (Google Fonts) und optionale Telemetrie bleiben ohne Ihre ausdrückliche Einwilligung vollständig deaktiviert. Sie können alle ablehnen oder Ihre Einwilligung jederzeit widerrufen.',
    acceptAll: 'Alle akzeptieren',
    rejectAll: 'Alle ablehnen',
    managePrefs: 'Einstellungen',
    savePrefs: 'Auswahl speichern',
    kvkkLink: 'DSGVO- & KVKK-Rechte',
    privacyLink: 'Datenschutzerklärung',
    essentialTitle: 'Technisch notwendig',
    essentialDesc: 'Sprachauswahl, Lesethema, WAF-Sicherheit und Einwilligungsnachweis (Art. 6 Abs. 1 lit. f DSGVO).',
    essentialTag: 'Erforderlich',
    analyticsTitle: 'Eigene Lese- & Simulationsstatistik',
    analyticsDesc: 'Aggregierte Lesedauer und Simulationszähler (Art. 6 Abs. 1 lit. a DSGVO).',
    externalTitle: 'Externe Webfonts (Google Fonts) & Optionale Telemetrie',
    externalDesc: 'Verbindungen zu Google Fonts oder optionalen Diensten erfolgen nur nach ausdrücklicher Zustimmung.',
    gpcNotice: 'Ihr Global Privacy Control / Do Not Track Signal wurde automatisch beachtet.',
  },
  fr: {
    badge: 'Centre de Consentement RGPD (UE 2016/679) & KVKK',
    title: 'Préférences de Confidentialité et Cookies',
    body: 'Les analyses, polices externes (Google Fonts) et télémétrie optionnelle restent strictement désactivées sans votre consentement explicite. Vous pouvez tout refuser ou retirer votre accord à tout moment.',
    acceptAll: 'Tout accepter',
    rejectAll: 'Tout refuser',
    managePrefs: 'Personnaliser',
    savePrefs: 'Enregistrer',
    kvkkLink: 'Droits RGPD & KVKK',
    privacyLink: 'Confidentialité',
    essentialTitle: 'Stockage Strictement Nécessaire',
    essentialDesc: 'Langue, thème de lecture, sécurité WAF et preuve de consentement.',
    essentialTag: 'Requis',
    analyticsTitle: 'Mesure d’Audience Interne',
    analyticsDesc: 'Compteurs agrégés de durée de lecture et simulations.',
    externalTitle: 'Polices Externes (Google Fonts) & Télémétrie Optionnelle',
    externalDesc: 'Activé uniquement après votre consentement explicite.',
    gpcNotice: 'Votre signal Global Privacy Control / Do Not Track a été respecté automatiquement.',
  },
  ru: {
    badge: 'Центр согласия GDPR и KVKK (Закон 6698)',
    title: 'Настройки конфиденциальности и файлов cookie',
    body: 'Аналитика, внешние шрифты (Google Fonts) и дополнительная телеметрия отключены до вашего явного согласия. Вы можете отклонить всё или отозвать согласие в любое время.',
    acceptAll: 'Принять все',
    rejectAll: 'Отклонить все',
    managePrefs: 'Настроить',
    savePrefs: 'Сохранить выбор',
    kvkkLink: 'Права GDPR и KVKK',
    privacyLink: 'Политика конфиденциальности',
    essentialTitle: 'Строго необходимые данные',
    essentialDesc: 'Язык интерфейса, тема чтения, защита WAF и статус согласия.',
    essentialTag: 'Обязательно',
    analyticsTitle: 'Собственная аналитика чтения',
    analyticsDesc: 'Агрегированные счетчики времени чтения и симуляций.',
    externalTitle: 'Внешние шрифты (Google Fonts) и телеметрия',
    externalDesc: 'Загружаются только после вашего явного согласия.',
    gpcNotice: 'Сигнал Global Privacy Control / Do Not Track учтен автоматически.',
  },
  ar: {
    badge: 'مركز موافقة GDPR و KVKK (قانون 6698)',
    title: 'تفضيلات الخصوصية وملفات الارتباط',
    body: 'تظل التحليلات والخطوط الخارجية (Google Fonts) والقياس الاختياري معطلة تماماً حتى تمنح موافقتك الصريحة. يمكنك الرفض الكامل أو سحب الموافقة وحذف بياناتك في أي وقت.',
    acceptAll: 'قبول الكل',
    rejectAll: 'رفض الكل',
    managePrefs: 'إدارة التفضيلات',
    savePrefs: 'حفظ التفضيلات',
    kvkkLink: 'حقوق GDPR و KVKK',
    privacyLink: 'سياسة الخصوصية',
    essentialTitle: 'تخزين تقني ضروري',
    essentialDesc: 'اختيار اللغة ومظهر القراءة وحماية الأمان وسجل الموافقة.',
    essentialTag: 'ضروري',
    analyticsTitle: 'تحليلات القراءة والمحاكاة الداخلية',
    analyticsDesc: 'عدادات إجمالية لمدة القراءة والتفاعل مع النماذج العلمية.',
    externalTitle: 'الخطوط الخارجية (Google Fonts) والقياس الاختياري',
    externalDesc: 'يتم الاتصال بخدمات خارجية فقط بعد موافقتك الصريحة.',
    gpcNotice: 'تم احترام إشارة الخصوصية Global Privacy Control تلقائياً.',
  },
  zh: {
    badge: 'GDPR 与 KVKK 隐私同意管理中心',
    title: '隐私与 Cookie 偏好设置',
    body: '未经您明确同意，统计分析、外部字体（Google Fonts）及可选遥测均保持完全关闭。您可以随时拒绝全部、撤回同意或删除个人数据。',
    acceptAll: '全部接受',
    rejectAll: '全部拒绝',
    managePrefs: '管理偏好',
    savePrefs: '保存偏好',
    kvkkLink: 'GDPR 与 KVKK 权利',
    privacyLink: '隐私政策',
    essentialTitle: '严格必要存储',
    essentialDesc: '语言选择、阅读主题、安全防护及本同意记录。',
    essentialTag: '必需',
    analyticsTitle: '第一方阅读与模拟统计',
    analyticsDesc: '匿名聚合阅读时长与科学模拟计数。',
    externalTitle: '外部字体 (Google Fonts) 与可选遥测',
    externalDesc: '仅在您明确授权后连接外部服务。',
    gpcNotice: '已自动尊重您浏览器的 Global Privacy Control / Do Not Track 隐私信号。',
  },
  ja: {
    badge: 'GDPR・KVKK プライバシー同意管理センター',
    title: 'プライバシーおよび Cookie 設定',
    body: '明示的な同意（オプトイン）がない限り、分析・外部フォント（Google Fonts）・任意テレメトリは一切動作しません。いつでもすべて拒否・同意撤回・データ削除が可能です。',
    acceptAll: 'すべて許可',
    rejectAll: 'すべて拒否',
    managePrefs: '詳細設定',
    savePrefs: '選択を保存',
    kvkkLink: 'GDPR・KVKK の権利',
    privacyLink: 'プライバシーポリシー',
    essentialTitle: '必須の技術ストレージ',
    essentialDesc: '言語設定、読書テーマ、セキュリティ保護、同意記録のみ保持。',
    essentialTag: '必須',
    analyticsTitle: 'ファーストパーティ読書・解析統計',
    analyticsDesc: '集計された読書時間およびシミュレーション回数。',
    externalTitle: '外部フォント (Google Fonts)・任意テレメトリ',
    externalDesc: '明示的な同意後にのみ外部サーバーへ接続します。',
    gpcNotice: 'ブラウザの Global Privacy Control / Do Not Track 信号を自動適用しました。',
  },
  pt: {
    badge: 'Centro de Consentimento RGPD (UE 2016/679) e KVKK',
    title: 'Preferências de Privacidade e Cookies',
    body: 'Análises, fontes externas (Google Fonts) e telemetria opcional permanecem desativadas até o seu consentimento explícito. Você pode recusar tudo ou revogar o consentimento a qualquer momento.',
    acceptAll: 'Aceitar Tudo',
    rejectAll: 'Recusar Tudo',
    managePrefs: 'Gerenciar',
    savePrefs: 'Salvar Preferências',
    kvkkLink: 'Direitos RGPD e KVKK',
    privacyLink: 'Política de Privacidade',
    essentialTitle: 'Armazenamento Estritamente Necessário',
    essentialDesc: 'Idioma, tema de leitura, segurança WAF e registro de consentimento.',
    essentialTag: 'Obrigatório',
    analyticsTitle: 'Análise Própria de Leitura',
    analyticsDesc: 'Contadores agregados de tempo de leitura e simulações.',
    externalTitle: 'Fontes Externas (Google Fonts) e Telemetria Opcional',
    externalDesc: 'Ativado apenas após consentimento explícito.',
    gpcNotice: 'Sinal Global Privacy Control / Do Not Track respeitado automaticamente.',
  },
  it: {
    badge: 'Centro Consenso GDPR (UE 2016/679) e KVKK',
    title: 'Preferenze Privacy e Cookie',
    body: 'Analisi, font esterni (Google Fonts) e telemetria opzionale restano completamente disattivati fino al tuo consenso esplicito. Puoi rifiutare tutto o revocare il consenso in qualsiasi momento.',
    acceptAll: 'Accetta Tutto',
    rejectAll: 'Rifiuta Tutto',
    managePrefs: 'Personalizza',
    savePrefs: 'Salva Preferenze',
    kvkkLink: 'Diritti GDPR e KVKK',
    privacyLink: 'Informativa Privacy',
    essentialTitle: 'Archiviazione Strettamente Necessaria',
    essentialDesc: 'Lingua, tema di lettura, sicurezza WAF e registro del consenso.',
    essentialTag: 'Obbligatorio',
    analyticsTitle: 'Statistiche Interne di Lettura',
    analyticsDesc: 'Contatori aggregati di durata lettura e simulazioni.',
    externalTitle: 'Font Esterni (Google Fonts) e Telemetria Opzionale',
    externalDesc: 'Attivati esclusivamente previo consenso esplicito.',
    gpcNotice: 'Segnale Global Privacy Control / Do Not Track rispettato automaticamente.',
  },
  ko: {
    badge: 'GDPR 및 KVKK 개인정보 동의 관리 센터',
    title: '개인정보 및 쿠키 기본 설정',
    body: '명시적 동의(Opt-In) 전까지 분석, 외부 글꼴(Google Fonts) 및 선택적 원격 측정은 완전히 비활성화됩니다. 언제든지 모두 거부하거나 동의를 철회하고 데이터를 삭제할 수 있습니다.',
    acceptAll: '모두 허용',
    rejectAll: '모두 거부',
    managePrefs: '설정 관리',
    savePrefs: '선택 저장',
    kvkkLink: 'GDPR 및 KVKK 권리',
    privacyLink: '개인정보 처리방침',
    essentialTitle: '필수 기술 저장소',
    essentialDesc: '언어 설정, 읽기 테마, 보안(WAF) 및 동의 기록.',
    essentialTag: '필수',
    analyticsTitle: '자체 읽기 및 시뮬레이션 통계',
    analyticsDesc: '집계된 읽기 시간 및 시뮬레이션 카운터.',
    externalTitle: '외부 글꼴(Google Fonts) 및 선택적 원격 측정',
    externalDesc: '명시적 동의 후에만 외부 서버에 연결됩니다.',
    gpcNotice: '브라우저의 Global Privacy Control / Do Not Track 신호가 자동 반영되었습니다.',
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
  const [draftExternal, setDraftExternal] = useState<boolean>(
    Boolean(consent.externalTelemetry || consent.externalFonts)
  );

  useEffect(() => {
    setDraftAnalytics(consent.analytics);
    setDraftExternal(Boolean(consent.externalTelemetry || consent.externalFonts));
  }, [consent.analytics, consent.externalTelemetry, consent.externalFonts]);

  useEffect(() => {
    if (forceManageOpen) {
      setShowPreferences(true);
    }
  }, [forceManageOpen]);

  const isVisible = consent.status === 'pending' || forceManageOpen;
  if (!isVisible) return null;

  const t = BANNER_COPY[language] || BANNER_COPY.en;

  const handleAcceptAll = () => {
    onUpdateConsent({
      status: 'accepted',
      analytics: true,
      externalTelemetry: true,
      externalFonts: true,
      gpcHonored: false,
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
      externalFonts: false,
      gpcHonored: Boolean(consent.gpcHonored),
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
      externalFonts: draftExternal,
      gpcHonored: false,
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
      className="fixed bottom-0 inset-x-0 z-50 border-t-2 border-stone-900 bg-[#FBF9F5]/97 backdrop-blur-md shadow-2xl text-stone-900"
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
            {consent.gpcHonored && (
              <p className="text-[11px] font-mono text-emerald-800 font-semibold">
                ✓ {t.gpcNotice}
              </p>
            )}
          </div>

          {/* Strict EDPB / GDPR / KVKK Equal-Prominence Action Buttons (Zero Dark Patterns) */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleRejectAll}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-mono font-bold border-2 border-stone-900 bg-stone-900 text-white hover:bg-stone-800 rounded-xs cursor-pointer transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>{t.rejectAll}</span>
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
                  <span className="px-1.5 py-0.5 bg-stone-200 text-stone-800 text-[10px] rounded-xs shrink-0">
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
                    className="w-4 h-4 accent-[#1E3A8A] cursor-pointer shrink-0"
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
                    className="w-4 h-4 accent-[#1E3A8A] cursor-pointer shrink-0"
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
