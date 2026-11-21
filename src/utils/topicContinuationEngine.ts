import type { Article, LanguageCode } from '../types';
import { getLocalizedText, getLocalizedArray } from '../i18n/translations';
import { detectEntrySourceLanguage, buildArticleWorkClusters } from './articleLocale';

export interface TopicDomainDef {
  id: string;
  orderNumber: string;
  labelTr: string;
  labelEn: string;
  shortLabelTr: string;
  shortLabelEn: string;
  color: string;
  descriptionTr: string;
  descriptionEn: string;
  keywords: RegExp;
  categoryBoost?: RegExp;
  simTypeBoost?: string[];
}

export interface SubConceptDef {
  id: string;
  topicId: string;
  labelTr: string;
  labelEn: string;
  keywords: RegExp;
}

export type ConceptualStageId = 1 | 2 | 3 | 4;

export interface OrderedContinuationItem {
  sequenceNumber: number;
  article: Article;
  topicId: string;
  stage: ConceptualStageId;
  stageLabelTr: string;
  stageLabelEn: string;
  matchedSubConceptIds: string[];
  matchedSubConceptLabels: string[];
  continuityPercentWithPrev: number | null;
  bridgeSubConcepts: string[];
  bridgeKeywords: string[];
  transitionReasonTr: string;
  transitionReasonEn: string;
}

export interface TopicClusterResult {
  topic: TopicDomainDef;
  orderedItems: OrderedContinuationItem[];
  totalReadMinutes: number;
  subConceptCounts: Record<string, number>;
  topBridgedTopics: Array<{
    topicId: string;
    labelTr: string;
    labelEn: string;
    color: string;
    sharedWeight: number;
    sharedSubConcepts: string[];
  }>;
}

export interface TopicConceptAtlasResult {
  scopedArticlesCount: number;
  topics: TopicClusterResult[];
  subConcepts: Array<
    SubConceptDef & {
      color: string;
      articleIds: string[];
      count: number;
    }
  >;
  topicEdges: Array<{
    sourceId: string;
    targetId: string;
    weight: number;
    sharedSubConcepts: string[];
  }>;
  subConceptEdges: Array<{
    sourceId: string;
    targetId: string;
    weight: number;
  }>;
}

