import { LanguageCode, LocalizedStringArray, LocalizedText } from '../types';

export interface WorldLanguageMeta {
  code: LanguageCode;
  label: string;
  shortLabel: string;
  nativeName: string;
  bcp47: string;
  speechLang: string;
  dir: 'ltr' | 'rtl';
}

export const WORLD_LANGUAGES: WorldLanguageMeta[] = [
  { code: 'tr', label: 'TR - Türkçe', shortLabel: 'TR', nativeName: 'Türkçe', bcp47: 'tr-TR', speechLang: 'tr-TR', dir: 'ltr' },
  { code: 'en', label: 'EN - English', shortLabel: 'EN', nativeName: 'English', bcp47: 'en-US', speechLang: 'en-US', dir: 'ltr' },
  { code: 'es', label: 'ES - Español', shortLabel: 'ES', nativeName: 'Español', bcp47: 'es-ES', speechLang: 'es-ES', dir: 'ltr' },
  { code: 'de', label: 'DE - Deutsch', shortLabel: 'DE', nativeName: 'Deutsch', bcp47: 'de-DE', speechLang: 'de-DE', dir: 'ltr' },
  { code: 'fr', label: 'FR - Français', shortLabel: 'FR', nativeName: 'Français', bcp47: 'fr-FR', speechLang: 'fr-FR', dir: 'ltr' },
  { code: 'ru', label: 'RU - Русский', shortLabel: 'RU', nativeName: 'Русский', bcp47: 'ru-RU', speechLang: 'ru-RU', dir: 'ltr' },
  { code: 'ar', label: 'AR - العربية', shortLabel: 'AR', nativeName: 'العربية', bcp47: 'ar-SA', speechLang: 'ar-SA', dir: 'rtl' },
  { code: 'zh', label: 'ZH - 中文 (简体)', shortLabel: 'ZH', nativeName: '中文', bcp47: 'zh-CN', speechLang: 'zh-CN', dir: 'ltr' },
  { code: 'ja', label: 'JA - 日本語', shortLabel: 'JA', nativeName: '日本語', bcp47: 'ja-JP', speechLang: 'ja-JP', dir: 'ltr' },
  { code: 'pt', label: 'PT - Português', shortLabel: 'PT', nativeName: 'Português', bcp47: 'pt-BR', speechLang: 'pt-BR', dir: 'ltr' },
  { code: 'it', label: 'IT - Italiano', shortLabel: 'IT', nativeName: 'Italiano', bcp47: 'it-IT', speechLang: 'it-IT', dir: 'ltr' },
  { code: 'ko', label: 'KO - 한국어', shortLabel: 'KO', nativeName: '한국어', bcp47: 'ko-KR', speechLang: 'ko-KR', dir: 'ltr' },
];

export function getLanguageMeta(lang: LanguageCode): WorldLanguageMeta {
  return WORLD_LANGUAGES.find((w) => w.code === lang) || WORLD_LANGUAGES[0];
}

export function getLocalizedText(map: LocalizedText | undefined, lang: LanguageCode): string {
  if (!map) return '';
  return map[lang] || map.en || map.tr || Object.values(map)[0] || '';
}

export function getLocalizedArray(map: LocalizedStringArray | undefined, lang: LanguageCode): string[] {
  if (!map) return [];
  return map[lang] || map.en || map.tr || Object.values(map)[0] || [];
}

export interface UITranslations {
  nav: {
    articles: string;
    cvMenu: string;
    network301: string;
    aiStudio: string;
    controlCloud: string;
    primaryCta: string;
  };
  hero: {
    kicker: string;
    title: string;
    subtitle: string;
    exclusiveNoticeTitle: string;
    exclusiveNoticeBody: string;
    exploreBtn: string;
    cvBtn: string;
    networkBtn: string;
    inheritedBadge: string;
    bloggerBadge: string;
  };
  article: {
    abstractTitle: string;
    keyFindingsTitle: string;
    simulationTitle: string;
    listenArticleOnly: string;
    stopListening: string;
    pauseListening: string;
    resumeListening: string;
    generatingVoice: string;
    voiceOnlyNotice: string;
    selectAudioLang: string;
    liveTranscriptTitle: string;
    showTranscript: string;
    hideTranscript: string;
    fullScope: string;
    abstractScope: string;
    readFullPaper: string;
    collapsePaper: string;
    translateWithAi: string;
    translating: string;
    citations: string;
    canonicalHubLink: string;
    sha256Verified: string;
    downloadCitation: string;
    exclusiveAuthorLabel: string;
  };
  network: {
    sectionTitle: string;
    sectionSubtitle: string;
    bannerHeader: string;
    bannerFormula: string;
    colWebsite: string;
    colBaseRecent: string;
    colNetReads: string;
    colReadingTime: string;
    colAudioListen: string;
    colUniqueReaders: string;
    colSimulator: string;
    cumulativeRowLabel: string;
    publicationsBacklinkTitle: string;
    backlinkGuaranteedNote: string;
    exportCsv: string;
    exportJson: string;
    verifyRedirect: string;
    openHubArticle: string;
  };
  aiLab: {
    title: string;
    subtitle: string;
    generateTab: string;
    analyzeTab: string;
    topicPromptLabel: string;
    categoryLabel: string;
    simulationTypeLabel: string;
    generateButton: string;
    generatingStatus: string;
    analyzeButton: string;
    analyzingStatus: string;
    publishToHub: string;
  };
  control: {
    title: string;
    subtitle: string;
    gatewaySection: string;
    cloudSection: string;
    securitySection: string;
    saveConfig: string;
    createSnapshot: string;
    exportVault: string;
  };
}

