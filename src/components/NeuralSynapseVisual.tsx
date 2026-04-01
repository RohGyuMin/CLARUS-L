"use client";

import { useEffect, useRef } from "react";

interface NeuralSynapseVisualProps {
  mode?: "dense" | "fast" | "deep" | "calm";
  color?: string;
  opacity?: number;
}

export default function NeuralSynapseVisual({
  mode = "dense",
  color = "96, 165, 250", // default blue
  opacity = 0.6,
}: NeuralSynapseVisualProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    window.addEventListener("resize", onResize);

    // 모드별 설정
    const config = {
      dense: { count: 45, dist: 150, speed: 0.15 },
      fast:  { count: 35, dist: 130, speed: 0.35 },
      deep:  { count: 60, dist: 180, speed: 0.08 },
      calm:  { count: 25, dist: 220, speed: 0.12 },
    }[mode];

    interface Node {
      x: number; y: number;
      vx: number; vy: number;
      radius: number;
      pulse: number;
    }

    const nodes: Node[] = Array.from({ length: config.count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * config.speed * 2,
      vy: (Math.random() - 0.5) * config.speed * 2,
      radius: Math.random() * 2 + 1,
      pulse: Math.random() * Math.PI,
    }));

    let raf: number;

    function draw() {
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "screen";

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        n.pulse += 0.02;

        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;

        // 노드 (뉴런 세포체)
        const pulseVal = (Math.sin(n.pulse) + 1) * 0.5;
        const r = n.radius * (1 + pulseVal * 0.5);
        
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${opacity * (0.3 + pulseVal * 0.4)})`;
        ctx.fill();

        // 시냅스 연결선
        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j];
          const dx = m.x - n.x;
          const dy = m.y - n.y;
          const d = Math.sqrt(dx * dx + dy * dy);

          if (d < config.dist) {
            const lineAlpha = (1 - d / config.dist) * opacity * 0.4;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.strokeStyle = `rgba(${color}, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();

            // 신호 전달 펄스 애니메이션 (가끔 빛나는 도트가 선을 타고 흐름)
            if (Math.random() > 0.998) {
              const signalX = n.x + dx * pulseVal;
              const signalY = n.y + dy * pulseVal;
              ctx.beginPath();
              ctx.arc(signalX, signalY, 2, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(255, 255, 255, ${lineAlpha * 2})`;
              ctx.fill();
            }
          }
        }
      }

      raf = requestAnimationFrame(draw);
    }

    raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, [mode, color, opacity]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        maskImage: "radial-gradient(circle at center, black 40%, transparent 85%)",
        WebkitMaskImage: "radial-gradient(circle at center, black 40%, transparent 85%)",
      }}
    />
  );
}
