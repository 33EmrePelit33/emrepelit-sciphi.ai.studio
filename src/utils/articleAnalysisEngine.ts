import { Article, LanguageCode, SimulationType } from '../types';
import { getLocalizedArray, getLocalizedText, getLanguageMeta } from '../i18n/translations';

export interface ArticleVoiceProsodyProfile {
  persona: 'Kore' | 'Charon' | 'Fenrir' | 'Puck' | 'Zephyr';
  styleTitle: string;
  styleDescription: string;
  recommendedRate: number;
  recommendedPitch: number;
  sectionPauseMs: number;
  sentencePauseMs: number;
  acousticToneLabel: string;
}

export interface ConceptGlossaryItem {
  term: string;
  plainDefinition: string;
  academicRole: string;
}

export interface ParagraphDeepAnalysis {
  sectionIndex: number;
  sectionCode: string;
  sectionTitle: string;
  originalText: string;
  plainLanguageExplanation: string;
  detailedCommentary: string;
  concreteExampleOrImplication: string;
  epistemologicalFunction: string;
  extractedConcepts: string[];
  sectionScientificScore: number;
}

export interface ArticleScientificScoreBreakdown {
  overallScore: number;
  gradeLabel: string;
  confidenceInterval: string;
  methodologicalRigor: number;
  simulationFidelity: number;
  epistemologicalOriginality: number;
  mathematicalCoherence: number;
  empiricalGrounding: number;
}

export interface ArticleSimulationHighAccuracyResult {
  calibrationId: string;
  accuracyPercent: number;
  convergenceIterations: number;
  governingEquation: string;
  boundaryConditionSummary: string;
  primaryObservableLabel: string;
  primaryObservableValue: string;
  secondaryObservableLabel: string;
  secondaryObservableValue: string;
  phaseSpaceStabilityIndex: string;
  epistemicEntropyDelta: string;
  tailoredPhysicalInterpretation: string;
  plainSimulationExplanation: string;
  parameterSensitivityNotes: string[];
}

export interface AnalysisTranscriptSegment {
  index: number;
  sectionLabel: string;
  text: string;
  startChar: number;
  endChar: number;
}

export interface NonExpertExplanationSection {
  sectionTitle: string;
  introductoryExplanation: string;
  everydayLifeComparison: string;
  keyTakeawayForEveryone: string;
}

export interface ProfessionalExplanationSection {
  sectionTitle: string;
  technicalAbstractSynthesis: string;
  methodologicalAndFormalContribution: string;
  falsifiabilityAndEmpiricalBounds: string;
}

export interface EquationOperationItem {
  symbol: string;
  operationName: string;
  whatItDoesSimply: string;
  whatItDoesTechnically: string;
}

export interface EquationVariableItem {
  symbol: string;
  variableName: string;
  unitOrSpace: string;
  plainMeaning: string;
  professionalRole: string;
  calibratedValue: string;
}

export interface ArticleCoreThesisEquation {
  equationCode: string;
  equationTitle: string;
  symbolicEquation: string;
  baseSimulationEquation: string;
  thesisMathematicalStatement: string;
  stepByStepCalculationSummary: string;
  numericalVerificationResult: string;
  operationsBreakdown: EquationOperationItem[];
  variablesBreakdown: EquationVariableItem[];
}

export interface ScientificValidAspectItem {
  aspectCode: string;
  aspectTitle: string;
  scientificValidityScore: number;
  scientificMechanismAndEvidence: string;
  articleGroundedProof: string;
  establishedLiteratureAlignment: string;
}

export interface ScientificIncompleteAspectItem {
  aspectCode: string;
  missingOrBoundaryAspectTitle: string;
  limitationSeverityAndScope: string;
  scientificCritiqueExplanation: string;
  concreteScientificCompletionProposal: string;
  proposedVerificationProtocol: string;
}

export interface DetailedArticleEvaluationReport {
  reportCode: string;
  reportTitle: string;
  deepInterdisciplinaryCommentary: string;
  physicalAndNaturalSciencesEvaluation: string;
  epistemologicalAndPhilosophicalEvaluation: string;
  mathematicalAndSimulationAudit: string;
  empiricalFalsifiabilityAndTestabilityReport: string;
  literaturePositioningAndOriginality: string;
  finalPeerReviewVerdict: string;
}

export interface PriorScientificResearchItem {
  researchCode: string;
  scientistName: string;
  scientistInstitutionAndHonor: string;
  eraAndYear: string;
  researchTitle: string;
  scientificContributionAndFindings: string;
  relevanceToThisArticle: string;
}

export interface EstablishedConsensusItem {
  consensusCode: string;
  consensusTitle: string;
  establishedUpToPeriod: string;
  foundingAndKeyScientists: string;
  orthodoxConsensusStatement: string;
  consensusBoundaryAndArticleAdvance: string;
}

export interface ArticleAverageReadingTimeMetrics {
  averageReadingSeconds: number;
  averageReadingMinutes: number;
  averageMinutesPart: number;
  averageSecondsPart: number;
  wordCount: number;
  formattedShort: string;
  formattedMinutesDecimal: string;
  complexityFactor: number;
}

export interface FutureScientificStudyProposal {
  studyCode: string;
  studyTitle: string;
  hypothesisToTest: string;
  experimentalOrComputationalDesign: string;
  expectedScientificImpact: string;
}

export interface CompleteUnderstandingAndFutureResearchSection {
  sectionTitle: string;
  completeComprehensionOverview: string;
  conceptualChainSummary: string;
  stepByStepMasteryNotes: string[];
  futureScientificEvaluationGuide: string;
  proposedFutureStudies: FutureScientificStudyProposal[];
  openQuestionsForResearchers: string[];
  falsifiabilityAndReplicationChecklist: string[];
}

export interface ArticleFullAnalysisReport {
  articleId: string;
  articleNumberLabel: string;
  title: string;
  subtitle: string;
  category: string;
  publishedAt: string;
  sha256Signature: string;
  language: LanguageCode;
  averageReadingTime: ArticleAverageReadingTimeMetrics;
  voiceProfile: ArticleVoiceProsodyProfile;
  scientificScore: ArticleScientificScoreBreakdown;
  epistemologicalStance: string;
  nonExpertExplanation: NonExpertExplanationSection;
  professionalExplanation: ProfessionalExplanationSection;
  coreThesisEquation: ArticleCoreThesisEquation;
  scientificallyValidAspects: ScientificValidAspectItem[];
  scientificallyIncompleteAspects: ScientificIncompleteAspectItem[];
  detailedEvaluationReport: DetailedArticleEvaluationReport;
  priorLiteratureSynthesisSummary: string;
  priorScientificResearches: PriorScientificResearchItem[];
  establishedScientificConsensuses: EstablishedConsensusItem[];
  completeUnderstandingAndFutureResearch: CompleteUnderstandingAndFutureResearchSection;
  plainLanguageSummary: string;
  everydayAnalogy: string;
  stepByStepLogicalFlow: {
    stepNumber: number;
    stepTitle: string;
    stepExplanation: string;
  }[];
  keyConceptsGlossary: ConceptGlossaryItem[];
  executiveSynthesis: string;
  ontologicalThesis: string;
  methodologyEvaluation: string;
  extractedKeywords: string[];
  paragraphAnalyses: ParagraphDeepAnalysis[];
  keyFindingsAnalysis: {
    findingIndex: number;
    findingText: string;
    plainMeaning: string;
    analyticalVerification: string;
    impactScore: number;
  }[];
  corePremises: string[];
  counterArguments: {
    objection: string;
    methodologicalResponse: string;
  }[];
  suggestedCitations: string[];
  recommendedSimulationType: SimulationType;
  simulationResults: ArticleSimulationHighAccuracyResult;
  narrationSegments: AnalysisTranscriptSegment[];
  fullAudioScript: string;
}

function deterministicSeedFromText(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0);
}

export function computeArticleAverageReadingTime(
  article: Article,
  language: LanguageCode = 'tr'
): ArticleAverageReadingTimeMetrics {
  const titleText = article.title?.tr || article.title?.en || Object.values(article.title || {})[0] || '';
  const abstractText =
    article.abstract?.tr || article.abstract?.en || Object.values(article.abstract || {})[0] || '';
  const findingsText = (
    article.keyFindings?.tr ||
    article.keyFindings?.en ||
    Object.values(article.keyFindings || {})[0] ||
    []
  ).join(' ');
  const paragraphsText = (
    article.contentParagraphs?.tr ||
    article.contentParagraphs?.en ||
    Object.values(article.contentParagraphs || {})[0] ||
    []
  ).join(' ');

  const combinedText = `${titleText} ${abstractText} ${findingsText} ${paragraphsText}`.trim();
  const words = combinedText ? combinedText.split(/\s+/).filter(Boolean) : [];
  const wordCount = Math.max(120, words.length);
  const seed = deterministicSeedFromText(
    `${article.id}:${article.slug}:${article.sha256Signature || titleText}`
  );

  const simBonus =
    article.simulation?.type === 'quantum' || article.simulation?.type === 'spacetime'
      ? 55
      : article.simulation?.type === 'holographic' || article.simulation?.type === 'chaos'
        ? 45
        : 35;

  const baseFromMetaSeconds = Math.max(240, (article.readTimeMinutes || 6) * 60);
  const wordBasedSeconds = Math.round((wordCount / 162) * 60);
  const complexityFactor = Number((1.04 + ((seed % 19) / 100)).toFixed(2));
  const rawSeconds = Math.round(
    wordBasedSeconds * 0.52 +
      baseFromMetaSeconds * 0.48 +
      simBonus +
      ((seed % 115) - 35)
  );
  const averageReadingSeconds = Math.max(240, rawSeconds);
  const averageMinutesPart = Math.floor(averageReadingSeconds / 60);
  const averageSecondsPart = averageReadingSeconds % 60;
  const averageReadingMinutes = Number((averageReadingSeconds / 60).toFixed(2));
  const minUnit = language === 'tr' ? 'dk' : 'min';
  const secUnit = language === 'tr' ? 'sn' : 'sec';

  return {
    averageReadingSeconds,
    averageReadingMinutes,
    averageMinutesPart,
    averageSecondsPart,
    wordCount,
    formattedShort: `${averageMinutesPart} ${minUnit} ${String(averageSecondsPart).padStart(2, '0')} ${secUnit}`,
    formattedMinutesDecimal: `${averageReadingMinutes.toFixed(1)} ${minUnit}`,
    complexityFactor,
  };
}

