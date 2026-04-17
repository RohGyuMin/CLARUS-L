"use client";

import React, { useState, useEffect } from "react";
import { RevealSection } from "@/components/ui/RevealSection";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Divider } from "@/components/ui/Divider";
import NeuralSynapseVisual from "@/components/NeuralSynapseVisual";

export function BackgroundSection() {
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

  const activeIndex = isMobile ? pinnedCard : (hoveredCard ?? pinnedCard);

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
                      fontSize: isMobile ? "0.95rem" : "1.3rem",
                      fontWeight: 600,
                      color: "#e2e8f0",
                      lineHeight: 1.3,
                      marginBottom: "0.3rem",
                    }}>
                      <div style={{
                        fontSize: isMobile ? "0.95rem" : "1.3rem",
                        lineHeight: 1.2,
                        fontWeight: 700,
                        color: "#e2e8f0",
                        whiteSpace: "normal",
                        wordBreak: "keep-all",
                        letterSpacing: "-0.01em",
                        textShadow: isActive ? `0 0 16px ${item.color}44` : "none",
                        transition: "all 0.25s ease",
                      }}>
                        {item.title}
                      </div>
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
                            maxHeight: "160px",
                            objectFit: "cover",
                            borderRadius: "0.5rem",
                            marginTop: "0.75rem",
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
                {pinnedCard === null ? (
                  <div
                    style={{
                      position: "absolute",
                      left: "50%",
                      bottom: "2.5rem",
                      transform: "translateX(-50%)",
                      width: "min(100%, 380px)",
                      color: "rgba(226,232,240,0.84)",
                      fontSize: "0.94rem",
                      lineHeight: 1.25,
                      fontFamily: "'HYGraphic', sans-serif",
                      fontWeight: 700,
                      textAlign: "center",
                      letterSpacing: "0.03em",
                      textShadow: "0 0 12px rgba(255,255,255,0.08)",
                      zIndex: 2,
                      pointerEvents: "none",
                    }}
                  >
                    Click an item to view the graph
                  </div>
                ) : items[pinnedCard].image && (
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