export const TOPIC_DOMAINS: TopicDomainDef[] = [
  {
    id: 'bilinc-yapay-zeka',
    orderNumber: '01',
    labelTr: 'Bilinç, Şuur, LLM & Beyin-Bilgisayar',
    labelEn: 'Consciousness, LLM & Brain-Computer Interfaces',
    shortLabelTr: 'Bilinç & YZ',
    shortLabelEn: 'Mind & AI',
    color: '#1E3A8A',
    descriptionTr:
      'Biyolojik zihin, kalp-QPU ayrımı, silikon tabanlı biliş, büyük dil modelleri (LLM) ve beyin-bilgisayar arayüzlerinde zihinsel özerklik hattı.',
    descriptionEn:
      'Biological cognition, heart vs. QPU distinction, silicon-based equivalents, large language models, and mental autonomy in BCI systems.',
    keywords:
      /bilinç|şuur|zihin|conscious|bewusstsein|conscience|conciencia|yapay zeka|artificial intelligence|llm|silikon|silicon|qpu|kalp|heart|beyin|brain|gehirn|cerveau|cerebro|nöron|neural|arayüz|interface|özerklik|autonom|qualia|taklit|mimic/i,
    categoryBoost: /bilinç|yapay zeka|zihin/i,
    simTypeBoost: ['consciousness'],
  },
  {
    id: 'zaman-uzay',
    orderNumber: '02',
    labelTr: 'Zaman Felsefesi, Şimdiki An & Uzay-Zaman',
    labelEn: 'Philosophy of Time, Present Moment & Spacetime',
    shortLabelTr: 'Zaman & Uzay',
    shortLabelEn: 'Time & Space',
    color: '#581C87',
    descriptionTr:
      'Geçmiş ve şimdiki zaman mevhumu, nöronal zaman algısı, blok evren, göreli uzay-zaman geometrisi ve zamansal asimetri üzerine ardışık incelemeler.',
    descriptionEn:
      'Past and present moment ontology, neuronal time perception, block universe, relativistic spacetime geometry, and temporal asymmetry.',
    keywords:
      /geçmiş zaman|şimdiki zaman|zaman algı|zaman|time|zeit|temps|tiempo|uzay-zaman|uzay zaman|spacetime|görelilik|relativit|einstein|blok evren|block universe|kronoloji|anlık|present|past time/i,
    categoryBoost: /uzay-zaman/i,
    simTypeBoost: ['spacetime'],
  },
  {
    id: 'kuantum-gozlemci',
    orderNumber: '03',
    labelTr: 'Kuantum Mekaniği, Dalga & Gözlemci',
    labelEn: 'Quantum Mechanics, Wave Function & Observer',
    shortLabelTr: 'Kuantum',
    shortLabelEn: 'Quantum',
    color: '#0F766E',
    descriptionTr:
      'Dalga fonksiyonu çökmesi, kuantum dolanıklık, ölçüm problemi, gözlemci-sistem etkileşimi ve belirsizlik epistemolojisi.',
    descriptionEn:
      'Wave-function collapse, quantum entanglement, measurement problem, observer-system coupling, and quantum epistemology.',
    keywords:
      /kuantum|quantum|quanten|quantique|cuántic|dalga fonksiyon|wave function|dolanık|entangle|süperpozisyon|superposition|gözlemci|observer|beobachter|observateur|heisenberg|schrödinger|bell|çift yarık|dekoherans|decoherence|ölçüm/i,
    categoryBoost: /kuantum/i,
    simTypeBoost: ['quantum'],
  },
  {
    id: 'entropi-kader',
    orderNumber: '04',
    labelTr: 'Entropi, Kader, Enformasyon & Determinizm',
    labelEn: 'Entropy, Destiny, Information Cost & Determinism',
    shortLabelTr: 'Entropi & Kader',
    shortLabelEn: 'Entropy & Fate',
    color: '#9A3412',
    descriptionTr:
      'Entropik akıştan bilgi getirmenin maliyeti, kaderin kökeni, termodinamik geri döndürülemezlik, kaos duyarlılığı ve özgür irade tartışmaları.',
    descriptionEn:
      'Thermodynamic cost of retrieving information from entropic flow, origin of destiny, irreversibility, chaos, and free will.',
    keywords:
      /entrop|termodinamik|thermodynamic|boltzmann|landauer|kader|destiny|schicksal|destin|destino|özgür irade|free will|libre arbitre|determin|kaos|chaos|lorenz|olup bit|nedensellik|causality|maliyet|cost|enformasyon akış/i,
    categoryBoost: /karmaşıklık|determinizm/i,
    simTypeBoost: ['chaos'],
  },
  {
    id: 'simulasyon-holografi',
    orderNumber: '05',
    labelTr: 'Simülasyon Yapısı, Holografi & Matematik',
    labelEn: 'Simulation Architecture, Holography & Computation',
    shortLabelTr: 'Simülasyon',
    shortLabelEn: 'Simulation',
    color: '#92400E',
    descriptionTr:
      'Gerçekliğin simülasyon mimarisi, holografik sınır ilkesi, AdS/CFT, hesaplanabilir fizik ve evrenin enformasyonel kod dokusu.',
    descriptionEn:
      'Simulation architecture of reality, holographic boundary principle, AdS/CFT, computable physics, and informational structure.',
    keywords:
      /simülasyon|simulation|simulación|hologra|ads\/cft|bekenstein|hawking|enformasyon|information|algoritma|algorithm|hesapla|comput|dijital|digital|sanal|virtual|kod|code|matemat|mathemat/i,
    categoryBoost: /enformasyon/i,
    simTypeBoost: ['holographic'],
  },
  {
    id: 'kozmoloji-evren',
    orderNumber: '06',
    labelTr: 'Kozmoloji, Tekil Evren & Kozmik Yaşam',
    labelEn: 'Cosmology, Singular Universe & Cosmic Life',
    shortLabelTr: 'Kozmoloji',
    shortLabelEn: 'Cosmology',
    color: '#3730A3',
    descriptionTr:
      'Evrenin tekil olgu doğası, kozmolojik genişleme, kara delik ufukları, kütleçekim ve dünya dışı yaşam (uzaylılar) arayışının sınırları.',
    descriptionEn:
      'Singularity of the universe, cosmological expansion, black-hole horizons, gravity, and the epistemic limits of searching for extraterrestrial life.',
    keywords:
      /evren|universe|universum|univers|universo|kozmo|cosmo|uzaylı|extraterrest|alien|kara delik|black hole|kütleçekim|yerçekim|gravity|tekil|singular|galaksi|galaxy|yıldız|star|big bang|büyük patlama|çoklu evren|multiverse/i,
    categoryBoost: /kozmoloji/i,
  },
  {
    id: 'parcacik-higgs',
    orderNumber: '07',
    labelTr: 'Parçacık Fiziği, Higgs & Enerji Ontolojisi',
    labelEn: 'Particle Physics, Higgs & Energy Ontology',
    shortLabelTr: 'Higgs & Madde',
    shortLabelEn: 'Higgs & Matter',
    color: '#14532D',
    descriptionTr:
      'Bir enerji formu olarak Higgs bozonu, kendiliğinden simetri kırılması, kütle kazanımı, kuantum alanları, foton ve vakum ontolojisi.',
    descriptionEn:
      'The Higgs boson as an energy form, spontaneous symmetry breaking, mass generation, quantum fields, photons, and vacuum ontology.',
    keywords:
      /higgs|bozon|boson|fermiyon|fermion|parçacık|particle|particule|teilchen|partícula|simetri|symmetry|symétrie|symmetrie|kütle|mass|foton|photon|atom|madde|matter|vakum|vacuum|enerji form|energy form|alan teor/i,
    categoryBoost: /parçacık|ontoloji/i,
    simTypeBoost: ['higgs'],
  },
  {
    id: 'epistemoloji-metafizik',
    orderNumber: '08',
    labelTr: 'Epistemoloji, Kavrayış, Yaratılış & Metafizik',
    labelEn: 'Epistemology, Human Comprehension, Creation & Metaphysics',
    shortLabelTr: 'Epistemoloji',
    shortLabelEn: 'Epistemology',
    color: '#9F1239',
    descriptionTr:
      'İnsan kavrayışının tekdüzeliği, yaratma sanatı, Elest ve peygamberlerin geliş sırası, hakikat ölçütü, dil, anlam ve metafizik temeller.',
    descriptionEn:
      'Monotony of human comprehension, the art of creation, Elest & prophetic order, criteria of truth, language, meaning, and metaphysics.',
    keywords:
      /kavrayış|comprehension|anlaşılmaz|incomprehensib|yaratma|yaratılış|creation|erschaffen|création|peygamber|prophet|elest|tanrı|god|allah|inanç|faith|din|religion|epistem|felsefe|philosoph|ontoloji|hakikat|truth|anlam|meaning|varlık|being|etik|ahlak/i,
  },
  {
    id: 'yazilim-uygulama',
    orderNumber: '09',
    labelTr: 'Yazılım, Otonom Sistemler & Uygulama Projeleri',
    labelEn: 'Software, Autonomous Systems & Applied Projects',
    shortLabelTr: 'Yazılım & Uyg.',
    shortLabelEn: 'Software & Apps',
    color: '#334155',
    descriptionTr:
      'Sağlıklı beslenme asistanı, otonom robotik mimarileri, pratik yazılım ürünleri ve kuramsal modellerin mühendislik uygulamaları.',
    descriptionEn:
      'Healthy nutrition assistant, autonomous robotics architectures, practical software products, and engineering implementations.',
    keywords:
      /beslenme|sa[ğg]l[ıiİ]k(?:l[ıiİ])?\s+(?:asistan|beslenme)|healthy eating|nutrition|ern[äa]hrung|gesundheitsassistent|alimentaci[óo]n|yazılım|software|uygulama|application|robot|otonom|autonomous|mühendislik|platform|sistem tasarım/i,
    categoryBoost: /yazılım|uygulama/i,
    simTypeBoost: ['software'],
  },
];

