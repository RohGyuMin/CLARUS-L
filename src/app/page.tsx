"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import ClarusSidebar from "@/components/ClarusSidebar";
import ClarusCursor from "@/components/ClarusCursor";
import LegalModal from "@/components/LegalModal";
import NeuralSynapseVisual from "@/components/NeuralSynapseVisual";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection, AboutStrengthsSection } from "@/components/sections/AboutSection";
import { BackgroundSection } from "@/components/sections/BackgroundSection";
import { PerformanceSection } from "@/components/sections/PerformanceSection";
import { TestRequestSection } from "@/components/sections/TestRequestSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { Footer } from "@/components/sections/Footer";

/* ─────────────────────────────────────────────
   메인 페이지
───────────────────────────────────────────── */
const NAV_SECTIONS = ["about", "about-strengths", "background", "performance", "test-request", "contact"] as const;
type SectionId = typeof NAV_SECTIONS[number];
const SNAP_SECTION_IDS = ["hero", "about", "about-strengths", "background", "performance", "test-request", "contact"];

type LegalModalKey = "privacy" | "terms" | "email-refusal";

export default function ClarusNPage() {
  const [showIntro, setShowIntro] = useState(true);
  const [isIntroEnding, setIsIntroEnding] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCompactLayout, setIsCompactLayout] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [performancePageIndex, setPerformancePageIndex] = useState(0);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [activeLegalModal, setActiveLegalModal] = useState<LegalModalKey | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isSnapScrolling = useRef(false);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  // 화면 너비가 좁아지면 모바일/태블릿 레이아웃으로 전환
  useEffect(() => {
    const updateLayoutMode = () => setIsCompactLayout(window.innerWidth <= 1024);
    updateLayoutMode();
    window.addEventListener("resize", updateLayoutMode);
    return () => window.removeEventListener("resize", updateLayoutMode);
  }, []);

  // 모바일/태블릿 진입 시 사이드바를 기본 닫힘으로 전환
  useEffect(() => {
    if (isCompactLayout) {
      setIsSidebarOpen(false);
    }
  }, [isCompactLayout]);

  // 스크롤 위치 추적 → 현재 활성 섹션(Sidebar 강조용) 파악
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let rafId: number | null = null;

    const updateActiveSection = () => {
      const containerRect = container.getBoundingClientRect();
      let next: SectionId = NAV_SECTIONS[0];
      let closestDistance = Number.POSITIVE_INFINITY;

      for (const id of NAV_SECTIONS) {
        const el = container.querySelector(`#${id}`) as HTMLElement | null;
        if (!el) continue;

        const top = el.getBoundingClientRect().top - containerRect.top;
        const distance = Math.abs(top);

        if (distance < closestDistance) {
          closestDistance = distance;
          next = id;
        }
      }

      setActiveSection(prev => (prev === next ? prev : next));
    };

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        updateActiveSection();
        rafId = null;
      });
    };

    updateActiveSection();
    container.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      container.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateActiveSection);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, []);

  // 메뉴 클릭 → 해당 섹션으로 부드럽게 스크롤
  const handleNavClick = useCallback((id: string) => {
    const container = scrollRef.current;
    if (!container) return;
    setActiveSection(id);
    const el = container.querySelector(`#${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // 서브 메뉴 클릭 → 퍼포먼스 탭 인덱스 변경 및 스크롤
  const handleSubNavClick = useCallback((index: number) => {
    setPerformancePageIndex(index);
    handleNavClick("performance");
  }, [handleNavClick]);

  const introVideoRef = useRef<HTMLVideoElement>(null);
  const hasTriggeredTransition = useRef(false);
  const introTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => { introTimers.current.forEach(clearTimeout); };
  }, []);

  // 인트로 종료 프로세스 (2초 대기 후 페이드 아웃)
  const startIntroTransition = useCallback(() => {
    if (hasTriggeredTransition.current) return;
    hasTriggeredTransition.current = true;

    const video = introVideoRef.current;
    if (video) video.pause();

    const t1 = setTimeout(() => {
      setIsIntroEnding(true);
      const t2 = setTimeout(() => setShowIntro(false), 1200);
      introTimers.current.push(t2);
    }, 2000);
    introTimers.current.push(t1);
  }, []);

  // 즉시 종료 (Skip 버튼용)
  const handleSkipIntro = useCallback(() => {
    setIsIntroEnding(true);
    const t = setTimeout(() => setShowIntro(false), 1200);
    introTimers.current.push(t);
  }, []);

  // 섹션 스냅 스크롤 (휠 조작 시 섹션 단위 이동)
  useEffect(() => {
    if (showIntro) return;
    const container = scrollRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      const maxScrollTop = container.scrollHeight - container.clientHeight;
      const atTop = container.scrollTop <= 0;
      const atBottom = container.scrollTop >= maxScrollTop - 2;

      if ((atTop && e.deltaY < 0) || (atBottom && e.deltaY > 0)) {
        e.preventDefault();
        return;
      }

      if (isSnapScrolling.current) {
        e.preventDefault();
        return;
      }

      const sections = SNAP_SECTION_IDS
        .map(id => container.querySelector(`#${id}`) as HTMLElement | null)
        .filter(Boolean) as HTMLElement[];

      const containerRect = container.getBoundingClientRect();
      const positions = sections.map(el => el.getBoundingClientRect().top - containerRect.top);

      let currentIdx = 0;
      for (let i = 0; i < positions.length; i++) {
        if (positions[i] <= 50) currentIdx = i;
      }

      const direction = e.deltaY > 0 ? 1 : -1;
      const nextIdx = Math.max(0, Math.min(sections.length - 1, currentIdx + direction));

      if (nextIdx === currentIdx) return;

      e.preventDefault();
      isSnapScrolling.current = true;

      sections[nextIdx].scrollIntoView({ behavior: "smooth", block: "start" });

      setTimeout(() => { isSnapScrolling.current = false; }, 1000);
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [showIntro]);


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

      {/* 인트로 영상 오버레이 */}
      {showIntro && (
        <div
          className={`cn-intro-overlay ${isIntroEnding ? 'ending' : ''}`}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10000,
            backgroundColor: "#030712",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden"
          }}
        >
          <video
            ref={introVideoRef}
            src="/intro_new.mp4"
            autoPlay
            muted
            playsInline
            onEnded={startIntroTransition}
            onError={handleSkipIntro}
            onCanPlayThrough={() => {
              introVideoRef.current?.play().catch(handleSkipIntro);
            }}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
          />
          {/* Skip 버튼 */}
          <button
            onClick={handleSkipIntro}
            style={{
              position: "absolute",
              bottom: "3rem",
              right: "3rem",
              padding: "0.6rem 1.5rem",
              borderRadius: "2rem",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "rgba(255,255,255,0.6)",
              fontSize: "0.8rem",
              letterSpacing: "0.2em",
              cursor: "pointer",
              backdropFilter: "blur(10px)",
              transition: "all 0.3s ease",
              zIndex: 10001
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              e.currentTarget.style.color = "rgba(255,255,255,0.6)";
            }}
          >
            SKIP INTRO
          </button>
        </div>
      )}

      {/* 메인 콘텐츠 */}
      <div
        className={isIntroEnding ? "cn-main-reveal" : ""}
        style={{
          position: "absolute",
          inset: 0,
          opacity: isIntroEnding ? 1 : 0,
          pointerEvents: showIntro ? "none" : "auto",
        }}
      >
        <div
          ref={scrollRef}
          className="cn-sidebar-scroll"
          style={{
            position: "absolute",
            top: 0, bottom: 0, left: 0, right: 0,
            overflowY: "scroll",
            overflowX: "hidden",
            overscrollBehaviorY: "contain",
            zIndex: 10,
            backgroundColor: "#030712",
            paddingLeft: isSidebarOpen && !isCompactLayout ? "340px" : "0px",
            paddingBottom: "0px",
            transition: "padding-left 500ms cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          {/* 전역 배경 레이어 */}
          <div style={{
            position: "fixed",
            inset: 0,
            zIndex: -1,
            pointerEvents: "none",
            opacity: 0.25
          }}>
            <NeuralSynapseVisual mode="calm" color="147, 197, 253" opacity={0.3} />
          </div>

          <HeroSection />
          {/* 본문 컨텐츠 컨테이너 */}
          <div
            className="cn-content-padding"
            style={{
              maxWidth: "1440px",
              margin: "0 auto",
              paddingLeft: "calc(min(7rem, 8vw) - 1cm)",
              paddingRight: "min(4rem, 5vw)",
              position: "relative",
            }}
          >
            <AboutSection isCompactLayout={isCompactLayout} />
            <AboutStrengthsSection />
            <BackgroundSection />
            <PerformanceSection pageIndex={performancePageIndex} setPageIndex={setPerformancePageIndex} isCompactLayout={isCompactLayout} />
            <TestRequestSection />
            <ContactSection
              onOpenPrivacy={() => setActiveLegalModal("privacy")}
              privacyAgreed={privacyAgreed}
              setPrivacyAgreed={setPrivacyAgreed}
              isCompactLayout={isCompactLayout}
            />
            <Footer
              onOpenEmailRefusal={() => setActiveLegalModal("email-refusal")}
              onOpenPrivacy={() => setActiveLegalModal("privacy")}
              onOpenTerms={() => setActiveLegalModal("terms")}
              isCompactLayout={isCompactLayout}
            />
          </div>

          <LegalModal
            isOpen={activeLegalModal === "privacy"}
            title="개인정보 처리방침"
            onClose={() => setActiveLegalModal(null)}
            confirmLabel="확인했습니다"
            onConfirm={() => {
              setPrivacyAgreed(true);
              setActiveLegalModal(null);
            }}
          >
            <p style={{ marginTop: 0 }}>
              CLARUS-N은 고객님의 소중한 개인정보를 보호하기 위해 최선을 다하고 있습니다.
            </p>
            <h5 style={{ color: "#cbd5e1", marginBottom: "0.5rem", fontSize: "0.95rem" }}>1. 수집하는 개인정보 항목</h5>
            <p style={{ marginBottom: "1.25rem" }}>이름, 지역, 기관명/병원명, 직함, 이메일 주소, 연락처, 문의내용</p>
            <h5 style={{ color: "#cbd5e1", marginBottom: "0.5rem", fontSize: "0.95rem" }}>2. 수집 및 이용목적</h5>
            <p style={{ marginBottom: "1.25rem" }}>서비스 이용에 따른 본인확인, 원활한 의사소통 경로 확보, 최신 정보 안내 및 문의사항 응대</p>
            <h5 style={{ color: "#cbd5e1", marginBottom: "0.5rem", fontSize: "0.95rem" }}>3. 보유 및 이용기간</h5>
            <p style={{ marginBottom: 0 }}>수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 관련 법령의 규정에 의하여 보존할 필요가 있는 경우 해당 기간 동안 보관합니다.</p>
          </LegalModal>

          <LegalModal
            isOpen={activeLegalModal === "terms"}
            title="이용약관"
            onClose={() => setActiveLegalModal(null)}
          >
            <p style={{ marginTop: 0 }}>
              본 서비스는 연구 목적의 AI 분석 웹사이트로 제공되며, 다음과 같은 조건을 따릅니다.
            </p>
            <ol style={{ paddingLeft: "1.2rem", margin: "1rem 0 1.25rem" }}>
              <li style={{ marginBottom: "0.75rem" }}>서비스 내용, 구성, 기능은 예고 없이 변경되거나 중단될 수 있습니다.</li>
              <li style={{ marginBottom: "0.75rem" }}>이용자는 정확한 정보를 입력하고, 시스템을 비정상적으로 사용해서는 안 됩니다.</li>
              <li style={{ marginBottom: "0.75rem" }}>분석 결과는 참고용이며, 최종 의료 판단은 담당 전문의의 책임 하에 이루어져야 합니다.</li>
              <li style={{ marginBottom: "0.75rem" }}>서비스와 관련된 콘텐츠 및 디자인의 권리는 CLARUS-N에 있습니다.</li>
              <li>문의 및 협업 요청은 지정된 문의 채널을 통해 진행해 주세요.</li>
            </ol>
            <p style={{ marginBottom: 0 }}>
              본 서비스를 이용함으로써 위 약관에 동의한 것으로 간주됩니다.
            </p>
          </LegalModal>

          <LegalModal
            isOpen={activeLegalModal === "email-refusal"}
            title="이메일 무단 수집 거부"
            onClose={() => setActiveLegalModal(null)}
          >
            <p style={{ marginTop: 0 }}>
              본 웹사이트에 게시된 이메일 주소가 전자우편 수집 프로그램이나 그 밖의 기술적 장치를 이용하여 무단으로 수집되는 것을 거부합니다.
            </p>
            <p style={{ marginBottom: "1.25rem" }}>
              이를 위반할 경우 정보통신망 이용촉진 및 정보보호 등에 관한 법률에 따라 처벌받을 수 있습니다.
            </p>
            <p style={{ marginBottom: 0 }}>
              문의는 사이트의 문의 폼 또는 안내된 공식 연락처를 이용해 주세요.
            </p>
          </LegalModal>
        </div>

        {isCompactLayout && isSidebarOpen && (
          <button
            aria-label="사이드바 닫기"
            onClick={toggleSidebar}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 38,
              border: "none",
              background: "rgba(2, 6, 23, 0.55)",
              backdropFilter: "blur(2px)",
              cursor: "pointer",
            }}
          />
        )}

        {/* 메뉴 열기 버튼 - PC 전용 */}
        {!isCompactLayout && (
          <button
            onClick={toggleSidebar}
            aria-label="메뉴 열기"
            style={{
              position: "fixed",
              top: "2rem",
              left: "2rem",
              zIndex: 40,
              padding: "0.75rem",
              borderRadius: "0.75rem",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(12px)",
              color: "white",
              cursor: "pointer",
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
        )}

        {/* 사이드바 */}
        <ClarusSidebar
          isOpen={isSidebarOpen}
          isMobile={isCompactLayout}
          onToggle={toggleSidebar}
          activeSection={activeSection}
          onNavClick={handleNavClick}
          onSubNavClick={handleSubNavClick}
        />
      </div>
    </div>
  );
}
