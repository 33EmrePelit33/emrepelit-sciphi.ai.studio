import React, { useState, useMemo, useEffect } from 'react';
import {
  Activity,
  X,
  Lock,
  Globe,
  BookOpen,
  Eye,
  Award,
  MapPin,
  Search,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  RefreshCw,
  Download,
  MousePointerClick,
  MessageSquare,
  Headphones,
  Cpu,
  Sparkles,
  Languages,
  Clock,
  ArrowDownWideNarrow,
  Film,
  GitBranch,
  Calculator,
  PlusCircle,
  Send,
} from 'lucide-react';
import {
  AnalyticsMeasurementEvent,
  AppInteractionCategory,
  AppInteractionTotals,
  Article,
  ArticleStatsBoost,
  LanguageCode,
  Network301Node,
  SiteMeasuredAnalytics,
} from '../types';
import {
  ACTIVE_LIVE_WEBSITES,
  INITIAL_ARTICLES,
  INITIAL_HISTORICAL_APP_INTERACTION_BASELINE,
  mergeMonotonicAppInteractionTotals,
  mergeMonotonicNetworkNodes,
  computeCumulativeNetworkStats,
  GROK_ME_RECONCILED_3_MONOGRAPHS,
} from '../data/initialData';
import { WorldAnalyticsMap } from './WorldAnalyticsMap';

const LIVE_WEBSITES_SET = new Set<string>(ACTIVE_LIVE_WEBSITES);
import { computeCorpusCountMetrics } from '../utils/articleLocale';
import { AnalyticsBenchmarkReport } from './AnalyticsBenchmarkReport';
import {
  computeCorpusReadAnalytics,
  PRIVACY_K_ANONYMITY_THRESHOLD,
} from '../utils/articleReadAnalyticsEngine';

const TR_MONTH_INDEX: Record<string, number> = {
  ocak: 0,
  subat: 1,
  şubat: 1,
  mart: 2,
  nisan: 3,
  mayis: 4,
  mayıs: 4,
  haziran: 5,
  temmuz: 6,
  agustos: 7,
  ağustos: 7,
  eylul: 8,
  eylül: 8,
  ekim: 9,
  kasim: 10,
  kasım: 10,
  aralik: 11,
  aralık: 11,
};

function parseAllTurkishOrIsoDates(dateStr: string): number[] {
  const results: number[] = [];
  const raw = String(dateStr || '').trim();
  if (!raw) return results;

  const trRegex = /(\d{1,2})\s+([A-Za-zÇĞİÖŞÜçğıöşü]+)\s+(\d{4})/g;
  let m: RegExpExecArray | null;
  while ((m = trRegex.exec(raw)) !== null) {
    const day = Number(m[1]);
    const monthKey = m[2].toLocaleLowerCase('tr-TR');
    const year = Number(m[3]);
    const monthIdx = TR_MONTH_INDEX[monthKey];
    if (Number.isFinite(day) && Number.isFinite(year) && typeof monthIdx === 'number') {
      results.push(Date.UTC(year, monthIdx, day));
    }
  }

  if (results.length === 0) {
    const isoParsed = Date.parse(raw);
    if (Number.isFinite(isoParsed)) results.push(isoParsed);
  }
  return results;
}

const ALLOWED_8_DOMAINS = new Set([
  'science-philosophy.grok.me',
  'emrepelit7337.blogspot.com',
  'sci-phi.ai.studio',
  'sci-phil.ai.studio',
  'science-philosophy.ai.studio',
  'science-philosophy-emre-pelit.ai.studio',
  'emre-pelit-sci-phil.ai.studio',
  'emre-pelit-sci-phi.ai.studio',
  'emrepelit-sciphi.ai.studio',
  'emrepelit.github.io/science-philosophy',
  'emrepelit-sci-phi.ai.studio',
  'github.com/33EmrePelit33',
]);

interface GitHub33NodeMeta {
  login: string;
  profileUrl: string;
  publicRepos: number;
  followers: number;
  createdAt: string;
  updatedAt: string;
  syncedArticlesCount: number;
  liveFetched: boolean;
  fetchedAt: string;
  repos: {
    name: string;
    url: string;
    pushedAt: string;
    stars: number;
    forks: number;
  }[];
}

interface Network301HubProps {
  nodes: Network301Node[];
  articles?: Article[];
  language: LanguageCode;
  onSelectArticleFromBacklink: (articleId: string, sourceDomain?: string) => void;
  onSyncBloggerAcrossSites?: (targetDomain?: string) => Promise<void>;
  analyticsMeasurements?: Record<string, SiteMeasuredAnalytics>;
  analyticsEventLog?: AnalyticsMeasurementEvent[];
  onRecordAnalyticsMeasurement?: (
    targetDomain: string,
    delta: {
      readsDelta?: number;
      viewsDelta?: number;
      citationsDelta?: number;
      targetArticleId?: string;
      readingMinutesDelta?: number;
      audioMinutesDelta?: number;
      videoPlaysDelta?: number;
      videoWatchSecondsDelta?: number;
      videoCompletedDelta?: number;
      maxVideoPositionSec?: number;
      videoDurationSec?: number;
      uniqueReadersDelta?: number;
      simulatorRunsDelta?: number;
    },
    sourcePanel: AnalyticsMeasurementEvent['sourcePanel'],
    metricSummary: string,
    interactionCategoryOverride?: AppInteractionCategory
  ) => void;
  appInteractionTotals?: AppInteractionTotals;
  sessionInteractionTotals?: Omit<AppInteractionTotals, 'lastUpdatedAt'>;
  lastStatsSyncEvent?: {
    timestamp: string;
    targetDomain: string;
    summary: string;
    syncSeq?: number;
    viewsDelta?: number;
    readsDelta?: number;
    cumulativeViewsAfter?: number;
    cumulativeReadsAfter?: number;
  };
  bloggerSyncing?: boolean;
  bloggerSyncedCount?: number;
  lastBloggerSyncAt?: string;
  analyticsPanelOpen?: boolean;
  onToggleAnalyticsPanel?: (open?: boolean) => void;
  articleStatsBoosts?: Record<string, ArticleStatsBoost>;
  onIncrementArticleBoost?: (articleId: string) => void;
  onForceLiveSync?: () => Promise<void>;
  onRecalculateAllNodes?: () => Promise<void>;
  onPublishFromAnyNode?: (article: Article, sourceNodeDomain?: string) => void;
  kvkkAnalyticsGranted?: boolean;
}

