import { Article, LanguageCode } from '../types';

export const LANG_ARTICLE_SEGMENT: Record<LanguageCode, string> = {
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

export const ALL_ARTICLE_ROUTE_SEGMENTS: string[] = [
  'makale',
  'article',
  'articles',
  'articulo',
  'artikel',
  'statya',
  'maqal',
  'wenzhang',
  'ronbun',
  'artigo',
  'articolo',
  'nonmun',
];

export function getArticleSegmentForLang(lang: LanguageCode): string {
  return LANG_ARTICLE_SEGMENT[lang] || 'article';
}

export function getLocalizedArticlePath(lang: LanguageCode, slug: string): string {
  const seg = getArticleSegmentForLang(lang);
  return `/${lang}/${seg}/${slug}`;
}

export function detectEntrySourceLanguage(title: string, bodyText: string): LanguageCode {
  const sample = `${title || ''} ${(bodyText || '').slice(0, 1000)}`;
  const lower = sample.toLowerCase();

  // 1. Distinct non-Latin script detection first
  const arMatches = (sample.match(/[\u0600-\u06FF]/g) || []).length;
  if (arMatches > 12) return 'ar';

  const ruMatches = (sample.match(/[\u0400-\u04FF]/g) || []).length;
  if (ruMatches > 12) return 'ru';

  const jaMatches = (sample.match(/[\u3040-\u30FF]/g) || []).length;
  if (jaMatches > 6) return 'ja';

  const koMatches = (sample.match(/[\uAC00-\uD7AF]/g) || []).length;
  if (koMatches > 6) return 'ko';

  const zhMatches = (sample.match(/[\u4E00-\u9FFF]/g) || []).length;
  if (zhMatches > 12 && jaMatches === 0) return 'zh';

  // 2. Latin-script language scoring using unique diacritics + tokenized stopwords
  const scores: Record<'tr' | 'en' | 'es' | 'de' | 'fr' | 'pt' | 'it', number> = {
    tr: 0,
    en: 0,
    es: 0,
    de: 0,
    fr: 0,
    pt: 0,
    it: 0,
  };

  scores.tr += (sample.match(/[ğşıİĞŞ]/g) || []).length * 16;
  scores.de += (sample.match(/[äÄß]/g) || []).length * 16;
  scores.es += (sample.match(/[¿¡ñÑ]/g) || []).length * 16;
  scores.pt += (sample.match(/[ãõÃÕ]/g) || []).length * 16;
  scores.fr += (sample.match(/[œŒæÆàâêîôùûÀÂÊÎÔÙÛçÇ]/g) || []).length * 6;
  scores.it += (sample.match(/[ìòÌÒ]/g) || []).length * 6;

  const stopWords: Record<'tr' | 'en' | 'es' | 'de' | 'fr' | 'pt' | 'it', Set<string>> = {
    tr: new Set([
      've', 'bir', 'bu', 'için', 'ile', 'olan', 'olarak', 'gibi', 'daha', 'değil',
      'ancak', 'fakat', 'üzerine', 'nedir', 'neden', 'kadar', 'mi', 'mı', 'mu', 'mü',
      'evren', 'zaman', 'bilinç', 'gerçek', 'yoksa', 'var', 'yok', 'veya', 'ama',
    ]),
    en: new Set([
      'the', 'and', 'of', 'to', 'in', 'is', 'that', 'it', 'for', 'as', 'with',
      'on', 'this', 'are', 'not', 'but', 'from', 'by', 'or', 'we', 'be', 'what',
      'when', 'why', 'how', 'an', 'universe', 'time', 'consciousness',
    ]),
    es: new Set([
      'el', 'la', 'los', 'las', 'de', 'del', 'en', 'un', 'una', 'que', 'por',
      'para', 'con', 'como', 'sobre', 'más', 'pero', 'entre', 'desde', 'todo',
      'cuando', 'qué', 'si', 'es', 'son', 'tiempo', 'universo',
    ]),
    de: new Set([
      'der', 'die', 'das', 'und', 'in', 'von', 'zu', 'mit', 'auf', 'für', 'ist',
      'ein', 'eine', 'nicht', 'als', 'auch', 'des', 'dem', 'den', 'sich', 'über',
      'wie', 'oder', 'zeit', 'universum', 'bewusstsein', 'warum',
    ]),
    fr: new Set([
      'le', 'la', 'les', 'de', 'des', 'du', 'un', 'une', 'et', 'dans', 'pour',
      'que', 'qui', 'est', 'en', 'par', 'sur', 'avec', 'plus', 'pas', 'ce',
      'cette', 'nous', 'vous', 'mais', 'comme', 'temps', 'univers', 'conscience',
      'si', 'qu', 'jusqu',
    ]),
    pt: new Set([
      'o', 'a', 'os', 'as', 'do', 'da', 'dos', 'das', 'em', 'um', 'uma', 'para',
      'com', 'não', 'como', 'mais', 'mas', 'sobre', 'entre', 'tempo',
    ]),
    it: new Set([
      'il', 'lo', 'la', 'gli', 'le', 'di', 'del', 'della', 'nel', 'nella', 'con',
      'per', 'che', 'non', 'come', 'più', 'tempo', 'universo', 'coscienza',
    ]),
  };

  const words = lower.match(/[\p{L}]+/gu) || [];
  for (const w of words) {
    (Object.keys(stopWords) as (keyof typeof stopWords)[]).forEach((langKey) => {
      if (stopWords[langKey].has(w)) {
        scores[langKey] += 5;
      }
    });
  }

  let bestLang: LanguageCode = 'tr';
  let bestScore = -1;
  (Object.keys(scores) as (keyof typeof scores)[]).forEach((langKey) => {
    if (scores[langKey] > bestScore) {
      bestScore = scores[langKey];
      bestLang = langKey;
    }
  });

  return bestScore > 0 ? bestLang : 'tr';
}

const CONCEPT_GROUPS: RegExp[] = [
  /prophet|peygamber|profeta|prophète|resul|nebî|nebi/i,
  /past|geçmiş|pasado|passé|vergangen/i,
  /alien|uzaylı|extraterrestre|außerirdisch/i,
  /destiny|kader|destino|schicksal|destin/i,
  /llm|artificial intelligence|yapay zeka|inteligencia artificial|künstliche intelligenz|intelligence artificielle/i,
  /brain|beyin|cerebro|cerveau|gehirn|neural|nöro/i,
  /universe|evren|universo|universum|univers/i,
  /time|zaman|tiempo|temps|zeit/i,
  /higgs/i,
  /kuran|quran|koran|coran|kur'an/i,
  /quantum|kuantum|cuántic|quanten|quantique/i,
  /black hole|kara delik|agujero negro|trou noir|schwarze/i,
  /entrop/i,
  /conscious|bilinç|şuur|consciencia|bewusstsein|conscience/i,
  /creat|yarat|creación|schöpfung|création/i,
  /god|tanrı|allah|dios|dieu|gott/i,
  /monoton|tekdüze|silikon|silicon/i,
  /simulation|simülasyon|simulación|simul/i,
  /math|matematik|matemát|mathém/i,
  /observ|gözlemci|observateur|beobachter/i,
  /determin|özgür irade|free will|libre arbitre|freier wille/i,
  /light|ışık|luz|lumière|licht|photon|foton/i,
  /memory|hafıza|bellek|memoria|mémoire|gedächtnis/i,
  /life|hayat|yaşam|vida|vie|leben|ölüm|death|muerte|mort|tod/i,
  /relig|din|inanç|faith|religión|religion|belief/i,
  /hologra/i,
  /gravity|yerçekim|kütleçekim|gravedad|gravité|gravitation/i,
  /evolu|evrim|evolución|évolution/i,
];

function extractConceptSet(title: string, bodySnippet: string): Set<number> {
  const txt = `${title || ''} ${(bodySnippet || '').slice(0, 300)}`;
  const matched = new Set<number>();
  CONCEPT_GROUPS.forEach((re, idx) => {
    if (re.test(txt)) {
      matched.add(idx);
    }
  });
  return matched;
}

export interface ArticleWorkCluster {
  clusterId: string;
  byLang: Partial<Record<LanguageCode, Article>>;
  articles: Article[];
}

export function buildArticleWorkClusters(articles: Article[]): {
  clusterByArticleId: Record<string, ArticleWorkCluster>;
  clusters: ArticleWorkCluster[];
  distinctWorkCount: number;
} {
  const clusters: ArticleWorkCluster[] = [];
  const clusterConcepts: Set<number>[] = [];
  const clusterDates: number[] = [];
  const clusterByArticleId: Record<string, ArticleWorkCluster> = {};

  articles.forEach((article) => {
    const lang: LanguageCode = article.sourceLang || 'tr';
    const titleStr = article.title[lang] || article.title.tr || Object.values(article.title)[0] || '';
    const absStr = article.abstract[lang] || article.abstract.tr || Object.values(article.abstract)[0] || '';
    const concepts = extractConceptSet(titleStr, absStr);
    const pubMs = new Date(article.publishedAt).getTime() || 0;

    let bestClusterIdx = -1;
    let bestScore = -1;

    // Look back up to 6 most recent clusters to match multilingual translations of the same essay
    const lookbackStart = Math.max(0, clusters.length - 6);
    for (let j = clusters.length - 1; j >= lookbackStart; j--) {
      if (clusters[j].byLang[lang]) continue;
      const daysDiff = Math.abs(clusterDates[j] - pubMs) / (86400 * 1000);
      if (daysDiff > 3.5) continue;

      let sharedConcepts = 0;
      concepts.forEach((cIdx) => {
        if (clusterConcepts[j].has(cIdx)) sharedConcepts++;
      });
      const sameDay = daysDiff < 1.1 ? 1 : 0;

      if (sharedConcepts >= 1 || sameDay === 1) {
        const score = sharedConcepts * 10 + sameDay - daysDiff * 2;
        if (score > bestScore) {
          bestScore = score;
          bestClusterIdx = j;
        }
      }
    }

    if (bestClusterIdx >= 0) {
      const targetCluster = clusters[bestClusterIdx];
      targetCluster.byLang[lang] = article;
      targetCluster.articles.push(article);
      concepts.forEach((cIdx) => clusterConcepts[bestClusterIdx].add(cIdx));
      clusterByArticleId[article.id] = targetCluster;
    } else {
      const newCluster: ArticleWorkCluster = {
        clusterId: `work-${clusters.length + 1}`,
        byLang: { [lang]: article },
        articles: [article],
      };
      clusters.push(newCluster);
      clusterConcepts.push(concepts);
      clusterDates.push(pubMs);
      clusterByArticleId[article.id] = newCluster;
    }
  });

  return {
    clusterByArticleId,
    clusters,
    distinctWorkCount: clusters.length,
  };
}

export interface CorpusCountMetrics {
  distinctOriginalCount: number;
  multilingualTextsCount: number;
  totalDirectoryCount: number;
}

export function computeCorpusCountMetrics(
  articles: Article[],
  extraGrokCount = 3
): CorpusCountMetrics {
  const { distinctWorkCount } = buildArticleWorkClusters(articles);
  const multilingualTextsCount = Math.max(316, articles.length);
  const distinctOriginalCount = distinctWorkCount > 0 ? distinctWorkCount : 288;
  return {
    distinctOriginalCount,
    multilingualTextsCount,
    totalDirectoryCount: multilingualTextsCount + extraGrokCount,
  };
}

