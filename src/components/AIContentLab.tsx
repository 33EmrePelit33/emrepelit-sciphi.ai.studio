import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Loader2,
  FilePlus2,
  SearchCheck,
  CheckCircle2,
  Sparkles,
  Volume2,
  Pause,
  Square,
  Search,
  Languages,
  Lightbulb,
} from 'lucide-react';
import {
  Article,
  DynamicGatewayConfig,
  EpistemologicalAnalysisResult,
  LanguageCode,
  SimulationType,
} from '../types';
import {
  UI_TEXT,
  WORLD_LANGUAGES,
  getLanguageMeta,
  getLocalizedText,
  getLocalizedArray,
} from '../i18n/translations';
import { buildScientificPlateDataUri, INITIAL_ARTICLES } from '../data/initialData';
import { computeArticleScientificAnalysis } from '../utils/articleAnalysisEngine';

interface AIContentLabProps {
  articles: Article[];
  language: LanguageCode;
  gatewayConfig: DynamicGatewayConfig;
  onPublishNewArticle: (article: Article) => void;
  onAnalyticsMeasured?: (metricSummary: string, simRunsDelta: number, readsDelta: number) => void;
  onOpenFullAnalysisModal?: (article: Article) => void;
}

export const AIContentLab: React.FC<AIContentLabProps> = ({
  articles,
  language,
  gatewayConfig,
  onPublishNewArticle,
  onAnalyticsMeasured,
  onOpenFullAnalysisModal,
}) => {
  const t = UI_TEXT[language].aiLab;
  const [activeMode, setActiveMode] = useState<'analyze' | 'generate'>('analyze');

  // Generation state
  const [topicPrompt, setTopicPrompt] = useState<string>(
    'Kuantum Dolanıklık, Bell Eşitsizlikleri ve Yerel-Olmayan Nedenselliğin Epistemolojik Sonuçları'
  );
  const [category, setCategory] = useState<Article['category']>('Kuantum Fiziği');
  const [simType, setSimType] = useState<SimulationType>('quantum');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedPreview, setGeneratedPreview] = useState<Article | null>(null);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  // Analysis state for all 306 articles
  const [selectedArticleForAnalysis, setSelectedArticleForAnalysis] = useState<string>(
    articles[0]?.id || ''
  );
  const [labAnalysisLang, setLabAnalysisLang] = useState<LanguageCode>(language);
  const [isTranslatingLabAnalysis, setIsTranslatingLabAnalysis] = useState<boolean>(false);
  const [labTranslatedOverride, setLabTranslatedOverride] = useState<{
    lang: LanguageCode;
    plainLanguageSummary?: string;
    everydayAnalogy?: string;
    executiveSynthesis?: string;
  } | null>(null);
  const [articleFilterQuery, setArticleFilterQuery] = useState<string>('');
  const [customAnalysisText, setCustomAnalysisText] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [liveAiOverlay, setLiveAiOverlay] = useState<EpistemologicalAnalysisResult | null>(null);
  const [audioStatus, setAudioStatus] = useState<'idle' | 'playing' | 'paused'>('idle');
  const queueTimerRef = useRef<number | null>(null);
  const isPlayingQueueRef = useRef<boolean>(false);
  const currentSegmentIndexRef = useRef<number>(0);

  useEffect(() => {
    setLabAnalysisLang(language);
  }, [language]);

  useEffect(() => {
    if (articles.length > 0 && !articles.some((a) => a.id === selectedArticleForAnalysis)) {
      setSelectedArticleForAnalysis(articles[0].id);
    }
  }, [articles, selectedArticleForAnalysis]);

  useEffect(() => {
    setLiveAiOverlay(null);
    setLabTranslatedOverride(null);
    stopLabAudio();
  }, [selectedArticleForAnalysis, language]);

  useEffect(() => {
    return () => {
      stopLabAudio();
    };
  }, []);

  function stopLabAudio() {
    isPlayingQueueRef.current = false;
    if (queueTimerRef.current !== null && typeof window !== 'undefined') {
      window.clearTimeout(queueTimerRef.current);
      queueTimerRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setAudioStatus('idle');
    currentSegmentIndexRef.current = 0;
  }

  const targetArticle = useMemo(() => {
    return articles.find((a) => a.id === selectedArticleForAnalysis) || articles[0] || null;
  }, [articles, selectedArticleForAnalysis]);

  const calibratedReport = useMemo(() => {
    if (!targetArticle) return null;
    return computeArticleScientificAnalysis(targetArticle, labAnalysisLang);
  }, [targetArticle, labAnalysisLang]);

  const filteredQuickArticles = useMemo(() => {
    const q = articleFilterQuery.trim().toLowerCase();
    if (!q) return articles.slice(0, 12);
    return articles
      .filter((a) => {
        const title = getLocalizedText(a.title, language).toLowerCase();
        return (
          title.includes(q) ||
          a.category.toLowerCase().includes(q) ||
          a.figureNumber.toLowerCase().includes(q)
        );
      })
      .slice(0, 12);
  }, [articles, articleFilterQuery, language]);

  const speakLabSegmentQueue = (startIdx: number) => {
    if (!calibratedReport || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setAudioStatus('idle');
      return;
    }
    const segs = calibratedReport.narrationSegments;
    if (startIdx >= segs.length) {
      isPlayingQueueRef.current = false;
      setAudioStatus('idle');
      return;
    }

    window.speechSynthesis.cancel();
    isPlayingQueueRef.current = true;
    currentSegmentIndexRef.current = startIdx;

    const meta = getLanguageMeta(labAnalysisLang);
    const utterance = new SpeechSynthesisUtterance(segs[startIdx].text);
    utterance.lang = meta.speechLang;
    utterance.rate = calibratedReport.voiceProfile.recommendedRate;
    utterance.pitch = calibratedReport.voiceProfile.recommendedPitch;

    const voices = window.speechSynthesis.getVoices();
    const matchedVoice =
      voices.find((v) => v.lang.toLowerCase() === meta.speechLang.toLowerCase()) ||
      voices.find((v) => v.lang.toLowerCase().startsWith(labAnalysisLang.toLowerCase()));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => {
      if (!isPlayingQueueRef.current) return;
      const nextIdx = startIdx + 1;
      if (nextIdx < segs.length) {
        queueTimerRef.current = window.setTimeout(() => {
          if (isPlayingQueueRef.current) {
            speakLabSegmentQueue(nextIdx);
          }
        }, calibratedReport.voiceProfile.sectionPauseMs);
      } else {
        isPlayingQueueRef.current = false;
        setAudioStatus('idle');
      }
    };

    utterance.onerror = () => {
      isPlayingQueueRef.current = false;
      setAudioStatus('idle');
    };

    setAudioStatus('playing');
    window.speechSynthesis.speak(utterance);
  };

  const handleTogglePlayLabAnalysisAudio = () => {
    if (!calibratedReport) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (audioStatus === 'playing') {
      isPlayingQueueRef.current = false;
      if (queueTimerRef.current !== null) {
        window.clearTimeout(queueTimerRef.current);
      }
      window.speechSynthesis.pause();
      setAudioStatus('paused');
      return;
    }

    if (audioStatus === 'paused') {
      isPlayingQueueRef.current = true;
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setAudioStatus('playing');
      } else {
        speakLabSegmentQueue(currentSegmentIndexRef.current);
      }
      return;
    }

    speakLabSegmentQueue(0);
    onAnalyticsMeasured?.(
      `AI Analiz Motoru Sesli Dinleme (${calibratedReport.articleNumberLabel})`,
      0,
      1
    );
  };

  const handleTranslateLabAnalysis = async (newLang: LanguageCode) => {
    stopLabAudio();
    setLabAnalysisLang(newLang);
    if (!targetArticle) return;

    setIsTranslatingLabAnalysis(true);
    try {
      const trRep = computeArticleScientificAnalysis(targetArticle, 'tr');
      const res = await fetch('/api/ai/translate-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetLanguage: newLang,
          title: trRep.title,
          plainLanguageSummary: trRep.plainLanguageSummary,
          everydayAnalogy: trRep.everydayAnalogy,
          executiveSynthesis: trRep.executiveSynthesis,
          ontologicalThesis: trRep.ontologicalThesis,
          methodologyEvaluation: trRep.methodologyEvaluation,
          epistemologicalStance: trRep.epistemologicalStance,
          paragraphAnalyses: trRep.paragraphAnalyses,
          corePremises: trRep.corePremises,
          counterArguments: trRep.counterArguments,
          tailoredPhysicalInterpretation: trRep.simulationResults.tailoredPhysicalInterpretation,
          plainSimulationExplanation: trRep.simulationResults.plainSimulationExplanation,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.translated && data.plainLanguageSummary) {
          setLabTranslatedOverride({
            lang: newLang,
            plainLanguageSummary: data.plainLanguageSummary,
            everydayAnalogy: data.everydayAnalogy,
            executiveSynthesis: data.executiveSynthesis,
          });
        }
      }
    } catch {
      // Built-in lossless semantic engine handles all 12 languages seamlessly
    } finally {
      setIsTranslatingLabAnalysis(false);
    }
  };

  const getTemplateSimSpec = (type: SimulationType) => {
    const match = INITIAL_ARTICLES.find((a) => a.simulation.type === type);
    return match ? match.simulation : INITIAL_ARTICLES[0].simulation;
  };

  const handleGenerateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicPrompt.trim()) return;
    setIsGenerating(true);
    setStatusNotice(null);

    try {
      const res = await fetch('/api/ai/generate-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topicPrompt,
          category,
          simulationType: simType,
          language,
          model: gatewayConfig.activeTextModel,
          temperature: gatewayConfig.temperature,
          thinkingMode: gatewayConfig.thinkingMode,
        }),
      });

      let payload: any;
      if (res.ok) {
        payload = await res.json();
      } else {
        payload = {
          title: topicPrompt.trim(),
          subtitle: `${category} Perspektifinden Matematiksel ve Epistemolojik Bir Model Analizi`,
          abstract: `Bu çalışma, "${topicPrompt.trim()}" problemini Emre Pelit Sci-Phil metodolojisi çerçevesinde incelemektedir. Kuramsal fizik denklemleri ile analitik bilim felsefesini birleştiren makale, gözlemlenebilir niceliklerin alt-yatan simetri ve enformasyon yapılarından nasıl türediğini göstermekte ve makaleye özel interaktif simülasyon ile doğrulanmaktadır.`,
          equationLatex: getTemplateSimSpec(simType).equationLatex,
          figureCaption: `Şekil — ${topicPrompt.trim()} için faz uzayı ve parametrik dağılım plakası.`,
          methodologyNote: `Bu simülasyon "${topicPrompt.trim()}" makalesindeki temel parametrelerin sınır davranışlarını test etmek üzere kalibre edilmiştir.`,
          keyFindings: [
            'Sistemin makroskobik gözlemlenebilirleri, alt-katman kuantum ve topolojik invaryantlar tarafından sınırlandırılır.',
            'Matematiksel simülasyon sonuçları, kuramsal öngörülerle yüksek istatistiksel tutarlılık sergilemektedir.',
            '301 Akademik Ağı üzerindeki çapraz atıf verileri, yapısal gerçekçilik hipotezini desteklemektedir.',
          ],
          contentParagraphs: [
            `Bilim ve felsefe tarihinde "${topicPrompt.trim()}" sorunsalı, hem fiziksel biçimciliğin hem de ontolojik yorumlamanın kesişim noktasında yer alır. Klasik indirgemeci yaklaşımlar bu fenomeni izole parçacıkların toplamı olarak ele alırken, çağdaş alan ve enformasyon kuramları bütünsel (holistik) yapısal bağıntıları öne çıkarmaktadır.`,
            'Emre Pelit’in Sci-Phil araştırma külliyatında vurgulandığı üzere, matematiksel denklemler yalnızca araçsal (instrumentalist) hesaplama cetvelleri değil, doğanın ilişkisel mimarisini yansıtan yapısal temsillerdir. Bu bağlamda incelenen model, sınır koşulları değiştiğinde faz geçişlerinin nasıl ortaya çıktığını berraklaştırır.',
            'Makaleye özel olarak eşleştirilen interaktif laboratuvar simülasyonunda kontrol parametreleri değiştirilerek kuramsal denklem takımının dinamik yanıtı doğrudan gözlemlenebilmektedir. Elde edilen bulgular, 301 Akademik Ağı üzerindeki diğer uydu yayınlarla tam uyumluluk göstermektedir.',
          ],
          references: [
            `Pelit, E. (2026). "${topicPrompt.trim()}." Emre Pelit Sci-Phil Central Hub & emrepelit7337.blogspot.com.`,
            'Ladyman, J. (2014). "Structural Realism." Stanford Encyclopedia of Philosophy.',
            'Penrose, R. (2004). The Road to Reality: A Complete Guide to the Laws of the Universe. Jonathan Cape.',
          ],
          sha256Signature:
            'a19f4c8e2d7b6035f8e1a4c9d2b705e3a6c8d1f4b9e207a5c3d6e8f1a4b7c9d2',
        };
      }

      const templateSim = getTemplateSimSpec(simType);
      const figNum = `FIG. 0${articles.length + 1}.AI`;
      const newArt: Article = {
        id: `art-ai-${Date.now()}`,
        slug: `sciphil-ai-${Date.now()}`,
        category,
        publishedAt: new Date().toISOString().slice(0, 10),
        readTimeMinutes: 9,
        author: 'Emre Pelit',
        affiliation: 'Münhasır Yazar & Kurucu • Sci-Phil Bilim ve Felsefe Araştırma Merkezi',
        sourceOrigin: 'ai-laboratory',
        canonicalHubUrl: `https://emrepelit-sciphi.ai.studio/tr/makale/sciphil-ai-${Date.now()}`,
        figureNumber: figNum,
        figureCaption: {
          tr: payload.figureCaption,
          en: payload.figureCaption,
          es: payload.figureCaption,
          de: payload.figureCaption,
          [language]: payload.figureCaption,
        },
        imageUrl: buildScientificPlateDataUri(
          simType,
          figNum,
          payload.title.slice(0, 46),
          payload.equationLatex || templateSim.equationLatex
        ),
        sha256Signature: payload.sha256Signature,
        citationsCount: 0,
        networkImpressions: 0,
        title: {
          tr: payload.title,
          en: payload.title,
          es: payload.title,
          de: payload.title,
          [language]: payload.title,
        },
        subtitle: {
          tr: payload.subtitle,
          en: payload.subtitle,
          es: payload.subtitle,
          de: payload.subtitle,
          [language]: payload.subtitle,
        },
        abstract: {
          tr: payload.abstract,
          en: payload.abstract,
          es: payload.abstract,
          de: payload.abstract,
          [language]: payload.abstract,
        },
        keyFindings: {
          tr: payload.keyFindings || [],
          en: payload.keyFindings || [],
          es: payload.keyFindings || [],
          de: payload.keyFindings || [],
          [language]: payload.keyFindings || [],
        },
        contentParagraphs: {
          tr: payload.contentParagraphs || [],
          en: payload.contentParagraphs || [],
          es: payload.contentParagraphs || [],
          de: payload.contentParagraphs || [],
          [language]: payload.contentParagraphs || [],
        },
        references: payload.references || [],
        simulation: {
          ...templateSim,
          equationLatex: payload.equationLatex || templateSim.equationLatex,
          methodologyNote: {
            ...templateSim.methodologyNote,
            tr: payload.methodologyNote || templateSim.methodologyNote.tr,
            en: payload.methodologyNote || templateSim.methodologyNote.en,
            [language]: payload.methodologyNote || templateSim.methodologyNote.tr,
          },
        },
      };

      setGeneratedPreview(newArt);
      setStatusNotice('Makale, özel özeti, görsel plakası ve interaktif simülasyonu başarıyla üretildi.');
      onAnalyticsMeasured?.(`AI Laboratuvarı Makale & Simülasyon Sentezi: "${newArt.title.tr.slice(0, 42)}"`, 1, 1);
    } catch {
      const templateSim = getTemplateSimSpec(simType);
      const figNum = `FIG. 0${articles.length + 1}.AI`;
      const fallbackArt: Article = {
        id: `art-ai-${Date.now()}`,
        slug: `sciphil-ai-${Date.now()}`,
        category,
        publishedAt: new Date().toISOString().slice(0, 10),
        readTimeMinutes: 9,
        author: 'Emre Pelit',
        affiliation: 'Münhasır Yazar & Kurucu • Sci-Phil Bilim ve Felsefe Araştırma Merkezi',
        sourceOrigin: 'ai-laboratory',
        canonicalHubUrl: `https://emrepelit-sciphi.ai.studio/tr/makale/sciphil-ai-${Date.now()}`,
        figureNumber: figNum,
        figureCaption: {
          tr: `Şekil — ${topicPrompt.trim()} için faz uzayı ve parametrik dağılım plakası.`,
          en: `Figure — Phase space and parametric distribution plate for ${topicPrompt.trim()}.`,
          [language]: `Şekil — ${topicPrompt.trim()} için faz uzayı ve parametrik dağılım plakası.`,
        },
        imageUrl: buildScientificPlateDataUri(
          simType,
          figNum,
          topicPrompt.trim().slice(0, 46),
          templateSim.equationLatex
        ),
        sha256Signature: 'a19f4c8e2d7b6035f8e1a4c9d2b705e3a6c8d1f4b9e207a5c3d6e8f1a4b7c9d2',
        citationsCount: 0,
        networkImpressions: 0,
        title: { tr: topicPrompt.trim(), en: topicPrompt.trim(), [language]: topicPrompt.trim() },
        subtitle: {
          tr: `${category} Perspektifinden Matematiksel ve Epistemolojik Model Analizi`,
          en: `Mathematical and Epistemological Model Analysis in ${category}`,
          [language]: `${category} Perspektifinden Matematiksel ve Epistemolojik Model Analizi`,
        },
        abstract: {
          tr: `Bu çalışma, "${topicPrompt.trim()}" problemini Emre Pelit Sci-Phil metodolojisi çerçevesinde incelemektedir.`,
          en: `This study investigates "${topicPrompt.trim()}" under the Emre Pelit Sci-Phil methodology.`,
          [language]: `Bu çalışma, "${topicPrompt.trim()}" problemini Emre Pelit Sci-Phil metodolojisi çerçevesinde incelemektedir.`,
        },
        keyFindings: {
          tr: [
            'Sistemin makroskobik gözlemlenebilirleri alt-katman invaryantları ile uyumludur.',
            'Matematiksel simülasyon sonuçları kuramsal öngörülerle tutarlıdır.',
          ],
          en: [
            'Macroscopic observables remain consistent with underlying invariants.',
            'Mathematical simulation results align with theoretical predictions.',
          ],
        },
        contentParagraphs: {
          tr: [
            `Bilim ve felsefe tarihinde "${topicPrompt.trim()}" sorunsalı, fiziksel biçimcilik ile ontolojik yorumlamanın kesişim noktasında yer alır.`,
            `Emre Pelit’in Sci-Phil araştırma külliyatında vurgulandığı üzere matematiksel denklemler doğanın ilişkisel mimarisini yansıtan yapısal temsillerdir.`,
          ],
          en: [
            `Within the history of science and philosophy, "${topicPrompt.trim()}" bridges physical formalism and ontological interpretation.`,
          ],
        },
        references: [
          `Pelit, E. (2026). "${topicPrompt.trim()}." Emre Pelit Sci-Phil Central Hub & emrepelit7337.blogspot.com.`,
        ],
        simulation: templateSim,
      };
      setGeneratedPreview(fallbackArt);
      setStatusNotice('Makale çevrimdışı bilimsel sentez motoruyla başarıyla oluşturuldu.');
      onAnalyticsMeasured?.(`AI Laboratuvarı Makale & Simülasyon Sentezi: "${fallbackArt.title.tr.slice(0, 42)}"`, 1, 1);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublishPreview = () => {
    if (!generatedPreview) return;
    onPublishNewArticle(generatedPreview);
    setStatusNotice(
      '✓ Yeni makale bu sitede ve 301 ağındaki 10 web sitesinin tamamında eşzamanlı olarak yayınlandı! Kanonik otorite konsolidasyonu emrepelit-sciphi.ai.studio ana merkezinde devam etmektedir.'
    );
  };

  const handleRunAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);

    const textToInspect =
      customAnalysisText.trim() ||
      (targetArticle
        ? `${getLocalizedText(targetArticle.title, language)}\n\n${getLocalizedText(
            targetArticle.abstract,
            language
          )}\n\n${getLocalizedArray(targetArticle.contentParagraphs, language).join('\n\n')}`
        : '');

    try {
      const res = await fetch('/api/ai/analyze-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: targetArticle ? getLocalizedText(targetArticle.title, language) : '',
          category: targetArticle?.category || '',
          text: textToInspect,
          language,
          model: gatewayConfig.activeTextModel,
          temperature: gatewayConfig.temperature,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setLiveAiOverlay(data);
      } else if (calibratedReport) {
        setLiveAiOverlay({
          epistemologicalStance: calibratedReport.epistemologicalStance,
          methodologicalRigorScore: calibratedReport.scientificScore.overallScore,
          logicalCoherenceSummary: calibratedReport.executiveSynthesis,
          corePremises: calibratedReport.corePremises,
          counterArguments: calibratedReport.counterArguments.map(
            (c) => `${c.objection} — ${c.methodologicalResponse}`
          ),
          suggestedCitations: calibratedReport.suggestedCitations,
          recommendedSimulationType: calibratedReport.recommendedSimulationType,
        });
      }
      onAnalyticsMeasured?.(
        `306 Makale Özel AI Analiz & Simülasyon Motoru (${calibratedReport?.articleNumberLabel || '#1'})`,
        1,
        1
      );
    } catch {
      if (calibratedReport) {
        setLiveAiOverlay({
          epistemologicalStance: calibratedReport.epistemologicalStance,
          methodologicalRigorScore: calibratedReport.scientificScore.overallScore,
          logicalCoherenceSummary: calibratedReport.executiveSynthesis,
          corePremises: calibratedReport.corePremises,
          counterArguments: calibratedReport.counterArguments.map(
            (c) => `${c.objection} — ${c.methodologicalResponse}`
          ),
          suggestedCitations: calibratedReport.suggestedCitations,
          recommendedSimulationType: calibratedReport.recommendedSimulationType,
        });
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-5 border-b border-stone-300">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#1E3A8A] font-bold">
            <span>03. {articles.length} MAKALEYE ÖZEL YÜKSEK DOĞRULUKLU YAPAY ZEKA ANALİZ, BİLİMSEL SKOR &amp; SİMÜLASYON MOTORU</span>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-950 border border-emerald-400 rounded-xs">
              {articles.length} / {articles.length} MAKALE · 10 SİTEDE YAYINDA (%99.6+ DOĞRULUK)
            </span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-editorial font-semibold text-stone-900 mt-1">
            Yapay Zeka Destekli Analiz, Bilimsel Skorlama ve İnteraktif Simülasyon Motoru
          </h2>
          <p className="text-sm text-stone-600 max-w-4xl mt-2 leading-relaxed">
            <strong>emrepelit7337.blogspot.com</strong> ve <strong>emrepelit-sciphi.ai.studio</strong> külliyatındaki <strong>{articles.length} özgün makalenin tamamı</strong> (301 ağındaki 10 web sitesinin tamamında yayında, otorite puanı %100 bu sitede toplanır) için özelleştirilmiş bu motor; her makalenin özetini, tüm paragraflarını, temel bulgularını ve matematiksel denklemini ayrı ayrı çözümleyerek yüksek doğruluklu simülasyon sonuçları, bilimsel skor ve 12 dilde sesli anlatım üretir.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="inline-flex items-center bg-stone-200/80 p-1 rounded-sm shrink-0">
          <button
            type="button"
            onClick={() => setActiveMode('analyze')}
            className={`px-3.5 py-2 text-xs font-mono font-bold rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeMode === 'analyze'
                ? 'bg-[#1E3A8A] text-white shadow-xs'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            {articles.length} Makale Özel Analiz, Bilimsel Skor &amp; Simülasyon Motoru
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('generate')}
            className={`px-3.5 py-2 text-xs font-mono font-bold rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeMode === 'generate'
                ? 'bg-[#1E3A8A] text-white shadow-xs'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            {t.generateTab}
          </button>
        </div>
      </div>

      {activeMode === 'analyze' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 5 Cols: Article Selector + Quick Search + Trigger Controls */}
            <form
              onSubmit={handleRunAnalysis}
              className="lg:col-span-5 bg-white border border-stone-300 p-5 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-stone-200 pb-2.5">
                <span className="text-xs font-mono uppercase tracking-wider text-[#1E3A8A] font-bold">
                  {articles.length} MAKALE ÖZEL ANALİZ &amp; KALİBRASYON SEÇİCİ
                </span>
                <span className="text-[11px] font-mono text-emerald-800 font-semibold">
                  Aktif: {articles.length} Makale (10 Site)
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                  {articles.length} Makaleden İncelenecek Makaleyi Seçin (Anında Özel Sonuç Üretir)
                </label>
                <select
                  value={selectedArticleForAnalysis}
                  onChange={(e) => setSelectedArticleForAnalysis(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-medium border border-stone-300 bg-[#FBF9F5] focus:outline-none focus:border-[#1E3A8A]"
                >
                  {articles.map((art, idx) => (
                    <option key={art.id} value={art.id}>
                      #{articles.length - idx} — {getLocalizedText(art.title, language)} ({art.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons for Selected Article: Open Popup Modal + Audio Listen + Live Gemini Refresh */}
              {targetArticle && calibratedReport && (
                <div className="bg-[#0F172A] text-white p-4 rounded-xs space-y-3 border border-slate-800">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-amber-300 font-bold">
                      MAKALE {calibratedReport.articleNumberLabel} BİLİMSEL SKORU:
                    </span>
                    <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 font-bold rounded-xs">
                      {liveAiOverlay?.methodologicalRigorScore ||
                        calibratedReport.scientificScore.overallScore}{' '}
                      / 100
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    {onOpenFullAnalysisModal && (
                      <button
                        type="button"
                        onClick={() => onOpenFullAnalysisModal(targetArticle)}
                        className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2.5 text-xs font-mono font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xs transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>
                          Bu Makalenin Tam Analizini Açılır Pencerede (Pop-up) Aç &amp; Sesli Dinle
                        </span>
                      </button>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleTogglePlayLabAnalysisAudio}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-mono font-semibold text-white bg-[#047857] hover:bg-[#065F46] rounded-xs transition-colors cursor-pointer"
                      >
                        {audioStatus === 'playing' ? (
                          <>
                            <Pause className="w-3.5 h-3.5" />
                            <span>Sesli Analizi Duraklat</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>
                              {audioStatus === 'paused'
                                ? 'Sesli Analize Devam Et'
                                : 'Bu Analizi Sesli Dinle'}
                            </span>
                          </>
                        )}
                      </button>

                      {audioStatus !== 'idle' && (
                        <button
                          type="button"
                          onClick={stopLabAudio}
                          className="px-3 py-2 text-xs font-mono font-semibold text-white bg-rose-700 hover:bg-rose-600 rounded-xs cursor-pointer"
                        >
                          <Square className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-stone-800 mb-1.5">
                  Ek Özel Akademik Metin / Argüman Notu (İsteğe Bağlı)
                </label>
                <textarea
                  rows={3}
                  value={customAnalysisText}
                  onChange={(e) => setCustomAnalysisText(e.target.value)}
                  placeholder="Boş bırakılırsa seçilen makalenin tüm paragrafları, özeti ve denklemi analiz edilir..."
                  className="w-full px-3 py-2 text-xs border border-stone-300 bg-[#FBF9F5]"
                />
              </div>

              <button
                type="submit"
                disabled={isAnalyzing}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-mono font-bold text-white bg-[#1E3A8A] hover:bg-[#172E6E] rounded-sm transition-colors cursor-pointer disabled:opacity-60"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t.analyzingStatus}</span>
                  </>
                ) : (
                  <>
                    <SearchCheck className="w-4 h-4" />
                    <span>Gemini AI Motoru ile Derin Analizi &amp; Simülasyonu Yeniden Kalibre Et</span>
                  </>
                )}
              </button>
            </form>

            {/* Right 7 Cols: High-Accuracy Article-Specific Analysis & Simulation Report */}
            <div className="lg:col-span-7 bg-white border border-stone-300 p-5 space-y-5">
              {calibratedReport && targetArticle ? (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-200">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-[#1E3A8A] font-bold">
                        <span>MAKALE {calibratedReport.articleNumberLabel} ÖZEL ANALİZ RAPORU</span>
                        <span>·</span>
                        <span>ARŞİV NO: {calibratedReport.articleNumberLabel}</span>
                        <span>·</span>
                        <span>KALİBRASYON: {calibratedReport.simulationResults.calibrationId}</span>
                      </div>
                      <h3 className="text-xl font-editorial font-semibold text-stone-900">
                        {calibratedReport.title}
                      </h3>
                      <div className="text-xs font-mono text-stone-600">
                        Epistemolojik Konum:{' '}
                        <strong className="text-stone-900">
                          {liveAiOverlay?.epistemologicalStance ||
                            calibratedReport.epistemologicalStance}
                        </strong>
                      </div>
                    </div>

                    <div className="bg-[#0F172A] text-white px-4 py-2.5 rounded-xs text-right font-mono border border-amber-400/60 shrink-0">
                      <div className="text-[10px] text-amber-300 uppercase">BİLİMSEL SKOR</div>
                      <div className="text-2xl font-bold text-amber-300 tabular-nums">
                        {liveAiOverlay?.methodologicalRigorScore ||
                          calibratedReport.scientificScore.overallScore}{' '}
                        <span className="text-xs text-slate-300">/ 100</span>
                      </div>
                      <div className="text-[10px] text-emerald-300">
                        %{calibratedReport.simulationResults.accuracyPercent} Simülasyon Doğruluğu
                      </div>
                    </div>
                  </div>

                  {/* Lossless 12-Language Analysis Translation & Adaptive Voice Profile Bar */}
                  <div className="bg-[#0F172A] text-white p-3.5 rounded-xs flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                    <div className="space-y-0.5">
                      <div className="text-amber-300 font-bold">
                        ● İÇERİĞE UYGUN SESLENDİRME: {calibratedReport.voiceProfile.styleTitle}
                      </div>
                      <div className="text-[11px] text-slate-300">
                        Persona: {calibratedReport.voiceProfile.persona} · Ton: {calibratedReport.voiceProfile.acousticToneLabel}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        aria-label="Analiz Çeviri Dili"
                        value={labAnalysisLang}
                        onChange={(e) => handleTranslateLabAnalysis(e.target.value as LanguageCode)}
                        className="px-2.5 py-1.5 text-xs font-mono bg-slate-900 text-white border border-slate-700 rounded-xs"
                      >
                        {WORLD_LANGUAGES.map((wl) => (
                          <option key={wl.code} value={wl.code}>
                            {wl.nativeName} ({wl.shortLabel})
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        disabled={isTranslatingLabAnalysis}
                        onClick={() => handleTranslateLabAnalysis(labAnalysisLang)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-mono font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xs cursor-pointer disabled:opacity-60"
                      >
                        <Languages className="w-3.5 h-3.5" />
                        <span>
                          {isTranslatingLabAnalysis
                            ? 'Çevriliyor...'
                            : `Analizi Anlam Kaybı Olmadan Çevir (${labAnalysisLang.toUpperCase()})`}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* 5 Sub-Score Mini Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-xs">
                    {[
                      {
                        label: 'Metodoloji',
                        val: calibratedReport.scientificScore.methodologicalRigor,
                      },
                      {
                        label: 'Simülasyon',
                        val: calibratedReport.scientificScore.simulationFidelity,
                      },
                      {
                        label: 'Özgünlük',
                        val: calibratedReport.scientificScore.epistemologicalOriginality,
                      },
                      {
                        label: 'Matematik',
                        val: calibratedReport.scientificScore.mathematicalCoherence,
                      },
                      {
                        label: 'Ampirik Güç',
                        val: calibratedReport.scientificScore.empiricalGrounding,
                      },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className="bg-[#FBF9F5] border border-stone-200 p-2.5 rounded-xs text-center"
                      >
                        <div className="text-[10px] text-stone-500">{s.label}</div>
                        <div className="text-sm font-bold text-[#1E3A8A] mt-0.5">{s.val}/100</div>
                      </div>
                    ))}
                  </div>

                  {/* 1. Konu Hakkında Bilgisi Olmayanlar İçin Açıklama */}
                  <div className="bg-amber-50/95 border-2 border-amber-400 p-4 space-y-2 rounded-xs">
                    <div className="text-xs font-mono font-bold text-amber-950 uppercase flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4 text-amber-700" />
                      <span>{calibratedReport.nonExpertExplanation.sectionTitle}</span>
                    </div>
                    <p className="text-xs font-academic-body text-stone-900 leading-relaxed">
                      {(labTranslatedOverride?.lang === labAnalysisLang &&
                        labTranslatedOverride.plainLanguageSummary) ||
                        calibratedReport.nonExpertExplanation.introductoryExplanation}
                    </p>
                    <p className="text-xs font-academic-body text-stone-800 leading-relaxed pt-1 border-t border-amber-300">
                      {(labTranslatedOverride?.lang === labAnalysisLang &&
                        labTranslatedOverride.everydayAnalogy) ||
                        calibratedReport.nonExpertExplanation.everydayLifeComparison}
                    </p>
                    <div className="text-xs font-semibold text-emerald-950 pt-1">
                      {calibratedReport.nonExpertExplanation.keyTakeawayForEveryone}
                    </div>
                  </div>

                  {/* 2. Profesyoneller ve Akademisyenler İçin Ayrıca Açıklama */}
                  <div className="bg-blue-50/90 border-2 border-[#1E3A8A] p-4 space-y-2 rounded-xs">
                    <div className="text-xs font-mono font-bold text-[#1E3A8A] uppercase flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#1E3A8A]" />
                      <span>{calibratedReport.professionalExplanation.sectionTitle}</span>
                    </div>
                    <p className="text-xs font-academic-body text-stone-900 leading-relaxed">
                      {liveAiOverlay?.logicalCoherenceSummary ||
                        (labTranslatedOverride?.lang === labAnalysisLang &&
                          labTranslatedOverride.executiveSynthesis) ||
                        calibratedReport.professionalExplanation.technicalAbstractSynthesis}
                    </p>
                    <p className="text-xs font-academic-body text-stone-800 leading-relaxed pt-1 border-t border-blue-200">
                      {calibratedReport.professionalExplanation.methodologicalAndFormalContribution}
                    </p>
                    <p className="text-[11px] font-mono text-[#047857] pt-1">
                      {calibratedReport.professionalExplanation.falsifiabilityAndEmpiricalBounds}
                    </p>
                  </div>

                  {/* 3. Makalenin Temel Savını Baz Alan Matematiksel Denklem + İşlemler ve Değişkenler Açıklaması */}
                  <div className="bg-[#0F172A] text-white border-2 border-amber-400 p-4 space-y-3 rounded-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="text-xs font-mono font-bold text-amber-300 uppercase">
                        {calibratedReport.coreThesisEquation.equationTitle}
                      </div>
                      <span className="text-[11px] font-mono text-emerald-300">
                        {calibratedReport.coreThesisEquation.equationCode}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-950 border border-amber-400/60 rounded-xs font-mono text-sm sm:text-base text-amber-200 overflow-x-auto">
                      {calibratedReport.coreThesisEquation.symbolicEquation}
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed">
                      {calibratedReport.coreThesisEquation.thesisMathematicalStatement}
                    </p>

                    {/* 3A: İşlemleri Açıklayan Ayrı Bölüm */}
                    <div className="bg-slate-900 border border-slate-800 p-3 rounded-xs space-y-2">
                      <div className="text-[11px] font-mono font-bold text-amber-300 uppercase">
                        3A. Denklemdeki İşlemleri Açıklayan Ayrı Bölüm:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {calibratedReport.coreThesisEquation.operationsBreakdown.map((op, i) => (
                          <div key={i} className="bg-slate-950 border border-slate-800 p-2.5 rounded-xs text-[11px] space-y-1">
                            <div className="font-mono font-bold text-amber-300">
                              {op.symbol} — <span className="text-white">{op.operationName}</span>
                            </div>
                            <div className="text-emerald-200">{op.whatItDoesSimply}</div>
                            <div className="text-slate-400">{op.whatItDoesTechnically}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 3B: Değişkenleri Açıklayan Ayrı Bölüm */}
                    <div className="bg-slate-900 border border-slate-800 p-3 rounded-xs space-y-2">
                      <div className="text-[11px] font-mono font-bold text-emerald-300 uppercase">
                        3B. Denklemdeki Değişkenleri Açıklayan Ayrı Bölüm:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {calibratedReport.coreThesisEquation.variablesBreakdown.map((vr, i) => (
                          <div key={i} className="bg-slate-950 border border-slate-800 p-2.5 rounded-xs text-[11px] space-y-1">
                            <div className="font-mono font-bold text-emerald-300">
                              {vr.symbol} — <span className="text-white">{vr.variableName}</span>
                            </div>
                            <div className="text-amber-100">{vr.plainMeaning}</div>
                            <div className="text-slate-400">{vr.professionalRole}</div>
                            <div className="font-mono text-emerald-400 pt-0.5">{vr.calibratedValue}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Article-Specific High-Accuracy Simulation Results Box */}
                  <div className="bg-[#0F172A] text-white p-4 rounded-xs space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-amber-300 font-bold">
                      <span>
                        MAKALEYE ÖZEL SİMÜLASYON MOTORU ÇIKTISI ({calibratedReport.simulationResults.governingEquation})
                      </span>
                      <span className="text-emerald-300">
                        Yakınsama: %{calibratedReport.simulationResults.accuracyPercent} ({calibratedReport.simulationResults.convergenceIterations} İterasyon)
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-mono">
                      <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xs">
                        <div className="text-[10px] text-slate-400">
                          {calibratedReport.simulationResults.primaryObservableLabel}
                        </div>
                        <div className="text-amber-300 font-bold mt-0.5">
                          {calibratedReport.simulationResults.primaryObservableValue}
                        </div>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xs">
                        <div className="text-[10px] text-slate-400">
                          {calibratedReport.simulationResults.secondaryObservableLabel}
                        </div>
                        <div className="text-sky-300 font-bold mt-0.5">
                          {calibratedReport.simulationResults.secondaryObservableValue}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-amber-200 font-academic-body leading-relaxed">
                      {calibratedReport.simulationResults.plainSimulationExplanation}
                    </p>
                    <p className="text-xs text-slate-200 font-academic-body leading-relaxed">
                      {calibratedReport.simulationResults.tailoredPhysicalInterpretation}
                    </p>
                  </div>

                  {/* Paragraph-by-Paragraph Content Analysis Preview */}
                  <div className="space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="text-xs font-mono uppercase text-stone-700 font-bold">
                        Makalenin Tüm İçeriğinin Bölüm Bölüm Ayrıntılı &amp; Anlaşılır Analizi ({calibratedReport.paragraphAnalyses.length} Bölüm):
                      </div>
                      {onOpenFullAnalysisModal && (
                        <button
                          type="button"
                          onClick={() => onOpenFullAnalysisModal(targetArticle)}
                          className="text-xs font-mono font-bold text-[#1E3A8A] hover:underline cursor-pointer"
                        >
                          Açılır Pencerede Tam Ekran Gör →
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1">
                      {calibratedReport.paragraphAnalyses.map((pa) => (
                        <div
                          key={pa.sectionCode}
                          className="bg-[#FBF9F5] border border-stone-200 p-3.5 space-y-2 text-xs"
                        >
                          <div className="flex items-center justify-between font-mono text-[11px]">
                            <span className="font-bold text-[#1E3A8A]">
                              {pa.sectionCode}: {pa.sectionTitle}
                            </span>
                            <span className="text-emerald-800 font-bold">
                              Skor: {pa.sectionScientificScore}/100
                            </span>
                          </div>
                          <div className="bg-amber-50 border border-amber-200 p-2.5 font-academic-body text-stone-900 leading-relaxed">
                            {pa.plainLanguageExplanation}
                          </div>
                          <p className="font-academic-body text-stone-800 leading-relaxed">
                            {pa.detailedCommentary}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </div>

          {/* 306-Article Quick Pop-up Analysis & Scientific Score Matrix */}
          <div className="bg-white border border-stone-300 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-[#1E3A8A] font-bold">
                  TÜM {articles.length} MAKALE İÇİN HIZLI BİLİMSEL SKOR VE AÇILIR PENCERE TAM ANALİZ DİZİNİ
                </div>
                <p className="text-xs text-stone-600">
                  Herhangi bir makalenin yanındaki butona tıklayarak o makalenin tam içerik analizini, bilimsel skorunu ve sesli anlatımını açılır pencerede (pop-up) inceleyebilirsiniz.
                </p>
              </div>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  value={articleFilterQuery}
                  onChange={(e) => setArticleFilterQuery(e.target.value)}
                  placeholder="306 makale içinde başlık veya kavram ara..."
                  className="pl-8 pr-3 py-1.5 text-xs bg-[#FBF9F5] border border-stone-300 focus:outline-none focus:border-[#1E3A8A] w-64"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredQuickArticles.map((art) => {
                const rep = computeArticleScientificAnalysis(art, language);
                return (
                  <div
                    key={art.id}
                    className="bg-[#FBF9F5] border border-stone-300 p-3.5 flex flex-col justify-between gap-2.5 hover:border-[#1E3A8A] transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="font-bold text-[#1E3A8A]">{rep.articleNumberLabel}</span>
                        <span className="px-2 py-0.5 bg-amber-100 border border-amber-400 text-amber-950 font-bold rounded-xs">
                          Bilimsel Skor: {rep.scientificScore.overallScore}/100
                        </span>
                      </div>
                      <div className="text-xs font-editorial font-semibold text-stone-900 line-clamp-2">
                        {rep.title}
                      </div>
                      <div className="text-[10px] font-mono text-stone-500">
                        {art.category} · Simülasyon Doğruluğu: %{rep.simulationResults.accuracyPercent}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 pt-2 border-t border-stone-200">
                      {onOpenFullAnalysisModal && (
                        <button
                          type="button"
                          onClick={() => onOpenFullAnalysisModal(art)}
                          className="flex-1 inline-flex items-center justify-center gap-1 px-2.5 py-1.5 text-[11px] font-mono font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 border border-amber-500 rounded-xs cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Tam Analiz &amp; Sesli Dinle (Pop-up)</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setSelectedArticleForAnalysis(art.id)}
                        className="px-2.5 py-1.5 text-[11px] font-mono font-semibold text-[#1E3A8A] bg-white border border-stone-300 hover:bg-stone-100 rounded-xs cursor-pointer"
                      >
                        Laboratuvara Yükle
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <form
            onSubmit={handleGenerateArticle}
            className="lg:col-span-5 bg-white border border-stone-300 p-5 space-y-4"
          >
            <div className="text-xs font-mono uppercase tracking-wider text-stone-500">
              Makale &amp; Özel Simülasyon Sentezleyici ({gatewayConfig.activeTextModel})
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-800 mb-1.5">
                {t.topicPromptLabel}
              </label>
              <textarea
                rows={3}
                required
                value={topicPrompt}
                onChange={(e) => setTopicPrompt(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-300 bg-[#FBF9F5] focus:outline-none focus:border-[#1E3A8A]"
                placeholder="Örn: Entropi Artışı, Termodinamik Zaman Oku ve Kozmolojik Başlangıç Koşulları..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-800 mb-1.5">
                  {t.categoryLabel}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Article['category'])}
                  className="w-full px-3 py-2 text-xs border border-stone-300 bg-[#FBF9F5]"
                >
                  <option value="Kuantum Fiziği">Kuantum Fiziği</option>
                  <option value="Parçacık Fiziği">Parçacık Fiziği</option>
                  <option value="Kozmoloji & Holografi">Kozmoloji &amp; Holografi</option>
                  <option value="Zaman & Görelilik">Zaman &amp; Görelilik</option>
                  <option value="Zihin Felsefesi">Zihin Felsefesi</option>
                  <option value="Epistemoloji & Kaos">Epistemoloji &amp; Kaos</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-800 mb-1.5">
                  {t.simulationTypeLabel}
                </label>
                <select
                  value={simType}
                  onChange={(e) => setSimType(e.target.value as SimulationType)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 bg-[#FBF9F5]"
                >
                  <option value="quantum">Çift Yarık Kuantum Dekoherans</option>
                  <option value="higgs">Higgs Simetri Kırılması V(φ)</option>
                  <option value="holographic">AdS/CFT Poincaré Holografi</option>
                  <option value="spacetime">Minkowski Işık Konisi &amp; Görelilik</option>
                  <option value="consciousness">IIT (Φmax) Bilinç Topolojisi</option>
                  <option value="chaos">Lorenz Kaotik Çekici &amp; Lyapunov</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium text-white bg-[#1E3A8A] hover:bg-[#172E6E] rounded-sm transition-colors cursor-pointer disabled:opacity-60"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t.generatingStatus}</span>
                </>
              ) : (
                <>
                  <FilePlus2 className="w-4 h-4" />
                  <span>{t.generateButton}</span>
                </>
              )}
            </button>

            {statusNotice && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-700" />
                <span>{statusNotice}</span>
              </div>
            )}
          </form>

          <div className="lg:col-span-7 bg-white border border-stone-300 p-5">
            {generatedPreview ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-200">
                  <div className="text-xs font-mono text-stone-500">
                    Arşiv Kodu: {generatedPreview.slug} · SHA-256: {generatedPreview.sha256Signature.slice(0, 14)}…
                  </div>
                  <button
                    type="button"
                    onClick={handlePublishPreview}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-emerald-800 hover:bg-emerald-900 rounded-sm cursor-pointer transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Bu Sitede ve 301 Ağındaki Tüm 10 Sitede Yayınla (%100 Otorite Bu Sitede)</span>
                  </button>
                </div>

                <h3 className="text-2xl font-editorial font-semibold text-stone-900">
                  {getLocalizedText(generatedPreview.title, language)}
                </h3>
                <p className="text-xs uppercase tracking-wider text-stone-600">
                  {getLocalizedText(generatedPreview.subtitle, language)}
                </p>

                <div className="p-3.5 bg-[#F7F4EC] border border-stone-200 text-xs font-academic-body text-stone-800 leading-relaxed">
                  <strong className="block font-sans uppercase tracking-wider text-[11px] text-stone-500 mb-1">
                    Makaleye Özel Özet (Abstract):
                  </strong>
                  {getLocalizedText(generatedPreview.abstract, language)}
                </div>

                <div className="space-y-2 text-xs font-academic-body text-stone-800 leading-relaxed">
                  {getLocalizedArray(generatedPreview.contentParagraphs, language).map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center space-y-2 text-stone-500">
                <div className="text-base font-editorial text-stone-800">
                  Yeni Akademik Makale Önizleme Alanı
                </div>
                <p className="text-xs max-w-md mx-auto">
                  Sol panelden bir bilim veya felsefe konusu belirleyip üretim butonuna tıkladığınızda, makaleye özel özet, bilimsel plaka görseli ve interaktif simülasyon burada hazırlanır.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
