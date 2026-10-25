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
    }


    const nodes: Node[] = Array.from({ length: config.count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * config.speed * 2,
      vy: (Math.random() - 0.5) * config.speed * 2,
      radius: Math.random() * 2 + 1,
      pulse: Math.random() * Math.PI,
    }));

    // 박스 크기가 바뀌면 점 위치를 새 크기에 맞춤.
    // 숨겨진 상태(크기 0)로 시작한 뒤 나타나면 점이 한쪽 모서리에 몰려 안 보이던 문제 방지.
    const onResize = () => {
      const oldW = W, oldH = H;
      const newW = canvas.offsetWidth, newH = canvas.offsetHeight;
      if (newW === oldW && newH === oldH) return;
      W = canvas.width = newW;
      H = canvas.height = newH;
      if (W === 0 || H === 0) return;
      for (const n of nodes) {
        n.x = oldW > 0 ? (n.x / oldW) * W : Math.random() * W;
        n.y = oldH > 0 ? (n.y / oldH) * H : Math.random() * H;
      }
    };
    // 창 크기 변화뿐 아니라 박스가 숨겨졌다 나타나는 경우(display: none → block)도 감지
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(canvas);
    window.addEventListener("resize", onResize);


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

      // 노드 이동
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        n.pulse += 0.02;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      }

      // 거리 캐시
      const D = config.dist;
      const dists: number[][] = Array.from({ length: nodes.length }, () => new Array(nodes.length).fill(Infinity));
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          dists[i][j] = dists[j][i] = d;
        }
      }

      // 삼각형 채우기 (세 노드 모두 임계거리 이내)
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          if (dists[i][j] > D) continue;
          for (let k = j + 1; k < nodes.length; k++) {
            if (dists[i][k] > D || dists[j][k] > D) continue;
            const avgD = (dists[i][j] + dists[i][k] + dists[j][k]) / 3;
            const triAlpha = Math.pow(1 - avgD / D, 2) * opacity * 0.07;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.lineTo(nodes[k].x, nodes[k].y);
            ctx.closePath();
            ctx.fillStyle = `rgba(${color}, ${triAlpha})`;
            ctx.fill();
          }
        }
      }

      // 연결선
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const d = dists[i][j];
          if (d > D) continue;
          const lineAlpha = Math.pow(1 - d / D, 1.5) * opacity * 0.5;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(${color}, ${lineAlpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // 노드 점
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const pulseVal = (Math.sin(n.pulse) + 1) * 0.5;
        const r = n.radius * (1 + pulseVal * 0.5);
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${opacity * (0.3 + pulseVal * 0.4)})`;
        ctx.fill();
      }
    }

    raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", onResize);
      resizeObserver.disconnect();
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
