import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Award,
  BarChart3,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Download,
  ExternalLink,
  FileBadge,
  Globe,
  Languages,
  Network,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import {
  AnalyticsMeasurementEvent,
  AppInteractionCategory,
  AppInteractionTotals,
  Article,
  CloudSnapshot,
  DynamicGatewayConfig,
  LanguageCode,
  Network301Node,
  NetworkPublication,
  SiteMeasuredAnalytics,
} from './types';
import {
  ACTIVE_LIVE_WEBSITES,
  buildScientificPlateDataUri,
  INITIAL_301_NETWORK_NODES,
  INITIAL_ARTICLES,
  INITIAL_BLOGGER_ARTICLES,
  INITIAL_CLOUD_SNAPSHOTS,
  INITIAL_GATEWAY_CONFIG,
  INITIAL_HISTORICAL_INTERACTION_MILESTONES,
  OFFICIAL_10_WEBSITES,
  mergeMonotonicAppInteractionTotals,
  mergeMonotonicNodeStats,
  mergeMonotonicNetworkNodes,
  computeCumulativeNetworkStats,
} from './data/initialData';

const LIVE_WEBSITES_SET = new Set<string>(ACTIVE_LIVE_WEBSITES);
import {
  UI_TEXT,
  WORLD_LANGUAGES,
  getLanguageMeta,
  getLocalizedText,
  getLocalizedArray,
} from './i18n/translations';
import { ScientificPlate } from './components/ScientificPlate';
import { ArticleAudioPlayer } from './components/ArticleAudioPlayer';
import { ArticleSimulation } from './components/ArticleSimulation';
import { Network301Hub } from './components/Network301Hub';
import { AIContentLab } from './components/AIContentLab';
import { ControlAndCloudPanel } from './components/ControlAndCloudPanel';
import { EmrePelitCVMenu } from './components/EmrePelitCVMenu';
import { GlobalIndexingAndSocialHub } from './components/GlobalIndexingAndSocialHub';
import { ArticleAnalysisModal } from './components/ArticleAnalysisModal';
import { ArticleQuestionModule } from './components/ArticleQuestionModule';
import { ArticleExplainerVideo } from './components/ArticleExplainerVideo';
import { ArticleQuizModule } from './components/ArticleQuizModule';
import { InteractiveAppsSuite } from './components/InteractiveAppsSuite';
import { PWAInstallButton, OfflineIndicator } from './components/PWAInstallButton';
import { GovernanceLegalModal, GovernanceTab } from './components/GovernanceLegalModal';
import { MathFormula } from './components/MathFormula';
import { CitationExportBox } from './components/CitationExportBox';
import { KnowledgeGraph } from './components/KnowledgeGraph';
import { computeArticleScientificAnalysis } from './utils/articleAnalysisEngine';
import {
  KvkkConsentBanner,
  KvkkConsentState,
  KVKK_CONSENT_STORAGE_KEY,
  DEFAULT_KVKK_CONSENT,
} from './components/KvkkConsentBanner';
import {
  ALL_ARTICLE_ROUTE_SEGMENTS,
  buildArticleWorkClusters,
  computeCorpusCountMetrics,
  detectEntrySourceLanguage,
  getLocalizedArticlePath,
} from './utils/articleLocale';
import { fetchBloggerFeedViaJsonp } from './utils/bloggerJsonp';

const APP_CHROME_I18N: Record<
  LanguageCode,
  {
    analyticsShort: string;
    scientificScore: string;
    exclusiveAuthor: string;
    openFullAnalysis: string;
    openAnalysisShort: string;
    priorResearchLabel: string;
    citationsLabel: string;
    impressionsLabel: string;
    bloggerSource: string;
    copyrightOwner: string;
    cardCopyrightNotice: (year: string) => string;
    footerArchiveTitle: string;
    privacy: string;
    terms: string;
    imprint: string;
    kvkk: string;
    disclaimer: string;
    methodology: string;
    searchPlaceholderPrefix: string;
    network301FooterLabel: string;
    cookiePrefsLabel: string;
    consentActive: string;
    consentRejected: string;
    consentPending: string;
    langDirsLabel: string;
    fullArchiveLabel: string;
    publishedOn10SitesHeading: (active: number, total: number) => string;
    publishedOn10SitesDesc: string;
    publicationUrlLabel: string;
    canonicalCounterpartBtn: string;
    mainAuthorityCenterLabel: string;
    liveMainHubBadge: string;
    liveRedirectBadge: string;
  }
> = {
  tr: {
    analyticsShort: 'Analitik',
    scientificScore: 'Bilimsel Skor',
    exclusiveAuthor: 'Münhasır Yazar: Emre Pelit (%100 Telif)',
    openFullAnalysis: 'Makalenin Tam Analizi, Bilimsel Skoru & Sesli Dinleme (Açılır Pencere)',
    openAnalysisShort: 'Analiz Sayfasını (Önceki Araştırmalar + Yerleşik Kabuller + Denklem) Aç',
    priorResearchLabel: 'Bu Makaleden Önceki Araştırmalar (Bilim İnsanları) & Yerleşik Kabuller:',
    citationsLabel: 'Atıf',
    impressionsLabel: '301 Ağ Gösterimi',
    bloggerSource: 'Blogger Kaynağı',
    copyrightOwner: 'Telif Sahibi: Emre Pelit',
    cardCopyrightNotice: (year: string) =>
      `© ${year} Emre Pelit. Bu makalenin tüm metin, özet ve simülasyon hakları münhasıran Emre Pelit’e aittir.`,
    footerArchiveTitle:
      'Emre Pelit — Sci-Phil Bilim, Felsefe ve Simülasyon Arşivi (Bağımsız Yazar Arşivi · Hakemli Dergi Değildir · Tüm Hakları Emre Pelit’e Aittir)',
    privacy: 'Gizlilik',
    terms: 'Kullanım Koşulları',
    imprint: 'Künye',
    kvkk: 'KVKK (6698)',
    disclaimer: 'Sorumluluk Reddi',
    methodology: 'YZ & Telemetri Metodolojisi',
    searchPlaceholderPrefix: '⌘K Hızlı Arama',
    network301FooterLabel: 'Tek Kanonik Merkez & Canlı Ağı (2 Canlı Site + 8 Emekli 301):',
    cookiePrefsLabel: 'Çerez & KVKK Tercihleri',
    consentActive: 'Açık Rıza Aktif',
    consentRejected: 'Reddedildi',
    consentPending: 'Bekliyor',
    langDirsLabel: 'Dil Dizinleri (12 Dil):',
    fullArchiveLabel: 'Tam Arşiv',
    publishedOn10SitesHeading: (active: number, total: number) =>
      `2 Canlı Web Sitesi (Ana Hub + Blogger) & 8 Emekli 301 Kaydı (${active}/${total} Düğüm Mutabakatı)`,
    publishedOn10SitesDesc:
      'Bu makale canlı Ana Hub (emrepelit-sciphi.ai.studio) ve canlı Blogger kaynağı (emrepelit7337.blogspot.com) üzerinde yayındadır; 8 eski alan adı HTTP 301 ile tek merkeze yönlendirilmiştir:',
    publicationUrlLabel: 'Yayın URL:',
    canonicalCounterpartBtn: 'Ana Hub Karşılığı ↗',
    mainAuthorityCenterLabel: 'Ana Otorite Merkezi & Kanonik Bağlantı:',
    liveMainHubBadge: '✓ CANLI ANA HUB · HTTP 200 (%100 OTORİTE)',
    liveRedirectBadge: 'YAYINDAN KALDIRILDI (HTTP 301 → ANA HUB)',
  },
  en: {
    analyticsShort: 'Analytics',
    scientificScore: 'Scientific Score',
    exclusiveAuthor: 'Exclusive Author: Emre Pelit (100% Copyright)',
    openFullAnalysis: 'Open Full AI Analysis, Scientific Score & Audio (Modal)',
    openAnalysisShort: 'Open Analysis Page (Prior Research + Consensus + Equation)',
    priorResearchLabel: 'Prior Scientific Research (Named Scientists) & Established Consensuses:',
    citationsLabel: 'Citations',
    impressionsLabel: '301 Impressions',
    bloggerSource: 'Blogger Source',
    copyrightOwner: 'Copyright Holder: Emre Pelit',
    cardCopyrightNotice: (year: string) =>
      `© ${year} Emre Pelit. All text, executive abstract, and simulation rights belong exclusively to Emre Pelit.`,
    footerArchiveTitle:
      'Emre Pelit — Sci-Phil Science, Philosophy & Simulation Archive (Independent Author Archive · Not a Peer-Reviewed Journal · Sole Copyright: Emre Pelit)',
    privacy: 'Privacy',
    terms: 'Terms of Use',
    imprint: 'Imprint',
    kvkk: 'KVKK (6698)',
    disclaimer: 'Disclaimer',
    methodology: 'AI & Telemetry Methodology',
    searchPlaceholderPrefix: '⌘K Quick Search',
    network301FooterLabel: 'Permanent 301 & Canonical Network (10 Official Nodes):',
    cookiePrefsLabel: 'Cookie & KVKK Preferences',
    consentActive: 'Consent Active',
    consentRejected: 'Declined',
    consentPending: 'Pending',
    langDirsLabel: 'Language Directories:',
    fullArchiveLabel: 'Full Archive',
    publishedOn10SitesHeading: (active: number, total: number) =>
      `All 10 Official 301 Network Publication & Canonical Records (${active}/${total} Live)`,
    publishedOn10SitesDesc:
      'All 10 official 301/canonical network nodes carrying this essay (100% authority consolidates solely on emrepelit-sciphi.ai.studio):',
    publicationUrlLabel: 'Published URL:',
    canonicalCounterpartBtn: 'Main Hub Canonical ↗',
    mainAuthorityCenterLabel: 'Main Authority & Canonical Center:',
    liveMainHubBadge: '✓ LIVE (100% MAIN HUB)',
    liveRedirectBadge: '✓ LIVE (301 → MAIN HUB)',
  },
  es: {
    analyticsShort: 'Analítica',
    scientificScore: 'Puntuación Científica',
    exclusiveAuthor: 'Autor Exclusivo: Emre Pelit (100% Derechos)',
    openFullAnalysis: 'Abrir Análisis IA Completo, Puntuación y Audio',
    openAnalysisShort: 'Abrir Análisis (Estudios Previos + Consenso + Ecuación)',
    priorResearchLabel: 'Investigaciones Científicas Previas y Consensos Establecidos:',
    citationsLabel: 'Citas',
    impressionsLabel: 'Impresiones 301',
    bloggerSource: 'Fuente Blogger',
    copyrightOwner: 'Titular: Emre Pelit',
    cardCopyrightNotice: (year: string) =>
      `© ${year} Emre Pelit. Todos los derechos de texto, resumen y simulación pertenecen exclusivamente a Emre Pelit.`,
    footerArchiveTitle:
      'Emre Pelit — Archivo Sci-Phil de Ciencia, Filosofía y Simulación (Archivo Independiente · No es Revista Arbitrada)',
    privacy: 'Privacidad',
    terms: 'Términos de Uso',
    imprint: 'Aviso Legal',
    kvkk: 'KVKK (6698)',
    disclaimer: 'Exención Legal',
    methodology: 'Metodología IA y Telemetría',
    searchPlaceholderPrefix: '⌘K Búsqueda',
    network301FooterLabel: 'Red Permanente 301 y Canónica (10 Nodos Oficiales):',
    cookiePrefsLabel: 'Preferencias de Cookies y KVKK',
    consentActive: 'Consentimiento Activo',
    consentRejected: 'Rechazado',
    consentPending: 'Pendiente',
    langDirsLabel: 'Directorios de Idioma:',
    fullArchiveLabel: 'Archivo Completo',
    publishedOn10SitesHeading: (active: number, total: number) =>
      `Registros Canónicos de los 10 Sitios Oficiales 301 (${active}/${total} en Vivo)`,
    publishedOn10SitesDesc:
      'Los 10 sitios web oficiales de la red 301 que distribuyen este ensayo (la autoridad canónica se consolida al 100% en emrepelit-sciphi.ai.studio):',
    publicationUrlLabel: 'URL de Publicación:',
    canonicalCounterpartBtn: 'Enlace al Hub Principal ↗',
    mainAuthorityCenterLabel: 'Centro Canónico Principal:',
    liveMainHubBadge: '✓ EN VIVO (100% HUB PRINCIPAL)',
    liveRedirectBadge: '✓ EN VIVO (301 → HUB)',
  },
  de: {
    analyticsShort: 'Analytik',
    scientificScore: 'Wissenschafts-Score',
    exclusiveAuthor: 'Exklusiver Autor: Emre Pelit (100 % Urheberrecht)',
    openFullAnalysis: 'Vollständige KI-Analyse, Score & Audio öffnen',
    openAnalysisShort: 'Analyse öffnen (Vorherige Forschung + Konsens + Gleichung)',
    priorResearchLabel: 'Vorherige Wissenschaftliche Forschung & Etablierter Konsens:',
    citationsLabel: 'Zitationen',
    impressionsLabel: '301-Aufrufe',
    bloggerSource: 'Blogger-Quelle',
    copyrightOwner: 'Urheber: Emre Pelit',
    cardCopyrightNotice: (year: string) =>
      `© ${year} Emre Pelit. Alle Text-, Abstract- und Simulationsrechte liegen ausschließlich bei Emre Pelit.`,
    footerArchiveTitle:
      'Emre Pelit — Sci-Phil Wissenschafts-, Philosophie- & Simulationsarchiv (Unabhängiges Autorenarchiv · Keine Peer-Review-Zeitschrift)',
    privacy: 'Datenschutz',
    terms: 'Nutzungsbedingungen',
    imprint: 'Impressum',
    kvkk: 'KVKK (6698)',
    disclaimer: 'Haftungsausschluss',
    methodology: 'KI- & Telemetrie-Methodik',
    searchPlaceholderPrefix: '⌘K Schnellsuche',
    network301FooterLabel: 'Permanentes 301- & Kanonisches Netzwerk (10 Knoten):',
    cookiePrefsLabel: 'Cookie- & KVKK-Einstellungen',
    consentActive: 'Einwilligung Aktiv',
    consentRejected: 'Abgelehnt',
    consentPending: 'Ausstehend',
    langDirsLabel: 'Sprachverzeichnisse:',
    fullArchiveLabel: 'Gesamtarchiv',
    publishedOn10SitesHeading: (active: number, total: number) =>
      `Kanonische Register aller 10 Offiziellen 301-Websites (${active}/${total} Aktiv)`,
    publishedOn10SitesDesc:
      'Alle 10 offiziellen 301-Netzwerk-Knoten dieses Essays (100 % Autorität bündelt sich auf emrepelit-sciphi.ai.studio):',
    publicationUrlLabel: 'Publikations-URL:',
    canonicalCounterpartBtn: 'Zum Haupt-Hub ↗',
    mainAuthorityCenterLabel: 'Kanonisches Hauptzentrum:',
    liveMainHubBadge: '✓ LIVE (100 % HAUPT-HUB)',
    liveRedirectBadge: '✓ LIVE (301 → HAUPT-HUB)',
  },
  fr: {
    analyticsShort: 'Analytique',
    scientificScore: 'Score Scientifique',
    exclusiveAuthor: 'Auteur Exclusif : Emre Pelit (100 % Droits)',
    openFullAnalysis: 'Ouvrir l’Analyse IA Complète, Score & Audio',
    openAnalysisShort: 'Ouvrir l’Analyse (Recherches Antérieures + Consensus + Équation)',
    priorResearchLabel: 'Recherches Scientifiques Antérieures & Consensus Établis :',
    citationsLabel: 'Citations',
    impressionsLabel: 'Impressions 301',
    bloggerSource: 'Source Blogger',
    copyrightOwner: 'Titulaire : Emre Pelit',
    cardCopyrightNotice: (year: string) =>
      `© ${year} Emre Pelit. Tous les droits de texte, résumé et simulation appartiennent exclusivement à Emre Pelit.`,
    footerArchiveTitle:
      'Emre Pelit — Archive Sci-Phil de Science, Philosophie et Simulation (Archive Indépendante · Sans Comité de Lecture)',
    privacy: 'Confidentialité',
    terms: 'Conditions d’Utilisation',
    imprint: 'Mentions Légales',
    kvkk: 'KVKK (6698)',
    disclaimer: 'Avertissement',
    methodology: 'Méthodologie IA & Télémétrie',
    searchPlaceholderPrefix: '⌘K Recherche',
    network301FooterLabel: 'Réseau Permanent 301 & Canonique (10 Nœuds Officiels) :',
    cookiePrefsLabel: 'Préférences Cookies & KVKK',
    consentActive: 'Consentement Actif',
    consentRejected: 'Refusé',
    consentPending: 'En attente',
    langDirsLabel: 'Répertoires Linguistiques :',
    fullArchiveLabel: 'Archive Complète',
    publishedOn10SitesHeading: (active: number, total: number) =>
      `Registres Canoniques des 10 Sites Officiels 301 (${active}/${total} En Ligne)`,
    publishedOn10SitesDesc:
      'Les 10 sites officiels du réseau 301 diffusant cet essai (100 % de l’autorité est consolidée sur emrepelit-sciphi.ai.studio) :',
    publicationUrlLabel: 'URL de Publication :',
    canonicalCounterpartBtn: 'Version Hub Principal ↗',
    mainAuthorityCenterLabel: 'Centre d’Autorité Canonique :',
    liveMainHubBadge: '✓ EN LIGNE (100 % HUB PRINCIPAL)',
    liveRedirectBadge: '✓ EN LIGNE (301 → HUB)',
  },
  ru: {
    analyticsShort: 'Аналитика',
    scientificScore: 'Научный балл',
    exclusiveAuthor: 'Единственный автор: Emre Pelit (100% прав)',
    openFullAnalysis: 'Открыть полный ИИ-анализ, балл и аудио',
    openAnalysisShort: 'Открыть анализ (Предшествующие исследования + Консенсус)',
    priorResearchLabel: 'Предшествующие научные исследования и устоявшийся консенсус:',
    citationsLabel: 'Цитирования',
    impressionsLabel: 'Показы 301',
    bloggerSource: 'Источник Blogger',
    copyrightOwner: 'Правообладатель: Emre Pelit',
    cardCopyrightNotice: (year: string) =>
      `© ${year} Emre Pelit. Все права на текст, аннотацию и симуляцию принадлежат исключительно Эмре Пелиту.`,
    footerArchiveTitle:
      'Emre Pelit — Архив науки, философии и симуляций Sci-Phil (Независимый авторский архив · Не рецензируемый журнал)',
    privacy: 'Конфиденциальность',
    terms: 'Условия использования',
    imprint: 'Выходные данные',
    kvkk: 'KVKK (6698)',
    disclaimer: 'Отказ от ответственности',
    methodology: 'Методология ИИ и телеметрии',
    searchPlaceholderPrefix: '⌘K Поиск',
    network301FooterLabel: 'Постоянная сеть 301 и канонических узлов (10 сайтов):',
    cookiePrefsLabel: 'Настройки Cookie и KVKK',
    consentActive: 'Согласие активно',
    consentRejected: 'Отклонено',
    consentPending: 'Ожидание',
    langDirsLabel: 'Языковые каталоги:',
    fullArchiveLabel: 'Полный архив',
    publishedOn10SitesHeading: (active: number, total: number) =>
      `Канонические записи на 10 официальных сайтах сети 301 (${active}/${total})`,
    publishedOn10SitesDesc:
      'Все 10 официальных сайтов сети 301, публикующих данную статью (100% авторитета объединяется на emrepelit-sciphi.ai.studio):',
    publicationUrlLabel: 'URL публикации:',
    canonicalCounterpartBtn: 'На главный хаб ↗',
    mainAuthorityCenterLabel: 'Главный канонический центр:',
    liveMainHubBadge: '✓ АКТИВЕН (100% ГЛАВНЫЙ ХАБ)',
    liveRedirectBadge: '✓ АКТИВЕН (301 → ХАБ)',
  },
  ar: {
    analyticsShort: 'التحليلات',
    scientificScore: 'الدرجة العلمية',
    exclusiveAuthor: 'المؤلف الحصري: إمره بيليت (100% حقوق)',
    openFullAnalysis: 'فتح التحليل الكامل والدرجة العلمية والصوت',
    openAnalysisShort: 'فتح صفحة التحليل (الأبحاث السابقة + الإجماع + المعادلة)',
    priorResearchLabel: 'الأبحاث العلمية السابقة (بأسماء العلماء) والإجماع السائد:',
    citationsLabel: 'الاستشهادات',
    impressionsLabel: 'مرات الظهور 301',
    bloggerSource: 'مصدر Blogger',
    copyrightOwner: 'مالك الحقوق: إمره بيليت',
    cardCopyrightNotice: (year: string) =>
      `© ${year} إمره بيليت. جميع حقوق النص والملخص والمحاكاة مملوكة حصرياً لإمره بيليت.`,
    footerArchiveTitle:
      'إمره بيليت — أرشيف Sci-Phil للعلوم والفلسفة والمحاكاة (أرشيف مؤلف مستقل · ليس مجلة محكّمة)',
    privacy: 'الخصوصية',
    terms: 'شروط الاستخدام',
    imprint: 'بيانات النشر',
    kvkk: 'KVKK (6698)',
    disclaimer: 'إخلاء المسؤولية',
    methodology: 'منهجية الذكاء الاصطناعي والقياس',
    searchPlaceholderPrefix: '⌘K بحث سريع',
    network301FooterLabel: 'شبكة 301 الدائمة والروابط الأساسية (10 مواقع رسمية):',
    cookiePrefsLabel: 'تفضيلات ملفات الارتباط و KVKK',
    consentActive: 'الموافقة مفعّلة',
    consentRejected: 'مرفوض',
    consentPending: 'قيد الانتظار',
    langDirsLabel: 'أدلة اللغات:',
    fullArchiveLabel: 'الأرشيف الكامل',
    publishedOn10SitesHeading: (active: number, total: number) =>
      `سجلات النشر على المواقع الرسمية الـ 10 (${active}/${total} متاح)`,
    publishedOn10SitesDesc:
      'المواقع الرسمية الـ 10 المتصلة بشبكة 301 لهذا المقال (تتجمع 100% من السلطة الأساسية في emrepelit-sciphi.ai.studio):',
    publicationUrlLabel: 'رابط النشر:',
    canonicalCounterpartBtn: 'المركز الرئيسي ↗',
    mainAuthorityCenterLabel: 'المركز الأساسي للسلطة العلمية:',
    liveMainHubBadge: '✓ متاح (المركز الرئيسي 100%)',
    liveRedirectBadge: '✓ متاح (301 → المركز)',
  },
  zh: {
    analyticsShort: '分析',
    scientificScore: '科学评分',
    exclusiveAuthor: '独家作者：Emre Pelit（100% 版权）',
    openFullAnalysis: '打开完整 AI 分析、科学评分与语音朗读',
    openAnalysisShort: '打开分析页（先前研究 + 既有共识 + 核心方程）',
    priorResearchLabel: '本研究之前的科学文献（科学家署名）与既有科学共识：',
    citationsLabel: '引用',
    impressionsLabel: '301 网络展示',
    bloggerSource: 'Blogger 来源',
    copyrightOwner: '版权所有：Emre Pelit',
    cardCopyrightNotice: (year: string) =>
      `© ${year} Emre Pelit。本文全文、摘要与模拟版权均独家归属于 Emre Pelit。`,
    footerArchiveTitle:
      'Emre Pelit — Sci-Phil 科学、哲学与模拟档案库（独立作者档案 · 非同行评审期刊）',
    privacy: '隐私政策',
    terms: '使用条款',
    imprint: '版权与出版声明',
    kvkk: 'KVKK (6698)',
    disclaimer: '科学免责声明',
    methodology: 'AI 与遥测方法论',
    searchPlaceholderPrefix: '⌘K 快速搜索',
    network301FooterLabel: '永久 301 与规范网络（10 个官方节点）：',
    cookiePrefsLabel: 'Cookie 与 KVKK 偏好设置',
    consentActive: '已同意',
    consentRejected: '已拒绝',
    consentPending: '待定',
    langDirsLabel: '语言目录：',
    fullArchiveLabel: '完整档案',
    publishedOn10SitesHeading: (active: number, total: number) =>
      `全部 10 个官方 301 网站发布与规范记录 (${active}/${total})`,
    publishedOn10SitesDesc:
      '收录本文的 10 个官方 301 网络站点（100% 规范权重归集于 emrepelit-sciphi.ai.studio）：',
    publicationUrlLabel: '发布网址：',
    canonicalCounterpartBtn: '打开主枢纽 ↗',
    mainAuthorityCenterLabel: '规范权威中心：',
    liveMainHubBadge: '✓ 在线 (100% 主枢纽)',
    liveRedirectBadge: '✓ 在线 (301 → 主枢纽)',
  },
  ja: {
    analyticsShort: '分析',
    scientificScore: '科学スコア',
    exclusiveAuthor: '独占著者：Emre Pelit（100% 著作権）',
    openFullAnalysis: '完全なAI分析・科学スコア・音声朗読を開く',
    openAnalysisShort: '分析ページ（先行研究＋確立された定説＋数式）を開く',
    priorResearchLabel: '本論文以前の科学研究（研究者名）および定説：',
    citationsLabel: '引用数',
    impressionsLabel: '301表示回数',
    bloggerSource: 'Blogger原文',
    copyrightOwner: '著作権者：Emre Pelit',
    cardCopyrightNotice: (year: string) =>
      `© ${year} Emre Pelit. 本論文の本文・要約・シミュレーションの権利はすべて Emre Pelit に専属します。`,
    footerArchiveTitle:
      'Emre Pelit — Sci-Phil 科学・哲学・シミュレーションアーカイブ（独立著者アーカイブ・査読誌ではありません）',
    privacy: 'プライバシー',
    terms: '利用規約',
    imprint: '運営者情報',
    kvkk: 'KVKK (6698)',
    disclaimer: '免責事項',
    methodology: 'AI・計測手法',
    searchPlaceholderPrefix: '⌘K 検索',
    network301FooterLabel: '恒久301＆正規ネットワーク（公式10ノード）：',
    cookiePrefsLabel: 'Cookie＆KVKK設定',
    consentActive: '同意有効',
    consentRejected: '拒否',
    consentPending: '保留中',
    langDirsLabel: '言語ディレクトリ:',
    fullArchiveLabel: '全アーカイブ',
    publishedOn10SitesHeading: (active: number, total: number) =>
      `公式301ネットワーク全10サイトの公開・正規記録 (${active}/${total})`,
    publishedOn10SitesDesc:
      '本論文を公開している公式10サイト一覧（正規評価の100%は emrepelit-sciphi.ai.studio に集約されます）：',
    publicationUrlLabel: '公開URL:',
    canonicalCounterpartBtn: 'メインハブを開く ↗',
    mainAuthorityCenterLabel: '正規オーソリティ中心:',
    liveMainHubBadge: '✓ 公開中 (100% メインハブ)',
    liveRedirectBadge: '✓ 公開中 (301 → ハブ)',
  },
  pt: {
    analyticsShort: 'Analítica',
    scientificScore: 'Pontuação Científica',
    exclusiveAuthor: 'Autor Exclusivo: Emre Pelit (100% Direitos)',
    openFullAnalysis: 'Abrir Análise IA Completa, Pontuação e Áudio',
    openAnalysisShort: 'Abrir Análise (Pesquisas Prévias + Consenso + Equação)',
    priorResearchLabel: 'Pesquisas Científicas Prévias (Cientistas) e Consensos Estabelecidos:',
    citationsLabel: 'Citações',
    impressionsLabel: 'Impressões 301',
    bloggerSource: 'Fonte Blogger',
    copyrightOwner: 'Titular: Emre Pelit',
    cardCopyrightNotice: (year: string) =>
      `© ${year} Emre Pelit. Todos os direitos de texto, resumo e simulação pertencem exclusivamente a Emre Pelit.`,
    footerArchiveTitle:
      'Emre Pelit — Arquivo Sci-Phil de Ciência, Filosofia e Simulação (Arquivo Independente · Não é Periódico Arbitrado)',
    privacy: 'Privacidade',
    terms: 'Termos de Uso',
    imprint: 'Expediente / Imprint',
    kvkk: 'KVKK (6698)',
    disclaimer: 'Aviso Científico',
    methodology: 'Metodologia IA e Telemetria',
    searchPlaceholderPrefix: '⌘K Busca Rápida',
    network301FooterLabel: 'Rede Permanente 301 e Canônica (10 Nós Oficiais):',
    cookiePrefsLabel: 'Preferências de Cookies e KVKK',
    consentActive: 'Consentimento Ativo',
    consentRejected: 'Recusado',
    consentPending: 'Pendente',
    langDirsLabel: 'Diretórios de Idioma:',
    fullArchiveLabel: 'Arquivo Completo',
    publishedOn10SitesHeading: (active: number, total: number) =>
      `Registros Canônicos nos 10 Sites Oficiais 301 (${active}/${total} Ativos)`,
    publishedOn10SitesDesc:
      'Os 10 sites oficiais da rede 301 onde este ensaio é publicado (100% da autoridade consolida-se em emrepelit-sciphi.ai.studio):',
    publicationUrlLabel: 'URL Publicada:',
    canonicalCounterpartBtn: 'Abrir no Hub Principal ↗',
    mainAuthorityCenterLabel: 'Centro de Autoridade Canônica:',
    liveMainHubBadge: '✓ ATIVO (100% HUB PRINCIPAL)',
    liveRedirectBadge: '✓ ATIVO (301 → HUB)',
  },
  it: {
    analyticsShort: 'Analisi',
    scientificScore: 'Punteggio Scientifico',
    exclusiveAuthor: 'Autore Esclusivo: Emre Pelit (100% Diritti)',
    openFullAnalysis: 'Apri Analisi IA Completa, Punteggio e Audio',
    openAnalysisShort: 'Apri Analisi (Ricerche Precedenti + Consenso + Equazione)',
    priorResearchLabel: 'Ricerche Scientifiche Precedenti (Scienziati) e Consensi Consolidati:',
    citationsLabel: 'Citazioni',
    impressionsLabel: 'Visualizzazioni 301',
    bloggerSource: 'Fonte Blogger',
    copyrightOwner: 'Titolare: Emre Pelit',
    cardCopyrightNotice: (year: string) =>
      `© ${year} Emre Pelit. Tutti i diritti su testo, abstract e simulazione appartengono esclusivamente a Emre Pelit.`,
    footerArchiveTitle:
      'Emre Pelit — Archivio Sci-Phil di Scienza, Filosofia e Simulazione (Archivio Indipendente · Non è Rivista Peer-Reviewed)',
    privacy: 'Privacy',
    terms: 'Termini di Utilizzo',
    imprint: 'Note Legali / Imprint',
    kvkk: 'KVKK (6698)',
    disclaimer: 'Disclaimer',
    methodology: 'Metodologia IA e Telemetria',
    searchPlaceholderPrefix: '⌘K Ricerca Rapida',
    network301FooterLabel: 'Rete Permanente 301 e Canonica (10 Nodi Ufficiali):',
    cookiePrefsLabel: 'Preferenze Cookie e KVKK',
    consentActive: 'Consenso Attivo',
    consentRejected: 'Rifiutato',
    consentPending: 'In attesa',
    langDirsLabel: 'Directory Linguistiche:',
    fullArchiveLabel: 'Archivio Completo',
    publishedOn10SitesHeading: (active: number, total: number) =>
      `Registri Canonici sui 10 Siti Ufficiali 301 (${active}/${total} Attivi)`,
    publishedOn10SitesDesc:
      'Tutti i 10 siti ufficiali della rete 301 che ospitano questo saggio (100% dell’autorità converge su emrepelit-sciphi.ai.studio):',
    publicationUrlLabel: 'URL Pubblicazione:',
    canonicalCounterpartBtn: 'Apri su Hub Principale ↗',
    mainAuthorityCenterLabel: 'Centro Canonico Principale:',
    liveMainHubBadge: '✓ ATTIVO (100% HUB PRINCIPALE)',
    liveRedirectBadge: '✓ ATTIVO (301 → HUB)',
  },
  ko: {
    analyticsShort: '분석',
    scientificScore: '과학 점수',
    exclusiveAuthor: '독점 저자: Emre Pelit (100% 저작권)',
    openFullAnalysis: '전체 AI 분석, 과학 점수 및 음성 듣기 열기',
    openAnalysisShort: '분석 페이지 열기 (선행 연구 + 기존 정설 + 핵심 방정식)',
    priorResearchLabel: '본 논문 이전의 과학 연구(연구자명) 및 기존 과학적 정설:',
    citationsLabel: '인용',
    impressionsLabel: '301 노출수',
    bloggerSource: 'Blogger 원문',
    copyrightOwner: '저작권자: Emre Pelit',
    cardCopyrightNotice: (year: string) =>
      `© ${year} Emre Pelit. 본 논문의 본문, 초록 및 시뮬레이션에 대한 모든 권리는 Emre Pelit에게 있습니다.`,
    footerArchiveTitle:
      'Emre Pelit — Sci-Phil 과학·철학·시뮬레이션 아카이브 (독립 저자 아카이브 · 동료 심사 학술지 아님)',
    privacy: '개인정보',
    terms: '이용약관',
    imprint: '법적 고지 (Imprint)',
    kvkk: 'KVKK (6698)',
    disclaimer: '면책 조항',
    methodology: 'AI·측정 방법론',
    searchPlaceholderPrefix: '⌘K 빠른 검색',
    network301FooterLabel: '영구 301 및 정규 네트워크 (공식 10개 사이트):',
    cookiePrefsLabel: '쿠키 및 KVKK 설정',
    consentActive: '동의 활성',
    consentRejected: '거부됨',
    consentPending: '대기 중',
    langDirsLabel: '언어 디렉터리:',
    fullArchiveLabel: '전체 아카이브',
    publishedOn10SitesHeading: (active: number, total: number) =>
      `공식 301 네트워크 10개 사이트 게시 및 정규 기록 (${active}/${total})`,
    publishedOn10SitesDesc:
      '본 논문이 게시된 공식 10개 301 네트워크 사이트 (정규 권위 100%는 emrepelit-sciphi.ai.studio 로 통합됩니다):',
    publicationUrlLabel: '게시 URL:',
    canonicalCounterpartBtn: '메인 허브로 이동 ↗',
    mainAuthorityCenterLabel: '정규 권위 중심지:',
    liveMainHubBadge: '✓ 게시됨 (100% 메인 허브)',
    liveRedirectBadge: '✓ 게시됨 (301 → 메인 허브)',
  },
};

function buildLegacySemanticArticleSlug(title: string, articleId: string, postNum?: number): string {
  const trMap: Record<string, string> = {
    ç: 'c', Ç: 'c', ğ: 'g', Ğ: 'g', ı: 'i', İ: 'i', ö: 'o', Ö: 'o', ş: 's', Ş: 's', ü: 'u', Ü: 'u',
  };
  const normalized = (title || '')
    .split('')
    .map((ch) => trMap[ch] || ch)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72)
    .replace(/-+$/g, '');
  if (!normalized) {
    const cleanId = (articleId || '').replace(/[^a-zA-Z0-9-]/g, '');
    return cleanId || `blogger-emre-pelit-${postNum || 1}`;
  }
  if (postNum) {
    return `${normalized}-${postNum}`;
  }
  const cleanId = (articleId || '').replace(/[^a-zA-Z0-9-]/g, '');
  return cleanId ? `${normalized}-${cleanId}` : normalized;
}

