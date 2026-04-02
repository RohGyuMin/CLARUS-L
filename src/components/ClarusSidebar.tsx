"use client";

import { useState } from "react";

interface ClarusSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeSection?: string;
  onNavClick?: (id: string) => void;
}

const brainMriItems = ["Vessel 3D", "Aneurysm", "Stenosis", "Infarction", "Carotid Vessel 3D", "Carotid Stenosis"];
const brainCtItems = ["Hemorrhage", "Vessel 3D"];

export default function ClarusSidebar({
  isOpen,
  onToggle,
  activeSection = "",
  onNavClick,
}: ClarusSidebarProps) {
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
          <span style={{
            fontSize: "1rem",
            letterSpacing: "0.2em", 
            color: "rgba(96,165,250,0.85)",
            textTransform: "uppercase",
            fontWeight: 100,
            fontFamily: "var(--font-bernhard)",
            textShadow: "0 0 15px rgba(96,165,250,0.3)",
            display: "flex",
            alignItems: "center",
          }}>
            C<span style={{ marginLeft: "-0.15em" }}>LARUS</span>
            <span style={{ 
              fontFamily: 'HYGraphic, sans-serif',
              fontSize: "0.8em",
              margin: "0 0.1em",
              transform: "translateY(-0.05em)"
            }}>-</span>
            N
          </span>
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
                onClick={onNavClick}
              />
              <div style={{
                marginLeft: "0.75rem",
                marginTop: "0.375rem",
                paddingLeft: "0.75rem",
                borderLeft: `1px solid ${activeSection === "performance" ? "rgba(96,165,250,0.4)" : "rgba(59,130,246,0.18)"}`,
                display: "flex",
                flexDirection: "column",
                gap: "0.875rem",
                paddingTop: "0.5rem",
                paddingBottom: "0.25rem",
                transition: "border-color 0.3s ease",
              }}>
                {/* Brain MRI */}
                <div>
                  <h3 style={{
                    color: activeSection === "performance" ? "rgba(96,165,250,1)" : "rgba(96,165,250,0.55)",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    marginBottom: "0.625rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    fontFamily: "'Inter', sans-serif",
                    transition: "color 0.3s ease",
                  }}>Brain MRI</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                    {brainMriItems.map(item => <SubBtn key={item} label={item} />)}
                  </div>
                </div>

                {/* Brain CT */}
                <div>
                  <h3 style={{
                    color: activeSection === "performance" ? "rgba(96,165,250,1)" : "rgba(96,165,250,0.55)",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    marginBottom: "0.625rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    fontFamily: "'Inter', sans-serif",
                    transition: "color 0.3s ease",
                  }}>Brain CT</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                    {brainCtItems.map(item => <SubBtn key={item} label={item} />)}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ height: "1px", background: "rgba(59,130,246,0.1)", margin: "0.375rem 0" }} />

            <NavBtn
              label="Contact"
              sectionId="contact"
              active={activeSection === "contact"}
              onClick={onNavClick}
            />
            <NavBtn
              label="Personal test request"
              sectionId="test-request"
              active={activeSection === "test-request"}
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
  label, sectionId, active, onClick,
}: {
  label: string;
  sectionId: string;
  active: boolean;
  onClick?: (id: string) => void;
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
        gap: "0.625rem",
        width: "100%",
        background: highlighted
          ? "linear-gradient(105deg, rgba(59,130,246,0.2) 0%, rgba(37,99,235,0.1) 50%, rgba(96,165,250,0.04) 100%)"
          : "rgba(255,255,255,0.02)",
        border: `1px solid ${highlighted ? "rgba(96,165,250,0.35)" : "rgba(255,255,255,0.05)"}`,
        boxShadow: highlighted
          ? "inset 3px 0 0 rgba(96,165,250,0.85), 0 0 20px rgba(59,130,246,0.1)"
          : "none",
        color: active ? "#ffffff" : hovered ? "#ffffff" : "rgba(226,232,240,0.9)",
        fontSize: "1.2rem",
        fontWeight: active ? 700 : 500,
        fontFamily: "'Inter', sans-serif",
        padding: "1rem 1.25rem",
        borderRadius: "0.75rem",
        textAlign: "left",
        letterSpacing: active ? "0.08em" : "0.05em",
        textDecoration: "none",
        transform: highlighted ? "translateX(3px)" : "translateX(0)",
        transition: "all 0.22s cubic-bezier(0.4,0,0.2,1)",
        cursor: "pointer",
      }}
    >
      {/* 활성 dot */}
      <span style={{
        width: 4, height: 4,
        borderRadius: "50%",
        background: active ? "#60a5fa" : "transparent",
        boxShadow: active ? "0 0 6px #60a5fa" : "none",
        flexShrink: 0,
        transition: "all 0.25s ease",
      }} />
      {label}
    </a>
  );
}

/* ── 서브 버튼 ── */
function SubBtn({ label }: { label: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href="#"
      onClick={e => e.preventDefault()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block",
        width: "100%",
        background: hovered
          ? "linear-gradient(105deg, rgba(59,130,246,0.15) 0%, rgba(37,99,235,0.07) 60%, transparent 100%)"
          : "transparent",
        boxShadow: hovered ? "inset 2px 0 0 rgba(96,165,250,0.55)" : "none",
        color: hovered ? "#ffffff" : "rgba(203,213,225,0.8)",
        fontSize: "1.05rem",
        fontWeight: 500,
        fontFamily: "'Inter', sans-serif",
        padding: "0.625rem 1.15rem",
        borderRadius: "0.375rem",
        textAlign: "left",
        textDecoration: "none",
        transform: hovered ? "translateX(4px)" : "translateX(0)",
        transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
        cursor: "pointer",
        letterSpacing: "0.03em",
      }}
    >
      {label}
    </a>
  );
}
