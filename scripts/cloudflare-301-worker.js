/**
 * Cloudflare Edge Worker — Single-Hop HTTP 301 Consolidation for 301 Network
 * Eliminates redirect chains & loops across all satellite nodes:
 *   sci-phi.ai.studio, sci-phil.ai.studio, science-philosophy.ai.studio,
 *   science-philosophy-emre-pelit.ai.studio, emre-pelit-sci-phil.ai.studio,
 *   emrepelit-sci-phi.ai.studio, science-philosophy.grok.me
 */
const CANONICAL_HOST = 'emrepelit-sciphi.ai.studio';
const CANONICAL_ORIGIN = `https://${CANONICAL_HOST}`;
const NATIVE_LANGS = new Set(['tr', 'en', 'es', 'de', 'fr', 'ru', 'ar', 'zh', 'ja', 'pt', 'it', 'ko']);

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const host = url.hostname.toLowerCase();

    // 1. Strip redundant prefix /science-philosophy/* cleanly in the same hop
    let targetPath = url.pathname;
    if (targetPath.startsWith('/science-philosophy')) {
      targetPath = targetPath.replace(/^\/science-philosophy\/?/, '/') || '/';
    }

    // 2. Resolve ?lang=<code> cleanly in the same hop without a second redirect
    const qLang = (url.searchParams.get('lang') || '').trim().toLowerCase();
    const qArticle = (url.searchParams.get('article') || '').trim();
    if (!qArticle && NATIVE_LANGS.has(qLang) && (targetPath === '/' || targetPath === '')) {
      targetPath = qLang === 'tr' ? '/' : `/${qLang}/`;
      url.searchParams.delete('lang');
    }

    const cleanQuery = url.searchParams.toString();
    const destination = `${CANONICAL_ORIGIN}${targetPath}${cleanQuery ? `?${cleanQuery}` : ''}`;

    // 3. Always issue single-hop HTTP 301 permanent redirect for satellite domains or legacy paths
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
