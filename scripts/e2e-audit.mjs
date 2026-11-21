#!/usr/bin/env node
/**
 * G6: Automated End-to-End (E2E) SEO, 12-Language SSR, FAQPage Schema & Accessibility Verification Suite
 * Run: npm run test:e2e
 */

const BASE_URL = (process.env.E2E_BASE_URL || 'http://127.0.0.1:3000').replace(/\/+$/, '');
const LANGUAGES = ['tr', 'en', 'es', 'de', 'fr', 'ru', 'ar', 'zh', 'ja', 'pt', 'it', 'ko'];

let passed = 0;
let failed = 0;
const failures = [];

function assertCheck(name, condition, detail = '') {
  if (condition) {
    passed += 1;
    console.log(`  [PASS] ${name}${detail ? ` (${detail})` : ''}`);
  } else {
    failed += 1;
    failures.push(`${name}${detail ? `: ${detail}` : ''}`);
    console.error(`  [FAIL] ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

async function fetchText(path) {
  const res = await fetch(`${BASE_URL}${path}`, { redirect: 'follow' });
  const text = await res.text();
  return { status: res.status, headers: res.headers, text };
}

async function fetchJson(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  const json = await res.json().catch(() => null);
  return { status: res.status, json };
}

async function run() {
  console.log(`\n=== E2E SEO, 12-Language SSR & Accessibility Audit (${BASE_URL}) ===\n`);

  // 1. Root HTML SEO & Accessibility Audit
  console.log('1. Root HTML, Meta Length & Accessibility');
  const root = await fetchText('/');
  assertCheck('Root / returns HTTP 200', root.status === 200, `status=${root.status}`);
  const titleMatch = root.text.match(/<title>([^<]+)<\/title>/i);
  const titleLen = titleMatch ? titleMatch[1].trim().length : 0;
  assertCheck('Root <title> exists and is concise (20–85 chars)', titleLen >= 20 && titleLen <= 85, `len=${titleLen}`);
  const descMatch = root.text.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
  const descLen = descMatch ? descMatch[1].trim().length : 0;
  assertCheck('Root meta description exists (100–170 chars)', descLen >= 100 && descLen <= 170, `len=${descLen}`);
  assertCheck('OpenGraph og:title & og:description present', root.text.includes('property="og:title"') && root.text.includes('property="og:description"'));
  assertCheck('Native dark/light color-scheme meta present', root.text.includes('name="color-scheme"'));
  assertCheck('HTML lang attribute present for accessibility', /<html[^>]+lang="/i.test(root.text));

  // 2. All 12 Language Roots
  console.log('\n2. All 12 Language Routes');
  const langChecks = await Promise.all(
    LANGUAGES.map(async (lang) => {
      const target = lang === 'tr' ? '/' : `/${lang}/`;
      const res = await fetchText(target);
      return { lang, status: res.status, hasHtml: res.text.includes('<!doctype html') || res.text.includes('<html') };
    })
  );
  for (const lc of langChecks) {
    assertCheck(`Language route /${lc.lang}/ returns HTTP 200 HTML`, lc.status === 200 && lc.hasHtml, `status=${lc.status}`);
  }

  // 3. Discovery & Sitemap Feeds
  console.log('\n3. Sitemaps, RSS, Atom & Robots');
  for (const endpoint of [
    '/sitemap_index.xml',
    '/sitemap-12-languages.xml',
    '/sitemap-turkish-12-languages.xml',
    '/rss.xml',
    '/atom.xml',
    '/robots.txt',
    '/google5d3436c931b6024c.html',
    '/emrepelit7337indexnow.txt',
  ]) {
    const r = await fetchText(endpoint);
    assertCheck(`${endpoint} returns HTTP 200 non-empty`, r.status === 200 && r.text.trim().length > 10, `bytes=${r.text.length}`);
  }

  // 4. Multilingual SSR Article FAQPage JSON-LD & Microdata Verification
  console.log('\n4. Multilingual Article SSR FAQPage JSON-LD & Schema Microdata');
  const sm12 = await fetchText('/sitemap-12-languages.xml');
  const sampleEnMatch = sm12.text.match(/https?:\/\/[^<"]+(\/en\/article\/[^<"]+)/);
  const sampleEnPath = sampleEnMatch ? sampleEnMatch[1] : '/en/article/the-fundamental-difference-between-a-qpu-and-the-heart-318';
  const sampleSlug = sampleEnPath.replace(/^\/en\/article\//, '');

  for (const lang of ['en', 'tr', 'de', 'ja', 'ar']) {
    const artRes = await fetchText(`/${lang}/article/${sampleSlug}`);
    const hasFaqJsonLd = artRes.text.includes('"@type":"FAQPage"');
    const hasFaqMicrodata = artRes.text.includes('itemtype="https://schema.org/FAQPage"');
    const hasBlogPosting = artRes.text.includes('"@type":"BlogPosting"');
    assertCheck(
      `SSR /${lang}/article/${sampleSlug.slice(0, 32)}… has FAQPage JSON-LD + Microdata + BlogPosting`,
      artRes.status === 200 && hasFaqJsonLd && hasFaqMicrodata && hasBlogPosting,
      `status=${artRes.status}`
    );
  }

  // 5. G1, G2, G3 & G4 API Health Checks
  console.log('\n5. Backend API Health (G1 Translation Cache, G2 SMTP Status, G3 Webmaster API, G4 Auth Guard)');
  const cacheStats = await fetchJson('/api/ai/translation-cache/stats');
  assertCheck(
    'G1 /api/ai/translation-cache/stats responds with 12 languages',
    cacheStats.status === 200 && cacheStats.json?.success === true && cacheStats.json?.supportedLanguagesCount === 12
  );

  const ownerStatus = await fetchJson('/api/security/owner-status');
  assertCheck(
    'G2 /api/security/owner-status reports valid SMTP provider state',
    ownerStatus.status === 200 && typeof ownerStatus.json?.smtpProvider === 'string'
  );

  const webmaster = await fetchJson('/api/indexing/webmaster-live');
  assertCheck(
    'G3 /api/indexing/webmaster-live returns GSC + Bing Webmaster status',
    webmaster.status === 200 &&
      webmaster.json?.success === true &&
      Boolean(webmaster.json?.googleSearchConsole) &&
      Boolean(webmaster.json?.bingWebmaster)
  );

  const unauthBookmarks = await fetchJson('/api/user/bookmarks');
  assertCheck(
    'G4 /api/user/bookmarks enforces Firebase Auth (returns HTTP 401 without token)',
    unauthBookmarks.status === 401,
    `status=${unauthBookmarks.status}`
  );

  // 6. KVKK (Law No. 6698) & EU GDPR (2016/679) Compliance Audit
  console.log('\n6. KVKK (6698) & EU GDPR (2016/679) Compliance Checks');
  assertCheck(
    'Root HTML contains NO pre-consent fonts.googleapis.com stylesheet link (GDPR IP isolation)',
    !root.text.includes('fonts.googleapis.com/css2')
  );
  const permPolicy = root.headers.get('permissions-policy') || '';
  const refPolicy = root.headers.get('referrer-policy') || '';
  assertCheck(
    'Privacy HTTP headers include Permissions-Policy (interest-cohort=()) & Referrer-Policy',
    permPolicy.includes('interest-cohort=()') && refPolicy.includes('strict-origin-when-cross-origin')
  );

  const manifest = await fetchJson('/api/privacy/compliance-manifest');
  assertCheck(
    'GET /api/privacy/compliance-manifest returns KVKK + GDPR metadata',
    manifest.status === 200 &&
      manifest.json?.success === true &&
      manifest.json?.privacyByDesign?.preConsentThirdPartyFontsBlocked === true &&
      manifest.json?.privacyByDesign?.gpcAndDntHonored === true &&
      manifest.json?.privacyByDesign?.thirdPartyRelayPiiMinimized === true
  );

  const unauthExport = await fetchJson('/api/privacy/export-my-data');
  assertCheck(
    'GET /api/privacy/export-my-data enforces auth (returns HTTP 401 without token)',
    unauthExport.status === 401,
    `status=${unauthExport.status}`
  );

  const unauthDelete = await fetchJson('/api/privacy/delete-my-data', { method: 'DELETE' });
  assertCheck(
    'DELETE /api/privacy/delete-my-data enforces auth (returns HTTP 401 without token)',
    unauthDelete.status === 401,
    `status=${unauthDelete.status}`
  );

  const ssrKvkk = await fetchText('/tr/kvkk');
  assertCheck(
    'SSR /tr/kvkk returns HTTP 200 with KVKK (6698) & GDPR disclosures',
    ssrKvkk.status === 200 && ssrKvkk.text.includes('6698') && ssrKvkk.text.includes('GDPR'),
    `status=${ssrKvkk.status}`
  );

  const ssrPrivacyEn = await fetchText('/en/privacy');
  assertCheck(
    'SSR /en/privacy returns HTTP 200 with GDPR (2016/679) & KVKK disclosures',
    ssrPrivacyEn.status === 200 &&
      ssrPrivacyEn.text.includes('GDPR') &&
      ssrPrivacyEn.text.includes('6698'),
    `status=${ssrPrivacyEn.status}`
  );

  // E2: Server-side KVKK/GDPR explicit consent enforcement on Q&A POST endpoints
  const qaNoConsent = await fetchJson('/api/ai/article-qa', {
    method: 'POST',
    body: JSON.stringify({ question: 'Test question without consent' }),
  });
  assertCheck(
    'E2 POST /api/ai/article-qa enforces server-side kvkkConsentAccepted === true (HTTP 400 without consent)',
    qaNoConsent.status === 400 && qaNoConsent.json?.requiresKvkkConsent === true,
    `status=${qaNoConsent.status}`
  );

  const escalateNoConsent = await fetchJson('/api/qa/escalate-email', {
    method: 'POST',
    body: JSON.stringify({ question: 'Test escalation without consent', askerEmail: 'reader@example.com' }),
  });
  assertCheck(
    'E2 POST /api/qa/escalate-email enforces server-side kvkkConsentAccepted === true (HTTP 400 without consent)',
    escalateNoConsent.status === 400 && escalateNoConsent.json?.requiresKvkkConsent === true,
    `status=${escalateNoConsent.status}`
  );

  // E4: Built-in HTTP gzip/brotli compression check
  const compRes = await fetch(`${BASE_URL}/api/privacy/compliance-manifest`, {
    headers: { 'Accept-Encoding': 'gzip, br' },
  });
  const contentEncoding = compRes.headers.get('content-encoding') || '';
  assertCheck(
    'E4 Server supports HTTP gzip/brotli response compression on large JSON/HTML payloads',
    compRes.status === 200 && /^(gzip|br)$/i.test(contentEncoding),
    `encoding=${contentEncoding || 'none'}`
  );

  console.log(`\n=== Summary: ${passed} passed, ${failed} failed ===`);
  if (failed > 0) {
    console.error('Failed checks:', failures);
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('E2E Audit crashed:', err);
  process.exit(1);
});
