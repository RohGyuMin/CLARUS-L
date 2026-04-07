"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number; y: number;
  vx: number; vy: number;
  radius: number;
  alpha: number;
  hue: number;
  hub?: boolean;
}

interface Pulse {
  start: number;
  end: number;
  progress: number;
  speed: number;
}

interface Spark {
  x: number; y: number;
  vx: number; vy: number;
  alpha: number;
  size: number;
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export default function ClarusHeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    if (!ctx) return;

    let W = canvas.width = canvas.offsetWidth;
    let H = canvas.height = canvas.offsetHeight;

    /* ── 설정 및 초기화 ── */
    const nodeCount = 150; // 노드 수 상향 (공간 채우기용)
    let brainCenterX = W * 0.75; 
    let brainCenterY = H * 0.45;
    let brainBaseScale = Math.min(W, H) * 0.32;

    const nodes: Node[] = Array.from({ length: nodeCount }, (_, i) => {
      const ang = Math.random() * Math.PI * 2;
      let dist, nx, ny;
      
      if (i < 80) {
        // 메인 브레인 클러스터
        dist = i < 50 ? Math.random() * brainBaseScale * 0.95 : Math.random() * brainBaseScale * 2.2;
        nx = brainCenterX + Math.cos(ang) * dist;
        ny = brainCenterY + Math.sin(ang) * dist;
      } else {
        // 화면 전역에 퍼진 앰비언트 노드
        nx = Math.random() * W;
        ny = Math.random() * H;
      }

      return {
        x: nx, y: ny,
        vx: rand(-0.12, 0.12), vy: rand(-0.10, 0.10),
        radius: i % 10 === 0 ? rand(3.5, 5.5) : rand(1.2, 2.8),
        alpha: i < 80 ? rand(0.5, 0.95) : rand(0.2, 0.5), // 배경 노드는 더 투명하게
        hue: rand(195, 235),
        hub: i % 10 === 0,
      };
    });

    const onResize = () => {
      const oldCenterX = brainCenterX, oldCenterY = brainCenterY;
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      brainCenterX = W * 0.75; 
      brainCenterY = H * 0.45;
      brainBaseScale = Math.min(W, H) * 0.32;

      const dx = brainCenterX - oldCenterX;
      const dy = brainCenterY - oldCenterY;
      nodes.forEach(n => {
        n.x += dx;
        n.y += dy;
      });
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const ro = new ResizeObserver(onResize);
    ro.observe(canvas);
    window.addEventListener("mousemove", onMouseMove);

    const pulses: Pulse[] = [];
    const nodeGlows = new Float32Array(nodeCount);
    const sparks: Spark[] = [];

    function spawnSpark(x: number, y: number) {
      const count = 6;
      for (let i = 0; i < count; i++) {
        const ang = Math.random() * Math.PI * 2;
        const speed = rand(1.5, 4.0);
        sparks.push({
          x, y,
          vx: Math.cos(ang) * speed,
          vy: Math.sin(ang) * speed,
          alpha: 1.0,
          size: rand(0.6, 1.4),
        });
      }
    }

    function spawnPulse() {
      const isAmbientPulse = Math.random() > 0.85; // 15% 확률로 배경 앰비언트 펄스 발생
      const startIdx = isAmbientPulse 
        ? 80 + Math.floor(Math.random() * (nodes.length - 80)) 
        : Math.floor(Math.random() * 80);
        
      const possibleEnds = [];
      const searchDist = isAmbientPulse ? 400 : 250;
      for (let i = 0; i < nodes.length; i++) {
        if (i === startIdx) continue;
        const d = Math.sqrt((nodes[startIdx].x - nodes[i].x)**2 + (nodes[startIdx].y - nodes[i].y)**2);
        if (d < searchDist) possibleEnds.push(i);
      }
      if (possibleEnds.length > 0) {
        pulses.push({
          start: startIdx,
          end: possibleEnds[Math.floor(Math.random() * possibleEnds.length)],
          progress: 0,
          speed: isAmbientPulse ? rand(0.008, 0.02) : rand(0.012, 0.035),
        });
      }
    }

    /* ── 렌더링 레이어 함수들 ── */

    // 1. 별빛 배경
    const stars = Array.from({ length: 100 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      size: rand(0.4, 1.4),
      offset: Math.random() * Math.PI * 2,
    }));

