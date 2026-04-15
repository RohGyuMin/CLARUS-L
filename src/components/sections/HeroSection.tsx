"use client";

import React from "react";
import ClarusHeroCanvas from "@/components/ClarusHeroCanvas";

export function HeroSection() {
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
            pointerEvents: "none",
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
            background: "linear-gradient(to bottom, rgba(96,165,250,0.8), transparent)",
            borderRadius: "1px",
            filter: "blur(1px)",
          }}
        />
      </div>
    </section>
  );
}