export const SUB_CONCEPTS: SubConceptDef[] = [
  { id: 'qpu-kalp', topicId: 'bilinc-yapay-zeka', labelTr: 'QPU & Kalp Ayrımı', labelEn: 'QPU & Heart', keywords: /qpu|kalp|heart|kuantum işlemci/i },
  { id: 'llm-suur', topicId: 'bilinc-yapay-zeka', labelTr: 'LLM & Yapay Şuur', labelEn: 'LLM & Consciousness', keywords: /llm|yapay zeka|artificial intelligence|şuur|taklit|mimic/i },
  { id: 'bci-ozerklik', topicId: 'bilinc-yapay-zeka', labelTr: 'BCI & Zihinsel Özerklik', labelEn: 'BCI & Autonomy', keywords: /arayüz|interface|özerklik|autonom|beyin bilgisayar|brain-computer/i },
  { id: 'silikon-biyoloji', topicId: 'bilinc-yapay-zeka', labelTr: 'Silikon vs Biyoloji', labelEn: 'Silicon vs Biology', keywords: /silikon|silicon|biyoloj|biolog|organik|nöron/i },

  { id: 'gecmis-simdi', topicId: 'zaman-uzay', labelTr: 'Geçmiş & Şimdiki An', labelEn: 'Past & Present', keywords: /geçmiş|şimdi|present|past time|pasado|şimdiki an/i },
  { id: 'noronal-zaman', topicId: 'zaman-uzay', labelTr: 'Nöronal Zaman Algısı', labelEn: 'Neuronal Time', keywords: /nöronal zaman|neuronal time|zaman algı|time perception|zamanın simülasyon/i },
  { id: 'gorelilik-blok', topicId: 'zaman-uzay', labelTr: 'Görelilik & Uzay-Zaman', labelEn: 'Relativity & Spacetime', keywords: /görelilik|relativit|uzay-zaman|spacetime|einstein|blok evren/i },

  { id: 'dalga-cokmesi', topicId: 'kuantum-gozlemci', labelTr: 'Dalga Fonksiyonu', labelEn: 'Wave Function', keywords: /dalga|wave|süperpozisyon|superposition|çökme|collapse|schrödinger/i },
  { id: 'dolaniklik', topicId: 'kuantum-gozlemci', labelTr: 'Kuantum Dolanıklık', labelEn: 'Entanglement', keywords: /dolanık|entangle|bell|yerel olmayan|non-local/i },
  { id: 'gozlemci-etkisi', topicId: 'kuantum-gozlemci', labelTr: 'Gözlemci & Ölçüm', labelEn: 'Observer Effect', keywords: /gözlemci|observer|beobachter|observateur|ölçüm|measurement|heisenberg/i },

  { id: 'entropi-maliyet', topicId: 'entropi-kader', labelTr: 'Entropi & Bilgi Maliyeti', labelEn: 'Entropy & Info Cost', keywords: /entrop|termodinamik|landauer|maliyet|cost|boltzmann/i },
  { id: 'kader-belirlenim', topicId: 'entropi-kader', labelTr: 'Kader & Olup Biten', labelEn: 'Destiny & Determinism', keywords: /kader|destiny|destin|determin|olup bit|nedensellik|causality/i },
  { id: 'ozgur-irade-kaos', topicId: 'entropi-kader', labelTr: 'Özgür İrade & Kaos', labelEn: 'Free Will & Chaos', keywords: /özgür irade|free will|kaos|chaos|lorenz|seçim|belirsiz/i },

  { id: 'simulasyon-yapi', topicId: 'simulasyon-holografi', labelTr: 'Simülasyon Mimarisi', labelEn: 'Simulation Architecture', keywords: /simülasyon|simulation|simulación|sanal|virtual|algoritma/i },
  { id: 'holografik-ilke', topicId: 'simulasyon-holografi', labelTr: 'Holografik Enformasyon', labelEn: 'Holographic Info', keywords: /hologra|enformasyon|information|ads\/cft|bekenstein|ufuk/i },

  { id: 'tekil-evren', topicId: 'kozmoloji-evren', labelTr: 'Tekil Evren Olgusu', labelEn: 'Singular Universe', keywords: /tekil|singular|evren|universe|universum|univers|kozmo/i },
  { id: 'uzayli-kozmik', topicId: 'kozmoloji-evren', labelTr: 'Uzaylı & Kozmik Yaşam', labelEn: 'Extraterrestrial Life', keywords: /uzaylı|alien|extraterrest|yaşam|life|medeniyet|civilization/i },
  { id: 'karadelik-kutlecekim', topicId: 'kozmoloji-evren', labelTr: 'Kara Delik & Kütleçekim', labelEn: 'Black Holes & Gravity', keywords: /kara delik|black hole|kütleçekim|yerçekim|gravity|hawking/i },

  { id: 'higgs-enerji', topicId: 'parcacik-higgs', labelTr: 'Higgs & Enerji Formu', labelEn: 'Higgs & Energy Form', keywords: /higgs|bozon|boson|enerji form|energy form|kütle/i },
  { id: 'simetri-madde', topicId: 'parcacik-higgs', labelTr: 'Simetri, Vakum & Madde', labelEn: 'Symmetry & Matter', keywords: /simetri|symmetry|vakum|vacuum|madde|matter|parçacık|foton/i },

  { id: 'insan-kavrayisi', topicId: 'epistemoloji-metafizik', labelTr: 'İnsan Kavrayışı & Sınır', labelEn: 'Human Comprehension', keywords: /kavrayış|comprehension|anlaşılmaz|algı|idrak|epistem|bilgi/i },
  { id: 'yaratilis-elest', topicId: 'epistemoloji-metafizik', labelTr: 'Yaratılış, Elest & Vahiy', labelEn: 'Creation & Elest', keywords: /yaratma|yaratılış|creation|peygamber|prophet|elest|tanrı|allah/i },
  { id: 'hakikat-anlam', topicId: 'epistemoloji-metafizik', labelTr: 'Hakikat, Dil & Ontoloji', labelEn: 'Truth & Ontology', keywords: /hakikat|truth|varlık|ontoloji|felsefe|anlam|meaning|dil/i },

  { id: 'yazilim-otonom', topicId: 'yazilim-uygulama', labelTr: 'Yazılım & Otonom Sistemler', labelEn: 'Software & Autonomy', keywords: /beslenme|sağlık|nutrition|yazılım|software|robot|uygulama|asistan/i },
];