    function drawStars(t: number) {
      ctx.save();
      for (const s of stars) {
        const opacity = 0.1 + Math.abs(Math.sin(t * 0.01 + s.offset)) * 0.5;
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    function drawSparks() {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx; s.y += s.vy;
        s.alpha -= 0.04;
        if (s.alpha <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        ctx.strokeStyle = `rgba(147, 197, 253, ${s.alpha})`;
        ctx.lineWidth = s.size;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * 1.5, s.y - s.vy * 1.5);
        ctx.stroke();
      }
      ctx.restore();
    }

    // 2. 신경 코어 (링 & 가로지르는 섬유)
    function drawNeuralCore(t: number) {
      const t_ = t * 0.002;
      const pulse = Math.sin(t * 0.006) * 0.025;
      const scale = brainBaseScale * (1 + pulse);

      ctx.save();
      ctx.translate(brainCenterX, brainCenterY);

      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        const r = scale * (1.1 + i * 0.03); 
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(96, 165, 250, ${0.12 - i * 0.03})`;
        ctx.lineWidth = 1 + i * 5;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(0, 0, scale, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(168, 200, 255, 0.85)";
      ctx.lineWidth = 2;
      ctx.shadowBlur = 20;
      ctx.shadowColor = "rgba(59, 130, 246, 0.9)";
      ctx.stroke();

      ctx.shadowBlur = 0;
      const coreNodeCount = 50;
      for (let i = 0; i < 45; i++) {
        const n = nodes[i % coreNodeCount];
        const m = nodes[(i * 13 + 7) % coreNodeCount];
        
        ctx.beginPath();
        ctx.moveTo(n.x - brainCenterX, n.y - brainCenterY);
        ctx.quadraticCurveTo(
          Math.cos(t_ + i) * scale * 0.4,
          Math.sin(t_ + i) * scale * 0.4,
          m.x - brainCenterX, m.y - brainCenterY
        );
        ctx.strokeStyle = `rgba(147, 197, 253, ${0.08 + Math.random() * 0.12})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
      ctx.restore();
    }

    // 4. 일반 신경망 & 펄스 효과
    function drawNeuralNetwork(t: number) {
      ctx.save();
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j];
          const d = Math.sqrt((m.x - n.x)**2 + (m.y - n.y)**2);
          if (d < 170) {
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.strokeStyle = `rgba(168, 204, 255, ${(1 - d / 170) * 0.22})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }
      ctx.restore();

      if (t % 7 === 0 && Math.random() > 0.4 && pulses.length < 60) spawnPulse();
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        const n = nodes[p.start], m = nodes[p.end];
        p.progress += p.speed;
        if (p.progress >= 1) {
          nodeGlows[p.end] = 1.0;
          if (p.speed > 0.01) spawnSpark(m.x, m.y); // 아주 느린 펄스는 스파크 생략하거나 줄임
          pulses.splice(i, 1);
          continue;
        }
        const px = lerp(n.x, m.x, p.progress);
        const py = lerp(n.y, m.y, p.progress);

        ctx.save();
        const isAmbient = p.start >= 80;
        ctx.shadowBlur = isAmbient ? 10 : 18; 
        ctx.shadowColor = "#60a5fa";
        ctx.beginPath(); ctx.arc(px, py, isAmbient ? 1.5 : 2.2, 0, Math.PI * 2);
        ctx.fillStyle = isAmbient ? "rgba(255,255,255,0.6)" : "#fff"; 
        ctx.fill();
        ctx.restore();
      }

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;

        const glow = nodeGlows[i];
        if (glow > 0) nodeGlows[i] -= 0.028;

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.hub ? 3.0 : 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168, 204, 255, ${0.45 + glow * 0.55})`;
        ctx.fill();

        if (glow > 0) {
          ctx.save();
          ctx.shadowBlur = 22 * glow; ctx.shadowColor = "#60a5fa";
          ctx.beginPath(); ctx.arc(n.x, n.y, 5.5 * glow, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${glow * 0.85})`;
          ctx.fill();
          ctx.restore();
        }
      }
    }

    // 5. 오로라 대기 레이어
    const auroraLayers = [
      { hue: 205, spread: 0.75, yFrac: 0.35, phase: 0, speed: 0.00028, alpha: 0.16 },
      { hue: 275, spread: 0.65, yFrac: 0.65, phase: 1.8, speed: 0.00022, alpha: 0.14 },
    ];

    function drawAurora(t: number) {
      for (const layer of auroraLayers) {
        const phase = t * layer.speed + layer.phase;
        const cx = W * 0.5 + Math.sin(phase) * W * 0.22;
        const cy = H * layer.yFrac + Math.cos(phase * 0.8) * H * 0.12;
        const rx = W * layer.spread;
        const ry = H * 0.45;

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rx);
        grad.addColorStop(0, `hsla(${layer.hue}, 85%, 55%, ${layer.alpha})`);
        grad.addColorStop(1, "rgba(3, 7, 18, 0)");

        ctx.save();
        ctx.scale(1, ry / rx);
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(cx, cy * (rx / ry), rx, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
    }

    let frame = 0, raf: number;
    function tick() {
      frame++;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#030712";
      ctx.fillRect(0, 0, W, H);
      
      ctx.globalCompositeOperation = "screen";
      drawStars(frame);
      drawAurora(frame);
      drawNeuralCore(frame);
      drawNeuralNetwork(frame);
      drawSparks();
      
      ctx.globalCompositeOperation = "source-over";
      const fadeGrad = ctx.createLinearGradient(0, H * 0.82, 0, H);
      fadeGrad.addColorStop(0, "rgba(3,7,18,0)");
      fadeGrad.addColorStop(1, "rgba(3,7,18,1)");
      ctx.fillStyle = fadeGrad;
      ctx.fillRect(0, 0, W, H);
      
      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
      }}
    />
  );
}
