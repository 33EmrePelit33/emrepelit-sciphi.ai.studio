import React, { useState, useMemo } from 'react';
import { RotateCcw, Play, Pause, Sparkles, Award } from 'lucide-react';
import { Article, LanguageCode } from '../types';
import { UI_TEXT, getLocalizedText } from '../i18n/translations';
import { computeArticleScientificAnalysis } from '../utils/articleAnalysisEngine';
import { MathFormula } from './MathFormula';

interface ArticleSimulationProps {
  article: Article;
  language: LanguageCode;
  onSimulationMeasured?: (articleId: string, simType: string) => void;
  onOpenFullAnalysisModal?: (article: Article) => void;
}

export const ArticleSimulation: React.FC<ArticleSimulationProps> = ({
  article,
  language,
  onSimulationMeasured,
  onOpenFullAnalysisModal,
}) => {
  const sim = article.simulation;
  const t = UI_TEXT[language].article;

  const initialValues = useMemo(() => {
    const map: Record<string, number> = {};
    sim.parameters.forEach((p) => {
      map[p.key] = p.defaultValue;
    });
    return map;
  }, [sim.parameters]);

  const [params, setParams] = useState<Record<string, number>>(initialValues);
  const [phaseStep, setPhaseStep] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  React.useEffect(() => {
    if (!isAnimating) return;
    const id = window.setInterval(() => {
      setPhaseStep((prev) => (prev + 1) % 360);
    }, 60);
    return () => window.clearInterval(id);
  }, [isAnimating]);

  const handleParamChange = (key: string, val: number) => {
    setParams((prev) => ({ ...prev, [key]: val }));
    onSimulationMeasured?.(article.id, sim.type);
  };

  const handleReset = () => {
    setParams(initialValues);
    setPhaseStep(0);
    setIsAnimating(false);
  };

  // Compute high-accuracy article-specific calibration & scientific score for each of the 306 articles
  const articleSpecificReport = useMemo(
    () => computeArticleScientificAnalysis(article, language, params),
    [article, language, params]
  );

  const isTr = language === 'tr';

  // Compute bespoke physical or software outputs & SVG visualization per simulation type
  const renderVisualizationAndTelemetry = () => {
    if (sim.type === 'software') {
      const temp = params.inferenceTemp ?? params.temperature ?? 0.25;
      const macroStrict = params.macroConstraintWeight ?? params.strictness ?? 0.92;
      const contextTok = params.contextBudget ?? params.tokenBudget ?? 4096;

      const latencyMs = Math.round(115 + (contextTok / 4096) * 85 + temp * 42);
      const constraintCompliance = Math.min(99.8, 86.0 + macroStrict * 12.8 - temp * 4.5);
      const schemaValidity = Math.min(99.9, 91.2 + macroStrict * 8.2 - temp * 3.1);
      const activeStage = Math.floor(phaseStep / 90) % 4;

      const stages = isTr
        ? [
            { x: 45, label: 'Kullanıcı Girdisi', sub: 'Beslenme Profili' },
            { x: 185, label: 'Niyet & Kısıt Çözücü', sub: `T=${temp.toFixed(2)}` },
            { x: 325, label: 'Makro Değerlendirici', sub: `%${constraintCompliance.toFixed(1)} Uyum` },
            { x: 465, label: 'Diyet Planı JSON', sub: `${latencyMs} ms` },
          ]
        : [
            { x: 45, label: 'Prompt Input', sub: 'Health Profile' },
            { x: 185, label: 'Intent Parser', sub: `T=${temp.toFixed(2)}` },
            { x: 325, label: 'Macro Evaluator', sub: `${constraintCompliance.toFixed(1)}% Fit` },
            { x: 465, label: 'Meal Plan Output', sub: `${latencyMs} ms` },
          ];

      return {
        metrics: [
          {
            label: isTr ? 'Çıkarım Gecikmesi (Latency)' : 'Inference Latency',
            value: String(latencyMs),
            unit: 'ms',
          },
          {
            label: isTr ? 'Makro Kısıt Doğruluğu' : 'Macro Constraint Accuracy',
            value: constraintCompliance.toFixed(1),
            unit: '%',
          },
          {
            label: isTr ? 'JSON Şema Tutarlılığı' : 'Structured Schema Validity',
            value: schemaValidity.toFixed(1),
            unit: '%',
          },
        ],
        svg: (
          <svg viewBox="0 0 600 240" className="w-full h-56 bg-[#0B0E17] border border-slate-800">
            <text x="32" y="30" fill="#10B981" className="text-[11px] font-mono">
              {isTr
                ? `— Yapay Zeka Beslenme & Sağlık Uygulaması İşlem Hattı (${contextTok} tok)`
                : `— AI Nutrition & Health Pipeline Architecture (${contextTok} tok budget)`}
            </text>
            <text x="32" y="48" fill="#38BDF8" className="text-[11px] font-mono">
              {isTr
                ? `● Çok Aşamalı Kısıt Doğrulama ve Kişiselleştirilmiş Menü Sentezi`
                : `● Multi-Stage Constraint Solver & Personalized Dietary Synthesis`}
            </text>
            {stages.map((st, idx) => {
              const isActive = idx === activeStage;
              return (
                <g key={st.label}>
                  {idx < stages.length - 1 && (
                    <line
                      x1={st.x + 110}
                      y1={125}
                      x2={stages[idx + 1].x}
                      y2={125}
                      stroke={isActive ? '#10B981' : '#475569'}
                      strokeWidth="2"
                      strokeDasharray="4 3"
                    />
                  )}
                  <rect
                    x={st.x}
                    y={92}
                    width={110}
                    height={66}
                    rx={6}
                    fill={isActive ? '#064E3B' : '#0F172A'}
                    stroke={isActive ? '#10B981' : '#334155'}
                    strokeWidth={isActive ? 2.2 : 1.4}
                  />
                  <text
                    x={st.x + 55}
                    y={119}
                    textAnchor="middle"
                    fill="#F8FAFC"
                    className="text-[10px] font-mono font-bold"
                  >
                    {st.label}
                  </text>
                  <text
                    x={st.x + 55}
                    y={138}
                    textAnchor="middle"
                    fill="#38BDF8"
                    className="text-[10px] font-mono"
                  >
                    {st.sub}
                  </text>
                </g>
              );
            })}
            <rect x="45" y="185" width="530" height="10" rx="3" fill="#1E293B" />
            <rect
              x="45"
              y="185"
              width={Math.round((constraintCompliance / 100) * 530)}
              height="10"
              rx="3"
              fill="#10B981"
            />
            <text x="45" y="212" fill="#94A3B8" className="text-[10px] font-mono">
              {isTr
                ? `Kalori & Mikro-Besin Dengesi Yakınsaması: %${constraintCompliance.toFixed(1)}`
                : `Caloric & Micronutrient Constraint Convergence: ${constraintCompliance.toFixed(1)}%`}
            </text>
          </svg>
        ),
      };
    }

    if (sim.type === 'quantum') {
      const gamma = params.detectorCoupling ?? 0.18;
      const slitD = params.slitSeparation ?? 4.2;
      const lambdaNm = params.wavelength ?? 520;
      const coherence = Math.max(0, 1 - gamma);
      const vonNeumannEntropy =
        gamma <= 0.001 || gamma >= 0.999
          ? 0
          : -(gamma * Math.log2(gamma) + (1 - gamma) * Math.log2(1 - gamma)) * 0.85 + gamma * 0.42;

      const points: string[] = [];
      const classicalPoints: string[] = [];
      for (let i = 0; i <= 120; i++) {
        const xNorm = (i - 60) / 30;
        const env1 = Math.exp(-Math.pow(xNorm - 0.55, 2) * 1.4);
        const env2 = Math.exp(-Math.pow(xNorm + 0.55, 2) * 1.4);
        const k = (slitD * 550) / lambdaNm;
        const interference =
          2 * Math.sqrt(env1 * env2) * coherence * Math.cos(k * xNorm * 3.2 + (phaseStep * Math.PI) / 90);
        const intensity = Math.max(0, (env1 + env2 + interference) / 3.8);
        const classicIntensity = (env1 + env2) / 2.2;

        const px = 40 + (i / 120) * 520;
        const py = 210 - intensity * 165;
        const cpy = 210 - classicIntensity * 130;
        points.push(`${px.toFixed(1)},${py.toFixed(1)}`);
        classicalPoints.push(`${px.toFixed(1)},${cpy.toFixed(1)}`);
      }

      return {
        metrics: [
          { label: isTr ? 'Saçak Görünürlüğü (V)' : 'Fringe Visibility (V)', value: `${(coherence * 100).toFixed(1)}`, unit: '%' },
          { label: isTr ? 'Von Neumann Entropisi S(ρ)' : 'Von Neumann Entropy S(ρ)', value: vonNeumannEntropy.toFixed(3), unit: 'bit' },
          { label: isTr ? 'Dekoherans Oranı (Γ)' : 'Decoherence Rate (Γ)', value: (gamma * slitD * 2.4).toFixed(2), unit: 'ps⁻¹' },
        ],
        svg: (
          <svg viewBox="0 0 600 240" className="w-full h-56 bg-[#0B0E17] border border-slate-800">
            <g stroke="#1E293B" strokeWidth="1">
              <line x1="40" y1="210" x2="560" y2="210" />
              <line x1="300" y1="20" x2="300" y2="210" strokeDasharray="3 3" />
            </g>
            <polyline
              fill="none"
              stroke="#F59E0B"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              points={classicalPoints.join(' ')}
            />
            <polyline fill="none" stroke="#38BDF8" strokeWidth="2.4" points={points.join(' ')} />
            <text x="50" y="34" fill="#38BDF8" className="text-[11px] font-mono">
              {isTr ? '— Kuantum Olasılık Yoğunluğu |Ψ(x)|²' : '— Quantum Probability Density |Ψ(x)|²'}
            </text>
            <text x="50" y="50" fill="#F59E0B" className="text-[11px] font-mono">
              {isTr ? '-- Klasik Parçacık Dağılımı (P₁ + P₂)' : '-- Classical Particle Sum (P₁ + P₂)'}
            </text>
          </svg>
        ),
      };
    }

    if (sim.type === 'higgs') {
      const tRatio = params.thermalRatio ?? 0.45;
      const lambda = params.quarticLambda ?? 0.13;
      const gY = params.yukawaCoupling ?? 0.72;

      const muSquared = (tRatio - 1.0) * 1.8;
      const vevGeV = tRatio < 1.0 ? Math.sqrt(-muSquared / (2 * lambda)) * 93.5 : 0;
      const fermionMassGeV = (gY * vevGeV) / Math.SQRT2;

      const potPoints: string[] = [];
      for (let i = 0; i <= 120; i++) {
        const phi = ((i - 60) / 60) * 2.4;
        const vPhi = muSquared * Math.pow(phi, 2) + lambda * 2.2 * Math.pow(phi, 4);
        const px = 40 + (i / 120) * 520;
        const py = 145 - vPhi * 55;
        potPoints.push(`${px.toFixed(1)},${Math.max(25, Math.min(220, py)).toFixed(1)}`);
      }

      const minPhiNorm = tRatio < 1.0 ? Math.sqrt(-muSquared / (4.4 * lambda)) : 0;
      const ballX = 300 + (minPhiNorm / 2.4) * 260;

      return {
        metrics: [
          { label: isTr ? 'Vakum Beklenti Değeri (v)' : 'Vacuum Expectation Value (v)', value: vevGeV.toFixed(1), unit: 'GeV' },
          { label: isTr ? 'Üretilen Fermiyon Kütlesi (mf)' : 'Generated Fermion Mass (mf)', value: fermionMassGeV.toFixed(2), unit: 'GeV/c²' },
          {
            label: isTr ? 'Elektrozayıf Faz Durumu' : 'Electroweak Phase State',
            value: tRatio < 1.0 ? (isTr ? 'KIRILMIŞ' : 'BROKEN') : isTr ? 'SİMETRİK' : 'SYMMETRIC',
            unit: 'SU(2)×U(1)',
          },
        ],
        svg: (
          <svg viewBox="0 0 600 240" className="w-full h-56 bg-[#0B0E17] border border-slate-800">
            <line x1="40" y1="145" x2="560" y2="145" stroke="#1E293B" strokeWidth="1" />
            <line x1="300" y1="20" x2="300" y2="225" stroke="#1E293B" strokeDasharray="3 3" />
            <polyline fill="none" stroke="#F59E0B" strokeWidth="2.5" points={potPoints.join(' ')} />
            <circle cx={ballX} cy={tRatio < 1.0 ? 175 : 145} r="7" fill="#38BDF8" />
            <text x="50" y="36" fill="#F59E0B" className="text-[11px] font-mono">
              {isTr ? 'Higgs Efektif Potansiyeli V(φ, T)' : 'Higgs Effective Potential V(φ, T)'}
            </text>
            <text x="50" y="54" fill="#38BDF8" className="text-[11px] font-mono">
              {isTr ? '● Vakum Kondensat Durumu' : '● Vacuum Condensate State'} ⟨0|φ|0⟩ = {vevGeV.toFixed(1)} GeV
            </text>
          </svg>
        ),
      };
    }

    if (sim.type === 'holographic') {
      const thetaDeg = params.boundaryAngle ?? 95;
      const centralC = params.centralCharge ?? 48;
      const horizonR = params.horizonRadius ?? 0.2;

      const thetaRad = (thetaDeg * Math.PI) / 180;
      const sEntanglement = (centralC / 3) * Math.log(20 * Math.sin(thetaRad / 2) + 1.1) * (1 + horizonR * 0.6);
      const geodesicLength = sEntanglement * 0.25;

      const cx = 300;
      const cy = 120;
      const R = 92;
      const x1 = cx + R * Math.cos(-thetaRad / 2);
      const y1 = cy + R * Math.sin(-thetaRad / 2);
      const x2 = cx + R * Math.cos(thetaRad / 2);
      const y2 = cy + R * Math.sin(thetaRad / 2);
      const depthPull = cx + R * (1 - Math.sin(thetaRad / 2)) * 0.35;

      return {
        metrics: [
          { label: isTr ? 'Ryu-Takayanagi Entropisi (SA)' : 'Ryu-Takayanagi Entropy (SA)', value: sEntanglement.toFixed(2), unit: 'kB' },
          { label: isTr ? 'Minimal Jeodezik Uzunluk Area(γA)' : 'Minimal Geodesic Area(γA)', value: geodesicLength.toFixed(2), unit: 'L_AdS' },
          { label: isTr ? 'Bekenstein-Hawking Ufuk Alanı' : 'Bekenstein-Hawking Horizon', value: (Math.PI * horizonR * horizonR * 100).toFixed(1), unit: 'ℓP²' },
        ],
        svg: (
          <svg viewBox="0 0 600 240" className="w-full h-56 bg-[#0B0E17] border border-slate-800">
            <circle cx={cx} cy={cy} r={R} fill="#0F172A" stroke="#334155" strokeWidth="2" />
            {horizonR > 0 && (
              <circle
                cx={cx}
                cy={cy}
                r={R * horizonR * 0.7}
                fill="#F59E0B"
                fillOpacity="0.18"
                stroke="#F59E0B"
                strokeDasharray="3 2"
              />
            )}
            <path
              d={`M ${x1} ${y1} Q ${depthPull} ${cy} ${x2} ${y2}`}
              fill="none"
              stroke="#2DD4BF"
              strokeWidth="2.8"
            />
            <circle cx={x1} cy={y1} r="4.5" fill="#F59E0B" />
            <circle cx={x2} cy={y2} r="4.5" fill="#F59E0B" />
            <text x="36" y="36" fill="#2DD4BF" className="text-[11px] font-mono">
              {isTr ? '— γ_A Hacimsel Minimal Jeodezik Yüzey (AdS Bulk)' : '— γ_A Minimal Geodesic Surface (AdS Bulk)'}
            </text>
            <text x="36" y="54" fill="#F59E0B" className="text-[11px] font-mono">
              {isTr ? '● Sınır Kuantum Dolaşıklık Alt-Bölgesi A' : '● Boundary Entanglement Subregion A'} (θ = {thetaDeg}°)
            </text>
          </svg>
        ),
      };
    }

    if (sim.type === 'spacetime') {
      const beta = params.velocityBeta ?? 0.55;
      const distLy = params.targetDistanceLy ?? 120;
      const tau = params.worldlineProperTime ?? 8;

      const gamma = 1 / Math.sqrt(Math.max(0.04, 1 - beta * beta));
      const shiftYears = gamma * beta * distLy;

      const cx = 300;
      const cy = 125;
      const tiltPx = beta * 85;

      return {
        metrics: [
          { label: isTr ? 'Lorentz Faktörü (γ)' : 'Lorentz Factor (γ)', value: gamma.toFixed(3), unit: '×' },
          { label: isTr ? 'Eşzamanlılık Kayması (Δt\')' : 'Simultaneity Shift (Δt\')', value: shiftYears >= 0 ? `+${shiftYears.toFixed(1)}` : shiftYears.toFixed(1), unit: isTr ? 'yıl' : 'yr' },
          { label: isTr ? 'Koordinat Zamanı Genişlemesi (t)' : 'Coordinate Time Dilation (t)', value: (tau * gamma).toFixed(2), unit: isTr ? 'yıl' : 'yr' },
        ],
        svg: (
          <svg viewBox="0 0 600 240" className="w-full h-56 bg-[#0B0E17] border border-slate-800">
            <polygon points={`${cx},${cy} 195,20 405,20`} fill="#F59E0B" fillOpacity="0.09" stroke="#F59E0B" strokeWidth="1.2" />
            <polygon points={`${cx},${cy} 195,230 405,230`} fill="#38BDF8" fillOpacity="0.09" stroke="#38BDF8" strokeWidth="1.2" />
            <line x1="120" y1={cy} x2="480" y2={cy} stroke="#475569" strokeWidth="1" />
            <line x1={cx} y1="15" x2={cx} y2="230" stroke="#475569" strokeWidth="1" />
            <line
              x1="140"
              y1={cy + tiltPx}
              x2="460"
              y2={cy - tiltPx}
              stroke="#38BDF8"
              strokeWidth="2.5"
              strokeDasharray="5 3"
            />
            <line
              x1={cx - tiltPx}
              y1="225"
              x2={cx + tiltPx}
              y2="25"
              stroke="#F59E0B"
              strokeWidth="2.5"
            />
            <circle cx={cx} cy={cy} r="5" fill="#F8FAFC" />
            <text x="34" y="34" fill="#F59E0B" className="text-[11px] font-mono">
              {isTr ? '— Hareketli Gözlemci Dünya-Çizgisi (ct\')' : '— Moving Observer Worldline (ct\')'}
            </text>
            <text x="34" y="52" fill="#38BDF8" className="text-[11px] font-mono">
              {isTr ? '-- Eğilmiş Eşzamanlılık Hiperdüzlemi (Şimdi Kesiti x\')' : '-- Tilted Simultaneity Hyperplane (Now Slice x\')'}
            </text>
          </svg>
        ),
      };
    }

    if (sim.type === 'consciousness') {
      const alpha = params.recurrentAlpha ?? 0.75;
      const omega = params.synapticOmega ?? 0.68;
      const noise = params.partitionNoise ?? 0.12;

      const phiMax = Math.max(0, alpha * omega * 4.8 * (1 - noise * 1.15));
      const causalDensity = alpha * 0.65 + omega * 0.35;

      const nodes = [
        { x: 300, y: 38, label: isTr ? 'N₁ (Kortikal)' : 'N₁ (Cortical)' },
        { x: 430, y: 95, label: isTr ? 'N₂ (Talamik)' : 'N₂ (Thalamic)' },
        { x: 385, y: 195, label: isTr ? 'N₃ (Rekürsif)' : 'N₃ (Recurrent)' },
        { x: 215, y: 195, label: isTr ? 'N₄ (Bütünleşik)' : 'N₄ (Integrated)' },
        { x: 170, y: 95, label: isTr ? 'N₅ (Duyusal)' : 'N₅ (Sensory)' },
      ];

      return {
        metrics: [
          { label: isTr ? 'Bütünleşik Bilgi (Φmax)' : 'Integrated Information (Φmax)', value: phiMax.toFixed(3), unit: 'bit' },
          { label: isTr ? 'Nedensel Yoğunluk (CD)' : 'Causal Density (CD)', value: (causalDensity * 100).toFixed(1), unit: '%' },
          {
            label: isTr ? 'Ontolojik Rejim' : 'Ontological Regime',
            value: phiMax > 1.2 ? (isTr ? 'FENOMENAL (Φ>1)' : 'PHENOMENAL (Φ>1)') : isTr ? 'ZOMBİ / İLERİ-BESLEMELİ' : 'FEED-FORWARD',
            unit: 'IIT 4.0',
          },
        ],
        svg: (
          <svg viewBox="0 0 600 240" className="w-full h-56 bg-[#0B0E17] border border-slate-800">
            {nodes.map((n1, i) =>
              nodes.slice(i + 1).map((n2, j) => (
                <line
                  key={`${i}-${j}`}
                  x1={n1.x}
                  y1={n1.y}
                  x2={n2.x}
                  y2={n2.y}
                  stroke={alpha > 0.25 ? '#A78BFA' : '#475569'}
                  strokeWidth={Math.max(0.8, omega * 2.8)}
                  strokeOpacity={Math.max(0.2, alpha)}
                />
              ))
            )}
            {nodes.map((n, idx) => (
              <g key={idx}>
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={10 + phiMax * 1.6}
                  fill={phiMax > 1.2 ? '#A78BFA' : '#64748B'}
                  stroke="#F8FAFC"
                  strokeWidth="1.5"
                />
                <text x={n.x + 16} y={n.y + 4} fill="#E2E8F0" className="text-[10px] font-mono">
                  {n.label}
                </text>
              </g>
            ))}
            <text x="30" y="34" fill="#A78BFA" className="text-[11px] font-mono">
              Φmax = {phiMax.toFixed(3)} bit (Minimum Information Partition)
            </text>
          </svg>
        ),
      };
    }

    // Default / 'chaos' Lorenz strange attractor
    const rho = params.rayleighRho ?? 28;
    const sigma = params.prandtlSigma ?? 10;
    const logPerturb = params.logPerturbation ?? 4;
    const betaLorenz = 8 / 3;
    const dt = 0.008;

    let x1 = 0.1,
      y1 = 0.0,
      z1 = 0.0;
    let x2 = 0.1 + Math.pow(10, -logPerturb),
      y2 = 0.0,
      z2 = 0.0;

    const pts1: string[] = [];
    const pts2: string[] = [];
    let finalDivergence = 0;

    for (let step = 0; step < 380; step++) {
      const dx1 = sigma * (y1 - x1);
      const dy1 = x1 * (rho - z1) - y1;
      const dz1 = x1 * y1 - betaLorenz * z1;
      x1 += dx1 * dt;
      y1 += dy1 * dt;
      z1 += dz1 * dt;

      const dx2 = sigma * (y2 - x2);
      const dy2 = x2 * (rho - z2) - y2;
      const dz2 = x2 * y2 - betaLorenz * z2;
      x2 += dx2 * dt;
      y2 += dy2 * dt;
      z2 += dz2 * dt;

      const px1 = 300 + x1 * 7.8;
      const py1 = 215 - z1 * 3.8;
      const px2 = 300 + x2 * 7.8;
      const py2 = 215 - z2 * 3.8;
      pts1.push(`${px1.toFixed(1)},${py1.toFixed(1)}`);
      pts2.push(`${px2.toFixed(1)},${py2.toFixed(1)}`);

      if (step === 379) {
        finalDivergence = Math.sqrt(
          Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) + Math.pow(z1 - z2, 2)
        );
      }
    }

    const lyapunovLambda = rho > 24.74 ? 0.905 + (rho - 28) * 0.025 : -0.12;
    const epistemicHorizon = lyapunovLambda > 0 ? (logPerturb * Math.LN10) / lyapunovLambda : 99.9;

    return {
      metrics: [
        { label: isTr ? 'Maksimum Lyapunov Üsteli (λL)' : 'Max Lyapunov Exponent (λL)', value: lyapunovLambda.toFixed(3), unit: 's⁻¹' },
        { label: isTr ? 'Epistemik Tahmin Ufku (Th)' : 'Prediction Horizon (Th)', value: epistemicHorizon.toFixed(2), unit: isTr ? 'Lyapunov s' : 'Lyapunov s' },
        { label: isTr ? 'Son Yörünge Sapması |δx(T)|' : 'Final Divergence |δx(T)|', value: finalDivergence.toFixed(2), unit: isTr ? 'faz birimi' : 'phase u.' },
      ],
      svg: (
        <svg viewBox="0 0 600 240" className="w-full h-56 bg-[#0B0E17] border border-slate-800">
          <polyline fill="none" stroke="#F43F5E" strokeWidth="1.8" points={pts1.join(' ')} />
          <polyline
            fill="none"
            stroke="#38BDF8"
            strokeWidth="1.5"
            strokeDasharray="4 2"
            points={pts2.join(' ')}
          />
          <text x="32" y="32" fill="#F43F5E" className="text-[11px] font-mono">
            {isTr ? '— Referans Yörünge x(t) [Başlangıç x₀]' : '— Reference Trajectory x(t) [Initial x₀]'}
          </text>
          <text x="32" y="48" fill="#38BDF8" className="text-[11px] font-mono">
            {isTr ? '-- Pertürbe Yörünge x(t)+δ(t)' : '-- Perturbed Trajectory x(t)+δ(t)'} [Δx₀ = 10⁻{logPerturb}]
          </text>
        </svg>
      ),
    };
  };

  const { metrics, svg } = renderVisualizationAndTelemetry();

  return (
    <div className="border border-stone-300 bg-[#F7F4EC] p-5 rounded-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3.5 border-b border-stone-300">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-stone-500">
            {t.simulationTitle} · ID: {article.id}
          </div>
          <h4 className="text-xl font-editorial font-semibold text-stone-900 mt-0.5">
            {getLocalizedText(sim.title, language)}
          </h4>
          <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[11px] font-mono">
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-950 border border-emerald-300 font-bold rounded-xs">
              {isTr
                ? `Makaleye Özel Kalibrasyon: ${articleSpecificReport.simulationResults.calibrationId} (%${articleSpecificReport.simulationResults.accuracyPercent} Doğruluk)`
                : `Article Calibration: ${articleSpecificReport.simulationResults.calibrationId} (${articleSpecificReport.simulationResults.accuracyPercent}% Accuracy)`}
            </span>
            <span className="px-2 py-0.5 bg-amber-100 text-amber-950 border border-amber-300 font-bold rounded-xs inline-flex items-center gap-1">
              <Award className="w-3 h-3 text-amber-700" />
              <span>
                {isTr ? 'Bilimsel Skor' : 'Scientific Score'}: {articleSpecificReport.scientificScore.overallScore} / 100
              </span>
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenFullAnalysisModal && (
            <button
              type="button"
              onClick={() => onOpenFullAnalysisModal(article)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 border border-amber-500 rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {isTr
                  ? 'Tam Yapay Zeka Analizi, Bilimsel Skor & Sesli Dinle'
                  : 'Full Analysis, Scientific Score & Audio Narration'}
              </span>
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              const nextState = !isAnimating;
              setIsAnimating(nextState);
              if (nextState) {
                onSimulationMeasured?.(article.id, sim.type);
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {isAnimating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>
              {isAnimating
                ? isTr
                  ? 'Faz Evrimini Durdur'
                  : 'Pause Evolution'
                : isTr
                  ? 'Canlı Faz Evrimi'
                  : 'Live Evolution'}
            </span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-white border border-stone-300 hover:bg-stone-100 rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isTr ? 'Sıfırla' : 'Reset'}</span>
          </button>
        </div>
      </div>

      {/* Asymmetric Split Console: Left Parameter Controls / Right Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-4 items-stretch">
        <div className="lg:col-span-5 flex flex-col justify-between space-y-3.5 bg-white p-4 border border-stone-200">
          <div className="space-y-3.5">
            <div className="text-xs font-mono text-stone-700 bg-stone-100 px-3 py-2 pr-8 border border-stone-200 overflow-x-auto">
              <MathFormula tex={sim.equationLatex} showCopyButton={true} />
            </div>

            {sim.parameters.map((param) => {
              const currentVal = params[param.key] ?? param.defaultValue;
              return (
                <div key={param.key} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <label htmlFor={`${article.id}-${param.key}`} className="font-medium text-stone-800">
                      {getLocalizedText(param.label, language)}
                    </label>
                    <span className="font-mono font-semibold tabular-nums text-[#1E3A8A]">
                      {currentVal} <span className="text-[11px] text-stone-500">{param.unit}</span>
                    </span>
                  </div>
                  <input
                    id={`${article.id}-${param.key}`}
                    type="range"
                    min={param.min}
                    max={param.max}
                    step={param.step}
                    value={currentVal}
                    onChange={(e) => handleParamChange(param.key, parseFloat(e.target.value))}
                    className="w-full accent-[#1E3A8A] cursor-pointer"
                  />
                </div>
              );
            })}
          </div>

          <p className="text-xs text-stone-600 leading-relaxed pt-2 border-t border-stone-200">
            {getLocalizedText(sim.methodologyNote, language)}
          </p>
        </div>

        <div className="lg:col-span-7 flex flex-col justify-between space-y-3">
          {svg}

          {/* 3-Column Tabular Telemetry Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {metrics.map((m, idx) => (
              <div key={idx} className="bg-white border border-stone-200 px-3.5 py-2.5">
                <div className="text-[11px] uppercase tracking-wider text-stone-500 truncate">{m.label}</div>
                <div className="mt-1 flex items-baseline">
                  <span className="text-lg font-mono font-semibold tabular-nums text-stone-900">{m.value}</span>
                  <span className="text-[11px] font-mono text-stone-500 ml-1.5">{m.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Article-Specific High-Accuracy Simulation Synthesis & Tailored Output Bar (Customized for All 306 Articles) */}
      <div className="mt-4 bg-[#0F172A] text-slate-100 border border-slate-800 p-4 rounded-xs space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono border-b border-slate-800 pb-2">
          <span className="text-amber-300 font-bold">
            {isTr
              ? `● MAKALE ${articleSpecificReport.articleNumberLabel} ÖZEL YÜKSEK DOĞRULUKLU SİMÜLASYON & ANALİZ SONUCU (%${articleSpecificReport.simulationResults.accuracyPercent} DOĞRULUK):`
              : `● ARTICLE ${articleSpecificReport.articleNumberLabel} CALIBRATED SIMULATION & ANALYSIS RESULT (${articleSpecificReport.simulationResults.accuracyPercent}% ACCURACY):`}
          </span>
          <span className="text-emerald-300">
            {articleSpecificReport.simulationResults.boundaryConditionSummary}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-xs">
            <div className="text-[10px] text-slate-400">
              {articleSpecificReport.simulationResults.primaryObservableLabel}
            </div>
            <div className="text-sm font-bold text-amber-300 mt-0.5">
              {articleSpecificReport.simulationResults.primaryObservableValue}
            </div>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-xs">
            <div className="text-[10px] text-slate-400">
              {articleSpecificReport.simulationResults.secondaryObservableLabel}
            </div>
            <div className="text-sm font-bold text-sky-300 mt-0.5">
              {articleSpecificReport.simulationResults.secondaryObservableValue}
            </div>
          </div>
        </div>

        <p className="text-xs font-academic-body text-slate-200 leading-relaxed">
          {articleSpecificReport.simulationResults.tailoredPhysicalInterpretation}
        </p>
      </div>
    </div>
  );
};