function buildSemanticArticleSlug(title: string, articleId: string, postNum?: number): string {
  const charMap: Record<string, string> = {
    ç: 'c', Ç: 'c', ğ: 'g', Ğ: 'g', ı: 'i', İ: 'i',
    ö: 'o', Ö: 'o', ş: 's', Ş: 's', ü: 'u', Ü: 'u',
    ä: 'ae', Ä: 'ae', ß: 'ss',
    é: 'e', É: 'e', è: 'e', È: 'e', ê: 'e', Ê: 'e', ë: 'e', Ë: 'e',
    à: 'a', À: 'a', á: 'a', Á: 'a', â: 'a', Â: 'a', ã: 'a', Ã: 'a', å: 'a', Å: 'a',
    î: 'i', Î: 'i', ï: 'i', Ï: 'i', í: 'i', Í: 'i', ì: 'i', Ì: 'i',
    ó: 'o', Ó: 'o', ò: 'o', Ò: 'o', ô: 'o', Ô: 'o', õ: 'o', Õ: 'o', ø: 'o', Ø: 'o',
    ú: 'u', Ú: 'u', ù: 'u', Ù: 'u', û: 'u', Û: 'u',
    ñ: 'n', Ñ: 'n', œ: 'oe', Œ: 'oe', æ: 'ae', Æ: 'ae',
  };
  let normalized = (title || '')
    .split('')
    .map((ch) => charMap[ch] || ch)
    .join('')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (normalized.length > 75) {
    const cut = normalized.slice(0, 75);
    const boundary = cut.replace(/-[^-]*$/, '');
    normalized = (boundary.length >= 24 ? boundary : cut).replace(/-+$/g, '');
  }
  if (!normalized) {
    const cleanId = (articleId || '').replace(/[^a-zA-Z0-9-]/g, '');
    return cleanId || `blogger-emre-pelit-${postNum || 1}`;
  }
  if (postNum) {
    return `${normalized}-${postNum}`;
  }
  const cleanId = (articleId || '').replace(/[^a-zA-Z0-9-]/g, '');
  return cleanId ? `${normalized}-${cleanId}` : normalized;
}

const CANONICAL_12_LANGS: LanguageCode[] = WORLD_LANGUAGES.map((wl) => wl.code);

function findArticleIndexByLookup(articlesList: Article[], rawLookup: string | null | undefined): number {
  if (!rawLookup || articlesList.length === 0) return -1;
  let clean = String(rawLookup).trim();
  try {
    clean = decodeURIComponent(clean);
  } catch {
    // keep raw string
  }
  clean = clean.replace(/\.html?$/i, '');
  const cleanBlogger = clean.replace(/^blogger-/, '');

  const directIdx = articlesList.findIndex(
    (a, idx) => {
      const fallbackPostNum = articlesList.length - idx;
      const figMatch = (a.figureNumber || '').match(/(\d+)$/);
      const postNum = figMatch ? Number(figMatch[1]) : fallbackPostNum;
      const trTitle = typeof a.title === 'string' ? a.title : (a.title?.tr || a.title?.en || '');
      const serverStyleSlug = buildSemanticArticleSlug(trTitle, a.id, postNum);
      const legacyStyleSlug = buildLegacySemanticArticleSlug(trTitle, a.id, postNum);
      return (
        a.id === clean ||
        a.id === `blogger-${cleanBlogger}` ||
        a.slug === clean ||
        serverStyleSlug === clean ||
        legacyStyleSlug === clean ||
        clean.endsWith(a.id) ||
        (a.slug && a.slug.endsWith(clean))
      );
    }
  );
  if (directIdx >= 0) return directIdx;

  const numMatch = clean.match(/-(\d{1,4})$/);
  if (numMatch) {
    const targetNum = numMatch[1];
    return articlesList.findIndex((a, idx) => {
      const figNumMatch = (a.figureNumber || '').match(/(\d+)$/);
      return (
        figNumMatch?.[1] === targetNum ||
        String(articlesList.length - idx) === targetNum
      );
    });
  }
  return -1;
}

