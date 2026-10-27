"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Performance 박스 안에서 혈관 3D 모델을 직접 돌려보는 뷰어.
 * - three.js 는 이 컴포넌트가 처음 열릴 때만 불러옴 (홈페이지 첫 로딩에는 영향 없음)
 * - 모델: public/models/*.bin (CLV1 형식: 헤더 JSON + 위치(uint16 양자화)/인덱스/정점색 버퍼)
 * - 색과 조명은 3D Slicer 풍 혈관 리포트 뷰어와 동일 (혈관 녹색, 협착 청록, 파랑-보라 배경)
 */

type Group = {
  id: string; name: string; kind: "shell" | "solid"; default: number; note: string; color: string;
  lo: number[]; hi: number[]; posOff: number; posCount: number; idxOff: number; idxCount: number; i32: boolean;
  colOff?: number; colCount?: number;
};
export type ModelFinding = { title: string; rows: [string, string][]; focus?: number[] };
export type ModelInfo = {
  legend?: { label: string; color: string; count: number }[];
  findings?: { aneurysm?: ModelFinding[]; stenosis?: ModelFinding[] };
};
type Header = ModelInfo & { version: number; radius: number; stenosis: number[][]; groups: Group[] };

const DEFAULT_LEGEND = [{ label: "혈관", color: "#4f6b4f" }, { label: "협착", color: "#39abab" }];

const PRESETS: Record<string, Record<string, number>> = {
  all: { skin: 15, skull: 20, brain: 25, vessel: 100 },
  brain: { skin: 0, skull: 0, brain: 25, vessel: 100 },
  vessel: { skin: 0, skull: 0, brain: 0, vessel: 100 },
};

export async function loadModel(src: string): Promise<ArrayBuffer> {
  // 오프라인 미리보기(단일 HTML)용: 페이지에 모델이 미리 실려 있으면 그것을 사용
  const inline = (globalThis as { __CLARUS_MODELS__?: Record<string, string> }).__CLARUS_MODELS__?.[src];
  if (inline) {
    const gz = inline.startsWith("gz:"); // "gz:" + base64(gzip) 형식이면 압축을 풀어 사용
    const bin = atob(gz ? inline.slice(3) : inline), u8 = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
    if (!gz) return u8.buffer;
    return new Response(new Blob([u8]).stream().pipeThrough(new DecompressionStream("gzip"))).arrayBuffer();
  }
  const res = await fetch(src);
  if (!res.ok) throw new Error(`model ${res.status}`);
  return res.arrayBuffer();
}

export function parseModel(buf: ArrayBuffer): { header: Header; data: ArrayBuffer; base: number } {
  const dv = new DataView(buf);
  const magic = String.fromCharCode(dv.getUint8(0), dv.getUint8(1), dv.getUint8(2), dv.getUint8(3));
  if (magic !== "CLV1") throw new Error("bad model");
  const hlen = dv.getUint32(4, true);
  const header = JSON.parse(new TextDecoder().decode(new Uint8Array(buf, 8, hlen))) as Header;
  return { header, data: buf, base: 8 + hlen };
}

