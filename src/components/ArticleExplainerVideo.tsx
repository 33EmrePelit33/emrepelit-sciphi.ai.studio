import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Film,
  Volume2,
  VolumeX,
  FileText,
  Download,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import { Article, LanguageCode } from '../types';
import { getLanguageMeta, getLocalizedText } from '../i18n/translations';
import {
  EXPLAINER_VIDEO_DURATION_SEC,
  buildArticleExplainerScenes,
  getLearningUiStrings,
} from '../utils/articleLearningEngine';

interface ArticleExplainerVideoProps {
  article: Article;
  language: LanguageCode;
  onVideoMeasured?: (articleId: string) => void;
}

const CV_PORTRAIT_URL = '/assets/emre-pelit-cv-portrait.png';
const TOTAL_DURATION_SEC = EXPLAINER_VIDEO_DURATION_SEC;

function hashArticleSeed(id: string): number {
  let h = 5381;
  for (let i = 0; i < id.length; i++) {
    h = (h * 33) ^ id.charCodeAt(i);
  }
  return Math.abs(h);
}

function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export const ArticleExplainerVideo: React.FC<ArticleExplainerVideoProps> = ({
  article,
  language,
  onVideoMeasured,
}) => {
  const ui = getLearningUiStrings(language);
  const scenes = useMemo(
    () => buildArticleExplainerScenes(article, language),
    [article, language]
  );
  const articleTitle = getLocalizedText(article.title, language);
  const articleSeed = useMemo(() => hashArticleSeed(article.id), [article.id]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const portraitImgRef = useRef<HTMLImageElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number | null>(null);
  const measuredOnceRef = useRef<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordTimerRef = useRef<number | null>(null);

  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 1.25 | 1.5>(1);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(false);
  const [showScript, setShowScript] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [portraitReady, setPortraitReady] = useState<boolean>(false);
  const [activeSpokenSceneIdx, setActiveSpokenSceneIdx] = useState<number>(-1);

  const activeScene = useMemo(() => {
    return (
      scenes.find((s) => currentTime >= s.startSec && currentTime < s.endSec) ||
      scenes[scenes.length - 1]
    );
  }, [scenes, currentTime]);

  // Preload Emre Pelit's CV portrait image once cleanly
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      portraitImgRef.current = img;
      setPortraitReady(true);
    };
    img.onerror = () => {
      portraitImgRef.current = null;
      setPortraitReady(false);
    };
    img.src = CV_PORTRAIT_URL;
  }, []);

  // Reset playback state cleanly if article or language switches
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setActiveSpokenSceneIdx(-1);
    measuredOnceRef.current = false;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, [article.id, language]);

  // Draw crisp 960x540 visual explainer frame at given timestamp tSec
  const drawFrame = useCallback(
    (tSec: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const W = 960;
      const H = 540;
      const scene =
        scenes.find((s) => tSec >= s.startSec && tSec < s.endSec) ||
        scenes[scenes.length - 1];
      const sceneDuration = Math.max(1, scene.endSec - scene.startSec);
      const sceneProgress = Math.min(1, Math.max(0, (tSec - scene.startSec) / sceneDuration));
      const phase = tSec * 1.35 + (articleSeed % 17) * 0.4;

      // 1. Deep dark studio backdrop
      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, '#070C18');
      grad.addColorStop(0.55, '#0F172A');
      grad.addColorStop(1, '#111827');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Subtle architectural coordinate grid
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
      ctx.lineWidth = 1;
      for (let gx = 40; gx < W; gx += 60) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, H);
        ctx.stroke();
      }
      for (let gy = 40; gy < H; gy += 60) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(W, gy);
        ctx.stroke();
      }

      // 2. Right-side dynamic visual stage (animated physics / philosophy / algorithmic graphics)
      const stageX = 520;
      const stageY = 92;
      const stageW = 404;
      const stageH = 290;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.fillRect(stageX, stageY, stageW, stageH);
      ctx.strokeRect(stageX, stageY, stageW, stageH);

      const cx = stageX + stageW / 2;
      const cy = stageY + stageH / 2;
      const simType = scene.visualTheme;

      ctx.save();
      ctx.beginPath();
      ctx.rect(stageX + 4, stageY + 4, stageW - 8, stageH - 8);
      ctx.clip();

      if (simType === 'quantum') {
        // Wavefunction interference fringes & dual-wave pulses
        for (let waveIdx = 0; waveIdx < 2; waveIdx++) {
          ctx.beginPath();
          ctx.strokeStyle = waveIdx === 0 ? '#38BDF8' : '#F59E0B';
          ctx.lineWidth = waveIdx === 0 ? 2.5 : 1.6;
          for (let px = 0; px <= stageW - 36; px += 3) {
            const normX = (px / (stageW - 36)) * 4 * Math.PI;
            const env = Math.exp(-Math.pow((px - (stageW - 36) / 2) / 140, 2));
            const freq = 1.8 + (articleSeed % 5) * 0.25;
            const yOff =
              waveIdx === 0
                ? Math.sin(normX * freq - phase * 2.2) * Math.cos(normX * 0.45 + phase * 0.6) * 72 * env
                : Math.cos(normX * (freq * 0.8) + phase * 1.4) * 44 * env;
            const xPos = stageX + 18 + px;
            const yPos = cy + yOff;
            if (px === 0) ctx.moveTo(xPos, yPos);
            else ctx.lineTo(xPos, yPos);
          }
          ctx.stroke();
        }
        // Flowing probability quanta
        for (let p = 0; p < 7; p++) {
          const tOrb = (phase * 0.45 + p * 0.9) % (Math.PI * 2);
          const px = cx + Math.cos(tOrb) * (50 + p * 18);
          const py = cy + Math.sin(tOrb * 2) * 58;
          ctx.fillStyle = p % 2 === 0 ? '#38BDF8' : '#34D399';
          ctx.beginPath();
          ctx.arc(px, py, 3.8, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (simType === 'higgs') {
        // Mexican-hat scalar potential + rotating symmetry breaking orbit
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        for (let px = -160; px <= 160; px += 4) {
          const x = px / 95;
          const v = (x * x * x * x - 1.7 * x * x) * 72 + 42;
          const drawX = cx + px;
          const drawY = cy + 25 - v;
          if (px === -160) ctx.moveTo(drawX, drawY);
          else ctx.lineTo(drawX, drawY);
        }
        ctx.stroke();

        // Scalar field boson oscillating around minimum well
        const wellX = cx + Math.sin(phase * 1.7) * 86;
        const wellNorm = (wellX - cx) / 95;
        const wellY = cy + 25 - ((Math.pow(wellNorm, 4) - 1.7 * Math.pow(wellNorm, 2)) * 72 + 42);
        ctx.fillStyle = '#34D399';
        ctx.beginPath();
        ctx.arc(wellX, wellY, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(52, 211, 153, 0.45)';
        ctx.beginPath();
        ctx.arc(wellX, wellY, 15 + Math.sin(phase * 4) * 3, 0, Math.PI * 2);
        ctx.stroke();
      } else if (simType === 'holographic') {
        // AdS/CFT boundary circle & dual holographic chords
        const radius = 104;
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.stroke();

        const nodesCount = 10;
        for (let i = 0; i < nodesCount; i++) {
          const a1 = (i / nodesCount) * Math.PI * 2 + phase * 0.25;
          const a2 = (((i + 3) % nodesCount) / nodesCount) * Math.PI * 2 + phase * 0.25;
          const x1 = cx + Math.cos(a1) * radius;
          const y1 = cy + Math.sin(a1) * radius;
          const x2 = cx + Math.cos(a2) * radius;
          const y2 = cy + Math.sin(a2) * radius;
          ctx.strokeStyle = i % 2 === 0 ? 'rgba(52, 211, 153, 0.65)' : 'rgba(245, 158, 11, 0.55)';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.quadraticCurveTo(cx, cy, x2, y2);
          ctx.stroke();
          ctx.fillStyle = '#F8FAFC';
          ctx.beginPath();
          ctx.arc(x1, y1, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (simType === 'spacetime') {
        // Minkowski light-cone + curved spacetime metric lines
        for (let r = -3; r <= 3; r++) {
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.28)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          for (let px = -170; px <= 170; px += 8) {
            const warp = Math.exp(-(px * px) / 5200) * 28;
            const yPos = cy + r * 28 + warp * (r >= 0 ? 1 : 0.4);
            if (px === -170) ctx.moveTo(cx + px, yPos);
            else ctx.lineTo(cx + px, yPos);
          }
          ctx.stroke();
        }
        // Light cone diagonals
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(cx - 110, cy - 110);
        ctx.lineTo(cx + 110, cy + 110);
        ctx.moveTo(cx + 110, cy - 110);
        ctx.lineTo(cx - 110, cy + 110);
        ctx.stroke();

        // Proper time clock marker orbiting cone
        const worldY = cy - 90 + ((phase * 38) % 180);
        const worldX = cx + Math.sin((worldY - cy) * 0.04) * 32;
        ctx.fillStyle = '#34D399';
        ctx.beginPath();
        ctx.arc(worldX, worldY, 6.5, 0, Math.PI * 2);
        ctx.fill();
      } else if (simType === 'consciousness') {
        // Integrated information network graph (Phi nodes & synchronized firing)
        const phiNodes = 7;
        const pts: { x: number; y: number }[] = [];
        for (let i = 0; i < phiNodes; i++) {
          const ang = (i / phiNodes) * Math.PI * 2 + phase * 0.18;
          pts.push({
            x: cx + Math.cos(ang) * (76 + (i % 2) * 22),
            y: cy + Math.sin(ang) * (68 + (i % 2) * 18),
          });
        }
        for (let i = 0; i < phiNodes; i++) {
          for (let j = i + 1; j < phiNodes; j++) {
            const pulse = 0.25 + 0.55 * Math.abs(Math.sin(phase * 1.5 + i + j));
            ctx.strokeStyle = `rgba(56, 189, 248, ${pulse.toFixed(2)})`;
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
        pts.forEach((p, idx) => {
          const active = Math.floor(phase * 2) % phiNodes === idx;
          ctx.fillStyle = active ? '#F59E0B' : '#34D399';
          ctx.beginPath();
          ctx.arc(p.x, p.y, active ? 8 : 5.5, 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (simType === 'chaos') {
        // Strange attractor / Lorenz-style ribbon trajectory
        ctx.strokeStyle = '#34D399';
        ctx.lineWidth = 2;
        ctx.beginPath();
        let lx = 0.1 + ((articleSeed % 7) * 0.02);
        let ly = 0.0;
        let lz = 0.0;
        const dt = 0.014;
        const steps = 260;
        for (let s = 0; s < steps; s++) {
          const dx = 10 * (ly - lx);
          const dy = lx * (28 - lz) - ly;
          const dz = lx * ly - (8 / 3) * lz;
          lx += dx * dt;
          ly += dy * dt;
          lz += dz * dt;
          const px = cx + lx * 7.2 * Math.cos(phase * 0.15) - (lz - 24) * 2.2 * Math.sin(phase * 0.15);
          const py = cy + 68 - lz * 3.1;
          if (s === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      } else {
        // Software / AI deterministic architectural pipeline
        const stages = 4;
        const activeIdx = Math.floor(phase * 1.2) % stages;
        for (let i = 0; i < stages; i++) {
          const bx = stageX + 26 + i * 94;
          const by = cy - 30;
          if (i < stages - 1) {
            ctx.strokeStyle = i === activeIdx ? '#34D399' : '#475569';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(bx + 72, cy);
            ctx.lineTo(bx + 94, cy);
            ctx.stroke();
          }
          ctx.fillStyle = i === activeIdx ? '#064E3B' : '#1E293B';
          ctx.strokeStyle = i === activeIdx ? '#34D399' : '#64748B';
          ctx.lineWidth = i === activeIdx ? 2.4 : 1.2;
          ctx.fillRect(bx, by, 72, 60);
          ctx.strokeRect(bx, by, 72, 60);
          ctx.fillStyle = '#F8FAFC';
          ctx.font = 'bold 12px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(`M${i + 1}`, bx + 36, cy + 4);
        }
        ctx.textAlign = 'left';
      }
      ctx.restore();

      // Stage footer formula label
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(stageX, stageY + stageH - 36, stageW, 36);
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
      ctx.strokeRect(stageX, stageY + stageH - 36, stageW, 36);
      ctx.fillStyle = '#FCD34D';
      ctx.font = '12px monospace';
      const eqSlice =
        scene.keyEquation.length > 44
          ? `${scene.keyEquation.slice(0, 44)}…`
          : scene.keyEquation;
      ctx.fillText(eqSlice, stageX + 12, stageY + stageH - 13);

      // 3. Top Header Strip inside video frame
      ctx.fillStyle = '#10B981';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(
        `${article.figureNumber} · ${article.category.toUpperCase()}`,
        34,
        36
      );

      ctx.fillStyle = '#94A3B8';
      ctx.font = '12px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(
        `SAHNE ${scene.index + 1} / ${scenes.length} · ${tSec.toFixed(1)}s / ${TOTAL_DURATION_SEC}s`,
        W - 34,
        36
      );
      ctx.textAlign = 'left';

      // Subtle divider under top header
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.22)';
      ctx.beginPath();
      ctx.moveTo(34, 52);
      ctx.lineTo(W - 34, 52);
      ctx.stroke();

      // 4. Left Column Text + Emre Pelit CV Portrait (when scene.showAuthorPortrait is true or small presenter badge)
      const leftW = 462;
      let textStartY = 96;

      if (scene.showAuthorPortrait) {
        const avatarRadius = 38;
        const avatarCx = 74;
        const avatarCy = 114;

        ctx.save();
        ctx.beginPath();
        ctx.arc(avatarCx, avatarCy, avatarRadius + 2, 0, Math.PI * 2);
        ctx.fillStyle = '#10B981';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(avatarCx, avatarCy, avatarRadius, 0, Math.PI * 2);
        ctx.clip();

        if (portraitImgRef.current) {
          ctx.drawImage(
            portraitImgRef.current,
            avatarCx - avatarRadius,
            avatarCy - avatarRadius,
            avatarRadius * 2,
            avatarRadius * 2
          );
        } else {
          ctx.fillStyle = '#1E3A8A';
          ctx.fillRect(
            avatarCx - avatarRadius,
            avatarCy - avatarRadius,
            avatarRadius * 2,
            avatarRadius * 2
          );
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 22px serif';
          ctx.textAlign = 'center';
          ctx.fillText('EP', avatarCx, avatarCy + 8);
          ctx.textAlign = 'left';
        }
        ctx.restore();

        ctx.fillStyle = '#FCD34D';
        ctx.font = 'bold 13px monospace';
        ctx.fillText('EMRE PELİT · YAZAR & ANLATICI', 128, 102);

        ctx.fillStyle = '#CBD5E1';
        ctx.font = '12px sans-serif';
        ctx.fillText('Resmî Özgeçmiş (CV) Fotoğrafı · Telifsiz HTML5 Sunum', 128, 124);

        textStartY = 178;
      }

      // Scene heading (highlight conclusion scene cleanly)
      ctx.fillStyle = scene.isConclusionScene ? '#34D399' : '#38BDF8';
      ctx.font = 'bold 14px monospace';
      ctx.fillText(scene.heading, 34, textStartY);

      // Article title (cleanly wrapped)
      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 22px Georgia, serif';
      const titleLines = wrapCanvasText(ctx, articleTitle, leftW).slice(0, 3);
      let cursorY = textStartY + 34;
      titleLines.forEach((line) => {
        ctx.fillText(line, 34, cursorY);
        cursorY += 28;
      });

      // Scene bullet points with progressive reveal
      cursorY += 10;
      scene.bulletPoints.forEach((bp, bpIdx) => {
        const revealAlpha = sceneProgress > bpIdx * 0.2 ? 1 : 0.35;
        ctx.fillStyle = `rgba(226, 232, 240, ${revealAlpha})`;
        ctx.font = '14px sans-serif';
        const bpLines = wrapCanvasText(ctx, `• ${bp}`, leftW).slice(0, 3);
        bpLines.forEach((bLine) => {
          if (cursorY < 375) {
            ctx.fillText(bLine, 34, cursorY);
            cursorY += 21;
          }
        });
        cursorY += 6;
      });

      // 5. Bottom Caption Band (high contrast measured scrim)
      ctx.fillStyle = 'rgba(2, 6, 23, 0.92)';
      ctx.fillRect(24, H - 122, W - 48, 86);
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.45)';
      ctx.lineWidth = 1;
      ctx.strokeRect(24, H - 122, W - 48, 86);

      ctx.fillStyle = '#E2E8F0';
      ctx.font = '15px sans-serif';
      const capLines = wrapCanvasText(ctx, scene.caption, W - 88).slice(0, 3);
      let capY = H - 96;
      capLines.forEach((cl) => {
        ctx.fillText(cl, 42, capY);
        capY += 22;
      });

      // 6. Progress Bar Strip at very bottom
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(24, H - 24, W - 48, 6);
      ctx.fillStyle = '#10B981';
      ctx.fillRect(24, H - 24, Math.round((tSec / TOTAL_DURATION_SEC) * (W - 48)), 6);
    },
    [scenes, article.figureNumber, article.category, articleSeed, articleTitle]
  );

  // Redraw canvas whenever currentTime changes or portrait image loads
  useEffect(() => {
    drawFrame(currentTime);
  }, [currentTime, portraitReady, drawFrame]);

  // Trigger optional voiceover per scene during playback
  useEffect(() => {
    if (!isPlaying || !voiceEnabled) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (activeScene.index === activeSpokenSceneIdx) return;

    setActiveSpokenSceneIdx(activeScene.index);
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(`${activeScene.heading}. ${activeScene.caption}`);
    const langMeta = getLanguageMeta(language);
    utter.lang = langMeta.speechLang;
    utter.rate = Math.min(1.25, playbackSpeed);
    const voices = window.speechSynthesis.getVoices();
    const matched =
      voices.find((v) => v.lang.toLowerCase() === langMeta.speechLang.toLowerCase()) ||
      voices.find((v) => v.lang.toLowerCase().startsWith(language.toLowerCase()));
    if (matched) utter.voice = matched;
    window.speechSynthesis.speak(utter);
  }, [isPlaying, voiceEnabled, activeScene, activeSpokenSceneIdx, language, playbackSpeed]);

  // Animation loop when playing
  useEffect(() => {
    if (!isPlaying) {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      lastFrameTimeRef.current = null;
      return;
    }

    const tick = (nowMs: number) => {
      if (lastFrameTimeRef.current === null) {
        lastFrameTimeRef.current = nowMs;
      }
      const deltaSec = ((nowMs - lastFrameTimeRef.current) / 1000) * playbackSpeed;
      lastFrameTimeRef.current = nowMs;

      setCurrentTime((prev) => {
        const next = prev + deltaSec;
        if (next >= TOTAL_DURATION_SEC) {
          setIsPlaying(false);
          return TOTAL_DURATION_SEC;
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying, playbackSpeed]);

  const handleTogglePlay = () => {
    if (!measuredOnceRef.current) {
      measuredOnceRef.current = true;
      onVideoMeasured?.(article.id);
    }
    if (currentTime >= TOTAL_DURATION_SEC) {
      setCurrentTime(0);
      setActiveSpokenSceneIdx(-1);
    }
    if (isPlaying && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying((prev) => !prev);
  };

  const handleRestart = () => {
    setCurrentTime(0);
    setActiveSpokenSceneIdx(-1);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (!measuredOnceRef.current) {
      measuredOnceRef.current = true;
      onVideoMeasured?.(article.id);
    }
    setIsPlaying(true);
  };

  const handleExportWebm = async () => {
    if (isRecording && mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      if (recordTimerRef.current !== null) {
        window.clearTimeout(recordTimerRef.current);
        recordTimerRef.current = null;
      }
      mediaRecorderRef.current.stop();
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas || typeof MediaRecorder === 'undefined' || !('captureStream' in canvas)) {
      return;
    }
    setIsRecording(true);
    setCurrentTime(0);
    setIsPlaying(true);

    const stream = canvas.captureStream(30);
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : 'video/webm';
    const recorder = new MediaRecorder(stream, { mimeType });
    mediaRecorderRef.current = recorder;
    const chunks: Blob[] = [];

    recorder.ondataavailable = (ev) => {
      if (ev.data && ev.data.size > 0) chunks.push(ev.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${article.slug || article.id}-explainer-60s.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      mediaRecorderRef.current = null;
      setIsRecording(false);
    };

    recorder.start();
    // Auto-complete 15s pass or user clicks button earlier to finalize
    recordTimerRef.current = window.setTimeout(() => {
      if (recorder.state !== 'inactive') {
        recorder.stop();
      }
      recordTimerRef.current = null;
    }, 15000);
  };

  return (
    <div className="bg-[#0F172A] text-slate-100 border border-slate-700 rounded-sm overflow-hidden">
      {/* Compact Video Header */}
      <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2 min-w-0">
          <Film className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-bold text-emerald-300 truncate">
            {ui.videoTitlePrefix}: {articleTitle}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-300 shrink-0">
          <img
            src={CV_PORTRAIT_URL}
            alt="Emre Pelit CV Portresi"
            className="w-6 h-6 rounded-full object-cover border border-emerald-400/70"
            referrerPolicy="no-referrer"
          />
          <span>Emre Pelit</span>
        </div>
      </div>

      {/* 16:9 HTML5 Canvas Video Stage */}
      <div className="relative bg-[#070C18]">
        <canvas
          ref={canvasRef}
          width={960}
          height={540}
          className="w-full h-auto block aspect-[16/9]"
          aria-label={`${ui.videoTitlePrefix} - ${articleTitle}`}
        />

        {!isPlaying && (
          <button
            type="button"
            onClick={handleTogglePlay}
            aria-label={ui.playBtn}
            className="absolute inset-0 flex items-center justify-center bg-slate-950/25 hover:bg-slate-950/10 transition-colors cursor-pointer group"
          >
            <span className="inline-flex items-center gap-2.5 px-5 py-3 bg-emerald-500 group-hover:bg-emerald-400 text-slate-950 font-mono text-xs sm:text-sm font-extrabold rounded-sm shadow-lg transition-transform group-hover:scale-105">
              <Play className="w-4 h-4 fill-current" />
              <span>{ui.playBtn} ({TOTAL_DURATION_SEC} sn · HTML5)</span>
            </span>
          </button>
        )}
      </div>

      {/* Interactive Player Controls + Scene Scrubber */}
      <div className="p-3.5 bg-slate-900 border-t border-slate-800 space-y-2.5 font-mono text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={handleTogglePlay}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xs cursor-pointer transition-colors"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? ui.pauseBtn : ui.playBtn}</span>
            </button>

            <button
              type="button"
              onClick={handleRestart}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xs cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{ui.restartBtn}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const next = !voiceEnabled;
                setVoiceEnabled(next);
                if (!next && typeof window !== 'undefined' && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
              }}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 border rounded-xs cursor-pointer transition-colors ${
                voiceEnabled
                  ? 'bg-sky-500/20 border-sky-400 text-sky-200 font-bold'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {voiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{voiceEnabled ? ui.voiceOnBtn : ui.voiceOffBtn}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowScript((p) => !p)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded-xs cursor-pointer transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{ui.scriptToggleBtn}</span>
            </button>

            <button
              type="button"
              onClick={handleExportWebm}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 border rounded-xs cursor-pointer transition-colors ${
                isRecording
                  ? 'bg-amber-950 hover:bg-amber-900 text-amber-200 border-amber-400'
                  : 'bg-slate-800 hover:bg-slate-700 text-emerald-300 border-emerald-500/40'
              }`}
            >
              {isRecording ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>{isRecording ? ui.stopRecordingBtn : ui.exportWebmBtn}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 tabular-nums">
            <span className="text-slate-300">
              {currentTime.toFixed(1)}s / {TOTAL_DURATION_SEC}s
            </span>
            <select
              aria-label="Video oynatma hızı"
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(Number(e.target.value) as 1 | 1.25 | 1.5)}
              className="px-2 py-1 bg-slate-950 border border-slate-700 text-slate-200 rounded-xs cursor-pointer"
            >
              <option value={1}>1.0x</option>
              <option value={1.25}>1.25x</option>
              <option value={1.5}>1.5x</option>
            </select>
          </div>
        </div>

        {/* Interactive 6-Scene Jump Timeline (60s) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5">
          {scenes.map((sc) => {
            const active = activeScene.index === sc.index;
            return (
              <button
                key={sc.index}
                type="button"
                onClick={() => {
                  setCurrentTime(sc.startSec);
                  setActiveSpokenSceneIdx(-1);
                }}
                className={`px-2 py-1.5 text-left text-[10px] rounded-xs border transition-colors cursor-pointer truncate ${
                  active
                    ? 'bg-emerald-950 border-emerald-400 text-emerald-200 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
                title={sc.heading}
              >
                {sc.startSec}s–{sc.endSec}s · {sc.heading}
              </button>
            );
          })}
        </div>

        {/* Optional Captions & Full Script */}
        {showScript && (
          <div className="bg-slate-950 border border-slate-800 p-3 rounded-xs space-y-2 text-[11px] font-sans text-slate-200">
            {scenes.map((sc) => (
              <div key={`script-${sc.index}`} className="border-b border-slate-800/80 last:border-0 pb-1.5 last:pb-0">
                <div className="font-mono font-bold text-cyan-300 text-[10px]">
                  [{sc.startSec}s–{sc.endSec}s] {sc.heading}
                </div>
                <p className="leading-relaxed text-slate-300 mt-0.5">{sc.caption}</p>
              </div>
            ))}
          </div>
        )}

        {/* Explicit Copyright & Freedom of Thought Notice */}
        <div className="flex items-start gap-2 pt-1 text-[10px] text-slate-400 font-sans leading-relaxed">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
          <span>{ui.legalAndFreedomNote}</span>
        </div>
      </div>
    </div>
  );
};
