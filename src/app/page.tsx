"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
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
        className="cn-hero-title"
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
        className="cn-scroll-hint"
        style={{
          position: "absolute",
          bottom: "2rem",
          right: "5rem",
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
    <div style={{ marginBottom: "0.5rem" }}>
      <span
        style={{
          display: "inline-block",
          fontSize: "1.2rem",
          letterSpacing: "0.05em",
          textTransform: "none", // 이미지처럼 대소문자 허용
          color: "#60a5fa",
          fontWeight: 600,
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
      <div className="cn-section-flex" style={{ display: "flex", width: "100%", alignItems: "stretch", gap: "2rem" }}>

        {/* 좌측: 카드 두 개 */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <RevealSection>
            <SectionLabel>About</SectionLabel>
          </RevealSection>

          {/* CLARUS-N 의미 카드 */}
          <RevealSection style={{ transitionDelay: "0.1s", flex: 1 }}>
            <div style={{
              height: "100%",
              padding: "2.2rem 2.4rem",
              borderRadius: "1.2rem",
              background: "rgba(15,23,42,0.6)",
              border: "1px solid rgba(168,85,247,0.18)",
              backdropFilter: "blur(16px)",
              display: "flex",
              flexDirection: "column",
              gap: "1.2rem",
              boxShadow: "0 0 40px rgba(168,85,247,0.05)",
            }}>
              {/* 타이틀 */}
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.6rem", borderBottom: "1px solid rgba(255,255,255,0.07)", paddingBottom: "1rem" }}>
                <span style={{ fontSize: "2.8rem", fontWeight: 800, letterSpacing: "0.12em", color: "#ffffff" }}>CLARUS</span>
                <span style={{ fontSize: "2.8rem", fontWeight: 800, letterSpacing: "0.12em", color: "#a855f7" }}>-N</span>
                <span style={{ marginLeft: "0.5rem", fontSize: "1rem", fontStyle: "italic", fontWeight: 300, color: "#64748b" }}>/ Clārus</span>
              </div>

              {/* 의미 */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div style={{ fontSize: "0.7rem", letterSpacing: "0.15em", color: "#475569", fontWeight: 600, textTransform: "uppercase" }}>Latin Origin</div>
                <div style={{ fontSize: "1.05rem", color: "#cbd5e1", lineHeight: 1.6 }}>
                  명확한, 분명한 — <span style={{ color: "#94a3b8" }}>Clear, Bright, Distinguished, Easily understood</span>
                </div>
                <div style={{ fontSize: "0.95rem", color: "#64748b", lineHeight: 1.7 }}>
                  "Clarus" reflects the goal of making complex brain imaging<br />clear, accurate, and accessible.
                </div>
              </div>

              {/* -N 설명 */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.25)",
                borderRadius: "0.6rem", padding: "0.6rem 1.1rem", alignSelf: "flex-start",
              }}>
                <span style={{ fontSize: "1.3rem", fontWeight: 800, color: "#a855f7" }}>-N</span>
                <span style={{ fontSize: "0.95rem", color: "#94a3b8" }}>: "hyphen N" means</span>
                <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#ffffff" }}>AI (<span style={{ color: "#a855f7", position: "relative", display: "inline-block" }}>N<span style={{ position: "absolute", left: "0", right: "0", top: "52%", height: "2px", background: "#a855f7", transform: "translateY(-50%)", borderRadius: "1px" }} /></span>)</span>
              </div>
            </div>
          </RevealSection>

          {/* CEO 카드 */}
          <RevealSection style={{ transitionDelay: "0.2s", flex: 1 }}>
            <div style={{
              height: "100%",
              padding: "2.2rem 2.4rem",
              borderRadius: "1.2rem",
              background: "rgba(15,23,42,0.6)",
              border: "1px solid rgba(96,165,250,0.14)",
              backdropFilter: "blur(16px)",
              display: "flex",
              flexDirection: "column",
              gap: "1.2rem",
              boxShadow: "0 0 40px rgba(96,165,250,0.04)",
            }}>
              {/* CEO 헤더 */}
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", borderBottom: "1px solid rgba(255,255,255,0.07)", paddingBottom: "1rem" }}>
                <span style={{
                  fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.22em",
                  color: "#60a5fa", background: "rgba(96,165,250,0.12)",
                  border: "1px solid rgba(96,165,250,0.4)",
                  padding: "0.35rem 0.85rem", borderRadius: "0.4rem",
                  textShadow: "0 0 10px rgba(96,165,250,0.5)",
                  flexShrink: 0,
                }}>CEO</span>
                <div>
                  <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "#e2e8f0", lineHeight: 1.2 }}>김시온</div>
                  <div style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 400, marginTop: "0.1rem" }}>Sion Kim, M.D.</div>
                </div>
              </div>

              {/* Board-Certified */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                <div style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: "#475569", fontWeight: 600, textTransform: "uppercase" }}>Board-Certified</div>
                {[
                  { label: "Neurosurgeon", color: "#a855f7" },
                  { label: "Critical Care Specialist", color: "#60a5fa" },
                  { label: "Specialist in Endovascular Neurosurgery", color: "#34d399" },
                  { label: "Specialist by the Korean Society of Cerebrovascular Surgery", color: "#f59e0b" },
                ].map(item => (
                  <div key={item.label} style={{ display: "flex", alignItems: "flex-start", gap: "0.7rem" }}>
                    <span style={{ width: "2px", minHeight: "1.1rem", background: item.color, borderRadius: "1px", flexShrink: 0, marginTop: "0.2rem", opacity: 0.7 }} />
                    <span style={{ color: "#94a3b8", fontSize: "0.95rem", lineHeight: 1.6 }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </RevealSection>
        </div>

        {/* 우측: CEO 사진 흑백 */}
        <RevealSection style={{ flexShrink: 0, transitionDelay: "0.15s", display: "flex", alignItems: "center", paddingBottom: "0" }}>
          <div style={{
            position: "relative",
            borderRadius: "1.2rem",
            overflow: "hidden",
            width: "560px",
            height: "820px",
            boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
          }}>
            <img
              src="/ceo-photo.png"
              alt="CEO Sion Kim"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "50% 15%",
                display: "block",
              }}
            />
            {/* 하단 그라데이션 오버레이 */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0, height: "40%",
              background: "linear-gradient(to top, rgba(3,7,18,0.7), transparent)",
              pointerEvents: "none",
            }} />
          </div>
        </RevealSection>

      </div>
    </section>
  );
}

