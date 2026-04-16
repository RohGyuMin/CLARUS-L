"use client";

import React, { useState, useEffect } from "react";
import { RevealSection } from "@/components/ui/RevealSection";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Divider } from "@/components/ui/Divider";
import NeuralSynapseVisual from "@/components/NeuralSynapseVisual";

export function AboutSection({ isCompactLayout }: { isCompactLayout: boolean }) {
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
                    &quot;Clarus&quot; reflects the goal of making complex brain imaging<br />clear, accurate, and accessible.
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
                  <span style={{ fontSize: "0.93rem", color: "#94a3b8" }}>: &quot;hyphen N&quot; means</span>
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
                inset: "-1.75rem -2rem",
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
              flex: 1,
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

export function AboutStrengthsSection() {
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
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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
                        <div style={{ fontSize: isMobile ? "0.95rem" : "1.3rem", fontWeight: 600, color: "#e2e8f0" }}>
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
