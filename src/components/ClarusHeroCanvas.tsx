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

    const onResize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const ro = new ResizeObserver(onResize);
    ro.observe(canvas);
    window.addEventListener("mousemove", onMouseMove);

    /* ── 설정 및 초기화 ── */
    const nodeCount = 45;
    const brainCenterX = W * 0.65;
    const brainCenterY = H * 0.45;
    const brainBaseScale = Math.min(W, H) * 0.38;

    const nodes: Node[] = Array.from({ length: nodeCount }, (_, i) => {
      const ang = Math.random() * Math.PI * 2;
      const dist = Math.random() * brainBaseScale * 1.2;
      return {
        x: brainCenterX + Math.cos(ang) * dist,
        y: brainCenterY + Math.sin(ang) * dist,
        vx: rand(-0.15, 0.15), vy: rand(-0.1, 0.1),
        radius: i % 8 === 0 ? rand(3, 5) : rand(1.2, 2.5),
        alpha: rand(0.4, 0.9),
        hue: rand(195, 240),
        hub: i % 8 === 0,
      };
    });

    const pulses: Pulse[] = [];
    const nodeGlows = new Float32Array(nodeCount);

    function spawnPulse() {
      const startIdx = Math.floor(Math.random() * nodes.length);
      const possibleEnds = [];
      for (let i = 0; i < nodes.length; i++) {
        if (i === startIdx) continue;
        const d = Math.sqrt((nodes[startIdx].x - nodes[i].x)**2 + (nodes[startIdx].y - nodes[i].y)**2);
        if (d < 200) possibleEnds.push(i);
      }
      if (possibleEnds.length > 0) {
        pulses.push({
          start: startIdx,
          end: possibleEnds[Math.floor(Math.random() * possibleEnds.length)],
          progress: 0,
          speed: rand(0.015, 0.035),
        });
      }
    }

    /* ── 렌더링 레이어 함수들 ── */
    
    function drawBrainStructure(t: number) {
      const pulse = Math.sin(t * 0.004) * 0.02;
      const scale = brainBaseScale * (1 + pulse);
      ctx.save();
      ctx.translate(brainCenterX, brainCenterY);
      ctx.beginPath();
      ctx.moveTo(-0.1 * scale, 0.4 * scale);
      ctx.bezierCurveTo(-0.8 * scale, 0.5 * scale, -1.2 * scale, 0.1 * scale, -1.1 * scale, -0.5 * scale);
      ctx.bezierCurveTo(-1.0 * scale, -1.3 * scale, -0.4 * scale, -1.4 * scale, -0.1 * scale, -1.2 * scale);
      ctx.bezierCurveTo(0.3 * scale, -1.4 * scale, 1.0 * scale, -1.3 * scale, 1.1 * scale, -0.5 * scale);
      ctx.bezierCurveTo(1.2 * scale, 0.1 * scale, 0.8 * scale, 0.5 * scale, 0.1 * scale, 0.4 * scale);
      ctx.closePath();
      const alpha = 0.08 + Math.sin(t * 0.004) * 0.06;
      const grad = ctx.createRadialGradient(0, -0.3 * scale, 0, 0, -0.3 * scale, scale * 1.3);
      grad.addColorStop(0, `rgba(37, 99, 235, ${alpha})`);
      grad.addColorStop(1, "rgba(3, 7, 18, 0)");
      ctx.fillStyle = grad; ctx.fill();
      ctx.restore();
    }

    function drawNeuralNetwork(t: number) {
      const t_ = t * 0.001;
      
      // 1. 유기적 연결망 (직선 -> 부드러운 곡선)
      ctx.save();
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j];
          const dx = m.x - n.x, dy = m.y - n.y;
          const d = Math.sqrt(dx*dx + dy*dy);
          
          if (d < 185) {
            const alpha = (1 - d / 185) * 0.25; // 가시성 0.15 -> 0.25 상향
            
            // 곡선의 휘어짐(Control Point)을 유기적으로 계산
            const midX = (n.x + m.x) / 2;
            const midY = (n.y + m.y) / 2;
            const offset = Math.sin(t_ + (i + j)) * 15; // 미세하게 일렁이는 효과
            const cpx = midX + Math.sin(t_ * 0.5) * offset;
            const cpy = midY + Math.cos(t_ * 0.5) * offset;

            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.quadraticCurveTo(cpx, cpy, m.x, m.y);
            
            // 신경 섬유 느낌의 다층 스트로크
            ctx.strokeStyle = `rgba(147, 197, 253, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
            
            // 가끔 아주 연한 글로우
            if (alpha > 0.15) {
              ctx.strokeStyle = `rgba(96, 165, 250, ${alpha * 0.3})`;
              ctx.lineWidth = 2.5;
              ctx.stroke();
            }
          }
        }
      }
      ctx.restore();

      // 2. 전기 펄스 (곡선 경로 및 잔상 효과 강화)
      if (t % 5 === 0 && Math.random() > 0.4 && pulses.length < 50) spawnPulse(); // 빈도 및 최대 개수 상향
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        const n1 = nodes[p.start], n2 = nodes[p.end];
        p.progress += p.speed;
        if (p.progress >= 1) {
          nodeGlows[p.end] = 1.0;
          pulses.splice(i, 1);
          continue;
        }

        // 곡선 경로 상의 좌표 계산 (중앙 오프셋 반영)
        const midX = (n1.x + n2.x) / 2;
        const midY = (n1.y + n2.y) / 2;
        const offset = Math.sin(t_ + (p.start + p.end)) * 15;
        const cpx = midX + Math.sin(t_ * 0.5) * offset;
        const cpy = midY + Math.cos(t_ * 0.5) * offset;

        const u = p.progress;
        const mu = 1 - u;
        // 2차 베지어 곡선 공식
        const px = mu*mu*n1.x + 2*mu*u*cpx + u*u*n2.x;
        const py = mu*mu*n1.y + 2*mu*u*cpy + u*u*n2.y;

        // 전기 스파크 헤드 및 잔상
        ctx.save();
        ctx.shadowBlur = 25; ctx.shadowColor = "#60a5fa"; // 광도 상향
        
        // 1. 잔상 (Trail)
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(96, 165, 250, 0.4)";
        ctx.fill();

        // 2. 밝은 코어 (Core)
        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.restore();
      }

      // 3. 노드 드로잉 (이미지 스타일 글로우 링 포함)
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;

        const glow = nodeGlows[i];
        if (glow > 0) nodeGlows[i] -= 0.025;

        // 기본 노드
        ctx.beginPath(); ctx.arc(n.x, n.y, n.hub ? 2.5 : 1.2, 0, Math.PI*2);
        ctx.fillStyle = `rgba(147, 197, 253, ${0.3 + glow * 0.7})`;
        ctx.fill();

        // 발화 효과 (이미지 스타일 링)
        if (glow > 0) {
          ctx.save();
          ctx.beginPath(); ctx.arc(n.x, n.y, 4 * glow, 0, Math.PI*2);
          ctx.fillStyle = `rgba(96, 165, 250, ${glow})`;
          ctx.shadowBlur = 20 * glow; ctx.shadowColor = "#60a5fa";
          ctx.fill();
          ctx.beginPath(); ctx.arc(n.x, n.y, 12 * glow, 0, Math.PI*2);
          ctx.strokeStyle = `rgba(96, 165, 250, ${glow * 0.4})`;
          ctx.lineWidth = 1; ctx.stroke();
          ctx.restore();
        }
      }
    }

    /* ── 오로라 레이어 (Atmospheric Aurora) - 더욱 풍성하게 강화 ── */
    const auroraLayers = [
      { hue: 200, spread: 0.65, yFrac: 0.3, phase: 0, speed: 0.00025, alpha: 0.12 }, // Cyan
      { hue: 260, spread: 0.55, yFrac: 0.6, phase: 1.5, speed: 0.00018, alpha: 0.10 }, // Deep Purple
      { hue: 160, spread: 0.45, yFrac: 0.45, phase: 3.0, speed: 0.00012, alpha: 0.08 }, // Emerald Green 포인트
    ];

    function drawAurora(t: number) {
      for (const layer of auroraLayers) {
        const phase = t * layer.speed + layer.phase;
        // 더 와이드한 움직임
        const cx = W * 0.5 + Math.sin(phase * 0.6) * W * 0.25;
        const cy = H * layer.yFrac + Math.cos(phase * 0.8) * H * 0.08;
        const rx = W * layer.spread;
        const ry = H * 0.35; // 더 수직으로 퍼짐

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rx);
        grad.addColorStop(0, `hsla(${layer.hue}, 85%, 60%, ${layer.alpha})`);
        grad.addColorStop(0.5, `hsla(${layer.hue}, 70%, 40%, ${layer.alpha * 0.4})`);
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
      frame++; ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#030712"; ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "screen";
      drawBrainStructure(frame);
      drawAurora(frame);
      drawNeuralNetwork(frame);
      ctx.globalCompositeOperation = "source-over";
      const fadeGrad = ctx.createLinearGradient(0, H * 0.8, 0, H);
      fadeGrad.addColorStop(0, "rgba(3,7,18,0)"); fadeGrad.addColorStop(1, "rgba(3,7,18,1)");
      ctx.fillStyle = fadeGrad; ctx.fillRect(0, 0, W, H);
      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf); ro.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }} />;
}