const STOP_WORDS = new Set([
  'bir', 've', 'ile', 'için', 'olan', 'olarak', 'gibi', 'daha', 'değil', 'ancak', 'fakat', 'üzerine',
  'nedir', 'neden', 'kadar', 'veya', 'ama', 'bunu', 'bunun', 'şekilde', 'kendi', 'sadece', 'hatta',
  'olarak', 'bizim', 'bütün', 'herkes', 'nasıl', 'hangi', 'makale', 'emre', 'pelit', 'tarihinde',
  'mersin', 'the', 'and', 'for', 'with', 'that', 'this', 'from', 'into', 'about', 'between', 'what',
  'when', 'where', 'which', 'their', 'there', 'have', 'been', 'will', 'would', 'does', 'they', 'them',
  'could', 'should', 'through', 'under', 'over', 'some', 'such', 'more', 'most', 'only', 'also',
  'dans', 'pour', 'avec', 'plus', 'sont', 'cette', 'comme', 'para', 'como', 'sobre', 'entre', 'pero',
  'eine', 'einen', 'nicht', 'auch', 'oder', 'über', 'kann', 'sind', 'wird', 'dass', 'nach',
]);

const STAGE_META: Record<ConceptualStageId, { tr: string; en: string }> = {
  1: { tr: 'Aşama 1 · Temel Çerçeve & Köken', en: 'Stage 1 · Foundational Framework' },
  2: { tr: 'Aşama 2 · Kuramsal Mekanizma', en: 'Stage 2 · Theoretical Mechanism' },
  3: { tr: 'Aşama 3 · Çapraz Sentez & Karşılaştırma', en: 'Stage 3 · Cross-Domain Synthesis' },
  4: { tr: 'Aşama 4 · İleri Ufuk & Felsefi Sonuç', en: 'Stage 4 · Meta-Philosophical Horizon' },
};

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 4 && !STOP_WORDS.has(w));
}

