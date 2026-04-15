import React from "react";

export type FooterProps = {
  onOpenEmailRefusal: () => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  isCompactLayout: boolean;
};

export function Footer({ onOpenEmailRefusal, onOpenPrivacy, onOpenTerms, isCompactLayout }: FooterProps) {
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
        {/* 상단: 회사 기본 정보 */}
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
