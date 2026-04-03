import { useEffect, useRef, useState } from "react";

interface ClickPulse {
  id: number;
  x: number;
  y: number;
}

export default function ClarusCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [pulses, setPulses] = useState<ClickPulse[]>([]);

  // 마우스 실제 위치
  const mx = useRef(0), my = useRef(0);
  // ring 지연 추적 위치
  const rx = useRef(0), ry = useRef(0);
  // glow 더 천천히 추적
  const gx = useRef(0), gy = useRef(0);

  useEffect(() => {
    // 기본 커서 숨기기 (CLARUS-N 페이지에서만)
    document.documentElement.style.cursor = "none";

    const onMove = (e: MouseEvent) => {
      mx.current = e.clientX;
      my.current = e.clientY;
      // dot는 즉시 따라옴
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
      }
    };
    document.addEventListener("mousemove", onMove);

    // ring과 glow는 RAF로 부드럽게 추적
    let raf: number;
    const tick = () => {
      rx.current += (mx.current - rx.current) * 0.13;
      ry.current += (my.current - ry.current) * 0.13;
      gx.current += (mx.current - gx.current) * 0.06;
      gy.current += (my.current - gy.current) * 0.06;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${rx.current - 18}px, ${ry.current - 18}px)`;
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${gx.current - 40}px, ${gy.current - 40}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // 클릭 가능한 요소 위에서 커서 확대
    const grow = () => {
      if (dotRef.current)  dotRef.current.style.transform  += " scale(2)";
      if (ringRef.current) {
        ringRef.current.style.width   = "48px";
        ringRef.current.style.height  = "48px";
        ringRef.current.style.borderColor = "rgba(96,165,250,0.9)";
        ringRef.current.style.boxShadow   = "0 0 16px rgba(96,165,250,0.5)";
      }
    };
    const shrink = () => {
      if (ringRef.current) {
        ringRef.current.style.width   = "36px";
        ringRef.current.style.height  = "36px";
        ringRef.current.style.borderColor = "rgba(147,197,253,0.6)";
        ringRef.current.style.boxShadow   = "0 0 8px rgba(96,165,250,0.3)";
      }
    };

    const interactiveEls = document.querySelectorAll("a, button, [role='button']");
    interactiveEls.forEach(el => {
      el.addEventListener("mouseenter", grow);
      el.addEventListener("mouseleave", shrink);
    });

    const onMouseDown = (e: MouseEvent) => {
      // 펄스 생성
      const id = Date.now();
      setPulses(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);
      
      // 650ms 후 제거 (애니메이션 시간과 일치)
      setTimeout(() => {
        setPulses(prev => prev.filter(p => p.id !== id));
      }, 650);

      // 커서 반응
      if (dotRef.current) {
        dotRef.current.style.transform += " scale(0.7)";
        setTimeout(() => {
          if (dotRef.current) dotRef.current.style.transform = dotRef.current.style.transform.replace(" scale(0.7)", "");
        }, 100);
      }
    };
    window.addEventListener("mousedown", onMouseDown);

    return () => {
      document.documentElement.style.cursor = "";
      document.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onMouseDown);
      cancelAnimationFrame(raf);
      interactiveEls.forEach(el => {
        el.removeEventListener("mouseenter", grow);
        el.removeEventListener("mouseleave", shrink);
      });
    };
  }, []);

  return (
    <>
      {/* 대형 소프트 글로우 (가장 느리게 따라옴) */}
      <div
        ref={glowRef}
        style={{
          position: "fixed",
          top: 0, left: 0,
          width: 80, height: 80,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 20000,
          willChange: "transform",
        }}
      />
      {/* 링 (중간 속도) */}
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: 0, left: 0,
          width: 36, height: 36,
          borderRadius: "50%",
          border: "1px solid rgba(147,197,253,0.6)",
          boxShadow: "0 0 8px rgba(96,165,250,0.3)",
          pointerEvents: "none",
          zIndex: 20001,
          willChange: "transform",
          transition: "width 0.2s ease, height 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
        }}
      />
      {/* 중심 dot (즉시 반응) */}
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0, left: 0,
          width: 8, height: 8,
          borderRadius: "50%",
          background: "#60a5fa",
          boxShadow: "0 0 10px rgba(96,165,250,0.8), 0 0 20px rgba(96,165,250,0.4)",
          pointerEvents: "none",
          zIndex: 20002,
          willChange: "transform",
        }}
      />

      {/* 클릭 펄스 잔상들 */}
      {pulses.map(pulse => (
        <div
          key={pulse.id}
          className="cn-click-ripple"
          style={{
            top: pulse.y,
            left: pulse.x,
            width: 80,
            height: 80,
          }}
        />
      ))}
    </>
  );
}