function buildTokenFreqMap(text: string): Map<string, number> {
  const map = new Map<string, number>();
  for (const tok of tokenize(text)) {
    map.set(tok, (map.get(tok) || 0) + 1);
  }
  return map;
}

function cosineSimilarity(a: Map<string, number>, b: Map<string, number>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (const [k, va] of a.entries()) {
    normA += va * va;
    const vb = b.get(k);
    if (vb) dot += va * vb;
  }
  for (const vb of b.values()) {
    normB += vb * vb;
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom > 0 ? dot / denom : 0;
}

function topSharedTokens(a: Map<string, number>, b: Map<string, number>, limit = 3): string[] {
  const scored: Array<[string, number]> = [];
  for (const [k, va] of a.entries()) {
    const vb = b.get(k);
    if (vb) {
      scored.push([k, Math.min(va, vb) + (va + vb) * 0.25]);
    }
  }
  return scored
    .sort((x, y) => y[1] - x[1])
    .slice(0, limit)
    .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1));
}

function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 0;
  let intersection = 0;
  for (const item of a) {
    if (b.has(item)) intersection += 1;
  }
  const union = a.size + b.size - intersection;
  return union > 0 ? intersection / union : 0;
}

function determineConceptualStage(
  titleText: string,
  bodySample: string,
  subConceptCount: number
): ConceptualStageId {
  const combined = `${titleText} ${bodySample.slice(0, 420)}`.toLowerCase();

  if (
    /köken|origin|temel|fundamental|nedir|what is|başlangıç|tanım|mevhum|olgu|doğası|nature of|geliş sırası/i.test(
      titleText
    )
  ) {
    return 1;
  }
  if (
    /peki sonra|so what next|ilelebet|forever|anlaşılmaz|incomprehensib|sınır|limit|ufuk|horizon|sonuç|gelecek|future|etik|özerklik|autonom|doğru yerde mi/i.test(
      titleText
    )
  ) {
    return 4;
  }
  if (
    /arasındaki|between|karşı|versus|vs\.|eşdeğer|equivalent|ve\s+|and\s+|simülasyon yapısı.*algı|maliyet|cost/i.test(
      titleText
    ) ||
    subConceptCount >= 3
  ) {
    return 3;
  }
  if (/enerji|energy|mekaniz|mechanism|denklem|equation|yapı|structure|algı|perception|dalga|alan|field/i.test(combined)) {
    return 2;
  }
  return subConceptCount >= 2 ? 3 : 2;
}

function classifyPrimaryTopic(article: Article, titleText: string, abstractText: string, bodyText: string): string {
  const titleLower = titleText.toLowerCase();
  const absLower = abstractText.toLowerCase();
  const bodyLower = bodyText.slice(0, 1200).toLowerCase();
  const catLower = String(article.category || '').toLowerCase();
  const simType = String(article.simulation?.type || '').toLowerCase();

  // Explicit high-precision override for software/nutrition projects
  if (TOPIC_DOMAINS[8].keywords.test(titleLower) || simType === 'software') {
    return 'yazilim-uygulama';
  }

  let bestTopicId = 'epistemoloji-metafizik';
  let bestScore = -1;

  for (const domain of TOPIC_DOMAINS) {
    let score = 0;
    const globalRegex = new RegExp(domain.keywords.source, 'gi');
    const titleMatches = titleLower.match(globalRegex) || [];
    const absMatches = absLower.match(globalRegex) || [];
    const bodyMatches = bodyLower.match(globalRegex) || [];

    score += Math.min(titleMatches.length, 4) * 6.5;
    score += Math.min(absMatches.length, 5) * 2.5;
    score += Math.min(bodyMatches.length, 6) * 0.8;

    if (domain.categoryBoost && domain.categoryBoost.test(catLower)) {
      score += 2.2;
    }
    if (domain.simTypeBoost && domain.simTypeBoost.includes(simType)) {
      score += 1.6;
    }

    if (score > bestScore) {
      bestScore = score;
      bestTopicId = domain.id;
    }
  }

  return bestScore > 0 ? bestTopicId : 'epistemoloji-metafizik';
}