export default function Vessel3DViewer({ src, onLoaded }: { src: string; onLoaded?: (info: ModelInfo) => void }) {
  const onLoadedRef = useRef(onLoaded);
  useEffect(() => { onLoadedRef.current = onLoaded; }, [onLoaded]);
  const mountRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<{ preset: (k: string) => void; setAuto: (on: boolean) => void } | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [preset, setPreset] = useState("all");
  const [auto, setAuto] = useState(true);
  const [legend, setLegend] = useState<{ label: string; color: string }[]>(DEFAULT_LEGEND);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      try {
        const [THREE, { OrbitControls }, buf] = await Promise.all([
          import("three"),
          import("three/examples/jsm/controls/OrbitControls.js"),
          loadModel(src),
        ]);
        if (disposed) return;
        const { header, data, base } = parseModel(buf);

        // 리포트 뷰어(구버전 three.js)와 같은 색이 나오도록 색 관리를 예전 방식으로
        THREE.ColorManagement.enabled = false;
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setClearColor(0x000000, 0);
        renderer.domElement.style.cssText = "display:block;width:100%;height:100%;touch-action:none;cursor:grab";
        mount.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const R = header.radius;
        const camera = new THREE.PerspectiveCamera(30, 1, R * 0.1, R * 20);
        scene.add(camera);
        scene.add(new THREE.AmbientLight(0xffffff, 0.3 * Math.PI));
        const head = new THREE.DirectionalLight(0xffffff, 1.0 * Math.PI);
        head.position.set(0.3, 0.6, 1.0);
        camera.add(head); camera.add(head.target); head.target.position.set(0, 0, -1);

        const makeGeometry = (g: Group) => {
          const q = new Uint16Array(data, base + g.posOff, g.posCount);
          const p = new Float32Array(q.length);
          for (let i = 0; i < q.length; i++) { const a = i % 3; p[i] = g.lo[a] + (q[i] / 65535) * (g.hi[a] - g.lo[a]); }
          const geo = new THREE.BufferGeometry();
          geo.setAttribute("position", new THREE.BufferAttribute(p, 3));
          geo.setIndex(new THREE.BufferAttribute(g.i32 ? new Uint32Array(data, base + g.idxOff, g.idxCount) : new Uint16Array(data, base + g.idxOff, g.idxCount), 1));
          if (g.colOff !== undefined && g.colCount) geo.setAttribute("color", new THREE.BufferAttribute(new Uint8Array(data, base + g.colOff, g.colCount), 3, true));
          geo.computeVertexNormals();
          return geo;
        };

        // 반투명 층: [뒷면 바깥→안쪽] → 혈관 → [앞면 안쪽→바깥] 순서로 그려 겹침이 자연스럽게 보이게
        const shells = header.groups.filter(g => g.kind === "shell");
        const objs: Record<string, { kind: string; meshes: import("three").Mesh[] }> = {};
        shells.forEach((g, i) => {
          const geo = makeGeometry(g);
          const mk = (side: import("three").Side) => new THREE.Mesh(geo, new THREE.MeshPhongMaterial({
            color: new THREE.Color(g.color), specular: 0x444455, shininess: 25, transparent: true, depthWrite: false, side }));
          const back = mk(THREE.BackSide), front = mk(THREE.FrontSide);
          back.renderOrder = 1 + i; front.renderOrder = 100 + (shells.length - 1 - i);
          scene.add(back, front);
          objs[g.id] = { kind: "shell", meshes: [back, front] };
        });
        header.groups.filter(g => g.kind === "solid").forEach(g => {
          const vc = g.colOff !== undefined;
          const mesh = new THREE.Mesh(makeGeometry(g), new THREE.MeshPhongMaterial({
            color: vc ? 0xffffff : new THREE.Color(g.color), vertexColors: vc, specular: 0x1a1a1a, shininess: 30,
            side: THREE.DoubleSide, transparent: true, depthWrite: true }));
          mesh.renderOrder = 200; // 혈관은 다른 층에 가려지지 않게 맨 나중에
          scene.add(mesh);
          objs[g.id] = { kind: "solid", meshes: [mesh] };
        });

        const applyLevels = (lv: Record<string, number>) => {
          Object.entries(objs).forEach(([id, o]) => {
            const v = (lv[id] ?? 100) / 100;
            o.meshes.forEach(m => { (m.material as import("three").Material).opacity = v; m.visible = v > 0; });
          });
        };
        applyLevels(PRESETS.all);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true; controls.dampingFactor = 0.12;
        controls.autoRotateSpeed = 1.6;
        controls.minDistance = R * 0.5; controls.maxDistance = R * 8;
        const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        controls.autoRotate = !reduceMotion;
        if (reduceMotion) setAuto(false);

        const DIST0 = R * 2.3;
        const reset = () => {
          controls.target.set(0, 0, 0);
          // X=환자 오른쪽, Y=위, Z=뒤. 정면(얼굴 쪽)에서 바라봄
          camera.position.set(0, 0, -DIST0); camera.up.set(0, 1, 0); controls.update();
        };
        reset();

        const resize = () => {
          const w = mount.clientWidth, h = mount.clientHeight;
          if (!w || !h) return;
          renderer.setSize(w, h, false);
          camera.aspect = w / h;
          camera.fov = w >= h ? 30 : (2 * Math.atan(Math.tan((15 * Math.PI) / 180) / camera.aspect) * 180) / Math.PI;
          camera.updateProjectionMatrix();
        };
        const ro = new ResizeObserver(resize); ro.observe(mount); resize();

        let visible = true;
        const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }); io.observe(mount);
        let raf = 0;
        const loop = () => { raf = requestAnimationFrame(loop); if (!visible) return; controls.update(); renderer.render(scene, camera); };
        loop();

        apiRef.current = {
          preset: k => applyLevels(PRESETS[k]),
          setAuto: on => { controls.autoRotate = on; },
        };
        if (header.legend?.length) setLegend(header.legend);
        onLoadedRef.current?.({ legend: header.legend, findings: header.findings });
        setStatus("ready");

        cleanup = () => {
          cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); controls.dispose();
          scene.traverse(o => {
            const m = o as import("three").Mesh;
            if (m.isMesh) { m.geometry.dispose(); (m.material as import("three").Material).dispose(); }
          });
          renderer.dispose(); renderer.domElement.remove();
        };
      } catch {
        if (!disposed) setStatus("error");
      }
    })();

    return () => { disposed = true; cleanup(); apiRef.current = null; };
  }, [src]);

  // 커서가 박스 안에 있을 때 휠(Ctrl+휠 포함)은 3D 확대/축소에만 사용:
  // 브라우저 화면 확대와 페이지의 섹션 넘김으로 전달되지 않게 막음 (캔버스의 확대 처리는 먼저 실행됨)
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => { e.preventDefault(); e.stopPropagation(); };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const btn = (active: boolean): React.CSSProperties => ({
    border: "1px solid rgba(255,255,255,0.35)", borderRadius: "999px", padding: "0.3rem 0.75rem",
    background: active ? "rgba(30,33,80,0.75)" : "rgba(30,33,80,0.35)", color: "#eef0ff",
    fontSize: "0.78rem", fontFamily: "'Varela Round', sans-serif", cursor: "pointer", backdropFilter: "blur(4px)",
  });

  return (
    <div
      ref={wrapRef}
      style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgb(124,127,194), rgb(185,187,228))" }}
      onClick={e => e.stopPropagation()}
    >
      <div ref={mountRef} style={{ position: "absolute", inset: 0 }} />

      {status !== "ready" && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#1e2150", fontWeight: 600, fontSize: "0.9rem" }}>
          {status === "loading" ? "3D 모델을 불러오는 중…" : "3D 모델을 불러오지 못했습니다"}
        </div>
      )}

      {status === "ready" && (
        <>
          {/* 범례: 모델에 들어 있는 색 기준 */}
          <div style={{ position: "absolute", left: "0.9rem", top: "0.9rem", display: "flex", gap: "0.7rem", padding: "0.3rem 0.65rem", borderRadius: "0.5rem", background: "rgba(30,33,80,0.45)", color: "#eef0ff", fontSize: "0.74rem", backdropFilter: "blur(4px)" }}>
            {legend.map(l => (
              <span key={l.label} style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}><i style={{ width: 9, height: 9, borderRadius: 2, background: l.color, display: "inline-block" }} />{l.label}</span>
            ))}
          </div>

          {/* 오른쪽 위: [자동 회전] [혈관만] — 혈관만은 한 번 더 누르면 전체 보기로 돌아감 */}
          <div style={{ position: "absolute", right: "0.9rem", top: "0.9rem", display: "flex", gap: "0.35rem" }}>
            <button type="button" style={btn(auto)} aria-pressed={auto}
              onClick={() => { const on = !auto; setAuto(on); apiRef.current?.setAuto(on); }}>{auto ? "자동 회전 끄기" : "자동 회전"}</button>
            <button type="button" style={btn(preset === "vessel")} aria-pressed={preset === "vessel"}
              onClick={() => { const k = preset === "vessel" ? "all" : "vessel"; setPreset(k); apiRef.current?.preset(k); }}>혈관만</button>
          </div>

          {/* 하단 가운데: 조작 안내 */}
          <div style={{ position: "absolute", left: "50%", bottom: "0.9rem", transform: "translateX(-50%)", whiteSpace: "nowrap", padding: "0.3rem 0.7rem", borderRadius: "0.5rem", background: "rgba(30,33,80,0.45)", color: "#eef0ff", fontSize: "0.74rem", pointerEvents: "none", backdropFilter: "blur(4px)" }}>
            드래그: 회전 · 휠: 확대/축소 · 우클릭 드래그: 이동
          </div>
        </>
      )}
    </div>
  );
}
