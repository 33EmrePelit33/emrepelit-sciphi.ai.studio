import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Atom,
  Clock,
  Compass,
  Puzzle,
  Play,
  Pause,
  RotateCcw,
  ShieldCheck,
  ArrowUpRight,
  CheckCircle2,
  CircleDot,
} from 'lucide-react';
import { Article, LanguageCode } from '../types';
import { getLocalizedArray, getLocalizedText } from '../i18n/translations';
import { MathFormula } from './MathFormula';

interface InteractiveAppsSuiteProps {
  articles: Article[];
  language: LanguageCode;
  onJumpToArticle: (articleId: string) => void;
  onAppInteractionMeasured?: (appId: string, summary: string) => void;
}

type ActiveAppId = 'quantum-lab' | 'relativity-calc' | 'philosophy-explorer' | 'concept-challenge';

interface PhilosophicalTopicSpec {
  id: string;
  titleTr: string;
  titleEn: string;
  questionTr: string;
  questionEn: string;
  keyword: string;
  perspectives: {
    nameTr: string;
    nameEn: string;
    summaryTr: string;
    summaryEn: string;
    empiricalWeight: number;
    rationalWeight: number;
    phenomenalWeight: number;
  }[];
}

const PHILOSOPHY_TOPICS: PhilosophicalTopicSpec[] = [
  {
    id: 'mind-body',
    titleTr: 'Zihin, Bilinç ve Fiziksel Gerçeklik',
    titleEn: 'Mind, Consciousness & Physical Reality',
    questionTr: 'Öznel bilinç deneyimi (qualia) fiziksel ve enformasyonel süreçlerle nasıl ilişkilidir?',
    questionEn: 'How does subjective conscious experience relate to physical and informational dynamics?',
    keyword: 'bilinç',
    perspectives: [
      {
        nameTr: 'Bütünleşik Enformasyon Yaklaşımı',
        nameEn: 'Integrated Information View',
        summaryTr: 'Bilinç, sistem içi nedensel enformasyon entegrasyonunun (Φ) yapısal bir özelliği olarak değerlendirilir.',
        summaryEn: 'Consciousness is analyzed as an intrinsic property of integrated causal information (Φ).',
        empiricalWeight: 65,
        rationalWeight: 85,
        phenomenalWeight: 55,
      },
      {
        nameTr: 'Fenomenolojik & Deneyimsel Öncelik',
        nameEn: 'Phenomenological Primacy',
        summaryTr: 'Birinci şahıs öznel farkındalık, üçüncü şahıs nesnel ölçümlere indirgenemeyen temel bir gözlem alanıdır.',
        summaryEn: 'First-person subjective awareness serves as an irreducible experiential starting point.',
        empiricalWeight: 30,
        rationalWeight: 60,
        phenomenalWeight: 95,
      },
      {
        nameTr: 'Hesaplamalı İşlevselcilik',
        nameEn: 'Computational Functionalism',
        summaryTr: 'Bilişsel durumlar, fiziksel taşıyıcıdan bağımsız algoritmik örüntüler ve geri besleme döngüleri olarak incelenir.',
        summaryEn: 'Mental states are studied as substrate-independent algorithmic patterns and feedback loops.',
        empiricalWeight: 85,
        rationalWeight: 75,
        phenomenalWeight: 25,
      },
    ],
  },
  {
    id: 'time-ontology',
    titleTr: 'Zamanın Oku, Blok Evren ve Oluş',
    titleEn: 'Arrow of Time, Block Universe & Becoming',
    questionTr: 'Zaman akışı evrenin temel bir niteliği mi yoksa entropik ve göreceli bir perspektif midir?',
    questionEn: 'Is temporal flow fundamental to reality or an entropic and relativistic emergent perspective?',
    keyword: 'zaman',
    perspectives: [
      {
        nameTr: 'Dört Boyutlu Blok Uzay-Zaman (Ebedîcilik)',
        nameEn: 'Four-Dimensional Block Spacetime',
        summaryTr: 'Geçmiş, şimdi ve gelecek Minkowski geometrisinin eşit derecede gerçek kesitleri olarak ele alınır.',
        summaryEn: 'Past, present, and future coexist symmetrically as geometric coordinates in spacetime.',
        empiricalWeight: 75,
        rationalWeight: 95,
        phenomenalWeight: 20,
      },
      {
        nameTr: 'Termodinamik & Entropik Zaman Oku',
        nameEn: 'Thermodynamic Entropic Arrow',
        summaryTr: 'Zamanın yönelimi düşük entropili başlangıç koşullarından yüksek entropiye doğru olasılıksal evrimden doğar.',
        summaryEn: 'Temporal directionality arises statistically from low-entropy boundaries toward higher entropy.',
        empiricalWeight: 95,
        rationalWeight: 70,
        phenomenalWeight: 40,
      },
      {
        nameTr: 'Yaşanan Şimdi (Şimdicilik & Süre)',
        nameEn: 'Lived Present & Process Philosophy',
        summaryTr: 'Zaman yalnızca soyut bir koordinat değil, sürekli yenilenen bilinçli deneyimin dinamik dokusudur.',
        summaryEn: 'Time is experienced dynamically as continuous becoming rather than a static geometric parameter.',
        empiricalWeight: 35,
        rationalWeight: 55,
        phenomenalWeight: 95,
      },
    ],
  },
  {
    id: 'determinism-freedom',
    titleTr: 'Determinizm, Kaos ve Düşünce Özgürlüğü',
    titleEn: 'Determinism, Chaos & Freedom of Inquiry',
    questionTr: 'Doğrusal olmayan karmaşıklık ve kuantum belirsizlik altında insani seçim ve sorgulama nasıl konumlanır?',
    questionEn: 'How do human agency and open inquiry fit within nonlinear chaos and quantum indeterminacy?',
    keyword: 'kaos',
    perspectives: [
      {
        nameTr: 'Epistemolojik Açıklık & Çoğulculuk',
        nameEn: 'Epistemic Openness & Pluralism',
        summaryTr: 'Hiçbir model gerçekliği tek başına tüketmez; özgür eleştiri bilimsel bilginin zorunlu güvencesidir.',
        summaryEn: 'No single model exhausts reality; open criticism safeguards scientific discovery.',
        empiricalWeight: 70,
        rationalWeight: 85,
        phenomenalWeight: 80,
      },
      {
        nameTr: 'Belirlenimci Kaos ve Öngörü Sınırı',
        nameEn: 'Deterministic Chaos & Horizon Bounds',
        summaryTr: 'Yasalar deterministik görünse bile başlangıç hassasiyeti pratikte sonsuz çeşitlilik ve öngörü ufku yaratır.',
        summaryEn: 'Even deterministic equations yield practical unpredictability beyond short Lyapunov horizons.',
        empiricalWeight: 90,
        rationalWeight: 85,
        phenomenalWeight: 35,
      },
      {
        nameTr: 'Kuantum Olasılıkçı Esneklik',
        nameEn: 'Quantum Probabilistic Openness',
        summaryTr: 'Mikroskobik düzeydeki olasılıksal süreçler katı Laplaceçı mekanizmanın ötesinde yeni yorum alanları açar.',
        summaryEn: 'Microscopic indeterminacy invites non-mechanistic interpretations beyond rigid determinism.',
        empiricalWeight: 80,
        rationalWeight: 65,
        phenomenalWeight: 65,
      },
    ],
  },
];