export function buildTopicConceptAtlas(
  allArticles: Article[],
  language: LanguageCode,
  uniqueWorksOnly: boolean
): TopicConceptAtlasResult {
  // Scope articles cleanly: deduplicate multilingual editions by default so each continuation chain has distinct essays
  let scopedArticles: Article[] = allArticles;
  if (uniqueWorksOnly && allArticles.length > 0) {
    const workClusters = buildArticleWorkClusters(allArticles);
    const chosen: Article[] = [];
    for (const cluster of workClusters.clusters) {
      const preferred =
        cluster.byLang[language] ||
        cluster.byLang.tr ||
        cluster.byLang.en ||
        cluster.articles[0];
      if (preferred) chosen.push(preferred);
    }
    scopedArticles = chosen;
  }

  // Pre-extract rich content features per article
  const features = scopedArticles.map((article) => {
    const titleLocalized = getLocalizedText(article.title, language);
    const titleAll = `${getLocalizedText(article.title, 'tr')} ${getLocalizedText(article.title, 'en')} ${titleLocalized}`;
    const abstractLocalized = getLocalizedText(article.abstract, language);
    const abstractAll = `${getLocalizedText(article.abstract, 'tr')} ${getLocalizedText(article.abstract, 'en')} ${abstractLocalized}`;
    const paragraphs = getLocalizedArray(article.contentParagraphs, language);
    const bodySample = paragraphs.slice(0, 3).join(' ');
    const fullHaystack = `${titleAll} ${abstractAll} ${bodySample}`;

    const matchedSubConcepts = SUB_CONCEPTS.filter((sc) => sc.keywords.test(fullHaystack));
    const primaryTopicId = classifyPrimaryTopic(article, titleAll, abstractAll, bodySample);
    const subConceptIdSet = new Set(matchedSubConcepts.map((sc) => sc.id));

    // Guarantee at least one sub-concept linked to its primary topic
    if (subConceptIdSet.size === 0) {
      const fallbackSc = SUB_CONCEPTS.find((sc) => sc.topicId === primaryTopicId);
      if (fallbackSc) subConceptIdSet.add(fallbackSc.id);
    }

    const tokenFreq = buildTokenFreqMap(`${titleLocalized} ${titleLocalized} ${abstractLocalized} ${bodySample.slice(0, 700)}`);
    const stage = determineConceptualStage(titleLocalized, bodySample, subConceptIdSet.size);
    const timestamp = Date.parse(article.publishedAt || '2026-01-01') || 0;
    const sourceLang =
      article.sourceLang ||
      detectEntrySourceLanguage(
        getLocalizedText(article.title, 'tr'),
        getLocalizedText(article.abstract, 'tr')
      );

    return {
      article,
      titleLocalized,
      primaryTopicId,
      subConceptIdSet,
      tokenFreq,
      stage,
      timestamp,
      sourceLang,
    };
  });

  // Compute global Sub-Concept stats and Co-occurrence Edges
  const subConceptArticlesMap = new Map<string, string[]>();
  SUB_CONCEPTS.forEach((sc) => subConceptArticlesMap.set(sc.id, []));

  const subEdgeCounts = new Map<string, number>();
  const topicBridgeCounts = new Map<string, { weight: number; subConcepts: Set<string> }>();

  for (const feat of features) {
    const scList = Array.from(feat.subConceptIdSet);
    for (const scId of scList) {
      subConceptArticlesMap.get(scId)?.push(feat.article.id);
    }

    // Sub-concept to sub-concept co-occurrence
    for (let i = 0; i < scList.length; i++) {
      for (let j = i + 1; j < scList.length; j++) {
        const key = [scList[i], scList[j]].sort().join('::');
        subEdgeCounts.set(key, (subEdgeCounts.get(key) || 0) + 1);
      }
    }

    // Cross-topic bridges derived from an article's primary topic + secondary sub-concepts belonging to other topics
    const touchedTopics = new Set<string>([feat.primaryTopicId]);
    const topicToScLabels = new Map<string, string[]>();
    for (const scId of scList) {
      const scDef = SUB_CONCEPTS.find((s) => s.id === scId);
      if (!scDef) continue;
      touchedTopics.add(scDef.topicId);
      const list = topicToScLabels.get(scDef.topicId) || [];
      list.push(language === 'tr' ? scDef.labelTr : scDef.labelEn);
      topicToScLabels.set(scDef.topicId, list);
    }

    const touchedArr = Array.from(touchedTopics);
    for (let i = 0; i < touchedArr.length; i++) {
      for (let j = i + 1; j < touchedArr.length; j++) {
        const key = [touchedArr[i], touchedArr[j]].sort().join('::');
        const entry = topicBridgeCounts.get(key) || { weight: 0, subConcepts: new Set<string>() };
        entry.weight += 1;
        for (const scId of scList) {
          const scDef = SUB_CONCEPTS.find((s) => s.id === scId);
          if (scDef && (scDef.topicId === touchedArr[i] || scDef.topicId === touchedArr[j])) {
            entry.subConcepts.add(language === 'tr' ? scDef.labelTr : scDef.labelEn);
          }
        }
        topicBridgeCounts.set(key, entry);
      }
    }
  }

  const subConceptMapById = new Map(SUB_CONCEPTS.map((s) => [s.id, s]));
  const topicDefMapById = new Map(TOPIC_DOMAINS.map((t) => [t.id, t]));

  // Build ordered continuation chains for every topic
  const topicClusters: TopicClusterResult[] = TOPIC_DOMAINS.map((topic) => {
    const members = features.filter((f) => f.primaryTopicId === topic.id);

    // Greedy Maximum-Continuity Chain: start from strongest foundational anchor (lowest stage, highest connectivity, earliest date)
    const remaining = [...members];
    const chain: typeof members = [];

    if (remaining.length > 0) {
      // Score anchor suitability
      let bestStartIdx = 0;
      let bestAnchorScore = -Infinity;
      for (let i = 0; i < remaining.length; i++) {
        const cand = remaining[i];
        let avgSim = 0;
        for (let j = 0; j < remaining.length; j++) {
          if (i === j) continue;
          avgSim +=
            0.55 * jaccardSimilarity(cand.subConceptIdSet, remaining[j].subConceptIdSet) +
            0.45 * cosineSimilarity(cand.tokenFreq, remaining[j].tokenFreq);
        }
        avgSim = remaining.length > 1 ? avgSim / (remaining.length - 1) : 0;
        const stageBias = (5 - cand.stage) * 1.4;
        const anchorScore = stageBias + avgSim * 2.0;
        if (anchorScore > bestAnchorScore) {
          bestAnchorScore = anchorScore;
          bestStartIdx = i;
        }
      }

      chain.push(remaining.splice(bestStartIdx, 1)[0]);

      while (remaining.length > 0) {
        const prev = chain[chain.length - 1];
        let bestNextIdx = 0;
        let bestScore = -Infinity;

        for (let i = 0; i < remaining.length; i++) {
          const cand = remaining[i];
          const scSim = jaccardSimilarity(prev.subConceptIdSet, cand.subConceptIdSet);
          const lexSim = cosineSimilarity(prev.tokenFreq, cand.tokenFreq);

          // Gently prefer same stage or +1 stage forward progression
          const stageDiff = cand.stage - prev.stage;
          const stageAffinity =
            stageDiff === 0 ? 1.0 : stageDiff === 1 ? 0.92 : stageDiff === -1 ? 0.55 : stageDiff === 2 ? 0.65 : 0.3;

          const timeDiffDays = Math.abs(cand.timestamp - prev.timestamp) / (1000 * 60 * 60 * 24);
          const chronoCoherence = 1 / (1 + timeDiffDays / 180);

          const totalScore = 0.44 * scSim + 0.34 * lexSim + 0.16 * stageAffinity + 0.06 * chronoCoherence;
          if (totalScore > bestScore) {
            bestScore = totalScore;
            bestNextIdx = i;
          }
        }
        chain.push(remaining.splice(bestNextIdx, 1)[0]);
      }
    }

    const subConceptCounts: Record<string, number> = {};
    let totalReadMinutes = 0;

    const orderedItems: OrderedContinuationItem[] = chain.map((feat, idx) => {
      totalReadMinutes += feat.article.readTimeMinutes || 5;
      const scIds = Array.from(feat.subConceptIdSet);
      scIds.forEach((id) => {
        subConceptCounts[id] = (subConceptCounts[id] || 0) + 1;
      });
      const scLabels = scIds
        .map((id) => {
          const def = subConceptMapById.get(id);
          return def ? (language === 'tr' ? def.labelTr : def.labelEn) : '';
        })
        .filter(Boolean);

      if (idx === 0) {
        return {
          sequenceNumber: 1,
          article: feat.article,
          topicId: topic.id,
          stage: feat.stage,
          stageLabelTr: STAGE_META[feat.stage].tr,
          stageLabelEn: STAGE_META[feat.stage].en,
          matchedSubConceptIds: scIds,
          matchedSubConceptLabels: scLabels,
          continuityPercentWithPrev: null,
          bridgeSubConcepts: [],
          bridgeKeywords: [],
          transitionReasonTr: `Bu konudaki kavramsal zincirin başlangıç makalesi (${STAGE_META[feat.stage].tr}).`,
          transitionReasonEn: `Opening anchor essay of this thematic sequence (${STAGE_META[feat.stage].en}).`,
        };
      }

      const prev = chain[idx - 1];
      const scSim = jaccardSimilarity(prev.subConceptIdSet, feat.subConceptIdSet);
      const lexSim = cosineSimilarity(prev.tokenFreq, feat.tokenFreq);
      const rawCont = Math.min(1, scSim * 0.62 + lexSim * 0.55 + 0.22);
      const continuityPct = Math.max(58, Math.min(98, Math.round(52 + rawCont * 46)));

      const sharedScLabels = scIds
        .filter((id) => prev.subConceptIdSet.has(id))
        .map((id) => {
          const def = subConceptMapById.get(id);
          return def ? (language === 'tr' ? def.labelTr : def.labelEn) : '';
        })
        .filter(Boolean)
        .slice(0, 3);

      const sharedWords = topSharedTokens(prev.tokenFreq, feat.tokenFreq, 3);

      const bridgeSummaryTr =
        sharedScLabels.length > 0
          ? `Önceki makaledeki "${sharedScLabels.join(' · ')}" hattını ${
              sharedWords.length > 0 ? `(${sharedWords.join(', ')}) ` : ''
            }içerik ekseninde bir sonraki adıma taşır.`
          : sharedWords.length > 0
            ? `Önceki makaledeki "${sharedWords.join(', ')}" kavramsal bağlamını derinleştirerek devam eder.`
            : `${topic.shortLabelTr} alanındaki tartışmayı ${STAGE_META[feat.stage].tr.toLowerCase()} düzeyinde sürdürür.`;

      const bridgeSummaryEn =
        sharedScLabels.length > 0
          ? `Continues the "${sharedScLabels.join(' · ')}" thread from the previous essay${
              sharedWords.length > 0 ? ` (${sharedWords.join(', ')})` : ''
            }.`
          : sharedWords.length > 0
            ? `Extends the conceptual context of "${sharedWords.join(', ')}" from the preceding work.`
            : `Advances the ${topic.shortLabelEn} inquiry at the ${STAGE_META[feat.stage].en.toLowerCase()} level.`;

      return {
        sequenceNumber: idx + 1,
        article: feat.article,
        topicId: topic.id,
        stage: feat.stage,
        stageLabelTr: STAGE_META[feat.stage].tr,
        stageLabelEn: STAGE_META[feat.stage].en,
        matchedSubConceptIds: scIds,
        matchedSubConceptLabels: scLabels,
        continuityPercentWithPrev: continuityPct,
        bridgeSubConcepts: sharedScLabels,
        bridgeKeywords: sharedWords,
        transitionReasonTr: bridgeSummaryTr,
        transitionReasonEn: bridgeSummaryEn,
      };
    });

    // Find top bridged neighboring topics
    const bridgedNeighbors: TopicClusterResult['topBridgedTopics'] = [];
    for (const [pairKey, info] of topicBridgeCounts.entries()) {
      const [a, b] = pairKey.split('::');
      if (a !== topic.id && b !== topic.id) continue;
      const otherId = a === topic.id ? b : a;
      const otherDef = topicDefMapById.get(otherId);
      if (!otherDef) continue;
      bridgedNeighbors.push({
        topicId: otherId,
        labelTr: otherDef.labelTr,
        labelEn: otherDef.labelEn,
        color: otherDef.color,
        sharedWeight: info.weight,
        sharedSubConcepts: Array.from(info.subConcepts).slice(0, 3),
      });
    }
    bridgedNeighbors.sort((x, y) => y.sharedWeight - x.sharedWeight);

    return {
      topic,
      orderedItems,
      totalReadMinutes,
      subConceptCounts,
      topBridgedTopics: bridgedNeighbors.slice(0, 4),
    };
  });

  const subConcepts = SUB_CONCEPTS.map((sc) => {
    const parentTopic = topicDefMapById.get(sc.topicId);
    const ids = subConceptArticlesMap.get(sc.id) || [];
    return {
      ...sc,
      color: parentTopic?.color || '#1E3A8A',
      articleIds: ids,
      count: ids.length,
    };
  });

  const topicEdges = Array.from(topicBridgeCounts.entries())
    .map(([pairKey, info]) => {
      const [sourceId, targetId] = pairKey.split('::');
      return {
        sourceId,
        targetId,
        weight: info.weight,
        sharedSubConcepts: Array.from(info.subConcepts).slice(0, 4),
      };
    })
    .filter((e) => e.weight > 0)
    .sort((a, b) => b.weight - a.weight);

  const subConceptEdges = Array.from(subEdgeCounts.entries())
    .map(([pairKey, weight]) => {
      const [sourceId, targetId] = pairKey.split('::');
      return { sourceId, targetId, weight };
    })
    .filter((e) => e.weight >= 2)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 72);

  return {
    scopedArticlesCount: scopedArticles.length,
    topics: topicClusters,
    subConcepts,
    topicEdges,
    subConceptEdges,
  };
}
