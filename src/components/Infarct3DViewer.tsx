"use client";

import { useEffect, useRef, useState } from "react";
import { loadModel, parseModel } from "@/components/Vessel3DViewer";

/**
 * 'DWI AI for Mapping Vascular territories' 아래 칸: 경색 영역 3D 모델 (동영상 대체)
 * - 모델: public/models/territory-demo.bin (CLV1, scene "infarct": 뇌 표면 와이어 · 뇌실 · 영역별 경색)
 * - 재질·조명·배경은 MR Infarction AI 리포트 뷰어와 동일
 * - 렌더링 영역은 왼쪽 아래 순위 패널을 피해 오른쪽에 두고, 모델이 박스 세로의 약 80%를 차지하게 맞춤
 * - 오른쪽 아래 [자동 회전] 버튼만 둠
 */

type Group = {
  id: string; kind: string; color: string; default: number;
  lo: number[]; hi: number[]; posOff: number; posCount: number; idxOff: number; idxCount: number; i32: boolean;
};

/** 순위 패널(왼쪽 1rem + 폭 232px × 0.64 ≈ 165px)을 피한 렌더링 시작 위치 */
const MOUNT_LEFT = 172;
const FILL = 0.8;
const FOV = 45;

export default function Infarct3DViewer({ src }: { src: string }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<{ setAuto: (on: boolean) => void } | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [auto, setAuto] = useState(true);

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
        const groups = header.groups as unknown as Group[];

        // 리포트 뷰어(최신 three.js)와 같은 색 관리
        THREE.ColorManagement.enabled = true;
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setClearColor(0x000000, 0);
        renderer.domElement.style.cssText = "display:block;width:100%;height:100%;touch-action:none;cursor:grab";
        mount.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        scene.add(new THREE.AmbientLight(0xfff6ec, 0.85));
        const d1 = new THREE.DirectionalLight(0xffffff, 0.85); d1.position.set(200, 300, 250);
        const d2 = new THREE.DirectionalLight(0xffeedd, 0.55); d2.position.set(-200, 150, 200);
        const d3 = new THREE.DirectionalLight(0xdbeafe, 0.45); d3.position.set(0, -200, -250);
        scene.add(d1, d2, d3);

        const modelGroup = new THREE.Group();
        const makeGeometry = (g: Group) => {
          const q = new Uint16Array(data, base + g.posOff, g.posCount);
          const p = new Float32Array(q.length);
          for (let i = 0; i < q.length; i++) { const a = i % 3; p[i] = g.lo[a] + (q[i] / 65535) * (g.hi[a] - g.lo[a]); }
          const geo = new THREE.BufferGeometry();
          geo.setAttribute("position", new THREE.BufferAttribute(p, 3));
          geo.setIndex(new THREE.BufferAttribute(g.i32 ? new Uint32Array(data, base + g.idxOff, g.idxCount) : new Uint16Array(data, base + g.idxOff, g.idxCount), 1));
          geo.computeVertexNormals();
          return geo;
        };

        groups.forEach(g => {
          let mat: import("three").Material, order: number;
          if (g.kind === "wire") {
            mat = new THREE.MeshStandardMaterial({ color: new THREE.Color(g.color), wireframe: true, roughness: 0.52, metalness: 0.05,
              transparent: true, opacity: g.default / 100, depthWrite: false, side: THREE.DoubleSide });
            order = 1;
          } else if (g.kind === "ventricle") {
            mat = new THREE.MeshStandardMaterial({ color: new THREE.Color(g.color), roughness: 0.35, metalness: 0.15,
              transparent: true, opacity: g.default / 100, depthWrite: false, side: THREE.DoubleSide });
            order = 5;
          } else {
            mat = new THREE.MeshStandardMaterial({ color: new THREE.Color(g.color), roughness: 0.25, metalness: 0.2,
              transparent: false, opacity: 1, depthWrite: true, side: THREE.DoubleSide });
            order = 999;
          }
          const mesh = new THREE.Mesh(makeGeometry(g), mat);
          mesh.renderOrder = order;
          modelGroup.add(mesh);
        });
        modelGroup.rotation.x = -Math.PI / 2;
        scene.add(modelGroup);

        // 모델 중심을 원점으로
        const box = new THREE.Box3().setFromObject(modelGroup);
        const center = box.getCenter(new THREE.Vector3());
        modelGroup.position.sub(center);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        // 회전해도 화면 세로의 약 80% 안에 들도록: 모델의 가장 긴 폭이 세로 80%가 되는 거리
        const dist = (maxDim / 2) / (FILL * Math.tan((FOV / 2) * Math.PI / 180));

        const camera = new THREE.PerspectiveCamera(FOV, 1, maxDim * 0.01, maxDim * 20);
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true; controls.dampingFactor = 0.12;
        controls.autoRotateSpeed = 1.8;
        controls.minDistance = dist * 0.3; controls.maxDistance = dist * 4;
        const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        controls.autoRotate = !reduceMotion;
        if (reduceMotion) setAuto(false);

        const dir = new THREE.Vector3(0.55, 0.45, 0.9).normalize();
        camera.position.copy(dir.multiplyScalar(dist));
        controls.target.set(0, 0, 0);
        controls.update();

        const resize = () => {
          const w = mount.clientWidth, h = mount.clientHeight;
          if (!w || !h) return;
          renderer.setSize(w, h, false);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
        };
        const ro = new ResizeObserver(resize); ro.observe(mount); resize();

        let visible = true;
        const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }); io.observe(mount);
        let raf = 0;
        const loop = () => { raf = requestAnimationFrame(loop); if (!visible) return; controls.update(); renderer.render(scene, camera); };
        loop();

        apiRef.current = { setAuto: on => { controls.autoRotate = on; } };
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

  // 박스 안의 휠(Ctrl+휠 포함)은 3D 확대/축소에만 사용 (화면 확대·섹션 넘김 방지)
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => { e.preventDefault(); e.stopPropagation(); };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div
      ref={wrapRef}
      style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at center, #1b2434 0%, #07090e 100%)" }}
      onClick={e => e.stopPropagation()}
    >
      <div ref={mountRef} style={{ position: "absolute", top: 0, bottom: 0, right: 0, left: `${MOUNT_LEFT}px` }} />

      {status !== "ready" && (
        <div style={{ position: "absolute", inset: 0, left: `${MOUNT_LEFT}px`, display: "flex", alignItems: "center", justifyContent: "center", color: "#cbd5e1", fontSize: "0.85rem" }}>
          {status === "loading" ? "3D 모델을 불러오는 중…" : "3D 모델을 불러오지 못했습니다"}
        </div>
      )}

      {status === "ready" && (
        <button
          type="button"
          aria-pressed={auto}
          onClick={() => { const on = !auto; setAuto(on); apiRef.current?.setAuto(on); }}
          style={{
            position: "absolute", right: "0.9rem", bottom: "0.9rem", zIndex: 41,
            border: "1px solid rgba(147,197,253,0.4)", borderRadius: "999px", padding: "0.3rem 0.75rem",
            background: auto ? "rgba(30,41,70,0.85)" : "rgba(30,41,70,0.45)", color: "#e2e8f0",
            fontSize: "0.78rem", fontFamily: "'Varela Round', sans-serif", cursor: "pointer", backdropFilter: "blur(4px)",
          }}
        >
          {auto ? "자동 회전 끄기" : "자동 회전"}
        </button>
      )}
    </div>
  );
}
