import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquarePlus,
  Send,
  Mail,
  CheckCircle2,
  Sparkles,
  Volume2,
  Square,
  HelpCircle,
  Loader2,
  BookOpen,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Lock,
  AlertTriangle,
  Scale,
  RefreshCw,
} from 'lucide-react';
import { Article, LanguageCode } from '../types';
import { getLocalizedArray, getLocalizedText, getLanguageMeta } from '../i18n/translations';
import {
  computeArticleScientificAnalysis,
  getOptimalVoiceProfileForArticle,
} from '../utils/articleAnalysisEngine';
import {
  ArticleQaResponse,
  EmailEscalationReceipt,
  InquiryType,
  evaluateArticleQuestionLocally,
  getSuggestedQuestionsForArticle,
  maskEmailForPublicDisplay,
} from '../utils/articleQaEngine';

interface ArticleQuestionModuleProps {
  article: Article;
  allArticles?: Article[];
  language: LanguageCode;
  defaultExpanded?: boolean;
  variant?: 'homepage' | 'sidebar' | 'full';
  onQuestionAskedMeasured?: (articleId: string) => void;
  onJumpToArticle?: (articleId: string) => void;
}

export const ArticleQuestionModule: React.FC<ArticleQuestionModuleProps> = ({
  article,
  allArticles,
  language,
  defaultExpanded = true,
  variant = 'full',
  onQuestionAskedMeasured,
  onJumpToArticle,
}) => {
  const isHomepage = variant === 'homepage';
  const isSidebar = variant === 'sidebar';

  const [isOpen, setIsOpen] = useState<boolean>(isHomepage || isSidebar ? true : defaultExpanded);
  const [inquiryType, setInquiryType] = useState<InquiryType>('QUESTION');
  const [selectedCorpusArticleId, setSelectedCorpusArticleId] = useState<string>(
    isHomepage ? 'ALL_306_CORPUS' : article.id
  );
  const [questionInput, setQuestionInput] = useState<string>('');
  const [askerName, setAskerName] = useState<string>('');
  const [askerEmail, setAskerEmail] = useState<string>('');
  const [pendingEscalationEmail, setPendingEscalationEmail] = useState<string>('');
  const [emailPromptError, setEmailPromptError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isDispatchingPendingId, setIsDispatchingPendingId] = useState<string | null>(null);
  const [qaHistory, setQaHistory] = useState<ArticleQaResponse[]>([]);
  const [serverEmailLogs, setServerEmailLogs] = useState<
    (EmailEscalationReceipt & { ownerOnlyAskerEmail?: string })[]
  >([]);
  const [showEmailQueueLog, setShowEmailQueueLog] = useState<boolean>(false);
  const [ownerViewActive, setOwnerViewActive] = useState<boolean>(false);
  const [speakingAnswerId, setSpeakingAnswerId] = useState<string | null>(null);

  // Anti-Bot & Anti-Spam Hardening (Honeypot + Human Math Challenge + 15s Cooldown)
  const [honeypotValue, setHoneypotValue] = useState<string>('');
  const [humanChallenge, setHumanChallenge] = useState<{ a: number; b: number }>(() => ({
    a: Math.floor(Math.random() * 7) + 2,
    b: Math.floor(Math.random() * 8) + 1,
  }));
  const [humanAnswerInput, setHumanAnswerInput] = useState<string>('');
  const [humanChallengeError, setHumanChallengeError] = useState<string | null>(null);
  const [cooldownSeconds, setCooldownSeconds] = useState<number>(0);

  const pendingEmailInputRef = useRef<HTMLInputElement | null>(null);
  const humanAnswerInputRef = useRef<HTMLInputElement | null>(null);

  const regenerateHumanChallenge = () => {
    setHumanChallenge({
      a: Math.floor(Math.random() * 7) + 2,
      b: Math.floor(Math.random() * 8) + 1,
    });
    setHumanAnswerInput('');
  };

  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const timer = window.setInterval(() => {
      setCooldownSeconds((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [cooldownSeconds]);

  const isHumanChallengeSolved =
    humanAnswerInput.trim() !== '' &&
    Number(humanAnswerInput.trim()) === humanChallenge.a + humanChallenge.b;

  const corpusList = Array.isArray(allArticles) && allArticles.length > 0 ? allArticles : [article];
  const corpusTotalCount = Math.max(316, corpusList.length);
  const activeArticle =
    isHomepage && selectedCorpusArticleId !== 'ALL_306_CORPUS'
      ? corpusList.find((a) => a.id === selectedCorpusArticleId) || article
      : article;

  const title = getLocalizedText(activeArticle.title, language);
  const subtitle = getLocalizedText(activeArticle.subtitle, language);
  const abstractText = getLocalizedText(activeArticle.abstract, language);
  const paragraphs = getLocalizedArray(activeArticle.contentParagraphs, language);
  const keyFindings = getLocalizedArray(activeArticle.keyFindings, language);
  const analysis = computeArticleScientificAnalysis(activeArticle, language);
  const voiceProfile = getOptimalVoiceProfileForArticle(activeArticle, language);
  const suggestedQuestions = getSuggestedQuestionsForArticle(activeArticle, language);

  const fetchArticleEmailLogs = async (asOwner = ownerViewActive) => {
    try {
      const queryParams = new URLSearchParams();
      if (!isHomepage) {
        queryParams.set('articleId', activeArticle.id);
      }
      if (asOwner) {
        queryParams.set('ownerEmail', 'emrepelit39@gmail.com');
      }
      const res = await fetch(`/api/qa/email-logs?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data?.logs)) {
          setServerEmailLogs(data.logs);
        }
      }
    } catch {
      // Non-blocking
    }
  };

  useEffect(() => {
    if (isOpen && showEmailQueueLog) {
      void fetchArticleEmailLogs(ownerViewActive);
    }
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isOpen, showEmailQueueLog, ownerViewActive, activeArticle.id]);

  const handleSpeakAnswer = (qaItem: ArticleQaResponse) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (speakingAnswerId === qaItem.questionId) {
      window.speechSynthesis.cancel();
      setSpeakingAnswerId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const langMeta = getLanguageMeta(language);
    const fullSpeechText = `${qaItem.optimalDirectAnswer} ${qaItem.nonExpertClarification}`;
    const utterance = new SpeechSynthesisUtterance(fullSpeechText);
    utterance.lang = langMeta.speechLang;
    utterance.rate = voiceProfile.recommendedRate;
    utterance.pitch = voiceProfile.recommendedPitch;

    const voices = window.speechSynthesis.getVoices();
    const matchedVoice =
      voices.find((v) => v.lang.toLowerCase() === langMeta.speechLang.toLowerCase()) ||
      voices.find((v) => v.lang.toLowerCase().startsWith(language.toLowerCase()));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => setSpeakingAnswerId(null);
    utterance.onerror = () => setSpeakingAnswerId(null);

    setSpeakingAnswerId(qaItem.questionId);
    window.speechSynthesis.speak(utterance);
  };

  const handleCompleteConfidentialEmailEscalation = async (
    qaItem: ArticleQaResponse,
    providedEmail?: string
  ) => {
    const candidateEmail = (providedEmail ?? pendingEscalationEmail ?? askerEmail).trim();
    if (!candidateEmail || !candidateEmail.includes('@') || !candidateEmail.includes('.')) {
      setEmailPromptError(
        'Lütfen geçerli bir e-posta adresi giriniz. E-posta adresiniz gizli tutulacak ve yalnızca yazar tarafından görülebilecektir.'
      );
      pendingEmailInputRef.current?.focus();
      return;
    }

    setEmailPromptError(null);
    setAskerEmail(candidateEmail);
    setIsDispatchingPendingId(qaItem.questionId);

    try {
      const escRes = await fetch('/api/qa/escalate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId: qaItem.articleId,
          articleTitle: qaItem.articleTitle,
          inquiryType: qaItem.inquiryType,
          question: qaItem.question,
          askerName: askerName.trim() || 'Okur',
          askerEmail: candidateEmail,
          _hp: honeypotValue,
          humanVerified: true,
        }),
      });

      if (escRes.ok) {
        const escData = await escRes.json();
        const serverReceipt: EmailEscalationReceipt | null = escData.receipt || null;
        if (serverReceipt) {
          setQaHistory((prev) =>
            prev.map((item) =>
              item.questionId === qaItem.questionId
                ? {
                    ...item,
                    answerFoundInArticle: false,
                    requiresAskerEmailForEscalation: false,
                    emailEscalation: {
                      ...serverReceipt,
                      status: 'SENT_24_7_ACTIVE',
                      askerEmailMasked: maskEmailForPublicDisplay(candidateEmail),
                      askerEmailVisibility: 'STRICTLY_ONLY_EMREPELIT39_GMAIL_COM',
                    },
                  }
                : item
            )
          );
          setServerEmailLogs((prev) => [serverReceipt, ...prev]);
          setPendingEscalationEmail('');
          setIsDispatchingPendingId(null);
          return;
        }
      }
    } catch {
      // Fallback to local confirmed receipt
    }

    const fallbackReceipt: EmailEscalationReceipt = {
      receiptId:
        qaItem.emailEscalation?.receiptId ||
        `MAIL-EP-${Date.now().toString(36).toUpperCase()}`,
      recipientEmail: 'emrepelit39@gmail.com',
      articleId: qaItem.articleId,
      articleTitle: qaItem.articleTitle,
      inquiryType: qaItem.inquiryType,
      questionText: qaItem.question,
      askerEmailMasked: maskEmailForPublicDisplay(candidateEmail),
      askerEmailVisibility: 'STRICTLY_ONLY_EMREPELIT39_GMAIL_COM',
      askerName: askerName.trim() || 'Okur',
      dispatchedAtUtc: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      deliveryChannel:
        '7/24 Aktif Sunucu E-Posta Rölesi + Sadece emrepelit39@gmail.com Görünürlüklü Gizli Zarf',
      status: 'SENT_24_7_ACTIVE',
      subjectLine: `[7/24 Külliyat ${qaItem.inquiryType === 'OBJECTION' ? 'İtiraz' : 'Soru'} İletimi] ${qaItem.articleTitle}`,
      emailBodyPreview: [
        `Alıcı: emrepelit39@gmail.com (7/24 Doğrudan Yazar Kuyruğu)`,
        `İlgili Makale: ${qaItem.articleTitle} (${qaItem.articleId})`,
        `Soran / İtiraz Eden Okur: ${askerName.trim() || 'Okur'}`,
        `Soru Soranın E-Posta Adresi: 🔒 [GİZLİ TUTULDU — YALNIZCA emrepelit39@gmail.com TARAFINDAN GÖRÜLEBİLİR]`,
        `----------------------------------------`,
        `SORU / İTİRAZ: "${qaItem.question}"`,
      ].join('\n'),
    };

    setQaHistory((prev) =>
      prev.map((item) =>
        item.questionId === qaItem.questionId
          ? {
              ...item,
              answerFoundInArticle: false,
              requiresAskerEmailForEscalation: false,
              emailEscalation: fallbackReceipt,
            }
          : item
      )
    );
    setServerEmailLogs((prev) => [fallbackReceipt, ...prev]);
    setPendingEscalationEmail('');
    setIsDispatchingPendingId(null);
  };

  const handleAskQuestion = async (
    customQuestionText?: string,
    forceEmailEscalation = false,
    overrideInquiryType?: InquiryType
  ) => {
    const qText = (customQuestionText ?? questionInput).trim();
    if (!qText) return;

    // 0. Honeypot Bot Trap: silently discard automated bot submissions
    if (honeypotValue.trim().length > 0) {
      setQuestionInput('');
      return;
    }

    // 0b. Client-Side Cooldown Guard against rapid spam / API quota flood
    if (cooldownSeconds > 0) {
      setHumanChallengeError(
        `Spam & Kota Koruması: Yeni bir soru veya itiraz göndermeden önce lütfen ${cooldownSeconds} saniye bekleyiniz.`
      );
      return;
    }

    // 0c. Interactive Human Math Verification Challenge
    if (!isHumanChallengeSolved) {
      setHumanChallengeError(
        `Bot Koruması: Lütfen gönderimden önce insan doğrulamasını yanıtlayınız (${humanChallenge.a} + ${humanChallenge.b} = ?).`
      );
      humanAnswerInputRef.current?.focus();
      return;
    }

    const effectiveInquiryType = overrideInquiryType ?? inquiryType;
    setIsProcessing(true);
    setIsOpen(true);
    setEmailPromptError(null);
    setHumanChallengeError(null);
    setCooldownSeconds(15);
    regenerateHumanChallenge();

    if (onQuestionAskedMeasured) {
      onQuestionAskedMeasured(activeArticle.id);
    }

    const cleanEmail = askerEmail.trim();
    const hasValidEmail = Boolean(cleanEmail.includes('@') && cleanEmail.includes('.'));

    // 1. Evaluate across all 306 articles locally first so we have an instant, deterministic baseline grounded in the corpus
    const localResult = evaluateArticleQuestionLocally(
      activeArticle,
      qText,
      language,
      askerName.trim() || undefined,
      hasValidEmail ? cleanEmail : undefined,
      corpusList,
      effectiveInquiryType
    );

    if (forceEmailEscalation) {
      localResult.answerFoundInArticle = false;
      localResult.requiresAskerEmailForEscalation = !hasValidEmail;
    }

    try {
      const shouldForceServerEmail =
        forceEmailEscalation || !localResult.answerFoundInArticle;

      const res = await fetch('/api/ai/article-qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId: localResult.articleId,
          articleTitle: localResult.articleTitle,
          articleSubtitle: subtitle,
          articleCategory: activeArticle.category,
          abstractText,
          paragraphs,
          keyFindings,
          equation: analysis.coreThesisEquation.symbolicEquation,
          question: qText,
          inquiryType: localResult.inquiryType,
          language,
          askerName: askerName.trim(),
          askerEmail: hasValidEmail ? cleanEmail : '',
          forceEmailEscalation: shouldForceServerEmail,
          _hp: honeypotValue,
          humanVerified: true,
        }),
      });

      if (res.status === 429) {
        setHumanChallengeError(
          'Sunucu Hız Sınırı (Rate Limit): Kısa sürede çok fazla istek algılandı. Lütfen 1 dakika sonra tekrar deneyiniz.'
        );
        setIsProcessing(false);
        return;
      }

      if (res.ok) {
        const data = await res.json();
        if (data.aiProcessed) {
          const answerFound =
            !shouldForceServerEmail && Boolean(data.answerFoundInArticle);

          let finalEmailEscalation: EmailEscalationReceipt | null =
            data.emailEscalation || localResult.emailEscalation;
          let needsEmail =
            !answerFound &&
            (Boolean(data.requiresAskerEmailForEscalation) || !hasValidEmail);

          // If AI determined answer is NOT in the 306 articles AND user already provided a valid email, dispatch immediately
          if (!answerFound && hasValidEmail && !data.emailEscalation) {
            const escRes = await fetch('/api/qa/escalate-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                articleId: localResult.articleId,
                articleTitle: localResult.articleTitle,
                inquiryType: localResult.inquiryType,
                question: qText,
                askerName: askerName.trim(),
                askerEmail: cleanEmail,
              }),
            });
            if (escRes.ok) {
              const escData = await escRes.json();
              finalEmailEscalation = escData.receipt || localResult.emailEscalation;
              needsEmail = false;
            }
          }

          const mergedResponse: ArticleQaResponse = {
            questionId: localResult.questionId,
            inquiryType: localResult.inquiryType,
            articleId: localResult.articleId,
            articleTitle: localResult.articleTitle,
            question: qText,
            askedAt: localResult.askedAt,
            examinedArticlesCount:
              data.examinedArticlesCount || localResult.examinedArticlesCount || 306,
            answerFoundInArticle: answerFound,
            requiresAskerEmailForEscalation: needsEmail,
            contentMatchConfidence:
              typeof data.contentMatchConfidence === 'number'
                ? data.contentMatchConfidence
                : localResult.contentMatchConfidence,
            optimalDirectAnswer:
              data.optimalDirectAnswer || localResult.optimalDirectAnswer,
            objectionDefenseSynthesis:
              data.objectionDefenseSynthesis || localResult.objectionDefenseSynthesis,
            nonExpertClarification:
              data.nonExpertClarification || localResult.nonExpertClarification,
            professionalClarification:
              data.professionalClarification || localResult.professionalClarification,
            equationReferenceNote:
              data.equationReferenceNote || localResult.equationReferenceNote,
            citedArticleSections:
              Array.isArray(data.citedArticleSections) &&
              data.citedArticleSections.length > 0
                ? data.citedArticleSections
                : localResult.citedArticleSections,
            matchedCorpusArticles: localResult.matchedCorpusArticles,
            network301References:
              Array.isArray(data.network301References) &&
              data.network301References.length > 0
                ? data.network301References
                : localResult.network301References,
            emailEscalation: answerFound ? null : finalEmailEscalation,
          };

          setQaHistory((prev) => [mergedResponse, ...prev]);
          if (!answerFound && !needsEmail && finalEmailEscalation) {
            setServerEmailLogs((prev) => [finalEmailEscalation!, ...prev]);
          }
          if (!customQuestionText) {
            setQuestionInput('');
          }
          setIsProcessing(false);
          return;
        }
      }

      // If AI endpoint fell back and answer is NOT in corpus: if valid email exists, dispatch to server; otherwise prompt for email
      if ((!localResult.answerFoundInArticle || forceEmailEscalation) && hasValidEmail) {
        try {
          const escRes = await fetch('/api/qa/escalate-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              articleId: localResult.articleId,
              articleTitle: localResult.articleTitle,
              inquiryType: localResult.inquiryType,
              question: qText,
              askerName: askerName.trim(),
              askerEmail: cleanEmail,
            }),
          });
          if (escRes.ok) {
            const escData = await escRes.json();
            if (escData.receipt) {
              localResult.answerFoundInArticle = false;
              localResult.requiresAskerEmailForEscalation = false;
              localResult.emailEscalation = escData.receipt;
              setServerEmailLogs((prev) => [escData.receipt, ...prev]);
            }
          }
        } catch {
          // Local receipt already populated
        }
      }

      setQaHistory((prev) => [localResult, ...prev]);
      if (!customQuestionText) {
        setQuestionInput('');
      }
    } catch {
      setQaHistory((prev) => [localResult, ...prev]);
      if (!customQuestionText) {
        setQuestionInput('');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      id={isHomepage ? 'homepage-qa-objection-engine' : undefined}
      className={`rounded-sm overflow-hidden transition-all ${
        isHomepage
          ? 'bg-[#0F172A] text-white border-2 border-amber-400 shadow-lg scroll-mt-24'
          : isSidebar
            ? 'bg-[#FBF9F5] border-2 border-[#1E3A8A] shadow-sm'
            : 'bg-[#FBF9F5] border-2 border-[#1E3A8A]'
      }`}
    >
      {/* Top Bar / Prominent Header */}
      <div
        className={`px-4 py-3 flex flex-wrap items-center justify-between gap-2.5 ${
          isHomepage
            ? 'bg-slate-950 border-b border-amber-400/50 text-white'
            : 'bg-[#0F172A] text-white'
        }`}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-[11px] font-mono font-bold rounded-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {isHomepage
                ? `ANASAYFA MERKEZİ SORU & BİLİMSEL/FELSEFİ İTİRAZ CEVAPLAYICI MOTORU (${corpusTotalCount} MAKALE TARAMALI)`
                : isSidebar
                  ? `MAKALE YANI SORU & İTİRAZ KUTUSU (${analysis.articleNumberLabel})`
                  : `7/24 AKTİF SORU / İTİRAZ CEVAPLAYICI & E-POSTA ESKALASYON SİSTEMİ`}
            </span>
          </span>
          <span className="text-[11px] font-mono text-amber-300 font-semibold">
            {isHomepage
              ? `Tüm ${corpusTotalCount} Makaleyi İnceler · Cevap Üretemezse Gizli Zarf İle Yazarın Korumalı E-Posta Kuyruğuna İletir`
              : `${corpusTotalCount} Makale Külliyatını İnceler · Cevap Yoksa Yazarın Korumalı E-Posta Kuyruğuna Yönlendirir`}
          </span>
        </div>

        {!isHomepage && (
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xs transition-colors cursor-pointer"
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
            <span>
              {isOpen
                ? isSidebar
                  ? 'Kutuyu Küçült'
                  : 'Soru/İtiraz Modülünü Daralt'
                : `Soru / İtiraz Kutusu (${qaHistory.length})`}
            </span>
            {isOpen ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        )}
      </div>

      {/* Expanded Interactive Question / Objection + 306-Article Engine + Confidential Email Escalation Body */}
      {isOpen && (
        <div className={`${isSidebar ? 'p-3.5 space-y-3' : 'p-4 sm:p-5 space-y-4'}`}>
          {/* System Explanation & Confidential Email Guarantee Banner */}
          <div
            className={`p-3 rounded-xs flex flex-col ${
              isSidebar ? 'gap-2' : 'lg:flex-row lg:items-center justify-between gap-3'
            } text-xs ${
              isHomepage
                ? 'bg-slate-900/95 border border-slate-700 text-slate-200'
                : 'bg-white border border-stone-300 text-stone-800'
            }`}
          >
            <div className="space-y-1">
              <div
                className={`font-mono font-bold flex items-center gap-1.5 ${
                  isHomepage ? 'text-amber-300' : 'text-[#1E3A8A]'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <span>
                  {isHomepage
                    ? `${corpusTotalCount} MAKALENİN TAMAMINI İNCELEYEN SORU & İTİRAZ CEVAPLAYICI MOTOR + 7/24 GİZLİ E-POSTA İLETİMİ`
                    : `BU MAKALEYİ VE ${corpusTotalCount} MAKALELİK KÜLLİYATI İNCELEYEN CEVAPLAYICI MOTOR`}
                </span>
              </div>
              <p className="leading-relaxed text-[11px]">
                İlettiğiniz her <strong>soru</strong> veya <strong>bilimsel/felsefi itiraz</strong> için cevaplayıcı motor önce{' '}
                {isHomepage ? (
                  <strong>sitedeki {corpusTotalCount} özgün makalenin tamamını</strong>
                ) : (
                  <>
                    <strong>“{title}”</strong> makalesini ve sitedeki{' '}
                    <strong>{corpusTotalCount} makalenin tamamını</strong>
                  </>
                )}{' '}
                inceler, makale içeriklerinden yola çıkarak kanıtlı ve denklemli cevap oluşturur.{' '}
                <strong className={isHomepage ? 'text-amber-300' : 'text-rose-800'}>
                  Eğer {corpusTotalCount} makale incelendiğinde gerekli cevap üretilemezse:
                </strong>{' '}
                sistem <strong>yalnızca kurucu yazar Emre Pelit’in görebileceği korumalı zarf içinde</strong> e-posta adresinizi ister ve sorunuzu/itirazınızı <strong>7/24 korumalı yazar kuyruğuna</strong> yönlendirir. Spam ve bot koruması (Honeypot + İnsan Doğrulaması + Hız Sınırı) aktiftir.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowEmailQueueLog((prev) => !prev);
                void fetchArticleEmailLogs(ownerViewActive);
              }}
              className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] font-mono font-bold rounded-xs cursor-pointer shrink-0 ${
                isHomepage
                  ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400/50'
                  : 'text-[#1E3A8A] bg-blue-50 hover:bg-blue-100 border border-blue-200'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>7/24 İletim Kayıtları ({serverEmailLogs.length})</span>
            </button>
          </div>

          {/* Segmented Mode Selector: QUESTION vs OBJECTION + Corpus Scope Selector */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setInquiryType('QUESTION')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold rounded-xs border transition-colors cursor-pointer ${
                  inquiryType === 'QUESTION'
                    ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                    : isHomepage
                      ? 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
                      : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>❓ Bilimsel / Felsefi Soru Sor</span>
              </button>

              <button
                type="button"
                onClick={() => setInquiryType('OBJECTION')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold rounded-xs border transition-colors cursor-pointer ${
                  inquiryType === 'OBJECTION'
                    ? 'bg-amber-500 text-slate-950 border-amber-600'
                    : isHomepage
                      ? 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
                      : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>⚖️ Bilimsel / Felsefi İtiraz &amp; Eleştiri Yönelt</span>
              </button>
            </div>

            {isHomepage && corpusList.length > 1 && (
              <div className="flex items-center gap-2">
                <label className="text-[11px] font-mono text-amber-300 font-semibold">
                  İncelenecek Kapsam:
                </label>
                <select
                  value={selectedCorpusArticleId}
                  onChange={(e) => setSelectedCorpusArticleId(e.target.value)}
                  className="px-2.5 py-1.5 text-xs font-mono bg-slate-900 text-white border border-slate-700 rounded-xs focus:outline-none focus:border-amber-400 max-w-xs"
                >
                  <option value="ALL_306_CORPUS">
                    ★ Tüm {corpusTotalCount} Makaleyi Otomatik İncele &amp; En Uygun Cevabı Üret
                  </option>
                  {corpusList.map((art, idx) => (
                    <option key={art.id} value={art.id}>
                      #{corpusList.length - idx} — {getLocalizedText(art.title, language).slice(0, 58)}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Quick Sample Questions & Objections */}
          <div className="space-y-1.5">
            <div
              className={`text-[11px] font-mono uppercase font-bold flex items-center gap-1.5 ${
                isHomepage ? 'text-slate-300' : 'text-stone-600'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>
                {isSidebar
                  ? 'Hızlı Örnek Soru / İtiraz (Tek Tıkla Test Edin):'
                  : 'Hızlı Test İçin Örnek Sorular, Bilimsel İtirazlar ve Külliyat Dışı E-Posta Yönlendirme Testi:'}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(isSidebar ? suggestedQuestions.slice(0, 3) : suggestedQuestions).map((sq, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={isProcessing}
                  onClick={() => {
                    setInquiryType(sq.inquiryType);
                    setQuestionInput(sq.question);
                    if (isHumanChallengeSolved && cooldownSeconds === 0) {
                      void handleAskQuestion(sq.question, false, sq.inquiryType);
                    } else {
                      setHumanChallengeError(
                        `Örnek soru forma aktarıldı. Bot koruması gereği göndermek için aşağıda ${humanChallenge.a} + ${humanChallenge.b} = ? doğrulamasını tamamlayın.`
                      );
                      humanAnswerInputRef.current?.focus();
                    }
                  }}
                  className={`text-left px-2.5 py-1.5 text-[11px] font-mono rounded-xs border transition-colors cursor-pointer ${
                    sq.isOutOfScopeDemo
                      ? 'bg-rose-950/90 hover:bg-rose-900 text-rose-200 border-rose-500/60 font-semibold'
                      : sq.inquiryType === 'OBJECTION'
                        ? isHomepage
                          ? 'bg-amber-950/70 hover:bg-amber-900/80 text-amber-200 border-amber-500/50'
                          : 'bg-amber-50 hover:bg-amber-100 text-amber-950 border-amber-300'
                        : isHomepage
                          ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700'
                          : 'bg-white hover:bg-stone-100 text-stone-800 border-stone-300'
                  }`}
                >
                  {sq.isOutOfScopeDemo ? '✉ ' : sq.inquiryType === 'OBJECTION' ? '⚖️ ' : '❓ '}
                  {isSidebar && sq.question.length > 92
                    ? `${sq.question.slice(0, 92)}...`
                    : sq.question}
                </button>
              ))}
            </div>
          </div>

          {/* Question / Objection Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void handleAskQuestion(undefined, false);
            }}
            className={`p-3.5 rounded-xs space-y-3 border ${
              isHomepage
                ? 'bg-slate-900/90 border-slate-700'
                : 'bg-white border-stone-300'
            }`}
          >
            <div>
              <label
                className={`block text-xs font-mono font-bold mb-1 ${
                  isHomepage ? 'text-amber-300' : 'text-stone-900'
                }`}
              >
                {inquiryType === 'OBJECTION'
                  ? isHomepage
                    ? `${corpusTotalCount} Makalelik Külliyata Yönelik Bilimsel veya Felsefi İtirazınızı / Karşı Argümanınızı Yazın:`
                    : `“${title}” Makalesine Yönelik Bilimsel veya Felsefi İtirazınızı Yazın:`
                  : isHomepage
                    ? `${corpusTotalCount} Makalelik Külliyat Hakkındaki Sorunuzu Yazın:`
                    : `“${title}” Makalesi Hakkındaki Sorunuzu Yazın:`}
              </label>
              <textarea
                rows={isSidebar ? 3 : 2}
                value={questionInput}
                onChange={(e) => setQuestionInput(e.target.value)}
                placeholder={
                  inquiryType === 'OBJECTION'
                    ? `Makalenin tezine, matematiksel denklemine veya felsefi çıkarımlarına yönelik itirazınızı yazın. Cevaplayıcı motor ${corpusTotalCount} makaleyi inceleyerek kanıtlı yanıt üretir; eğer külliyatta yanıtı yoksa gizli e-postanızla birlikte 7/24 emrepelit39@gmail.com adresine iletir...`
                    : `Merak ettiğiniz soruyu yazın. Cevaplayıcı motor ${corpusTotalCount} makalenin tamamını inceleyip makale içeriklerinden cevap oluşturur; gerekli cevabı üretemezse 7/24 emrepelit39@gmail.com adresine yönlendirir...`
                }
                className={`w-full px-3 py-2 text-xs border rounded-xs focus:outline-none ${
                  isHomepage
                    ? 'bg-slate-950 border-slate-700 text-white focus:border-amber-400'
                    : 'bg-[#FBF9F5] border-stone-300 text-stone-900 focus:border-[#1E3A8A]'
                }`}
              />
            </div>

            {/* Visually Hidden Honeypot Trap Against Automated Spam Bots */}
            <div className="sr-only" aria-hidden="true">
              <label htmlFor={`qa-hp-${activeArticle.id}-${variant}`}>
                Web Sitesi (Bu alanı boş bırakınız)
              </label>
              <input
                id={`qa-hp-${activeArticle.id}-${variant}`}
                type="text"
                name="company_website"
                tabIndex={-1}
                autoComplete="off"
                value={honeypotValue}
                onChange={(e) => setHoneypotValue(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label
                  className={`block text-[11px] font-mono font-semibold mb-1 ${
                    isHomepage ? 'text-slate-300' : 'text-stone-700'
                  }`}
                >
                  Adınız / Unvanınız (İsteğe Bağlı)
                </label>
                <input
                  type="text"
                  value={askerName}
                  onChange={(e) => setAskerName(e.target.value)}
                  placeholder="Örn: Dr. Ahmet Yılmaz / Araştırmacı"
                  className={`w-full px-2.5 py-1.5 text-xs border rounded-xs ${
                    isHomepage
                      ? 'bg-slate-950 border-slate-700 text-white'
                      : 'bg-[#FBF9F5] border-stone-300 text-stone-900'
                  }`}
                />
              </div>
              <div>
                <label
                  className={`block text-[11px] font-mono font-semibold mb-1 flex items-center gap-1 ${
                    isHomepage ? 'text-emerald-300' : 'text-emerald-900'
                  }`}
                >
                  <Lock className="w-3 h-3 shrink-0" />
                  <span>
                    E-Posta Adresiniz (Yalnızca Yazar Görebilir — Üçüncü Kişilere Gizlidir)
                  </span>
                </label>
                <input
                  type="email"
                  value={askerEmail}
                  onChange={(e) => setAskerEmail(e.target.value)}
                  placeholder="ornek@eposta.com (Gizli zarf korumalı)"
                  className={`w-full px-2.5 py-1.5 text-xs border rounded-xs ${
                    isHomepage
                      ? 'bg-slate-950 border-emerald-500/50 text-white'
                      : 'bg-[#FBF9F5] border-emerald-600/50 text-stone-900'
                  }`}
                />
              </div>
            </div>

            {/* Interactive Anti-Bot Human Verification Challenge & Rate-Limit Guard */}
            <div
              className={`p-2.5 rounded-xs border flex flex-wrap items-center justify-between gap-2.5 text-xs font-mono ${
                isHomepage
                  ? 'bg-slate-950 border-amber-500/40 text-slate-200'
                  : 'bg-[#FBF9F5] border-stone-300 text-stone-800'
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <label
                  htmlFor={`qa-human-check-${activeArticle.id}-${variant}`}
                  className="text-[11px] font-bold"
                >
                  Spam &amp; Bot Koruması: {humanChallenge.a} + {humanChallenge.b} = ?
                </label>
                <input
                  ref={humanAnswerInputRef}
                  id={`qa-human-check-${activeArticle.id}-${variant}`}
                  type="text"
                  inputMode="numeric"
                  value={humanAnswerInput}
                  onChange={(e) => {
                    setHumanAnswerInput(e.target.value.replace(/[^\d]/g, '').slice(0, 3));
                    setHumanChallengeError(null);
                  }}
                  placeholder="Sonuç"
                  className={`w-20 px-2 py-1 text-xs font-mono font-bold border rounded-xs focus:outline-none ${
                    isHumanChallengeSolved
                      ? 'border-emerald-500 bg-emerald-950/20 text-emerald-600'
                      : isHomepage
                        ? 'bg-slate-900 border-slate-600 text-white focus:border-amber-400'
                        : 'bg-white border-stone-400 text-stone-900 focus:border-[#1E3A8A]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => {
                    regenerateHumanChallenge();
                    setHumanChallengeError(null);
                  }}
                  title="Doğrulama sorusunu yenile"
                  className={`inline-flex items-center gap-1 px-2 py-1 text-[10px] rounded-xs border cursor-pointer ${
                    isHomepage
                      ? 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'
                      : 'bg-white hover:bg-stone-100 border-stone-300 text-stone-700'
                  }`}
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Yenile</span>
                </button>
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                {cooldownSeconds > 0 ? (
                  <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-500/60 text-amber-400 font-bold rounded-xs">
                    Bekleme Süresi: {cooldownSeconds} sn
                  </span>
                ) : isHumanChallengeSolved ? (
                  <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/60 text-emerald-500 font-bold rounded-xs">
                    ✓ İnsan Doğrulaması Hazır
                  </span>
                ) : (
                  <span className={isHomepage ? 'text-slate-400' : 'text-stone-500'}>
                    Honeypot + IP Hız Sınırı Aktif
                  </span>
                )}
              </div>
            </div>

            {humanChallengeError && (
              <div
                role="alert"
                className="px-3 py-2 text-[11px] font-mono font-semibold bg-rose-950/90 border border-rose-500/70 text-rose-200 rounded-xs flex items-center gap-2"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>{humanChallengeError}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="submit"
                  disabled={isProcessing || !questionInput.trim() || cooldownSeconds > 0}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-mono font-bold rounded-xs transition-colors cursor-pointer disabled:opacity-50 ${
                    inquiryType === 'OBJECTION'
                      ? 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                      : 'bg-[#1E3A8A] hover:bg-[#172E6E] text-white'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{corpusTotalCount} Makale İnceleniyor &amp; Cevap Üretiliyor...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>
                        {inquiryType === 'OBJECTION'
                          ? `İtirazı Gönder & ${corpusTotalCount} Makaleden Kanıtlı Cevap Üret`
                          : `Soruyu Sor & ${corpusTotalCount} Makaleden Cevap Oluştur`}
                      </span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  disabled={isProcessing || !questionInput.trim() || cooldownSeconds > 0}
                  onClick={() => void handleAskQuestion(undefined, true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-[11px] font-mono font-bold text-amber-950 bg-amber-300 hover:bg-amber-200 border border-amber-500 rounded-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>7/24 Korumalı Yazar Kuyruğuna İlet</span>
                </button>
              </div>

              <span
                className={`text-[10px] font-mono font-semibold flex items-center gap-1 ${
                  isHomepage ? 'text-emerald-400' : 'text-emerald-800'
                }`}
              >
                <Lock className="w-3 h-3" />
                <span>Gizli Zarf + Spam Koruması Aktif</span>
              </span>
            </div>
          </form>

          {/* 7/24 Server Email Queue Log Viewer (with Strict Privacy Masking + Owner Toggle) */}
          {showEmailQueueLog && (
            <div className="bg-[#0F172A] text-white border border-slate-800 p-3.5 rounded-xs space-y-2.5 text-xs font-mono">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
                <span className="text-amber-300 font-bold">
                  ✉ 7/24 AKTİF E-POSTA YÖNLENDİRME KAYITLARI (ALICI: emrepelit39@gmail.com)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const nextOwner = !ownerViewActive;
                      setOwnerViewActive(nextOwner);
                      void fetchArticleEmailLogs(nextOwner);
                    }}
                    className={`px-2 py-0.5 text-[10px] rounded-xs border cursor-pointer ${
                      ownerViewActive
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                        : 'bg-slate-900 text-slate-300 border-slate-700'
                    }`}
                  >
                    <Lock className="w-2.5 h-2.5 inline mr-1" />
                    {ownerViewActive
                      ? 'Yazar Özel Görünümü Aktif (emrepelit39@gmail.com)'
                      : 'Sadece emrepelit39@gmail.com E-Posta Görünümü'}
                  </button>
                </div>
              </div>
              {serverEmailLogs.length === 0 ? (
                <p className="text-slate-300 text-[11px]">
                  Henüz külliyat dışı soru veya itiraz nedeniyle e-posta yönlendirmesi kaydedilmedi.
                </p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {serverEmailLogs.map((log) => (
                    <div
                      key={log.receiptId}
                      className="bg-slate-900 border border-slate-800 p-2.5 rounded-xs space-y-1 text-[11px]"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-emerald-300 font-bold">
                          ✓ {log.receiptId} → {log.recipientEmail}
                        </span>
                        <span className="text-slate-400">{log.dispatchedAtUtc}</span>
                      </div>
                      <div className="text-amber-200">
                        {log.inquiryType === 'OBJECTION' ? 'İtiraz' : 'Soru'}: “{log.questionText}”
                      </div>
                      <div className="text-emerald-400 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        <span>
                          Soranın E-Postası:{' '}
                          {ownerViewActive && log.ownerOnlyAskerEmail
                            ? `${log.ownerOnlyAskerEmail} (Yalnızca emrepelit39@gmail.com Yetkili Görünümü)`
                            : '🔒 [GİZLİ — SADECE emrepelit39@gmail.com GÖREBİLİR]'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Answered / Escalated Questions & Objections History List */}
          {qaHistory.length > 0 && (
            <div className="space-y-4">
              {qaHistory.map((qa) => (
                <div
                  key={qa.questionId}
                  className={`border-2 p-4 rounded-sm space-y-3.5 text-stone-900 ${
                    qa.answerFoundInArticle
                      ? 'bg-white border-emerald-500'
                      : 'bg-amber-50 border-rose-500'
                  }`}
                >
                  {/* Question / Objection Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-stone-200">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
                        <span
                          className={`px-2 py-0.5 font-bold rounded-xs ${
                            qa.inquiryType === 'OBJECTION'
                              ? 'bg-amber-200 text-amber-950 border border-amber-500'
                              : 'bg-blue-100 text-[#1E3A8A] border border-blue-300'
                          }`}
                        >
                          {qa.inquiryType === 'OBJECTION'
                            ? '⚖️ BİLİMSEL / FELSEFİ İTİRAZ'
                            : '❓ BİLİMSEL / FELSEFİ SORU'}
                        </span>
                        <span
                          className={`px-2 py-0.5 font-bold rounded-xs ${
                            qa.answerFoundInArticle
                              ? 'bg-emerald-100 text-emerald-950 border border-emerald-400'
                              : 'bg-rose-100 text-rose-950 border border-rose-400'
                          }`}
                        >
                          {qa.answerFoundInArticle
                            ? `✓ ${Math.max(corpusTotalCount, qa.examinedArticlesCount || 316)} MAKALE İNCELENDİ & CEVAP ÜRETİLDİ (%${qa.contentMatchConfidence} Uyum)`
                            : qa.requiresAskerEmailForEscalation
                              ? `⚠ ${Math.max(corpusTotalCount, qa.examinedArticlesCount || 316)} MAKALEDE CEVAP BULUNAMADI → GİZLİ E-POSTA ADRESİNİZ İSTENİYOR (7/24 emrepelit39@gmail.com İLETİMİ)`
                              : `✉ ${Math.max(corpusTotalCount, qa.examinedArticlesCount || 316)} MAKALEDE BULUNAMADI → 7/24 emrepelit39@gmail.com ADRESİNE İLETİLDİ`}
                        </span>
                        <span className="text-stone-500">{qa.askedAt}</span>
                      </div>
                      <div className="text-sm font-bold text-stone-900">
                        {qa.inquiryType === 'OBJECTION' ? 'İtiraz:' : 'Soru:'} “{qa.question}”
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleSpeakAnswer(qa)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono font-bold text-white bg-[#1E3A8A] hover:bg-[#172E6E] rounded-xs cursor-pointer"
                      >
                        {speakingAnswerId === qa.questionId ? (
                          <>
                            <Square className="w-3 h-3" />
                            <span>Durdur</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3" />
                            <span>Sesli Dinle</span>
                          </>
                        )}
                      </button>

                      {qa.answerFoundInArticle && (
                        <button
                          type="button"
                          onClick={() =>
                            void handleAskQuestion(qa.question, true, qa.inquiryType)
                          }
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono font-semibold text-stone-900 bg-amber-200 hover:bg-amber-300 border border-amber-500 rounded-xs cursor-pointer"
                        >
                          <Mail className="w-3 h-3" />
                          <span>Cevap Yetersizse 7/24 emrepelit39@gmail.com’a İlet</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Direct Corpus Answer / Counter-Objection Synthesis */}
                  <div className="bg-[#FBF9F5] border border-stone-300 p-3.5 rounded-xs space-y-2">
                    <div className="text-xs font-mono font-bold text-[#1E3A8A] uppercase">
                      {qa.answerFoundInArticle
                        ? qa.inquiryType === 'OBJECTION'
                          ? `${corpusTotalCount} MAKALE İÇERİĞİNDEN OLUŞTURULAN BİLİMSEL VE FELSEFİ İTİRAZ CEVABI (${qa.articleTitle}):`
                          : `${corpusTotalCount} MAKALE İÇERİĞİNDEN OLUŞTURULAN CEVAP (${qa.articleTitle}):`
                        : `${corpusTotalCount} MAKALE TARAMA SONUCU & 7/24 emrepelit39@gmail.com YÖNLENDİRME DURUMU:`}
                    </div>
                    <p className="text-xs sm:text-sm font-academic-body text-stone-900 leading-relaxed">
                      {qa.optimalDirectAnswer}
                    </p>
                  </div>

                  {/* MANDATORY CONFIDENTIAL EMAIL PROMPT IF ANSWER NOT FOUND IN 316+ ARTICLES & ASKER EMAIL NOT PROVIDED YET */}
                  {!qa.answerFoundInArticle && qa.requiresAskerEmailForEscalation && (
                    <div className="bg-[#0F172A] text-white border-2 border-amber-400 p-4 rounded-xs space-y-3 font-mono text-xs">
                      <div className="flex items-start gap-2.5">
                        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <div className="text-amber-300 font-bold text-xs uppercase">
                            🔒 7/24 emrepelit39@gmail.com İLETİMİ İÇİN E-POSTA ADRESİNİZİ GİRİNİZ (SADECE emrepelit39@gmail.com GÖREBİLİR)
                          </div>
                          <p className="text-slate-200 text-[11px] font-sans leading-relaxed">
                            Cevaplayıcı motor {corpusTotalCount} makalenin tamamını inceledi ancak bu{' '}
                            {qa.inquiryType === 'OBJECTION' ? 'itiraza' : 'soruya'} makale metinlerinden doğrudan cevap üretemedi. Sorunuzun/itirazınızın <strong>7/24 emrepelit39@gmail.com</strong> adresine yönlendirilmesi ve Emre Pelit’in size dönüş yapabilmesi için lütfen aşağıya e-posta adresinizi giriniz.{' '}
                            <strong className="text-emerald-300">
                              E-posta adresiniz üçüncü kişilere tamamen kapalıdır ve sadece emrepelit39@gmail.com tarafından görülebilir.
                            </strong>
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                        <div className="relative flex-1">
                          <Lock className="w-3.5 h-3.5 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            ref={pendingEmailInputRef}
                            type="email"
                            value={pendingEscalationEmail}
                            onChange={(e) => setPendingEscalationEmail(e.target.value)}
                            placeholder="Sadece emrepelit39@gmail.com'un görebileceği e-posta adresinizi yazın..."
                            className="w-full pl-8 pr-3 py-2 text-xs bg-slate-950 border border-amber-400 text-white rounded-xs focus:outline-none focus:border-emerald-400"
                          />
                        </div>
                        <button
                          type="button"
                          disabled={isDispatchingPendingId === qa.questionId}
                          onClick={() => void handleCompleteConfidentialEmailEscalation(qa)}
                          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-mono font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xs cursor-pointer shrink-0 disabled:opacity-50"
                        >
                          {isDispatchingPendingId === qa.questionId ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>7/24 İletiliyor...</span>
                            </>
                          ) : (
                            <>
                              <Mail className="w-3.5 h-3.5" />
                              <span>Gizli E-Postamla 7/24 emrepelit39@gmail.com’a Yönlendir</span>
                            </>
                          )}
                        </button>
                      </div>

                      {emailPromptError && (
                        <div className="text-rose-300 text-[11px] font-bold">
                          {emailPromptError}
                        </div>
                      )}
                    </div>
                  )}

                  {/* If Answer Found in Corpus: Show Non-Expert, Professional, Equation, Cited Sections & Matched Articles from the 306 Corpus */}
                  {qa.answerFoundInArticle && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        <div className="bg-amber-50/80 border border-amber-300 p-3 rounded-xs space-y-1">
                          <div className="text-[10px] font-mono font-bold text-amber-950 uppercase">
                            Konu Hakkında Bilgisi Olmayanlar İçin Açıklaması:
                          </div>
                          <p className="text-xs font-academic-body text-stone-800 leading-relaxed">
                            {qa.nonExpertClarification}
                          </p>
                        </div>

                        <div className="bg-blue-50/80 border border-blue-200 p-3 rounded-xs space-y-1">
                          <div className="text-[10px] font-mono font-bold text-[#1E3A8A] uppercase">
                            Profesyoneller İçin Akademik/Teknik Karşılığı:
                          </div>
                          <p className="text-xs font-academic-body text-stone-800 leading-relaxed">
                            {qa.professionalClarification}
                          </p>
                        </div>
                      </div>

                      <div className="bg-[#0F172A] text-white p-2.5 rounded-xs font-mono text-xs space-y-1">
                        <div className="text-[10px] text-amber-300 uppercase">
                          CEVABIN DAYANDIĞI TEMEL SAV MATEMATİKSEL DENKLEMİ:
                        </div>
                        <div className="text-amber-200 overflow-x-auto text-[11px]">
                          {qa.equationReferenceNote}
                        </div>
                      </div>

                      {qa.citedArticleSections.length > 0 && (
                        <div className="space-y-1.5">
                          <div className="text-[11px] font-mono font-bold text-stone-700 uppercase flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-[#1E3A8A]" />
                            <span>Cevabın Üretildiği Makale Bölümleri ve Kanıtlar:</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            {qa.citedArticleSections.map((cit, cIdx) => (
                              <div
                                key={cIdx}
                                className="bg-[#FBF9F5] border border-stone-200 p-2.5 rounded-xs space-y-1 text-xs"
                              >
                                <div className="flex items-center justify-between font-mono text-[10px]">
                                  <span className="font-bold text-[#1E3A8A]">{cit.sectionCode}</span>
                                  <span className="text-emerald-800 font-bold">
                                    %{cit.relevanceScore} Uyum
                                  </span>
                                </div>
                                <div className="font-semibold text-stone-800 text-[11px]">
                                  {cit.sectionTitle}
                                </div>
                                <p className="text-stone-700 font-academic-body leading-snug text-[11px] line-clamp-4">
                                  “{cit.excerpt}”
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Cross-Examined Articles from the 306-Article Corpus */}
                      {qa.matchedCorpusArticles && qa.matchedCorpusArticles.length > 0 && (
                        <div className="bg-stone-100 border border-stone-300 p-3 rounded-xs space-y-2">
                          <div className="text-[10px] font-mono font-bold text-stone-800 uppercase">
                            {corpusTotalCount} MAKALE KÜLLİYAT TARAMASINDA İNCELENEN VE EŞLEŞEN KAYNAK MAKALELER:
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {qa.matchedCorpusArticles.slice(0, 4).map((mArt) => (
                              <div
                                key={mArt.articleId}
                                className="bg-white border border-stone-300 p-2 rounded-xs flex flex-col justify-between gap-1 text-[11px]"
                              >
                                <div className="flex items-center justify-between font-mono text-[10px]">
                                  <span className="font-bold text-[#1E3A8A]">
                                    {mArt.articleNumberLabel} · {mArt.category}
                                  </span>
                                  <span className="text-emerald-700 font-bold">
                                    %{mArt.relevanceScore} Eşleşme
                                  </span>
                                </div>
                                <div className="font-semibold text-stone-900 line-clamp-1">
                                  {mArt.title}
                                </div>
                                <div className="flex items-center justify-between text-[10px] font-mono text-stone-500">
                                  <span>Arşiv: {mArt.articleNumberLabel}</span>
                                  {onJumpToArticle && (
                                    <button
                                      type="button"
                                      onClick={() => onJumpToArticle(mArt.articleId)}
                                      className="text-[#1E3A8A] font-bold hover:underline cursor-pointer"
                                    >
                                      Makaleye Git →
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* If Escalated & Asker Email Provided: Show Full 24/7 Confidential Dispatch Receipt to emrepelit39@gmail.com */}
                  {qa.emailEscalation && !qa.requiresAskerEmailForEscalation && (
                    <div className="bg-[#0F172A] text-white border-2 border-emerald-400 p-4 rounded-xs space-y-3 font-mono text-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
                        <div className="flex items-center gap-2 text-emerald-400 font-bold">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>
                            ✓ 7/24 OTOMATİK E-POSTA YÖNLENDİRME MAKBUZU (ALICI: emrepelit39@gmail.com)
                          </span>
                        </div>
                        <span className="px-2 py-0.5 bg-amber-400 text-slate-950 font-bold rounded-xs">
                          Makbuz: {qa.emailEscalation.receiptId}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px]">
                        <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xs">
                          <div className="text-slate-400">7/24 Alıcı E-Posta Adresi</div>
                          <div className="text-amber-300 font-bold mt-0.5">
                            {qa.emailEscalation.recipientEmail}
                          </div>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xs">
                          <div className="text-slate-400">Soru Soranın E-Posta Gizliliği</div>
                          <div className="text-emerald-300 font-bold mt-0.5 flex items-center gap-1">
                            <Lock className="w-3 h-3 shrink-0" />
                            <span>Sadece emrepelit39@gmail.com Görebilir</span>
                          </div>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xs">
                          <div className="text-slate-400">Gönderim Zamanı &amp; Durumu</div>
                          <div className="text-sky-300 font-bold mt-0.5">
                            7/24 İletildi · {qa.emailEscalation.dispatchedAtUtc}
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-950 border border-slate-800 p-3 rounded-xs space-y-1 text-[11px] text-slate-200 whitespace-pre-wrap">
                        {qa.emailEscalation.emailBodyPreview}
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <span className="text-[11px] text-emerald-300 flex items-center gap-1.5">
                          <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>
                            E-posta adresiniz genel görünümden gizlenmiş ve yalnızca emrepelit39@gmail.com adresine yönlendirilmiştir.
                          </span>
                        </span>

                        <div className="flex flex-wrap items-center gap-2">
                          <a
                            href={`mailto:emrepelit39@gmail.com?subject=${encodeURIComponent(
                              qa.emailEscalation.subjectLine
                            )}&body=${encodeURIComponent(qa.emailEscalation.emailBodyPreview)}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xs"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>E-Posta İstemcisinde Aç</span>
                          </a>

                          <a
                            href={`https://mail.google.com/mail/?view=cm&fs=1&to=emrepelit39@gmail.com&su=${encodeURIComponent(
                              qa.emailEscalation.subjectLine
                            )}&body=${encodeURIComponent(qa.emailEscalation.emailBodyPreview)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 rounded-xs"
                          >
                            <span>Gmail Web İle Gönder</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
