"use client";

import React, { useState, useEffect } from "react";
import { RevealSection } from "@/components/ui/RevealSection";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Divider } from "@/components/ui/Divider";
import NeuralSynapseVisual from "@/components/NeuralSynapseVisual";

interface Publication {
  type: "Oral Presentation" | "Poster" | "Journal";
  titleParts: React.ReactNode;
  koreanDesc: string;
  venue: string;
  date: string;
  articleUrl?: string;
}

const publications: Publication[] = [
  {
    type: "Oral Presentation",
    titleParts: (
      <>
        Development and Validation of an Integrated Deep Learning Framework for{" "}
        <span style={{ color: "#f97316" }}>
          3D Carotid Artery Reconstruction and Stenosis Detection
        </span>{" "}
        using MR angiography
      </>
    ),
    koreanDesc: "MRA 기반 3D 경동맥 재건 및 협착 탐지를 위한 통합 딥러닝 프레임워크 개발 및 검증",
    venue: "제6회 인하대학교병원 신경외과 심포지엄",
    date: "2026년 5월 2일",
  },
  {
    type: "Oral Presentation",
    titleParts: (
      <>
        Clinical Validation of a Deep Learning Model for Automated Detection of
        Cerebrovascular{" "}
        <span style={{ color: "#f97316" }}>Steno-occlusive Disease</span> on MRA
      </>
    ),
    koreanDesc: "MRA에서 뇌혈관 협착·폐색 질환의 자동 탐지를 위한 딥러닝 모델 임상 검증",
    venue: "대한 뇌혈관외과학회 인천지회",
    date: "2026년 1월 12일",
  },
  {
    type: "Oral Presentation",
    titleParts: (
      <>
        Diagnostic Performance of an Integrated{" "}
        <span style={{ color: "#f97316" }}>
          3D Vascular Reconstruction and Aneurysm Detection
        </span>{" "}
        AI Model in MR angiography
      </>
    ),
    koreanDesc: "MRA 기반 3D 혈관 재건 및 동맥류 탐지 통합 AI 모델의 진단 성능 평가",
    venue: "대한 뇌혈관외과학회 인천지회",
    date: "2025년 5월 24일",
  },
];

function PublicationCard({
  pub,
  isActive,
  onClick,
}: {
  pub: Publication;
  index: number;
  isActive: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const expanded = hovered || isActive;

  const bg = expanded ? "rgba(30,58,138,0.32)" : "rgba(30,58,138,0.14)";
  const borderColor = isActive
    ? "rgba(96,165,250,0.6)"
    : hovered
    ? "rgba(96,165,250,0.35)"
    : "rgba(255,255,255,0.07)";

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: "0.85rem",
        background: bg,
        border: `1px solid ${borderColor}`,
        backdropFilter: "blur(12px)",
        boxShadow: isActive
          ? "0 0 24px rgba(59,130,246,0.22), inset 0 0 10px rgba(59,130,246,0.08)"
          : hovered
          ? "0 0 14px rgba(59,130,246,0.1)"
          : "none",
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        cursor: "pointer",
        overflow: "hidden",
        transform: expanded ? "translateX(5px)" : "translateX(0)",
      }}
    >
      {/* 상단 영역 - 배지 + 영문 제목 */}
      <div style={{ padding: "1.25rem 1.5rem 0" }}>
        {/* 배지 */}
        <div style={{ marginBottom: "0.7rem" }}>
          <span
            style={{
              display: "inline-block",
              padding: "0.22rem 0.8rem",
              borderRadius: "0.4rem",
              background: "rgba(30,58,138,0.65)",
              border: "1px solid rgba(96,165,250,0.4)",
              color: "rgba(147,197,253,0.95)",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
              fontFamily: "'Arial Unicode MS', sans-serif",
              textTransform: "uppercase",
            }}
          >
            {pub.type}
          </span>
        </div>

        {/* 영문 제목 */}
        <p
          style={{
            fontSize: "1.05rem",
            fontWeight: 600,
            color: "#e2e8f0",
            lineHeight: 1.65,
            margin: 0,
            letterSpacing: "-0.01em",
          }}
        >
          {pub.titleParts}
        </p>
      </div>

      {/* 호버 시 펼쳐지는 한글 설명 영역 */}
      <div
        style={{
          maxHeight: expanded ? "12rem" : "0",
          opacity: expanded ? 1 : 0,
          overflow: "hidden",
          transition: "max-height 0.38s cubic-bezier(0.4,0,0.2,1), opacity 0.28s ease",
        }}
      >
        <div
          style={{
            margin: "0.9rem 1.5rem 0",
            padding: "0.9rem 1.1rem",
            borderRadius: "0.6rem",
            background: "rgba(15,23,42,0.5)",
            borderLeft: "3px solid rgba(96,165,250,0.6)",
          }}
        >
          {/* 한글 설명 - 크고 눈에 띄게 */}
          <p
            style={{
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "#e2e8f0",
              fontFamily: "'HYGraphic', 'Noto Sans KR', sans-serif",
              lineHeight: 1.6,
              margin: "0 0 0.6rem",
              letterSpacing: "0.01em",
              wordBreak: "keep-all",
            }}
          >
            {pub.koreanDesc}
          </p>

          {/* 장소 + 날짜 */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            <span
              style={{
                fontSize: "0.92rem",
                fontWeight: 600,
                color: "rgba(147,197,253,0.9)",
                fontFamily: "'HYGraphic', 'Noto Sans KR', sans-serif",
              }}
            >
              {pub.venue}
            </span>
            <span style={{ color: "rgba(100,116,139,0.6)", fontSize: "0.8rem" }}>·</span>
            <span
              style={{
                fontSize: "0.88rem",
                color: "rgba(148,163,184,0.8)",
                fontFamily: "'HYGraphic', 'Noto Sans KR', sans-serif",
                fontWeight: 500,
              }}
            >
              {pub.date}
            </span>
          </div>
        </div>
      </div>

      {/* 클릭 시 추가 펼쳐짐 - 아티클 링크 */}
      <div
        style={{
          maxHeight: isActive ? "5rem" : "0",
          opacity: isActive ? 1 : 0,
          overflow: "hidden",
          transition: "max-height 0.3s ease, opacity 0.22s ease",
        }}
      >
        <div style={{ padding: "0.75rem 1.5rem 1.2rem" }}>
          {pub.articleUrl ? (
            <a
              href={pub.articleUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.45rem 1rem",
                borderRadius: "0.5rem",
                background: "rgba(59,130,246,0.15)",
                border: "1px solid rgba(96,165,250,0.4)",
                color: "#93c5fd",
                fontSize: "0.82rem",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              View Article
            </a>
          ) : (
            <span
              style={{
                display: "inline-block",
                padding: "0.35rem 0.85rem",
                borderRadius: "0.5rem",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(100,116,139,0.8)",
                fontSize: "0.8rem",
                fontFamily: "'HYGraphic', sans-serif",
              }}
            >
              Article link coming soon
            </span>
          )}
        </div>
      </div>

      {/* 하단 패딩 */}
      <div style={{ height: expanded ? "1rem" : "1.2rem", transition: "height 0.3s ease" }} />
    </div>
  );
}

