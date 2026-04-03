"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ClarusSidebar from "@/components/ClarusSidebar";
import ClarusCursor from "@/components/ClarusCursor";
import ClarusHeroCanvas from "@/components/ClarusHeroCanvas";
import NeuralSynapseVisual from "@/components/NeuralSynapseVisual";

/* ─────────────────────────────────────────────
   인터섹션 옵저버 훅 – 뷰포트에 들어오면 visible
───────────────────────────────────────────── */
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return ref;
}

/* ─────────────────────────────────────────────
   섹션 컴포넌트들
───────────────────────────────────────────── */

function HeroSection() {
  return (
    <section
      style={{
        height: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 뉴런+오로라 Canvas 배경 */}
      <ClarusHeroCanvas />

      {/* 하단 페이드 (다음 섹션으로 자연스럽게 이어짐) */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "30%",
          zIndex: 2,
          background: "linear-gradient(to bottom, transparent, #030712)",
          pointerEvents: "none",
        }}
      />

      {/* 타이틀 텍스트 – 하단 좌측 */}
      <div
        style={{
          position: "absolute",
          bottom: "6rem",
          left: "7rem",
          zIndex: 5,
          pointerEvents: "none",
        }}
      >
        {/* CLARUS-N */}
        <h1
          style={{
            margin: 0,
            fontSize: "clamp(3.5rem, 10vw, 8rem)",
            fontWeight: 700,
            letterSpacing: "0.08em",
            fontFamily: "var(--font-bernhard)",
            color: "#ffffff",
            whiteSpace: "nowrap",
            lineHeight: "1.1",
            textShadow: "0 0 15px rgba(255,255,255,0.2)",
            pointerEvents: "none", // 마우스 반응 제외
          }}>
          C<span>LARUS</span>
          <span style={{ 
            fontFamily: 'HYGraphic, sans-serif',
            fontSize: "0.85em",
            margin: "0 0.02em",
            display: "inline-block",
            transform: "translateY(-0.05em)" 
          }}>-</span>
          <span
            style={{
              color: "#a855f7",
              fontWeight: 800,
              textShadow:
                "0 0 25px rgba(168,85,247,0.9), 0 0 50px rgba(168,85,247,0.5)",
            }}
          >
            N
          </span>
        </h1>

        {/* 서브타이틀 - C의 가운데 지점부터 시작되도록 마진 조정 */}
        <p
          style={{
            margin: "0.5rem 0 0 1.6em",
            fontSize: "clamp(1.1rem, 2.2vw, 1.6rem)",
            fontWeight: 700,
            letterSpacing: "0.02em",
            color: "#c4813a",
            textShadow: "0 0 20px rgba(196,129,58,0.7), 0 2px 4px rgba(0,0,0,0.5)",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          AI for Unlocking Neuroimages
        </p>
      </div>

      {/* 스크롤 힌트 */}
      <div
        style={{
          position: "absolute",
          bottom: "2rem",
          right: "5rem", // 중앙에서 우측으로 이동하여 로고와의 겹침 방지
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
          zIndex: 3,
        }}
      >
        {/* SCROLL 텍스트 */}
        <span
          style={{
            color: "rgba(147,197,253,0.9)",
            fontSize: "0.65rem",
            letterSpacing: "0.45em",
            textTransform: "uppercase",
            fontWeight: 500,
            textShadow: "0 0 16px rgba(96,165,250,0.9), 0 0 32px rgba(59,130,246,0.5)",
          }}
        >
          Scroll
        </span>

        {/* 마우스휠 아이콘 + 펄스 링 */}
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* 외부 펄스 링 1 */}
          <div className="cn-pulse-ring" style={{
            position: "absolute",
            width: 64, height: 64,
            borderRadius: "50%",
            border: "1px solid rgba(96,165,250,0.4)",
            animationDelay: "0s",
          }} />
          {/* 외부 펄스 링 2 (딜레이) */}
          <div className="cn-pulse-ring" style={{
            position: "absolute",
            width: 84, height: 84,
            borderRadius: "50%",
            border: "1px solid rgba(59,130,246,0.2)",
            animationDelay: "0.6s",
          }} />

          {/* 마우스휠 SVG */}
          <svg
            width="36" height="56"
            viewBox="0 0 36 56"
            fill="none"
            style={{
              filter: "drop-shadow(0 0 10px rgba(96,165,250,0.7)) drop-shadow(0 0 20px rgba(59,130,246,0.4))",
            }}
          >
            <rect x="1" y="1" width="34" height="54" rx="17"
              stroke="rgba(147,197,253,0.8)" strokeWidth="1.5"
            />
            <rect
              x="16" y="9" width="4" height="11" rx="2"
              fill="rgba(96,165,250,1)"
              className="cn-mouse-wheel"
            />
          </svg>
        </div>

        {/* 아래 글로우 라인 */}
        <div
          style={{
            width: 2,
            height: 72,
            background: "linear-gradient(to bottom, rgba(96,165,250,1), rgba(59,130,246,0.3), transparent)",
            boxShadow: "0 0 12px rgba(96,165,250,0.6), 0 0 24px rgba(59,130,246,0.3)",
            borderRadius: 2,
          }}
          className="cn-scroll-bounce"
        />
      </div>
    </section>
  );
}


function RevealSection({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      style={{
        opacity: 0,
        transform: "translateY(40px)",
        transition: "opacity 0.9s cubic-bezier(0.4,0,0.2,1), transform 0.9s cubic-bezier(0.4,0,0.2,1)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <span
        style={{
          display: "inline-block",
          fontSize: "1.5rem",
          letterSpacing: "-0.01em",
          textTransform: "none", // 이미지처럼 대소문자 허용
          color: "#60a5fa",
          fontWeight: 800,
          fontFamily: "'Inter', sans-serif",
          textShadow: "0 0 20px rgba(96,165,250,0.3)",
        }}
      >
        {children}
      </span>
    </div>
  );
}

function Divider() {
  return (
    <div
      style={{
        width: "100%",
        height: "1px",
        background: "linear-gradient(to right, rgba(96,165,250,0.4), transparent)",
        margin: "1.5rem 0",
      }}
    />
  );
}

function AboutSection() {
  return (
    <section id="about" style={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <div style={{ display: "flex", width: "100%", alignItems: "center", gap: "4rem" }}>
        <div style={{ flex: 1, maxWidth: "38rem" }}>
          <RevealSection>
            <SectionLabel>About</SectionLabel>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300, color: "#e2e8f0", lineHeight: 1.2, marginBottom: "1.5rem", letterSpacing: "0.05em" }}>
              Next-Generation Neuroimaging AI Platform
            </h2>
            <Divider />
          </RevealSection>
          <RevealSection style={{ transitionDelay: "0.15s" }}>
            <p style={{ color: "#94a3b8", lineHeight: 1.85, fontSize: "1.05rem", fontWeight: 300, marginBottom: "1.25rem" }}>
              CLARUS-N is a state-of-the-art AI solution for neuroimaging based on advanced deep learning algorithms, supporting clinical decision-making by automatically analyzing brain MRI and CT images.
            </p>
            <p style={{ color: "#64748b", lineHeight: 1.85, fontSize: "1.05rem", fontWeight: 300 }}>
              It provides proven performance in various clinical tasks such as vascular 3D reconstruction, aneurysm detection, stenosis classification, and stroke segmentation.
            </p>
          </RevealSection>
        </div>
        
        {/* 우측 뉴런 장식 */}
        <div style={{ flex: 1, height: "400px", position: "relative" }}>
          <NeuralSynapseVisual mode="dense" />
        </div>
      </div>
    </section>
  );
}

function BackgroundSection() {
  const stats = [
    { value: "10K+", label: "Training Datasets" },
    { value: "97.3%", label: "Aneurysm Accuracy" },
    { value: "0.3s", label: "Avg. Analysis Time" },
    { value: "15+", label: "Collaborating Hospitals" },
  ];

  return (
    <section id="background" style={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <div style={{ display: "flex", width: "100%", alignItems: "center", gap: "4rem" }}>
        <div style={{ flex: 1, maxWidth: "42rem", width: "100%" }}>
          <RevealSection>
            <SectionLabel>Background</SectionLabel>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300, color: "#e2e8f0", lineHeight: 1.2, marginBottom: "1.5rem", letterSpacing: "0.05em" }}>
              Research & Motivation
            </h2>
            <Divider />
          </RevealSection>
          <RevealSection style={{ transitionDelay: "0.1s" }}>
            <p style={{ color: "#94a3b8", lineHeight: 1.85, fontSize: "1.05rem", fontWeight: 300, marginBottom: "2.5rem" }}>
              Cerebrovascular diseases require rapid diagnosis, making timing critical for survival. We solve challenges like radiologist shortages and interpretation delays through AI-driven automation.
            </p>
          </RevealSection>

          {/* 통계 카드 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            {stats.map((s, i) => (
              <RevealSection key={s.label} style={{ transitionDelay: `${0.15 + i * 0.1}s` }}>
                <div
                  className="cn-stat-card"
                  style={{
                    padding: "1.75rem",
                    borderRadius: "1rem",
                    background: "rgba(30,58,138,0.08)",
                    border: "1px solid rgba(96,165,250,0.1)",
                    backdropFilter: "blur(12px)",
                    position: "relative",
                    overflow: "hidden",
                    transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
                  }}
                >
                  <div style={{
                    position: "absolute",
                    top: "-50%", left: "-50%",
                    width: "200%", height: "200%",
                    background: "radial-gradient(circle at center, rgba(59,130,246,0.05) 0%, transparent 70%)",
                    pointerEvents: "none",
                  }} />
                  
                  <div style={{ 
                    fontSize: "2.25rem", 
                    fontWeight: 200, 
                    color: "#60a5fa", 
                    marginBottom: "0.5rem", 
                    letterSpacing: "0.05em",
                    textShadow: "0 0 20px rgba(96,165,250,0.4)"
                  }}>
                    {s.value}
                  </div>
                  <div style={{ 
                    fontSize: "0.85rem", 
                    color: "#94a3b8", 
                    letterSpacing: "0.15em", 
                    textTransform: "uppercase",
                    fontWeight: 400
                  }}>
                    {s.label}
                  </div>
                  <div className="cn-card-border-glow" />
                </div>
              </RevealSection>
            ))}
          </div>
        </div>

        {/* 우측 뉴런 장식: 배경 섹션은 더 깊은 연결 느낌 */}
        <div style={{ flex: 1, height: "500px", position: "relative" }}>
          <NeuralSynapseVisual mode="deep" color="147, 197, 253" opacity={0.4} />
        </div>
      </div>
    </section>
  );
}

function PerformanceSection({ pageIndex, setPageIndex }: { 
  pageIndex: number; 
  setPageIndex: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [hasNudged, setHasNudged] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // 뷰포트 진입 감지 -> 슬라이드 넛지(Nudge) 애니메이션 실행
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasNudged) {
        setHasNudged(true);
      }
    }, { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNudged]);

  const mraCards = [
    {
      title: "MRA AI for <span style='color: #facc15'>Vessel</span> reconstruction",
      description: "Precise reconstruction of even the finest blood vessels.",
      videoSrc: "/videos/1.Vessel 3D-cube.mp4",
      theme: "blue",
      details: [
        "#Input: TOF images",
        "#Dice: 0.872, #6.78sec"
      ]
    },
    {
      title: "MRA AI for <span style='color: #ef4444'>Aneurysm</span> detection",
      description: "Detects more accurately than a neuro-specialists.",
      videoSrc: "/videos/2.Aneurysm 3D-cube.mp4",
      theme: "blue",
      details: [
        "#Input: TOF images",
        "#Sensitivity: 92.0%, #20.25sec"
      ]
    },
    {
      title: "MRA AI for <span style='color: #38bdf8'>Stenosis</span> detection",
      description: "Detects stenosis up to the A2 and M2 segments.",
      videoSrc: "/videos/3.Stenosis 3D-cube.mp4",
      theme: "blue",
      details: [
        "#Input: TOF images",
        "#Sensitivity: 92.0%, #20.25sec"
      ]
    }
  ];

  const infarctCards = [
    {
      id: "dwi-1",
      title: "DWI AI for Infarcted <span style='color: #c084fc'>Region</span> Detection",
      description: "Accurately identifies even minute infarct lesions",
      videoSrc: "/videos/4. Infarction region.mp4",
      theme: "purple",
      details: ["#Dice 0.820, #22.0sec", "#6002 cases training data"]
    },
    {
      id: "dwi-2",
      title: "DWI AI for Mapping <span style='color: #a3e635'>Vascular territories</span>",
      description: "Mapping the vascular territory that caused the cerebral infarction",
      videoSrc: "/videos/5. infarction territory.mp4",
      theme: "purple",
      details: ["#Dice 0.820, #22.0sec", "#Six major vessels"]
    },
    {
      id: "dwi-3",
      title: "ADC AI for Infarction <span style='color: #fdba74'>Onset</span> Detection",
      description: "Transferring DWI-predicted lesions to ADC to estimate time since onset.",
      videoSrc: "/videos/6. Infarction onset-ADC.mp4",
      theme: "purple",
      details: ["#Dice 0.820, #22.0sec", "#Acute, Subacute, Chronic stage"]
    }
  ];

  const carotidCards = [
    {
      id: "carotid-1",
      title: "MRA AI for <span style='color: #facc15'>Carotid Vessel</span> reconstruction",
      description: "Rendering CCAs that are difficult to visualize using MIP.",
      videoSrc: "/videos/7.Carotid 3D-cube.mp4",
      theme: "gray",
      details: ["#Input: Carotid TOF images", "#Dice 0.916, #4.52sec"]
    },
    {
      id: "carotid-2",
      title: "MRA AI for <span style='color: #22c55e'>Carotid Stenosis & occlusion</span>",
      description: "Identifies stenotic and occlusive regions.",
      videoSrc: "/videos/8.Carotid Stenosis-cube.mp4",
      theme: "gray",
      details: ["#Input: Carotid TOF images", "#0.00sec"]
    }
  ];

  const ctCards = [
    {
      id: "ct-1",
      title: "CT AI for <span style='color: #f472b6'>Hemorrhage</span> Detection",
      description: "Rendering CCAs that are difficult to visualize using MIP.",
      videoSrc: "/videos/9. CT hemorrhage.mp4",
      theme: "green",
      details: ["#Input: Axial CT images", "#Dice 0.928 #4.5sec"]
    },
    {
      id: "ct-2",
      title: "CTA AI for <span style='color: #facc15'>Vessel</span> Reconstruction",
      description: "Identifies stenotic and occlusive regions.",
      videoSrc: "/videos/10.CTA vessel 3D-cube.mp4",
      theme: "green",
      details: ["#Input: CTA source images", "#0.00sec"]
    }
  ];

  const cardSets = [mraCards, infarctCards, carotidCards, ctCards];

  const currentCards = cardSets[pageIndex];

  const handleCardClick = (videoSrc: string) => {
    setActiveVideo(prev => prev === videoSrc ? null : videoSrc);
  };

  return (
    <section 
      id="performance" 
      ref={sectionRef}
      style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative" }}
    >
      <div style={{ display: "flex", width: "100%", alignItems: "center", gap: "4rem" }}>
        <div style={{ flex: 1, maxWidth: "42rem", width: "100%", overflow: "hidden" }}>
          <RevealSection>
            <SectionLabel>Characteristics</SectionLabel>
            <Divider />
          </RevealSection>

          {/* 슬라이더 트랙 컨테이너 (진입 시 넛지 효과 포함) */}
          <div style={{ 
            position: "relative", 
            width: "100%",
            marginTop: "1rem",
            transform: hasNudged && !pageIndex ? "translateX(15px)" : "none",
            transition: "transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)"
          }}>
            {/* 가로 슬라이딩 트랙 */}
            <div style={{ 
              display: "flex", 
              width: `${cardSets.length * 100}%`,
              transform: `translateX(-${pageIndex * (100 / cardSets.length)}%)`,
              transition: "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)"
            }}>
              {cardSets.map((set, setIdx) => (
                <div 
                  key={setIdx} 
                  style={{ 
                    width: `${100 / cardSets.length}%`, 
                    flexShrink: 0, 
                    display: "flex", 
                    flexDirection: "column", 
                    gap: "1.5rem",
                    paddingRight: "1.5rem",
                    opacity: pageIndex === setIdx ? 1 : 0.3,
                    transform: pageIndex === setIdx ? "scale(1)" : "scale(0.96)",
                    transition: "all 0.6s ease"
                  }}
                >
                  {set.map((card, i) => (
                    <RevealSection key={`${setIdx}-${i}`} style={{ transitionDelay: `${0.05 + i * 0.1}s` }}>
                      <CharacteristicCard 
                        card={card} 
                        isActive={activeVideo === card.videoSrc}
                        onClick={() => handleCardClick(card.videoSrc)}
                      />
                    </RevealSection>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* 인디케이터 및 화살표 내비게이션 */}
          <div style={{ 
            display: "flex", 
            alignItems: "center",
            justifyContent: "flex-start", 
            gap: "1.75rem", 
            marginTop: "2.5rem",
            paddingLeft: "1.5rem"
          }}>
            {/* 좌측 화살표 (이전 세트) */}
            <button 
              onClick={() => {
                setPageIndex(p => Math.max(0, p - 1));
                setActiveVideo(null);
              }}
              disabled={pageIndex === 0}
              style={{
                background: "none", border: "none", color: "#60a5fa", 
                cursor: pageIndex === 0 ? "default" : "pointer",
                opacity: pageIndex === 0 ? 0.1 : 0.6, transition: "all 0.3s ease", padding: 0,
                display: "flex", alignItems: "center", justifyContent: "center"
              }}
              onMouseEnter={e => pageIndex !== 0 && (e.currentTarget.style.opacity = "1")}
              onMouseLeave={e => pageIndex !== 0 && (e.currentTarget.style.opacity = "0.6")}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>

            {/* 도트 리스트 */}
            <div style={{ display: "flex", gap: "0.85rem", alignItems: "center" }}>
              {cardSets.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPageIndex(idx);
                    setActiveVideo(null);
                  }}
                  style={{
                    width: idx === pageIndex ? "1.75rem" : "0.5rem",
                    height: "0.5rem",
                    borderRadius: "0.25rem",
                    background: idx === pageIndex ? "#60a5fa" : "rgba(255,255,255,0.15)",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    padding: 0
                  }}
                  aria-label={`Go to card set ${idx + 1}`}
                />
              ))}
            </div>

            {/* 우측 화살표 (다음 세트) */}
            <button 
              onClick={() => {
                setPageIndex(p => Math.min(cardSets.length - 1, p + 1));
                setActiveVideo(null);
              }}
              disabled={pageIndex === cardSets.length - 1}
              style={{
                background: "none", border: "none", color: "#60a5fa", 
                cursor: pageIndex === cardSets.length - 1 ? "default" : "pointer",
                opacity: pageIndex === cardSets.length - 1 ? 0.1 : 0.6, transition: "all 0.3s ease", padding: 0,
                display: "flex", alignItems: "center", justifyContent: "center"
              }}
              onMouseEnter={e => pageIndex !== cardSets.length - 1 && (e.currentTarget.style.opacity = "1")}
              onMouseLeave={e => pageIndex !== cardSets.length - 1 && (e.currentTarget.style.opacity = "0.6")}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>

          </div>
          </div>
        
        {/* 우측 영역: 평소에는 뉴런만 떠 있다가, 클릭 시 비디오 박스가 활성화됨 */}
        <div style={{ 
          flex: 1, 
          height: "500px", 
          position: "relative",
          background: activeVideo ? "rgba(30,58,138,0.15)" : "transparent",
          borderRadius: "1.5rem",
          overflow: "hidden",
          border: activeVideo ? "1px solid rgba(96,165,250,0.2)" : "1px solid transparent",
          boxShadow: activeVideo ? "0 0 40px rgba(0,0,0,0.4)" : "none",
          transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
        }}>
          {/* 뉴런 시각화 (동영상이 없을 때만 혹은 밑에 깔기) */}
          <div style={{ 
            position: "absolute", inset: 0, 
            opacity: activeVideo ? 0.3 : 1,
            transition: "opacity 0.8s ease",
            filter: activeVideo ? "blur(4px)" : "none",
          }}>
            <NeuralSynapseVisual mode="fast" color="110, 227, 175" opacity={0.5} />
          </div>

          {/* 동영상 플레이어 - 모든 카드 세트 통합 관리 */}
          {[...mraCards, ...infarctCards, ...carotidCards, ...ctCards].map(card => (
            <div 
              key={card.videoSrc}
              style={{
                position: "absolute",
                inset: 0,
                opacity: activeVideo === card.videoSrc ? 1 : 0,
                transition: "opacity 0.6s cubic-bezier(0.4,0,0.2,1)",
                pointerEvents: activeVideo === card.videoSrc ? "auto" : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "black",
              }}
            >
              {activeVideo === card.videoSrc && (
                <video
                  src={card.videoSrc}
                  autoPlay
                  muted
                  loop
                  playsInline
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              )}
            </div>
          ))}

          {/* 안내 오버레이 (비디오 없을 때) */}
          {!activeVideo && (
            <div style={{
              position: "absolute",
              bottom: "2rem",
              left: "0",
              width: "100%",
              textAlign: "center",
              color: "rgba(148,163,184,0.6)",
              fontSize: "0.85rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              pointerEvents: "none",
            }}>
              Select a characteristic to view AI analysis
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function CharacteristicCard({ card, isActive, onClick }: { card: any; isActive: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const highlighted = hovered || isActive;
  
  // 테마 색상 결정
  let themeColor = "rgba(96,165,250,0.8)";
  let themeBg = highlighted ? "rgba(30,58,138,0.32)" : "rgba(30,58,138,0.18)";
  let themeShadow = isActive ? "rgba(59,130,246,0.3)" : "transparent";

  if (card.theme === "purple") {
    themeColor = "rgba(168, 85, 247, 0.8)";
    themeBg = highlighted ? "rgba(88, 28, 135, 0.38)" : "rgba(88, 28, 135, 0.22)";
    themeShadow = isActive ? "rgba(168, 85, 247, 0.3)" : "transparent";
  } else if (card.theme === "gray") {
    themeColor = "rgba(148, 163, 184, 0.8)";
    themeBg = highlighted ? "rgba(55, 65, 81, 0.45)" : "rgba(55, 65, 81, 0.3)";
    themeShadow = isActive ? "rgba(148, 163, 184, 0.3)" : "transparent";
  } else if (card.theme === "green") {
    themeColor = "rgba(34, 197, 94, 0.8)";
    themeBg = highlighted ? "rgba(20, 83, 45, 0.45)" : "rgba(20, 83, 45, 0.3)";
    themeShadow = isActive ? "rgba(34, 197, 94, 0.3)" : "transparent";
  }

  const themeBorder = isActive ? themeColor : (hovered ? themeColor : "rgba(255,255,255,0.1)");
  const insetShadowColor = card.theme === "purple" ? "rgba(168, 85, 247, 0.2)" : 
                         card.theme === "gray" ? "rgba(148, 163, 184, 0.2)" :
                         card.theme === "green" ? "rgba(34, 197, 94, 0.2)" : "rgba(59,130,246,0.2)";

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "1.75rem 2rem",
        borderRadius: "1.5rem",
        background: themeBg,
        border: `1px solid ${themeBorder}`,
        boxShadow: isActive ? `0 0 25px ${themeShadow}, inset 0 0 10px ${insetShadowColor}` : "none",
        backdropFilter: "blur(12px)",
        transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        transform: highlighted ? "translateX(5px)" : "translateX(0)",
      }}
    >
      {/* 타이틀 */}
      <h3 
        dangerouslySetInnerHTML={{ __html: card.title }}
        style={{
          color: "rgba(226,232,240,0.95)",
          fontSize: "1.4rem",
          fontWeight: 600,
          marginBottom: "0.75rem",
          letterSpacing: "-0.01em",
          fontFamily: "'Inter', sans-serif",
        }}
      />
      
      {/* 기본 설명 */}
      <p style={{
        color: "rgba(148,163,184,0.85)",
        fontSize: "1.2rem",
        lineHeight: 1.6,
        fontWeight: 300,
        fontFamily: "'Cormorant', Georgia, serif",
        fontStyle: "italic",
        letterSpacing: "0.01em",
      }}>
        {card.description}
      </p>

      {/* 호버 시 나타나는 상세 정보 - 테크니컬 뱃지 스타일 */}
      <div style={{
        maxHeight: highlighted ? "140px" : "0",
        opacity: highlighted ? 1 : 0,
        overflow: "hidden",
        transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        marginTop: highlighted ? "1.5rem" : "0",
        display: "flex",
        flexWrap: "wrap",
        gap: "0.5rem",
      }}>
        {card.details.map((detailStr: string, idx: number) => {
          // # 을 기준으로 파싱하여 개별 뱃지로 생성
          const parts = detailStr.split('#').filter(p => p.trim() !== '');
          return parts.map((part, pIdx) => {
            // 끝에 붙은 쉼표 제거 및 공백 정리
            const cleanPart = part.trim().replace(/,$/, '');
            const [label, ...val] = cleanPart.split(':');
            return (
              <div key={`${idx}-${pIdx}`} style={{
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${themeColor.replace('0.8', '0.15')}`,
                padding: "0.35rem 0.75rem",
                borderRadius: "0.5rem",
                fontSize: "0.85rem",
                fontFamily: "'Inter', sans-serif",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                transition: "all 0.3s ease",
              }}>
                <span style={{ 
                  color: themeColor, 
                  fontWeight: 700, 
                  fontSize: "0.75rem", 
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  opacity: 0.9 
                }}>
                  {label.trim()}
                </span>
                {val.length > 0 && (
                  <span style={{ 
                    color: "rgba(255,255,255,0.75)", 
                    fontWeight: 400,
                    borderLeft: "1px solid rgba(255,255,255,0.1)",
                    paddingLeft: "0.5rem"
                  }}>
                    {val.join(':').trim()}
                  </span>
                )}
              </div>
            );
          });
        })}
      </div>

      {/* 호버 시 배경 글로우 */}
      <div style={{
        position: "absolute",
        top: "-50%", left: "-50%",
        width: "200%", height: "200%",
        background: "radial-gradient(circle at center, rgba(59,130,246,0.06) 0%, transparent 60%)",
        pointerEvents: "none",
        opacity: hovered ? 1 : 0,
        transition: "opacity 0.6s ease",
      }} />
    </div>
  );
}



function TestRequestSection() {
  return (
    <section id="test-request" style={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <div style={{ display: "flex", width: "100%", alignItems: "center", gap: "4rem" }}>
        <div style={{ flex: 1, maxWidth: "42rem" }}>
          <RevealSection>
            <SectionLabel>Personal Test Request</SectionLabel>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300, color: "#e2e8f0", lineHeight: 1.2, marginBottom: "1.5rem", letterSpacing: "0.05em" }}>
              Submit for AI Analysis
            </h2>
            <Divider />
          </RevealSection>
          
          <RevealSection style={{ transitionDelay: "0.1s" }}>
            <div style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px dashed rgba(96,165,250,0.3)",
              borderRadius: "1.25rem",
              padding: "3rem 2rem",
              textAlign: "center",
              marginBottom: "2rem",
              cursor: "pointer",
            }}>
              <div style={{ color: "#60a5fa", marginBottom: "1rem" }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                </svg>
              </div>
              <p style={{ color: "#e2e8f0", fontSize: "1.1rem", marginBottom: "0.5rem" }}>Drag and drop MRI or CT data here</p>
              <p style={{ color: "#64748b", fontSize: "0.9rem" }}>Supports DICOM, NIfTI formats (Max 500MB)</p>
            </div>
          </RevealSection>

          <RevealSection style={{ transitionDelay: "0.2s" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", gap: "1rem" }}>
                <input type="text" placeholder="Name" style={{ flex: 1, padding: "0.875rem 1.25rem", borderRadius: "0.75rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", outline: "none" }} />
                <input type="email" placeholder="Email" style={{ flex: 1, padding: "0.875rem 1.25rem", borderRadius: "0.75rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", outline: "none" }} />
              </div>
              <button style={{
                padding: "1rem", borderRadius: "0.75rem",
                background: "linear-gradient(to right, #2563eb, #7c3aed)",
                color: "white", fontWeight: 600, border: "none", cursor: "pointer",
                boxShadow: "0 0 20px rgba(37,99,235,0.3)"
              }}>
                Request Analysis
              </button>
            </div>
          </RevealSection>
        </div>

        {/* 우측 뉴런 장식: 분석 완료 시의 활발한 뇌 활동 느낌 */}
        <div style={{ flex: 1, height: "500px", position: "relative" }}>
          <NeuralSynapseVisual mode="fast" color="124, 58, 237" opacity={0.6} />
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="contact" style={{ minHeight: "60vh", display: "flex", alignItems: "center" }}>
      <div style={{ display: "flex", width: "100%", alignItems: "center", gap: "4rem" }}>
        <div style={{ flex: 1, maxWidth: "38rem" }}>
          <RevealSection>
            <SectionLabel>Contact</SectionLabel>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300, color: "#e2e8f0", lineHeight: 1.2, marginBottom: "1.5rem", letterSpacing: "0.05em" }}>
              Partnership & Demo Requests
            </h2>
            <Divider />
          </RevealSection>
          <RevealSection style={{ transitionDelay: "0.1s" }}>
            <p style={{ color: "#94a3b8", lineHeight: 1.85, fontSize: "1.05rem", fontWeight: 300, marginBottom: "2rem" }}>
              We are currently running pilot programs for hospitals and research institutions. Please contact us below for demo applications and technical collaboration inquiries.
            </p>
            <a
              href="mailto:contact@clarus-n.ai"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.875rem 2rem",
                borderRadius: "0.75rem",
                background: "rgba(59,130,246,0.15)",
                border: "1px solid rgba(96,165,250,0.3)",
                color: "#93c5fd",
                fontSize: "0.95rem",
                textDecoration: "none",
                letterSpacing: "0.05em",
                transition: "background 0.2s ease, border-color 0.2s ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(59,130,246,0.25)";
                e.currentTarget.style.borderColor = "rgba(96,165,250,0.6)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(59,130,246,0.15)";
                e.currentTarget.style.borderColor = "rgba(96,165,250,0.3)";
              }}
            >
              contact@clarus-n.ai
            </a>
          </RevealSection>
        </div>
        
        <div style={{ flex: 1, height: "300px", position: "relative" }}>
          <NeuralSynapseVisual mode="calm" color="148, 163, 184" opacity={0.3} />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   메인 페이지
───────────────────────────────────────────── */
const NAV_SECTIONS = ["background", "performance", "test-request", "contact"] as const;
type SectionId = typeof NAV_SECTIONS[number];

export default function ClarusNPage() {
  const [showIntro, setShowIntro] = useState(true);
  const [isIntroEnding, setIsIntroEnding] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState<SectionId | "">("");
  const [performancePageIndex, setPerformancePageIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  // 스크롤 위치 추적 → 현재 섹션 결정
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const observers: IntersectionObserver[] = [];
    NAV_SECTIONS.forEach(id => {
      const el = container.querySelector(`#${id}`);
      if (!el) return;
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { root: container, threshold: 0.35 }
      );
      io.observe(el);
      observers.push(io);
    });

    return () => observers.forEach(io => io.disconnect());
  }, []);

  // 메뉴 클릭 → 해당 섹션으로 부드럽게 스크롤
  const handleNavClick = useCallback((id: string) => {
    const container = scrollRef.current;
    if (!container) return;
    const el = container.querySelector(`#${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // 서브 메뉴 클릭 → 퍼포먼스 탭 인덱스 변경 및 스크롤
  const handleSubNavClick = useCallback((index: number) => {
    setPerformancePageIndex(index);
    handleNavClick("performance");
  }, [handleNavClick]);

  // 인트로 종료 핸들러
  const handleIntroEnd = useCallback(() => {
    setIsIntroEnding(true);
    setTimeout(() => {
      setShowIntro(false);
    }, 1200); //globals.css의 cn-intro-fade-out 시간과 일치
  }, []);




  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#030712",
        fontFamily: "'Inter', sans-serif",
        color: "#e2e8f0",
        position: "relative",
      }}
    >
      <ClarusCursor />

      {/* 인트로 영상 오버레이 */}
      {showIntro && (
        <div 
          className={`cn-intro-overlay ${isIntroEnding ? 'ending' : ''}`}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10000,
            backgroundColor: "#030712",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden"
          }}
        >
          <video
            src="/다운로드.mp4"
            autoPlay
            muted
            playsInline
            onEnded={handleIntroEnd}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
          />
          {/* Skip 버튼 */}
          <button
            onClick={handleIntroEnd}
            style={{
              position: "absolute",
              bottom: "3rem",
              right: "3rem",
              padding: "0.6rem 1.5rem",
              borderRadius: "2rem",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "rgba(255,255,255,0.6)",
              fontSize: "0.8rem",
              letterSpacing: "0.2em",
              cursor: "pointer",
              backdropFilter: "blur(10px)",
              transition: "all 0.3s ease",
              zIndex: 10001
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              e.currentTarget.style.color = "rgba(255,255,255,0.6)";
            }}
          >
            SKIP INTRO
          </button>
        </div>
      )}

      {/* 메인 콘텐츠 (인트로가 아직 안 끝났어도 렌더링은 해둬서 자원 로드 미리 수행) */}
      <div
        className={isIntroEnding ? "cn-main-reveal" : ""}
        style={{
          position: "absolute",
          inset: 0,
          opacity: isIntroEnding ? 1 : 0,
          pointerEvents: showIntro ? "none" : "auto",
        }}
      >
        {/* 스크롤 영역 */}
        <div
          ref={scrollRef}
          className="cn-sidebar-scroll"
          style={{
            position: "absolute",
            top: 0, bottom: 0, right: 0,
            left: isSidebarOpen ? "340px" : "0px",
            overflowY: "scroll",
            overflowX: "hidden",
            zIndex: 10,
            backgroundColor: "#030712",
            transition: "left 500ms cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          <HeroSection />
          <div style={{ paddingLeft: "7rem", paddingRight: "4rem" }}>
            <BackgroundSection />
            <PerformanceSection pageIndex={performancePageIndex} setPageIndex={setPerformancePageIndex} />
            <TestRequestSection />
            <ContactSection />
            <footer style={{
              padding: "2rem 0",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              color: "#334155",
              fontSize: "0.8rem",
              letterSpacing: "0.08em",
            }}>
              © 2024 CLARUS-N · AI for Unlocking Neuroimages
            </footer>
          </div>
        </div>

        {/* 메뉴 열기 버튼 */}
        <button
          onClick={toggleSidebar}
          aria-label="메뉴 열기"
          style={{
            position: "fixed",
            top: "2rem", left: "2rem",
            zIndex: 40,
            padding: "0.75rem",
            borderRadius: "0.75rem",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(12px)",
            color: "white",
            cursor: "none",
            opacity: isSidebarOpen ? 0 : 1,
            pointerEvents: isSidebarOpen ? "none" : "auto",
            transition: "opacity 0.3s ease, background 0.2s ease",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
          onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* 사이드바 */}
        <ClarusSidebar
          isOpen={isSidebarOpen}
          onToggle={toggleSidebar}
          activeSection={activeSection}
          onNavClick={handleNavClick}
          onSubNavClick={handleSubNavClick}
        />
      </div>
    </div>
  );
}
