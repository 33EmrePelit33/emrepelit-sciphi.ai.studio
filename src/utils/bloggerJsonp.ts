/**
 * CORS-Free Browser JSONP Client for Blogger Feeds (`alt=json-in-script`)
 * Eliminates browser CORS failures and false "Çevrimdışı Mod" fallbacks when syncing
 * emrepelit7337.blogspot.com directly from the browser on emrepelit-sciphi.ai.studio.
 */

export interface JsonpBloggerEntry {
  id: string;
  bloggerPostId: string;
  postNumber: number;
  title: string;
  publishedAt: string;
  publishedIso: string;
  updatedIso: string;
  bloggerUrl: string;
  abstract: string;
  paragraphs: string[];
  keyFindings: string[];
  imageUrl?: string | null;
}

export interface JsonpBloggerSyncResult {
  blogTitle: string;
  blogUrl: string;
  totalResults: number;
  entries: JsonpBloggerEntry[];
}

function decodeHtmlEntitiesBasic(input: string): string {
  return String(input || '')
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => {
      const cp = parseInt(hex, 16);
      return Number.isFinite(cp) && cp > 0 ? String.fromCodePoint(cp) : '';
    })
    .replace(/&#(\d+);/g, (_, dec) => {
      const cp = parseInt(dec, 10);
      return Number.isFinite(cp) && cp > 0 ? String.fromCodePoint(cp) : '';
    })
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&mdash;/gi, '—')
    .replace(/&ndash;/gi, '–')
    .replace(/&hellip;/gi, '…')
    .replace(/&lsquo;/gi, '‘')
    .replace(/&rsquo;/gi, '’')
    .replace(/&ldquo;/gi, '“')
    .replace(/&rdquo;/gi, '”');
}

