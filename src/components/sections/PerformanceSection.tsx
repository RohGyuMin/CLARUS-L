"use client";

import React, { useState, useEffect, useRef } from "react";
import { RevealSection } from "@/components/ui/RevealSection";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Divider } from "@/components/ui/Divider";
import NeuralSynapseVisual from "@/components/NeuralSynapseVisual";

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

      {/* 호버 시 나타나는 상세 정보 */}
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

export function PerformanceSection({ pageIndex, setPageIndex, isCompactLayout }: {
  pageIndex: number;
  setPageIndex: React.Dispatch<React.SetStateAction<number>>;
  isCompactLayout?: boolean;
}) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLegendCollapsed, setIsLegendCollapsed] = useState(false);
  const [hasNudged, setHasNudged] = useState(false);
  const [mobileModalVideo, setMobileModalVideo] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const touchStartX = useRef<number | null>(null);

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
    if (isCompactLayout) {
      setMobileModalVideo(videoSrc);
      return;
    }
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

  const closeMobileModal = () => {
    setMobileModalVideo(null);
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

          {/* 슬라이더 트랙 컨테이너 */}
          <div style={{
            position: "relative",
            width: "100%",
            marginTop: "1rem",
            transform: hasNudged && !pageIndex ? "translateX(15px)" : "none",
            transition: "transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)"
          }}>
            {/* 좌측 화살표 */}
            <button
              onClick={() => {
                setPageIndex(p => Math.max(0, p - 1));
                setActiveVideo(null);
              }}
              disabled={pageIndex === 0}
              style={{
                position: "absolute",
                left: isCompactLayout ? "-2.2rem" : "-5rem",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                background: "none", border: "none", color: "#60a5fa",
                cursor: pageIndex === 0 ? "default" : "pointer",
                opacity: pageIndex === 0 ? 0.05 : 0.6, transition: "all 0.3s ease", padding: isCompactLayout ? "0.5rem" : "1rem",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}
              onMouseEnter={e => pageIndex !== 0 && (e.currentTarget.style.opacity = "1")}
              onMouseLeave={e => pageIndex !== 0 && (e.currentTarget.style.opacity = "0.6")}
            >
              <svg width={isCompactLayout ? 32 : 64} height={isCompactLayout ? 32 : 64} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>

            {/* 우측 화살표 */}
            <button
              onClick={() => {
                setPageIndex(p => Math.min(cardSets.length - 1, p + 1));
                setActiveVideo(null);
              }}
              disabled={pageIndex === cardSets.length - 1}
              style={{
                position: "absolute",
                right: isCompactLayout ? "-2.2rem" : "-5rem",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                background: "none", border: "none", color: "#60a5fa",
                cursor: pageIndex === cardSets.length - 1 ? "default" : "pointer",
                opacity: pageIndex === cardSets.length - 1 ? 0.05 : 0.6, transition: "all 0.3s ease", padding: isCompactLayout ? "0.5rem" : "1rem",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}
              onMouseEnter={e => pageIndex !== cardSets.length - 1 && (e.currentTarget.style.opacity = "1")}
              onMouseLeave={e => pageIndex !== cardSets.length - 1 && (e.currentTarget.style.opacity = "0.6")}
            >
              <svg width={isCompactLayout ? 32 : 64} height={isCompactLayout ? 32 : 64} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>

            {/* 가로 슬라이딩 트랙 */}
            <div
              style={{ overflow: "hidden", width: "100%" }}
              onTouchStart={e => { touchStartX.current = e.touches[0].clientX; }}
              onTouchEnd={e => {
                if (touchStartX.current === null) return;
                const dx = e.changedTouches[0].clientX - touchStartX.current;
                touchStartX.current = null;
                if (Math.abs(dx) < 40) return; // 너무 짧은 스와이프 무시
                if (dx < 0) {
                  // 왼쪽으로 스와이프 → 다음
                  setPageIndex(p => Math.min(cardSets.length - 1, p + 1));
                  setActiveVideo(null);
                } else {
                  // 오른쪽으로 스와이프 → 이전
                  setPageIndex(p => Math.max(0, p - 1));
                  setActiveVideo(null);
                }
              }}
            >
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

          {/* 모바일 힌트 텍스트 */}
          {isCompactLayout && (
            <p style={{
              color: "rgba(148,163,184,0.45)",
              fontSize: "0.75rem",
              textAlign: "center",
              marginTop: "1.25rem",
              letterSpacing: "0.04em",
              fontFamily: "'Inter', sans-serif",
            }}>
              Tap a card to view the AI analysis video
            </p>
          )}

          {/* 인디케이터 */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: "1.75rem",
            marginTop: isCompactLayout ? "1rem" : "2.5rem",
            paddingLeft: "1.5rem"
          }}>
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

        {/* 모바일 비디오 모달 */}
        {isCompactLayout && mobileModalVideo && (() => {
          const modalLegendItems = cardSets.flat().find(c => c.videoSrc === mobileModalVideo)?.legendItems;
          return (
            <div
              onClick={closeMobileModal}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 9000,
                background: "rgba(0,0,0,0.85)",
                backdropFilter: "blur(8px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "1rem",
              }}
            >
              <div
                onClick={e => e.stopPropagation()}
                style={{
                  width: "100%",
                  maxWidth: "480px",
                  background: "rgba(6,11,26,0.95)",
                  border: "1px solid rgba(96,165,250,0.3)",
                  borderRadius: "1.25rem",
                  overflow: "hidden",
                  boxShadow: "0 0 50px rgba(0,0,0,0.8), 0 0 30px rgba(59,130,246,0.15)",
                  position: "relative",
                }}
              >
                {/* 닫기 버튼 */}
                <button
                  onClick={closeMobileModal}
                  style={{
                    position: "absolute",
                    top: "0.75rem",
                    right: "0.75rem",
                    zIndex: 10,
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "50%",
                    width: "2rem",
                    height: "2rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(226,232,240,0.8)",
                    cursor: "pointer",
                  }}
                  aria-label="Close"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>

                {/* 비디오 */}
                <div style={{ position: "relative", background: "#000", aspectRatio: "16/9" }}>
                  <video
                    ref={mobileVideoRef}
                    key={mobileModalVideo}
                    src={mobileModalVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
                  />
                </div>

                {/* 범례 */}
                {modalLegendItems && modalLegendItems.length > 0 && (
                  <div style={{
                    padding: "0.75rem 1rem",
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.5rem 1rem",
                  }}>
                    {modalLegendItems.map(item => (
                      <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <div style={{
                          width: "9px", height: "9px",
                          borderRadius: "2px",
                          background: item.color,
                          flexShrink: 0,
                          boxShadow: `0 0 6px ${item.color}88`,
                        }} />
                        <span style={{
                          color: "rgba(226,232,240,0.88)",
                          fontSize: "0.72rem",
                          fontFamily: "'Inter', sans-serif",
                          whiteSpace: "nowrap",
                        }}>
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* 우측 영역: 비디오 플레이어 */}
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
          {/* 뉴런 시각화 배경 */}
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
              color: "#67e8f9",
              fontSize: "0.94rem",
              letterSpacing: "0.03em",
              fontFamily: "'HYGraphic', sans-serif",
              fontWeight: 700,
              lineHeight: 1.25,
              textShadow: "0 0 14px rgba(34, 211, 238, 0.32)",
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

              {/* 범례 */}
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
