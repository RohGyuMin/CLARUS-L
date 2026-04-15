"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import ClarusSidebar from "@/components/ClarusSidebar";
import ClarusCursor from "@/components/ClarusCursor";
import ClarusHeroCanvas from "@/components/ClarusHeroCanvas";
import LegalModal from "@/components/LegalModal";
import NeuralSynapseVisual from "@/components/NeuralSynapseVisual";
import PdfModal from "@/components/PdfModal";


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
      id="hero"
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
          left: "min(7rem, 9vw)",
          zIndex: 5,
          pointerEvents: "none",
        }}
      >
        {/* CLARUS-N */}
        <h1
          style={{
            margin: 0,
            fontSize: "clamp(3.2rem, 9vw, 7.4rem)",
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
            fontFamily: "'HYGraphic', sans-serif",
            fontSize: "0.85em",
            color: "#a855f7",
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
  className,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className={className}
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
        width: "86%",
        maxWidth: "980px",
        height: "1px",
        background: "linear-gradient(to right, rgba(96,165,250,0.4), transparent)",
        margin: "1.5rem 0",
      }}
    />
  );
}

type LegalModalKey = "privacy" | "terms" | "email-refusal";

type FooterProps = {
  onOpenEmailRefusal: () => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  isCompactLayout: boolean;
};

type ContactSectionProps = {
  onOpenPrivacy: () => void;
  privacyAgreed: boolean;
  setPrivacyAgreed: React.Dispatch<React.SetStateAction<boolean>>;
  isCompactLayout: boolean;
};

const sharedCardTitleStyle: React.CSSProperties = {
  fontSize: "1.15rem",
  fontWeight: 600,
  color: "#e2e8f0",
  lineHeight: 1.3,
  letterSpacing: "-0.01em",
};

