"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";

interface PdfModalProps {
  src: string;
  title: string;
  onClose: () => void;
}

export default function PdfModal({ src, title, onClose }: PdfModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const scale = 1.5;
  const [isLoading, setIsLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfDocRef = useRef<any>(null);

  const renderPage = useCallback(async (pageNum: number, sc: number) => {
    const pdfDoc = pdfDocRef.current;
    if (!pdfDoc || !canvasRef.current) return;
    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale: sc });
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: ctx, viewport }).promise;
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setIsLoading(true);
      setCurrentPage(1);
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      const pdf = await pdfjsLib.getDocument(src).promise;
      if (cancelled) return;
      pdfDocRef.current = pdf;
      setTotalPages(pdf.numPages);
      await renderPage(1, scale);
      setIsLoading(false);
    }
    load().catch(console.error);
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  useEffect(() => {
    if (!pdfDocRef.current || isLoading) return;
    renderPage(currentPage, scale);
  }, [currentPage, scale, isLoading, renderPage]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" || e.key === "ArrowDown") setCurrentPage(p => Math.min(p + 1, totalPages));
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")   setCurrentPage(p => Math.max(p - 1, 1));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, totalPages]);

  const progress = totalPages > 1 ? (currentPage - 1) / (totalPages - 1) : 1;

  return createPortal(
    /* ── 배경 오버레이 ── */
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        animation: "fadeIn 0.22s ease",
        /* 방사형 비네트 + 블러 */
        background: "radial-gradient(ellipse at center, rgba(3,7,20,0.62) 0%, rgba(0,0,0,0.8) 100%)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      /* ── 모달 패널 ── */
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          width: "min(860px, 100%)",
          maxHeight: "90vh",
          borderRadius: "1.5rem",
          overflow: "hidden",
          animation: "slideUp 0.28s cubic-bezier(0.34,1.2,0.64,1)",
          /* 그라디언트 테두리 효과 (pseudo 대신 outline + box-shadow 조합) */
          outline: "1px solid transparent",
          boxShadow: `
            0 0 0 1px rgba(99,102,241,0.35),
            0 0 40px rgba(59,130,246,0.12),
            0 60px 120px rgba(0,0,0,0.8),
            inset 0 1px 0 rgba(255,255,255,0.07)
          `,
          background: "linear-gradient(160deg, rgba(8,14,32,0.99) 0%, rgba(5,10,24,0.99) 100%)",
        }}
      >
        {/* 상단 글로우 라인 */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: "2px",
          background: "linear-gradient(90deg, transparent 0%, #6366f1 30%, #60a5fa 55%, #a855f7 80%, transparent 100%)",
          zIndex: 1,
        }} />

        {/* ── 헤더 ── */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.1rem 1.5rem",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          background: "rgba(4,8,20,0.6)",
          backdropFilter: "blur(8px)",
          flexShrink: 0,
          zIndex: 1,
        }}>
          {/* 제목 */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div style={{
              width: "28px", height: "28px",
              borderRadius: "0.5rem",
              background: "linear-gradient(135deg, rgba(99,102,241,0.3) 0%, rgba(168,85,247,0.3) 100%)",
              border: "1px solid rgba(99,102,241,0.4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.8rem",
            }}>
              {title.startsWith("🔍") ? "🔍" : "📎"}
            </div>
            <span style={{
              color: "#e2e8f0",
              fontSize: "0.92rem",
              fontWeight: 600,
              fontFamily: "'HYGraphic', sans-serif",
              letterSpacing: "0.02em",
            }}>
              {title.replace(/^[🔍📎]\s*/, "")}
            </span>
            {!isLoading && totalPages > 0 && (
              <span style={{
                fontSize: "0.72rem",
                color: "rgba(148,163,184,0.45)",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "0.9rem",
                padding: "0.1rem 0.55rem",
                letterSpacing: "0.05em",
              }}>
                {totalPages}p
              </span>
            )}
          </div>

          {/* 우측 컨트롤 */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {/* 다운로드 */}
            <a
              href={src}
              download
              title="PDF 다운로드"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
                fontSize: "0.78rem",
                fontWeight: 500,
                color: "rgba(148,163,184,0.5)",
                textDecoration: "none",
                padding: "0.32rem 0.7rem",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "0.55rem",
                background: "rgba(255,255,255,0.03)",
                transition: "all 0.18s ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = "#93c5fd";
                e.currentTarget.style.borderColor = "rgba(96,165,250,0.35)";
                e.currentTarget.style.background = "rgba(96,165,250,0.08)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = "rgba(148,163,184,0.5)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              저장
            </a>

            {/* 닫기 */}
            <button
              onClick={onClose}
              title="닫기 (ESC)"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "30px",
                height: "30px",
                borderRadius: "0.55rem",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                color: "rgba(148,163,184,0.5)",
                cursor: "pointer",
                fontSize: "0.9rem",
                transition: "all 0.18s ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(239,68,68,0.15)";
                e.currentTarget.style.borderColor = "rgba(239,68,68,0.35)";
                e.currentTarget.style.color = "#f87171";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                e.currentTarget.style.color = "rgba(148,163,184,0.5)";
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* ── 캔버스 ── */}
        <div style={{
          flex: 1,
          overflow: "auto",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "2rem",
          background: "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.06) 0%, transparent 60%), rgba(5,10,22,0.7)",
        }}>
          {isLoading ? (
            /* 로딩 스피너 */
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
              minHeight: "340px",
            }}>
              <div style={{
                width: "36px", height: "36px",
                borderRadius: "50%",
                border: "2px solid rgba(99,102,241,0.15)",
                borderTop: "2px solid #6366f1",
                animation: "spin 0.8s linear infinite",
              }} />
              <span style={{ color: "rgba(148,163,184,0.4)", fontSize: "0.82rem", letterSpacing: "0.08em" }}>
                불러오는 중
              </span>
            </div>
          ) : (
            <canvas
              ref={canvasRef}
              style={{
                maxWidth: "100%",
                borderRadius: "0.75rem",
                boxShadow: "0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)",
                display: "block",
              }}
            />
          )}
        </div>

        {/* ── 하단 네비게이션 ── */}
        {!isLoading && totalPages > 0 && (
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.85rem 1.5rem",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            background: "rgba(4,8,20,0.7)",
            backdropFilter: "blur(8px)",
            flexShrink: 0,
            gap: "1rem",
          }}>
            {/* 이전 */}
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage <= 1}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.5rem 1rem",
                borderRadius: "0.65rem",
                fontSize: "0.82rem",
                fontWeight: 600,
                border: "1px solid",
                cursor: currentPage <= 1 ? "default" : "pointer",
                transition: "all 0.18s ease",
                borderColor: currentPage <= 1 ? "rgba(255,255,255,0.05)" : "rgba(99,102,241,0.3)",
                background: currentPage <= 1 ? "rgba(255,255,255,0.02)" : "rgba(99,102,241,0.08)",
                color: currentPage <= 1 ? "rgba(148,163,184,0.2)" : "#a5b4fc",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              이전
            </button>

            {/* 중앙: 진행바 + 페이지 */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.45rem" }}>
              {totalPages > 1 && (
                <div style={{
                  width: "100%",
                  height: "3px",
                  borderRadius: "2px",
                  background: "rgba(255,255,255,0.06)",
                  overflow: "hidden",
                }}>
                  <div style={{
                    height: "100%",
                    width: `${progress * 100}%`,
                    background: "linear-gradient(90deg, #6366f1, #60a5fa)",
                    borderRadius: "2px",
                    transition: "width 0.3s ease",
                  }} />
                </div>
              )}
              <span style={{
                fontSize: "0.75rem",
                color: "rgba(148,163,184,0.45)",
                letterSpacing: "0.08em",
                fontFamily: "'Inter', sans-serif",
              }}>
                {currentPage}
                {totalPages > 1 && <span style={{ opacity: 0.5 }}> / {totalPages}</span>}
              </span>
            </div>

            {/* 다음 */}
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage >= totalPages}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.5rem 1rem",
                borderRadius: "0.65rem",
                fontSize: "0.82rem",
                fontWeight: 600,
                border: "1px solid",
                cursor: currentPage >= totalPages ? "default" : "pointer",
                transition: "all 0.18s ease",
                borderColor: currentPage >= totalPages ? "rgba(255,255,255,0.05)" : "rgba(96,165,250,0.3)",
                background: currentPage >= totalPages ? "rgba(255,255,255,0.02)" : "rgba(96,165,250,0.08)",
                color: currentPage >= totalPages ? "rgba(148,163,184,0.2)" : "#93c5fd",
              }}
            >
              다음
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
