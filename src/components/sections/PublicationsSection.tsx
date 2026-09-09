"use client";

import React, { useState, useEffect, useRef } from "react";
import { RevealSection } from "@/components/ui/RevealSection";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Divider } from "@/components/ui/Divider";
import NeuralSynapseVisual from "@/components/NeuralSynapseVisual";

interface Publication {
  type: "Oral Presentation" | "Poster Presentation" | "Journal";
  titleParts: React.ReactNode;
  koreanDesc?: string;
  venue: string;
  date: string;
  pdfPath?: string;
  articleUrl?: string;
}

const CARDS_PER_PAGE = 4;

const publications: Publication[] = [
  {
    type: "Poster Presentation",
    titleParts: (
      <>
        Diagnostic Performance of an Integrated{" "}
        <span style={{ color: "#ef4444" }}>
          3D Vascular Reconstruction and Aneurysm Detection
        </span>{" "}
        AI Model using MR angiography
      </>
    ),
    venue: "KJJC 2026, 일본 오사카",
    date: "2026년 9월 18~19일",
  },
  {
    type: "Poster Presentation",
    titleParts: (
      <>
        Clinical Validation of a Deep Learning Model for Automated Detection of
        Cerebrovascular{" "}
        <span style={{ color: "#facc15" }}>Steno-occlusive Disease</span> on MRA
      </>
    ),
    venue: "KJJC 2026, 일본 오사카",
    date: "2026년 9월 18~19일",
  },
  {
    type: "Poster Presentation",
    titleParts: (
      <>
        Development and Validation of an Integrated Deep Learning Framework for{" "}
        <span style={{ color: "#f97316" }}>
          3D Carotid Artery Reconstruction and Stenosis Detection
        </span>{" "}
        using MR angiography
      </>
    ),
    venue: "KJJC 2026, 일본 오사카",
    date: "2026년 9월 18~19일",
  },
  {
    type: "Oral Presentation",
    titleParts: (
      <>
        What{" "}
        <span style={{ color: "#60a5fa" }}>AI Sees</span>{" "}
        That We Miss
      </>
    ),
    koreanDesc: "AI가 보고 우리가 놓치는 것: 뇌경색 환자의 영상에서 AI를 활용한 동맥류의 감지",
    venue: "대한 뇌혈관외과학회 인천지회",
    date: "2026년 5월 11일",
    pdfPath: "/papers/paper-ai-sees.pdf",
  },
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
          {/* 한글 설명 - 크고 눈에 띄게 (포스터는 한글 제목 없음) */}
          {pub.koreanDesc && (
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
          )}

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
  const [pageIndex, setPageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [cardsHeight, setCardsHeight] = useState<number>(600);
  const cardsRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const pageCount = Math.ceil(publications.length / CARDS_PER_PAGE);
  const pageStart = pageIndex * CARDS_PER_PAGE;
  const pageItems = publications.slice(pageStart, pageStart + CARDS_PER_PAGE);

  const goToPage = (next: number) => {
    setPageIndex(Math.min(pageCount - 1, Math.max(0, next)));
    setActiveCard(null);
  };

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
            position: "relative",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? "1.5rem" : "3.5rem",
            maxWidth: "1440px",
            alignItems: isMobile ? "stretch" : "flex-start",
            margin: "0 auto",
          }}
          onTouchStart={e => { touchStartX.current = e.touches[0].clientX; }}
          onTouchEnd={e => {
            if (touchStartX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchStartX.current;
            touchStartX.current = null;
            if (Math.abs(dx) < 40) return;
            goToPage(pageIndex + (dx < 0 ? 1 : -1));
          }}
        >
          {/* 좌측 화살표 */}
          <button
            onClick={() => goToPage(pageIndex - 1)}
            disabled={pageIndex === 0}
            aria-label="이전 발표 목록"
            style={{
              position: "absolute",
              left: isMobile ? "0.3rem" : "-5rem",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              background: isMobile ? "rgba(0,0,0,0.35)" : "none",
              backdropFilter: isMobile ? "blur(6px)" : "none",
              borderRadius: isMobile ? "50%" : "0",
              border: "none",
              color: "#60a5fa",
              cursor: pageIndex === 0 ? "default" : "pointer",
              opacity: pageIndex === 0 ? 0.08 : 0.75,
              transition: "all 0.3s ease",
              padding: isMobile ? "0.4rem" : "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseEnter={e => pageIndex !== 0 && (e.currentTarget.style.opacity = "1")}
            onMouseLeave={e => pageIndex !== 0 && (e.currentTarget.style.opacity = "0.75")}
          >
            <svg width={isMobile ? 32 : 64} height={isMobile ? 32 : 64} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* 우측 화살표 */}
          <button
            onClick={() => goToPage(pageIndex + 1)}
            disabled={pageIndex === pageCount - 1}
            aria-label="다음 발표 목록"
            style={{
              position: "absolute",
              right: isMobile ? "0.3rem" : "-5rem",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              background: isMobile ? "rgba(0,0,0,0.35)" : "none",
              backdropFilter: isMobile ? "blur(6px)" : "none",
              borderRadius: isMobile ? "50%" : "0",
              border: "none",
              color: "#60a5fa",
              cursor: pageIndex === pageCount - 1 ? "default" : "pointer",
              opacity: pageIndex === pageCount - 1 ? 0.08 : 0.75,
              transition: "all 0.3s ease",
              padding: isMobile ? "0.4rem" : "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseEnter={e => pageIndex !== pageCount - 1 && (e.currentTarget.style.opacity = "1")}
            onMouseLeave={e => pageIndex !== pageCount - 1 && (e.currentTarget.style.opacity = "0.75")}
          >
            <svg width={isMobile ? 32 : 64} height={isMobile ? 32 : 64} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

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
            {pageItems.map((pub, i) => {
              const globalIndex = pageStart + i;
              return (
                <PublicationCard
                  key={globalIndex}
                  pub={pub}
                  index={globalIndex}
                  isActive={activeCard === globalIndex}
                  onClick={() => handleCardClick(globalIndex)}
                />
              );
            })}
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

              {/* 카드 선택 시: PDF 없는 발표는 정보 카드 (장소 · 기간) */}
              {activeCard !== null && !publications[activeCard].pdfPath && (
                <>
                  <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                    <NeuralSynapseVisual mode="dense" color="96, 165, 250" opacity={0.35} />
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "2rem",
                      zIndex: 2,
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        padding: "2rem 2.1rem",
                        borderRadius: "1rem",
                        background: "rgba(15,23,42,0.72)",
                        border: "1px solid rgba(96,165,250,0.28)",
                        backdropFilter: "blur(12px)",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          marginBottom: "1.1rem",
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
                        {publications[activeCard].type}
                      </span>

                      <p
                        style={{
                          fontSize: "1.05rem",
                          fontWeight: 600,
                          color: "#e2e8f0",
                          lineHeight: 1.65,
                          margin: "0 0 1.4rem",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {publications[activeCard].titleParts}
                      </p>

                      <div
                        style={{
                          paddingTop: "1.1rem",
                          borderTop: "1px solid rgba(96,165,250,0.18)",
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.5rem",
                          fontFamily: "'HYGraphic', 'Noto Sans KR', sans-serif",
                        }}
                      >
                        <span style={{ fontSize: "1rem", fontWeight: 600, color: "rgba(147,197,253,0.95)" }}>
                          {publications[activeCard].venue}
                        </span>
                        <span style={{ fontSize: "0.92rem", fontWeight: 500, color: "rgba(148,163,184,0.85)" }}>
                          {publications[activeCard].date}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

        </div>

        {/* 페이지 인디케이터 */}
        <div
          style={{
            display: "flex",
            gap: "0.85rem",
            alignItems: "center",
            justifyContent: isMobile ? "center" : "flex-start",
            maxWidth: "1440px",
            margin: isMobile ? "1.5rem auto 0" : "2.5rem auto 0",
          }}
        >
          {Array.from({ length: pageCount }, (_, idx) => (
            <button
              key={idx}
              onClick={() => goToPage(idx)}
              aria-label={`발표 목록 ${idx + 1}페이지`}
              style={{
                width: idx === pageIndex ? "1.75rem" : "0.5rem",
                height: "0.5rem",
                borderRadius: "0.25rem",
                background: idx === pageIndex ? "#60a5fa" : "rgba(255,255,255,0.15)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                padding: 0,
              }}
            />
          ))}
        </div>
      </RevealSection>
    </section>
  );
}