function stripHtmlPreserveParagraphs(html: string): string {
  const withBreaks = String(html || '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<\/(?:p|div|h[1-6]|li|blockquote|tr|section|article|pre)>/gi, '\n\n')
    .replace(/<br\s*\/?>\s*<br\s*\/?>/gi, '\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ');
  return decodeHtmlEntitiesBasic(withBreaks)
    .replace(/\r\n?/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function loadJsonpPage(feedUrl: string, timeoutMs = 5000): Promise<any> {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined') {
      reject(new Error('JSONP requires a browser DOM'));
      return;
    }

    const cbName = `__sciphilBloggerJsonp_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
    const script = document.createElement('script');
    let settled = false;

    const cleanup = () => {
      try {
        delete (window as any)[cbName];
      } catch {
        (window as any)[cbName] = undefined;
      }
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };

    const timer = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error('Blogger JSONP request timed out'));
    }, timeoutMs);

    (window as any)[cbName] = (payload: any) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      cleanup();
      resolve(payload);
    };

    script.src = `${feedUrl}${feedUrl.includes('?') ? '&' : '?'}callback=${encodeURIComponent(cbName)}`;
    script.async = true;
    script.onerror = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      cleanup();
      reject(new Error('Blogger JSONP script load failed'));
    };

    (document.head || document.body || document.documentElement).appendChild(script);
  });
}

export async function fetchBloggerFeedViaJsonp(
  blogUrl = 'https://emrepelit7337.blogspot.com',
  maxPages = 5
): Promise<JsonpBloggerSyncResult> {
  const cleanBase = blogUrl.replace(/\/+$/, '');
  const pageSize = 150;
  const collected: any[] = [];
  let totalResults = 0;
  let blogTitle = 'Emre Pelit — Sci-Phil Bilim, Felsefe ve Simülasyon Arşivi';

  for (let page = 0; page < maxPages; page++) {
    const startIndex = page * pageSize + 1;
    let payload: any = null;
    if (typeof window !== 'undefined') {
      const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timeoutId = controller ? window.setTimeout(() => controller.abort(), 5000) : null;
      try {
        const proxyRes = await fetch(
          `/api/blogger-proxy?alt=json&start-index=${startIndex}&max-results=${pageSize}`,
          controller ? { signal: controller.signal } : undefined
        );
        if (proxyRes.ok) {
          payload = await proxyRes.json();
        }
      } catch {
        // Fall through to cross-origin JSONP fallback on timeout or network error
      } finally {
        if (timeoutId !== null) window.clearTimeout(timeoutId);
      }
    }
    if (!payload) {
      const feedUrl = `${cleanBase}/feeds/posts/default?alt=json-in-script&start-index=${startIndex}&max-results=${pageSize}`;
      payload = await loadJsonpPage(feedUrl, 5000);
    }
    const feed = payload?.feed;
    if (!feed) break;

    if (page === 0) {
      totalResults = Number(feed?.openSearch$totalResults?.$t || 0);
      blogTitle = String(feed?.title?.$t || blogTitle);
    }

    const rawEntries = Array.isArray(feed?.entry) ? feed.entry : [];
    if (rawEntries.length === 0) break;

    collected.push(...rawEntries);
    if (totalResults > 0 && collected.length >= totalResults) break;
    if (rawEntries.length < pageSize) break;
  }

  const totalCount = Math.max(totalResults, collected.length);
  const entries: JsonpBloggerEntry[] = collected.map((raw, idx) => {
    const rawIdText = String(raw?.id?.$t || '');
    const postMatch = rawIdText.match(/post-(\d+)/);
    const bloggerPostId = postMatch ? postMatch[1] : `${Date.now()}${idx}`;
    const title = String(raw?.title?.$t || `Emre Pelit Makale #${totalCount - idx}`).trim();
    const publishedIso = String(raw?.published?.$t || new Date().toISOString());
    const updatedIso = String(raw?.updated?.$t || publishedIso);
    const altLink = Array.isArray(raw?.link)
      ? raw.link.find((l: any) => l?.rel === 'alternate')?.href
      : undefined;
    const rawHtml = String(raw?.content?.$t || raw?.summary?.$t || title);
    const structuredPlain = stripHtmlPreserveParagraphs(rawHtml);
    const rawBlocks = structuredPlain
      .split(/\n{2,}/)
      .map((b) => b.replace(/\s+/g, ' ').trim())
      .filter((b) => b.length > 0);
    let paragraphs: string[] = [];
    if (rawBlocks.length >= 2) {
      paragraphs = rawBlocks;
    } else {
      const flatText = structuredPlain.replace(/\s+/g, ' ').trim();
      const splitParas = flatText
        .split(/(?<=[.!?])\s+(?=[A-ZÇĞİÖŞÜ0-9"“])/)
        .reduce<string[]>((acc, sentence) => {
          const last = acc[acc.length - 1];
          if (!last || last.length > 360) {
            acc.push(sentence);
          } else {
            acc[acc.length - 1] = `${last} ${sentence}`;
          }
          return acc;
        }, [])
        .filter(Boolean);
      paragraphs = splitParas.length > 0 ? splitParas : [flatText || title];
    }

    const flatForAbstract = paragraphs.join(' ');
    const abstract = flatForAbstract.slice(0, 480) + (flatForAbstract.length > 480 ? '...' : '');

    return {
      id: `blogger-${bloggerPostId}`,
      bloggerPostId,
      postNumber: Math.max(1, totalCount - idx),
      title,
      publishedAt: publishedIso.slice(0, 10),
      publishedIso,
      updatedIso,
      bloggerUrl: altLink || `${cleanBase}/?m=1`,
      abstract,
      paragraphs,
      keyFindings: paragraphs.slice(0, 3).map((p) => p.slice(0, 220)),
      imageUrl: raw?.media$thumbnail?.url || null,
    };
  });

  return {
    blogTitle,
    blogUrl: cleanBase,
    totalResults: Math.max(totalCount, entries.length),
    entries,
  };
}