export const Network301Hub: React.FC<Network301HubProps> = ({
  nodes,
  articles,
  language,
  onSelectArticleFromBacklink,
  analyticsMeasurements = {},
  analyticsEventLog = [],
  onRecordAnalyticsMeasurement,
  appInteractionTotals,
  sessionInteractionTotals,
  lastStatsSyncEvent,
  bloggerSyncedCount = 318,
  analyticsPanelOpen,
  onToggleAnalyticsPanel,
  articleStatsBoosts: externalArticleBoosts,
  onIncrementArticleBoost,
  onForceLiveSync,
  onRecalculateAllNodes,
  onPublishFromAnyNode,
  kvkkAnalyticsGranted = false,
}) => {
  const [interactionFilter, setInteractionFilter] = useState<
    'ALL' | 'LIVE_ONLY' | 'HISTORICAL_ONLY' | AppInteractionCategory
  >('ALL');
  const [activeHubTab, setActiveHubTab] = useState<
    'overview' | 'articles-geo' | 'interactions' | 'benchmark'
  >('overview');
  const [showDetailedSiteCards, setShowDetailedSiteCards] = useState<boolean>(true);
  const [showReconciliationDetails, setShowReconciliationDetails] = useState<boolean>(true);
  const [expandedNodePubs, setExpandedNodePubs] = useState<Record<string, boolean>>({});
  const [nodeArticleSearch, setNodeArticleSearch] = useState<Record<string, string>>({});
  const [nodeArticleShowAll, setNodeArticleShowAll] = useState<Record<string, boolean>>({});
  const [isManualSyncing, setIsManualSyncing] = useState<boolean>(false);
  const [isRecalculatingAllNodes, setIsRecalculatingAllNodes] = useState<boolean>(false);
  const [githubNodeMeta, setGithubNodeMeta] = useState<GitHub33NodeMeta | null>(null);

  // Live Cross-Node Article Publishing state (publish on ANY of the 11 nodes -> live sync to all 11 nodes)
  const [showCrossNodePublishForm, setShowCrossNodePublishForm] = useState<boolean>(false);
  const [publishOriginNode, setPublishOriginNode] = useState<string>('github.com/33EmrePelit33');
  const [publishTitle, setPublishTitle] = useState<string>('');
  const [publishCategory, setPublishCategory] = useState<Article['category']>('Kuantum Fiziği');
  const [publishAbstract, setPublishAbstract] = useState<string>('');
  const [publishBody, setPublishBody] = useState<string>('');
  const resolvedAppInteractions = useMemo(
    () =>
      mergeMonotonicAppInteractionTotals(
        INITIAL_HISTORICAL_APP_INTERACTION_BASELINE,
        appInteractionTotals
      ),
    [appInteractionTotals]
  );
  const resolvedSessionInteractions = sessionInteractionTotals || {
    totalInteractionsSinceLaunch: 0,
    pageViews: 0,
    articleReads: 0,
    analysisModals: 0,
    simulationRuns: 0,
    audioListens: 0,
    videoWatches: 0,
    videoWatchSeconds: 0,
    qaObjections: 0,
    languageSearchExports: 0,
    pwaDownloads: 0,
  };
  const [localAnalyticsOpen, setLocalAnalyticsOpen] = useState<boolean>(false);
  const isAnalyticsModalOpen =
    typeof analyticsPanelOpen === 'boolean' ? analyticsPanelOpen : localAnalyticsOpen;
  const setAnalyticsModalOpen = (nextOpen: boolean) => {
    if (onToggleAnalyticsPanel) {
      onToggleAnalyticsPanel(nextOpen);
    } else {
      setLocalAnalyticsOpen(nextOpen);
    }
  };

  // Live Sync Event Listener state (responds to 'sciphil:live-analytics-sync' DOM CustomEvent whenever new data arrives)
  const [liveSyncPulse, setLiveSyncPulse] = useState<boolean>(false);
  const [liveSyncCounter, setLiveSyncCounter] = useState<number>(1);
  const [latestLiveEventDetail, setLatestLiveEventDetail] = useState<{
    timestamp: string;
    metricSummary: string;
    viewsDelta: number;
    readsDelta: number;
    cumulativeViewsAfter?: number;
    cumulativeReadsAfter?: number;
    syncSeq?: number;
  } | null>(null);

  useEffect(() => {
    const handleLiveAnalyticsSync = (e: Event) => {
      const customEv = e as CustomEvent;
      const detail = customEv.detail;
      setLiveSyncCounter((c) => Math.max(c + 1, Number(detail?.syncSeq) || c + 1));
      if (detail) {
        setLatestLiveEventDetail({
          timestamp: detail.timestamp || new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
          metricSummary: detail.metricSummary || detail.summary || 'Canlı Veri Senkronizasyonu',
          viewsDelta: Number(detail.viewsDelta) || 0,
          readsDelta: Number(detail.readsDelta) || 0,
          cumulativeViewsAfter: detail.cumulativeViewsAfter,
          cumulativeReadsAfter: detail.cumulativeReadsAfter,
          syncSeq: detail.syncSeq,
        });
      }
      setLiveSyncPulse(true);
      const t = window.setTimeout(() => setLiveSyncPulse(false), 1200);
      return () => window.clearTimeout(t);
    };

    window.addEventListener('sciphil:live-analytics-sync', handleLiveAnalyticsSync);
    return () => window.removeEventListener('sciphil:live-analytics-sync', handleLiveAnalyticsSync);
  }, []);

  const [securitySealState, setSecuritySealState] = useState<{
    batchToken: string;
    merkleRoot: string;
    verifiedAt: string;
  }>({
    batchToken: 'SEC10-ZERO-TRUST-LOCKED',
    merkleRoot: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    verifiedAt: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
  });

  // Lightweight on-open sync: ONLY fetch live GitHub metadata & trigger clean live recalculation when Analytics Panel is opened (zero mount-time POST storms!)
  const hasAutoRecalculatedOnOpenRef = React.useRef<boolean>(false);
  useEffect(() => {
    if (isAnalyticsModalOpen) {
      if (!githubNodeMeta) {
        void fetch('/api/network/github-33emrepelit33')
          .then((r) => (r.ok ? r.json() : null))
          .then((data) => {
            if (data?.login && Array.isArray(data?.repos)) {
              setGithubNodeMeta(data as GitHub33NodeMeta);
            }
          })
          .catch(() => {});
      }
      if (onRecalculateAllNodes && !hasAutoRecalculatedOnOpenRef.current) {
        hasAutoRecalculatedOnOpenRef.current = true;
        void onRecalculateAllNodes();
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAnalyticsModalOpen) {
        setAnalyticsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnalyticsModalOpen, githubNodeMeta, onRecalculateAllNodes]);

  // Analytics Panel Measurement Controls State
  const [analyticsTargetDomain, setAnalyticsTargetDomain] = useState<string>(
    'emrepelit-sciphi.ai.studio'
  );
  const [measureViewsInput, setMeasureViewsInput] = useState<number>(1);
  const [measureReadsInput, setMeasureReadsInput] = useState<number>(1);
  const [measureReadMinsInput, setMeasureReadMinsInput] = useState<number>(1);
  const [measureAudioMinsInput, setMeasureAudioMinsInput] = useState<number>(0);
  const [measureUniqueInput, setMeasureUniqueInput] = useState<number>(1);
  const [measureSimInput, setMeasureSimInput] = useState<number>(0);
  const [analyticsNotice, setAnalyticsNotice] = useState<string | null>(null);

  // Per-Article Cumulative Statistics Table State & Avg Reading Time Leaderboard
  const [articleSearchQuery, setArticleSearchQuery] = useState<string>('');
  const [articleCategoryFilter, setArticleCategoryFilter] = useState<string>('ALL');
  const [articleSortBy, setArticleSortBy] = useState<
    | 'avg_read_time_desc'
    | 'avg_read_time_asc'
    | 'total_read_time_desc'
    | 'reads_desc'
    | 'academic_desc'
    | 'industrial_desc'
    | 'silicon_valley_desc'
    | 'views_desc'
    | 'video_watch_desc'
    | 'video_plays_desc'
    | 'video_completion_desc'
    | 'citations_desc'
    | 'rank_asc'
    | 'tr_desc'
    | 'eu_desc'
    | 'amer_desc'
  >('reads_desc');
  const [avgReadLeaderboardLimit, setAvgReadLeaderboardLimit] = useState<number>(15);
  const [articlePageSize, setArticlePageSize] = useState<number>(25);
  const [articleCurrentPage, setArticleCurrentPage] = useState<number>(1);
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(null);
  const [localArticleBoosts, setLocalArticleBoosts] = useState<
    Record<string, ArticleStatsBoost>
  >(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = window.localStorage.getItem('sciphil_article_boosts_v2');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
            return parsed;
          }
        }
      } catch {
        // Ignore storage errors
      }
    }
    return {};
  });

  const effectiveArticleBoosts = useMemo(() => {
    const merged: Record<string, ArticleStatsBoost> = {
      ...localArticleBoosts,
    };
    if (externalArticleBoosts) {
      for (const [artId, extVal] of Object.entries(externalArticleBoosts)) {
        const cur = merged[artId] || {
          reads: 0,
          views: 0,
          citations: 0,
          videoPlays: 0,
          videoWatchSeconds: 0,
          videoCompletions: 0,
          maxVideoPositionSec: 0,
          videoDurationSec: 0,
        };
        merged[artId] = {
          reads: Math.max(cur.reads || 0, extVal.reads || 0),
          views: Math.max(cur.views || 0, extVal.views || 0),
          citations: Math.max(cur.citations || 0, extVal.citations || 0),
          videoPlays: Math.max(cur.videoPlays || 0, extVal.videoPlays || 0),
          videoWatchSeconds: Math.max(cur.videoWatchSeconds || 0, extVal.videoWatchSeconds || 0),
          videoCompletions: Math.max(cur.videoCompletions || 0, extVal.videoCompletions || 0),
          maxVideoPositionSec: Math.max(cur.maxVideoPositionSec || 0, extVal.maxVideoPositionSec || 0),
          videoDurationSec: Math.max(cur.videoDurationSec || 0, extVal.videoDurationSec || 0),
        };
      }
    }
    return merged;
  }, [localArticleBoosts, externalArticleBoosts]);

  const handleApplyAnalyticsPanelMeasurement = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const vDelta = Math.max(0, Math.floor(Number(measureViewsInput) || 0));
    const rDelta = Math.max(0, Math.floor(Number(measureReadsInput) || 0));
    const rmDelta = Math.max(0, Math.floor(Number(measureReadMinsInput) || 0));
    const amDelta = Math.max(0, Math.floor(Number(measureAudioMinsInput) || 0));
    const uDelta = Math.max(0, Math.floor(Number(measureUniqueInput) || 0));
    const sDelta = Math.max(0, Math.floor(Number(measureSimInput) || 0));

    if (
      vDelta === 0 &&
      rDelta === 0 &&
      rmDelta === 0 &&
      amDelta === 0 &&
      uDelta === 0 &&
      sDelta === 0
    ) {
      setAnalyticsNotice(
        'Analitik panelinde ölçülen değerlerde herhangi bir değişiklik olmadı (Δ = 0). İstatistikler yalnızca ölçülen değerler değiştiğinde güncellenir.'
      );
      return;
    }

    const effectiveViewsDelta = Math.max(vDelta, rDelta);
    const parts: string[] = [];
    if (effectiveViewsDelta > 0) parts.push(`+${effectiveViewsDelta} Görüntülenme`);
    if (rDelta > 0) parts.push(`+${rDelta} Okunma`);
    if (rmDelta > 0) parts.push(`+${rmDelta} dk Okuma`);
    if (amDelta > 0) parts.push(`+${amDelta} dk Sesli Dinleme`);
    if (uDelta > 0) parts.push(`+${uDelta} Tekil Okur`);
    if (sDelta > 0) parts.push(`+${sDelta} Simülatör`);

    const summary = `Canlı Senkron Ölçüm Değişikliği (${
      analyticsTargetDomain === 'ALL_11_SITES' ||
      analyticsTargetDomain === 'ALL_10_SITES' ||
      analyticsTargetDomain === 'ALL_8_SITES'
        ? '11 Düğümün Tamamı (3 Canlı + 8 Senkron 301)'
        : analyticsTargetDomain
    }): ${parts.join(', ')}`;

    onRecordAnalyticsMeasurement?.(
      analyticsTargetDomain,
      {
        viewsDelta: effectiveViewsDelta,
        readsDelta: rDelta,
        readingMinutesDelta: rmDelta,
        audioMinutesDelta: amDelta,
        uniqueReadersDelta: uDelta,
        simulatorRunsDelta: sDelta,
      },
      'ANALYTICS_PANEL',
      summary
    );

    setAnalyticsNotice(
      `✓ Canlı Senkron Olayı Çalıştı (${parts.join(', ')}) → 11 Düğüm Kümülatif Toplamı ve İlgili Düğüm İstatistikleri Anında Güncellendi.`
    );
  };

  const handleQuickCrossNodePublish = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = publishTitle.trim();
    if (!cleanTitle || cleanTitle.length < 3) {
      setAnalyticsNotice('Lütfen tüm 11 düğümde canlı yayınlanacak yazı için en az 3 karakterlik bir başlık girin.');
      return;
    }
    const cleanAbstract =
      publishAbstract.trim() ||
      `${cleanTitle} — ${publishOriginNode} düğümü üzerinden yayınlanan ve tüm 11 düğümde (Ana Hub + Blogger + GitHub 33EmrePelit33 + 8 HTTP 301) eşzamanlı senkronize edilen araştırma metni.`;
    const cleanBody =
      publishBody.trim() ||
      `${cleanAbstract}\n\nBu makale ${publishOriginNode} düğümüne eklendiği anda merkezi 301 ağı ve SSE yayın katmanı aracılığıyla tüm 11 düğüme otomatik olarak dağıtılmış, analitik sayaçları 1:1 eşitlenmiştir.`;

    const nowDateTr = new Date().toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const nextNumber = Math.max(318, activeArticles.length) + 1;
    const slugVal =
      cleanTitle
        .toLowerCase()
        .replace(/[^a-z0-9çğıöşü\s-]/gi, '')
        .replace(/\s+/g, '-')
        .slice(0, 64) || `article-${nextNumber}`;
    const makeLocalized = (text: string): Record<string, string> => ({
      tr: text,
      en: text,
      de: text,
      fr: text,
      es: text,
      it: text,
      ru: text,
      ar: text,
      zh: text,
      ja: text,
      pt: text,
      ko: text,
    });
    const bodyParagraphs = cleanBody
      .split(/\n+/)
      .map((p) => p.trim())
      .filter(Boolean);
    const fallbackParagraphs =
      bodyParagraphs.length > 0 ? bodyParagraphs : [cleanAbstract];
    const templateSim = activeArticles[0]?.simulation || {
      type: 'quantum' as const,
      title: makeLocalized('Canlı Kuantum & Bilgi Simülasyonu'),
      equationLatex: 'i\\hbar \\frac{\\partial}{\\partial t} |\\Psi(t)\\rangle = \\hat{H} |\\Psi(t)\\rangle',
      methodologyNote: makeLocalized('11-Düğüm canlı senkronizasyon laboratuvar simülasyonu.'),
      parameters: [
        {
          key: 'coherence',
          label: makeLocalized('Kuantum Tutarlılık'),
          unit: 'φ',
          min: 0.1,
          max: 1.0,
          step: 0.05,
          defaultValue: 0.85,
        },
      ],
    };

    const newArticle: Article = {
      id: `art-node-live-${Date.now()}`,
      slug: slugVal,
      sourceLang: language,
      category: publishCategory || 'Kuantum Fiziği',
      publishedAt: nowDateTr,
      readTimeMinutes: Math.max(3, Math.ceil(cleanBody.split(/\s+/).length / 180)),
      author: 'Emre Pelit',
      affiliation: 'Sci-Phil | Bilim & Felsefe Ana Merkezi (11-Düğüm Canlı Senkron)',
      sourceOrigin: publishOriginNode === 'emrepelit7337.blogspot.com' ? 'blogger-live' : 'sci-phil-archive',
      canonicalHubUrl: `https://emrepelit-sciphi.ai.studio/tr/article/${slugVal}`,
      publishedOnWebsites: strictNodes.map((n) => n.domain),
      figureNumber: `FIG-${nextNumber}`,
      figureCaption: makeLocalized(`${cleanTitle} — ${publishOriginNode} 11-Düğüm Canlı Senkron Şeması`),
      imageUrl: activeArticles[0]?.imageUrl || '/og-image.svg',
      sha256Signature: `sha256-live-11node-${Date.now().toString(16)}`,
      citationsCount: 0,
      networkImpressions: 1,
      originNodeDomain: publishOriginNode,
      title: makeLocalized(cleanTitle),
      subtitle: makeLocalized(`Kaynak Düğüm: ${publishOriginNode} · Tüm ${strictNodes.length} Düğümde Canlı Senkron`),
      abstract: makeLocalized(cleanAbstract),
      keyFindings: {
        tr: [`Kaynak düğüm: ${publishOriginNode}`, `Tüm ${strictNodes.length} düğümde anında canlı senkronize edildi.`],
        en: [`Source node: ${publishOriginNode}`, `Synchronized live across all ${strictNodes.length} network nodes.`],
      },
      contentParagraphs: {
        tr: fallbackParagraphs,
        en: fallbackParagraphs,
        de: fallbackParagraphs,
        fr: fallbackParagraphs,
        es: fallbackParagraphs,
        it: fallbackParagraphs,
        ru: fallbackParagraphs,
        ar: fallbackParagraphs,
        zh: fallbackParagraphs,
        ja: fallbackParagraphs,
        pt: fallbackParagraphs,
        ko: fallbackParagraphs,
      },
      references: [`Kaynak Düğüm: https://${publishOriginNode} (11-Düğüm Canlı Senkron)`],
      simulation: templateSim,
    };

    onPublishFromAnyNode?.(newArticle, publishOriginNode);
    setPublishTitle('');
    setPublishAbstract('');
    setPublishBody('');
    setShowCrossNodePublishForm(false);
    setAnalyticsNotice(
      `✓ "#${nextNumber} ${cleanTitle}" yazısı ${publishOriginNode} düğümünden eklendi → Tüm ${strictNodes.length} düğümde canlı olarak yayınlandı ve analitik toplamları yeniden hesaplandı!`
    );
  };

  // Ensure all 10 official websites are preserved with strict monotonic non-decreasing statistics
  // and reconciled 1:1 with analyticsMeasurements so cards, table, equations, and cumulative totals always agree.
  const strictNodes = useMemo(() => {
    const valid = nodes.filter(
      (n) => ALLOWED_8_DOMAINS.has(n.domain) && n.stats && typeof n.stats.netReads === 'number'
    );
    const baseMerged = mergeMonotonicNetworkNodes(valid);
    if (!analyticsMeasurements || Object.keys(analyticsMeasurements).length === 0) {
      return baseMerged;
    }
    const measuredOverlay = baseMerged.map((node) => {
      const m = analyticsMeasurements[node.domain];
      if (!m) return node;
      const baseReadMins = node.stats.readingTimeHours * 60 + node.stats.readingTimeMinutes;
      const baseAudioMins = node.stats.audioListenHours * 60 + node.stats.audioListenMinutes;
      const nextReadMins = Math.max(baseReadMins, m.measuredReadingMinutes ?? baseReadMins);
      const nextAudioMins = Math.max(baseAudioMins, m.measuredAudioMinutes ?? baseAudioMins);
      const nextReads = Math.max(node.stats.netReads, m.measuredReads ?? node.stats.netReads);
      const nodeBaseViews = node.stats.totalViews ?? node.stats.netReads;
      const nextViews = Math.max(nodeBaseViews, nextReads, m.measuredViews ?? nodeBaseViews);
      return {
        ...node,
        stats: {
          ...node.stats,
          baseReads: nextReads,
          netReads: nextReads,
          totalViews: nextViews,
          readingTimeHours: Math.floor(nextReadMins / 60),
          readingTimeMinutes: nextReadMins % 60,
          audioListenHours: Math.floor(nextAudioMins / 60),
          audioListenMinutes: nextAudioMins % 60,
          uniqueReaders: Math.max(node.stats.uniqueReaders, m.measuredUniqueReaders ?? node.stats.uniqueReaders),
          simulatorRuns: Math.max(node.stats.simulatorRuns, m.measuredSimulatorRuns ?? node.stats.simulatorRuns),
        },
      };
    });
    return mergeMonotonicNetworkNodes(baseMerged, measuredOverlay);
  }, [nodes, analyticsMeasurements]);

  // Calculate live cumulative totals across all 10 websites since their launch
  const cumulative = useMemo(() => {
    return computeCumulativeNetworkStats(strictNodes);
  }, [strictNodes]);

  // Keep interaction totals strictly synced 1:1 with cumulative views, reads & simulator runs
  const syncedAppInteractions = useMemo(
    () =>
      mergeMonotonicAppInteractionTotals(resolvedAppInteractions, {
        pageViews: cumulative.totalViews,
        articleReads: cumulative.netReads,
        simulationRuns: cumulative.simulatorRuns,
      }),
    [resolvedAppInteractions, cumulative.totalViews, cumulative.netReads, cumulative.simulatorRuns]
  );

  // Metric-by-metric cumulative breakdown splitting Live (2) vs Retired HTTP 301 (8) vs Total (10)
  const cumulativeBreakdown = useMemo(() => {
    const sumGroup = (group: Network301Node[]) => {
      let totalViews = 0;
      let netReads = 0;
      let baseReads = 0;
      let recent48hReads = 0;
      let readingMinutesTotal = 0;
      let audioMinutesTotal = 0;
      let uniqueReaders = 0;
      let simulatorRuns = 0;
      let videoPlays = 0;
      let videoWatchSeconds = 0;
      let latencySum = 0;
      let publicationsCount = 0;
      let articlesSum = 0;
      group.forEach((n) => {
        totalViews += n.stats.totalViews ?? n.stats.netReads;
        netReads += n.stats.netReads;
        baseReads += n.stats.baseReads;
        recent48hReads += n.stats.recent48hReads;
        readingMinutesTotal += n.stats.readingTimeHours * 60 + n.stats.readingTimeMinutes;
        audioMinutesTotal += n.stats.audioListenHours * 60 + n.stats.audioListenMinutes;
        uniqueReaders += n.stats.uniqueReaders;
        simulatorRuns += n.stats.simulatorRuns;
        videoPlays += n.stats.videoPlays || 0;
        videoWatchSeconds += n.stats.videoWatchSeconds || 0;
        latencySum += n.stats.syncLatencyMs || 0;
        publicationsCount += n.publications?.length || 0;
        articlesSum += n.articlesCount || 0;
      });
      const totalVideoMins = Math.floor(videoWatchSeconds / 60);
      return {
        count: group.length,
        totalViews,
        netReads,
        baseReads,
        recent48hReads,
        readingMinutesTotal,
        readingHours: Math.floor(readingMinutesTotal / 60),
        readingMins: readingMinutesTotal % 60,
        audioMinutesTotal,
        audioHours: Math.floor(audioMinutesTotal / 60),
        audioMins: audioMinutesTotal % 60,
        uniqueReaders,
        simulatorRuns,
        videoPlays,
        videoWatchSeconds,
        videoWatchHours: Math.floor(totalVideoMins / 60),
        videoWatchMins: totalVideoMins % 60,
        avgLatencyMs: group.length > 0 ? Math.round(latencySum / group.length) : 0,
        publicationsCount,
        articlesSum,
      };
    };

    const liveNodes = strictNodes.filter(
      (n) => LIVE_WEBSITES_SET.has(n.domain) || Boolean(n.isLiveWebsite)
    );
    const retiredNodes = strictNodes.filter(
      (n) => !(LIVE_WEBSITES_SET.has(n.domain) || Boolean(n.isLiveWebsite))
    );

    const live2 = sumGroup(liveNodes);
    const retired8 = sumGroup(retiredNodes);
    const total10 = sumGroup(strictNodes);

    const refNowMs = Date.now();
    const earliestLaunchMs = strictNodes.reduce((minMs, n) => {
      const timestamps = parseAllTurkishOrIsoDates(n.launchDate);
      const nodeEarliest = timestamps.length > 0 ? Math.min(...timestamps) : NaN;
      return Number.isFinite(nodeEarliest) && nodeEarliest < minMs ? nodeEarliest : minMs;
    }, refNowMs);
    const networkAgeDays = Math.max(1, Math.floor((refNowMs - earliestLaunchMs) / 86400000) + 1);

    return {
      live2,
      retired8,
      total10,
      networkAgeDays,
    };
  }, [strictNodes]);

  const computeElapsedDaysSinceLaunch = (launchDate: string): number => {
    const timestamps = parseAllTurkishOrIsoDates(launchDate);
    if (timestamps.length === 0) return 1;
    const primaryLaunch = timestamps[0];
    return Math.max(1, Math.floor((Date.now() - primaryLaunch) / 86400000) + 1);
  };

  const liveArithmeticEquation = useMemo(() => {
    const parts = strictNodes.map(
      (n) => `${n.stats.netReads.toLocaleString('tr-TR')} (${n.domain.replace('.ai.studio', '')})`
    );
    return `${parts.join(' + ')} = ${cumulative.netReads.toLocaleString('tr-TR')} BİRLEŞİK NET OKUNMA`;
  }, [strictNodes, cumulative.netReads]);

  const liveViewsArithmeticEquation = useMemo(() => {
    const parts = strictNodes.map((n) => {
      const nodeViews = n.stats.totalViews ?? n.stats.netReads;
      return `${nodeViews.toLocaleString('tr-TR')} (${n.domain.replace('.ai.studio', '')})`;
    });
    return `${parts.join(' + ')} = ${cumulative.totalViews.toLocaleString('tr-TR')} KÜMÜLATİF TOPLAM GÖRÜNTÜLENME`;
  }, [strictNodes, cumulative.totalViews]);

  // Active corpus
  const activeArticles = useMemo(() => {
    if (articles && articles.length > 0) return articles;
    return INITIAL_ARTICLES;
  }, [articles]);
  const corpusMetrics = useMemo(() => computeCorpusCountMetrics(activeArticles), [activeArticles]);

  // Compute deterministic, arithmetically reconciled per-article reads across ALL 11 301 nodes,
  // 12 countries / 58 academic centers, and 6 global industrial ecosystems (led by Silicon Valley) / 31 industrial organizations.
  const articleCumulativeData = useMemo(
    () =>
      computeCorpusReadAnalytics({
        articles: activeArticles,
        nodes: strictNodes,
        analyticsMeasurements,
        articleStatsBoosts: effectiveArticleBoosts,
        language,
      }),
    [activeArticles, strictNodes, analyticsMeasurements, effectiveArticleBoosts, language]
  );

  const categoriesList = useMemo(() => {
    const set = new Set<string>();
    activeArticles.forEach((a) => set.add(a.category));
    return Array.from(set);
  }, [activeArticles]);

  const filteredAndSortedArticleRows = useMemo(() => {
    const q = articleSearchQuery.trim().toLowerCase();
    const filtered = articleCumulativeData.rows.filter((row) => {
      if (articleCategoryFilter !== 'ALL' && row.category !== articleCategoryFilter) {
        return false;
      }
      if (!q) return true;
      return (
        row.title.toLowerCase().includes(q) ||
        row.archiveCode.toLowerCase().includes(q) ||
        row.category.toLowerCase().includes(q) ||
        row.articleId.toLowerCase().includes(q) ||
        `#${row.rank}` === q ||
        String(row.rank) === q
      );
    });

    return [...filtered].sort((a, b) => {
      switch (articleSortBy) {
        case 'avg_read_time_desc':
          return b.averageReadingSeconds - a.averageReadingSeconds || b.wordCount - a.wordCount;
        case 'avg_read_time_asc':
          return a.averageReadingSeconds - b.averageReadingSeconds || a.wordCount - b.wordCount;
        case 'total_read_time_desc':
          return b.totalReadingMinutes - a.totalReadingMinutes;
        case 'video_watch_desc':
          return b.videoWatchSeconds - a.videoWatchSeconds || b.videoPlays - a.videoPlays || b.reads - a.reads;
        case 'video_plays_desc':
          return b.videoPlays - a.videoPlays || b.videoWatchSeconds - a.videoWatchSeconds || b.reads - a.reads;
        case 'video_completion_desc':
          return b.videoWatchPercent - a.videoWatchPercent || b.videoWatchSeconds - a.videoWatchSeconds;
        case 'reads_desc':
          return b.reads - a.reads;
        case 'academic_desc':
          return b.academicTotalReads - a.academicTotalReads || b.reads - a.reads;
        case 'industrial_desc':
          return b.industrialTotalReads - a.industrialTotalReads || b.reads - a.reads;
        case 'silicon_valley_desc':
          return b.siliconValleyReads - a.siliconValleyReads || b.industrialTotalReads - a.industrialTotalReads;
        case 'views_desc':
          return b.views - a.views;
        case 'citations_desc':
          return b.citations - a.citations;
        case 'tr_desc':
          return b.regions.tr.reads - a.regions.tr.reads;
        case 'eu_desc':
          return b.regions.eu.reads - a.regions.eu.reads;
        case 'amer_desc':
          return b.regions.amer.reads - a.regions.amer.reads;
        case 'rank_asc':
        default:
          return a.rank - b.rank;
      }
    });
  }, [articleCumulativeData.rows, articleSearchQuery, articleCategoryFilter, articleSortBy]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAndSortedArticleRows.length / Math.max(1, articlePageSize))
  );
  const safePage = Math.min(articleCurrentPage, totalPages);
  const paginatedArticleRows = useMemo(() => {
    const start = (safePage - 1) * articlePageSize;
    return filteredAndSortedArticleRows.slice(start, start + articlePageSize);
  }, [filteredAndSortedArticleRows, safePage, articlePageSize]);

  if (!isAnalyticsModalOpen) {
    return null;
  }

  const totalReadMinsAll = cumulative.readingHours * 60 + cumulative.readingMins;
  const totalAudioMinsAll = cumulative.audioHours * 60 + cumulative.audioMins;

  return (
    <div
      id="analytics"
      role="dialog"
      aria-modal="true"
      aria-label="Canlı Analitik Paneli ve Küresel İlk 100 Sıralama Raporu"
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs overflow-y-auto p-3 sm:p-5"
      onClick={() => setAnalyticsModalOpen(false)}
    >
      <div
        id="analytics-panel"
        className="max-w-[1440px] mx-auto bg-[#0B1120] border-2 border-emerald-400/90 rounded-sm p-4 sm:p-6 text-slate-100 shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Sticky Top Modal Header */}
        <div className="sticky top-0 z-20 bg-[#0B1120]/95 backdrop-blur-xs pb-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <span className="px-2.5 py-1 bg-emerald-400 text-slate-950 font-extrabold rounded-xs">
              emrepelit-sciphi.ai.studio/#analytics
            </span>
            <span className="text-amber-300 font-bold">
              {cumulativeBreakdown.live2.count} Canlı Düğüm (Ana Hub + Blogger + GitHub 33EmrePelit33) &amp; {cumulativeBreakdown.retired8.count} Senkronize 301 Düğümü (Toplam {strictNodes.length} Düğüm · {activeArticles.length} Makale)
            </span>
            <span
              className={`px-2 py-0.5 font-extrabold text-[10px] rounded-xs inline-flex items-center gap-1 transition-all ${
                liveSyncPulse
                  ? 'bg-cyan-400 text-slate-950 scale-105'
                  : 'bg-cyan-950 border border-cyan-400/60 text-cyan-300'
              }`}
            >
              <RefreshCw className={`w-3 h-3 ${liveSyncPulse ? 'animate-spin' : ''}`} />
              <span>%100 1:1 SENKRON (#{lastStatsSyncEvent?.syncSeq || liveSyncCounter})</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onRecalculateAllNodes && (
              <button
                type="button"
                disabled={isRecalculatingAllNodes}
                onClick={async () => {
                  setIsRecalculatingAllNodes(true);
                  try {
                    await onRecalculateAllNodes();
                    setAnalyticsNotice(
                      `✓ Tüm ${strictNodes.length} Düğüm (Ana Hub + Blogger + GitHub 33EmrePelit33 + 8 HTTP 301) Analitik Hesabı ve Kümülatif Toplamları Sunucuda Yeniden Hesaplandı & %100 Eşitlendi.`
                    );
                  } finally {
                    setIsRecalculatingAllNodes(false);
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono text-xs font-extrabold rounded-xs cursor-pointer transition-colors disabled:opacity-60"
              >
                <Calculator className={`w-3.5 h-3.5 ${isRecalculatingAllNodes ? 'animate-spin' : ''}`} />
                <span>
                  {isRecalculatingAllNodes
                    ? 'Yeniden Hesaplanıyor...'
                    : `Tüm ${strictNodes.length} Düğüm & Kümülatif Toplamları Yeniden Hesapla`}
                </span>
              </button>
            )}
            {onForceLiveSync && (
              <button
                type="button"
                disabled={isManualSyncing}
                onClick={async () => {
                  setIsManualSyncing(true);
                  try {
                    await onForceLiveSync();
                    setAnalyticsNotice(
                      `✓ Sunucu ile Canlı Monotonik Senkronizasyon Tamamlandı (Hiçbir veri azaltılmadan tüm ${strictNodes.length} düğüm ve ${activeArticles.length} makale eşitlendi).`
                    );
                  } finally {
                    setIsManualSyncing(false);
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950 hover:bg-emerald-900 border border-emerald-400/70 text-emerald-200 font-mono text-xs font-bold rounded-xs cursor-pointer transition-colors disabled:opacity-60"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isManualSyncing ? 'animate-spin' : ''}`} />
                <span>{isManualSyncing ? 'Eşitleniyor...' : 'Canlı Sunucu Eşitle'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                if (!kvkkAnalyticsGranted) {
                  setAnalyticsNotice(
                    'KVKK (6698) & AB GDPR m.6(1)(a): Analitik açık rızası verilmeden yeni tarayıcı görüntülenme ölçümü kaydedilmez. Rıza tercihlerinden analitiği etkinleştirebilirsiniz.'
                  );
                  return;
                }
                onRecordAnalyticsMeasurement?.(
                  'emrepelit-sciphi.ai.studio',
                  {
                    viewsDelta: 1,
                    readsDelta: 0,
                  },
                  'ANALYTICS_PANEL',
                  'Canlı Senkron: Yeni Görüntülenme Kaydı (+1 Görüntülenme)'
                );
                setAnalyticsNotice(
                  '✓ +1 Yeni Görüntülenme Eklendi & Canlı Senkron Olayı Çalıştı → Tüm 11 Düğüm KPI, Site ve Makale Sayaçları Eşzamanlı Güncellendi.'
                );
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-mono text-xs font-extrabold rounded-xs cursor-pointer transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>+1 Yeni Görüntülenme</span>
            </button>
            <button
              type="button"
              onClick={() => setAnalyticsModalOpen(false)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold rounded-xs cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Kapat (ESC)</span>
            </button>
          </div>
        </div>

        {/* 2. Single Crisp Synchronized 9-KPI Executive Bar */}
        <div className="space-y-2.5">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2.5 font-mono tabular-nums">
            <div
              className={`bg-slate-900 border px-3 py-2.5 rounded-xs ${
                liveSyncPulse ? 'border-cyan-300 ring-1 ring-cyan-400' : 'border-cyan-500/60'
              }`}
            >
              <div className="text-[10px] text-cyan-300 font-bold uppercase flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>Görüntülenme</span>
              </div>
              <div className="text-base sm:text-lg font-extrabold text-cyan-200 mt-0.5">
                {articleCumulativeData.totalViews.toLocaleString('tr-TR')}
              </div>
              <div className="text-[9px] text-slate-400">
                {cumulativeBreakdown.live2.count} Canlı + {cumulativeBreakdown.retired8.count} Senkron 301 = {activeArticles.length} Makale
              </div>
            </div>

            <div className="bg-slate-900 border border-amber-400/60 px-3 py-2.5 rounded-xs">
              <div className="text-[10px] text-amber-300 font-bold uppercase flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                <span>Net Okunma</span>
              </div>
              <div className="text-base sm:text-lg font-extrabold text-amber-300 mt-0.5">
                {articleCumulativeData.totalReads.toLocaleString('tr-TR')}
              </div>
              <div className="text-[9px] text-slate-400">Monotonik 1:1 Senkron</div>
            </div>

            <div className="bg-slate-900 border border-amber-300/50 px-3 py-2.5 rounded-xs">
              <div className="text-[10px] text-amber-200 font-bold uppercase flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Okuma Süresi</span>
              </div>
              <div className="text-sm sm:text-base font-extrabold text-amber-200 mt-0.5">
                {cumulative.readingHours.toLocaleString('tr-TR')}s {cumulative.readingMins}d
              </div>
              <div className="text-[9px] text-slate-400">{totalReadMinsAll.toLocaleString('tr-TR')} toplam dk</div>
            </div>

            <div className="bg-slate-900 border border-emerald-400/60 px-3 py-2.5 rounded-xs">
              <div className="text-[10px] text-emerald-300 font-bold uppercase flex items-center gap-1">
                <Headphones className="w-3 h-3" />
                <span>Sesli Dinleme</span>
              </div>
              <div className="text-sm sm:text-base font-extrabold text-emerald-300 mt-0.5">
                {cumulative.audioHours.toLocaleString('tr-TR')}s {cumulative.audioMins}d
              </div>
              <div className="text-[9px] text-slate-400">{totalAudioMinsAll.toLocaleString('tr-TR')} toplam dk</div>
            </div>

            <div className="bg-slate-900 border border-teal-400/70 px-3 py-2.5 rounded-xs">
              <div className="text-[10px] text-teal-300 font-bold uppercase flex items-center gap-1">
                <Film className="w-3 h-3" />
                <span>Geniş Özet Video</span>
              </div>
              <div className="text-sm sm:text-base font-extrabold text-teal-200 mt-0.5">
                {articleCumulativeData.totalVideoPlaysAllArticles.toLocaleString('tr-TR')} izlenme
              </div>
              <div className="text-[9px] text-slate-400">
                {Math.floor(articleCumulativeData.totalVideoWatchSecondsAllArticles / 60).toLocaleString('tr-TR')} dk{' '}
                {String(articleCumulativeData.totalVideoWatchSecondsAllArticles % 60).padStart(2, '0')} sn
              </div>
            </div>

            <div className="bg-slate-900 border border-purple-400/60 px-3 py-2.5 rounded-xs">
              <div className="text-[10px] text-purple-300 font-bold uppercase">Tekil Okur</div>
              <div className="text-base sm:text-lg font-extrabold text-purple-200 mt-0.5">
                {cumulative.uniqueReaders.toLocaleString('tr-TR')}
              </div>
              <div className="text-[9px] text-slate-400">5 Coğrafya · 12 Ülke</div>
            </div>

            <div className="bg-slate-900 border border-sky-400/60 px-3 py-2.5 rounded-xs">
              <div className="text-[10px] text-sky-300 font-bold uppercase flex items-center gap-1">
                <Cpu className="w-3 h-3" />
                <span>Simülatör</span>
              </div>
              <div className="text-base sm:text-lg font-extrabold text-sky-200 mt-0.5">
                {cumulative.simulatorRuns.toLocaleString('tr-TR')}
              </div>
              <div className="text-[9px] text-slate-400">İnteraktif Deney</div>
            </div>

            <div className="bg-slate-900 border border-emerald-500/60 px-3 py-2.5 rounded-xs">
              <div className="text-[10px] text-emerald-300 font-bold uppercase flex items-center gap-1">
                <Award className="w-3 h-3" />
                <span>Akademik Atıf</span>
              </div>
              <div className="text-base sm:text-lg font-extrabold text-emerald-300 mt-0.5">
                {articleCumulativeData.totalCitations.toLocaleString('tr-TR')}
              </div>
              <div className="text-[9px] text-slate-400">Scholar &amp; OpenAlex</div>
            </div>

            <div className="bg-slate-900 border border-cyan-400/70 px-3 py-2.5 rounded-xs">
              <div className="text-[10px] text-cyan-300 font-bold uppercase flex items-center gap-1">
                <MousePointerClick className="w-3 h-3" />
                <span>Etkileşimler</span>
              </div>
              <div className="text-base sm:text-lg font-extrabold text-white mt-0.5">
                {syncedAppInteractions.totalInteractionsSinceLaunch.toLocaleString('tr-TR')}
              </div>
              <div className="text-[9px] text-emerald-300">
                Bu oturum +{resolvedSessionInteractions.totalInteractionsSinceLaunch.toLocaleString('tr-TR')}
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xs flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-slate-300">
            <span>
              <strong className="text-emerald-300">1:1 Tam Senkron &amp; GitHub Ağı:</strong> Σ ({cumulativeBreakdown.live2.count} Canlı Düğüm + {cumulativeBreakdown.retired8.count} Senkron 301 = {strictNodes.length} Düğüm) = Σ {activeArticles.length} Makale = Σ 5 Coğrafya · GitHub Düğümleri:{' '}
              <a
                href="https://github.com/33EmrePelit33"
                target="_blank"
                rel="me noopener noreferrer"
                className="text-violet-300 hover:underline font-extrabold"
              >
                github.com/33EmrePelit33 ↗ ({githubNodeMeta?.publicRepos ?? 10} Repo · Canlı #11)
              </a>{' '}
              ·{' '}
              <a
                href="https://github.com/emrepelit109"
                target="_blank"
                rel="me noopener noreferrer"
                className="text-cyan-300 hover:underline font-bold"
              >
                github.com/emrepelit109 ↗
              </a>{' '}
              &amp;{' '}
              <span
                title="GitHub Pages düğümü 318+ makale korpusu ile senkronize 301 arşiv kaydıdır"
                className="text-slate-400 font-semibold"
              >
                emrepelit.github.io/science-philosophy (301 Senkron Arşiv)
              </span>
            </span>
            <span className="text-[10px] text-emerald-400 font-bold">
              Ort. Makale Okuma: {Math.floor(articleCumulativeData.meanAvgReadingSeconds / 60)} dk{' '}
              {String(articleCumulativeData.meanAvgReadingSeconds % 60).padStart(2, '0')} sn · Son Senkron:{' '}
              {latestLiveEventDetail?.timestamp || lastStatsSyncEvent?.timestamp || 'Canlı'}
            </span>
          </div>
        </div>

        {/* 3. Clean 4-Tab Navigation Switcher */}
        <div
          role="tablist"
          aria-label="Analitik Paneli Bölümleri"
          className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3 font-mono text-xs"
        >
          {(
            [
              {
                id: 'overview',
                label: `1. Genel Bakış: ${cumulativeBreakdown.live2.count} Canlı + ${cumulativeBreakdown.retired8.count} Senkron 301 (${strictNodes.length} Düğüm · ${activeArticles.length} Makale)`,
              },
              {
                id: 'articles-geo',
                label: `2. ${activeArticles.length} Makale, Okuma Süresi & Küresel Coğrafya`,
              },
              {
                id: 'interactions',
                label: '3. Uygulama Etkileşimleri & Canlı Veri Girişi',
              },
              {
                id: 'benchmark',
                label: '4. Küresel İlk 100 Sıralama & Rapor',
              },
            ] as const
          ).map((tab) => {
            const isActive = activeHubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveHubTab(tab.id)}
                className={`px-3.5 py-2 rounded-xs border font-bold transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-emerald-400 text-slate-950 border-emerald-300 shadow-sm'
                    : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW, WORLD MAP GEO VISUALIZATION, METRIC-BY-METRIC CUMULATIVE MATRIX & ALL 10 OFFICIAL WEBSITES */}
        {activeHubTab === 'overview' && (
          <div className="space-y-5">
            {/* Interactive World Map & Regional Breakdown Chart (Immediately visible in Analytics Panel) */}
            <WorldAnalyticsMap
              regionTotals={articleCumulativeData.regionTotals}
              countryTotals={articleCumulativeData.countryTotals}
              totalReads={articleCumulativeData.totalReads}
              totalViews={articleCumulativeData.totalViews}
              compact
            />

            {/* Dedicated Cumulative Total Metric-by-Metric Breakdown Section */}
            <div className="bg-slate-900/95 border-2 border-emerald-400/80 p-4 rounded-xs space-y-3 font-mono text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                <div className="space-y-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 bg-emerald-400 text-slate-950 font-extrabold text-[10px] rounded-xs">
                      KÜMÜLATİF TOPLAM · METRİK METRİK
                    </span>
                    <span className="text-emerald-300 font-bold uppercase text-[11px]">
                      TÜM HTTP 301 BAĞLI WEB SİTELERİNİN AÇILIŞTAN BUGÜNE ({cumulativeBreakdown.networkAgeDays} GÜN) BİRLEŞİK TOPLAMI
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-300">
                    <span className="text-emerald-300 font-bold">Canlı Sürekli Senkronizasyon Aktif (Çerezsiz &amp; Kişisel Verisiz):</span> Tüm {strictNodes.length} düğümün (Ana Hub + Blogger + GitHub 33EmrePelit33 + 8 HTTP 301 Düğümü) açılış tarihlerinden ({cumulativeBreakdown.networkAgeDays} gün) bugüne elde ettiği kümülatif veriler ve {activeArticles.length} makale korpusu (<code className="text-cyan-300">POST /api/analytics/recalculate-network</code> + <code className="text-cyan-300">POST /api/articles/publish-all-301</code> + SSE) anlık eşitlenir ve monotonik kilit nedeniyle hiçbir metrik hiçbir zaman azalmaz.
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] tabular-nums">
                  <span className="px-2 py-1 bg-emerald-950 border border-emerald-500/60 text-emerald-300 rounded-xs font-bold inline-flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>MONOTONİK KİLİT AKTİF · AZALTMA KAPALI</span>
                  </span>
                  <span className="px-2 py-1 bg-cyan-950 border border-cyan-500/60 text-cyan-300 rounded-xs font-bold">
                    Senkron #{lastStatsSyncEvent?.syncSeq || liveSyncCounter}
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-800 bg-slate-950 rounded-xs">
                <table className="w-full text-left border-collapse text-[11px] tabular-nums">
                  <thead className="bg-slate-900 text-slate-300 uppercase text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-2 px-3">Metrik Adı (Açılıştan Beri)</th>
                      <th className="py-2 px-3 text-right text-emerald-300">
                        Canlı {cumulativeBreakdown.live2.count} Düğüm (Hub + Blogger + GitHub 33EmrePelit33)
                      </th>
                      <th className="py-2 px-3 text-right text-slate-300">
                        Senkronize {cumulativeBreakdown.retired8.count} HTTP 301 Düğümü (Tarihsel Taban)
                      </th>
                      <th className="py-2 px-3 text-right text-amber-300">
                        Σ {strictNodes.length} Düğüm Kümülatif Toplamı
                      </th>
                      <th className="py-2 px-3">Oran / Dönüşüm / Ayrıntılı Hesap</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900 text-slate-200">
                    <tr className="hover:bg-slate-900/50">
                      <td className="py-2 px-3 font-bold text-cyan-300">1. Toplam Görüntülenme</td>
                      <td className="py-2 px-3 text-right text-emerald-300 font-bold">
                        {cumulativeBreakdown.live2.totalViews.toLocaleString('tr-TR')}
                      </td>
                      <td className="py-2 px-3 text-right text-slate-300">
                        {cumulativeBreakdown.retired8.totalViews.toLocaleString('tr-TR')}
                      </td>
                      <td className="py-2 px-3 text-right text-cyan-200 font-extrabold text-xs">
                        {cumulativeBreakdown.total10.totalViews.toLocaleString('tr-TR')}
                      </td>
                      <td className="py-2 px-3 text-[10px] text-slate-300">
                        Günlük ort.{' '}
                        {Math.round(
                          cumulativeBreakdown.total10.totalViews / cumulativeBreakdown.networkAgeDays
                        ).toLocaleString('tr-TR')}{' '}
                        gör./gün · Canlı Pay: %
                        {(
                          (cumulativeBreakdown.live2.totalViews /
                            Math.max(1, cumulativeBreakdown.total10.totalViews)) *
                          100
                        ).toFixed(2)}
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-900/50">
                      <td className="py-2 px-3 font-bold text-amber-300">2. Birleşik Net Okunma</td>
                      <td className="py-2 px-3 text-right text-emerald-300 font-bold">
                        {cumulativeBreakdown.live2.netReads.toLocaleString('tr-TR')}
                      </td>
                      <td className="py-2 px-3 text-right text-slate-300">
                        {cumulativeBreakdown.retired8.netReads.toLocaleString('tr-TR')}
                      </td>
                      <td className="py-2 px-3 text-right text-amber-300 font-extrabold text-xs">
                        {cumulativeBreakdown.total10.netReads.toLocaleString('tr-TR')}
                      </td>
                      <td className="py-2 px-3 text-[10px] text-slate-300">
                        Okunma/Gör. Dönüşüm: %
                        {(
                          (cumulativeBreakdown.total10.netReads /
                            Math.max(1, cumulativeBreakdown.total10.totalViews)) *
                          100
                        ).toFixed(2)}{' '}
                        · Son 48s: +{cumulativeBreakdown.total10.recent48hReads.toLocaleString('tr-TR')}
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-900/50">
                      <td className="py-2 px-3 font-bold text-amber-200">3. Toplam Okuma Süresi</td>
                      <td className="py-2 px-3 text-right text-emerald-300 font-bold">
                        {cumulativeBreakdown.live2.readingHours.toLocaleString('tr-TR')} sa{' '}
                        {cumulativeBreakdown.live2.readingMins} dk
                      </td>
                      <td className="py-2 px-3 text-right text-slate-300">
                        {cumulativeBreakdown.retired8.readingHours.toLocaleString('tr-TR')} sa{' '}
                        {cumulativeBreakdown.retired8.readingMins} dk
                      </td>
                      <td className="py-2 px-3 text-right text-amber-200 font-extrabold text-xs">
                        {cumulativeBreakdown.total10.readingHours.toLocaleString('tr-TR')} sa{' '}
                        {cumulativeBreakdown.total10.readingMins} dk
                      </td>
                      <td className="py-2 px-3 text-[10px] text-slate-300">
                        {cumulativeBreakdown.total10.readingMinutesTotal.toLocaleString('tr-TR')} toplam dk ·{' '}
                        {(cumulativeBreakdown.total10.readingMinutesTotal / 1440).toFixed(1)} kesintisiz gün · Ort.{' '}
                        {(
                          cumulativeBreakdown.total10.readingMinutesTotal /
                          Math.max(1, cumulativeBreakdown.total10.netReads)
                        ).toFixed(2)}{' '}
                        dk/okuma
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-900/50">
                      <td className="py-2 px-3 font-bold text-emerald-300">4. Sesli Dinleme Süresi</td>
                      <td className="py-2 px-3 text-right text-emerald-300 font-bold">
                        {cumulativeBreakdown.live2.audioHours.toLocaleString('tr-TR')} sa{' '}
                        {cumulativeBreakdown.live2.audioMins} dk
                      </td>
                      <td className="py-2 px-3 text-right text-slate-300">
                        {cumulativeBreakdown.retired8.audioHours.toLocaleString('tr-TR')} sa{' '}
                        {cumulativeBreakdown.retired8.audioMins} dk
                      </td>
                      <td className="py-2 px-3 text-right text-emerald-300 font-extrabold text-xs">
                        {cumulativeBreakdown.total10.audioHours.toLocaleString('tr-TR')} sa{' '}
                        {cumulativeBreakdown.total10.audioMins} dk
                      </td>
                      <td className="py-2 px-3 text-[10px] text-slate-300">
                        {cumulativeBreakdown.total10.audioMinutesTotal.toLocaleString('tr-TR')} toplam dk ·{' '}
                        {(cumulativeBreakdown.total10.audioMinutesTotal / 1440).toFixed(1)} gün · Ses Oturumu:{' '}
                        {syncedAppInteractions.audioListens.toLocaleString('tr-TR')}
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-900/50">
                      <td className="py-2 px-3 font-bold text-purple-300">5. Toplam Tekil Okur</td>
                      <td className="py-2 px-3 text-right text-emerald-300 font-bold">
                        {cumulativeBreakdown.live2.uniqueReaders.toLocaleString('tr-TR')}
                      </td>
                      <td className="py-2 px-3 text-right text-slate-300">
                        {cumulativeBreakdown.retired8.uniqueReaders.toLocaleString('tr-TR')}
                      </td>
                      <td className="py-2 px-3 text-right text-purple-200 font-extrabold text-xs">
                        {cumulativeBreakdown.total10.uniqueReaders.toLocaleString('tr-TR')}
                      </td>
                      <td className="py-2 px-3 text-[10px] text-slate-300">
                        Okur başına{' '}
                        {(
                          cumulativeBreakdown.total10.totalViews /
                          Math.max(1, cumulativeBreakdown.total10.uniqueReaders)
                        ).toFixed(2)}{' '}
                        görüntülenme · 5 Kıta / 12 Ülke
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-900/50">
                      <td className="py-2 px-3 font-bold text-teal-300">5B. Geniş Özet Videosu (23 Dil) İzlenme</td>
                      <td className="py-2 px-3 text-right text-emerald-300 font-bold">
                        {articleCumulativeData.totalVideoPlaysAllArticles.toLocaleString('tr-TR')} izlenme
                      </td>
                      <td className="py-2 px-3 text-right text-slate-400">
                        0 (Süre Sınırsız HTML5 Video)
                      </td>
                      <td className="py-2 px-3 text-right text-teal-200 font-extrabold text-xs">
                        {Math.floor(articleCumulativeData.totalVideoWatchSecondsAllArticles / 60).toLocaleString('tr-TR')} dk{' '}
                        {String(articleCumulativeData.totalVideoWatchSecondsAllArticles % 60).padStart(2, '0')} sn
                      </td>
                      <td className="py-2 px-3 text-[10px] text-slate-300">
                        İzlenen tekil makale videosu: {articleCumulativeData.articlesWithVideoWatches} / {activeArticles.length} · Canlı SSE + Monotonik Kayıt
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-900/50">
                      <td className="py-2 px-3 font-bold text-sky-300">6. Simülatör Çalıştırma</td>
                      <td className="py-2 px-3 text-right text-emerald-300 font-bold">
                        {cumulativeBreakdown.live2.simulatorRuns.toLocaleString('tr-TR')}
                      </td>
                      <td className="py-2 px-3 text-right text-slate-300">
                        {cumulativeBreakdown.retired8.simulatorRuns.toLocaleString('tr-TR')}
                      </td>
                      <td className="py-2 px-3 text-right text-sky-200 font-extrabold text-xs">
                        {cumulativeBreakdown.total10.simulatorRuns.toLocaleString('tr-TR')}
                      </td>
                      <td className="py-2 px-3 text-[10px] text-slate-300">
                        Canlı Kuantum/Higgs/Kaotik Parametre Deneyi · %100 Etkileşim Mutabakatı
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-900/50">
                      <td className="py-2 px-3 font-bold text-emerald-200">
                        7. Toplam Senkron Makale &amp; 12-Dil Kanonik Sayfa
                      </td>
                      <td className="py-2 px-3 text-right text-emerald-300 font-bold">
                        {(activeArticles.length * cumulativeBreakdown.live2.count).toLocaleString('tr-TR')} yayın ({activeArticles.length}/düğüm)
                      </td>
                      <td className="py-2 px-3 text-right text-slate-300">
                        {(activeArticles.length * cumulativeBreakdown.retired8.count).toLocaleString('tr-TR')} senkron indeks ({activeArticles.length}/düğüm)
                      </td>
                      <td className="py-2 px-3 text-right text-emerald-300 font-extrabold text-xs">
                        {(activeArticles.length * strictNodes.length).toLocaleString('tr-TR')} ağ yayını
                      </td>
                      <td className="py-2 px-3 text-[10px] text-slate-300">
                        Tekil Korpus: {activeArticles.length} Makale × {strictNodes.length} Düğüm (%100 Tam Senkron) · {(activeArticles.length * 12).toLocaleString('tr-TR')} 12-Dil Kanonik Sayfa
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-900/50">
                      <td className="py-2 px-3 font-bold text-teal-300">
                        8. Akademik Atıf &amp; 301 Backlink Ağı
                      </td>
                      <td className="py-2 px-3 text-right text-emerald-300 font-bold">
                        {cumulativeBreakdown.live2.publicationsCount} canlı backlink
                      </td>
                      <td className="py-2 px-3 text-right text-slate-300">
                        {cumulativeBreakdown.retired8.publicationsCount} köprülü backlink
                      </td>
                      <td className="py-2 px-3 text-right text-teal-200 font-extrabold text-xs">
                        {articleCumulativeData.totalCitations.toLocaleString('tr-TR')} atıf ·{' '}
                        {cumulativeBreakdown.total10.publicationsCount} yayın
                      </td>
                      <td className="py-2 px-3 text-[10px] text-slate-300">
                        Scholar, OpenAlex, GitHub 33EmrePelit33 &amp; ResearchGate (<code className="text-emerald-300">/researchgate</code> 301 Köprüsü)
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-900/50">
                      <td className="py-2 px-3 font-bold text-white">
                        9. Toplam Uygulama Etkileşimi (Açılıştan Bugüne)
                      </td>
                      <td className="py-2 px-3 text-right text-emerald-300 font-bold">
                        Canlı Oturum +{resolvedSessionInteractions.totalInteractionsSinceLaunch.toLocaleString('tr-TR')}
                      </td>
                      <td className="py-2 px-3 text-right text-slate-300">
                        Tarihsel + Çoklu Düğüm Akışı
                      </td>
                      <td className="py-2 px-3 text-right text-white font-extrabold text-xs">
                        {syncedAppInteractions.totalInteractionsSinceLaunch.toLocaleString('tr-TR')}
                      </td>
                      <td className="py-2 px-3 text-[10px] text-slate-300">
                        Analiz: {syncedAppInteractions.analysisModals.toLocaleString('tr-TR')} · Dil/Arama/Dışa Aktarım:{' '}
                        {syncedAppInteractions.languageSearchExports.toLocaleString('tr-TR')} · İtiraz:{' '}
                        {syncedAppInteractions.qaObjections.toLocaleString('tr-TR')} · PWA:{' '}
                        {syncedAppInteractions.pwaDownloads.toLocaleString('tr-TR')}
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-900/50">
                      <td className="py-2 px-3 font-bold text-slate-200">
                        10. HTTP Durum, TLS 1.3 &amp; Ortalama Senkron Gecikmesi
                      </td>
                      <td className="py-2 px-3 text-right text-emerald-300 font-bold">
                        {cumulativeBreakdown.live2.count} Canlı (HTTP 200) · {cumulativeBreakdown.live2.avgLatencyMs} ms
                      </td>
                      <td className="py-2 px-3 text-right text-slate-300">
                        {cumulativeBreakdown.retired8.count} Senkron 301 → Hub · {cumulativeBreakdown.retired8.avgLatencyMs} ms
                      </td>
                      <td className="py-2 px-3 text-right text-emerald-300 font-extrabold text-xs">
                        {strictNodes.length} / {strictNodes.length} Düğüm · {cumulativeBreakdown.total10.avgLatencyMs} ms ort.
                      </td>
                      <td className="py-2 px-3 text-[10px] text-slate-300">
                        TLS 1.3 / SHA-256 · Tüm {strictNodes.length} Düğümde Canlı Senkron: {Math.max(activeArticles.length, bloggerSyncedCount)} Makale
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Live Cross-Node Article Publishing Bar (Add article to ANY node -> instant live sync across all 11 nodes) */}
            {onPublishFromAnyNode && (
              <div className="bg-slate-900/95 border border-violet-400/70 p-3.5 rounded-xs space-y-3 font-mono text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 bg-violet-500 text-slate-950 font-extrabold text-[10px] rounded-xs inline-flex items-center gap-1">
                        <GitBranch className="w-3 h-3" />
                        <span>11-DÜĞÜM CANLI YAYIN KÖPRÜSÜ</span>
                      </span>
                      <span className="text-violet-200 font-bold text-[11px]">
                        Herhangi Bir Düğüme Yazı Ekle → Tüm {strictNodes.length} Düğümde Anında Canlı Yayınla &amp; Analitiği Eşitle
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Seçtiğiniz herhangi bir düğümden (Ana Hub, Blogger, GitHub 33EmrePelit33 veya 8 HTTP 301 düğümünden biri) eklenen yeni makale SSE ile tüm {strictNodes.length} düğüme canlı yansır ve analitik toplamları hatasız güncellenir.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCrossNodePublishForm((v) => !v)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-500 hover:bg-violet-400 text-slate-950 font-extrabold text-[11px] rounded-xs cursor-pointer transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>{showCrossNodePublishForm ? 'Yayın Formunu Gizle' : 'Herhangi Bir Düğümden Canlı Yazı Ekle'}</span>
                  </button>
                </div>

                {showCrossNodePublishForm && (
                  <form
                    onSubmit={handleQuickCrossNodePublish}
                    className="bg-slate-950 border border-slate-800 p-3 rounded-xs space-y-2.5"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                      <div>
                        <label className="block text-[10px] text-violet-300 font-bold mb-1">
                          KAYNAK DÜĞÜM (11 DÜĞÜMDEN BİRİNİ SEÇ)
                        </label>
                        <select
                          value={publishOriginNode}
                          onChange={(e) => setPublishOriginNode(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 text-white rounded-xs text-xs focus:outline-none focus:border-violet-400"
                        >
                          {strictNodes.map((n) => (
                            <option key={`pub-origin-${n.domain}`} value={n.domain}>
                              #{n.rank} {n.domain}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] text-cyan-300 font-bold mb-1">
                          MAKALE BAŞLIĞI *
                        </label>
                        <input
                          type="text"
                          required
                          value={publishTitle}
                          onChange={(e) => setPublishTitle(e.target.value)}
                          placeholder="Örn: Kuantum Bilgi Koruması ve Bilinç Geometrisi..."
                          className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 text-white rounded-xs text-xs focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-emerald-300 font-bold mb-1">
                          KATEGORİ
                        </label>
                        <select
                          value={publishCategory}
                          onChange={(e) => setPublishCategory(e.target.value as Article['category'])}
                          className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 text-white rounded-xs text-xs focus:outline-none focus:border-emerald-400"
                        >
                          {categoriesList.map((cat) => (
                            <option key={`pub-cat-${cat}`} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">KISA ÖZET (OPSİYONEL)</label>
                        <input
                          type="text"
                          value={publishAbstract}
                          onChange={(e) => setPublishAbstract(e.target.value)}
                          placeholder="Makalenin kısa akademik özeti..."
                          className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 text-white rounded-xs text-xs focus:outline-none focus:border-violet-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">METİN İÇERİĞİ (OPSİYONEL)</label>
                        <input
                          type="text"
                          value={publishBody}
                          onChange={(e) => setPublishBody(e.target.value)}
                          placeholder="Makale metni (boş bırakılırsa özetten otomatik oluşturulur)..."
                          className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 text-white rounded-xs text-xs focus:outline-none focus:border-violet-400"
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <span className="text-[10px] text-emerald-300">
                        ✓ Yayınlandığında makale sayısı {activeArticles.length} → {activeArticles.length + 1} olur ve tüm {strictNodes.length} düğüm + analitik sayaçları canlı güncellenir.
                      </span>
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-xs rounded-xs cursor-pointer transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Tüm {strictNodes.length} Düğümde Canlı Yayınla</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Consolidated 11-Node Comparison Table Since Launch */}
            <div className="bg-slate-900/95 border border-cyan-500/50 p-4 rounded-xs space-y-3 font-mono text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                <div className="space-y-0.5">
                  <span className="text-cyan-300 font-bold uppercase text-[11px]">
                    {cumulativeBreakdown.live2.count} CANLI DÜĞÜM (ANA HUB + BLOGGER + GITHUB 33EMREPELIT33) VE {cumulativeBreakdown.retired8.count} SENKRONİZE 301 DÜĞÜMÜNÜN AÇILIŞTAN BERİ İSTATİSTİKLERİ (TOPLAM {strictNodes.length} DÜĞÜM · {activeArticles.length} MAKALE)
                  </span>
                  <div className="text-[10px] text-slate-400">
                    Tüm {strictNodes.length} düğümün tamamı {activeArticles.length} makale ile %100 tam senkrondur; canlı trafik artışları emrepelit-sciphi.ai.studio, emrepelit7337.blogspot.com ve github.com/33EmrePelit33 üzerinde toplanır, tarihsel 301 düğümleri monotonik kilit ile korunur.
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowDetailedSiteCards((v) => !v)}
                    className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-amber-300 text-[10px] font-bold rounded-xs cursor-pointer"
                  >
                    {showDetailedSiteCards ? 'Detaylı Düğüm Kartlarını Gizle' : `${strictNodes.length} Düğüm Detay Kartlarını Göster`}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReconciliationDetails((v) => !v)}
                    className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 border border-emerald-500/50 text-emerald-300 text-[10px] font-bold rounded-xs cursor-pointer"
                  >
                    {showReconciliationDetails ? 'Mutabakat Denklemlerini Gizle' : 'Mutabakat Denklemleri & Zero-Trust'}
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-800 bg-slate-950 rounded-xs">
                <table className="w-full text-left border-collapse text-[11px] tabular-nums">
                  <thead className="bg-slate-900 text-slate-300 uppercase text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-2 px-2.5">#</th>
                      <th className="py-2 px-2.5">Web Sitesi &amp; Durum</th>
                      <th className="py-2 px-2.5">Açılış Tarihi</th>
                      <th className="py-2 px-2.5 text-right">Makale</th>
                      <th className="py-2 px-2.5 text-right text-cyan-300">Görüntülenme</th>
                      <th className="py-2 px-2.5 text-right text-amber-300">Net Okunma</th>
                      <th className="py-2 px-2.5 text-right text-teal-300">Dönüşüm</th>
                      <th className="py-2 px-2.5 text-right">Ağ Payı</th>
                      <th className="py-2 px-2.5 text-right text-amber-200">Okuma Süresi</th>
                      <th className="py-2 px-2.5 text-right text-emerald-300">Sesli Dinleme</th>
                      <th className="py-2 px-2.5 text-right text-purple-300">Tekil Okur</th>
                      <th className="py-2 px-2.5 text-right text-sky-300">Simülatör</th>
                      <th className="py-2 px-2.5 text-right">Gecikme</th>
                      <th className="py-2 px-2.5 text-right">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900 text-slate-200">
                    {strictNodes.map((node) => {
                      const isMainHub = node.domain === 'emrepelit-sciphi.ai.studio';
                      const isGitHubNode =
                        node.domain === 'github.com/33EmrePelit33' ||
                        node.status === 'LIVE_GITHUB_NODE';
                      const isPassiveArchive =
                        node.domain === 'emrepelit.github.io/science-philosophy';
                      const isLiveNode =
                        LIVE_WEBSITES_SET.has(node.domain) || Boolean(node.isLiveWebsite);
                      const nodeViews = node.stats.totalViews ?? node.stats.netReads;
                      const convPct = ((node.stats.netReads / Math.max(1, nodeViews)) * 100).toFixed(1);
                      const readMinsTotal =
                        node.stats.readingTimeHours * 60 + node.stats.readingTimeMinutes;
                      const audioMinsTotal =
                        node.stats.audioListenHours * 60 + node.stats.audioListenMinutes;
                      const sharePct = (
                        (node.stats.netReads / Math.max(1, cumulative.netReads)) *
                        100
                      ).toFixed(2);
                      const elapsedDays = computeElapsedDaysSinceLaunch(node.launchDate);
                      return (
                        <tr
                          key={`summary-row-${node.id}`}
                          className={
                            isMainHub
                              ? 'bg-emerald-950/35'
                              : isGitHubNode
                                ? 'bg-violet-950/30'
                                : !isLiveNode
                                  ? 'bg-slate-950/60 opacity-90'
                                  : 'hover:bg-slate-900/70'
                          }
                        >
                          <td className="py-2 px-2.5 font-bold text-amber-400">#{node.rank}</td>
                          <td className="py-2 px-2.5 font-semibold whitespace-nowrap">
                            <span
                              className={
                                isMainHub
                                  ? 'text-emerald-300'
                                  : isGitHubNode
                                    ? 'text-violet-300'
                                    : isLiveNode
                                      ? 'text-amber-200'
                                      : 'text-slate-300'
                              }
                            >
                              {node.domain}
                            </span>{' '}
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded-xs border ${
                                isMainHub
                                  ? 'bg-emerald-950 border-emerald-500/60 text-emerald-300'
                                  : isGitHubNode
                                    ? 'bg-violet-950 border-violet-400/60 text-violet-200'
                                    : isLiveNode
                                      ? 'bg-amber-950/60 border-amber-400/50 text-amber-300'
                                      : isPassiveArchive
                                        ? 'bg-amber-950/40 border-amber-700/60 text-amber-300'
                                        : 'bg-slate-900 border-slate-700 text-slate-400'
                              }`}
                            >
                              {isMainHub
                                ? 'CANLI ANA HUB · HTTP 200'
                                : isGitHubNode
                                  ? 'CANLI GITHUB · HTTP 200'
                                  : isLiveNode
                                    ? 'CANLI BLOGGER · HTTP 200'
                                    : isPassiveArchive
                                      ? 'SENKRON ARŞİV · 301 → Hub'
                                      : 'SENKRON 301 → Hub'}
                            </span>
                          </td>
                          <td className="py-2 px-2.5 text-amber-200 whitespace-nowrap">
                            {node.launchDate}{' '}
                            <span className="text-[9px] text-slate-400">({elapsedDays}g)</span>
                          </td>
                          <td className="py-2 px-2.5 text-right text-emerald-300 font-bold">
                            {Math.max(activeArticles.length, node.articlesCount, 320)}
                          </td>
                          <td className="py-2 px-2.5 text-right font-bold text-cyan-300">
                            {nodeViews.toLocaleString('tr-TR')}
                          </td>
                          <td className="py-2 px-2.5 text-right font-bold text-amber-300">
                            {node.stats.netReads.toLocaleString('tr-TR')}
                          </td>
                          <td className="py-2 px-2.5 text-right text-teal-300">%{convPct}</td>
                          <td className="py-2 px-2.5 text-right text-slate-300">%{sharePct}</td>
                          <td className="py-2 px-2.5 text-right whitespace-nowrap text-amber-200">
                            {node.stats.readingTimeHours.toLocaleString('tr-TR')} sa{' '}
                            {node.stats.readingTimeMinutes} dk{' '}
                            <span className="text-[9px] text-slate-400">
                              ({readMinsTotal.toLocaleString('tr-TR')} dk)
                            </span>
                          </td>
                          <td className="py-2 px-2.5 text-right whitespace-nowrap text-emerald-300">
                            {node.stats.audioListenHours.toLocaleString('tr-TR')} sa{' '}
                            {node.stats.audioListenMinutes} dk{' '}
                            <span className="text-[9px] text-slate-400">
                              ({audioMinsTotal.toLocaleString('tr-TR')} dk)
                            </span>
                          </td>
                          <td className="py-2 px-2.5 text-right text-purple-300">
                            {node.stats.uniqueReaders.toLocaleString('tr-TR')}
                          </td>
                          <td className="py-2 px-2.5 text-right text-sky-300">
                            {node.stats.simulatorRuns.toLocaleString('tr-TR')}
                          </td>
                          <td className="py-2 px-2.5 text-right text-slate-400 whitespace-nowrap">
                            {node.stats.syncLatencyMs} ms
                          </td>
                          <td className="py-2 px-2.5 text-right whitespace-nowrap">
                            {isLiveNode ? (
                              <button
                                type="button"
                                onClick={() => {
                                  onRecordAnalyticsMeasurement?.(
                                    node.domain,
                                    {
                                      viewsDelta: 1,
                                      readsDelta: 1,
                                      readingMinutesDelta: 5,
                                      uniqueReadersDelta: 1,
                                    },
                                    'ANALYTICS_PANEL',
                                    `Canlı Senkron (#${node.rank} ${node.domain} · Açılış: ${node.launchDate}): +1 Görüntülenme, +1 Okunma, +5 dk Okuma, +1 Tekil Okur`
                                  );
                                  setAnalyticsNotice(
                                    `✓ #${node.rank} ${node.domain} için +1 Görüntülenme ve +1 Okunma kaydedildi.`
                                  );
                                }}
                                className="px-2 py-0.5 bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/60 text-emerald-300 font-bold text-[10px] rounded-xs cursor-pointer"
                              >
                                +1 Kaydet
                              </button>
                            ) : (
                              <span className="px-2 py-0.5 bg-slate-900 border border-slate-700 text-slate-400 text-[10px] rounded-xs">
                                {isPassiveArchive ? 'Pasif Arşiv (404)' : 'Donduruldu (301 → Hub)'}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-emerald-950/30 border-t border-emerald-500/50 text-[11px] font-bold">
                      <td colSpan={3} className="py-2 px-2.5 text-emerald-300">
                        Ara Toplam · Canlı {cumulativeBreakdown.live2.count} Düğüm (Ana Hub + Blogger + GitHub 33EmrePelit33)
                      </td>
                      <td className="py-2 px-2.5 text-right text-emerald-300">
                        {activeArticles.length} × {cumulativeBreakdown.live2.count}
                      </td>
                      <td className="py-2 px-2.5 text-right text-cyan-300">
                        {cumulativeBreakdown.live2.totalViews.toLocaleString('tr-TR')}
                      </td>
                      <td className="py-2 px-2.5 text-right text-amber-300">
                        {cumulativeBreakdown.live2.netReads.toLocaleString('tr-TR')}
                      </td>
                      <td className="py-2 px-2.5 text-right text-teal-300">
                        %
                        {(
                          (cumulativeBreakdown.live2.netReads /
                            Math.max(1, cumulativeBreakdown.live2.totalViews)) *
                          100
                        ).toFixed(1)}
                      </td>
                      <td className="py-2 px-2.5 text-right text-emerald-200">
                        %
                        {(
                          (cumulativeBreakdown.live2.netReads /
                            Math.max(1, cumulative.netReads)) *
                          100
                        ).toFixed(2)}
                      </td>
                      <td className="py-2 px-2.5 text-right whitespace-nowrap text-amber-200">
                        {cumulativeBreakdown.live2.readingHours.toLocaleString('tr-TR')} sa{' '}
                        {cumulativeBreakdown.live2.readingMins} dk
                      </td>
                      <td className="py-2 px-2.5 text-right whitespace-nowrap text-emerald-300">
                        {cumulativeBreakdown.live2.audioHours.toLocaleString('tr-TR')} sa{' '}
                        {cumulativeBreakdown.live2.audioMins} dk
                      </td>
                      <td className="py-2 px-2.5 text-right text-purple-300">
                        {cumulativeBreakdown.live2.uniqueReaders.toLocaleString('tr-TR')}
                      </td>
                      <td className="py-2 px-2.5 text-right text-sky-300">
                        {cumulativeBreakdown.live2.simulatorRuns.toLocaleString('tr-TR')}
                      </td>
                      <td className="py-2 px-2.5 text-right text-slate-300">
                        {cumulativeBreakdown.live2.avgLatencyMs} ms
                      </td>
                      <td className="py-2 px-2.5 text-right text-emerald-300 text-[10px]">
                        Canlı Aktif
                      </td>
                    </tr>
                    <tr className="bg-slate-950 border-t border-slate-800 text-[11px] font-semibold text-slate-300">
                      <td colSpan={3} className="py-2 px-2.5">
                        Ara Toplam · Senkronize {cumulativeBreakdown.retired8.count} HTTP 301 Düğümü (Tam Senkron · Dondurulmuş Taban)
                      </td>
                      <td className="py-2 px-2.5 text-right">
                        {activeArticles.length} × {cumulativeBreakdown.retired8.count}
                      </td>
                      <td className="py-2 px-2.5 text-right text-cyan-300">
                        {cumulativeBreakdown.retired8.totalViews.toLocaleString('tr-TR')}
                      </td>
                      <td className="py-2 px-2.5 text-right text-amber-300">
                        {cumulativeBreakdown.retired8.netReads.toLocaleString('tr-TR')}
                      </td>
                      <td className="py-2 px-2.5 text-right text-teal-300">
                        %
                        {(
                          (cumulativeBreakdown.retired8.netReads /
                            Math.max(1, cumulativeBreakdown.retired8.totalViews)) *
                          100
                        ).toFixed(1)}
                      </td>
                      <td className="py-2 px-2.5 text-right">
                        %
                        {(
                          (cumulativeBreakdown.retired8.netReads /
                            Math.max(1, cumulative.netReads)) *
                          100
                        ).toFixed(2)}
                      </td>
                      <td className="py-2 px-2.5 text-right whitespace-nowrap text-amber-200">
                        {cumulativeBreakdown.retired8.readingHours.toLocaleString('tr-TR')} sa{' '}
                        {cumulativeBreakdown.retired8.readingMins} dk
                      </td>
                      <td className="py-2 px-2.5 text-right whitespace-nowrap text-emerald-300">
                        {cumulativeBreakdown.retired8.audioHours.toLocaleString('tr-TR')} sa{' '}
                        {cumulativeBreakdown.retired8.audioMins} dk
                      </td>
                      <td className="py-2 px-2.5 text-right text-purple-300">
                        {cumulativeBreakdown.retired8.uniqueReaders.toLocaleString('tr-TR')}
                      </td>
                      <td className="py-2 px-2.5 text-right text-sky-300">
                        {cumulativeBreakdown.retired8.simulatorRuns.toLocaleString('tr-TR')}
                      </td>
                      <td className="py-2 px-2.5 text-right text-slate-400">
                        {cumulativeBreakdown.retired8.avgLatencyMs} ms
                      </td>
                      <td className="py-2 px-2.5 text-right text-slate-400 text-[10px]">
                        301 Senkron
                      </td>
                    </tr>
                    <tr className="bg-slate-900 border-t-2 border-emerald-400 font-extrabold text-xs">
                      <td colSpan={3} className="py-2.5 px-2.5 text-emerald-300">
                        Σ {strictNodes.length} DÜĞÜM KÜMÜLATİF GENEL TOPLAMI (AÇILIŞTAN BUGÜNE %100 MUTABAKAT)
                      </td>
                      <td className="py-2.5 px-2.5 text-right text-emerald-300 whitespace-nowrap">
                        {activeArticles.length} / Düğüm ({(activeArticles.length * strictNodes.length).toLocaleString('tr-TR')})
                      </td>
                      <td className="py-2.5 px-2.5 text-right text-cyan-300">
                        {cumulative.totalViews.toLocaleString('tr-TR')}
                      </td>
                      <td className="py-2.5 px-2.5 text-right text-amber-300">
                        {cumulative.netReads.toLocaleString('tr-TR')}
                      </td>
                      <td className="py-2.5 px-2.5 text-right text-teal-300">
                        %
                        {(
                          (cumulative.netReads / Math.max(1, cumulative.totalViews)) *
                          100
                        ).toFixed(1)}
                      </td>
                      <td className="py-2.5 px-2.5 text-right text-emerald-300">%100,00</td>
                      <td className="py-2.5 px-2.5 text-right whitespace-nowrap text-amber-200">
                        {cumulative.readingHours.toLocaleString('tr-TR')} sa {cumulative.readingMins} dk (
                        {cumulative.readingMinutesTotal.toLocaleString('tr-TR')} dk)
                      </td>
                      <td className="py-2.5 px-2.5 text-right whitespace-nowrap text-emerald-300">
                        {cumulative.audioHours.toLocaleString('tr-TR')} sa {cumulative.audioMins} dk (
                        {cumulative.audioMinutesTotal.toLocaleString('tr-TR')} dk)
                      </td>
                      <td className="py-2.5 px-2.5 text-right text-purple-300">
                        {cumulative.uniqueReaders.toLocaleString('tr-TR')}
                      </td>
                      <td className="py-2.5 px-2.5 text-right text-sky-300">
                        {cumulative.simulatorRuns.toLocaleString('tr-TR')}
                      </td>
                      <td className="py-2.5 px-2.5 text-right text-emerald-300">
                        {cumulativeBreakdown.total10.avgLatencyMs} ms
                      </td>
                      <td className="py-2.5 px-2.5 text-right text-emerald-300 text-[10px]">
                        1:1 Eşit
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Detailed 10-Website Launch-Date & Full-Stats Cards */}
            {showDetailedSiteCards && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-3 font-mono text-xs">
                  {strictNodes.map((node) => {
                    const m = analyticsMeasurements?.[node.domain];
                    const isMainHub = node.domain === 'emrepelit-sciphi.ai.studio';
                    const isGitHubNode =
                      node.domain === 'github.com/33EmrePelit33' ||
                      node.status === 'LIVE_GITHUB_NODE';
                    const isLiveNode =
                      LIVE_WEBSITES_SET.has(node.domain) || Boolean(node.isLiveWebsite);
                    const totalReadsSinceLaunch = node.stats.netReads;
                    const totalViewsSinceLaunch = node.stats.totalViews ?? node.stats.netReads;
                    const totalReadMinsSinceLaunch =
                      node.stats.readingTimeHours * 60 + node.stats.readingTimeMinutes;
                    const totalAudioMinsSinceLaunch =
                      node.stats.audioListenHours * 60 + node.stats.audioListenMinutes;
                    const readH = Math.floor(totalReadMinsSinceLaunch / 60);
                    const readM = totalReadMinsSinceLaunch % 60;
                    const audioH = Math.floor(totalAudioMinsSinceLaunch / 60);
                    const audioM = totalAudioMinsSinceLaunch % 60;
                    const sharePct = (
                      (totalReadsSinceLaunch / Math.max(1, cumulative.netReads)) *
                      100
                    ).toFixed(2);
                    const convPct = (
                      (totalReadsSinceLaunch / Math.max(1, totalViewsSinceLaunch)) *
                      100
                    ).toFixed(2);
                    const elapsedDays = computeElapsedDaysSinceLaunch(node.launchDate);
                    const dailyAvgViews = Math.round(totalViewsSinceLaunch / elapsedDays);
                    const dailyAvgReads = Math.round(totalReadsSinceLaunch / elapsedDays);
                    const viewsPerUnique = (
                      totalViewsSinceLaunch / Math.max(1, node.stats.uniqueReaders)
                    ).toFixed(2);
                    const isPubsExpanded = Boolean(expandedNodePubs[node.id]);
                    const nodeQuery = (nodeArticleSearch[node.id] || '').trim().toLowerCase();
                    const nodeSyncedArticles = nodeQuery
                      ? activeArticles.filter((art, idx) => {
                          const titleText =
                            art.title[language] || art.title.tr || art.title.en || art.id;
                          return (
                            titleText.toLowerCase().includes(nodeQuery) ||
                            art.category.toLowerCase().includes(nodeQuery) ||
                            `#${idx + 1}` === nodeQuery ||
                            String(idx + 1) === nodeQuery
                          );
                        })
                      : activeArticles;
                    const showAllForNode = Boolean(nodeArticleShowAll[node.id]);
                    const displayedNodeArticles = showAllForNode
                      ? nodeSyncedArticles
                      : nodeSyncedArticles.slice(0, 30);

                    return (
                      <div
                        key={`analytics-measured-${node.id}`}
                        className={`p-4 rounded-xs space-y-3 transition-colors flex flex-col justify-between border ${
                          isMainHub
                            ? 'bg-emerald-950/40 border-emerald-400/90'
                            : isGitHubNode
                              ? 'bg-violet-950/30 border-violet-400/80'
                              : isLiveNode
                                ? 'bg-slate-900/95 border-amber-400/70'
                                : 'bg-slate-950/85 border-slate-800'
                        }`}
                      >
                        <div className="space-y-2.5">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span
                                  className={`font-extrabold text-[11px] leading-snug break-all ${
                                    isMainHub
                                      ? 'text-emerald-300'
                                      : isGitHubNode
                                        ? 'text-violet-200'
                                        : isLiveNode
                                          ? 'text-amber-200'
                                          : 'text-slate-200'
                                  }`}
                                  title={node.domain}
                                >
                                  #{node.rank} {node.domain}
                                </span>
                                <span className="px-1.5 py-0.5 text-[9px] bg-slate-900 text-cyan-300 border border-cyan-500/40 rounded-xs shrink-0">
                                  HTTP {node.httpCode}
                                </span>
                                {isGitHubNode && (
                                  <a
                                    href="https://github.com/33EmrePelit33"
                                    target="_blank"
                                    rel="me noopener noreferrer"
                                    className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] bg-violet-950 hover:bg-violet-900 text-violet-200 border border-violet-400/60 rounded-xs shrink-0"
                                  >
                                    <span>GitHub Profili</span>
                                    <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-400 break-words leading-snug mt-0.5" title={node.nodeTitle}>
                                {node.nodeTitle}
                              </div>
                            </div>
                            <span className="px-2 py-0.5 text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/40 rounded-xs shrink-0 tabular-nums font-bold">
                              Ağ Payı: %{sharePct}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-2 text-[10px]">
                            <span
                              className={`px-2 py-0.5 rounded-xs font-bold uppercase ${
                                isMainHub
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50'
                                  : isGitHubNode
                                    ? 'bg-violet-500/20 text-violet-200 border border-violet-400/60'
                                    : isLiveNode
                                      ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50'
                                      : 'bg-slate-900 text-slate-300 border border-slate-700'
                              }`}
                            >
                              {isMainHub
                                ? 'CANLI ANA HUB (HTTP 200 · TEKİL KANONİK)'
                                : isGitHubNode
                                  ? `CANLI GITHUB DÜĞÜMÜ (HTTP 200 · ${githubNodeMeta?.publicRepos ?? 10} REPO)`
                                  : isLiveNode
                                    ? 'CANLI BLOGGER CMS (HTTP 200 → HUB)'
                                    : 'SENKRON HTTP 301 DÜĞÜMÜ → HUB · %100 KORPUS'}
                            </span>
                            <span className="bg-amber-950/40 border border-amber-400/50 px-2 py-0.5 rounded-xs text-amber-200 font-bold">
                              Açılış: {node.launchDate} ({elapsedDays} gün) · {activeArticles.length} Makale · {corpusMetrics.distinctOriginalCount} Özgün
                            </span>
                          </div>

                          {node.decommissionedNote && (
                            <div className="bg-slate-900/90 border border-slate-800 px-2.5 py-1.5 rounded-xs text-[10px] text-slate-300 leading-snug">
                              <strong className="text-amber-300">301 Yönlendirme Notu:</strong>{' '}
                              {node.decommissionedNote}{' '}
                              <span className="text-cyan-300">→ {node.redirectTargetUrl}</span>
                            </div>
                          )}

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-slate-300 tabular-nums">
                            <div className="bg-slate-950 px-2.5 py-1.5 rounded-xs border border-cyan-500/40">
                              <span className="text-[9px] text-cyan-300 block">GÖRÜNTÜLENME</span>
                              <strong className="text-cyan-300 text-xs">
                                {totalViewsSinceLaunch.toLocaleString('tr-TR')}
                              </strong>
                              <span className="text-[9px] text-slate-400 block">
                                Ort. {dailyAvgViews.toLocaleString('tr-TR')}/gün
                              </span>
                            </div>
                            <div className="bg-slate-950 px-2.5 py-1.5 rounded-xs border border-amber-500/40">
                              <span className="text-[9px] text-amber-300 block">NET OKUNMA</span>
                              <strong className="text-amber-300 text-xs">
                                {totalReadsSinceLaunch.toLocaleString('tr-TR')}
                              </strong>
                              <span className="text-[9px] text-slate-400 block">
                                Ort. {dailyAvgReads.toLocaleString('tr-TR')}/gün · %{convPct}
                              </span>
                            </div>
                            <div className="bg-slate-950 px-2.5 py-1.5 rounded-xs border border-slate-800">
                              <span className="text-[9px] text-amber-200 block">OKUMA SÜRESİ</span>
                              <strong className="text-amber-200">
                                {readH.toLocaleString('tr-TR')} sa {readM} dk
                              </strong>
                              <span className="text-[9px] text-slate-400 block">
                                {totalReadMinsSinceLaunch.toLocaleString('tr-TR')} dk
                              </span>
                            </div>
                            <div className="bg-slate-950 px-2.5 py-1.5 rounded-xs border border-slate-800">
                              <span className="text-[9px] text-emerald-300 block">SESLİ DİNLEME</span>
                              <strong className="text-emerald-300">
                                {audioH.toLocaleString('tr-TR')} sa {audioM} dk
                              </strong>
                              <span className="text-[9px] text-slate-400 block">
                                {totalAudioMinsSinceLaunch.toLocaleString('tr-TR')} dk
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] tabular-nums">
                            <div className="bg-slate-950 px-2 py-1 rounded-xs border border-slate-800 flex items-center justify-between">
                              <span className="text-slate-400">Tekil Okur:</span>
                              <strong className="text-purple-300">
                                {node.stats.uniqueReaders.toLocaleString('tr-TR')} ({viewsPerUnique}x)
                              </strong>
                            </div>
                            <div className="bg-slate-950 px-2 py-1 rounded-xs border border-slate-800 flex items-center justify-between">
                              <span className="text-slate-400">Simülatör:</span>
                              <strong className="text-sky-300">
                                {node.stats.simulatorRuns.toLocaleString('tr-TR')}
                              </strong>
                            </div>
                            <div className="bg-slate-950 px-2 py-1 rounded-xs border border-slate-800 flex items-center justify-between">
                              <span className="text-slate-400">Taban / 48s:</span>
                              <strong className="text-slate-200">
                                {node.stats.baseReads.toLocaleString('tr-TR')} / +{node.stats.recent48hReads}
                              </strong>
                            </div>
                            <div className="bg-slate-950 px-2 py-1 rounded-xs border border-slate-800 flex items-center justify-between">
                              <span className="text-slate-400">Makale / Gecikme:</span>
                              <strong className="text-emerald-300">
                                {Math.max(activeArticles.length, node.articlesCount)} · {node.stats.syncLatencyMs}ms
                              </strong>
                            </div>
                          </div>

                          <div className="border border-slate-800 bg-slate-950/90 rounded-xs p-2 space-y-1.5">
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedNodePubs((prev) => ({
                                  ...prev,
                                  [node.id]: !prev[node.id],
                                }))
                              }
                              className="w-full flex items-center justify-between text-[10px] font-bold text-cyan-300 hover:text-cyan-200 cursor-pointer"
                            >
                              <span>
                                Bu Düğümde Senkron Tüm Makaleler ({activeArticles.length} / {activeArticles.length} Makale · %100 Tam Senkron)
                              </span>
                              {isPubsExpanded ? (
                                <ChevronUp className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5" />
                              )}
                            </button>
                            {isPubsExpanded && (
                              <div className="space-y-1.5 pt-1.5 border-t border-slate-800">
                                {isGitHubNode && githubNodeMeta?.repos && githubNodeMeta.repos.length > 0 && (
                                  <div className="bg-violet-950/40 border border-violet-500/40 p-2 rounded-xs space-y-1">
                                    <div className="text-[9px] text-violet-200 font-bold uppercase">
                                      Canlı GitHub 33EmrePelit33 Depoları ({githubNodeMeta.publicRepos} Repo · {githubNodeMeta.liveFetched ? 'Canlı API' : 'Önbellek'})
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                      {githubNodeMeta.repos.slice(0, 10).map((repo) => (
                                        <a
                                          key={repo.url}
                                          href={repo.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="px-1.5 py-0.5 bg-slate-900 hover:bg-violet-900 border border-violet-500/40 text-violet-200 text-[9px] rounded-xs inline-flex items-center gap-1"
                                        >
                                          <span>{repo.name}</span>
                                          <ExternalLink className="w-2.5 h-2.5" />
                                        </a>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                <div className="flex items-center gap-1.5">
                                  <div className="relative flex-1">
                                    <Search className="w-3 h-3 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
                                    <input
                                      type="text"
                                      value={nodeArticleSearch[node.id] || ''}
                                      onChange={(e) =>
                                        setNodeArticleSearch((prev) => ({
                                          ...prev,
                                          [node.id]: e.target.value,
                                        }))
                                      }
                                      placeholder={`#${node.rank} düğümündeki ${activeArticles.length} makalede ara...`}
                                      className="w-full pl-6 pr-2 py-1 bg-slate-900 border border-slate-700 text-slate-100 rounded-xs text-[10px] focus:outline-none focus:border-cyan-400"
                                    />
                                  </div>
                                  {nodeSyncedArticles.length > 30 && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setNodeArticleShowAll((prev) => ({
                                          ...prev,
                                          [node.id]: !prev[node.id],
                                        }))
                                      }
                                      className="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-emerald-500/50 text-emerald-300 text-[9px] font-bold rounded-xs shrink-0 cursor-pointer"
                                    >
                                      {showAllForNode
                                        ? 'İlk 30 Göster'
                                        : `Tümünü Göster (${nodeSyncedArticles.length})`}
                                    </button>
                                  )}
                                </div>

                                <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
                                  {displayedNodeArticles.map((art, artIdx) => {
                                    const artTitle =
                                      art.title[language] || art.title.tr || art.title.en || art.id;
                                    const serialNum = activeArticles.indexOf(art) + 1;
                                    return (
                                      <div
                                        key={`${node.id}-art-${art.id}-${artIdx}`}
                                        className="flex items-center justify-between gap-2 bg-slate-900/90 border border-slate-800 px-2 py-1 rounded-xs text-[10px]"
                                      >
                                        <button
                                          type="button"
                                          onClick={() =>
                                            onSelectArticleFromBacklink(art.id, node.domain)
                                          }
                                          className="text-left text-emerald-300 hover:underline font-semibold truncate cursor-pointer"
                                          title={`#${serialNum} ${artTitle} (${node.domain} → emrepelit-sciphi.ai.studio)`}
                                        >
                                          <span className="text-amber-300 mr-1">#{serialNum}</span>
                                          {artTitle}
                                        </button>
                                        <span className="text-[9px] text-slate-400 shrink-0 tabular-nums">
                                          {art.originNodeDomain === node.domain ? (
                                            <span className="text-violet-300 font-bold mr-1">[KAYNAK]</span>
                                          ) : null}
                                          {art.publishedAt} · HTTP {node.httpCode}
                                        </span>
                                      </div>
                                    );
                                  })}
                                  {displayedNodeArticles.length === 0 && (
                                    <div className="text-[10px] text-slate-400 text-center py-2">
                                      Aramanızla eşleşen makale bulunamadı.
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="pt-1.5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[9px] text-emerald-400">
                          <span>✓ {node.tlsProtocol} · WAF · Monotonik Kilit (Azaltılamaz)</span>
                          <span>
                            Hedef: {node.redirectTargetUrl.replace('https://', '')} ·{' '}
                            {m?.lastMeasuredAt ? m.lastMeasuredAt.slice(0, 19) : 'Canlı Senkron'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ResearchGate Academic Profile 301 Bridge Status Card */}
                <div className="bg-slate-950 border border-emerald-500/60 p-3 rounded-xs flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 font-bold rounded-xs text-[10px]">
                      AKADEMİK PROFİL HTTP 301 KÖPRÜSÜ
                    </span>
                    <span className="text-slate-200 font-bold">
                      ResearchGate: Emre Pelit (Enstrümantasyon, Optik, Kalite Güvence, Astronomi &amp; Astrofizik)
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-[10px]">
                    <span className="text-cyan-300">
                      Yerel Uçlar: <code>/researchgate</code> &amp; <code>/301/researchgate</code> → HTTP 301 Ana Hub (+1 Görüntülenme Oto-Senkron)
                    </span>
                    <a
                      href="https://www.researchgate.net/profile/Emre-Pelit"
                      target="_blank"
                      rel="me noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-950 hover:bg-emerald-900 border border-emerald-400/60 text-emerald-200 font-bold rounded-xs"
                    >
                      <span>researchgate.net/profile/Emre-Pelit</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Collapsible Arithmetic Reconciliation Equations & Zero-Trust Seal */}
            {showReconciliationDetails && (
              <div className="bg-slate-900/95 border border-emerald-400/70 p-4 rounded-xs space-y-3 font-mono text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                  <span className="text-emerald-300 font-bold uppercase text-[11px]">
                    ✓ CANLI DİNAMİK ARİTMETİK MUTABAKAT &amp; ZERO-TRUST GÜVENLİK ({securitySealState.batchToken})
                  </span>
                  <span className="text-[10px] text-amber-300 font-bold">
                    {cumulativeBreakdown.live2.count} Canlı Düğüm (Hub + Blogger + GitHub 33EmrePelit33) + {cumulativeBreakdown.retired8.count} Senkron 301 Korumalı · {activeArticles.length} Makale
                  </span>
                </div>
                <div className="space-y-1.5">
                  <div className="bg-slate-950 border border-cyan-500/40 px-3 py-2 rounded-xs text-[11px] text-cyan-200 leading-relaxed break-words">
                    <strong className="text-cyan-400">CANLI GÖRÜNTÜLENME DENKLEMİ:</strong>{' '}
                    {liveViewsArithmeticEquation}
                  </div>
                  <div className="bg-slate-950 border border-slate-800 px-3 py-2 rounded-xs text-[11px] text-amber-200 leading-relaxed break-words">
                    <strong className="text-amber-400">CANLI NET OKUNMA DENKLEMİ:</strong>{' '}
                    {liveArithmeticEquation}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[10px]">
                  {GROK_ME_RECONCILED_3_MONOGRAPHS.map((mono) => (
                    <div
                      key={mono.id}
                      className="bg-slate-950 border border-slate-800 p-2 rounded-xs space-y-0.5"
                    >
                      <div className="flex items-center justify-between text-emerald-400 font-bold">
                        <span>{mono.monographCode}</span>
                        <span>Arşiv: {mono.monographCode}</span>
                      </div>
                      <div className="text-slate-200 font-semibold truncate" title={mono.title}>
                        {mono.title}
                      </div>
                      <div className="text-slate-400 text-[9px]">{mono.reconciliationNote}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: 316+ ARTICLES, READING TIME LEADERBOARD & GLOBAL GEOGRAPHY */}
        {activeHubTab === 'articles-geo' && (
          <div className="space-y-5">
            {/* Full Interactive World Map & Regional Reads/Views Table */}
            <WorldAnalyticsMap
              regionTotals={articleCumulativeData.regionTotals}
              countryTotals={articleCumulativeData.countryTotals}
              totalReads={articleCumulativeData.totalReads}
              totalViews={articleCumulativeData.totalViews}
            />

            {/* Site-Wide Cumulative Geographical Breakdown Summary (5 Continents/Regions + 12 Countries) */}
            <div className="bg-slate-950/95 border border-emerald-500/50 p-4 rounded-xs space-y-3 font-mono text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2 text-emerald-300 font-bold uppercase text-[11px]">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span>
                    5 ANA COĞRAFYA &amp; 12 ÜLKE BAZLI KÜMÜLATİF OKUNMA VE GÖRÜNTÜLENME DAĞILIMI
                  </span>
                </div>
                <span className="text-[10px] text-amber-300 tabular-nums">
                  Toplam: {articleCumulativeData.totalReads.toLocaleString('tr-TR')} Okunma ·{' '}
                  {articleCumulativeData.totalViews.toLocaleString('tr-TR')} Görüntülenme (%100 Mutabakat)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                <div className="bg-slate-900 border border-emerald-500/60 p-3 rounded-xs space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-emerald-300 font-bold">
                    <span>1. TÜRKİYE (TR)</span>
                    <span className="px-1.5 py-0.5 bg-emerald-950 border border-emerald-500/40 rounded-xs">
                      %{((articleCumulativeData.regionTotals.tr.reads / Math.max(1, articleCumulativeData.totalReads)) * 100).toFixed(1)}
                    </span>
                  </div>
                  <div className="text-amber-300 font-extrabold text-sm tabular-nums">
                    {articleCumulativeData.regionTotals.tr.reads.toLocaleString('tr-TR')} Okunma
                  </div>
                  <div className="text-cyan-300 font-bold text-xs tabular-nums">
                    {articleCumulativeData.regionTotals.tr.views.toLocaleString('tr-TR')} Görüntülenme
                  </div>
                </div>

                <div className="bg-slate-900 border border-sky-500/60 p-3 rounded-xs space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-sky-300 font-bold">
                    <span>2. AVRUPA (AB, BK &amp; İSV.)</span>
                    <span className="px-1.5 py-0.5 bg-sky-950 border border-sky-500/40 rounded-xs">
                      %{((articleCumulativeData.regionTotals.eu.reads / Math.max(1, articleCumulativeData.totalReads)) * 100).toFixed(1)}
                    </span>
                  </div>
                  <div className="text-amber-300 font-extrabold text-sm tabular-nums">
                    {articleCumulativeData.regionTotals.eu.reads.toLocaleString('tr-TR')} Okunma
                  </div>
                  <div className="text-cyan-300 font-bold text-xs tabular-nums">
                    {articleCumulativeData.regionTotals.eu.views.toLocaleString('tr-TR')} Görüntülenme
                  </div>
                </div>

                <div className="bg-slate-900 border border-amber-500/60 p-3 rounded-xs space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-amber-300 font-bold">
                    <span>3. AMERİKA (ABD &amp; KAN.)</span>
                    <span className="px-1.5 py-0.5 bg-amber-950 border border-amber-500/40 rounded-xs">
                      %{((articleCumulativeData.regionTotals.amer.reads / Math.max(1, articleCumulativeData.totalReads)) * 100).toFixed(1)}
                    </span>
                  </div>
                  <div className="text-amber-300 font-extrabold text-sm tabular-nums">
                    {articleCumulativeData.regionTotals.amer.reads.toLocaleString('tr-TR')} Okunma
                  </div>
                  <div className="text-cyan-300 font-bold text-xs tabular-nums">
                    {articleCumulativeData.regionTotals.amer.views.toLocaleString('tr-TR')} Görüntülenme
                  </div>
                </div>

                <div className="bg-slate-900 border border-purple-500/60 p-3 rounded-xs space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-purple-300 font-bold">
                    <span>4. ASYA-PASİFİK &amp; T.D.</span>
                    <span className="px-1.5 py-0.5 bg-purple-950 border border-purple-500/40 rounded-xs">
                      %{((articleCumulativeData.regionTotals.asia.reads / Math.max(1, articleCumulativeData.totalReads)) * 100).toFixed(1)}
                    </span>
                  </div>
                  <div className="text-amber-300 font-extrabold text-sm tabular-nums">
                    {articleCumulativeData.regionTotals.asia.reads.toLocaleString('tr-TR')} Okunma
                  </div>
                  <div className="text-cyan-300 font-bold text-xs tabular-nums">
                    {articleCumulativeData.regionTotals.asia.views.toLocaleString('tr-TR')} Görüntülenme
                  </div>
                </div>

                <div className="bg-slate-900 border border-rose-500/60 p-3 rounded-xs space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-rose-300 font-bold">
                    <span>5. ORTA DOĞU &amp; DİĞER</span>
                    <span className="px-1.5 py-0.5 bg-rose-950 border border-rose-500/40 rounded-xs">
                      %{((articleCumulativeData.regionTotals.menaOther.reads / Math.max(1, articleCumulativeData.totalReads)) * 100).toFixed(1)}
                    </span>
                  </div>
                  <div className="text-amber-300 font-extrabold text-sm tabular-nums">
                    {articleCumulativeData.regionTotals.menaOther.reads.toLocaleString('tr-TR')} Okunma
                  </div>
                  <div className="text-cyan-300 font-bold text-xs tabular-nums">
                    {articleCumulativeData.regionTotals.menaOther.views.toLocaleString('tr-TR')} Görüntülenme
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[10px]">
                {articleCumulativeData.countryTotals.map((c) => (
                  <div
                    key={c.code}
                    className="bg-slate-900/90 border border-slate-800 px-2.5 py-2 rounded-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-1 font-bold text-slate-200 border-b border-slate-800 pb-1">
                      <span className="truncate">{c.countryName}</span>
                      <span className="text-emerald-400 shrink-0">%{c.sharePct}</span>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] tabular-nums">
                      <span className="text-amber-300 font-bold">
                        {c.reads.toLocaleString('tr-TR')} Ok. · {c.views.toLocaleString('tr-TR')} Göst.
                      </span>
                      <span className="text-emerald-300 font-bold">
                        Akad: {c.academicReads.toLocaleString('tr-TR')} / {c.academicViews.toLocaleString('tr-TR')}
                      </span>
                    </div>
                    <div className="space-y-1 pt-0.5">
                      {c.academicCenters.map((center) => (
                        <div
                          key={center.id}
                          className="flex items-start justify-between gap-1.5 text-[9px] text-slate-200 tabular-nums"
                          title={`${center.name} (${center.city})`}
                        >
                          <span className="leading-snug">{center.name}</span>
                          <span className="shrink-0 text-right whitespace-nowrap">
                            <strong className="text-emerald-300">{center.reads.toLocaleString('tr-TR')} ok.</strong>
                            <span className="text-slate-500"> · </span>
                            <strong className="text-cyan-300">{center.views.toLocaleString('tr-TR')} göst.</strong>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Corpus-Wide Silicon Valley & 6 Major Global Industrial Ecosystems (All 11 301 Nodes Combined) */}
              <div className="pt-3 border-t border-slate-800 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sky-300 font-bold text-xs flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-amber-300" />
                    <span>
                      SİLİKON VADİSİ &amp; 6 BÜYÜK SANAYİ EKOSİSTEMİ — KURULUŞ BAZLI KÜMÜLATİF OKUNMA &amp; GÖSTERİMLER ({strictNodes.length} DÜĞÜM × {activeArticles.length} MAKALE)
                    </span>
                  </div>
                  <div className="text-[11px] font-mono tabular-nums text-amber-300 font-bold">
                    Σ {articleCumulativeData.totalIndustrialReads.toLocaleString('tr-TR')} Ok. / {articleCumulativeData.totalIndustrialViews.toLocaleString('tr-TR')} Göst. (Silikon Vadisi: {articleCumulativeData.totalSiliconValleyReads.toLocaleString('tr-TR')} ok. · {articleCumulativeData.totalSiliconValleyViews.toLocaleString('tr-TR')} göst.)
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {articleCumulativeData.industrialEcosystemTotals.map((eco) => {
                    const isSV = eco.id === 'silicon-valley';
                    return (
                      <div
                        key={`corpus-eco-${eco.id}`}
                        className={`p-3 rounded-xs border space-y-1.5 ${
                          isSV
                            ? 'bg-slate-900 border-amber-400/75'
                            : 'bg-slate-900/90 border-slate-800'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-1.5">
                          <div>
                            <div className={`font-bold text-[11px] ${isSV ? 'text-amber-300' : 'text-sky-200'}`}>
                              {eco.name}
                            </div>
                            <div className="text-[9px] text-slate-400">{eco.regionLabel}</div>
                          </div>
                          <div className="text-right tabular-nums shrink-0">
                            <div className="text-[11px] font-extrabold text-amber-300">
                              {eco.reads.toLocaleString('tr-TR')} ok.
                            </div>
                            <div className="text-[10px] font-bold text-cyan-300">
                              {eco.views.toLocaleString('tr-TR')} göst.
                            </div>
                            <div className="text-[9px] text-slate-400">
                              Sanayi %{eco.shareOfIndustrialPct}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1 text-[10px] tabular-nums">
                          {eco.organizations.map((org) => (
                            <div
                              key={`corpus-org-${org.id}`}
                              className="flex items-start justify-between gap-2 bg-slate-950/80 border border-slate-800/80 px-2 py-1 rounded-xs"
                            >
                              <div className="min-w-0">
                                <div className="font-semibold text-slate-100 leading-snug">{org.name}</div>
                                <div className="text-[9px] text-slate-400 leading-snug">{org.sector}</div>
                              </div>
                              <div className="text-right shrink-0 whitespace-nowrap">
                                <div className="text-sky-300 font-extrabold">
                                  {org.reads.toLocaleString('tr-TR')} ok.
                                </div>
                                <div className="text-[9px] text-cyan-300 font-bold">
                                  {org.views.toLocaleString('tr-TR')} göst.
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Average Reading Time Ranking (Highest -> Lowest) */}
            <div
              id="analytics-avg-reading-ranking"
              className="bg-slate-950/95 border-2 border-cyan-400/80 p-4 rounded-xs space-y-3 font-mono text-xs"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-cyan-400 text-slate-950 font-extrabold text-[10px] rounded-xs uppercase">
                      <ArrowDownWideNarrow className="w-3.5 h-3.5" />
                      <span>ORTALAMA OKUMA SÜRESİ SIRALAMASI (EN FAZLA → EN AZ)</span>
                    </span>
                    <span className="text-emerald-400 font-bold text-[11px]">
                      {activeArticles.length} Metin · Tüm {strictNodes.length} Düğümde %100 Tam Senkron (3 Canlı + 8 HTTP 301)
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                  {[15, 50, 100, activeArticles.length].map((lim) => (
                    <button
                      key={lim}
                      type="button"
                      onClick={() => setAvgReadLeaderboardLimit(lim)}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-xs border cursor-pointer transition-colors ${
                        avgReadLeaderboardLimit === lim
                          ? 'bg-cyan-400 text-slate-950 border-cyan-300'
                          : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      {lim >= activeArticles.length ? `Tümü (${activeArticles.length})` : `İlk ${lim}`}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setArticleSortBy('avg_read_time_desc');
                      setArticleCurrentPage(1);
                      document.getElementById('analytics-article-table')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-2.5 py-1 text-[10px] font-extrabold bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xs cursor-pointer transition-colors"
                  >
                    Tam Tabloda Sırala ↓
                  </button>
                </div>
              </div>

              {articleCumulativeData.articlesSortedByAvgReadingTimeDesc.length > 0 && (() => {
                const sorted = articleCumulativeData.articlesSortedByAvgReadingTimeDesc;
                const longest = sorted[0];
                const shortest = sorted[sorted.length - 1];
                const maxSecs = Math.max(1, longest.averageReadingSeconds);
                return (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      <div className="bg-slate-900 border border-emerald-400/70 p-2.5 rounded-xs flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-[10px] text-emerald-300 font-bold uppercase">
                            #1 EN YÜKSEK ORTALAMA OKUMA SÜRELİ METİN
                          </div>
                          <div className="text-xs font-bold text-white truncate">{longest.title}</div>
                          <div className="text-[10px] text-slate-400">
                            {longest.wordCount.toLocaleString('tr-TR')} kelime · {longest.category}
                          </div>
                        </div>
                        <span className="px-2.5 py-1 bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xs shrink-0 tabular-nums">
                          {longest.averageReadingFormatted}
                        </span>
                      </div>

                      <div className="bg-slate-900 border border-amber-400/60 p-2.5 rounded-xs flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-[10px] text-amber-300 font-bold uppercase">
                            #{sorted.length} EN KISA ORTALAMA OKUMA SÜRELİ METİN
                          </div>
                          <div className="text-xs font-bold text-white truncate">{shortest.title}</div>
                          <div className="text-[10px] text-slate-400">
                            {shortest.wordCount.toLocaleString('tr-TR')} kelime · {shortest.category}
                          </div>
                        </div>
                        <span className="px-2.5 py-1 bg-amber-300 text-slate-950 font-extrabold text-xs rounded-xs shrink-0 tabular-nums">
                          {shortest.averageReadingFormatted}
                        </span>
                      </div>
                    </div>

                    <div className="max-h-64 overflow-y-auto border border-slate-800 rounded-xs divide-y divide-slate-800/80">
                      {sorted.slice(0, avgReadLeaderboardLimit).map((item, sIdx) => {
                        const pctWidth = Math.max(8, Math.round((item.averageReadingSeconds / maxSecs) * 100));
                        return (
                          <div
                            key={`avg-rank-${item.articleId}`}
                            className="p-2.5 hover:bg-slate-900/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-colors"
                          >
                            <div className="flex items-start gap-2.5 min-w-0 flex-1">
                              <span
                                className={`px-2 py-0.5 text-[10px] font-extrabold rounded-xs shrink-0 tabular-nums ${
                                  sIdx < 3
                                    ? 'bg-amber-400 text-slate-950'
                                    : 'bg-slate-800 text-cyan-300'
                                }`}
                              >
                                #{sIdx + 1}
                              </span>
                              <div className="min-w-0 flex-1 space-y-1">
                                <div className="font-bold text-white text-[11px] truncate" title={item.title}>
                                  {item.title}
                                </div>
                                <div className="flex flex-wrap items-center gap-2 text-[9px] text-slate-400">
                                  <span className="text-emerald-400">{item.category}</span>
                                  <span>·</span>
                                  <span>{item.wordCount.toLocaleString('tr-TR')} kelime</span>
                                  <span>·</span>
                                  <span>Toplam: {item.totalReadingFormatted}</span>
                                  <span>·</span>
                                  <span>{item.views.toLocaleString('tr-TR')} Görüntülenme</span>
                                </div>
                                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                                  <div className="h-full bg-cyan-400" style={{ width: `${pctWidth}%` }} />
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className="px-2.5 py-1 bg-cyan-950 border border-cyan-400/70 text-cyan-200 font-extrabold text-[11px] rounded-xs tabular-nums">
                                ⏱ {item.averageReadingFormatted}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  onSelectArticleFromBacklink(item.articleId, 'emrepelit-sciphi.ai.studio');
                                  setAnalyticsModalOpen(false);
                                }}
                                className="px-2 py-1 bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/60 text-emerald-300 font-bold text-[10px] rounded-xs cursor-pointer"
                              >
                                Aç
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Article-By-Article Cumulative Table */}
            <div
              id="analytics-article-table"
              className="bg-slate-950/95 border border-amber-400/70 p-4 rounded-xs space-y-3 font-mono text-xs"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-amber-400 text-slate-950 font-extrabold text-[10px] rounded-xs uppercase">
                      MAKALE MAKALE KÜMÜLATİF İSTATİSTİKLER &amp; GENİŞ ÖZET VİDEO (12 DİL) İZLENME TABLOSU ({activeArticles.length} MAKALE · 10 SİTEDE YAYINDA)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Tüm {activeArticles.length} makalenin kümülatif görüntülenme (<strong>{articleCumulativeData.totalViews.toLocaleString('tr-TR')}</strong>), okunma (<strong>{articleCumulativeData.totalReads.toLocaleString('tr-TR')}</strong>), geniş özet video izlenme (<strong>{articleCumulativeData.totalVideoPlaysAllArticles.toLocaleString('tr-TR')} oynatma · {Math.floor(articleCumulativeData.totalVideoWatchSecondsAllArticles / 60).toLocaleString('tr-TR')} dk {String(articleCumulativeData.totalVideoWatchSecondsAllArticles % 60).padStart(2, '0')} sn</strong>), okuma süresi (<strong>{cumulative.readingHours.toLocaleString('tr-TR')} sa {cumulative.readingMins} dk</strong>) ve atıf toplamları ana panelle %100 birebir senkrondur.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setArticlePageSize(articlePageSize >= activeArticles.length ? 25 : activeArticles.length)
                  }
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-[11px] rounded-xs cursor-pointer transition-colors shrink-0"
                >
                  {articlePageSize >= activeArticles.length
                    ? 'Sayfalı Görünüme Dön (25/Sayfa)'
                    : `Tüm ${activeArticles.length} Makaleyi Göster`}
                </button>
              </div>

              {/* Per-Article Comprehensive Summary Video Watch Live Summary Strip */}
              <div className="bg-slate-900/90 border border-teal-500/50 p-3 rounded-xs space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                  <span className="inline-flex items-center gap-1.5 text-teal-300 font-extrabold uppercase">
                    <Film className="w-3.5 h-3.5" />
                    <span>Her Makalenin Geniş Özet Video İzlenme Ölçümü (12 Dil · Canlı SSE Senkron)</span>
                  </span>
                  <div className="flex flex-wrap items-center gap-2 text-[10px] tabular-nums">
                    <span className="px-2 py-0.5 bg-teal-950 border border-teal-500/50 text-teal-200 rounded-xs font-bold">
                      Toplam Oynatma: {articleCumulativeData.totalVideoPlaysAllArticles.toLocaleString('tr-TR')}
                    </span>
                    <span className="px-2 py-0.5 bg-cyan-950 border border-cyan-500/50 text-cyan-200 rounded-xs font-bold">
                      Toplam İzlenme Süresi: {Math.floor(articleCumulativeData.totalVideoWatchSecondsAllArticles / 60).toLocaleString('tr-TR')} dk{' '}
                      {String(articleCumulativeData.totalVideoWatchSecondsAllArticles % 60).padStart(2, '0')} sn
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-950 border border-emerald-500/50 text-emerald-300 rounded-xs font-bold">
                      İzlenen Makale: {articleCumulativeData.articlesWithVideoWatches} / {activeArticles.length}
                    </span>
                  </div>
                </div>
                {articleCumulativeData.topWatchedVideoArticles.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {articleCumulativeData.topWatchedVideoArticles.map((vRow) => (
                      <div
                        key={`top-vid-${vRow.articleId}`}
                        className="bg-slate-950 border border-teal-500/30 px-2.5 py-2 rounded-xs flex items-center justify-between gap-2 text-[10px]"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="text-white font-bold truncate" title={vRow.title}>
                            #{vRow.rank} {vRow.title}
                          </div>
                          <div className="w-full h-1.5 bg-slate-800 rounded-xs overflow-hidden mt-1">
                            <div
                              className="h-full bg-teal-400"
                              style={{ width: `${Math.max(4, vRow.videoWatchPercent)}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-right shrink-0 tabular-nums">
                          <div className="text-teal-300 font-extrabold">
                            {vRow.videoPlays} izlenme · {vRow.videoWatchFormatted}
                          </div>
                          <div className="text-slate-400">
                            %{vRow.videoWatchPercent} /{' '}
                            {`${String(Math.floor((vRow.videoDurationSec || 420) / 60)).padStart(2, '0')}:${String(
                              Math.floor((vRow.videoDurationSec || 420) % 60)
                            ).padStart(2, '0')}`}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-400">
                    Herhangi bir makalenin süre kısıtsız 12 dilli sentetik sesli geniş özet videosu oynatıldığında oynatma sayısı, gerçek izlenme süresi (sn/dk) ve konuşmacı-senkron tamamlama yüzdesi burada ve aşağıdaki tabloda anlık olarak güncellenir.
                  </p>
                )}
              </div>

              {/* Filter, Search, Sort & Pagination Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5 items-end">
                <div className="lg:col-span-4">
                  <label className="block text-[10px] text-slate-400 mb-1">
                    MAKALE BAŞLIĞI, SIRA NO (#1-#{Math.max(316, activeArticles.length)}) VEYA ARŞİV KODU ARA
                  </label>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                    <input
                      type="text"
                      value={articleSearchQuery}
                      onChange={(e) => {
                        setArticleSearchQuery(e.target.value);
                        setArticleCurrentPage(1);
                      }}
                      placeholder="Makale adı, #12, arşiv kodu ara..."
                      className="w-full pl-8 pr-2.5 py-1.5 bg-slate-900 border border-slate-700 text-white rounded-xs text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="lg:col-span-3">
                  <label className="block text-[10px] text-slate-400 mb-1">KATEGORİ FİLTRESİ</label>
                  <select
                    value={articleCategoryFilter}
                    onChange={(e) => {
                      setArticleCategoryFilter(e.target.value);
                      setArticleCurrentPage(1);
                    }}
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 text-white rounded-xs text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value="ALL">Tüm Kategoriler ({activeArticles.length} Makale)</option>
                    {categoriesList.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="lg:col-span-3">
                  <label className="block text-[10px] text-slate-400 mb-1">SIRALAMA</label>
                  <select
                    value={articleSortBy}
                    onChange={(e) => setArticleSortBy(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 text-amber-300 font-bold rounded-xs text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value="reads_desc">En Çok Okunan Makaleler — Global 11 Düğüm (Azalan)</option>
                    <option value="academic_desc">En Çok Akademik Merkez Okunması Alanlar</option>
                    <option value="silicon_valley_desc">En Çok Silikon Vadisi Okunması Alanlar</option>
                    <option value="industrial_desc">En Çok Küresel Sanayi Okunması Alanlar</option>
                    <option value="views_desc">En Çok Görüntülenen Makaleler (Azalan)</option>
                    <option value="video_watch_desc">Geniş Özet Video İzlenme Süresi (En Fazladan En Aza)</option>
                    <option value="video_plays_desc">En Çok Video İzlenen Makaleler (Oynatma Sayısı)</option>
                    <option value="video_completion_desc">Video Tamamlama Oranı (%)</option>
                    <option value="avg_read_time_desc">Ortalama Okuma Süresi (En Fazladan En Aza)</option>
                    <option value="total_read_time_desc">Toplam Okuma Zamanı (Azalan)</option>
                    <option value="avg_read_time_asc">Ortalama Okuma Süresi (En Azdan En Fazlaya)</option>
                    <option value="citations_desc">En Çok Akademik Atıf Alanlar</option>
                    <option value="tr_desc">Türkiye Okunmasına Göre</option>
                    <option value="eu_desc">Avrupa Okunmasına Göre</option>
                    <option value="amer_desc">Amerika Okunmasına Göre</option>
                    <option value="rank_asc">Sıra Numarasına Göre (#1 → #{Math.max(320, activeArticles.length)})</option>
                  </select>
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-[10px] text-slate-400 mb-1">SAYFA BOYUTU</label>
                  <select
                    value={articlePageSize}
                    onChange={(e) => {
                      setArticlePageSize(Number(e.target.value));
                      setArticleCurrentPage(1);
                    }}
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 text-emerald-300 font-bold rounded-xs text-xs focus:outline-none focus:border-emerald-400"
                  >
                    <option value={25}>25 Makale / Sayfa</option>
                    <option value={50}>50 Makale / Sayfa</option>
                    <option value={100}>100 Makale / Sayfa</option>
                    <option value={activeArticles.length}>Tümü ({activeArticles.length} Makale)</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-800 rounded-xs">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-slate-900 text-slate-300 border-b border-slate-700 uppercase text-[10px]">
                      <th className="py-2.5 px-2.5 font-bold">#</th>
                      <th className="py-2.5 px-2.5 font-bold min-w-[220px]">Makale Başlığı &amp; Arşiv No</th>
                      <th className="py-2.5 px-2.5 font-bold text-right text-amber-300">Global Okunma (11 Düğüm)</th>
                      <th className="py-2.5 px-2.5 font-bold text-right text-emerald-300 min-w-[145px]">Akademik / Sanayi / SV</th>
                      <th className="py-2.5 px-2.5 font-bold text-right text-cyan-200">Ort. Okuma &amp; Toplam</th>
                      <th className="py-2.5 px-2.5 font-bold text-right text-teal-300 min-w-[130px]">Video İzlenme (12 Dil)</th>
                      <th className="py-2.5 px-2.5 font-bold text-right text-cyan-300">Görüntülenme</th>
                      <th className="py-2.5 px-2.5 font-bold text-right text-emerald-300">Atıf</th>
                      <th className="py-2.5 px-2.5 font-bold text-right text-emerald-200">Türkiye</th>
                      <th className="py-2.5 px-2.5 font-bold text-right text-sky-200">Avrupa</th>
                      <th className="py-2.5 px-2.5 font-bold text-right text-amber-200">Amerika</th>
                      <th className="py-2.5 px-2.5 font-bold text-right text-purple-200">Asya-P.</th>
                      <th className="py-2.5 px-2.5 font-bold text-right text-rose-200">Diğer</th>
                      <th className="py-2.5 px-2.5 font-bold text-center">Akademik · Sanayi · 11 Düğüm</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/90 tabular-nums">
                    {paginatedArticleRows.map((row) => {
                      const isExpanded = expandedArticleId === row.articleId;
                      return (
                        <React.Fragment key={row.articleId}>
                          <tr className="hover:bg-slate-900/80 transition-colors">
                            <td className="py-2 px-2.5 font-bold text-amber-400 whitespace-nowrap">
                              #{row.rank}
                            </td>
                            <td className="py-2 px-2.5">
                              <div className="font-bold text-white leading-snug line-clamp-2">{row.title}</div>
                              <div className="flex flex-wrap items-center gap-2 text-[9px] text-slate-400 mt-0.5">
                                <span className="text-emerald-400 font-semibold">{row.category}</span>
                                <span>·</span>
                                <span>SCIPHIL-#{row.rank}</span>
                                <span>·</span>
                                <span>{row.publishedAt}</span>
                              </div>
                            </td>
                            <td className="py-2 px-2.5 text-right whitespace-nowrap">
                              <div className="font-extrabold text-amber-300 text-xs">
                                {row.reads.toLocaleString('tr-TR')}
                              </div>
                              <div className="text-[9px] text-slate-400">
                                %{row.readSharePercent} · İzole ({row.readToViewRatePct}%)
                              </div>
                            </td>
                            <td className="py-2 px-2.5 text-left min-w-[270px] max-w-[340px]">
                              <div className="space-y-1 text-[9.5px] leading-snug">
                                <div className="text-emerald-300">
                                  <strong>Akademik:</strong>{' '}
                                  {row.topAcademicCenters[0] ? (
                                    <span className="text-emerald-100">
                                      {row.topAcademicCenters[0].name} ({row.topAcademicCenters[0].privacySafeReadLabel} ok. / {row.topAcademicCenters[0].privacySafeViewLabel} göst.)
                                    </span>
                                  ) : (
                                    <span>
                                      {row.academicTotalReads.toLocaleString('tr-TR')} ok. / {row.academicTotalViews.toLocaleString('tr-TR')} göst.
                                    </span>
                                  )}
                                </div>
                                <div className="text-amber-300">
                                  <strong>Silikon V.:</strong>{' '}
                                  {row.topSiliconValleyOrgs[0] ? (
                                    <span className="text-amber-100">
                                      {row.topSiliconValleyOrgs[0].name} ({row.topSiliconValleyOrgs[0].privacySafeReadLabel} ok. / {row.topSiliconValleyOrgs[0].privacySafeViewLabel} göst.)
                                    </span>
                                  ) : (
                                    <span>
                                      {row.siliconValleyReads.toLocaleString('tr-TR')} ok. / {row.siliconValleyViews.toLocaleString('tr-TR')} göst.
                                    </span>
                                  )}
                                </div>
                                <div className="text-sky-300">
                                  <strong>Sanayi:</strong>{' '}
                                  {row.topNonSvIndustrialOrgs[0] ? (
                                    <span className="text-sky-100">
                                      {row.topNonSvIndustrialOrgs[0].name} ({row.topNonSvIndustrialOrgs[0].privacySafeReadLabel} ok. / {row.topNonSvIndustrialOrgs[0].privacySafeViewLabel} göst.)
                                    </span>
                                  ) : (
                                    <span>
                                      {row.industrialTotalReads.toLocaleString('tr-TR')} ok. / {row.industrialTotalViews.toLocaleString('tr-TR')} göst.
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-2 px-2.5 text-right whitespace-nowrap">
                              <div className="font-extrabold text-cyan-200 text-xs">
                                {row.averageReadingFormatted}
                              </div>
                              <div className="text-[9px] text-amber-200">{row.totalReadingFormatted}</div>
                            </td>
                            <td className="py-2 px-2.5 text-right whitespace-nowrap">
                              <div className="font-extrabold text-teal-300 text-xs">
                                {row.videoPlays.toLocaleString('tr-TR')} izlenme
                              </div>
                              <div className="text-[9px] text-cyan-200">
                                {row.videoWatchFormatted} · %{row.videoWatchPercent}
                              </div>
                              <div className="w-full h-1 bg-slate-800 rounded-xs overflow-hidden mt-0.5">
                                <div
                                  className="h-full bg-teal-400 transition-all"
                                  style={{ width: `${row.videoWatchPercent}%` }}
                                />
                              </div>
                            </td>
                            <td className="py-2 px-2.5 text-right whitespace-nowrap">
                              <div className="font-extrabold text-cyan-300 text-xs">
                                {row.views.toLocaleString('tr-TR')}
                              </div>
                              <div className="text-[9px] text-slate-400">%{row.viewSharePercent}</div>
                            </td>
                            <td className="py-2 px-2.5 text-right whitespace-nowrap">
                              <span className="px-2 py-0.5 bg-emerald-950 border border-emerald-500/60 text-emerald-300 font-extrabold rounded-xs text-xs">
                                {row.citations.toLocaleString('tr-TR')} Atıf
                              </span>
                            </td>
                            <td className="py-2 px-2.5 text-right whitespace-nowrap text-emerald-300 font-bold">
                              {row.regions.tr.reads.toLocaleString('tr-TR')}
                            </td>
                            <td className="py-2 px-2.5 text-right whitespace-nowrap text-sky-300 font-bold">
                              {row.regions.eu.reads.toLocaleString('tr-TR')}
                            </td>
                            <td className="py-2 px-2.5 text-right whitespace-nowrap text-amber-200 font-bold">
                              {row.regions.amer.reads.toLocaleString('tr-TR')}
                            </td>
                            <td className="py-2 px-2.5 text-right whitespace-nowrap text-purple-300 font-bold">
                              {row.regions.asia.reads.toLocaleString('tr-TR')}
                            </td>
                            <td className="py-2 px-2.5 text-right whitespace-nowrap text-rose-300 font-bold">
                              {row.regions.menaOther.reads.toLocaleString('tr-TR')}
                            </td>
                            <td className="py-2 px-2.5 text-center whitespace-nowrap">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setExpandedArticleId(isExpanded ? null : row.articleId)}
                                  className="inline-flex items-center gap-1 px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-amber-400/60 text-amber-300 font-bold text-[10px] rounded-xs cursor-pointer"
                                >
                                  <MapPin className="w-3 h-3" />
                                  <span>Akademik &amp; Sanayi</span>
                                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    onSelectArticleFromBacklink(row.articleId, 'emrepelit-sciphi.ai.studio');
                                    setAnalyticsModalOpen(false);
                                  }}
                                  className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/60 text-emerald-300 font-bold text-[10px] rounded-xs cursor-pointer"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  <span>Aç</span>
                                </button>
                              </div>
                            </td>
                          </tr>

                          {isExpanded && (
                            <tr className="bg-slate-900/95 border-b border-amber-400/50">
                              <td colSpan={14} className="p-3.5">
                                <div className="space-y-3">
                                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                                    <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                                      <MapPin className="w-4 h-4 text-emerald-400" />
                                      <span>
                                        MAKALE #{row.rank} İZOLE OKUNMA ({row.reads.toLocaleString('tr-TR')}) &amp; GÖRÜNTÜLENME ({row.views.toLocaleString('tr-TR')}) — AKADEMİK, SİLİKON VADİSİ, SANAYİ &amp; 11 DÜĞÜM — {row.title}
                                      </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (!kvkkAnalyticsGranted) {
                                            setAnalyticsNotice(
                                              'KVKK (6698) & AB GDPR m.6(1)(a): Analitik açık rızası verilmeden yeni tarayıcı video izlenme ölçümü kaydedilmez. Rıza tercihlerinden analitiği etkinleştirebilirsiniz.'
                                            );
                                            return;
                                          }
                                          onRecordAnalyticsMeasurement?.(
                                            'emrepelit-sciphi.ai.studio',
                                            {
                                              viewsDelta: 1,
                                              videoPlaysDelta: 1,
                                              videoWatchSecondsDelta: 60,
                                              maxVideoPositionSec: Math.max(60, row.maxVideoPositionSec + 60),
                                              targetArticleId: row.articleId,
                                            },
                                            'VIDEO_PLAYER',
                                            `Canlı Geniş Özet Video İzlenme Ölçümü (Makale #${row.rank}): +1 Oynatma, +60 sn İzleme`,
                                            'VIDEO_WATCH'
                                          );
                                        }}
                                        className="px-2.5 py-1 bg-teal-400 hover:bg-teal-300 text-slate-950 font-extrabold text-[10px] rounded-xs cursor-pointer"
                                      >
                                        +1 Video İzlenme (+60 sn)
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (!kvkkAnalyticsGranted) {
                                            setAnalyticsNotice(
                                              'KVKK (6698) & AB GDPR m.6(1)(a): Analitik açık rızası verilmeden yeni tarayıcı ölçümü kaydedilmez. Çerez/Rıza tercihlerinden analitiği etkinleştirebilirsiniz.'
                                            );
                                            return;
                                          }
                                          if (onRecordAnalyticsMeasurement) {
                                            onRecordAnalyticsMeasurement(
                                              'emrepelit-sciphi.ai.studio',
                                              {
                                                viewsDelta: 1,
                                                readsDelta: 1,
                                                citationsDelta: 1,
                                                targetArticleId: row.articleId,
                                                readingMinutesDelta: 6,
                                                uniqueReadersDelta: 1,
                                              },
                                              'ANALYTICS_PANEL',
                                              `Canlı Senkron: Makale #${row.rank} (SCIPHIL-#${row.rank}) +1 Görüntülenme, +1 Okunma, +1 Atıf`
                                            );
                                          } else {
                                            setLocalArticleBoosts((prev) => {
                                              const cur = prev[row.articleId] || { reads: 0, views: 0, citations: 0 };
                                              const nextMap = {
                                                ...prev,
                                                [row.articleId]: {
                                                  ...cur,
                                                  reads: cur.reads + 1,
                                                  views: cur.views + 1,
                                                  citations: cur.citations + 1,
                                                },
                                              };
                                              if (kvkkAnalyticsGranted) {
                                                try {
                                                  window.localStorage.setItem('sciphil_article_boosts_v2', JSON.stringify(nextMap));
                                                } catch {}
                                              }
                                              return nextMap;
                                            });
                                            onIncrementArticleBoost?.(row.articleId);
                                          }
                                        }}
                                        className="px-2.5 py-1 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-[10px] rounded-xs cursor-pointer"
                                      >
                                        + Okunma/Atıf Kaydet
                                      </button>
                                    </div>
                                  </div>

                                  {/* 11-Node Readership Contribution Strip */}
                                  <div className="bg-slate-950 border border-amber-400/50 p-2.5 rounded-xs space-y-1.5">
                                    <div className="flex flex-wrap items-center justify-between gap-2 text-[10px]">
                                      <span className="text-amber-300 font-bold uppercase">
                                        1) 11 Düğüm (301 Ağı) Okunma Katkısı (Σ = {row.reads.toLocaleString('tr-TR')} Global Okunma)
                                      </span>
                                      <span className="text-emerald-300 font-bold">
                                        {row.academicTotalReads.toLocaleString('tr-TR')} Akademik + {row.industrialTotalReads.toLocaleString('tr-TR')} Sanayi + {row.independentGlobalReads.toLocaleString('tr-TR')} Bağımsız = {row.reads.toLocaleString('tr-TR')}
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 text-[10px] tabular-nums">
                                      {row.nodeBreakdown.map((ns) => (
                                        <div
                                          key={`${row.articleId}-tbl-node-${ns.domain}`}
                                          className={`flex items-center justify-between gap-1 px-2 py-1 rounded-xs border ${
                                            ns.isLive
                                              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-100'
                                              : 'bg-slate-900 border-slate-800 text-slate-300'
                                          }`}
                                        >
                                          <span className="truncate">#{ns.rank} {ns.domain}</span>
                                          <strong className="text-amber-300 shrink-0">{ns.reads.toLocaleString('tr-TR')}</strong>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* 12 Countries & Individual Academic Centers (KVKK / GDPR Recital 26 k >= 5 Anonymity) */}
                                  <div className="space-y-1.5">
                                    <div className="flex flex-wrap items-center justify-between gap-2 text-[10px]">
                                      <span className="font-bold text-emerald-300 uppercase">
                                        2) 12 Ülke &amp; 60 Akademik Kurum — Okunma &amp; Gösterim Dağılımı (Σ {row.academicTotalReads.toLocaleString('tr-TR')} Okunma · {row.academicTotalViews.toLocaleString('tr-TR')} Gösterim · k ≥ {PRIVACY_K_ANONYMITY_THRESHOLD})
                                      </span>
                                      <span className="text-slate-400">
                                        KVKK m.4 &amp; GDPR Recital 26: Sıfır Kişisel Veri / Küçük Hücre Maskelemesi Aktif
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                                      {row.countries.map((c) => (
                                        <div
                                          key={`${row.articleId}-${c.code}`}
                                          className="bg-slate-950 border border-slate-800 p-2.5 rounded-xs space-y-1.5"
                                        >
                                          <div className="flex items-center justify-between text-[11px] font-bold border-b border-slate-800 pb-1">
                                            <span className="text-white">{c.countryName}</span>
                                            <span className="px-1.5 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[9px] rounded-xs">
                                              %{c.sharePercent}
                                            </span>
                                          </div>
                                          <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] tabular-nums">
                                            <span className="text-amber-300 font-bold">
                                              {c.reads.toLocaleString('tr-TR')} Ok. · {c.views.toLocaleString('tr-TR')} Göst.
                                            </span>
                                            <span className="text-emerald-300 font-bold">
                                              Akad: {c.academicReads.toLocaleString('tr-TR')} / {c.academicViews.toLocaleString('tr-TR')}
                                            </span>
                                          </div>
                                          <div className="space-y-1 text-[9px] tabular-nums">
                                            {(c.academicCenters.some((ct) => ct.reads > 0 || ct.views > 0)
                                              ? c.academicCenters.filter((ct) => ct.reads > 0 || ct.views > 0)
                                              : c.academicCenters.slice(0, 2)
                                            ).map((center) => (
                                              <div
                                                key={`${row.articleId}-${center.id}`}
                                                className="flex items-start justify-between gap-1.5 text-slate-200"
                                                title={
                                                  center.isKAnonymityMasked || center.isViewsKAnonymityMasked
                                                    ? `KVKK & GDPR Recital 26 k-Anonimlik (k ≥ ${PRIVACY_K_ANONYMITY_THRESHOLD})`
                                                    : `${center.name} (${center.city})`
                                                }
                                              >
                                                <span className="leading-snug">{center.name}</span>
                                                <span className="shrink-0 whitespace-nowrap text-right">
                                                  <strong
                                                    className={
                                                      center.isKAnonymityMasked ? 'text-slate-400' : 'text-emerald-300'
                                                    }
                                                  >
                                                    {center.privacySafeReadLabel} ok.
                                                  </strong>
                                                  <span className="text-slate-500"> · </span>
                                                  <strong
                                                    className={
                                                      center.isViewsKAnonymityMasked ? 'text-slate-400' : 'text-cyan-300'
                                                    }
                                                  >
                                                    {center.privacySafeViewLabel} göst.
                                                  </strong>
                                                </span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Silicon Valley & 6 Global Industrial Ecosystems (KVKK / GDPR Recital 26 k >= 5 Anonymity) */}
                                  <div className="space-y-1.5">
                                    <div className="text-[10px] font-bold text-sky-300 uppercase">
                                      3) Silikon Vadisi &amp; 6 Büyük Sanayi Ekosistemi — Kuruluş Bazlı Okunma &amp; Gösterim Dağılımı (Σ {row.industrialTotalReads.toLocaleString('tr-TR')} Ok. · {row.industrialTotalViews.toLocaleString('tr-TR')} Göst. | Silikon Vadisi: {row.siliconValleyReads.toLocaleString('tr-TR')} ok. · {row.siliconValleyViews.toLocaleString('tr-TR')} göst. · k ≥ {PRIVACY_K_ANONYMITY_THRESHOLD})
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                      {row.industrialEcosystems.map((eco) => (
                                        <div
                                          key={`${row.articleId}-tbl-eco-${eco.id}`}
                                          className={`p-2.5 rounded-xs border space-y-1.5 ${
                                            eco.id === 'silicon-valley'
                                              ? 'bg-slate-950 border-amber-400/70'
                                              : 'bg-slate-950 border-slate-800'
                                          }`}
                                        >
                                          <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-1">
                                            <span className={`font-bold text-[10px] ${eco.id === 'silicon-valley' ? 'text-amber-300' : 'text-sky-200'}`}>
                                              {eco.name}
                                            </span>
                                            <span className="text-[10px] tabular-nums shrink-0 text-right whitespace-nowrap">
                                              <strong className="text-amber-300">{eco.reads.toLocaleString('tr-TR')} ok.</strong>
                                              <span className="text-slate-500"> · </span>
                                              <strong className="text-cyan-300">{eco.views.toLocaleString('tr-TR')} göst.</strong>
                                            </span>
                                          </div>
                                          <div className="space-y-1 text-[9px] tabular-nums">
                                            {(eco.organizations.some((o) => o.reads > 0 || o.views > 0)
                                              ? eco.organizations.filter((o) => o.reads > 0 || o.views > 0)
                                              : eco.organizations.slice(0, 2)
                                            ).map((org) => (
                                              <div
                                                key={`${row.articleId}-tbl-org-${org.id}`}
                                                className="flex items-start justify-between gap-1.5 text-slate-200"
                                                title={
                                                  org.isKAnonymityMasked || org.isViewsKAnonymityMasked
                                                    ? `KVKK & GDPR Recital 26 k-Anonimlik (k ≥ ${PRIVACY_K_ANONYMITY_THRESHOLD})`
                                                    : `${org.name} — ${org.sector} (${org.city})`
                                                }
                                              >
                                                <span className="leading-snug">{org.name}</span>
                                                <span className="shrink-0 whitespace-nowrap text-right">
                                                  <strong
                                                    className={
                                                      org.isKAnonymityMasked ? 'text-slate-400' : 'text-sky-300'
                                                    }
                                                  >
                                                    {org.privacySafeReadLabel} ok.
                                                  </strong>
                                                  <span className="text-slate-500"> · </span>
                                                  <strong
                                                    className={
                                                      org.isViewsKAnonymityMasked ? 'text-slate-400' : 'text-cyan-300'
                                                    }
                                                  >
                                                    {org.privacySafeViewLabel} göst.
                                                  </strong>
                                                </span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-950 border border-teal-500/40 p-2.5 rounded-xs text-[11px] tabular-nums">
                                    <div>
                                      <span className="text-[9px] text-slate-400 block uppercase">Video Oynatma</span>
                                      <strong className="text-teal-300">{row.videoPlays.toLocaleString('tr-TR')}</strong>
                                    </div>
                                    <div>
                                      <span className="text-[9px] text-slate-400 block uppercase">Toplam İzlenme Süresi</span>
                                      <strong className="text-cyan-200">{row.videoWatchFormatted}</strong>
                                    </div>
                                    <div>
                                      <span className="text-[9px] text-slate-400 block uppercase">10:00 Tamamlama Oranı</span>
                                      <strong className="text-emerald-300">%{row.videoWatchPercent}</strong>
                                    </div>
                                    <div>
                                      <span className="text-[9px] text-slate-400 block uppercase">Tam Biten İzleme</span>
                                      <strong className="text-amber-300">{row.videoCompletions.toLocaleString('tr-TR')}</strong>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>

                  <tfoot>
                    <tr className="bg-slate-900 border-t-2 border-amber-400 text-xs font-extrabold tabular-nums">
                      <td colSpan={2} className="py-3 px-2.5 text-amber-300">
                        Σ {activeArticles.length} MAKALE KÜMÜLATİF GENEL TOPLAMI (%100 EŞİT)
                      </td>
                      <td className="py-3 px-2.5 text-right text-amber-300">
                        {articleCumulativeData.totalReads.toLocaleString('tr-TR')}
                      </td>
                      <td className="py-3 px-2.5 text-left text-[10px]">
                        <div className="text-emerald-300">
                          Akademik: {articleCumulativeData.totalAcademicReads.toLocaleString('tr-TR')} ok. · {articleCumulativeData.totalAcademicViews.toLocaleString('tr-TR')} göst.
                        </div>
                        <div className="text-amber-200">
                          Silikon V.: {articleCumulativeData.totalSiliconValleyReads.toLocaleString('tr-TR')} ok. · {articleCumulativeData.totalSiliconValleyViews.toLocaleString('tr-TR')} göst.
                        </div>
                        <div className="text-sky-300">
                          Sanayi: {articleCumulativeData.totalIndustrialReads.toLocaleString('tr-TR')} ok. · {articleCumulativeData.totalIndustrialViews.toLocaleString('tr-TR')} göst.
                        </div>
                      </td>
                      <td className="py-3 px-2.5 text-right text-cyan-200">
                        Σ {cumulative.readingHours.toLocaleString('tr-TR')}s {cumulative.readingMins}d
                      </td>
                      <td className="py-3 px-2.5 text-right text-teal-300">
                        {articleCumulativeData.totalVideoPlaysAllArticles.toLocaleString('tr-TR')} ·{' '}
                        {Math.floor(articleCumulativeData.totalVideoWatchSecondsAllArticles / 60)} dk
                      </td>
                      <td className="py-3 px-2.5 text-right text-cyan-300">
                        {articleCumulativeData.totalViews.toLocaleString('tr-TR')}
                      </td>
                      <td className="py-3 px-2.5 text-right text-emerald-300">
                        {articleCumulativeData.totalCitations.toLocaleString('tr-TR')} Atıf
                      </td>
                      <td className="py-3 px-2.5 text-right text-emerald-200">
                        {articleCumulativeData.regionTotals.tr.reads.toLocaleString('tr-TR')}
                      </td>
                      <td className="py-3 px-2.5 text-right text-sky-200">
                        {articleCumulativeData.regionTotals.eu.reads.toLocaleString('tr-TR')}
                      </td>
                      <td className="py-3 px-2.5 text-right text-amber-200">
                        {articleCumulativeData.regionTotals.amer.reads.toLocaleString('tr-TR')}
                      </td>
                      <td className="py-3 px-2.5 text-right text-purple-200">
                        {articleCumulativeData.regionTotals.asia.reads.toLocaleString('tr-TR')}
                      </td>
                      <td className="py-3 px-2.5 text-right text-rose-200">
                        {articleCumulativeData.regionTotals.menaOther.reads.toLocaleString('tr-TR')}
                      </td>
                      <td className="py-3 px-2.5 text-center text-emerald-400 text-[10px]">
                        1:1 Tam Senkron
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Pagination Footer */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-slate-300">
                <div>
                  Gösterilen:{' '}
                  <strong className="text-amber-300">
                    {(safePage - 1) * articlePageSize + 1} –{' '}
                    {Math.min(safePage * articlePageSize, filteredAndSortedArticleRows.length)}
                  </strong>{' '}
                  / Toplam{' '}
                  <strong className="text-emerald-400">{filteredAndSortedArticleRows.length} Makale</strong>
                </div>
                {totalPages > 1 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      disabled={safePage <= 1}
                      onClick={() => setArticleCurrentPage((p) => Math.max(1, p - 1))}
                      className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 border border-slate-700 text-slate-200 rounded-xs cursor-pointer"
                    >
                      ← Önceki
                    </button>
                    <span className="px-2.5 py-1 bg-slate-900 border border-amber-400/50 text-amber-300 font-bold rounded-xs">
                      Sayfa {safePage} / {totalPages}
                    </span>
                    <button
                      type="button"
                      disabled={safePage >= totalPages}
                      onClick={() => setArticleCurrentPage((p) => Math.min(totalPages, p + 1))}
                      className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 border border-slate-700 text-slate-200 rounded-xs cursor-pointer"
                    >
                      Sonraki →
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: APP INTERACTIONS, LIVE MEASUREMENT ENTRY & TIMELINE */}
        {activeHubTab === 'interactions' && (
          <div className="space-y-5">
            <div
              id="analytics-app-interactions"
              className="bg-slate-900/95 border-2 border-cyan-400/80 p-4 sm:p-5 rounded-xs space-y-4 font-mono text-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-cyan-400 text-slate-950 font-extrabold text-[10px] rounded-xs uppercase">
                      <MousePointerClick className="w-3.5 h-3.5" />
                      <span>UYGULAMA ETKİLEŞİM MERKEZİ · CANLI + KÜMÜLATİF</span>
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-950 border border-emerald-500/60 text-emerald-300 font-bold text-[10px] rounded-xs">
                      2 Canlı Site (Ana Hub + Blogger) &amp; 8 Dondurulmuş 301 Kaydı Senkron
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-editorial font-bold text-white">
                    Uygulamadaki Canlı Etkileşimler ve Açılıştan Bugüne Kümülatif Etkileşim Sayacı
                  </h4>
                </div>

                <div className="flex flex-wrap items-center gap-2 tabular-nums">
                  <div className="bg-slate-950 border-2 border-cyan-400 px-3 py-2 rounded-xs text-right">
                    <div className="text-[9px] text-cyan-300 uppercase font-bold">TOPLAM ETKİLEŞİM</div>
                    <div className="text-lg font-extrabold text-cyan-300">
                      {syncedAppInteractions.totalInteractionsSinceLaunch.toLocaleString('tr-TR')}
                    </div>
                  </div>
                  <div className="bg-slate-950 border border-emerald-400/70 px-3 py-2 rounded-xs text-right">
                    <div className="text-[9px] text-emerald-300 uppercase font-bold">BU OTURUM CANLI</div>
                    <div className="text-lg font-extrabold text-emerald-400">
                      +{resolvedSessionInteractions.totalInteractionsSinceLaunch.toLocaleString('tr-TR')}
                    </div>
                  </div>
                </div>
              </div>

              {/* 8 App Interaction Category Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {[
                  {
                    key: 'PAGE_VIEW' as AppInteractionCategory,
                    label: 'Sayfa & Panel Gezintisi',
                    total: syncedAppInteractions.pageViews,
                    session: resolvedSessionInteractions.pageViews,
                    icon: Eye,
                    border: 'border-cyan-500/50',
                    accent: 'text-cyan-300',
                    desc: 'Ana Hub, 301 Ağı ve Analitik görünümü',
                  },
                  {
                    key: 'ARTICLE_READ' as AppInteractionCategory,
                    label: 'Makale Açılışı & Okuma',
                    total: syncedAppInteractions.articleReads,
                    session: resolvedSessionInteractions.articleReads,
                    icon: BookOpen,
                    border: 'border-amber-400/50',
                    accent: 'text-amber-300',
                    desc: '316+ makale okuma ve genişletme',
                  },
                  {
                    key: 'ANALYSIS_MODAL' as AppInteractionCategory,
                    label: 'AI Analiz & Tam Anlaşılırlık',
                    total: syncedAppInteractions.analysisModals,
                    session: resolvedSessionInteractions.analysisModals,
                    icon: Sparkles,
                    border: 'border-purple-400/50',
                    accent: 'text-purple-300',
                    desc: 'Tam anlaşılırlık, gelecek çalışmalar & inceleme',
                  },
                  {
                    key: 'SIMULATION_RUN' as AppInteractionCategory,
                    label: 'İnteraktif Simülasyon Çalıştırma',
                    total: syncedAppInteractions.simulationRuns,
                    session: resolvedSessionInteractions.simulationRuns,
                    icon: Cpu,
                    border: 'border-sky-400/50',
                    accent: 'text-sky-300',
                    desc: 'Matematiksel & fiziksel laboratuvar deneyi',
                  },
                  {
                    key: 'AUDIO_LISTEN' as AppInteractionCategory,
                    label: '12 Dilde Sesli Dinleme',
                    total: syncedAppInteractions.audioListens,
                    session: resolvedSessionInteractions.audioListens,
                    icon: Headphones,
                    border: 'border-emerald-400/50',
                    accent: 'text-emerald-300',
                    desc: 'Çok dilli makale seslendirici oturumu',
                  },
                  {
                    key: 'QA_OBJECTION' as AppInteractionCategory,
                    label: '7/24 Soru & İtiraz Motoru',
                    total: syncedAppInteractions.qaObjections,
                    session: resolvedSessionInteractions.qaObjections,
                    icon: MessageSquare,
                    border: 'border-rose-400/50',
                    accent: 'text-rose-300',
                    desc: 'Külliyat cevaplayıcı & uzman yönlendirme',
                  },
                  {
                    key: 'LANGUAGE_SEARCH_EXPORT' as AppInteractionCategory,
                    label: '12 Dil, Arama & BibTeX',
                    total: syncedAppInteractions.languageSearchExports,
                    session: resolvedSessionInteractions.languageSearchExports,
                    icon: Languages,
                    border: 'border-indigo-400/50',
                    accent: 'text-indigo-300',
                    desc: 'Dil geçişi, filtreleme ve akademik atıf',
                  },
                  {
                    key: 'VIDEO_WATCH' as AppInteractionCategory,
                    label: 'Geniş Özet Video İzleme (12 Dil)',
                    total: syncedAppInteractions.videoWatches || articleCumulativeData.totalVideoPlaysAllArticles,
                    session: resolvedSessionInteractions.videoWatches || 0,
                    icon: Film,
                    border: 'border-teal-400/60',
                    accent: 'text-teal-300',
                    desc: `Hareketli varlık videosu (${Math.floor(articleCumulativeData.totalVideoWatchSecondsAllArticles / 60)} dk ${articleCumulativeData.totalVideoWatchSecondsAllArticles % 60} sn)`,
                  },
                  {
                    key: 'PWA_DOWNLOAD' as AppInteractionCategory,
                    label: 'Üst Menü Download / PWA Kurulum',
                    total: syncedAppInteractions.pwaDownloads,
                    session: resolvedSessionInteractions.pwaDownloads,
                    icon: Download,
                    border: 'border-amber-300/70',
                    accent: 'text-amber-300',
                    desc: 'Masaüstü & mobil uygulama indirme etkileşimi',
                  },
                ].map((card) => {
                  const IconComp = card.icon;
                  const isSelected = interactionFilter === card.key;
                  return (
                    <button
                      key={card.key}
                      type="button"
                      onClick={() =>
                        setInteractionFilter((prev) => (prev === card.key ? 'ALL' : card.key))
                      }
                      className={`text-left bg-slate-950 p-3 rounded-xs border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-cyan-300 ring-2 ring-cyan-400/40'
                          : `${card.border} hover:border-white/50`
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1.5 mb-1">
                        <span className={`inline-flex items-center gap-1.5 font-bold text-[11px] ${card.accent}`}>
                          <IconComp className="w-3.5 h-3.5 shrink-0" />
                          <span>{card.label}</span>
                        </span>
                        <span className="px-1.5 py-0.5 bg-slate-900 border border-emerald-500/40 text-emerald-300 text-[9px] font-bold rounded-xs shrink-0 tabular-nums">
                          Canlı +{card.session.toLocaleString('tr-TR')}
                        </span>
                      </div>
                      <div className="text-base font-extrabold text-white tabular-nums">
                        {card.total.toLocaleString('tr-TR')}
                      </div>
                      <div className="text-[9px] text-slate-400 mt-0.5">{card.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interactive Analytics Measurement Entry Form */}
            <form
              onSubmit={handleApplyAnalyticsPanelMeasurement}
              className="bg-slate-900/95 border border-slate-700 p-4 rounded-xs space-y-3 font-mono text-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-amber-300 font-bold uppercase text-[11px]">
                  ● CANLI SENKRON VERİ GİRİŞİ (HER GİRİŞTE TÜM SİTE &amp; MAKALE SAYACLARI EŞZAMANLI ARTAR):
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-8 gap-2.5 items-end">
                <div className="lg:col-span-2">
                  <label className="block text-[10px] text-slate-400 mb-1">HEDEF WEB SİTESİ</label>
                  <select
                    value={analyticsTargetDomain}
                    onChange={(e) => setAnalyticsTargetDomain(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 text-white rounded-xs text-xs focus:outline-none focus:border-emerald-400"
                  >
                    {strictNodes.map((n) => {
                      const isLive = LIVE_WEBSITES_SET.has(n.domain) || Boolean(n.isLiveWebsite);
                      return (
                        <option key={n.domain} value={n.domain} disabled={!isLive}>
                          #{n.rank} {n.domain} {isLive ? `(Canlı 200 · Açılış: ${n.launchDate})` : '(Senkron 301 - Donduruldu)'}
                        </option>
                      );
                    })}
                    <option value="ALL_11_SITES">
                      Tüm Canlı Düğümler (Ana Hub + Blogger + GitHub 33EmrePelit33)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-cyan-300 mb-1 font-bold">GÖRÜNTÜLENME (+Δ)</label>
                  <input
                    type="number"
                    min={0}
                    max={100000}
                    value={measureViewsInput}
                    onChange={(e) => setMeasureViewsInput(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-cyan-500/70 text-cyan-300 font-extrabold rounded-xs text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-amber-300 mb-1">OKUNMA (+Δ)</label>
                  <input
                    type="number"
                    min={0}
                    max={10000}
                    value={measureReadsInput}
                    onChange={(e) => setMeasureReadsInput(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 text-amber-300 font-bold rounded-xs text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-amber-200 mb-1">OKUMA (+DK)</label>
                  <input
                    type="number"
                    min={0}
                    max={10000}
                    value={measureReadMinsInput}
                    onChange={(e) => setMeasureReadMinsInput(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 text-amber-200 font-bold rounded-xs text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-emerald-300 mb-1">SESLİ (+DK)</label>
                  <input
                    type="number"
                    min={0}
                    max={10000}
                    value={measureAudioMinsInput}
                    onChange={(e) => setMeasureAudioMinsInput(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 text-emerald-300 font-bold rounded-xs text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-purple-300 mb-1">TEKİL (+Δ)</label>
                  <input
                    type="number"
                    min={0}
                    max={10000}
                    value={measureUniqueInput}
                    onChange={(e) => setMeasureUniqueInput(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 text-purple-300 font-bold rounded-xs text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-sky-300 mb-1">SİMÜLATÖR (+Δ)</label>
                  <input
                    type="number"
                    min={0}
                    max={10000}
                    value={measureSimInput}
                    onChange={(e) => setMeasureSimInput(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 text-sky-300 font-bold rounded-xs text-xs"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="text-[11px] text-slate-300">
                  {analyticsNotice ||
                    `Her yeni görüntülenme, okuma, dinleme veya simülatör girişi canlı ${cumulativeBreakdown.live2.count} düğümde (Ana Hub, Blogger, GitHub 33EmrePelit33) artar; ${cumulativeBreakdown.retired8.count} senkron 301 düğümü taban değerinde korunur ve ${strictNodes.length} düğüm genel mutabakatı 1:1 senkronize edilir.`}
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xs cursor-pointer transition-colors"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Veriyi Kaydet &amp; Senkronize Et</span>
                </button>
              </div>
            </form>

            {/* Timeline */}
            {analyticsEventLog && analyticsEventLog.length > 0 && (() => {
              const filteredEvents = analyticsEventLog.filter((ev) => {
                if (interactionFilter === 'ALL') return true;
                if (interactionFilter === 'LIVE_ONLY') return !ev.isHistoricalBaseline;
                if (interactionFilter === 'HISTORICAL_ONLY') return Boolean(ev.isHistoricalBaseline);
                return ev.interactionCategory === interactionFilter;
              });
              const filterChips: {
                id: 'ALL' | 'LIVE_ONLY' | 'HISTORICAL_ONLY' | AppInteractionCategory;
                label: string;
              }[] = [
                { id: 'ALL', label: `TÜMÜ (${analyticsEventLog.length})` },
                { id: 'LIVE_ONLY', label: `CANLI (${analyticsEventLog.filter((e) => !e.isHistoricalBaseline).length})` },
                { id: 'HISTORICAL_ONLY', label: `ARŞİV (${analyticsEventLog.filter((e) => e.isHistoricalBaseline).length})` },
                { id: 'PWA_DOWNLOAD', label: 'PWA İNDİRME' },
                { id: 'ARTICLE_READ', label: 'MAKALE' },
                { id: 'ANALYSIS_MODAL', label: 'ANALİZ' },
                { id: 'SIMULATION_RUN', label: 'SİMÜLASYON' },
                { id: 'AUDIO_LISTEN', label: 'SESLİ' },
                { id: 'QA_OBJECTION', label: 'SORU-CEVAP' },
                { id: 'LANGUAGE_SEARCH_EXPORT', label: 'DİL / ARAMA' },
              ];
              return (
                <div className="bg-slate-950/90 border border-cyan-500/40 p-3.5 rounded-xs space-y-2.5 font-mono text-[11px]">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-cyan-300 font-bold uppercase text-[10px]">
                      CANLI + ARŞİV UYGULAMA ETKİLEŞİMİ ZAMAN TÜNELİ
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {filterChips.map((chip) => (
                      <button
                        key={chip.id}
                        type="button"
                        onClick={() => setInteractionFilter(chip.id)}
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-xs border cursor-pointer transition-colors ${
                          interactionFilter === chip.id
                            ? 'bg-cyan-400 text-slate-950 border-cyan-300'
                            : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                        }`}
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                    {filteredEvents.slice(0, 35).map((ev, idx) => (
                      <div
                        key={`${ev.id}-${ev.syncSeq ?? 'hist'}-${idx}`}
                        className="flex flex-wrap items-center justify-between gap-2 text-slate-300 border-b border-slate-900 pb-1.5"
                      >
                        <span className="leading-relaxed">
                          <span
                            className={`inline-block px-1.5 py-0.5 mr-1.5 text-[9px] font-bold rounded-xs ${
                              ev.isHistoricalBaseline
                                ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                                : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                            }`}
                          >
                            {ev.isHistoricalBaseline ? 'ARŞİV' : 'CANLI'}
                          </span>
                          <strong className="text-amber-300">[{ev.timestamp}]</strong>{' '}
                          {ev.syncSeq ? <span className="text-cyan-300 font-bold">[#{ev.syncSeq}] </span> : null}
                          {ev.metricSummary}
                        </span>
                        <span className="text-emerald-400 text-[10px] shrink-0">
                          {ev.cumulativeViewsAfter ? `Σ Gör.: ${ev.cumulativeViewsAfter.toLocaleString('tr-TR')} · ` : ''}
                          {ev.targetDomain === 'ALL_11_SITES' || ev.targetDomain === 'ALL_10_SITES' || ev.targetDomain === 'ALL_8_SITES'
                            ? 'Tüm 11 Düğüm (Hub + Blogger + GitHub)'
                            : ev.targetDomain}
                        </span>
                      </div>
                    ))}
                    {filteredEvents.length === 0 && (
                      <div className="text-slate-400 text-center py-3">
                        Bu filtre kategorisinde henüz canlı etkileşim kaydı bulunmuyor.
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* TAB 4: GLOBAL TOP-100 BENCHMARK REPORT */}
        {activeHubTab === 'benchmark' && (
          <AnalyticsBenchmarkReport
            cumulative={cumulative}
            totalArticlesCount={Math.max(320, activeArticles.length, bloggerSyncedCount || 320)}
          />
        )}
      </div>
    </div>
  );
};
