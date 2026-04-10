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
      dense: { count: 45, dist: 150, speed: 0.15, signalSpeed: 0.012, signalRate: 0.012 },
      fast:  { count: 35, dist: 130, speed: 0.35, signalSpeed: 0.025, signalRate: 0.020 },
      deep:  { count: 60, dist: 180, speed: 0.08, signalSpeed: 0.008, signalRate: 0.008 },
      calm:  { count: 20, dist: 250, speed: 0.04, signalSpeed: 0.005, signalRate: 0.004 },
    }[mode];

    interface Node {
      x: number; y: number;
      vx: number; vy: number;
      radius: number;
      pulse: number;
      links: number[];
    }


    const MAX_LINKS = 5;
    const MIN_LINKS = 3;

    const nodes: Node[] = Array.from({ length: config.count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * config.speed * 2,
      vy: (Math.random() - 0.5) * config.speed * 2,
      radius: Math.random() * 2 + 1,
      pulse: Math.random() * Math.PI,
      links: [],
    }));

    // 각 노드에 가까운 순으로 3~5개만 연결
    for (let i = 0; i < nodes.length; i++) {
      const linkCount = MIN_LINKS + Math.floor(Math.random() * (MAX_LINKS - MIN_LINKS + 1));
      const dists = nodes.map((m, j) => {
        if (j === i) return { j, d: Infinity };
        const dx = m.x - nodes[i].x, dy = m.y - nodes[i].y;
        return { j, d: Math.sqrt(dx * dx + dy * dy) };
      }).sort((a, b) => a.d - b.d);
      nodes[i].links = dists.slice(0, linkCount).map(v => v.j);
    }


    let raf: number;
    let isVisible = true;

    const observer = new IntersectionObserver(
      ([entry]) => { isVisible = entry.isIntersecting; },
      { threshold: 0 }
    );
    observer.observe(canvas);

    function draw() {
      raf = requestAnimationFrame(draw);
      if (!isVisible) return;

      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "screen";

      // 노드 이동 + 그리기
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        n.pulse += 0.02;

        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;

        const pulseVal = (Math.sin(n.pulse) + 1) * 0.5;
        const r = n.radius * (1 + pulseVal * 0.5);

        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${opacity * (0.3 + pulseVal * 0.4)})`;
        ctx.fill();

        // 시냅스 연결선
        for (const j of n.links) {
          if (j <= i) continue;
          const m = nodes[j];
          const dx = m.x - n.x;
          const dy = m.y - n.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          const lineAlpha = Math.max(0, (1 - d / (config.dist * 1.5))) * opacity * 0.6;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(m.x, m.y);
          ctx.strokeStyle = `rgba(${color}, ${lineAlpha})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }
      }

    }

    raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
      observer.disconnect();
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