const BASE_TR: UITranslations = {
  nav: {
    articles: 'Makaleler & Simülasyon',
    cvMenu: 'Emre Pelit CV & Telif',
    network301: 'Trafik & 301 Analitik',
    aiStudio: 'YZ Üretim & Analiz',
    controlCloud: 'Kontrol & Bulut',
    primaryCta: 'Canlı Senkronize Et',
  },
  hero: {
    kicker: 'EMRE PELİT • SCI-PHİL BİLİM & FELSEFE ARŞİVİ (ÖZGÜN ÇALIŞMALAR × ÇOK DİLLİ KÜLLİYAT • ÖNCEKİ ARAŞTIRMALAR & YERLEŞİK KABULLER ENTEGRE)',
    title: 'Bilim ve Felsefe Kavşağında Bağımsız Çok Dilli Araştırma & Simülasyon Arşivi',
    subtitle:
      'emrepelit-sciphi.ai.studio üzerinde bağımsız yazar Emre Pelit tarafından yayımlanan özgün bilim ve felsefe denemelerinin her biri kendi dil dizininde (/tr/makale/, /en/article/, /es/articulo/, /de/artikel/, /fr/article/) ve karşılıklı hreflang eşleşmesiyle sunulur. Her çalışmada önceki bilimsel araştırmalar (isimli bilim insanlarıyla), yerleşik kabuller, matematiksel simülasyonlar ve sesli anlatım yer alır.',
    exclusiveNoticeTitle: 'MÜNHASIR FİKRİ MÜLKİYET VE BAĞIMSIZ YAYIN BEYANI (%100 EMRE PELİT)',
    exclusiveNoticeBody:
      'Bu arşivdeki tüm özgün bilim ve felsefe makaleleri, çok dilli sürümler, önceki literatür derlemeleri ve interaktif simülasyon modelleri bağımsız yazar Emre Pelit’e aittir (hakemli dergi değildir).',
    exploreBtn: 'Akademik Külliyatı İncele',
    cvBtn: 'Emre Pelit Özgeçmiş (CV) Açılır Menüsü',
    networkBtn: 'Analitik & Ağa Bakış',
    inheritedBadge: 'Kanonik Ana Arşiv (HTTP 200 OK) • Dil Bazlı Ayrılmış URL & Hreflang',
    bloggerBadge: 'Kaynak Senkronizasyonu: emrepelit7337.blogspot.com (Çok Dilli Külliyat)',
  },
  article: {
    abstractTitle: 'Makaleye Özel Yönetici Özeti (Abstract)',
    keyFindingsTitle: 'Temel Epistemolojik ve Fiziksel Bulgular',
    simulationTitle: 'Makaleye Özel İnteraktif Matematiksel Simülasyon Laboratuvarı',
    listenArticleOnly: 'Sadece Bu Makaleyi Sesli Dinle',
    stopListening: 'Durdur',
    pauseListening: 'Duraklat',
    resumeListening: 'Devam Et',
    generatingVoice: 'Seslendiriliyor...',
    voiceOnlyNotice: 'Yalnızca seçili makale seçilen doğal dilde seslendirilir ve canlı transkripti gösterilir.',
    selectAudioLang: 'Dinleme Dili:',
    liveTranscriptTitle: 'Canlı Senkronize Sesli Makale Transkripti',
    showTranscript: 'Transkripti Göster',
    hideTranscript: 'Gizle',
    fullScope: 'Özet + Tam Makale',
    abstractScope: 'Sadece Özet',
    readFullPaper: 'Tam Metin, Simülasyon & Referansları Aç',
    collapsePaper: 'Makale Görünümünü Daralt',
    translateWithAi: 'YZ ile Anında Çevir',
    translating: 'Çevriliyor...',
    citations: 'Akademik Kaynakça & Atıf Dizinleri',
    canonicalHubLink: '301 Ana Hub Kanonik Bağlantısı',
    sha256Verified: 'SHA-256 Veri Bütünlüğü Doğrulandı',
    downloadCitation: 'BibTeX İndir',
    exclusiveAuthorLabel: 'Münhasır Eser Sahibi ve Tek Yazar: EMRE PELİT (%100 Özgün Telif)',
  },
  network: {
    sectionTitle: 'Bu Web Sitesi ve 301/Kanonik İle Bağlı 9 Resmi Web Sitesinin (Toplam 10 Düğüm) Açılış Tarihlerinden Beri Tüm Nihai İstatistikleri',
    sectionSubtitle:
      '10 resmi web sitesinin açılış tarihlerinden beri olan tüm nihai istatistikleri, Analitik Paneli üzerinden bu nihai istatistiklerin birebir dinamik toplamı olarak hesaplanan Kümülatif İstatistikler ve Türkiye, Avrupa, Asya, Amerika ve Global sıralamalar.',
    bannerHeader: '10 RESMİ WEB SİTESİNİN AÇILIŞ TARİHLERİNDEN BERİ TÜM NİHAİ İSTATİSTİKLERİ VE KÜMÜLATİF TOPLAMI',
    bannerFormula: 'Σ (10 DÜĞÜMÜN AÇILIŞTAN BERİ TÜM NİHAİ İSTATİSTİKLERİ) = KÜMÜLATİF GENEL TOPLAM',
    colWebsite: 'WEB SİTESİ & AÇILIŞ TARİHİ',
    colBaseRecent: 'AÇILIŞTAN BERİ TOPLAM GİRİŞ',
    colNetReads: 'NET OKUNMA (AÇILIŞTAN BERİ)',
    colReadingTime: 'OKUMA SÜRESİ (AÇILIŞTAN BERİ)',
    colAudioListen: 'SESLİ DİNLEME (AÇILIŞTAN BERİ)',
    colUniqueReaders: 'TEKİL OKUR (AÇILIŞTAN BERİ)',
    colSimulator: 'SİMÜLATÖR (AÇILIŞTAN BERİ)',
    cumulativeRowLabel: 'KÜMÜLATİF GENEL TOPLAM (10 DÜĞÜMÜN AÇILIŞTAN BERİ NİHAİ İSTATİSTİKLERİNİN DİNAMİK TOPLAMI)',
    publicationsBacklinkTitle: 'Kalıcı 301 ve Kanonik Ağı Web Sitelerinin Yayınlarındaki Ana Hub Bağlantı Linkleri',
    backlinkGuaranteedNote:
      'Üstteki tabloda yer alan 10 resmi web sitesinin tüm yayınlarında bu Ana Hub web sitesine (emrepelit-sciphi.ai.studio) kalıcı 1:1 301 ve rel="canonical" bağlantı linki bulunmaktadır.',
    exportCsv: 'Kümülatif CSV İndir',
    exportJson: '301 Topolojisi (JSON)',
    verifyRedirect: '301 Bağlantısını Test Et',
    openHubArticle: 'Ana Hub Makalesine Git',
  },
  aiLab: {
    title: 'Yapay Zeka Tabanlı Akademik İçerik Üretimi ve Epistemolojik Analiz Aracı',
    subtitle:
      'Emre Pelit külliyatı için yeni bir Bilim-Felsefe makalesi (özeti, matematiksel denklemi ve özel simülasyonuyla birlikte) üretin veya mevcut bir metni metodolojik açıdan analiz edin.',
    generateTab: 'Yeni Akademik Makale & Simülasyon Üret',
    analyzeTab: 'Metodolojik & Felsefi Metin Analizi',
    topicPromptLabel: 'Araştırma Hipotezi veya Makale Konusu',
    categoryLabel: 'Disiplin Kategorisi',
    simulationTypeLabel: 'Eşleştirilecek Özel Simülasyon Motoru',
    generateButton: 'YZ ile Makale, Özet ve Simülasyon Oluştur',
    generatingStatus: 'Akademik makale, özet ve simülasyon parametreleri sentezleniyor...',
    analyzeButton: 'Epistemolojik ve İstatistiksel Analizi Başlat',
    analyzingStatus: 'Metin argüman yapısı inceleniyor...',
    publishToHub: 'Ana Hub ve 301 Ağına Yayınla',
  },
  control: {
    title: 'Kişiselleştirilmiş Kontrol Paneli, Dinamik API Geçidi, Bulut Depolama ve Veri Güvenliği',
    subtitle:
      'Model yönlendirme parametrelerini, seslendirici personasını, Blogger canlı senkronizasyonunu, bulut yedekleme kümelerini ve SHA-256 güvenlik protokollerini dinamik olarak yönetin.',
    gatewaySection: 'Dinamik API & Model Yönlendirme Kontrolü',
    cloudSection: 'Bulut Tabanlı Depolama & Anlık Görüntü (Snapshot) Entegrasyonu',
    securitySection: 'Gelişmiş Veri Güvenliği & Kriptografik Doğrulama Protokolleri',
    saveConfig: 'Dinamik Değişiklikleri Uygula',
    createSnapshot: 'Bulut Yedeği Oluştur',
    exportVault: 'Şifreli Arşivi İndir',
  },
};

