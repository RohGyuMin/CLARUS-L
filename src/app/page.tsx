"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ClarusSidebar from "@/components/ClarusSidebar";
import ClarusCursor from "@/components/ClarusCursor";
import ClarusHeroCanvas from "@/components/ClarusHeroCanvas";
import NeuralSynapseVisual from "@/components/NeuralSynapseVisual";

/* ─────────────────────────────────────────────
   인터섹션 옵저버 훅 – 뷰포트에 들어오면 visible
───────────────────────────────────────────── */
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return ref;
}

/* ─────────────────────────────────────────────
   섹션 컴포넌트들
───────────────────────────────────────────── */

function HeroSection() {
  return (
    <section
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
        style={{
          position: "absolute",
          bottom: "6rem",
          left: "5rem",
          zIndex: 5,
          pointerEvents: "none",
        }}
      >
        {/* CLARUS-N */}
        <h1
          style={{
            margin: 0,
            lineHeight: 1,
            fontSize: "clamp(3rem, 7vw, 6rem)",
            fontWeight: 300,
            letterSpacing: "0.12em",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <span
            style={{
              color: "#ffffff",
              textShadow:
                "0 0 30px rgba(255,255,255,0.6), 0 0 60px rgba(180,200,255,0.3)",
            }}
          >
            CLARUS-
          </span>
          <span
            style={{
              color: "#a855f7",
              textShadow:
                "0 0 20px rgba(168,85,247,0.9), 0 0 50px rgba(168,85,247,0.5)",
            }}
          >
            N
          </span>
        </h1>

        {/* 서브타이틀 */}
        <p
          style={{
            margin: "1rem 0 0",
            fontSize: "clamp(1rem, 2vw, 1.4rem)",
            fontWeight: 400,
            letterSpacing: "0.06em",
            color: "#c4813a",
            textShadow: "0 0 18px rgba(196,129,58,0.6)",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          AI for Unlocking Neuroimages
        </p>
      </div>

      {/* 스크롤 힌트 */}
      <div
        style={{
          position: "absolute",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
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
            background: "linear-gradient(to bottom, rgba(96,165,250,1), rgba(59,130,246,0.3), transparent)",
            boxShadow: "0 0 12px rgba(96,165,250,0.6), 0 0 24px rgba(59,130,246,0.3)",
            borderRadius: 2,
          }}
          className="cn-scroll-bounce"
        />
      </div>
    </section>
  );
}


function RevealSection({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      style={{
        opacity: 0,
        transform: "translateY(40px)",
        transition: "opacity 0.9s cubic-bezier(0.4,0,0.2,1), transform 0.9s cubic-bezier(0.4,0,0.2,1)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: "0.7rem",
        letterSpacing: "0.25em",
        textTransform: "uppercase",
        color: "#60a5fa",
        marginBottom: "1rem",
        fontWeight: 500,
      }}
    >
      {children}
    </span>
  );
}

function Divider() {
  return (
    <div
      style={{
        width: "100%",
        height: "1px",
        background: "linear-gradient(to right, rgba(96,165,250,0.4), transparent)",
        margin: "1.5rem 0",
      }}
    />
  );
}

function AboutSection() {
  return (
    <section id="about" style={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <div style={{ display: "flex", width: "100%", alignItems: "center", gap: "4rem" }}>
        <div style={{ flex: 1, maxWidth: "38rem" }}>
          <RevealSection>
            <SectionLabel>About</SectionLabel>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300, color: "#e2e8f0", lineHeight: 1.2, marginBottom: "1.5rem", letterSpacing: "0.05em" }}>
              차세대 신경영상 AI 분석 플랫폼
            </h2>
            <Divider />
          </RevealSection>
          <RevealSection style={{ transitionDelay: "0.15s" }}>
            <p style={{ color: "#94a3b8", lineHeight: 1.85, fontSize: "1.05rem", fontWeight: 300, marginBottom: "1.25rem" }}>
              CLARUS-N은 최첨단 딥러닝 알고리즘을 기반으로 뇌 MRI 및 CT 영상을 자동으로 분석하여 임상의의 의사결정을 지원하는 AI 솔루션입니다.
            </p>
            <p style={{ color: "#64748b", lineHeight: 1.85, fontSize: "1.05rem", fontWeight: 300 }}>
              혈관 3D 재구성, 동맥류 감지, 협착 분류, 뇌경색 세분화 등 다양한 임상 과제에서 검증된 성능을 제공합니다.
            </p>
          </RevealSection>
        </div>
        
        {/* 우측 뉴런 장식 */}
        <div style={{ flex: 1, height: "400px", position: "relative" }}>
          <NeuralSynapseVisual mode="dense" />
        </div>
      </div>
    </section>
  );
}

function BackgroundSection() {
  const stats = [
    { value: "10K+", label: "학습 데이터셋" },
    { value: "97.3%", label: "동맥류 감지 정확도" },
    { value: "0.3s", label: "평균 분석 시간" },
    { value: "15+", label: "협력 병원" },
  ];

  return (
    <section id="background" style={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <div style={{ display: "flex", width: "100%", alignItems: "center", gap: "4rem" }}>
        <div style={{ flex: 1, maxWidth: "42rem", width: "100%" }}>
          <RevealSection>
            <SectionLabel>Background</SectionLabel>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300, color: "#e2e8f0", lineHeight: 1.2, marginBottom: "1.5rem", letterSpacing: "0.05em" }}>
              연구 배경 및 개발 동기
            </h2>
            <Divider />
          </RevealSection>
          <RevealSection style={{ transitionDelay: "0.1s" }}>
            <p style={{ color: "#94a3b8", lineHeight: 1.85, fontSize: "1.05rem", fontWeight: 300, marginBottom: "2.5rem" }}>
              뇌혈관 질환은 빠른 진단이 생존율을 결정하는 핵심 요소입니다. 숙련된 영상의학과 전문의의 부족과 판독 지연 문제를 AI 기반 자동화로 해결합니다.
            </p>
          </RevealSection>

          {/* 통계 카드 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            {stats.map((s, i) => (
              <RevealSection key={s.label} style={{ transitionDelay: `${0.15 + i * 0.1}s` }}>
                <div
                  className="cn-stat-card"
                  style={{
                    padding: "1.75rem",
                    borderRadius: "1rem",
                    background: "rgba(30,58,138,0.08)",
                    border: "1px solid rgba(96,165,250,0.1)",
                    backdropFilter: "blur(12px)",
                    position: "relative",
                    overflow: "hidden",
                    transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
                  }}
                >
                  <div style={{
                    position: "absolute",
                    top: "-50%", left: "-50%",
                    width: "200%", height: "200%",
                    background: "radial-gradient(circle at center, rgba(59,130,246,0.05) 0%, transparent 70%)",
                    pointerEvents: "none",
                  }} />
                  
                  <div style={{ 
                    fontSize: "2.25rem", 
                    fontWeight: 200, 
                    color: "#60a5fa", 
                    marginBottom: "0.5rem", 
                    letterSpacing: "0.05em",
                    textShadow: "0 0 20px rgba(96,165,250,0.4)"
                  }}>
                    {s.value}
                  </div>
                  <div style={{ 
                    fontSize: "0.85rem", 
                    color: "#94a3b8", 
                    letterSpacing: "0.15em", 
                    textTransform: "uppercase",
                    fontWeight: 400
                  }}>
                    {s.label}
                  </div>
                  <div className="cn-card-border-glow" />
                </div>
              </RevealSection>
            ))}
          </div>
        </div>

        {/* 우측 뉴런 장식: 배경 섹션은 더 깊은 연결 느낌 */}
        <div style={{ flex: 1, height: "500px", position: "relative" }}>
          <NeuralSynapseVisual mode="deep" color="147, 197, 253" opacity={0.4} />
        </div>
      </div>
    </section>
  );
}

function PerformanceSection() {
  const mriItems = [
    { name: "Vessel 3D", score: "96.8%", color: "#6ae3af" },
    { name: "Aneurysm",  score: "97.3%", color: "#6ae3af" },
    { name: "Stenosis",  score: "94.1%", color: "#6ae3af" },
    { name: "Infarction",score: "95.5%", color: "#6ae3af" },
    { name: "Carotid Vessel 3D", score: "93.7%", color: "#6ae3af" },
  ];
  const ctItems = [
    { name: "Hemorrhage", score: "98.2%", color: "#b29de2" },
    { name: "Vessel 3D",  score: "95.6%", color: "#b29de2" },
  ];

  return (
    <section id="performance" style={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <div style={{ display: "flex", width: "100%", alignItems: "center", gap: "4rem" }}>
        <div style={{ flex: 1, maxWidth: "42rem", width: "100%" }}>
          <RevealSection>
            <SectionLabel>Performance</SectionLabel>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300, color: "#e2e8f0", lineHeight: 1.2, marginBottom: "1.5rem", letterSpacing: "0.05em" }}>
              임상 검증 성능 지표
            </h2>
            <Divider />
          </RevealSection>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginTop: "0.5rem" }}>
            {/* Brain MRI */}
            <div>
              <RevealSection style={{ transitionDelay: "0.1s" }}>
                <h3 style={{ color: "#6ae3af", fontSize: "0.875rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1rem" }}>Brain MRI</h3>
              </RevealSection>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {mriItems.map((item, i) => (
                  <RevealSection key={item.name} style={{ transitionDelay: `${0.15 + i * 0.08}s` }}>
                    <PerformanceBar item={item} />
                  </RevealSection>
                ))}
              </div>
            </div>

            {/* Brain CT */}
            <div>
              <RevealSection style={{ transitionDelay: "0.1s" }}>
                <h3 style={{ color: "#b29de2", fontSize: "0.875rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1rem" }}>Brain CT</h3>
              </RevealSection>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {ctItems.map((item, i) => (
                  <RevealSection key={item.name} style={{ transitionDelay: `${0.15 + i * 0.08}s` }}>
                    <PerformanceBar item={item} />
                  </RevealSection>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* 우측 뉴런 장식: 성능 섹션은 빠른 신호 전달 느낌 */}
        <div style={{ flex: 1, height: "400px", position: "relative" }}>
          <NeuralSynapseVisual mode="fast" color="110, 227, 175" opacity={0.5} />
        </div>
      </div>
    </section>
  );
}

function PerformanceBar({ item }: { item: { name: string; score: string; color: string } }) {
  const percent = parseFloat(item.score);
  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => { el.style.width = item.score; }, 100);
      }
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [item.score]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
        <span style={{ color: "#cbd5e1", fontSize: "0.875rem" }}>{item.name}</span>
        <span style={{ color: item.color, fontSize: "0.875rem", fontWeight: 500 }}>{item.score}</span>
      </div>
      <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.04)", overflow: "hidden", position: "relative" }}>
        <div
          ref={barRef}
          style={{
            height: "100%",
            width: "0%",
            borderRadius: 2,
            background: `linear-gradient(to right, ${item.color}40, ${item.color})`,
            transition: "width 1.5s cubic-bezier(0.4,0,0.2,1)",
            boxShadow: `0 0 12px ${item.color}60`,
            position: "relative",
          }}
        >
          {/* 바 위의 이동하는 빛줄기 효과 */}
          <div 
            style={{
              position: "absolute",
              top: 0, left: 0, bottom: 0, width: "30%",
              background: "linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent)",
              animation: "cn-bar-shine 3s infinite linear",
            }}
          />
        </div>
      </div>
    </div>
  );
}

