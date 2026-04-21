"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { RevealSection } from "@/components/ui/RevealSection";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Divider } from "@/components/ui/Divider";
import NeuralSynapseVisual from "@/components/NeuralSynapseVisual";

export function BackgroundSection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [pinnedCard, setPinnedCard] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setModalIndex(null); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
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

  /* ── 모바일 이미지 모달 ── */
  const mobileModal = mounted && modalIndex !== null && createPortal(
    <div
      onClick={() => setModalIndex(null)}
      style={{
        position: "fixed", inset: 0, zIndex: 9000,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "1.5rem",
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        animation: "fadeIn 0.2s ease",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "480px",
          borderRadius: "1.25rem",
          overflow: "hidden",
          background: "rgba(8,14,32,0.97)",
          border: `1px solid ${items[modalIndex].color}40`,
          boxShadow: `0 0 0 1px ${items[modalIndex].color}20, 0 40px 80px rgba(0,0,0,0.8)`,
          display: "flex",
          flexDirection: "column",
          animation: "slideUp 0.25s cubic-bezier(0.34,1.2,0.64,1)",
        }}
      >
        {/* 상단 컬러 라인 */}
        <div style={{ height: "3px", background: items[modalIndex].color, flexShrink: 0 }} />

        {/* 이미지 */}
        {items[modalIndex].image && (
          <img
            src={items[modalIndex].image}
            alt={items[modalIndex].subtitle}
            style={{
              width: "100%",
              maxHeight: "260px",
              objectFit: "cover",
              display: "block",
            }}
          />
        )}

        {/* 텍스트 영역 */}
        <div style={{ padding: "1.25rem 1.5rem 1.5rem" }}>
          <div style={{
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.12em",
            color: items[modalIndex].color,
            marginBottom: "0.5rem",
            textTransform: "uppercase",
          }}>
            {String(modalIndex + 1).padStart(2, "0")}
          </div>
          <div style={{
            fontSize: "1.05rem",
            fontWeight: 700,
            color: "#e2e8f0",
            lineHeight: 1.35,
            marginBottom: "0.6rem",
          }}>
            {items[modalIndex].title}
          </div>
          <div style={{
            fontSize: "0.9rem",
            color: "#94a3b8",
            lineHeight: 1.6,
            marginBottom: "0.4rem",
          }}>
            {items[modalIndex].subtitle}
          </div>
          <div style={{
            fontSize: "0.85rem",
            color: `${items[modalIndex].color}cc`,
            lineHeight: 1.5,
            fontStyle: "italic",
          }}>
            {items[modalIndex].detail}
          </div>
        </div>

        {/* 닫기 버튼 */}
        <button
          onClick={() => setModalIndex(null)}
          style={{
            margin: "0 1.5rem 1.25rem",
            padding: "0.65rem",
            borderRadius: "0.65rem",
            border: `1px solid rgba(255,255,255,0.1)`,
            background: "rgba(255,255,255,0.05)",
            color: "rgba(255,255,255,0.5)",
            fontSize: "0.85rem",
            fontWeight: 600,
            cursor: "pointer",
            letterSpacing: "0.04em",
          }}
        >
          닫기
        </button>
      </div>
    </div>,
    document.body
  );

  return (
    <>
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
                  onClick={() => {
                    if (isMobile && item.image) {
                      setModalIndex(i);
                    } else {
                      setPinnedCard(isPinned ? null : i);
                    }
                  }}
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
                  <div style={{ flex: 1, padding: "0.85rem 1.2rem 0.85rem 0", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative" }}>
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
                    {/* 모바일: 이미지 있는 카드에 아이콘 힌트 */}
                    {isMobile && item.image && (
                      <div style={{
                        position: "absolute",
                        top: "50%",
                        right: "0",
                        transform: "translateY(-50%)",
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        background: `${item.color}20`,
                        border: `1px solid ${item.color}40`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="7" width="18" height="13" rx="2"/>
                          <path d="M16 7l-2-3H10L8 7"/>
                          <circle cx="12" cy="13" r="3"/>
                        </svg>
                      </div>
                    )}

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
                      {/* 모바일: 이미지는 모달로 열림 (인라인 제거) */}
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
                      color: "rgba(226,232,240,0.72)",
                      fontSize: "0.94rem",
                      lineHeight: 1.25,
                      fontFamily: "'HYGraphic', sans-serif",
                      fontWeight: 700,
                      textAlign: "center",
                      letterSpacing: "0.03em",
                      textShadow: "0 0 10px rgba(255,255,255,0.06)",
                      zIndex: 2,
                      pointerEvents: "none",
                    }}
                  >
                    Click a card to view the related video
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

    {/* 모바일 이미지 모달 */}
    {mobileModal}
    </>
  );
}
