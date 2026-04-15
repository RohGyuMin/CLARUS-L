import React from "react";

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "0.5rem" }}>
      <span
        style={{
          display: "inline-block",
          fontSize: "1.2rem",
          letterSpacing: "0.05em",
          textTransform: "none",
          color: "#60a5fa",
          fontWeight: 600,
          fontFamily: "'Inter', sans-serif",
          textShadow: "0 0 20px rgba(96,165,250,0.3)",
        }}
      >
        {children}
      </span>
    </div>
  );
}
