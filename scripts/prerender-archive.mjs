#!/usr/bin/env node
/**
 * Build-time SSG / Prerender Pipeline & Single-Point-of-Failure Static Cache Generator
 *
 * 1. Optionally fetches all paginated Blogger entries (--sync) into .blogger-all-304-cache.json,
 *    or reads the existing local corpus cache (316+ articles).
 * 2. Emits /public/data/corpus-snapshot.json (+ /dist/data/corpus-snapshot.json when dist exists)
 *    with full paragraphs & keyFindings so CSR/offline search & fallback never fail if API/Blogger is unreachable.
 * 3. Emits full-body semantic static HTML shells into:
 *    - /dist/<lang>/<segment>/<slug>/index.html (all 316+ articles with baked head + full <article> body + BlogPosting JSON-LD)
 *    - /dist/<en|es|de|fr>/index.html (native language hub pages)
 *    - /dist/archive/index.html & /dist/<lang>/archive/index.html
 *    - /dist/<lang>/<privacy|kvkk|disclaimer|methodology>/index.html
 * 4. Emits static /dist/sitemap_index.xml, /dist/sitemap-articles.xml, /dist/sitemap.xml & /dist/robots.txt.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const CACHE_PATH = path.join(ROOT, '.blogger-all-304-cache.json');
const DIST_DIR = path.join(ROOT, 'dist');
const PUBLIC_DATA_DIR = path.join(ROOT, 'public', 'data');
const DIST_DATA_DIR = path.join(DIST_DIR, 'data');
const CANONICAL_ORIGIN = 'https://emrepelit-sciphi.ai.studio';
const BLOGGER_ORIGIN = 'https://emrepelit7337.blogspot.com';

const SUPPORTED_12_LANGS = ['tr', 'en', 'es', 'de', 'fr', 'ru', 'ar', 'zh', 'ja', 'pt', 'it', 'ko'];

const LANG_ARTICLE_SEGMENT = {
  tr: 'makale',
  en: 'article',
  es: 'articulo',
  de: 'artikel',
  fr: 'article',
  ru: 'statya',
  ar: 'maqal',
  zh: 'wenzhang',
  ja: 'ronbun',
  pt: 'artigo',
  it: 'articolo',
  ko: 'nonmun',
};

const LANG_HUB_META = {
  tr: {
    path: '/',
    title: 'Emre Pelit Sci-Phil — Bilim, Felsefe, Video, Test ve Simülasyon Arşivi',
    desc: 'Emre Pelit tarafından kaleme alınan 316+ özgün bilim ve felsefe makalesi, her makaleye özel 60 sn HTML5 açıklayıcı videolar, çoktan seçmeli kavrama testleri ve interaktif fizik simülasyonları.',
    h1: 'Emre Pelit — Bilim, Felsefe ve Simülasyon Arşivi',
    archiveLabel: 'Tüm Makale Arşivi',
  },
  en: {
    path: '/en/',
    title: 'Emre Pelit Sci-Phil — Science, Philosophy, Videos, Quizzes & Simulation Archive',
    desc: 'Independent author archive by Emre Pelit with 316+ essays, per-article 60s HTML5 explainer videos, multiple-choice quizzes, and interactive scientific models.',
    h1: 'Emre Pelit — Science, Philosophy & Simulation Archive',
    archiveLabel: 'Complete Article Archive',
  },
  es: {
    path: '/es/',
    title: 'Emre Pelit Sci-Phil — Archivo de Ciencia, Filosofía, Videos y Cuestionarios',
    desc: 'Archivo independiente de Emre Pelit con videos explicativos HTML5 de 60s por artículo, cuestionarios de opción múltiple, física cuántica, cosmología y simulaciones.',
    h1: 'Emre Pelit — Archivo de Ciencia, Filosofía y Simulación',
    archiveLabel: 'Archivo Completo de Artículos',
  },
  de: {
    path: '/de/',
    title: 'Emre Pelit Sci-Phil — Archiv für Wissenschaft, Videos, Tests & Simulation',
    desc: 'Unabhängiges Autorenarchiv von Emre Pelit mit 60s-HTML5-Erklärvideos und Multiple-Choice-Tests zu jedem Artikel, Quantenphysik, Kosmologie und Simulationen.',
    h1: 'Emre Pelit — Archiv für Wissenschaft, Philosophie & Simulation',
    archiveLabel: 'Vollständiges Artikelarchiv',
  },
  fr: {
    path: '/fr/',
    title: 'Emre Pelit Sci-Phil — Archives de Science, Vidéos, Quiz et Simulation',
    desc: 'Archives indépendantes d’Emre Pelit avec vidéos explicatives HTML5 de 60s par article, quiz à choix multiples, physique quantique, cosmologie et simulation.',
    h1: 'Emre Pelit — Archives de Science, Philosophie et Simulation',
    archiveLabel: 'Archives Complètes des Articles',
  },
  ru: {
    path: '/ru/',
    title: 'Emre Pelit Sci-Phil — Архив Науки, Философии, Видео и Тестов',
    desc: 'Независимый архив Эмре Пелита: квантовая физика, космология, 60-секундные HTML5-видеопояснения и интерактивные тесты с выбором ответа для каждой статьи.',
    h1: 'Emre Pelit — Архив Науки, Философии и Симуляции',
    archiveLabel: 'Полный Архив Статей',
  },
  ar: {
    path: '/ar/',
    title: 'Emre Pelit Sci-Phil — أرشيف العلوم والفلسفة والفيديو والاختبارات',
    desc: 'أرشيف إمره بيليت المستقل: مقالات فيزياء الكم وعلم الكونيات مع فيديو توضيحي HTML5 مدته 60 ثانية واختبارات اختيار من متعدد لكل مقال.',
    h1: 'Emre Pelit — أرشيف العلوم والفلسفة والمحاكاة',
    archiveLabel: 'الأرشيف الكامل للمقالات',
  },
  zh: {
    path: '/zh/',
    title: 'Emre Pelit Sci-Phil — 科学、哲学、视频、测验与模拟档案',
    desc: '独立作者 Emre Pelit 档案库：涵盖量子物理与宇宙学论文，每篇文章均配有 60 秒 HTML5 科普视频、专业多项选择测验与交互式科学模拟。',
    h1: 'Emre Pelit — 科学、哲学与数学模拟档案',
    archiveLabel: '完整文章档案库',
  },
  ja: {
    path: '/ja/',
    title: 'Emre Pelit Sci-Phil — 科学・哲学・解説動画・理解度テストアーカイブ',
    desc: '量子物理学・宇宙論・心の哲学を扱う Emre Pelit の独立アーカイブ。各記事に60秒HTML5解説動画、多肢選択クイズ、対話型シミュレーションを搭載。',
    h1: 'Emre Pelit — 科学・哲学・シミュレーションアーカイブ',
    archiveLabel: '全論文アーカイブ',
  },
  pt: {
    path: '/pt/',
    title: 'Emre Pelit Sci-Phil — Arquivo de Ciência, Vídeos, Quizzes e Simulação',
    desc: 'Arquivo independente de Emre Pelit com vídeos explicativos HTML5 de 60s e quizzes de múltipla escolha por artigo, física quântica, cosmologia e simulações.',
    h1: 'Emre Pelit — Arquivo de Ciência, Filosofia e Simulação',
    archiveLabel: 'Arquivo Completo de Artigos',
  },
  it: {
    path: '/it/',
    title: 'Emre Pelit Sci-Phil — Archivio di Scienza, Video, Quiz e Simulazione',
    desc: 'Archivio indipendente di Emre Pelit con video esplicativi HTML5 da 60s e quiz a scelta multipla per ogni articolo, fisica quantistica, cosmologia e simulazioni.',
    h1: 'Emre Pelit — Archivio di Scienza, Filosofia e Simulazione',
    archiveLabel: 'Archivio Completo degli Articoli',
  },
  ko: {
    path: '/ko/',
    title: 'Emre Pelit Sci-Phil — 과학·철학·해설 영상·퀴즈·시뮬레이션 아카이브',
    desc: '양자 물리학과 우주론을 다루는 Emre Pelit 독립 아카이브: 각 논문별 60초 HTML5 해설 영상, 객관식 이해도 퀴즈 및 대화형 시뮬레이션 제공.',
    h1: 'Emre Pelit — 과학·철학·시뮬레이션 아카이브',
    archiveLabel: '전체 논문 아카이브',
  },
};

const ACTIVE_LIVE_WEBSITES = [
  'emrepelit-sciphi.ai.studio',
  'emrepelit7337.blogspot.com',
];

const RETIRED_301_WEBSITES = [
  'science-philosophy.grok.me',
  'sci-phi.ai.studio',
  'sci-phil.ai.studio',
  'science-philosophy.ai.studio',
  'science-philosophy-emre-pelit.ai.studio',
  'emre-pelit-sci-phil.ai.studio',
  'emrepelit.github.io/science-philosophy',
  'emrepelit-sci-phi.ai.studio',
];

const GOVERNANCE_PAGES = {
  privacy: {
    tr: { title: 'Gizlilik Politikası — Emre Pelit Sci-Phil', desc: 'Veri işleme ilkeleri ve kullanıcı gizliliği politikası.', heading: 'Gizlilik Politikası' },
    en: { title: 'Privacy Policy — Emre Pelit Sci-Phil', desc: 'Data processing principles and user privacy policy.', heading: 'Privacy Policy' },
    es: { title: 'Política de Privacidad — Emre Pelit Sci-Phil', desc: 'Principios de tratamiento de datos y privacidad.', heading: 'Política de Privacidad' },
    de: { title: 'Datenschutzrichtlinie — Emre Pelit Sci-Phil', desc: 'Grundsätze der Datenverarbeitung und Privatsphäre.', heading: 'Datenschutzrichtlinie' },
    fr: { title: 'Politique de Confidentialité — Emre Pelit Sci-Phil', desc: 'Principes de traitement des données et confidentialité.', heading: 'Politique de Confidentialité' },
    ru: { title: 'Политика конфиденциальности — Emre Pelit Sci-Phil', desc: 'Принципы обработки данных и конфиденциальности.', heading: 'Политика конфиденциальности' },
    ar: { title: 'سياسة الخصوصية — Emre Pelit Sci-Phil', desc: 'مبادئ معالجة البيانات وخصوصية المستخدم.', heading: 'سياسة الخصوصية' },
    zh: { title: '隐私政策 — Emre Pelit Sci-Phil', desc: '数据处理原则与用户隐私保护政策。', heading: '隐私政策' },
    ja: { title: 'プライバシーポリシー — Emre Pelit Sci-Phil', desc: 'データ処理原則とプライバシー保護方針。', heading: 'プライバシーポリシー' },
    pt: { title: 'Política de Privacidade — Emre Pelit Sci-Phil', desc: 'Princípios de tratamento de dados e privacidade.', heading: 'Política de Privacidade' },
    it: { title: 'Informativa sulla Privacy — Emre Pelit Sci-Phil', desc: 'Principi sul trattamento dei dati e sulla privacy.', heading: 'Informativa sulla Privacy' },
    ko: { title: '개인정보 처리방침 — Emre Pelit Sci-Phil', desc: '데이터 처리 원칙 및 사용자 개인정보 보호 정책.', heading: '개인정보 처리방침' },
  },
  terms: {
    tr: { title: 'Kullanım Koşulları — Emre Pelit Sci-Phil', desc: 'Özgün telif hakları, akademik atıf ve kullanım koşulları.', heading: 'Kullanım Koşulları' },
    en: { title: 'Terms of Use — Emre Pelit Sci-Phil', desc: 'Exclusive authorship, citation permissions, and platform terms of use.', heading: 'Terms of Use' },
    es: { title: 'Términos de Uso — Emre Pelit Sci-Phil', desc: 'Derechos de autor exclusivos, citas y condiciones de uso.', heading: 'Términos de Uso' },
    de: { title: 'Nutzungsbedingungen — Emre Pelit Sci-Phil', desc: 'Urheberrechte, Zitationsrichtlinien und Nutzungsbedingungen.', heading: 'Nutzungsbedingungen' },
    fr: { title: 'Conditions d’Utilisation — Emre Pelit Sci-Phil', desc: 'Droits d’auteur exclusifs, citations et conditions d’utilisation.', heading: 'Conditions d’Utilisation' },
    ru: { title: 'Условия использования — Emre Pelit Sci-Phil', desc: 'Авторские права, правила цитирования и условия использования.', heading: 'Условия использования' },
    ar: { title: 'شروط الاستخدام — Emre Pelit Sci-Phil', desc: 'حقوق التأليف الحصرية وشروط الاقتباس والاستخدام.', heading: 'شروط الاستخدام' },
    zh: { title: '使用条款 — Emre Pelit Sci-Phil', desc: '独家版权、学术引用及平台使用条款。', heading: '使用条款' },
    ja: { title: '利用規約 — Emre Pelit Sci-Phil', desc: '独占著作権・学術引用規定およびプラットフォーム利用規約。', heading: '利用規約' },
    pt: { title: 'Termos de Uso — Emre Pelit Sci-Phil', desc: 'Direitos autorais exclusivos, citações e termos de uso.', heading: 'Termos de Uso' },
    it: { title: 'Termini d’Uso — Emre Pelit Sci-Phil', desc: 'Diritti d’autore esclusivi, citazioni e condizioni d’uso.', heading: 'Termini d’Uso' },
    ko: { title: '이용약관 — Emre Pelit Sci-Phil', desc: '독점 저작권, 학술 인용 및 플랫폼 이용 약관.', heading: '이용약관' },
  },
  imprint: {
    tr: { title: 'Künye & Yasal İletişim — Emre Pelit Sci-Phil', desc: 'Yayıncı Emre Pelit künyesi, Mersin yayın merkezi ve resmi kanonik hub.', heading: 'Künye (Imprint)' },
    en: { title: 'Imprint & Legal Notice — Emre Pelit Sci-Phil', desc: 'Publisher Emre Pelit imprint, location, contact details, and canonical hub registry.', heading: 'Imprint' },
    es: { title: 'Aviso Legal / Imprint — Emre Pelit Sci-Phil', desc: 'Información editorial del autor Emre Pelit y registro canónico.', heading: 'Aviso Legal (Imprint)' },
    de: { title: 'Impressum — Emre Pelit Sci-Phil', desc: 'Autorenangaben, Kontakt und kanonisches Hub-Register.', heading: 'Impressum' },
    fr: { title: 'Mentions Légales — Emre Pelit Sci-Phil', desc: 'Informations éditoriales sur l’auteur Emre Pelit et registre canonique.', heading: 'Mentions Légales' },
    ru: { title: 'Выходные данные (Imprint) — Emre Pelit Sci-Phil', desc: 'Сведения об авторе Эмре Пелите и каноническом хабе.', heading: 'Выходные данные' },
    ar: { title: 'بيانات النشر والإشعار القانوني — Emre Pelit Sci-Phil', desc: 'بيانات المؤلف إمره بيليت وسجل المركز الأساسي.', heading: 'بيانات النشر' },
    zh: { title: '出版说明与法律声明 — Emre Pelit Sci-Phil', desc: '作者 Emre Pelit 出版信息与唯一规范主枢纽档案。', heading: '出版说明 (Imprint)' },
    ja: { title: '奥付・法的表記 — Emre Pelit Sci-Phil', desc: '著者 Emre Pelit の出版情報および正規ハブ登録情報。', heading: '奥付 (Imprint)' },
    pt: { title: 'Expediente e Aviso Legal — Emre Pelit Sci-Phil', desc: 'Informações editoriais de Emre Pelit e registro do hub canônico.', heading: 'Expediente (Imprint)' },
    it: { title: 'Colophon e Note Legali — Emre Pelit Sci-Phil', desc: 'Informazioni editoriali su Emre Pelit e registro del hub canonico.', heading: 'Note Legali (Imprint)' },
    ko: { title: '출판 정보 및 법적 고지 — Emre Pelit Sci-Phil', desc: '저자 Emre Pelit 출판 정보 및 단일 정규 허브 등록부.', heading: '법적 고지 (Imprint)' },
  },
  kvkk: {
    tr: { title: '6698 Sayılı KVKK Aydınlatma Metni — Emre Pelit Sci-Phil', desc: '6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında açık rıza ve aydınlatma metni.', heading: '6698 Sayılı KVKK Aydınlatma Metni' },
    en: { title: 'KVKK & Cookie Consent Notice — Emre Pelit Sci-Phil', desc: 'Personal data protection notice and opt-in telemetry disclosure.', heading: 'Data Protection & KVKK Notice' },
    es: { title: 'Aviso KVKK y Cookies — Emre Pelit Sci-Phil', desc: 'Aviso de protección de datos personales y consentimiento explícito.', heading: 'Aviso de Protección de Datos (KVKK)' },
    de: { title: 'KVKK & Einwilligungshinweis — Emre Pelit Sci-Phil', desc: 'Hinweise zum Datenschutz und zur expliziten Einwilligung.', heading: 'Datenschutzhinweis (KVKK)' },
    fr: { title: 'Notice KVKK & Cookies — Emre Pelit Sci-Phil', desc: 'Notice de protection des données personnelles et consentement.', heading: 'Notice de Protection des Données (KVKK)' },
    ru: { title: 'Уведомление о защите данных (KVKK) — Emre Pelit Sci-Phil', desc: 'Защита персональных данных и согласие пользователя.', heading: 'Защита данных (KVKK)' },
    ar: { title: 'إشعار حماية البيانات KVKK — Emre Pelit Sci-Phil', desc: 'إشعار حماية البيانات الشخصية والموافقة الصريحة.', heading: 'إشعار حماية البيانات (KVKK)' },
    zh: { title: '数据保护与 KVKK 声明 — Emre Pelit Sci-Phil', desc: '个人数据保护说明与显式同意披露。', heading: '数据保护声明 (KVKK)' },
    ja: { title: 'データ保護・KVKK 通知 — Emre Pelit Sci-Phil', desc: '個人データ保護と同意に関するご案内。', heading: 'データ保護通知 (KVKK)' },
    pt: { title: 'Aviso de Proteção de Dados (KVKK) — Emre Pelit Sci-Phil', desc: 'Proteção de dados pessoais e consentimento explícito.', heading: 'Proteção de Dados (KVKK)' },
    it: { title: 'Informativa KVKK e Cookie — Emre Pelit Sci-Phil', desc: 'Informativa sulla protezione dei dati personali e consenso.', heading: 'Protezione dei Dati (KVKK)' },
    ko: { title: '개인정보 보호(KVKK) 고지 — Emre Pelit Sci-Phil', desc: '개인정보 보호 안내 및 동의 절차.', heading: '데이터 보호 고지 (KVKK)' },
  },
  disclaimer: {
    tr: { title: 'Bağımsız Yazar Arşivi & Feragatname — Emre Pelit Sci-Phil', desc: 'Bağımsız yazar arşivi statüsü (hakemli dergi değildir) ve içerik feragatnamesi.', heading: 'Bağımsız Yazar Arşivi & Feragatname' },
    en: { title: 'Independent Author Archive Disclaimer — Emre Pelit Sci-Phil', desc: 'Independent author essay archive disclosure (not a peer-reviewed journal).', heading: 'Independent Archive Disclaimer' },
    es: { title: 'Aviso Legal del Archivo Independiente — Emre Pelit Sci-Phil', desc: 'Archivo independiente de autor (no es una revista con revisión por pares).', heading: 'Aviso Legal y Naturaleza del Archivo' },
    de: { title: 'Haftungsausschluss & Unabhängiges Archiv — Emre Pelit Sci-Phil', desc: 'Hinweis zum unabhängigen Autorenarchiv (keine Peer-Review-Zeitschrift).', heading: 'Unabhängiges Autorenarchiv' },
    fr: { title: 'Avertissement Archive Indépendante — Emre Pelit Sci-Phil', desc: 'Statut d’archive d’auteur indépendant (non évalué par des pairs).', heading: 'Avertissement Archive Indépendante' },
    ru: { title: 'Отказ от ответственности независимого архива — Emre Pelit Sci-Phil', desc: 'Статус независимого авторского архива.', heading: 'Статус независимого архива' },
    ar: { title: 'إخلاء مسؤولية الأرشيف المستقل — Emre Pelit Sci-Phil', desc: 'إفصاح أرشيف المؤلف المستقل.', heading: 'إخلاء مسؤولية الأرشيف المستقل' },
    zh: { title: '独立作者档案免责声明 — Emre Pelit Sci-Phil', desc: '独立作者研究档案说明（非同行评审期刊）。', heading: '独立作者档案免责声明' },
    ja: { title: '独立著者アーカイブ免責事項 — Emre Pelit Sci-Phil', desc: '独立著者エッセイアーカイブの法的開示事項。', heading: '独立アーカイブ免責事項' },
    pt: { title: 'Aviso do Arquivo Independente — Emre Pelit Sci-Phil', desc: 'Declaração de arquivo independente de autor.', heading: 'Aviso Legal do Arquivo' },
    it: { title: 'Avvertenza Archivio Indipendente — Emre Pelit Sci-Phil', desc: 'Dichiarazione di archivio indipendente d’autore.', heading: 'Avvertenza Archivio Indipendente' },
    ko: { title: '독립 저자 아카이브 면책 고지 — Emre Pelit Sci-Phil', desc: '독립 저자 에세이 아카이브 안내.', heading: '독립 아카이브 고지' },
  },
  methodology: {
    tr: { title: 'Yöntem, Simülasyon & AI Analiz Metodolojisi — Emre Pelit Sci-Phil', desc: 'Etkileşimli fizik simülasyonları, öngörüsel okuma ve kavramsal modelleme metodolojisi.', heading: 'Bilimsel Modelleme & Metodoloji' },
    en: { title: 'Methodology & Conceptual Simulations — Emre Pelit Sci-Phil', desc: 'Methodology for interactive conceptual physics simulations and editorial essays.', heading: 'Methodology & Conceptual Modeling' },
    es: { title: 'Metodología y Simulación Conceptual — Emre Pelit Sci-Phil', desc: 'Metodología editorial y de simulaciones conceptuales.', heading: 'Metodología y Simulación' },
    de: { title: 'Methodik & Konzeptionelle Simulation — Emre Pelit Sci-Phil', desc: 'Methodik für konzeptionelle Simulationen und Essays.', heading: 'Methodik & Modellierung' },
    fr: { title: 'Méthodologie & Simulation Conceptuelle — Emre Pelit Sci-Phil', desc: 'Méthodologie éditoriale et simulations conceptuelles.', heading: 'Méthodologie & Modélisation' },
    ru: { title: 'Методология и симуляции — Emre Pelit Sci-Phil', desc: 'Методология интерактивного моделирования и эпистемологического анализа.', heading: 'Методология и моделирование' },
    ar: { title: 'المنهجية والمحاكاة المفاهيمية — Emre Pelit Sci-Phil', desc: 'منهجية المحاكاة الفيزيائية التفاعلية والمقالات.', heading: 'المنهجية والنمذجة العلمية' },
    zh: { title: '研究方法与概念模拟方法论 — Emre Pelit Sci-Phil', desc: '交互式物理模拟与哲学文本分析方法论。', heading: '科研建模与方法论' },
    ja: { title: '研究手法と数理シミュレーション方法論 — Emre Pelit Sci-Phil', desc: '対話型物理シミュレーションと認識論分析の方法論。', heading: '科学モデリングと方法論' },
    pt: { title: 'Metodologia e Simulação Conceitual — Emre Pelit Sci-Phil', desc: 'Metodologia editorial e de simulações interativas.', heading: 'Metodologia e Modelagem' },
    it: { title: 'Metodologia e Simulazione Concettuale — Emre Pelit Sci-Phil', desc: 'Metodologia per simulazioni fisiche interattive e saggi.', heading: 'Metodologia e Modellazione' },
    ko: { title: '연구 방법론 및 개념 시뮬레이션 — Emre Pelit Sci-Phil', desc: '대화형 물리 시뮬레이션 및 철학 분석 방법론.', heading: '과학 모델링 및 방법론' },
  },
};

function detectLang(title = '', body = '') {
  const sample = `${title || ''} ${String(body || '').slice(0, 1000)}`;
  const lower = sample.toLowerCase();

  if ((sample.match(/[\u0600-\u06FF]/g) || []).length > 12) return 'ar';
  if ((sample.match(/[\u0400-\u04FF]/g) || []).length > 12) return 'ru';
  const jaMatches = (sample.match(/[\u3040-\u30FF]/g) || []).length;
  if (jaMatches > 6) return 'ja';
  if ((sample.match(/[\uAC00-\uD7AF]/g) || []).length > 6) return 'ko';
  const zhMatches = (sample.match(/[\u4E00-\u9FFF]/g) || []).length;
  if (zhMatches > 12 && jaMatches === 0) return 'zh';

  const scores = { tr: 0, en: 0, es: 0, de: 0, fr: 0, pt: 0, it: 0 };
  scores.tr += (sample.match(/[ğşıİĞŞ]/g) || []).length * 16;
  scores.de += (sample.match(/[äÄß]/g) || []).length * 16;
  scores.es += (sample.match(/[¿¡ñÑ]/g) || []).length * 16;
  scores.pt += (sample.match(/[ãõÃÕ]/g) || []).length * 16;
  scores.fr += (sample.match(/[œŒæÆàâêîôùûÀÂÊÎÔÙÛçÇ]/g) || []).length * 6;
  scores.it += (sample.match(/[ìòÌÒ]/g) || []).length * 6;

  const stopWords = {
    tr: new Set(['ve', 'bir', 'bu', 'için', 'ile', 'olan', 'olarak', 'gibi', 'daha', 'değil', 'ancak', 'fakat', 'üzerine', 'nedir', 'neden', 'kadar', 'mi', 'mı', 'mu', 'mü', 'evren', 'zaman', 'bilinç', 'gerçek', 'yoksa', 'var', 'yok', 'veya', 'ama']),
    en: new Set(['the', 'and', 'of', 'to', 'in', 'is', 'that', 'it', 'for', 'as', 'with', 'on', 'this', 'are', 'not', 'but', 'from', 'by', 'or', 'we', 'be', 'what', 'when', 'why', 'how', 'an', 'universe', 'time', 'consciousness']),
    es: new Set(['el', 'la', 'los', 'las', 'de', 'del', 'en', 'un', 'una', 'que', 'por', 'para', 'con', 'como', 'sobre', 'más', 'pero', 'entre', 'desde', 'todo', 'cuando', 'qué', 'si', 'es', 'son', 'tiempo', 'universo']),
    de: new Set(['der', 'die', 'das', 'und', 'in', 'von', 'zu', 'mit', 'auf', 'für', 'ist', 'ein', 'eine', 'nicht', 'als', 'auch', 'des', 'dem', 'den', 'sich', 'über', 'wie', 'oder', 'zeit', 'universum', 'bewusstsein', 'warum']),
    fr: new Set(['le', 'la', 'les', 'de', 'des', 'du', 'un', 'une', 'et', 'dans', 'pour', 'que', 'qui', 'est', 'en', 'par', 'sur', 'avec', 'plus', 'pas', 'ce', 'cette', 'nous', 'vous', 'mais', 'comme', 'temps', 'univers', 'conscience', 'si', 'qu', 'jusqu']),
    pt: new Set(['o', 'a', 'os', 'as', 'do', 'da', 'dos', 'das', 'em', 'um', 'uma', 'para', 'com', 'não', 'como', 'mais', 'mas', 'sobre', 'entre', 'tempo']),
    it: new Set(['il', 'lo', 'la', 'gli', 'le', 'di', 'del', 'della', 'nel', 'nella', 'con', 'per', 'che', 'non', 'come', 'più', 'tempo', 'universo', 'coscienza']),
  };

  const words = lower.match(/[\p{L}]+/gu) || [];
  for (const w of words) {
    for (const langKey of Object.keys(stopWords)) {
      if (stopWords[langKey].has(w)) scores[langKey] += 5;
    }
  }

  let bestLang = 'tr';
  let bestScore = -1;
  for (const langKey of Object.keys(scores)) {
    if (scores[langKey] > bestScore) {
      bestScore = scores[langKey];
      bestLang = langKey;
    }
  }
  return bestScore > 0 ? bestLang : 'tr';
}

function classifyEntry(title = '', plainText = '', idx = 0) {
  const sample = `${title} ${String(plainText).slice(0, 600)}`.toLowerCase();
  if (
    /beslenme|sa[ğg]l[ıiİ]k(?:l[ıiİ])?\s+(?:asistan|beslenme)|healthy eating|nutrition|ern[äa]hrung|gesundheitsassistent|alimentaci[óo]n|saludable|assistant.*sant[ée]/i.test(
      sample
    )
  ) {
    return { category: 'Yazılım & Uygulama Projeleri', simulationType: 'software' };
  }
  if (/llm|yapay zeka|artificial intelligence|intelligence artificielle|künstliche intelligenz|beyin|brain|cerveau|gehirn|cerebro|zihin|mind|conscience|bilinç|autonom|özerklik|nöro|neural/.test(sample)) {
    return { category: 'Bilinç, Yapay Zeka & Zihin Felsefesi', simulationType: 'consciousness' };
  }
  if (/kuantum|quantum|quantique|quanten|cuántic|dalga|wave|gözlemci|observer|entangle|dolanıklık/.test(sample)) {
    return { category: 'Kuantum Fiziği & Epistemoloji', simulationType: 'quantum' };
  }
  if (/higgs|simetri|symmetry|symétrie|symmetrie|alan|field|parçacık|particle|kütle|mass|bozon/.test(sample)) {
    return { category: 'Parçacık Fiziği & Ontoloji', simulationType: 'higgs' };
  }
  if (/hologra|entropi|entropy|ads\/cft|bekenstein|hawking|enformasyon|information|ufuk|horizon/.test(sample)) {
    return { category: 'Kozmoloji & Enformasyon Teorisi', simulationType: 'holographic' };
  }
  if (/zaman|time|temps|zeit|tiempo|uzay|spacetime|relativit|görelilik|evren|universe|kozmoloj/.test(sample)) {
    return { category: 'Uzay-Zaman Felsefesi', simulationType: 'spacetime' };
  }
  if (/kaos|chaos|determin|keit|özgür irade|free will|libre arbitre|lorenz|karmaşık|complex|etik|ahlak|felsef/.test(sample)) {
    return { category: 'Karmaşıklık & Determinizm', simulationType: 'chaos' };
  }
  const rotation = [
    { category: 'Bilinç, Yapay Zeka & Zihin Felsefesi', simulationType: 'consciousness' },
    { category: 'Kuantum Fiziği & Epistemoloji', simulationType: 'quantum' },
    { category: 'Kozmoloji & Enformasyon Teorisi', simulationType: 'holographic' },
    { category: 'Uzay-Zaman Felsefesi', simulationType: 'spacetime' },
    { category: 'Parçacık Fiziği & Ontoloji', simulationType: 'higgs' },
    { category: 'Karmaşıklık & Determinizm', simulationType: 'chaos' },
  ];
  return rotation[idx % rotation.length];
}

function transliterateSlug(title, id, postNumber) {
  const charMap = {
    'ç': 'c', 'Ç': 'c', 'ğ': 'g', 'Ğ': 'g', 'ı': 'i', 'İ': 'i',
    'ö': 'o', 'Ö': 'o', 'ş': 's', 'Ş': 's', 'ü': 'u', 'Ü': 'u',
    'ä': 'ae', 'Ä': 'ae', 'ß': 'ss',
    'é': 'e', 'É': 'e', 'è': 'e', 'È': 'e', 'ê': 'e', 'Ê': 'e', 'ë': 'e', 'Ë': 'e',
    'à': 'a', 'À': 'a', 'á': 'a', 'Á': 'a', 'â': 'a', 'Â': 'a', 'ã': 'a', 'Ã': 'a', 'å': 'a', 'Å': 'a',
    'î': 'i', 'Î': 'i', 'ï': 'i', 'Ï': 'i', 'í': 'i', 'Í': 'i', 'ì': 'i', 'Ì': 'i',
    'ó': 'o', 'Ó': 'o', 'ò': 'o', 'Ò': 'o', 'ô': 'o', 'Ô': 'o', 'õ': 'o', 'Õ': 'o', 'ø': 'o', 'Ø': 'o',
    'ú': 'u', 'Ú': 'u', 'ù': 'u', 'Ù': 'u', 'û': 'u', 'Û': 'u',
    'ñ': 'n', 'Ñ': 'n', 'œ': 'oe', 'Œ': 'oe', 'æ': 'ae', 'Æ': 'ae',
  };
  let s = String(title || '')
    .split('')
    .map((ch) => charMap[ch] || ch)
    .join('')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (s.length > 75) {
    const cut = s.slice(0, 75);
    const b = cut.replace(/-[^-]*$/, '');
    s = (b.length >= 24 ? b : cut).replace(/-+$/g, '');
  }
  const base = s || String(id || 'article').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return postNumber ? `${base}-${postNumber}` : base;
}

function wrapStaticShell(lang, bodyHtml) {
  const safeLang = SUPPORTED_12_LANGS.includes(lang) ? lang : 'tr';
  const meta = LANG_HUB_META[safeLang] || LANG_HUB_META.tr;
  const archivePath = safeLang === 'tr' ? '/archive' : `/${safeLang}/archive`;
  const langNav = SUPPORTED_12_LANGS.map((l) => `<a href="${LANG_HUB_META[l].path}">${l.toUpperCase()}</a>`).join(' · ');
  return `
<header class="max-w-5xl mx-auto px-6 py-4 border-b border-stone-300 text-sm">
  <nav aria-label="Primary Navigation" class="flex flex-wrap gap-4 items-center">
    <a href="${meta.path}"><strong>Emre Pelit Sci-Phil</strong></a>
    <a href="${archivePath}">${escapeHtml(meta.archiveLabel)}</a>
    <a href="/?tab=simulators">Simulators</a>
    <a href="/?tab=stats">301 Analytics</a>
    <a href="https://github.com/emrepelit109" rel="me noopener noreferrer">GitHub</a>
    <a href="https://www.researchgate.net/profile/Emre-Pelit" rel="me noopener noreferrer">ResearchGate</a>
    <a href="https://www.youtube.com/@science_only" rel="me noopener noreferrer">YouTube (@science_only)</a>
  </nav>
</header>
${bodyHtml}
<section aria-label="Canonical Hub and Blogger Live Architecture" class="max-w-5xl mx-auto px-6 py-4 border-t border-stone-200 text-xs font-mono">
  <p><strong>Live Websites (2):</strong> ${ACTIVE_LIVE_WEBSITES.join(' · ')}</p>
  <p><strong>Retired 301 → Main Hub (8):</strong> ${RETIRED_301_WEBSITES.join(' · ')}</p>
  <p><strong>12 Canonical Languages:</strong> ${langNav}</p>
</section>
<footer class="max-w-5xl mx-auto px-6 py-6 border-t border-stone-300 text-xs">
  <p>© 2026 Emre Pelit · emrepelit39@gmail.com</p>
  <nav aria-label="Legal Navigation" class="flex flex-wrap gap-3 mt-2">
    <a href="/${safeLang}/privacy">${escapeHtml(GOVERNANCE_PAGES.privacy[safeLang].heading)}</a>
    <a href="/${safeLang}/terms">${escapeHtml(GOVERNANCE_PAGES.terms[safeLang].heading)}</a>
    <a href="/${safeLang}/imprint">${escapeHtml(GOVERNANCE_PAGES.imprint[safeLang].heading)}</a>
    <a href="/${safeLang}/kvkk">${escapeHtml(GOVERNANCE_PAGES.kvkk[safeLang].heading)}</a>
    <a href="/${safeLang}/disclaimer">${escapeHtml(GOVERNANCE_PAGES.disclaimer[safeLang].heading)}</a>
    <a href="/${safeLang}/methodology">${escapeHtml(GOVERNANCE_PAGES.methodology[safeLang].heading)}</a>
  </nav>
</footer>`.trim();
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function stripHtmlTags(raw = '') {
  return String(raw || '')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

async function syncFromBloggerIfRequested() {
  if (!process.argv.includes('--sync')) return null;
  try {
    const pageSize = 150;
    const allRawEntries = [];
    let startIndex = 1;
    let totalResults = 0;

    while (startIndex <= 1500) {
      const url = `${BLOGGER_ORIGIN}/feeds/posts/default?alt=json&start-index=${startIndex}&max-results=${pageSize}`;
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 10000);
      const res = await fetch(url, {
        signal: ctrl.signal,
        headers: { Accept: 'application/json', 'User-Agent': 'EmrePelit-SciPhil-SSG/5.2' },
      });
      clearTimeout(timer);
      if (!res.ok) break;
      const data = await res.json();
      totalResults = parseInt(data?.feed?.openSearch$totalResults?.$t || '0', 10) || totalResults;
      const entries = data?.feed?.entry || [];
      if (!entries.length) break;
      allRawEntries.push(...entries);
      if (allRawEntries.length >= totalResults) break;
      startIndex += entries.length;
    }

    if (allRawEntries.length === 0) return null;

    const existingMap = new Map();
    if (fs.existsSync(CACHE_PATH)) {
      try {
        const old = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf-8'));
        const list = Array.isArray(old) ? old : old.entries || [];
        list.forEach((item) => {
          if (item.id) existingMap.set(item.id, item);
        });
      } catch {}
    }

    const total = Math.max(totalResults, allRawEntries.length);
    const mergedEntries = allRawEntries.map((raw, idx) => {
      const idStr = raw?.id?.$t || '';
      const postMatch = idStr.match(/post-(\d+)/);
      const id = postMatch ? `blogger-${postMatch[1]}` : `blogger-idx-${idx + 1}`;
      const prev = existingMap.get(id);
      const title = raw?.title?.$t || prev?.title || 'Untitled';
      const rawHtml = raw?.content?.$t || raw?.summary?.$t || '';
      const plain = stripHtmlTags(rawHtml);
      const paragraphs = rawHtml
        .split(/<\/p>|<br\s*\/?>\s*<br\s*\/?>/i)
        .map((p) => stripHtmlTags(p))
        .filter((p) => p.length > 24);
      const linkAlt = Array.isArray(raw?.link) ? raw.link.find((l) => l.rel === 'alternate') : null;
      const classified = classifyEntry(title, plain, idx);
      return {
        ...(prev || {}),
        id,
        postNumber: total - idx,
        title,
        abstract: (paragraphs[0] || plain || title).slice(0, 360),
        paragraphs: paragraphs.length > 0 ? paragraphs : prev?.paragraphs || [plain || title],
        keyFindings: prev?.keyFindings || [],
        category: classified.simulationType === 'software' ? classified.category : prev?.category || classified.category,
        simulationType: classified.simulationType === 'software' ? classified.simulationType : prev?.simulationType || classified.simulationType,
        publishedAt: (raw?.published?.$t || prev?.publishedAt || '2026-11-01').slice(0, 10),
        bloggerUrl: linkAlt?.href || prev?.bloggerUrl || `${BLOGGER_ORIGIN}/`,
        sourceLang: prev?.sourceLang || detectLang(title, plain),
      };
    });

    const nextCache = {
      blogTitle: 'Emre Pelit — Sci-Phil Bilim, Felsefe ve Simülasyon Arşivi',
      blogUrl: BLOGGER_ORIGIN,
      totalResults: total,
      latestPostId: mergedEntries[0]?.id || '',
      syncedAt: new Date().toISOString(),
      entries: mergedEntries,
    };
    fs.writeFileSync(CACHE_PATH, JSON.stringify(nextCache), 'utf-8');
    console.log(`[prerender] Synced ${mergedEntries.length} posts live from Blogger.`);
    return mergedEntries;
  } catch (err) {
    console.warn('[prerender] Live Blogger --sync fallback to local cache:', err?.message || err);
    return null;
  }
}

function buildReciprocalHreflangBlock(urlsByLang, xDefaultUrl) {
  return SUPPORTED_12_LANGS.map((l) => {
    const href = urlsByLang[l] || `${CANONICAL_ORIGIN}${LANG_HUB_META[l].path}`;
    return `    <link rel="alternate" hreflang="${l}" href="${escapeHtml(href)}" />`;
  })
    .concat([`    <link rel="alternate" hreflang="x-default" href="${escapeHtml(xDefaultUrl)}" />`])
    .join('\n');
}

function injectHeadAndRoot(baseHtml, opts) {
  const {
    lang = 'tr',
    title,
    description,
    canonicalUrl,
    ogType = 'website',
    jsonLd = null,
    hreflangBlock = null,
    rootHtml = '',
  } = opts;

  let html = baseHtml
    .replace(/<html lang="[^"]*">/, `<html lang="${escapeHtml(lang)}">`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
    .replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`)
    .replace(/<meta\s+name="description"[^>]*>/i, `<meta name="description" content="${escapeHtml(description)}" />`)
    .replace(/<meta\s+property="og:type"[^>]*>/i, `<meta property="og:type" content="${escapeHtml(ogType)}" />`)
    .replace(/<meta\s+property="og:title"[^>]*>/i, `<meta property="og:title" content="${escapeHtml(title)}" />`)
    .replace(/<meta\s+property="og:description"[^>]*>/i, `<meta property="og:description" content="${escapeHtml(description)}" />`)
    .replace(/<meta\s+property="og:url"[^>]*>/i, `<meta property="og:url" content="${escapeHtml(canonicalUrl)}" />`)
    .replace(/<meta\s+name="twitter:title"[^>]*>/i, `<meta name="twitter:title" content="${escapeHtml(title)}" />`)
    .replace(/<meta\s+name="twitter:description"[^>]*>/i, `<meta name="twitter:description" content="${escapeHtml(description)}" />`);

  if (hreflangBlock) {
    html = html.replace(
      /(<link rel="alternate" hreflang="tr"[\s\S]*?<link rel="alternate" hreflang="x-default"[^>]*\/>)/i,
      hreflangBlock
    );
  }

  if (jsonLd) {
    html = html.replace(
      '</head>',
      `    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n  </head>`
    );
  }

  if (rootHtml) {
    html = html.replace('<div id="root"></div>', `<div id="root">${wrapStaticShell(lang, rootHtml)}</div>`);
  }

  return html;
}

function writeHtmlRoute(routePath, html) {
  const rel = routePath.replace(/^\/+/, '').replace(/\/+$/, '');
  const outDir = rel ? path.join(DIST_DIR, rel) : DIST_DIR;
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf-8');
}

async function run() {
  const synced = await syncFromBloggerIfRequested();

  let entries = synced || [];
  if (entries.length === 0) {
    if (!fs.existsSync(CACHE_PATH)) {
      console.warn('[prerender] .blogger-all-304-cache.json not found; skipping static prerender.');
      return;
    }
    const raw = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf-8'));
    entries = Array.isArray(raw) ? raw : raw.entries || raw.posts || [];
  }

  fs.mkdirSync(PUBLIC_DATA_DIR, { recursive: true });
  const snapshot = entries.map((e, idx) => {
    const postNumber = e.postNumber || entries.length - idx;
    const lang = e.sourceLang || detectLang(e.title, e.abstract || (e.paragraphs && e.paragraphs[0]) || '');
    const slug = transliterateSlug(e.title, e.id, postNumber);
    const segment = LANG_ARTICLE_SEGMENT[lang] || 'article';
    const canonicalPath = `/${lang}/${segment}/${slug}`;
    const paragraphs = Array.isArray(e.paragraphs) && e.paragraphs.length > 0
      ? e.paragraphs
      : [e.abstract || e.title];
    const classifiedFallback = classifyEntry(e.title, e.abstract || (paragraphs && paragraphs[0]) || '', idx);
    const category = classifiedFallback.simulationType === 'software' ? classifiedFallback.category : (e.category || classifiedFallback.category);
    const simulationType = classifiedFallback.simulationType === 'software' ? 'software' : (e.simulationType || classifiedFallback.simulationType);
    return {
      id: e.id,
      postNumber,
      lang,
      slug,
      canonicalPath,
      canonicalUrl: `${CANONICAL_ORIGIN}${canonicalPath}`,
      title: e.title,
      abstract: (e.abstract || paragraphs[0] || '').slice(0, 360),
      paragraphs,
      keyFindings: Array.isArray(e.keyFindings) ? e.keyFindings : [],
      category,
      simulationType,
      publishedAt: e.publishedAt || '2026-11-01',
      bloggerUrl: e.bloggerUrl || '',
    };
  });

  const snapshotPayload = JSON.stringify({
    generatedAt: new Date().toISOString(),
    canonicalOrigin: CANONICAL_ORIGIN,
    totalArticles: snapshot.length,
    articles: snapshot,
  });

  fs.writeFileSync(path.join(PUBLIC_DATA_DIR, 'corpus-snapshot.json'), snapshotPayload, 'utf-8');

  const distIndex = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(distIndex)) {
    console.log(`[prerender] Wrote /public/data/corpus-snapshot.json (${snapshot.length} articles). Run after vite build for HTML shells.`);
    return;
  }

  fs.mkdirSync(DIST_DATA_DIR, { recursive: true });
  fs.writeFileSync(path.join(DIST_DATA_DIR, 'corpus-snapshot.json'), snapshotPayload, 'utf-8');

  const baseHtml = fs.readFileSync(distIndex, 'utf-8');
  let generatedHtmlCount = 0;

  // 1. Prerender all 316+ articles across ALL 12 canonical language routes with full reciprocal hreflang
  for (let i = 0; i < snapshot.length; i++) {
    const item = snapshot[i];
    const prevItem = i > 0 ? snapshot[i - 1] : null;
    const nextItem = i + 1 < snapshot.length ? snapshot[i + 1] : null;
    const desc = item.abstract || `${item.title} — Emre Pelit Sci-Phil Bilim ve Felsefe Arşivi.`;
    const bodyParagraphsHtml = item.paragraphs
      .map((p) => `<p>${escapeHtml(p)}</p>`)
      .join('\n');
    const trMonths = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
    ];
    const dMatch = String(item.publishedAt || '2026-11-01').match(/^(\d{4})-(\d{2})-(\d{2})/);
    const formattedOpeningDate =
      dMatch && trMonths[Number(dMatch[2]) - 1]
        ? `${Number(dMatch[3])} ${trMonths[Number(dMatch[2]) - 1]} ${dMatch[1]}`
        : item.publishedAt || '24 Nisan 2026';
    const findingsHtml =
      item.keyFindings.length > 0
        ? `<section aria-label="Temel Çıkarımlar"><h2>Temel Çıkarımlar</h2><ul>${item.keyFindings
            .map((k) => `<li>${escapeHtml(k)}</li>`)
            .join('')}</ul></section>`
        : '';

    const urlsByLang = Object.fromEntries(
      SUPPORTED_12_LANGS.map((l) => [l, `${CANONICAL_ORIGIN}/${l}/${LANG_ARTICLE_SEGMENT[l]}/${item.slug}`])
    );
    const articleHreflangBlock = buildReciprocalHreflangBlock(urlsByLang, item.canonicalUrl);

    for (const targetLang of SUPPORTED_12_LANGS) {
      const seg = LANG_ARTICLE_SEGMENT[targetLang];
      const routePath = `/${targetLang}/${seg}/${item.slug}`;
      const routeCanonicalUrl = `${CANONICAL_ORIGIN}${routePath}`;
      const hubPath = LANG_HUB_META[targetLang].path;
      const archivePath = targetLang === 'tr' ? '/archive' : `/${targetLang}/archive`;
      const pageTitle = `${item.title} [${targetLang.toUpperCase()}] — Emre Pelit`;

      const blogPostingLd = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'BlogPosting',
            '@id': `${routeCanonicalUrl}#article`,
            headline: item.title,
            description: desc,
            datePublished: item.publishedAt,
            dateModified: item.publishedAt,
            inLanguage: targetLang,
            image: `${CANONICAL_ORIGIN}/og-card.jpg`,
            mainEntityOfPage: { '@type': 'WebPage', '@id': routeCanonicalUrl },
            author: { '@type': 'Person', name: 'Emre Pelit', url: `${CANONICAL_ORIGIN}/` },
            publisher: { '@type': 'Organization', name: 'Emre Pelit — Sci-Phil Bilim, Felsefe ve Simülasyon Arşivi', url: `${CANONICAL_ORIGIN}/` },
            isBasedOn: item.bloggerUrl || undefined,
            video: { '@id': `${routeCanonicalUrl}#explainer-video` },
          },
          {
            '@type': 'VideoObject',
            '@id': `${routeCanonicalUrl}#explainer-video`,
            name: `${item.title} — HTML5 Explainer Video (60s)`,
            description: desc,
            thumbnailUrl: `${CANONICAL_ORIGIN}/og-card.jpg`,
            uploadDate: item.publishedAt,
            duration: 'PT60S',
            embedUrl: `${routeCanonicalUrl}#video`,
            contentUrl: `${routeCanonicalUrl}#video`,
            inLanguage: targetLang,
            isFamilyFriendly: true,
            author: { '@type': 'Person', name: 'Emre Pelit', url: `${CANONICAL_ORIGIN}/` },
          },
          {
            '@type': 'Quiz',
            '@id': `${routeCanonicalUrl}#quiz`,
            name: `${item.title} — Multiple-Choice Comprehension Quiz`,
            educationalUse: 'Self-assessment',
            learningResourceType: 'Multiple-Choice Quiz',
            inLanguage: targetLang,
            about: item.category,
            author: { '@type': 'Person', name: 'Emre Pelit', url: `${CANONICAL_ORIGIN}/` },
          },
        ],
      };

      const rootHtml = `
<main class="max-w-4xl mx-auto px-6 py-10 space-y-6">
  <nav aria-label="Breadcrumb">
    <a href="${hubPath}">Ana Hub</a> / <a href="${archivePath}">Arşiv</a> / <span>#${item.postNumber} (${targetLang.toUpperCase()})</span>
  </nav>
  <article itemscope itemtype="https://schema.org/BlogPosting">
    <header>
      <div><strong>Emre Pelit</strong> · Bağımsız Yazar Arşivi · ${escapeHtml(item.category)} · ${escapeHtml(item.publishedAt)}</div>
      <h1 itemprop="headline">${escapeHtml(item.title)}</h1>
      <p itemprop="description"><strong>${escapeHtml(desc)}</strong></p>
    </header>
    <div itemprop="articleBody">
      ${bodyParagraphsHtml}
      <p><em>${escapeHtml(`Bu makale ${formattedOpeningDate} tarihinde Mersin'de yazılmıştır.`)}</em></p>
    </div>
    ${findingsHtml}
    <section aria-label="HTML5 Açıklayıcı Video ve Çoktan Seçmeli Test">
      <h2>60 Saniyelik HTML5 Açıklayıcı Video &amp; Çoktan Seçmeli Kavrama Soruları</h2>
      <p>Bu makale; 6 sahneli 60 saniyelik telifsiz HTML5 Canvas açıklayıcı video, makalenin genel sonucuyla uyumlu 4 soruluk profesyonel çoktan seçmeli test ve interaktif fizik/felsefe simülasyonu ile birlikte sunulmaktadır.</p>
    </section>
    <footer>
      <p>Kanonik Adres (${targetLang.toUpperCase()}): <a href="${escapeHtml(routeCanonicalUrl)}">${escapeHtml(routeCanonicalUrl)}</a></p>
      <nav aria-label="Makale Gezinimi">
        ${prevItem ? `<a href="${escapeHtml(`/${targetLang}/${seg}/${prevItem.slug}`)}">← ${escapeHtml(prevItem.title)}</a>` : ''}
        ${nextItem ? `<a href="${escapeHtml(`/${targetLang}/${seg}/${nextItem.slug}`)}">${escapeHtml(nextItem.title)} →</a>` : ''}
      </nav>
    </footer>
  </article>
</main>`.trim();

      const html = injectHeadAndRoot(baseHtml, {
        lang: targetLang,
        title: pageTitle,
        description: desc,
        canonicalUrl: routeCanonicalUrl,
        ogType: 'article',
        jsonLd: blogPostingLd,
        hreflangBlock: articleHreflangBlock,
        rootHtml,
      });

      writeHtmlRoute(routePath, html);
      generatedHtmlCount += 1;
    }
  }

  // 2. Prerender ALL 12 language home hubs (/en/, /es/, /de/, /fr/, /ru/, /ar/, /zh/, /ja/, /pt/, /it/, /ko/)
  const hubHreflangs = Object.fromEntries(
    SUPPORTED_12_LANGS.map((l) => [l, `${CANONICAL_ORIGIN}${LANG_HUB_META[l].path}`])
  );
  for (const lang of SUPPORTED_12_LANGS) {
    if (lang === 'tr') continue; // dist/index.html is already TR root
    const meta = LANG_HUB_META[lang];
    const langArticles = snapshot.filter((a) => a.lang === lang).slice(0, 60);
    const listItems = (langArticles.length ? langArticles : snapshot.slice(0, 40))
      .map((a) => `<li><a href="/${lang}/${LANG_ARTICLE_SEGMENT[lang]}/${escapeHtml(a.slug)}">${escapeHtml(a.title)}</a> <small>(${escapeHtml(a.publishedAt)})</small></li>`)
      .join('\n');

    const rootHtml = `
<main class="max-w-5xl mx-auto px-6 py-10 space-y-6">
  <header>
    <h1>${escapeHtml(meta.h1)}</h1>
    <p>${escapeHtml(meta.desc)}</p>
    <nav aria-label="Languages">
      ${SUPPORTED_12_LANGS.map((l) => `<a href="${LANG_HUB_META[l].path}">${l.toUpperCase()}</a>`).join(' · ')} · <a href="/${lang}/archive">${escapeHtml(meta.archiveLabel)}</a>
    </nav>
  </header>
  <section aria-label="${escapeHtml(meta.archiveLabel)}">
    <ul>${listItems}</ul>
  </section>
</main>`.trim();

    const html = injectHeadAndRoot(baseHtml, {
      lang,
      title: meta.title,
      description: meta.desc,
      canonicalUrl: `${CANONICAL_ORIGIN}${meta.path}`,
      hreflangBlock: buildReciprocalHreflangBlock(hubHreflangs, `${CANONICAL_ORIGIN}/`),
      rootHtml,
    });
    writeHtmlRoute(meta.path, html);
    generatedHtmlCount += 1;
  }

  // 3. Prerender full archive index routes (/archive & /<12-langs>/archive)
  const archiveHreflangs = Object.fromEntries(
    SUPPORTED_12_LANGS.map((l) => [l, `${CANONICAL_ORIGIN}/${l}/archive`])
  );

  for (const archiveRoute of ['/archive', ...SUPPORTED_12_LANGS.map((l) => `/${l}/archive`)]) {
    const routeLang = SUPPORTED_12_LANGS.find((l) => archiveRoute.startsWith(`/${l}/`)) || 'tr';
    const meta = LANG_HUB_META[routeLang];
    const seg = LANG_ARTICLE_SEGMENT[routeLang];
    const canonicalUrl = `${CANONICAL_ORIGIN}${archiveRoute}`;
    const allArchiveListHtml = snapshot
      .map((a) => `<li><a href="/${routeLang}/${seg}/${escapeHtml(a.slug)}">#${a.postNumber} — ${escapeHtml(a.title)}</a> <span>[${escapeHtml(routeLang)}]</span></li>`)
      .join('\n');

    const rootHtml = `
<main class="max-w-5xl mx-auto px-6 py-10 space-y-6">
  <header>
    <nav><a href="${meta.path}">Hub</a> / <span>${escapeHtml(meta.archiveLabel)}</span></nav>
    <h1>${escapeHtml(meta.archiveLabel)} (${snapshot.length})</h1>
    <p>${escapeHtml(meta.desc)}</p>
  </header>
  <ul>${allArchiveListHtml}</ul>
</main>`.trim();

    const html = injectHeadAndRoot(baseHtml, {
      lang: routeLang,
      title: `${meta.archiveLabel} (${snapshot.length}) — Emre Pelit`,
      description: meta.desc,
      canonicalUrl,
      hreflangBlock: buildReciprocalHreflangBlock(archiveHreflangs, `${CANONICAL_ORIGIN}/archive`),
      rootHtml,
    });
    writeHtmlRoute(archiveRoute, html);
    generatedHtmlCount += 1;
  }

  // 4. Prerender governance routes across all 12 languages
  for (const [govKey, translations] of Object.entries(GOVERNANCE_PAGES)) {
    const govHreflangs = Object.fromEntries(
      SUPPORTED_12_LANGS.map((l) => [l, `${CANONICAL_ORIGIN}/${l}/${govKey}`])
    );
    for (const lang of SUPPORTED_12_LANGS) {
      const info = translations[lang] || translations.en;
      const canonicalUrl = `${CANONICAL_ORIGIN}/${lang}/${govKey}`;
      const hubPath = LANG_HUB_META[lang].path;
      const rootHtml = `
<main class="max-w-3xl mx-auto px-6 py-10 space-y-4">
  <nav><a href="${hubPath}">Hub</a> / <span>${escapeHtml(info.heading)}</span></nav>
  <h1>${escapeHtml(info.heading)}</h1>
  <p>${escapeHtml(info.desc)}</p>
  <p>Emre Pelit · emrepelit39@gmail.com · <a href="${CANONICAL_ORIGIN}/">https://emrepelit-sciphi.ai.studio/</a></p>
</main>`.trim();

      const html = injectHeadAndRoot(baseHtml, {
        lang,
        title: info.title,
        description: info.desc,
        canonicalUrl,
        hreflangBlock: buildReciprocalHreflangBlock(govHreflangs, `${CANONICAL_ORIGIN}/tr/${govKey}`),
        rootHtml,
      });
      writeHtmlRoute(`/${lang}/${govKey}`, html);
      generatedHtmlCount += 1;
    }
  }

  // 5. Emit clean static sitemaps (including sitemap-12-languages.xml) & robots.txt into /dist
  const todayIso = new Date().toISOString().slice(0, 10);
  const articleUrlsXml = snapshot
    .map(
      (a) =>
        `  <url>\n    <loc>${escapeHtml(a.canonicalUrl)}</loc>\n    <lastmod>${escapeHtml(a.publishedAt || todayIso)}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.95</priority>\n  </url>`
    )
    .join('\n');

  const sitemapArticlesXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${articleUrlsXml}\n</urlset>\n`;

  const twelveLangUrlsXml = snapshot
    .flatMap((a) => {
      const altLinks = SUPPORTED_12_LANGS.map(
        (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${CANONICAL_ORIGIN}/${l}/${LANG_ARTICLE_SEGMENT[l]}/${escapeHtml(a.slug)}" />`
      )
        .concat([`    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeHtml(a.canonicalUrl)}" />`])
        .join('\n');
      return SUPPORTED_12_LANGS.map(
        (l) =>
          `  <url>\n    <loc>${CANONICAL_ORIGIN}/${l}/${LANG_ARTICLE_SEGMENT[l]}/${escapeHtml(a.slug)}</loc>\n    <lastmod>${escapeHtml(a.publishedAt || todayIso)}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.98</priority>\n${altLinks}\n  </url>`
      );
    })
    .join('\n');

  const sitemap12LanguagesXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${twelveLangUrlsXml}\n</urlset>\n`;

  const turkishArticles = snapshot.filter((a) => a.lang === 'tr');
  const turkish12LangUrlsXml = turkishArticles
    .flatMap((a) => {
      const trCanonical = `${CANONICAL_ORIGIN}/tr/${LANG_ARTICLE_SEGMENT.tr}/${escapeHtml(a.slug)}`;
      const altLinks = SUPPORTED_12_LANGS.map(
        (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${CANONICAL_ORIGIN}/${l}/${LANG_ARTICLE_SEGMENT[l]}/${escapeHtml(a.slug)}" />`
      )
        .concat([`    <xhtml:link rel="alternate" hreflang="x-default" href="${trCanonical}" />`])
        .join('\n');
      return SUPPORTED_12_LANGS.map(
        (l) =>
          `  <url>\n    <loc>${CANONICAL_ORIGIN}/${l}/${LANG_ARTICLE_SEGMENT[l]}/${escapeHtml(a.slug)}</loc>\n    <lastmod>${escapeHtml(a.publishedAt || todayIso)}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n${altLinks}\n  </url>`
      );
    })
    .join('\n');
  const sitemapTurkish12LanguagesXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${turkish12LangUrlsXml}\n</urlset>\n`;

  const mainPaths = ['/', ...SUPPORTED_12_LANGS.filter((l) => l !== 'tr').map((l) => `/${l}/`), '/archive', ...SUPPORTED_12_LANGS.map((l) => `/${l}/archive`)];
  const mainUrlsXml = mainPaths
    .map(
      (p) =>
        `  <url>\n    <loc>${CANONICAL_ORIGIN}${p}</loc>\n    <lastmod>${todayIso}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>${p === '/' ? '1.0' : '0.95'}</priority>\n  </url>`
    )
    .join('\n');
  const sitemapMainXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${mainUrlsXml}\n</urlset>\n`;

  const sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <sitemap>\n    <loc>${CANONICAL_ORIGIN}/sitemap-main.xml</loc>\n    <lastmod>${todayIso}</lastmod>\n  </sitemap>\n  <sitemap>\n    <loc>${CANONICAL_ORIGIN}/sitemap-articles.xml</loc>\n    <lastmod>${todayIso}</lastmod>\n  </sitemap>\n  <sitemap>\n    <loc>${CANONICAL_ORIGIN}/sitemap-turkish-12-languages.xml</loc>\n    <lastmod>${todayIso}</lastmod>\n  </sitemap>\n  <sitemap>\n    <loc>${CANONICAL_ORIGIN}/sitemap-12-languages.xml</loc>\n    <lastmod>${todayIso}</lastmod>\n  </sitemap>\n  <sitemap>\n    <loc>${CANONICAL_ORIGIN}/sitemap-scholar.xml</loc>\n    <lastmod>${todayIso}</lastmod>\n  </sitemap>\n</sitemapindex>\n`;

  const robotsTxt = `User-agent: *\nAllow: /\n\nSitemap: ${CANONICAL_ORIGIN}/sitemap_index.xml\nSitemap: ${CANONICAL_ORIGIN}/sitemap.xml\nSitemap: ${CANONICAL_ORIGIN}/sitemap-articles.xml\nSitemap: ${CANONICAL_ORIGIN}/sitemap-turkish-12-languages.xml\nSitemap: ${CANONICAL_ORIGIN}/sitemap-12-languages.xml\nSitemap: ${CANONICAL_ORIGIN}/sitemap-scholar.xml\n`;

  fs.writeFileSync(path.join(DIST_DIR, 'sitemap-articles.xml'), sitemapArticlesXml, 'utf-8');
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap-turkish-12-languages.xml'), sitemapTurkish12LanguagesXml, 'utf-8');
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap-12-languages.xml'), sitemap12LanguagesXml, 'utf-8');
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap-main.xml'), sitemapMainXml, 'utf-8');
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapArticlesXml, 'utf-8');
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap_index.xml'), sitemapIndexXml, 'utf-8');
  fs.writeFileSync(path.join(DIST_DIR, 'robots.txt'), robotsTxt, 'utf-8');

  console.log(
    `[prerender] Complete: ${snapshot.length} snapshot items + ${generatedHtmlCount} static full-body SSG HTML routes (12 langs) + static sitemaps.`
  );
}

run();