const BASE_EN: UITranslations = {
  nav: {
    articles: 'Articles & Simulations',
    cvMenu: 'Emre Pelit CV & Copyright',
    network301: 'Traffic & 301 Analytics',
    aiStudio: 'AI Generation & Analysis',
    controlCloud: 'Control & Cloud',
    primaryCta: 'Live Network Sync',
  },
  hero: {
    kicker: 'EMRE PELIT • SCI-PHIL SCIENCE & PHILOSOPHY ARCHIVE (ORIGINAL ESSAYS × MULTILINGUAL EDITIONS • PRIOR RESEARCH INTEGRATED)',
    title: 'Independent Multilingual Archive at the Intersection of Science & Philosophy',
    subtitle:
      'Hosted canonically at emrepelit-sciphi.ai.studio, this independent archive publishes Emre Pelit’s original essays separated cleanly by language path (/en/article/, /tr/makale/, /es/articulo/, /de/artikel/, /fr/article/) with reciprocal hreflang linking, prior scientific studies, interactive simulations, and multilingual audio.',
    exclusiveNoticeTitle: 'DECLARATION OF EXCLUSIVE AUTHORSHIP & INDEPENDENT ARCHIVE STATUS (EMRE PELIT)',
    exclusiveNoticeBody:
      'All original science and philosophy essays, multilingual editions, prior-research reviews, and interactive simulation models in this archive are written by independent author Emre Pelit.',
    exploreBtn: 'Explore Archive',
    cvBtn: 'Emre Pelit CV Dropdown Menu',
    networkBtn: 'Analytics & Architecture',
    inheritedBadge: 'Canonical Main Archive (HTTP 200 OK) • True Language Paths & Hreflang',
    bloggerBadge: 'Source Sync: emrepelit7337.blogspot.com (Multilingual Archive)',
  },
  article: {
    abstractTitle: 'Article-Specific Executive Abstract',
    keyFindingsTitle: 'Core Epistemological & Physical Findings',
    simulationTitle: 'Bespoke Interactive Mathematical Simulation Lab',
    listenArticleOnly: 'Listen to This Article Only',
    stopListening: 'Stop',
    pauseListening: 'Pause',
    resumeListening: 'Resume',
    generatingVoice: 'Synthesizing Audio...',
    voiceOnlyNotice: 'Narrates strictly this selected article in the chosen natural language with live synchronized transcript.',
    selectAudioLang: 'Audio Language:',
    liveTranscriptTitle: 'Live Synchronized Audio Transcript',
    showTranscript: 'Show Transcript',
    hideTranscript: 'Hide Transcript',
    fullScope: 'Abstract + Full Paper',
    abstractScope: 'Abstract Only',
    readFullPaper: 'Open Full Paper, Simulation & Citations',
    collapsePaper: 'Collapse Paper View',
    translateWithAi: 'Instant AI Translation',
    translating: 'Translating...',
    citations: 'Academic References & Citation Indices',
    canonicalHubLink: '301 Main Hub Canonical Link',
    sha256Verified: 'SHA-256 Data Integrity Verified',
    downloadCitation: 'Download BibTeX',
    exclusiveAuthorLabel: 'Exclusive Author & Sole Copyright Holder: EMRE PELIT (100% Original Work)',
  },
  network: {
    sectionTitle: 'All Final Statistics Since Launch Date of This Canonical Hub & the 9 Official 301/Canonical Nodes (10 Total) and Their Cumulative Sum',
    sectionSubtitle:
      'All final statistics since launch date for each of the 10 official 301/canonical network nodes, Cumulative Statistics computed as the exact dynamic sum of these final statistics, and comparative benchmarks across Turkey, Europe, Asia, America, and Global.',
    bannerHeader: 'ALL FINAL STATISTICS OF THE 10 OFFICIAL NETWORK NODES SINCE LAUNCH DATE & CUMULATIVE TOTAL',
    bannerFormula: 'Σ (ALL FINAL STATISTICS OF 10 NODES SINCE LAUNCH) = CUMULATIVE GRAND TOTAL',
    colWebsite: 'WEBSITE & LAUNCH DATE',
    colBaseRecent: 'TOTAL VISITS SINCE LAUNCH',
    colNetReads: 'NET READS (SINCE LAUNCH)',
    colReadingTime: 'READING TIME (SINCE LAUNCH)',
    colAudioListen: 'AUDIO LISTENING (SINCE LAUNCH)',
    colUniqueReaders: 'UNIQUE READERS (SINCE LAUNCH)',
    colSimulator: 'SIMULATOR (SINCE LAUNCH)',
    cumulativeRowLabel: 'CUMULATIVE GRAND TOTAL (EXACT SUM OF ALL 10 NODES SINCE LAUNCH)',
    publicationsBacklinkTitle: 'Main Hub Backlinks Across All Publications of the 10 Official Network Websites',
    backlinkGuaranteedNote:
      'Every publication across all 10 official nodes in the network embeds a permanent canonical / 301 connection link back to this Main Hub.',
    exportCsv: 'Export Cumulative CSV',
    exportJson: '301 Topology (JSON)',
    verifyRedirect: 'Test 301 Link',
    openHubArticle: 'Open Main Hub Paper',
  },
  aiLab: {
    title: 'AI-Powered Academic Content Generation & Epistemological Analysis Studio',
    subtitle:
      'Synthesize new Science & Philosophy papers complete with custom abstracts, equations, and simulations, or perform rigorous methodological analysis on existing manuscripts.',
    generateTab: 'Generate Academic Paper & Simulation',
    analyzeTab: 'Methodological & Philosophical Analysis',
    topicPromptLabel: 'Research Hypothesis or Paper Topic',
    categoryLabel: 'Disciplinary Category',
    simulationTypeLabel: 'Paired Interactive Simulation Engine',
    generateButton: 'Synthesize Paper, Abstract & Simulation',
    generatingStatus: 'Synthesizing manuscript, abstract, and simulation parameters...',
    analyzeButton: 'Run Epistemological & Statistical Analysis',
    analyzingStatus: 'Auditing argument coherence...',
    publishToHub: 'Publish to Main Hub & 301 Network',
  },
  control: {
    title: 'Personalized Control Panel, Dynamic API Gateway, Cloud Storage & Data Security',
    subtitle:
      'Dynamically control model routing parameters, narrator voice persona, live Blogger sync cadence, cloud storage snapshots, and SHA-256 security protocols.',
    gatewaySection: 'Dynamic API & Model Routing Controller',
    cloudSection: 'Cloud Storage & Archival Snapshot Integration',
    securitySection: 'Advanced Data Security & Cryptographic Verification Protocols',
    saveConfig: 'Apply Dynamic Configuration',
    createSnapshot: 'Create Cloud Snapshot',
    exportVault: 'Download Encrypted Vault',
  },
};