function AboutSection({ isCompactLayout }: { isCompactLayout: boolean }) {
  return (
    <section
      id="about"
      style={{
        minHeight: isCompactLayout ? "auto" : "100vh",
        display: "flex",
        alignItems: "center",
        paddingTop: "2.5rem",
      }}
    >
      <div style={{ width: "100%" }}>
        {/* 섹션 라벨을 상단으로 분리하여 카드+사진 뭉치와 분리 */}
        <RevealSection style={{ marginBottom: "1.25rem" }}>
          <SectionLabel>About</SectionLabel>
        </RevealSection>

        <div className="cn-section-flex" style={{ display: "flex", width: "100%", alignItems: "stretch", gap: "2rem" }}>

          {/* 좌측: 카드 두 개 */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* CLARUS-N 의미 카드 */}
            <RevealSection style={{ transitionDelay: "0.1s", flex: 1 }}>
              <div style={{
                height: "100%",
                padding: "1.6rem 2rem",
                borderRadius: "1.2rem",
                background: "rgba(15,23,42,0.6)",
                border: "1px solid rgba(168,85,247,0.18)",
                backdropFilter: "blur(16px)",
                display: "flex",
                flexDirection: "column",
                gap: "0.9rem",
                boxShadow: "0 0 40px rgba(168,85,247,0.05)",
              }}>
                {/* 타이틀 */}
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", borderBottom: "1px solid rgba(255,255,255,0.07)", paddingBottom: "0.85rem", flexWrap: "nowrap" }}>
                  <span style={{ fontSize: "clamp(1.8rem, 7vw, 3.12rem)", fontWeight: 800, letterSpacing: "0.12em", color: "#ffffff", fontFamily: "var(--font-bernhard)" }}>CLARUS</span>
                  <span style={{ fontSize: "clamp(1.8rem, 7vw, 3.12rem)", fontWeight: 800, fontFamily: "HYGraphic, sans-serif", color: "#a855f7", margin: "0 0.02em" }}>-</span>
                  <span style={{ fontSize: "clamp(1.8rem, 7vw, 3.12rem)", fontWeight: 800, letterSpacing: "0.12em", color: "#a855f7", fontFamily: "var(--font-bernhard)" }}>N</span>
                </div>

                {/* 의미 */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  <div style={{ fontSize: "1.08rem", color: "#cbd5e1", lineHeight: 1.7 }}>
                    <span style={{ marginRight: "0.4rem", fontSize: "1.13rem", fontStyle: "italic", fontWeight: 600, color: "#e2e8f0", letterSpacing: "0.01em" }}>Clārus :</span>
                    명확한, 분명한
                  </div>
                  <div style={{ fontSize: "1.05rem", color: "#94a3b8", lineHeight: 1.65 }}>
                    Comes from Latin, and its meaning includes:
                  </div>
                  <div style={{ fontSize: "1.05rem", color: "#94a3b8", lineHeight: 1.7 }}>
                    Clear, Bright, Distinguished, Easily understood
                  </div>
                  <div style={{ fontSize: "1.05rem", color: "#64748b", lineHeight: 1.75 }}>
                    "Clarus" reflects the goal of making complex brain imaging<br />clear, accurate, and accessible.
                  </div>
                </div>

                {/* -N 설명 */}
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "0.45rem",
                  background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.25)",
                  borderRadius: "0.6rem", padding: "0.5rem 0.9rem", alignSelf: "flex-start",
                  marginTop: "auto"
                }}>
                  <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "#a855f7" }}>-N</span>
                  <span style={{ fontSize: "0.93rem", color: "#94a3b8" }}>: "hyphen N" means</span>
                  <span style={{ fontSize: "1.08rem", fontWeight: 700, color: "#ffffff" }}>AI (<span style={{ color: "#a855f7", position: "relative", display: "inline-block" }}>N<span style={{ position: "absolute", left: "0", right: "0", top: "52%", height: "2px", background: "#a855f7", transform: "translateY(-50%)", borderRadius: "1px" }} /></span>)</span>
                </div>
              </div>
            </RevealSection>

            {/* CEO 카드 */}
            <RevealSection style={{ transitionDelay: "0.2s", flex: 1 }}>
              <div style={{
                height: "100%",
                padding: "1.6rem 2rem",
                  borderRadius: "1.2rem",
                  background: "rgba(15,23,42,0.6)",
                  border: "1px solid rgba(96,165,250,0.14)",
                  backdropFilter: "blur(16px)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.9rem",
                  boxShadow: "0 0 40px rgba(96,165,250,0.04)",
                }}>
                  {/* CEO 헤더 */}
                  <div style={{ display: "flex", alignItems: "center", gap: "1.6rem", borderBottom: "1px solid rgba(255,255,255,0.07)", paddingBottom: "1rem" }}>
                    <span style={{
                      fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.22em",
                      color: "#60a5fa", background: "rgba(96,165,250,0.12)",
                      border: "1px solid rgba(96,165,250,0.4)",
                      padding: "0.35rem 0.85rem", borderRadius: "0.4rem",
                      textShadow: "0 0 10px rgba(96,165,250,0.5)",
                      flexShrink: 0,
                      display: "inline-block",
                      transform: "scale(1.18)",
                      transformOrigin: "left center",
                    }}>CEO</span>
                    <div>
                      <div style={{ fontSize: "2rem", fontWeight: 700, color: "#e2e8f0", lineHeight: 1.2, fontFamily: "HYGraphic, sans-serif" }}>김시온</div>
                      <div style={{ fontSize: "1.15rem", lineHeight: 1.55, color: "#64748b", fontWeight: 400, marginTop: "0.1rem", fontFamily: "'ITC Eras Medium', 'Arial', sans-serif", letterSpacing: "0.01em" }}>Sion Kim, M.D.</div>
                    </div>
                  </div>

                  {/* Board-Certified */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                    {[
                      { label: "Neurosurgeon", color: "#a855f7" },
                      { label: "Critical Care Specialist", color: "#60a5fa" },
                      { label: "Specialist in Endovascular Neurosurgery", color: "#34d399" },
                      { label: "Specialist by the Korean Society of Cerebrovascular Surgery", color: "#f59e0b" },
                    ].map(item => (
                      <div key={item.label} style={{ display: "flex", alignItems: "flex-start", gap: "0.7rem" }}>
                        <span style={{ width: "2px", minHeight: "1.1rem", background: item.color, borderRadius: "1px", flexShrink: 0, marginTop: "0.2rem", opacity: 0.7 }} />
                        <span style={{ color: "#94a3b8", fontSize: "1.15rem", lineHeight: 1.7 }}>{item.label}</span>
                      </div>
                    ))}
                </div>
              </div>
            </RevealSection>
          </div>

          {/* 우측: CEO 사진 흑백 */}
          <RevealSection
            className="cn-about-photo-panel"
            style={{
              flexShrink: 0,
              transitionDelay: "0.15s",
              display: "flex",
              flexDirection: "column",
              position: "relative",
              width: isCompactLayout ? "100%" : undefined,
              alignSelf: isCompactLayout ? "center" : undefined,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: isCompactLayout ? "-1rem" : "-1.75rem -2rem",
                opacity: 0.35,
                pointerEvents: "none",
                filter: "blur(0.2px)",
              }}
            >
              <NeuralSynapseVisual mode="calm" color="147, 197, 253" opacity={0.28} />
            </div>
            <div
              style={{
                transform: isCompactLayout ? "none" : "translateX(5mm)",
                position: "relative",
                zIndex: 1,
                width: isCompactLayout ? "100%" : undefined,
                display: "flex",
                justifyContent: isCompactLayout ? "center" : "flex-start",
              }}
            >
              <div style={{
              position: "relative",
              borderRadius: "1.2rem",
              overflow: "hidden",
              width: isCompactLayout ? "min(100%, 24rem)" : "460px",
              flex: 1, // 카드 전체 높이에 맞춰 확장
              minHeight: isCompactLayout ? "clamp(22rem, 78vw, 34rem)" : "600px",
              boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
              }}>
                <img
                  src="/ceo-photo.png"
                  alt="CEO Sion Kim"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "50% 24%",
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
            </div>
          </RevealSection>

        </div>
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
    <section id="about-strengths" style={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <div className="cn-section-flex" style={{ display: "flex", width: "100%", alignItems: "center", gap: "5rem" }}>
        <div style={{ flex: 1 }}>
          <RevealSection>
            <SectionLabel>Strengths</SectionLabel>
            <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 700, color: "#e2e8f0", marginBottom: "0.75rem", lineHeight: 1.2 }}>
              Distinctive Strengths of <span style={{ color: "#ffffff", fontFamily: "var(--font-bernhard)" }}>CLARUS</span><span style={{ color: "#a855f7", fontFamily: "'HYGraphic', sans-serif" }}>-N</span>
            </h2>
            <Divider />
          </RevealSection>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
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
                      borderRadius: "1rem",
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
                    width: "6px",
                      flexShrink: 0,
                      background: active ? item.color : `${item.color}40`,
                      transition: "background 0.3s ease",
                      borderRadius: "1rem 0 0 1rem",
                    }} />

                    {/* 번호 배지 */}
                    <div style={{
                      flexShrink: 0,
                      width: "3rem",
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "center",
                      paddingTop: "1.4rem",
                    }}>
                      <span style={{
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        color: active ? item.color : "rgba(255,255,255,0.2)",
                        transition: "color 0.3s ease",
                        letterSpacing: "0.02em",
                      }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {/* 본문 */}
                    <div style={{ flex: 1, padding: "1.3rem 1.4rem 1.3rem 0.25rem" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
                        <div style={sharedCardTitleStyle}>
                          {item.title}
                        </div>
                      </div>

                      {/* 서브타이틀 — hover/pinned 시 펼침 */}
                      <div style={{
                        maxHeight: active ? "60px" : "0px",
                        opacity: active ? 1 : 0,
                        overflow: "hidden",
                        transition: "max-height 0.35s ease, opacity 0.3s ease",
                        marginTop: active ? "0.4rem" : "0",
                        paddingLeft: active ? "0.9rem" : "0",
                        fontSize: "1.05rem",
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
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [pinnedCard, setPinnedCard] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const items: {
    color: string;
    title: React.ReactNode;
    subtitle: string;
    detail: string;
    image?: string;
  }[] = [
    {
      color: "#facc15",
      title: <><span style={{ color: "#facc15" }}>Ultra-Aged Society</span> in 2025</>,
      subtitle: "2025년 초고령 사회 진입",
      detail: "65세이상의 노인 인구가 전체 인구의 20%이상을 차지",
      image: "/bg-elderly.png",
    },
    {
      color: "#FFA47A",
      title: <><span style={{ color: "#FFA47A" }}>A Surge in Neurological Diseases</span> Due to an Ultra-Aged Society</>,
      subtitle: "초고령화 사회로 인한 신경계 질환의 급증",
      detail: "뇌졸중, 뇌위축, 치매와 같은 뇌질환 환자의 기하급수적 증가",
      image: "/bg-disease-surge.png",
    },
    {
      color: "#a78bfa",
      title: <><span style={{ color: "#a78bfa" }}>Scarcity</span> of Neurological Specialists</>,
      subtitle: "신경계 전문 인력의 희소성",
      detail: "신경과·신경외과 전문의는 전체 의사의 5.7%에 불과",
      image: "/bg-neuro-rare.png",
    },
    {
      color: "#60a5fa",
      title: <><span style={{ color: "#60a5fa" }}>Complexity</span> of Neuroimaging Interpretation</>,
      subtitle: "MRI, CT 영상 해석의 난해함",
      detail: "복잡한 영상 구조와 미세한 병변으로 판독 난이도가 매우 높음",
    },
    {
      color: "#34d399",
      title: <>The <span style={{ color: "#34d399" }}>Urgency and Fatality</span> of Neurological Diseases</>,
      subtitle: "신경계 질환의 긴급성과 직결되는 치명성",
      detail: "뇌졸중은 단일질환 사망률 2위",
      image: "/bg-neuro-urgent.png",
    },
    {
      color: "#f87171",
      title: <><span style={{ color: "#f87171" }}>Regional Imbalance</span> in the Distribution of General Hospitals</>,
      subtitle: "병원 접근성의 지역별 불균형",
      detail: "강원·제주지역은 3차 종합병원 진료가 매우 어려움",
      image: "/bg-hospital-map.png",
    },
  ];

  const activeIndex = isMobile ? (pinnedCard ?? 0) : (hoveredCard ?? pinnedCard);

  return (
    <section id="background" style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: isMobile ? "2rem 1.25rem" : undefined }}>
      <div style={{ width: "100%" }}>
        <RevealSection>
          <SectionLabel>Background</SectionLabel>
          <h2 style={{ 
            fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", 
            fontWeight: 700, 
            color: "#e2e8f0", 
            marginBottom: "0.75rem", 
            lineHeight: 1.2,
            maxWidth: "1440px",
            margin: "0 auto 0.75rem"
          }}>
            Research Context and Motivation
          </h2>
          <Divider />

        </RevealSection>

        <RevealSection style={{ transitionDelay: "0.1s" }}>
          <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? "1.5rem" : "3.5rem", maxWidth: "1440px", alignItems: "center", margin: "0 auto" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem", flex: 1, minWidth: 0 }}>
            {items.map((item, i) => {
              const isActive = activeIndex === i;
              const isPinned = pinnedCard === i;
              return (
                <div
                  key={i}
                  onMouseEnter={() => setHoveredCard(i)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => setPinnedCard(isPinned ? null : i)}
                  style={{
                    display: "flex",
                    alignItems: "stretch",
                    height: isActive ? "auto" : "5.5rem",
                    minHeight: "5.5rem",
                    borderRadius: "0.75rem",
                    overflow: "hidden",
                    background: isActive ? `${item.color}10` : "rgba(15,23,42,0.55)",
                    border: `1px solid ${isActive ? `${item.color}35` : "rgba(255,255,255,0.06)"}`,
                    backdropFilter: "blur(12px)",
                    cursor: item.image ? "pointer" : "default",
                    transition: "all 0.22s ease",
                    transform: isActive ? "translateX(4px)" : "translateX(0)",
                  }}
                >
                  {/* 왼쪽 컬러 바 */}
                  <div style={{
                    width: "6px",
                    flexShrink: 0,
                    background: isActive ? item.color : `${item.color}50`,
                    transition: "background 0.22s ease",
                  }} />
                  {/* 번호 */}
                  <div style={{
                    flexShrink: 0,
                    width: "3rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: isActive ? item.color : "rgba(255,255,255,0.2)",
                    letterSpacing: "0.02em",
                    transition: "color 0.22s ease",
                  }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  {/* 본문 */}
                  <div style={{ flex: 1, padding: "0.85rem 1.2rem 0.85rem 0", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    {/* 영문 제목 */}
                    <div style={{
                      ...sharedCardTitleStyle,
                      fontWeight: 600,
                      whiteSpace: "normal",
                      wordBreak: "keep-all",
                      marginBottom: "0.3rem",
                      textShadow: isActive ? `0 0 16px ${item.color}44` : "none",
                      transition: "all 0.25s ease",
                    }}>
                      {item.title}
                    </div>
                    {/* 한글 부제목 + 상세 설명 - 호버 시에만 표시 */}
                    <div style={{
                      maxHeight: isActive ? "20rem" : "0",
                      opacity: isActive ? 1 : 0,
                      overflow: "hidden",
                      transition: "max-height 0.3s ease, opacity 0.22s ease",
                      marginTop: isActive ? "0.25rem" : "0",
                    }}>
                      <div style={{
                        fontSize: isMobile ? "0.88rem" : "1.15rem",
                        color: "#cbd5e1",
                        lineHeight: 1.6,
                        fontFamily: "'HYGraphic', sans-serif",
                        paddingLeft: "1ch",
                      }}>
                        {item.subtitle}
                      </div>
                      <div style={{
                        marginTop: "0.4rem",
                        fontSize: isMobile ? "0.85rem" : "1.1rem",
                        color: `${item.color}90`,
                        lineHeight: 1.5,
                        fontFamily: "'HYGraphic', sans-serif",
                        fontStyle: "italic",
                        paddingLeft: "1ch",
                      }}>
                        {item.detail}
                      </div>
                      {/* 모바일: 이미지 카드 안에 인라인으로 표시 */}
                      {isMobile && item.image && (
                        <img
                          src={item.image}
                          alt={item.subtitle}
                          style={{
                            display: "block",
                            width: "100%",
                            maxHeight: "120px",
                            objectFit: "cover",
                            borderRadius: "0.5rem",
                            marginTop: "0.7rem",
                            border: `1px solid ${item.color}30`,
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
            {/* 이미지 패널 - PC only */}
            {!isMobile && (
              <div style={{
                width: "600px",
                flexShrink: 0,
                position: "relative",
                minHeight: "420px",
                borderRadius: "1.1rem",
                overflow: "hidden",
                transition: "opacity 0.3s ease, transform 0.3s ease",
                pointerEvents: "none",
              }}>
                <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                  <NeuralSynapseVisual mode="dense" color="96, 165, 250" opacity={0.55} />
                </div>
                {pinnedCard !== null && items[pinnedCard].image && (
                  <img
                    src={items[pinnedCard].image}
                    alt="Background Detail"
                    style={{
                      width: "auto",
                      height: "auto",
                      maxWidth: "95%",
                      maxHeight: "420px",
                      objectFit: "contain",
                      objectPosition: "center",
                      display: "block",
                      margin: "auto",
                      borderRadius: "0.75rem",
                      border: `1px solid ${items[pinnedCard].color}30`,
                      position: "relative",
                      zIndex: 1,
                    }}
                  />
                )}
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
  const [isLegendCollapsed, setIsLegendCollapsed] = useState(false);
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
      videoSrc: "/videos/1-Vessel-3D-cube.mp4",
      theme: "blue",
      details: [
        "#Input: TOF images",
        "#DICE: 0.872",
        "#Analysis time: 6.8sec",
        "#View Manipulation: zoom in, zoom out, rotation, pan"
      ]
    },
    {
      title: "MRA AI for <span style='color: #ef4444'>Aneurysm</span> detection",
      description: "Detects more accurately than a neuro-specialists.",
      videoSrc: "/videos/2-Aneurysm-3D-cube.mp4",
      theme: "blue",
      details: [
        "#Input: TOF images",
        "#Sensitivity: 92.0%",
        "#Specificity: 97.8%",
        "#Analysis time: 20.3sec",
        "#Training data: 3500 cases, 5030 aneurysms",
        "#Overwhelming detection performance"
      ]
    },
    {
      title: "MRA AI for <span style='color: #38bdf8'>Stenosis</span> detection",
      description: "Detects stenosis up to the A2 and M2 segments.",
      videoSrc: "/videos/3-Stenosis-3D-cube.mp4",
      theme: "blue",
      details: [
        "#Input: TOF images",
        "#Sensitivity: 95.8%",
        "#Specificity: 86.4%",
        "#Analysis time: 22.4sec",
        "#Training data: 1722 cases",
        "#Particularly effective for multi-focal stenosis"
      ]
    }
  ];

  const infarctCards: CardData[] = [
    {
      id: "dwi-1",
      title: "DWI AI for Infarcted <span style='color: #c084fc'>Region</span> Detection",
      description: "Accurately identifies even minute infarct lesions",
      videoSrc: "/videos/4-Infarction-region.mp4",
      theme: "purple",
      details: [
        "#Input: DWI images",
        "#Dice: 0.820",
        "#Analysis time: 22.0sec",
        "#Training data: 6002 cases",
        "#Optimized for detecting multiple small infarction"
      ]
    },
    {
      id: "dwi-2",
      title: "DWI AI for Mapping <span style='color: #a3e635'>Vascular territories</span>",
      description: "Mapping the vascular territory that caused the cerebral infarction",
      videoSrc: "/videos/5-infarction-territory.mp4",
      theme: "purple",
      details: [
        "#Input: DWI images",
        "#Dice: 0.820",
        "#Analysis time: 22.0sec",
        "#Training data: 6002 cases",
        "#Six Major Vessel"
      ],
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
      videoSrc: "/videos/6-Infarction-onset-ADC.mp4",
      theme: "purple",
      details: [
        "#Input: ADC images",
        "#Dice: 0.820",
        "#Analysis time: 22.0sec",
        "#Training data: 1919 cases",
        "#Acute, Subacute, Chronic stage"
      ],
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
      description: "CCA-rendered images provide superior visualization compared to MIP",
      videoSrc: "/videos/7-Carotid-3D-cube.mp4",
      theme: "gray",
      details: [
        "#Input: Carotid TOF images",
        "#Dice: 0.916",
        "#Analysis time: 4.5sec"
      ]
    },
    {
      id: "carotid-2",
      title: "MRA AI for <span style='color: #22c55e'>Carotid Stenosis & occlusion</span>",
      description: "Identifies stenotic and occlusive regions.",
      videoSrc: "/videos/8-Carotid-Stenosis-cube.mp4",
      theme: "gray",
      details: [
        "#Input: Carotid TOF images",
        "#Sensitivity: 85.3%",
        "#Specificity: 92.3%",
        "#Analysis time: 7.5sec",
        "#Training data: 622 cases"
      ]
    }
  ];

  const ctCards: CardData[] = [
    {
      id: "ct-1",
      title: "CT AI for <span style='color: #f472b6'>Hemorrhage</span> Detection",
      description: "Robustly identifies subtle hemorrhages that are easy to miss",
      videoSrc: "/videos/9-CT-hemorrhage.mp4",
      theme: "green",
      details: [
        "#Input: Axial CT images",
        "#Dice: 0.928",
        "#Analysis time: 2.9sec",
        "#Training data: 5556 cases"
      ]
    },
    {
      id: "ct-2",
      title: "CTA AI for <span style='color: #facc15'>Vessel</span> Reconstruction",
      description: "Rapid and detailed 3D reconstruction of the cerebral vessels.",
      videoSrc: "/videos/10-CTA-vessel-3D-cube.mp4",
      theme: "green",
      details: [
        "#Input: CTA source images",
        "#Dice: 0.912",
        "#Analysis time: 7.5sec",
        "#Training data: 200 cases",
        "#Highly advanced in bone subtraction for the cavernous segment"
      ]
    }
  ];

  const cardSets = [mraCards, infarctCards, carotidCards, ctCards];
  const activeLegendItems = cardSets.flat().find(c => c.videoSrc === activeVideo)?.legendItems;

  const handleCardClick = (videoSrc: string) => {
    if (activeVideo === videoSrc) {
      setActiveVideo(null);
      setIsPlaying(false);
      setIsLegendCollapsed(false);
    } else {
      setActiveVideo(videoSrc);
      setIsPlaying(false);
      setIsLegendCollapsed(false);
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
            <SectionLabel>Performance</SectionLabel>
            <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 700, color: "#e2e8f0", marginBottom: "0.75rem", lineHeight: 1.2 }}>
              Pipeline Characteristics
            </h2>
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
                left: "-5rem",
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
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                right: "-5rem",
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
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

              {/* 범례: legendItems 있는 영상에서 항상 표시 */}
              {activeLegendItems && activeLegendItems.length > 0 && (
                <div
                  onClick={e => e.stopPropagation()}
                  style={{
                    position: "absolute",
                    bottom: "1rem",
                    left: "1rem",
                    zIndex: 40,
                    background: "rgba(6, 11, 26, 0.82)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "0.65rem",
                    overflow: "hidden",
                    minWidth: "150px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                  }}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsLegendCollapsed(prev => !prev);
                    }}
                    style={{
                      width: "100%",
                      padding: "0.35rem 0.8rem",
                      border: "none",
                      borderBottom: isLegendCollapsed ? "none" : "1px solid rgba(255,255,255,0.07)",
                      background: "rgba(255,255,255,0.04)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                    }}
                    aria-label={isLegendCollapsed ? "Expand legend" : "Collapse legend"}
                  >
                    <span style={{
                      color: "rgba(148,163,184,0.7)",
                      fontSize: "0.67rem",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      fontFamily: "'Inter', sans-serif",
                      textTransform: "uppercase",
                    }}>
                      Legend
                    </span>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="rgba(148,163,184,0.85)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ transform: isLegendCollapsed ? "rotate(-90deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                  <div
                    aria-hidden={isLegendCollapsed}
                    style={{
                      maxHeight: isLegendCollapsed
                        ? "0px"
                        : `${Math.max(96, activeLegendItems.length * 30 + 18)}px`,
                      opacity: isLegendCollapsed ? 0 : 1,
                      overflow: "hidden",
                      pointerEvents: isLegendCollapsed ? "none" : "auto",
                      transition: "max-height 0.28s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease",
                    }}
                  >
                    <div
                      style={{
                        padding: isLegendCollapsed ? "0 0.8rem" : "0.5rem 0.8rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.3rem",
                        transform: isLegendCollapsed ? "translateY(-4px)" : "translateY(0)",
                        transition: "padding 0.28s cubic-bezier(0.4, 0, 0.2, 1), transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    >
                      {activeLegendItems.map(item => (
                        <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <div style={{
                            width: "9px", height: "9px",
                            borderRadius: "2px",
                            background: item.color,
                            flexShrink: 0,
                            boxShadow: `0 0 6px ${item.color}88`,
                          }} />
                          <span style={{
                            color: "rgba(226,232,240,0.88)",
                            fontSize: "0.73rem",
                            fontFamily: "'Inter', sans-serif",
                            whiteSpace: "nowrap",
                          }}>
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
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

      {/* 호버 시 나타나는 상세 정보 - Key-Value 그리드 */}
      <div style={{
        maxHeight: highlighted ? "200px" : "0",
        opacity: highlighted ? 1 : 0,
        overflow: "hidden",
        transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        marginTop: highlighted ? "1.25rem" : "0",
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0.5rem 1.5rem",
          borderTop: `1px solid ${themeColor.replace('0.8', '0.12')}`,
          paddingTop: "1rem",
        }}>
          {card.details.map((detailStr: string, idx: number) => {
            const clean = detailStr.replace(/^#/, '').trim();
            const colonIdx = clean.indexOf(':');
            const label = colonIdx !== -1 ? clean.slice(0, colonIdx).trim() : clean;
            const value = colonIdx !== -1 ? clean.slice(colonIdx + 1).trim() : '';
            const isFullWidth = !value || clean.length > 35;
            return (
              <div key={idx} style={{
                gridColumn: isFullWidth ? "1 / -1" : "auto",
                display: "flex",
                flexDirection: "column",
                gap: "0.15rem",
              }}>
                <span style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: themeColor,
                  opacity: 0.7,
                  fontFamily: "'Inter', sans-serif",
                }}>
                  {label}
                </span>
                {value && (
                  <span style={{
                    fontSize: "1.05rem",
                    fontWeight: 500,
                    color: "rgba(226,232,240,0.9)",
                    fontFamily: "'Inter', sans-serif",
                    lineHeight: 1.4,
                  }}>
                    {value}
                  </span>
                )}
              </div>
            );
          })}
        </div>
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
  const [isUploadHovered, setIsUploadHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [emailValue, setEmailValue] = useState("");
  const [fileType, setFileType] = useState("");
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [requestCount, setRequestCount] = useState(231);
  const [selectedPdf, setSelectedPdf] = useState<"analysis" | "dicom" | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | File[]) => {
    const arr = Array.from(files);
    const oversized = arr.filter(f => f.size > 25 * 1024 * 1024);
    if (oversized.length > 0) {
      alert(`파일 크기는 25MB 이하여야 합니다.\n초과 파일: ${oversized.map(f => f.name).join(", ")}`);
      return;
    }
    setSelectedFiles(prev => [...prev, ...arr]);
  };

  useEffect(() => {
    let cancelled = false;

    const loadRequestCount = async () => {
      try {
        const res = await fetch("/api/analysis-count", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { count?: unknown };
        if (!cancelled && typeof data.count === "number" && Number.isFinite(data.count)) {
          setRequestCount(Math.floor(data.count));
        }
      } catch {
        // Keep fallback state value when request fails.
      }
    };

    loadRequestCount();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleAnalysisSubmit = async () => {
    if (selectedFiles.length === 0) { alert("파일을 선택해주세요."); return; }
    if (!emailValue) { alert("이메일을 입력해주세요."); return; }
    if (!fileType) { alert("파일 내용을 선택해주세요."); return; }
    setSubmitState("loading");
    try {
      const form = new FormData();
      selectedFiles.forEach(f => form.append("file", f));
      form.append("email", emailValue);
      form.append("fileType", fileType);
      const res = await fetch("/api/analysis", { method: "POST", body: form });
      const data = (await res.json()) as { count?: unknown };
      if (!res.ok) throw new Error();
      setSubmitState("success");
      if (typeof data.count === "number" && Number.isFinite(data.count)) {
        setRequestCount(Math.floor(data.count));
      } else {
        setRequestCount(prev => prev + 1);
      }
      setSelectedFiles([]);
      setEmailValue("");
      setFileType("");
    } catch {
      setSubmitState("error");
    }
  };
  
  const infoPoints = [
    "DICOM 파일 형식 지원 (최대 25MB)",
    "전송된 파일은 NIfTI 파일형식으로 모두 전환됩니다",
    "NIfTI 파일형식의 특성상 모든 환자개인정보가 자동 삭제됩니다",
    "전송된 파일도 NIfTI 전환 후 모두 삭제됩니다",
    "분석된 영상은 이메일로 24시간 이내로 보내드립니다",
    "빠른 영상분석이 필요시에는 파일 업로드 후 contact의 연락처로 문의 바랍니다."
  ];

  return (
    <section id="test-request" style={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <div className="cn-section-flex" style={{ display: "flex", width: "100%", alignItems: "center", gap: "5rem" }}>
        <div style={{ flex: 1, width: "100%", maxWidth: "42rem" }}>
          <RevealSection>
            <SectionLabel>Research Analysis Request</SectionLabel>
            <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 700, color: "#e2e8f0", lineHeight: 1.2, marginBottom: "1.5rem" }}>
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
              padding: "1rem",
              marginBottom: "1rem",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            }}>
              {/* 숨겨진 파일 입력 */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                style={{ display: "none" }}
                onChange={e => { if (e.target.files) handleFileSelect(e.target.files); }}
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
                  if (e.dataTransfer.files) handleFileSelect(e.dataTransfer.files);
                }}
                style={{
                  background: isDragging ? "rgba(96,165,250,0.12)" : isUploadHovered ? "rgba(96,165,250,0.05)" : "rgba(255,255,255,0.01)",
                  border: `1px ${isDragging || isUploadHovered ? 'solid' : 'dashed'} ${isDragging ? 'rgba(96,165,250,0.8)' : isUploadHovered ? 'rgba(96,165,250,0.5)' : 'rgba(96,165,250,0.25)'}`,
                  borderRadius: "1rem",
                  padding: "1rem 1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  marginBottom: "1rem",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                {selectedFiles.length > 0 ? (
                  <>
                    <div style={{ color: "#34d399", marginBottom: "0.75rem" }}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <polyline points="9 15 11 17 15 13" />
                      </svg>
                    </div>
                    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                      {selectedFiles.map((f, idx) => (
                        <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
                          <p style={{ color: "#e2e8f0", fontSize: "0.9rem", fontWeight: 600, wordBreak: "break-all", textAlign: "left" }}>
                            {f.name} <span style={{ color: "#64748b", fontWeight: 400 }}>({(f.size / 1024 / 1024).toFixed(2)} MB)</span>
                          </p>
                          <button
                            onClick={e => { e.stopPropagation(); setSelectedFiles(prev => prev.filter((_, i) => i !== idx)); }}
                            style={{ flexShrink: 0, fontSize: "0.75rem", color: "#f87171", background: "none", border: "none", cursor: "pointer" }}
                          >✕</button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); setSelectedFiles([]); }}
                      style={{ marginTop: "0.75rem", fontSize: "0.8rem", color: "#f87171", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
                    >
                      전체 제거
                    </button>
                  </>
                ) : (
                  <>
                    <div style={{
                      color: isDragging ? "#60a5fa" : "#60a5fa",
                      marginBottom: "0.6rem",
                      transform: isUploadHovered ? "translateY(-5px)" : "translateY(0)",
                      transition: "transform 0.4s ease"
                    }}>
                      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
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
              <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                {infoPoints.map((point, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
                    <span style={{
                      color: "#60a5fa",
                      fontSize: "0.9rem",
                      lineHeight: "1.5rem",
                      fontWeight: 800
                    }}>•</span>
                    <p style={{
                      color: "rgba(226,232,240,0.75)",
                      fontSize: "0.88rem",
                      lineHeight: 1.55,
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
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <div className="cn-form-row" style={{ display: "flex", gap: "0.85rem" }}>
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
                      padding: "0.85rem 1.25rem",
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
                      padding: "0.85rem 1.25rem",
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
                padding: "0.9rem",
                borderRadius: "1rem",
                background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "1.05rem",
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
              <div
                className="cn-request-meta-row"
                style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: "0.45rem",
                marginTop: "1.2rem",
                flexWrap: "nowrap",
                width: "100%",
                minWidth: 0,
              }}
              >
                <div className="cn-request-meta-count-wrap" style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
                <span
                  className="cn-request-count-pill"
                  style={{
                  display: "inline-flex",
                  alignItems: "center",
                  height: "2.28rem",
                  whiteSpace: "nowrap",
                  padding: "0 0.9rem",
                  borderRadius: "2rem",
                  background: "rgba(59,130,246,0.08)",
                  border: "1px solid rgba(59,130,246,0.3)",
                  color: "#60a5fa", 
                  fontSize: "0.9rem", 
                  fontFamily: "'Inter', sans-serif", 
                  fontWeight: 600, 
                  lineHeight: 1,
                  letterSpacing: "0.06em",
                  textShadow: "0 0 12px rgba(96,165,250,0.4)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
                }}
                >
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

                <div className="cn-request-meta-actions" style={{ display: "flex", gap: "0.28rem", flexWrap: "nowrap", flex: 1, minWidth: 0 }}>
                {([
                  { label: "DICOM 파일 추출 방법", key: "dicom" as const },
                  { label: "분석영상 확인방법", key: "analysis" as const },
                ] as const).map(({ label, key }) => {
                  const isActive = selectedPdf === key;
                  return (
                    <button
                      key={key}
                      className="cn-request-help-btn"
                      onClick={() => setSelectedPdf(isActive ? null : key)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flex: 1,
                        minWidth: 0,
                        height: "2.7rem",
                        gap: "0.35rem",
                        padding: "0 1rem",
                        borderRadius: "0.7rem",
                        background: isActive ? "rgba(96,165,250,0.2)" : "rgba(96,165,250,0.07)",
                        border: `1px solid ${isActive ? "rgba(96,165,250,0.6)" : "rgba(96,165,250,0.25)"}`,
                        color: isActive ? "#bfdbfe" : "#93c5fd",
                        fontSize: "0.88rem",
                        fontWeight: 600,
                        lineHeight: 1,
                        fontFamily: "'HYGraphic', sans-serif",
                        whiteSpace: "nowrap",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={e => {
                        if (!isActive) {
                          e.currentTarget.style.background = "rgba(96,165,250,0.15)";
                          e.currentTarget.style.borderColor = "rgba(96,165,250,0.5)";
                        }
                      }}
                      onMouseLeave={e => {
                        if (!isActive) {
                          e.currentTarget.style.background = "rgba(96,165,250,0.07)";
                          e.currentTarget.style.borderColor = "rgba(96,165,250,0.25)";
                        }
                      }}
                    >
                      {key === "analysis" ? (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="11" cy="11" r="8" />
                          <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                      ) : (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                        </svg>
                      )}
                      <span>{label}</span>
                    </button>
                  );
                })}
                </div>
              </div>
            </div>
          </RevealSection>
        </div>

        {/* 우측 뉴런 장식 */}
        <div style={{ flex: 1, height: "500px", position: "relative" }}>
          <NeuralSynapseVisual mode="dense" color="192, 132, 252" opacity={0.9} />
        </div>

      </div>

      {/* PDF 팝업 모달 */}
      {selectedPdf && (
        <PdfModal
          src={selectedPdf === "analysis" ? "/analysis-guide.pdf" : "/dicom-guide.pdf"}
          title={selectedPdf === "analysis" ? "분석영상 확인방법" : "DICOM 파일 추출 방법"}
          onClose={() => setSelectedPdf(null)}
        />
      )}
    </section>
  );
}

function ContactSection({ onOpenPrivacy, privacyAgreed, setPrivacyAgreed, isCompactLayout }: ContactSectionProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isContactIntroEnglish, setIsContactIntroEnglish] = useState(false);
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
    <section
      id="contact"
      style={{
        minHeight: isCompactLayout ? "auto" : "100vh",
        display: "flex",
        alignItems: isCompactLayout ? "flex-start" : "center",
        paddingBottom: isCompactLayout ? "1.5rem" : undefined,
      }}
    >
      <div className="cn-section-flex" style={{ display: "flex", width: "100%", alignItems: "stretch", gap: isCompactLayout ? "2rem" : "4rem" }}>
        <div style={{ flex: 1, maxWidth: "38rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <RevealSection>
            <SectionLabel>Contact</SectionLabel>
            <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 700, color: "#e2e8f0", lineHeight: 1.2, marginBottom: "1.5rem" }}>
              <span style={{ whiteSpace: "nowrap" }}>Research Collaboration</span><br />
              <span style={{ whiteSpace: "nowrap" }}>& Technical Partnerships</span>
            </h2>
            <Divider />
          </RevealSection>
          <RevealSection style={{ transitionDelay: "0.1s" }}>
            <button
              type="button"
              onClick={() => setIsContactIntroEnglish(prev => !prev)}
              style={{
                color: "#94a3b8",
                lineHeight: 1.85,
                fontSize: "1.05rem",
                fontWeight: 300,
                marginBottom: "2rem",
                background: "none",
                border: "none",
                padding: 0,
                textAlign: "left",
                width: "100%",
                cursor: "pointer",
              }}
              title={isContactIntroEnglish ? "Click to switch to Korean" : "Click to switch to English"}
            >
              {isContactIntroEnglish ? (
                <>
                  Thank you for your interest in <span style={{ color: "#e2e8f0", fontWeight: 700, fontFamily: "var(--font-bernhard)" }}>CLARUS</span><span style={{ color: "#a855f7", fontWeight: 700, fontFamily: "'HYGraphic', sans-serif" }}>-</span><span style={{ color: "#a855f7", fontWeight: 700, fontFamily: "var(--font-bernhard)" }}>N</span>&apos;s AI solutions.<br />
                  We are currently operating a pilot program for research purposes only.<br />
                  Please contact us if you have any questions about research collaboration or technical partnerships.
                </>
              ) : (
                <>
                  <span style={{ color: "#e2e8f0", fontWeight: 700, fontFamily: "var(--font-bernhard)" }}>CLARUS</span><span style={{ color: "#a855f7", fontWeight: 700, fontFamily: "'HYGraphic', sans-serif" }}>-</span><span style={{ color: "#a855f7", fontWeight: 700, fontFamily: "var(--font-bernhard)" }}>N</span>의 다양한 AI solutions에 대해 관심을 주셔서 감사합니다.<br />현재 <span style={{ color: "#e2e8f0", fontWeight: 700, fontFamily: "var(--font-bernhard)" }}>CLARUS</span><span style={{ color: "#a855f7", fontWeight: 700, fontFamily: "'HYGraphic', sans-serif" }}>-</span><span style={{ color: "#a855f7", fontWeight: 700, fontFamily: "var(--font-bernhard)" }}>N</span>는 연구목적의 파일럿 프로그램만 운용중입니다.<br />
                  저희와 연구 협력 및 기술 제휴 등의 궁금한 점이 있으시면 문의해 주세요.
                </>
              )}
            </button>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem", width: "100%", maxWidth: "420px" }}>
              
              {/* 타이틀 버튼 스타일 - 팝업 트리거 버튼으로 변경 */}
              <button 
                onClick={() => setIsFormOpen(true)}
                style={{
                  position: "relative",
                  padding: "1.25rem 1.5rem",
                  borderRadius: "1rem",
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
                  minHeight: "92px",
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
                  <div style={{ 
                    width: "42px", height: "42px", 
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "rgba(255,255,255,0.05)", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.1)" 
                  }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ color: "#ffffff", fontSize: "1.3rem", fontWeight: 700, letterSpacing: "0.02em" }}>Contact</span>
                    <span style={{ color: "rgba(147,197,253,0.8)", fontSize: "0.75rem", marginTop: "0.25rem" }}>버튼을 클릭하여 온라인 문의 폼 열기</span>
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
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div 
                  onClick={handleCopyEmail}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.25rem",
                    padding: "1.25rem 1.5rem",
                    borderRadius: "1rem",
                    background: isCopied ? "rgba(59,130,246,0.15)" : "rgba(30,58,138,0.08)",
                    border: isCopied ? "1px solid rgba(96,165,250,0.6)" : "1px solid rgba(148,163,184,0.1)",
                    backdropFilter: "blur(4px)",
                    cursor: "pointer",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    position: "relative",
                    minHeight: "92px",
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
                  <div style={{ 
                    width: "42px", height: "42px", 
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: isCopied ? "rgba(96,165,250,0.3)" : "rgba(148,163,184,0.1)", 
                    borderRadius: "50%", transition: "all 0.3s" 
                  }}>
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
                    <div style={{ fontSize: "0.75rem", color: isCopied ? "#93c5fd" : "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.25rem", fontWeight: isCopied ? 700 : 400 }}>
                      {isCopied ? "COPIED!" : "E-mail"}
                    </div>
                    <div style={{ color: isCopied ? "#ffffff" : "#cbd5e1", fontSize: "1.15rem", fontWeight: isCopied ? 600 : 400, letterSpacing: "0.02em" }}>clarusnai@gmail.com</div>
                  </div>
                  {/* 클릭 유도 툴팁 (작게) */}
                  {!isCopied && (
                    <div style={{ position: "absolute", right: "1.5rem", top: "50%", transform: "translateY(-50%)", fontSize: "0.7rem", color: "#475569", opacity: 0.6 }}>
                      Click to Copy
                    </div>
                  )}
                </div>

                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1.25rem",
                  padding: "1.25rem 1.5rem",
                  borderRadius: "1rem",
                  background: "rgba(30,58,138,0.08)",
                  border: "1px solid rgba(148,163,184,0.1)",
                  backdropFilter: "blur(4px)",
                  minHeight: "92px",
                }}>
                  <div style={{ 
                    width: "42px", height: "42px", 
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "rgba(148,163,184,0.1)", borderRadius: "50%" 
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.25rem" }}>Tel</div>
                    <div style={{ color: "#cbd5e1", fontSize: "1.15rem", fontWeight: 400, letterSpacing: "0.05em" }}>+82-2-6956-5338</div>
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
               <span style={{ color: "#e2e8f0", fontWeight: 600, fontFamily: "var(--font-bernhard)" }}>CLARUS</span><span style={{ color: "#a855f7", fontWeight: 700, fontFamily: "'HYGraphic', sans-serif" }}>-</span><span style={{ color: "#a855f7", fontWeight: 700, fontFamily: "var(--font-bernhard)" }}>N</span>에 관심 가져주셔서 감사합니다.<br/>
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
                     onClick={onOpenPrivacy}
                     style={{ color: "#60a5fa", textDecoration: "underline", background: "none", border: "none", cursor: "pointer", fontSize: "inherit", padding: 0 }}
                   >
                     개인정보 처리방침
                   </button>에 동의합니다 (필수)
                 </label>
               </div>

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

function Footer({ onOpenEmailRefusal, onOpenPrivacy, onOpenTerms, isCompactLayout }: FooterProps) {
  return (
    <footer style={{
      padding: isCompactLayout
        ? "1.2rem 1.2rem calc(4.5rem + env(safe-area-inset-bottom, 0px)) 1.2rem"
        : "1.2rem 1.2rem 1.5rem 1.2rem",
      borderTop: "1px solid rgba(255,255,255,0.06)",
      color: "rgba(148, 163, 184, 0.6)",
      fontSize: "0.72rem",
      fontFamily: "'Inter', sans-serif",
      lineHeight: "1.6",
      letterSpacing: "0.02em",
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        {/* 상단: 회사 기본 정보 (가로 배열) */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.8rem", alignItems: "center" }}>
            <span>대표자: 김시온</span>
          <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
          <span>사업자등록번호: 811-87-03349</span>
          <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
          <span>연락처: +82-2-6956-5338</span>
          <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
          <span>이메일: clarusnai@gmail.com</span>
        </div>
        {/* 중단: 주소 */}
        <div>
          <span>주소: 서울특별시 금천구 가산디지털1로 168, A동 10층 1012호 (가산동, 우림라이온스밸리)</span>
        </div>
      </div>
      <div style={{
        marginTop: "0.8rem",
        paddingTop: "0.6rem",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.8rem", alignItems: "center" }}>
          <span style={{ color: "#93c5fd", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginRight: "0.2rem" }}>Legal Notices</span>
          <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
          <button
            type="button"
            onClick={onOpenPrivacy}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              color: "#93c5fd",
              fontWeight: 700,
              fontSize: "0.72rem",
              cursor: "pointer",
              textDecoration: "underline",
              textUnderlineOffset: "0.2em",
            }}
          >
            개인정보처리방침
          </button>
          <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
          <button
            type="button"
            onClick={onOpenTerms}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              color: "#93c5fd",
              fontWeight: 700,
              fontSize: "0.72rem",
              cursor: "pointer",
              textDecoration: "underline",
              textUnderlineOffset: "0.2em",
            }}
          >
            이용약관
          </button>
          <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
          <button
            type="button"
            onClick={onOpenEmailRefusal}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              color: "#93c5fd",
              fontWeight: 700,
              fontSize: "0.72rem",
              cursor: "pointer",
              textDecoration: "underline",
              textUnderlineOffset: "0.2em",
            }}
          >
            이메일 무단 수집 거부
          </button>
        </div>
      </div>

    </footer>
  );
}

/* ─────────────────────────────────────────────
   메인 페이지
───────────────────────────────────────────── */
const NAV_SECTIONS = ["about", "about-strengths", "background", "performance", "test-request", "contact"] as const;
type SectionId = typeof NAV_SECTIONS[number];
const SNAP_SECTION_IDS = ["hero", "about", "about-strengths", "background", "performance", "test-request", "contact"];

export default function ClarusNPage() {
  const [showIntro, setShowIntro] = useState(true);
  const [isIntroEnding, setIsIntroEnding] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCompactLayout, setIsCompactLayout] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [performancePageIndex, setPerformancePageIndex] = useState(0);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [activeLegalModal, setActiveLegalModal] = useState<LegalModalKey | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isSnapScrolling = useRef(false);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  // 화면 너비가 좁아지면 모바일/태블릿 레이아웃으로 전환
  useEffect(() => {
    const updateLayoutMode = () => setIsCompactLayout(window.innerWidth <= 1024);
    updateLayoutMode();
    window.addEventListener("resize", updateLayoutMode);
    return () => window.removeEventListener("resize", updateLayoutMode);
  }, []);

  // 모바일/태블릿 진입 시 사이드바를 기본 닫힘으로 전환
  useEffect(() => {
    if (isCompactLayout) {
      setIsSidebarOpen(false);
    }
  }, [isCompactLayout]);

  // 스크롤 위치 추적 → 현재 활성 섹션(Sidebar 강조용) 파악
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let rafId: number | null = null;

    const updateActiveSection = () => {
      const containerRect = container.getBoundingClientRect();
      let next: SectionId = NAV_SECTIONS[0];
      let closestDistance = Number.POSITIVE_INFINITY;

      for (const id of NAV_SECTIONS) {
        const el = container.querySelector(`#${id}`) as HTMLElement | null;
        if (!el) continue;

        const top = el.getBoundingClientRect().top - containerRect.top;
        const distance = Math.abs(top);

        if (distance < closestDistance) {
          closestDistance = distance;
          next = id;
        }
      }

      setActiveSection(prev => (prev === next ? prev : next));
    };

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        updateActiveSection();
        rafId = null;
      });
    };

    updateActiveSection();
    container.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      container.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateActiveSection);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, []);

  // 메뉴 클릭 → 해당 섹션으로 부드럽게 스크롤
  const handleNavClick = useCallback((id: string) => {
    const container = scrollRef.current;
    if (!container) return;
    setActiveSection(id);
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

  // 섹션 스냅 스크롤 (휠 조작 시 섹션 단위 이동)
  useEffect(() => {
    if (showIntro) return;
    const container = scrollRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      const maxScrollTop = container.scrollHeight - container.clientHeight;
      const atTop = container.scrollTop <= 0;
      const atBottom = container.scrollTop >= maxScrollTop - 2;

      // 스크롤 경계에서는 브라우저 바운스/되튐을 막고, 실제로 더 이동할 수 있을 때만 스냅 처리
      if ((atTop && e.deltaY < 0) || (atBottom && e.deltaY > 0)) {
        e.preventDefault();
        return;
      }

      // 이미 스크롤 중이면 중복 처리 방지
      if (isSnapScrolling.current) {
        e.preventDefault();
        return;
      }

      const sections = SNAP_SECTION_IDS
        .map(id => container.querySelector(`#${id}`) as HTMLElement | null)
        .filter(Boolean) as HTMLElement[];

      const containerRect = container.getBoundingClientRect();
      const positions = sections.map(el => el.getBoundingClientRect().top - containerRect.top);

      // 현재 화면 중앙 부근에 위치한 섹션 인덱스 찾기
      let currentIdx = 0;
      for (let i = 0; i < positions.length; i++) {
        if (positions[i] <= 50) currentIdx = i;
      }

      const direction = e.deltaY > 0 ? 1 : -1;
      const nextIdx = Math.max(0, Math.min(sections.length - 1, currentIdx + direction));

      if (nextIdx === currentIdx) return;

      e.preventDefault();
      isSnapScrolling.current = true;
      
      // 다음 섹션으로 부드럽게 이동
      sections[nextIdx].scrollIntoView({ behavior: "smooth", block: "start" });
      
      // 스냅 감도 조절 (1초 후 다시 활성화)
      setTimeout(() => { isSnapScrolling.current = false; }, 1000);
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [showIntro]);


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
        <div
          ref={scrollRef}
          className="cn-sidebar-scroll"
        style={{
          position: "absolute",
          top: 0, bottom: 0, left: 0, right: 0,
          overflowY: "scroll",
          overflowX: "hidden",
          overscrollBehaviorY: "contain",
          zIndex: 10,
          backgroundColor: "#030712",
          paddingLeft: isSidebarOpen && !isCompactLayout ? "340px" : "0px",
          paddingBottom: "0px",
          transition: "padding-left 500ms cubic-bezier(0.4,0,0.2,1)",
        }}
        >
          {/* 전역 배경 레이어: 와이드 화면 여백을 채움 */}
          <div style={{
            position: "fixed",
            inset: 0,
            zIndex: -1,
            pointerEvents: "none",
            opacity: 0.25
          }}>
            <NeuralSynapseVisual mode="calm" color="147, 197, 253" opacity={0.3} />
          </div>

          <HeroSection />
          {/* 본문 컨텐츠 컨테이너: 중앙 정렬 및 와이드 대응 */}
          <div 
            className="cn-content-padding" 
            style={{ 
              maxWidth: "1440px",
              margin: "0 auto",
              paddingLeft: "calc(min(7rem, 8vw) - 1cm)", 
              paddingRight: "min(4rem, 5vw)",
              position: "relative",
            }}
          >
            <AboutSection isCompactLayout={isCompactLayout} />
            <AboutStrengthsSection />
            <BackgroundSection />
            <PerformanceSection pageIndex={performancePageIndex} setPageIndex={setPerformancePageIndex} />
            <TestRequestSection />
            <ContactSection
              onOpenPrivacy={() => setActiveLegalModal("privacy")}
              privacyAgreed={privacyAgreed}
              setPrivacyAgreed={setPrivacyAgreed}
              isCompactLayout={isCompactLayout}
            />
            <Footer
              onOpenEmailRefusal={() => setActiveLegalModal("email-refusal")}
              onOpenPrivacy={() => setActiveLegalModal("privacy")}
              onOpenTerms={() => setActiveLegalModal("terms")}
              isCompactLayout={isCompactLayout}
            />
          </div>

          <LegalModal
            isOpen={activeLegalModal === "privacy"}
            title="개인정보 처리방침"
            onClose={() => setActiveLegalModal(null)}
            confirmLabel="확인했습니다"
            onConfirm={() => {
              setPrivacyAgreed(true);
              setActiveLegalModal(null);
            }}
          >
            <p style={{ marginTop: 0 }}>
              CLARUS-N은 고객님의 소중한 개인정보를 보호하기 위해 최선을 다하고 있습니다.
            </p>
            <h5 style={{ color: "#cbd5e1", marginBottom: "0.5rem", fontSize: "0.95rem" }}>1. 수집하는 개인정보 항목</h5>
            <p style={{ marginBottom: "1.25rem" }}>이름, 지역, 기관명/병원명, 직함, 이메일 주소, 연락처, 문의내용</p>
            <h5 style={{ color: "#cbd5e1", marginBottom: "0.5rem", fontSize: "0.95rem" }}>2. 수집 및 이용목적</h5>
            <p style={{ marginBottom: "1.25rem" }}>서비스 이용에 따른 본인확인, 원활한 의사소통 경로 확보, 최신 정보 안내 및 문의사항 응대</p>
            <h5 style={{ color: "#cbd5e1", marginBottom: "0.5rem", fontSize: "0.95rem" }}>3. 보유 및 이용기간</h5>
            <p style={{ marginBottom: 0 }}>수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 관련 법령의 규정에 의하여 보존할 필요가 있는 경우 해당 기간 동안 보관합니다.</p>
          </LegalModal>

          <LegalModal
            isOpen={activeLegalModal === "terms"}
            title="이용약관"
            onClose={() => setActiveLegalModal(null)}
          >
            <p style={{ marginTop: 0 }}>
              본 서비스는 연구 목적의 AI 분석 웹사이트로 제공되며, 다음과 같은 조건을 따릅니다.
            </p>
            <ol style={{ paddingLeft: "1.2rem", margin: "1rem 0 1.25rem" }}>
              <li style={{ marginBottom: "0.75rem" }}>서비스 내용, 구성, 기능은 예고 없이 변경되거나 중단될 수 있습니다.</li>
              <li style={{ marginBottom: "0.75rem" }}>이용자는 정확한 정보를 입력하고, 시스템을 비정상적으로 사용해서는 안 됩니다.</li>
              <li style={{ marginBottom: "0.75rem" }}>분석 결과는 참고용이며, 최종 의료 판단은 담당 전문의의 책임 하에 이루어져야 합니다.</li>
              <li style={{ marginBottom: "0.75rem" }}>서비스와 관련된 콘텐츠 및 디자인의 권리는 CLARUS-N에 있습니다.</li>
              <li>문의 및 협업 요청은 지정된 문의 채널을 통해 진행해 주세요.</li>
            </ol>
            <p style={{ marginBottom: 0 }}>
              본 서비스를 이용함으로써 위 약관에 동의한 것으로 간주됩니다.
            </p>
          </LegalModal>

          <LegalModal
            isOpen={activeLegalModal === "email-refusal"}
            title="이메일 무단 수집 거부"
            onClose={() => setActiveLegalModal(null)}
          >
            <p style={{ marginTop: 0 }}>
              본 웹사이트에 게시된 이메일 주소가 전자우편 수집 프로그램이나 그 밖의 기술적 장치를 이용하여 무단으로 수집되는 것을 거부합니다.
            </p>
            <p style={{ marginBottom: "1.25rem" }}>
              이를 위반할 경우 정보통신망 이용촉진 및 정보보호 등에 관한 법률에 따라 처벌받을 수 있습니다.
            </p>
            <p style={{ marginBottom: 0 }}>
              문의는 사이트의 문의 폼 또는 안내된 공식 연락처를 이용해 주세요.
            </p>
          </LegalModal>
        </div>

        {isCompactLayout && isSidebarOpen && (
          <button
            aria-label="사이드바 닫기"
            onClick={toggleSidebar}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 38,
              border: "none",
              background: "rgba(2, 6, 23, 0.55)",
              backdropFilter: "blur(2px)",
              cursor: "pointer",
            }}
          />
        )}

        {/* 메뉴 열기 버튼 - PC 전용 */}
        {!isCompactLayout && (
          <button
            onClick={toggleSidebar}
            aria-label="메뉴 열기"
            style={{
              position: "fixed",
              top: "2rem",
              left: "2rem",
              zIndex: 40,
              padding: "0.75rem",
              borderRadius: "0.75rem",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(12px)",
              color: "white",
              cursor: "pointer",
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
        )}

        {/* 사이드바 */}
        <ClarusSidebar
          isOpen={isSidebarOpen}
          isMobile={isCompactLayout}
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

  if (!activeVideo || (!activeVideo.includes('territory') && !activeVideo.includes('onset') && !activeVideo.includes('onset'))) {
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
  } else if (activeVideo === "/videos/6-Infarction-onset-ADC.mp4") {
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
          opacity: isOpen ? 0 : 1,
          pointerEvents: isOpen ? "none" : "auto",
          transform: isOpen ? "scale(0.48) translateY(10px)" : "scale(0.6) translateY(0)",
          transformOrigin: "bottom left",
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
          transform: isOpen ? "scale(0.6)" : "scale(0.3)",
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
              fontSize: "1.05rem",
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
              whiteSpace: "normal",
              wordBreak: "break-word",
              lineHeight: 1.3
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
