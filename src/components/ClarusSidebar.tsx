"use client";

import { useState, useEffect } from "react";

interface ClarusSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeSection?: string;
  onNavClick?: (id: string) => void;
  onSubNavClick?: (index: number) => void;
}

const brainMriItems = ["MRA Vessel 3D", "Aneurysm", "Stenosis", "Infarction", "Carotid Vessel 3D", "Carotid Stenosis"];
const brainCtItems = ["Hemorrhage", "CTA Vessel 3D"];

export default function ClarusSidebar({
  isOpen,
  onToggle,
  activeSection = "",
  onNavClick,
  onSubNavClick,
}: ClarusSidebarProps) {
  const [isPerformanceOpen, setIsPerformanceOpen] = useState(activeSection === "performance");

  // activeSection이 변경될 때 Performance 메뉴 자동 열림 처리
  useEffect(() => {
    if (activeSection === "performance") {
      setIsPerformanceOpen(true);
    }
  }, [activeSection]);

  return (
    <aside
      style={{
        position: "fixed",
        top: 0, left: 0,
        height: "100%",
        width: "340px",
        background: "linear-gradient(180deg, rgba(2,8,20,0.97) 0%, rgba(4,12,30,0.95) 60%, rgba(3,10,26,0.97) 100%)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderRight: "1px solid rgba(59,130,246,0.25)",
        boxShadow: "4px 0 40px rgba(0,0,0,0.8), inset -1px 0 0 rgba(96,165,250,0.08)",
        zIndex: 50,
        transform: isOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 500ms cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      {/* 상단 파란 글로우 포인트 */}
      <div style={{
        position: "absolute",
        top: "-60px", left: "50%",
        transform: "translateX(-50%)",
        width: "200px", height: "120px",
        background: "radial-gradient(ellipse, rgba(59,130,246,0.2) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ height: "100%", display: "flex", flexDirection: "column", position: "relative" }}>

        {/* 닫기 버튼 */}
        <div style={{ position: "absolute", top: "1.5rem", left: "1.5rem", zIndex: 10 }}>
          <button
            onClick={onToggle}
            style={{
              width: "2.5rem", height: "2.5rem",
              display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: "0.625rem",
              background: "rgba(96,165,250,0.08)",
              border: "1px solid rgba(96,165,250,0.25)",
              color: "rgba(147,197,253,0.8)",
              cursor: "pointer",
              backdropFilter: "blur(8px)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(96,165,250,0.18)";
              e.currentTarget.style.borderColor = "rgba(96,165,250,0.5)";
              e.currentTarget.style.boxShadow = "0 0 12px rgba(59,130,246,0.3)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(96,165,250,0.08)";
              e.currentTarget.style.borderColor = "rgba(96,165,250,0.25)";
              e.currentTarget.style.boxShadow = "none";
            }}
            aria-label="메뉴 닫기"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* 로고 */}
        <div style={{
          paddingTop: "1.75rem",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
          paddingBottom: "1rem",
          borderBottom: "1px solid rgba(59,130,246,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}>
          <div 
            style={{
              fontSize: "1.1rem",
              letterSpacing: "-0.01em", 
              color: "rgba(96,165,250,0.95)",
              textTransform: "uppercase",
              fontWeight: 700,
              fontFamily: "var(--font-bernhard)",
              textShadow: "0 0 15px rgba(96,165,250,0.4)",
              display: "flex",
              alignItems: "center",
            }}
          >
            <img
              src="/logo.png"
              alt="CLARUS-N Logo"
              onClick={() => onNavClick?.("contact")}
              style={{
                height: "1.1em",
                width: "auto",
                marginRight: "0.25em",
                cursor: "pointer",
              }}
            />
            <span 
              onClick={() => onNavClick?.("about")}
              style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
            >
              C<span style={{ letterSpacing: "0.08em" }}>LARUS</span>
              <span style={{ 
                fontFamily: "'HYGraphic', sans-serif",
                fontSize: "0.85em",
                color: "#a855f7",
                textShadow: "0 0 15px rgba(168,85,247,0.5)",
                margin: "0 0.1em",
                transform: "translateY(-0.03em)"
              }}>-</span>
              <span style={{ color: "#a855f7", textShadow: "0 0 15px rgba(168,85,247,0.5)" }}>N</span>
            </span>
          </div>
        </div>

        {/* 스크롤 가능한 nav */}
        <div
          className="cn-sidebar-scroll"
          style={{
            flex: 1,
            overflowY: "auto",
            paddingTop: "1.5rem",
            paddingLeft: "1.25rem",
            paddingRight: "1.25rem",
            paddingBottom: "4rem",
          }}
        >
          <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <NavBtn
              label="About"
              sectionId="about"
              active={activeSection === "about"}
              onClick={onNavClick}
            />
            <NavBtn
              label="Strengths"
              sectionId="about-strengths"
              active={activeSection === "about-strengths"}
              onClick={onNavClick}
            />
            <NavBtn
              label="Background"
              sectionId="background"
              active={activeSection === "background"}
              onClick={onNavClick}
            />

            {/* Performance + sub-items */}
            <div style={{ marginTop: "0.125rem" }}>
              <NavBtn
                label="Performance"
                sectionId="performance"
                active={activeSection === "performance"}
                hasDropdown
                isDropdownOpen={isPerformanceOpen}
                onClick={(id) => {
                  onNavClick?.(id);
                  setIsPerformanceOpen(!isPerformanceOpen);
                }}
              />
              <div style={{
                marginLeft: "0.75rem",
                marginTop: "0.375rem",
                paddingLeft: "0.75rem",
                borderLeft: `1px solid ${isPerformanceOpen ? "rgba(96,165,250,0.4)" : "rgba(59,130,246,0.18)"}`,
                display: "flex",
                flexDirection: "column",
                gap: "0.875rem",
                paddingTop: isPerformanceOpen ? "0.5rem" : "0",
                paddingBottom: isPerformanceOpen ? "0.25rem" : "0",
                maxHeight: isPerformanceOpen ? "1000px" : "0",
                opacity: isPerformanceOpen ? 1 : 0,
                overflow: "hidden",
                transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
              }}>
                {/* Brain MRI */}
                <div style={{ 
                  transform: isPerformanceOpen ? "translateY(0)" : "translateY(-10px)",
                  transition: "transform 0.4s ease",
                }}>
                  <h3 style={{
                    color: isPerformanceOpen ? "rgba(96,165,250,1)" : "rgba(96,165,250,0.55)",
                    fontWeight: 700,
                    fontSize: "1rem",
                    lineHeight: 1.4,
                    marginBottom: "0.625rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    fontFamily: "'Arial Unicode MS', sans-serif",
                    transition: "color 0.3s ease",
                  }}>Brain MRI</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                    {brainMriItems.map(item => {
                      let targetIdx = 0;
                      if (item === "Infarction") targetIdx = 1;
                      if (item.includes("Carotid")) targetIdx = 2;
                      return (
                        <SubBtn 
                          key={item} 
                          label={item} 
                          onClick={() => onSubNavClick?.(targetIdx)}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Brain CT */}
                <div style={{ 
                  transform: isPerformanceOpen ? "translateY(0)" : "translateY(-10px)",
                  transition: "transform 0.5s ease",
                }}>
                  <h3 style={{
                    color: isPerformanceOpen ? "rgba(96,165,250,1)" : "rgba(96,165,250,0.55)",
                    fontWeight: 700,
                    fontSize: "1rem",
                    lineHeight: 1.4,
                    marginBottom: "0.625rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    fontFamily: "'Arial Unicode MS', sans-serif",
                    transition: "color 0.3s ease",
                  }}>Brain CT</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                    {brainCtItems.map(item => (
                      <SubBtn 
                        key={item} 
                        label={item} 
                        onClick={() => onSubNavClick?.(3)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ height: "1px", background: "rgba(59,130,246,0.1)", margin: "0.375rem 0" }} />

            <NavBtn
              label="Analysis Request"
              sectionId="test-request"
              active={activeSection === "test-request"}
              onClick={onNavClick}
            />
            <NavBtn
              label="Contact"
              sectionId="contact"
              active={activeSection === "contact"}
              onClick={onNavClick}
            />
          </nav>
        </div>

        {/* 하단 페이드 */}
        <div style={{
          position: "absolute", bottom: 0, left: 0,
          width: "100%", height: "4rem",
          background: "linear-gradient(to top, rgba(2,8,20,0.97), transparent)",
          pointerEvents: "none",
        }} />
      </div>
    </aside>
  );
}

/* ── 메인 nav 버튼 ── */
function NavBtn({
  label, sectionId, active, onClick, hasDropdown, isDropdownOpen
}: {
  label: string;
  sectionId: string;
  active: boolean;
  onClick?: (id: string) => void;
  hasDropdown?: boolean;
  isDropdownOpen?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const highlighted = active || hovered;

  return (
    <a
      href={`#${sectionId}`}
      onClick={e => {
        e.preventDefault();
        onClick?.(sectionId);
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        background: highlighted
          ? "rgba(59,130,246,0.12)"
          : "rgba(255,255,255,0.03)",
        border: `1px solid ${highlighted ? "rgba(96,165,250,0.3)" : "rgba(255,255,255,0.05)"}`,
        boxShadow: highlighted
          ? "0 4px 15px rgba(0,0,0,0.3)"
          : "none",
        color: active ? "#ffffff" : hovered ? "#ffffff" : "rgba(226,232,240,0.85)",
        fontSize: "1.25rem",
        fontWeight: active ? 600 : 500,
        fontFamily: "'Arial Black', 'Arial Unicode MS', sans-serif",
        padding: "1rem 1.5rem",
        borderRadius: "0.75rem",
        textAlign: "left",
        letterSpacing: "0.03em",
        textDecoration: "none",
        transform: highlighted ? "translateX(3px)" : "translateX(0)",
        transition: "all 0.22s cubic-bezier(0.4,0,0.2,1)",
        cursor: "pointer",
        margin: "0.2rem 0",
      }}
    >
      <span>{label}</span>
      {hasDropdown && (
        <svg 
          width="18" height="18" viewBox="0 0 24 24" fill="none" 
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{
            transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
            opacity: highlighted ? 1 : 0.5
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      )}
    </a>
  );
}

/* ── 서브 버튼 ── */
function SubBtn({ label, onClick }: { label: string; onClick?: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href="#"
      onClick={e => {
        e.preventDefault();
        onClick?.();
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block",
        width: "100%",
        background: hovered
          ? "linear-gradient(105deg, rgba(59,130,246,0.1) 0%, rgba(37,99,235,0.05) 60%, transparent 100%)"
          : "transparent",
        boxShadow: hovered ? "inset 2px 0 0 rgba(96,165,250,0.4)" : "none",
        color: hovered ? "#ffffff" : "rgba(203,213,225,0.75)",
        fontSize: "1.08rem",
        lineHeight: 1.5,
        fontWeight: 500,
        fontFamily: "'Arial Unicode MS', sans-serif",
        padding: "0.625rem 1.15rem",
        borderRadius: "0.375rem",
        textAlign: "left",
        textDecoration: "none",
        transform: hovered ? "translateX(4px)" : "translateX(0)",
        transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
        cursor: "pointer",
        letterSpacing: "0.02em",
      }}
    >
      {label}
    </a>
  );
}