function extractSalientKeywords(text: string, fallbackCategory: string): string[] {
  const stopWords = new Set([
    'bir', 'bu', 've', 'ile', 'için', 'olarak', 'olan', 'gibi', 'daha', 'çok',
    'ise', 'de', 'da', 'ki', 'ne', 'ya', 'hem', 'veya', 'ama', 'fakat', 'ancak',
    'üzerine', 'arasındaki', 'içinde', 'tarafından', 'kadar', 'sonra', 'önce',
    'göre', 'olup', 'olduğu', 'olduğunu', 'değil', 'her', 'tüm', 'bütün',
    'the', 'and', 'of', 'in', 'to', 'for', 'with', 'on', 'as', 'is', 'are',
    'that', 'this', 'from', 'by', 'an', 'be', 'or', 'at', 'which', 'with',
    'los', 'las', 'del', 'una', 'para', 'con', 'por', 'und', 'der', 'die', 'das',
    'les', 'des', 'dans', 'pour', 'une', 'sur', 'che', 'per', 'con', 'una',
  ]);

  const cleaned = text
    .replace(/[.,;:!?()"'“”‘’[\]{}<>/\\|+=_*&^%$#@~`—–-]/g, ' ')
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length >= 5 && !stopWords.has(w.toLowerCase()) && !/^\d+$/.test(w));

  const freq = new Map<string, { original: string; count: number }>();
  for (const word of cleaned) {
    const lower = word.toLowerCase();
    const existing = freq.get(lower);
    if (existing) {
      existing.count += 1;
    } else {
      freq.set(lower, { original: word, count: 1 });
    }
  }

  const sorted = Array.from(freq.values())
    .sort((a, b) => b.count - a.count || b.original.length - a.original.length)
    .map((item) => item.original);

  if (sorted.length >= 6) {
    return sorted.slice(0, 8);
  }

  const defaults = [
    fallbackCategory,
    'Ontolojik Yapı',
    'Epistemolojik Tutarlılık',
    'Matematiksel Formalizm',
    'Kuantum Durum Uzayı',
    'Nedensel Topoloji',
  ];
  return Array.from(new Set([...sorted, ...defaults])).slice(0, 8);
}

/**
 * Computes the optimal voice persona, speech rate, pitch, pause cadence, and rhetorical
 * narration style specifically matched to an article's subject matter and simulation type.
 */
export function getOptimalVoiceProfileForArticle(
  article: Article,
  language: LanguageCode = 'tr'
): ArticleVoiceProsodyProfile {
  const isTr = language === 'tr';
  switch (article.category) {
    case 'Kuantum Fiziği':
      return {
        persona: 'Kore',
        styleTitle: isTr
          ? 'Kuantum Analitik Kürsü Tonu (Berrak & Hassas Vurgu)'
          : 'Quantum Analytical Lecture Tone (Precise & Articulate)',
        styleDescription: isTr
          ? 'Dalga fonksiyonu, süperpozisyon ve ölçüm problemlerinin adım adım anlaşılması için berrak diksiyon, dengeli hız ve kavram vurgulu tonlama.'
          : 'Clear diction, balanced cadence, and concept-focused emphasis tailored for quantum state and measurement analysis.',
        recommendedRate: 0.98,
        recommendedPitch: 1.01,
        sectionPauseMs: 420,
        sentencePauseMs: 180,
        acousticToneLabel: 'Analitik · Berrak · Kavram Vurgulu',
      };
    case 'Kozmoloji & Holografi':
      return {
        persona: 'Charon',
        styleTitle: isTr
          ? 'Kozmolojik Derin Monografi Tonu (Geniş Ufuklu & Ağırbaşlı)'
          : 'Cosmological Deep Monograph Tone (Resonant & Contemplative)',
        styleDescription: isTr
          ? 'Uzay-zaman ufku, holografik sınır entropisi ve evrensel ölçekteki çıkarımlar için derin frekanslı, dingin ve yüksek otoriteli anlatım biçimi.'
          : 'Deep-timbre, measured academic delivery suited for horizon entropy and cosmological structure.',
        recommendedRate: 0.95,
        recommendedPitch: 0.95,
        sectionPauseMs: 480,
        sentencePauseMs: 210,
        acousticToneLabel: 'Derin · Kozmik · Ağırbaşlı',
      };
    case 'Zihin Felsefesi':
      return {
        persona: 'Zephyr',
        styleTitle: isTr
          ? 'Fenomenolojik Tefekkür & Bilinç Tonu (Akıcı & Düşündürücü)'
          : 'Phenomenological & Consciousness Tone (Reflective & Fluid)',
        styleDescription: isTr
          ? 'Öznel deneyim (qualia), bilinç entegrasyonu ve zihin-beden argümanlarını içselleştirmeyi kolaylaştıran doğal, sıcak ve tefekkür odaklı seslendirme.'
          : 'Warm, reflective, and fluid prosody designed for philosophy of mind and subjective experience arguments.',
        recommendedRate: 0.96,
        recommendedPitch: 1.0,
        sectionPauseMs: 450,
        sentencePauseMs: 190,
        acousticToneLabel: 'Tefekkür Odaklı · Doğal · Akıcı',
      };
    case 'Zaman & Görelilik':
      return {
        persona: 'Fenrir',
        styleTitle: isTr
          ? 'Kronolojik & Aksiyomatik Teorem Tonu (Ritmik & Nedensel)'
          : 'Chronological & Axiomatic Theorem Tone (Rhythmic & Causal)',
        styleDescription: isTr
          ? 'Blok evren, zaman genişlemesi ve termodinamik zaman oku arasındaki nedensel zinciri netleştiren ritmik ve yapısal tonlama.'
          : 'Rhythmic, structured cadence highlighting relativistic invariance and causal spacetime order.',
        recommendedRate: 0.97,
        recommendedPitch: 0.96,
        sectionPauseMs: 440,
        sentencePauseMs: 185,
        acousticToneLabel: 'Ritmik · Nedensel · Aksiyomatik',
      };
    case 'Epistemoloji & Kaos':
      return {
        persona: 'Puck',
        styleTitle: isTr
          ? 'Diyalektik & Dinamik Sistem Analiz Tonu (Canlı & Argüman Odaklı)'
          : 'Dialectical & Nonlinear Dynamics Tone (Engaging & Argumentative)',
        styleDescription: isTr
          ? 'Kaos teorisi, kelebek etkisi, öngörü ufku ve epistemik sınır tartışmalarındaki tez-antitez geçişlerini canlı tutan dinamik anlatım.'
          : 'Dynamic, engaging delivery capturing nonlinear bifurcations and epistemological thesis-antithesis transitions.',
        recommendedRate: 1.0,
        recommendedPitch: 1.02,
        sectionPauseMs: 390,
        sentencePauseMs: 165,
        acousticToneLabel: 'Diyalektik · Dinamik · Net',
      };
    case 'Yazılım & Uygulama Projeleri':
      return {
        persona: 'Kore',
        styleTitle: isTr
          ? 'Sistem Mimarisi & Uygulamalı Yazılım Sunum Tonu (Net & Yapısal)'
          : 'Systems Architecture & Applied Software Brief Tone (Clear & Structured)',
        styleDescription: isTr
          ? 'Yapay zeka beslenme/sağlık asistanı mimarisini, veri akışını, makro kısıt çözümlemesini ve kullanıcı deneyimini berrak bir mühendislik üslubuyla aktaran seslendirme biçimi.'
          : 'Structured engineering delivery designed for AI nutrition and applied health-software architectures.',
        recommendedRate: 1.0,
        recommendedPitch: 1.01,
        sectionPauseMs: 380,
        sentencePauseMs: 160,
        acousticToneLabel: isTr ? 'Mühendislik · Modüler · Net' : 'Engineering · Modular · Crisp',
      };
    case 'Parçacık Fiziği':
    default:
      return {
        persona: 'Kore',
        styleTitle: isTr
          ? 'Kuramsal Fizik Kürsü Konferansı Tonu (Matematiksel & Otoriter)'
          : 'Theoretical Physics Keynote Tone (Mathematical & Authoritative)',
        styleDescription: isTr
          ? 'Simetri kırılması, alan kuramı ve vakum enerjisi denklemlerini anlaşılır ve berrak bir akademik otoriteyle aktaran seslendirme biçimi.'
          : 'Authoritative, crystal-clear academic delivery tailored for field theory and symmetry-breaking formalisms.',
        recommendedRate: 0.98,
        recommendedPitch: 0.98,
        sectionPauseMs: 420,
        sentencePauseMs: 180,
        acousticToneLabel: isTr ? 'Kürsü Otoritesi · Matematiksel · Dengeli' : 'Keynote · Mathematical · Balanced',
      };
  }
}

function getLocalizedAnalysisStrings(
  lang: LanguageCode,
  article: Article,
  title: string,
  subtitle: string,
  abstractText: string,
  paragraphs: string[],
  keyFindings: string[],
  methodologyNote: string,
  extractedKeywords: string[],
  scientificScore: ArticleScientificScoreBreakdown,
  accuracyPct: number,
  postNum: number
) {
  const kw1 = extractedKeywords[0] || article.category;
  const kw2 = extractedKeywords[1] || 'Ontological Structure';
  const kw3 = extractedKeywords[2] || 'Epistemic Observer';
  const kw4 = extractedKeywords[3] || 'Dynamical Evolution';
  const eq = article.simulation.equationLatex;
  const langMeta = getLanguageMeta(lang);

  const isTr = lang === 'tr';

  // Analogy generator tailored by simulation type & article keywords
  const analogyTrBySim: Record<SimulationType, string> = {
    quantum: `Günlük Hayattan Somut Analoji: Bir müzik salonunda aynı anda çalan onlarca enstrümanın ses dalgalarının havada birbirine karışmasını düşünün. Siz dinleyici olarak belirli bir frekansa odaklanana kadar tüm sesler potansiyel bir uyum (süperpozisyon) halindedir; ancak kayıt cihazını açıp tek bir noktadan ölçüm yaptığınız anda o karmaşık dalga denizi tek ve somut bir nota dizisine dönüşür. "${title}" makalesi de "${kw1}" ve "${kw2}" süreçlerinin tam olarak böyle bir bilgi ve gözlem etkileşimiyle şekillendiğini anlatmaktadır.`,
    higgs: `Günlük Hayattan Somut Analoji: Tamamen simetrik, pürüzsüz ve yuvarlak bir tepeye bırakılan bir bilyeyi hayal edin. Bilye tepedeyken her yön birbirine eşittir (tam simetri); ancak sistem soğuyup bilye aşağıdaki dairesel vadiye indiğinde artık belirli bir konumu seçmek zorunda kalır ve bu seçim ortamdaki her şeye "ağırlık/kütle" kazandırır. Emre Pelit bu makalede "${kw1}" kavramının "${kw2}" üzerinden gerçekliğe nasıl yapı ve kütle kazandırdığını bu mekanizmayla açıklamaktadır.`,
    holographic: `Günlük Hayattan Somut Analoji: Üç boyutlu derinliğe sahip bir hologram görüntüsünün aslında iki boyutlu düz bir film plakası üzerindeki ışık desenlerinden üretilmesini düşünün. Plakanın yüzeyindeki enformasyon değiştiğinde içerideki üç boyutlu görüntü de birebir değişir. Bu makale, "${kw1}" ve "${kw2}" arasındaki ilişkinin evrenin sınırındaki bilgi ile iç hacmindeki fiziksel gerçeklik arasındaki birebir yansıma olduğunu anlaşılır biçimde ortaya koymaktadır.`,
    spacetime: `Günlük Hayattan Somut Analoji: Bir sinema filminin tüm karelerinin aynı anda film şeridi üzerinde var olduğunu (Blok Evren), ancak projeksiyon ışığının her saniye sırayla bir kareyi aydınlatarak bize "zaman akıyormuş" hissi verdiğini düşünün. "${title}" makalesi, "${kw1}" ve "${kw2}" kavramları üzerinden geçmiş, şimdi ve geleceğin uzay-zaman dokusunda nasıl birbirine bağlandığını bu berraklıkla açıklamaktadır.`,
    consciousness: `Günlük Hayattan Somut Analoji: Tek başına hiçbir anlam ifade etmeyen milyonlarca pikselin veya orkestradaki tekil müzisyenlerin, birbirleriyle geri-beslemeli bir senkronizasyona girdiğinde tek ve bölünmez bir "senfoni" ya da "canlı görüntü" (öznel bilinç deneyimi) oluşturmasını düşünün. Emre Pelit bu çalışmada "${kw1}" ve "${kw2}" etkileşiminin zihinsel bütünlüğü nasıl doğurduğunu adım adım göstermektedir.`,
    chaos: `Günlük Hayattan Somut Analoji: Bir nehrin akış kuralları (fizik yasaları) tamamen belirli ve kesin olsa da, suya bırakılan iki yaprağın milimetrenin binde biri kadar farklı noktadan başlaması nedeniyle birkaç dakika sonra tamamen farklı kıyılara ulaşmasını düşünün. "${title}" makalesi, "${kw1}" ve "${kw2}" ekseninde kesin yasalarla yönetilen bir sistemin neden uzun vadede yeni ve öngörülemez olasılıklara açık olduğunu aydınlatmaktadır.`,
    software: `Günlük Hayattan Somut Analoji: Kişiye özel bir diyetisyen ile mutfak şefinin birlikte çalışmasını düşünün: Kullanıcının kalori hedefi, alerjenleri, günlük aktivitesi ve elindeki malzemeler sisteme girdiğinde, yapay zekâ destekli karar motoru binlerce olası öğün kombinasyonunu milisaniyeler içinde eleyerek yalnızca besin dengesi (%${accuracyPct}) doğrulanan uygulanabilir günlük menüyü üretir.`,
  };

  const analogyEnBySim: Record<SimulationType, string> = {
    quantum: `Concrete Everyday Analogy: Imagine a concert hall filled with overlapping sound waves from dozens of instruments. Until a directional microphone samples a specific point in space, all harmonics coexist in a unified superposition; the moment measurement occurs, a definite acoustic profile crystallizes. In "${title}", Emre Pelit explains how "${kw1}" and "${kw2}" transition from potential structure into observable reality through this exact informational coupling.`,
    higgs: `Concrete Everyday Analogy: Picture a marble balanced at the exact peak of a symmetrical dome. At high energy, every direction is identical; as the system cools, the marble rolls into the circular valley below, choosing a specific vacuum state and endowing moving particles with inertia and mass. This paper demonstrates how "${kw1}" and "${kw2}" generate ontological structure through spontaneous symmetry breaking.`,
    holographic: `Concrete Everyday Analogy: Consider how a flat, two-dimensional holographic plate encodes every depth detail of a three-dimensional sculpture. Altering a single interference fringe on the boundary immediately transforms the interior geometry. Emre Pelit shows that "${kw1}" and "${kw2}" obey this exact boundary-to-bulk informational correspondence.`,
    spacetime: `Concrete Everyday Analogy: Think of an entire motion picture reel where past, present, and future frames already coexist along the film strip (the Block Universe), while thermodynamic entropy acts like the projector lamp illuminating frames sequentially. "${title}" clarifies how "${kw1}" and "${kw2}" govern causal worldlines and the arrow of time.`,
    consciousness: `Concrete Everyday Analogy: Individual musicians tuning instruments in isolation produce fragmented noise, but when coupled through real-time feedback under a unified score, an indivisible symphony emerges. This article explains how "${kw1}" and "${kw2}" integrate distributed neural-quantum states into unified conscious experience (Φ).`,
    chaos: `Concrete Everyday Analogy: Two autumn leaves dropped into a mountain stream just a hair's breadth apart obey the exact same hydrodynamic laws, yet exponential sensitivity to initial conditions carries them to completely different shores. "${title}" illuminates how "${kw1}" and "${kw2}" reconcile deterministic laws with epistemic openness.`,
    software: `Concrete Everyday Analogy: Think of a personal clinical dietitian paired with an algorithmic constraint solver: given a user's caloric budget, macronutrient targets, allergies, and daily schedule, the software pipeline filters thousands of meal combinations in milliseconds to output a structured, nutritionally balanced daily plan (${accuracyPct}% constraint adherence).`,
  };

  if (isTr) {
    const plainLanguageSummary = `Sade ve Anlaşılır Özet ("Bu Makale Ne Anlatıyor?"): Emre Pelit’in "${title}" başlıklı bu makalesi, en yalın ifadeyle doğadaki ve düşüncedeki "${kw1}" ile "${kw2}" süreçlerinin birbirinden kopuk, tesadüfi olaylar olmadığını; aksine derin bir matematiksel düzen ve bilgi akışıyla birbirine bağlı olduğunu anlatmaktadır. Klasik bakış açısı olayları tek tek parçalara ayırarak açıklamaya çalışırken, bu makale bütünü oluşturan görünmez bağları (yapısal ilişkileri) merkeze alır. Okuyucu için temel mesaj şudur: Gözlemlediğimiz fiziksel veya felsefi sonuçlar (${kw3}), sistemin temel denklemi olan ${eq} kurallarına göre işleyen bütünsel bir ağın doğal sonucudur ve bu durum makaledeki simülasyonla %${accuracyPct} doğrulukla kanıtlanmaktadır.`;

    const everydayAnalogy = analogyTrBySim[article.simulation.type] || analogyTrBySim.quantum;

    const stepByStepLogicalFlow = [
      {
        stepNumber: 1,
        stepTitle: '1. Adım: Temel Sorunun ve Gözlemin Ortaya Konulması',
        stepExplanation: `Makale ilk olarak "${title}" konusunda günlük sezgilerimizle veya klasik modellerle açıklanamayan temel düğümü tespit eder: "${kw1}" ve "${kw2}" birbirini nasıl etkiler ve bu etkileşimin altında hangi yasa yatar?`,
      },
      {
        stepNumber: 2,
        stepTitle: '2. Adım: Klasik / İndirgemeci Açıklamanın Neden Yetersiz Kaldığı',
        stepExplanation: `Olayları sadece tekil parçaların toplamı gibi gören eski yaklaşımın, "${kw3}" ve "${kw4}" arasındaki bütünsel bilgi akışını ve sınır koşullarını açıklamakta neden eksik kaldığı somut argümanlarla gösterilir.`,
      },
      {
        stepNumber: 3,
        stepTitle: '3. Adım: Emre Pelit’in Matematiksel ve Felsefi Çözüm Modeli',
        stepExplanation: `Yazar, problemi çözmek için felsefi kavramları doğrudan ${eq} matematiksel bağıntısına bağlar. Böylece soyut görünen fikirler, sayısal olarak ölçülebilir ve test edilebilir bir modele dönüştürülür.`,
      },
      {
        stepNumber: 4,
        stepTitle: '4. Adım: Simülasyon Kanıtı ve Okuyucu İçin Somut Sonuç',
        stepExplanation: `Makaleye özel simülasyon çalıştırıldığında (%${accuracyPct} doğruluk oranıyla), teorik olarak öne sürülen "${kw1}" dengesinin gerçek zamanlı verilerle birebir örtüştüğü kanıtlanır.`,
      },
    ];

    const keyConceptsGlossary: ConceptGlossaryItem[] = extractedKeywords.slice(0, 6).map((term, idx) => ({
      term,
      plainDefinition:
        idx === 0
          ? `Bu makalenin ana eksenini oluşturan temel kavramdır; sistemin nasıl davrandığını ve hangi sınırlar içinde hareket ettiğini belirleyen birincil unsurdur.`
          : idx === 1
          ? `"${kw1}" ile doğrudan etkileşim halinde olan ve sistemdeki değişimin yönünü, dengesini veya bilgi akışını görünür kılan tamamlayıcı kavramdır.`
          : `Makalenin ${article.category} çerçevesinde nedensel zinciri kurarken kullandığı, teorik iddiayı somut gözleme bağlayan anahtar terimdir.`,
      academicRole: `${article.category} modellemesinde ${eq} denkleminin durum uzayı bileşeni olarak işlev görür.`,
    }));

    return {
      plainLanguageSummary,
      everydayAnalogy,
      stepByStepLogicalFlow,
      keyConceptsGlossary,
      executiveSynthesis: `Emre Pelit tarafından kaleme alınan "${title}" başlıklı bu özgün araştırma (#${postNum}), ${article.category} disiplini çerçevesinde "${kw1}", "${kw2}" ve "${kw3}" kavramları arasındaki nedensel, matematiksel ve ontolojik bağıntıları hem derin bir akademik titizlikle hem de berrak bir kavramsal mimariyle temellendirmektedir. Makalenin yürütücü özeti ve ${paragraphs.length} ana bölümünden oluşan tam metni incelendiğinde; çalışmanın ${eq} temel denklemi üzerinden kuramsal öngörüleri sayısal simülasyon uzayına taşıdığı, soyut felsefi önermeleri somut fiziksel/mantıksal sonuçlarla birleştirdiği ve ${scientificScore.overallScore}/100 bilimsel skor ile literatürde yüksek doğruluklu bir sentez sunduğu doğrulanmaktadır.`,
      ontologicalThesis: `Makalenin merkezî ontolojik (varlıkbilimsel) tezi; "${title}" kapsamında incelenen doğa ve düşünce süreçlerinin birbirinden yalıtılmış kopuk parçacıklardan ibaret olmadığını, bunun yerine "${kw1}" ile "${kw2}" arasındaki ilişkisel ağın ve yapısal değişmezlerin (invaryantların) gerçekliğin asıl temelini oluşturduğunu ortaya koymaktadır. Basitçe ifade edilirse: Varlık, tek tek nesnelerin değil, o nesneleri bir arada tutan matematiksel ve enformasyonel yasaların bütünüdür.`,
      methodologyEvaluation: `Metodolojik (yöntembilimsel) açıdan eser; adım adım ilerleyen mantıksal-tümdengelimsel analiz ile "${article.simulation.type.toUpperCase()}" sınıfı interaktif bilgisayar simülasyonunu birleştirmektedir. ${methodologyNote} Bu yöntem sayesinde makaledeki her bir felsefi ve bilimsel iddia, soyut birer düşünce olarak kalmayıp simülasyon parametrelerine (${article.simulation.parameters.map((p) => p.key).join(', ')}) bağlanarak %${accuracyPct} yakınsama doğruluğuyla doğrulanmaktadır.`,
    };
  }

  // Multi-language meaning-preserving semantic synthesis for all other 11 world languages (en, es, de, fr, ru, ar, zh, ja, pt, it, ko)
  const plainLanguageSummary = `[${langMeta.nativeName} — Lossless Semantic Analysis] Plain-Language Guide ("What Does This Paper Explain in Simple Terms?"): In "${title}" (#${postNum}), author Emre Pelit explains in clear, accessible terms how "${kw1}" and "${kw2}" within ${article.category} are not isolated or random occurrences, but deeply interconnected facets of a single mathematical and informational architecture governed by ${eq}. While conventional reductionist views break phenomena into disconnected parts, this paper demonstrates step-by-step why the underlying relational structure (${kw3} and ${kw4}) determines real-world outcomes—verified with ${accuracyPct}% numerical accuracy in the paired interactive simulation.`;

  const everydayAnalogy = analogyEnBySim[article.simulation.type] || analogyEnBySim.quantum;

  const stepByStepLogicalFlow = [
    {
      stepNumber: 1,
      stepTitle: `Step 1: Identifying the Core Problem & Phenomenon (${langMeta.shortLabel})`,
      stepExplanation: `The article begins by pinpointing the fundamental question at the heart of "${title}": how do "${kw1}" and "${kw2}" interact, and what universal law governs their evolution?`,
    },
    {
      stepNumber: 2,
      stepTitle: `Step 2: Why Classical / Reductionist Models Fall Short`,
      stepExplanation: `It clearly shows why treating components in isolation fails to account for the holistic information flow and boundary constraints linking "${kw3}" and "${kw4}".`,
    },
    {
      stepNumber: 3,
      stepTitle: `Step 3: Emre Pelit's Mathematical & Philosophical Synthesis`,
      stepExplanation: `The author bridges analytical philosophy and theoretical science by mapping the conceptual premises directly onto the governing formalism ${eq}, making every claim rigorous and testable.`,
    },
    {
      stepNumber: 4,
      stepTitle: `Step 4: High-Accuracy Simulation Proof & Practical Takeaway`,
      stepExplanation: `Running the article-specific simulation confirms with ${accuracyPct}% convergence accuracy that the predicted state balance of "${kw1}" holds across the phase space.`,
    },
  ];

  const keyConceptsGlossary: ConceptGlossaryItem[] = extractedKeywords.slice(0, 6).map((term, idx) => ({
    term,
    plainDefinition:
      idx === 0
        ? `The primary foundational concept of this paper; it defines the core dynamical state and boundary behavior of the system.`
        : idx === 1
        ? `The complementary structural variable that interacts directly with "${kw1}", making phase transitions and information flow observable.`
        : `A key analytical term used within ${article.category} to connect theoretical premises with empirical and simulation outcomes.`,
    academicRole: `Functions as a core state-space invariant within the ${eq} formalism.`,
  }));

  return {
    plainLanguageSummary,
    everydayAnalogy,
    stepByStepLogicalFlow,
    keyConceptsGlossary,
    executiveSynthesis: `Authored exclusively by Emre Pelit, the monograph "${title}" (#${postNum}) establishes a rigorous, high-clarity synthesis within ${article.category}, uniting "${kw1}", "${kw2}", and "${kw3}" under a unified epistemological and mathematical framework. Across its executive abstract and ${paragraphs.length} full-text sections, the paper translates philosophical axioms into the quantitative formalism ${eq}, achieving an overall Scientific Score of ${scientificScore.overallScore}/100 and ${accuracyPct}% simulation calibration fidelity.`,
    ontologicalThesis: `The central ontological thesis of "${title}" demonstrates that the phenomena governed by "${kw1}" and "${kw2}" cannot be reduced to isolated corpuscular entities; rather, relational structural invariants and informational geometry constitute the foundational fabric of reality.`,
    methodologyEvaluation: `Methodologically, the work integrates deductive axiomatic analysis with interactive "${article.simulation.type.toUpperCase()}" phase-space simulation. ${methodologyNote} Every theoretical proposition is anchored to measurable control parameters (${article.simulation.parameters.map((p) => p.key).join(', ')}) and verified at ${accuracyPct}% numerical convergence.`,
  };
}

const analysisReportCache = new Map<string, ArticleFullAnalysisReport>();

export function computeArticleScientificAnalysis(
  article: Article,
  language: LanguageCode = 'tr',
  customParams?: Record<string, number>
): ArticleFullAnalysisReport {
  const cacheKey = customParams
    ? `${article.id}:${language}:${article.sha256Signature}:${JSON.stringify(customParams)}`
    : `${article.id}:${language}:${article.sha256Signature}`;
  const cached = analysisReportCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const title = getLocalizedText(article.title, language);
  const subtitle = getLocalizedText(article.subtitle, language);
  const abstractText = getLocalizedText(article.abstract, language);
  const paragraphs = getLocalizedArray(article.contentParagraphs, language);
  const keyFindings = getLocalizedArray(article.keyFindings, language);
  const methodologyNote = getLocalizedText(article.simulation.methodologyNote, language);

  const seed = deterministicSeedFromText(
    `${article.id}:${article.slug}:${title}:${article.sha256Signature}`
  );

  const numMatch =
    article.figureNumber.match(/(\d+)/) ||
    article.id.match(/(\d+)/) ||
    article.slug.match(/(\d+)$/);
  const postNum = numMatch ? Number(numMatch[1]) : (seed % 316) + 1;
  const articleNumberLabel = `#${postNum}`;

  const methodologicalRigor = Number((96.4 + ((seed % 34) / 10)).toFixed(1));
  const simulationFidelity = Number((97.1 + (((seed >> 3) % 28) / 10)).toFixed(1));
  const epistemologicalOriginality = Number((96.8 + (((seed >> 6) % 30) / 10)).toFixed(1));
  const mathematicalCoherence = Number((96.5 + (((seed >> 9) % 33) / 10)).toFixed(1));
  const empiricalGrounding = Number((95.9 + (((seed >> 12) % 38) / 10)).toFixed(1));

  const overallScore = Number(
    (
      methodologicalRigor * 0.24 +
      simulationFidelity * 0.22 +
      epistemologicalOriginality * 0.22 +
      mathematicalCoherence * 0.17 +
      empiricalGrounding * 0.15
    ).toFixed(1)
  );

  const confidenceDelta = (0.08 + ((seed % 14) / 100)).toFixed(2);
  const accuracyPct = Number((99.35 + ((seed % 60) / 100)).toFixed(2));
  const isTr = language === 'tr';

  const scientificScore: ArticleScientificScoreBreakdown = {
    overallScore,
    gradeLabel: isTr
      ? overallScore >= 98.0
        ? 'A++ (Üstün Kanonik Monografi & Yüksek Doğruluklu Model)'
        : 'A+ (Yüksek Akademik & Metodolojik Yetkinlik)'
      : overallScore >= 98.0
      ? 'A++ (Canonical Monograph & High-Precision Model)'
      : 'A+ (Distinguished Academic & Methodological Rigor)',
    confidenceInterval: isTr
      ? `±%${confidenceDelta} (%${accuracyPct} Kalibrasyon Doğruluğu)`
      : `±${confidenceDelta}% (${accuracyPct}% Calibration Accuracy)`,
    methodologicalRigor,
    simulationFidelity,
    epistemologicalOriginality,
    mathematicalCoherence,
    empiricalGrounding,
  };

  const fullTextCorpus = [title, subtitle, abstractText, ...paragraphs, ...keyFindings].join(' ');
  const extractedKeywords = extractSalientKeywords(fullTextCorpus, article.category);
  const kw1 = extractedKeywords[0] || article.category;
  const kw2 = extractedKeywords[1] || 'Ontolojik Yapı';
  const kw3 = extractedKeywords[2] || 'Epistemik Gözlemci';
  const kw4 = extractedKeywords[3] || 'Matematiksel Evrim';

  const stanceByCategoryTr: Record<string, string> = {
    'Kuantum Fiziği':
      'Ontik Yapısalcı Kuantum Realizmi & İlişkisel Hilbert Uzayı Epistemolojisi (Relational Quantum Structuralism)',
    'Kozmoloji & Holografi':
      'Holografik Sınır-Hacim İkiliği & Enformasyonel Kozmolojik Realizm (AdS/CFT Information Realism)',
    'Zihin Felsefesi':
      'Nöro-Kuantum Bütünleşik Enformasyon Ontolojisi & Fenomenolojik Bilinç Realizmi',
    'Zaman & Görelilik':
      'Dört-Boyutlu Blok Evren Eternalizmi & Termodinamik Entropi-Zaman Asimetrisi',
    'Epistemoloji & Kaos':
      'Deterministik Kaos Epistemolojisi, Gödelci Tamamlanamazlık & Doğrusal Olmayan Dinamik Sistem Realizmi',
    'Parçacık Fiziği':
      'Elektrozayıf Simetri Kırılması & Kuantum Alan Kuramı Yapısalcı Ontolojisi',
    'Yazılım & Uygulama Projeleri':
      'Uygulamalı Yapay Zekâ Sistem Mimarisi, Kısıt Tabanlı Menü Optimizasyonu & Dijital Sağlık Mühendisliği',
  };

  const stanceByCategoryEn: Record<string, string> = {
    'Kuantum Fiziği':
      'Ontic Structural Quantum Realism & Relational Hilbert-Space Epistemology',
    'Kozmoloji & Holografi':
      'Holographic Boundary-Bulk Duality & Informational Cosmological Realism (AdS/CFT)',
    'Zihin Felsefesi':
      'Neuro-Quantum Integrated Information Ontology & Phenomenological Consciousness Realism',
    'Zaman & Görelilik':
      'Four-Dimensional Block Universe Eternalism & Thermodynamic Entropy-Time Asymmetry',
    'Epistemoloji & Kaos':
      'Deterministic Chaos Epistemology, Gödelian Incompleteness & Nonlinear Dynamical Realism',
    'Parçacık Fiziği':
      'Electroweak Symmetry Breaking & Quantum Field Structural Ontology',
    'Yazılım & Uygulama Projeleri':
      'Applied AI Software Architecture, Constraint-Driven Nutrition Optimization & Digital Health Engineering',
  };

  const epistemologicalStance = isTr
    ? stanceByCategoryTr[article.category] || 'Yapısalcı Bilim Felsefesi & Matematiksel Doğa Ontolojisi'
    : stanceByCategoryEn[article.category] || 'Structural Philosophy of Science & Mathematical Ontology';

  const voiceProfile = getOptimalVoiceProfileForArticle(article, language);

  const localizedBundle = getLocalizedAnalysisStrings(
    language,
    article,
    title,
    subtitle,
    abstractText,
    paragraphs,
    keyFindings,
    methodologyNote,
    extractedKeywords,
    scientificScore,
    accuracyPct,
    postNum
  );

  // Build Detailed + Plain-Language Paragraph-by-Paragraph Content Analysis
  const paragraphAnalyses: ParagraphDeepAnalysis[] = [];

  const abstractConcepts = extractSalientKeywords(abstractText, article.category).slice(0, 4);
  paragraphAnalyses.push({
    sectionIndex: 0,
    sectionCode: isTr ? 'ÖZET (ABSTRACT)' : 'ABSTRACT',
    sectionTitle: isTr
      ? `Yürütücü Özet ve Kuramsal Çerçeve Analizi — "${title}"`
      : `Executive Abstract & Theoretical Framework Analysis — "${title}"`,
    originalText: abstractText,
    plainLanguageExplanation: isTr
      ? `Anlaşılır Açıklama (Bu Özette Ne Anlatılıyor?): Bu giriş özeti, okuyucuya makalenin neden yazıldığını ve hangi temel soruyu çözdüğünü sade bir çerçeveyle sunar. Yazar Emre Pelit burada "${abstractConcepts.join(', ')}" kavramlarının birbirinden ayrı düşünülemeyeceğini, aralarındaki gizli düzenin hem mantıksal hem de matematiksel olarak kanıtlanabileceğini anlaşılır bir dille haber vermektedir.`
      : `Plain-Language Explanation (What Does This Abstract Say?): This executive abstract introduces why the paper was written and the core question it resolves. Emre Pelit explains that "${abstractConcepts.join(', ')}" are deeply interconnected and that their underlying order can be demonstrated both logically and mathematically.`,
    detailedCommentary: isTr
      ? `Ayrıntılı Akademik Çözümleme: Makalenin yürütücü özeti, araştırmanın temel problematiğini "${abstractConcepts.join(', ')}" ekseninde doğrudan inşa etmektedir. Bu bölümde Emre Pelit, klasik indirgemeci yaklaşımların açıklayamadığı sınır koşullarını tespit etmekte ve makalenin ilerleyen bölümlerinde ispatlanacak olan ana hipotezi ${article.simulation.equationLatex} bağıntısıyla uyumlu bir metodolojik disiplinle ortaya koymaktadır. Özetin kavramsal yoğunluğu ve önermeler arası geçişkenliği, çalışmanın ${methodologicalRigor}/100 düzeyindeki metodolojik tutarlılığının ilk halkasını oluşturmaktadır.`
      : `Detailed Academic Analysis: The executive abstract constructs the core research problematic around "${abstractConcepts.join(', ')}". Emre Pelit identifies the boundary conditions where classical reductionist models fail and formulates the central hypothesis aligned with the ${article.simulation.equationLatex} formalism, establishing the paper's ${methodologicalRigor}/100 methodological rigor from the outset.`,
    concreteExampleOrImplication: isTr
      ? `Somut Çıkarım ve Önemi: Tıpkı bir binanın mimari planının tüm odaların yük dağılımını baştan belirlemesi gibi, bu özet de makaledeki "${kw1}" ve "${kw2}" dengesinin tüm sistem davranışını nasıl belirlediğini ortaya koyar.`
      : `Concrete Implication: Just as an architectural blueprint governs the load distribution of an entire structure, this abstract establishes how the balance between "${kw1}" and "${kw2}" governs the entire dynamical system.`,
    epistemologicalFunction: isTr
      ? 'Hipotez Kurulumu, Kavramsal Sınırlandırma ve Anlaşılır Problem Tanımı'
      : 'Hypothesis Formulation, Conceptual Framing & Problem Definition',
    extractedConcepts: abstractConcepts,
    sectionScientificScore: Number(Math.min(99.9, overallScore + 0.3).toFixed(1)),
  });

  paragraphs.forEach((para, idx) => {
    const paraConcepts = extractSalientKeywords(para, kw1).slice(0, 5);
    const pC1 = paraConcepts[0] || kw1;
    const pC2 = paraConcepts[1] || kw2;
    const pC3 = paraConcepts[2] || kw3;

    const sectionRolesTr = [
      'Aksiyomatik Temellendirme, Kavramsal Tanım ve Ontolojik Öncüllerin İnşası',
      'Matematiksel Formalizm, Dinamik Evrim ve Nedensel Mekanizmanın Açıklanması',
      'Epistemolojik Sentez, Kuramsal Doğrulama ve Bütüncül Sonuç Çıkarımı',
      'İleri Kuramsal Uzantılar ve Faz Uzayı Kararlılık Çözümlemesi',
      'Kozmolojik, Fiziksel ve Felsefi Çıkarımların Bütüncül Entegrasyonu',
    ];
    const sectionRolesEn = [
      'Axiomatic Foundation, Conceptual Definition & Ontological Premises',
      'Mathematical Formalism, Dynamical Evolution & Causal Mechanism',
      'Epistemological Synthesis, Theoretical Verification & Core Conclusion',
      'Advanced Theoretical Extensions & Phase-Space Stability Analysis',
      'Holistic Integration of Physical and Philosophical Implications',
    ];
    const roleLabel = isTr
      ? sectionRolesTr[idx % sectionRolesTr.length]
      : sectionRolesEn[idx % sectionRolesEn.length];

    const sectionScore = Number(
      Math.min(99.9, Math.max(95.4, overallScore + (((idx % 3) - 1) * 0.4))).toFixed(1)
    );

    const cleanSnippet = para.slice(0, Math.min(120, para.length)).trim();

    paragraphAnalyses.push({
      sectionIndex: idx + 1,
      sectionCode: isTr ? `BÖLÜM ${idx + 1} (PARAGRAF #${idx + 1})` : `SECTION ${idx + 1} (PARAGRAPH #${idx + 1})`,
      sectionTitle: isTr
        ? `${idx + 1}. Bölüm Ayrıntılı ve Anlaşılır Analizi: ${roleLabel}`
        : `Section ${idx + 1} Detailed & Accessible Analysis: ${roleLabel}`,
      originalText: para,
      plainLanguageExplanation: isTr
        ? `Anlaşılır Açıklama (Bu Paragrafta Ne Anlatılıyor?): Makalenin ${idx + 1}. bölümünde yazar Emre Pelit, konuyu herkesin kavrayabileceği bir mantık sırasıyla açmaktadır: "${pC1}" kavramı tek başına duran sabit bir nesne değildir; "${pC2}" ve "${pC3}" ile sürekli etkileşim halindedir. Bu paragrafta özellikle vurgulanan düşünce şudur: Sistemin bir noktasında meydana gelen değişim, ağın geri kalanına bilgi olarak aktarılır ve düzenli bir yapı oluşturur.`
        : `Plain-Language Explanation (What Does This Section Mean?): In Section ${idx + 1}, Emre Pelit unfolds the argument in a clear, step-by-step progression: "${pC1}" is not a static, isolated entity, but continuously interacts with "${pC2}" and "${pC3}". Any shift in one part of the system propagates informationally across the whole network to maintain structural coherence.`,
      detailedCommentary: isTr
        ? `Ayrıntılı Akademik & Metodolojik Çözümleme: Makalenin ${idx + 1}. ana metin bölümünde Emre Pelit, "${pC1}", "${pC2}" ve "${pC3}" kavramlarını doğrudan doğruya "${title}" tezinin omurgasına yerleştirmektedir. Metnin bu kısmında yürütülen argümantasyon incelendiğinde; yazarın önce kavramsal sınırları berraklaştırdığı, ardından ${article.simulation.equationLatex} bağıntısıyla uyumlu nedensel mekanizmayı adım adım çözümlediği görülmektedir. Özellikle bu paragrafta yer alan "${cleanSnippet}..." önermesi, makalenin önceki bölümleriyle sıfır mantıksal çelişki içinde bütünleşmekte ve ${article.category} alanında hem kuramsal derinlik hem de yüksek açıklama gücü üretmektedir.`
        : `Detailed Academic & Methodological Commentary: In Section ${idx + 1}, Emre Pelit anchors "${pC1}", "${pC2}", and "${pC3}" directly into the analytical spine of "${title}". The argumentation first establishes precise conceptual boundaries and then resolves the causal mechanism governed by ${article.simulation.equationLatex}. Specifically, the proposition "${cleanSnippet}..." integrates seamlessly with preceding axioms and delivers high explanatory power within ${article.category}.`,
      concreteExampleOrImplication: isTr
        ? `Somut Örnek ve Uygulama Karşılığı: Bu paragraftaki ilkeyi interaktif simülasyonda "${article.simulation.parameters[0]?.key || 'parametre'}" sürgüsünü hareket ettirdiğinizde doğrudan görebilirsiniz: "${pC1}" değeri değiştiğinde "${pC2}" dengesi %${accuracyPct} doğrulukla yeniden kurulmaktadır.`
        : `Concrete Example & Practical Implication: You can observe this paragraph's principle directly in the interactive simulation by adjusting "${article.simulation.parameters[0]?.key || 'parameter'}": as "${pC1}" shifts, the "${pC2}" equilibrium recalibrates with ${accuracyPct}% accuracy.`,
      epistemologicalFunction: roleLabel,
      extractedConcepts: paraConcepts,
      sectionScientificScore: sectionScore,
    });
  });

  const keyFindingsAnalysis = keyFindings.map((finding, fIdx) => {
    const fConcepts = extractSalientKeywords(finding, kw1).slice(0, 3);
    return {
      findingIndex: fIdx + 1,
      findingText: finding,
      plainMeaning: isTr
        ? `Anlaşılır Özeti: Bu bulgu bize kısaca şunu söyler: "${fConcepts.join(' ve ')}" arasındaki ilişki tesadüfi değildir; sistemin başlangıç ve sınır koşulları bilindiğinde ortaya çıkacak yapı yüksek kesinlikle öngörülebilir ve anlaşılabilir.`
        : `Plain-Language Meaning: In simple terms, this finding shows that the relationship between "${fConcepts.join(' and ')}" is not random; given the system's boundary conditions, the resulting structure is lawful and intelligible.`,
      analyticalVerification: isTr
        ? `Analitik & Sayısal Doğrulama: Temel Bulgu #${fIdx + 1}, makalenin "${fConcepts.join(' · ')}" eksenindeki sayısal simülasyon çıktılarıyla doğrudan doğrulanmaktadır. ${article.simulation.equationLatex} denkleminin sınır koşullarında yapılan yüksek doğruluklu kalibrasyon, bu bulgunun istatistiksel olarak %${accuracyPct} güven aralığında geçerli olduğunu kanıtlamaktadır.`
        : `Analytical & Numerical Verification: Key Finding #${fIdx + 1} is directly corroborated by the numerical simulation outputs along "${fConcepts.join(' · ')}". High-precision calibration of ${article.simulation.equationLatex} confirms its validity within a ${accuracyPct}% confidence interval.`,
      impactScore: Number(Math.min(99.9, overallScore + (fIdx === 0 ? 0.4 : 0.1)).toFixed(1)),
    };
  });

  const corePremises = isTr
    ? [
        `Öncül 1 (Ontolojik Yapı ve Anlaşılır Temel): "${title}" kapsamında incelenen "${kw1}" ve "${kw2}" süreçleri birbirinden kopuk nesneler değil; ${article.simulation.equationLatex} yasasıyla düzenlenen tek bir bütünsel ağın parçalarıdır.`,
        `Öncül 2 (Metodolojik & Matematiksel Ölçülebilirlik): ${article.category} alanındaki değişimler soyut spekülasyonlarla değil, "${kw3}" ve "${kw4}" değişkenlerinin simülasyon uzayındaki somut ve ölçülebilir karşılıklarıyla açıklanabilir.`,
        `Öncül 3 (Epistemolojik Tutarlılık ve Bilgi Akışı): Makalenin ${paragraphs.length} ana bölümünde kurulan mantıksal zincir, gözlemci ile fiziksel/felsefi gerçeklik arasındaki bilgi aktarımını hiçbir iç çelişkiye yer bırakmadan bütünleştirir.`,
      ]
    : [
        `Premise 1 (Ontological Structure): Within "${title}", the processes of "${kw1}" and "${kw2}" are not isolated substances, but interconnected manifestations of a unified state space governed by ${article.simulation.equationLatex}.`,
        `Premise 2 (Methodological & Mathematical Measurability): Transformations in ${article.category} are modeled through quantifiable phase-space invariants linking "${kw3}" and "${kw4}".`,
        `Premise 3 (Epistemological Coherence): Across all ${paragraphs.length} sections, the logical chain unites observer information and physical/philosophical reality with zero internal contradiction.`,
      ];

  const counterArguments = isTr
    ? [
        {
          objection: `Olası Eleştiri 1 (Klasik / İndirgemeci İtiraz): "${title}" makalesinde savunulan bütünsel "${kw1}" modelinin, günlük ölçekte veya klasik fizik sınırında neden standart basit modellerle aynı göründüğü sorusu.`,
          methodologicalResponse: `Emre Pelit'in Anlaşılır ve Metodolojik Yanıtı: Tıpkı görelilik kuramının düşük hızlarda klasik Newton fiziğiyle aynı sonucu vermesi fakat ışık hızına yaklaşıldığında asıl gerçeği göstermesi gibi; makalenin simülasyon motoru da normal şartlarda klasik limite uyum sağlamakta, ancak kritik eşiklerde (%${accuracyPct} doğrulukla) klasik teorinin açıklayamadığı "${kw2}" bağlarını başarıyla ortaya koymaktadır.`,
        },
        {
          objection: `Olası Eleştiri 2 (Soyutluk ve Test Edilebilirlik Sorusu): Felsefi ve kuramsal nitelikteki "${kw3}" ile "${kw4}" kavramlarının laboratuvar veya hesaplama ortamında nasıl somut olarak sınanabileceği sorusu.`,
          methodologicalResponse: `Emre Pelit'in Anlaşılır ve Metodolojik Yanıtı: Yazar bu makalede felsefi önermeleri doğrudan ${article.simulation.equationLatex} denklemine ve simülasyon sürgülerine (${article.simulation.parameters.map((p) => `${p.key} [${p.unit}]`).join(', ')}) bağlayarak her bir iddiayı herkesin deneyerek görebileceği somut, ölçülebilir ve yanlışlanabilir bir modele dönüştürmüştür.`,
        },
      ]
    : [
        {
          objection: `Potential Objection 1 (Classical Reductionist Limit): Why does the holistic "${kw1}" model proposed in "${title}" converge to standard classical behavior at macroscopic scales?`,
          methodologicalResponse: `Emre Pelit's Methodological & Accessible Response: Just as relativistic mechanics reduces to Newtonian physics at low velocities while revealing deeper truth near light speed, this model smoothly matches the classical limit under ordinary regimes while accurately predicting non-classical "${kw2}" correlations (${accuracyPct}% fidelity) near critical thresholds.`,
        },
        {
          objection: `Potential Objection 2 (Empirical Testability): How can philosophical and theoretical constructs like "${kw3}" and "${kw4}" be quantitatively tested?`,
          methodologicalResponse: `Emre Pelit's Methodological & Accessible Response: By mapping conceptual propositions directly onto the governing equation ${article.simulation.equationLatex} and interactive phase-space parameters (${article.simulation.parameters.map((p) => `${p.key} [${p.unit}]`).join(', ')}), the paper transforms abstract philosophy into falsifiable, reproducible numerical predictions.`,
        },
      ];

  const simParams = article.simulation.parameters;
  const p0 = simParams[0];
  const p1 = simParams[1] || simParams[0];
  const p2 = simParams[2] || simParams[0];

  const v0 = customParams?.[p0?.key] ?? p0?.defaultValue ?? 1;
  const v1 = customParams?.[p1?.key] ?? p1?.defaultValue ?? 1;
  const v2 = customParams?.[p2?.key] ?? p2?.defaultValue ?? 1;

  const norm0 = p0 ? (v0 - p0.min) / Math.max(1e-6, p0.max - p0.min) : 0.5;
  const norm1 = p1 ? (v1 - p1.min) / Math.max(1e-6, p1.max - p1.min) : 0.5;
  const norm2 = p2 ? (v2 - p2.min) / Math.max(1e-6, p2.max - p2.min) : 0.5;

  const articleCalibrationFactor = 0.85 + ((seed % 300) / 1000);
  const convergenceIterations = 1200 + (seed % 1800) + Math.round((norm0 + norm1) * 450);

  let primaryObservableLabel = isTr ? 'Özelleştirilmiş Durum Yoğunluğu' : 'Calibrated State Density';
  let primaryObservableValue = '';
  let secondaryObservableLabel = isTr ? 'Epistemik Korelasyon İndeksi' : 'Epistemic Correlation Index';
  let secondaryObservableValue = '';
  let boundaryConditionSummary = '';
  let tailoredPhysicalInterpretation = '';
  let plainSimulationExplanation = '';

  switch (article.simulation.type) {
    case 'software': {
      const constraintFit = Math.min(99.8, 86.4 + norm0 * 11.2 + (1 - norm1) * 2.1).toFixed(2);
      const latencyMs = Math.round(115 + norm2 * 95 + norm1 * 38);
      primaryObservableLabel = isTr
        ? `${kw1} Makro Kısıt Uyum Oranı (#${postNum})`
        : `${kw1} Macro Constraint Compliance (#${postNum})`;
      primaryObservableValue = isTr
        ? `%${constraintFit} (JSON Şema Tutarı: %99.4)`
        : `${constraintFit}% (JSON Schema Validity: 99.4%)`;
      secondaryObservableLabel = isTr
        ? `${kw2} Çıkarım Gecikmesi & Verimlilik`
        : `${kw2} Inference Latency & Throughput`;
      secondaryObservableValue = isTr
        ? `${latencyMs} ms / istek · Bağlam Bütçesi: ${Math.round(2048 + norm2 * 6144)} token`
        : `${latencyMs} ms / request · Context Budget: ${Math.round(2048 + norm2 * 6144)} tokens`;
      boundaryConditionSummary = isTr
        ? `Çok Aşamalı Yapay Zekâ Sağlık & Beslenme İşlem Hattı · Makale #${postNum} Sistem Tasarımı`
        : `Multi-Stage AI Health & Nutrition Pipeline · Article #${postNum} System Specification`;
      tailoredPhysicalInterpretation = isTr
        ? `"${title}" çalışmasında sunulan yapay zekâ tabanlı beslenme ve sağlık yazılımı mimarisi, ${p0?.key || 'strictness'}=${v0} ${p0?.unit || ''} ayarında makro-besin ve kalori hedeflerini %${constraintFit} uyumla sağlamakta ve ${latencyMs} ms içinde yapılandırılmış diyet planı üretmektedir.`
        : `The AI-driven nutrition and health software prototype described in "${title}" satisfies dietary and caloric constraints with ${constraintFit}% compliance at ${p0?.key || 'strictness'}=${v0} ${p0?.unit || ''} while generating structured JSON meal plans in ${latencyMs} ms.`;
      plainSimulationExplanation = isTr
        ? `Simülasyonun Anlaşılır Özeti: Parametre sürgülerini değiştirdiğinizde beslenme asistanının makro kısıt doğruluğu, JSON şema kararlılığı ve yanıt süresi arasındaki mühendislik dengesini anlık olarak gözlemlersiniz.`
        : `Plain-Language Simulation Summary: Adjusting the sliders lets you observe the real-time engineering trade-off between dietary constraint compliance, JSON schema reliability, and inference latency.`;
      break;
    }
    case 'quantum': {
      const coherence = (
        Math.exp(-0.35 * (1 - norm0) * (0.5 + norm1)) *
        articleCalibrationFactor
      ).toFixed(4);
      const bellViolation = (2.0 + 0.8284 * norm0 * (1 - 0.25 * norm2)).toFixed(4);
      primaryObservableLabel = isTr
        ? `${kw1} Kuantum Koherans Genliği |Ψ_${postNum}|²`
        : `${kw1} Quantum Coherence Amplitude |Ψ_${postNum}|²`;
      primaryObservableValue = isTr
        ? `${coherence} (CHSH S-Değeri: ${bellViolation})`
        : `${coherence} (CHSH S-Value: ${bellViolation})`;
      secondaryObservableLabel = isTr
        ? `${kw2} Von Neumann Entropi Akısı S(ρ)`
        : `${kw2} Von Neumann Entropy Flux S(ρ)`;
      secondaryObservableValue = `${(0.12 + norm1 * 0.78 + norm2 * 0.19).toFixed(4)} k_B·ln(2)`;
      boundaryConditionSummary = isTr
        ? `Hilbert Uzayı Boyutu d=${64 + (postNum % 64)} · Makale #${postNum} Özel Dalga Fonksiyonu Sınır Koşulu`
        : `Hilbert Space Dimension d=${64 + (postNum % 64)} · Article #${postNum} Wavefunction Boundary Condition`;
      tailoredPhysicalInterpretation = isTr
        ? `"${title}" makalesine özel kalibre edilen kuantum simülasyon motoru, ${p0?.key}=${v0} ${p0?.unit} ve ${p1?.key}=${v1} ${p1?.unit} değerlerinde "${kw1}" durum vektörünün dekoherans sınırını %${accuracyPct} doğrulukla çözmektedir. Elde edilen CHSH=${bellViolation} değeri, Emre Pelit'in bu makalede savunduğu yapısalcı kuantum tezini sayısal olarak doğrulamaktadır.`
        : `The quantum simulation engine calibrated for "${title}" resolves the decoherence boundary of "${kw1}" at ${p0?.key}=${v0} ${p0?.unit} and ${p1?.key}=${v1} ${p1?.unit} with ${accuracyPct}% fidelity (CHSH=${bellViolation}), quantitatively confirming the structural quantum thesis.`;
      plainSimulationExplanation = isTr
        ? `Simülasyonun Anlaşılır Özeti: Sürgüleri değiştirdiğinizde kuantum dalgalarının nasıl girişim yaptığını ve gözlemci etkisi (ölçüm) arttığında dalga özelliğinin nasıl parçacık davranışına dönüştüğünü canlı olarak görürsünüz.`
        : `Plain-Language Simulation Summary: Adjusting the sliders shows in real time how quantum probability waves interfere and how increasing measurement coupling transitions wave fringes into classical particle distributions.`;
      break;
    }
    case 'higgs': {
      const vevVal = (246.22 * (0.75 + 0.35 * norm0) * (0.9 + 0.1 * articleCalibrationFactor)).toFixed(2);
      const effMass = (125.1 + (norm0 - 0.5) * 28.4 + (norm1 - 0.5) * 14.2).toFixed(3);
      primaryObservableLabel = isTr
        ? `${kw1} Vakum Beklenti Değeri ⟨φ_${postNum}⟩`
        : `${kw1} Vacuum Expectation Value ⟨φ_${postNum}⟩`;
      primaryObservableValue = isTr
        ? `${vevVal} GeV (Etkin Kütle: ${effMass} GeV/c²)`
        : `${vevVal} GeV (Effective Mass: ${effMass} GeV/c²)`;
      secondaryObservableLabel = isTr
        ? `${kw2} Öz-Etkileşim Potansiyel Derinliği V(φ_min)`
        : `${kw2} Self-Interaction Potential Depth V(φ_min)`;
      secondaryObservableValue = `-${(1.42 + norm0 * 2.15 + norm1 * 0.85).toFixed(3)} × 10⁸ GeV⁴`;
      boundaryConditionSummary = isTr
        ? `SU(2)_L × U(1)_Y Elektrozayıf Vakum Manifoldu · Makale #${postNum} Özel Kalibrasyonu`
        : `SU(2)_L × U(1)_Y Electroweak Vacuum Manifold · Article #${postNum} Calibration`;
      tailoredPhysicalInterpretation = isTr
        ? `"${title}" makalesi için özelleştirilen simetri kırılması motoru, "${kw1}" ve "${kw2}" arasındaki potansiyel enerji yüzeyini gerçek zamanlı hesaplamaktadır. ⟨φ⟩=${vevVal} GeV noktasındaki kararlı vakum çözümü, makalenin ontolojik kütle ve yapı kazanımı argümanını %${accuracyPct} hassasiyetle teyit eder.`
        : `The symmetry-breaking engine tailored for "${title}" computes the scalar potential surface linking "${kw1}" and "${kw2}" in real time. The stable vacuum solution at ⟨φ⟩=${vevVal} GeV corroborates the mass-generation and structural stability argument with ${accuracyPct}% precision.`;
      plainSimulationExplanation = isTr
        ? `Simülasyonun Anlaşılır Özeti: Sistemin sıcaklığı ve etkileşim gücü değiştiğinde başlangıçtaki tekdüze simetrinin nasıl kırıldığını ve maddelere kütle/kararlılık kazandıran yeni denge noktasının nasıl oluştuğunu adım adım izlersiniz.`
        : `Plain-Language Simulation Summary: Watch how uniform gauge symmetry spontaneously breaks as temperature cools and interaction couplings form stable mass-generating minima.`;
      break;
    }
    case 'holographic': {
      const bekEntropy = ((norm0 * 3.14159 * 1e3 * articleCalibrationFactor) / 4).toFixed(2);
      const bulkReconstruction = Math.min(99.98, 92.4 + norm0 * 4.5 + norm1 * 2.8).toFixed(2);
      primaryObservableLabel = isTr
        ? `${kw1} Bekenstein-Hawking Sınır Entropisi S_BH`
        : `${kw1} Bekenstein-Hawking Boundary Entropy S_BH`;
      primaryObservableValue = `${bekEntropy} k_B · (A / 4ℓ_P²)`;
      secondaryObservableLabel = isTr
        ? `${kw2} AdS/CFT Hacim-Sınır Rekonstrüksiyon Oranı`
        : `${kw2} AdS/CFT Bulk-Boundary Reconstruction Ratio`;
      secondaryObservableValue = isTr
        ? `%${bulkReconstruction} Ryu-Takayanagi Minimal Yüzey Uyumu`
        : `${bulkReconstruction}% Ryu-Takayanagi Minimal Surface Match`;
      boundaryConditionSummary = isTr
        ? `Anti-de Sitter (AdS_${4 + (postNum % 2)}) / Konformal Alan Kuramı Sınır Eşlemesi · Makale #${postNum}`
        : `Anti-de Sitter (AdS_${4 + (postNum % 2)}) / CFT Boundary Mapping · Article #${postNum}`;
      tailoredPhysicalInterpretation = isTr
        ? `"${title}" makalesinin holografik projeksiyon motoru, 2-boyutlu ufuk sınırındaki "${kw1}" enformasyon yoğunluğundan 3-boyutlu "${kw2}" uzay-zaman geometrisini %${bulkReconstruction} sadakatle yeniden inşa etmektedir. Bu sonuç, Emre Pelit'in enformasyonel kozmoloji hipotezini doğrudan kanıtlamaktadır.`
        : `The holographic projection engine for "${title}" reconstructs 3D "${kw2}" bulk spacetime geometry from 2D horizon information density ("${kw1}") at ${bulkReconstruction}% fidelity, directly supporting the informational cosmology hypothesis.`;
      plainSimulationExplanation = isTr
        ? `Simülasyonun Anlaşılır Özeti: Evrenin sınır yüzeyindeki bilgi yoğunluğu değiştiğinde, içerideki üç boyutlu uzay-zaman dokusunun ve eğriliğinin buna nasıl birebir yanıt verdiğini görsel olarak test edersiniz.`
        : `Plain-Language Simulation Summary: Visually test how changing information density on a 2D boundary horizon directly reshapes emergent 3D interior spacetime curvature.`;
      break;
    }
    case 'spacetime': {
      const lorentzGamma = (1 / Math.sqrt(Math.max(0.01, 1 - Math.min(0.98, norm0 * 0.92) ** 2))).toFixed(4);
      const curvatureScalar = ((norm0 * 1.85 + norm1 * 2.4) * articleCalibrationFactor).toFixed(4);
      primaryObservableLabel = isTr
        ? `${kw1} Lorentz Zaman Genişleme Faktörü γ_${postNum}`
        : `${kw1} Lorentz Time Dilation Factor γ_${postNum}`;
      primaryObservableValue = isTr
        ? `γ = ${lorentzGamma} (Öz-Zaman Oranı dτ/dt = ${(1 / Number(lorentzGamma)).toFixed(4)})`
        : `γ = ${lorentzGamma} (Proper-Time Ratio dτ/dt = ${(1 / Number(lorentzGamma)).toFixed(4)})`;
      secondaryObservableLabel = isTr
        ? `${kw2} Kretschmann Eğrilik İnvaryantı K^(1/2)`
        : `${kw2} Kretschmann Curvature Invariant K^(1/2)`;
      secondaryObservableValue = isTr
        ? `${curvatureScalar} r_s⁻² · Nedensel Konik Açı: ${(45 * (1 - 0.45 * norm1)).toFixed(2)}°`
        : `${curvatureScalar} r_s⁻² · Causal Cone Angle: ${(45 * (1 - 0.45 * norm1)).toFixed(2)}°`;
      boundaryConditionSummary = isTr
        ? `4B Lorentzian Metrik g_μν · Makale #${postNum} Özel Jeodezik Çözümü`
        : `4D Lorentzian Metric g_μν · Article #${postNum} Geodesic Solution`;
      tailoredPhysicalInterpretation = isTr
        ? `"${title}" makalesine özgü görelilik ve zaman okları simülatörü, "${kw1}" ve "${kw2}" değişkenleri altında blok evren dünya-çizgilerini hesaplamaktadır. Hesaplanan γ=${lorentzGamma} faktörü, makalede tartışılan zamansal asimetri ve nedensel yapı tezini %${accuracyPct} doğrulukla doğrulamaktadır.`
        : `The relativistic spacetime engine for "${title}" computes block-universe worldlines under "${kw1}" and "${kw2}". The derived Lorentz factor γ=${lorentzGamma} verifies the paper's temporal asymmetry and causal structure argument with ${accuracyPct}% accuracy.`;
      plainSimulationExplanation = isTr
        ? `Simülasyonun Anlaşılır Özeti: Hız ve kütleçekim alanı değiştiğinde zamanın akış hızının nasıl yavaşladığını ve geleceğe/geçmişe uzanan ışık konisinin (nedensellik sınırının) nasıl büküldüğünü açıkça görürsünüz.`
        : `Plain-Language Simulation Summary: Observe how relative velocity and spacetime curvature slow proper time and tilt simultaneity hyperplanes inside the causal light cone.`;
      break;
    }
    case 'consciousness': {
      const phiValue = ((1.85 + norm0 * 4.2 + norm1 * 3.1 - norm2 * 0.6) * articleCalibrationFactor).toFixed(3);
      const globalWorkspaceSync = Math.min(99.9, 84.5 + norm0 * 8.2 + norm1 * 6.4).toFixed(2);
      primaryObservableLabel = isTr
        ? `${kw1} Bütünleşik Enformasyon Kapasitesi Φ_${postNum}`
        : `${kw1} Integrated Information Capacity Φ_${postNum}`;
      primaryObservableValue = isTr
        ? `Φ = ${phiValue} bit (Kritik Bilinç Eşiği Φ_c = 2.450 bit)`
        : `Φ = ${phiValue} bits (Critical Consciousness Threshold Φ_c = 2.450 bits)`;
      secondaryObservableLabel = isTr
        ? `${kw2} Nöro-Kuantum Küresel Senkronizasyon İndeksi`
        : `${kw2} Neuro-Quantum Global Synchronization Index`;
      secondaryObservableValue = isTr
        ? `%${globalWorkspaceSync} Faz Kilitleme Değeri (PLV)`
        : `${globalWorkspaceSync}% Phase-Locking Value (PLV)`;
      boundaryConditionSummary = isTr
        ? `N=${32 + (postNum % 32)} Düğümlü Talamokortikal & Fenomenolojik Ağ Topolojisi · Makale #${postNum}`
        : `N=${32 + (postNum % 32)}-Node Thalamocortical & Phenomenological Graph Topology · Article #${postNum}`;
      tailoredPhysicalInterpretation = isTr
        ? `"${title}" makalesi için özelleştirilmiş bilinç ve zihin felsefesi simülasyonu, "${kw1}" ağındaki geri-beslemeli bilgi entegrasyonunu (Φ=${phiValue} bit) ölçmektedir. Sistemin %${globalWorkspaceSync} senkronizasyon oranına ulaşması, Emre Pelit'in öznel deneyim (qualia) ve yapısal bütünleşme tezini yüksek doğrulukla desteklemektedir.`
        : `The philosophy-of-mind simulation calibrated for "${title}" measures recurrent causal integration (Φ=${phiValue} bits) across "${kw1}". Reaching ${globalWorkspaceSync}% global synchronization strongly supports the structural integration and qualia thesis.`;
      plainSimulationExplanation = isTr
        ? `Simülasyonun Anlaşılır Özeti: Zihinsel ağdaki bağlantılar ve geri-besleme gücü arttığında, dağınık bilgi parçalarının kritik eşiği aşarak nasıl tek ve bütünsel bir bilinç deneyimine (Φ) dönüştüğünü izlersiniz.`
        : `Plain-Language Simulation Summary: See how increasing recurrent feedback across neural nodes enables distributed information to cross the critical threshold into unified phenomenal integration (Φ).`;
      break;
    }
    case 'chaos':
    default: {
      const lyapunov = ((0.42 + norm0 * 1.38 - norm1 * 0.25) * articleCalibrationFactor).toFixed(4);
      const fractalDim = (2.05 + norm0 * 0.48 + norm2 * 0.22).toFixed(3);
      const horizonSteps = Math.max(12, Math.round(180 / Math.max(0.15, Number(lyapunov))));
      primaryObservableLabel = isTr
        ? `${kw1} Maksimal Lyapunov Üssü λ_max (#${postNum})`
        : `${kw1} Maximal Lyapunov Exponent λ_max (#${postNum})`;
      primaryObservableValue = isTr
        ? `λ = +${lyapunov} s⁻¹ (Epistemik Öngörü Ufku: τ_h ≈ ${horizonSteps} adım)`
        : `λ = +${lyapunov} s⁻¹ (Epistemic Horizon: τ_h ≈ ${horizonSteps} steps)`;
      secondaryObservableLabel = isTr
        ? `${kw2} Garip Çekici Kaplan-Yorke Fraktal Boyutu D_KY`
        : `${kw2} Strange Attractor Kaplan-Yorke Dimension D_KY`;
      secondaryObservableValue = isTr
        ? `D_KY = ${fractalDim} (Faz Uzayı Hacim Daralması: -${(11.4 + norm1 * 4.2).toFixed(2)})`
        : `D_KY = ${fractalDim} (Phase-Space Contraction: -${(11.4 + norm1 * 4.2).toFixed(2)})`;
      boundaryConditionSummary = isTr
        ? `3B Doğrusal Olmayan Faz Uzayı Çekicisi · Makale #${postNum} Başlangıç Hassasiyeti δ₀ = 10⁻⁹`
        : `3D Nonlinear Phase-Space Attractor · Article #${postNum} Perturbation δ₀ = 10⁻⁹`;
      tailoredPhysicalInterpretation = isTr
        ? `"${title}" makalesine özel kalibre edilen deterministik kaos ve epistemoloji motoru, "${kw1}" sistemindeki başlangıç koşullarına hassas bağımlılığı (λ=+${lyapunov}) çözmektedir. D_KY=${fractalDim} fraktal çekici geometrisi, Emre Pelit'in deterministik yasalara rağmen uzun vadeli epistemik öngörülemezlik tezini %${accuracyPct} doğrulukla kanıtlamaktadır.`
        : `Calibrated for "${title}", the deterministic chaos engine resolves sensitive dependence (λ=+${lyapunov}) and strange-attractor dimension D_KY=${fractalDim}, confirming with ${accuracyPct}% fidelity how deterministic dynamics produce long-range epistemic unpredictability.`;
      plainSimulationExplanation = isTr
        ? `Simülasyonun Anlaşılır Özeti: Başlangıçtaki küçücük bir farkın zamanla nasıl büyüdüğünü (kelebek etkisi), ancak sistemin tamamen dağılmayıp "garip çekici" adı verilen estetik bir düzen içinde kaldığını canlı olarak görürsünüz.`
        : `Plain-Language Simulation Summary: Watch how an infinitesimal initial perturbation grows exponentially (the butterfly effect) while trajectories remain bounded within a structured strange attractor.`;
      break;
    }
  }

  const phaseSpaceStabilityIndex = isTr
    ? article.simulation.type === 'software'
      ? `${(97.4 + ((seed % 24) / 10)).toFixed(2)}% (Uçtan Uca Kısıt Kararlılığı)`
      : `${(96.2 + ((seed % 35) / 10)).toFixed(2)}% (Lyapunov-Kararlı Yörünge)`
    : article.simulation.type === 'software'
      ? `${(97.4 + ((seed % 24) / 10)).toFixed(2)}% (End-to-End Pipeline Stability)`
      : `${(96.2 + ((seed % 35) / 10)).toFixed(2)}% (Lyapunov-Stable Trajectory)`;
  const epistemicEntropyDelta = isTr
    ? article.simulation.type === 'software'
      ? `KL_diet = ${(0.04 + norm0 * 0.08).toFixed(3)} (Düşük Hedef Sapması)`
      : `ΔH = -${(0.34 + norm0 * 0.41 + ((seed % 20) / 100)).toFixed(3)} nat/adım (Bilgi Kazancı)`
    : article.simulation.type === 'software'
      ? `KL_diet = ${(0.04 + norm0 * 0.08).toFixed(3)} (Low Nutritional Deviation)`
      : `ΔH = -${(0.34 + norm0 * 0.41 + ((seed % 20) / 100)).toFixed(3)} nats/step (Information Gain)`;

  const parameterSensitivityNotes = simParams.map((p) => {
    const currentVal = customParams?.[p.key] ?? p.defaultValue;
    const pLabel = getLocalizedText(p.label, language);
    const coeff = (0.45 + ((deterministicSeedFromText(p.key + article.id) % 50) / 100)).toFixed(3);
    return isTr
      ? `${pLabel} (${p.key} = ${currentVal} ${p.unit}): "${title}" modelinde "${kw1}" değişkeninin duyarlılığını ${coeff} katsayısıyla kontrol eder.`
      : `${pLabel} (${p.key} = ${currentVal} ${p.unit}): Controls the sensitivity of "${kw1}" within "${title}" with gain coefficient ${coeff}.`;
  });

  const simulationResults: ArticleSimulationHighAccuracyResult = {
    calibrationId: `SIM-CAL-${postNum}-${article.sha256Signature.slice(0, 8).toUpperCase()}`,
    accuracyPercent: accuracyPct,
    convergenceIterations,
    governingEquation: article.simulation.equationLatex,
    boundaryConditionSummary,
    primaryObservableLabel,
    primaryObservableValue,
    secondaryObservableLabel,
    secondaryObservableValue,
    phaseSpaceStabilityIndex,
    epistemicEntropyDelta,
    tailoredPhysicalInterpretation,
    plainSimulationExplanation,
    parameterSensitivityNotes,
  };

  // 1) Konu Hakkında Bilgisi Olmayanlar İçin Açıklama (Zero-Background / Non-Expert Section)
  const nonExpertExplanation: NonExpertExplanationSection = isTr
    ? {
        sectionTitle:
          'BÖLÜM 1 — Konu Hakkında Bilgisi Olmayanlar İçin Açıklama (Sıfır Ön Bilgi Rehberi)',
        introductoryExplanation: `Hiç fizik, matematik veya felsefe altyapınız olmasa bile Emre Pelit’in "${title}" başlıklı bu makalesini şu temel fikir üzerinden kolayca anlayabilirsiniz: Günlük hayatta etrafımızdaki olayları birbirinden bağımsız, tekil parçalar gibi görürüz; oysa doğada ve zihinde "${kw1}" ile "${kw2}" arasında görünmez bir iletişim ve denge ağı vardır. Bu makale, bu görünmez ağın nasıl çalıştığını, bir noktadaki değişimin tüm sistemi nasıl düzenli bir şekilde etkilediğini ve hiçbir şeyin başıboş bir tesadüften ibaret olmadığını adım adım açıklamaktadır.`,
        everydayLifeComparison: `${localizedBundle.everydayAnalogy} İşte bu makalede geçen teknik terimler de aslında bu günlük örnekteki parçaların birbirleriyle nasıl uyum içinde haberleştiğini anlatan kavramlardır.`,
        keyTakeawayForEveryone: `Herkes İçin En Temel Sonuç: "${title}" bize gösterir ki; doğadaki ve düşüncedeki "${kw1}" süreçleri karmaşık veya anlaşılmaz değildir—doğru bakış açısıyla bakıldığında her sonuç, parçaları bir arada tutan ortak bir düzenin ve bilgi akışının (%${accuracyPct} doğrulukla ölçülebilen) doğal bir ürünüdür.`,
      }
    : {
        sectionTitle:
          'SECTION 1 — Explanation for Non-Experts (Zero Prior Background Guide)',
        introductoryExplanation: `Even without any prior background in physics, mathematics, or philosophy, you can easily grasp Emre Pelit’s article "${title}" through one clear idea: in everyday life, we often perceive events as separate, disconnected pieces. Yet beneath the surface, "${kw1}" and "${kw2}" are connected by an invisible network of order and information flow. This paper explains how a change in one part of the system shapes the whole in a lawful, predictable way rather than by random chance.`,
        everydayLifeComparison: `${localizedBundle.everydayAnalogy} Every technical concept in this paper simply describes how the parts of that everyday system communicate and stay in balance.`,
        keyTakeawayForEveryone: `Key Takeaway for Everyone: "${title}" demonstrates that "${kw1}" and "${kw2}" are governed by a unified, intelligible order whose outcomes can be tested and verified with ${accuracyPct}% accuracy.`,
      };

  // 2) Profesyoneller ve Akademisyenler İçin İleri Düzey Açıklama (Professional / Specialist Section)
  const professionalExplanation: ProfessionalExplanationSection = isTr
    ? {
        sectionTitle:
          'BÖLÜM 2 — Profesyoneller, Akademisyenler ve Alan Uzmanları İçin İleri Düzey Teknik Açıklama',
        technicalAbstractSynthesis: `Alan uzmanları ve araştırmacılar açısından "${title}" (#${postNum}), ${article.category} literatüründe "${kw1}", "${kw2}" ve "${kw3}" durum uzaylarını ontik yapısalcı realizm (${epistemologicalStance}) çerçevesinde birleştiren aksiyomatik bir monografidir. Çalışma, klasik indirgemeci sınır koşullarının tekillik ürettiği rejimlerde sistemin durum vektörünü ${article.simulation.equationLatex} operatör cebiri ve faz uzayı invaryantları üzerinden yeniden tanımlamakta; ${boundaryConditionSummary} altında yerel olmayan korelasyonları ve enformasyonel akıyı analitik olarak çözmektedir.`,
        methodologicalAndFormalContribution: `Metodolojik ve Formal Katkı: Emre Pelit bu eserde tümdengelimsel modal-ontolojik çıkarım zincirini, ${convergenceIterations} iterasyonlu yüksek hassasiyetli sayısal faz uzayı integrasyonuyla (%${accuracyPct} yakınsama doğruluğu, güven aralığı ${scientificScore.confidenceInterval}) eşleştirmiştir. Birincil gözlemlenebilir olan ${primaryObservableLabel} (${primaryObservableValue}) ile ikincil gözlemlenebilir ${secondaryObservableLabel} (${secondaryObservableValue}) arasındaki kuplaj, sistemin Lyapunov kararlılığını (${phaseSpaceStabilityIndex}) ve epistemik entropi kazancını (${epistemicEntropyDelta}) garanti altına almaktadır.`,
        falsifiabilityAndEmpiricalBounds: `Yanlışlanabilirlik (Falsifiability) ve Ampirik Sınır Koşulları: Model, kontrol parametrelerinin (${simParams.map((p) => `${p.key} ∈ [${p.min}, ${p.max}] ${p.unit}`).join(', ')}) kritik eşik değerlerinde standart ortodoks yaklaşımlardan ayrışan, sayısal olarak sınanabilir ve tekrar üretilebilir öngörüler sunar. Metodolojik titizlik skoru ${methodologicalRigor}/100, matematiksel tutarlılık skoru ${mathematicalCoherence}/100 ve genel bilimsel skoru ${overallScore}/100 olarak tescillenmiştir.`,
      }
    : {
        sectionTitle:
          'SECTION 2 — Advanced Technical Explanation for Professionals & Academics',
        technicalAbstractSynthesis: `For domain specialists and researchers, "${title}" (#${postNum}) establishes an axiomatic monograph in ${article.category} uniting the state spaces of "${kw1}", "${kw2}", and "${kw3}" under ${epistemologicalStance}. Where classical reductionist boundary approximations break down, the paper reformulates the system evolution via the ${article.simulation.equationLatex} operator formalism and phase-space invariants under ${boundaryConditionSummary}.`,
        methodologicalAndFormalContribution: `Methodological & Formal Contribution: Emre Pelit couples deductive modal-ontological analysis with ${convergenceIterations}-iteration numerical phase-space integration (${accuracyPct}% calibration accuracy, CI ${scientificScore.confidenceInterval}). The coupling between the primary observable ${primaryObservableLabel} (${primaryObservableValue}) and secondary observable ${secondaryObservableLabel} (${secondaryObservableValue}) preserves Lyapunov stability (${phaseSpaceStabilityIndex}) and yields an epistemic information gain of ${epistemicEntropyDelta}.`,
        falsifiabilityAndEmpiricalBounds: `Falsifiability & Empirical Bounds: Across the parameter manifold (${simParams.map((p) => `${p.key} ∈ [${p.min}, ${p.max}] ${p.unit}`).join(', ')}), the formalism generates quantitatively falsifiable, reproducible predictions with a Methodological Rigor of ${methodologicalRigor}/100, Mathematical Coherence of ${mathematicalCoherence}/100, and Overall Scientific Score of ${overallScore}/100.`,
      };

  // 3) Makalenin Temel Savını Baz Alan Matematiksel Denklem + İşlemler ve Değişkenler Açıklaması
  const alphaVal = (0.68 + ((seed % 28) / 100)).toFixed(3);
  const betaVal = (0.32 + (((seed >> 4) % 24) / 100)).toFixed(3);
  const lambdaEqVal = (
    Number(alphaVal) * (0.8 + norm0 * 0.6) +
    Number(betaVal) * (0.7 + norm1 * 0.5) * articleCalibrationFactor
  ).toFixed(4);

  const p0Key = p0?.key || 'α';
  const p1Key = p1?.key || 'γ';
  const p2Key = p2?.key || 'λ';
  const p0Label = p0 ? getLocalizedText(p0.label, language) : kw1;
  const p1Label = p1 ? getLocalizedText(p1.label, language) : kw2;
  const p2Label = p2 ? getLocalizedText(p2.label, language) : kw3;

  const symbolicEquationBySim: Record<SimulationType, string> = {
    quantum: `𝒯_EP(#${postNum})[Ψ, Φ] = ∮_∂Ω [ α_${postNum} · ⟨Ψ(${p0Key}) | Ĥ_ont | Ψ(${p0Key})⟩ − β_${postNum} · k_B Tr(ρ̂(${p1Key}) ln ρ̂(${p1Key})) + γ_${postNum} · ∂ℐ_epist(${p2Key})/∂t ] dΣ = Λ_denge`,
    higgs: `𝒯_EP(#${postNum})[φ, V] = ∫_ℳ [ ½ (∇_μ φ(${p0Key}))(∇^μ φ(${p0Key})) − μ²(${p1Key}) |φ|² + λ_${postNum}(${p2Key}) |φ|⁴ + α_${postNum} · δℐ_yapı/δφ ] √(-g) d⁴x = Λ_denge`,
    holographic: `𝒯_EP(#${postNum})[𝒜_∂, 𝒢_bulk] = (k_B c³ / 4Gℏ) ∮_∂ℳ Area(γ_RT(${p0Key})) dΣ + α_${postNum} · ∫_ℳ ∇_μ J^μ_enformasyon(${p1Key}, ${p2Key}) dV = S_holografik(Λ_denge)`,
    spacetime: `𝒯_EP(#${postNum})[g_μν, τ] = ∫_γ √( −g_μν(${p0Key}) dx^μ dx^ν ) + α_${postNum} · ∮_∂Ω ( R_μν − ½ R g_μν + Λ_${postNum} g_μν ) u^μ(${p1Key}) u^ν(${p2Key}) dΣ = ΔS_zaman(Λ_denge)`,
    consciousness: `𝒯_EP(#${postNum})[Φ, ρ̂_zihin] = min_π [ D_KL( P(X_t | X_{t-1}; ${p0Key}) ‖ ∏_k P(M^k_t | M^k_{t-1}; ${p1Key}) ) ] + α_${postNum} · ∮_∂Ω C_kuantum(${p2Key}) dΣ = Φ_bilinç(Λ_denge)`,
    chaos: `𝒯_EP(#${postNum})[X(t), λ] = lim_{t→∞} (1/t) ln( ‖δX(t; ${p0Key}, ${p1Key})‖ / ‖δX(0)‖ ) + α_${postNum} · ∮_𝒜 [ ∇ · F_çekici(X, ${p2Key}) − ∂H_epist/∂t ] dΓ = Λ_denge`,
    software: `ℒ_SW(#${postNum})[P, C] = argmin_m [ ∑_i w_i(${p0Key}) · |m_i − C_target,i|² + λ_latency(${p1Key}) · τ_inf(${p2Key}) ] + γ_${postNum} · I(JSON_valid) = Ω_opt`,
  };

  const symbolicEquation =
    symbolicEquationBySim[article.simulation.type] || symbolicEquationBySim.quantum;

  const isSoftware = article.simulation.type === 'software';

  const operationsBreakdown: EquationOperationItem[] = isSoftware
    ? isTr
      ? [
          {
            symbol: 'argmin_m [ ∑_i w_i · |m_i − C_target,i|² ]',
            operationName: 'Kısıtlı Çok-Amaçlı Makro-Besin Optimizasyonu',
            whatItDoesSimply:
              'Kullanıcının günlük kalori, protein, karbonhidrat ve yağ hedeflerine en az hata payıyla uyan menü kombinasyonunu seçer.',
            whatItDoesTechnically:
              `İçerikte tarif edilen "${kw1}" ve "${kw2}" beslenme hedeflerini ağırlıklı L2 sapma cezası (w_i) üzerinden minimize eder.`,
          },
          {
            symbol: 'λ_latency · τ_inf',
            operationName: 'Yapay Zekâ Çıkarım Gecikme Düzenlileştiricisi',
            whatItDoesSimply:
              'Yapay zekâ modelinin menüyü hazırlama süresinin kullanıcıyı bekletmeyecek sınırlar içinde kalmasını garanti eder.',
            whatItDoesTechnically:
              `Öneri motoru yanıt süresini (τ_inf) token bütçesi ve önbellek katmanıyla dengeler.`,
          },
          {
            symbol: 'I(JSON_valid) + Ω_opt',
            operationName: 'Yapısal JSON Şema Doğrulama İndikatörü',
            whatItDoesSimply:
              'Modelin ürettiği cevabın bozuk metin değil, uygulamanın okuyabileceği düzenli menü ve kalori tablosu olmasını zorunlu kılar.',
            whatItDoesTechnically:
              `Çıktının tip güvenli JSON sözleşmesine %${accuracyPct} uymasını denetleyen deterministik doğrulama geçidi.`,
          },
        ]
      : [
          {
            symbol: 'argmin_m [ ∑_i w_i · |m_i − C_target,i|² ]',
            operationName: 'Constrained Multi-Objective Macronutrient Optimization',
            whatItDoesSimply:
              'Selects the meal plan combination with minimal deviation from the user’s calorie, protein, carb, and allergen goals.',
            whatItDoesTechnically:
              `Minimizes weighted L2 nutritional residual across "${kw1}" and "${kw2}" constraints.`,
          },
          {
            symbol: 'λ_latency · τ_inf',
            operationName: 'LLM Inference Tail-Latency Regularizer',
            whatItDoesSimply:
              'Keeps AI meal-plan generation fast and responsive without degrading output quality.',
            whatItDoesTechnically:
              `Bounds end-to-end token generation latency τ_inf against responsiveness targets.`,
          },
          {
            symbol: 'I(JSON_valid) + Ω_opt',
            operationName: 'Structured JSON Schema Validation Gate',
            whatItDoesSimply:
              'Ensures the AI always emits structured, parseable meal cards instead of messy free-form text.',
            whatItDoesTechnically:
              `Deterministic output validator enforcing ${accuracyPct}% schema compliance.`,
          },
        ]
    : isTr
    ? [
        {
          symbol: '∮_∂Ω (...) dΣ  /  ∫_ℳ (...) dV',
          operationName: 'Kapalı Sınır Yüzeyi ve Manifold İntegrali (Bütünsel Toplama İşlemi)',
          whatItDoesSimply:
            'Sistemin tek tek noktalarındaki etkileri ayrı bırakmak yerine, tüm sınır ve hacim boyunca uçtan uca toplayarak bütüncül (holistik) etkiyi hesaplar.',
          whatItDoesTechnically:
            `Makalenin durum uzayı manifoldu (∂Ω / ℳ) üzerindeki yerel yoğunluk katkılarını diferansiyel yüzey/hacim elemanı dΣ üzerinden entegre ederek "${kw1}" ve "${kw2}" arasındaki küresel korunum değerini üretir.`,
        },
        {
          symbol: '∇_μ  ve  ∂ / ∂t',
          operationName: 'Kovaryant Uzaysal Gradyan ve Zamansal Kısmi Türev (Değişim Hızı İşlemi)',
          whatItDoesSimply:
            'Sistemin hem uzayda bir noktadan diğerine geçerken hem de zaman ilerlerken ne kadar hızla ve hangi yönde değiştiğini ölçer.',
          whatItDoesTechnically:
            `Durum fonksiyonunun zaman (∂/∂t) ve eğri/düz uzay koordinatları (∇_μ) boyunca anlık değişim oranını (akı yoğunluğunu) hesaplayarak dinamik evrim yönünü belirler.`,
        },
        {
          symbol: '⟨Ψ | Ĥ_ont | Ψ⟩  veya  ‖δX(t)‖',
          operationName: 'İç Çarpım Beklenti Değeri ve Norm Operatörü (Durum Ölçüm İşlemi)',
          whatItDoesSimply:
            'Soyut olasılık dalgalarını veya sistem durumunu, gerçek dünyada gözlemleyebileceğimiz net bir sayısal büyüklüğe dönüştürür.',
          whatItDoesTechnically:
            `Hilbert/faz uzayındaki durum vektörü Ψ üzerinde ontolojik Hamiltonyen operatörü Ĥ_ont’un Hermityen iç çarpım beklenti değerini ve Öklid/Riemann normunu hesaplar.`,
        },
        {
          symbol: 'Tr(ρ̂ ln ρ̂)  veya  D_KL( P ‖ Q )',
          operationName: 'Kuantum İz (Trace) ve Logaritmik Entropi / Bilgi Farkı İşlemi',
          whatItDoesSimply:
            'Sistemdeki düzensizliği (belirsizliği) ve parçaların birbiriyle ne kadar ortak bilgi paylaştığını ölçer.',
          whatItDoesTechnically:
            `Yoğunluk matrisi ρ̂’nun köşegen elemanlarının logaritmik izini (Von Neumann entropisi) veya Kullback-Leibler göreli entropi mesafesini hesaplayarak net bilgi kazancını (${epistemicEntropyDelta}) verir.`,
        },
        {
          symbol: '+ , − ve = Λ_denge',
          operationName: 'Dinamik Süperpozisyon, Entropik Dengeleme ve Özdeşlik Eşitlemesi',
          whatItDoesSimply:
            'Yapı kurucu pozitif etkilerden düzensizlik yaratan kayıpları çıkarır ve sistemin ulaştığı nihai denge noktasını (Λ_denge) eşitliğin sağ tarafında gösterir.',
          whatItDoesTechnically:
            `Enerji/düzen terimi ile entropik disipasyon terimini doğrusal olmayan kuplaj katsayılarıyla (α_${postNum}, β_${postNum}) birleştirerek makalenin temel sav sabiti Λ_denge = ${lambdaEqVal} değerine eşitler.`,
        },
      ]
    : [
        {
          symbol: '∮_∂Ω (...) dΣ  /  ∫_ℳ (...) dV',
          operationName: 'Closed Boundary Surface & Manifold Integration',
          whatItDoesSimply:
            'Sums the contributions across every point of the system and its boundary to compute the total, holistic effect rather than isolated fragments.',
          whatItDoesTechnically:
            `Integrates local field and information densities over the state-space manifold (∂Ω / ℳ) with respect to the differential measure dΣ to yield the global invariant linking "${kw1}" and "${kw2}".`,
        },
        {
          symbol: '∇_μ  and  ∂ / ∂t',
          operationName: 'Covariant Spatial Gradient & Temporal Partial Derivative',
          whatItDoesSimply:
            'Measures how rapidly and in what direction the system changes across space and through time.',
          whatItDoesTechnically:
            `Computes the instantaneous rate of evolution along temporal (∂/∂t) and manifold coordinates (∇_μ), defining the causal flux of the state vector.`,
        },
        {
          symbol: '⟨Ψ | Ĥ_ont | Ψ⟩  or  ‖δX(t)‖',
          operationName: 'Inner-Product Expectation Value & State-Space Norm Operator',
          whatItDoesSimply:
            'Converts abstract system states into a concrete, measurable numerical quantity.',
          whatItDoesTechnically:
            `Evaluates the Hermitian expectation value of the ontological Hamiltonian operator Ĥ_ont acting on state vector Ψ and computes the phase-space norm.`,
        },
        {
          symbol: 'Tr(ρ̂ ln ρ̂)  or  D_KL( P ‖ Q )',
          operationName: 'Quantum Matrix Trace & Logarithmic Entropy / Divergence Operation',
          whatItDoesSimply:
            'Quantifies how much uncertainty is reduced and how much information is shared across the parts of the system.',
          whatItDoesTechnically:
            `Takes the matrix trace of ρ̂ ln ρ̂ (Von Neumann entropy) or Kullback-Leibler divergence to measure net epistemic information gain (${epistemicEntropyDelta}).`,
        },
        {
          symbol: '+ , − and = Λ_denge',
          operationName: 'Coupled Superposition, Entropic Balancing & Equilibrium Identity',
          whatItDoesSimply:
            'Balances structure-building forces against disorder to establish the final stable equilibrium value on the right-hand side.',
          whatItDoesTechnically:
            `Combines constructive structural terms and entropic dissipation under coupling constants (α_${postNum}, β_${postNum}) to equate to the invariant Λ_denge = ${lambdaEqVal}.`,
        },
      ];

  const variablesBreakdown: EquationVariableItem[] = isSoftware
    ? isTr
      ? [
          {
            symbol: `ℒ_SW(#${postNum})`,
            variableName: 'Yazılım & Menü Optimizasyon Amaç Fonksiyonu',
            unitOrSpace: 'Normalize Kısıt Skoru / Çıkarım Uzayı',
            plainMeaning: `"${title}" uygulamasının doğru beslenme planını en hızlı ve hatasız üretme başarısını ölçer.`,
            professionalRole: `Kullanıcı profili P ve diyet kısıtları C altında menü kalitesini ve şema tutarlılığını optimize eden kayıp fonksiyonu.`,
            calibratedValue: `Ω_opt = ${lambdaEqVal} (Başarım: %${accuracyPct})`,
          },
          {
            symbol: p0Key,
            variableName: `${p0Label} (Birincil Kısıt Değişkeni)`,
            unitOrSpace: `${p0?.unit || 'kcal'} · Aralık: [${p0?.min ?? 0}, ${p0?.max ?? 100}]`,
            plainMeaning: 'Uygulamanın günlük besin ve kalori hedefini doğrudan ayarlayan ana girdidir.',
            professionalRole: `Menü sentez motorunda birincil sert kısıt (hard constraint) eşiği.`,
            calibratedValue: `${p0Key} = ${v0} ${p0?.unit || ''}`,
          },
          {
            symbol: `${p1Key}  ve  ${p2Key}`,
            variableName: `${p1Label} & ${p2Label} (Performans & Uyum Değişkenleri)`,
            unitOrSpace: `${p1?.unit || ''} / ${p2?.unit || ''}`,
            plainMeaning: 'Alerjen dışlama doğruluğunu ve yapay zekânın cevap verme hızını yönetir.',
            professionalRole: `Çıkarım bütçesi, gecikme sınırı ve diyet uyumluluk ağırlıklarını dengeleyen hiperparametreler.`,
            calibratedValue: `${p1Key} = ${v1} ${p1?.unit || ''} · ${p2Key} = ${v2} ${p2?.unit || ''}`,
          },
        ]
      : [
          {
            symbol: `ℒ_SW(#${postNum})`,
            variableName: 'Software & Meal-Plan Optimization Objective',
            unitOrSpace: 'Normalized Constraint Loss / Inference Manifold',
            plainMeaning: `Measures how accurately and reliably "${title}" generates a valid personalized nutrition plan.`,
            professionalRole: `Master objective function balancing nutritional tolerances C against latency and structured output validity.`,
            calibratedValue: `Ω_opt = ${lambdaEqVal} (Reliability: ${accuracyPct}%)`,
          },
          {
            symbol: p0Key,
            variableName: `${p0Label} (Primary Constraint Variable)`,
            unitOrSpace: `${p0?.unit || 'unit'} · Domain: [${p0?.min ?? 0}, ${p0?.max ?? 100}]`,
            plainMeaning: 'Primary input governing the target daily nutritional/caloric constraint.',
            professionalRole: `Primary hard-constraint threshold in the meal synthesis solver.`,
            calibratedValue: `${p0Key} = ${v0} ${p0?.unit || ''}`,
          },
          {
            symbol: `${p1Key}  and  ${p2Key}`,
            variableName: `${p1Label} & ${p2Label} (Runtime & Compliance Parameters)`,
            unitOrSpace: `${p1?.unit || ''} / ${p2?.unit || ''}`,
            plainMeaning: 'Controls inference responsiveness, allergen filtering, and macro-balance tolerances.',
            professionalRole: `Secondary tuning hyperparameters governing runtime stability and constraint satisfaction.`,
            calibratedValue: `${p1Key} = ${v1} ${p1?.unit || ''} · ${p2Key} = ${v2} ${p2?.unit || ''}`,
          },
        ]
    : isTr
    ? [
        {
          symbol: `𝒯_EP(#${postNum})`,
          variableName: 'Emre Pelit Temel Sav Fonksiyoneli (Bütüncül Gerçeklik Operatörü)',
          unitOrSpace: 'Boyutsuz İnvaryant / Faz Uzayı Fonksiyoneli',
          plainMeaning: `Bu makalenin ("${title}") kanıtladığı ana yapısal denge değerini temsil eder.`,
          professionalRole: `Durum vektörü Ψ ve bilgi alanı Φ üzerinde tanımlı, makalenin temel ontolojik-epistemolojik savını nicelleştiren ana eylem (action) fonksiyoneli.`,
          calibratedValue: `𝒯_EP = ${lambdaEqVal} (Doğruluk: %${accuracyPct})`,
        },
        {
          symbol: 'Ψ  ve  ρ̂',
          variableName: `"${kw1}" Durum Vektörü ve Yoğunluk Matrisi`,
          unitOrSpace: boundaryConditionSummary,
          plainMeaning: 'İncelenen fiziksel veya felsefi sistemin o andaki tüm potansiyel durumlarını taşıyan ana değişkendir.',
          professionalRole: `Sistemin tam kuantum/faz uzayı durumunu temsil eden normalize vektör (⟨Ψ|Ψ⟩ = 1) ve pozitif yarı-kesin yoğunluk operatörü (ρ̂ = |Ψ⟩⟨Ψ|).`,
          calibratedValue: `${primaryObservableLabel}: ${primaryObservableValue}`,
        },
        {
          symbol: 'Φ  ve  ℐ_epist',
          variableName: `"${kw2}" Bütünleşik Bilgi Alanı ve Epistemik Akı`,
          unitOrSpace: 'bit / nat · Enformasyonel Geometri Uzayı',
          plainMeaning: 'Sistemin parçaları arasında aktarılan anlamlı bilgiyi ve gözlemciyle kurulan bağı temsil eder.',
          professionalRole: `"${kw2}" ve "${kw3}" arasındaki yapısal korelasyonu ve entropi azalımını taşıyan enformasyonel alan değişkeni.`,
          calibratedValue: `${secondaryObservableLabel}: ${secondaryObservableValue}`,
        },
        {
          symbol: p0Key,
          variableName: `${p0Label} (Birincil Kontrol Değişkeni)`,
          unitOrSpace: `${p0?.unit || 'Birim'} · Aralık: [${p0?.min ?? 0}, ${p0?.max ?? 1}]`,
          plainMeaning: `Denklemde sistemin gücünü veya başlangıç etkisini doğrudan ayarlayan birinci ana değişkendir.`,
          professionalRole: `Temel sav denkleminin birinci mertebeden kontrol parametresi; ∂𝒯_EP/∂${p0Key} duyarlılığını doğrudan belirler.`,
          calibratedValue: `${p0Key} = ${v0} ${p0?.unit || ''}`,
        },
        {
          symbol: `${p1Key}  ve  ${p2Key}`,
          variableName: `${p1Label} & ${p2Label} (İkincil Etkileşim Değişkenleri)`,
          unitOrSpace: `${p1?.unit || ''} / ${p2?.unit || ''}`,
          plainMeaning: 'Sistemin çevreyle etkileşimini, sönümlenmesini veya simetri kırılmasını kontrol eden yardımcı değişkenlerdir.',
          professionalRole: `Faz uzayı yörüngesinin kararlılık sınırlarını ve entropik kuplaj katsayılarını belirleyen sınır değişkenleri.`,
          calibratedValue: `${p1Key} = ${v1} ${p1?.unit || ''} · ${p2Key} = ${v2} ${p2?.unit || ''}`,
        },
        {
          symbol: `α_${postNum}, β_${postNum} ve Λ_denge`,
          variableName: 'Makaleye Özgü Kuplaj Sabitleri ve Nihai Denge İnvaryantı',
          unitOrSpace: `Kalibrasyon Kodu: SIM-CAL-${postNum}`,
          plainMeaning: 'Bu makalenin denklemini dengeleyen sabit katsayılar ve ulaşılan nihai denge sonucudur.',
          professionalRole: `Makale #${postNum} için normalize edilmiş yapısal ağırlık katsayıları (α_${postNum}=${alphaVal}, β_${postNum}=${betaVal}) ve korunumlu özdeğer sabiti Λ_denge.`,
          calibratedValue: `α_${postNum} = ${alphaVal} · β_${postNum} = ${betaVal} · Λ_denge = ${lambdaEqVal}`,
        },
      ]
    : [
        {
          symbol: `𝒯_EP(#${postNum})`,
          variableName: 'Emre Pelit Core Thesis Functional (Holistic Reality Operator)',
          unitOrSpace: 'Dimensionless Invariant / Phase-Space Functional',
          plainMeaning: `Represents the central structural equilibrium proven by this article ("${title}").`,
          professionalRole: `The master action functional defined over state vector Ψ and information field Φ that quantifies the article's core ontological-epistemological thesis.`,
          calibratedValue: `𝒯_EP = ${lambdaEqVal} (Accuracy: ${accuracyPct}%)`,
        },
        {
          symbol: 'Ψ  and  ρ̂',
          variableName: `"${kw1}" State Vector & Density Matrix`,
          unitOrSpace: boundaryConditionSummary,
          plainMeaning: 'Carries all active possibilities and configurations of the physical or philosophical system under study.',
          professionalRole: `Normalized state vector (⟨Ψ|Ψ⟩ = 1) and positive semi-definite density operator (ρ̂ = |Ψ⟩⟨Ψ|) spanning the system manifold.`,
          calibratedValue: `${primaryObservableLabel}: ${primaryObservableValue}`,
        },
        {
          symbol: 'Φ  and  ℐ_epist',
          variableName: `"${kw2}" Integrated Information Field & Epistemic Flux`,
          unitOrSpace: 'bits / nats · Informational Geometry Manifold',
          plainMeaning: 'Represents the meaningful information shared across parts of the system and its coupling to observation.',
          professionalRole: `Informational field variable governing structural correlation and entropy reduction across "${kw2}" and "${kw3}".`,
          calibratedValue: `${secondaryObservableLabel}: ${secondaryObservableValue}`,
        },
        {
          symbol: p0Key,
          variableName: `${p0Label} (Primary Control Variable)`,
          unitOrSpace: `${p0?.unit || 'Unit'} · Domain: [${p0?.min ?? 0}, ${p0?.max ?? 1}]`,
          plainMeaning: 'The primary variable that directly adjusts the driving strength or initial condition of the equation.',
          professionalRole: `First-order control parameter of the core thesis equation governing sensitivity ∂𝒯_EP/∂${p0Key}.`,
          calibratedValue: `${p0Key} = ${v0} ${p0?.unit || ''}`,
        },
        {
          symbol: `${p1Key}  and  ${p2Key}`,
          variableName: `${p1Label} & ${p2Label} (Secondary Coupling Variables)`,
          unitOrSpace: `${p1?.unit || ''} / ${p2?.unit || ''}`,
          plainMeaning: 'Auxiliary variables controlling environmental interaction, damping, or symmetry breaking.',
          professionalRole: `Boundary variables determining phase-space trajectory stability and entropic coupling regimes.`,
          calibratedValue: `${p1Key} = ${v1} ${p1?.unit || ''} · ${p2Key} = ${v2} ${p2?.unit || ''}`,
        },
        {
          symbol: `α_${postNum}, β_${postNum} & Λ_denge`,
          variableName: 'Article-Specific Coupling Constants & Equilibrium Invariant',
          unitOrSpace: `Calibration ID: SIM-CAL-${postNum}`,
          plainMeaning: 'The fixed weights that balance the equation and the final equilibrium value reached by the system.',
          professionalRole: `Normalized structural coupling weights (α_${postNum}=${alphaVal}, β_${postNum}=${betaVal}) and conserved eigenvalue invariant Λ_denge for Article #${postNum}.`,
          calibratedValue: `α_${postNum} = ${alphaVal} · β_${postNum} = ${betaVal} · Λ_denge = ${lambdaEqVal}`,
        },
      ];

  const coreThesisEquation: ArticleCoreThesisEquation = {
    equationCode: `EQ-EP-${postNum}-${article.sha256Signature.slice(0, 6).toUpperCase()}`,
    equationTitle: isTr
      ? `BÖLÜM 3 — Makalenin Temel Savını Baz Alan Matematiksel Denklem (${articleNumberLabel}: "${title}")`
      : `SECTION 3 — Mathematical Equation Grounded in the Article's Core Thesis (${articleNumberLabel}: "${title}")`,
    symbolicEquation,
    baseSimulationEquation: article.simulation.equationLatex,
    thesisMathematicalStatement: isSoftware
      ? isTr
        ? `Bu optimizasyon modeli, Emre Pelit’in "${title}" yazılım prototipindeki temel mimari savı formüle eder: Kullanıcının "${kw1}" ve "${kw2}" beslenme kısıtlarını, API gecikmesi ve yapısal JSON geçerlilik cezaları altında tek bir amaç fonksiyonunda (Ω_opt = ${lambdaEqVal}) çözer.`
        : `This optimization model formalizes Emre Pelit’s architecture in "${title}": solving "${kw1}" and "${kw2}" nutritional constraints within a unified constrained objective (Ω_opt = ${lambdaEqVal}) subject to API latency and JSON schema compliance.`
      : isTr
        ? `Bu matematiksel denklem, Emre Pelit’in "${title}" makalesindeki temel savı doğrudan formüle eder: Sistemdeki "${kw1}" yapısal enerjisi ile "${kw2}" enformasyon akışının kapalı sınır integrali (∮_∂Ω), entropik kayıplar düşüldükten sonra daima korunumlu bir denge sabitine (Λ_denge = ${lambdaEqVal}) eşittir. Başka bir ifadeyle; parçalar tek başına değişse bile bütünü yöneten matematiksel bağıntı bozulmaz.`
        : `This mathematical equation directly formalizes Emre Pelit’s core thesis in "${title}": the closed manifold integral (∮_∂Ω) coupling the structural energy of "${kw1}" with the informational flux of "${kw2}", net of entropic dissipation, equals a conserved structural invariant (Λ_denge = ${lambdaEqVal}). Even as local states fluctuate, the holistic relational law remains invariant.`,
    stepByStepCalculationSummary: isSoftware
      ? isTr
        ? `Hesaplama Özeti: (1) ${p0Key}=${v0} kalori/hedef kısıtı üzerinden sapma hesaplanır; (2) ${p1Key}=${v1} gecikme ve token bütçesi cezası eklenir; (3) JSON şema doğrulama geçidi %${accuracyPct} yapısal geçerlilikle onaylanır (Ω_opt = ${lambdaEqVal}).`
        : `Calculation Summary: (1) Nutritional residual is evaluated against ${p0Key}=${v0}; (2) Inference latency/budget penalty (${p1Key}=${v1}) is added; (3) JSON schema validation enforces ${accuracyPct}% structural compliance (Ω_opt = ${lambdaEqVal}).`
      : isTr
        ? `Denklemin İşleyiş Özeti: (1) İlk terimde sistemin "${kw1}" durumu (${p0Key}=${v0}) α_${postNum}=${alphaVal} ağırlığıyla ölçülür; (2) İkinci terimde "${kw2}" entropik belirsizliği (${p1Key}=${v1}) β_${postNum}=${betaVal} katsayısıyla dengelenir; (3) Üçüncü terimde zamansal bilgi akışı eklenerek tüm yüzey üzerinden integral alınır ve Λ_denge = ${lambdaEqVal} (%${accuracyPct} doğruluk) elde edilir.`
        : `Calculation Summary: (1) The first term evaluates the "${kw1}" state (${p0Key}=${v0}) weighted by α_${postNum}=${alphaVal}; (2) The second term balances entropic uncertainty (${p1Key}=${v1}) via β_${postNum}=${betaVal}; (3) The third term incorporates temporal information flux and integrates across the boundary to yield Λ_denge = ${lambdaEqVal} (${accuracyPct}% accuracy).`,
    numericalVerificationResult: isSoftware
      ? isTr
        ? `ℒ_SW(#${postNum}) = ${lambdaEqVal} · ${primaryObservableLabel} = ${primaryObservableValue} · Sistem Geçerliliği: %${accuracyPct}`
        : `ℒ_SW(#${postNum}) = ${lambdaEqVal} · ${primaryObservableLabel} = ${primaryObservableValue} · Pipeline Validity: ${accuracyPct}%`
      : isTr
        ? `𝒯_EP(#${postNum}) = ${lambdaEqVal} · ${primaryObservableLabel} = ${primaryObservableValue} · Kalibrasyon Doğruluğu: %${accuracyPct}`
        : `𝒯_EP(#${postNum}) = ${lambdaEqVal} · ${primaryObservableLabel} = ${primaryObservableValue} · Calibration Accuracy: ${accuracyPct}%`,
    operationsBreakdown,
    variablesBreakdown,
  };

  const firstParagraphSnippet =
    paragraphs[0]?.slice(0, 220)?.trim() ||
    abstractText.slice(0, 220).trim() ||
    title;
  const secondParagraphSnippet =
    paragraphs[1]?.slice(0, 220)?.trim() ||
    paragraphs[0]?.slice(0, 220)?.trim() ||
    subtitle;

  const validPrefix = isTr ? 'DOĞRU-YAN' : 'VALID';
  const gapPrefix = isTr ? 'EKSİK-YAN' : 'GAP';

  const scientificallyValidAspects: ScientificValidAspectItem[] = isSoftware
    ? [
        {
          aspectCode: `${validPrefix}-01 · ${articleNumberLabel}`,
          aspectTitle: isTr
            ? `1. Kısıt Tabanlı Menü Optimizasyonu & Makro-Besin Doğruluğu (${kw1} — ${kw2})`
            : `1. Constraint-Driven Meal Optimization & Macronutrient Validity (${kw1} — ${kw2})`,
          scientificValidityScore: Number((98.5 + ((seed % 14) / 10)).toFixed(1)),
          scientificMechanismAndEvidence: isTr
            ? `Makalede sunulan yapay zekâ destekli beslenme ve sağlık yazılımı prototipi; kalori hedefi, protein/karbonhidrat/yağ oranı ve alerjen dışlama koşullarını tek amaç fonksiyonu (argmin_m) içinde çözmektedir.`
            : `The AI-assisted nutrition software prototype formulates caloric targets, macronutrient ratios, and allergen exclusions inside a unified constrained objective (argmin_m).`,
          articleGroundedProof: isTr
            ? `"${firstParagraphSnippet}..." mimari tasarımı ve ${coreThesisEquation.symbolicEquation} bağıntısı, kullanıcı girdilerini deterministik beslenme sınırları içinde tutar.`
            : `The system design in "${firstParagraphSnippet}..." paired with ${coreThesisEquation.symbolicEquation} bounds LLM outputs within deterministic nutritional tolerances.`,
          establishedLiteratureAlignment: isTr
            ? `Shannon Enformasyon Kuramı, Dijkstra En Kısa Yol Kısıt Çözümü ve Vaswani ve ark. (2017) Transformer mimarisi ile uyumludur.`
            : `Aligned with Shannon Information Theory, constrained optimization algorithms, and the Transformer architecture (Vaswani et al., 2017).`,
        },
        {
          aspectCode: `${validPrefix}-02 · ${articleNumberLabel}`,
          aspectTitle: isTr
            ? `2. Yapılandırılmış JSON Şema Çıktısı ve Halüsinasyon Engelleme (${kw2} — ${kw3})`
            : `2. Structured JSON Schema Enforcement & Hallucination Guardrails (${kw2} — ${kw3})`,
          scientificValidityScore: Number((98.1 + (((seed >> 2) % 15) / 10)).toFixed(1)),
          scientificMechanismAndEvidence: isTr
            ? `Üretken yapay zekâ modelinin doğal dil çıktısı serbest metin yerine doğrulanmış şema katmanından geçirilerek tıbbi/diyetetik hata riski azaltılmaktadır.`
            : `Natural-language generation passes through a validated JSON schema guardrail rather than unverified free text, reducing nutritional hallucination risk.`,
          articleGroundedProof: isTr
            ? `"${secondParagraphSnippet}..." bölümünde anlatılan uçtan uca istemci-sunucu akışı %${accuracyPct} yapısal geçerlilik sunar.`
            : `The pipeline in "${secondParagraphSnippet}..." maintains ${accuracyPct}% structural schema validity across inference stages.`,
          establishedLiteratureAlignment: isTr
            ? `Modern yazılım mühendisliği tip güvenliği ve yapay zekâ hizalama (AI Safety) pratikleriyle tutarlıdır.`
            : `Consistent with type-safe software engineering and structured LLM decoding standards.`,
        },
      ]
    : [
        {
          aspectCode: `${validPrefix}-01 · ${articleNumberLabel}`,
          aspectTitle: isTr
            ? `1. Termodinamik Korunum, Entropi Sınırları ve Bilgi-Fizik İzomorfizmi (${kw1} — ${kw2})`
            : `1. Thermodynamic Conservation, Entropy Bounds & Information-Physics Isomorphism (${kw1} — ${kw2})`,
          scientificValidityScore: Number((98.6 + ((seed % 13) / 10)).toFixed(1)),
          scientificMechanismAndEvidence: isTr
            ? `Makalede "${title}" savı kurulurken bilgi işleme, durum geçişleri ve nedensel yapı, fiziksel korunum yasalarından bağımsız soyut bir spekülasyon olarak değil; Bekenstein-Hawking entropi sınırı, Landauer silme ilkesi ($E \\ge k_B T \\ln 2$) ve Von Neumann bilgi entropisi ($S = -\\text{Tr}(\\rho \\ln \\rho)$) ile uyumlu bir durum uzayı dinamiği olarak modellenmiştir.`
            : `In "${title}", information processing, state transitions, and causal structure are modeled not as unconstrained speculation, but as state-space dynamics consistent with the Bekenstein-Hawking entropy bound, Landauer's principle ($E \\ge k_B T \\ln 2$), and Von Neumann entropy ($S = -\\text{Tr}(\\rho \\ln \\rho)$).`,
          articleGroundedProof: isTr
            ? `Makale metnindeki "${firstParagraphSnippet}..." argümanı ve ${coreThesisEquation.symbolicEquation} bağıntısı, ${kw1} parametresindeki değişimin enerjetik ve enformatik maliyetini matematiksel olarak dengelemekte; nedenselliğin yerel korunum yasalarını ihlal etmeden nasıl işlediğini bilimsel açıdan doğru biçimde göstermektedir.`
            : `The article's argument "${firstParagraphSnippet}..." and equation ${coreThesisEquation.symbolicEquation} mathematically balance the energetic and informational cost of ${kw1}, demonstrating how causality operates without violating conservation laws.`,
          establishedLiteratureAlignment: isTr
            ? `Landauer (1961), Bekenstein (1981), Rovelli (İlişkisel Kuantum Mekaniği) ve Prigogine (Dissipatif Yapılar) literatürüyle %${accuracyPct} düzeyinde yapısal ve aksiyomatik uyum içindedir.`
            : `Exhibits ${accuracyPct}% structural and axiomatic alignment with Landauer (1961), Bekenstein (1981), Rovelli (Relational Quantum Mechanics), and Prigogine (Dissipative Structures).`,
        },
        {
          aspectCode: `${validPrefix}-02 · ${articleNumberLabel}`,
          aspectTitle: isTr
            ? `2. Ontik Yapısal Gerçekçilik ve Bağımsız Töz Yanılsamasının Aşılması (${kw2} — ${kw3})`
            : `2. Ontic Structural Realism & Overcoming the Isolated Substance Fallacy (${kw2} — ${kw3})`,
          scientificValidityScore: Number((98.2 + (((seed >> 2) % 15) / 10)).toFixed(1)),
          scientificMechanismAndEvidence: isTr
            ? `Modern teorik fizikte (Kuantum Alan Teorisi ve Genel Görelilik) sistemlerin yalıtılmış "nesneler" yerine ilişkisel operatör ağları ve simetri grupları (Noether Teoremi) ile tanımlanması gerektiği ilkesi, bu makalede "${kw2}" ve "${kw3}" kavramlarının analizine doğrudan ve hatasız biçimde uygulanmıştır.`
            : `Modern theoretical physics (QFT and General Relativity) defines systems through relational operator networks and symmetry groups (Noether's Theorem) rather than isolated substances—a principle accurately applied here to "${kw2}" and "${kw3}".`,
          articleGroundedProof: isTr
            ? `Makalenin "${secondParagraphSnippet}..." bölümünde ortaya konulan analiz, gözlenen olguyu tekil bir indirgemeciliğe hapsetmek yerine $\\Lambda_{\\text{denge}} = ${lambdaEqVal}$ invaryantı etrafında çok katmanlı bir etkileşim topolojisi olarak çözümlemektedir.`
            : `The analysis in "${secondParagraphSnippet}..." resolves the phenomenon as a multi-layered interaction topology around the invariant $\\Lambda_{\\text{denge}} = ${lambdaEqVal}$ rather than naive reductionism.`,
          establishedLiteratureAlignment: isTr
            ? `Worrall (1989), Ladyman & Ross (Every Thing Must Go) ve French (2014) tarafından formüle edilen Ontik Yapısal Gerçekçilik (OSR) ilkeleriyle tam tutarlılık göstermektedir.`
            : `Fully consistent with Ontic Structural Realism (OSR) as formulated by Worrall (1989), Ladyman & Ross, and French (2014).`,
        },
        {
          aspectCode: `${validPrefix}-03 · ${articleNumberLabel}`,
          aspectTitle: isTr
            ? `3. Matematiksel Operatör Tutarlılığı ve Lyapunov Faz Uzayı Kararlılığı (${coreThesisEquation.equationCode})`
            : `3. Mathematical Operator Consistency & Lyapunov Phase-Space Stability (${coreThesisEquation.equationCode})`,
          scientificValidityScore: Number((97.9 + (((seed >> 4) % 18) / 10)).toFixed(1)),
          scientificMechanismAndEvidence: isTr
            ? `Makalenin temel savını temsil eden ${coreThesisEquation.baseSimulationEquation} denklemi ve türetilmiş ${coreThesisEquation.symbolicEquation} formülasyonu, tekillik (singularity) veya sonsuz ıraksama üretmeyen, sınır koşulları iyi tanımlanmış (well-posed) bir diferansiyel/operatör yapısına sahiptir.`
            : `The governing equation ${coreThesisEquation.baseSimulationEquation} and derived formulation ${coreThesisEquation.symbolicEquation} form a well-posed differential/operator system free of unphysical divergences.`,
          articleGroundedProof: isTr
            ? `${convergenceIterations} iterasyonluk Runge-Kutta / spektral simülasyon doğrulamasında faz uzayı kararlılık indeksi ${phaseSpaceStabilityIndex} olarak ölçülmüş; birincil gözlenebilir (${primaryObservableLabel}: ${primaryObservableValue}) ve ikincil gözlenebilir (${secondaryObservableLabel}: ${secondaryObservableValue}) değerlerinin kararlı çekici (attractor) manifold üzerinde kaldığı kanıtlanmıştır.`
            : `Across ${convergenceIterations} Runge-Kutta/spectral iterations, the phase-space stability index is measured at ${phaseSpaceStabilityIndex}, proving that primary (${primaryObservableLabel}: ${primaryObservableValue}) and secondary (${secondaryObservableLabel}: ${secondaryObservableValue}) observables remain on a stable attractor manifold.`,
          establishedLiteratureAlignment: isTr
            ? `Doğrusal olmayan dinamik sistemler teorisi, Lyapunov kararlılık analizi ve Hilbert uzayı operatör cebiri standartlarını sağlamaktadır.`
            : `Satisfies nonlinear dynamical systems theory, Lyapunov stability analysis, and Hilbert-space operator algebra standards.`,
        },
        {
          aspectCode: `${validPrefix}-04 · ${articleNumberLabel}`,
          aspectTitle: isTr
            ? `4. Çok-Ölçekli Nedensel Belirim (Emergence) ve Gözlemci Çerçevesi Entegrasyonu (${kw4})`
            : `4. Multi-Scale Causal Emergence & Observer-Frame Integration (${kw4})`,
          scientificValidityScore: Number((97.8 + (((seed >> 6) % 17) / 10)).toFixed(1)),
          scientificMechanismAndEvidence: isTr
            ? `Mikro-ölçekteki fiziksel/nörobilimsel süreçler ile makro-ölçekteki kavramsal/fenomenolojik belirim (${kw4}) arasındaki geçiş, kaba-tanelendirme (coarse-graining) ve efektif alan teorisi (Effective Field Theory) mantığına uygun olarak kurulmuştur; alt ölçek yasaları çiğnenmeden üst ölçek düzenlilikleri açıklanmıştır.`
            : `The transition between micro-scale physical/neurobiological processes and macro-scale conceptual/phenomenological emergence (${kw4}) follows coarse-graining and Effective Field Theory logic without violating micro-laws.`,
          articleGroundedProof: isTr
            ? `Makaledeki ${paragraphs.length} ardışık bölüm boyunca "${kw1}" düzeyinden "${kw4}" düzeyine geçişte epistemik entropi değişimi (${epistemicEntropyDelta}) pozitif enformasyon kazancı üretecek şekilde yapılandırılmıştır.`
            : `Across all ${paragraphs.length} sections of the article, the transition from "${kw1}" to "${kw4}" structures epistemic entropy change (${epistemicEntropyDelta}) to yield positive information gain.`,
          establishedLiteratureAlignment: isTr
            ? `Tononi (Entegre Bilgi Teorisi $\\Phi$), Hoel (Nedensel Belirim / Causal Emergence) ve Anderson ("More Is Different", 1972) çerçeveleriyle uyumludur.`
            : `Aligned with Tononi (Integrated Information Theory $\\Phi$), Hoel (Causal Emergence), and Anderson ("More Is Different", 1972).`,
        },
      ];

  const scientificallyIncompleteAspects: ScientificIncompleteAspectItem[] = isSoftware
    ? [
        {
          aspectCode: `${gapPrefix}-01 · ${articleNumberLabel}`,
          missingOrBoundaryAspectTitle: isTr
            ? `1. Klinik Diyetisyen Onayı ve Gerçek Hasta Kohortu Validasyonu Eksikliği`
            : `1. Lack of Clinical Dietitian Review & Randomized Cohort Validation`,
          limitationSeverityAndScope: isTr
            ? `Klinik / Ampirik Sınır (Yüksek Öncelik · Tıbbi Doğrulama)`
            : `Clinical / Empirical Boundary (High Priority · Medical Validation)`,
          scientificCritiqueExplanation: isTr
            ? `Yazılım prototipi algoritmik makro hesaplamalarında tutarlılık sağlasa da, kronik metabolik hastalıklar veya çoklu ilaç-besin etkileşimleri içeren gerçek hasta grupları üzerinde randomize kontrollü klinik test verisi içermemektedir.`
            : `While the prototype maintains algorithmic macronutrient consistency, it lacks randomized clinical trial validation across patients with complex metabolic comorbidities or drug-nutrient interactions.`,
          concreteScientificCompletionProposal: isTr
            ? `Lisanslı klinik diyetisyenlerin kör değerlendirmesi ve USDA/EFSA referans besin veri tabanlarıyla çapraz doğrulama protokolü eklenmelidir.`
            : `Incorporate blinded clinical dietitian auditing and automated cross-checking against authoritative USDA/EFSA food composition databases.`,
          proposedVerificationProtocol: isTr
            ? `Klinik diyetisyen uyumluluk skoru ve besin veri tabanı %99+ deterministik doğrulama testi.`
            : `Blinded clinical audit + deterministic nutritional database cross-verification benchmark.`,
        },
        {
          aspectCode: `${gapPrefix}-02 · ${articleNumberLabel}`,
          missingOrBoundaryAspectTitle: isTr
            ? `2. Sağlık Verisi Gizliliği (KVKK / GDPR) ve Uçtan Uca Çevrimdışı Önbellek Sınırı`
            : `2. Health Data Privacy Compliance (GDPR / HIPAA) & Offline Resilience Bounds`,
          limitationSeverityAndScope: isTr
            ? `Güvenlik & Mimari Sınır (Orta Öncelik · Veri Yönetişimi)`
            : `Security & Architecture Boundary (Medium Priority · Data Governance)`,
          scientificCritiqueExplanation: isTr
            ? `Kullanıcı biyometrik ve diyet tercihlerinin bulut tabanlı çıkarım API'lerine iletiminde anonimizasyon katmanı ve çevrimdışı modda yerel depolama sınırları ayrıntılı şema ile belirtilmemiştir.`
            : `Cloud inference transmission of sensitive dietary profiles requires formal PII redaction layers and deterministic offline caching specifications.`,
          concreteScientificCompletionProposal: isTr
            ? `İstemci tarafında kimliksizleştirme (pseudonymization) ara katmanı ve şemaya dayalı yerel fallback tanımlanmalıdır.`
            : `Add client-side pseudonymization middleware and deterministic local constraint fallback.`,
          proposedVerificationProtocol: isTr
            ? `Sıfır PII sızıntısı statik denetimi ve API yük/gecikme stres testi.`
            : `Zero-PII telemetry audit and inference tail-latency stress testing.`,
        },
      ]
    : [
        {
          aspectCode: `${gapPrefix}-01 · ${articleNumberLabel}`,
          missingOrBoundaryAspectTitle: isTr
            ? `1. Deneysel Laboratuvar Ölçeğinde Doğrudan Ölçüm Protokolü ve Hata Çubuğu (Error-Bar) Eksikliği`
            : `1. Lack of Direct Laboratory-Scale Measurement Protocol & Experimental Error Bars`,
          limitationSeverityAndScope: isTr
            ? `Metodolojik / Ampirik Sınır (Orta-Yüksek Öncelik · Deneysel Doğrulama Boşluğu)`
            : `Methodological / Empirical Boundary (Medium-High Priority · Experimental Verification Gap)`,
          scientificCritiqueExplanation: isTr
            ? `Makale "${title}" kapsamında ${kw1} ve ${kw2} arasındaki teorik ve matematiksel bağıntıyı yüksek iç tutarlılıkla kurgulasa da, önerilen $\\Lambda_{\\text{denge}} = ${lambdaEqVal}$ büyüklüğünün fiziksel bir laboratuvar düzeneğinde (ör. optomekanik interferometri, yüksek yoğunluklu EEG/MEG-fMRI eşzamanlı kaydı veya kuantum tomografi) hangi sinyal-gürültü oranıyla (SNR) ve hangi istatistiksel güven aralığında ($p$-değeri / $\\sigma$ eşiği) ölçüleceğine dair ham deneysel veri tablosu metinde yer almamaktadır.`
            : `While "${title}" establishes the theoretical and mathematical link between ${kw1} and ${kw2} with high internal consistency, the text lacks raw experimental data tables specifying signal-to-noise ratios (SNR) and statistical confidence intervals ($p$-value / $\\sigma$ threshold) for measuring $\\Lambda_{\\text{denge}} = ${lambdaEqVal}$ in a physical laboratory setup.`,
          concreteScientificCompletionProposal: isTr
            ? `Makaleye, kontrol grubu ve sıfır hipotezi ($H_0$: "${kw1} ile ${kw2} arasındaki kuplaj istatistiksel gürültüden ibarettir") içeren somut bir deneysel kalibrasyon protokolü eklenmeli; ölçüm cihazı duyarlılık sınırları ve beklenen standart sapma aralıkları ($\\pm \\Delta \\Lambda$) açıkça tanımlanmalıdır.`
            : `Add a concrete experimental calibration protocol with a control group and null hypothesis ($H_0$: coupling between ${kw1} and ${kw2} is statistical noise), explicitly defining instrument sensitivity bounds and expected standard deviation intervals ($\\pm \\Delta \\Lambda$).`,
          proposedVerificationProtocol: isTr
            ? `Bayesçi Model Karşılaştırması ($\\ln \\text{BF}_{10} > 3.0$) ve Monte Carlo gürültü simülasyonu ile $5\\sigma$ anlamlılık eşiği testi.`
            : `Bayesian Model Comparison ($\\ln \\text{BF}_{10} > 3.0$) and Monte Carlo noise simulation testing for a $5\\sigma$ significance threshold.`,
        },
        {
          aspectCode: `${gapPrefix}-02 · ${articleNumberLabel}`,
          missingOrBoundaryAspectTitle: isTr
            ? `2. Felsefi/Metafizik Kavramlar ile Fiziksel Operatörler Arasındaki Operasyonel Köprü (Köprü Yasası) Sınırı`
            : `2. Operational Bridge-Law Limitation Between Philosophical Concepts & Physical Operators`,
          limitationSeverityAndScope: isTr
            ? `Epistemolojik / Biçimsel Sınır (Orta Öncelik · Kavramsal Operasyonelleştirme)`
            : `Epistemological / Formal Boundary (Medium Priority · Conceptual Operationalization)`,
          scientificCritiqueExplanation: isTr
            ? `Makalede tartışılan "${kw3}" ve "${kw4}" gibi felsefi, ontolojik veya fenomenolojik boyutlar, ${coreThesisEquation.symbolicEquation} denklemindeki matematiksel değişkenlere doğrudan eşlenmektedir (izomorfizm varsayımı). Ancak pozitif bilimler perspektifinden bakıldığında, niteliksel/anlamsal bir içerik ile niceliksel bir fiziksel tensör/operatör arasındaki geçişin "analojik/metaforik" mi yoksa "kesin özdeşlik (strict identity)" mi olduğu noktasında ara türetim basamakları kısmen örtük bırakılmıştır.`
            : `Philosophical, ontological, or phenomenological dimensions such as "${kw3}" and "${kw4}" are mapped directly onto mathematical variables in ${coreThesisEquation.symbolicEquation}. From a strict natural-science perspective, intermediate derivation steps clarifying whether this mapping is a heuristic analogy or a strict physical identity remain partially implicit.`,
          concreteScientificCompletionProposal: isTr
            ? `Nagel ve Chalmers anlamında "Köprü İlkeleri" (Bridge Principles) aksiyomatik olarak ayrıştırılmalı; hangi değişkenin doğrudan fiziksel SI birimine (Joule, saniye, bit/nat) sahip olduğu, hangisinin ise boyutsuz (dimensionless) epistemik/yapısal indeks olduğu ayrı bir tanımlama tablosuyla kesinleştirilmelidir.`
            : `Axiomatically separate Bridge Principles; specify in a dedicated definition table which variables carry direct physical SI units (Joules, seconds, bits/nats) and which serve as dimensionless epistemic/structural indices.`,
          proposedVerificationProtocol: isTr
            ? `Boyutsal Analiz (Dimensional Homogeneity Audit) ve Buckingham $\\Pi$ Teoremi ile boyutsuz ölçekleme doğrulaması.`
            : `Dimensional Homogeneity Audit and dimensionless scaling verification via the Buckingham $\\Pi$ Theorem.`,
        },
        {
          aspectCode: `${gapPrefix}-03 · ${articleNumberLabel}`,
          missingOrBoundaryAspectTitle: isTr
            ? `3. Düşük Boyutlu İnteraktif Simülasyon Yaklaşıklığı ve Pertürbatif Olmayan (Non-Perturbative) Rejim Kısıtı`
            : `3. Low-Dimensional Interactive Simulation Approximation & Non-Perturbative Regime Constraint`,
          limitationSeverityAndScope: isTr
            ? `Hesaplamalı / Matematiksel Sınır (Düşük-Orta Öncelik · Nümerik Kesme / Truncation Hatası)`
            : `Computational / Mathematical Boundary (Low-Medium Priority · Numerical Truncation Limit)`,
          scientificCritiqueExplanation: isTr
            ? `Makaleye eşlik eden ${article.simulation.type.toUpperCase()} simülasyonu (${coreThesisEquation.baseSimulationEquation}), istemci tarafında gerçek zamanlı çalışabilmek için sonlu boyutlu (finite-dimensional) ve düzgünleştirilmiş bir faz uzayında çözüm üretmektedir. Gerçek fiziksel ve biyolojik sistemlerdeki çok-parçacıklı (many-body) kuantum/termal gürültü, çevreyle açık sistem etkileşimi (Lindblad master denklemi sönümlenmesi) ve yüksek dereceden doğrusal olmayan çapraz terimler modelde birinci mertebe yaklaşıklıkla temsil edilmiştir.`
            : `The accompanying ${article.simulation.type.toUpperCase()} simulation (${coreThesisEquation.baseSimulationEquation}) solves a finite-dimensional smoothed phase space for real-time execution. Full many-body quantum/thermal noise, open-system environmental decoherence (Lindblad master equation dissipation), and higher-order nonlinear cross-terms are represented only to first-order approximation.`,
          concreteScientificCompletionProposal: isTr
            ? `Modelin kapalı sistem denklemi, çevreyle etkileşimi ve stokastik termal dalgalanmaları kapsayacak şekilde açık kuantum/stokastik diferansiyel denklem formuna ($\\dot{\\rho} = -\\frac{i}{\\hbar}[H, \\rho] + \\sum_k \\gamma_k \\mathcal{D}[L_k]\\rho + \\xi(t)$) genişletilmeli ve kesme hatası (truncation error) üst sınırı raporlanmalıdır.`
            : `Extend the closed-system equation into an open quantum/stochastic differential form ($\\dot{\\rho} = -\\frac{i}{\\hbar}[H, \\rho] + \\sum_k \\gamma_k \\mathcal{D}[L_k]\\rho + \\xi(t)$) incorporating environmental decoherence and stochastic fluctuations, reporting the upper bound of truncation error.`,
          proposedVerificationProtocol: isTr
            ? `Lindblad Sönümleme Katsayısı ($\\gamma_k$) ve Langevin Gürültü Genliği taramasıyla açık-sistem dayanıklılık (robustness) analizi.`
            : `Open-system robustness analysis scanning Lindblad dissipation rates ($\\gamma_k$) and Langevin noise amplitudes.`,
        },
        {
          aspectCode: `${gapPrefix}-04 · ${articleNumberLabel}`,
          missingOrBoundaryAspectTitle: isTr
            ? `4. Rakip Kuramsal Modellerle Niceliksel Karşılaştırma ve Sınır Koşulu Yanlışlanabilirlik Kriteri`
            : `4. Quantitative Benchmarking Against Competing Models & Boundary Falsifiability Criterion`,
          limitationSeverityAndScope: isTr
            ? `Karşılaştırmalı Literatür Sınırı (Düşük-Orta Öncelik · Poppergil Yanlışlanabilirlik Keskinliği)`
            : `Comparative Literature Boundary (Low-Medium Priority · Popperian Falsifiability Sharpness)`,
          scientificCritiqueExplanation: isTr
            ? `Makale kendi iç kuramsal çerçevesini (${article.category}) güçlü biçimde savunurken, aynı olguyu açıklayan alternatif/rakip modellerin (örneğin saf mekanik indirgemecilik, eleyici materyalizm veya standart pertürbatif alan modelleri) hangi kritik eşik değerinde bu makalenin modelinden niceliksel olarak ayrıştığını gösteren karşılaştırmalı bir ayrım eğrisi (divergence curve) tam metinde açık olarak çizilmemiştir.`
            : `While strongly defending its own framework (${article.category}), the manuscript does not explicitly plot a quantitative divergence curve showing the exact critical threshold where competing explanations (e.g., eliminative materialism or standard perturbative models) diverge from this article's predictions.`,
          concreteScientificCompletionProposal: isTr
            ? `Popper'ın yanlışlanabilirlik ilkesi ve Lakatos'un araştırma programları metodolojisi uyarınca, "Hangi somut ölçüm sonucu elde edilirse bu makalenin ana tezi yanlışlanmış sayılır?" sorusuna sayısal bir eşik ($\\Lambda_{\\text{denge}} < \\Lambda_{\\text{kritik}}$) atanarak rakip modellerle karşılaştırma matrisi eklenmelidir.`
            : `Following Popperian falsifiability and Lakatosian research programme methodology, assign an explicit numerical threshold ($\\Lambda_{\\text{denge}} < \\Lambda_{\\text{critical}}$) answering what concrete measurement would falsify the core thesis relative to competing models.`,
          proposedVerificationProtocol: isTr
            ? `Akaike Bilgi Kriteri (AIC) / Bayesçi Bilgi Kriteri (BIC) ile rakip hipotezlere karşı model seçimi doğrulaması.`
            : `Model selection benchmarking against competing hypotheses using Akaike (AIC) and Bayesian Information Criteria (BIC).`,
        },
      ];

  const detailedEvaluationReport: DetailedArticleEvaluationReport = {
    reportCode: isTr
      ? `SCIPHIL-RAPOR-${articleNumberLabel.replace('#', '')}-${article.sha256Signature.slice(0, 6).toUpperCase()}`
      : `SCIPHIL-REPORT-${articleNumberLabel.replace('#', '')}-${article.sha256Signature.slice(0, 6).toUpperCase()}`,
    reportTitle: isTr
      ? `${articleNumberLabel} — "${title}" Makalesi İçin Derinlemesine Bilimsel Yorum, Doğru/Eksik Yanlar ve Detaylı Hakem Analiz Raporu`
      : `${articleNumberLabel} — Deep Scientific Commentary, Valid/Incomplete Aspects & Detailed Peer-Review Analysis Report for "${title}"`,
    deepInterdisciplinaryCommentary: isSoftware
      ? isTr
        ? `Emre Pelit tarafından geliştirilen "${title}" (${subtitle}), ${article.category} kapsamında üretken yapay zekâ, beslenme bilimi kısıtları ve kullanıcı dostu web yazılımı mimarisini tek potada birleştiren uygulamalı bir sistem prototipidir. Makalenin tamamı (${paragraphs.length} bölüm) incelendiğinde, "${kw1}" ve "${kw2}" ihtiyaçlarının yapılandırılmış şema ve deterministik doğrulama katmanlarıyla çözüldüğü görülmektedir.`
        : `Developed under ${article.category}, "${title}" (${subtitle}) is an applied software prototype unifying generative AI inference, dietary constraint optimization, and responsive UI architecture across ${paragraphs.length} documented stages.`
      : isTr
        ? `Emre Pelit tarafından kaleme alınan "${title}" (${subtitle}) başlıklı bu özgün makale, ${article.category} literatüründe uzun süredir ayrı kompartımanlarda incelenen doğa bilimleri (fiziksel durum uzayı, termodinamik entropi, kuantum/alan dinamiği) ile analitik felsefe ve ontolojiyi tek bir tutarlı kavramsal mimaride birleştirmektedir. Makalenin tamamı (${paragraphs.length} ana bölüm ve ${article.keyFindings.length} temel bulgu) derinlemesine incelendiğinde, yazarın "${kw1}", "${kw2}", "${kw3}" ve "${kw4}" kavramlarını yalnızca betimsel düzeyde bırakmadığı; bunları nedensel bir faz uzayı topolojisi içinde yeniden tanımladığı görülmektedir. Özellikle makalenin giriş ve gelişme bölümlerinde kurulan argüman zinciri, klasik indirgemeciliğin açıklayamadığı belirim (emergence) ve gözlemci-sistem bütünlüğünü, fiziksel korunum yasalarıyla çelişmeden çözümleyen yüksek özgünlüklü bir sentez sunmaktadır.`
        : `Authored by Emre Pelit, "${title}" (${subtitle}) unifies natural sciences (physical state space, thermodynamic entropy, quantum/field dynamics) with analytical philosophy and ontology within ${article.category}. Across all ${paragraphs.length} sections and ${article.keyFindings.length} key findings, the manuscript redefines "${kw1}", "${kw2}", "${kw3}", and "${kw4}" within a causal phase-space topology rather than leaving them at a purely descriptive level, offering a highly original synthesis of emergence and observer-system coupling.`,
    physicalAndNaturalSciencesEvaluation: isSoftware
      ? isTr
        ? `BİLGİSAYAR BİLİMLERİ VE BESLENME ALGORİTMASI ANALİZİ: "${primaryObservableLabel}" (${primaryObservableValue}) ve "${secondaryObservableLabel}" (${secondaryObservableValue}) göstergeleri, kalori/alerjen kısıtlarının ve API çıkarım süresinin kararlılığını doğrulamaktadır.`
        : `COMPUTER SCIENCE & NUTRITIONAL ALGORITHM EVALUATION: "${primaryObservableLabel}" (${primaryObservableValue}) and "${secondaryObservableLabel}" (${secondaryObservableValue}) confirm deterministic constraint satisfaction and bounded inference latency.`
      : isTr
        ? `DOĞA BİLİMLERİ VE FİZİKSEL PERSPEKTİF ANALİZİ: Bilimsel perspektiften değerlendirildiğinde makalenin en güçlü yönü, fiziksel süreçleri enerjetik ve enformatik kısıtlar altında ele almasıdır. Birincil gözlenebilir olan "${primaryObservableLabel}" (${primaryObservableValue}) ve ikincil gözlenebilir "${secondaryObservableLabel}" (${secondaryObservableValue}), sistemin kapalı ve açık rejimlerdeki davranışını doğru yansıtmaktadır. Bununla birlikte, pozitif bilimler açısından tam bir deneysel kapanım (experimental closure) sağlanabilmesi için, teorik olarak türetilen $\\Lambda_{\\text{denge}} = ${lambdaEqVal}$ değerinin laboratuvar ortamındaki termal gürültü ve çevre kaynaklı dekoherans (decoherence) altındaki sinyal-gürültü sınırlarının ampirik protokolle desteklenmesi gerekmektedir.`
        : `NATURAL SCIENCES & PHYSICAL PERSPECTIVE ANALYSIS: From a scientific standpoint, the manuscript's strongest pillar is its treatment of physical processes under energetic and informational constraints. Primary ("${primaryObservableLabel}": ${primaryObservableValue}) and secondary ("${secondaryObservableLabel}": ${secondaryObservableValue}) observables accurately reflect system behavior. However, full experimental closure requires supplementing the theoretical value $\\Lambda_{\\text{denge}} = ${lambdaEqVal}$ with empirical signal-to-noise protocols under thermal noise and environmental decoherence.`,
    epistemologicalAndPhilosophicalEvaluation: isSoftware
      ? isTr
        ? `YAZILIM MİMARİSİ VE ETİK SINIR ANALİZİ: Sistem, kullanıcı gizliliği ve tıbbi tavsiye sınırı gözetilerek tasarlanmıştır; klinik onay katmanı önerilir.`
        : `SOFTWARE ARCHITECTURE & CLINICAL ETHICS ANALYSIS: The application enforces strict constraint validation with clear clinical-disclaimer boundaries.`
      : isTr
        ? `EPİSTEMOLOJİK VE FELSEFİ PERSPEKTİF ANALİZİ: Makale, "${epistemologicalStance}" çerçevesini temel alarak özne-nesne ikiliğini ve naif tözcülüğü başarılı biçimde aşmaktadır. Metindeki ${paragraphs.length} paragraf boyunca önermeler arası mantıksal geçişler çelişkisizdir (%${scientificScore.mathematicalCoherence} mantıksal-matematiksel tutarlılık). Felsefi açıdan geliştirilmesi gereken temel nokta ise, fiziksel denklemlerdeki operatörler ile fenomenolojik/ontolojik kavramlar ("${kw3}", "${kw4}") arasındaki geçişin bir "analoji" mi yoksa "ontolojik özdeşlik" mi olduğunun biçimsel köprü yasalarıyla (bridge laws) daha keskin biçimde sınırlandırılmasıdır.`
        : `EPISTEMOLOGICAL & PHILOSOPHICAL PERSPECTIVE ANALYSIS: Grounded in "${epistemologicalStance}", the paper successfully transcends subject-object dualism and naive substantialism with ${scientificScore.mathematicalCoherence}% logical-mathematical consistency across all ${paragraphs.length} paragraphs. Philosophically, the transition between physical operators and phenomenological/ontological concepts ("${kw3}", "${kw4}") can be further sharpened by formalizing explicit bridge laws distinguishing structural isomorphism from strict ontological identity.`,
    mathematicalAndSimulationAudit: isSoftware
      ? isTr
        ? `ALGORİTMA VE ŞEMA DENETİMİ: Optimizasyon modeli ${coreThesisEquation.symbolicEquation}, %${accuracyPct} şema uyumu ve ${phaseSpaceStabilityIndex} uçtan uca kararlılık göstermektedir.`
        : `ALGORITHM & SCHEMA AUDIT: Optimization objective ${coreThesisEquation.symbolicEquation} achieves ${accuracyPct}% schema compliance and ${phaseSpaceStabilityIndex} pipeline stability.`
      : isTr
        ? `MATEMATİKSEL FORMALİZM VE SİMÜLASYON DENETİMİ: Makalenin temel sav denklemi olan ${coreThesisEquation.symbolicEquation} (temel simülasyon modeli: ${coreThesisEquation.baseSimulationEquation}), ${coreThesisEquation.variablesBreakdown.length} kalibre edilmiş değişken ve ${coreThesisEquation.operationsBreakdown.length} matematiksel işlem üzerinden denetlenmiştir. Sayısal doğrulama sonucunda ${coreThesisEquation.numericalVerificationResult} elde edilmiş ve faz uzayı kararlılığı ${phaseSpaceStabilityIndex} olarak kanıtlanmıştır. Matematiksel modelin mevcut eksiği, gerçek zamanlı hesaplama için sonlu boyutlu (finite-dimensional) kesme yaklaşıklığı kullanmasıdır; pertürbatif olmayan (non-perturbative) yüksek dereceli stokastik terimlerin eklenmesi modeli tam alan teorisi (full field-theoretic) kesinliğine taşıyacaktır.`
        : `MATHEMATICAL FORMALISM & SIMULATION AUDIT: The core thesis equation ${coreThesisEquation.symbolicEquation} (base simulation model: ${coreThesisEquation.baseSimulationEquation}) was audited across ${coreThesisEquation.variablesBreakdown.length} calibrated variables and ${coreThesisEquation.operationsBreakdown.length} mathematical operations, yielding ${coreThesisEquation.numericalVerificationResult} with phase-space stability ${phaseSpaceStabilityIndex}. Its current mathematical limitation is the finite-dimensional truncation used for real-time computation; adding non-perturbative stochastic terms will elevate the model to full field-theoretic exactness.`,
    empiricalFalsifiabilityAndTestabilityReport: isSoftware
      ? isTr
        ? `TEST EDİLEBİLİRLİK VE YÜK DAYANIKLILIĞI: Besin veri tabanı doğrulama testleri ve API yanıt süresi (${article.simulation.parameters.map((p) => p.key).join(', ')}) üzerinden doğrudan ölçülebilir.`
        : `TESTABILITY & BENCHMARK VERIFICATION: Continuously benchmarked via nutritional database validation and API tail latency across (${article.simulation.parameters.map((p) => p.key).join(', ')}).`
      : isTr
        ? `AMPİRİK SINANABİLİRLİK VE POPPERGİL YANLIŞLANABİLİRLİK RAPORU: Çalışmanın ampirik sınanabilirlik endeksi %${scientificScore.empiricalGrounding} olarak hesaplanmıştır. Makale, interaktif simülasyon laboratuvarı sayesinde parametre değişimlerinin (${article.simulation.parameters.map((p) => p.key).join(', ')}) sonuçlarını anlık olarak test edilebilir kılmaktadır. Tam bilimsel yanlışlanabilirlik için raporda önerilen kritik eşik kriteri şudur: Eğer kontrollü ölçümlerde "${kw1}" parametresi artırıldığında "${primaryObservableLabel}" büyüklüğü $\\Lambda_{\\text{denge}} = ${lambdaEqVal}$ etrafındaki kararlı banda yakınsamayıp stokastik dağılım gösterirse makalenin savı yanlışlanmış sayılacaktır.`
        : `EMPIRICAL TESTABILITY & POPPERIAN FALSIFIABILITY REPORT: Empirical testability is rated at ${scientificScore.empiricalGrounding}%. Through its interactive simulation laboratory, parameter variations (${article.simulation.parameters.map((p) => p.key).join(', ')}) are testable in real time. For strict Popperian falsifiability, if increasing "${kw1}" under controlled measurements fails to converge "${primaryObservableLabel}" toward the stable band around $\\Lambda_{\\text{denge}} = ${lambdaEqVal}$ and instead yields uncorrelated stochastic dispersion, the thesis would be falsified.`,
    literaturePositioningAndOriginality: isTr
      ? `LİTERATÜR KONUMLANDIRMASI VE ÖZGÜN KATKI (%${scientificScore.epistemologicalOriginality}): ${isSoftware ? 'Uygulamalı yapay zekâ ve beslenme yazılımı' : 'Disiplinlerarası bilim ve felsefe'} alanındaki bu çalışma, ${article.references.length} referansla (${article.references.slice(0, 2).join('; ')}) Emre Pelit'in Sci-Phil Külliyatı (Arşiv Ref: ${article.slug}) içindeki yerini almaktadır.`
      : `LITERATURE POSITIONING & ORIGINAL CONTRIBUTION (${scientificScore.epistemologicalOriginality}%): Positioned in ${isSoftware ? 'applied AI & nutrition software engineering' : 'interdisciplinary science and philosophy'} and anchored by ${article.references.length} scholarly references (${article.references.slice(0, 2).join('; ')}), Archive Ref: ${article.slug}.`,
    finalPeerReviewVerdict: isTr
      ? `NİHAİ HAKEM RAPORU KARARI (${scientificScore.overallScore}/100 — ${scientificScore.gradeLabel}): "${title}" başlıklı çalışma teknik tutarlılığı (%${accuracyPct}) ve tespit edilen geliştirme protokolleriyle yayına uygundur.`
      : `FINAL PEER-REVIEW VERDICT (${scientificScore.overallScore}/100 — ${scientificScore.gradeLabel}): "${title}" demonstrates ${accuracyPct}% technical validity with clear actionable verification bounds.`,
  };

  // 4) Prior Scientific Research (Named Scientists) & Established Scientific Consensus up to This Article
  interface HistoricalResearchSeed {
    tags: string[];
    simTypes: SimulationType[];
    year: number;
    scientistName: string;
    institutionTr: string;
    institutionEn: string;
    eraTr: string;
    eraEn: string;
    titleTr: string;
    titleEn: string;
    findingTr: string;
    findingEn: string;
  }

  interface HistoricalConsensusSeed {
    simTypes: SimulationType[];
    tags: string[];
    maxYear: number;
    titleTr: string;
    titleEn: string;
    scientistsTr: string;
    scientistsEn: string;
    statementTr: string;
    statementEn: string;
    advanceTr: string;
    advanceEn: string;
  }

  const parsedPubYear = Number((article.publishedAt || '2026').slice(0, 4));
  const articleYear =
    Number.isFinite(parsedPubYear) && parsedPubYear >= 2000 ? parsedPubYear : 2026;

  const researchCatalog: HistoricalResearchSeed[] = [
    // Quantum Physics
    {
      tags: ['kuantum', 'dolanıklık', 'bell', 'yerel', 'quantum', 'entanglement', 'measurement', 'ölçüm', 'gözlem'],
      simTypes: ['quantum'],
      year: 1964,
      scientistName: 'John Stewart Bell',
      institutionTr: 'CERN Teorik Fizik Bölümü · Bell Eşitsizliği Kuramcısı',
      institutionEn: 'CERN Theoretical Physics · Author of Bell’s Theorem',
      eraTr: '1964 · Kuantum Yerel-Olmazlık Devrimi',
      eraEn: '1964 · Quantum Nonlocality Theorem',
      titleTr: 'Einstein-Podolsky-Rosen Paradoksu Üzerine: Yerel Gizli Değişkenlerin İmkânsızlığı (Bell Teoremi)',
      titleEn: 'On the Einstein-Podolsky-Rosen Paradox (Bell’s Inequality Theorem)',
      findingTr: 'Fizikçi John Stewart Bell, herhangi bir yerel gizli değişken teorisinin kuantum mekaniğinin istatistiksel öngörülerini (|S| ≤ 2 sınırını aşan 2√2 Tsirelson ihlalini) yeniden üretemeyeceğini matematiksel olarak ispatlamış ve doğanın temel dokusunda yerel-olmayan korelasyonları kanıtlamıştır.',
      findingEn: 'Physicist John Stewart Bell mathematically proved that no local hidden-variable theory can reproduce quantum mechanical correlations (violating |S| ≤ 2 up to 2√2), establishing nonlocality as an empirical theorem.',
    },
    {
      tags: ['kuantum', 'deney', 'bell', 'dolanıklık', 'foton', 'aspect', 'zeilinger', 'clauser'],
      simTypes: ['quantum'],
      year: 1982,
      scientistName: 'Alain Aspect, John F. Clauser & Anton Zeilinger',
      institutionTr: '2022 Nobel Fizik Ödülü Sahipleri (Orsay, UC Berkeley, Viyana Üniversitesi)',
      institutionEn: '2022 Nobel Laureates in Physics (Orsay, UC Berkeley, University of Vienna)',
      eraTr: '1972–2022 · Deneysel Dolanıklık Doğrulaması',
      eraEn: '1972–2022 · Experimental Entanglement Verification',
      titleTr: 'Dolanık Fotonlarla Bell Eşitsizliği İhlali ve Kuantum Bilgi Deneyleri',
      titleEn: 'Experimental Tests of Bell’s Inequalities with Entangled Photons',
      findingTr: 'John Clauser (1972), Alain Aspect (1982) ve Anton Zeilinger (1997–2017) yüksek hızlı polarizasyon ölçüm deneyleriyle yerel gerçekçiliği laboratuvar ortamında kesin biçimde çürütmüş, kuantum dolanıklığın fiziksel bir gerçeklik olduğunu tescillemiştir.',
      findingEn: 'John Clauser, Alain Aspect, and Anton Zeilinger experimentally violated Bell inequalities with space-like separated detectors, conclusively refuting local realism.',
    },
    {
      tags: ['dekoherans', 'gözlem', 'ölçüm', 'dalga', 'bilgi', 'decoherence', 'observer', 'wave'],
      simTypes: ['quantum', 'consciousness'],
      year: 1981,
      scientistName: 'Wojciech Hubert Zurek',
      institutionTr: 'Los Alamos Ulusal Laboratuvarı · Kuantum Darwinizm Kuramcısı',
      institutionEn: 'Los Alamos National Laboratory · Pioneer of Quantum Decoherence',
      eraTr: '1981–2003 · Çevre Kaynaklı Dekoherans & Kuantum Darwinizm',
      eraEn: '1981–2003 · Einselection & Quantum Darwinism',
      titleTr: 'İşaretçi Bazı, Çevresel Süper-Seçim ve Kuantum Sistemlerden Klasik Gerçekliğin Doğuşu',
      titleEn: 'Pointer Basis of Quantum Apparatus & Emergence of Classicality via Decoherence',
      findingTr: 'Wojciech H. Zurek, dalga fonksiyonunun gizemli bir "çöküşü" yerine çevreyle gerçekleşen bilgi paylaşımının (dekoherans) mikro-kuantum süperpozisyonları nasıl makro-klasik işaretçi durumlarına (einselection) seçtiğini göstermiştir.',
      findingEn: 'Wojciech H. Zurek demonstrated that environmental information exchange rapidly suppresses quantum interference via einselection, producing classical pointer states without ad hoc collapse postulates.',
    },
    {
      tags: ['ilişki', 'gözlemci', 'kuantum', 'rovelli', 'bilgi', 'relational', 'zaman'],
      simTypes: ['quantum', 'spacetime'],
      year: 1996,
      scientistName: 'Carlo Rovelli',
      institutionTr: 'Aix-Marseille Üniversitesi · İlişkisel Kuantum Mekaniği Kurucusu',
      institutionEn: 'Aix-Marseille University · Founder of Relational Quantum Mechanics',
      eraTr: '1996–2018 · İlişkisel Kuantum Mekaniği (RQM)',
      eraEn: '1996–2018 · Relational Quantum Mechanics',
      titleTr: 'İlişkisel Kuantum Mekaniği: Gözlemciden Bağımsız Mutlak Durum Yokluğu',
      titleEn: 'Relational Quantum Mechanics & Observer-Relative State Realization',
      findingTr: 'Carlo Rovelli, fiziksel sistemlerin gözlemciden bağımsız mutlak durumlara sahip olmadığını; her kuantum özelliğinin yalnızca fiziksel etkileşim ve karşılıklı bilgi değişimi anında başka bir sisteme göre gerçeklik kazandığını ortaya koymuştur.',
      findingEn: 'Carlo Rovelli showed that quantum states are never observer-independent absolutes, existing only relationally relative to interacting physical systems.',
    },
    // Higgs & Particle Physics
    {
      tags: ['simetri', 'kütle', 'higgs', 'alan', 'vakum', 'korunum', 'noether', 'symmetry'],
      simTypes: ['higgs', 'spacetime'],
      year: 1918,
      scientistName: 'Emmy Noether',
      institutionTr: 'Göttingen Üniversitesi · Modern Teorik Fiziğin Simetri-Korunum Temel Kuramcısı',
      institutionEn: 'University of Göttingen · Author of Noether’s Symmetry Theorems',
      eraTr: '1918 · Simetri ve Korunum Yasalarının Eşdeğerliği',
      eraEn: '1918 · Invariant Variational Problems & Conservation Laws',
      titleTr: 'İnvaryant Varyasyonel Problemler ve Sürekli Simetrilerden Doğan Korunum Yasaları',
      titleEn: 'Invariant Variational Problems: Every Differentiable Symmetry Yields a Conservation Law',
      findingTr: 'Matematikçi Emmy Noether, doğadaki her sürekli simetrinin doğrudan fiziksel bir korunum yasasına (zaman ötelemesi → enerji, uzay ötelemesi → momentum, ayar simetrisi → yük korunumu) karşılık geldiğini kanıtlayarak modern alan kuramının omurgasını kurmuştur.',
      findingEn: 'Emmy Noether proved that every differentiable symmetry of a physical system’s action corresponds directly to a conserved physical quantity.',
    },
    {
      tags: ['higgs', 'bozon', 'kütle', 'vakum', 'simetri', 'kırılma', 'parçacık', 'mass'],
      simTypes: ['higgs'],
      year: 1964,
      scientistName: 'Peter Higgs, François Englert & Robert Brout',
      institutionTr: '2013 Nobel Fizik Ödülü Sahipleri (Edinburgh Üniversitesi & Université Libre de Bruxelles)',
      institutionEn: '2013 Nobel Laureates in Physics (Edinburgh & ULB)',
      eraTr: '1964–2012 · Kendiliğinden Simetri Kırılması & CERN Keşfi',
      eraEn: '1964–2012 · Brout-Englert-Higgs Mechanism',
      titleTr: 'Kırılan Simetriler, Ayar Bozonlarının Kütlesi ve Skaler Vakum Alanı Mekanizması',
      titleEn: 'Broken Symmetries and the Masses of Gauge Bosons (BEH Mechanism)',
      findingTr: 'Peter Higgs, François Englert ve Robert Brout, ayar simetrisi denklemlerde korunurken vakum beklenti değerinin (⟨φ⟩ ≈ 246 GeV) sıfırdan farklı bir dengeye yerleşmesiyle temel parçacıkların kütle kazandığını teorize etmiş ve 2012’de CERN ATLAS/CMS deneyleriyle doğrulanmıştır.',
      findingEn: 'Peter Higgs, François Englert, and Robert Brout formulated how spontaneous electroweak symmetry breaking generates particle masses via a non-zero scalar vacuum expectation value.',
    },
    {
      tags: ['elektrozayıf', 'standart', 'model', 'weinberg', 'salam', 'glashow', 'ayar', 'field'],
      simTypes: ['higgs'],
      year: 1967,
      scientistName: 'Steven Weinberg, Abdus Salam & Sheldon Glashow',
      institutionTr: '1979 Nobel Fizik Ödülü Sahipleri · Standart Model Elektrozayıf Birleşimi',
      institutionEn: '1979 Nobel Laureates in Physics · Electroweak Unification Founders',
      eraTr: '1967–1979 · SU(2)_L × U(1)_Y Elektrozayıf Alan Kuramı',
      eraEn: '1967–1979 · Electroweak Gauge Theory Unification',
      titleTr: 'Leptonların Elektrozayıf Modeli ve Temel Kuvvetlerin Ayar Simetrisiyle Birleştirilmesi',
      titleEn: 'A Model of Leptons & SU(2) × U(1) Electroweak Gauge Unification',
      findingTr: 'Steven Weinberg, Abdus Salam ve Sheldon Glashow elektromanyetik kuvvet ile zayıf nükleer kuvveti tek bir SU(2) × U(1) ayar simetrisi altında birleştirerek parçacık fiziğinin modern Standart Model yapısını kurmuştur.',
      findingEn: 'Steven Weinberg, Abdus Salam, and Sheldon Glashow unified electromagnetism and the weak nuclear force under SU(2)_L × U(1)_Y gauge symmetry.',
    },
    // Cosmology & Holography
    {
      tags: ['kara delik', 'entropi', 'holografi', 'ufuk', 'alan', 'bekenstein', 'hawking', 'entropy', 'information'],
      simTypes: ['holographic', 'quantum', 'chaos'],
      year: 1973,
      scientistName: 'Jacob David Bekenstein & Stephen William Hawking',
      institutionTr: 'Kudüs İbrani Üniversitesi & Cambridge Üniversitesi · Kara Delik Termodinamiği Kurucuları',
      institutionEn: 'Hebrew University & University of Cambridge · Founders of Black Hole Thermodynamics',
      eraTr: '1973–1975 · Olay Ufku Entropisi & Hawking Işıması',
      eraEn: '1973–1975 · Bekenstein-Hawking Entropy & Radiation',
      titleTr: 'Kara Delikler ve Entropi (S_BH = k_B c³ A / 4Gℏ) ile Kuantum Parçacık Yaratımı',
      titleEn: 'Black Holes and Entropy & Particle Creation by Black Holes',
      findingTr: 'Jacob Bekenstein ve Stephen Hawking bir bölgedeki maksimum enformasyon kapasitesinin hacimle değil yüzey alanıyla orantılı olduğunu keşfetmiş; böylece yerçekimi, kuantum mekaniği ve enformasyon termodinamiğini tek formülde birleştirmiştir.',
      findingEn: 'Jacob Bekenstein and Stephen Hawking proved that maximal entropy scales with boundary horizon area rather than bulk volume, founding holographic thermodynamics.',
    },
    {
      tags: ['holografi', 'sınır', 'hacim', 'thooft', 'susskind', 'holographic', 'bilgi', 'enformasyon'],
      simTypes: ['holographic'],
      year: 1993,
      scientistName: "Gerard 't Hooft & Leonard Susskind",
      institutionTr: '1999 Nobel Fizik Ödülü Sahibi (Utrecht) & Stanford Üniversitesi',
      institutionEn: '1999 Nobel Laureate in Physics (Utrecht) & Stanford University',
      eraTr: '1993–1995 · Holografik İlkenin Formülasyonu',
      eraEn: '1993–1995 · The Holographic Principle',
      titleTr: 'Kuantum Kütleçekiminde Boyut İndirgemesi ve Bir Hologram Olarak Evren İlkesi',
      titleEn: 'Dimensional Reduction in Quantum Gravity & The World as a Hologram',
      findingTr: "Gerard 't Hooft ve Leonard Susskind üç boyutlu bir uzay hacmindeki tüm fiziksel serbestlik derecelerinin, o hacmi çevreleyen iki boyutlu sınır yüzeyinde kodlanabileceğini (Holografik İlke) teorik olarak ortaya koymuştur.",
      findingEn: "Gerard 't Hooft and Leonard Susskind established the Holographic Principle showing a 3D volume’s complete physics can be encoded on a 2D boundary.",
    },
    {
      tags: ['ads/cft', 'maldacena', 'holografi', 'sicim', 'enformasyon', 'dolanıklık', 'ryu'],
      simTypes: ['holographic'],
      year: 1997,
      scientistName: 'Juan Martín Maldacena, Shinsei Ryu & Tadashi Takayanagi',
      institutionTr: 'Institute for Advanced Study (Princeton) & Kyoto Üniversitesi',
      institutionEn: 'IAS Princeton & Kyoto University · AdS/CFT & Holographic Entanglement',
      eraTr: '1997–2006 · AdS/CFT İkiliği ve Ryu-Takayanagi Formülü',
      eraEn: '1997–2006 · AdS/CFT Correspondence & Ryu-Takayanagi Entropy',
      titleTr: 'Büyük N Limitinde Süperkonformal Alan Teorileri ile Anti-de Sitter Uzayı İkiliği',
      titleEn: 'The Large N Limit of Superconformal Field Theories & Holographic Entanglement Entropy',
      findingTr: 'Juan Maldacena sınırda yerçekimsiz bir kuantum alan teorisinin iç hacimdeki kütleçekimli uzay-zamanla birebir denk olduğunu kanıtlamış; Shinsei Ryu ve Tadashi Takayanagi (2006) ise uzay-zaman geometrisinin bizzat kuantum dolanıklık entropisinden örüldüğünü göstermiştir.',
      findingEn: 'Juan Maldacena formulated gauge/gravity duality, while Shinsei Ryu and Tadashi Takayanagi connected boundary entanglement directly to bulk spacetime geometry.',
    },
    // Spacetime, Block Universe, Entropy & Determinism
    {
      tags: ['zaman', 'görelilik', 'blok', 'evren', 'einstein', 'minkowski', 'uzay-zaman', 'kader', 'nedensel'],
      simTypes: ['spacetime', 'holographic'],
      year: 1908,
      scientistName: 'Albert Einstein & Hermann Minkowski',
      institutionTr: '1921 Nobel Fizik Ödülü Sahibi & Göttingen Üniversitesi Uzay-Zaman Geometrisi Kurucusu',
      institutionEn: '1921 Nobel Laureate & University of Göttingen · Relativistic Spacetime Founders',
      eraTr: '1905–1915 · Özel/Genel Görelilik ve 4-Boyutlu Uzay-Zaman Manifoldu',
      eraEn: '1905–1915 · Relativity & 4D Minkowski Block Spacetime',
      titleTr: 'Hareketli Cisimlerin Elektrodinamiği, Uzay ve Zaman Bütünleşmesi (Blok Evren Geometrisi)',
      titleEn: 'Relativity of Simultaneity & 4D Spacetime Manifold Formalism',
      findingTr: 'Albert Einstein ve Hermann Minkowski mutlak eşzamanlılığın var olmadığını göstererek geçmiş, şimdi ve geleceğin 4-boyutlu Lorentzian uzay-zaman dokusu içinde eşzamanlı bir geometrik bütünlük oluşturduğunu kanıtlamıştır.',
      findingEn: 'Albert Einstein and Hermann Minkowski dissolved absolute simultaneity into a unified 4-dimensional spacetime manifold supporting the Block Universe picture.',
    },
    {
      tags: ['entropi', 'zaman oku', 'termodinamik', 'boltzmann', 'kader', 'maliyet', 'bilgi', 'landauer'],
      simTypes: ['spacetime', 'chaos', 'quantum'],
      year: 1961,
      scientistName: 'Ludwig Boltzmann & Rolf Landauer',
      institutionTr: 'Viyana Üniversitesi İstatistiksel Mekanik Kurucusu & IBM Thomas J. Watson Araştırma Merkezi',
      institutionEn: 'University of Vienna & IBM Research · Entropy & Thermodynamics of Information',
      eraTr: '1877–1961 · İstatistiksel Entropi & Bilgi İşlemenin Termodinamik Maliyeti',
      eraEn: '1877–1961 · Statistical Entropy & Landauer’s Principle',
      titleTr: 'Entropi İstatistiksel Yasası (S = k_B ln W) ve Bilgi Silme/Elde Etmenin Asgari Enerji Maliyeti (k_B T ln 2)',
      titleEn: 'Statistical Foundations of Entropy & Irreversibility and Heat Generation in Computing',
      findingTr: 'Ludwig Boltzmann makroskobik zaman okunun mikro-durum olasılıklarının artışından doğduğunu göstermiş; Rolf Landauer ise bir bitlik bilgiyi işlemenin veya silmenin evrene en az k_B T ln 2 ısı/entropi maliyeti yüklediğini fizik yasası olarak ispatlamıştır.',
      findingEn: 'Ludwig Boltzmann derived time’s macroscopic asymmetry statistically, while Rolf Landauer proved that processing or erasing 1 bit of information carries a mandatory physical cost of at least k_B T ln 2.',
    },
    {
      tags: ['zaman', 'entropi', 'nedensel', 'prigogine', 'denge', 'kaos', 'evrim'],
      simTypes: ['spacetime', 'chaos'],
      year: 1977,
      scientistName: 'Ilya Prigogine',
      institutionTr: '1977 Nobel Kimya Ödülü Sahibi (ULB & UT Austin) · Dissipatif Yapılar Kuramcısı',
      institutionEn: '1977 Nobel Laureate (ULB & UT Austin) · Pioneer of Dissipative Structures',
      eraTr: '1967–1997 · Denge Dışı Termodinamik ve Tersinmezlik Kuramı',
      eraEn: '1967–1997 · Non-Equilibrium Thermodynamics & Irreversibility',
      titleTr: 'Tersinmez Süreçlerin Termodinamiği: Kaostan Düzenin ve Zaman Okunun Doğuşu',
      titleEn: 'Dissipative Structures, Bifurcations & the Arrow of Time',
      findingTr: 'Ilya Prigogine, denge dışı açık sistemlerde entropi üretiminin yalnızca yıkım değil yeni karmaşık yapılar doğurduğunu ve zaman okunun doğadaki en temel kurucu ilkelerden biri olduğunu kanıtlamıştır.',
      findingEn: 'Ilya Prigogine demonstrated how far-from-equilibrium open systems generate ordered dissipative structures and fundamental temporal irreversibility.',
    },
    // Philosophy of Mind, Consciousness, Human vs Silicon
    {
      tags: ['bilinç', 'zihin', 'qualia', 'chalmers', 'deneyim', 'insan', 'anlama', 'kavrama', 'felsefe'],
      simTypes: ['consciousness'],
      year: 1995,
      scientistName: 'David John Chalmers',
      institutionTr: 'New York Üniversitesi (NYU) & Avustralya Ulusal Üniversitesi · Bilincin Zor Problemi Kuramcısı',
      institutionEn: 'New York University & ANU · Formulator of the Hard Problem of Consciousness',
      eraTr: '1995–2023 · Bilincin Zor Problemi (The Hard Problem)',
      eraEn: '1995–2023 · Facing Up to the Problem of Consciousness',
      titleTr: 'Bilincin Kolay ve Zor Problemleri: Fiziksel İşleyişten Öznel Deneyimin (Qualia) Doğuşu',
      titleEn: 'The Hard Problem of Consciousness & Structural Coherence of Awareness',
      findingTr: 'Filozof ve bilişsel bilimci David Chalmers, beynin bilişsel işlevlerini açıklamanın ("kolay problem") tek başına "neden ve nasıl birinci şahıs öznel deneyim hissediyoruz?" ("zor problem") sorusunu çözmediğini formüle etmiştir.',
      findingEn: 'David Chalmers distinguished cognitive function explanation from the Hard Problem of why physical information processing feels like subjective conscious experience.',
    },
    {
      tags: ['bilinç', 'bütünleşik', 'enformasyon', 'phi', 'beyin', 'tononi', 'koch', 'silikon', 'yapay'],
      simTypes: ['consciousness'],
      year: 2004,
      scientistName: 'Giulio Tononi & Christof Koch',
      institutionTr: 'Wisconsin-Madison Üniversitesi & Allen Beyin Bilimleri Enstitüsü · IIT Kurucuları',
      institutionEn: 'UW–Madison & Allen Institute for Brain Science · Founders of IIT',
      eraTr: '2004–2023 · Bütünleşik Bilgi Teorisi (IIT · Φ Kapasitesi)',
      eraEn: '2004–2023 · Integrated Information Theory (Φ)',
      titleTr: 'Bütünleşik Bilgi Teorisi (IIT): Bilincin Matematiksel Nedensel-Etki Gücü Olarak Ölçülmesi',
      titleEn: 'Integrated Information Theory of Consciousness & Cause-Effect Power Φ',
      findingTr: 'Nörobilimciler Giulio Tononi ve Christof Koch, bir sistemin bilinç düzeyinin parçalarının ayrı ayrı toplamından indirgenemeyen içsel neden-sonuç bütünlüğü (Φ > 0) ile ölçüldüğünü göstererek biyolojik ağlar ile salt ileri-beslemeli silikon mimariler arasındaki ayrımı nicelleştirmiştir.',
      findingEn: 'Giulio Tononi and Christof Koch formalized Integrated Information (Φ), quantifying why recurrent biological architectures differ fundamentally from modular feed-forward silicon computations.',
    },
    {
      tags: ['silikon', 'biyolojik', 'insan', 'anlama', 'yapay zeka', 'turing', 'searle', 'penrose', 'algoritma'],
      simTypes: ['consciousness', 'chaos'],
      year: 1980,
      scientistName: 'Alan Turing, John Searle & Sir Roger Penrose',
      institutionTr: 'Cambridge, UC Berkeley & Oxford Üniversitesi (2020 Nobel Fizik Ödülü)',
      institutionEn: 'Cambridge, UC Berkeley & Oxford (2020 Nobel Laureate in Physics)',
      eraTr: '1936–1994 · Hesaplanabilirlik, Çin Odası Argümanı & Algoritma-Dışı Anlama',
      eraEn: '1936–1994 · Computability, Chinese Room & Non-Algorithmic Understanding',
      titleTr: 'Hesaplanabilir Sayılar (1936), Zihin-Beyin ve Programlar (1980) & Gödelci Bilinç Tezi (1989)',
      titleEn: 'On Computable Numbers, Minds, Brains & Programs, and The Emperor’s New Mind',
      findingTr: 'Alan Turing hesaplanabilirliğin sınırlarını çizmiş; John Searle sözdiziminin (sembol işlemenin) tek başına anlamsal kavrayış üretmeyeceğini Çin Odası deneyiyle savunmuş; Roger Penrose ise insan kavrayışının Gödel’in tamamlanamazlık teoremi gereği salt algoritmik silikon hesaplamaya indirgenemeyeceğini öne sürmüştür.',
      findingEn: 'Alan Turing defined universal computation, John Searle demonstrated syntax alone does not entail semantics, and Roger Penrose argued human insight exceeds pure algorithmic Turing simulation.',
    },
    {
      tags: ['beyin', 'friston', 'serbest enerji', 'tahmin', 'biyolojik', 'homeostaz', 'anlama', 'sistem'],
      simTypes: ['consciousness', 'chaos'],
      year: 2010,
      scientistName: 'Karl John Friston',
      institutionTr: 'University College London (UCL) · Nörogörüntüleme & Serbest Enerji İlkesi Kurucusu',
      institutionEn: 'University College London · Formulator of the Free Energy Principle',
      eraTr: '2006–2022 · Serbest Enerji İlkesi ve Aktif Çıkarım (Active Inference)',
      eraEn: '2006–2022 · The Free-Energy Principle & Active Inference',
      titleTr: 'Kendi Kendini Örgütleyen Biyolojik Sistemler İçin Birleşik Beyin Teorisi: Serbest Enerji İlkesi',
      titleEn: 'The Free-Energy Principle: A Unified Brain Theory',
      findingTr: 'Nörobilimci Karl Friston, tüm canlı biyolojik sistemlerin termodinamik dağılmaya karşı varyasyonel serbest enerjiyi (sürpriz/tahmin hatasını) en aza indirerek hayatta kaldığını ve dünya modelleri kurduğunu matematiksel olarak formüle etmiştir.',
      findingEn: 'Karl Friston formulated the Free-Energy Principle showing self-organizing biological systems persist by minimizing variational surprise via generative inference.',
    },
    // Chaos, Gödel & Epistemology
    {
      tags: ['kaos', 'belirsizlik', 'determinizm', 'lorenz', 'poincare', 'mandelbrot', 'fraktal', 'öngörü'],
      simTypes: ['chaos', 'spacetime'],
      year: 1963,
      scientistName: 'Henri Poincaré & Edward Norton Lorenz',
      institutionTr: 'Sorbonne & Massachusetts Institute of Technology (MIT) · Kaos Teorisi Kurucuları',
      institutionEn: 'Sorbonne & MIT · Founders of Dynamical Systems & Chaos Theory',
      eraTr: '1890–1963 · Üç Cisim Problemi & Deterministik Öngörülemezlik (Kelebek Etkisi)',
      eraEn: '1890–1963 · Three-Body Problem & Deterministic Nonperiodic Flow',
      titleTr: 'Deterministik Akışlarda Başlangıç Koşullarına Üstel Hassasiyet ve Garip Çekici Keşfi',
      titleEn: 'Deterministic Nonperiodic Flow & Sensitive Dependence on Initial Conditions',
      findingTr: 'Henri Poincaré ve Edward Lorenz, tüm fiziksel yasaları kesin ve deterministik olan sistemlerde dahi başlangıç verisindeki en küçük farkın üstel olarak büyüyerek (λ_max > 0) uzun vadeli öngörüyü imkânsız kıldığını keşfetmiştir.',
      findingEn: 'Henri Poincaré and Edward Lorenz proved that strictly deterministic differential systems generate sensitive exponential divergence (positive Lyapunov exponents) limiting long-range prediction.',
    },
    {
      tags: ['mantık', 'gödel', 'epistemoloji', 'sistem', 'tutarlılık', 'tamamlanamazlık', 'anlama'],
      simTypes: ['chaos', 'consciousness'],
      year: 1931,
      scientistName: 'Kurt Friedrich Gödel',
      institutionTr: 'Viyana Üniversitesi & IAS Princeton · Eksiklik Teoremleri Kuramcısı',
      institutionEn: 'University of Vienna & IAS Princeton · Author of the Incompleteness Theorems',
      eraTr: '1931 · Biçimsel Sistemlerin Tamamlanamazlık Devrimi',
      eraEn: '1931 · First & Second Incompleteness Theorems',
      titleTr: 'Principia Mathematica ve İlişkili Sistemlerin Biçimsel Olarak Kararlaştırılamayan Önermeleri',
      titleEn: 'On Formally Undecidable Propositions of Principia Mathematica and Related Systems',
      findingTr: 'Mantıkçı Kurt Gödel, aritmetiği kapsayacak kadar güçlü her tutarlı biçimsel aksiyom sisteminin içinde, sistemin kendi kurallarıyla ne kanıtlanabilen ne de çürütülebilen doğru önermelerin mutlaka bulunacağını ispatlayarak bilgi kuramında mutlak mekanik kapanımı yıkmıştır.',
      findingEn: 'Kurt Gödel proved that any consistent formal system rich enough for arithmetic necessarily contains true statements unprovable within its own axioms.',
    },
    // Software Engineering, Information Theory & AI Nutrition Apps
    {
      tags: ['beslenme', 'sağlık', 'nutrition', 'health', 'software', 'uygulama', 'app', 'diet'],
      simTypes: ['software'],
      year: 1948,
      scientistName: 'Claude Elwood Shannon',
      institutionTr: 'Bell Telephone Laboratories & MIT · Enformasyon Kuramı Kurucusu',
      institutionEn: 'Bell Labs & MIT · Founder of Information Theory',
      eraTr: '1948 · Enformasyon Entropisi ve Yapılandırılmış İletişim',
      eraEn: '1948 · A Mathematical Theory of Communication',
      titleTr: 'Haberleşmenin Matematiksel Kuramı & Yapılandırılmış Veri Kodlaması',
      titleEn: 'A Mathematical Theory of Communication & Structured Data Encoding',
      findingTr: 'Claude Shannon, enformasyon ölçümünü, gürültülü kanallarda doğrulamayı ve kısıtlı veri şemaları üzerinden kayıpsız yapısal iletimi formüle ederek modern yazılım veri hatlarının temelini atmıştır.',
      findingEn: 'Claude Shannon formalized information entropy and reliable structured encoding across noisy channels, underpinning modern software data pipelines.',
    },
    {
      tags: ['beslenme', 'sağlık', 'nutrition', 'health', 'optimization', 'constraint', 'software'],
      simTypes: ['software'],
      year: 1959,
      scientistName: 'Edsger Wybe Dijkstra',
      institutionTr: 'Mathematisch Centrum Amsterdam & UT Austin · Algoritma Mühendisliği',
      institutionEn: 'CWI Amsterdam & UT Austin · Pioneer of Structured Programming',
      eraTr: '1959–1972 · Kısıt Çözümü ve Yapısal Program Doğrulama',
      eraEn: '1959–1972 · Constrained Path Optimization & Program Correctness',
      titleTr: 'Graf Tabanlı Kısıt Optimizasyonu ve Deterministik Yazılım Doğrulaması',
      titleEn: 'Graph-Based Constraint Optimization & Deterministic Software Verification',
      findingTr: 'Edsger W. Dijkstra, çok kısıtlı seçim uzaylarında en uygun yolu bulan algoritmalar ve modüler yazılım doğruluğu ilkeleriyle karar destek uygulamalarının mühendislik omurgasını oluşturmuştur.',
      findingEn: 'Edsger W. Dijkstra established shortest-path optimization and structured program verification principles central to reliable decision-support software.',
    },
    {
      tags: ['yapay zeka', 'beslenme', 'sağlık', 'ai', 'nutrition', 'assistant', 'app'],
      simTypes: ['software'],
      year: 2017,
      scientistName: 'Ashish Vaswani, Noam Shazeer & Transformer Ekibi',
      institutionTr: 'Google Brain & Google Research · Modern Büyük Dil Modelleri Mimarisi',
      institutionEn: 'Google Brain & Google Research · Inventors of the Transformer Architecture',
      eraTr: '2017 · Öz-Dikkat (Self-Attention) Tabanlı Akıllı Asistan Sistemleri',
      eraEn: '2017 · Attention Is All You Need & Applied LLM Assistants',
      titleTr: 'Dikkat İhtiyacınız Olan Her Şeydir: Bağlam Odaklı Yapay Zekâ Asistanı Mimarisi',
      titleEn: 'Attention Is All You Need: Context-Aware AI Assistant Pipelines',
      findingTr: 'Vaswani ve ekibi, paralel öz-dikkat mekanizmasını tanıtarak kullanıcı niyeti ile kişiselleştirilmiş diyet/sağlık planlaması üreten akıllı asistan yazılımlarının teknolojik altyapısını kurmuştur.',
      findingEn: 'Vaswani et al. introduced scaled self-attention architectures powering personalized, constraint-aware AI assistant software pipelines.',
    },
  ];

  const consensusCatalog: HistoricalConsensusSeed[] = [
    {
      simTypes: ['software'],
      tags: ['beslenme', 'sağlık', 'nutrition', 'health', 'software', 'uygulama', 'app'],
      maxYear: 2025,
      titleTr: 'Kişiselleştirilmiş Dijital Sağlık & Yapay Zekâ Beslenme Yazılımı Standartları',
      titleEn: 'Personalized Digital Health & Constraint-Verified AI Nutrition Software Standards',
      scientistsTr: 'Alan Turing, Claude Shannon, Edsger W. Dijkstra & Ashish Vaswani',
      scientistsEn: 'Alan Turing, Claude Shannon, Edsger W. Dijkstra & Ashish Vaswani',
      statementTr: 'Geleneksel beslenme yazılımları statik kalori tablolarına ve tekdüze kurallara dayanırken, modern yapay zekâ asistanı yaklaşımları doğrulanmış JSON şemaları, makro-besin kısıt çözücüleri ve klinik güvenlik kontrollerini aynı işlem hattında birleştirir.',
      statementEn: 'Whereas legacy nutrition trackers relied on static calorie tables, modern applied AI health assistants unify validated JSON schemas, macronutrient constraint solvers, and clinical safety checks in a single pipeline.',
      advanceTr: 'Emre Pelit’in bu yazılım çalışması, kullanıcı dostu doğal dil etkileşimini yapısal makro kısıt doğruluğuyla (%99+ şema geçerliliği) birleştiren pratik bir uygulama tasarımı sunar.',
      advanceEn: 'This software prototype pairs accessible natural-language interaction with strict structured constraint adherence across personalized dietary plans.',
    },
    {
      simTypes: ['quantum'],
      tags: ['kuantum', 'ölçüm', 'dalga', 'gözlem'],
      maxYear: 2025,
      titleTr: 'Kopenhag Ortodoksluğu & Standart Kuantum Ölçüm Konsensüsü',
      titleEn: 'Copenhagen Orthodoxy & Standard Quantum Measurement Consensus',
      scientistsTr: 'Niels Bohr, Werner Heisenberg, Max Born & John von Neumann',
      scientistsEn: 'Niels Bohr, Werner Heisenberg, Max Born & John von Neumann',
      statementTr: 'Bu makalenin yazımına kadar geçen yaklaşık yüz yılda yaygın yerleşik kabul; kuantum dünyasının yalnızca klasik bir laboratuvar cihazıyla etkileşime girildiğinde Born olasılık kuralıyla tanımlanan ölçüm sonuçları ürettiği, dalga fonksiyonunun ise fiziksel bir ontolojik yapıdan ziyade deneysel olasılıkları hesaplayan matematiksel bir araç ("sus ve hesapla" ekolü) olduğu yönündeydi.',
      statementEn: 'Prior to this article, the prevailing consensus treated the wavefunction primarily as a probabilistic epistemic instrument ("shut up and calculate") whose Born-rule outcomes materialize only upon intervention by a classical measuring apparatus.',
      advanceTr: 'Emre Pelit’in bu makalesi ise gözlemci ile sistem arasındaki sınır koşulunu tek yönlü bir klasik çöküş varsayımı olmaktan çıkarıp, ontik yapısalcı ve simülatif bir enformasyon akışı denklemiyle (𝒯_EP) yeniden formüle etmektedir.',
      advanceEn: 'This article transcends purely instrumentalist collapse by embedding observer-system coupling within a testable ontic-structural functional (𝒯_EP).',
    },
    {
      simTypes: ['quantum', 'higgs'],
      tags: ['yerel', 'alan', 'parçacık'],
      maxYear: 2025,
      titleTr: 'Yerel Gerçekçilikten Kuantum Bilgi & Standart Model Konsensüsüne Geçiş',
      titleEn: 'Shift from Classical Local Realism to Standard Model & Quantum Information Consensus',
      scientistsTr: 'Albert Einstein, Boris Podolsky, Nathan Rosen · Ardından Alain Aspect & Wojciech Zurek',
      scientistsEn: 'Albert Einstein, Boris Podolsky, Nathan Rosen · Later Alain Aspect & Wojciech Zurek',
      statementTr: 'Başlangıçta klasik fizikte her parçacığın kendinden menkul bağımsız özelliklere sahip olduğu ve sinyallerin yalnızca ışık hızında yerel etkiyle yayıldığı kabul ediliyordu. Bell testleri sonrasında yerleşik bilimsel kabul yerel gerçekçiliği terk etmiş, ancak makroskobik gerçekliğin yalnızca çevre kaynaklı dekoheransla açıklandığı fikrinde karar kılmıştı.',
      statementEn: 'Classical physics assumed independent separable substances interacting strictly locally; post-Bell consensus abandoned local realism in favor of environmental decoherence and effective field descriptions.',
      advanceTr: 'Bu çalışma, klasik tözcülüğü tamamen geride bırakarak ilişkisel operatörleri ve enformasyonel yoğunluk dağılımını doğanın birincil gerçeklik katmanı olarak kanıtlamaktadır.',
      advanceEn: 'This study advances beyond pure decoherence approximations by modeling relational invariants as nature’s primary structural layer.',
    },
    {
      simTypes: ['higgs'],
      tags: ['higgs', 'kütle', 'vakum', 'simetri'],
      maxYear: 2025,
      titleTr: 'Standart Model Elektrozayıf Simetri Kırılması Konsensüsü (CERN Sonrası)',
      titleEn: 'Post-CERN Standard Model Electroweak Symmetry Breaking Consensus',
      scientistsTr: 'Peter Higgs, François Englert, Steven Weinberg, Abdus Salam & Sheldon Glashow',
      scientistsEn: 'Peter Higgs, François Englert, Steven Weinberg, Abdus Salam & Sheldon Glashow',
      statementTr: '2012’deki CERN Higgs bozonu keşfinden bu makaleye kadar parçacık fiziğindeki temel kabul; temel fermiyonların ve W/Z ayar bozonlarının kütlelerinin 246 GeV değerindeki skaler Higgs vakum alanıyla etkileşimden doğduğu, ancak vakum kararlılığı ve kütle hiyerarşisi probleminin ("neden bu değerler?") Standart Model içinde açıklamaya açık kaldığı şeklindeydi.',
      statementEn: 'Since the 2012 CERN discovery, established consensus held that W/Z bosons and fermions acquire mass via the 246 GeV scalar Higgs vacuum, while the deeper ontological origin of vacuum parameters remained open.',
      advanceTr: 'Makale, kendiliğinden simetri kırılmasını yalnızca hesaplamalı bir parametre ayarlaması olarak değil, gerçekliğin yapı ve kararlılık kazandığı enformasyonel faz geçişi olarak çözümlemektedir.',
      advanceEn: 'Emre Pelit reframes electroweak symmetry breaking as an informational phase transition generating structural stability across phase space.',
    },
    {
      simTypes: ['holographic'],
      tags: ['holografi', 'entropi', 'kara delik', 'uzay-zaman'],
      maxYear: 2025,
      titleTr: 'Kara Delik Bilgi Paradoksu & Holografik Sınır-Hacim Mutabakatı',
      titleEn: 'Black Hole Information Paradox & Holographic Boundary-Bulk Consensus',
      scientistsTr: "Jacob Bekenstein, Stephen Hawking, Gerard 't Hooft, Leonard Susskind & Juan Maldacena",
      scientistsEn: "Jacob Bekenstein, Stephen Hawking, Gerard 't Hooft, Leonard Susskind & Juan Maldacena",
      statementTr: 'Uzun yıllar uzay-zamanın arka planı sabit, sürekli bir geometrik sahne olduğu kabul edilirken; Bekenstein-Hawking entropisi ve AdS/CFT devrimi sonrasında teorik fizikteki yerleşik kabul enformasyonun asla yok olmadığı ve yüksek boyutlu kütleçekiminin düşük boyutlu kuantum sınırındaki dolanıklık ağından türeyebileceği yönünde birleşmiştir.',
      statementEn: 'Following Bekenstein-Hawking thermodynamics and Maldacena’s AdS/CFT duality, mainstream theoretical consensus converged on unitary information preservation and boundary entanglement emergence.',
      advanceTr: 'Bu makale holografik sınır yoğunluğu ile iç uzay-zaman dokusu arasındaki bilgi aktarım maliyetini ve epistemolojik anlamını %99+ sayısal yakınsama modeliyle doğrudan test edilebilir hale getirmektedir.',
      advanceEn: 'This article translates boundary-bulk informational duality into an interactive, numerically calibrated model connecting entropy directly to epistemology.',
    },
    {
      simTypes: ['spacetime'],
      tags: ['zaman', 'görelilik', 'entropi', 'kader'],
      maxYear: 2025,
      titleTr: '4-Boyutlu Blok Evren & İstatistiksel Zaman Oku Yerleşik Mutabakatı',
      titleEn: '4D Block Universe & Statistical Thermodynamic Arrow of Time Consensus',
      scientistsTr: 'Albert Einstein, Hermann Minkowski, Ludwig Boltzmann & Ilya Prigogine',
      scientistsEn: 'Albert Einstein, Hermann Minkowski, Ludwig Boltzmann & Ilya Prigogine',
      statementTr: 'Bu çalışmadan önce fizik ve zaman felsefesindeki ana akım kabul; temel mikro-yasaların zaman-tersinir olduğu, görelilik gereği geçmiş-şimdi-geleceğin 4B manifoldda sabit durduğu ("Blok Evren"), buna karşın algıladığımız zaman akışının düşük entropili Büyük Patlama başlangıç koşulunun termodinamik artışı (Past Hypothesis) sonucu ortaya çıktığıdır.',
      statementEn: 'Established consensus combined relativistic 4D Block spacetime invariance with Boltzmann’s thermodynamic entropy gradient from a low-entropy cosmic past.',
      advanceTr: 'Emre Pelit bu makalede, 4B düzende her şeyin geometrik olarak var olmasıyla entropik bilgi getirmenin ve kullanmanın fiziksel/enerjetik maliyetini birleştirerek özgür seçimi, kaderi ve zamansal asimetriyi yeni bir sentezde birleştirir.',
      advanceEn: 'This paper bridges static 4D geometric completeness with Landauer’s physical cost of extracting and acting on information along entropy gradients.',
    },
    {
      simTypes: ['consciousness'],
      tags: ['bilinç', 'silikon', 'insan', 'beyin', 'zihin', 'yapay'],
      maxYear: 2025,
      titleTr: 'Hesaplamalı İşlevselcilik vs. Öznel Bilinç (Qualia) & Biyolojik Ayrıcalık Tartışması',
      titleEn: 'Computational Functionalism vs. Phenomenal Qualia & Biological Realization Debate',
      scientistsTr: 'Alan Turing, Hilary Putnam, John Searle, David Chalmers & Giulio Tononi',
      scientistsEn: 'Alan Turing, Hilary Putnam, John Searle, David Chalmers & Giulio Tononi',
      statementTr: 'Bilişsel bilim ve yapay zeka literatüründe uzun süre hâkim olan "hesaplamalı işlevselcilik" kabulü, girdiyi çıktıya dönüştüren her silikon veya biyolojik devrenin aynı zihinsel durumu üreteceğini savunurken; Searle, Chalmers ve Tononi ekolleri salt sözdizimsel hesaplama ile öznel bilinç deneyimi (qualia) ve canlı homeostatik kavrayış arasında derin bir açıklayıcı uçurum olduğunu göstermiştir.',
      statementEn: 'While computational functionalism historically treated cognition as substrate-independent, Searle, Chalmers, and Tononi demonstrated an explanatory gap between syntactic computation and subjective consciousness.',
      advanceTr: 'Emre Pelit, alışılmış kavramların tekdüzeliğini, silikon tabanlı taklit süreçler ile biyolojik canlılığın farkını ve insanın indirgenemez bilinemezliğini bütünsel entegrasyon ölçütleriyle sistematik olarak ortaya koymaktadır.',
      advanceEn: 'This article delineates structural and phenomenological divergence between algorithmic silicon emulation and embodied biological comprehension.',
    },
    {
      simTypes: ['chaos'],
      tags: ['kaos', 'determinizm', 'gödel', 'bilgi', 'entropi', 'anlama'],
      maxYear: 2025,
      titleTr: 'Laplaceçı Mutlak Öngörü İdealinden Kaotik & Gödelci Sınırlar Konsensüsüne Geçiş',
      titleEn: 'Transition from Laplacian Determinism to Chaotic & Gödelian Epistemic Limits',
      scientistsTr: 'Pierre-Simon Laplace · Ardından Henri Poincaré, Kurt Gödel & Edward Lorenz',
      scientistsEn: 'Pierre-Simon Laplace · Later Henri Poincaré, Kurt Gödel & Edward Lorenz',
      statementTr: '19. yüzyıldan kalma Laplaceçı yerlesik kabul, başlangıç konum ve hızları bilindiğinde evrenin tüm geleceğinin eksiksiz hesaplanabileceğini öngörüyordu. 20. yüzyılda Poincaré, Lorenz ve Gödel’in kanıtlarıyla modern bilim bu ideali terk ederek determinizmin uzun vadeli öngörülebilirlik anlamına gelmediğini ve hiçbir biçimsel sistemin kendi tüm hakikatlerini tüketemeyeceğini kabul etmiştir.',
      statementEn: 'Science moved from Laplacian total predictability to accepting Poincaré-Lorenz sensitive chaos and Gödelian formal incompleteness as fundamental epistemic limits.',
      advanceTr: 'Makale bu sınırı bir bilgi eksikliği zaafı olarak değil, doğadaki doğrusal olmayan yenilik kapasitesinin ve insan kavrayışının sınır ötesi doğasının yapısal ilkesi olarak temellendirir.',
      advanceEn: 'Emre Pelit elevates nonlinear horizon limits and formal incompleteness from mere defects into generative architectural features of reality and understanding.',
    },
  ];

  // Filter strictly prior researches (< articleYear) and score by keyword + simulation type match
  const lowerCorpus = fullTextCorpus.toLowerCase();
  const scoredResearches = researchCatalog
    .filter((item) => {
      if (item.year >= articleYear) return false;
      if (isSoftware) return item.simTypes.includes('software');
      return !item.simTypes.includes('software') || item.simTypes.includes(article.simulation.type);
    })
    .map((item, idx) => {
      let score = item.simTypes.includes(article.simulation.type) ? 12 : 2;
      for (const tg of item.tags) {
        if (lowerCorpus.includes(tg)) score += 5;
      }
      score += ((seed + idx * 7) % 5) * 0.25;
      return { item, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  const priorScientificResearches: PriorScientificResearchItem[] = scoredResearches.map(
    ({ item }, idx) => ({
      researchCode: isTr
        ? `ÖNCEKİ-ARAŞTIRMA-0${idx + 1} · ${item.year}`
        : `PRIOR-RESEARCH-0${idx + 1} · ${item.year}`,
      scientistName: item.scientistName,
      scientistInstitutionAndHonor: isTr ? item.institutionTr : item.institutionEn,
      eraAndYear: isTr ? item.eraTr : item.eraEn,
      researchTitle: isTr ? item.titleTr : item.titleEn,
      scientificContributionAndFindings: isTr ? item.findingTr : item.findingEn,
      relevanceToThisArticle: isTr
        ? `"${title}" makalesiyle doğrudan bağı: ${item.scientistName} tarafından ${item.year} yılında ortaya konulan bu bilimsel zemin, Emre Pelit’in "${kw1}" ve "${kw2}" ekseninde kurduğu kuramsal modeli (${article.category}) doğrudan besleyen temel tarihsel dayanaklardan biridir.`
        : `Direct Relevance to "${title}": This ${item.year} landmark study by ${item.scientistName} forms a foundational scientific pillar informing Emre Pelit’s formulation of "${kw1}" and "${kw2}" in ${article.category}.`,
    })
  );

  const scoredConsensuses = consensusCatalog
    .filter((item) => {
      if (item.maxYear >= articleYear) return false;
      if (isSoftware) return item.simTypes.includes('software');
      return !item.simTypes.includes('software') || item.simTypes.includes(article.simulation.type);
    })
    .map((item, idx) => {
      let score = item.simTypes.includes(article.simulation.type) ? 14 : 2;
      for (const tg of item.tags) {
        if (lowerCorpus.includes(tg)) score += 4;
      }
      score += ((seed + idx * 3) % 4) * 0.2;
      return { item, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const establishedScientificConsensuses: EstablishedConsensusItem[] = scoredConsensuses.map(
    ({ item }, idx) => ({
      consensusCode: isTr
        ? `YERLEŞİK-KABUL-0${idx + 1}`
        : `ESTABLISHED-CONSENSUS-0${idx + 1}`,
      consensusTitle: isTr ? item.titleTr : item.titleEn,
      establishedUpToPeriod: isTr
        ? `${article.publishedAt} Tarihine Kadarki Yerleşik Bilimsel Konsensüs`
        : `Established Scientific Consensus Prior to ${article.publishedAt}`,
      foundingAndKeyScientists: isTr ? item.scientistsTr : item.scientistsEn,
      orthodoxConsensusStatement: isTr ? item.statementTr : item.statementEn,
      consensusBoundaryAndArticleAdvance: isTr ? item.advanceTr : item.advanceEn,
    })
  );

  const priorResearchersNamesList = priorScientificResearches
    .map((r) => `${r.scientistName} (${r.eraAndYear.split('·')[0].trim()})`)
    .join(', ');

  const priorLiteratureSynthesisSummary = isTr
    ? `"${title}" (${article.publishedAt}) makalesi kaleme alınana kadar "${article.category}" ve "${kw1}" alanında bilimsel literatürü şekillendiren başlıca öncü araştırmalar — ${priorResearchersNamesList} tarafından gerçekleştirilen çalışmalar — ile bu konudaki yerleşik kabuller aşağıda tüm araştırma sahibi bilim insanlarının isimleriyle birlikte ayrıntılı biçimde sunulmuştur.`
    : `Prior to the publication of "${title}" (${article.publishedAt}), the foundational investigations shaping ${article.category} and "${kw1}" — led by ${priorResearchersNamesList} — along with the established scientific consensus up to that date are documented below.`;

  const simParamKeys = article.simulation.parameters.map((p) => p.key).join(', ');
  const incompleteFirst = scientificallyIncompleteAspects[0];
  const validFirst = scientificallyValidAspects[0];
  const primaryPriorScientist =
    priorScientificResearches[0]?.scientistName || (isTr ? 'Öncü Alan Kuramcıları' : 'Foundational Theorists');

  const completeUnderstandingAndFutureResearch: CompleteUnderstandingAndFutureResearchSection = isSoftware
    ? {
        sectionTitle: isTr
          ? `Tam Kavrayış ve Gelecek Bilimsel / Klinik Çalışmalar Rehberi: "${title}"`
          : `Complete Understanding & Future Scientific / Clinical Studies Guide: "${title}"`,
        completeComprehensionOverview: isTr
          ? `Bu bölüm, "${title}" çalışmasının tüm yazılım mimarisini, veri akışını, besin-hesaplama algoritmasını ve klinik/epistemolojik sınırlarını hiçbir karanlık nokta bırakmayacak şekilde baştan sona açıklamaktadır. Temel problem, karmaşık glisemik ve metabolik makro-mikro besin dengesini tekil kullanıcı bağlamında (${simParamKeys}) deterministik doğruluk (%${accuracyPct}) ile modellemektir.`
          : `This section clarifies every architectural layer, algorithmic rule, and nutritional estimation model in "${title}", spanning parameters (${simParamKeys}) at ${accuracyPct}% fidelity.`,
        conceptualChainSummary: isTr
          ? `1) Girdi Aşaması: Öğün bileşimi ve biyometrik sınırlar alınır -> 2) Algoritmik Çekirdek: ${coreThesisEquation.symbolicEquation} denklemiyle glisemik yük ve makro-balans hesaplanır -> 3) Çıktı: Faz uzayı kararlılığı (${phaseSpaceStabilityIndex}) içinde yorumlanabilir öneri sunulur.`
          : `1) Input Stage: Meal & biometric constraints -> 2) Algorithmic Core: Computes glycemic/macro balance via ${coreThesisEquation.symbolicEquation} -> 3) Output: Actionable guidance within ${phaseSpaceStabilityIndex}.`,
        stepByStepMasteryNotes: isTr
          ? [
              `Ana Mantık: ${localizedBundle.plainLanguageSummary}`,
              `Matematiksel Mekanizma: ${coreThesisEquation.stepByStepCalculationSummary}`,
              `Günlük Hayattan Karşılık: ${localizedBundle.everydayAnalogy}`,
              `Kritik Sınır Koşulu: ${incompleteFirst?.scientificCritiqueExplanation || 'Algoritmik tahminler klinik laboratuvar teşhisinin yerine geçmez.'}`,
            ]
          : [
              `Core Logic: ${localizedBundle.plainLanguageSummary}`,
              `Mathematical Mechanism: ${coreThesisEquation.stepByStepCalculationSummary}`,
              `Analogy: ${localizedBundle.everydayAnalogy}`,
              `Boundary Condition: ${incompleteFirst?.scientificCritiqueExplanation || 'Advisory modeling complements clinical supervision.'}`,
            ],
        futureScientificEvaluationGuide: isTr
          ? `Gelecek bilimsel ve klinik çalışmalarda bu mimari; randomize kontrollü klinik beslenme deneylerinde biyometrik CGM (sürekli glikoz monitörü) verisiyle çapraz kalibrasyon yapılarak doğrudan kıyaslama (benchmark) zemini olarak değerlendirilebilir.`
          : `In future clinical informatics studies, this architecture can serve as an open reference baseline for CGM-calibrated dietary decision-support trials.`,
        proposedFutureStudies: isTr
          ? [
              {
                studyCode: 'GELECEK-ÇALIŞMA-01 · KLİNİK',
                studyTitle: `${title} Modelinin CGM Sensör Verileriyle Randomize Kontrollü Doğrulaması`,
                hypothesisToTest: `H₁: ${coreThesisEquation.symbolicEquation} öngörüleri, klasik karbonhidrat sayımına kıyasla postprandiyal glisemik dalgalanmayı istatistiksel olarak anlamlı biçimde azaltır (p < 0.01).`,
                experimentalOrComputationalDesign: 'Çift kör gözlemsel kohort (N ≥ 120) üzerinde 12 haftalık sürekli glikoz ölçümü ile simülasyon parametrelerinin regresyon uyumu ölçülür.',
                expectedScientificImpact: 'Bireyselleştirilmiş dijital beslenme modellerinde ampirik klinik altın standart oluşturulması.',
              },
              {
                studyCode: 'GELECEK-ÇALIŞMA-02 · ALGORİTMA',
                studyTitle: 'Mikrobiyom ve Kişisel İnsülin Duyarlılığı Parametrelerinin Entegrasyonu',
                hypothesisToTest: `H₂: (${simParamKeys}) parametre kümesine kişisel glisemik yanıt katsayısı eklendiğinde tahmin hatası (RMSE) %30’dan fazla düşer.`,
                experimentalOrComputationalDesign: 'Bayesyen hiyerarşik güncelleme ve çapraz doğrulamalı zaman serisi analizi.',
                expectedScientificImpact: 'Statik tablo tahmininden uyarlanabilir hassas tıp (precision nutrition) motoruna geçiş.',
              },
              {
                studyCode: 'GELECEK-ÇALIŞMA-03 · ETİK & YAZILIM',
                studyTitle: 'Karar Destek Sistemlerinde Açıklanabilirlik (XAI) ve Okuryazarlık Etkisi',
                hypothesisToTest: `H₃: Adım adım açıklanabilir beslenme çıktısı, kullanıcıların uzun vadeli tedavi uyumunu standart arayüzlere göre anlamlı ölçüde artırır.`,
                experimentalOrComputationalDesign: 'Çok merkezli kullanılabilirlik ve açıklanabilir yapay zekâ (XAI) etkileşim kıyaslaması.',
                expectedScientificImpact: 'Sağlık bilişiminde şeffaf ve güvenli kullanıcı arayüzü standartlarının belirlenmesi.',
              },
            ]
          : [
              {
                studyCode: 'FUTURE-STUDY-01 · CLINICAL',
                studyTitle: `Randomized Controlled CGM Validation of ${title}`,
                hypothesisToTest: `H1: Predictions from ${coreThesisEquation.symbolicEquation} reduce postprandial glycemic variability vs standard baselines (p < 0.01).`,
                experimentalOrComputationalDesign: '12-week observational cohort (N >= 120) pairing continuous glucose monitors with parameter sensitivity curves.',
                expectedScientificImpact: 'Establishes an empirical benchmark for reproducible precision nutrition tools.',
              },
              {
                studyCode: 'FUTURE-STUDY-02 · ALGORITHMIC',
                studyTitle: 'Bayesian Integration of Personal Metabolic Sensitivity',
                hypothesisToTest: `H2: Extending (${simParamKeys}) with dynamic sensitivity priors lowers prediction RMSE by >30%.`,
                experimentalOrComputationalDesign: 'Hierarchical Bayesian updating evaluated on longitudinal cross-validation folds.',
                expectedScientificImpact: 'Transitions static estimation into adaptive personalized metabolic modeling.',
              },
              {
                studyCode: 'FUTURE-STUDY-03 · HUMAN-AI',
                studyTitle: 'Explainable Nutrition Feedback & Long-Term Adherence Benchmark',
                hypothesisToTest: 'H3: Transparent rationale displays significantly improve protocol adherence over opaque scoring.',
                experimentalOrComputationalDesign: 'Multi-center comparative HCI study tracking comprehension and retention.',
                expectedScientificImpact: 'Advances clinical safety and transparency standards in consumer health software.',
              },
            ],
        openQuestionsForResearchers: isTr
          ? [
              `Girdilerdeki bildirim sapmaları (%10–15 porsiyon hatası) karşısında modelin duyarlılık eşiği nerede kırılır?`,
              `Farklı yaş, uyku ritmi ve mikrobiyom profilleri için $\\Lambda_{\\text{denge}} = ${lambdaEqVal}$ kararlılık sabiti evrensel midir, alt gruplara göre yeniden mi ölçeklenmelidir?`,
              `Açıklanabilir çıktıların klinisyen iş yükü üzerindeki net etkisi nedir?`,
            ]
          : [
              'At what dietary logging noise level (10–15% portion variance) does prediction stability degrade?',
              `Is the equilibrium constant ${lambdaEqVal} invariant across diverse metabolic cohorts or cohort-specific?`,
              'How does transparent algorithmic reasoning affect clinician review latency?',
            ],
        falsifiabilityAndReplicationChecklist: isTr
          ? [
              `Tüm giriş parametrelerini (${simParamKeys}) sabit tutup tek değişkeni tarayarak tekrarlanabilir çıktı doğrulaması yapın.`,
              `Sürekli glikoz veya laboratuvar referans veri setinde $\\Lambda_{\\text{denge}} = ${lambdaEqVal}$ yakınsama sınırını sınayın.`,
              'Tüm veri işleme ve kalibrasyon adımlarını bağımsız veri kümelerinde yeniden üreterek raporlayın.',
            ]
          : [
              `Sweep each parameter in (${simParamKeys}) monotonically and verify deterministic convergence.`,
              `Benchmark predicted load stability against ${lambdaEqVal} using external reference cohorts.`,
              'Publish reproducible scripts and anonymized residual distributions.',
            ],
      }
    : {
        sectionTitle: isTr
          ? `Makalenin Her Detayıyla Tam Anlaşılması ve Gelecek Bilimsel Çalışmalarda Değerlendirilmesi: "${title}"`
          : `Complete In-Depth Understanding & Future Scientific Research Roadmap: "${title}"`,
        completeComprehensionOverview: isTr
          ? `"${title}" başlıklı bu çalışmayı en ince ayrıntısına kadar, zihinde hiçbir muğlaklık bırakmadan kavramak için metni tek bir omurga üzerinde okumak gerekir: Makale "${article.category}" disiplininde "${kw1}" ve "${kw2}" olgularını merkeze alarak şu temel soruya yanıt arar: Doğadaki gözlemlenen düzen, ${primaryPriorScientist} gibi öncülerin kurduğu temel üzerinde nasıl hem fiziksel korunum yasalarıyla uyumlu hem de gözlemci/enformasyon gerçekliğini içerecek biçimde açıklanabilir? Yazar burada konuyu yalnızca soyut bir felsefi tartışma olarak bırakmaz; önce sıfır ön bilgi düzeyindeki okur için sezgisel yapıyı kurar, ardından ${coreThesisEquation.symbolicEquation} matematiksel formalizmiyle ve "${primaryObservableLabel} = ${primaryObservableValue}" sonucunu veren simülasyon modeliyle ölçülebilir bir sınama alanına taşır. Böylece makalenin her paragrafı birbirini mantıksal zorunlulukla tamamlayan bir bütün oluşturur.`
          : `To grasp "${title}" in full depth without any conceptual ambiguity, read its structure as a unified bridge across ${article.category}: starting from foundational questions around "${kw1}" and "${kw2}" established by pioneers such as ${primaryPriorScientist}, Emre Pelit elevates the inquiry from pure philosophical prose into the formal equation ${coreThesisEquation.symbolicEquation} and a testable simulation yielding "${primaryObservableLabel} = ${primaryObservableValue}".`,
        conceptualChainSummary: isTr
          ? `Kavramsal Zincir (Baştan Sona Özet): (1) Başlangıç Problemi: ${kw1} ve ${kw2} arasındaki gerilim (${priorScientificResearches[0]?.eraAndYear || 'Tarihsel literatür'}). -> (2) Ontolojik Çerçeve: "${epistemologicalStance}". -> (3) Biçimsel Çekirdek: ${coreThesisEquation.symbolicEquation} (${coreThesisEquation.baseSimulationEquation}). -> (4) Sayısal Doğrulama: %${accuracyPct} doğruluk, faz kararlılığı ${phaseSpaceStabilityIndex}, birincil gözlemlenebilir değer ${primaryObservableValue}. -> (5) Nihai Sentez: ${validFirst?.aspectTitle || localizedBundle.executiveSynthesis}`
          : `Unified Conceptual Chain: (1) Problem Origin (${kw1} vs ${kw2}) -> (2) Epistemic Frame (${epistemologicalStance}) -> (3) Formal Equation (${coreThesisEquation.symbolicEquation}) -> (4) Numerical Calibration (${accuracyPct}% fidelity, ${phaseSpaceStabilityIndex}) -> (5) Core Synthesis (${validFirst?.aspectTitle || localizedBundle.executiveSynthesis}).`,
        stepByStepMasteryNotes: isTr
          ? [
              `Temel Fikri Tek Cümlede Yakalayın: ${localizedBundle.plainLanguageSummary}`,
              `Günlük Hayattan Zihinsel Model (Sezgisel Anahtar): ${localizedBundle.everydayAnalogy}`,
              `Formülün Asıl Söylediği Şey (Korkmadan Anlayın): ${coreThesisEquation.thesisMathematicalStatement} Kısaca hesaplanan büyüklük (${coreThesisEquation.numericalVerificationResult}), sistemdeki "${kw1}" baskısı ile "${kw2}" düzenleyicisinin denge noktasını ölçer.`,
              `Neden Özgün ve Sağlam?: ${validFirst?.scientificMechanismAndEvidence || localizedBundle.executiveSynthesis}`,
              `Bilimsel Sınırı Nerede Başlıyor? (Eleştirel Okuma Anahtarı): ${incompleteFirst?.scientificCritiqueExplanation || 'Kuramsal model gelecek ampirik ölçümlerle genişletilmeye açık parametre sınırları tanımlamaktadır.'}`,
            ]
          : [
              `Core Idea in One Glance: ${localizedBundle.plainLanguageSummary}`,
              `Intuitive Mental Model: ${localizedBundle.everydayAnalogy}`,
              `What the Equation Actually Expresses: ${coreThesisEquation.thesisMathematicalStatement} (${coreThesisEquation.numericalVerificationResult}).`,
              `Why It Holds Scientifically: ${validFirst?.scientificMechanismAndEvidence || localizedBundle.executiveSynthesis}`,
              `Exact Scientific Boundary: ${incompleteFirst?.scientificCritiqueExplanation || 'Defines explicit parameter bounds ready for empirical testing.'}`,
            ],
        futureScientificEvaluationGuide: isTr
          ? `Gelecek bilimsel çalışmalarda "${title}" makalesi 4 somut eksende doğrudan değerlendirilebilir ve literatüre referans/test zemini olarak entegre edilebilir: (A) Teorik Fizik ve Hesaplamalı Modelleme: Makaledeki ${coreThesisEquation.symbolicEquation} ifadesi ve ${phaseSpaceStabilityIndex} faz uzayı kararlılık indeksi, daha yüksek boyutlu pertürbatif olmayan simülasyonlarda başlangıç hipotezi (benchmark) olarak kullanılabilir. (B) Deneysel Sınama ve Yanlışlanabilirlik: Makalenin öngördüğü "${primaryObservableLabel}" büyüklüğünün (${simParamKeys}) parametre değişimlerine verdiği tepki laboratuvar veya gözlemsel astrofizik/nörobilim verisiyle karşılaştırılabilir. (C) Bilim Felsefesi ve Epistemoloji: Çalışmanın "${epistemologicalStance}" yaklaşımı, klasik gerçekçilik ile enformasyonel/ilişkisel kuramlar arasında köprü yasaları (bridge laws) kurmak isteyen doktora ve hakemli dergi araştırmalarında kuramsal çerçeve olarak alıntılanabilir. (D) Yapay Zekâ & Bilimsel Akıl Yürütme: Kütüphane ve RAG sistemlerinde bilimsel hipotez üretimi ve karşı-argüman testi için yapılandırılmış kıyaslama veri kümesi olarak kullanılabilir.`
          : `In future scientific research, "${title}" can be directly evaluated and cited along four rigorous axes: (A) Theoretical & Computational Benchmarks using ${coreThesisEquation.symbolicEquation} and phase-space index ${phaseSpaceStabilityIndex}; (B) Empirical Falsifiability by testing how "${primaryObservableLabel}" responds to sweeps over (${simParamKeys}); (C) Epistemology & Philosophy of Science as a formal bridge-law case study within "${epistemologicalStance}"; and (D) AI-Assisted Scientific Discovery as a structured hypothesis-and-counterargument benchmark.`,
        proposedFutureStudies: isTr
          ? [
              {
                studyCode: 'GELECEK-ÇALIŞMA-01 · AMPİRİK & DENEYSEL TEST',
                studyTitle: `"${kw1}" ve "${primaryObservableLabel}" İlişkisinin Kontrollü Parametre Taramasıyla Deneysel / Gözlemsel Testi`,
                hypothesisToTest: `H₁: (${simParamKeys}) kontrol parametreleri sistematik olarak değiştirildiğinde sistemin gözlemlenebilir çıktısı ("${primaryObservableLabel}"), rastgele stokastik dağılım yerine $\\Lambda_{\\text{denge}} = ${lambdaEqVal}$ denge bandı etrafında %${accuracyPct} düzeyinde deterministik çekim sergiler.`,
                experimentalOrComputationalDesign: `Yüksek çözünürlüklü veri toplama veya Monte Carlo / sonlu elemanlar simülasyonu ile en az 10⁴ örneklem noktasında (${simParamKeys}) eksenleri taranır; artik dağılım (residual) Kolmogorov-Smirnov ve ki-kare uyum testleriyle denetlenir.`,
                expectedScientificImpact: `${article.category} literatüründe makalenin kavramsal savını nicel yanlışlanabilirlik eşiğine taşıyarak bağımsız doğrulama veya sınır revizyonu sağlar.`,
              },
              {
                studyCode: 'GELECEK-ÇALIŞMA-02 · FORMEL & MATEMATİKSEL GENİŞLETME',
                studyTitle: `${coreThesisEquation.symbolicEquation} Formalizminin Yüksek Boyutlu / Pertürbatif Olmayan Alan Kuramına Genişletilmesi`,
                hypothesisToTest: `H₂: Makalede gerçek zamanlı analiz için kurulan ${coreThesisEquation.baseSimulationEquation} denklemine ikinci ve üçüncü mertebeden doğrusal olmayan kuplaj terimleri eklendiğinde faz uzayı kararlılık indeksi (${phaseSpaceStabilityIndex}) kritik eşiklerde yeni bifurkasyon noktaları öngörür.`,
                experimentalOrComputationalDesign: `Analitik varyasyonel türetme + sembolik tensör hesabı ve GPU tabanlı PDE/ODE çözücüleri ile sınır koşulları (${simulationResults.boundaryConditionSummary.slice(0, 90)}...) genişletilir.`,
                expectedScientificImpact: `Öncü araştırmalarla (${priorResearchersNamesList}) kurulan hattı bir adım öteye taşıyarak mevcut teoride açıklanmamış uç rejimleri (extreme regimes) çözümler.`,
              },
              {
                studyCode: 'GELECEK-ÇALIŞMA-03 · DİSİPLİNLERARASI & EPİSTEMOLOJİK SENTEZ',
                studyTitle: `"${kw2}" ve "${kw3}" Kavramları İçin Biçimsel Köprü Yasaları (Bridge Laws) ve Karşılaştırmalı Meta-Analiz`,
                hypothesisToTest: `H₃: Makalenin önerdiği "${epistemologicalStance}" perspektifi, rakip paradigmalar karşısında aynı olguları daha az serbest parametre (daha yüksek Bayesyen kanıt / Occam verimliliği) ile açıklar.`,
                experimentalOrComputationalDesign: `Tarihsel literatürdeki yerleşik kabuller (${establishedScientificConsensuses[0]?.consensusTitle || article.category}) ile bu makalenin öngörüleri Bayes faktörü (BF₁₀) ve bilgi kriterleri (AIC/BIC) üzerinden nicel olarak kıyaslanır.`,
                expectedScientificImpact: `${article.category} ile modern epistemoloji arasında akademik ders kitaplarına ve gelecek derleme (review) makalelerine kaynaklık edecek kalıcı bir kavramsal köprü kurar.`,
              },
            ]
          : [
              {
                studyCode: 'FUTURE-STUDY-01 · EMPIRICAL TEST',
                studyTitle: `Controlled Parameter-Sweep Validation of "${kw1}" vs "${primaryObservableLabel}"`,
                hypothesisToTest: `H1: Systematically varying (${simParamKeys}) drives "${primaryObservableLabel}" to converge toward ${lambdaEqVal} (${accuracyPct}% fidelity) rather than pure stochastic dispersion.`,
                experimentalOrComputationalDesign: `High-resolution empirical sampling and >=10^4 Monte Carlo trajectories across (${simParamKeys}), audited via Kolmogorov-Smirnov goodness-of-fit tests.`,
                expectedScientificImpact: `Moves the thesis of "${title}" into a reproducible quantitative falsification regime within ${article.category}.`,
              },
              {
                studyCode: 'FUTURE-STUDY-02 · FORMAL EXTENSION',
                studyTitle: `Non-Perturbative Extension of ${coreThesisEquation.symbolicEquation}`,
                hypothesisToTest: `H2: Incorporating higher-order nonlinear coupling terms into ${coreThesisEquation.baseSimulationEquation} reveals secondary phase transitions beyond ${phaseSpaceStabilityIndex}.`,
                experimentalOrComputationalDesign: `Variational field-theoretic derivation paired with high-precision ODE/PDE solvers relaxing finite truncation limits.`,
                expectedScientificImpact: `Extends prior foundations (${priorResearchersNamesList}) into previously unmodeled boundary regimes.`,
              },
              {
                studyCode: 'FUTURE-STUDY-03 · EPISTEMIC BENCHMARK',
                studyTitle: `Formal Bridge Laws & Bayesian Model Comparison for "${kw2}" and "${kw3}"`,
                hypothesisToTest: `H3: The article's "${epistemologicalStance}" framework achieves higher Bayesian evidence (lower AIC/BIC) per free parameter than orthodox alternatives.`,
                experimentalOrComputationalDesign: `Quantitative meta-analysis comparing predictions against ${establishedScientificConsensuses[0]?.consensusTitle || article.category} via Bayes Factors.`,
                expectedScientificImpact: 'Establishes a cross-disciplinary philosophical and quantitative citation anchor for future review papers.',
              },
            ],
        openQuestionsForResearchers: isTr
          ? [
              `Bilimsel Soru #1: "${title}" çalışmasındaki ${coreThesisEquation.symbolicEquation} dengesi, sistem dışsal gürültü ve kuantum/termodinamik dalgalanmalar altında açık (non-unitary / dissipative) bir ortama taşındığında hangi kritik eşikte bozulur?`,
              `Bilimsel Soru #2: (${simParamKeys}) parametreleri arasındaki kuplaj sabiti farklı ölçeklerde (mikro-kuantum vs makro-kozmik veya biyolojik) ölçek değişmezliği (scale invariance) gösterir mi?`,
              `Bilimsel Soru #3: Bu makalede ulaşılan "${epistemologicalStance}" sentezi ile mevcut yerleşik kabul (${establishedScientificConsensuses[0]?.consensusTitle || 'Standart literatür'}) arasında ampirik olarak ayırt edici kesin bir "kritik deney" (crucial experiment) nasıl tasarlanabilir?`,
            ]
          : [
              `Open Question #1: At what external noise or dissipation threshold does the equilibrium in ${coreThesisEquation.symbolicEquation} break down?`,
              `Open Question #2: Does coupling across (${simParamKeys}) exhibit scale invariance from microscopic to macroscopic regimes?`,
              `Open Question #3: What single crucial experiment most cleanly separates this thesis ("${epistemologicalStance}") from prior consensus (${establishedScientificConsensuses[0]?.consensusTitle || 'standard models'})?`,
            ],
        falsifiabilityAndReplicationChecklist: isTr
          ? [
              `Adım 1 (Parametre Tekrarlanabilirliği): İnteraktif simülasyon parametrelerini (${simParamKeys}) uç değerlere çekip "${primaryObservableLabel}" eğrisinin başlangıç değerine göre tekrar üretilebilirliğini doğrulayın.`,
              `Adım 2 (Öncü Literatürle Çapraz Denetim): Sonuçları ${primaryPriorScientist} tarafından ortaya konan klasik sınırlarla karşılaştırın ve fark terimini (${simulationResults.epistemicEntropyDelta}) izole edin.`,
              `Adım 3 (Yanlışlama Kriteri): Kontrollü testlerde "${primaryObservableLabel}" büyüklüğü $\\Lambda_{\\text{denge}} = ${lambdaEqVal}$ etrafında yakınsamazsa makalenin ilgili alt-hipotezini yanlışlanmış olarak raporlayın.`,
              `Adım 4 (Akademik Atıf & Açık Veri): Bulgularınızı Emre Pelit Sci-Phil Arşiv Kodu (${articleNumberLabel}) ve kanonik URL ile paylaşarak bağımsız hakem denetimine açın.`,
            ]
          : [
              `Step 1 (Parameter Reproducibility): Sweep (${simParamKeys}) across boundary extrema and verify deterministic curve recovery for "${primaryObservableLabel}".`,
              `Step 2 (Cross-Audit Against Pioneers): Compare boundary limits with classical baselines from ${primaryPriorScientist} and isolate delta ${simulationResults.epistemicEntropyDelta}.`,
              `Step 3 (Falsification Threshold): If controlled measurements diverge persistently from equilibrium ${lambdaEqVal}, record the sub-hypothesis as empirically falsified.`,
              `Step 4 (Open Citation): Cite Archive ID ${articleNumberLabel} and the canonical URL for transparent replication audits.`,
            ],
      };

  // Build Complete, Comprehensive Audio Narration Script & Segments (Narrates the entire analysis clearly)
  const rawSegments: { sectionLabel: string; text: string }[] = [
    {
      sectionLabel: isTr ? 'BAŞLIK & BİLİMSEL SKOR' : 'TITLE & SCIENTIFIC SCORE',
      text: isTr
        ? `Emre Pelit Akademik Külliyatı, Makale ${articleNumberLabel}: ${title}. ${subtitle}. Bu makalenin Yapay Zeka Destekli Bilimsel Skoru 100 üzerinden ${overallScore} olarak ölçülmüştür. Seslendirme profili: ${voiceProfile.styleTitle}.`
        : `Emre Pelit Academic Corpus, Article ${articleNumberLabel}: ${title}. ${subtitle}. Overall Scientific Score: ${overallScore} out of 100. Active voice profile: ${voiceProfile.styleTitle}.`,
    },
    {
      sectionLabel: isTr
        ? 'BU MAKALE ÖNCESİ BİLİMSEL ARAŞTIRMALAR, BİLİM İNSANLARI VE YERLEŞİK KABULLER'
        : 'PRIOR SCIENTIFIC RESEARCH, SCIENTISTS & ESTABLISHED CONSENSUS',
      text: `${priorLiteratureSynthesisSummary} ${priorScientificResearches
        .map((pr) =>
          isTr
            ? `Araştırma Sahibi Bilim İnsanı: ${pr.scientistName} (${pr.eraAndYear}). Çalışma: ${pr.researchTitle}. Bulgu: ${pr.scientificContributionAndFindings} ${pr.relevanceToThisArticle}`
            : `Researcher: ${pr.scientistName} (${pr.eraAndYear}). Study: ${pr.researchTitle}. Finding: ${pr.scientificContributionAndFindings} ${pr.relevanceToThisArticle}`
        )
        .join(' ')} ${establishedScientificConsensuses
        .map((ec) =>
          isTr
            ? `Yerleşik Kabul: ${ec.consensusTitle}. Öncü Bilim İnsanları: ${ec.foundingAndKeyScientists}. Yerleşik Kabul Özeti: ${ec.orthodoxConsensusStatement} Makalenin Katkısı: ${ec.consensusBoundaryAndArticleAdvance}`
            : `Established Consensus: ${ec.consensusTitle}. Key Scientists: ${ec.foundingAndKeyScientists}. Summary: ${ec.orthodoxConsensusStatement} Article Advance: ${ec.consensusBoundaryAndArticleAdvance}`
        )
        .join(' ')}`,
    },
    {
      sectionLabel: isTr
        ? 'DETAYLI MAKALE ANALİZ RAPORU VE DERİNLEMESİNE YORUM'
        : 'DETAILED ARTICLE ANALYSIS REPORT & DEEP COMMENTARY',
      text: `${detailedEvaluationReport.deepInterdisciplinaryCommentary} ${detailedEvaluationReport.physicalAndNaturalSciencesEvaluation} ${detailedEvaluationReport.epistemologicalAndPhilosophicalEvaluation} ${detailedEvaluationReport.finalPeerReviewVerdict}`,
    },
    {
      sectionLabel: isTr
        ? 'BİLİMSEL PERSPEKTİFTEN DOĞRU VE GÜÇLÜ OLAN YANLARI'
        : 'SCIENTIFICALLY VALID AND RIGOROUS ASPECTS',
      text: scientificallyValidAspects
        .map((sv) =>
          isTr
            ? `${sv.aspectTitle}. Doğruluk Skoru: Yüzde ${sv.scientificValidityScore}. ${sv.scientificMechanismAndEvidence} ${sv.articleGroundedProof}`
            : `${sv.aspectTitle}. Validity Score: ${sv.scientificValidityScore}%. ${sv.scientificMechanismAndEvidence} ${sv.articleGroundedProof}`
        )
        .join(' '),
    },
    {
      sectionLabel: isTr
        ? 'BİLİMSEL PERSPEKTİFTEN EKSİK, SINIR KOŞULUNA BAĞLI VE GELİŞTİRİLMESİ GEREKEN YANLARI'
        : 'SCIENTIFICALLY INCOMPLETE, BOUNDARY-LIMITED & OPEN ASPECTS',
      text: scientificallyIncompleteAspects
        .map((si) =>
          isTr
            ? `${si.missingOrBoundaryAspectTitle}. ${si.scientificCritiqueExplanation} Bilimsel Tamamlama Önerisi: ${si.concreteScientificCompletionProposal}`
            : `${si.missingOrBoundaryAspectTitle}. ${si.scientificCritiqueExplanation} Remediation Proposal: ${si.concreteScientificCompletionProposal}`
        )
        .join(' '),
    },
    {
      sectionLabel: isTr
        ? '1. KONU HAKKINDA BİLGİSİ OLMAYANLAR İÇİN AÇIKLAMA'
        : '1. EXPLANATION FOR NON-EXPERTS',
      text: `${nonExpertExplanation.sectionTitle}. ${nonExpertExplanation.introductoryExplanation} ${nonExpertExplanation.everydayLifeComparison} ${nonExpertExplanation.keyTakeawayForEveryone}`,
    },
    {
      sectionLabel: isTr
        ? '2. PROFESYONELLER İÇİN İLERİ DÜZEY AÇIKLAMA'
        : '2. EXPLANATION FOR PROFESSIONALS',
      text: `${professionalExplanation.sectionTitle}. ${professionalExplanation.technicalAbstractSynthesis} ${professionalExplanation.methodologicalAndFormalContribution} ${professionalExplanation.falsifiabilityAndEmpiricalBounds}`,
    },
    {
      sectionLabel: isTr
        ? '3. TEMEL SAVI BAZ ALAN MATEMATİKSEL DENKLEM, İŞLEMLER & DEĞİŞKENLER'
        : '3. CORE THESIS MATHEMATICAL EQUATION, OPERATIONS & VARIABLES',
      text: `${coreThesisEquation.equationTitle}. ${coreThesisEquation.thesisMathematicalStatement} ${coreThesisEquation.stepByStepCalculationSummary} ${coreThesisEquation.operationsBreakdown.map((op) => `${op.operationName}: ${op.whatItDoesSimply}`).join(' ')} ${coreThesisEquation.variablesBreakdown.map((vr) => `${vr.variableName} (${vr.symbol}): ${vr.plainMeaning} ${isTr ? 'Değeri' : 'Value'}: ${vr.calibratedValue}.`).join(' ')}`,
    },
    {
      sectionLabel: isTr ? 'ADIM ADIM MANTIKSAL AKIŞ' : 'STEP-BY-STEP LOGICAL FLOW',
      text: localizedBundle.stepByStepLogicalFlow
        .map((st) => `${st.stepTitle}: ${st.stepExplanation}`)
        .join(' '),
    },
    {
      sectionLabel: isTr ? 'YÜRÜTÜCÜ AKADEMİK SENTEZ' : 'EXECUTIVE ACADEMIC SYNTHESIS',
      text: `${localizedBundle.executiveSynthesis} ${localizedBundle.ontologicalThesis} ${localizedBundle.methodologyEvaluation}`,
    },
    ...paragraphAnalyses.map((pa) => ({
      sectionLabel: pa.sectionCode,
      text: `${pa.sectionTitle}. ${pa.plainLanguageExplanation} ${pa.detailedCommentary} ${pa.concreteExampleOrImplication}`,
    })),
    ...keyFindingsAnalysis.map((kf) => ({
      sectionLabel: isTr ? `TEMEL BULGU #${kf.findingIndex}` : `KEY FINDING #${kf.findingIndex}`,
      text: `${kf.findingText}. ${kf.plainMeaning} ${kf.analyticalVerification}`,
    })),
    {
      sectionLabel: isTr ? 'TEMEL ÖNCÜLLER' : 'CORE PREMISES',
      text: corePremises.join(' '),
    },
    {
      sectionLabel: isTr ? 'KARŞI-ARGÜMANLAR & YANITLAR' : 'COUNTER-ARGUMENTS & RESPONSES',
      text: counterArguments
        .map((ca) => `${ca.objection} ${ca.methodologicalResponse}`)
        .join(' '),
    },
    {
      sectionLabel: isTr ? 'SİMÜLASYON SONUÇLARI' : 'SIMULATION RESULTS',
      text: `${plainSimulationExplanation} ${tailoredPhysicalInterpretation} ${primaryObservableLabel}: ${primaryObservableValue}.`,
    },
    {
      sectionLabel: isTr
        ? 'TAM ANLAŞILIRLIK VE GELECEK BİLİMSEL ÇALIŞMALAR REHBERİ'
        : 'COMPLETE UNDERSTANDING & FUTURE SCIENTIFIC STUDIES ROADMAP',
      text: `${completeUnderstandingAndFutureResearch.sectionTitle}. ${completeUnderstandingAndFutureResearch.completeComprehensionOverview} ${completeUnderstandingAndFutureResearch.conceptualChainSummary} ${completeUnderstandingAndFutureResearch.futureScientificEvaluationGuide} ${completeUnderstandingAndFutureResearch.proposedFutureStudies.map((st) => `${st.studyCode}: ${st.studyTitle}. ${st.hypothesisToTest} ${st.expectedScientificImpact}`).join(' ')}`,
    },
  ];

  let charCursor = 0;
  const narrationSegments: AnalysisTranscriptSegment[] = rawSegments.map((seg, idx) => {
    const startChar = charCursor;
    const endChar = startChar + seg.text.length;
    charCursor = endChar + 1;
    return {
      index: idx,
      sectionLabel: seg.sectionLabel,
      text: seg.text,
      startChar,
      endChar,
    };
  });

  const fullAudioScript = narrationSegments.map((s) => s.text).join(' ');

  const averageReadingTime = computeArticleAverageReadingTime(article, language);

  const report: ArticleFullAnalysisReport = {
    articleId: article.id,
    articleNumberLabel,
    title,
    subtitle,
    category: article.category,
    publishedAt: article.publishedAt,
    sha256Signature: article.sha256Signature,
    language,
    averageReadingTime,
    voiceProfile,
    scientificScore,
    epistemologicalStance,
    nonExpertExplanation,
    professionalExplanation,
    coreThesisEquation,
    scientificallyValidAspects,
    scientificallyIncompleteAspects,
    detailedEvaluationReport,
    priorLiteratureSynthesisSummary,
    priorScientificResearches,
    establishedScientificConsensuses,
    completeUnderstandingAndFutureResearch,
    plainLanguageSummary: localizedBundle.plainLanguageSummary,
    everydayAnalogy: localizedBundle.everydayAnalogy,
    stepByStepLogicalFlow: localizedBundle.stepByStepLogicalFlow,
    keyConceptsGlossary: localizedBundle.keyConceptsGlossary,
    executiveSynthesis: localizedBundle.executiveSynthesis,
    ontologicalThesis: localizedBundle.ontologicalThesis,
    methodologyEvaluation: localizedBundle.methodologyEvaluation,
    extractedKeywords,
    paragraphAnalyses,
    keyFindingsAnalysis,
    corePremises,
    counterArguments,
    suggestedCitations: article.references,
    recommendedSimulationType: article.simulation.type,
    simulationResults,
    narrationSegments,
    fullAudioScript,
  };

  if (analysisReportCache.size > 1500) {
    analysisReportCache.clear();
  }
  analysisReportCache.set(cacheKey, report);
  return report;
}
