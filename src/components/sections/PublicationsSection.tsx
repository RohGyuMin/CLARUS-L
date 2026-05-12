"use client";

import React, { useState, useEffect, useRef } from "react";
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
  pdfPath?: string;
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
    koreanDesc: "경동맥 3D 렌더링 및 협착의 탐지를 위한 딥러닝 모델의 개발 및 성능평가",
    venue: "제6회 인하대학교병원 신경외과 심포지엄",
    date: "2026년 5월 2일",
    pdfPath: "/papers/paper-carotid.pdf",
  },
  {
    type: "Oral Presentation",
    titleParts: (
      <>
        Clinical Validation of a Deep Learning Model for Automated Detection of
        Cerebrovascular{" "}
        <span style={{ color: "#facc15" }}>Steno-occlusive Disease</span> on MRA
      </>
    ),
    koreanDesc: "뇌혈관 협착 및 폐쇄성 질환의 탐지를 위한 딥러닝 모델의 임상적 유효성 검증",
    venue: "대한 뇌혈관외과학회 인천지회",
    date: "2026년 1월 12일",
    pdfPath: "/papers/paper-steno-occlusive.pdf",
  },
  {
    type: "Oral Presentation",
    titleParts: (
      <>
        Diagnostic Performance of an Integrated{" "}
        <span style={{ color: "#ef4444" }}>
          3D Vascular Reconstruction and Aneurysm Detection
        </span>{" "}
        AI Model in MR angiography
      </>
    ),
    koreanDesc: "뇌혈관 3D-재구성 및 뇌동맥류 탐지를 위한 AI 모델의 진단 성능 분석",
    venue: "대한 뇌혈관외과학회 인천지회",
    date: "2025년 5월 24일",
    pdfPath: "/papers/paper-vascular-aneurysm.pdf",
  },
  {
    type: "Oral Presentation",
    titleParts: (
      <>
        Validation of an AI Model for Cerebral{" "}
        <span style={{ color: "#60a5fa" }}>Aneurysm Detection</span>{" "}
        in MR Angiography: Comparative Analysis of MR-aneurysm AI and Radiologists
      </>
    ),
    koreanDesc: "뇌동맥류 탐지를 위한 AI 모델의 유효성 검증: AI와 영상의학과 전문의 간의 비교 분석",
    venue: "제 43회 대한신경외과학회 춘계학술대회",
    date: "2025년 4월 18일",
    pdfPath: "/papers/paper-aneurysm-validation.pdf",
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
          ) : null}
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
  const [cardsHeight, setCardsHeight] = useState<number>(600);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!cardsRef.current) return;
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        setCardsHeight(entry.contentRect.height);
      }
    });
    observer.observe(cardsRef.current);
    return () => observer.disconnect();
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
        paddingTop: "3.5rem",
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
            alignItems: isMobile ? "stretch" : "flex-start",
            margin: "0 auto",
          }}
        >
          {/* 왼쪽: 카드 목록 */}
          <div
            ref={cardsRef}
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

          {/* 오른쪽: PDF 패널 - PC only */}
          {!isMobile && (
            <div
              style={{
                width: "520px",
                height: `${cardsHeight}px`,
                flexShrink: 0,
                position: "relative",
                borderRadius: "1.1rem",
                overflow: "hidden",
                border: `1px solid ${activeCard !== null ? "rgba(96,165,250,0.35)" : "rgba(96,165,250,0.15)"}`,
                background: "rgba(15,23,42,0.6)",
                backdropFilter: "blur(12px)",
                transition: "border-color 0.3s ease",
              }}
            >
              {/* 카드 미선택 시: Neural 배경 + 안내 문구 */}
              {activeCard === null && (
                <>
                  <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                    <NeuralSynapseVisual mode="dense" color="96, 165, 250" opacity={0.55} />
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      gap: "0.75rem",
                      pointerEvents: "none",
                      zIndex: 2,
                    }}
                  >
                    <span style={{
                      color: "rgba(226,232,240,0.55)",
                      fontSize: "0.88rem",
                      fontFamily: "'HYGraphic', sans-serif",
                      fontWeight: 600,
                      letterSpacing: "0.03em",
                    }}>
                      Click a card to view the paper
                    </span>
                  </div>
                </>
              )}

              {/* 카드 선택 시: PDF iframe */}
              {activeCard !== null && publications[activeCard].pdfPath && (
                <iframe
                  key={activeCard}
                  src={`${publications[activeCard].pdfPath}#toolbar=0&navpanes=0&scrollbar=1`}
                  style={{
                    width: "100%",
                    height: `${cardsHeight}px`,
                    border: "none",
                    display: "block",
                  }}
                  title={`Publication PDF ${activeCard + 1}`}
                />
              )}
            </div>
          )}

        </div>
      </RevealSection>
    </section>
  );
}
