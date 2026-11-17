export type LanguageCode =
  | 'tr'
  | 'en'
  | 'es'
  | 'de'
  | 'fr'
  | 'ru'
  | 'ar'
  | 'zh'
  | 'ja'
  | 'pt'
  | 'it'
  | 'ko';

export type LocalizedText = Record<string, string>;
export type LocalizedStringArray = Record<string, string[]>;

export type SimulationType =
  | 'quantum'
  | 'higgs'
  | 'holographic'
  | 'spacetime'
  | 'consciousness'
  | 'chaos'
  | 'software';

export interface SimulationParameter {
  key: string;
  label: LocalizedText;
  unit: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
}

export interface ArticleSimulationSpec {
  type: SimulationType;
  title: LocalizedText;
  equationLatex: string;
  methodologyNote: LocalizedText;
  parameters: SimulationParameter[];
}

export interface Article {
  id: string;
  slug: string;
  sourceLang?: LanguageCode;
  workClusterId?: string;
  category:
    | 'Kuantum Fiziği'
    | 'Kozmoloji & Holografi'
    | 'Zihin Felsefesi'
    | 'Zaman & Görelilik'
    | 'Epistemoloji & Kaos'
    | 'Parçacık Fiziği'
    | 'Yazılım & Uygulama Projeleri';
  publishedAt: string;
  readTimeMinutes: number;
  author: string;
  affiliation: string;
  sourceOrigin: 'sci-phil-archive' | 'blogger-live' | 'ai-laboratory';
  bloggerUrl?: string;
  canonicalHubUrl: string;
  publishedOnWebsites?: string[];
  figureNumber: string;
  figureCaption: LocalizedText;
  imageUrl: string;
  sha256Signature: string;
  citationsCount: number;
  networkImpressions: number;
  title: LocalizedText;
  subtitle: LocalizedText;
  abstract: LocalizedText;
  keyFindings: LocalizedStringArray;
  contentParagraphs: LocalizedStringArray;
  references: string[];
  simulation: ArticleSimulationSpec;
}

export interface NetworkPublication {
  id: string;
  title: string;
  publishedDate: string;
  sourceUrl: string;
  hubBacklinkUrl: string;
  hubAnchorText: string;
  relatedArticleId: string;
  httpStatus: 301 | 200;
  monthlyReferralsToHub: number;
  citationVelocity: number;
  verifiedBacklink: boolean;
}

export interface Network301Node {
  id: string;
  rank: number;
  domain: string;
  nodeTitle: string;
  launchDate: string;
  articlesCount: number;
  bloggerSyncedCount?: number;
  lastBloggerSyncAt?: string;
  allBloggerArticlesPublished?: boolean;
  sharePercent: number;
  addedTo301Badge?: boolean;
  redirectTargetUrl: string;
  httpCode: 301 | 200;
  status: 'PERMANENT_301_ACTIVE';
  tlsProtocol: 'TLS 1.3 / SHA-256';
  stats: {
    baseReads: number;
    recent48hReads: number;
    netReads: number;
    totalViews?: number;
    readingTimeHours: number;
    readingTimeMinutes: number;
    audioListenHours: number;
    audioListenMinutes: number;
    uniqueReaders: number;
    simulatorRuns: number;
    syncLatencyMs: number;
  };
  publications: NetworkPublication[];
}

export interface DynamicGatewayConfig {
  activeTextModel: 'gemini-4-hydrogen' | 'gemini-3.1-flash-lite';
  activeTtsModel: 'gemini-3.8-flash-lite-tts' | 'gemini-3.8-flash-tts';
  defaultVoicePersona: 'Kore' | 'Charon' | 'Fenrir' | 'Puck' | 'Zephyr';
  temperature: number;
  thinkingMode: 'HIGH' | 'MEDIUM' | 'LOW';
  bloggerBlogUrl: string;
  autoSyncBloggerMinutes: number;
  enforceStrict301Canonical: boolean;
  enableSha256IntegrityVerification: boolean;
  cloudReplicationProvider:
    | 'Google Cloud Archival Bucket'
    | 'IPFS Academic Pinning'
    | 'Multi-Region S3 + Local Vault';
  rateLimitRpm: number;
  customRoutingNamespace: string;
  googleSiteVerificationToken?: string;
  googleFileVerificationId?: string;
  gaMeasurementId?: string;
  cloudflareAnalyticsToken?: string;
}

export interface CloudSnapshot {
  id: string;
  timestamp: string;
  label: string;
  provider: string;
  articlesCount: number;
  nodesCount: number;
  sizeKb: number;
  sha256Root: string;
}

export interface EpistemologicalAnalysisResult {
  epistemologicalStance: string;
  methodologicalRigorScore: number;
  logicalCoherenceSummary: string;
  corePremises: string[];
  counterArguments: string[];
  suggestedCitations: string[];
  recommendedSimulationType: SimulationType;
}

export interface SiteMeasuredAnalytics {
  domain: string;
  measuredReads: number;
  measuredViews?: number;
  measuredReadingMinutes: number;
  measuredAudioMinutes: number;
  measuredUniqueReaders: number;
  measuredSimulatorRuns: number;
  lastMeasuredAt: string;
}

export type AppInteractionCategory =
  | 'PAGE_VIEW'
  | 'ARTICLE_READ'
  | 'ANALYSIS_MODAL'
  | 'SIMULATION_RUN'
  | 'AUDIO_LISTEN'
  | 'QA_OBJECTION'
  | 'LANGUAGE_SEARCH_EXPORT'
  | 'PWA_DOWNLOAD';

export interface AppInteractionTotals {
  totalInteractionsSinceLaunch: number;
  pageViews: number;
  articleReads: number;
  analysisModals: number;
  simulationRuns: number;
  audioListens: number;
  qaObjections: number;
  languageSearchExports: number;
  pwaDownloads: number;
  lastUpdatedAt: string;
}

export interface AnalyticsMeasurementEvent {
  id: string;
  timestamp: string;
  targetDomain: string;
  targetArticleId?: string;
  sourcePanel:
    | 'ANALYTICS_PANEL'
    | 'ARTICLE_READER'
    | 'AUDIO_NARRATOR'
    | 'SIMULATION_LAB'
    | 'AI_ANALYSIS_LAB'
    | 'PWA_DOWNLOAD'
    | 'QA_OBJECTOR'
    | 'SEARCH_FILTER'
    | 'LANGUAGE_SWITCH'
    | 'EXPORT_CITATION'
    | 'NAVIGATION';
  interactionCategory?: AppInteractionCategory;
  isHistoricalBaseline?: boolean;
  metricSummary: string;
  readsDelta: number;
  viewsDelta?: number;
  citationsDelta?: number;
  readingMinutesDelta: number;
  audioMinutesDelta: number;
  uniqueReadersDelta: number;
  simulatorRunsDelta: number;
  cumulativeViewsAfter?: number;
  cumulativeReadsAfter?: number;
  cumulativeAppInteractionsAfter?: number;
  syncSeq?: number;
}