function AboutStrengthsSection() {
  const strengths = [
    {
      color: "#facc15",
      title: <>Expert-Annotation by <span style={{ color: "#facc15" }}>Neurosurgeon</span></>,
      sub: "Every case, Every Pixel",
      desc: "All annotations are performed directly by board-certified neurosurgeons, ensuring the highest level of clinical accuracy in every labeled dataset.",
      badge: "MD Annotated",
    },
    {
      color: "#f87171",
      title: <>High-<span style={{ color: "#f87171" }}>Accuracy</span> Annotation</>,
      sub: "Precise Annotation Grounded in Deep Clinical Understanding",
      desc: "Our annotations reflect real surgical insight — not just image-level labeling — resulting in data quality that drives superior AI performance.",
      badge: null,
    },
    {
      color: "#a78bfa",
      title: <><span style={{ color: "#a78bfa" }}>Consistency</span> of Annotations</>,
      sub: "Minimize Inter-observer Variability",
      desc: "Strict annotation protocols and expert review pipelines minimize variability, ensuring consistent and reproducible ground truth across all cases.",
      badge: null,
    },
    {
      color: "#60a5fa",
      title: <><span style={{ color: "#60a5fa" }}>Large-scale</span> datasets</>,
      sub: "Over 26,000 cases · 1.7M DICOM files",
      desc: "With over 26,000 annotated cases and 1.7 million DICOM files, our dataset covers rare and complex pathologies that most AI systems have never encountered.",
      badge: "26,000+ cases",
    },
    {
      color: "#34d399",
      title: <><span style={{ color: "#34d399" }}>Rapid</span> AI Solution Development Process</>,
      sub: "8 pipelines completed within 11 months",
      desc: "Our streamlined development process — from data curation to model deployment — enables faster iteration and delivery without compromising clinical rigor.",
      badge: "8 pipelines / 11 mo.",
    },
  ];

  const [hovered, setHovered] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);

  return (
    <section style={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <div className="cn-section-flex" style={{ display: "flex", width: "100%", alignItems: "center", gap: "5rem" }}>
        <div style={{ flex: 1 }}>
          <RevealSection>
            <SectionLabel>About</SectionLabel>
            <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 700, color: "#e2e8f0", marginBottom: "2rem", lineHeight: 1.3 }}>
              Distinctive Strengths of <span style={{ color: "#ffffff" }}>CLARUS</span><span style={{ color: "#a855f7" }}>-N</span>
            </h2>
          </RevealSection>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {strengths.map((item, i) => {
              const active = hovered === i || pinned === i;
              return (
                <RevealSection key={i} style={{ transitionDelay: `${i * 0.08}s` }}>
                  <div
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => setPinned(pinned === i ? null : i)}
                    style={{
                      display: "flex",
                      borderRadius: "0.9rem",
                      background: pinned === i
                        ? `${item.color}14`
                        : hovered === i ? `${item.color}0a` : "rgba(15,23,42,0.5)",
                      border: `1px solid ${active ? `${item.color}40` : "rgba(255,255,255,0.06)"}`,
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      overflow: "hidden",
                    }}
                  >
                    {/* 왼쪽 컬러 액센트 바 */}
                    <div style={{
                      width: "3px",
                      flexShrink: 0,
                      background: active ? item.color : `${item.color}40`,
                      transition: "background 0.3s ease",
                      borderRadius: "0.9rem 0 0 0.9rem",
                    }} />

                    {/* 번호 배지 */}
                    <div style={{
                      flexShrink: 0,
                      width: "2rem",
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "center",
                      paddingTop: "1rem",
                    }}>
                      <span style={{
                        fontSize: "0.6rem",
                        fontWeight: 700,
                        color: active ? item.color : "rgba(255,255,255,0.2)",
                        transition: "color 0.3s ease",
                        letterSpacing: "0.02em",
                      }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {/* 본문 */}
                    <div style={{ flex: 1, padding: "0.9rem 1rem 0.9rem 0.25rem" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
                        <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "#e2e8f0" }}>
                          {item.title}
                        </div>
                      </div>

                      {/* 서브타이틀 — hover/pinned 시 펼침 */}
                      <div style={{
                        maxHeight: active ? "60px" : "0px",
                        opacity: active ? 1 : 0,
                        overflow: "hidden",
                        transition: "max-height 0.35s ease, opacity 0.3s ease",
                        marginTop: active ? "0.35rem" : "0",
                        fontSize: "0.78rem",
                        color: "#94a3b8",
                        fontStyle: "italic",
                        lineHeight: 1.6,
                      }}>
                        {item.sub}
                      </div>
                    </div>
                  </div>
                </RevealSection>
              );
            })}
          </div>
        </div>

        {/* 우측 뉴런 장식 */}
        <div style={{ flex: 1, height: "500px", position: "relative" }}>
          <NeuralSynapseVisual mode="dense" color="147, 197, 253" opacity={0.55} />
        </div>
      </div>
    </section>
  );
}


