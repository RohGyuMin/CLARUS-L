"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface LegalModalProps {
  children: ReactNode;
  confirmLabel?: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
}

export default function LegalModal({
  children,
  confirmLabel,
  isOpen,
  onClose,
  onConfirm,
  title,
}: LegalModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        background: "radial-gradient(ellipse at center, rgba(3,7,20,0.68) 0%, rgba(0,0,0,0.82) 100%)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{
          width: "min(680px, 100%)",
          maxHeight: "86vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: "1.25rem",
          overflow: "hidden",
          background: "linear-gradient(160deg, rgba(8,14,32,0.99) 0%, rgba(5,10,24,0.99) 100%)",
          outline: "1px solid transparent",
          boxShadow: `
            0 0 0 1px rgba(96,165,250,0.28),
            0 24px 70px rgba(0,0,0,0.72),
            inset 0 1px 0 rgba(255,255,255,0.06)
          `,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            padding: "1rem 1.25rem",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(4,8,20,0.65)",
            backdropFilter: "blur(8px)",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", minWidth: 0 }}>
            <span
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "999px",
                background: "#60a5fa",
                boxShadow: "0 0 14px rgba(96,165,250,0.95)",
                flexShrink: 0,
              }}
            />
            <h4
              style={{
                margin: 0,
                color: "#e2e8f0",
                fontSize: "1rem",
                fontWeight: 700,
                fontFamily: "'HYGraphic', 'Inter', sans-serif",
                letterSpacing: "0.01em",
              }}
            >
              {title}
            </h4>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "0.6rem",
              border: "1px solid rgba(255,255,255,0.07)",
              background: "rgba(255,255,255,0.03)",
              color: "rgba(148,163,184,0.75)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div
          style={{
            overflowY: "auto",
            padding: "1.35rem 1.35rem 1.25rem",
            color: "#94a3b8",
            fontSize: "0.92rem",
            lineHeight: 1.75,
          }}
        >
          {children}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.75rem",
            padding: "0 1.35rem 1.35rem",
            flexShrink: 0,
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              minWidth: "92px",
              padding: "0.8rem 1rem",
              borderRadius: "0.8rem",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.03)",
              color: "#cbd5e1",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            닫기
          </button>
          {onConfirm && (
            <button
              type="button"
              onClick={onConfirm}
              style={{
                minWidth: "110px",
                padding: "0.8rem 1rem",
                borderRadius: "0.8rem",
                border: "1px solid rgba(96,165,250,0.35)",
                background: "linear-gradient(135deg, rgba(59,130,246,0.18) 0%, rgba(37,99,235,0.28) 100%)",
                color: "#bfdbfe",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 8px 18px rgba(37,99,235,0.16)",
              }}
            >
              {confirmLabel ?? "확인"}
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
