import React from "react";

/**
 * Floating dot 박스 공통 규격 (Background 페이지 박스 기준)
 * - 크기: 600 × 420
 * - 가로: 섹션 오른쪽 끝에 맞춤 (1920×1080, 사이드바 열림 기준 x = 1186)
 * - 세로: 화면 중앙보다 74px 아래가 박스 중앙 → top = 50vh - 136px (1080 높이 기준 y = 404)
 * 모든 섹션에서 같은 좌표에 오도록 섹션(position: relative)의 직계 자식으로 둔다.
 */
export const DOT_BOX_WIDTH = 600;
export const DOT_BOX_HEIGHT = 420;
export const DOT_BOX_TOP = "calc(50vh - 136px)";

/** 가운데 작은 박스(카드) 공통 폭: Performance 'MRA AI for Vessel reconstruction' 카드 폭 = 648px */
export const SMALL_BOX_WIDTH = "40.5rem";

/** 왼쪽 콘텐츠 열과 박스 사이 간격 (648 + 48 + 600 ≤ 1302) */
export const DOT_BOX_GAP = "3rem";

export default function FloatingDotBox({
  children,
  style,
  hideOnCompact = true,
  onClick,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  /** 1024px 이하(세로 배치)에서 숨김 */
  hideOnCompact?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}) {
  return (
    <div
      onClick={onClick}
      className={hideOnCompact ? "cn-floating-dot-box" : undefined}
      style={{
        position: "absolute",
        right: 0,
        top: DOT_BOX_TOP,
        width: `${DOT_BOX_WIDTH}px`,
        height: `${DOT_BOX_HEIGHT}px`,
        zIndex: 0,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** 박스 안에서 점 캔버스가 박스 전체를 채우도록 하는 레이어 */
export function DotLayer({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", ...style }}>
      {children}
    </div>
  );
}

/** 박스 정중앙 안내 문구 (Publications 페이지와 같은 배치) */
export function DotBoxPrompt({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "0.75rem",
        pointerEvents: "none",
        zIndex: 2,
        textAlign: "center",
      }}
    >
      {children}
    </div>
  );
}

/** 레이아웃 자리 확보용 (좁은 화면에서 왼쪽 콘텐츠가 박스와 겹치지 않게) */
export function DotBoxSpacer() {
  return <div aria-hidden style={{ width: `${DOT_BOX_WIDTH}px`, flexShrink: 0 }} />;
}