function BackgroundSection() {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const items: { en: string; ko: string; side: "left" | "right"; image?: string }[] = [
    { en: "Ultra-aged society", ko: "초고령화 사회", side: "left", image: "/bg-초고령.png" },
    { en: "Surge in neurological diseases associated with super-aging", ko: "초고령화 사회로 인한 신경계 질환의 급증", side: "right", image: "/bg-질환급증.png" },
    { en: "Limited availability of neurological expertise", ko: "신경계 전문 인력의 희소성", side: "left", image: "/bg-신경의희소성.png" },
    { en: "Complexity of neuroimaging interpretation", ko: "MRI, CT 영상 해석의 난해함", side: "right" },
    { en: "The time-sensitive and life-threatening nature of brain disorders", ko: "신경계 질환의 긴급성과 생명과 직결되는 치명성", side: "left", image: "/bg-신경긴급성.png" },
    { en: "Regional imbalance in the distribution of general hospitals", ko: "병원 접근성의 지역별 불균형", side: "right", image: "/bg-병원분포.png" },
  ];

  const cardStyle = {
    borderRadius: "0.75rem",
    overflow: "hidden" as const,
    background: "rgba(15,23,42,0.8)",
    border: "1px solid rgba(96,165,250,0.15)",
    backdropFilter: "blur(12px)",
    transition: "border-color 0.3s, box-shadow 0.3s, transform 0.3s",
    width: "38%",
  };

  return (
    <section id="background" style={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <div style={{ width: "100%" }}>
        <RevealSection>
          <SectionLabel>Background</SectionLabel>
          <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 700, color: "#e2e8f0", marginBottom: "0.75rem" }}>
            Research Context and Motivation
          </h2>
          <p style={{ color: "#64748b", fontSize: "0.95rem", marginBottom: "2.5rem", maxWidth: "42rem", lineHeight: 1.7 }}>
            Cerebrovascular diseases require rapid diagnosis, making timing critical for survival. We solve challenges like radiologist shortages and interpretation delays through AI-driven automation.
          </p>
        </RevealSection>

        <RevealSection style={{ transitionDelay: "0.1s" }}>
          {/* 중앙 로고 + 양쪽 카드 */}
          <div style={{ position: "relative", width: "100%", height: "520px" }}>

            {/* 중앙 로고 */}
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)", zIndex: 2,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{ position: "absolute", width: "300px", height: "300px", borderRadius: "50%", border: "1px solid rgba(96,165,250,0.2)", animation: "bgLogoPulse 3s ease-in-out infinite" }} />
              <div style={{ position: "absolute", width: "400px", height: "400px", borderRadius: "50%", border: "1px solid rgba(168,85,247,0.1)", animation: "bgLogoPulse 3s ease-in-out infinite 1s" }} />
              <div style={{ position: "absolute", width: "500px", height: "500px", borderRadius: "50%", border: "1px solid rgba(96,165,250,0.05)", animation: "bgLogoPulse 3s ease-in-out infinite 2s" }} />
              <img src="/logo.png" alt="CLARUS-N" style={{
                position: "relative", zIndex: 1, width: "240px", opacity: 0.95,
                filter: "drop-shadow(0 0 30px rgba(96,165,250,0.3)) drop-shadow(0 0 60px rgba(168,85,247,0.2))",
              }} />
            </div>

            {/* 뉴런 배경 */}
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
              <NeuralSynapseVisual mode="calm" color="96, 165, 250" opacity={0.15} />
            </div>

            {/* 카드들 — 3개씩 좌우 */}
            {items.map((item, i) => {
              const isLeft = item.side === "left";
              const rowIndex = Math.floor(i / 2);
              const topPercent = 8 + rowIndex * 33;
              const isActive = activeCard === i;
              const hasImage = !!item.image;
              return (
                <div key={i}
                  style={{
                    ...cardStyle,
                    position: "absolute",
                    top: `${topPercent}%`,
                    ...(isLeft ? { left: "0%" } : { right: "0%" }),
                    borderColor: isActive ? "rgba(96,165,250,0.5)" : "rgba(96,165,250,0.15)",
                    boxShadow: isActive ? "0 0 24px rgba(96,165,250,0.2)" : "none",
                    cursor: hasImage ? "pointer" : "default",
                    transition: "all 0.3s ease",
                  }}
                  onClick={() => hasImage && setActiveCard(isActive ? null : i)}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(96,165,250,0.5)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 0 24px rgba(96,165,250,0.12)";
                    (e.currentTarget as HTMLElement).style.transform = isLeft ? "translateX(4px)" : "translateX(-4px)";
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(96,165,250,0.15)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "none";
                    }
                    (e.currentTarget as HTMLElement).style.transform = "translateX(0)";
                  }}
                >
                  <div style={{ height: "2px", background: "linear-gradient(90deg, rgba(96,165,250,0.8), rgba(168,85,247,0.6))" }} />
                  <div style={{ padding: "0.7rem 1rem", display: "flex", alignItems: "flex-start", gap: "0.7rem" }}>
                    <div style={{
                      flexShrink: 0, width: "1.4rem", height: "1.4rem", borderRadius: "50%",
                      background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.3)",
                      color: "#60a5fa", fontSize: "0.6rem", fontWeight: 700,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "0.58rem", color: "#60a5fa", marginBottom: "0.15rem", fontStyle: "italic" }}>
                        [{item.en}]
                      </div>
                      <div style={{ fontSize: "0.82rem", color: "#e2e8f0", fontWeight: 600, lineHeight: 1.5, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        {item.ko}
                        {hasImage && (
                          <span style={{ fontSize: "0.6rem", color: "rgba(96,165,250,0.5)", marginLeft: "auto" }}>
                            {isActive ? "▲" : "▼"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* 이미지 팝업 오버레이 */}
            {activeCard !== null && items[activeCard]?.image && (
              <div
                onClick={() => setActiveCard(null)}
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(5,10,25,0.75)",
                  backdropFilter: "blur(6px)",
                  animation: "cn-content-reveal 0.3s ease forwards",
                }}
              >
                <div
                  onClick={e => e.stopPropagation()}
                  style={{
                    position: "relative",
                    maxWidth: "420px",
                    width: "90%",
                    borderRadius: "1rem",
                    overflow: "hidden",
                    border: "1px solid rgba(96,165,250,0.3)",
                    boxShadow: "0 0 60px rgba(0,0,0,0.6), 0 0 30px rgba(96,165,250,0.1)",
                  }}
                >
                  {/* 헤더 */}
                  <div style={{
                    padding: "0.6rem 1rem",
                    background: "rgba(15,23,42,0.95)",
                    borderBottom: "1px solid rgba(96,165,250,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}>
                    <span style={{ fontSize: "0.72rem", color: "#60a5fa", fontStyle: "italic" }}>
                      [{items[activeCard].en}]
                    </span>
                    <button
                      onClick={() => setActiveCard(null)}
                      style={{
                        background: "none", border: "none", color: "rgba(148,163,184,0.6)",
                        fontSize: "1rem", cursor: "pointer", lineHeight: 1, padding: "0 0.2rem",
                      }}
                    >×</button>
                  </div>
                  <img
                    src={items[activeCard].image}
                    alt={items[activeCard].ko}
                    style={{ width: "100%", display: "block", objectFit: "cover" }}
                  />
                  <div style={{
                    padding: "0.65rem 1rem",
                    background: "rgba(15,23,42,0.95)",
                    fontSize: "0.82rem", fontWeight: 600, color: "#e2e8f0",
                  }}>
                    {items[activeCard].ko}
                  </div>
                </div>
              </div>
            )}
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

function PerformanceSection({ pageIndex, setPageIndex }: { 
  pageIndex: number; 
  setPageIndex: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasNudged, setHasNudged] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  const mraCards: CardData[] = [
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

  const infarctCards: CardData[] = [
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
      details: ["#Dice 0.820, #22.0sec", "#Six major vessels"],
      legendItems: [
        { label: "ACA", color: "#d946ef" },
        { label: "MCA", color: "#22c55e" },
        { label: "Lenticulostriatal A.", color: "#2dd4bf" },
        { label: "Ant. choroidal A.", color: "#60a5fa" },
        { label: "PCA", color: "#fb923c" },
        { label: "BA & VA", color: "#a855f7" },
      ],
    },
    {
      id: "dwi-3",
      title: "ADC AI for Infarction <span style='color: #fdba74'>Onset</span> Detection",
      description: "Transferring DWI-predicted lesions to ADC to estimate time since onset.",
      videoSrc: "/videos/KakaoTalk_20260406_122852533.mp4",
      theme: "purple",
      details: ["#Dice 0.820, #22.0sec", "#Acute, Subacute, Chronic stage"],
      legendItems: [
        { label: "Acute stage", color: "#ef4444" },
        { label: "Subacute stage", color: "#f97316" },
        { label: "Chronic stage", color: "#eab308" },
      ],
    }
  ];

  const carotidCards: CardData[] = [
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

  const ctCards: CardData[] = [
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

  const handleCardClick = (videoSrc: string) => {
    if (activeVideo === videoSrc) {
      setActiveVideo(null);
      setIsPlaying(false);
    } else {
      setActiveVideo(videoSrc);
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <section 
      id="performance" 
      ref={sectionRef}
      style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative" }}
    >
      <div className="cn-section-flex" style={{ display: "flex", width: "100%", alignItems: "center", gap: "4rem" }}>
        <div style={{ flex: 1, maxWidth: "42rem", width: "100%", position: "relative" }}>
          <RevealSection>
            <SectionLabel>Pipeline Characteristics</SectionLabel>
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
            {/* 좌측 화살표 (이전 세트) - 사이드 이동 */}
            <button 
              onClick={() => {
                setPageIndex(p => Math.max(0, p - 1));
                setActiveVideo(null);
              }}
              disabled={pageIndex === 0}
              style={{
                position: "absolute",
                left: "-3.5rem",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                background: "none", border: "none", color: "#60a5fa", 
                cursor: pageIndex === 0 ? "default" : "pointer",
                opacity: pageIndex === 0 ? 0.05 : 0.6, transition: "all 0.3s ease", padding: "1rem",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}
              onMouseEnter={e => pageIndex !== 0 && (e.currentTarget.style.opacity = "1")}
              onMouseLeave={e => pageIndex !== 0 && (e.currentTarget.style.opacity = "0.6")}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>

            {/* 우측 화살표 (다음 세트) - 사이드 이동 */}
            <button 
              onClick={() => {
                setPageIndex(p => Math.min(cardSets.length - 1, p + 1));
                setActiveVideo(null);
              }}
              disabled={pageIndex === cardSets.length - 1}
              style={{
                position: "absolute",
                right: "-2.5rem",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                background: "none", border: "none", color: "#60a5fa", 
                cursor: pageIndex === cardSets.length - 1 ? "default" : "pointer",
                opacity: pageIndex === cardSets.length - 1 ? 0.05 : 0.6, transition: "all 0.3s ease", padding: "1rem",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}
              onMouseEnter={e => pageIndex !== cardSets.length - 1 && (e.currentTarget.style.opacity = "1")}
              onMouseLeave={e => pageIndex !== cardSets.length - 1 && (e.currentTarget.style.opacity = "0.6")}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>

            {/* 가로 슬라이딩 트랙 - overflow hidden을 여기로 이동 */}
            <div style={{ overflow: "hidden", width: "100%" }}>
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
                      gap: "2.5rem",
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
          </div>

          {/* 인디케이터 - 화살표 제거됨 */}
          <div style={{ 
            display: "flex", 
            alignItems: "center",
            justifyContent: "flex-start", 
            gap: "1.75rem", 
            marginTop: "2.5rem",
            paddingLeft: "1.5rem"
          }}>
            {/* 도트 리스트 */}
            <div style={{ display: "flex", gap: "0.85rem", alignItems: "center" }}>
              {cardSets.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPageIndex(idx);
                    setActiveVideo(null);
                    setIsPlaying(false);
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
          </div>
          </div>
        
        {/* 우측 영역: 비디오 재생 시만 박스 등장 */}
        <div style={{
          flex: 1.4,
          height: "500px",
          position: "relative",
          background: activeVideo ? "rgba(0,0,0,0.85)" : "transparent",
          borderRadius: "1.5rem",
          overflow: "hidden",
          border: activeVideo ? "1px solid rgba(96,165,250,0.3)" : "none",
          boxShadow: activeVideo ? "0 0 40px rgba(0,0,0,0.5)" : "none",
          transition: "all 0.6s ease",
          cursor: activeVideo ? "pointer" : "default",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
        onClick={activeVideo ? togglePlay : undefined}
        >
          {/* 뉴런 시각화 (항상 배경에 깔림) */}
          <div style={{
            position: "absolute", inset: 0,
            opacity: activeVideo ? 0.15 : 1,
            filter: activeVideo ? "blur(4px)" : "none",
            transition: "opacity 0.6s ease, filter 0.6s ease",
          }}>
            <NeuralSynapseVisual mode="fast" color="110, 227, 175" opacity={0.5} />
          </div>

          {/* 비디오 없을 때: 안내 텍스트 */}
          {!activeVideo && (
            <p style={{
              position: "absolute",
              bottom: "1.5rem",
              left: 0, right: 0,
              textAlign: "center",
              color: "rgba(148,163,184,0.45)",
              fontSize: "0.8rem",
              letterSpacing: "0.05em",
              pointerEvents: "none",
            }}>
              Click a pipeline to view the AI analysis results
            </p>
          )}

          {/* 범례 오버레이 */}
          <ClinicalLegend activeVideo={activeVideo} />

          {/* 비디오 플레이어 */}
          {activeVideo && (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <video
                ref={videoRef}
                src={activeVideo}
                loop muted playsInline
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
              {!isPlaying && (
                <div style={{
                  position: "absolute", inset: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(0,0,0,0.3)", backdropFilter: "blur(4px)", zIndex: 2,
                }}>
                  <div style={{
                    width: "72px", height: "72px", borderRadius: "50%",
                    background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 0 30px rgba(96,165,250,0.4)", color: "white",
                  }}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

interface CardData {
  title: string;
  description: string;
  videoSrc: string;
  theme: "blue" | "purple" | "gray" | "green";
  details: string[];
  id?: string;
  legendItems?: { label: string; color: string }[];
}

function CharacteristicCard({ card, isActive, onClick }: { card: CardData; isActive: boolean; onClick: () => void }) {
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

      {/* 활성화 시 범례 정보 표시 */}
      {card.legendItems && (
        <div style={{
          maxHeight: isActive ? "200px" : "0",
          opacity: isActive ? 1 : 0,
          overflow: "hidden",
          transition: "max-height 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease",
          marginTop: isActive ? "1.25rem" : "0",
        }}>
          <div style={{
            borderTop: `1px solid ${themeColor.replace("0.8", "0.2")}`,
            paddingTop: "1rem",
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}>
            {card.legendItems.map(item => (
              <div key={item.label} style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                background: `${item.color}14`,
                border: `1px solid ${item.color}40`,
                borderRadius: "0.4rem",
                padding: "0.3rem 0.65rem",
              }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: item.color, flexShrink: 0 }} />
                <span style={{ fontSize: "0.78rem", color: "#e2e8f0", fontWeight: 500 }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

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
  const [isUploadHovered, setIsUploadHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [emailValue, setEmailValue] = useState("");
  const [fileType, setFileType] = useState("");
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [requestCount, setRequestCount] = useState(231);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file.size > 25 * 1024 * 1024) {
      alert("파일 크기는 25MB 이하여야 합니다.");
      return;
    }
    setSelectedFile(file);
  };

  const handleAnalysisSubmit = async () => {
    if (!selectedFile) { alert("파일을 선택해주세요."); return; }
    if (!emailValue) { alert("이메일을 입력해주세요."); return; }
    if (!fileType) { alert("파일 내용을 선택해주세요."); return; }
    setSubmitState("loading");
    try {
      const form = new FormData();
      form.append("file", selectedFile);
      form.append("email", emailValue);
      form.append("fileType", fileType);
      const res = await fetch("/api/analysis", { method: "POST", body: form });
      if (!res.ok) throw new Error();
      setSubmitState("success");
      setRequestCount(prev => prev + 1);
      setSelectedFile(null);
      setEmailValue("");
      setFileType("");
    } catch {
      setSubmitState("error");
    }
  };
  
  const infoPointsKR = [
    "파일 형식 지원 (최대 500MB)",
    "전송된 영상은 NIfTI 파일형식으로 모두 전환됩니다",
    "NIfTI 파일형식의 특성상 모든 환자개인정보가 자동 삭제됩니다",
    "원본 파일도 NIfTI 전환 후 모두 삭제됩니다",
    "분석된 영상은 이메일로 24시간 이내로 보내드립니다",
    "빠른 영상분석이 필요시에는 파일 업로드 후 contact의 연락처로 문의 바랍니다."
  ];

  return (
    <section id="test-request" style={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <div className="cn-section-flex" style={{ display: "flex", width: "100%", alignItems: "center", gap: "5rem" }}>
        <div style={{ flex: 1, maxWidth: "38rem" }}>
          <RevealSection>
            <SectionLabel>Research Analysis Request</SectionLabel>
            <h2 style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.2rem)", fontWeight: 700, color: "#ffffff", lineHeight: 1.2, marginBottom: "1.5rem", letterSpacing: "-0.01em" }}>
              연구용 데이터 AI 분석 의뢰
            </h2>
            <Divider />
          </RevealSection>
          
          <RevealSection style={{ transitionDelay: "0.1s" }}>
            <div style={{
              background: "rgba(255,255,255,0.02)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "1.5rem",
              padding: "1.25rem",
              marginBottom: "1.5rem",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            }}>
              {/* 숨겨진 파일 입력 */}
              <input
                ref={fileInputRef}
                type="file"
                style={{ display: "none" }}
                onChange={e => { if (e.target.files?.[0]) handleFileSelect(e.target.files[0]); }}
              />

              {/* 업로드 영역 */}
              <div
                onClick={() => fileInputRef.current?.click()}
                onMouseEnter={() => setIsUploadHovered(true)}
                onMouseLeave={() => setIsUploadHovered(false)}
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={e => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0]);
                }}
                style={{
                  background: isDragging ? "rgba(96,165,250,0.12)" : isUploadHovered ? "rgba(96,165,250,0.05)" : "rgba(255,255,255,0.01)",
                  border: `1px ${isDragging || isUploadHovered ? 'solid' : 'dashed'} ${isDragging ? 'rgba(96,165,250,0.8)' : isUploadHovered ? 'rgba(96,165,250,0.5)' : 'rgba(96,165,250,0.25)'}`,
                  borderRadius: "1rem",
                  padding: "1.5rem 1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  marginBottom: "2rem",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                {selectedFile ? (
                  <>
                    <div style={{ color: "#34d399", marginBottom: "0.75rem" }}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <polyline points="9 15 11 17 15 13" />
                      </svg>
                    </div>
                    <p style={{ color: "#e2e8f0", fontSize: "1rem", fontWeight: 600, marginBottom: "0.3rem", wordBreak: "break-all" }}>
                      {selectedFile.name}
                    </p>
                    <p style={{ color: "#64748b", fontSize: "0.8rem" }}>
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <button
                      onClick={e => { e.stopPropagation(); setSelectedFile(null); }}
                      style={{ marginTop: "0.75rem", fontSize: "0.8rem", color: "#f87171", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
                    >
                      파일 제거
                    </button>
                  </>
                ) : (
                  <>
                    <div style={{
                      color: isDragging ? "#60a5fa" : "#60a5fa",
                      marginBottom: "1rem",
                      transform: isUploadHovered ? "translateY(-5px)" : "translateY(0)",
                      transition: "transform 0.4s ease"
                    }}>
                      <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                    </div>
                    <p style={{ color: "#ffffff", fontSize: "1.15rem", fontWeight: 500, marginBottom: "0.4rem" }}>
                      {isDragging ? "파일을 여기에 놓으세요" : "MRI 또는 CT 데이터를 첨부하세요"}
                    </p>
                    <p style={{ color: "rgba(148,163,184,0.6)", fontSize: "0.85rem", letterSpacing: "0.02em" }}>
                      클릭하거나 파일을 여기로 끌어다 놓으세요 (최대 25MB)
                    </p>
                  </>
                )}
                {(isUploadHovered || isDragging) && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'radial-gradient(circle at center, rgba(59,130,246,0.1) 0%, transparent 70%)',
                    pointerEvents: 'none'
                  }} />
                )}
              </div>

              {/* 상세 안내 리스트 */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                {infoPointsKR.map((point, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                    <span style={{ 
                      color: "#60a5fa", 
                      fontSize: "1.1rem", 
                      lineHeight: "1.5rem",
                      fontWeight: 800
                    }}>•</span>
                    <p style={{ 
                      color: "rgba(226,232,240,0.75)", 
                      fontSize: "0.95rem", 
                      lineHeight: 1.6,
                      fontWeight: 300,
                      wordBreak: "keep-all"
                    }}>
                      {point}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </RevealSection>

          <RevealSection style={{ transitionDelay: "0.2s" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div className="cn-form-row" style={{ display: "flex", gap: "1.25rem" }}>
                {/* 이메일 입력 */}
                <div style={{ flex: 1, position: "relative" }}>
                  <label htmlFor="email-input" className="sr-only">이메일 주소</label>
                  <input
                    id="email-input"
                    type="email"
                    placeholder="이메일 주소 (결과 수신용)"
                    value={emailValue}
                    onChange={e => setEmailValue(e.target.value)}
                    style={{ 
                      width: "100%",
                      padding: "1.1rem 1.5rem", 
                      borderRadius: "0.85rem", 
                      background: "rgba(255,255,255,0.03)", 
                      border: "1px solid rgba(255,255,255,0.08)", 
                      color: "#ffffff", 
                      outline: "none",
                      fontSize: "1rem",
                      transition: "all 0.3s ease",
                      boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)"
                    }} 
                    onFocus={e => {
                      e.currentTarget.style.borderColor = "rgba(96,165,250,0.4)";
                      e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    }}
                    onBlur={e => {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                      e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    }}
                  />
                </div>
                {/* 파일 내용 선택 */}
                <div style={{ flex: 1 }}>
                  <label htmlFor="file-type-select" className="sr-only">파일 내용 선택</label>
                  <select
                    id="file-type-select"
                    value={fileType}
                    onChange={e => setFileType(e.target.value)}
                    style={{ 
                      width: "100%",
                      padding: "1.1rem 1.5rem", 
                      borderRadius: "0.85rem", 
                      background: "rgba(15,23,42,0.8)", 
                      border: "1px solid rgba(255,255,255,0.08)", 
                      color: "#ffffff", 
                      outline: "none",
                      fontSize: "1rem",
                      cursor: "pointer",
                      appearance: "none",
                      backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2360a5fa' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 1rem center",
                      backgroundSize: "1.2rem",
                      transition: "all 0.3s ease"
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = "rgba(96,165,250,0.4)"}
                    onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
                  >
                    <option value="" disabled>파일 내용 선택</option>
                    <option value="brain-mra-tof">Brain MRA: TOF</option>
                    <option value="mri-dwi-adc">MRI: DWI &amp; ADC</option>
                    <option value="carotid-mra-tof">Carotid MRA: TOF</option>
                    <option value="brain-ct-axial">Brain CT: axial</option>
                    <option value="brain-cta-source">Brain CTA: source</option>
                  </select>
                </div>
              </div>
              
              {/* 분석 요청하기 버튼 */}
              <button style={{
                padding: "1.2rem", 
                borderRadius: "1rem",
                background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                color: "#ffffff", 
                fontWeight: 700, 
                fontSize: "1.15rem",
                border: "none", 
                cursor: "pointer",
                boxShadow: "0 10px 25px -5px rgba(59,130,246,0.5), 0 8px 10px -6px rgba(139,92,246,0.3)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                letterSpacing: "0.05em"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 20px 30px -5px rgba(59,130,246,0.6), 0 15px 15px -6px rgba(139,92,246,0.4)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 25px -5px rgba(59,130,246,0.5), 0 8px 10px -6px rgba(139,92,246,0.3)";
              }}
              onClick={handleAnalysisSubmit}
              >
                {submitState === "loading" ? "전송 중..." : "분석 요청하기"}
              </button>

              {submitState === "success" && (
                <div style={{ marginTop: "1rem", padding: "0.9rem 1.2rem", borderRadius: "0.75rem", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.4)", color: "#4ade80", fontSize: "0.95rem", fontWeight: 600 }}>
                  ✓ 분석 의뢰가 성공적으로 접수되었습니다. 결과는 입력하신 이메일로 발송됩니다.
                </div>
              )}
              {submitState === "error" && (
                <div style={{ marginTop: "1rem", padding: "0.9rem 1.2rem", borderRadius: "0.75rem", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.4)", color: "#f87171", fontSize: "0.95rem", fontWeight: 600 }}>
                  ✕ 전송에 실패했습니다. 잠시 후 다시 시도해주세요.
                </div>
              )}

              {/* 분석 요청 카운터: 화려하게 강조 */}
              <div style={{ textAlign: "left", marginTop: "1.2rem" }}>
                <span style={{ 
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "0.4rem 1rem",
                  borderRadius: "2rem",
                  background: "rgba(59,130,246,0.08)",
                  border: "1px solid rgba(59,130,246,0.3)",
                  color: "#60a5fa", 
                  fontSize: "0.95rem", 
                  fontFamily: "'Inter', sans-serif", 
                  fontWeight: 600, 
                  letterSpacing: "0.08em",
                  textShadow: "0 0 12px rgba(96,165,250,0.4)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
                }}>
                  <span style={{ 
                    display: "inline-block", 
                    width: "8px", 
                    height: "8px", 
                    borderRadius: "50%", 
                    background: "#60a5fa", 
                    marginRight: "0.75rem",
                    boxShadow: "0 0 8px #60a5fa"
                  }} />
                  ANALYSIS REQUEST: {String(requestCount).padStart(4, '0')}
                </span>
              </div>
            </div>
          </RevealSection>
        </div>

        {/* 우측 뉴런 장식: 분석 완료 시의 활발한 뇌 활동 느낌 */}
        <div style={{ flex: 1, height: "500px", position: "relative" }}>
          <NeuralSynapseVisual mode="fast" color="236, 72, 153" opacity={0.9} />
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [formData, setFormData] = useState({ name: "", region: "", company: "", job: "", email: "", phone: "", message: "" });
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleField = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!privacyAgreed) { alert("개인정보 처리방침에 동의해주세요."); return; }
    if (!formData.name || !formData.email || !formData.message) { alert("이름, 이메일, 문의내용은 필수입니다."); return; }
    setSubmitState("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error();
      setSubmitState("success");
      setFormData({ name: "", region: "", company: "", job: "", email: "", phone: "", message: "" });
      setPrivacyAgreed(false);
    } catch {
      setSubmitState("error");
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('clarusnai@gmail.com');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <section id="contact" style={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <div className="cn-section-flex" style={{ display: "flex", width: "100%", alignItems: "stretch", gap: "4rem" }}>
        <div style={{ flex: 1, maxWidth: "38rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <RevealSection>
            <SectionLabel>Contact</SectionLabel>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300, color: "#e2e8f0", lineHeight: 1.2, marginBottom: "1.5rem", letterSpacing: "0.05em" }}>
              <span style={{ whiteSpace: "nowrap" }}>Research Collaboration</span><br />
              <span style={{ whiteSpace: "nowrap" }}>& Technical Partnerships</span>
            </h2>
            <Divider />
          </RevealSection>
          <RevealSection style={{ transitionDelay: "0.1s" }}>
            <p style={{ color: "#94a3b8", lineHeight: 1.85, fontSize: "1.05rem", fontWeight: 300, marginBottom: "2rem" }}>
              <span style={{ color: "#e2e8f0", fontWeight: 700 }}>CLARUS</span>-<span style={{ color: "#a855f7", fontWeight: 700 }}>N</span>의 다양한 AI solutions에 대해 관심을 주셔서 감사합니다.<br />현재 <span style={{ color: "#e2e8f0", fontWeight: 700 }}>CLARUS</span>-<span style={{ color: "#a855f7", fontWeight: 700 }}>N</span>는 연구목적의 파일럿 프로그램만 운용중입니다.<br />
              저희와 연구 협력 및 기술 제휴 등의 궁금한 점이 있으시면 문의해 주세요.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%", maxWidth: "420px" }}>
              
              {/* 타이틀 버튼 스타일 - 팝업 트리거 버튼으로 변경 */}
              <button 
                onClick={() => setIsFormOpen(true)}
                style={{
                  position: "relative",
                  padding: "1.2rem 1.5rem",
                  borderRadius: "1.25rem",
                  background: "linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(37,99,235,0.3) 100%)",
                  border: "1px solid rgba(96,165,250,0.5)",
                  boxShadow: "0 4px 20px rgba(59,130,246,0.2), inset 0 0 10px rgba(255,255,255,0.05)",
                  backdropFilter: "blur(12px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  textAlign: "left",
                  width: "100%",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 12px 30px rgba(59,130,246,0.35), inset 0 0 15px rgba(255,255,255,0.15)";
                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(59,130,246,0.25) 0%, rgba(37,99,235,0.45) 100%)";
                  e.currentTarget.style.borderColor = "rgba(96,165,250,0.8)";
                  const arrow = e.currentTarget.querySelector('.btn-arrow') as HTMLElement;
                  if (arrow) arrow.style.transform = "translateX(5px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(59,130,246,0.2), inset 0 0 10px rgba(255,255,255,0.05)";
                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(37,99,235,0.3) 100%)";
                  e.currentTarget.style.borderColor = "rgba(96,165,250,0.5)";
                  const arrow = e.currentTarget.querySelector('.btn-arrow') as HTMLElement;
                  if (arrow) arrow.style.transform = "translateX(0)";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                  <div style={{ background: "rgba(255,255,255,0.05)", padding: "0.6rem", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ color: "#ffffff", fontSize: "1.3rem", fontWeight: 700, letterSpacing: "0.02em" }}>Contact</span>
                    <span style={{ color: "rgba(147,197,253,0.8)", fontSize: "0.8rem", marginTop: "0.2rem" }}>버튼을 클릭하여 온라인 문의 폼 열기</span>
                  </div>
                </div>
                <div className="btn-arrow" style={{ transition: "transform 0.3s ease", display: "flex", alignItems: "center" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </button>

              {/* 하위 항목 리스트 */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", paddingLeft: "0.75rem" }}>
                <div 
                  onClick={handleCopyEmail}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.25rem",
                    padding: "1rem 1.25rem",
                    borderRadius: "0.875rem",
                    background: isCopied ? "rgba(59,130,246,0.15)" : "rgba(30,58,138,0.08)",
                    border: isCopied ? "1px solid rgba(96,165,250,0.6)" : "1px solid rgba(148,163,184,0.1)",
                    backdropFilter: "blur(4px)",
                    cursor: "pointer",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    position: "relative"
                  }}
                  onMouseEnter={e => {
                    if (!isCopied) {
                      e.currentTarget.style.background = "rgba(30,58,138,0.15)";
                      e.currentTarget.style.borderColor = "rgba(148,163,184,0.2)";
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isCopied) {
                      e.currentTarget.style.background = "rgba(30,58,138,0.08)";
                      e.currentTarget.style.borderColor = "rgba(148,163,184,0.1)";
                    }
                  }}
                >
                  <div style={{ background: isCopied ? "rgba(96,165,250,0.3)" : "rgba(148,163,184,0.1)", padding: "0.6rem", borderRadius: "50%", display: "flex", transition: "all 0.3s" }}>
                    {isCopied ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: isCopied ? "#93c5fd" : "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.15rem", fontWeight: isCopied ? 700 : 400 }}>
                      {isCopied ? "COPIED!" : "E-mail"}
                    </div>
                    <div style={{ color: isCopied ? "#ffffff" : "#cbd5e1", fontSize: "1.05rem", fontWeight: isCopied ? 600 : 400, letterSpacing: "0.02em" }}>clarusnai@gmail.com</div>
                  </div>
                  {/* 클릭 유도 툴팁 (작게) */}
                  {!isCopied && (
                    <div style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", fontSize: "0.7rem", color: "#475569", opacity: 0.6 }}>
                      Click to Copy
                    </div>
                  )}
                </div>

                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1.25rem",
                  padding: "1rem 1.25rem",
                  borderRadius: "0.875rem",
                  background: "rgba(30,58,138,0.08)",
                  border: "1px solid rgba(148,163,184,0.1)",
                  backdropFilter: "blur(4px)",
                }}>
                  <div style={{ background: "rgba(148,163,184,0.1)", padding: "0.6rem", borderRadius: "50%", display: "flex" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.15rem" }}>Tel</div>
                    <div style={{ color: "#cbd5e1", fontSize: "1.05rem", fontWeight: 400, letterSpacing: "0.05em" }}>+82-2-****-****</div>
                  </div>
                </div>
              </div>
            </div>
          </RevealSection>
        </div>
        
        {/* 우측 영역: 기본 Visual 또는 Form 팝업 오버레이 */}
        <div style={{ flex: 1, position: "relative", minHeight: "600px", display: "flex", alignItems: "center", transition: "all 0.5s ease" }}>
          
          {/* Background Visual (폼이 열리면 배경으로 희미해짐) */}
          <div style={{ 
            position: "absolute", inset: 0, height: "100%", 
            opacity: isFormOpen ? 0.05 : 1, 
            transition: "opacity 0.6s ease",
            transform: isFormOpen ? "scale(0.95)" : "scale(1)",
          }}>
            <NeuralSynapseVisual mode="fast" color="96, 165, 250" opacity={0.65} />
          </div>

          {/* Contact Form Popup */}
          <div style={{
            position: "absolute",
            inset: 0,
            opacity: isFormOpen ? 1 : 0,
            pointerEvents: isFormOpen ? "auto" : "none",
            transform: isFormOpen ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
            background: "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(20px)",
            borderRadius: "1.5rem",
            border: "1px solid rgba(96,165,250,0.25)",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5), 0 0 30px rgba(59,130,246,0.15)",
            padding: "2.5rem",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto"
          }}>
             {/* Header */}
             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
               <h3 style={{ color: "#e2e8f0", fontSize: "1.75rem", fontWeight: 500, margin: 0, letterSpacing: "0.02em" }}>
                 Contact
               </h3>
               <button 
                 onClick={() => setIsFormOpen(false)}
                 style={{ 
                   background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", 
                   color: "#94a3b8", cursor: "pointer", padding: "0.5rem", borderRadius: "50%",
                   display: "flex", alignItems: "center", justifyContent: "center",
                   transition: "all 0.2s"
                 }}
                 onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#ffffff"; }}
                 onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#94a3b8"; }}
               >
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                   <line x1="18" y1="6" x2="6" y2="18"></line>
                   <line x1="6" y1="6" x2="18" y2="18"></line>
                 </svg>
               </button>
             </div>
             
             {/* Form Description */}
             <div style={{ color: "#94a3b8", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "2rem", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "1.5rem" }}>
               <span style={{ color: "#e2e8f0", fontWeight: 600 }}>CLARUS</span>-<span style={{ color: "#a855f7", fontWeight: 700 }}>N</span>에 관심 가져주셔서 감사합니다.<br/>
               제품에 관한 사항, 기술제휴 및 협력 등의 문의를 남겨주시면 확인 후 빠르게 연락 드리겠습니다.
             </div>

             {/* Form Fields */}
             <form style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }} onSubmit={handleSubmit}>

               {[
                 { id: "name", label: "이름", ph: "ex. 홍길동" },
                 { id: "region", label: "지역", ph: "ex. 서울시 서초구" },
                 { id: "company", label: "기관명/병원명", ph: "ex. 클라루스엔" },
                 { id: "job", label: "직함", ph: "ex. 신경외과 과장" },
                 { id: "email", label: "이메일", ph: "ex. clarusnai@gmail.com", type: "email" },
                 { id: "phone", label: "연락처", ph: "ex. 010-****-****", type: "tel" },
               ].map((field) => (
                 <div key={field.id} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                   <label htmlFor={field.id} style={{ color: "#cbd5e1", fontSize: "0.85rem", fontWeight: 500 }}>
                     {field.label}
                   </label>
                   <input
                     id={field.id}
                     type={field.type || "text"}
                     placeholder={field.ph}
                     value={formData[field.id as keyof typeof formData]}
                     onChange={handleField(field.id)}
                     style={{
                       width: "100%", padding: "1rem 1.25rem", borderRadius: "0.75rem",
                       background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)",
                       color: "#f8fafc", fontSize: "0.95rem", outline: "none", transition: "all 0.3s ease",
                       boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)"
                     }}
                     onFocus={e => { e.currentTarget.style.borderColor = "rgba(96,165,250,0.8)"; e.currentTarget.style.background = "rgba(59,130,246,0.08)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.2)"; }}
                     onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.boxShadow = "inset 0 2px 4px rgba(0,0,0,0.2)"; }}
                   />
                 </div>
               ))}

               <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                 <label htmlFor="message" style={{ color: "#cbd5e1", fontSize: "0.85rem", fontWeight: 500 }}>
                   문의내용
                 </label>
                 <textarea
                   id="message"
                   rows={5}
                   value={formData.message}
                   onChange={handleField("message")}
                   style={{
                     width: "100%", padding: "1rem 1.25rem", borderRadius: "0.75rem",
                     background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)",
                     color: "#f8fafc", fontSize: "0.95rem", outline: "none", resize: "none", transition: "all 0.3s ease",
                     boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)"
                   }}
                   placeholder="문의 내용을 입력해 주세요..."
                   onFocus={e => { e.currentTarget.style.borderColor = "rgba(96,165,250,0.8)"; e.currentTarget.style.background = "rgba(59,130,246,0.08)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.2)"; }}
                   onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.boxShadow = "inset 0 2px 4px rgba(0,0,0,0.2)"; }}
                 />
               </div>

               {/* 개인정보 동의 */}
               <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                 <input type="checkbox" id="privacy-agree" checked={privacyAgreed} onChange={e => setPrivacyAgreed(e.target.checked)} style={{ width: "1rem", height: "1rem", accentColor: "#3b82f6" }} />
                 <label htmlFor="privacy-agree" style={{ color: "#94a3b8", fontSize: "0.85rem", lineHeight: 1.5 }}>
                   <button
                     type="button"
                     onClick={() => setIsPrivacyOpen(true)}
                     style={{ color: "#60a5fa", textDecoration: "underline", background: "none", border: "none", cursor: "pointer", fontSize: "inherit", padding: 0 }}
                   >
                     개인정보 처리방침
                   </button>에 동의합니다 (필수)
                 </label>
               </div>

               {isPrivacyOpen && typeof document !== "undefined" && createPortal(
                 <div
                   onClick={() => setIsPrivacyOpen(false)}
                   style={{
                     position: "fixed", inset: 0, zIndex: 9999,
                     display: "flex", alignItems: "center", justifyContent: "center",
                     background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)"
                   }}>
                   <div
                     onClick={e => e.stopPropagation()}
                     style={{
                       background: "rgba(15,23,42,0.97)", border: "1px solid rgba(96,165,250,0.2)",
                       borderRadius: "1.25rem", padding: "2rem",
                       maxWidth: "560px", width: "90%", maxHeight: "80vh",
                       display: "flex", flexDirection: "column",
                       boxShadow: "0 25px 50px rgba(0,0,0,0.6)",
                       fontFamily: "'Noto Sans KR', 'HYGraphic', 'Inter', sans-serif"
                     }}>
                     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                       <h4 style={{ color: "#e2e8f0", fontSize: "1.25rem", fontWeight: 600, margin: 0 }}>개인정보 처리방침</h4>
                       <button
                         onClick={() => setIsPrivacyOpen(false)}
                         style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", cursor: "pointer", padding: "0.4rem", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
                         onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "#fff"; }}
                         onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#94a3b8"; }}
                       >
                         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                           <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                         </svg>
                       </button>
                     </div>
                     <div style={{ overflowY: "auto", fontSize: "0.9rem", color: "#94a3b8", lineHeight: 1.7, paddingRight: "0.5rem" }}>
                       <p style={{ marginTop: 0 }}>CLARUS-N은 고객님의 소중한 개인정보를 보호하기 위해 최선을 다하고 있습니다.</p>

                       <h5 style={{ color: "#cbd5e1", marginBottom: "0.5rem", fontSize: "0.95rem" }}>1. 수집하는 개인정보 항목</h5>
                       <p style={{ marginBottom: "1.25rem" }}>이름, 지역, 기관명/병원명, 직함, 이메일 주소, 연락처, 문의내용</p>

                       <h5 style={{ color: "#cbd5e1", marginBottom: "0.5rem", fontSize: "0.95rem" }}>2. 수집 및 이용목적</h5>
                       <p style={{ marginBottom: "1.25rem" }}>서비스 이용에 따른 본인확인, 원활한 의사소통 경로 확보, 최신 정보 안내 및 문의사항 응대</p>

                       <h5 style={{ color: "#cbd5e1", marginBottom: "0.5rem", fontSize: "0.95rem" }}>3. 보유 및 이용기간</h5>
                       <p style={{ marginBottom: "1.25rem" }}>수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. (단, 관련 법령의 규정에 의하여 보존할 필요가 있는 경우 해당 기간 동안 보관)</p>

                       <p style={{ marginBottom: 0 }}>위와 같은 개인정보 수집 및 이용에 대하여 동의를 거부할 권리가 있으며, 거부 시 문의 서비스 이용이 제한될 수 있습니다.</p>
                     </div>
                     <button
                       onClick={() => { setPrivacyAgreed(true); setIsPrivacyOpen(false); }}
                       style={{
                         marginTop: "2rem",
                         padding: "1.1rem",
                         borderRadius: "0.875rem",
                         background: "rgba(59,130,246,0.15)",
                         border: "1px solid rgba(96,165,250,0.3)",
                         color: "#93c5fd",
                         fontSize: "1rem",
                         fontWeight: 600,
                         cursor: "pointer",
                         transition: "all 0.2s"
                       }}
                       onMouseEnter={e => { e.currentTarget.style.background = "rgba(59,130,246,0.25)"; e.currentTarget.style.borderColor = "rgba(96,165,250,0.5)"; }}
                       onMouseLeave={e => { e.currentTarget.style.background = "rgba(59,130,246,0.15)"; e.currentTarget.style.borderColor = "rgba(96,165,250,0.3)"; }}
                     >
                       확인했습니다
                     </button>
                   </div>
                 </div>,
                 document.body
               )}

               {submitState === "success" && (
                 <div style={{ padding: "1rem", borderRadius: "0.75rem", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", color: "#86efac", fontSize: "0.95rem", textAlign: "center" }}>
                   문의가 성공적으로 전송되었습니다. 빠른 시일 내에 연락드리겠습니다.
                 </div>
               )}
               {submitState === "error" && (
                 <div style={{ padding: "1rem", borderRadius: "0.75rem", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5", fontSize: "0.95rem", textAlign: "center" }}>
                   전송에 실패했습니다. 잠시 후 다시 시도해주세요.
                 </div>
               )}

               {/* Submit Button */}
               <button
                 type="submit"
                 disabled={submitState === "loading"}
                 style={{
                   marginTop: "1rem", width: "100%", padding: "1.1rem", borderRadius: "0.75rem",
                   background: submitState === "loading"
                     ? "rgba(59,130,246,0.4)"
                     : "linear-gradient(135deg, rgba(59,130,246,0.8) 0%, rgba(37,99,235,0.9) 100%)",
                   border: "1px solid rgba(96,165,250,0.5)",
                   color: "white", fontSize: "1.05rem", fontWeight: 600,
                   cursor: submitState === "loading" ? "not-allowed" : "pointer",
                   letterSpacing: "0.05em",
                   boxShadow: "0 4px 15px rgba(37,99,235,0.3)", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                 }}
                 onMouseEnter={e => { if (submitState !== "loading") { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 25px rgba(37,99,235,0.5)"; } }}
                 onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 15px rgba(37,99,235,0.3)"; }}
               >
                 {submitState === "loading" ? "전송 중..." : "제출하기"}
               </button>
             </form>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   메인 페이지
───────────────────────────────────────────── */
const NAV_SECTIONS = ["about", "background", "performance", "test-request", "contact"] as const;
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
        { root: container, threshold: 0.15 }
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

  const introVideoRef = useRef<HTMLVideoElement>(null);
  const hasTriggeredTransition = useRef(false);
  const introTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => { introTimers.current.forEach(clearTimeout); };
  }, []);

  // 인트로 종료 프로세스 (2초 대기 후 페이드 아웃)
  const startIntroTransition = useCallback(() => {
    if (hasTriggeredTransition.current) return;
    hasTriggeredTransition.current = true;

    const video = introVideoRef.current;
    if (video) video.pause();

    const t1 = setTimeout(() => {
      setIsIntroEnding(true);
      const t2 = setTimeout(() => setShowIntro(false), 1200);
      introTimers.current.push(t2);
    }, 2000);
    introTimers.current.push(t1);
  }, []);

  // 즉시 종료 (Skip 버튼용)
  const handleSkipIntro = useCallback(() => {
    setIsIntroEnding(true);
    const t = setTimeout(() => setShowIntro(false), 1200);
    introTimers.current.push(t);
  }, []);

  // 비디오 타임 업데이트 핸들러
  const handleTimeUpdate = () => {
    const video = introVideoRef.current;
    if (!video || hasTriggeredTransition.current) return;

    // 8초 도달 시 트랜지션 시작
    if (video.currentTime >= 8) {
      startIntroTransition();
    }
  };


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
            ref={introVideoRef}
            src="/intro_new.mp4"
            autoPlay
            muted
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onEnded={startIntroTransition}
            onError={handleSkipIntro}
            onCanPlayThrough={() => {
              // 재생 시작 실패 시 fallback
              introVideoRef.current?.play().catch(handleSkipIntro);
            }}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
          />
          {/* Skip 버튼 */}
          <button
            onClick={handleSkipIntro}
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
          <div className="cn-content-padding" style={{ paddingLeft: "7rem", paddingRight: "4rem" }}>
            <AboutSection />
            <AboutStrengthsSection />
            <BackgroundSection />
            <PerformanceSection pageIndex={performancePageIndex} setPageIndex={setPerformancePageIndex} />
            <TestRequestSection />
            <ContactSection />
            <footer style={{
              padding: "3rem 0 4rem 0",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              color: "rgba(148, 163, 184, 0.6)",
              fontSize: "0.85rem",
              fontFamily: "'Inter', sans-serif",
              lineHeight: "1.8",
              letterSpacing: "0.02em",
            }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {/* 상단: 회사 기본 정보 (가로 배열) */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.8rem", alignItems: "center" }}>
                  <span>대표자: 김시온</span>
                  <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
                  <span>사업자등록번호: 811-87-03349</span>
                  <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
                  <span>연락처: +82-2-****-****</span>
                  <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
                  <span>이메일: clarusnai@gmail.com</span>
                </div>
                {/* 중단: 주소 */}
                <div>
                  <span>주소: 서울특별시 금천구 가산디지털1로 168, A동 10층 1012호 (가산동, 우림라이온스밸리)</span>
                </div>
              </div>
              {/* 하단: 카피라이트 */}
              <div style={{ 
                marginTop: "2rem", 
                color: "rgba(148, 163, 184, 0.4)", 
                fontWeight: 500,
                fontSize: "0.8rem",
              }}>
                Copyright 2026. CLARUS-N Co., Ltd. All rights reserved.
              </div>
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

function ClinicalLegend({ activeVideo }: { activeVideo: string | null }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!activeVideo || (!activeVideo.includes('territory') && !activeVideo.includes('onset') && !activeVideo.includes('KakaoTalk'))) {
    return null;
  }

  let items: { label: string, color: string }[] = [];
  let title = "Legend";

  if (activeVideo === "/videos/5. infarction territory.mp4") {
    title = "Infarction Territory";
    items = [
      { label: "ACA", color: "#d946ef" },
      { label: "MCA", color: "#22c55e" },
      { label: "Lenticulostriatal A.", color: "#2dd4bf" },
      { label: "Ant. choroidal A.", color: "#60a5fa" },
      { label: "PCA", color: "#fb923c" },
      { label: "BA & VA", color: "#a855f7" },
    ];
  } else if (activeVideo === "/videos/KakaoTalk_20260406_122852533.mp4") {
    title = "Onset Stage";
    items = [
      { label: "Acute stage", color: "#ef4444" },
      { label: "Subacute stage", color: "#f97316" },
      { label: "Chronic stage", color: "#eab308" },
    ];
  }

  return (
    <>
      {/* 둥근 형태가 아닌, 좀 더 명확한 레이어 아이콘과 Legend 텍스트를 가진 필(Pill) 버튼 */}
      <div 
        onClick={(e) => { e.stopPropagation(); setIsOpen(true); }}
        style={{
          position: "absolute",
          bottom: "1.5rem",
          left: "1.5rem",
          zIndex: 39,
          padding: "0 1.2rem",
          height: "40px",
          background: "rgba(15, 23, 42, 0.85)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          backdropFilter: "blur(8px)",
          boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
          opacity: isOpen ? 0 : 1, // 열려있으면 숨김
          pointerEvents: isOpen ? "none" : "auto",
          transform: isOpen ? "scale(0.8) translateY(10px)" : "scale(1) translateY(0)",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(30, 41, 59, 0.9)"}
        onMouseLeave={e => e.currentTarget.style.background = "rgba(15, 23, 42, 0.85)"}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* 레이어(Layers) 아이콘 */}
          <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
          <polyline points="2 12 12 17 22 12"></polyline>
          <polyline points="2 17 12 22 22 17"></polyline>
        </svg>
        <span style={{ 
          marginLeft: "8px", 
          fontSize: "0.8rem", 
          fontWeight: 600, 
          color: "#f8fafc", 
          letterSpacing: "0.05em",
          fontFamily: "'Inter', sans-serif"
        }}>
          Legend
        </span>
      </div>

      {/* 펼쳐지는 범례 패널 */}
      <div 
        style={{
          position: "absolute",
          bottom: "1.5rem",
          left: "1.5rem",
          zIndex: 40,
          width: "220px",
          background: "rgba(15, 23, 42, 0.85)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          borderRadius: "8px", // 다시 둥글게 원복
          overflow: "hidden",
          boxShadow: isOpen ? "0 10px 30px rgba(0,0,0,0.6)" : "none",
          cursor: "default",
          backdropFilter: "blur(8px)",
          transformOrigin: "bottom left",
          transform: isOpen ? "scale(1)" : "scale(0.5)", // 크기를 줄이면서 완전히 숨김
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        onClick={(e) => e.stopPropagation()} 
      >
      {/* Header / Toggle Button */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.6rem 0.8rem",
          background: "rgba(255, 255, 255, 0.05)",
          cursor: "pointer",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"}
        onMouseLeave={e => e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)"}
      >
        <span style={{ 
          color: "#e2e8f0", 
          fontWeight: 600, 
          fontSize: "0.85rem", 
          letterSpacing: "0.05em",
          whiteSpace: "nowrap"
        }}>
          {title}
        </span>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          width: "24px",
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* 닫음 의미 화살표: 아래쪽 */}
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>

      {/* Expanded Content (항상 그려두되 통째로 슬라이드 됨) */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        pointerEvents: isOpen ? "auto" : "none"
      }}>
        {items.map((item, i) => (
          <div key={i} style={{ 
            display: "flex", 
            alignItems: "center", 
            height: "44px", // 사진처럼 큼직하고 시원하게 높이 증가
            borderBottom: i === items.length - 1 ? "none" : "1px solid rgba(255, 255, 255, 0.05)",
            background: i % 2 === 0 ? "transparent" : "rgba(255, 255, 255, 0.02)",
          }}>
            <div style={{ 
              width: "48px", // 색상 박스를 직사각형에 가깝게 넓혀서 확 띄게 만듦
              height: "100%", 
              background: item.color,
              flexShrink: 0,
              borderRight: "1px solid rgba(255, 255, 255, 0.15)"
            }} />
            <span style={{ 
              paddingLeft: "16px", 
              color: "#f8fafc", 
              fontSize: "0.85rem", 
              fontWeight: 600, // 글씨도 살짝 더 또렷하게
              fontFamily: "'Inter', sans-serif",
              whiteSpace: "nowrap"
            }} >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