export const InteractiveAppsSuite: React.FC<InteractiveAppsSuiteProps> = ({
  articles,
  language,
  onJumpToArticle,
  onAppInteractionMeasured,
}) => {
  const isTr = language === 'tr';
  const [activeApp, setActiveApp] = useState<ActiveAppId>('quantum-lab');

  // --- App 1: Quantum Interference Lab State ---
  const [wavelengthNm, setWavelengthNm] = useState<number>(532);
  const [slitMicrons, setSlitMicrons] = useState<number>(4.5);
  const [decoherencePct, setDecoherencePct] = useState<number>(15);
  const [waveAnimating, setWaveAnimating] = useState<boolean>(false);
  const [wavePhase, setWavePhase] = useState<number>(0);
  const waveCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // --- App 2: Relativity Calculator State ---
  const [velocityRatio, setVelocityRatio] = useState<number>(0.8);
  const [properYears, setProperYears] = useState<number>(5);
  const [gravPotentialRatio, setGravPotentialRatio] = useState<number>(0.08);

  // --- App 3: Epistemological Argument Explorer State ---
  const [selectedTopicId, setSelectedTopicId] = useState<string>('mind-body');
  const [empiricalPref, setEmpiricalPref] = useState<number>(70);
  const [rationalPref, setRationalPref] = useState<number>(75);
  const [phenomenalPref, setPhenomenalPref] = useState<number>(60);

  // --- App 4: Concept & Equation Matcher Game State ---
  const [challengeSeed, setChallengeSeed] = useState<number>(0);
  const [challengeSelectedIdx, setChallengeSelectedIdx] = useState<number | null>(null);
  const [challengeScore, setChallengeScore] = useState<{ correct: number; attempts: number }>({
    correct: 0,
    attempts: 0,
  });

  // Quantum animation timer (runs only when user toggles animate)
  useEffect(() => {
    if (!waveAnimating || activeApp !== 'quantum-lab') return;
    const id = window.setInterval(() => {
      setWavePhase((p) => (p + 0.14) % (Math.PI * 20));
    }, 45);
    return () => window.clearInterval(id);
  }, [waveAnimating, activeApp]);

  // Draw Quantum Interference Heatmap + Curve
  useEffect(() => {
    if (activeApp !== 'quantum-lab') return;
    const canvas = waveCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 680;
    const H = 260;
    ctx.fillStyle = '#070C18';
    ctx.fillRect(0, 0, W, H);

    const coherence = Math.max(0, 1 - decoherencePct / 100);
    const kFactor = (slitMicrons * 560) / wavelengthNm;

    // Color wavelength tint
    const waveHue =
      wavelengthNm < 470
        ? '#38BDF8'
        : wavelengthNm < 560
          ? '#34D399'
          : wavelengthNm < 620
            ? '#FBBF24'
            : '#F87171';

    // Top band: visual interference fringe strip
    const stripY = 20;
    const stripH = 54;
    for (let x = 24; x < W - 24; x += 2) {
      const xNorm = (x - W / 2) / 110;
      const env = Math.exp(-xNorm * xNorm * 0.42);
      const fringe =
        0.5 +
        0.5 *
          coherence *
          Math.cos(kFactor * xNorm * 2.8 - wavePhase * 0.6);
      const intensity = Math.min(1, Math.max(0.04, env * fringe));
      ctx.fillStyle = waveHue;
      ctx.globalAlpha = intensity;
      ctx.fillRect(x, stripY, 2, stripH);
    }
    ctx.globalAlpha = 1;
    ctx.strokeStyle = '#334155';
    ctx.strokeRect(24, stripY, W - 48, stripH);

    // Coordinate axes for probability curve
    const baseLine = H - 28;
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(24, baseLine);
    ctx.lineTo(W - 24, baseLine);
    ctx.moveTo(W / 2, 92);
    ctx.lineTo(W / 2, baseLine);
    ctx.stroke();

    // Draw Born Probability Curve |Ψ(x)|²
    ctx.beginPath();
    ctx.strokeStyle = waveHue;
    ctx.lineWidth = 2.6;
    for (let x = 24; x <= W - 24; x += 2) {
      const xNorm = (x - W / 2) / 110;
      const env = Math.exp(-xNorm * xNorm * 0.42);
      const interference =
        coherence * Math.cos(kFactor * xNorm * 2.8 - wavePhase * 0.6);
      const prob = Math.max(0, env * (1 + interference) * 0.5);
      const py = baseLine - prob * 132;
      if (x === 24) ctx.moveTo(x, py);
      else ctx.lineTo(x, py);
    }
    ctx.stroke();

    ctx.fillStyle = '#CBD5E1';
    ctx.font = '11px monospace';
    ctx.fillText(
      `λ = ${wavelengthNm} nm · d = ${slitMicrons.toFixed(1)} μm · Eşevrelilik = %${(coherence * 100).toFixed(0)}`,
      26,
      H - 8
    );
  }, [activeApp, wavelengthNm, slitMicrons, decoherencePct, wavePhase]);

  // Relativity computed metrics
  const relativityStats = useMemo(() => {
    const beta = Math.min(0.995, Math.max(0, velocityRatio));
    const lorentzGamma = 1 / Math.sqrt(1 - beta * beta);
    const gravFactor = 1 / Math.sqrt(Math.max(0.05, 1 - gravPotentialRatio));
    const totalDilation = lorentzGamma * gravFactor;
    const earthYearsElapsed = properYears * totalDilation;
    const coneAngleDeg = Math.atan(beta) * (180 / Math.PI);
    return {
      lorentzGamma,
      gravFactor,
      totalDilation,
      earthYearsElapsed,
      coneAngleDeg,
    };
  }, [velocityRatio, properYears, gravPotentialRatio]);

  // Philosophy Topic Alignment & Matching Articles
  const activePhilosophyTopic = useMemo(
    () => PHILOSOPHY_TOPICS.find((t) => t.id === selectedTopicId) || PHILOSOPHY_TOPICS[0],
    [selectedTopicId]
  );

  const scoredPerspectives = useMemo(() => {
    return activePhilosophyTopic.perspectives
      .map((p) => {
        const dist =
          Math.abs(p.empiricalWeight - empiricalPref) +
          Math.abs(p.rationalWeight - rationalPref) +
          Math.abs(p.phenomenalWeight - phenomenalPref);
        const alignment = Math.max(15, Math.round(100 - dist / 3));
        return { ...p, alignment };
      })
      .sort((a, b) => b.alignment - a.alignment);
  }, [activePhilosophyTopic, empiricalPref, rationalPref, phenomenalPref]);

  const relatedTopicArticles = useMemo(() => {
    const kw =
      activeApp === 'quantum-lab'
        ? 'kuantum'
        : activeApp === 'relativity-calc'
          ? 'zaman'
          : activePhilosophyTopic.keyword;
    const matched = articles.filter((art) => {
      const title = getLocalizedText(art.title, 'tr').toLowerCase();
      const cat = art.category.toLowerCase();
      return title.includes(kw) || cat.includes(kw);
    });
    return (matched.length > 0 ? matched : articles).slice(0, 3);
  }, [activeApp, articles, activePhilosophyTopic.keyword]);

  // Challenge App derived question
  const currentChallenge = useMemo(() => {
    if (!articles || articles.length === 0) return null;
    const safeTotal = articles.length;
    const targetIdx = (challengeSeed * 17 + 5) % safeTotal;
    const targetArt = articles[targetIdx];
    const findings = getLocalizedArray(targetArt.keyFindings, language);
    const clue =
      findings[0] ||
      getLocalizedText(targetArt.abstract, language) ||
      getLocalizedText(targetArt.title, language);

    const distractorIndices = [
      (targetIdx + 19) % safeTotal,
      (targetIdx + 47) % safeTotal,
      (targetIdx + 83) % safeTotal,
    ];
    const pool = [targetArt, ...distractorIndices.map((idx) => articles[idx])];
    const shift = (challengeSeed + targetIdx) % pool.length;
    const options = pool.map((_, i) => pool[(i + shift) % pool.length]);
    const correctIndex = options.findIndex((a) => a.id === targetArt.id);

    return {
      targetArt,
      clue: clue.length > 180 ? `${clue.slice(0, 178)}…` : clue,
      equation: targetArt.simulation?.equationLatex || 'Ψ(x,t)',
      options,
      correctIndex: Math.max(0, correctIndex),
    };
  }, [articles, challengeSeed, language]);

  const appTabs: { id: ActiveAppId; titleTr: string; titleEn: string; icon: React.ReactNode }[] = [
    {
      id: 'quantum-lab',
      titleTr: '1. Kuantum Girişim Lab',
      titleEn: '1. Quantum Interference Lab',
      icon: <Atom className="w-3.5 h-3.5" />,
    },
    {
      id: 'relativity-calc',
      titleTr: '2. Uzay-Zaman & Relativite',
      titleEn: '2. Spacetime & Relativity',
      icon: <Clock className="w-3.5 h-3.5" />,
    },
    {
      id: 'philosophy-explorer',
      titleTr: '3. Felsefi Perspektif Atölyesi',
      titleEn: '3. Philosophical Perspective Explorer',
      icon: <Compass className="w-3.5 h-3.5" />,
    },
    {
      id: 'concept-challenge',
      titleTr: '4. Külliyat Kavram Oyunu',
      titleEn: '4. Corpus Concept Challenge',
      icon: <Puzzle className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <section
      id="interactive-apps"
      aria-label={isTr ? 'Web Sitesi İnteraktif Bilim ve Felsefe Uygulamaları' : 'Interactive Science & Philosophy Apps'}
      className="bg-white border border-stone-300 rounded-sm overflow-hidden scroll-mt-24"
    >
      {/* Top Studio Header */}
      <div className="px-6 py-4 bg-[#0F172A] text-white border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-300 font-semibold">
            {isTr
              ? 'WEB SİTESİ İNTERAKTİF UYGULAMALAR MERKEZİ · %100 TARAYICI İÇİ · TELİFSİZ'
              : 'INTERACTIVE SCIENCE & PHILOSOPHY APPS SUITE · 100% BROWSER-NATIVE'}
          </div>
          <h2 className="text-xl sm:text-2xl font-editorial font-bold text-white">
            {isTr
              ? 'Etkileşimli Bilim, Fizik & Felsefe Uygulamaları (4 Modül)'
              : 'Interactive Science, Physics & Philosophy Applications (4 Modules)'}
          </h2>
        </div>

        {/* App Selector Segmented Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
          {appTabs.map((tab) => {
            const active = activeApp === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveApp(tab.id);
                  onAppInteractionMeasured?.(
                    tab.id,
                    `İnteraktif Uygulama Açıldı (${isTr ? tab.titleTr : tab.titleEn})`
                  );
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xs border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-emerald-400 text-slate-950 border-emerald-300 font-extrabold'
                    : 'bg-slate-900 text-slate-200 border-slate-700 hover:bg-slate-800'
                }`}
              >
                {tab.icon}
                <span>{isTr ? tab.titleTr : tab.titleEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* App 1: Quantum Double-Slit & Interference Lab */}
      {activeApp === 'quantum-lab' && (
        <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start bg-[#FBF9F5]">
          <div className="lg:col-span-7 space-y-3">
            <div className="bg-[#070C18] border border-slate-800 rounded-xs p-3">
              <canvas
                ref={waveCanvasRef}
                width={680}
                height={260}
                className="w-full h-auto block"
                aria-label="Kuantum çift yarık girişim simülasyon kanvası"
              />
            </div>

            <div className="grid grid-cols-3 gap-3 font-mono text-xs tabular-nums">
              <div className="bg-white border border-stone-300 p-3">
                <div className="text-[11px] text-stone-500">
                  {isTr ? 'Girişim Görünürlüğü' : 'Fringe Visibility'}
                </div>
                <div className="text-lg font-bold text-[#1E3A8A]">
                  %{(100 - decoherencePct).toFixed(0)}
                </div>
              </div>
              <div className="bg-white border border-stone-300 p-3">
                <div className="text-[11px] text-stone-500">
                  {isTr ? 'Saçak Frekans Katsayısı' : 'Fringe Frequency'}
                </div>
                <div className="text-lg font-bold text-emerald-800">
                  {((slitMicrons * 560) / wavelengthNm).toFixed(2)} rad⁻¹
                </div>
              </div>
              <div className="bg-white border border-stone-300 p-3">
                <div className="text-[11px] text-stone-500">
                  {isTr ? 'Dalga Durumu' : 'Wave Regime'}
                </div>
                <div className="text-sm font-bold text-stone-900 mt-1">
                  {decoherencePct < 45
                    ? isTr
                      ? '● Kuantum Süperpozisyon'
                      : '● Quantum Interference'
                    : isTr
                      ? '▲ Klasik Olasılık Baskın'
                      : '▲ Classical Mixture'}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white border border-stone-300 p-5 space-y-4">
            <div className="space-y-1">
              <h3 className="text-lg font-editorial font-bold text-stone-900">
                {isTr ? 'Çift Yarık & Dekoherans Parametreleri' : 'Double-Slit & Decoherence Controls'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {isTr
                  ? 'Dalga boyu, yarık aralığı ve ölçüm eşleşmesini değiştirerek kuantum olasılık deseninin klasik dağılıma dönüşümünü inceleyin.'
                  : 'Adjust wavelength, slit distance, and measurement coupling to observe transitions between wave interference and classical distributions.'}
              </p>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <label className="block space-y-1">
                <span className="flex justify-between text-stone-800 font-semibold">
                  <span>{isTr ? 'Dalga Boyu (λ)' : 'Wavelength (λ)'}</span>
                  <span className="tabular-nums text-[#1E3A8A]">{wavelengthNm} nm</span>
                </span>
                <input
                  type="range"
                  min={380}
                  max={700}
                  step={5}
                  value={wavelengthNm}
                  onChange={(e) => {
                    setWavelengthNm(Number(e.target.value));
                    onAppInteractionMeasured?.('quantum-lab', 'Kuantum Lab dalga boyu ayarlandı');
                  }}
                  className="w-full cursor-pointer"
                />
              </label>

              <label className="block space-y-1">
                <span className="flex justify-between text-stone-800 font-semibold">
                  <span>{isTr ? 'Yarık Ayrımı (d)' : 'Slit Separation (d)'}</span>
                  <span className="tabular-nums text-[#1E3A8A]">{slitMicrons.toFixed(1)} μm</span>
                </span>
                <input
                  type="range"
                  min={1.5}
                  max={9.0}
                  step={0.5}
                  value={slitMicrons}
                  onChange={(e) => setSlitMicrons(Number(e.target.value))}
                  className="w-full cursor-pointer"
                />
              </label>

              <label className="block space-y-1">
                <span className="flex justify-between text-stone-800 font-semibold">
                  <span>{isTr ? 'Gözlemci Dekoheransı (γ)' : 'Observer Decoherence (γ)'}</span>
                  <span className="tabular-nums text-[#1E3A8A]">%{decoherencePct}</span>
                </span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={decoherencePct}
                  onChange={(e) => setDecoherencePct(Number(e.target.value))}
                  className="w-full cursor-pointer"
                />
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setWaveAnimating((p) => !p)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-mono font-bold text-white bg-[#1E3A8A] hover:bg-[#172E6E] rounded-xs cursor-pointer"
              >
                {waveAnimating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{waveAnimating ? (isTr ? 'Dalgayı Durdur' : 'Pause Wave') : isTr ? 'Dalgayı Canlandır' : 'Animate Wave'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setWavelengthNm(532);
                  setSlitMicrons(4.5);
                  setDecoherencePct(15);
                  setWaveAnimating(false);
                  setWavePhase(0);
                }}
                className="inline-flex items-center gap-1 px-3 py-2 text-xs font-mono text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-xs cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isTr ? 'Sıfırla' : 'Reset'}</span>
              </button>
            </div>

            <div className="pt-3 border-t border-stone-200 space-y-1.5">
              <div className="text-[11px] font-mono text-stone-500 uppercase">
                {isTr ? 'İlgili Makaleler' : 'Related Corpus Articles'}
              </div>
              {relatedTopicArticles.map((art) => (
                <button
                  key={art.id}
                  type="button"
                  onClick={() => onJumpToArticle(art.id)}
                  className="w-full text-left text-xs text-[#1E3A8A] hover:underline flex items-center justify-between gap-2 cursor-pointer"
                >
                  <span className="truncate">{getLocalizedText(art.title, language)}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* App 2: Relativity & Minkowski Light-Cone Calculator */}
      {activeApp === 'relativity-calc' && (
        <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start bg-[#FBF9F5]">
          <div className="lg:col-span-6 bg-[#070C18] border border-slate-800 p-4 rounded-xs space-y-3">
            <svg viewBox="0 0 420 260" className="w-full h-auto block">
              <line x1="210" y1="15" x2="210" y2="245" stroke="#334155" strokeDasharray="4 3" />
              <line x1="20" y1="130" x2="400" y2="130" stroke="#334155" strokeDasharray="4 3" />
              {/* Future & Past Light Cones */}
              <polygon points="210,130 110,20 310,20" fill="rgba(56,189,248,0.12)" stroke="#38BDF8" strokeWidth="1.8" />
              <polygon points="210,130 110,240 310,240" fill="rgba(245,158,11,0.08)" stroke="#F59E0B" strokeWidth="1.4" />
              {/* Worldline of Traveler */}
              <line
                x1="210"
                y1="130"
                x2={210 + Math.round(velocityRatio * 95)}
                y2="24"
                stroke="#34D399"
                strokeWidth="3"
              />
              <circle
                cx={210 + Math.round(velocityRatio * 95)}
                cy="24"
                r="5"
                fill="#34D399"
              />
              <text x="218" y="26" fill="#38BDF8" className="text-[11px] font-mono">
                ct (Gelecek Işık Konisi)
              </text>
              <text x="330" y="122" fill="#94A3B8" className="text-[11px] font-mono">
                x (Uzay)
              </text>
              <text x="20" y="250" fill="#34D399" className="text-[11px] font-mono">
                Dünya Çizgisi Eğimi: {relativityStats.coneAngleDeg.toFixed(1)}° · γ = {relativityStats.lorentzGamma.toFixed(3)}
              </text>
            </svg>
          </div>

          <div className="lg:col-span-6 bg-white border border-stone-300 p-5 space-y-4">
            <div>
              <h3 className="text-lg font-editorial font-bold text-stone-900">
                {isTr ? 'Özel & Genel Görelilik Zaman Hesaplayıcısı' : 'Relativistic Time Dilation Calculator'}
              </h3>
              <p className="text-xs text-stone-600">
                <MathFormula tex="\Delta t = \frac{\Delta\tau}{\sqrt{1 - v^2/c^2} \cdot \sqrt{1 - r_s/r}}" />
              </p>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <label className="block space-y-1">
                <span className="flex justify-between font-semibold">
                  <span>{isTr ? 'Göreceli Hız (v / c)' : 'Velocity Ratio (v / c)'}</span>
                  <span className="text-[#1E3A8A] tabular-nums">{velocityRatio.toFixed(3)} c</span>
                </span>
                <input
                  type="range"
                  min={0}
                  max={0.99}
                  step={0.01}
                  value={velocityRatio}
                  onChange={(e) => {
                    setVelocityRatio(Number(e.target.value));
                    onAppInteractionMeasured?.('relativity-calc', 'Relativite hesaplayıcısı güncellendi');
                  }}
                  className="w-full cursor-pointer"
                />
              </label>

              <label className="block space-y-1">
                <span className="flex justify-between font-semibold">
                  <span>{isTr ? 'Kütleçekim Potansiyeli (r_s / r)' : 'Gravitational Potential (r_s / r)'}</span>
                  <span className="text-[#1E3A8A] tabular-nums">{gravPotentialRatio.toFixed(2)}</span>
                </span>
                <input
                  type="range"
                  min={0}
                  max={0.75}
                  step={0.01}
                  value={gravPotentialRatio}
                  onChange={(e) => setGravPotentialRatio(Number(e.target.value))}
                  className="w-full cursor-pointer"
                />
              </label>

              <label className="block space-y-1">
                <span className="flex justify-between font-semibold">
                  <span>{isTr ? 'Yolcu Öz-Zamanı (Δτ)' : 'Traveler Proper Time (Δτ)'}</span>
                  <span className="text-[#1E3A8A] tabular-nums">{properYears} {isTr ? 'yıl' : 'yrs'}</span>
                </span>
                <input
                  type="range"
                  min={1}
                  max={25}
                  step={1}
                  value={properYears}
                  onChange={(e) => setProperYears(Number(e.target.value))}
                  className="w-full cursor-pointer"
                />
              </label>
            </div>

            <div className="grid grid-cols-3 gap-3 font-mono text-xs tabular-nums">
              <div className="bg-[#FBF9F5] border border-stone-200 p-3">
                <div className="text-[11px] text-stone-500">Lorentz γ</div>
                <div className="text-lg font-bold text-[#1E3A8A]">{relativityStats.lorentzGamma.toFixed(3)}</div>
              </div>
              <div className="bg-[#FBF9F5] border border-stone-200 p-3">
                <div className="text-[11px] text-stone-500">{isTr ? 'Toplam Genleşme' : 'Total Factor'}</div>
                <div className="text-lg font-bold text-emerald-800">{relativityStats.totalDilation.toFixed(3)}×</div>
              </div>
              <div className="bg-[#FBF9F5] border border-stone-200 p-3">
                <div className="text-[11px] text-stone-500">{isTr ? 'Uzak Gözlemci (Δt)' : 'Observer Time'}</div>
                <div className="text-lg font-bold text-stone-900">
                  {relativityStats.earthYearsElapsed.toFixed(2)} {isTr ? 'yıl' : 'yr'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* App 3: Epistemological Argument & Freedom of Thought Explorer */}
      {activeApp === 'philosophy-explorer' && (
        <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start bg-[#FBF9F5]">
          <div className="lg:col-span-5 bg-white border border-stone-300 p-5 space-y-4">
            <div className="space-y-1">
              <h3 className="text-lg font-editorial font-bold text-stone-900">
                {isTr ? 'Epistemolojik Ağırlık & Sorgulama Atölyesi' : 'Epistemological Weighting Workbench'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {isTr
                  ? 'Bir tartışma ekseni seçip deneysel, akılcı ve fenomenolojik önceliklerinizi ayarlayarak farklı felsefi okulları özgürce karşılaştırın.'
                  : 'Select an inquiry topic and weight empirical, rational, and experiential axes to compare perspectives neutrally.'}
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold text-stone-700">
                {isTr ? 'Felsefi & Bilimsel Problem Alanı:' : 'Inquiry Domain:'}
              </label>
              <select
                value={selectedTopicId}
                onChange={(e) => {
                  setSelectedTopicId(e.target.value);
                  onAppInteractionMeasured?.('philosophy-explorer', 'Felsefi perspektif konusu değiştirildi');
                }}
                className="w-full px-3 py-2 text-xs font-sans bg-[#FBF9F5] border border-stone-300 rounded-xs"
              >
                {PHILOSOPHY_TOPICS.map((tp) => (
                  <option key={tp.id} value={tp.id}>
                    {isTr ? tp.titleTr : tp.titleEn}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <label className="block space-y-1">
                <span className="flex justify-between">
                  <span>{isTr ? 'Deneysel / Gözlemsel Ağırlık' : 'Empirical Weight'}</span>
                  <span className="tabular-nums text-[#1E3A8A]">%{empiricalPref}</span>
                </span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={empiricalPref}
                  onChange={(e) => setEmpiricalPref(Number(e.target.value))}
                  className="w-full cursor-pointer"
                />
              </label>
              <label className="block space-y-1">
                <span className="flex justify-between">
                  <span>{isTr ? 'Matematiksel / Akılcı Tutarlılık' : 'Rational Consistency'}</span>
                  <span className="tabular-nums text-[#1E3A8A]">%{rationalPref}</span>
                </span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={rationalPref}
                  onChange={(e) => setRationalPref(Number(e.target.value))}
                  className="w-full cursor-pointer"
                />
              </label>
              <label className="block space-y-1">
                <span className="flex justify-between">
                  <span>{isTr ? 'Öznel Deneyim / Fenomenoloji' : 'Phenomenological Weight'}</span>
                  <span className="tabular-nums text-[#1E3A8A]">%{phenomenalPref}</span>
                </span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={phenomenalPref}
                  onChange={(e) => setPhenomenalPref(Number(e.target.value))}
                  className="w-full cursor-pointer"
                />
              </label>
            </div>

            <div className="p-3 bg-[#F2EFE7] border border-stone-300 text-[11px] text-stone-700 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span>
                {isTr
                  ? 'Bu modül hiçbir görüşü tek doğru olarak dayatmaz; tüm bilimsel ve felsefi yaklaşımları eşit düşünce hürriyeti zemininde sunar.'
                  : 'All viewpoints are presented neutrally without ideological pressure, honoring full freedom of thought.'}
              </span>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-3">
            <div className="bg-white border border-stone-300 p-4">
              <div className="text-[11px] font-mono text-stone-500 uppercase">
                {isTr ? 'Temel Soru' : 'Core Question'}
              </div>
              <p className="text-base font-editorial font-semibold text-stone-900 mt-1">
                {isTr ? activePhilosophyTopic.questionTr : activePhilosophyTopic.questionEn}
              </p>
            </div>

            <div className="space-y-2.5">
              {scoredPerspectives.map((p) => (
                <div
                  key={p.nameTr}
                  className="bg-white border border-stone-300 p-4 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-editorial font-bold text-stone-900 text-base">
                      {isTr ? p.nameTr : p.nameEn}
                    </h4>
                    <span className="font-mono text-xs font-bold text-[#1E3A8A] tabular-nums">
                      {isTr ? `Tercih Uyumu: %${p.alignment}` : `Alignment: ${p.alignment}%`}
                    </span>
                  </div>
                  <p className="text-xs font-academic-body text-stone-700 leading-relaxed">
                    {isTr ? p.summaryTr : p.summaryEn}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-white border border-stone-300 p-4 space-y-2">
              <div className="text-xs font-mono font-bold text-stone-700 uppercase">
                {isTr ? 'Bu Konudaki Makalelere Git' : 'Explore Related Articles'}
              </div>
              <div className="space-y-1.5">
                {relatedTopicArticles.map((art) => (
                  <button
                    key={art.id}
                    type="button"
                    onClick={() => onJumpToArticle(art.id)}
                    className="w-full text-left text-xs text-[#1E3A8A] hover:underline flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <span className="truncate">{getLocalizedText(art.title, language)}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* App 4: Corpus Concept & Equation Matching Challenge */}
      {activeApp === 'concept-challenge' && currentChallenge && (
        <div className="p-5 sm:p-6 bg-[#FBF9F5] space-y-4">
          <div className="bg-white border border-stone-300 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-3">
              <div>
                <h3 className="text-lg font-editorial font-bold text-stone-900">
                  {isTr
                    ? '316 Makale İçinden Kavram & Denklem Eşleştirme Egzersizi'
                    : 'Concept & Equation Matching Challenge Across 316 Articles'}
                </h3>
                <p className="text-xs text-stone-600">
                  {isTr
                    ? 'Aşağıdaki bulgu ve denklemin hangi özgün makaleye ait olduğunu tahmin ederek bilginizi eğlenceli bir şekilde pekiştirin.'
                    : 'Match the excerpt and mathematical formula to its corresponding study for playful reinforcement.'}
                </p>
              </div>
              <div className="font-mono text-xs tabular-nums flex items-center gap-3">
                <span className="font-bold text-emerald-800">
                  {isTr ? 'Skor' : 'Score'}: {challengeScore.correct} / {challengeScore.attempts}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setChallengeSelectedIdx(null);
                    setChallengeSeed((s) => s + 1);
                  }}
                  className="px-3 py-1.5 bg-[#1E3A8A] hover:bg-[#172E6E] text-white font-bold rounded-xs cursor-pointer"
                >
                  {isTr ? 'Yeni Soru Getir →' : 'Next Challenge →'}
                </button>
              </div>
            </div>

            <div className="bg-[#0F172A] text-slate-100 p-4 rounded-xs space-y-2 border border-slate-800">
              <div className="text-[11px] font-mono text-amber-300">
                {isTr ? 'MAKALE İPUCU & TEMEL BULGU:' : 'ARTICLE EXCERPT & KEY FINDING:'}
              </div>
              <p className="text-sm font-academic-body leading-relaxed text-slate-100">
                “{currentChallenge.clue}”
              </p>
              <div className="pt-1 text-xs font-mono text-cyan-300">
                <MathFormula tex={currentChallenge.equation} darkSurface={true} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {currentChallenge.options.map((optArt, idx) => {
                const answered = challengeSelectedIdx !== null;
                const isCorrect = idx === currentChallenge.correctIndex;
                const isChosen = challengeSelectedIdx === idx;
                return (
                  <button
                    key={optArt.id}
                    type="button"
                    disabled={answered}
                    onClick={() => {
                      setChallengeSelectedIdx(idx);
                      const ok = idx === currentChallenge.correctIndex;
                      setChallengeScore((prev) => ({
                        correct: prev.correct + (ok ? 1 : 0),
                        attempts: prev.attempts + 1,
                      }));
                      onAppInteractionMeasured?.('concept-challenge', 'Külliyat kavram eşleştirme sorusu yanıtlandı');
                    }}
                    className={`p-3.5 text-left border rounded-xs transition-colors flex items-start justify-between gap-2 ${
                      answered ? 'cursor-default' : 'cursor-pointer'
                    } ${
                      answered && isCorrect
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-semibold'
                        : answered && isChosen
                          ? 'bg-amber-50 border-amber-600 text-amber-950'
                          : 'bg-white hover:bg-stone-50 border-stone-300 text-stone-800'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="text-[11px] font-mono text-stone-500">
                        {optArt.category} · {optArt.figureNumber}
                      </div>
                      <div className="text-xs sm:text-sm font-editorial font-semibold">
                        {getLocalizedText(optArt.title, language)}
                      </div>
                    </div>
                    {answered && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-1" />
                    )}
                    {answered && isChosen && !isCorrect && (
                      <CircleDot className="w-4 h-4 text-amber-700 shrink-0 mt-1" />
                    )}
                  </button>
                );
              })}
            </div>

            {challengeSelectedIdx !== null && (
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-200 text-xs">
                <span className="font-mono font-semibold text-stone-800">
                  {challengeSelectedIdx === currentChallenge.correctIndex
                    ? isTr
                      ? '✓ Doğru Eşleştirme! Makaleyi ve kısa videosunu incelemek için yanındaki butona tıklayabilirsiniz.'
                      : '✓ Exact Match! Jump directly to explore this article and its short video.'
                    : isTr
                      ? `○ Doğru eşleşme: ${getLocalizedText(currentChallenge.targetArt.title, language)}`
                      : `○ Correct match: ${getLocalizedText(currentChallenge.targetArt.title, language)}`}
                </span>
                <button
                  type="button"
                  onClick={() => onJumpToArticle(currentChallenge.targetArt.id)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-mono font-bold rounded-xs cursor-pointer"
                >
                  <span>{isTr ? 'Makaleye Git' : 'Open Article'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
