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

const NATIVE_LANGS = ['tr', 'en', 'es', 'de', 'fr'];

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
    title: 'Emre Pelit Sci-Phil — Bilim, Felsefe ve Simülasyon Arşivi',
    desc: 'Emre Pelit tarafından kaleme alınan 316+ özgün bilim ve felsefe makalesi, önceki bilimsel araştırmalar ve interaktif fizik simülasyonları.',
    h1: 'Emre Pelit — Bilim, Felsefe ve Simülasyon Arşivi',
    archiveLabel: 'Tüm Makale Arşivi',
  },
  en: {
    path: '/en/',
    title: 'Emre Pelit Sci-Phil — Science, Philosophy & Simulation Archive',
    desc: 'Independent author archive by Emre Pelit exploring quantum physics, cosmology, philosophy of mind, and interactive scientific models.',
    h1: 'Emre Pelit — Science, Philosophy & Simulation Archive',
    archiveLabel: 'Complete Article Archive',
  },
  es: {
    path: '/es/',
    title: 'Emre Pelit Sci-Phil — Archivo de Ciencia, Filosofía y Simulación',
    desc: 'Archivo de autor independiente de Emre Pelit sobre física cuántica, cosmología, epistemología y modelos científicos interactivos.',
    h1: 'Emre Pelit — Archivo de Ciencia, Filosofía y Simulación',
    archiveLabel: 'Archivo Completo de Artículos',
  },
  de: {
    path: '/de/',
    title: 'Emre Pelit Sci-Phil — Archiv für Wissenschaft, Philosophie & Simulation',
    desc: 'Unabhängiges Autorenarchiv von Emre Pelit zu Quantenphysik, Kosmologie, Bewusstseinsphilosophie und interaktiven Modellen.',
    h1: 'Emre Pelit — Archiv für Wissenschaft, Philosophie & Simulation',
    archiveLabel: 'Vollständiges Artikelarchiv',
  },
  fr: {
    path: '/fr/',
    title: 'Emre Pelit Sci-Phil — Archives de Science, Philosophie et Simulation',
    desc: 'Archives d’auteur indépendant d’Emre Pelit consacrées à la physique quantique, la cosmologie, l’épistémologie et la simulation.',
    h1: 'Emre Pelit — Archives de Science, Philosophie et Simulation',
    archiveLabel: 'Archives Complètes des Articles',
  },
};

const GOVERNANCE_PAGES = {
  privacy: {
    tr: { title: 'Gizlilik Politikası — Emre Pelit Sci-Phil', desc: 'Veri işleme ilkeleri ve kullanıcı gizliliği politikası.', heading: 'Gizlilik Politikası' },
    en: { title: 'Privacy Policy — Emre Pelit Sci-Phil', desc: 'Data processing principles and user privacy policy.', heading: 'Privacy Policy' },
    es: { title: 'Política de Privacidad — Emre Pelit Sci-Phil', desc: 'Principios de tratamiento de datos y privacidad.', heading: 'Política de Privacidad' },
    de: { title: 'Datenschutzrichtlinie — Emre Pelit Sci-Phil', desc: 'Grundsätze der Datenverarbeitung und Privatsphäre.', heading: 'Datenschutzrichtlinie' },
    fr: { title: 'Politique de Confidentialité — Emre Pelit Sci-Phil', desc: 'Principes de traitement des données et confidentialité.', heading: 'Politique de Confidentialité' },
  },
  kvkk: {
    tr: { title: '6698 Sayılı KVKK Aydınlatma Metni — Emre Pelit Sci-Phil', desc: '6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında açık rıza ve aydınlatma metni.', heading: '6698 Sayılı KVKK Aydınlatma Metni' },
    en: { title: 'KVKK & Cookie Consent Notice — Emre Pelit Sci-Phil', desc: 'Personal data protection notice and opt-in telemetry disclosure.', heading: 'Data Protection & KVKK Notice' },
    es: { title: 'Aviso KVKK y Cookies — Emre Pelit Sci-Phil', desc: 'Aviso de protección de datos personales y consentimiento explícito.', heading: 'Aviso de Protección de Datos (KVKK)' },
    de: { title: 'KVKK & Einwilligungshinweis — Emre Pelit Sci-Phil', desc: 'Hinweise zum Datenschutz und zur expliziten Einwilligung.', heading: 'Datenschutzhinweis (KVKK)' },
    fr: { title: 'Notice KVKK & Cookies — Emre Pelit Sci-Phil', desc: 'Notice de protection des données personnelles et consentement.', heading: 'Notice de Protection des Données (KVKK)' },
  },
  disclaimer: {
    tr: { title: 'Bağımsız Yazar Arşivi & Feragatname — Emre Pelit Sci-Phil', desc: 'Bağımsız yazar arşivi statüsü (hakemli dergi değildir) ve içerik feragatnamesi.', heading: 'Bağımsız Yazar Arşivi & Feragatname' },
    en: { title: 'Independent Author Archive Disclaimer — Emre Pelit Sci-Phil', desc: 'Independent author essay archive disclosure (not a peer-reviewed journal).', heading: 'Independent Archive Disclaimer' },
    es: { title: 'Aviso Legal del Archivo Independiente — Emre Pelit Sci-Phil', desc: 'Archivo independiente de autor (no es una revista con revisión por pares).', heading: 'Aviso Legal y Naturaleza del Archivo' },
    de: { title: 'Haftungsausschluss & Unabhängiges Archiv — Emre Pelit Sci-Phil', desc: 'Hinweis zum unabhängigen Autorenarchiv (keine Peer-Review-Zeitschrift).', heading: 'Unabhängiges Autorenarchiv' },
    fr: { title: 'Avertissement Archive Indépendante — Emre Pelit Sci-Phil', desc: 'Statut d’archive d’auteur indépendant (non évalué par des pairs).', heading: 'Avertissement Archive Indépendante' },
  },
  methodology: {
    tr: { title: 'Yöntem, Simülasyon & AI Analiz Metodolojisi — Emre Pelit Sci-Phil', desc: 'Etkileşimli fizik simülasyonları, öngörüsel okuma ve kavramsal modelleme metodolojisi.', heading: 'Bilimsel Modelleme & Metodoloji' },
    en: { title: 'Methodology & Conceptual Simulations — Emre Pelit Sci-Phil', desc: 'Methodology for interactive conceptual physics simulations and editorial essays.', heading: 'Methodology & Conceptual Modeling' },
    es: { title: 'Metodología y Simulación Conceptual — Emre Pelit Sci-Phil', desc: 'Metodología editorial y de simulaciones conceptuales.', heading: 'Metodología y Simulación' },
    de: { title: 'Methodik & Konzeptionelle Simulation — Emre Pelit Sci-Phil', desc: 'Methodik für konzeptionelle Simulationen und Essays.', heading: 'Methodik & Modellierung' },
    fr: { title: 'Méthodologie & Simulation Conceptuelle — Emre Pelit Sci-Phil', desc: 'Méthodologie éditoriale et simulations conceptuelles.', heading: 'Méthodologie & Modélisation' },
  },
};