function TestRequestSection() {
  return (
    <section id="test-request" style={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <div style={{ display: "flex", width: "100%", alignItems: "center", gap: "4rem" }}>
        <div style={{ flex: 1, maxWidth: "42rem" }}>
          <RevealSection>
            <SectionLabel>Personal Test Request</SectionLabel>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300, color: "#e2e8f0", lineHeight: 1.2, marginBottom: "1.5rem", letterSpacing: "0.05em" }}>
              개인용 AI 신경영상 분석 신청
            </h2>
            <Divider />
          </RevealSection>
          
          <RevealSection style={{ transitionDelay: "0.1s" }}>
            <div style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px dashed rgba(96,165,250,0.3)",
              borderRadius: "1.25rem",
              padding: "3rem 2rem",
              textAlign: "center",
              marginBottom: "2rem",
              cursor: "pointer",
            }}>
              <div style={{ color: "#60a5fa", marginBottom: "1rem" }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                </svg>
              </div>
              <p style={{ color: "#e2e8f0", fontSize: "1.1rem", marginBottom: "0.5rem" }}>MRI 또는 CT 데이터를 드래그하세요</p>
              <p style={{ color: "#64748b", fontSize: "0.9rem" }}>DICOM, NIfTI 형식 지원 (최대 500MB)</p>
            </div>
          </RevealSection>

          <RevealSection style={{ transitionDelay: "0.2s" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", gap: "1rem" }}>
                <input type="text" placeholder="이름" style={{ flex: 1, padding: "0.875rem 1.25rem", borderRadius: "0.75rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", outline: "none" }} />
                <input type="email" placeholder="이메일" style={{ flex: 1, padding: "0.875rem 1.25rem", borderRadius: "0.75rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", outline: "none" }} />
              </div>
              <button style={{
                padding: "1rem", borderRadius: "0.75rem",
                background: "linear-gradient(to right, #2563eb, #7c3aed)",
                color: "white", fontWeight: 600, border: "none", cursor: "pointer",
                boxShadow: "0 0 20px rgba(37,99,235,0.3)"
              }}>
                분석 요청하기
              </button>
            </div>
          </RevealSection>
        </div>

        {/* 우측 뉴런 장식: 분석 완료 시의 활발한 뇌 활동 느낌 */}
        <div style={{ flex: 1, height: "500px", position: "relative" }}>
          <NeuralSynapseVisual mode="fast" color="124, 58, 237" opacity={0.6} />
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="contact" style={{ minHeight: "60vh", display: "flex", alignItems: "center" }}>
      <div style={{ display: "flex", width: "100%", alignItems: "center", gap: "4rem" }}>
        <div style={{ flex: 1, maxWidth: "38rem" }}>
          <RevealSection>
            <SectionLabel>Contact</SectionLabel>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300, color: "#e2e8f0", lineHeight: 1.2, marginBottom: "1.5rem", letterSpacing: "0.05em" }}>
              도입 문의 및 시연 요청
            </h2>
            <Divider />
          </RevealSection>
          <RevealSection style={{ transitionDelay: "0.1s" }}>
            <p style={{ color: "#94a3b8", lineHeight: 1.85, fontSize: "1.05rem", fontWeight: 300, marginBottom: "2rem" }}>
              병원 및 연구기관을 대상으로 파일럿 프로그램을 운영 중입니다. 데모 신청 및 기술 협력 문의는 아래로 연락해 주세요.
            </p>
            <a
              href="mailto:contact@clarus-n.ai"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.875rem 2rem",
                borderRadius: "0.75rem",
                background: "rgba(59,130,246,0.15)",
                border: "1px solid rgba(96,165,250,0.3)",
                color: "#93c5fd",
                fontSize: "0.95rem",
                textDecoration: "none",
                letterSpacing: "0.05em",
                transition: "background 0.2s ease, border-color 0.2s ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(59,130,246,0.25)";
                e.currentTarget.style.borderColor = "rgba(96,165,250,0.6)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(59,130,246,0.15)";
                e.currentTarget.style.borderColor = "rgba(96,165,250,0.3)";
              }}
            >
              contact@clarus-n.ai
            </a>
          </RevealSection>
        </div>
        
        <div style={{ flex: 1, height: "300px", position: "relative" }}>
          <NeuralSynapseVisual mode="calm" color="148, 163, 184" opacity={0.3} />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   메인 페이지