export const UI_TEXT: Record<LanguageCode, UITranslations> = {
  tr: BASE_TR,
  en: BASE_EN,
  es: {
    ...BASE_EN,
    nav: {
      articles: 'Artículos y Simulación',
      cvMenu: 'CV y Autoría de Emre Pelit',
      network301: 'Tráfico y Analítica 301',
      aiStudio: 'Generación y Análisis IA',
      controlCloud: 'Control y Nube',
      primaryCta: 'Sincronizar en Vivo',
    },
    hero: {
      ...BASE_EN.hero,
      kicker: 'EMRE PELİT • ARCHIVO DE CIENCIA Y FILOSOFÍA (ENSAYOS ORIGINALES × EDICIONES MULTILINGÜES)',
      title: 'Archivo Independiente Multilingüe en la Intersección de Ciencia y Filosofía',
      subtitle:
        'Archivo canónico en emrepelit-sciphi.ai.studio sincronizado con emrepelit7337.blogspot.com, con rutas reales por idioma (/es/articulo/, /en/article/, /tr/makale/), estudios científicos previos, simulaciones matemáticas y narración multilingüe.',
      exclusiveNoticeTitle: 'DECLARACIÓN DE AUTORÍA EXCLUSIVA Y ARCHIVO INDEPENDIENTE (EMRE PELİT)',
      exclusiveNoticeBody:
        'Todos los ensayos originales de Ciencia y Filosofía, ediciones multilingües, resúmenes y simulaciones pertenecen exclusivamente al autor independiente Emre Pelit.',
      exploreBtn: 'Explorar Archivo',
      cvBtn: 'Menú Desplegable de CV de Emre Pelit',
      networkBtn: 'Tráfico y Analítica',
    },
    article: {
      ...BASE_EN.article,
      abstractTitle: 'Resumen Ejecutivo Específico del Artículo (Abstract)',
      keyFindingsTitle: 'Hallazgos Epistemológicos y Físicos Clave',
      simulationTitle: 'Laboratorio de Simulación Matemática Interactiva',
      listenArticleOnly: 'Escuchar Solo Este Artículo',
      stopListening: 'Detener',
      pauseListening: 'Pausar',
      resumeListening: 'Reanudar',
      generatingVoice: 'Generando Audio...',
      selectAudioLang: 'Idioma de Audio:',
      liveTranscriptTitle: 'Transcripción de Audio Sincronizada en Vivo',
      showTranscript: 'Mostrar Transcripción',
      hideTranscript: 'Ocultar Transcripción',
      fullScope: 'Resumen + Artículo Completo',
      abstractScope: 'Solo Resumen',
      readFullPaper: 'Abrir Artículo Completo, Simulación y Referencias',
      collapsePaper: 'Contraer Vista del Artículo',
      exclusiveAuthorLabel: 'Autor Exclusivo y Titular de Derechos: EMRE PELİT (100% Obra Original)',
    },
    network: {
      ...BASE_EN.network,
      sectionTitle: 'Todas las Estadísticas Finales de los 10 Sitios Web Oficiales 301 desde sus Fechas de Apertura y Total Acumulado',
      bannerHeader: 'ESTADÍSTICAS FINALES DE LOS 10 SITIOS WEB 301 DESDE SU APERTURA Y TOTAL ACUMULADO',
      bannerFormula: 'Σ (ESTADÍSTICAS FINALES DESDE LA APERTURA DE LOS 10 SITIOS) = TOTAL ACUMULADO',
      colWebsite: 'SITIO WEB Y FECHA DE APERTURA',
      colBaseRecent: 'ENTRADAS DESDE LA APERTURA',
      colNetReads: 'LECTURAS NETAS (DESDE APERTURA)',
      colReadingTime: 'TIEMPO DE LECTURA',
      colAudioListen: 'ESCUCHA DE AUDIO',
      colUniqueReaders: 'LECTORES ÚNICOS',
      colSimulator: 'SIMULADOR',
      cumulativeRowLabel: 'TOTAL GENERAL ACUMULADO (SUMA DE ESTADÍSTICAS FINALES DE LOS 10 SITIOS)',
    },
  },
  de: {
    ...BASE_EN,
    nav: {
      articles: 'Artikel & Simulation',
      cvMenu: 'Emre Pelit CV & Urheberrecht',
      network301: 'Traffic & 301-Analytik',
      aiStudio: 'KI-Labor & Analyse',
      controlCloud: 'Kontrolle & Cloud',
      primaryCta: 'Live-Synchronisation',
    },
    hero: {
      ...BASE_EN.hero,
      kicker: 'EMRE PELİT • SCI-PHIL WISSENSCHAFTS- & PHILOSOPHIEARCHIV (ORIGINALESSAYS × MEHRSPRACHIGE AUSGABEN)',
      title: 'Unabhängiges Mehrsprachiges Archiv für Wissenschaft & Philosophie',
      subtitle:
        'Kanonisches Autorenarchiv auf emrepelit-sciphi.ai.studio, synchronisiert mit emrepelit7337.blogspot.com – mit sprachgetrennten URLs (/de/artikel/, /en/article/, /tr/makale/), früherer Forschung, mathematischen Simulationen und Sprachausgabe.',
      exclusiveNoticeTitle: 'ERKLÄRUNG DER EXKLUSIVEN URHEBERSCHAFT (EMRE PELİT)',
      exclusiveNoticeBody:
        'Sämtliche Originalessays, mehrsprachigen Ausgaben, Abstracts und mathematischen Simulationen dieses unabhängigen Archivs stammen von Emre Pelit.',
      exploreBtn: 'Archiv erkunden',
      cvBtn: 'Emre Pelit Lebenslauf (CV) Menü',
      networkBtn: 'Traffic & Analytik',
    },
    article: {
      ...BASE_EN.article,
      abstractTitle: 'Artikelspezifische Zusammenfassung (Abstract)',
      keyFindingsTitle: 'Zentrale Erkenntnistheoretische & Physikalische Befunde',
      simulationTitle: 'Artikelspezifisches Mathematisches Simulationslabor',
      listenArticleOnly: 'Nur diesen Artikel anhören',
      stopListening: 'Stopp',
      pauseListening: 'Pause',
      resumeListening: 'Fortsetzen',
      selectAudioLang: 'Audiosprache:',
      liveTranscriptTitle: 'Live-Synchronisiertes Audio-Transkript',
      showTranscript: 'Transkript anzeigen',
      hideTranscript: 'Transkript ausblenden',
      fullScope: 'Abstract + Volltext',
      abstractScope: 'Nur Abstract',
      readFullPaper: 'Volltext, Simulation & Quellen öffnen',
      collapsePaper: 'Ansicht einklappen',
      exclusiveAuthorLabel: 'Exklusiver Autor & Alleiniger Urheber: EMRE PELİT (100 % Originalwerk)',
    },
  },
  fr: {
    ...BASE_EN,
    nav: {
      articles: 'Articles & Simulations',
      cvMenu: 'CV & Droits d’Emre Pelit',
      network301: 'Trafic & Analytique 301',
      aiStudio: 'Génération & Analyse IA',
      controlCloud: 'Contrôle & Cloud',
      primaryCta: 'Synchronisation en Direct',
    },
    hero: {
      ...BASE_EN.hero,
      kicker: 'EMRE PELİT • ARCHIVE SCIENCE & PHILOSOPHIE SCI-PHIL (ESSAIS ORIGINAUX × ÉDITIONS MULTILINGUES)',
      title: 'Archive Indépendante Multilingue à la Croisée de la Science et de la Philosophie',
      subtitle:
        'Archive canonique sur emrepelit-sciphi.ai.studio synchronisée avec emrepelit7337.blogspot.com, dotée d’URL par langue (/fr/article/, /en/article/, /tr/makale/), d’études antérieures, de simulations mathématiques et de narration vocale.',
      exclusiveNoticeTitle: 'DÉCLARATION DE PATERNITÉ EXCLUSIVE (EMRE PELİT)',
      exclusiveNoticeBody:
        'Tous les essais originaux de science et de philosophie, éditions multilingues, résumés et modèles de simulation appartiennent exclusivement à Emre Pelit.',
      exploreBtn: 'Explorer le Corpus',
      cvBtn: 'Menu Déroulant du CV d’Emre Pelit',
      networkBtn: 'Trafic & Analytique',
    },
    article: {
      ...BASE_EN.article,
      abstractTitle: 'Résumé Exécutif Spécifique à l’Article (Abstract)',
      keyFindingsTitle: 'Résultats Épistémologiques et Physiques Clés',
      simulationTitle: 'Laboratoire de Simulation Mathématique Interactive',
      listenArticleOnly: 'Écouter Cet Article Uniquement',
      stopListening: 'Arrêter',
      pauseListening: 'Pause',
      resumeListening: 'Reprendre',
      selectAudioLang: 'Langue Audio :',
      liveTranscriptTitle: 'Transcription Audio Synchronisée en Direct',
      showTranscript: 'Afficher la Transcription',
      hideTranscript: 'Masquer la Transcription',
      fullScope: 'Résumé + Texte Intégral',
      abstractScope: 'Résumé Seul',
      readFullPaper: 'Ouvrir le Texte Intégral, la Simulation et les Références',
      collapsePaper: 'Réduire l’Article',
      exclusiveAuthorLabel: 'Auteur Exclusif et Titulaire des Droits : EMRE PELİT (100 % Original)',
    },
  },
  ru: {
    ...BASE_EN,
    nav: {
      articles: 'Статьи и Симуляции',
      cvMenu: 'Резюме (CV) Эмре Пелита',
      network301: 'Трафик и Аналитика 301',
      aiStudio: 'ИИ Генерация и Анализ',
      controlCloud: 'Управление и Облако',
      primaryCta: 'Живая Синхронизация',
    },
    hero: {
      ...BASE_EN.hero,
      kicker: 'ЭМРЕ ПЕЛИТ • АРХИВ НАУКИ И ФИЛОСОФИИ SCI-PHIL (ОРИГИНАЛЬНЫЕ ЭССЕ × МНОГОЯЗЫЧНЫЕ ИЗДАНИЯ)',
      title: 'Независимый многоязычный архив на пересечении науки и философии',
      subtitle:
        'Канонический архив Эмре Пелита на emrepelit-sciphi.ai.studio с языковой маршрутизацией (/ru/statya/, /en/article/, /tr/makale/), анализом предшествующих исследований, математическими симуляциями и озвучкой.',
      exclusiveNoticeTitle: 'ДЕКЛАРАЦИЯ АВТОРСТВА (ЭМРЕ ПЕЛИТ)',
      exclusiveNoticeBody:
        'Все оригинальные научные и философские статьи, переводы, аннотации и математические симуляции в этом архиве принадлежат исключительно Эмре Пелиту.',
      exploreBtn: 'Изучить Архив',
      cvBtn: 'Открыть Резюме (CV) Эмре Пелита',
      networkBtn: 'Трафик и Аналитика',
    },
    article: {
      ...BASE_EN.article,
      abstractTitle: 'Аннотация к Статье (Abstract)',
      keyFindingsTitle: 'Ключевые Эпистемологические и Физические Выводы',
      simulationTitle: 'Интерактивная Лаборатория Математического Моделирования',
      listenArticleOnly: 'Прослушать Только Эту Статью',
      stopListening: 'Стоп',
      pauseListening: 'Пауза',
      resumeListening: 'Продолжить',
      selectAudioLang: 'Язык озвучки:',
      liveTranscriptTitle: 'Живая Синхронизированная Транскрипция Аудио',
      showTranscript: 'Показать Транскрипт',
      hideTranscript: 'Скрыть Транскрипт',
      fullScope: 'Аннотация + Полный Текст',
      abstractScope: 'Только Аннотация',
      readFullPaper: 'Открыть Полный Текст, Симуляцию и Источники',
      collapsePaper: 'Свернуть Статью',
      exclusiveAuthorLabel: 'Единственный Автор и Правообладатель: ЭМРЕ ПЕЛИТ (100% Оригинал)',
    },
  },
  ar: {
    ...BASE_EN,
    nav: {
      articles: 'المقالات والمحاكاة',
      cvMenu: 'السيرة الذاتية (CV) لإمره بيليت',
      network301: 'حركة المرور وتحليلات 301',
      aiStudio: 'إنتاج وتحليل الذكاء الاصطناعي',
      controlCloud: 'التحكم والسحابة',
      primaryCta: 'مزامنة مباشرة',
    },
    hero: {
      ...BASE_EN.hero,
      kicker: 'إمره بيليت • أرشيف العلوم والفلسفة SCI-PHIL (مقالات أصلية × طبعات متعددة اللغات)',
      title: 'أرشيف مستقل متعدد اللغات عند تقاطع العلوم والفلسفة',
      subtitle:
        'أرشيف المؤلف المستقل إمره بيليت على emrepelit-sciphi.ai.studio مع مسارات لغوية منفصلة، والدراسات العلمية السابقة والمحاكاة الرياضية والقارئ الصوتي.',
      exclusiveNoticeTitle: 'إعلان التأليف والملكية الفكرية (إمره بيليت)',
      exclusiveNoticeBody:
        'جميع المقالات العلمية والفلسفية الأصلية والطبعات المترجمة ونماذج المحاكاة تعود ملكيتها حصرياً للمؤلف المستقل إمره بيليت.',
      exploreBtn: 'استكشاف الأرشيف',
      cvBtn: 'القائمة المنسدلة للسيرة الذاتية (CV)',
      networkBtn: 'التحليلات',
    },
    article: {
      ...BASE_EN.article,
      abstractTitle: 'الملخص التنفيذي الخاص بالمقالة (Abstract)',
      keyFindingsTitle: 'النتائج المعرفية والفيزيائية الأساسية',
      simulationTitle: 'مختبر المحاكاة الرياضية التفاعلي الخاص بالمقالة',
      listenArticleOnly: 'استمع إلى هذه المقالة فقط',
      stopListening: 'إيقاف',
      pauseListening: 'إيقاف مؤقت',
      resumeListening: 'استئناف',
      selectAudioLang: 'لغة الاستماع:',
      liveTranscriptTitle: 'النص الصوتي المتزامن المباشر (Transcript)',
      showTranscript: 'إظهار النص المتزامن',
      hideTranscript: 'إخفاء النص',
      fullScope: 'الملخص + النص الكامل',
      abstractScope: 'الملخص فقط',
      readFullPaper: 'فتح النص الكامل والمحاكاة والمراجع',
      collapsePaper: 'طي عرض المقالة',
      exclusiveAuthorLabel: 'المؤلف الحصري ومالك الحقوق: إمره بيليت (100% عمل أصلي)',
    },
  },
  zh: {
    ...BASE_EN,
    nav: {
      articles: '文章与数学模拟',
      cvMenu: 'Emre Pelit 简历 (CV) 与版权',
      network301: '流量与 301 分析',
      aiStudio: 'AI 生成与分析',
      controlCloud: '控制面板与云存储',
      primaryCta: '实时同步',
    },
    hero: {
      ...BASE_EN.hero,
      kicker: 'EMRE PELİT • SCI-PHIL 科学与哲学档案 (原创论文 × 多语言版本)',
      title: '科学与哲学交汇处的独立多语言研究与模拟档案',
      subtitle:
        '独立作者 Emre Pelit 的规范档案库 (emrepelit-sciphi.ai.studio)，按语言分路径发布原创论文，提供先行科学研究分析、交互式数学模拟与多语言语音朗读。',
      exclusiveNoticeTitle: '独立著作权声明（归属于 EMRE PELİT）',
      exclusiveNoticeBody:
        '本档案库中所有的科学与哲学原创论文、多语言版本、摘要及数学模拟模型均由独立作者 Emre Pelit 原创。',
      exploreBtn: '浏览档案文库',
      cvBtn: 'Emre Pelit 简历 (CV) 下拉菜单',
      networkBtn: '统计分析',
    },
    article: {
      ...BASE_EN.article,
      abstractTitle: '文章专属执行摘要 (Abstract)',
      keyFindingsTitle: '核心认识论与物理学发现',
      simulationTitle: '文章专属交互式数学模拟实验室',
      listenArticleOnly: '仅朗读本文',
      stopListening: '停止',
      pauseListening: '暂停',
      resumeListening: '继续',
      selectAudioLang: '朗读语言:',
      liveTranscriptTitle: '实时同步语音朗读字幕 (Transcript)',
      showTranscript: '显示实时字幕',
      hideTranscript: '隐藏字幕',
      fullScope: '摘要 + 全文',
      abstractScope: '仅摘要',
      readFullPaper: '展开全文、模拟与参考文献',
      collapsePaper: '收起文章视图',
      exclusiveAuthorLabel: '唯一作者及版权所有人：EMRE PELİT（100% 原创著作）',
    },
  },
  ja: {
    ...BASE_EN,
    nav: {
      articles: '論文＆シミュレーション',
      cvMenu: 'Emre Pelit 履歴書 (CV)',
      network301: 'トラフィック＆301分析',
      aiStudio: 'AI生成＆分析ラボ',
      controlCloud: '管理＆クラウド',
      primaryCta: 'ライブ同期',
    },
    hero: {
      ...BASE_EN.hero,
      kicker: 'EMRE PELİT • SCI-PHIL 科学＆哲学アーカイブ (独自論文 × 多言語版)',
      title: '科学と哲学が交差する独立多言語アーカイブプラットフォーム',
      subtitle:
        'emrepelit-sciphi.ai.studio にて言語別URLで公開されている Emre Pelit の科学・哲学エッセイ、先行研究レビュー、数理シミュレーションおよび多言語音声アーカイブ。',
      exclusiveNoticeTitle: '著作権および独立アーカイブ宣言（EMRE PELİT）',
      exclusiveNoticeBody:
        '本アーカイブに掲載されているすべての独自論文、多言語版、要約、シミュレーションモデルは独立著者 Emre Pelit の著作物です。',
      exploreBtn: 'アーカイブを見る',
      cvBtn: 'Emre Pelit 履歴書 (CV) メニュー',
      networkBtn: 'トラフィック分析',
    },
    article: {
      ...BASE_EN.article,
      abstractTitle: '論文専用エグゼクティブ・アブストラクト（要約）',
      keyFindingsTitle: '主要な認識論的・物理学的知見',
      simulationTitle: '論文専用インタラクティブ数理シミュレーションラボ',
      listenArticleOnly: 'この論文のみを音声で聴く',
      stopListening: '停止',
      pauseListening: '一時停止',
      resumeListening: '再開',
      selectAudioLang: '音声言語:',
      liveTranscriptTitle: 'リアルタイム同期オーディオ・トランスクリプト（字幕）',
      showTranscript: 'トランスクリプトを表示',
      hideTranscript: 'トランスクリプトを隠す',
      fullScope: '要約＋全文',
      abstractScope: '要約のみ',
      readFullPaper: '全文・シミュレーション・参考文献を開く',
      collapsePaper: '表示を折りたたむ',
      exclusiveAuthorLabel: '独占的著者・著作権者：EMRE PELİT（100% オリジナル著作）',
    },
  },
  pt: {
    ...BASE_EN,
    nav: {
      articles: 'Artigos e Simulação',
      cvMenu: 'CV e Autoria de Emre Pelit',
      network301: 'Tráfego e Analítica 301',
      aiStudio: 'Geração e Análise IA',
      controlCloud: 'Controle e Nuvem',
      primaryCta: 'Sincronizar ao Vivo',
    },
    hero: {
      ...BASE_EN.hero,
      kicker: 'EMRE PELİT • ARQUIVO DE CIÊNCIA E FILOSOFIA SCI-PHIL (ENSAIOS ORIGINAIS × EDIÇÕES MULTILÍNGUES)',
      title: 'Arquivo Independente Multilíngue na Interseção entre Ciência e Filosofia',
      subtitle:
        'Arquivo canônico em emrepelit-sciphi.ai.studio com rotas separadas por idioma, pesquisas científicas prévias, simulações matemáticas e narração multilíngue.',
      exclusiveNoticeTitle: 'DECLARAÇÃO DE AUTORIA EXCLUSIVA (EMRE PELİT)',
      exclusiveNoticeBody:
        'Todos os ensaios originais de Ciência e Filosofia, traduções e simulações deste arquivo independente pertencem exclusivamente a Emre Pelit.',
      exploreBtn: 'Explorar Arquivo',
      cvBtn: 'Menu Suspenso do CV de Emre Pelit',
      networkBtn: 'Tráfego e Analítica',
    },
    article: {
      ...BASE_EN.article,
      abstractTitle: 'Resumo Executivo Específico do Artigo (Abstract)',
      keyFindingsTitle: 'Principais Descobertas Epistemológicas e Físicas',
      simulationTitle: 'Laboratório de Simulação Matemática Interativa',
      listenArticleOnly: 'Ouvir Apenas Este Artigo',
      stopListening: 'Parar',
      pauseListening: 'Pausar',
      resumeListening: 'Retomar',
      selectAudioLang: 'Idioma do Áudio:',
      liveTranscriptTitle: 'Transcrição de Áudio Sincronizada ao Vivo',
      showTranscript: 'Mostrar Transcrição',
      hideTranscript: 'Ocultar Transcrição',
      fullScope: 'Resumo + Artigo Completo',
      abstractScope: 'Apenas Resumo',
      readFullPaper: 'Abrir Texto Completo, Simulação e Referências',
      collapsePaper: 'Recolher Visualização',
      exclusiveAuthorLabel: 'Autor Exclusivo e Detentor dos Direitos: EMRE PELİT (100% Original)',
    },
  },
  it: {
    ...BASE_EN,
    nav: {
      articles: 'Articoli e Simulazioni',
      cvMenu: 'CV e Diritto d’Autore',
      network301: 'Traffico e Analisi 301',
      aiStudio: 'Generazione e Analisi IA',
      controlCloud: 'Controllo e Cloud',
      primaryCta: 'Sincronizza dal Vivo',
    },
    hero: {
      ...BASE_EN.hero,
      kicker: 'EMRE PELİT • ARCHIVIO DI SCIENZA E FILOSOFIA SCI-PHIL (SAGGI ORIGINALI × EDIZIONI MULTILINGUE)',
      title: 'Archivio Indipendente Multilingue tra Scienza e Filosofia',
      subtitle:
        'Archivio canonico su emrepelit-sciphi.ai.studio con percorsi separati per lingua, ricerche scientifiche precedenti, simulazioni matematiche e narrazione vocale.',
      exclusiveNoticeTitle: 'DICHIARAZIONE DI PATERNITÀ ESCLUSIVA (EMRE PELİT)',
      exclusiveNoticeBody:
        'Tutti i saggi originali di Scienza e Filosofia, le edizioni multilingue e i modelli di simulazione appartengono esclusivamente a Emre Pelit.',
      exploreBtn: 'Esplora l’Archivio',
      cvBtn: 'Menu a Tendina CV di Emre Pelit',
      networkBtn: 'Traffico e Analisi',
    },
    article: {
      ...BASE_EN.article,
      abstractTitle: 'Abstract Esecutivo Specifico dell’Articolo',
      keyFindingsTitle: 'Principali Risultati Epistemologici e Fisici',
      simulationTitle: 'Laboratorio di Simulazione Matematica Interattiva',
      listenArticleOnly: 'Ascolta Solo Questo Articolo',
      stopListening: 'Ferma',
      pauseListening: 'Pausa',
      resumeListening: 'Riprendi',
      selectAudioLang: 'Lingua Audio:',
      liveTranscriptTitle: 'Trascrizione Audio Sincronizzata in Tempo Reale',
      showTranscript: 'Mostra Trascrizione',
      hideTranscript: 'Nascondi Trascrizione',
      fullScope: 'Abstract + Articolo Completo',
      abstractScope: 'Solo Abstract',
      readFullPaper: 'Apri Testo Completo, Simulazione e Bibliografia',
      collapsePaper: 'Comprimi Vista Articolo',
      exclusiveAuthorLabel: 'Autore Esclusivo e Titolare dei Diritti: EMRE PELİT (100% Originale)',
    },
  },
  ko: {
    ...BASE_EN,
    nav: {
      articles: '논문 및 시뮬레이션',
      cvMenu: 'Emre Pelit 이력서 (CV)',
      network301: '트래픽 및 301 분석',
      aiStudio: 'AI 생성 및 분석',
      controlCloud: '제어판 및 클라우드',
      primaryCta: '실시간 동기화',
    },
    hero: {
      ...BASE_EN.hero,
      kicker: 'EMRE PELİT • SCI-PHIL 과학 및 철학 아카이브 (독창적 에세이 × 다국어 판본)',
      title: '과학과 철학의 교차점에 선 독립 다국어 아카이브',
      subtitle:
        'emrepelit-sciphi.ai.studio 에서 언어별 경로로 제공되는 Emre Pelit 의 과학·철학 에세이, 선행 연구 검토, 수학 시뮬레이션 및 다국어 음성 낭독 아카이브입니다.',
      exclusiveNoticeTitle: '독점 저작권 선언 (EMRE PELİT)',
      exclusiveNoticeBody:
        '본 독립 아카이브에 게시된 모든 과학·철학 에세이, 다국어 판본 및 시뮬레이션 모델은 전적으로 Emre Pelit 의 독점 저작물입니다.',
      exploreBtn: '아카이브 탐색',
      cvBtn: 'Emre Pelit 이력서 (CV) 메뉴',
      networkBtn: '트래픽 및 분석',
    },
    article: {
      ...BASE_EN.article,
      abstractTitle: '논문 전용 핵심 초록 (Abstract)',
      keyFindingsTitle: '주요 인식론적 및 물리학적 발견',
      simulationTitle: '논문 전용 대화형 수학 시뮬레이션 연구실',
      listenArticleOnly: '이 논문만 음성으로 듣기',
      stopListening: '정지',
      pauseListening: '일시정지',
      resumeListening: '계속 듣기',
      selectAudioLang: '낭독 언어:',
      liveTranscriptTitle: '실시간 동기화 음성 대본 (Transcript)',
      showTranscript: '실시간 대본 보기',
      hideTranscript: '대본 숨기기',
      fullScope: '초록 + 전체 논문',
      abstractScope: '초록만',
      readFullPaper: '전체 본문, 시뮬레이션 및 참고문헌 열기',
      collapsePaper: '논문 보기 접기',
      exclusiveAuthorLabel: '독점 저자 및 저작권자: EMRE PELİT (100% 독창적 저작물)',
    },
  },
};
