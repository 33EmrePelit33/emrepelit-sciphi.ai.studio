/**
 * Cloudflare Edge Worker — Stage 1 CORS Blogger Proxy + Stage 6 Single-Hop HTTP 301 Consolidation
 * Eliminates browser CORS failures on feeds/posts/default?alt=json and enforces server-level HTTP 301
 * across all 8 retired legacy domains straight to https://emrepelit-sciphi.ai.studio:
 *   sci-phi.ai.studio, sci-phil.ai.studio, science-philosophy.ai.studio,
 *   science-philosophy-emre-pelit.ai.studio, emre-pelit-sci-phil.ai.studio,
 *   emrepelit-sci-phi.ai.studio, science-philosophy.grok.me, emrepelit.github.io/science-philosophy
 */
const CANONICAL_HOST = 'emrepelit-sciphi.ai.studio';
const CANONICAL_ORIGIN = `https://${CANONICAL_HOST}`;
const BLOGGER_ORIGIN = 'https://emrepelit7337.blogspot.com';
const NATIVE_LANGS = new Set(['tr', 'en', 'es', 'de', 'fr', 'ru', 'ar', 'zh', 'ja', 'pt', 'it', 'ko']);
const LANG_SEGMENT = {
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

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const host = url.hostname.toLowerCase();

    // Stage 1: CORS-free server-side Blogger feed proxy (/api/blogger-proxy)
    if (url.pathname === '/api/blogger-proxy') {
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        });
      }
      const startIndex = url.searchParams.get('start-index') || '1';
      const maxResults = url.searchParams.get('max-results') || '150';
      const upstream = `${BLOGGER_ORIGIN}/feeds/posts/default?alt=json&start-index=${encodeURIComponent(startIndex)}&max-results=${encodeURIComponent(maxResults)}`;
      const upstreamRes = await fetch(upstream, { cf: { cacheTtl: 60 } });
      const body = await upstreamRes.text();
      return new Response(body, {
        status: upstreamRes.status,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=60',
          'X-Canonical-Hub': CANONICAL_ORIGIN,
        },
      });
    }

    // 1. Strip legacy /science-philosophy/* prefix in the same hop
    let targetPath = url.pathname;
    if (targetPath.startsWith('/science-philosophy')) {
      targetPath = targetPath.replace(/^\/science-philosophy\/?/, '/') || '/';
    }

    // 2. Resolve ?article=blogger-<id> via live blogger-301.json lookup if deployed on Main Hub
    const qLang = (url.searchParams.get('lang') || '').trim().toLowerCase();
    const qArticle = (url.searchParams.get('article') || '').trim();
    if (qArticle) {
      const targetLang = NATIVE_LANGS.has(qLang) ? qLang : 'tr';
      try {
        const mapRes = await fetch(`${CANONICAL_ORIGIN}/blogger-301.json`, { cf: { cacheTtl: 300 } });
        if (mapRes.ok) {
          const mapData = await mapRes.json();
          const normalizedId = qArticle.replace(/^blogger-/, '');
          const hit = (mapData.rules || []).find(
            (r) => r.id === qArticle || r.bloggerPostId === normalizedId || r.slug === qArticle
          );
          if (hit) {
            const localized = (hit.localizedUrls && hit.localizedUrls[targetLang]) || hit.canonicalUrl;
            return new Response(null, {
              status: 301,
              headers: {
                Location: localized,
                'Cache-Control': 'public, max-age=86400',
                'X-Canonical-Hub': CANONICAL_ORIGIN,
              },
            });
          }
        }
      } catch {
        // Fall back to direct destination pass-through
      }
    }

    // 3. Resolve ?lang=<code> cleanly in the same hop without a second redirect
    if (!qArticle && NATIVE_LANGS.has(qLang) && (targetPath === '/' || targetPath === '')) {
      targetPath = qLang === 'tr' ? '/' : `/${qLang}/`;
      url.searchParams.delete('lang');
    }

    // Normalize legacy /yazi/<slug> -> /tr/makale/<slug>
    if (targetPath.startsWith('/yazi/')) {
      targetPath = `/tr/${LANG_SEGMENT.tr}/${targetPath.slice('/yazi/'.length)}`;
    }

    const cleanQuery = url.searchParams.toString();
    const destination = `${CANONICAL_ORIGIN}${targetPath}${cleanQuery ? `?${cleanQuery}` : ''}`;

    // 4. Single-hop HTTP 301 permanent redirect for any non-canonical host or legacy path
    if (host !== CANONICAL_HOST || destination !== request.url) {
      return new Response(null, {
        status: 301,
        headers: {
          Location: destination,
          'Cache-Control': 'public, max-age=86400',
          'X-Canonical-Hub': CANONICAL_ORIGIN,
        },
      });
    }

    return fetch(request);
  },
};