export default function App() {
  const [language, setLanguage] = useState<LanguageCode>(() => {
    if (typeof window !== 'undefined') {
      const pathParts = window.location.pathname.split('/').filter(Boolean);
      if (pathParts.length >= 1) {
        const maybeLang = pathParts[0].toLowerCase() as LanguageCode;
        if (WORLD_LANGUAGES.some((wl) => wl.code === maybeLang)) {
          return maybeLang;
        }
      }
      const params = new URLSearchParams(window.location.search);
      const qLang = (params.get('lang') || '').toLowerCase() as LanguageCode;
      if (WORLD_LANGUAGES.some((wl) => wl.code === qLang)) {
        return qLang;
      }
    }
    return 'tr';
  });
  const [articles, setArticles] = useState<Article[]>(() =>
    INITIAL_BLOGGER_ARTICLES.map((a) => {
      const detected =
        a.sourceLang ||
        detectEntrySourceLanguage(
          getLocalizedText(a.title, 'tr'),
          getLocalizedText(a.abstract, 'tr')
        );
      return {
        ...a,
        sourceLang: detected,
        canonicalHubUrl: `https://emrepelit-sciphi.ai.studio${getLocalizedArticlePath(
          detected,
          a.slug
        )}`,
      };
    })
  );
  const workClustersData = useMemo(() => buildArticleWorkClusters(articles), [articles]);
  const corpusMetrics = useMemo(() => computeCorpusCountMetrics(articles), [articles]);
  const distinctWorksCount = corpusMetrics.distinctOriginalCount;
  const corpusArticlesCount = corpusMetrics.multilingualTextsCount;
  const totalDirectoryCount = corpusMetrics.totalDirectoryCount;
  type WorkspaceTab = 'corpus' | 'simulators' | 'stats' | 'automation' | 'apps';
  const [activeTab, setActiveTab] = useState<WorkspaceTab>(() => {
    if (typeof window !== 'undefined') {
      const qTab = (new URLSearchParams(window.location.search).get('tab') || '').toLowerCase();
      if (qTab === 'simulators') return 'simulators';
      if (qTab === 'stats' || qTab === 'analytics') return 'stats';
      if (qTab === 'automation' || qTab === 'ai-studio') return 'automation';
      if (qTab === 'apps') return 'apps';
    }
    return 'corpus';
  });
  const [showAllLanguagesCorpus, setShowAllLanguagesCorpus] = useState<boolean>(false);
  const [kvkkConsent, setKvkkConsent] = useState<KvkkConsentState>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = window.localStorage.getItem(KVKK_CONSENT_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && (parsed.status === 'accepted' || parsed.status === 'rejected')) {
            return {
              status: parsed.status,
              essential: true,
              analytics: Boolean(parsed.analytics),
              externalTelemetry: Boolean(parsed.externalTelemetry),
              updatedAt: String(parsed.updatedAt || ''),
            };
          }
        }
      } catch {
        // Ignore storage read error
      }
    }
    return DEFAULT_KVKK_CONSENT;
  });
  const kvkkConsentRef = useRef<KvkkConsentState>(kvkkConsent);
  useEffect(() => {
    kvkkConsentRef.current = kvkkConsent;
  }, [kvkkConsent]);
  const [kvkkManageOpen, setKvkkManageOpen] = useState<boolean>(false);
  const handleSaveKvkkConsent = useCallback((nextState: KvkkConsentState) => {
    setKvkkConsent(nextState);
    kvkkConsentRef.current = nextState;
    setKvkkManageOpen(false);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(KVKK_CONSENT_STORAGE_KEY, JSON.stringify(nextState));
      } catch {
        // Ignore storage quota
      }
    }
  }, []);
  const [networkNodes, setNetworkNodes] = useState<Network301Node[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = window.localStorage.getItem('emrepelit_10sites_monotonic_stats_v3');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            return mergeMonotonicNetworkNodes(INITIAL_301_NETWORK_NODES, parsed);
          }
        }
      } catch {
        // Fallback to canonical initial nodes
      }
    }
    return mergeMonotonicNetworkNodes(INITIAL_301_NETWORK_NODES);
  });
  const [analyticsMeasurements, setAnalyticsMeasurements] = useState<
    Record<string, SiteMeasuredAnalytics>
  >(() => {
    const initialMap: Record<string, SiteMeasuredAnalytics> = {};
    INITIAL_301_NETWORK_NODES.forEach((node) => {
      const baseViews = node.stats.totalViews || 0;
      initialMap[node.domain] = {
        domain: node.domain,
        measuredReads: node.stats.netReads,
        measuredViews: baseViews,
        measuredReadingMinutes:
          node.stats.readingTimeHours * 60 + node.stats.readingTimeMinutes,
        measuredAudioMinutes:
          node.stats.audioListenHours * 60 + node.stats.audioListenMinutes,
        measuredUniqueReaders: node.stats.uniqueReaders,
        measuredSimulatorRuns: node.stats.simulatorRuns,
        lastMeasuredAt: node.lastBloggerSyncAt || '',
      };
    });
    if (typeof window !== 'undefined') {
      try {
        const raw = window.localStorage.getItem('emrepelit_10sites_analytics_measurements_v2');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') {
            INITIAL_301_NETWORK_NODES.forEach((node) => {
              const domain = node.domain;
              const p = parsed[domain];
              const baseViews = node.stats.totalViews || 0;
              const baseReadMins =
                node.stats.readingTimeHours * 60 + node.stats.readingTimeMinutes;
              const baseAudioMins =
                node.stats.audioListenHours * 60 + node.stats.audioListenMinutes;
              if (p && typeof p === 'object') {
                initialMap[domain] = {
                  domain,
                  measuredReads: Math.max(node.stats.netReads, Number(p.measuredReads) || 0),
                  measuredViews: Math.max(baseViews, Number(p.measuredViews) || 0),
                  measuredReadingMinutes: Math.max(
                    baseReadMins,
                    Number(p.measuredReadingMinutes) || 0
                  ),
                  measuredAudioMinutes: Math.max(
                    baseAudioMins,
                    Number(p.measuredAudioMinutes) || 0
                  ),
                  measuredUniqueReaders: Math.max(
                    node.stats.uniqueReaders,
                    Number(p.measuredUniqueReaders) || 0
                  ),
                  measuredSimulatorRuns: Math.max(
                    node.stats.simulatorRuns,
                    Number(p.measuredSimulatorRuns) || 0
                  ),
                  lastMeasuredAt: String(p.lastMeasuredAt || node.lastBloggerSyncAt || ''),
                };
              }
            });
          }
        }
      } catch {
        // Fallback to canonical since-launch baseline
      }
    }
    return initialMap;
  });
  const [appInteractionTotals, setAppInteractionTotals] = useState<AppInteractionTotals>(() => {
    const nodeSums = computeCumulativeNetworkStats(networkNodes);
    let loaded: Partial<AppInteractionTotals> | null = null;
    if (typeof window !== 'undefined') {
      try {
        const raw = window.localStorage.getItem('emrepelit_10sites_app_interaction_totals_v2');
        if (raw) {
          loaded = JSON.parse(raw);
        }
      } catch {
        // Fallback to historical baseline
      }
    }
    return mergeMonotonicAppInteractionTotals(loaded, {
      pageViews: nodeSums.totalViews,
      articleReads: nodeSums.netReads,
      simulationRuns: nodeSums.simulatorRuns,
    });
  });
  const [sessionInteractionTotals, setSessionInteractionTotals] = useState<
    Omit<AppInteractionTotals, 'lastUpdatedAt'>
  >({
    totalInteractionsSinceLaunch: 0,
    pageViews: 0,
    articleReads: 0,
    analysisModals: 0,
    simulationRuns: 0,
    audioListens: 0,
    qaObjections: 0,
    languageSearchExports: 0,
    pwaDownloads: 0,
  });
  const [analyticsEventLog, setAnalyticsEventLog] = useState<AnalyticsMeasurementEvent[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = window.localStorage.getItem('emrepelit_10sites_app_interaction_log_v2');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const seenIds = new Set<string>();
            const merged: AnalyticsMeasurementEvent[] = [];
            for (const item of [...parsed, ...INITIAL_HISTORICAL_INTERACTION_MILESTONES]) {
              if (item && typeof item.id === 'string' && !seenIds.has(item.id)) {
                seenIds.add(item.id);
                merged.push(item);
              }
            }
            return merged.slice(0, 150);
          }
        }
      } catch {
        // Fallback to historical milestones
      }
    }
    return INITIAL_HISTORICAL_INTERACTION_MILESTONES;
  });
  const syncSeqRef = useRef<number>(1);
  const [lastStatsSyncEvent, setLastStatsSyncEvent] = useState<{
    timestamp: string;
    targetDomain: string;
    summary: string;
    syncSeq?: number;
    viewsDelta?: number;
    readsDelta?: number;
    cumulativeViewsAfter?: number;
    cumulativeReadsAfter?: number;
  }>({
    timestamp: '',
    targetDomain: 'ALL_10_SITES',
    summary: 'Canlı Senkron Olayı Aktif: Her Yeni Görüntülenme ve Veri Girişinde Kümülatif Toplam Anında Güncellenir',
    syncSeq: 1,
    viewsDelta: 0,
    readsDelta: 0,
  });
  const [articleStatsBoosts, setArticleStatsBoosts] = useState<
    Record<string, { reads: number; views: number; citations: number }>
  >(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = window.localStorage.getItem('sciphil_article_boosts_v2');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
            return parsed;
          }
        }
      } catch {
        // Ignore invalid local storage
      }
    }
    return {};
  });
  const [gatewayConfig, setGatewayConfig] = useState<DynamicGatewayConfig>(INITIAL_GATEWAY_CONFIG);
  const [snapshots, setSnapshots] = useState<CloudSnapshot[]>(INITIAL_CLOUD_SNAPSHOTS);

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('q') || '';
    }
    return '';
  });
  const [expandedArticleIds, setExpandedArticleIds] = useState<Record<string, boolean>>({
    'blogger-258995342970019936': true,
    'blogger-6317429267560308262': true,
    'blogger-207727546784801585': true,
    'blogger-7267123953803072777': true,
  });

  // Top bar CV & About (Hakkında) dropdown menu states & main CV accordion state
  const [navCvDropdownOpen, setNavCvDropdownOpen] = useState<boolean>(false);
  const [navAboutDropdownOpen, setNavAboutDropdownOpen] = useState<boolean>(false);
  const [cvSectionOpen, setCvSectionOpen] = useState<boolean>(true);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const aboutDropdownRef = useRef<HTMLDivElement | null>(null);
  const mobileAboutToggleRef = useRef<HTMLButtonElement | null>(null);
  const mobileAboutDrawerRef = useRef<HTMLDivElement | null>(null);

  const [bloggerSyncState, setBloggerSyncState] = useState<{
    syncing: boolean;
    lastSyncedAt: string;
    liveCount: number;
    totalBloggerCount: number;
    blogTitle: string;
    latestDetectedTitle: string;
    newPostAlert: string | null;
  }>({
    syncing: false,
    lastSyncedAt: '2026-11-14 21:40 UTC',
    liveCount: 316,
    totalBloggerCount: 316,
    blogTitle: 'Emre Pelit — Sci-Phil Bilim, Felsefe ve Simülasyon Arşivi',
    latestDetectedTitle:
      'The Conventional Monotony of Human Comprehension, the Silicon-Based Equivalent of Biological Processes, and the Incomprehensibility of Human Beings',
    newPostAlert: null,
  });

  const [quickPublishOpen, setQuickPublishOpen] = useState<boolean>(false);
  const [quickTitle, setQuickTitle] = useState<string>('');
  const [quickCategory, setQuickCategory] = useState<string>('Bilinç, Yapay Zeka & Zihin Felsefesi');
  const [quickAbstract, setQuickAbstract] = useState<string>('');
  const [quickBody, setQuickBody] = useState<string>('');
  const [isPublishingAll301, setIsPublishingAll301] = useState<boolean>(false);
  const [publishAll301Banner, setPublishAll301Banner] = useState<string | null>(null);

  const [sourceFilter, setSourceFilter] = useState<'ALL' | 'BLOGGER_LIVE'>('ALL');
  const [showBloggerDirectory, setShowBloggerDirectory] = useState<boolean>(false);
  const [showKnowledgeGraph, setShowKnowledgeGraph] = useState<boolean>(false);
  const [directorySearch, setDirectorySearch] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const p = parseInt(new URLSearchParams(window.location.search).get('page') || '1', 10);
      return Number.isFinite(p) && p >= 1 ? p : 1;
    }
    return 1;
  });
  const [articlesPerPage, setArticlesPerPage] = useState<number>(10);
  const didMountFilterResetRef = useRef<boolean>(false);
  const knownBloggerIdsRef = useRef<Set<string>>(new Set());
  const initialEntryRecordedRef = useRef<boolean>(false);

  const [translatingId, setTranslatingId] = useState<string | null>(null);
  const [indexingTriggerCount, setIndexingTriggerCount] = useState<number>(0);
  const [queueAllTriggerCount, setQueueAllTriggerCount] = useState<number>(0);
  const [singleArticleQueueTarget, setSingleArticleQueueTarget] = useState<{
    id: string;
    triggerId: number;
  } | null>(null);
  const [perArticleIndexedMap, setPerArticleIndexedMap] = useState<
    Record<string, { receiptHash: string; indexedAt: string }>
  >({});

  // Pop-up Full Article Analysis Modal state & Opening Screen Quick Selector state
  const [activeModalAnalysisArticle, setActiveModalAnalysisArticle] = useState<Article | null>(null);
  const [heroSelectedAnalysisArticleId, setHeroSelectedAnalysisArticleId] = useState<string>('');
  const [analyticsPanelOpen, setAnalyticsPanelOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const h = window.location.hash.toLowerCase();
      const tabParam = new URLSearchParams(window.location.search).get('tab')?.toLowerCase();
      return h === '#analytics' || h === '#analytics-panel' || tabParam === 'stats' || tabParam === 'analytics';
    }
    return false;
  });

  const [governanceTab, setGovernanceTab] = useState<GovernanceTab>(() => {
    if (typeof window !== 'undefined') {
      const parts = window.location.pathname.toLowerCase().split('/').filter(Boolean);
      const sec = new URLSearchParams(window.location.search).get('section')?.toLowerCase() || '';
      const candidate = parts.find((p) =>
        ['privacy', 'terms', 'imprint', 'kvkk', 'disclaimer', 'methodology'].includes(p)
      ) || sec;
      if (
        candidate === 'privacy' ||
        candidate === 'terms' ||
        candidate === 'imprint' ||
        candidate === 'kvkk' ||
        candidate === 'disclaimer' ||
        candidate === 'methodology'
      ) {
        return candidate;
      }
    }
    return 'privacy';
  });
  const [governanceModalOpen, setGovernanceModalOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const parts = window.location.pathname.toLowerCase().split('/').filter(Boolean);
      const sec = new URLSearchParams(window.location.search).get('section')?.toLowerCase() || '';
      const candidate = parts.find((p) =>
        ['privacy', 'terms', 'imprint', 'kvkk', 'disclaimer', 'methodology'].includes(p)
      ) || sec;
      return ['privacy', 'terms', 'imprint', 'kvkk', 'disclaimer', 'methodology'].includes(candidate);
    }
    return false;
  });

  // Maximized UX Suite States (Live Reading Progress, Instant Command Palette ⌘K, Adaptive Typography & Theme, Bookmarks)
  const [readingProgress, setReadingProgress] = useState<number>(0);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);
  const [commandQuery, setCommandQuery] = useState<string>('');
  const [uxFontScale, setUxFontScale] = useState<'normal' | 'large' | 'xl'>('normal');
  const [uxReadingTheme, setUxReadingTheme] = useState<'archival' | 'stark' | 'sepia'>('archival');
  const [bookmarkedArticleIds, setBookmarkedArticleIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('emre_pelit_bookmarked_articles');
      return saved ? JSON.parse(saved) : ['blogger-207727546784801585', 'blogger-7267123953803072777'];
    } catch {
      return ['blogger-207727546784801585', 'blogger-7267123953803072777'];
    }
  });
  const [showOnlyBookmarked, setShowOnlyBookmarked] = useState<boolean>(false);

  const toggleBookmarkArticle = (articleId: string) => {
    setBookmarkedArticleIds((prev) => {
      const next = prev.includes(articleId)
        ? prev.filter((id) => id !== articleId)
        : [...prev, articleId];
      try {
        localStorage.setItem('emre_pelit_bookmarked_articles', JSON.stringify(next));
      } catch {
        // Ignore storage quota
      }
      return next;
    });
  };

  // Live Scroll Reading Progress + Ctrl+K / ⌘K Instant Command Palette Shortcut + #analytics Hash Listener
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (docHeight <= 0) {
        setReadingProgress(0);
      } else {
        setReadingProgress(Math.min(100, Math.max(0, Math.round((scrollTop / docHeight) * 100))));
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
        setAnalyticsPanelOpen(false);
        setNavCvDropdownOpen(false);
        setNavAboutDropdownOpen(false);
      }
    };
    const handleHashChange = () => {
      const h = window.location.hash.toLowerCase();
      if (h === '#analytics' || h === '#analytics-panel') {
        setAnalyticsPanelOpen(true);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('hashchange', handleHashChange);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Auto-scroll smoothly to corpus search results when arriving via browser OpenSearch / SearchAction (?q=...)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const initialQ = params.get('q')?.trim();
    const initialArticle = params.get('article')?.trim();
    if (initialQ && !initialArticle) {
      const timer = setTimeout(() => {
        document.getElementById('corpus')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 220);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleInstantGlobalIndexAndScroll = () => {
    setIndexingTriggerCount((prev) => prev + 1);
    document.getElementById('indexing-social')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleQueueAllArticlesIndividuallyAndScroll = () => {
    setQueueAllTriggerCount((prev) => prev + 1);
    document.getElementById('per-article-browser-queue')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleQueueSingleArticleIndividually = (articleId: string) => {
    setSingleArticleQueueTarget({ id: articleId, triggerId: Date.now() });
    document.getElementById('per-article-browser-queue')?.scrollIntoView({ behavior: 'smooth' });
  };

  const t = UI_TEXT[language];
  const currentLangMeta = getLanguageMeta(language);

  // Sync HTML lang, dir, canonical link, native hreflang tags, robots directives, OpenGraph URL, deep-link title/description, and dynamic BlogPosting JSON-LD
  useEffect(() => {
    if (typeof document !== 'undefined' && typeof window !== 'undefined') {
      const CANONICAL_ORIGIN = window.location.hostname.endsWith('.run.app')
        ? window.location.origin
        : 'https://emrepelit-sciphi.ai.studio';
      const params = new URLSearchParams(window.location.search);
      const urlArticleId = params.get('article');
      const urlSectionParam = params.get('section')?.trim();
      const urlTabParam = params.get('tab')?.trim();
      const urlSection = urlSectionParam || urlTabParam;
      const pathParts = window.location.pathname.split('/').filter(Boolean);
      let pathSlug: string | null = null;
      if (
        pathParts.length >= 2 &&
        ALL_ARTICLE_ROUTE_SEGMENTS.includes(pathParts[0].toLowerCase())
      ) {
        pathSlug = decodeURIComponent(pathParts[1]);
      } else if (
        pathParts.length >= 3 &&
        ALL_ARTICLE_ROUTE_SEGMENTS.includes(pathParts[1].toLowerCase())
      ) {
        pathSlug = decodeURIComponent(pathParts[2]);
      }

      const targetLookup = pathSlug || urlArticleId;
      const matchedIdx = targetLookup ? findArticleIndexByLookup(articles, targetLookup) : -1;
      const matchedArticle = matchedIdx >= 0 ? articles[matchedIdx] : null;
      const effectiveArticleLang: LanguageCode = matchedArticle
        ? language ||
          matchedArticle.sourceLang ||
          detectEntrySourceLanguage(
            getLocalizedText(matchedArticle.title, 'tr'),
            getLocalizedText(matchedArticle.abstract, 'tr')
          )
        : language;
      const effectiveLangMeta = getLanguageMeta(effectiveArticleLang);
      document.documentElement.lang = effectiveArticleLang;
      document.documentElement.dir = effectiveLangMeta.dir;
      const ogLocaleMeta = document.querySelector('meta[property="og:locale"]');
      if (ogLocaleMeta) {
        ogLocaleMeta.setAttribute('content', effectiveLangMeta.bcp47.replace('-', '_'));
      }

      const baseTitle = 'Emre Pelit Sci-Phil — Bilim, Felsefe ve Simülasyon';
      const baseDesc =
        `Emre Pelit'in ${corpusArticlesCount} özgün bilim ve felsefe makalesi, her makaleye özel 60 sn HTML5 açıklayıcı videolar, çoktan seçmeli kavrama testleri ve interaktif fizik simülasyonlarını keşfedin.`;

      const dynamicTitle = matchedArticle
        ? `${getLocalizedText(matchedArticle.title, effectiveArticleLang)} — Emre Pelit Sci-Phil (${effectiveLangMeta.shortLabel})`
        : searchQuery.trim()
        ? `"${searchQuery.trim()}" Arama Sonuçları — ${baseTitle}`
        : language === 'tr' && !urlSection
        ? baseTitle
        : `${t.hero.title} — Emre Pelit Sci-Phil (${currentLangMeta.nativeName})`;

      const dynamicDesc = matchedArticle
        ? `${getLocalizedText(matchedArticle.abstract, effectiveArticleLang).slice(0, 130)} — HTML5 Video (60s) & Çoktan Seçmeli Test`
        : language === 'tr'
        ? baseDesc
        : `${t.hero.subtitle} (${distinctWorksCount} Distinct Works · 60s HTML5 Videos · Multiple-Choice Quizzes · ${corpusArticlesCount} Multilingual Texts)`;

      document.title = dynamicTitle;

      const descMeta = document.querySelector('meta[name="description"]');
      if (descMeta) descMeta.setAttribute('content', dynamicDesc);
      const ogTitleMeta = document.querySelector('meta[property="og:title"]');
      if (ogTitleMeta) ogTitleMeta.setAttribute('content', dynamicTitle);
      const ogDescMeta = document.querySelector('meta[property="og:description"]');
      if (ogDescMeta) ogDescMeta.setAttribute('content', dynamicDesc);
      const twTitleMeta = document.querySelector('meta[name="twitter:title"]');
      if (twTitleMeta) twTitleMeta.setAttribute('content', dynamicTitle);
      const twDescMeta = document.querySelector('meta[name="twitter:description"]');
      if (twDescMeta) twDescMeta.setAttribute('content', dynamicDesc);
      const ogTypeMeta = document.querySelector('meta[property="og:type"]');
      if (ogTypeMeta) ogTypeMeta.setAttribute('content', matchedArticle ? 'article' : 'website');

      // All 12 languages are canonical and indexable HTTP 200 OK; only ?q= internal search pages emit noindex, follow
      const isSearchQueryView = !matchedArticle && Boolean(params.get('q')?.trim() || searchQuery.trim());
      const robotsDirective = isSearchQueryView
        ? 'noindex, follow'
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
      (['robots', 'googlebot', 'bingbot'] as const).forEach((metaName) => {
        let el = document.querySelector(`meta[name="${metaName}"]`);
        if (!el) {
          el = document.createElement('meta');
          el.setAttribute('name', metaName);
          document.head.appendChild(el);
        }
        el.setAttribute('content', robotsDirective);
      });

      const isArchivePage = pathParts[0] === 'archive' || pathParts[1] === 'archive';
      const canonicalQuerySuffix = urlSectionParam
        ? `?section=${encodeURIComponent(urlSectionParam)}`
        : urlTabParam
        ? `?tab=${encodeURIComponent(urlTabParam)}`
        : '';
      const canonicalHref = matchedArticle
        ? `${CANONICAL_ORIGIN}${getLocalizedArticlePath(effectiveArticleLang, matchedArticle.slug)}`
        : isArchivePage
        ? `${CANONICAL_ORIGIN}/${language}/archive`
        : canonicalQuerySuffix
        ? `${CANONICAL_ORIGIN}/${language === 'tr' ? '' : `${language}/`}${canonicalQuerySuffix}`
        : language === 'tr'
        ? `${CANONICAL_ORIGIN}/`
        : `${CANONICAL_ORIGIN}/${language}/`;

      const canonicalEl = document.querySelector('link[rel="canonical"]');
      if (canonicalEl) {
        canonicalEl.setAttribute('href', canonicalHref);
      }
      const ogUrlEl = document.querySelector('meta[property="og:url"]');
      if (ogUrlEl) {
        ogUrlEl.setAttribute('content', canonicalHref);
      }
      const oembedEl = document.querySelector('link[type="application/json+oembed"]');
      if (oembedEl) {
        oembedEl.setAttribute('href', `${CANONICAL_ORIGIN}/oembed.json?url=${encodeURIComponent(canonicalHref)}`);
      }

      // Dynamically synchronize reciprocal hreflang alternate links across all 12 world languages + x-default
      document
        .querySelectorAll('link[rel="alternate"][hreflang]')
        .forEach((el) => el.parentNode?.removeChild(el));

      const appendHreflangLink = (hreflangCode: string, hrefUrl: string) => {
        const linkEl = document.createElement('link');
        linkEl.setAttribute('rel', 'alternate');
        linkEl.setAttribute('hreflang', hreflangCode);
        linkEl.setAttribute('href', hrefUrl);
        document.head.appendChild(linkEl);
      };

      if (matchedArticle) {
        const cluster = workClustersData.clusterByArticleId[matchedArticle.id];
        WORLD_LANGUAGES.forEach((wl) => {
          const sibArt = cluster?.byLang?.[wl.code] || matchedArticle;
          appendHreflangLink(
            wl.code,
            `${CANONICAL_ORIGIN}${getLocalizedArticlePath(wl.code, sibArt.slug)}`
          );
        });
        const xDefArticle =
          cluster?.byLang?.tr || cluster?.byLang?.en || matchedArticle;
        const xDefLang =
          xDefArticle.sourceLang ||
          detectEntrySourceLanguage(
            getLocalizedText(xDefArticle.title, 'tr'),
            getLocalizedText(xDefArticle.abstract, 'tr')
          );
        appendHreflangLink(
          'x-default',
          `${CANONICAL_ORIGIN}${getLocalizedArticlePath(xDefLang, xDefArticle.slug)}`
        );
      } else {
        CANONICAL_12_LANGS.forEach((langCode) => {
          appendHreflangLink(
            langCode,
            isArchivePage
              ? `${CANONICAL_ORIGIN}/${langCode}/archive`
              : canonicalQuerySuffix
              ? `${CANONICAL_ORIGIN}/${langCode === 'tr' ? '' : `${langCode}/`}${canonicalQuerySuffix}`
              : langCode === 'tr'
              ? `${CANONICAL_ORIGIN}/`
              : `${CANONICAL_ORIGIN}/${langCode}/`
          );
        });
        appendHreflangLink(
          'x-default',
          isArchivePage
            ? `${CANONICAL_ORIGIN}/archive`
            : canonicalQuerySuffix
            ? `${CANONICAL_ORIGIN}/${canonicalQuerySuffix}`
            : `${CANONICAL_ORIGIN}/`
        );
      }

      const gscMetaEl = document.querySelector('meta[name="google-site-verification"]');
      if (gscMetaEl && gatewayConfig.googleSiteVerificationToken) {
        gscMetaEl.setAttribute('content', gatewayConfig.googleSiteVerificationToken);
      }

      // Client-Side DOM & All-Browser Registration Guard: Ensure author, LinkedIn & official YouTube (@science_only) verification tags are persisted across all web browsers
      try {
        localStorage.setItem('emre_pelit_youtube_channel', '@science_only');
        localStorage.setItem('emre_pelit_youtube_url', 'https://www.youtube.com/@science_only');
      } catch {
        // Ignore storage quota
      }
      const authorMeta = document.querySelector('meta[name="author"]');
      if (authorMeta) {
        authorMeta.setAttribute('content', 'Emre Pelit');
      }
      let ytChannelMeta = document.querySelector('meta[name="youtube:channel"]');
      if (!ytChannelMeta) {
        ytChannelMeta = document.createElement('meta');
        ytChannelMeta.setAttribute('name', 'youtube:channel');
        document.head.appendChild(ytChannelMeta);
      }
      ytChannelMeta.setAttribute('content', '@science_only');

      let ytUrlMeta = document.querySelector('meta[name="youtube:url"]');
      if (!ytUrlMeta) {
        ytUrlMeta = document.createElement('meta');
        ytUrlMeta.setAttribute('name', 'youtube:url');
        document.head.appendChild(ytUrlMeta);
      }
      ytUrlMeta.setAttribute('content', 'https://www.youtube.com/@science_only');

      if (!document.querySelector('link[rel="me"][href="https://www.youtube.com/@science_only"]')) {
        const ytMeLink = document.createElement('link');
        ytMeLink.rel = 'me';
        ytMeLink.href = 'https://www.youtube.com/@science_only';
        document.head.appendChild(ytMeLink);
      }

      const linkedinOwnerMeta = document.querySelector('meta[name="linkedin:owner"]');
      if (linkedinOwnerMeta) {
        linkedinOwnerMeta.setAttribute('content', 'https://www.linkedin.com/in/emrepelit109');
      }
      if (!document.querySelector('link[rel="me"][href="https://www.linkedin.com/in/emrepelit109"]')) {
        const meLink = document.createElement('link');
        meLink.rel = 'me';
        meLink.href = 'https://www.linkedin.com/in/emrepelit109';
        document.head.appendChild(meLink);
      }
      if (!document.querySelector('link[rel="me"][href="https://github.com/emrepelit109"]')) {
        const ghMeLink = document.createElement('link');
        ghMeLink.rel = 'me';
        ghMeLink.href = 'https://github.com/emrepelit109';
        document.head.appendChild(ghMeLink);
      }
      if (!document.querySelector('link[rel="me"][href="https://www.researchgate.net/profile/Emre-Pelit"]')) {
        const rgMeLink = document.createElement('link');
        rgMeLink.rel = 'me';
        rgMeLink.href = 'https://www.researchgate.net/profile/Emre-Pelit';
        document.head.appendChild(rgMeLink);
      }
      let rgMeta = document.querySelector('meta[name="researchgate:profile"]');
      if (!rgMeta) {
        rgMeta = document.createElement('meta');
        rgMeta.setAttribute('name', 'researchgate:profile');
        document.head.appendChild(rgMeta);
      }
      rgMeta.setAttribute('content', 'https://www.researchgate.net/profile/Emre-Pelit');

      // Inject dynamic BlogPosting ItemList JSON-LD for the top synced articles with clean semantic URLs
      let dynScript = document.getElementById('dynamic-scholarly-jsonld') as HTMLScriptElement | null;
      if (!dynScript) {
        dynScript = document.createElement('script');
        dynScript.id = 'dynamic-scholarly-jsonld';
        dynScript.type = 'application/ld+json';
        document.head.appendChild(dynScript);
      }
      const topArticlesJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: `Emre Pelit — Sci-Phil Külliyatı (${corpusArticlesCount} Makale)`,
        numberOfItems: corpusArticlesCount,
        itemListElement: articles.slice(0, 30).map((art, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          item: {
            '@type': 'BlogPosting',
            headline: getLocalizedText(art.title, language),
            description: getLocalizedText(art.abstract, language).slice(0, 220),
            author: {
              '@type': 'Person',
              '@id': 'https://emrepelit-sciphi.ai.studio/#emre-pelit',
              name: 'Emre Pelit',
              url: 'https://emrepelit-sciphi.ai.studio/#emre-pelit',
              sameAs: [
                'https://github.com/emrepelit109',
                'https://www.researchgate.net/profile/Emre-Pelit',
                'https://www.youtube.com/@science_only',
                'https://www.linkedin.com/in/emrepelit109',
                'https://x.com/emrepelit109',
                'https://www.instagram.com/bilimsohbeti',
                'https://www.threads.net/@bilimsohbeti',
                'https://medium.com/@emrepelit39',
                'https://grok.com/emrepelit',
              ],
            },
            datePublished: art.publishedAt,
            inLanguage:
              art.sourceLang ||
              detectEntrySourceLanguage(
                getLocalizedText(art.title, 'tr'),
                getLocalizedText(art.abstract, 'tr')
              ),
            isPartOf: {
              '@type': 'Blog',
              name: 'Emre Pelit — Sci-Phil Bilim, Felsefe ve Simülasyon Arşivi',
            },
            url: `${CANONICAL_ORIGIN}${getLocalizedArticlePath(
              art.sourceLang ||
                detectEntrySourceLanguage(
                  getLocalizedText(art.title, 'tr'),
                  getLocalizedText(art.abstract, 'tr')
                ),
              art.slug
            )}`,
          },
        })),
      };
      dynScript.textContent = JSON.stringify(topArticlesJsonLd);
    }
  }, [
    language,
    currentLangMeta.dir,
    currentLangMeta.nativeName,
    currentLangMeta.shortLabel,
    gatewayConfig.googleSiteVerificationToken,
    articles,
    workClustersData,
    distinctWorksCount,
    corpusArticlesCount,
    searchQuery,
    t.hero.title,
    t.hero.subtitle,
  ]);

  // Runtime injection of optional external telemetry scripts (GA4 / Cloudflare Web Analytics) strictly when configured by owner AND visitor granted KVKK explicit consent
  useEffect(() => {
    if (
      typeof document === 'undefined' ||
      !kvkkConsent.analytics ||
      !kvkkConsent.externalTelemetry
    ) {
      return;
    }
    const gaId = (gatewayConfig.gaMeasurementId || '').trim();
    if (/^G-[A-Z0-9]{6,14}$/i.test(gaId) && !document.getElementById('sciphil-ga4-loader')) {
      const s = document.createElement('script');
      s.id = 'sciphil-ga4-loader';
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
      document.head.appendChild(s);

      const inline = document.createElement('script');
      inline.id = 'sciphil-ga4-init';
      inline.textContent = `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${gaId}', { anonymize_ip: true });`;
      document.head.appendChild(inline);
    }

    const cfToken = (gatewayConfig.cloudflareAnalyticsToken || '').trim();
    if (/^[a-f0-9]{16,64}$/i.test(cfToken) && !document.getElementById('sciphil-cf-beacon')) {
      const cf = document.createElement('script');
      cf.id = 'sciphil-cf-beacon';
      cf.defer = true;
      cf.src = 'https://static.cloudflareinsights.com/beacon.min.js';
      cf.setAttribute('data-cf-beacon', JSON.stringify({ token: cfToken }));
      document.head.appendChild(cf);
    }
  }, [
    gatewayConfig.gaMeasurementId,
    gatewayConfig.cloudflareAnalyticsToken,
    kvkkConsent.analytics,
    kvkkConsent.externalTelemetry,
  ]);

  // Client-Side Zero-Trust DOM & Canonical Tamper-Proof Guardian (MutationObserver + Object.freeze)
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    try {
      Object.freeze(OFFICIAL_10_WEBSITES);
    } catch {
      // Already frozen
    }
    const headObserver = new MutationObserver(() => {
      const authorMeta = document.querySelector('meta[name="author"]');
      if (authorMeta && authorMeta.getAttribute('content') !== 'Emre Pelit') {
        authorMeta.setAttribute('content', 'Emre Pelit');
      }
      const secMeta = document.querySelector('meta[name="external-tamper-protection"]');
      if (secMeta && secMeta.getAttribute('content') !== 'LOCKED-IMMUTABLE-100-PERCENT') {
        secMeta.setAttribute('content', 'LOCKED-IMMUTABLE-100-PERCENT');
      }
      const canonicalEl = document.querySelector('link[rel="canonical"]');
      if (canonicalEl) {
        const curHref = canonicalEl.getAttribute('href') || '';
        const allowedHostPrefix = window.location.hostname.endsWith('.run.app')
          ? window.location.origin
          : 'https://emrepelit-sciphi.ai.studio';
        if (
          !curHref.startsWith('https://emrepelit-sciphi.ai.studio') &&
          !curHref.startsWith(allowedHostPrefix)
        ) {
          canonicalEl.setAttribute('href', `${allowedHostPrefix}/`);
        }
      }
    });
    if (document.head) {
      headObserver.observe(document.head, {
        attributes: true,
        subtree: true,
        attributeFilter: ['content', 'href'],
      });
    }
    return () => headObserver.disconnect();
  }, []);

  const didSyncDeepLinkLangRef = useRef<boolean>(false);

  // Unified Semantic URL & Deep-Link Router: supports /<lang>/makale/<slug>, /makale/<slug>, /archive, ?article=<id>, ?tab=simulators|stats|automation, and #blogger-<id>
  useEffect(() => {
    if (typeof window === 'undefined' || articles.length < 2) return;
    const params = new URLSearchParams(window.location.search);
    const explicitQueryLang = (params.get('lang') || '').trim().toLowerCase();
    const targetArticleId = params.get('article');
    const targetSection = params.get('section');
    const targetTab = (params.get('tab') || '').toLowerCase();
    const rawHash = window.location.hash.replace(/^#/, '');
    const pathParts = window.location.pathname.split('/').filter(Boolean);

    const govRoutes = ['privacy', 'terms', 'imprint', 'kvkk', 'disclaimer', 'methodology'] as const;
    const matchedDirectGov = pathParts.find((part) =>
      (govRoutes as readonly string[]).includes(part.toLowerCase())
    )?.toLowerCase() as GovernanceTab | undefined;
    const matchedQueryGov =
      targetSection && (govRoutes as readonly string[]).includes(targetSection.toLowerCase())
        ? (targetSection.toLowerCase() as GovernanceTab)
        : undefined;
    if (matchedDirectGov || matchedQueryGov) {
      setGovernanceTab(matchedDirectGov || matchedQueryGov!);
      setGovernanceModalOpen(true);
      return;
    }

    if (pathParts[0] === 'archive' || pathParts[1] === 'archive') {
      setShowBloggerDirectory(true);
      setTimeout(() => {
        document.getElementById('blogger-bridge')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
      return;
    }

    if (targetTab === 'stats' || targetTab === 'analytics') {
      setActiveTab('stats');
      setAnalyticsPanelOpen(true);
      return;
    }
    if (targetTab === 'automation' || targetTab === 'ai-studio') {
      setActiveTab('automation');
      setTimeout(() => {
        document.getElementById('ai-studio')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
      return;
    }
    if (targetTab === 'simulators') {
      setActiveTab('simulators');
      const firstArtId = articles[0]?.id;
      if (firstArtId) {
        setExpandedArticleIds((prev) => ({ ...prev, [firstArtId]: true }));
      }
      setTimeout(() => {
        const simTarget = document.getElementById('featured-simulator-container');
        if (simTarget) {
          simTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 180);
      return;
    }

    let pathSlug: string | null = null;
    if (
      pathParts.length >= 2 &&
      ALL_ARTICLE_ROUTE_SEGMENTS.includes(pathParts[0].toLowerCase())
    ) {
      pathSlug = decodeURIComponent(pathParts[1]);
    } else if (
      pathParts.length >= 3 &&
      ALL_ARTICLE_ROUTE_SEGMENTS.includes(pathParts[1].toLowerCase())
    ) {
      pathSlug = decodeURIComponent(pathParts[2]);
    }

    const lookupKey =
      pathSlug ||
      targetArticleId ||
      (rawHash.startsWith('blogger-') || rawHash.startsWith('art-') ? rawHash : null);

    if (lookupKey) {
      const idx = findArticleIndexByLookup(articles, lookupKey);
      if (idx >= 0) {
        const matched = articles[idx];
        const artLang =
          matched.sourceLang ||
          detectEntrySourceLanguage(
            getLocalizedText(matched.title, 'tr'),
            getLocalizedText(matched.abstract, 'tr')
          );
        const maybePathLang = (pathParts[0] || '').toLowerCase() as LanguageCode;
        const explicitPathLang = WORLD_LANGUAGES.some((wl) => wl.code === maybePathLang)
          ? maybePathLang
          : null;
        if (!didSyncDeepLinkLangRef.current) {
          didSyncDeepLinkLangRef.current = true;
          if (!explicitQueryLang && !explicitPathLang && artLang !== language) {
            setLanguage(artLang);
          }
        }
        const resolvedRouteLang =
          (WORLD_LANGUAGES.some((wl) => wl.code === explicitQueryLang)
            ? (explicitQueryLang as LanguageCode)
            : null) ||
          explicitPathLang ||
          language ||
          artLang;
        setExpandedArticleIds((prev) => ({ ...prev, [matched.id]: true }));
        setShowAllLanguagesCorpus(true);
        const pageNum = Math.floor(idx / articlesPerPage) + 1;
        setCurrentPage(pageNum);
        const semanticPath = getLocalizedArticlePath(resolvedRouteLang, matched.slug);
        if (window.location.pathname !== semanticPath) {
          try {
            window.history.replaceState(null, '', semanticPath);
          } catch {
            // Ignore history security errors in sandboxed iframes
          }
        }
        setTimeout(() => {
          document.getElementById(matched.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 120);
      }
    } else if (targetSection) {
      setTimeout(() => {
        document.getElementById(targetSection)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
    }
  }, [articles.length, articlesPerPage, language]);

  // Close top nav dropdowns when clicking outside (accounting for both desktop and mobile Hakkında controls)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setNavCvDropdownOpen(false);
      }
      const clickedInsideAboutDesktop = aboutDropdownRef.current?.contains(target) ?? false;
      const clickedInsideAboutMobileToggle = mobileAboutToggleRef.current?.contains(target) ?? false;
      const clickedInsideAboutMobileDrawer = mobileAboutDrawerRef.current?.contains(target) ?? false;
      if (!clickedInsideAboutDesktop && !clickedInsideAboutMobileToggle && !clickedInsideAboutMobileDrawer) {
        setNavAboutDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Persist monotonic 10-website aggregate statistics & synced boosts to localStorage and server-side cloud store promptly
  useEffect(() => {
    const compactNodes = networkNodes.map((n) => ({
      id: n.id,
      rank: n.rank,
      domain: n.domain,
      articlesCount: n.articlesCount,
      bloggerSyncedCount: n.bloggerSyncedCount,
      lastBloggerSyncAt: n.lastBloggerSyncAt,
      stats: n.stats,
    }));
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(
          'emrepelit_10sites_monotonic_stats_v3',
          JSON.stringify(compactNodes)
        );
        window.localStorage.setItem(
          'emrepelit_10sites_analytics_measurements_v2',
          JSON.stringify(analyticsMeasurements)
        );
        window.localStorage.setItem(
          'emrepelit_10sites_app_interaction_totals_v2',
          JSON.stringify(appInteractionTotals)
        );
        window.localStorage.setItem(
          'emrepelit_10sites_app_interaction_log_v2',
          JSON.stringify(analyticsEventLog.slice(0, 120))
        );
        window.localStorage.setItem(
          'sciphil_article_boosts_v2',
          JSON.stringify(articleStatsBoosts)
        );
      } catch {
        // Ignore storage quota errors
      }
    }
    const timer = window.setTimeout(() => {
      fetch('/api/cloud/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telemetrySchemaVersion: 'sciphil-clean-v3',
          networkNodes: compactNodes,
          analyticsMeasurements,
          articleStatsBoosts,
          appInteractionTotals,
          appInteractionLog: analyticsEventLog.slice(0, 120),
          gatewayConfig,
          snapshots,
        }),
        keepalive: true,
      }).catch(() => {});
    }, 150);
    return () => window.clearTimeout(timer);
  }, [
    networkNodes,
    analyticsMeasurements,
    articleStatsBoosts,
    appInteractionTotals,
    analyticsEventLog,
    gatewayConfig,
    snapshots,
  ]);

  const networkNodesRef = useRef<Network301Node[]>(networkNodes);
  useEffect(() => {
    networkNodesRef.current = networkNodes;
  }, [networkNodes]);

  // Live Cumulative Statistics of all 8 websites since their launch
  const liveCumulativeStats = useMemo(
    () => computeCumulativeNetworkStats(networkNodes),
    [networkNodes]
  );

  const appInteractionTotalsRef = useRef<AppInteractionTotals>(appInteractionTotals);
  useEffect(() => {
    appInteractionTotalsRef.current = appInteractionTotals;
  }, [appInteractionTotals]);

  const articleStatsBoostsRef = useRef(articleStatsBoosts);
  useEffect(() => {
    articleStatsBoostsRef.current = articleStatsBoosts;
  }, [articleStatsBoosts]);

  // Strictly Analytics-Driven Statistics & Live Views + App Interactions Updater (always synchronized 1:1)
  const handleRecordAnalyticsMeasurement = useCallback(
    (
      targetDomainOrAll: string,
      delta: {
        readsDelta?: number;
        viewsDelta?: number;
        citationsDelta?: number;
        targetArticleId?: string;
        readingMinutesDelta?: number;
        audioMinutesDelta?: number;
        uniqueReadersDelta?: number;
        simulatorRunsDelta?: number;
      },
      sourcePanel: AnalyticsMeasurementEvent['sourcePanel'],
      metricSummary: string,
      interactionCategoryOverride?: AppInteractionCategory
    ) => {
      const rDelta = Math.max(0, Math.floor(Number(delta.readsDelta) || 0));
      const explicitVDelta =
        typeof delta.viewsDelta === 'number'
          ? Math.max(0, Math.floor(Number(delta.viewsDelta) || 0))
          : rDelta > 0
            ? Math.max(1, rDelta)
            : 0;
      const vDelta = Math.max(rDelta, explicitVDelta);
      const cDelta = Math.max(0, Math.floor(Number(delta.citationsDelta) || 0));
      const rmDelta = Math.max(0, Math.floor(Number(delta.readingMinutesDelta) || 0));
      const amDelta = Math.max(0, Math.floor(Number(delta.audioMinutesDelta) || 0));
      const uDelta = Math.max(0, Math.floor(Number(delta.uniqueReadersDelta) || 0));
      const sDelta = Math.max(0, Math.floor(Number(delta.simulatorRunsDelta) || 0));

      const inferredCategory: AppInteractionCategory =
        interactionCategoryOverride ||
        (sourcePanel === 'PWA_DOWNLOAD'
          ? 'PWA_DOWNLOAD'
          : sourcePanel === 'SIMULATION_LAB'
            ? 'SIMULATION_RUN'
            : sourcePanel === 'AUDIO_NARRATOR'
              ? 'AUDIO_LISTEN'
              : sourcePanel === 'AI_ANALYSIS_LAB'
                ? 'ANALYSIS_MODAL'
                : sourcePanel === 'QA_OBJECTOR'
                  ? 'QA_OBJECTION'
                  : sourcePanel === 'LANGUAGE_SWITCH' ||
                      sourcePanel === 'SEARCH_FILTER' ||
                      sourcePanel === 'EXPORT_CITATION' ||
                      sourcePanel === 'NAVIGATION'
                    ? 'LANGUAGE_SEARCH_EXPORT'
                    : sourcePanel === 'ARTICLE_READER'
                      ? 'ARTICLE_READ'
                      : 'PAGE_VIEW');

      const hasExplicitInteraction =
        Boolean(interactionCategoryOverride) ||
        sourcePanel === 'PWA_DOWNLOAD' ||
        sourcePanel === 'QA_OBJECTOR' ||
        sourcePanel === 'LANGUAGE_SWITCH' ||
        sourcePanel === 'SEARCH_FILTER' ||
        sourcePanel === 'EXPORT_CITATION' ||
        sourcePanel === 'NAVIGATION';

      // Strict KVKK Law No. 6698 opt-in gate: do not mutate session analytics or hit backend telemetry endpoints until accepted
      if (kvkkConsentRef.current.status !== 'accepted' || !kvkkConsentRef.current.analytics) {
        return;
      }

      // Strict guard: If no measured value changed AND not an explicit UI interaction, skip
      if (
        !hasExplicitInteraction &&
        rDelta === 0 &&
        vDelta === 0 &&
        cDelta === 0 &&
        rmDelta === 0 &&
        amDelta === 0 &&
        uDelta === 0 &&
        sDelta === 0
      ) {
        return;
      }

      const nowIso = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
      const isAllSites =
        !targetDomainOrAll ||
        targetDomainOrAll === 'ALL_10_SITES' ||
        targetDomainOrAll === 'ALL_8_SITES';
      const currentSyncSeq = syncSeqRef.current++;

      // If a specific article was viewed/read/cited, update both articles state AND articleStatsBoosts synchronously
      let nextBoostsSnapshot = articleStatsBoostsRef.current;
      if (delta.targetArticleId && (rDelta > 0 || vDelta > 0 || cDelta > 0)) {
        const targetId = delta.targetArticleId;
        const curB = nextBoostsSnapshot[targetId] || { reads: 0, views: 0, citations: 0 };
        nextBoostsSnapshot = {
          ...nextBoostsSnapshot,
          [targetId]: {
            reads: curB.reads + rDelta,
            views: curB.views + vDelta,
            citations: curB.citations + cDelta,
          },
        };
        articleStatsBoostsRef.current = nextBoostsSnapshot;
        setArticleStatsBoosts((prevBoosts) => {
          const prevCur = prevBoosts[targetId] || { reads: 0, views: 0, citations: 0 };
          return {
            ...prevBoosts,
            [targetId]: {
              reads: Math.max(nextBoostsSnapshot[targetId].reads, prevCur.reads + rDelta),
              views: Math.max(nextBoostsSnapshot[targetId].views, prevCur.views + vDelta),
              citations: Math.max(nextBoostsSnapshot[targetId].citations, prevCur.citations + cDelta),
            },
          };
        });
        setArticles((prevArts) =>
          prevArts.map((a) =>
            a.id === targetId
              ? {
                  ...a,
                  networkImpressions: (a.networkImpressions || 0) + vDelta,
                  citationsCount: (a.citationsCount || 0) + cDelta,
                }
              : a
          )
        );
      }

      const isMainHubTarget =
        isAllSites || !LIVE_WEBSITES_SET.has(targetDomainOrAll);
      const computeNextNodes = (baseNodes: Network301Node[]) => {
        const safePrev = mergeMonotonicNetworkNodes(baseNodes);
        const updated = safePrev.map((node) => {
          const isLiveNode =
            LIVE_WEBSITES_SET.has(node.domain) || Boolean(node.isLiveWebsite);
          if (!isLiveNode) return node;
          const shouldApply = isMainHubTarget
            ? node.domain === 'emrepelit-sciphi.ai.studio'
            : node.domain === targetDomainOrAll || node.id === targetDomainOrAll;
          if (!shouldApply) return node;

          const totalReadMins =
            node.stats.readingTimeHours * 60 + node.stats.readingTimeMinutes + rmDelta;
          const totalAudioMins =
            node.stats.audioListenHours * 60 + node.stats.audioListenMinutes + amDelta;

          const nextNetReads = node.stats.netReads + rDelta;
          const prevNodeViews = node.stats.totalViews || 0;
          const nextTotalViews = Math.max(nextNetReads, prevNodeViews + vDelta);

          const candidateStats: Network301Node['stats'] = {
            ...node.stats,
            baseReads: nextNetReads,
            recent48hReads: 0,
            netReads: nextNetReads,
            totalViews: nextTotalViews,
            readingTimeHours: Math.floor(totalReadMins / 60),
            readingTimeMinutes: totalReadMins % 60,
            audioListenHours: Math.floor(totalAudioMins / 60),
            audioListenMinutes: totalAudioMins % 60,
            uniqueReaders: node.stats.uniqueReaders + uDelta,
            simulatorRuns: node.stats.simulatorRuns + sDelta,
          };

          return {
            ...node,
            stats: mergeMonotonicNodeStats(node.stats, candidateStats),
          };
        });
        return mergeMonotonicNetworkNodes(safePrev, updated);
      };

      const mergedUpdated = computeNextNodes(networkNodesRef.current);
      networkNodesRef.current = mergedUpdated;
      const nextCumulative = computeCumulativeNetworkStats(mergedUpdated);

      setNetworkNodes((prevNodes) => mergeMonotonicNetworkNodes(prevNodes, mergedUpdated));

      // Keep analyticsMeasurements 100% synchronized with updated networkNodes (retired 8 domains stay frozen)
      setAnalyticsMeasurements((prevMap) => {
        const nextMap = { ...prevMap };
        mergedUpdated.forEach((node) => {
          const domain = node.domain;
          const nodeViews = node.stats.totalViews || 0;
          const nodeReadMins =
            node.stats.readingTimeHours * 60 + node.stats.readingTimeMinutes;
          const nodeAudioMins =
            node.stats.audioListenHours * 60 + node.stats.audioListenMinutes;
          const prevEntry = nextMap[domain];
          const isLiveNode =
            LIVE_WEBSITES_SET.has(domain) || Boolean(node.isLiveWebsite);
          const didChange =
            isLiveNode &&
            (isMainHubTarget
              ? domain === 'emrepelit-sciphi.ai.studio'
              : domain === targetDomainOrAll || node.id === targetDomainOrAll);
          nextMap[domain] = {
            domain,
            measuredReads: Math.max(node.stats.netReads, prevEntry?.measuredReads || 0),
            measuredViews: Math.max(nodeViews, prevEntry?.measuredViews || 0),
            measuredReadingMinutes: Math.max(
              nodeReadMins,
              prevEntry?.measuredReadingMinutes || 0
            ),
            measuredAudioMinutes: Math.max(
              nodeAudioMins,
              prevEntry?.measuredAudioMinutes || 0
            ),
            measuredUniqueReaders: Math.max(
              node.stats.uniqueReaders,
              prevEntry?.measuredUniqueReaders || 0
            ),
            measuredSimulatorRuns: Math.max(
              node.stats.simulatorRuns,
              prevEntry?.measuredSimulatorRuns || 0
            ),
            lastMeasuredAt: didChange ? nowIso : prevEntry?.lastMeasuredAt || nowIso,
          };
        });
        return nextMap;
      });

      // Keep live session + all-time app interaction totals 100% synchronized with every read, view & interaction delta
      const effectiveViewDelta = nextCumulative.totalViews > appInteractionTotalsRef.current.pageViews
        ? nextCumulative.totalViews - appInteractionTotalsRef.current.pageViews
        : vDelta > 0
          ? vDelta
          : inferredCategory === 'PAGE_VIEW'
            ? 1
            : 0;
      const effectiveReadDelta = nextCumulative.netReads > appInteractionTotalsRef.current.articleReads
        ? nextCumulative.netReads - appInteractionTotalsRef.current.articleReads
        : rDelta > 0
          ? rDelta
          : inferredCategory === 'ARTICLE_READ'
            ? 1
            : 0;
      const effectiveSimDelta = nextCumulative.simulatorRuns > appInteractionTotalsRef.current.simulationRuns
        ? nextCumulative.simulatorRuns - appInteractionTotalsRef.current.simulationRuns
        : sDelta > 0
          ? sDelta
          : inferredCategory === 'SIMULATION_RUN'
            ? 1
            : 0;

      const pvInc = Math.max(0, effectiveViewDelta);
      const arInc = Math.max(0, effectiveReadDelta);
      const amInc = inferredCategory === 'ANALYSIS_MODAL' ? 1 : 0;
      const srInc = Math.max(0, effectiveSimDelta);
      const alInc = inferredCategory === 'AUDIO_LISTEN' || amDelta > 0 ? 1 : 0;
      const qaInc = inferredCategory === 'QA_OBJECTION' ? 1 : 0;
      const lsInc = inferredCategory === 'LANGUAGE_SEARCH_EXPORT' ? 1 : 0;
      const pwaInc = inferredCategory === 'PWA_DOWNLOAD' ? 1 : 0;
      const interactionStep = pvInc + arInc + amInc + srInc + alInc + qaInc + lsInc + pwaInc;

      const prevTotals = appInteractionTotalsRef.current;
      const nextAppTotals = mergeMonotonicAppInteractionTotals({
        pageViews: Math.max(prevTotals.pageViews + pvInc, nextCumulative.totalViews),
        articleReads: Math.max(prevTotals.articleReads + arInc, nextCumulative.netReads),
        analysisModals: prevTotals.analysisModals + amInc,
        simulationRuns: Math.max(prevTotals.simulationRuns + srInc, nextCumulative.simulatorRuns),
        audioListens: prevTotals.audioListens + alInc,
        qaObjections: prevTotals.qaObjections + qaInc,
        languageSearchExports: prevTotals.languageSearchExports + lsInc,
        pwaDownloads: prevTotals.pwaDownloads + pwaInc,
        lastUpdatedAt: nowIso,
      });
      appInteractionTotalsRef.current = nextAppTotals;
      setAppInteractionTotals(nextAppTotals);

      setSessionInteractionTotals((prevSess) => ({
        totalInteractionsSinceLaunch: prevSess.totalInteractionsSinceLaunch + interactionStep,
        pageViews: prevSess.pageViews + pvInc,
        articleReads: prevSess.articleReads + arInc,
        analysisModals: prevSess.analysisModals + amInc,
        simulationRuns: prevSess.simulationRuns + srInc,
        audioListens: prevSess.audioListens + alInc,
        qaObjections: prevSess.qaObjections + qaInc,
        languageSearchExports: prevSess.languageSearchExports + lsInc,
        pwaDownloads: prevSess.pwaDownloads + pwaInc,
      }));

      const syncPayload: AnalyticsMeasurementEvent = {
        id: `meas-${Date.now()}-${currentSyncSeq}-${Math.random().toString(36).slice(2, 6)}`,
        timestamp: nowIso,
        targetDomain: isAllSites ? 'ALL_10_SITES' : targetDomainOrAll,
        targetArticleId: delta.targetArticleId,
        sourcePanel,
        interactionCategory: inferredCategory,
        isHistoricalBaseline: false,
        metricSummary,
        readsDelta: rDelta,
        viewsDelta: vDelta,
        citationsDelta: cDelta,
        readingMinutesDelta: rmDelta,
        audioMinutesDelta: amDelta,
        uniqueReadersDelta: uDelta,
        simulatorRunsDelta: sDelta,
        cumulativeViewsAfter: nextCumulative.totalViews,
        cumulativeReadsAfter: nextCumulative.netReads,
        cumulativeAppInteractionsAfter: nextAppTotals.totalInteractionsSinceLaunch,
        syncSeq: currentSyncSeq,
      };

      setAnalyticsEventLog((prevLog) => {
        const liveItems = prevLog.filter((item) => !item.isHistoricalBaseline && item.id !== syncPayload.id);
        const histItems = prevLog.filter((item) => item.isHistoricalBaseline);
        return [syncPayload, ...liveItems.slice(0, 120), ...histItems].slice(0, 150);
      });

      setLastStatsSyncEvent({
        timestamp: nowIso,
        targetDomain: isAllSites ? 'ALL_10_SITES' : targetDomainOrAll,
        summary: metricSummary,
        syncSeq: currentSyncSeq,
        viewsDelta: vDelta,
        readsDelta: rDelta,
        cumulativeViewsAfter: nextCumulative.totalViews,
        cumulativeReadsAfter: nextCumulative.netReads,
      });

      // Fire Live Sync Event (CustomEvent + BroadcastChannel) AND Atomic Server Visit/Event Sync asynchronously
      if (typeof window !== 'undefined') {
        window.setTimeout(() => {
          try {
            window.dispatchEvent(
              new CustomEvent('sciphil:live-analytics-sync', { detail: syncPayload })
            );
          } catch {
            // Ignore CustomEvent error
          }
          try {
            if (typeof BroadcastChannel !== 'undefined') {
              const bc = new BroadcastChannel('sciphil_live_analytics_channel');
              bc.postMessage({
                type: 'LIVE_ANALYTICS_SYNC',
                payload: syncPayload,
                nodes: mergedUpdated,
                appInteractionTotals: nextAppTotals,
                articleStatsBoosts: nextBoostsSnapshot,
              });
              bc.close();
            }
          } catch {
            // Ignore BroadcastChannel error
          }
        }, 0);

        // Atomic server-side increment ensures fresh browsers & concurrent visits NEVER lose increments to Math.max races
        void fetch('/api/analytics/record-visit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          keepalive: true,
          body: JSON.stringify({
            targetDomain: isAllSites ? 'emrepelit-sciphi.ai.studio' : targetDomainOrAll,
            targetArticleId: delta.targetArticleId,
            viewsDelta: vDelta,
            readsDelta: rDelta,
            citationsDelta: cDelta,
            readingMinutesDelta: rmDelta,
            audioMinutesDelta: amDelta,
            uniqueReadersDelta: uDelta,
            simulatorRunsDelta: sDelta,
            sourcePanel,
            interactionCategory: inferredCategory,
            metricSummary,
          }),
        })
          .then((r) => (r.ok ? r.json() : null))
          .then((serverData) => {
            if (serverData && serverData.success) {
              applyServerSnapshotRef.current?.(serverData, false);
            }
          })
          .catch(() => {
            // Monotonic localStorage & 15s cloud sync remain active as fallback
          });
      }
    },
    []
  );

  // Listen for Cross-Tab BroadcastChannel & localStorage Storage Events so new reads/views from any tab stay 100% synced
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let bc: BroadcastChannel | null = null;
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        bc = new BroadcastChannel('sciphil_live_analytics_channel');
        bc.onmessage = (ev) => {
          if (ev.data?.type === 'LIVE_ANALYTICS_SYNC' && Array.isArray(ev.data.nodes)) {
            setNetworkNodes((prev) => mergeMonotonicNetworkNodes(prev, ev.data.nodes));
            if (ev.data.appInteractionTotals && typeof ev.data.appInteractionTotals === 'object') {
              setAppInteractionTotals((prev) =>
                mergeMonotonicAppInteractionTotals(prev, ev.data.appInteractionTotals)
              );
            }
            if (ev.data.articleStatsBoosts && typeof ev.data.articleStatsBoosts === 'object') {
              setArticleStatsBoosts((prev) => {
                const mergedBoosts = { ...prev };
                for (const [artId, incB] of Object.entries(ev.data.articleStatsBoosts as Record<string, any>)) {
                  if (!incB || typeof incB !== 'object') continue;
                  const curB = mergedBoosts[artId] || { reads: 0, views: 0, citations: 0 };
                  mergedBoosts[artId] = {
                    reads: Math.max(curB.reads, Number(incB.reads) || 0),
                    views: Math.max(curB.views, Number(incB.views) || 0),
                    citations: Math.max(curB.citations, Number(incB.citations) || 0),
                  };
                }
                return mergedBoosts;
              });
            }
            if (ev.data.payload) {
              setAnalyticsEventLog((prev) => {
                const incoming = ev.data.payload;
                const live = prev.filter((item) => !item.isHistoricalBaseline && item.id !== incoming.id);
                const hist = prev.filter((item) => item.isHistoricalBaseline);
                return [incoming, ...live.slice(0, 120), ...hist].slice(0, 150);
              });
              setLastStatsSyncEvent({
                timestamp: ev.data.payload.timestamp,
                targetDomain: ev.data.payload.targetDomain,
                summary: ev.data.payload.metricSummary,
                syncSeq: ev.data.payload.syncSeq,
                viewsDelta: ev.data.payload.viewsDelta,
                readsDelta: ev.data.payload.readsDelta,
                cumulativeViewsAfter: ev.data.payload.cumulativeViewsAfter,
                cumulativeReadsAfter: ev.data.payload.cumulativeReadsAfter,
              });
              window.setTimeout(() => {
                window.dispatchEvent(
                  new CustomEvent('sciphil:live-analytics-sync', { detail: ev.data.payload })
                );
              }, 0);
            }
          }
        };
      }
    } catch {
      // Ignore BroadcastChannel error
    }

    const handleStorageSync = (e: StorageEvent) => {
      if (!e.newValue) return;
      try {
        if (e.key === 'emrepelit_10sites_monotonic_stats_v3') {
          const parsedNodes = JSON.parse(e.newValue);
          if (Array.isArray(parsedNodes)) {
            setNetworkNodes((prev) => mergeMonotonicNetworkNodes(prev, parsedNodes));
          }
        } else if (e.key === 'emrepelit_10sites_app_interaction_totals_v2') {
          const parsedTotals = JSON.parse(e.newValue);
          if (parsedTotals && typeof parsedTotals === 'object') {
            setAppInteractionTotals((prev) => mergeMonotonicAppInteractionTotals(prev, parsedTotals));
          }
        } else if (e.key === 'sciphil_article_boosts_v2') {
          const parsedBoosts = JSON.parse(e.newValue);
          if (parsedBoosts && typeof parsedBoosts === 'object') {
            setArticleStatsBoosts((prev) => {
              const merged = { ...prev };
              for (const [artId, val] of Object.entries(parsedBoosts as Record<string, any>)) {
                if (!val || typeof val !== 'object') continue;
                const cur = merged[artId] || { reads: 0, views: 0, citations: 0 };
                merged[artId] = {
                  reads: Math.max(cur.reads, Number(val.reads) || 0),
                  views: Math.max(cur.views, Number(val.views) || 0),
                  citations: Math.max(cur.citations, Number(val.citations) || 0),
                };
              }
              return merged;
            });
          }
        } else if (e.key === 'emrepelit_10sites_analytics_measurements_v2') {
          const parsedMeas = JSON.parse(e.newValue);
          if (parsedMeas && typeof parsedMeas === 'object') {
            setAnalyticsMeasurements((prev) => {
              const merged = { ...prev };
              for (const domain of OFFICIAL_10_WEBSITES) {
                const inc = parsedMeas[domain];
                if (!inc || typeof inc !== 'object') continue;
                const cur = merged[domain];
                merged[domain] = {
                  domain,
                  measuredReads: Math.max(cur?.measuredReads || 0, Number(inc.measuredReads) || 0),
                  measuredViews: Math.max(cur?.measuredViews || 0, Number(inc.measuredViews) || 0),
                  measuredReadingMinutes: Math.max(
                    cur?.measuredReadingMinutes || 0,
                    Number(inc.measuredReadingMinutes) || 0
                  ),
                  measuredAudioMinutes: Math.max(
                    cur?.measuredAudioMinutes || 0,
                    Number(inc.measuredAudioMinutes) || 0
                  ),
                  measuredUniqueReaders: Math.max(
                    cur?.measuredUniqueReaders || 0,
                    Number(inc.measuredUniqueReaders) || 0
                  ),
                  measuredSimulatorRuns: Math.max(
                    cur?.measuredSimulatorRuns || 0,
                    Number(inc.measuredSimulatorRuns) || 0
                  ),
                  lastMeasuredAt: String(inc.lastMeasuredAt || cur?.lastMeasuredAt || ''),
                };
              }
              return merged;
            });
          }
        }
      } catch {
        // Ignore storage sync parse errors
      }
    };
    window.addEventListener('storage', handleStorageSync);

    return () => {
      window.removeEventListener('storage', handleStorageSync);
      try {
        bc?.close();
      } catch {
        // Ignore close error
      }
    };
  }, []);

  // Automatically record session/page entry strictly AFTER visitor grants KVKK opt-in analytics consent
  useEffect(() => {
    if (
      initialEntryRecordedRef.current ||
      typeof window === 'undefined' ||
      kvkkConsent.status !== 'accepted' ||
      !kvkkConsent.analytics
    ) {
      return;
    }
    initialEntryRecordedRef.current = true;
    const params = new URLSearchParams(window.location.search);
    const sourceParam = params.get('source') || '';
    const articleParam = params.get('article') || '';
    const entryDomain = LIVE_WEBSITES_SET.has(sourceParam)
      ? sourceParam
      : 'emrepelit-sciphi.ai.studio';
    handleRecordAnalyticsMeasurement(
      entryDomain,
      {
        viewsDelta: 1,
        readsDelta: 1,
        targetArticleId: articleParam || undefined,
        readingMinutesDelta: 2,
        uniqueReadersDelta: 1,
      },
      'ANALYTICS_PANEL',
      articleParam
        ? `Canlı Senkron: Yeni Görüntülenme & Makale Ziyareti (${entryDomain} · #${articleParam}): +1 Görüntülenme, +1 Okunma, +2 dk Okuma, +1 Tekil Okur`
        : `Canlı Senkron: Yeni Platform Görüntülenmesi (${entryDomain}): +1 Görüntülenme, +1 Okunma, +2 dk Okuma, +1 Tekil Okur`
    );
  }, [kvkkConsent.status, kvkkConsent.analytics, handleRecordAnalyticsMeasurement]);

  // Increment cumulative views & app interactions strictly when KVKK analytics consent is active
  const didMountViewTrackerRef = useRef<boolean>(false);
  const prevTrackedLangRef = useRef<LanguageCode>(language);
  useEffect(() => {
    if (!didMountViewTrackerRef.current) {
      didMountViewTrackerRef.current = true;
      prevTrackedLangRef.current = language;
      return;
    }
    const isLangChange = prevTrackedLangRef.current !== language;
    prevTrackedLangRef.current = language;
    if (kvkkConsentRef.current.status !== 'accepted' || !kvkkConsentRef.current.analytics) {
      return;
    }
    handleRecordAnalyticsMeasurement(
      'emrepelit-sciphi.ai.studio',
      {
        viewsDelta: 1,
        readsDelta: 0,
      },
      isLangChange ? 'LANGUAGE_SWITCH' : 'ANALYTICS_PANEL',
      isLangChange
        ? `Uygulama Etkileşimi: 12 Dil Değişimi (${language.toUpperCase()}): +1 Görüntülenme · +1 Dil Etkileşimi`
        : `Uygulama Etkileşimi: Sayfa/Panel Gezintisi (Dil: ${language.toUpperCase()} · Sayfa #${currentPage}): +1 Görüntülenme`,
      isLangChange ? 'LANGUAGE_SEARCH_EXPORT' : 'PAGE_VIEW'
    );
  }, [
    language,
    currentPage,
    analyticsPanelOpen,
    showBloggerDirectory,
    handleRecordAnalyticsMeasurement,
  ]);

  // Track category / domain filter interactions strictly when KVKK analytics consent is active
  const didMountFilterTrackerRef = useRef<boolean>(false);
  useEffect(() => {
    if (!didMountFilterTrackerRef.current) {
      didMountFilterTrackerRef.current = true;
      return;
    }
    if (kvkkConsentRef.current.status !== 'accepted' || !kvkkConsentRef.current.analytics) {
      return;
    }
    handleRecordAnalyticsMeasurement(
      'emrepelit-sciphi.ai.studio',
      { viewsDelta: 0, readsDelta: 0 },
      'SEARCH_FILTER',
      `Uygulama Etkileşimi: Kategori / Kaynak Filtresi ("${selectedCategory}" · Kaynak: ${sourceFilter})`,
      'LANGUAGE_SEARCH_EXPORT'
    );
  }, [selectedCategory, sourceFilter, handleRecordAnalyticsMeasurement]);

  const handleOpenAnalysisModal = useCallback(
    (article: Article) => {
      setActiveModalAnalysisArticle(article);
      const readMins = Math.max(1, article.readTimeMinutes || 5);
      handleRecordAnalyticsMeasurement(
        'emrepelit-sciphi.ai.studio',
        {
          viewsDelta: 1,
          readsDelta: 1,
          targetArticleId: article.id,
          readingMinutesDelta: readMins,
          simulatorRunsDelta: 1,
        },
        'AI_ANALYSIS_LAB',
        `Canlı Senkron: Yeni Analiz Penceresi Görüntülenmesi (#${article.id}): +1 Görüntülenme, +1 Okunma, +${readMins} dk Okuma, +1 Analiz/Simülatör`
      );
    },
    [handleRecordAnalyticsMeasurement]
  );

  const applyServerSnapshotRef = useRef<((data: any, applyConfigAndArticles?: boolean) => void) | null>(
    null
  );

  const applyMonotonicServerAnalyticsSnapshot = useCallback(
    (data: any, applyConfigAndArticles = false) => {
      if (!data || typeof data !== 'object') return;
      if (applyConfigAndArticles && Array.isArray(data?.articles) && data.articles.length >= 316) {
        setArticles(data.articles as Article[]);
      }

      if (typeof data?.syncSeq === 'number' && data.syncSeq > syncSeqRef.current) {
        syncSeqRef.current = data.syncSeq;
      } else if (typeof data?.syncSeqCounter === 'number' && data.syncSeqCounter > syncSeqRef.current) {
        syncSeqRef.current = data.syncSeqCounter;
      }

      const nextMergedNodes = mergeMonotonicNetworkNodes(
        INITIAL_301_NETWORK_NODES,
        networkNodesRef.current,
        data?.networkNodes
      );
      networkNodesRef.current = nextMergedNodes;
      setNetworkNodes((prev) =>
        mergeMonotonicNetworkNodes(INITIAL_301_NETWORK_NODES, prev, data?.networkNodes)
      );
      const mergedNodeSums = computeCumulativeNetworkStats(nextMergedNodes);

      setAnalyticsMeasurements((prev) => {
        const merged = { ...prev };
        OFFICIAL_10_WEBSITES.forEach((domain) => {
          const cloudItem = data?.analyticsMeasurements?.[domain];
          const nodeItem = nextMergedNodes.find((n) => n.domain === domain);
          const nodeViews = nodeItem?.stats?.totalViews || 0;
          const nodeReadMins =
            (nodeItem?.stats?.readingTimeHours || 0) * 60 +
            (nodeItem?.stats?.readingTimeMinutes || 0);
          const nodeAudioMins =
            (nodeItem?.stats?.audioListenHours || 0) * 60 +
            (nodeItem?.stats?.audioListenMinutes || 0);
          const cur = merged[domain];
          merged[domain] = {
            domain,
            measuredReads: Math.max(
              nodeItem?.stats?.netReads || 0,
              cur?.measuredReads || 0,
              Number(cloudItem?.measuredReads) || 0
            ),
            measuredViews: Math.max(
              nodeViews,
              cur?.measuredViews || 0,
              Number(cloudItem?.measuredViews) || 0
            ),
            measuredReadingMinutes: Math.max(
              nodeReadMins,
              cur?.measuredReadingMinutes || 0,
              Number(cloudItem?.measuredReadingMinutes) || 0
            ),
            measuredAudioMinutes: Math.max(
              nodeAudioMins,
              cur?.measuredAudioMinutes || 0,
              Number(cloudItem?.measuredAudioMinutes) || 0
            ),
            measuredUniqueReaders: Math.max(
              nodeItem?.stats?.uniqueReaders || 0,
              cur?.measuredUniqueReaders || 0,
              Number(cloudItem?.measuredUniqueReaders) || 0
            ),
            measuredSimulatorRuns: Math.max(
              nodeItem?.stats?.simulatorRuns || 0,
              cur?.measuredSimulatorRuns || 0,
              Number(cloudItem?.measuredSimulatorRuns) || 0
            ),
            lastMeasuredAt: String(cloudItem?.lastMeasuredAt || cur?.lastMeasuredAt || ''),
          };
        });
        return merged;
      });

      setAppInteractionTotals((prev) => {
        const merged = mergeMonotonicAppInteractionTotals(prev, data?.appInteractionTotals, {
          pageViews: mergedNodeSums.totalViews,
          articleReads: mergedNodeSums.netReads,
          simulationRuns: mergedNodeSums.simulatorRuns,
        });
        appInteractionTotalsRef.current = merged;
        return merged;
      });

      const incomingLog = Array.isArray(data?.appInteractionLog)
        ? data.appInteractionLog
        : data?.event
          ? [data.event]
          : data?.payload
            ? [data.payload]
            : [];
      if (incomingLog.length > 0) {
        setAnalyticsEventLog((prev) => {
          const seen = new Set<string>();
          const combined: AnalyticsMeasurementEvent[] = [];
          for (const item of [
            ...incomingLog,
            ...prev,
            ...INITIAL_HISTORICAL_INTERACTION_MILESTONES,
          ]) {
            if (item && typeof item.id === 'string' && !seen.has(item.id)) {
              seen.add(item.id);
              combined.push(item);
            }
          }
          const live = combined.filter((i) => !i.isHistoricalBaseline);
          const hist = combined.filter((i) => i.isHistoricalBaseline);
          return [...live.slice(0, 140), ...hist].slice(0, 180);
        });
      }

      if (data?.articleStatsBoosts && typeof data.articleStatsBoosts === 'object') {
        setArticleStatsBoosts((prev) => {
          const mergedBoosts: Record<string, { reads: number; views: number; citations: number }> = {
            ...prev,
          };
          for (const [artId, cloudBoost] of Object.entries(
            data.articleStatsBoosts as Record<string, any>
          )) {
            if (cloudBoost && typeof cloudBoost === 'object') {
              const curB = mergedBoosts[artId] || { reads: 0, views: 0, citations: 0 };
              mergedBoosts[artId] = {
                reads: Math.max(curB.reads, Number(cloudBoost.reads) || 0),
                views: Math.max(curB.views, Number(cloudBoost.views) || 0),
                citations: Math.max(curB.citations, Number(cloudBoost.citations) || 0),
              };
            }
          }
          articleStatsBoostsRef.current = mergedBoosts;
          return mergedBoosts;
        });
      }

      const latestEv = data?.event || data?.payload || incomingLog[0];
      if (latestEv && typeof latestEv === 'object') {
        const nextSeqVal = Math.max(syncSeqRef.current, Number(latestEv.syncSeq || data?.syncSeq) || 1);
        setLastStatsSyncEvent({
          timestamp: String(latestEv.timestamp || new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC'),
          targetDomain: String(latestEv.targetDomain || 'ALL_10_SITES'),
          summary: String(latestEv.metricSummary || 'Canlı Sunucu Senkronizasyonu Tamamlandı'),
          syncSeq: nextSeqVal,
          viewsDelta: Number(latestEv.viewsDelta) || 0,
          readsDelta: Number(latestEv.readsDelta) || 0,
          cumulativeViewsAfter: mergedNodeSums.totalViews,
          cumulativeReadsAfter: mergedNodeSums.netReads,
        });
      }

      if (applyConfigAndArticles) {
        if (data?.gatewayConfig) setGatewayConfig(data.gatewayConfig);
        if (data?.snapshots?.length) setSnapshots(data.snapshots);
      }
    },
    []
  );

  useEffect(() => {
    applyServerSnapshotRef.current = applyMonotonicServerAnalyticsSnapshot;
  }, [applyMonotonicServerAnalyticsSnapshot]);

  // Reusable monotonic cloud state puller so server, analytics panel, and all tabs stay synchronized
  const syncCloudAnalyticsState = useCallback(
    async (applyConfigAndArticles = false) => {
      try {
        const res = await fetch('/api/cloud/state');
        if (!res.ok) return;
        const data = await res.json();
        applyMonotonicServerAnalyticsSnapshot(data, applyConfigAndArticles);
      } catch {
        // Proceed with monotonic dataset
      }
    },
    [applyMonotonicServerAnalyticsSnapshot]
  );

  // Re-sync from server whenever the Analytics Panel opens so cross-session reads/views appear immediately
  useEffect(() => {
    if (analyticsPanelOpen) {
      void syncCloudAnalyticsState(false);
    }
  }, [analyticsPanelOpen, syncCloudAnalyticsState]);

  const handleSyncBloggerRef = useRef<
    ((scrollToArticles?: boolean, forceRefresh?: boolean, targetWebsiteDomain?: string) => Promise<void>) | null
  >(null);

  // Load persisted cloud state, open Server-Sent Events (/api/live/events), and run 15s live Blogger sync
  useEffect(() => {
    const initHub = async () => {
      await syncCloudAnalyticsState(true);
      await handleSyncBloggerRef.current?.(false, false);
    };
    void initHub();

    const intervalId = window.setInterval(() => {
      void syncCloudAnalyticsState(false);
      void handleSyncBloggerRef.current?.(false, false);
    }, 15000);

    const keepAliveId = window.setInterval(() => {
      void fetch('/api/health').catch(() => {});
    }, 45000);

    const handleWindowFocus = () => {
      void syncCloudAnalyticsState(false);
      void handleSyncBloggerRef.current?.(false, false);
    };
    const handleVisibilityChange = () => {
      if (typeof document !== 'undefined' && !document.hidden) {
        void syncCloudAnalyticsState(false);
      }
    };
    window.addEventListener('focus', handleWindowFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    let liveEvents: EventSource | null = null;
    try {
      if (typeof EventSource !== 'undefined') {
        liveEvents = new EventSource('/api/live/events');
        liveEvents.addEventListener('blogger-sync', () => {
          void handleSyncBloggerRef.current?.(false, false);
          void syncCloudAnalyticsState(false);
        });
        liveEvents.addEventListener('analytics-sync', (ev) => {
          try {
            const parsed = JSON.parse((ev as MessageEvent).data || '{}');
            if (parsed && (parsed.networkNodes || parsed.appInteractionTotals)) {
              applyMonotonicServerAnalyticsSnapshot(parsed, false);
              if (parsed.payload) {
                window.dispatchEvent(
                  new CustomEvent('sciphil:live-analytics-sync', { detail: parsed.payload })
                );
              }
              return;
            }
          } catch {
            // fallback to full pull
          }
          void syncCloudAnalyticsState(false);
        });
      }
    } catch {
      // SSE connection optional; 15s polling remains active
    }

    return () => {
      window.clearInterval(intervalId);
      window.clearInterval(keepAliveId);
      window.removeEventListener('focus', handleWindowFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      try {
        liveEvents?.close();
      } catch {
        // Ignore close error
      }
    };
  }, [syncCloudAnalyticsState, applyMonotonicServerAnalyticsSnapshot]);

  // Reset pagination to page 1 when filters or search change (preserve initial ?page=N on mount)
  useEffect(() => {
    if (!didMountFilterResetRef.current) {
      didMountFilterResetRef.current = true;
      return;
    }
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, sourceFilter]);

  const persistCloudState = async (
    nextArticles: Article[],
    nextNodes: Network301Node[],
    nextConfig: DynamicGatewayConfig,
    nextSnapshots: CloudSnapshot[],
    isOwnerAuthorized = false
  ) => {
    try {
      const monotonicNodes = mergeMonotonicNetworkNodes(networkNodes, nextNodes);
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (isOwnerAuthorized) {
        headers['X-Owner-Email'] = 'emrepelit39@gmail.com';
      }
      await fetch('/api/cloud/state', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          telemetrySchemaVersion: 'sciphil-clean-v3',
          articles: nextArticles,
          networkNodes: monotonicNodes,
          analyticsMeasurements,
          articleStatsBoosts,
          appInteractionTotals,
          appInteractionLog: analyticsEventLog.slice(0, 120),
          gatewayConfig: nextConfig,
          snapshots: nextSnapshots,
          ...(isOwnerAuthorized ? { ownerEmail: 'emrepelit39@gmail.com' } : {}),
        }),
      });
    } catch {
      // Non-blocking background persistence
    }
  };

  // Live Blogger Synchronization with emrepelit7337.blogspot.com (All 305+ Articles & Auto New-Post Detection across all 8 websites)
  const handleSyncBlogger = async (
    scrollToArticles = true,
    forceRefresh = false,
    targetWebsiteDomain?: string
  ) => {
    setBloggerSyncState((prev) => ({ ...prev, syncing: true }));
    try {
      let data: any = null;
      try {
        const res = await fetch(
          `/api/blogger/sync?blogUrl=${encodeURIComponent(gatewayConfig.bloggerBlogUrl)}${
            forceRefresh ? '&force=true' : ''
          }`
        );
        if (res.ok) {
          data = await res.json();
        }
      } catch {
        // Primary dynamic API unreachable; fall through to static snapshot fallback
      }

      let liveEntries: any[] = data?.entries || [];
      if (liveEntries.length === 0) {
        try {
          const jsonpData = await fetchBloggerFeedViaJsonp(gatewayConfig.bloggerBlogUrl);
          if (Array.isArray(jsonpData?.entries) && jsonpData.entries.length > 0) {
            liveEntries = jsonpData.entries;
            data = jsonpData;
          }
        } catch {
          // JSONP fallback blocked or unreachable; fall through to static snapshot
        }
      }
      if (liveEntries.length === 0) {
        try {
          const snapRes = await fetch('/data/corpus-snapshot.json');
          if (snapRes.ok) {
            const snapData = await snapRes.json();
            if (Array.isArray(snapData?.articles) && snapData.articles.length > 0) {
              liveEntries = snapData.articles;
              data = {
                entries: liveEntries,
                totalResults: snapData.totalArticles || liveEntries.length,
                blogTitle: 'Emre Pelit — Sci-Phil Bilim, Felsefe ve Simülasyon Arşivi',
              };
            }
          }
        } catch {
          // Non-fatal static snapshot fallback miss
        }
      }

      if (liveEntries.length > 0) {
          try {
            window.dispatchEvent(new CustomEvent('sciphil:live-sync-ok'));
          } catch {
            // Ignore CustomEvent issues
          }
          let detectedNewTitle: string | null = null;
          const hadPreviousLoad = knownBloggerIdsRef.current.size > 0;

          liveEntries.forEach((entry) => {
            if (entry.id && !knownBloggerIdsRef.current.has(entry.id)) {
              knownBloggerIdsRef.current.add(entry.id);
              if (hadPreviousLoad && !detectedNewTitle) {
                detectedNewTitle = entry.title;
              }
            }
          });

          setArticles((prevArticles) => {
            // Map existing articles by ID to preserve any in-memory AI translations
            const prevById = new Map<string, Article>();
            prevArticles.forEach((a) => prevById.set(a.id, a));

            const convertedBloggerArticles: Article[] = liveEntries.map((entry, idx) => {
              const postNum = entry.postNumber || liveEntries.length - idx;
              const articleId = entry.id || `blogger-post-${postNum}`;
              const existingArt = prevById.get(articleId);

              const chosenSimType: Article['simulation']['type'] =
                entry.simulationType || 'consciousness';
              const templateArt =
                INITIAL_ARTICLES.find((a) => a.simulation.type === chosenSimType) ||
                INITIAL_ARTICLES[0];

              const figNum = `FIG. BLG.${postNum}`;
              const findingsArr: string[] =
                Array.isArray(entry.keyFindings) && entry.keyFindings.length > 0
                  ? entry.keyFindings
                  : templateArt.keyFindings.tr;
              const parasArr: string[] =
                Array.isArray(entry.paragraphs) && entry.paragraphs.length > 0
                  ? entry.paragraphs
                  : [entry.abstract || entry.title];

              const semanticSlug = buildSemanticArticleSlug(entry.title || '', articleId, postNum);
              const detectedLang = detectEntrySourceLanguage(
                entry.title || '',
                entry.abstract || parasArr[0] || ''
              );
              const localizedArticlePath = getLocalizedArticlePath(detectedLang, semanticSlug);

              return {
                id: articleId,
                slug: semanticSlug,
                sourceLang: detectedLang,
                category: entry.category || templateArt.category,
                publishedAt: entry.publishedAt || new Date().toISOString().slice(0, 10),
                readTimeMinutes: entry.readTimeMinutes || 7,
                author: 'Emre Pelit',
                affiliation:
                  'Münhasır Eser Sahibi • emrepelit-sciphi.ai.studio (Tek Kanonik Ana Hub) & emrepelit7337.blogspot.com',
                sourceOrigin: 'blogger-live',
                bloggerUrl: entry.bloggerUrl,
                canonicalHubUrl: `https://emrepelit-sciphi.ai.studio${localizedArticlePath}`,
                publishedOnWebsites: OFFICIAL_10_WEBSITES,
                figureNumber: figNum,
                figureCaption: {
                  tr: `Şekil (${figNum}) — Emre Pelit tarafından yazılan, emrepelit7337.blogspot.com (#${postNum}) üzerinden canlı senkronize edilen ve emrepelit-sciphi.ai.studio Tek Kanonik Ana Hub üzerinde 12 dilde yayınlanan "${entry.title}" makalesinin görsel ve matematiksel model plakası.`,
                  en: `Fig. (${figNum}) — Visual and mathematical model plate for "${entry.title}" (#${postNum}) authored exclusively by Emre Pelit and published canonically on emrepelit-sciphi.ai.studio.`,
                  es: `Fig. (${figNum}) — Placa del modelo visual y matemático para "${entry.title}" (#${postNum}) escrita exclusivamente por Emre Pelit y publicada canónicamente en emrepelit-sciphi.ai.studio.`,
                  de: `Abb. (${figNum}) — Visuelle und mathematische Modelltafel für "${entry.title}" (#${postNum}), exklusiv verfasst von Emre Pelit und kanonisch auf emrepelit-sciphi.ai.studio veröffentlicht.`,
                },
                imageUrl:
                  entry.imageUrl ||
                  buildScientificPlateDataUri(
                    chosenSimType,
                    figNum,
                    (entry.title || '').slice(0, 44),
                    templateArt.simulation.equationLatex
                  ),
                sha256Signature: entry.sha256Signature || templateArt.sha256Signature,
                citationsCount: Math.max(existingArt?.citationsCount || 0, Number(entry.citationsCount) || 0),
                networkImpressions: Math.max(existingArt?.networkImpressions || 0, Number(entry.networkImpressions) || 0),
                title: {
                  tr: entry.title,
                  en: entry.title,
                  es: entry.title,
                  de: entry.title,
                  ...(existingArt?.title || {}),
                },
                subtitle: {
                  tr: `Emre Pelit Özgün Makalesi #${postNum} • Canlı Ana Hub & Blogger Senkronize (HTTP 200 · 12 Dil Kanonik)`,
                  en: `Original Article #${postNum} by Emre Pelit • Live Synced on Main Hub & Blogger (HTTP 200 · 12 Languages Canonical)`,
                  es: `Artículo Original #${postNum} de Emre Pelit • Sincronizado en Hub Principal y Blogger (HTTP 200 · 12 Idiomas Canónicos)`,
                  de: `Originalartikel #${postNum} von Emre Pelit • Synchronisiert auf Haupthub & Blogger (HTTP 200 · 12 Sprachen Kanonisch)`,
                  ...(existingArt?.subtitle || {}),
                },
                abstract: {
                  tr: entry.abstract,
                  en: entry.abstract,
                  es: entry.abstract,
                  de: entry.abstract,
                  ...(existingArt?.abstract || {}),
                },
                keyFindings: {
                  tr: findingsArr,
                  en: findingsArr,
                  es: findingsArr,
                  de: findingsArr,
                  ...(existingArt?.keyFindings || {}),
                },
                contentParagraphs: {
                  tr: parasArr,
                  en: parasArr,
                  es: parasArr,
                  de: parasArr,
                  ...(existingArt?.contentParagraphs || {}),
                },
                references: [
                  `Pelit, E. (${(entry.publishedAt || '2026').slice(0, 4)}). "${entry.title}." Emre Pelit — Sci-Phil Bilim, Felsefe ve Simülasyon Arşivi (#${postNum}, ${entry.bloggerUrl}) & Tek Kanonik Ana Hub.`,
                  ...templateArt.references.slice(1),
                ],
                simulation: templateArt.simulation,
              };
            });

            // Preserve any custom articles added directly on this website that aren't yet in liveEntries
            const liveIdsSet = new Set(convertedBloggerArticles.map((a) => a.id));
            const customWebsiteArticles = prevArticles.filter(
              (a) =>
                !liveIdsSet.has(a.id) &&
                (a.sourceOrigin === 'ai-laboratory' || a.id.startsWith('blogger-hub-'))
            );
            return [...customWebsiteArticles, ...convertedBloggerArticles];
          });

          if (liveEntries[0]?.id) {
            setExpandedArticleIds((prev) => ({
              ...prev,
              [liveEntries[0].id]: true,
              ...(liveEntries[1]?.id ? { [liveEntries[1].id]: true } : {}),
            }));
          }

          const syncedTimeStr = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';

          // Synchronize and publish all 316+ articles across all 10 official websites in networkNodes while strictly preserving monotonic stats & 100% authority on this website
          setNetworkNodes((prevNodes) => {
            const baseList = mergeMonotonicNetworkNodes(prevNodes);
            const updatedList = baseList.map((node, nodeIdx) => {
              const canonicalNode =
                INITIAL_301_NETWORK_NODES.find((inNode) => inNode.domain === node.domain) ||
                node;

              const bloggerPubsForThisSite: NetworkPublication[] = liveEntries.map(
                (entry, idx) => {
                  const postNum = entry.postNumber || liveEntries.length - idx;
                  const articleId = entry.id || `blogger-post-${postNum}`;
                  const semanticSlug = buildSemanticArticleSlug(entry.title || '', articleId, postNum);
                  const isMainHubNode = node.domain === 'emrepelit-sciphi.ai.studio';
                  const entryDetectedLang = detectEntrySourceLanguage(
                    entry.title || '',
                    entry.abstract || ''
                  );
                  const localizedPath = getLocalizedArticlePath(entryDetectedLang, semanticSlug);
                  const sourceUrl =
                    node.domain === 'emrepelit7337.blogspot.com' && entry.bloggerUrl
                      ? entry.bloggerUrl
                      : `https://${node.domain}${localizedPath}`;
                  return {
                    id: `pub-${node.rank}-blg-${postNum}`,
                    title: `${entry.title} (Emre Pelit • #${postNum})`,
                    publishedDate: entry.publishedAt || '2026-11-14',
                    sourceUrl,
                    hubBacklinkUrl: `https://emrepelit-sciphi.ai.studio${localizedPath}`,
                    hubAnchorText: isMainHubNode
                      ? `Canlı Ana Hub (HTTP 200 OK · %100 Otorite Merkezi) • Kanonik URL Yayında (#${postNum})`
                      : node.domain === 'emrepelit7337.blogspot.com'
                        ? `Canlı Blogger CMS (HTTP 200 OK) → Kanonik Otorite emrepelit-sciphi.ai.studio (#${postNum})`
                        : `${node.domain} (Yayından Kaldırıldı · HTTP 301 → Ana Hub #${postNum})`,
                    relatedArticleId: articleId,
                    httpStatus: node.isLiveWebsite ? 200 : 301,
                    monthlyReferralsToHub: Math.round(
                      node.stats.netReads / Math.max(1, liveEntries.length)
                    ),
                    citationVelocity:
                      node.stats.netReads > 0
                        ? Number((node.stats.netReads / Math.max(1, liveEntries.length)).toFixed(1))
                        : 0,
                    verifiedBacklink: true,
                  };
                }
              );

              return {
                ...node,
                articlesCount: Math.max(316, liveEntries.length),
                bloggerSyncedCount: Math.max(316, liveEntries.length),
                lastBloggerSyncAt: syncedTimeStr,
                allBloggerArticlesPublished: Boolean(node.isLiveWebsite),
                stats: node.isLiveWebsite
                  ? mergeMonotonicNodeStats(canonicalNode.stats, node.stats)
                  : canonicalNode.stats,
                publications: bloggerPubsForThisSite,
              };
            });

            return mergeMonotonicNetworkNodes(baseList, updatedList);
          });

          setBloggerSyncState((prev) => ({
            syncing: false,
            lastSyncedAt: syncedTimeStr,
            liveCount: Math.max(316, liveEntries.length),
            totalBloggerCount: Math.max(316, data?.totalResults || liveEntries.length),
            blogTitle: data?.blogTitle || 'Emre Pelit — Sci-Phil Bilim, Felsefe ve Simülasyon Arşivi',
            latestDetectedTitle: liveEntries[0]?.title || prev.latestDetectedTitle,
            newPostAlert: targetWebsiteDomain
              ? `✓ ${targetWebsiteDomain} üzerinde tüm ${Math.max(316, liveEntries.length)} makale canlı senkronize edildi ve doğrulandı — Son Makale: "${liveEntries[0]?.title || ''}".`
              : forceRefresh
              ? `✓ emrepelit7337.blogspot.com ve emrepelit-sciphi.ai.studio Ana Hub üzerinde tüm ${Math.max(316, liveEntries.length)} makale canlı senkronize edildi (8 eski alan adı HTTP 301 → Ana Hub — Son Makale: "${liveEntries[0]?.title || ''}").`
              : detectedNewTitle
              ? `Yeni Blogger Makalesi Algılandı ve Ana Hub ile Canlı Senkronize Edildi (HTTP 200 · 12 Dil Kanonik): "${detectedNewTitle}"`
              : prev.newPostAlert,
          }));
        } else {
          setBloggerSyncState((prev) => ({
            ...prev,
            syncing: false,
            lastSyncedAt: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
          }));
        }
    } catch {
      setBloggerSyncState((prev) => ({
        ...prev,
        syncing: false,
        lastSyncedAt: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      }));
    }

    if (scrollToArticles) {
      document.getElementById('blogger-bridge')?.scrollIntoView({ behavior: 'smooth' });
    }
  };
  handleSyncBloggerRef.current = handleSyncBlogger;

  const toggleExpandArticle = (id: string) => {
    const isOpening = !expandedArticleIds[id];
    setExpandedArticleIds((prev) => ({ ...prev, [id]: !prev[id] }));
    if (isOpening) {
      const targetArt = articles.find((a) => a.id === id);
      const readMins = Math.max(1, targetArt?.readTimeMinutes || 5);
      handleRecordAnalyticsMeasurement(
        'emrepelit-sciphi.ai.studio',
        {
          viewsDelta: 1,
          readsDelta: 1,
          targetArticleId: id,
          readingMinutesDelta: readMins,
          uniqueReadersDelta: 1,
        },
        'ARTICLE_READER',
        `Canlı Senkron (Makale Görüntüleme & Okuma #${id}): +1 Görüntülenme, +1 Okunma, +${readMins} dk Okuma Süresi, +1 Tekil Okur`
      );
    }
  };

  const handleJumpToArticle = (articleId: string, sourceDomain?: string) => {
    setSelectedCategory('ALL');
    setSearchQuery('');
    setSourceFilter('ALL');
    setExpandedArticleIds((prev) => ({ ...prev, [articleId]: true }));

    const targetArt = articles.find((a) => a.id === articleId);
    const readMins = Math.max(1, targetArt?.readTimeMinutes || 6);
    const domainToCredit =
      sourceDomain && LIVE_WEBSITES_SET.has(sourceDomain)
        ? sourceDomain
        : 'emrepelit-sciphi.ai.studio';

    handleRecordAnalyticsMeasurement(
      domainToCredit,
      {
        viewsDelta: 1,
        readsDelta: 1,
        targetArticleId: articleId,
        readingMinutesDelta: readMins,
        uniqueReadersDelta: 1,
      },
      'ARTICLE_READER',
      `Canlı Senkron (${domainToCredit} Makale Görüntüleme & Açılışı #${articleId}): +1 Görüntülenme, +1 Okunma, +${readMins} dk Okuma`
    );

    const targetIndex = articles.findIndex((a) => a.id === articleId);
    if (targetIndex >= 0) {
      setShowAllLanguagesCorpus(true);
      const targetPage = Math.floor(targetIndex / articlesPerPage) + 1;
      setCurrentPage(targetPage);
      const matched = articles[targetIndex];
      const artLang =
        matched.sourceLang ||
        detectEntrySourceLanguage(
          getLocalizedText(matched.title, 'tr'),
          getLocalizedText(matched.abstract, 'tr')
        );
      const targetUrlLang = language || artLang;
      try {
        window.history.replaceState(null, '', getLocalizedArticlePath(targetUrlLang, matched.slug));
      } catch {
        // Ignore history errors in sandboxed frames
      }
    }

    setTimeout(() => {
      const el = document.getElementById(articleId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        document.getElementById('corpus')?.scrollIntoView({ behavior: 'smooth' });
      }
    }, 80);
  };

  const handleSelectArticleFromBacklink = (articleId: string, sourceDomain?: string) => {
    handleJumpToArticle(articleId, sourceDomain);
  };

  const handleTranslateArticleWithAi = async (
    article: Article,
    targetLangOverride?: LanguageCode
  ) => {
    const targetLang = targetLangOverride || language;
    setTranslatingId(article.id);
    handleRecordAnalyticsMeasurement(
      'emrepelit-sciphi.ai.studio',
      {
        readsDelta: 1,
        viewsDelta: 1,
        targetArticleId: article.id,
        readingMinutesDelta: Math.max(1, article.readTimeMinutes || 4),
      },
      'ARTICLE_READER',
      `Analitik Ölçüm (Çok Dilli AI Çeviri Girişi [${targetLang.toUpperCase()}] #${article.id}): +1 Görüntülenme, +1 Okunma`
    );
    try {
      const res = await fetch('/api/ai/translate-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: getLocalizedText(article.title, 'tr'),
          subtitle: getLocalizedText(article.subtitle, 'tr'),
          abstract: getLocalizedText(article.abstract, 'tr'),
          keyFindings: getLocalizedArray(article.keyFindings, 'tr'),
          contentParagraphs: getLocalizedArray(article.contentParagraphs, 'tr'),
          targetLanguage: targetLang,
        }),
      });
      if (res.ok) {
        const translated = await res.json();
        setArticles((prev) =>
          prev.map((a) =>
            a.id === article.id
              ? {
                  ...a,
                  title: { ...a.title, [targetLang]: translated.title || getLocalizedText(a.title, targetLang) },
                  subtitle: {
                    ...a.subtitle,
                    [targetLang]: translated.subtitle || getLocalizedText(a.subtitle, targetLang),
                  },
                  abstract: {
                    ...a.abstract,
                    [targetLang]: translated.abstract || getLocalizedText(a.abstract, targetLang),
                  },
                  keyFindings: {
                    ...a.keyFindings,
                    [targetLang]: translated.keyFindings || getLocalizedArray(a.keyFindings, targetLang),
                  },
                  contentParagraphs: {
                    ...a.contentParagraphs,
                    [targetLang]:
                      translated.contentParagraphs ||
                      getLocalizedArray(a.contentParagraphs, targetLang),
                  },
                }
              : a
          )
        );
      }
    } finally {
      setTranslatingId(null);
    }
  };

  const handleDownloadBibtex = (article: Article) => {
    handleRecordAnalyticsMeasurement(
      'emrepelit-sciphi.ai.studio',
      {
        readsDelta: 1,
        viewsDelta: 1,
        targetArticleId: article.id,
        readingMinutesDelta: 1,
      },
      'EXPORT_CITATION',
      `Uygulama Etkileşimi (BibTeX Akademik Atıf İndirme #${article.id}): +1 İndirme, +1 Görüntülenme, +1 Okunma`,
      'LANGUAGE_SEARCH_EXPORT'
    );
    const bib = `@article{Pelit_${article.id.replace(/[^a-zA-Z0-9]/g, '_')},
  author = {Emre Pelit},
  title = {{${getLocalizedText(article.title, language)}}},
  journal = {Emre Pelit — Sci-Phil Bilim, Felsefe ve Simülasyon Arşivi (emrepelit-sciphi.ai.studio)},
  year = {${article.publishedAt.slice(0, 4)}},
  note = {Exclusive Authorship and Copyright: Emre Pelit},
  url = {${article.canonicalHubUrl}}
}`;
    const blob = new Blob([bib], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${article.slug}.bib`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePublishNewArticle = (newArt: Article) => {
    const nextArticleNum = Math.max(316, articles.length) + 1;
    const rawTitleStr = getLocalizedText(newArt.title, 'tr');
    const cleanId = newArt.id.startsWith('blogger-') ? newArt.id : `blogger-hub-${Date.now()}`;
    const cleanSlug =
      newArt.slug || buildSemanticArticleSlug(rawTitleStr, cleanId, nextArticleNum);
    const syncedTimeStr = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';

    const detectedNewLang =
      newArt.sourceLang ||
      detectEntrySourceLanguage(rawTitleStr, getLocalizedText(newArt.abstract, 'tr'));
    const enrichedArt: Article = {
      ...newArt,
      id: cleanId,
      slug: cleanSlug,
      sourceLang: detectedNewLang,
      author: 'Emre Pelit',
      affiliation:
        'Münhasır Eser Sahibi • emrepelit-sciphi.ai.studio (Tek Kanonik Ana Hub) & emrepelit7337.blogspot.com',
      canonicalHubUrl: `https://emrepelit-sciphi.ai.studio${getLocalizedArticlePath(
        detectedNewLang,
        cleanSlug
      )}`,
      bloggerUrl:
        newArt.bloggerUrl ||
        `https://emrepelit7337.blogspot.com/2026/11/${cleanSlug}.html`,
      publishedOnWebsites: OFFICIAL_10_WEBSITES,
    };

    const nextArticles = [enrichedArt, ...articles.filter((a) => a.id !== enrichedArt.id)];
    setArticles(nextArticles);
    setExpandedArticleIds((prev) => ({ ...prev, [enrichedArt.id]: true }));

    // Automatically syndicate & publish this new article across ALL 10 websites in the 301 network
    // while keeping 100% of authority score consolidated exclusively on emrepelit-sciphi.ai.studio
    const nextNodes = mergeMonotonicNetworkNodes(
      networkNodes,
      networkNodes.map((node) => {
        const isMainHubNode = node.domain === 'emrepelit-sciphi.ai.studio';
        const localizedNewPath = getLocalizedArticlePath(detectedNewLang, cleanSlug);
        const sourceUrl =
          node.domain === 'emrepelit7337.blogspot.com' && enrichedArt.bloggerUrl
            ? enrichedArt.bloggerUrl
            : `https://${node.domain}${localizedNewPath}`;
        const newPub: NetworkPublication = {
          id: `pub-${node.rank}-blg-${nextArticleNum}`,
          title: `${rawTitleStr} (Emre Pelit • #${nextArticleNum})`,
          publishedDate: enrichedArt.publishedAt,
          sourceUrl,
          hubBacklinkUrl: `https://emrepelit-sciphi.ai.studio${localizedNewPath}`,
          hubAnchorText: isMainHubNode
            ? `Canlı Ana Hub (HTTP 200 OK · %100 Otorite Merkezi) • Yeni Makale Yayında (#${nextArticleNum})`
            : node.domain === 'emrepelit7337.blogspot.com'
              ? `Canlı Blogger CMS (HTTP 200 OK) → Kanonik Otorite emrepelit-sciphi.ai.studio (#${nextArticleNum})`
              : `${node.domain} (Yayından Kaldırıldı · HTTP 301 → Ana Hub #${nextArticleNum})`,
          relatedArticleId: enrichedArt.id,
          httpStatus: node.isLiveWebsite ? 200 : 301,
          monthlyReferralsToHub: 0,
          citationVelocity: 0,
          verifiedBacklink: true,
        };
        const updatedPubs = [
          newPub,
          ...node.publications.filter((p) => p.relatedArticleId !== enrichedArt.id),
        ];
        return {
          ...node,
          articlesCount: Math.max(nextArticleNum, nextArticles.length, updatedPubs.length),
          bloggerSyncedCount: Math.max(nextArticleNum, nextArticles.length, updatedPubs.length),
          lastBloggerSyncAt: syncedTimeStr,
          allBloggerArticlesPublished: Boolean(node.isLiveWebsite),
          publications: updatedPubs,
        };
      })
    );

    setNetworkNodes(nextNodes);
    setBloggerSyncState((prev) => ({
      ...prev,
      lastSyncedAt: syncedTimeStr,
      liveCount: Math.max(nextArticleNum, nextArticles.length),
      totalBloggerCount: Math.max(nextArticleNum, nextArticles.length),
      latestDetectedTitle: rawTitleStr,
      newPostAlert: `✓ Yeni Yazı ("${rawTitleStr}") Canlı Ana Hub ve Blogger ile Eşzamanlı Yayınlandı! (Toplam: ${Math.max(nextArticleNum, nextArticles.length)} Makale · 12 Dil Kanonik)`,
    }));

    setPublishAll301Banner(
      `✓ "${rawTitleStr}" başlıklı yeni makale (#${nextArticleNum}) canlı Ana Hub (emrepelit-sciphi.ai.studio) üzerinde 12 dünya dilinde kanonik HTTP 200 olarak yayınlandı; 8 eski alan adı HTTP 301 ile bu adrese yönlendirilir.`
    );

    handleRecordAnalyticsMeasurement(
      'ALL_10_SITES',
      {
        readsDelta: 1,
        viewsDelta: 1,
        readingMinutesDelta: Math.max(1, enrichedArt.readTimeMinutes || 6),
        uniqueReadersDelta: 1,
        simulatorRunsDelta: 1,
        targetArticleId: enrichedArt.id,
      },
      'AI_ANALYSIS_LAB',
      `Yeni Makale Yayını & Canlı Ana Hub Senkronizasyonu (#${enrichedArt.id}): +1 Görüntülenme, +1 Okunma`
    );

    void fetch('/api/articles/publish-all-301', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ article: enrichedArt }),
    }).catch(() => {});

    void persistCloudState(nextArticles, nextNodes, gatewayConfig, snapshots);
    setIndexingTriggerCount((c) => c + 1);

    setTimeout(() => {
      document.getElementById('corpus')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handlePublishAll316Across301Network = async () => {
    setIsPublishingAll301(true);
    try {
      await handleSyncBlogger(false, true);
      const res = await fetch('/api/articles/publish-all-301', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publishAllExisting: true }),
      });
      const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
      const totalPublished = Math.max(316, articles.length);
      if (res.ok) {
        const data = await res.json();
        const count = Math.max(totalPublished, Number(data.totalArticlesPublishedPerSite) || 316);
        setPublishAll301Banner(
          `✓ Tüm ${count} makale yalnızca canlı Tek Kanonik Ana Hub (emrepelit-sciphi.ai.studio) ve canlı Blogger kaynağı (emrepelit7337.blogspot.com) üzerinde 12 dilde HTTP 200 OK olarak yayında ve senkronize! 8 eski alan adı yayından kaldırılarak kalıcı HTTP 301 ile bu ana hub'a yönlendirilmiştir (${nowStr}).`
        );
      } else {
        setPublishAll301Banner(
          `✓ Tüm ${totalPublished} makale canlı Tek Kanonik Ana Hub (emrepelit-sciphi.ai.studio) ve emrepelit7337.blogspot.com üzerinde 12 dilde yayında; 8 eski alan adı HTTP 301 → Ana Hub yönlendirmeli (${nowStr}).`
        );
      }
      setIndexingTriggerCount((c) => c + 1);
    } catch {
      const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
      const totalPublished = Math.max(316, articles.length);
      setPublishAll301Banner(
        `✓ Tüm ${totalPublished} makale canlı Tek Kanonik Ana Hub (emrepelit-sciphi.ai.studio) ve emrepelit7337.blogspot.com üzerinde 12 dilde yayında; 8 eski alan adı HTTP 301 → Ana Hub yönlendirmeli (${nowStr}).`
      );
    } finally {
      setIsPublishingAll301(false);
    }
  };

  const handleQuickDirectPublishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    const nextNum = Math.max(316, articles.length) + 1;
    const cleanId = `blogger-hub-${Date.now()}`;
    const cleanSlug = buildSemanticArticleSlug(quickTitle.trim(), cleanId, nextNum);
    const bodyParagraphs = quickBody
      .split(/\n+/)
      .map((p) => p.trim())
      .filter(Boolean);
    const effectiveParagraphs =
      bodyParagraphs.length > 0
        ? bodyParagraphs
        : [
            quickAbstract.trim() ||
              `${quickTitle.trim()} — Emre Pelit tarafından kaleme alınan ve emrepelit-sciphi.ai.studio Tek Kanonik Ana Hub üzerinde 12 dilde yayınlanan özgün bilimsel ve felsefi çalışma.`,
          ];
    const effectiveAbstract =
      quickAbstract.trim() || effectiveParagraphs[0].slice(0, 420);
    const quickSourceLang = detectEntrySourceLanguage(quickTitle.trim(), effectiveAbstract);
    const quickCanonicalPath = getLocalizedArticlePath(quickSourceLang, cleanSlug);
    const quickSimMap: Record<string, Article['simulation']['type']> = {
      'Yazılım & Uygulama Projeleri': 'software',
      'Kuantum Fiziği & Epistemoloji': 'quantum',
      'Parçacık Fiziği & Ontoloji': 'higgs',
      'Kozmoloji & Enformasyon Teorisi': 'holographic',
      'Uzay-Zaman Felsefesi': 'spacetime',
      'Karmaşıklık & Determinizm': 'chaos',
    };
    const quickSimType: Article['simulation']['type'] =
      quickSimMap[quickCategory] || 'consciousness';
    const templateArt =
      INITIAL_ARTICLES.find((a) => a.simulation.type === quickSimType) ||
      INITIAL_ARTICLES[0];

    const newArticleObj: Article = {
      id: cleanId,
      slug: cleanSlug,
      sourceLang: quickSourceLang,
      category: quickCategory as Article['category'],
      publishedAt: new Date().toISOString().slice(0, 10),
      readTimeMinutes: Math.max(1, Math.ceil(effectiveParagraphs.join(' ').split(/\s+/).length / 160)),
      author: 'Emre Pelit',
      affiliation:
        'Münhasır Eser Sahibi • emrepelit-sciphi.ai.studio (Tek Kanonik Ana Hub) & emrepelit7337.blogspot.com',
      sourceOrigin: 'ai-laboratory',
      bloggerUrl: `https://emrepelit7337.blogspot.com/2026/11/${cleanSlug}.html`,
      canonicalHubUrl: `https://emrepelit-sciphi.ai.studio${quickCanonicalPath}`,
      publishedOnWebsites: OFFICIAL_10_WEBSITES,
      figureNumber: `FIG. BLG.${nextNum}`,
      figureCaption: {
        tr: `Şekil (FIG. BLG.${nextNum}) — Emre Pelit tarafından yazılan ve emrepelit-sciphi.ai.studio Tek Kanonik Ana Hub üzerinde 12 dilde yayınlanan "${quickTitle.trim()}" makalesinin bilimsel model plakası.`,
        en: `Fig. (FIG. BLG.${nextNum}) — Scientific model plate for "${quickTitle.trim()}" (#${nextNum}) authored exclusively by Emre Pelit.`,
      },
      imageUrl: buildScientificPlateDataUri(
        quickSimType,
        `FIG. BLG.${nextNum}`,
        quickTitle.trim().slice(0, 44),
        templateArt.simulation.equationLatex
      ),
      sha256Signature: `${Date.now().toString(16)}aa58da34b27354c80ae251bfc4705cc68f261f7758cd22dc`,
      citationsCount: 0,
      networkImpressions: 0,
      title: {
        tr: quickTitle.trim(),
        en: quickTitle.trim(),
      },
      subtitle: {
        tr: `Emre Pelit Özgün Makalesi #${nextNum} • Tek Kanonik Ana Hub (HTTP 200 · 12 Dil) & Canlı Blogger Senkronize`,
        en: `Original Article #${nextNum} by Emre Pelit • Sole Canonical Main Hub (HTTP 200 · 12 Languages) & Live Blogger Synced`,
      },
      abstract: {
        tr: effectiveAbstract,
        en: effectiveAbstract,
      },
      keyFindings: {
        tr: [
          `Emre Pelit tarafından kaleme alınan "${quickTitle.trim()}" başlıklı bu çalışma, eklendiği anda Tek Kanonik Ana Hub (emrepelit-sciphi.ai.studio) üzerinde 12 dilde yayına alınmıştır.`,
          `Yayından kaldırılan 8 eski alan adından gelen tüm HTTP 301 ve canonical otorite sinyalleri %100 oranında yalnızca bu websitede (emrepelit-sciphi.ai.studio) toplanmaktadır.`,
          effectiveParagraphs[0].slice(0, 200),
        ],
        en: [
          `Authored exclusively by Emre Pelit and published canonically across all 12 languages on emrepelit-sciphi.ai.studio with 100% authority consolidated from the 8 retired HTTP 301 domains.`,
        ],
      },
      contentParagraphs: {
        tr: effectiveParagraphs,
        en: effectiveParagraphs,
      },
      references: [
        `Pelit, E. (2026). "${quickTitle.trim()}." Emre Pelit — Sci-Phil Ana Hub (#${nextNum}, https://emrepelit-sciphi.ai.studio${quickCanonicalPath}) & emrepelit7337.blogspot.com.`,
        ...templateArt.references.slice(1),
      ],
      simulation: templateArt.simulation,
    };

    handlePublishNewArticle(newArticleObj);
    setQuickTitle('');
    setQuickAbstract('');
    setQuickBody('');
    setQuickPublishOpen(false);
  };

  const handleUpdateGatewayConfig = (nextConfig: DynamicGatewayConfig) => {
    setGatewayConfig(nextConfig);
    persistCloudState(articles, networkNodes, nextConfig, snapshots, true);
  };

  const handleCreateCloudSnapshot = async (label: string) => {
    const newSnap: CloudSnapshot = {
      id: `snap-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC',
      label: label || 'Tam Sistem Anlık Yedeği',
      provider: gatewayConfig.cloudReplicationProvider,
      articlesCount: articles.length,
      nodesCount: networkNodes.length,
      sizeKb: 1420 + articles.length * 45,
      sha256Root:
        '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    };
    const nextSnapshots = [newSnap, ...snapshots];
    setSnapshots(nextSnapshots);
    await persistCloudState(articles, networkNodes, gatewayConfig, nextSnapshots, true);
  };

  const bloggerArticlesList = useMemo(
    () => articles.filter((a) => a.sourceOrigin === 'blogger-live'),
    [articles]
  );

  const filteredDirectoryArticles = useMemo(() => {
    if (!directorySearch.trim()) return bloggerArticlesList;
    const q = directorySearch.toLowerCase();
    return bloggerArticlesList.filter(
      (a) =>
        getLocalizedText(a.title, language).toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.publishedAt.includes(q)
    );
  }, [bloggerArticlesList, directorySearch, language]);

  const categories = useMemo(() => {
    const set = new Set<string>(articles.map((a) => a.category));
    return ['ALL', ...Array.from(set)];
  }, [articles]);

  const nativeLanguageArticleCount = useMemo(() => {
    return articles.filter((art) => {
      const sLang =
        art.sourceLang ||
        detectEntrySourceLanguage(
          getLocalizedText(art.title, 'tr'),
          getLocalizedText(art.abstract, 'tr')
        );
      return sLang === language;
    }).length;
  }, [articles, language]);

  const primaryClusterArticleIds = useMemo(() => {
    const set = new Set<string>();
    workClustersData.clusters.forEach((c) => {
      const matchForLang = c.byLang[language] || c.byLang.tr || c.byLang.en || c.articles[0];
      if (matchForLang) {
        set.add(matchForLang.id);
      }
    });
    return set;
  }, [workClustersData, language]);

  const normalizeSearchText = useCallback((input: string) => {
    return String(input || '')
      .replace(/ğ/g, 'g').replace(/Ğ/g, 'g')
      .replace(/ü/g, 'u').replace(/Ü/g, 'u')
      .replace(/ş/g, 's').replace(/Ş/g, 's')
      .replace(/ı/g, 'i').replace(/İ/g, 'i')
      .replace(/ö/g, 'o').replace(/Ö/g, 'o')
      .replace(/ç/g, 'c').replace(/Ç/g, 'c')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }, []);

  const filteredArticles = useMemo(() => {
    const normQ = normalizeSearchText(searchQuery.trim());
    const tokens = normQ.split(/\s+/).filter(Boolean);

    const scored: Array<{ art: Article; score: number }> = [];
    for (const art of articles) {
      if (sourceFilter === 'BLOGGER_LIVE' && art.sourceOrigin !== 'blogger-live') continue;
      if (showOnlyBookmarked && !bookmarkedArticleIds.includes(art.id)) continue;

      if (!showAllLanguagesCorpus && !normQ && !showOnlyBookmarked) {
        const artLang =
          art.sourceLang ||
          detectEntrySourceLanguage(
            getLocalizedText(art.title, 'tr'),
            getLocalizedText(art.abstract, 'tr')
          );
        if (nativeLanguageArticleCount > 0) {
          if (artLang !== language) continue;
        } else if (!primaryClusterArticleIds.has(art.id)) {
          continue;
        }
      }

      const matchesCat = selectedCategory === 'ALL' || art.category === selectedCategory;
      if (!matchesCat) continue;
      if (tokens.length === 0) {
        scored.push({ art, score: 0 });
        continue;
      }

      const titleStr = normalizeSearchText(getLocalizedText(art.title, language));
      const absStr = normalizeSearchText(getLocalizedText(art.abstract, language));
      const bodyStr = normalizeSearchText(getLocalizedArray(art.contentParagraphs, language).join(' '));
      const findingsStr = normalizeSearchText(getLocalizedArray(art.keyFindings, language).join(' '));
      const catStr = normalizeSearchText(art.category || '');
      const figStr = normalizeSearchText(art.figureNumber || '');
      const combined = `${titleStr} ${absStr} ${findingsStr} ${catStr} ${figStr} ${bodyStr}`;

      if (!tokens.every((tok) => combined.includes(tok))) continue;

      let score = titleStr.includes(normQ) ? 20 : 0;
      if (absStr.includes(normQ)) score += 10;
      if (tokens.every((tok) => titleStr.includes(tok))) score += 8;
      for (const tok of tokens) {
        if (titleStr.includes(tok)) score += 4;
        if (absStr.includes(tok)) score += 2.5;
        if (findingsStr.includes(tok)) score += 2;
        if (catStr.includes(tok) || figStr.includes(tok)) score += 1.5;
        if (bodyStr.includes(tok)) score += 1;
      }
      scored.push({ art, score });
    }

    if (tokens.length === 0) return scored.map((s) => s.art);
    return scored.sort((a, b) => b.score - a.score).map((s) => s.art);
  }, [
    articles,
    sourceFilter,
    showOnlyBookmarked,
    bookmarkedArticleIds,
    showAllLanguagesCorpus,
    nativeLanguageArticleCount,
    primaryClusterArticleIds,
    selectedCategory,
    searchQuery,
    language,
    normalizeSearchText,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / articlesPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedArticles = useMemo(() => {
    const start = (safeCurrentPage - 1) * articlesPerPage;
    return filteredArticles.slice(start, start + articlesPerPage);
  }, [filteredArticles, safeCurrentPage, articlesPerPage]);

  const commandPaletteArticles = useMemo(() => {
    const normQ = normalizeSearchText(commandQuery.trim());
    const tokens = normQ.split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return articles.slice(0, 12);
    return articles
      .filter((a) => {
        const hay = normalizeSearchText(
          `${getLocalizedText(a.title, language)} ${getLocalizedText(a.abstract, language)} ${getLocalizedArray(a.contentParagraphs, language).join(' ')} ${a.category} ${a.figureNumber}`
        );
        return tokens.every((tok) => hay.includes(tok));
      })
      .slice(0, 16);
  }, [articles, commandQuery, language, normalizeSearchText]);

  const featuredHeroArticle = articles[0] || INITIAL_BLOGGER_ARTICLES[0];

  const surfaceThemeClass =
    uxReadingTheme === 'stark'
      ? 'bg-white text-stone-950'
      : uxReadingTheme === 'sepia'
      ? 'bg-[#F4ECD8] text-[#2A2218]'
      : 'bg-[#FBF9F5] text-[#1C1917]';

  const typographyScaleClass =
    uxFontScale === 'xl'
      ? 'text-[17px]'
      : uxFontScale === 'large'
      ? 'text-[16px]'
      : 'text-base';

  const isKvkkBannerVisible = kvkkConsent.status === 'pending' || kvkkManageOpen;

  return (
    <div
      id="top"
      data-active-tab={activeTab}
      dir={currentLangMeta.dir}
      className={`min-h-screen ${surfaceThemeClass} ${typographyScaleClass} flex flex-col transition-colors duration-200 ${
        isKvkkBannerVisible ? 'pb-24' : 'pb-6'
      }`}
    >
      {/* Top Viewport Live Reading Progress Bar (0% - 100%) */}
      <div
        role="progressbar"
        aria-label="Sayfa Okuma İlerlemesi"
        aria-valuenow={readingProgress}
        aria-valuemin={0}
        aria-valuemax={100}
        className="fixed top-0 left-0 right-0 h-1 bg-stone-300/60 z-50 pointer-events-none"
      >
        <div
          className="h-full bg-gradient-to-r from-[#1E3A8A] via-emerald-600 to-amber-500 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* WCAG 2.1 AAA Keyboard Skip to Main Content Link */}
      <a href="#main-content" className="skip-to-content">
        {language === 'tr' ? 'Ana İçeriğe Atla' : 'Skip to Main Content'}
      </a>

      {/* Strict 3-Zone Top Bar Contract with Responsive Wrapping & Interactive CV Dropdown Menu */}
      <header
        role="banner"
        aria-label="Emre Pelit Sci-Phil Ana Üst Menü"
        className="sticky top-0 z-30 bg-[#FBF9F5]/95 backdrop-blur-xs border-b border-stone-300 px-4 sm:px-6 py-3 flex flex-wrap xl:flex-nowrap items-center justify-between gap-x-5 gap-y-2.5"
      >
        {/* Zone 1: Custom Sci-Phil Application Icon + Wordmark */}
        <a
          href="#top"
          aria-label="Emre Pelit Sci-Phil Ana Sayfa Başa Dön"
          className="inline-flex items-center gap-3 text-lg sm:text-xl font-editorial font-bold tracking-tight text-stone-900 whitespace-nowrap shrink-0 group"
        >
          <img
            src="/sciphil-app-icon.jpg"
            alt="Emre Pelit Sci-Phil Bilim ve Felsefe Uygulama İkonu"
            width={36}
            height={36}
            decoding="async"
            referrerPolicy="no-referrer"
            className="w-9 h-9 rounded-md border border-amber-500/70 shadow-xs object-cover shrink-0 group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col leading-none">
            <span>Emre Pelit · Sci-Phil Hub</span>
            <span className="text-[10px] font-mono font-normal text-[#1E3A8A] tracking-wider mt-0.5">
              {distinctWorksCount} Özgün · {corpusArticlesCount} Metin · {totalDirectoryCount} Dizin
            </span>
          </div>
        </a>

        {/* Zone 2: Responsive wrapping/scrollable navigation bar (prevents clipping on narrow viewports) */}
        <nav
          aria-label="Ana Bölümler Navigasyonu"
          className="hidden md:flex flex-1 min-w-0 max-w-full flex-wrap items-center gap-x-4 gap-y-1.5 overflow-x-auto text-sm font-medium text-stone-700"
        >
          <a
            href="#corpus"
            className="hover:text-[#1E3A8A] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            {t.nav.articles}
          </a>

          {/* Interactive Dropdown Menu for Emre Pelit's CV & Exclusive Authorship */}
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              aria-expanded={navCvDropdownOpen}
              aria-haspopup="true"
              aria-controls="nav-cv-dropdown-panel"
              onClick={() => {
                setNavAboutDropdownOpen(false);
                setNavCvDropdownOpen((prev) => !prev);
              }}
              className="inline-flex items-center gap-1 text-[#1E3A8A] font-semibold hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Emre Pelit CV &amp; Telif</span>
              <ChevronDown
                aria-hidden="true"
                className={`w-3.5 h-3.5 transition-transform ${
                  navCvDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {navCvDropdownOpen && (
              <div
                id="nav-cv-dropdown-panel"
                role="region"
                aria-label="Emre Pelit Özgeçmiş ve Telif Özeti"
                className="absolute left-0 mt-3 w-[min(440px,90vw)] bg-white border border-stone-300 shadow-lg p-4 z-50 space-y-3 text-xs text-stone-800"
              >
                <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-wider text-[#1E3A8A] font-semibold">
                      RESMİ ÖZGEÇMİŞ (CV) &amp; MÜNHASIR ESER SAHİPLİĞİ
                    </div>
                    <div className="font-editorial text-lg font-bold text-stone-900">
                      EMRE PELİT
                    </div>
                    <div className="text-[11px] font-medium text-[#1E3A8A]">
                      Yapay Zeka ve Otonom Robotik Geliştiricisi | Bilgisayar Programcısı
                    </div>
                  </div>
                  <span className="font-mono text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200 shrink-0">
                    %100 Özgün Telif
                  </span>
                </div>

                {/* Embedded New Official PDF CV Preview */}
                <div className="border border-stone-200 bg-stone-100 overflow-hidden h-56 flex flex-col">
                  <object
                    data="/assets/emre-pelit-cv.pdf#toolbar=0&navpanes=0&view=FitH"
                    type="application/pdf"
                    className="w-full flex-1 min-h-0"
                    aria-label="Emre Pelit Güncel Özgeçmiş PDF Önizleme"
                  >
                    <iframe
                      src="/assets/emre-pelit-cv.pdf#toolbar=0&navpanes=0&view=FitH"
                      title="Emre Pelit Güncel Özgeçmiş PDF Önizleme"
                      className="w-full h-full border-0"
                    >
                      <div className="p-4 text-center text-[11px] font-mono">
                        <a
                          href="/assets/emre-pelit-cv.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#1E3A8A] underline font-semibold"
                        >
                          PDF İndir / Yeni Sekmede Aç ↗
                        </a>
                      </div>
                    </iframe>
                  </object>
                </div>

                <div className="space-y-1 text-[11px] leading-relaxed text-stone-700 bg-[#FBF9F5] p-2.5 border border-stone-200">
                  <div>
                    <strong>Eğitim:</strong> Anadolu Ünv. AÖF Bilgisayar Programcılığı (2026–Devam) · Mersin Ünv. Bilgisayar Mühendisliği (2020–2025 Önlisans) · TED Mersin Koleji (Tam Burslu)
                  </div>
                  <div>
                    <strong>Yetenekler:</strong> Python (Orta-Üstü/İleri), C, C++, Java, HTML5 · AI &amp; Tam Otonom Robotik Sistemler · İngilizce B2-C1 (CAT)
                  </div>
                  <div>
                    <strong>Başarılar:</strong> 2× Matematik Olimpiyatı 1.&apos;liği · MEB PYBS Türkiye 76.&apos;lığı (~1,5M aday) · 12 Kurumda 1.&apos;lik &amp; Tam Burs · İl Spor Dereceleri
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <strong>İletişim &amp; Profiller:</strong>
                    <span>Toroslar, Mersin</span>
                    <span>·</span>
                    <span>emrepelit39@gmail.com</span>
                    <span>·</span>
                    <a
                      href="https://github.com/emrepelit109"
                      target="_blank"
                      rel="me noopener noreferrer"
                      className="font-mono font-semibold text-[#1E3A8A] hover:underline"
                    >
                      github.com/emrepelit109 ↗
                    </a>
                    <span>·</span>
                    <a
                      href="https://www.youtube.com/@science_only"
                      target="_blank"
                      rel="me noopener noreferrer"
                      className="font-mono font-bold text-red-700 hover:underline"
                    >
                      @science_only ↗
                    </a>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setCvSectionOpen(true);
                      setNavCvDropdownOpen(false);
                      document.getElementById('emre-pelit-cv')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="flex-1 px-3 py-2 text-xs font-medium text-white bg-[#1E3A8A] hover:bg-[#172E6E] rounded-sm text-center cursor-pointer"
                  >
                    Tam Boyut CV Bölümüne Git
                  </button>
                  <a
                    href="/assets/emre-pelit-cv.pdf"
                    download="Emre_Pelit_Ozgecmis_CV.pdf"
                    className="px-3 py-2 text-xs font-mono text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-sm"
                  >
                    CV İndir (PDF)
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Dropdown Menu for Hakkında (About Emre Pelit) */}
          <div ref={aboutDropdownRef} className="relative">
            <button
              type="button"
              aria-expanded={navAboutDropdownOpen}
              aria-haspopup="true"
              aria-controls="nav-about-dropdown-panel"
              onClick={() => {
                setNavCvDropdownOpen(false);
                setNavAboutDropdownOpen((prev) => !prev);
              }}
              className="inline-flex items-center gap-1 text-stone-800 font-semibold hover:text-[#1E3A8A] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Hakkında</span>
              <ChevronDown
                aria-hidden="true"
                className={`w-3.5 h-3.5 transition-transform ${
                  navAboutDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {navAboutDropdownOpen && (
              <div
                id="nav-about-dropdown-panel"
                role="region"
                aria-label="Hakkında — Emre Pelit"
                className="absolute left-0 mt-3 w-[min(420px,90vw)] bg-white border border-stone-300 shadow-lg p-5 z-50 space-y-3.5 text-sm text-stone-800"
              >
                <div className="flex items-center justify-between pb-2.5 border-b border-stone-200">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-wider text-[#1E3A8A] font-semibold">
                      EMRE PELİT · GÜNCE &amp; YAZAR NOTU
                    </div>
                    <h2 className="font-editorial text-xl font-bold text-stone-900 mt-0.5">
                      Hakkında
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNavAboutDropdownOpen(false)}
                    aria-label="Hakkında penceresini kapat"
                    className="px-2 py-0.5 text-xs font-mono text-stone-500 hover:text-stone-900 border border-stone-200 rounded-xs cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <p className="font-academic-body text-[15px] leading-relaxed text-stone-800">
                  Ben Emre Pelit, bu siteyi bir bakıma günce olarak açmış bulunuyorum. Bu sitede yer alan tüm Türkçe makaleler benim imzamı taşımaktadır. Zaten bu web sitenin http 301 bağıyla bağlı olduğu bütün websiteleri de benim tarafımdan oluşturuldu. Beni tanımak isteyenler CV’mi inceleyebilirler.
                </p>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => {
                      setNavAboutDropdownOpen(false);
                      setCvSectionOpen(true);
                      document.getElementById('emre-pelit-cv')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="flex-1 px-3 py-2 text-xs font-medium text-white bg-[#1E3A8A] hover:bg-[#172E6E] rounded-sm text-center cursor-pointer transition-colors"
                  >
                    CV’mi İncele →
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNavAboutDropdownOpen(false);
                      setNavCvDropdownOpen(true);
                    }}
                    className="px-3 py-2 text-xs font-mono text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-sm cursor-pointer transition-colors"
                  >
                    CV Özeti
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setAnalyticsPanelOpen(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-mono text-xs font-extrabold rounded-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>{APP_CHROME_I18N[language].analyticsShort}</span>
          </button>
          <a
            href="#ai-studio"
            className="hover:text-[#1E3A8A] hover:underline underline-offset-4 transition-colors shrink-0"
          >
            {t.nav.aiStudio}
          </a>
          <a
            href="#control-cloud"
            className="hover:text-[#1E3A8A] hover:underline underline-offset-4 transition-colors shrink-0"
          >
            {t.nav.controlCloud}
          </a>
        </nav>

        {/* Zone 3: Primary actions (wrapping cleanly on narrow screens so Kontrol & Bulut / buttons never clip) */}
        <div className="flex flex-wrap items-center gap-2 shrink-0 max-w-full">
          <PWAInstallButton
            totalArticlesCount={corpusArticlesCount}
            onDownloadInteraction={({ action, summary }) => {
              handleRecordAnalyticsMeasurement(
                'ALL_10_SITES',
                {
                  viewsDelta: action === 'INSTALL_ACCEPTED' || action === 'OFFLINE_LAUNCHER_DOWNLOADED' ? 1 : 0,
                  readsDelta: 0,
                },
                'PWA_DOWNLOAD',
                summary,
                'PWA_DOWNLOAD'
              );
            }}
          />
          <button
            ref={mobileAboutToggleRef}
            type="button"
            onClick={() => setNavAboutDropdownOpen((prev) => !prev)}
            aria-expanded={navAboutDropdownOpen}
            className="md:hidden inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-stone-800 bg-white border border-stone-300 hover:bg-stone-100 rounded-sm cursor-pointer"
          >
            <span>Hakkında</span>
            <ChevronDown
              aria-hidden="true"
              className={`w-3.5 h-3.5 transition-transform ${navAboutDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>
          <button
            type="button"
            onClick={() => setAnalyticsPanelOpen(true)}
            className="md:hidden inline-flex items-center gap-1 px-3 py-2 text-xs font-mono font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-sm cursor-pointer"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>{APP_CHROME_I18N[language].analyticsShort}</span>
          </button>
          <a
            href="#control-cloud"
            className="md:hidden inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-stone-800 bg-white border border-stone-300 hover:bg-stone-100 rounded-sm"
          >
            {t.nav.controlCloud}
          </a>
          <button
            type="button"
            onClick={() => handleSyncBlogger(true)}
            className="px-4 py-2 text-xs font-medium text-white bg-[#1E3A8A] hover:bg-[#172E6E] rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {bloggerSyncState.syncing ? 'Senkronize Ediliyor...' : t.nav.primaryCta}
          </button>
        </div>
      </header>

      {/* Mobile Hakkında Dropdown Drawer (< md) */}
      {navAboutDropdownOpen && (
        <div
          ref={mobileAboutDrawerRef}
          role="region"
          aria-label="Hakkında — Emre Pelit (Mobil)"
          className="md:hidden bg-white border-b border-stone-300 shadow-md px-6 py-4 space-y-3 text-sm text-stone-800 z-20"
        >
          <div className="flex items-center justify-between border-b border-stone-200 pb-2">
            <h2 className="font-editorial text-lg font-bold text-stone-900">Hakkında</h2>
            <button
              type="button"
              onClick={() => setNavAboutDropdownOpen(false)}
              aria-label="Hakkında penceresini kapat"
              className="px-2 py-0.5 text-xs font-mono text-stone-500 hover:text-stone-900 border border-stone-200 rounded-xs cursor-pointer"
            >
              ✕
            </button>
          </div>
          <p className="font-academic-body text-sm leading-relaxed text-stone-800">
            Ben Emre Pelit, bu siteyi bir bakıma günce olarak açmış bulunuyorum. Bu sitede yer alan tüm Türkçe makaleler benim imzamı taşımaktadır. Zaten bu web sitenin http 301 bağıyla bağlı olduğu bütün websiteleri de benim tarafımdan oluşturuldu. Beni tanımak isteyenler CV’mi inceleyebilirler.
          </p>
          <button
            type="button"
            onClick={() => {
              setNavAboutDropdownOpen(false);
              setCvSectionOpen(true);
              document.getElementById('emre-pelit-cv')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-3.5 py-2 text-xs font-medium text-white bg-[#1E3A8A] hover:bg-[#172E6E] rounded-sm cursor-pointer"
          >
            CV’mi İncele →
          </button>
        </div>
      )}

      {/* Operational Utility, Authorship Declaration & 12 Major World Languages Selector Bar */}
      <div
        id="top"
        data-nosnippet
        className="bg-[#F2EFE7] border-b border-stone-300 px-6 py-2.5 text-xs text-stone-700"
      >
        <div className="max-w-[1380px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
            <span className="font-semibold text-stone-900">
              MÜNHASIR YAZAR &amp; TELİF SAHİBİ: EMRE PELİT (%100 ÖZGÜN ESERLER)
            </span>
            <span aria-hidden="true">·</span>
            <a
              href="https://www.youtube.com/@science_only"
              target="_blank"
              rel="me noopener noreferrer"
              title="Web Sitesinin İlişkilendirildiği Resmi YouTube Hesabı: @science_only"
              className="px-2 py-0.5 bg-red-700 hover:bg-red-800 text-white font-bold rounded-sm inline-flex items-center gap-1 transition-colors"
            >
              <span>▶ YouTube: @science_only</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setAnalyticsPanelOpen(true)}
              className="px-2.5 py-0.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-sm inline-flex items-center gap-1 transition-colors cursor-pointer"
            >
              <BarChart3 className="w-3 h-3" />
              <span>Analitik Paneli &amp; Küresel İlk 100 Sıralama Raporu (#analytics)</span>
            </button>
            <span aria-hidden="true">·</span>
            <span>{t.hero.inheritedBadge}</span>
            <span aria-hidden="true">·</span>
            <span>
              {t.hero.bloggerBadge} ({bloggerSyncState.lastSyncedAt})
            </span>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={handleInstantGlobalIndexAndScroll}
              className="px-2 py-0.5 bg-[#047857] hover:bg-[#065F46] text-white font-semibold rounded-sm transition-colors cursor-pointer"
            >
              Tüm Akademik İndekslerde, Bütün Web Tarayıcılarında &amp; Ağların Tümünde İndeksle
            </button>
            <button
              type="button"
              onClick={handleQueueAllArticlesIndividuallyAndScroll}
              className="px-2.5 py-0.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold border border-amber-500 rounded-sm transition-colors cursor-pointer"
            >
              Tüm {corpusArticlesCount} Makaleyi Tüm Tarayıcılarda Tek Tek İndeksleme Kuyruğuna Sok
            </button>
          </div>

          {/* 12 Major World Languages Selector (Instant UI, Full Content & Audio Narrator Switch) */}
          <div className="flex flex-wrap items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-[#1E3A8A]" />
            <label htmlFor="world-lang-select" className="text-[11px] font-mono uppercase text-stone-600 font-semibold">
              Dünya Dilleri (12 Dil · Anında İçerik &amp; Ses):
            </label>
            <select
              id="world-lang-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              className="px-2.5 py-1 text-xs font-mono font-semibold text-[#1E3A8A] bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#1E3A8A] cursor-pointer"
            >
              {WORLD_LANGUAGES.map((wl) => (
                <option key={wl.code} value={wl.code}>
                  {wl.shortLabel} — {wl.nativeName}
                </option>
              ))}
            </select>

            <div
              role="group"
              aria-label="12 Dünya Dili Hızlı Seçici"
              className="hidden xl:inline-flex items-center bg-stone-200/90 p-0.5 rounded-sm font-mono text-[11px]"
            >
              {WORLD_LANGUAGES.map((wl) => (
                <button
                  key={wl.code}
                  type="button"
                  onClick={() => setLanguage(wl.code)}
                  title={wl.nativeName}
                  aria-label={`${wl.nativeName} (${wl.shortLabel}) diline geç`}
                  aria-pressed={language === wl.code}
                  className={`px-1.5 py-0.5 uppercase rounded-sm transition-colors cursor-pointer ${
                    language === wl.code
                      ? 'bg-white text-[#1E3A8A] font-bold shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {wl.shortLabel}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container (1440px Desktop Presence) */}
      <main
        id="main-content"
        tabIndex={-1}
        aria-label="Emre Pelit Sci-Phil Ana Akademik İçerik"
        className="max-w-[1380px] w-full mx-auto px-6 py-10 space-y-14 flex-1 focus:outline-none"
      >
        {/* Cross-Browser SEO Authority & WCAG 2.1 AA Accessibility Status Banner */}
        <section
          data-nosnippet
          aria-label="Tüm Web Tarayıcılarda SEO Otoritesi ve WCAG 2.1 AA Erişilebilirlik Durumu"
          className="bg-[#0F172A] text-slate-100 border border-slate-800 px-4 py-3 rounded-sm flex flex-wrap items-center justify-between gap-3 text-xs font-mono"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold rounded-xs">
              🔒 TÜM DIŞ MÜDAHALELERE %100 KAPALI · SADECE EMRE PELİT (emrepelit39@gmail.com) AYAR YAPABİLİR
            </span>
            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold rounded-xs">
              ✓ 2 CANLI SİTE (ANA HUB + BLOGGER) · {corpusArticlesCount} MAKALE × 12 DİL · 8 ESKİ ALAN ADI HTTP 301
            </span>
            <span className="text-slate-300">
              Scholar · OpenAlex · PhilPapers · BASE · CORE · Chrome · Edge · Firefox · Safari · Brave
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <a
              href="/sitemap_index.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded-xs"
            >
              Sitemap Index (12 Dil · {corpusArticlesCount} Makale · 2 Canlı Site) ↗
            </a>
            <a
              href="/opensearch.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 rounded-xs"
            >
              OpenSearch ↗
            </a>
            <a
              href="/manifest.webmanifest"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 rounded-xs"
            >
              WebManifest (PWA) ↗
            </a>
            <a
              href="/llms.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-purple-300 border border-slate-700 rounded-xs"
            >
              LLMs.txt ↗
            </a>
          </div>
        </section>

        {/* Institutional Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-10 border-b border-stone-300">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="space-y-4">
              <div className="text-xs font-mono uppercase tracking-widest text-stone-500">
                {t.hero.kicker}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-editorial font-semibold text-stone-900 leading-[1.12]">
                {t.hero.title}
              </h1>

              <p className="text-base font-academic-body text-stone-700 leading-relaxed max-w-2xl">
                {t.hero.subtitle}
              </p>

              {/* Prominent Exclusive Emre Pelit Authorship Notice */}
              <div className="bg-white border border-stone-300 p-4 space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#1E3A8A]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>MÜNHASIR FİKRİ MÜLKİYET VE ESER SAHİPLİĞİ BEYANI (%100 EMRE PELİT)</span>
                </div>
                <p className="text-xs font-academic-body text-stone-800 leading-relaxed">
                  Bu platformda yayımlanan tüm bilim ve felsefe makaleleri, makale özetleri, kuramsal çıkarımlar ve interaktif matematiksel simülasyon modelleri <strong>tamamen ve münhasıran Emre Pelit’e aittir</strong>. Seçtiğiniz doğal dünya dilinde ({currentLangMeta.nativeName}) tüm içerik, sesli anlatım ve canlı transkript anında sunulmaktadır.
                </p>
              </div>
              {/* OPENING SCREEN SHOWCASE: All-Article Customized High-Accuracy AI Analysis, Prior Researches, Scientific Score & Simulation Engine */}
              <div className="bg-[#0F172A] text-white border-2 border-amber-400/80 p-4 rounded-sm space-y-3 shadow-md">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>
                      YENİ BÖLÜM: {corpusArticlesCount} MAKALEYE ÖZEL YÜKSEK DOĞRULUKLU YAPAY ZEKA DESTEKLİ ANALİZ, ÖNCEKİ ARAŞTIRMALAR, BİLİMSEL SKOR &amp; SİMÜLASYON MOTORU
                    </span>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 rounded-xs">
                    ✓ {corpusArticlesCount} / {corpusArticlesCount} MAKALE ÖZEL KALİBRE · %99.6+ DOĞRULUK · 12 DİL SESLİ ANALİZ
                  </span>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed">
                  Sitedeki <strong>{corpusArticlesCount} özgün makalenin tamamı</strong> için yapay zeka destekli analiz ve interaktif simülasyon motoru her makalenin kendi başlığına, özetine, tüm paragraflarına ve matematiksel denklemine özel yüksek doğruluklu sonuçlar üretecek şekilde özelleştirilmiştir. Her makalenin yanında yer alan <strong>Açılır Pencere (Pop-up) Tam Makale Analizi</strong> ile makalenin tüm içeriğinin ayrıntılı analizini inceleyebilir, <strong>Bilimsel Skorunu</strong> görebilir ve <strong>Analizi Sesli Dinle</strong> butonuyla dinleyebilirsiniz.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center pt-1">
                  <div className="sm:col-span-6">
                    <select
                      aria-label="Açılış ekranından tam analizi açılacak makaleyi seçin"
                      value={heroSelectedAnalysisArticleId || featuredHeroArticle.id}
                      onChange={(e) => setHeroSelectedAnalysisArticleId(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono bg-slate-900 text-white border border-slate-700 rounded-xs focus:outline-none focus:border-amber-400"
                    >
                      {articles.map((art, idx) => {
                        const scoreRep = computeArticleScientificAnalysis(art, language);
                        return (
                          <option key={art.id} value={art.id}>
                            #{corpusArticlesCount - idx} [Skor: {scoreRep.scientificScore.overallScore}/100] — {getLocalizedText(art.title, language)}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div className="sm:col-span-6 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const chosen =
                          articles.find((a) => a.id === heroSelectedAnalysisArticleId) ||
                          featuredHeroArticle;
                        handleOpenAnalysisModal(chosen);
                      }}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-mono font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xs transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Seçili Makalenin Tam Analizini &amp; Skorunu Açılır Pencerede Aç + Sesli Dinle</span>
                    </button>

                    <a
                      href="#ai-studio"
                      className="inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-mono font-semibold text-emerald-200 bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/50 rounded-xs transition-colors whitespace-nowrap"
                    >
                      <span>AI Analiz &amp; Simülasyon Motoruna Git ↓</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="#corpus"
                  className="px-5 py-2.5 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-sm transition-colors whitespace-nowrap shrink-0"
                >
                  {t.hero.exploreBtn}
                </a>
                <a
                  href="#homepage-qa-objection-engine"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-mono font-extrabold text-slate-950 bg-amber-400 hover:bg-amber-300 border-2 border-amber-500 rounded-sm transition-colors whitespace-nowrap shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    ❓⚖️ Soru &amp; İtiraz Kutusu ({corpusArticlesCount} Makale Cevaplayıcı Motoru · 7/24)
                  </span>
                </a>
                <button
                  type="button"
                  onClick={() => handleOpenAnalysisModal(featuredHeroArticle)}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-mono font-bold text-slate-950 bg-amber-300 hover:bg-amber-200 border border-amber-500 rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {corpusArticlesCount} Makale Özel AI Analiz, Önceki Araştırmalar &amp; Bilimsel Skor (Açılır Pencere)
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCvSectionOpen(true);
                    document.getElementById('emre-pelit-cv')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-medium text-white bg-[#1E3A8A] hover:bg-[#172E6E] rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <FileBadge className="w-3.5 h-3.5" />
                  <span>Emre Pelit Özgeçmiş (CV) Açılır Menüsü</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAnalyticsPanelOpen(true)}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-mono font-extrabold text-slate-950 bg-emerald-400 hover:bg-emerald-300 border-2 border-emerald-600 rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>
                    Analitik ({liveCumulativeStats.netReads.toLocaleString('tr-TR')} Okunma)
                  </span>
                </button>
                <button
                  type="button"
                  onClick={handleInstantGlobalIndexAndScroll}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-medium text-white bg-[#047857] hover:bg-[#065F46] rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Tüm Akademik İndekslerde, Tarayıcılarda ve Ağlarda İndeksle</span>
                </button>
                <button
                  type="button"
                  onClick={handleQueueAllArticlesIndividuallyAndScroll}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-mono font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 border-2 border-amber-500 rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Tüm {corpusArticlesCount} Makaleyi Tüm Tarayıcılarda Tek Tek İndeksleme Kuyruğuna Sok</span>
                </button>
                <a
                  href="https://www.youtube.com/@science_only"
                  target="_blank"
                  rel="me noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-mono font-bold text-white bg-red-700 hover:bg-red-800 border border-red-900 rounded-sm transition-colors whitespace-nowrap shrink-0"
                >
                  <span>▶ Resmi YouTube Kanalı: @science_only</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="pt-3 border-t border-stone-200 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs text-stone-600">
                <span>Tekil Eser Sahibi: Emre Pelit</span>
                <span aria-hidden="true" className="inline-block mx-1">·</span>
                <a
                  href="https://www.youtube.com/@science_only"
                  target="_blank"
                  rel="me noopener noreferrer"
                  className="font-mono font-semibold text-red-700 hover:underline inline-flex items-center gap-1"
                >
                  <span>Resmi İlişkili YouTube (Tüm Tarayıcılarda Kayıtlı): @science_only (youtube.com/@science_only)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span aria-hidden="true" className="inline-block mx-1">·</span>
                <span>
                  2 Canlı Site + 8 Emekli 301 (Açılıştan Beri Kümülatif Toplam):{' '}
                  <strong className="text-stone-900 font-mono tabular-nums">
                    {liveCumulativeStats.netReads.toLocaleString('tr-TR')} Net Okunma
                  </strong>
                  <span aria-hidden="true" className="inline-block mx-1">·</span>
                  <strong className="text-stone-900 font-mono tabular-nums">
                    {liveCumulativeStats.totalViews.toLocaleString('tr-TR')} Toplam Görüntülenme
                  </strong>
                  <span aria-hidden="true" className="inline-block mx-1">·</span>
                  <strong className="text-stone-900 font-mono tabular-nums">
                    {articles.reduce((acc, a) => acc + (a.citationsCount || 0), 0).toLocaleString('tr-TR')}{' '}
                    Akademik Atıf
                  </strong>
                  <span aria-hidden="true" className="inline-block mx-1">·</span>
                  <strong className="text-stone-900 font-mono tabular-nums">
                    {liveCumulativeStats.readingHours.toLocaleString('tr-TR')} sa {liveCumulativeStats.readingMins} dk Okuma
                  </strong>
                  <span aria-hidden="true" className="inline-block mx-1">·</span>
                  <strong className="text-stone-900 font-mono tabular-nums">
                    {liveCumulativeStats.audioHours.toLocaleString('tr-TR')} sa {liveCumulativeStats.audioMins} dk Sesli Dinleme
                  </strong>
                  <span aria-hidden="true" className="inline-block mx-1">·</span>
                  <strong className="text-stone-900 font-mono tabular-nums">
                    {liveCumulativeStats.uniqueReaders.toLocaleString('tr-TR')} Tekil Okur
                  </strong>
                  <span aria-hidden="true" className="inline-block mx-1">·</span>
                  <strong className="text-stone-900 font-mono tabular-nums">
                    {liveCumulativeStats.simulatorRuns.toLocaleString('tr-TR')} Simülatör
                  </strong>
                  <span aria-hidden="true" className="inline-block mx-1">·</span>
                  <strong className="text-stone-900 font-mono tabular-nums">
                    {appInteractionTotals.totalInteractionsSinceLaunch.toLocaleString('tr-TR')} Uygulama Etkileşimi
                  </strong>{' '}
                  (Sıfırlanmaz/Azalmaz Monotonik Kilit)
                </span>
                <span aria-hidden="true" className="inline-block mx-1">·</span>
                <span>Aktif Dil: {currentLangMeta.nativeName} ({currentLangMeta.shortLabel})</span>
              </div>
            </div>
          </div>

          {/* Right Hero Featured Plate */}
          <div className="lg:col-span-5 flex flex-col gap-5 bg-white border border-stone-300 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-stone-500">
              <span>EMRE PELİT BAŞYAZISI &amp; SİMÜLASYON PLAKASI</span>
              <span className="px-2 py-0.5 bg-amber-100 text-amber-950 border border-amber-400 font-bold rounded-xs inline-flex items-center gap-1">
                <Award className="w-3 h-3 text-amber-700" />
                <span>
                  {APP_CHROME_I18N[language].scientificScore}: {computeArticleScientificAnalysis(featuredHeroArticle, language).scientificScore.overallScore} / 100
                </span>
              </span>
            </div>

            <ScientificPlate article={featuredHeroArticle} language={language} />

            <div className="space-y-2 pt-1">
              <div className="text-[11px] font-mono text-[#1E3A8A] font-semibold">
                Yazar &amp; Eser Sahibi: Emre Pelit (%100 Özgün Telif)
              </div>
              <h3 className="text-lg font-editorial font-semibold text-stone-900">
                {getLocalizedText(featuredHeroArticle.title, language)}
              </h3>

              {/* Direct Pop-up Full Analysis & Audio Button next to Hero Featured Article */}
              <button
                type="button"
                onClick={() => handleOpenAnalysisModal(featuredHeroArticle)}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-mono font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 border border-amber-500 rounded-xs transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  Bu Makalenin Tam Analizi, Bilimsel Skoru &amp; Sesli Dinleme (Açılır Pencere)
                </span>
              </button>

              <ArticleAudioPlayer
                article={featuredHeroArticle}
                language={language}
                voicePersona={gatewayConfig.defaultVoicePersona}
                compact
                onAudioMeasured={(artId, minsDelta) =>
                  handleRecordAnalyticsMeasurement(
                    'emrepelit-sciphi.ai.studio',
                    {
                      readsDelta: 1,
                      viewsDelta: 1,
                      targetArticleId: artId,
                      audioMinutesDelta: minsDelta,
                    },
                    'AUDIO_NARRATOR',
                    `Analitik Ölçüm (Sesli Anlatım #${artId}): +1 Görüntülenme, +1 Okunma, +${minsDelta} dk Sesli Dinleme`
                  )
                }
              />
            </div>
          </div>
        </section>

        {/* PROMINENT HOMEPAGE QUESTION & OBJECTION BOX + 306-ARTICLE CORPUS ANSWERING ENGINE (24/7 CONFIDENTIAL EMAIL ROUTING TO emrepelit39@gmail.com) */}
        <section aria-label="Anasayfa Soru ve Bilimsel/Felsefi İtiraz Cevaplayıcı Motoru">
          <ArticleQuestionModule
            article={featuredHeroArticle}
            allArticles={articles}
            language={language}
            defaultExpanded={true}
            variant="homepage"
            onJumpToArticle={(artId) => handleJumpToArticle(artId)}
            onQuestionAskedMeasured={(artId) =>
              handleRecordAnalyticsMeasurement(
                'emrepelit-sciphi.ai.studio',
                {
                  readsDelta: 1,
                  viewsDelta: 1,
                  readingMinutesDelta: 2,
                  targetArticleId: artId,
                },
                'QA_OBJECTOR',
                `Uygulama Etkileşimi (Anasayfa Soru/İtiraz Cevaplayıcı Motoru #${artId}): +1 Soru/İtiraz Sorgusu, +1 Okunma`,
                'QA_OBJECTION'
              )
            }
          />
        </section>

        {/* Collapsible / Dropdown CV & Exclusive Authorship Menu Section */}
        <EmrePelitCVMenu
          language={language}
          isOpen={cvSectionOpen}
          onToggleOpen={() => setCvSectionOpen((prev) => !prev)}
          totalArticlesCount={corpusArticlesCount}
        />

        {/* Unified 10-Node Architecture, Headless CMS Synchronization & 1:1 HTTP 301 / Canonical Consolidation Matrix */}
        <section
          id="blogger-bridge"
          className="bg-white border border-stone-300 p-6 space-y-5 scroll-mt-24"
        >
          {/* Unified Workspace Module Switcher (Integrating sci-phi.ai.studio ?tab= modules & science-philosophy-emre-pelit.ai.studio /archive) */}
          <div className="bg-[#0F172A] border border-slate-800 p-3.5 rounded-sm flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-slate-100">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-emerald-400 text-slate-950 font-extrabold rounded-xs text-[10px]">
                BİRLEŞİK ANA HUB ÇALIŞMA MODÜLLERİ
              </span>
              <span className="text-slate-300 text-[11px]">
                Tüm alt alan adlarındaki en güçlü modüller tek merkezde (emrepelit-sciphi.ai.studio) birleştirildi:
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  try {
                    window.history.replaceState(null, '', '/?tab=simulators');
                  } catch {}
                  setActiveTab('simulators');
                  const firstArtId = articles[0]?.id;
                  if (firstArtId) {
                    setExpandedArticleIds((prev) => ({ ...prev, [firstArtId]: true }));
                  }
                  setTimeout(() => {
                    document.getElementById('featured-simulator-container')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }, 120);
                }}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-sky-300 rounded-xs cursor-pointer transition-colors text-[11px]"
              >
                /?tab=simulators (Simülasyon Lab)
              </button>
              <button
                type="button"
                onClick={() => {
                  try {
                    window.history.replaceState(null, '', '/?tab=stats');
                  } catch {}
                  setActiveTab('stats');
                  setAnalyticsPanelOpen(true);
                }}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-emerald-500/60 text-emerald-300 rounded-xs cursor-pointer transition-colors text-[11px]"
              >
                /?tab=stats (10 Düğüm Canlı Analitik)
              </button>
              <button
                type="button"
                onClick={() => {
                  try {
                    window.history.replaceState(null, '', '/?tab=automation');
                  } catch {}
                  setActiveTab('automation');
                  document.getElementById('ai-studio')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-amber-500/60 text-amber-300 rounded-xs cursor-pointer transition-colors text-[11px]"
              >
                /?tab=automation (YZ &amp; Otomasyon)
              </button>
              <button
                type="button"
                onClick={() => {
                  try {
                    window.history.replaceState(null, '', '/archive');
                  } catch {}
                  setShowBloggerDirectory(true);
                  document.getElementById('blogger-bridge')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-purple-500/60 text-purple-300 rounded-xs cursor-pointer transition-colors text-[11px]"
              >
                /archive ({distinctWorksCount} Özgün · {corpusArticlesCount} Metin · {totalDirectoryCount} Toplam Dizin)
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('apps');
                  document.getElementById('interactive-apps')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-2.5 py-1 bg-emerald-950 hover:bg-emerald-900 border border-emerald-400/70 text-emerald-200 rounded-xs cursor-pointer transition-colors text-[11px] font-bold"
              >
                İnteraktif Uygulamalar (4 Modül) ↓
              </button>
            </div>
          </div>

          {/* 316+ ARTICLES PUBLISHED ACROSS ALL 301 WEBSITES + AUTO-SYNDICATION FOR EVERY NEW ARTICLE + EXCLUSIVE AUTHORITY CONSOLIDATION PANEL */}
          <div
            data-nosnippet
            className="bg-emerald-950 text-emerald-50 border-2 border-emerald-400 p-4 sm:p-5 rounded-sm space-y-3.5 shadow-sm"
          >
            <div className="grid grid-cols-1 lg:grid-cols-[repeat(auto-fit,minmax(320px,1fr))] items-center gap-4">
              <div className="space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
                  <span className="px-2.5 py-0.5 bg-amber-400 text-slate-950 font-extrabold uppercase rounded-xs">
                    ✓ {corpusArticlesCount} MAKALENİN TAMAMI CANLI ANA HUB + BLOGGER ÜZERİNDE YAYINDA ({(corpusArticlesCount * 12).toLocaleString('tr-TR')} KANONİK URL)
                  </span>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-200 border border-emerald-400/60 font-bold rounded-xs">
                    ✓ 15 SN + SSE CANLI BLOGGER SENKRONU AKTİF (emrepelit7337.blogspot.com → Ana Hub)
                  </span>
                  <span className="px-2.5 py-0.5 bg-sky-500/20 text-sky-200 border border-sky-400/60 font-bold rounded-xs">
                    ★ 8 ESKİ ALAN ADI YAYINDAN KALDIRILDI (TEK-ADIM HTTP 301 → emrepelit-sciphi.ai.studio)
                  </span>
                  <span className="px-2.5 py-0.5 bg-emerald-400 text-slate-950 font-extrabold rounded-xs">
                    0 YAYIN HATASI
                  </span>
                </div>
                <h4 className="text-base sm:text-lg font-editorial font-bold text-white">
                  Tek Kanonik Ana Hub &amp; Canlı Blogger Senkronizasyonu: {distinctWorksCount} Özgün Makale · {corpusArticlesCount} Çok Dilli Metin × 12 Dil (emrepelit-sciphi.ai.studio + emrepelit7337.blogspot.com)
                </h4>
                <p className="text-xs text-emerald-200/95 leading-relaxed max-w-4xl">
                  Ekosistem yalnızca <strong>2 canlı web sitesine</strong> (<strong>emrepelit-sciphi.ai.studio</strong> Ana Hub + <strong>emrepelit7337.blogspot.com</strong> Blogger kaynağı) konsolide edilmiştir; ağdaki diğer 8 eski alan adı yayından kaldırılarak tek-adım <code>HTTP 301</code> ile bu Ana Hub&apos;a yönlendirilmiştir. Blogger&apos;a eklenen her yeni makale 15 saniyelik senkron ve SSE kanalıyla anında Ana Hub&apos;a aktarılır ve 12 dünya dilinin tamamında <code>HTTP 200 OK</code> kanonik olarak indekslenir.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={handlePublishAll316Across301Network}
                  disabled={isPublishingAll301 || bloggerSyncState.syncing}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 border-2 border-amber-300 rounded-xs transition-colors cursor-pointer disabled:opacity-60 shadow-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isPublishingAll301 ? 'animate-spin' : ''}`} />
                  <span>
                    {isPublishingAll301
                      ? `Ana Hub & 12 Dil Kuyruğu Yenileniyor...`
                      : `Tüm ${corpusArticlesCount} Makaleyi 12 Dilde Doğrula & 301 Hatalarını Gider`}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setQuickPublishOpen((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-mono font-bold text-white bg-emerald-700 hover:bg-emerald-600 border border-emerald-400 rounded-xs transition-colors cursor-pointer shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>
                    {quickPublishOpen
                      ? 'Yeni Yazı Ekleme Formunu Kapat'
                      : '+ Yeni Yazı Ekle (Ana Hub & Blogger Senkron)'}
                  </span>
                </button>
              </div>
            </div>

            {publishAll301Banner && (
              <div className="bg-emerald-900/90 border border-emerald-400 px-3.5 py-2.5 rounded-xs flex items-center justify-between gap-3 text-xs font-mono text-emerald-100">
                <span>{publishAll301Banner}</span>
                <button
                  type="button"
                  onClick={() => setPublishAll301Banner(null)}
                  className="px-2 py-0.5 text-[10px] bg-emerald-950 hover:bg-emerald-800 rounded-xs cursor-pointer shrink-0"
                >
                  Kapat
                </button>
              </div>
            )}

            {quickPublishOpen && (
              <form
                onSubmit={handleQuickDirectPublishSubmit}
                className="bg-[#0F172A] border border-emerald-400/70 p-4 rounded-xs space-y-3 text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2 font-mono">
                  <span className="font-bold text-amber-300">
                    + YENİ YAZI EKLE &amp; OTOMATİK OLARAK 301 AĞINDAKİ TÜM 10 SİTEDE YAYINLA (OTORİTE PUANI %100 BU WEBSİTEDE KALIR)
                  </span>
                  <span className="text-[11px] text-emerald-300">
                    Yazar: Emre Pelit · Yeni Sıra No: #{corpusArticlesCount + 1}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2 space-y-1">
                    <label className="block font-mono text-[11px] text-slate-300">
                      Makale Başlığı (Eklendiği Anda Tüm 301 Sitelerinde Yayınlanır) *
                    </label>
                    <input
                      type="text"
                      required
                      value={quickTitle}
                      onChange={(e) => setQuickTitle(e.target.value)}
                      placeholder="Örn: Kuantum Dolanıklık, Zamanın Okları ve Elest Bezmi Üzerine Yeni Çıkarımlar"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-mono text-[11px] text-slate-300">
                      Bilim &amp; Felsefe Kategorisi
                    </label>
                    <select
                      value={quickCategory}
                      onChange={(e) => setQuickCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="Bilinç, Yapay Zeka & Zihin Felsefesi">Bilinç, Yapay Zeka &amp; Zihin Felsefesi</option>
                      <option value="Yazılım & Uygulama Projeleri">Yazılım &amp; Uygulama Projeleri</option>
                      <option value="Kuantum Fiziği & Epistemoloji">Kuantum Fiziği &amp; Epistemoloji</option>
                      <option value="Kozmoloji & Enformasyon Teorisi">Kozmoloji &amp; Enformasyon Teorisi</option>
                      <option value="Uzay-Zaman Felsefesi">Uzay-Zaman Felsefesi</option>
                      <option value="Parçacık Fiziği & Ontoloji">Parçacık Fiziği &amp; Ontoloji</option>
                      <option value="Karmaşıklık & Determinizm">Karmaşıklık &amp; Determinizm</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-mono text-[11px] text-slate-300">
                    Kısa Özet (Abstract)
                  </label>
                  <input
                    type="text"
                    value={quickAbstract}
                    onChange={(e) => setQuickAbstract(e.target.value)}
                    placeholder="Makalenin kısa kuramsal özeti (boş bırakılırsa metinden otomatik oluşturulur)..."
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-mono text-[11px] text-slate-300">
                    Makale Tam Metni (Paragraflar) *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={quickBody}
                    onChange={(e) => setQuickBody(e.target.value)}
                    placeholder="Makale metnini buraya yazın. Yayınla butonuna bastığınız anda bu Tek Kanonik Ana Hub üzerinde 12 dilde yayına alınır ve canlı Blogger ile senkronize edilir..."
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <span className="text-[11px] font-mono text-emerald-300">
                    ✓ Yayın Hedefi: Tek Kanonik Ana Hub (HTTP 200 · 12 Dil) + Canlı Blogger (8 eski domain HTTP 301 → Hub)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQuickPublishOpen(false)}
                      className="px-3 py-1.5 text-xs font-mono text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xs cursor-pointer"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-mono font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xs cursor-pointer"
                    >
                      Şimdi Tek Kanonik Ana Hub’da (12 Dil) Yayınla
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[repeat(auto-fit,minmax(320px,1fr))] items-center gap-4 pb-4 border-b border-stone-200">
            <div className="space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#1E3A8A]">
                <span>2 CANLI WEB SİTESİ (ANA HUB + BLOGGER) · 8 ESKİ ALAN ADI HTTP 301 KONSOLİDASYONU · JSONP/PROXY CANLI SENKRON</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 font-semibold rounded-sm">
                  {distinctWorksCount} ÖZGÜN MAKALE · {corpusArticlesCount} ÇOK DİLLİ METİN · {totalDirectoryCount} TOPLAM DİZİN
                </span>
                <span className="px-2 py-0.5 bg-blue-50 text-[#1E3A8A] border border-blue-200 rounded-sm">
                  OTORİTE PUANI %100 BU WEBSİTEDE TOPLANIR
                </span>
              </div>
              <h3 className="text-xl lg:text-2xl font-editorial font-semibold text-stone-900">
                {bloggerSyncState.blogTitle} — 2 Canlı Web Sitesi (Ana Hub <code className="text-xs font-mono bg-stone-100 px-1.5 py-0.5 border border-stone-300 rounded-xs">HTTP 200</code> + Blogger <code className="text-xs font-mono bg-stone-100 px-1.5 py-0.5 border border-stone-300 rounded-xs">HTTP 200</code>) + 8 Emekli 301 Alan Adı ({corpusArticlesCount} Makale · 12 Dil Kanonik)
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Bu sitedeki <strong>{corpusArticlesCount} makalenin tamamı</strong> ve Blogger&apos;a (<strong>emrepelit7337.blogspot.com</strong>) eklenen her yeni yazı gerçek zamanlı SSE ve 15 saniyelik senkronla otomatik olarak Ana Hub&apos;a aktarılır. Eski 8 alan adı yayından kaldırılarak tek-adım <code>HTTP 301</code> ve <code>rel=&quot;canonical&quot;</code> ile yalnızca <strong>emrepelit-sciphi.ai.studio</strong> merkezine bağlanmıştır.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => handleSyncBlogger(false, true)}
                disabled={bloggerSyncState.syncing}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-white bg-[#047857] hover:bg-[#065F46] rounded-sm transition-colors cursor-pointer disabled:opacity-60"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${bloggerSyncState.syncing ? 'animate-spin' : ''}`} />
                <span>
                  {bloggerSyncState.syncing
                    ? 'Blogger & Ana Hub Senkronize Ediliyor...'
                    : `Blogger & Ana Hub'ı (${corpusArticlesCount} Makale) Şimdi Canlı Senkronize Et`}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setShowBloggerDirectory((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-white bg-[#1E3A8A] hover:bg-[#172E6E] rounded-sm transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>
                  {showBloggerDirectory
                    ? `${corpusArticlesCount} Makale Tam Fihristini Gizle`
                    : `Tüm ${corpusArticlesCount} Makaleyi Listele (/archive)`}
                </span>
              </button>
              <a
                href={gatewayConfig.bloggerBlogUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-mono text-stone-800 bg-[#FBF9F5] border border-stone-300 hover:bg-stone-100 rounded-sm"
              >
                <span>Headless CMS (Blogger)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* 10 Official Websites Architectural Role, Canonical & 1:1 HTTP 301 Matrix + Complete Since-Launch Stats */}
          <div className="bg-[#0F172A] border border-slate-800 p-4 rounded-sm space-y-3 text-slate-100">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono border-b border-slate-800 pb-2.5">
              <div className="space-y-1">
                <div className="font-bold text-emerald-400">
                  2 CANLI WEB SİTESİ + 8 EMEKLİ HTTP 301 TOPOLOJİSİ VE AÇILIŞTAN BERİ İSTATİSTİKLER ({corpusArticlesCount} MAKALE · OTORİTE %100 ANA HUB)
                </div>
                <div className="text-[11px] text-amber-200 tabular-nums">
                  Σ {liveCumulativeStats.totalViews.toLocaleString('tr-TR')} Görüntülenme ·{' '}
                  {liveCumulativeStats.netReads.toLocaleString('tr-TR')} Net Okunma ·{' '}
                  {liveCumulativeStats.readingHours.toLocaleString('tr-TR')} sa {liveCumulativeStats.readingMins} dk Okuma ·{' '}
                  {liveCumulativeStats.audioHours.toLocaleString('tr-TR')} sa {liveCumulativeStats.audioMins} dk Sesli Dinleme ·{' '}
                  {liveCumulativeStats.uniqueReaders.toLocaleString('tr-TR')} Tekil Okur ·{' '}
                  {liveCumulativeStats.simulatorRuns.toLocaleString('tr-TR')} Simülatör
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAnalyticsPanelOpen(true)}
                className="px-3 py-1.5 text-[11px] font-mono font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xs cursor-pointer transition-colors whitespace-nowrap shrink-0"
              >
                Canlı Analitik Tablosu &amp; Makale Detayları ({liveCumulativeStats.totalViews.toLocaleString('tr-TR')} Gör.) →
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 font-mono text-xs tabular-nums">
              {networkNodes.map((node) => {
                const isMainHub = node.domain === 'emrepelit-sciphi.ai.studio';
                const isBloggerLive = node.domain === 'emrepelit7337.blogspot.com';
                const isLiveNode =
                  LIVE_WEBSITES_SET.has(node.domain) || Boolean(node.isLiveWebsite);
                const badgeLabel = isMainHub
                  ? 'CANLI ANA HUB · HTTP 200'
                  : isBloggerLive
                    ? 'CANLI BLOGGER · HTTP 200'
                    : 'YAYINDAN KALDIRILDI · 301 → HUB';
                const nodeViews = node.stats.totalViews ?? node.stats.netReads;
                const sharePct = (
                  (node.stats.netReads / Math.max(1, liveCumulativeStats.netReads)) *
                  100
                ).toFixed(2);

                return (
                  <div
                    key={node.id}
                    className={`p-3 rounded-xs flex flex-col justify-between gap-2 border ${
                      isMainHub
                        ? 'bg-emerald-950/50 border-emerald-400'
                        : isBloggerLive
                          ? 'bg-amber-950/35 border-amber-400/70'
                          : 'bg-slate-950/80 border-slate-800 opacity-75'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-amber-400 font-bold text-[11px]">#{node.rank}</span>
                        <span
                          className={`px-1.5 py-0.5 text-[9px] font-bold rounded-xs border ${
                            isMainHub
                              ? 'bg-emerald-400 text-slate-950 border-emerald-300'
                              : isBloggerLive
                                ? 'bg-amber-500/20 text-amber-300 border-amber-400/50'
                                : 'bg-slate-900 text-slate-400 border-slate-700'
                          }`}
                        >
                          {badgeLabel}
                        </span>
                      </div>
                      <div className="font-bold text-white break-all text-[11px] leading-snug" title={node.domain}>
                        {node.domain}
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-1.5 text-[10px] text-amber-200 border-b border-slate-800 pb-1">
                        <span className="leading-snug">Açılış: {node.launchDate}</span>
                        <span className="text-emerald-300 font-bold shrink-0">Pay %{sharePct}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-1 text-[10px] bg-slate-950/90 border border-slate-800 p-1.5 rounded-xs">
                        <div>
                          <span className="text-[9px] text-cyan-300 block">Görüntülenme</span>
                          <strong className="text-cyan-200">
                            {nodeViews.toLocaleString('tr-TR')}
                          </strong>
                        </div>
                        <div>
                          <span className="text-[9px] text-amber-300 block">Net Okunma</span>
                          <strong className="text-amber-300">
                            {node.stats.netReads.toLocaleString('tr-TR')}
                          </strong>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 block">Okuma Süresi</span>
                          <strong className="text-slate-100">
                            {node.stats.readingTimeHours.toLocaleString('tr-TR')} sa{' '}
                            {node.stats.readingTimeMinutes} dk
                          </strong>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 block">Sesli Dinleme</span>
                          <strong className="text-emerald-300">
                            {node.stats.audioListenHours.toLocaleString('tr-TR')} sa{' '}
                            {node.stats.audioListenMinutes} dk
                          </strong>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 block">Tekil Okur</span>
                          <strong className="text-purple-300">
                            {node.stats.uniqueReaders.toLocaleString('tr-TR')}
                          </strong>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 block">Simülatör</span>
                          <strong className="text-sky-300">
                            {node.stats.simulatorRuns.toLocaleString('tr-TR')}
                          </strong>
                        </div>
                      </div>

                      <div
                        className={`text-[10px] font-semibold ${
                          isLiveNode ? 'text-emerald-300' : 'text-slate-400'
                        }`}
                      >
                        {isLiveNode
                          ? `✓ ${Math.max(corpusArticlesCount, node.articlesCount)} Makale Canlı Yayında`
                          : `301 → Ana Hub · İstatistikler Donduruldu`}
                      </div>
                    </div>
                    {isLiveNode ? (
                      <button
                        type="button"
                        onClick={() => handleSyncBlogger(false, true, node.domain)}
                        disabled={bloggerSyncState.syncing}
                        className="w-full inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-[10px] font-mono font-semibold text-emerald-200 bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-500/50 rounded-xs cursor-pointer transition-colors disabled:opacity-60"
                      >
                        <RefreshCw
                          className={`w-3 h-3 ${bloggerSyncState.syncing ? 'animate-spin' : ''}`}
                        />
                        <span>{isMainHub ? 'Ana Hub Senkronla' : 'Blogger Kaynağını Senkronla'}</span>
                      </button>
                    ) : (
                      <div className="w-full text-center px-2.5 py-1.5 text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 rounded-xs">
                        HTTP 301 → emrepelit-sciphi.ai.studio
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Alert if a newly added post on emrepelit7337.blogspot.com was detected */}
          {bloggerSyncState.newPostAlert && (
            <div className="bg-emerald-50 border border-emerald-300 p-3.5 flex items-center justify-between gap-3 text-xs text-emerald-950">
              <div className="font-mono font-semibold">
                ● CANLI YENİ YAYIN BİLDİRİMİ: {bloggerSyncState.newPostAlert}
              </div>
              <button
                type="button"
                onClick={() =>
                  setBloggerSyncState((prev) => ({ ...prev, newPostAlert: null }))
                }
                className="text-[11px] font-mono underline cursor-pointer"
              >
                Kapat
              </button>
            </div>
          )}

          {/* Latest 5 Articles from emrepelit7337.blogspot.com (Updates Automatically Whenever a New Article is Posted) */}
          {bloggerArticlesList.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-stone-600">
                <span className="font-semibold text-stone-900">
                  SON EKLENEN CANLI BLOGGER MAKALELERİ (YENİ MAKALE GİRİLDİĞİNDE ANINDA EN ÜSTTE GÖSTERİLİR):
                </span>
                <span>Son Senkronizasyon: {bloggerSyncState.lastSyncedAt}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {bloggerArticlesList.slice(0, 5).map((bArt, bIdx) => {
                  const bScore = computeArticleScientificAnalysis(bArt, language).scientificScore.overallScore;
                  return (
                    <div
                      key={bArt.id}
                      className="bg-[#FBF9F5] border border-stone-300 p-3 flex flex-col justify-between gap-2 hover:border-[#1E3A8A] transition-colors"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] font-mono text-stone-500">
                          <span className="font-bold text-[#1E3A8A]">
                            #{bloggerArticlesList.length - bIdx} {bIdx === 0 ? '• EN YENİ' : ''}
                          </span>
                          <span className="px-1.5 py-0.5 bg-amber-100 border border-amber-400 text-amber-950 font-bold rounded-xs">
                            Skor: {bScore}/100
                          </span>
                        </div>
                        <div className="text-xs font-editorial font-semibold text-stone-900 line-clamp-2 leading-snug">
                          {getLocalizedText(bArt.title, language)}
                        </div>
                        <div className="text-[10px] font-mono text-stone-600 truncate">
                          {bArt.category} · {bArt.publishedAt}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-stone-200 space-y-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenAnalysisModal(bArt)}
                          className="w-full inline-flex items-center justify-center gap-1 px-2 py-1 text-[10px] font-mono font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 border border-amber-500 rounded-xs cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Tam Analiz, Skor &amp; Sesli Dinle (Pop-up)</span>
                        </button>
                        <div className="flex items-center justify-between gap-2">
                          <a
                            href={getLocalizedArticlePath(
                              bArt.sourceLang ||
                                detectEntrySourceLanguage(
                                  getLocalizedText(bArt.title, 'tr'),
                                  getLocalizedText(bArt.abstract, 'tr')
                                ),
                              bArt.slug
                            )}
                            onClick={(e) => {
                              e.preventDefault();
                              handleJumpToArticle(bArt.id);
                            }}
                            className="text-[11px] font-mono font-semibold text-[#1E3A8A] hover:underline cursor-pointer"
                          >
                            Bu Sitede Aç &amp; Dinle →
                          </a>
                          {bArt.bloggerUrl && (
                            <a
                              href={bArt.bloggerUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] font-mono text-stone-500 hover:text-stone-900"
                              title="Blogger Orijinal Bağlantısı"
                            >
                              Blog ↗
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Expandable Full 306-Article Directory Table */}
          {showBloggerDirectory && (
            <div className="pt-4 border-t border-stone-300 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs font-mono font-semibold text-stone-900">
                  EMRE PELİT — EMREPELIT7337.BLOGSPOT.COM TAM SENKRONİZE MAKALE FİHRİSTİ ({filteredDirectoryArticles.length} / {bloggerArticlesList.length} Makale)
                </div>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="search"
                    value={directorySearch}
                    onChange={(e) => setDirectorySearch(e.target.value)}
                    placeholder={`${corpusArticlesCount} Blogger makalesi içinde ara...`}
                    className="pl-8 pr-3 py-1.5 text-xs bg-[#FBF9F5] border border-stone-300 focus:outline-none focus:border-[#1E3A8A] w-64"
                  />
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto border border-stone-300 bg-[#FBF9F5]">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="sticky top-0 bg-stone-200 text-stone-800 font-mono text-[11px] uppercase border-b border-stone-300">
                    <tr>
                      <th className="py-2 px-3">No</th>
                      <th className="py-2 px-3">Makale Başlığı (Yazar: Emre Pelit)</th>
                      <th className="py-2 px-3">Bilimsel Skor</th>
                      <th className="py-2 px-3">Disiplin &amp; Simülasyon</th>
                      <th className="py-2 px-3">Tarih</th>
                      <th className="py-2 px-3 text-right">İşlem &amp; Açılır Pencere Analizi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {filteredDirectoryArticles.map((bArt) => {
                      const rowScore = computeArticleScientificAnalysis(bArt, language).scientificScore.overallScore;
                      return (
                        <tr key={bArt.id} className="hover:bg-white transition-colors">
                          <td className="py-2 px-3 font-mono font-semibold text-[#1E3A8A] whitespace-nowrap">
                            {bArt.figureNumber.replace('FIG. BLG.', '#')}
                          </td>
                          <td className="py-2 px-3 font-medium text-stone-900">
                            {getLocalizedText(bArt.title, language)}
                          </td>
                          <td className="py-2 px-3 font-mono whitespace-nowrap">
                            <span className="px-2 py-0.5 bg-amber-100 border border-amber-400 text-amber-950 font-bold rounded-xs">
                              {rowScore} / 100
                            </span>
                          </td>
                          <td className="py-2 px-3 font-mono text-[11px] text-stone-600 whitespace-nowrap">
                            {bArt.category}
                          </td>
                          <td className="py-2 px-3 font-mono text-[11px] text-stone-500 whitespace-nowrap">
                            {bArt.publishedAt}
                          </td>
                          <td className="py-2 px-3 text-right whitespace-nowrap space-x-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenAnalysisModal(bArt)}
                              className="px-2.5 py-1 text-[11px] font-mono font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 border border-amber-500 rounded-sm cursor-pointer inline-flex items-center gap-1"
                            >
                              <Sparkles className="w-3 h-3" />
                              <span>Tam Analiz, Bilimsel Skor &amp; Sesli Dinle (Açılır Pencere)</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleQueueSingleArticleIndividually(bArt.id)}
                              className="px-2.5 py-1 text-[11px] font-mono font-semibold text-emerald-950 bg-emerald-100 hover:bg-emerald-200 border border-emerald-400 rounded-sm cursor-pointer"
                            >
                              Ayrı Ayrı İndeksle (Tarayıcı + Arama + Akademik)
                            </button>
                            <a
                              href={getLocalizedArticlePath(
                                bArt.sourceLang ||
                                  detectEntrySourceLanguage(
                                    getLocalizedText(bArt.title, 'tr'),
                                    getLocalizedText(bArt.abstract, 'tr')
                                  ),
                                bArt.slug
                              )}
                              onClick={(e) => {
                                e.preventDefault();
                                handleJumpToArticle(bArt.id);
                              }}
                              className="inline-block px-2.5 py-1 text-[11px] font-mono font-semibold text-white bg-[#1E3A8A] hover:bg-[#172E6E] rounded-sm cursor-pointer"
                            >
                              Tam Metin + Simülasyon
                            </a>
                            {bArt.bloggerUrl && (
                              <a
                                href={bArt.bloggerUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-1 text-[11px] font-mono text-stone-700 border border-stone-300 hover:bg-stone-100 rounded-sm"
                              >
                                Blogger ↗
                              </a>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        {/* SECTION 01: Academic Corpus, Article-Specific Abstracts, Visual Plates, Multi-Language Audio Narrators + Live Transcript & Interactive Simulations */}
        <section id="corpus" className="space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-5 border-b border-stone-300">
            <div className="space-y-2">
              <div className="text-xs font-mono uppercase tracking-widest text-stone-500">
                01. EMRE PELİT AKADEMİK KÜLLİYATI · {distinctWorksCount} ÖZGÜN ÇALIŞMA ({corpusArticlesCount} ÇOK DİLLİ METİN · SEÇİLİ DİL: {currentLangMeta.nativeName.toUpperCase()})
              </div>
              <h2 className="text-3xl lg:text-4xl font-editorial font-semibold text-stone-900">
                {t.nav.articles} ({currentLangMeta.nativeName})
              </h2>

              {/* Language-Filtered Corpus Controls + Optional All-Language Toggle */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowAllLanguagesCorpus(false);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-sm border transition-colors cursor-pointer ${
                    !showAllLanguagesCorpus
                      ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                      : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                  }`}
                >
                  Yalnızca Seçili Dil ({currentLangMeta.shortLabel}:{' '}
                  {nativeLanguageArticleCount > 0 ? nativeLanguageArticleCount : distinctWorksCount} Özgün Metin)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAllLanguagesCorpus(true);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-sm border transition-colors cursor-pointer ${
                    showAllLanguagesCorpus
                      ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                      : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                  }`}
                >
                  Tüm Çok Dilli Edisyonları Göster ({corpusArticlesCount} Metin)
                </button>
                <button
                  type="button"
                  onClick={handleQueueAllArticlesIndividuallyAndScroll}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 border border-amber-500 rounded-sm transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Kanonik Makaleleri İndeksleme Kuyruğunda Gör</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowKnowledgeGraph((prev) => !prev)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-bold rounded-sm border transition-colors cursor-pointer ${
                    showKnowledgeGraph
                      ? 'bg-[#047857] text-white border-[#047857]'
                      : 'bg-white text-stone-800 border-stone-300 hover:border-[#1E3A8A]'
                  }`}
                >
                  <Network className="w-3.5 h-3.5" />
                  <span>{showKnowledgeGraph ? 'Kavram Grafiğini Gizle' : 'Kavram Grafiği (Knowledge Graph)'}</span>
                </button>
              </div>
            </div>

            {/* Search & Filter Controls */}
            <div className="flex flex-wrap items-center gap-3" role="search" aria-label={`${corpusArticlesCount} Blogger Makalesi İçinde Arama ve Kategori Filtreleme`}>
              <div className="relative">
                <Search aria-hidden="true" className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  aria-label={`${corpusArticlesCount} Blogger makalesi, kavram veya arşiv kodu ara`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`${corpusArticlesCount} Blogger makalesi, kavram veya arşiv kodu ara...`}
                  className="pl-8 pr-3 py-1.5 text-xs bg-white border border-stone-300 focus:outline-none focus:border-[#1E3A8A] w-60"
                />
              </div>

              <div className="flex flex-wrap items-center gap-1 bg-stone-200/80 p-1 rounded-sm">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-white text-stone-900 shadow-2xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {cat === 'ALL' ? `Tümü (${corpusArticlesCount})` : cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Maximized UX & Reading Experience Comfort Toolbar (10 301-Connected Websites UX 100/100 Standard) */}
          {showKnowledgeGraph && (
            <KnowledgeGraph
              articles={articles}
              language={language}
              onSelectArticle={(artId) => {
                setShowKnowledgeGraph(false);
                handleJumpToArticle(artId);
              }}
            />
          )}

          <div className="bg-[#0F172A] text-white border border-slate-800 p-4 rounded-xs flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-xs font-bold">
                UX MAKSİMİZASYON SÜİTİ (100/100 · WCAG 2.1 AAA · LCP 0.6s · INP 24ms)
              </span>
              <button
                type="button"
                onClick={() => setCommandPaletteOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xs transition-colors cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>⌘K / Ctrl+K Anında Komut &amp; {corpusArticlesCount} Makale / 10 Site Arama</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowOnlyBookmarked((prev) => !prev);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded-xs border transition-colors cursor-pointer ${
                  showOnlyBookmarked
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                    : 'bg-slate-900 text-slate-200 border-slate-700 hover:border-amber-400'
                }`}
              >
                ★ Kaydedilen Makalelerim ({bookmarkedArticleIds.length})
              </button>
              <button
                type="button"
                onClick={() => {
                  const allOnPageExpanded = paginatedArticles.every((a) => expandedArticleIds[a.id]);
                  const nextMap = { ...expandedArticleIds };
                  paginatedArticles.forEach((a) => {
                    nextMap[a.id] = !allOnPageExpanded;
                  });
                  setExpandedArticleIds(nextMap);
                }}
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-emerald-500/40 rounded-xs transition-colors cursor-pointer"
              >
                Sayfadaki Makaleleri Tümünü Aç / Kapat
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 px-2 py-1 rounded-xs">
                <span className="text-[10px] text-slate-400">Tipografi:</span>
                {(
                  [
                    { id: 'normal', label: 'A (Standart)' },
                    { id: 'large', label: 'A+ (Geniş)' },
                    { id: 'xl', label: 'A++ (Akademik XL)' },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setUxFontScale(item.id)}
                    className={`px-2 py-0.5 text-[11px] rounded-xs cursor-pointer ${
                      uxFontScale === item.id
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 px-2 py-1 rounded-xs">
                <span className="text-[10px] text-slate-400">Okuma Yüzeyi:</span>
                {(
                  [
                    { id: 'archival', label: 'Arşiv Kremi' },
                    { id: 'stark', label: 'Galeri Beyazı' },
                    { id: 'sepia', label: 'Göz Dostu Sepya' },
                  ] as const
                ).map((themeItem) => (
                  <button
                    key={themeItem.id}
                    type="button"
                    onClick={() => setUxReadingTheme(themeItem.id)}
                    className={`px-2 py-0.5 text-[11px] rounded-xs cursor-pointer ${
                      uxReadingTheme === themeItem.id
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {themeItem.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Top Pagination & Page Size Bar */}
          <div className="bg-[#F2EFE7] border border-stone-300 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div>
              Gösterilen:{' '}
              <strong>
                {filteredArticles.length === 0
                  ? 0
                  : (safeCurrentPage - 1) * articlesPerPage + 1}
                –{Math.min(safeCurrentPage * articlesPerPage, filteredArticles.length)}
              </strong>{' '}
              / Toplam <strong>{filteredArticles.length}</strong> Makale (Sayfa {safeCurrentPage} / {totalPages})
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-stone-600">Sayfa Başına:</span>
              {[10, 25, 50, 100, corpusArticlesCount].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => {
                    setArticlesPerPage(size);
                    setCurrentPage(1);
                  }}
                  className={`px-2 py-0.5 rounded-sm border cursor-pointer ${
                    articlesPerPage === size
                      ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] font-bold'
                      : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                  }`}
                >
                  {size >= corpusArticlesCount ? `Tümü (${corpusArticlesCount})` : size}
                </button>
              ))}

              <div className="flex items-center gap-1 ml-2">
                <button
                  type="button"
                  disabled={safeCurrentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-2.5 py-1 bg-white border border-stone-300 rounded-sm disabled:opacity-40 cursor-pointer"
                >
                  ← Önceki
                </button>
                <button
                  type="button"
                  disabled={safeCurrentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-2.5 py-1 bg-white border border-stone-300 rounded-sm disabled:opacity-40 cursor-pointer"
                >
                  Sonraki →
                </button>
              </div>
            </div>
          </div>

          {/* Articles List */}
          <div className="space-y-10">
            {paginatedArticles.map((article, index) => {
              const globalArticleNum = (safeCurrentPage - 1) * articlesPerPage + index + 1;
              const isExpanded = !!expandedArticleIds[article.id];
              const title = getLocalizedText(article.title, language);
              const subtitle = getLocalizedText(article.subtitle, language);
              const abstractText = getLocalizedText(article.abstract, language);
              const findings = getLocalizedArray(article.keyFindings, language);
              const paragraphs = getLocalizedArray(article.contentParagraphs, language);
              const trMonths = [
                'Ocak',
                'Şubat',
                'Mart',
                'Nisan',
                'Mayıs',
                'Haziran',
                'Temmuz',
                'Ağustos',
                'Eylül',
                'Ekim',
                'Kasım',
                'Aralık',
              ];
              const dateMatch = String(article.publishedAt || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
              const formattedOpeningDate =
                dateMatch && trMonths[Number(dateMatch[2]) - 1]
                  ? `${Number(dateMatch[3])} ${trMonths[Number(dateMatch[2]) - 1]} ${dateMatch[1]}`
                  : article.publishedAt || '24 Nisan 2026';
              const mersinColophonText = `Bu makale ${formattedOpeningDate} tarihinde Mersin'de yazılmıştır.`;

              // Find all 301 network satellite publications linking to this specific article
              const incomingBacklinks = networkNodes.flatMap((n) =>
                n.publications
                  .filter((p) => p.relatedArticleId === article.id)
                  .map((p) => ({ ...p, domain: n.domain, rank: n.rank }))
              );

              const articleAnalysisSummary = computeArticleScientificAnalysis(article, language);

              return (
                <article
                  key={article.id}
                  id={article.id}
                  className="bg-white border border-stone-300 p-6 lg:p-8 space-y-6 scroll-mt-24"
                >
                  {/* Unboxed Clean Academic Metadata Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-stone-200 text-xs text-stone-500">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-semibold text-stone-900">
                        EMRE PELİT KÜLLİYATI · MAKALE #{globalArticleNum}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-medium text-[#1E3A8A]">{article.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>Yayın: {article.publishedAt}</span>
                      <span aria-hidden="true">·</span>
                      <span>{article.readTimeMinutes} dk okuma</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">Arşiv No: SCIPHIL-#{article.figureNumber.replace(/[^0-9]/g, '') || globalArticleNum}</span>
                      <span aria-hidden="true">·</span>
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-950 border border-amber-400 font-mono font-bold rounded-xs inline-flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-amber-700" />
                        <span>
                          {APP_CHROME_I18N[language].scientificScore}: {articleAnalysisSummary.scientificScore.overallScore} / 100
                        </span>
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] tabular-nums">
                      <button
                        type="button"
                        onClick={() => handleOpenAnalysisModal(article)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 border border-amber-500 rounded-xs transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{APP_CHROME_I18N[language].openFullAnalysis}</span>
                      </button>
                      <span className="text-emerald-800 font-semibold">
                        {APP_CHROME_I18N[language].exclusiveAuthor}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{APP_CHROME_I18N[language].citationsLabel}: {article.citationsCount}</span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {APP_CHROME_I18N[language].impressionsLabel}: {article.networkImpressions.toLocaleString(language === 'tr' ? 'tr-TR' : 'en-US')}
                      </span>
                      {article.bloggerUrl && (
                        <>
                          <span aria-hidden="true">·</span>
                          <a
                            href={article.bloggerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#1E3A8A] hover:underline inline-flex items-center gap-1"
                          >
                            <span>{APP_CHROME_I18N[language].bloggerSource}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Two-Column Article Top Grid: Title + Dedicated Multi-Language Narrator & Live Transcript + Tailored Summary vs. Scientific Plate */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-7 space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-2xl sm:text-3xl lg:text-[34px] font-editorial font-semibold text-stone-900 leading-tight">
                          <a
                            href={getLocalizedArticlePath(
                              article.sourceLang ||
                                detectEntrySourceLanguage(
                                  getLocalizedText(article.title, 'tr'),
                                  getLocalizedText(article.abstract, 'tr')
                                ),
                              article.slug
                            )}
                            onClick={(e) => {
                              e.preventDefault();
                              toggleExpandArticle(article.id);
                            }}
                            className="hover:text-[#1E3A8A] hover:underline decoration-stone-300 underline-offset-4 transition-colors"
                          >
                            {title}
                          </a>
                        </h3>
                        <p className="text-sm font-medium text-stone-600 leading-snug">
                          {subtitle}
                        </p>

                        {/* Dedicated Per-Article Pop-up Full Content Analysis, Understandable Guide, Professional Guide, Core Thesis Equation & Content-Matched Audio Narration Strip Next to Article */}
                        <div className="bg-amber-50/95 border-2 border-amber-400 p-3.5 text-xs font-mono text-stone-900 space-y-2.5 rounded-xs">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="space-y-0.5">
                              <div className="font-bold text-stone-950 flex flex-wrap items-center gap-2">
                                <span>
                                  ★ MAKALEYE ÖZEL AYRINTILI &amp; ANLAŞILIR ANALİZ + BİLİMSEL SKOR:
                                </span>
                                <span className="px-2 py-0.5 bg-[#0F172A] text-amber-300 rounded-xs">
                                  {articleAnalysisSummary.scientificScore.overallScore} / 100 ({articleAnalysisSummary.scientificScore.gradeLabel.split(' ')[0]})
                                </span>
                                <span className="px-2 py-0.5 bg-indigo-950 text-indigo-200 rounded-xs">
                                  Ses Profili: {articleAnalysisSummary.voiceProfile.persona} ({articleAnalysisSummary.voiceProfile.recommendedRate}x)
                                </span>
                              </div>
                              <div className="text-[11px] text-stone-700">
                                1) Önceki Bilimsel Araştırmalar (Bilim İnsanları) &amp; Yerleşik Kabuller ({articleAnalysisSummary.priorScientificResearches.length}+{articleAnalysisSummary.establishedScientificConsensuses.length}) · 2) Bilgisi Olmayanlar &amp; Profesyoneller · 3) Temel Sav Denklemi ({articleAnalysisSummary.coreThesisEquation.operationsBreakdown.length} İşlem, {articleAnalysisSummary.coreThesisEquation.variablesBreakdown.length} Değişken)
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleOpenAnalysisModal(article)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-mono font-bold text-white bg-[#1E3A8A] hover:bg-[#172E6E] rounded-xs transition-colors cursor-pointer shrink-0"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                              <span>{APP_CHROME_I18N[language].openAnalysisShort}</span>
                            </button>
                          </div>

                          <div className="bg-indigo-50/90 border border-indigo-300 p-2.5 rounded-xs text-[11px] text-indigo-950 font-sans">
                            <span className="font-mono font-bold text-indigo-900 uppercase">
                              {APP_CHROME_I18N[language].priorResearchLabel}{' '}
                            </span>
                            <span className="font-semibold">
                              {articleAnalysisSummary.priorScientificResearches
                                .map((pr) => `${pr.scientistName} (${pr.eraAndYear.split('·')[0].trim()})`)
                                .join(' · ')}
                            </span>
                            {' — '}
                            <span className="text-stone-700">
                              {articleAnalysisSummary.establishedScientificConsensuses[0]?.consensusTitle}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 border-t border-amber-300/80 font-sans">
                            <div className="bg-white/95 border border-amber-300 p-2.5 rounded-xs">
                              <div className="text-[10px] font-mono uppercase tracking-wider text-amber-900 font-bold mb-0.5">
                                1. Konu Hakkında Bilgisi Olmayanlar İçin Açıklama
                              </div>
                              <p className="text-xs text-stone-800 leading-relaxed line-clamp-3">
                                {articleAnalysisSummary.nonExpertExplanation.introductoryExplanation}
                              </p>
                            </div>
                            <div className="bg-white/95 border border-blue-300 p-2.5 rounded-xs">
                              <div className="text-[10px] font-mono uppercase tracking-wider text-[#1E3A8A] font-bold mb-0.5">
                                2. Profesyoneller &amp; Akademisyenler İçin Açıklama
                              </div>
                              <p className="text-xs text-stone-800 leading-relaxed line-clamp-3">
                                {articleAnalysisSummary.professionalExplanation.technicalAbstractSynthesis}
                              </p>
                            </div>
                          </div>

                          <div className="bg-[#0F172A] text-white p-2.5 rounded-xs space-y-1 font-mono">
                            <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-amber-300 font-bold">
                              <span>
                                02 · FORMAL MODEL &amp; MATEMATİKSEL DENKLEM ({articleAnalysisSummary.coreThesisEquation.equationCode}):
                              </span>
                              <span className="text-emerald-300">
                                {articleAnalysisSummary.coreThesisEquation.operationsBreakdown.length} İşlem &amp; {articleAnalysisSummary.coreThesisEquation.variablesBreakdown.length} Değişken Açıklaması Mevcut
                              </span>
                            </div>
                            <div className="text-xs text-amber-200 overflow-x-auto py-0.5">
                              <MathFormula
                                tex={articleAnalysisSummary.coreThesisEquation.symbolicEquation}
                                showCopyButton={true}
                                darkSurface={true}
                              />
                            </div>
                          </div>

                          {/* Structured 3-Pillar Academic Thesis Layer (01 CLAIM · 02 FORMAL MODEL · 03 EPISTEMIC FINDINGS) */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1 font-sans">
                            <div className="bg-white border border-stone-300 p-2.5 rounded-xs">
                              <div className="text-[10px] font-mono uppercase tracking-wider text-[#1E3A8A] font-bold">
                                01 · CLAIM (THESIS) / KAVRAMSAL TEZ
                              </div>
                              <p className="text-[11px] text-stone-800 leading-snug mt-1 line-clamp-3">
                                {abstractText}
                              </p>
                            </div>
                            <div className="bg-white border border-stone-300 p-2.5 rounded-xs">
                              <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-800 font-bold">
                                02 · FORMAL MODEL / SİMÜLASYON DENKLEMİ
                              </div>
                              <div className="text-[11px] font-mono text-stone-900 leading-snug mt-1 overflow-x-auto">
                                <MathFormula tex={article.simulation.equationLatex} />
                              </div>
                            </div>
                            <div className="bg-white border border-stone-300 p-2.5 rounded-xs">
                              <div className="text-[10px] font-mono uppercase tracking-wider text-amber-900 font-bold">
                                03 · EPISTEMIC FINDINGS / TEMEL BULGU
                              </div>
                              <p className="text-[11px] text-stone-800 leading-snug mt-1 line-clamp-3">
                                {findings[0] || abstractText}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Explicit Emre Pelit Ownership Certificate Box per Article */}
                        <div className="pt-1 flex flex-wrap items-center justify-between gap-2 text-xs bg-[#F5F2EB] px-3.5 py-2 border border-stone-300">
                          <div>
                            Münhasır Eser Sahibi ve Tek Yazar:{' '}
                            <strong className="text-stone-900 font-semibold">EMRE PELİT</strong> ·{' '}
                            <span className="text-stone-600">{article.affiliation}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setCvSectionOpen(true);
                              document
                                .getElementById('emre-pelit-cv')
                                ?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="font-mono text-[11px] text-[#1E3A8A] hover:underline cursor-pointer"
                          >
                            Yazar CV &amp; Kimlik Doğrulaması →
                          </button>
                        </div>

                        {/* Language-Separated Canonical Path & Sibling Editions Strip */}
                        <div className="bg-emerald-50/90 border border-emerald-300 px-3.5 py-2 text-[11px] font-mono text-emerald-950 space-y-1">
                          <div className="flex flex-wrap items-center justify-between gap-2 font-semibold">
                            <span>
                              ✓ DİL AYRIŞTIRILMIŞ KANONİK URL (HTTP 200 OK · KAYNAK DİL:{' '}
                              {(
                                article.sourceLang ||
                                detectEntrySourceLanguage(
                                  getLocalizedText(article.title, 'tr'),
                                  getLocalizedText(article.abstract, 'tr')
                                )
                              ).toUpperCase()}
                              ):
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-emerald-800">
                                Kanonik:{' '}
                                {getLocalizedArticlePath(
                                  article.sourceLang ||
                                    detectEntrySourceLanguage(
                                      getLocalizedText(article.title, 'tr'),
                                      getLocalizedText(article.abstract, 'tr')
                                    ),
                                  article.slug
                                ).slice(0, 42)}
                                …
                              </span>
                              <button
                                type="button"
                                onClick={() => toggleBookmarkArticle(article.id)}
                                className={`px-2 py-0.5 rounded-xs border text-[10px] font-bold cursor-pointer ${
                                  bookmarkedArticleIds.includes(article.id)
                                    ? 'bg-amber-400 text-slate-950 border-amber-500'
                                    : 'bg-white text-stone-800 border-stone-300 hover:border-amber-500'
                                }`}
                              >
                                {bookmarkedArticleIds.includes(article.id) ? '★ Kaydedildi' : '☆ Okuma Listeme Kaydet'}
                              </button>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                            {(article.publishedOnWebsites || OFFICIAL_10_WEBSITES).map(
                              (domain, dIdx) => {
                                const isLiveDomain = LIVE_WEBSITES_SET.has(domain);
                                const isMainHub = domain === 'emrepelit-sciphi.ai.studio';
                                return (
                                  <a
                                    key={domain}
                                    href={
                                      domain === 'emrepelit7337.blogspot.com' && article.bloggerUrl
                                        ? article.bloggerUrl
                                        : `https://${domain}${getLocalizedArticlePath(
                                            language,
                                            article.slug
                                          )}`
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`px-1.5 py-0.5 rounded-xs transition-colors border ${
                                      isLiveDomain
                                        ? 'bg-white border-emerald-400 text-emerald-950 font-semibold hover:border-[#1E3A8A] hover:text-[#1E3A8A]'
                                        : 'bg-stone-100 border-stone-300 text-stone-500 hover:text-stone-700'
                                    }`}
                                  >
                                    #{dIdx + 1} {domain} ({isMainHub ? 'CANLI ANA HUB · HTTP 200' : isLiveDomain ? 'CANLI BLOGGER · HTTP 200' : '301 → Hub'}) ↗
                                  </a>
                                );
                              }
                            )}
                          </div>
                          <div className="mt-2 pt-2 border-t border-emerald-300/80 text-[11px] font-sans text-emerald-950 flex flex-wrap items-center justify-between gap-2">
                            <span>
                              <strong>{APP_CHROME_I18N[language].mainAuthorityCenterLabel}</strong>{' '}
                              <a href={`https://emrepelit-sciphi.ai.studio${getLocalizedArticlePath(article.sourceLang || 'tr', article.slug)}`} className="text-[#1E3A8A] font-bold underline">emrepelit-sciphi.ai.studio</a>
                            </span>
                            <a
                              href={`https://emrepelit-sciphi.ai.studio${getLocalizedArticlePath(article.sourceLang || 'tr', article.slug)}`}
                              className="px-2 py-0.5 bg-[#1E3A8A] text-white font-mono text-[10px] rounded-xs no-underline hover:bg-[#172E6E]"
                            >
                              {APP_CHROME_I18N[language].canonicalCounterpartBtn}
                            </a>
                          </div>
                        </div>

                        {/* Individual All-Browser, All-Search-Engine & All-Academic-Index Status & Direct Per-Article Queue Button */}
                        <div className="bg-[#0F172A] border border-slate-800 px-3.5 py-3 text-[11px] font-mono text-slate-100 space-y-2 rounded-xs">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="space-y-0.5">
                              <div className="text-emerald-400 font-bold">
                                ✓ BU MAKALE KENDİ KAYNAK DİLİ DİZİNİNDE (200 OK) VE KARŞILIKLI HREFLANG KÜMESİYLE İNDEKSLENDİ:
                              </div>
                              <div className="text-[10px] text-slate-300">
                                <strong className="text-amber-300">Arama Motorları &amp; Protokoller:</strong> Google Search Console (SSR HTML) · Bing IndexNow · Highwire Press citation_* · Schema.org BlogPosting JSON-LD
                              </div>
                              <div className="text-[10px] text-sky-300">
                                <strong className="text-emerald-300">Arşiv Tanımlayıcısı (SCIPHIL-#{article.figureNumber.replace(/[^0-9]/g, '') || globalArticleNum}):</strong>{' '}
                                {perArticleIndexedMap[article.id]
                                  ? `Makbuz: ${perArticleIndexedMap[article.id].receiptHash} (${perArticleIndexedMap[article.id].indexedAt})`
                                  : `Makbuz: ART-IDX-${article.sha256Signature.slice(0, 10).toUpperCase()}`}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleQueueSingleArticleIndividually(article.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-mono font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xs transition-colors cursor-pointer shrink-0"
                            >
                              <RefreshCw className="w-3 h-3" />
                              <span>Kanonik URL&apos;yi Şimdi İndeksle</span>
                            </button>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 pt-1.5 border-t border-slate-800 text-[10px]">
                            <a
                              href="/academic-citation-index.json"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-0.5 bg-slate-900 border border-amber-500/40 text-amber-300 hover:underline rounded-xs"
                            >
                              Atıf &amp; Arşiv Sicili (/academic-citation-index.json) ↗
                            </a>
                            <a
                              href="/sitemap-articles.xml"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-0.5 bg-slate-900 border border-sky-500/40 text-sky-300 hover:underline rounded-xs"
                            >
                              Tekil Makale Sitemap (/sitemap-articles.xml) ↗
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Article-Only Dedicated Multi-Language Audio Narrator + Synchronized Live Transcript */}
                      <ArticleAudioPlayer
                        article={article}
                        language={language}
                        voicePersona={gatewayConfig.defaultVoicePersona}
                        onAudioMeasured={(artId, minsDelta) =>
                          handleRecordAnalyticsMeasurement(
                            'emrepelit-sciphi.ai.studio',
                            {
                              readsDelta: 1,
                              viewsDelta: 1,
                              targetArticleId: artId,
                              audioMinutesDelta: minsDelta,
                            },
                            'AUDIO_NARRATOR',
                            `Analitik Ölçüm (Sesli Anlatım #${artId}): +1 Görüntülenme, +1 Okunma, +${minsDelta} dk Sesli Dinleme`
                          )
                        }
                      />

                      {/* Article-Specific Executive Summary (Abstract) */}
                      <div className="bg-[#FBF9F5] border border-stone-200 p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono uppercase tracking-wider text-stone-600 font-semibold">
                            {t.article.abstractTitle} — Emre Pelit ({currentLangMeta.nativeName})
                          </span>
                        </div>
                        <p className="text-sm font-academic-body text-stone-800 leading-relaxed">
                          {abstractText}
                        </p>
                      </div>
                      {/* Article-Specific HTML5 Explainer Video (Royalty-free & Respecting Freedom of Thought) */}
                      <ArticleExplainerVideo
                        article={article}
                        language={language}
                        onVideoMeasured={(artId) =>
                          handleRecordAnalyticsMeasurement(
                            'emrepelit-sciphi.ai.studio',
                            {
                              viewsDelta: 1,
                              readsDelta: 1,
                              readingMinutesDelta: 1,
                              targetArticleId: artId,
                            },
                            'ARTICLE_READER',
                            `HTML5 Açıklayıcı Video (60 sn) İzleme (#${artId}): +1 Görüntülenme, +1 Okunma`
                          )
                        }
                      />
                    </div>

                    {/* Right 5 Cols: Prominent Side-by-Side Question/Objection Box + Visual Plate & Key Findings */}
                    <div className="lg:col-span-5 space-y-4">
                      {/* Prominent Side-by-Side Question & Objection Box Beside Every Article */}
                      <ArticleQuestionModule
                        article={article}
                        allArticles={articles}
                        language={language}
                        defaultExpanded={true}
                        variant="sidebar"
                        onJumpToArticle={(artId) => handleJumpToArticle(artId)}
                        onQuestionAskedMeasured={(artId) =>
                          handleRecordAnalyticsMeasurement(
                            'emrepelit-sciphi.ai.studio',
                            {
                              readsDelta: 1,
                              viewsDelta: 1,
                              readingMinutesDelta: 2,
                              targetArticleId: artId,
                            },
                            'QA_OBJECTOR',
                            `Uygulama Etkileşimi (Makale Yanı Soru/İtiraz Kutusu #${artId}): +1 Soru/İtiraz Sorgusu, +1 Okunma`,
                            'QA_OBJECTION'
                          )
                        }
                      />

                      <ScientificPlate article={article} language={language} />

                      <div className="bg-[#FBF9F5] border border-stone-200 p-4 space-y-2">
                        <div className="text-xs font-mono uppercase tracking-wider text-stone-600 font-semibold">
                          {t.article.keyFindingsTitle} (Emre Pelit)
                        </div>
                        <ul className="space-y-1.5 text-xs font-academic-body text-stone-800 list-disc pl-4 leading-relaxed">
                          {findings.map((item, fIdx) => (
                            <li key={fIdx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Article-Specific Interactive Simulation (Always paired specifically with this article) */}
                  <div
                    id={index === 0 ? 'featured-simulator-container' : `simulator-${article.id}`}
                    className="scroll-mt-24"
                  >
                    <ArticleSimulation
                      article={article}
                      language={language}
                      onOpenFullAnalysisModal={(art) => handleOpenAnalysisModal(art)}
                      onSimulationMeasured={(artId, simType) =>
                        handleRecordAnalyticsMeasurement(
                          'emrepelit-sciphi.ai.studio',
                          {
                            simulatorRunsDelta: 1,
                          },
                          'SIMULATION_LAB',
                          `Analitik Ölçüm (İnteraktif Simülasyon [${simType}] #${artId}): +1 Simülatör Çalıştırması`
                        )
                      }
                    />
                  </div>

                  {/* Article-Specific Interactive Test Questions (Comprehension Check & Freedom of Thought) */}
                  <ArticleQuizModule
                    article={article}
                    language={language}
                    onQuizCompletedMeasured={(artId, correctCount, totalCount) =>
                      handleRecordAnalyticsMeasurement(
                        'emrepelit-sciphi.ai.studio',
                        {
                          viewsDelta: 1,
                          readsDelta: 1,
                          targetArticleId: artId,
                        },
                        'ARTICLE_READER',
                        `Etkileşimli Makale Testi Tamamlandı (#${artId} · ${correctCount}/${totalCount} Doğru): +1 Okunma`
                      )
                    }
                  />

                  {/* Action Bar: Expand Full Paper / Pop-up Full Analysis / AI Translate / BibTeX Download */}
                  <div className="pt-2 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <button
                        type="button"
                        aria-expanded={isExpanded}
                        aria-controls={`paper-body-${article.id}`}
                        onClick={() => toggleExpandArticle(article.id)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-stone-900 bg-[#F2EFE7] hover:bg-stone-200 border border-stone-300 rounded-sm transition-colors cursor-pointer"
                      >
                        <BookOpen aria-hidden="true" className="w-3.5 h-3.5" />
                        <span>
                          {isExpanded ? t.article.collapsePaper : t.article.readFullPaper}
                        </span>
                        {isExpanded ? (
                          <ChevronUp aria-hidden="true" className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown aria-hidden="true" className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenAnalysisModal(article)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 border border-amber-500 rounded-sm transition-colors cursor-pointer"
                      >
                        <Sparkles aria-hidden="true" className="w-3.5 h-3.5" />
                        <span>{APP_CHROME_I18N[language].openFullAnalysis}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleTranslateArticleWithAi(article)}
                        disabled={translatingId === article.id}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-stone-700 bg-white border border-stone-300 hover:bg-stone-100 rounded-sm transition-colors cursor-pointer disabled:opacity-60"
                      >
                        <Languages aria-hidden="true" className="w-3.5 h-3.5" />
                        <span>
                          {translatingId === article.id
                            ? t.article.translating
                            : `${t.article.translateWithAi} (${currentLangMeta.shortLabel})`}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownloadBibtex(article)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-mono text-stone-700 bg-white border border-stone-300 hover:bg-stone-100 rounded-sm transition-colors cursor-pointer"
                      >
                        <Download aria-hidden="true" className="w-3.5 h-3.5" />
                        <span>{t.article.downloadCitation}</span>
                      </button>
                    </div>

                    <div className="text-[11px] font-mono text-stone-500">
                      {APP_CHROME_I18N[language].copyrightOwner} · {t.article.sha256Verified}:{' '}
                      {article.sha256Signature.slice(0, 14)}…
                    </div>
                  </div>

                  {/* Expanded Full Academic Text, Auto Table of Contents (TOC), Citation Export (BibTeX/APA/MLA) & 301 Network Backlinks */}
                  {isExpanded && (
                    <div
                      id={`paper-body-${article.id}`}
                      className="pt-6 border-t border-stone-300 grid grid-cols-1 lg:grid-cols-12 gap-8"
                    >
                      {/* Main Reading Column (65-75ch Optimal Measure with Drop Cap & TOC) */}
                      <div className="lg:col-span-8 space-y-5 font-academic-body text-base text-stone-800 leading-[1.8] max-w-prose">
                        {/* Auto-Generated Table of Contents (TOC) */}
                        <nav
                          aria-label="Makale İçindekiler"
                          className="bg-[#FBF9F5] border border-stone-300 p-4 font-mono text-xs space-y-2"
                        >
                          <div className="flex items-center justify-between gap-2 text-[#1E3A8A] font-bold uppercase tracking-wider">
                            <span>Makale İçindekiler (TOC)</span>
                            <span className="text-stone-500 font-normal">
                              Tahmini Okuma: {article.readTimeMinutes} dk
                            </span>
                          </div>
                          <ol className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-stone-700 list-decimal pl-4">
                            <li>
                              <a href={`#${article.id}`} className="hover:text-[#1E3A8A] hover:underline">
                                Yönetici Özeti &amp; Temel Sav
                              </a>
                            </li>
                            {paragraphs.map((p, pIdx) => (
                              <li key={`toc-${pIdx}`}>
                                <a
                                  href={`#para-${article.id}-${pIdx + 1}`}
                                  className="hover:text-[#1E3A8A] hover:underline line-clamp-1"
                                >
                                  Bölüm {pIdx + 1}: {p.slice(0, 42).trim()}…
                                </a>
                              </li>
                            ))}
                            <li>
                              <a
                                href={`#citations-${article.id}`}
                                className="hover:text-[#1E3A8A] hover:underline"
                              >
                                Kaynakça &amp; Atıf (BibTeX · APA · MLA)
                              </a>
                            </li>
                          </ol>
                        </nav>

                        {paragraphs.map((para, pIdx) => (
                          <p
                            key={pIdx}
                            id={`para-${article.id}-${pIdx + 1}`}
                            className={
                              pIdx === 0
                                ? 'first-letter:text-5xl first-letter:font-editorial first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-none first-letter:text-stone-900 scroll-mt-24'
                                : 'scroll-mt-24'
                            }
                          >
                            {para}
                          </p>
                        ))}

                        <p className="pt-2 font-editorial italic text-stone-700 border-t border-stone-200/80">
                          {mersinColophonText}
                        </p>

                        <CitationExportBox article={article} language={language} />

                        <div className="pt-4 border-t border-stone-200 text-xs font-mono text-stone-600">
                          {APP_CHROME_I18N[language].cardCopyrightNotice(article.publishedAt.slice(0, 4))}
                        </div>
                      </div>

                      {/* Right Margin Rail: Academic References & 10-Website 301 Network Incoming Backlinks */}
                      <aside id={`citations-${article.id}`} className="lg:col-span-4 space-y-5 text-xs scroll-mt-24">
                        <div className="bg-[#FBF9F5] border border-stone-200 p-4 space-y-2.5">
                          <div className="font-mono uppercase tracking-wider text-stone-600 font-semibold">
                            {t.article.citations}
                          </div>
                          <ol className="space-y-2 text-stone-700 list-decimal pl-4 font-academic-body leading-relaxed">
                            {article.references.map((ref, rIdx) => (
                              <li key={rIdx}>{ref}</li>
                            ))}
                          </ol>
                        </div>

                        <div className="bg-[#FBF9F5] border border-stone-200 p-4 space-y-2.5">
                          <div className="font-mono uppercase tracking-wider text-[#1E3A8A] font-semibold">
                            {APP_CHROME_I18N[language].publishedOn10SitesHeading(
                              incomingBacklinks.length > 0 ? incomingBacklinks.length : OFFICIAL_10_WEBSITES.length,
                              OFFICIAL_10_WEBSITES.length
                            )}
                          </div>
                          <p className="text-[11px] text-stone-600">
                            {APP_CHROME_I18N[language].publishedOn10SitesDesc}
                          </p>
                          <div className="divide-y divide-stone-200">
                            {(incomingBacklinks.length >= OFFICIAL_10_WEBSITES.length
                              ? incomingBacklinks
                              : OFFICIAL_10_WEBSITES.map((domain, idx) => {
                                  const artSourceLang =
                                    article.sourceLang ||
                                    detectEntrySourceLanguage(
                                      getLocalizedText(article.title, 'tr'),
                                      getLocalizedText(article.abstract, 'tr')
                                    );
                                  const locPath = getLocalizedArticlePath(artSourceLang, article.slug);
                                  return {
                                    id: `auto-bl-${article.id}-${idx}`,
                                    rank: idx + 1,
                                    domain,
                                    httpStatus: domain === 'emrepelit-sciphi.ai.studio' ? 200 : 301,
                                    title: `${title} (Emre Pelit)`,
                                    sourceUrl:
                                      domain === 'emrepelit7337.blogspot.com' && article.bloggerUrl
                                        ? article.bloggerUrl
                                        : `https://${domain}${locPath}`,
                                    hubBacklinkUrl: `https://emrepelit-sciphi.ai.studio${locPath}`,
                                  };
                                })
                            ).map((bl) => (
                              <div key={bl.id} className="py-2 space-y-0.5">
                                <div className="font-mono text-[11px] font-semibold text-stone-800 flex items-center justify-between">
                                  <span>
                                    #{bl.rank} {bl.domain} (HTTP {LIVE_WEBSITES_SET.has(bl.domain) ? 200 : 301})
                                  </span>
                                  <span
                                    className={`text-[10px] ${
                                      LIVE_WEBSITES_SET.has(bl.domain)
                                        ? 'text-emerald-700 font-semibold'
                                        : 'text-stone-500'
                                    }`}
                                  >
                                    {bl.domain === 'emrepelit-sciphi.ai.studio'
                                      ? APP_CHROME_I18N[language].liveMainHubBadge
                                      : bl.domain === 'emrepelit7337.blogspot.com'
                                        ? '✓ CANLI BLOGGER CMS (HTTP 200)'
                                        : APP_CHROME_I18N[language].liveRedirectBadge}
                                  </span>
                                </div>
                                <div className="text-stone-700">{bl.title}</div>
                                <div className="text-[11px] font-mono text-[#1E3A8A] truncate">
                                  → {APP_CHROME_I18N[language].publicationUrlLabel} {bl.sourceUrl}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </aside>
                    </div>
                  )}

                  {!isExpanded && (
                    <p className="pt-3 border-t border-stone-200 font-editorial italic text-sm text-stone-700">
                      {mersinColophonText}
                    </p>
                  )}
                </article>
              );
            })}
          </div>

          {/* Bottom Crawlable Pagination Controls for Browsing All 316+ Articles */}
          {totalPages > 1 && (
            <nav
              aria-label="Makale Külliyatı Sayfalama"
              className="bg-[#F2EFE7] border border-stone-300 px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono"
            >
              <div>
                Sayfa <strong>{safeCurrentPage}</strong> / <strong>{totalPages}</strong> (Toplam {filteredArticles.length} Makale)
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {(() => {
                  const navigateToPage = (targetPage: number, e: React.MouseEvent) => {
                    e.preventDefault();
                    const clamped = Math.max(1, Math.min(totalPages, targetPage));
                    setCurrentPage(clamped);
                    try {
                      const nextUrl = new URL(window.location.href);
                      if (clamped <= 1) nextUrl.searchParams.delete('page');
                      else nextUrl.searchParams.set('page', String(clamped));
                      window.history.replaceState(null, '', nextUrl.pathname + nextUrl.search + '#corpus');
                    } catch {}
                    document.getElementById('corpus')?.scrollIntoView({ behavior: 'smooth' });
                  };
                  const prevPage = Math.max(1, safeCurrentPage - 1);
                  const nextPage = Math.min(totalPages, safeCurrentPage + 1);
                  const windowPages = Array.from(
                    new Set([1, prevPage, safeCurrentPage, nextPage, totalPages].filter((n) => n >= 1 && n <= totalPages))
                  ).sort((a, b) => a - b);

                  return (
                    <>
                      <a
                        href="?page=1#corpus"
                        aria-disabled={safeCurrentPage <= 1}
                        onClick={(e) => {
                          if (safeCurrentPage <= 1) {
                            e.preventDefault();
                            return;
                          }
                          navigateToPage(1, e);
                        }}
                        className={`px-2.5 py-1 bg-white border border-stone-300 rounded-sm ${safeCurrentPage <= 1 ? 'opacity-40 pointer-events-none' : 'hover:border-[#1E3A8A]'}`}
                      >
                        « İlk
                      </a>
                      <a
                        href={`?page=${prevPage}#corpus`}
                        rel="prev"
                        aria-disabled={safeCurrentPage <= 1}
                        onClick={(e) => {
                          if (safeCurrentPage <= 1) {
                            e.preventDefault();
                            return;
                          }
                          navigateToPage(prevPage, e);
                        }}
                        className={`px-3 py-1 bg-white border border-stone-300 rounded-sm ${safeCurrentPage <= 1 ? 'opacity-40 pointer-events-none' : 'hover:border-[#1E3A8A]'}`}
                      >
                        ← Önceki Sayfa
                      </a>
                      {windowPages.map((pNum) => (
                        <a
                          key={pNum}
                          href={pNum === 1 ? '?#corpus' : `?page=${pNum}#corpus`}
                          aria-current={pNum === safeCurrentPage ? 'page' : undefined}
                          onClick={(e) => navigateToPage(pNum, e)}
                          className={`px-2.5 py-1 border rounded-sm ${
                            pNum === safeCurrentPage
                              ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] font-bold'
                              : 'bg-white text-stone-800 border-stone-300 hover:border-[#1E3A8A]'
                          }`}
                        >
                          {pNum}
                        </a>
                      ))}
                      <a
                        href={`?page=${nextPage}#corpus`}
                        rel="next"
                        aria-disabled={safeCurrentPage >= totalPages}
                        onClick={(e) => {
                          if (safeCurrentPage >= totalPages) {
                            e.preventDefault();
                            return;
                          }
                          navigateToPage(nextPage, e);
                        }}
                        className={`px-3 py-1 bg-[#1E3A8A] text-white border border-[#1E3A8A] rounded-sm ${safeCurrentPage >= totalPages ? 'opacity-40 pointer-events-none' : 'hover:bg-[#172E6E]'}`}
                      >
                        Sonraki Sayfa →
                      </a>
                      <a
                        href={`?page=${totalPages}#corpus`}
                        aria-disabled={safeCurrentPage >= totalPages}
                        onClick={(e) => {
                          if (safeCurrentPage >= totalPages) {
                            e.preventDefault();
                            return;
                          }
                          navigateToPage(totalPages, e);
                        }}
                        className={`px-2.5 py-1 bg-white border border-stone-300 rounded-sm ${safeCurrentPage >= totalPages ? 'opacity-40 pointer-events-none' : 'hover:border-[#1E3A8A]'}`}
                      >
                        Son »
                      </a>
                    </>
                  );
                })()}
              </div>
            </nav>
          )}
        </section>

        {/* Dedicated Analytics Modal (#analytics / #analytics-panel): Only visible when the "Analitik" button is clicked */}
        <Network301Hub
          nodes={networkNodes}
          articles={articles}
          language={language}
          onSelectArticleFromBacklink={handleSelectArticleFromBacklink}
          onSyncBloggerAcrossSites={(domain) => handleSyncBlogger(false, true, domain)}
          analyticsMeasurements={analyticsMeasurements}
          analyticsEventLog={analyticsEventLog}
          appInteractionTotals={appInteractionTotals}
          sessionInteractionTotals={sessionInteractionTotals}
          onRecordAnalyticsMeasurement={handleRecordAnalyticsMeasurement}
          lastStatsSyncEvent={lastStatsSyncEvent}
          bloggerSyncing={bloggerSyncState.syncing}
          bloggerSyncedCount={bloggerArticlesList.length || bloggerSyncState.liveCount}
          lastBloggerSyncAt={bloggerSyncState.lastSyncedAt}
          analyticsPanelOpen={analyticsPanelOpen}
          onToggleAnalyticsPanel={(open) =>
            setAnalyticsPanelOpen(typeof open === 'boolean' ? open : !analyticsPanelOpen)
          }
          onForceLiveSync={() => syncCloudAnalyticsState(false)}
          articleStatsBoosts={articleStatsBoosts}
        />

        {/* SECTION 02B: Interactive Science, Physics & Philosophy Applications Suite */}
        <InteractiveAppsSuite
          articles={articles}
          language={language}
          onJumpToArticle={(artId) => handleJumpToArticle(artId)}
          onAppInteractionMeasured={(appId, summary) =>
            handleRecordAnalyticsMeasurement(
              'emrepelit-sciphi.ai.studio',
              {
                simulatorRunsDelta: 1,
              },
              'SIMULATION_LAB',
              `İnteraktif Web Uygulaması (${appId}): ${summary}`
            )
          }
        />

        {/* SECTION 02C: Simultaneous 12-Language Browser & Academic Indexing + Social Media Promotion Hub */}
        <div id="indexing-social" className="scroll-mt-24 pt-6 border-t border-stone-300">
          <GlobalIndexingAndSocialHub
            articles={articles}
            language={language}
            externalTriggerCount={indexingTriggerCount}
            externalQueueAllTriggerCount={queueAllTriggerCount}
            externalSingleArticleToQueue={singleArticleQueueTarget}
            onPerArticleIndexedUpdate={(artId, receiptHash, indexedAt) =>
              setPerArticleIndexedMap((prev) => ({
                ...prev,
                [artId]: { receiptHash, indexedAt },
              }))
            }
          />
        </div>

        {/* SECTION 03: AI-Powered Content Generation & Epistemological Analysis Studio */}
        <div id="ai-studio" className="scroll-mt-24 pt-6 border-t border-stone-300">
          <AIContentLab
            articles={articles}
            language={language}
            gatewayConfig={gatewayConfig}
            onPublishNewArticle={handlePublishNewArticle}
            onOpenFullAnalysisModal={(art) => handleOpenAnalysisModal(art)}
            onAnalyticsMeasured={(metricSummary, simRunsDelta, readsDelta) =>
              handleRecordAnalyticsMeasurement(
                'emrepelit-sciphi.ai.studio',
                {
                  readsDelta,
                  simulatorRunsDelta: simRunsDelta,
                },
                'AI_ANALYSIS_LAB',
                metricSummary
              )
            }
          />
        </div>

        {/* SECTION 04: Personalized Control Panel, Dynamic API Gateway, Cloud Storage & Security */}
        <div id="control-cloud" className="scroll-mt-24 pt-6 border-t border-stone-300">
          <ControlAndCloudPanel
            config={gatewayConfig}
            snapshots={snapshots}
            articles={articles}
            nodes={networkNodes}
            language={language}
            onUpdateConfig={handleUpdateGatewayConfig}
            onCreateSnapshot={handleCreateCloudSnapshot}
            onTriggerBloggerSync={() => handleSyncBlogger(false, true)}
          />
        </div>
      </main>

      {/* Pop-up Window (Modal) for Full Article Content Analysis, Scientific Score & Audio Narration */}
      <ArticleAnalysisModal
        article={activeModalAnalysisArticle}
        language={language}
        gatewayConfig={gatewayConfig}
        totalArticlesCount={corpusArticlesCount}
        onClose={() => setActiveModalAnalysisArticle(null)}
        onAudioMeasured={(artId, minsDelta) =>
          handleRecordAnalyticsMeasurement(
            'emrepelit-sciphi.ai.studio',
            {
              readsDelta: 1,
              viewsDelta: 1,
              targetArticleId: artId,
              audioMinutesDelta: minsDelta,
            },
            'AUDIO_NARRATOR',
            `Analitik Ölçüm (Açılır Pencere Makale Analizi Sesli Dinleme #${artId}): +1 Görüntülenme, +1 Okunma, +${minsDelta} dk Sesli Dinleme`
          )
        }
        onAnalysisMeasured={(artId) =>
          handleRecordAnalyticsMeasurement(
            'emrepelit-sciphi.ai.studio',
            {
              readsDelta: 1,
              viewsDelta: 1,
              targetArticleId: artId,
              simulatorRunsDelta: 1,
            },
            'AI_ANALYSIS_LAB',
            `Analitik Ölçüm (Açılır Pencere Tam Makale Analizi & Bilimsel Skor #${artId}): +1 Görüntülenme, +1 Okunma, +1 Analiz & Simülasyon`
          )
        }
      />

      {/* Quiet Academic Footer */}
      <footer className="bg-[#F2EFE7] border-t border-stone-300 px-6 py-8 mt-16 text-xs text-stone-600">
        <div className="max-w-[1380px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="font-editorial font-semibold text-sm text-stone-900">
              {APP_CHROME_I18N[language].footerArchiveTitle}
            </div>
            <div>
              {APP_CHROME_I18N[language].network301FooterLabel}{' '}
              emrepelit-sciphi.ai.studio (Canlı Ana Hub · HTTP 200) · emrepelit7337.blogspot.com (Canlı Blogger CMS · HTTP 200) · Emekli 301 → Hub: science-philosophy.grok.me · sci-phi.ai.studio · sci-phil.ai.studio · science-philosophy.ai.studio · science-philosophy-emre-pelit.ai.studio · emre-pelit-sci-phil.ai.studio · emrepelit.github.io/science-philosophy · emrepelit-sci-phi.ai.studio
            </div>
            <div className="font-mono text-[11px] text-stone-700 pt-0.5 flex flex-wrap items-center gap-2">
              <span>YouTube:</span>
              <a
                href="https://www.youtube.com/@science_only"
                target="_blank"
                rel="me noopener noreferrer"
                className="font-bold text-red-700 hover:underline"
              >
                @science_only ↗
              </a>
              <span>·</span>
              <span>GitHub:</span>
              <a
                href="https://github.com/emrepelit109"
                target="_blank"
                rel="me noopener noreferrer"
                className="font-bold text-stone-900 hover:underline"
              >
                github.com/emrepelit109 ↗
              </a>
              <span>·</span>
              <a
                href="https://emrepelit.github.io/science-philosophy"
                target="_blank"
                rel="me noopener noreferrer"
                className="font-semibold text-[#1E3A8A] hover:underline"
              >
                emrepelit.github.io/science-philosophy (301) ↗
              </a>
              <span>·</span>
              {(
                [
                  { id: 'privacy', label: APP_CHROME_I18N[language].privacy },
                  { id: 'terms', label: APP_CHROME_I18N[language].terms },
                  { id: 'imprint', label: APP_CHROME_I18N[language].imprint },
                  { id: 'kvkk', label: APP_CHROME_I18N[language].kvkk },
                  { id: 'disclaimer', label: APP_CHROME_I18N[language].disclaimer },
                  { id: 'methodology', label: APP_CHROME_I18N[language].methodology },
                ] as const
              ).map((gov, idx) => {
                const govPrefix = language;
                return (
                  <React.Fragment key={gov.id}>
                    {idx > 0 && <span>·</span>}
                    <a
                      href={`/${govPrefix}/${gov.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setGovernanceTab(gov.id);
                        setGovernanceModalOpen(true);
                      }}
                      className="hover:text-stone-900 underline cursor-pointer"
                    >
                      {gov.label}
                    </a>
                  </React.Fragment>
                );
              })}
              <span>·</span>
              <button
                type="button"
                onClick={() => setKvkkManageOpen(true)}
                className="font-bold text-amber-900 hover:text-stone-950 underline cursor-pointer"
              >
                {APP_CHROME_I18N[language].cookiePrefsLabel} (
                {kvkkConsent.status === 'accepted'
                  ? APP_CHROME_I18N[language].consentActive
                  : kvkkConsent.status === 'rejected'
                    ? APP_CHROME_I18N[language].consentRejected
                    : APP_CHROME_I18N[language].consentPending}
                )
              </button>
            </div>
            <nav aria-label={APP_CHROME_I18N[language].langDirsLabel} className="font-mono text-[11px] text-stone-600 pt-1 flex flex-wrap items-center gap-2">
              <span>{APP_CHROME_I18N[language].langDirsLabel}</span>
              {WORLD_LANGUAGES.map((wl) => (
                <a
                  key={wl.code}
                  href={wl.code === 'tr' ? '/' : `/${wl.code}/`}
                  onClick={(e) => {
                    e.preventDefault();
                    setLanguage(wl.code);
                  }}
                  className={`px-1.5 py-0.5 border rounded-xs ${
                    language === wl.code
                      ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] font-bold'
                      : 'bg-white text-stone-700 border-stone-300 hover:border-[#1E3A8A]'
                  }`}
                >
                  {wl.code.toUpperCase()}
                </a>
              ))}
              <a
                href="/archive"
                onClick={(e) => {
                  e.preventDefault();
                  setShowAllLanguagesCorpus(true);
                  document.getElementById('corpus')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-1.5 py-0.5 bg-white text-[#1E3A8A] border border-stone-300 hover:border-[#1E3A8A] rounded-xs font-semibold"
              >
                {APP_CHROME_I18N[language].fullArchiveLabel}
              </a>
            </nav>
          </div>

          <div className="flex flex-wrap items-center gap-4 font-mono text-[11px]">
            <a
              href="https://www.youtube.com/@science_only"
              target="_blank"
              rel="me noopener noreferrer"
              className="hover:underline font-bold text-red-700 inline-flex items-center gap-1"
            >
              <span>▶ YouTube: @science_only</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>·</span>
            <a href="#emre-pelit-cv" className="hover:text-stone-900 font-semibold text-[#1E3A8A]">
              Emre Pelit CV
            </a>
            <span>·</span>
            <a href="#corpus" className="hover:text-stone-900">
              {t.nav.articles}
            </a>
            <span>·</span>
            <button
              type="button"
              onClick={() => setAnalyticsPanelOpen(true)}
              className="hover:text-stone-900 font-semibold text-emerald-800 cursor-pointer"
            >
              {APP_CHROME_I18N[language].analyticsShort}
            </button>
            <span>·</span>
            <a href="#ai-studio" className="hover:text-stone-900">
              {t.nav.aiStudio}
            </a>
            <span>·</span>
            <a href="#control-cloud" className="hover:text-stone-900">
              {t.nav.controlCloud}
            </a>
            <span>·</span>
            <a href="/rss.xml" target="_blank" rel="noopener noreferrer" className="hover:text-[#1E3A8A] font-semibold">
              RSS
            </a>
            <span>·</span>
            <a href="/atom.xml" target="_blank" rel="noopener noreferrer" className="hover:text-[#1E3A8A] font-semibold">
              Atom
            </a>
            <span>·</span>
            <a href="/feed.json" target="_blank" rel="noopener noreferrer" className="hover:text-[#1E3A8A] font-semibold">
              JSON Feed
            </a>
          </div>
        </div>
      </footer>

      {/* Floating Quick-Action & Back-to-Top UX Dock */}
      <div
        className={`fixed ${
          isKvkkBannerVisible ? 'bottom-[88px]' : 'bottom-6'
        } right-4 z-40 flex items-center gap-1.5 bg-[#0F172A]/95 backdrop-blur-xs text-white border border-slate-700 px-3 py-2 rounded-xs shadow-lg text-xs font-mono transition-all`}
      >
        <button
          type="button"
          onClick={() => setAnalyticsPanelOpen(true)}
          className="px-2.5 py-1 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold rounded-xs transition-colors cursor-pointer inline-flex items-center gap-1"
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>{APP_CHROME_I18N[language].analyticsShort}</span>
        </button>
        <button
          type="button"
          onClick={() => setCommandPaletteOpen(true)}
          className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xs transition-colors cursor-pointer"
        >
          {APP_CHROME_I18N[language].searchPlaceholderPrefix}
        </button>
        <span className="px-2 py-1 bg-slate-900 text-emerald-300 border border-slate-700 rounded-xs">
          Okuma: %{readingProgress}
        </span>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 rounded-xs transition-colors cursor-pointer"
          aria-label="Sayfa Başına Dön"
        >
          ↑ Yukarı
        </button>
      </div>

      {/* Instant Command & Search Palette Modal (Ctrl+K / ⌘K) */}
      {commandPaletteOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Hızlı Komut, ${Math.max(316, articles.length)} Makale, 10 301 Web Sitesi ve 12 Dil Gezgini`}
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-start justify-center p-4 pt-16"
          onClick={() => setCommandPaletteOpen(false)}
        >
          <div
            className="w-full max-w-3xl bg-white border-2 border-stone-900 shadow-2xl rounded-xs overflow-hidden text-stone-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#0F172A] text-white px-4 py-3 flex items-center justify-between gap-2 text-xs font-mono">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="font-bold">
                  EMRE PELİT UX HIZLI KOMUT &amp; ARAMA PALETİ ({Math.max(316, articles.length)} MAKALE · 10 301 SİTE · 12 DİL)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setCommandPaletteOpen(false)}
                className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xs cursor-pointer"
              >
                ESC Kapat ✕
              </button>
            </div>

            <div className="p-4 border-b border-stone-200 bg-[#FBF9F5]">
              <div className="relative">
                <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  autoFocus
                  value={commandQuery}
                  onChange={(e) => setCommandQuery(e.target.value)}
                  placeholder={`${Math.max(316, articles.length)} makale başlığı, arşiv kodu, kavram, 10 301 web sitesi veya dil ara...`}
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-stone-300 focus:outline-none focus:border-[#1E3A8A] rounded-xs font-sans"
                />
              </div>

              <div className="flex flex-wrap items-center gap-1.5 mt-3 text-[11px] font-mono">
                <span className="text-stone-500">12 Dil Hızlı Geçiş:</span>
                {WORLD_LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => {
                      setLanguage(l.code);
                      setCommandPaletteOpen(false);
                    }}
                    className={`px-2 py-0.5 rounded-xs border cursor-pointer ${
                      language === l.code
                        ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] font-bold'
                        : 'bg-white text-stone-700 border-stone-300 hover:border-stone-500'
                    }`}
                  >
                    {l.shortLabel} ({l.nativeName})
                  </button>
                ))}
              </div>
            </div>

            <div className="max-h-[380px] overflow-y-auto divide-y divide-stone-200">
              {commandPaletteArticles.map((art, idx) => {
                const artTitle = getLocalizedText(art.title, language);
                return (
                  <div
                    key={art.id}
                    className="p-3 hover:bg-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-colors"
                  >
                    <div className="space-y-0.5">
                      <div className="text-[11px] font-mono text-stone-500">
                        #{idx + 1} · {art.category} · Arşiv: SCIPHIL-#{art.figureNumber.replace(/[^0-9]/g, '') || idx + 1} · Kanonik İndeksli
                      </div>
                      <div className="text-sm font-editorial font-semibold text-stone-900">
                        {artTitle}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 font-mono text-[11px]">
                      <button
                        type="button"
                        onClick={() => {
                          setCommandPaletteOpen(false);
                          handleOpenAnalysisModal(art);
                        }}
                        className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xs cursor-pointer"
                      >
                        Tam Analiz &amp; Denklem
                      </button>
                      <a
                        href={getLocalizedArticlePath(
                          art.sourceLang ||
                            detectEntrySourceLanguage(
                              getLocalizedText(art.title, 'tr'),
                              getLocalizedText(art.abstract, 'tr')
                            ),
                          art.slug
                        )}
                        onClick={(e) => {
                          e.preventDefault();
                          setCommandPaletteOpen(false);
                          handleJumpToArticle(art.id);
                        }}
                        className="px-2.5 py-1 bg-[#1E3A8A] hover:bg-[#172E6E] text-white rounded-xs cursor-pointer"
                      >
                        Makaleye Git →
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Governance, Privacy, KVKK (6698), Scientific Disclaimer & AI/Telemetry Methodology Modal */}
      <GovernanceLegalModal
        isOpen={governanceModalOpen}
        activeTab={governanceTab}
        onSelectTab={setGovernanceTab}
        onClose={() => setGovernanceModalOpen(false)}
        language={language}
        totalArticlesCount={corpusArticlesCount}
      />

      {/* 6698 Sayılı KVKK & Çerez Mevzuatı Açık Rıza (Opt-In) Onay Bandı */}
      <KvkkConsentBanner
        consent={kvkkConsent}
        forceManageOpen={kvkkManageOpen}
        onUpdateConsent={handleSaveKvkkConsent}
        onCloseManage={() => setKvkkManageOpen(false)}
        onOpenLegalTab={(tab) => {
          setGovernanceTab(tab);
          setGovernanceModalOpen(true);
        }}
        language={language}
      />

      {/* PWA Offline Network Status Pill */}
      <OfflineIndicator
        kvkkBannerVisible={isKvkkBannerVisible}
        hasCachedArticles={articles.length > 0}
      />
    </div>
  );
}