───────────────────────────────────────────── */
const NAV_SECTIONS = ["about", "background", "performance", "test-request", "contact"] as const;
type SectionId = typeof NAV_SECTIONS[number];

export default function ClarusNPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState<SectionId | "">("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  // 스크롤 위치 추적 → 현재 섹션 결정
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const observers: IntersectionObserver[] = [];
    NAV_SECTIONS.forEach(id => {
      const el = container.querySelector(`#${id}`);
      if (!el) return;
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { root: container, threshold: 0.35 }
      );
      io.observe(el);
      observers.push(io);
    });

    return () => observers.forEach(io => io.disconnect());
  }, []);

  // 메뉴 클릭 → 해당 섹션으로 부드럽게 스크롤
  const handleNavClick = useCallback((id: string) => {
    const container = scrollRef.current;
    if (!container) return;
    const el = container.querySelector(`#${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#030712",
        fontFamily: "'Inter', sans-serif",
        color: "#e2e8f0",
        position: "relative",
      }}
    >
      <ClarusCursor />

      {/* 스크롤 영역 */}
      <div
        ref={scrollRef}
        className="cn-sidebar-scroll"
        style={{
          position: "absolute",
          top: 0, bottom: 0, right: 0,
          left: isSidebarOpen ? "340px" : "0px",
          overflowY: "scroll",
          overflowX: "hidden",
          zIndex: 10,
          backgroundColor: "#030712",
          transition: "left 500ms cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <HeroSection />
        <div style={{ paddingLeft: "7rem", paddingRight: "4rem" }}>
          <AboutSection />
          <BackgroundSection />
          <PerformanceSection />
          <TestRequestSection />
          <ContactSection />
          <footer style={{
            padding: "2rem 0",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            color: "#334155",
            fontSize: "0.8rem",
            letterSpacing: "0.08em",
          }}>
            © 2024 CLARUS-N · AI for Unlocking Neuroimages
          </footer>
        </div>
      </div>

      {/* 메뉴 열기 버튼 */}
      <button
        onClick={toggleSidebar}
        aria-label="메뉴 열기"
        style={{
          position: "fixed",
          top: "2rem", left: "2rem",
          zIndex: 40,
          padding: "0.75rem",
          borderRadius: "0.75rem",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(12px)",
          color: "white",
          cursor: "none",
          opacity: isSidebarOpen ? 0 : 1,
          pointerEvents: isSidebarOpen ? "none" : "auto",
          transition: "opacity 0.3s ease, background 0.2s ease",
        }}
        onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
        onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* 사이드바 */}
      <ClarusSidebar
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
        activeSection={activeSection}
        onNavClick={handleNavClick}
      />
    </div>
  );
}