function detectLang(title = '', body = '') {
  const sample = `${title} ${String(body).slice(0, 800)}`;
  if ((sample.match(/[\u0600-\u06FF]/g) || []).length > 12) return 'ar';
  if ((sample.match(/[\u0400-\u04FF]/g) || []).length > 12) return 'ru';
  if ((sample.match(/[\u3040-\u30FF]/g) || []).length > 6) return 'ja';
  if ((sample.match(/[\uAC00-\uD7AF]/g) || []).length > 6) return 'ko';
  if ((sample.match(/[\u4E00-\u9FFF]/g) || []).length > 12) return 'zh';

  const lower = sample.toLowerCase();
  if (/[ğşıİĞŞ]/.test(sample) || /\b(ve|bir|için|üzerine|nedir|evren|zaman)\b/.test(lower)) return 'tr';
  if (/[äÄß]/.test(sample) || /\b(der|die|das|und|über|warum)\b/.test(lower)) return 'de';
  if (/[¿¡ñÑ]/.test(sample) || /\b(el|la|los|sobre|tiempo|universo)\b/.test(lower)) return 'es';
  if (/[œŒæÆàâêîôùû]/.test(sample) || /\b(le|la|les|pour|sur|temps|univers)\b/.test(lower)) return 'fr';
  if (/\b(the|and|of|universe|time|consciousness)\b/.test(lower)) return 'en';
  return 'tr';
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
  const trMap = {
    'ç': 'c', 'Ç': 'c', 'ğ': 'g', 'Ğ': 'g', 'ı': 'i', 'İ': 'i', 'I': 'i',
    'ö': 'o', 'Ö': 'o', 'ş': 's', 'Ş': 's', 'ü': 'u', 'Ü': 'u',
    'ä': 'ae', 'Ä': 'ae', 'ß': 'ss', 'ñ': 'n', 'Ñ': 'n', 'œ': 'oe', 'æ': 'ae',
  };
  let s = String(title || '').replace(/[çÇğĞıİIöÖşŞüÜäÄßñÑœæ]/g, (c) => trMap[c] || c);
  s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  if (s.length > 75) {
    const cut = s.slice(0, 75);
    const b = cut.replace(/-[^-]*$/, '');
    s = (b.length >= 24 ? b : cut).replace(/-+$/g, '');
  }
  const base = s || String(id || 'article').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return postNumber ? `${base}-${postNumber}` : base;
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
        headers: { Accept: 'application/json', 'User-Agent': 'EmrePelit-SciPhil-SSG/5.1' },
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
      blogTitle: 'Portal de Ciencia y Filosofía • Emre Pelit - Sci-Phil',
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
  return NATIVE_LANGS.map((l) => {
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
    html = html.replace('<div id="root"></div>', `<div id="root">${rootHtml}</div>`);
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

  // 1. Prerender all 316+ article routes with full semantic body content inside <div id="root">
  for (let i = 0; i < snapshot.length; i++) {
    const item = snapshot[i];
    const prevItem = i > 0 ? snapshot[i - 1] : null;
    const nextItem = i + 1 < snapshot.length ? snapshot[i + 1] : null;
    const pageTitle = `${item.title} — Emre Pelit`;
    const desc = item.abstract || `${item.title} — Emre Pelit Sci-Phil Bilim ve Felsefe Arşivi.`;
    const hubPath = item.lang === 'tr' ? '/' : `/${item.lang}/`;
    const archivePath = item.lang === 'tr' ? '/archive' : `/${item.lang}/archive`;

    const blogPostingLd = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: item.title,
      description: desc,
      datePublished: item.publishedAt,
      dateModified: item.publishedAt,
      inLanguage: item.lang,
      image: `${CANONICAL_ORIGIN}/og-card.jpg`,
      mainEntityOfPage: { '@type': 'WebPage', '@id': item.canonicalUrl },
      author: { '@type': 'Person', name: 'Emre Pelit', url: `${CANONICAL_ORIGIN}/` },
      publisher: { '@type': 'Organization', name: 'Emre Pelit — Sci-Phil Bilim, Felsefe ve Simülasyon Arşivi', url: `${CANONICAL_ORIGIN}/` },
      isBasedOn: item.bloggerUrl || undefined,
    };

    const bodyParagraphsHtml = item.paragraphs
      .map((p) => `<p>${escapeHtml(p)}</p>`)
      .join('\n');
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

    const rootHtml = `
<main class="max-w-4xl mx-auto px-6 py-10 space-y-6">
  <nav aria-label="Breadcrumb">
    <a href="${hubPath}">Ana Hub</a> / <a href="${archivePath}">Arşiv</a> / <span>#${item.postNumber}</span>
  </nav>
  <article itemscope itemtype="https://schema.org/BlogPosting">
    <header>
      <div><strong>Emre Pelit</strong> · Bağımsız Yazar Arşivi (Hakemli Dergi Değildir) · ${escapeHtml(item.category)} · ${escapeHtml(item.publishedAt)}</div>
      <h1 itemprop="headline">${escapeHtml(item.title)}</h1>
      <p itemprop="description"><strong>${escapeHtml(desc)}</strong></p>
    </header>
    <div itemprop="articleBody">
      ${bodyParagraphsHtml}
      <p><em>${escapeHtml(`Bu makale ${formattedOpeningDate} tarihinde Mersin'de yazılmıştır.`)}</em></p>
    </div>
    ${findingsHtml}
    <footer>
      <p>Kanonik Adres: <a href="${escapeHtml(item.canonicalUrl)}">${escapeHtml(item.canonicalUrl)}</a></p>
      <nav aria-label="Makale Gezinimi">
        ${prevItem ? `<a href="${escapeHtml(prevItem.canonicalPath)}">← ${escapeHtml(prevItem.title)}</a>` : ''}
        ${nextItem ? `<a href="${escapeHtml(nextItem.canonicalPath)}">${escapeHtml(nextItem.title)} →</a>` : ''}
      </nav>
    </footer>
  </article>
</main>`.trim();

    const hreflangSelf = `    <link rel="alternate" hreflang="${escapeHtml(item.lang)}" href="${escapeHtml(item.canonicalUrl)}" />\n    <link rel="alternate" hreflang="x-default" href="${escapeHtml(item.canonicalUrl)}" />`;

    const html = injectHeadAndRoot(baseHtml, {
      lang: item.lang,
      title: pageTitle,
      description: desc,
      canonicalUrl: item.canonicalUrl,
      ogType: 'article',
      jsonLd: blogPostingLd,
      hreflangBlock: hreflangSelf,
      rootHtml,
    });

    writeHtmlRoute(item.canonicalPath, html);
    generatedHtmlCount += 1;
  }

  // 2. Prerender native language home hubs (/en/, /es/, /de/, /fr/)
  const hubHreflangs = Object.fromEntries(
    NATIVE_LANGS.map((l) => [l, `${CANONICAL_ORIGIN}${LANG_HUB_META[l].path}`])
  );
  for (const lang of NATIVE_LANGS) {
    if (lang === 'tr') continue; // dist/index.html is already TR root
    const meta = LANG_HUB_META[lang];
    const langArticles = snapshot.filter((a) => a.lang === lang).slice(0, 60);
    const listItems = (langArticles.length ? langArticles : snapshot.slice(0, 40))
      .map((a) => `<li><a href="${escapeHtml(a.canonicalPath)}">${escapeHtml(a.title)}</a> <small>(${escapeHtml(a.publishedAt)})</small></li>`)
      .join('\n');

    const rootHtml = `
<main class="max-w-5xl mx-auto px-6 py-10 space-y-6">
  <header>
    <h1>${escapeHtml(meta.h1)}</h1>
    <p>${escapeHtml(meta.desc)}</p>
    <nav aria-label="Languages">
      <a href="/">TR</a> · <a href="/en/">EN</a> · <a href="/es/">ES</a> · <a href="/de/">DE</a> · <a href="/fr/">FR</a> · <a href="/${lang}/archive">${escapeHtml(meta.archiveLabel)}</a>
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

  // 3. Prerender full archive index routes (/archive & /<lang>/archive)
  const archiveHreflangs = Object.fromEntries(
    NATIVE_LANGS.map((l) => [l, `${CANONICAL_ORIGIN}/${l}/archive`])
  );
  const allArchiveListHtml = snapshot
    .map((a) => `<li><a href="${escapeHtml(a.canonicalPath)}">#${a.postNumber} — ${escapeHtml(a.title)}</a> <span>[${escapeHtml(a.lang)}]</span></li>`)
    .join('\n');

  for (const archiveRoute of ['/archive', ...NATIVE_LANGS.map((l) => `/${l}/archive`)]) {
    const routeLang = NATIVE_LANGS.find((l) => archiveRoute.startsWith(`/${l}/`)) || 'tr';
    const meta = LANG_HUB_META[routeLang];
    const canonicalUrl = `${CANONICAL_ORIGIN}${archiveRoute}`;
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

  // 4. Prerender governance routes (/tr|en|es|de|fr/<privacy|kvkk|disclaimer|methodology>)
  for (const [govKey, translations] of Object.entries(GOVERNANCE_PAGES)) {
    const govHreflangs = Object.fromEntries(
      NATIVE_LANGS.map((l) => [l, `${CANONICAL_ORIGIN}/${l}/${govKey}`])
    );
    for (const lang of NATIVE_LANGS) {
      const info = translations[lang];
      const canonicalUrl = `${CANONICAL_ORIGIN}/${lang}/${govKey}`;
      const hubPath = lang === 'tr' ? '/' : `/${lang}/`;
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

  // 5. Emit clean static sitemaps & robots.txt into /dist for pure static hosts
  const todayIso = new Date().toISOString().slice(0, 10);
  const articleUrlsXml = snapshot
    .map(
      (a) =>
        `  <url>\n    <loc>${escapeHtml(a.canonicalUrl)}</loc>\n    <lastmod>${escapeHtml(a.publishedAt || todayIso)}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>`
    )
    .join('\n');

  const sitemapArticlesXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${articleUrlsXml}\n</urlset>\n`;

  const mainPaths = ['/', '/en/', '/es/', '/de/', '/fr/', '/archive', ...NATIVE_LANGS.map((l) => `/${l}/archive`)];
  const mainUrlsXml = mainPaths
    .map(
      (p) =>
        `  <url>\n    <loc>${CANONICAL_ORIGIN}${p}</loc>\n    <lastmod>${todayIso}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>${p === '/' ? '1.0' : '0.9'}</priority>\n  </url>`
    )
    .join('\n');
  const sitemapMainXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${mainUrlsXml}\n</urlset>\n`;

  const sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <sitemap>\n    <loc>${CANONICAL_ORIGIN}/sitemap-main.xml</loc>\n    <lastmod>${todayIso}</lastmod>\n  </sitemap>\n  <sitemap>\n    <loc>${CANONICAL_ORIGIN}/sitemap-articles.xml</loc>\n    <lastmod>${todayIso}</lastmod>\n  </sitemap>\n</sitemapindex>\n`;

  const robotsTxt = `User-agent: *\nAllow: /\n\nSitemap: ${CANONICAL_ORIGIN}/sitemap_index.xml\nSitemap: ${CANONICAL_ORIGIN}/sitemap.xml\nSitemap: ${CANONICAL_ORIGIN}/sitemap-articles.xml\n`;

  fs.writeFileSync(path.join(DIST_DIR, 'sitemap-articles.xml'), sitemapArticlesXml, 'utf-8');
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap-main.xml'), sitemapMainXml, 'utf-8');
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapArticlesXml, 'utf-8');
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap_index.xml'), sitemapIndexXml, 'utf-8');
  fs.writeFileSync(path.join(DIST_DIR, 'robots.txt'), robotsTxt, 'utf-8');

  console.log(
    `[prerender] Complete: ${snapshot.length} snapshot items + ${generatedHtmlCount} static full-body SSG HTML routes + static sitemaps.`
  );
}

run();