export function PublicationsSection() {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleCardClick = (i: number) => {
    setActiveCard(prev => (prev === i ? null : i));
  };

  return (
    <section
      id="publications"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingTop: "6rem",
        paddingBottom: "6rem",
      }}
    >
      <RevealSection>
        <SectionLabel>Publications</SectionLabel>
        <h2
          style={{
            fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
            fontWeight: 800,
            color: "#e2e8f0",
            marginBottom: "0.75rem",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            maxWidth: "1440px",
            margin: "0 auto 0.75rem",
          }}
        >
          Presentations &amp; Publications
        </h2>
        <Divider />
      </RevealSection>

      <RevealSection style={{ transitionDelay: "0.1s" }}>
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? "1.5rem" : "3.5rem",
            maxWidth: "1440px",
            alignItems: isMobile ? "stretch" : "center",
            margin: "0 auto",
          }}
        >
          {/* 왼쪽: 카드 목록 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              flex: 1,
              minWidth: 0,
            }}
          >
            {publications.map((pub, i) => (
              <PublicationCard
                key={i}
                pub={pub}
                index={i}
                isActive={activeCard === i}
                onClick={() => handleCardClick(i)}
              />
            ))}
          </div>

          {/* 오른쪽: 비주얼 패널 - PC only */}
          {!isMobile && (
            <div
              style={{
                width: "600px",
                flexShrink: 0,
                position: "relative",
                minHeight: "420px",
                borderRadius: "1.1rem",
                overflow: "hidden",
                pointerEvents: "none",
              }}
            >
              <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                <NeuralSynapseVisual mode="dense" color="96, 165, 250" opacity={0.55} />
              </div>

              <div
                style={{
                  position: "absolute",
                  left: "1.5rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "rgba(96,165,250,0.5)",
                  fontSize: "2rem",
                  pointerEvents: "none",
                  zIndex: 2,
                }}
              >
                ›
              </div>

              {activeCard === null && (
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
                  Click a card to review the article
                </div>
              )}

              {activeCard !== null && (
                <div
                  style={{
                    position: "absolute",
                    inset: "2rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 2,
                    pointerEvents: "none",
                  }}
                >
                  <div
                    style={{
                      background: "rgba(15,23,42,0.78)",
                      backdropFilter: "blur(14px)",
                      border: "1px solid rgba(96,165,250,0.25)",
                      borderRadius: "1rem",
                      padding: "2rem 2.5rem",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "inline-block",
                        padding: "0.25rem 0.85rem",
                        borderRadius: "0.4rem",
                        background: "rgba(30,58,138,0.65)",
                        border: "1px solid rgba(96,165,250,0.4)",
                        color: "rgba(147,197,253,0.95)",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        marginBottom: "1rem",
                      }}
                    >
                      {publications[activeCard].type}
                    </div>
                    {/* 한글 설명 - 우측 패널에서도 크게 */}
                    <p
                      style={{
                        fontSize: "1.15rem",
                        fontWeight: 700,
                        color: "#f1f5f9",
                        fontFamily: "'HYGraphic', 'Noto Sans KR', sans-serif",
                        lineHeight: 1.7,
                        margin: "0 0 0.75rem",
                        wordBreak: "keep-all",
                      }}
                    >
                      {publications[activeCard].koreanDesc}
                    </p>
                    <div style={{
                      width: "40px",
                      height: "2px",
                      background: "rgba(96,165,250,0.5)",
                      margin: "0 auto 0.75rem",
                      borderRadius: "1px",
                    }} />
                    <p
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 500,
                        color: "rgba(203,213,225,0.75)",
                        lineHeight: 1.6,
                        margin: "0 0 0.75rem",
                      }}
                    >
                      {publications[activeCard].titleParts}
                    </p>
                    <div style={{ color: "rgba(147,197,253,0.85)", fontSize: "0.85rem", fontFamily: "'HYGraphic', sans-serif", fontWeight: 600 }}>
                      {publications[activeCard].venue}
                    </div>
                    <div style={{ color: "rgba(100,116,139,0.8)", fontSize: "0.8rem", fontFamily: "'HYGraphic', sans-serif", marginTop: "0.2rem" }}>
                      {publications[activeCard].date}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </RevealSection>
    </section>
  );
}
