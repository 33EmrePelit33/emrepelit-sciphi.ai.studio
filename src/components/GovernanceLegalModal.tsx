import React, { useEffect } from 'react';
import { X, ShieldCheck, Lock, FileText, Cpu, Scale } from 'lucide-react';
import { LanguageCode } from '../types';

export type GovernanceTab = 'privacy' | 'kvkk' | 'disclaimer' | 'methodology';

interface GovernanceLegalModalProps {
  isOpen: boolean;
  activeTab: GovernanceTab;
  onSelectTab: (tab: GovernanceTab) => void;
  onClose: () => void;
  language: LanguageCode;
  totalArticlesCount: number;
}

const TAB_LABELS: Record<
  LanguageCode,
  Record<GovernanceTab, string> & {
    modalTitle: string;
    independentBadge: string;
    close: string;
  }
> = {
  tr: {
    modalTitle: 'Yönetişim, Gizlilik, KVKK (6698), Sorumluluk Reddi & Metodoloji',
    independentBadge: 'Bağımsız Yazar Arşivi · Hakemli Dergi / Kurumsal Enstitü Değildir',
    privacy: 'Gizlilik Politikası',
    kvkk: 'KVKK (6698)',
    disclaimer: 'Sorumluluk Reddi',
    methodology: 'YZ & Telemetri Metodolojisi',
    close: 'Kapat (ESC)',
  },
  en: {
    modalTitle: 'Governance, Privacy Policy, KVKK (Law 6698), Disclaimer & Methodology',
    independentBadge: 'Independent Author Archive · Not a Peer-Reviewed Journal or Institute',
    privacy: 'Privacy Policy',
    kvkk: 'KVKK (Law 6698)',
    disclaimer: 'Scientific Disclaimer',
    methodology: 'AI & Telemetry Methodology',
    close: 'Close (ESC)',
  },
  es: {
    modalTitle: 'Gobernanza, Privacidad, KVKK, Aviso Científico y Metodología',
    independentBadge: 'Archivo Independiente de Autor · No es Revista Arbitrada',
    privacy: 'Privacidad',
    kvkk: 'KVKK (Ley 6698)',
    disclaimer: 'Aviso Legal',
    methodology: 'Metodología IA y Telemetría',
    close: 'Cerrar (ESC)',
  },
  de: {
    modalTitle: 'Governance, Datenschutz, KVKK, Wissenschaftlicher Hinweis & Methodik',
    independentBadge: 'Unabhängiges Autorenarchiv · Keine Peer-Review-Zeitschrift',
    privacy: 'Datenschutz',
    kvkk: 'KVKK (Gesetz 6698)',
    disclaimer: 'Haftungsausschluss',
    methodology: 'KI- & Telemetrie-Methodik',
    close: 'Schließen (ESC)',
  },
  fr: {
    modalTitle: 'Gouvernance, Confidentialité, KVKK, Avertissement et Méthodologie',
    independentBadge: "Archive Indépendante d'Auteur · Sans Comité de Lecture",
    privacy: 'Confidentialité',
    kvkk: 'KVKK (Loi 6698)',
    disclaimer: 'Avertissement',
    methodology: 'Méthodologie IA & Télémétrie',
    close: 'Fermer (ESC)',
  },
  ru: {
    modalTitle: 'Управление, Конфиденциальность, KVKK, Отказ от ответственности и Методология',
    independentBadge: 'Независимый авторский архив · Не рецензируемый журнал',
    privacy: 'Конфиденциальность',
    kvkk: 'KVKK (Закон 6698)',
    disclaimer: 'Отказ от ответственности',
    methodology: 'Методология ИИ и телеметрии',
    close: 'Закрыть (ESC)',
  },
  ar: {
    modalTitle: 'الحوكمة والخصوصية وKVKK وإخلاء المسؤولية والمنهجية',
    independentBadge: 'أرشيف مؤلف مستقل · ليس مجلة محكمة أو معهداً مؤسسياً',
    privacy: 'سياسة الخصوصية',
    kvkk: 'KVKK (قانون 6698)',
    disclaimer: 'إخلاء المسؤولية العلمية',
    methodology: 'منهجية الذكاء الاصطناعي والقياس',
    close: 'إغلاق (ESC)',
  },
  zh: {
    modalTitle: '治理、隐私政策、KVKK、科学免责声明与方法论',
    independentBadge: '独立作者档案 · 非同行评审期刊或机构研究所',
    privacy: '隐私政策',
    kvkk: 'KVKK (第6698号法)',
    disclaimer: '免责声明',
    methodology: 'AI 与遥测方法论',
    close: '关闭 (ESC)',
  },
  ja: {
    modalTitle: 'ガバナンス・プライバシー・KVKK・科学的免責事項・方法論',
    independentBadge: '独立著者アーカイブ · 査読付き学術誌・研究機関ではありません',
    privacy: 'プライバシー',
    kvkk: 'KVKK (法6698)',
    disclaimer: '免責事項',
    methodology: 'AI・計測方法論',
    close: '閉じる (ESC)',
  },
  pt: {
    modalTitle: 'Governança, Privacidade, KVKK, Aviso Científico e Metodologia',
    independentBadge: 'Arquivo Independente de Autor · Não é Periódico Arbitrado',
    privacy: 'Privacidade',
    kvkk: 'KVKK (Lei 6698)',
    disclaimer: 'Aviso Legal',
    methodology: 'Metodologia IA e Telemetria',
    close: 'Fechar (ESC)',
  },
  it: {
    modalTitle: 'Governance, Privacy, KVKK, Avvertenza Scientifica e Metodologia',
    independentBadge: 'Archivio Indipendente di Autore · Non è Rivista Peer-Reviewed',
    privacy: 'Privacy',
    kvkk: 'KVKK (Legge 6698)',
    disclaimer: 'Esclusione di Responsabilità',
    methodology: 'Metodologia IA e Telemetria',
    close: 'Chiudi (ESC)',
  },
  ko: {
    modalTitle: '거버넌스, 개인정보 처리방침, KVKK, 과학적 면책 조항 및 방법론',
    independentBadge: '독립 저자 아카이브 · 동료 심사 학술지 또는 기관 아님',
    privacy: '개인정보 처리방침',
    kvkk: 'KVKK (법률 제6698호)',
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
}) => {
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
                {isTurkish ? 'Gizlilik Politikası ve Veri İşleme İlkeleri' : 'Privacy Policy & Data Handling'}
              </h3>
              <p>
                {isTurkish
                  ? 'Emre Pelit — Sci-Phil Bilim, Felsefe ve Simülasyon Arşivi (emrepelit-sciphi.ai.studio), ziyaretçilerin okuma deneyimini ve etkileşim sürekliliğini korumak için yalnızca gerekli teknik verileri işler. Platformda reklam takip ağı, üçüncü taraf veri simsarlığı veya izinsiz profilleme bulunmamaktadır.'
                  : 'Emre Pelit — Sci-Phil Science, Philosophy & Simulation Archive (emrepelit-sciphi.ai.studio) processes strictly the technical state required for reading continuity and scientific simulations. No ad-tech brokers or unauthorized third-party profiling trackers are active.'}
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
                <li>
                  <strong>{isTurkish ? 'Tarayıcı Yerel Depolaması (localStorage):' : 'Browser Local Storage:'}</strong>{' '}
                  {isTurkish
                    ? 'Seçtiğiniz dil tercihi (12 dil), yer imine eklediğiniz makaleler, yazı tipi ölçeği ve oturum etkileşim sayaçları yalnızca kendi tarayıcınızda saklanır.'
                    : 'Selected language (12 languages), bookmarked articles, typography preferences, and session counters are stored locally in your browser.'}
                </li>
                <li>
                  <strong>{isTurkish ? 'Sunucu Tarafı Canlı İstatistik Senkronizasyonu:' : 'Server Telemetry Synchronization:'}</strong>{' '}
                  {isTurkish
                    ? 'Makale açılışı, simülasyon çalıştırmaları ve sesli anlatım olayları anonim kümülatif sayaçlar olarak yalnızca kendi Express sunucumuzda (/api/cloud/*) kaydedilir; kişisel IP bazlı profil tutulmaz.'
                    : 'Article opens, simulation runs, and audio events are recorded solely as aggregate counters in the first-party Express store (/api/cloud/*) without personal profiling.'}
                </li>
                <li>
                  <strong>{isTurkish ? 'İsteğe Bağlı Harici Analitik (GA4 / Cloudflare Web Analytics):' : 'Optional External Analytics (GA4 / Cloudflare Web Analytics):'}</strong>{' '}
                  {isTurkish
                    ? 'Yalnızca site sahibi tarafından Kontrol Paneli üzerinden geçerli bir Ölçüm Kimliği (G-...) veya Cloudflare Beacon Token tanımlandığında ilgili ölçüm betiği etkinleştirilir.'
                    : 'Only activated if the site owner explicitly configures a valid GA4 Measurement ID or Cloudflare Web Analytics token in the owner-locked Control Panel.'}
                </li>
                <li>
                  <strong>{isTurkish ? 'Soru & İtiraz Formu Gizliliği:' : 'Q&A / Objection Confidentiality:'}</strong>{' '}
                  {isTurkish
                    ? 'Külliyatta yanıtı bulunamayan sorular için gönüllü olarak iletilen mesajlar ve iletişim e-postası yalnızca Emre Pelit’in (emrepelit39@gmail.com) yanıt vermesi amacıyla kullanılır ve üçüncü kişilerle paylaşılmaz.'
                    : 'Voluntary questions routed when no corpus match exists are handled strictly for scholarly response by Emre Pelit (emrepelit39@gmail.com) and never shared with third parties.'}
                </li>
              </ul>
            </div>
          )}

          {activeTab === 'kvkk' && (
            <div className="space-y-3">
              <h3 className="text-xl font-editorial font-bold text-stone-900">
                {isTurkish
                  ? '6698 Sayılı Kişisel Verilerin Korunması Kanunu (KVKK) Aydınlatma Metni'
                  : 'Personal Data Protection Notice (Turkish Law No. 6698 — KVKK)'}
              </h3>
              <p className="text-xs font-mono bg-stone-100 border border-stone-300 p-3">
                {isTurkish
                  ? 'Veri Sorumlusu: Emre Pelit | E-posta: emrepelit39@gmail.com | Adres: Toroslar / Mersin, Türkiye | Resmi Alan Adı: https://emrepelit-sciphi.ai.studio'
                  : 'Data Controller: Emre Pelit | Email: emrepelit39@gmail.com | Location: Mersin, Türkiye | Canonical Domain: https://emrepelit-sciphi.ai.studio'}
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
                <li>
                  <strong>{isTurkish ? 'İşlenen Veriler ve Hukuki Sebep:' : 'Processed Data & Legal Basis:'}</strong>{' '}
                  {isTurkish
                    ? '6698 sayılı Kanun’un 5/2-(f) maddesi (meşru menfaat: güvenlik WAF koruması, DDOS önleme ve temel hizmet sürekliliği) ile 5/1 maddesi (açık rıza: Soru/İtiraz kutusundan gönüllü e-posta iletimi) kapsamında işlenir.'
                    : 'Processed under Article 5/2-(f) (legitimate interest for WAF security and service continuity) and Article 5/1 (explicit consent when submitting an inquiry via the Q&A module).'}
                </li>
                <li>
                  <strong>{isTurkish ? 'Veri Aktarımı & API Anahtarı Güvenliği:' : 'Data Transfer & API Key Isolation:'}</strong>{' '}
                  {isTurkish
                    ? 'Yapay zeka analiz ve çok dilli seslendirme istekleri istemci tarayıcıdan değil, gizli API anahtarı izolasyonuna sahip /api/* arka uç uç noktalarından yürütülür.'
                    : 'AI analysis and multilingual TTS requests run through backend /api/* routes with strict server-side key isolation.'}
                </li>
                <li>
                  <strong>{isTurkish ? '11. Madde Kapsamındaki Haklarınız:' : 'Your Rights under Article 11:'}</strong>{' '}
                  {isTurkish
                    ? 'emrepelit39@gmail.com adresine başvurarak kişisel verilerinizin işlenip işlenmediğini öğrenme, düzeltilmesini veya silinmesini talep etme hakkına sahipsiniz.'
                    : 'You may contact emrepelit39@gmail.com at any time to inquire about, rectify, or request deletion of any voluntarily submitted personal data.'}
                </li>
              </ul>
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
                    ? 'İçerik analizi, çeviri ve 12 dil seslendirme uç noktaları (gemini-4-hydrogen / gemini-3.8-flash-lite-tts yönlendirmesi ve kararlı yedek modeller) yalnızca Node.js/Express sunucu tarafındaki /api/* rotalarında çalışır. GEMINI_API_KEY hiçbir zaman istemci tarayıcıya gönderilmez.'
                    : 'AI analysis, translation, and 12-language TTS run strictly behind backend /api/* proxy endpoints. GEMINI_API_KEY is never exposed to the browser.'}
                </li>
                <li>
                  <strong>{isTurkish ? 'Ölçüm ve Aritmetik Mutabakat Şeffaflığı:' : 'Telemetry & Arithmetic Reconciliation:'}</strong>{' '}
                  {isTurkish
                    ? 'Analitik panelindeki 10 düğüm toplamı (Net Okunma, Kümülatif Görüntülenme, Okuma Süresi) ile 316+ makale dökümü ve 8 kategorilik Uygulama Etkileşim Merkezi matematiksel olarak %100 birebir eşitlenir. Açılış tarihinden (24 Nisan 2026) bu yana biriken tarihsel sunucu kayıtları üzerine bu oturumdaki canlı tıklamalar, okuma ve simülasyon etkileşimleri gerçek zamanlı eklenir; istenirse GA4 / Cloudflare Web Analytics ile paralel izlenebilir.'
                    : 'All 10-node totals, per-article breakdowns, and 8-category App Interaction counters reconcile with exact integer arithmetic. Historical archive baselines since launch (24 April 2026) combine monotonically with live session measurements and optional GA4 / Cloudflare Web Analytics.'}
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
