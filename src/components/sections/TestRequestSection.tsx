"use client";

import React, { useState, useEffect, useRef } from "react";
import { RevealSection } from "@/components/ui/RevealSection";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Divider } from "@/components/ui/Divider";
import NeuralSynapseVisual from "@/components/NeuralSynapseVisual";
import PdfModal from "@/components/PdfModal";

export function TestRequestSection() {
  const [isUploadHovered, setIsUploadHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [emailValue, setEmailValue] = useState("");
  const [fileType, setFileType] = useState("");
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [requestCount, setRequestCount] = useState(231);
  const [selectedPdf, setSelectedPdf] = useState<"analysis" | "dicom" | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | File[]) => {
    const arr = Array.from(files);
    const oversized = arr.filter(f => f.size > 25 * 1024 * 1024);
    if (oversized.length > 0) {
      alert(`파일 크기는 25MB 이하여야 합니다.\n초과 파일: ${oversized.map(f => f.name).join(", ")}`);
      return;
    }
    setSelectedFiles(prev => [...prev, ...arr]);
  };

  useEffect(() => {
    let cancelled = false;

    const loadRequestCount = async () => {
      try {
        const res = await fetch("/api/analysis-count", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { count?: unknown };
        if (!cancelled && typeof data.count === "number" && Number.isFinite(data.count)) {
          setRequestCount(Math.floor(data.count));
        }
      } catch {
        // Keep fallback state value when request fails.
      }
    };

    loadRequestCount();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleAnalysisSubmit = async () => {
    if (selectedFiles.length === 0) { alert("파일을 선택해주세요."); return; }
    if (!emailValue) { alert("이메일을 입력해주세요."); return; }
    if (!fileType) { alert("파일 내용을 선택해주세요."); return; }
    setSubmitState("loading");
    try {
      const form = new FormData();
      selectedFiles.forEach(f => form.append("file", f));
      form.append("email", emailValue);
      form.append("fileType", fileType);
      const res = await fetch("/api/analysis", { method: "POST", body: form });
      const data = (await res.json()) as { count?: unknown };
      if (!res.ok) throw new Error();
      setSubmitState("success");
      if (typeof data.count === "number" && Number.isFinite(data.count)) {
        setRequestCount(Math.floor(data.count));
      } else {
        setRequestCount(prev => prev + 1);
      }
      setSelectedFiles([]);
      setEmailValue("");
      setFileType("");
    } catch {
      setSubmitState("error");
    }
  };

  const infoPoints = [
    "DICOM 파일 형식 지원 (최대 25MB)",
    "전송된 파일은 NIfTI 파일형식으로 모두 전환됩니다",
    "NIfTI 파일형식의 특성상 모든 환자개인정보가 자동 삭제됩니다",
    "전송된 파일도 NIfTI 전환 후 모두 삭제됩니다",
    "분석된 영상은 이메일로 24시간 이내로 보내드립니다",
    "빠른 영상분석이 필요시에는 파일 업로드 후 contact의 연락처로 문의 바랍니다."
  ];

  return (
    <section id="test-request" style={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <div className="cn-section-flex" style={{ display: "flex", width: "100%", alignItems: "center", gap: "5rem" }}>
        <div style={{ flex: 1, width: "100%", maxWidth: "42rem" }}>
          <RevealSection>
            <SectionLabel>Research Analysis Request</SectionLabel>
            <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 700, color: "#e2e8f0", lineHeight: 1.2, marginBottom: "1.5rem" }}>
              연구용 데이터 AI 분석 의뢰
            </h2>
            <Divider />
          </RevealSection>

          <RevealSection style={{ transitionDelay: "0.1s" }}>
            <div style={{
              background: "rgba(255,255,255,0.02)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "1.5rem",
              padding: "1rem",
              marginBottom: "1rem",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            }}>
              {/* 숨겨진 파일 입력 */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                style={{ display: "none" }}
                onChange={e => { if (e.target.files) handleFileSelect(e.target.files); }}
              />

              {/* 업로드 영역 */}
              <div
                onClick={() => fileInputRef.current?.click()}
                onMouseEnter={() => setIsUploadHovered(true)}
                onMouseLeave={() => setIsUploadHovered(false)}
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={e => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files) handleFileSelect(e.dataTransfer.files);
                }}
                style={{
                  background: isDragging ? "rgba(96,165,250,0.12)" : isUploadHovered ? "rgba(96,165,250,0.05)" : "rgba(255,255,255,0.01)",
                  border: `1px ${isDragging || isUploadHovered ? 'solid' : 'dashed'} ${isDragging ? 'rgba(96,165,250,0.8)' : isUploadHovered ? 'rgba(96,165,250,0.5)' : 'rgba(96,165,250,0.25)'}`,
                  borderRadius: "1rem",
                  padding: "1rem 1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  marginBottom: "1rem",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                {selectedFiles.length > 0 ? (
                  <>
                    <div style={{ color: "#34d399", marginBottom: "0.75rem" }}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <polyline points="9 15 11 17 15 13" />
                      </svg>
                    </div>
                    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                      {selectedFiles.map((f, idx) => (
                        <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
                          <p style={{ color: "#e2e8f0", fontSize: "0.9rem", fontWeight: 600, wordBreak: "break-all", textAlign: "left" }}>
                            {f.name} <span style={{ color: "#64748b", fontWeight: 400 }}>({(f.size / 1024 / 1024).toFixed(2)} MB)</span>
                          </p>
                          <button
                            onClick={e => { e.stopPropagation(); setSelectedFiles(prev => prev.filter((_, i) => i !== idx)); }}
                            style={{ flexShrink: 0, fontSize: "0.75rem", color: "#f87171", background: "none", border: "none", cursor: "pointer" }}
                          >✕</button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); setSelectedFiles([]); }}
                      style={{ marginTop: "0.75rem", fontSize: "0.8rem", color: "#f87171", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
                    >
                      전체 제거
                    </button>
                  </>
                ) : (
                  <>
                    <div style={{
                      color: "#60a5fa",
                      marginBottom: "0.6rem",
                      transform: isUploadHovered ? "translateY(-5px)" : "translateY(0)",
                      transition: "transform 0.4s ease"
                    }}>
                      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                    </div>
                    <p style={{ color: "#ffffff", fontSize: "1.15rem", fontWeight: 500, marginBottom: "0.4rem" }}>
                      {isDragging ? "파일을 여기에 놓으세요" : "MRI 또는 CT 데이터를 첨부하세요"}
                    </p>
                    <p style={{ color: "rgba(148,163,184,0.6)", fontSize: "0.85rem", letterSpacing: "0.02em" }}>
                      클릭하거나 파일을 여기로 끌어다 놓으세요 (최대 25MB)
                    </p>
                  </>
                )}
                {(isUploadHovered || isDragging) && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'radial-gradient(circle at center, rgba(59,130,246,0.1) 0%, transparent 70%)',
                    pointerEvents: 'none'
                  }} />
                )}
              </div>

              {/* 상세 안내 리스트 */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                {infoPoints.map((point, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
                    <span style={{
                      color: "#60a5fa",
                      fontSize: "0.9rem",
                      lineHeight: "1.5rem",
                      fontWeight: 800
                    }}>•</span>
                    <p style={{
                      color: "rgba(226,232,240,0.75)",
                      fontSize: "0.88rem",
                      lineHeight: 1.55,
                      fontWeight: 300,
                      wordBreak: "keep-all"
                    }}>
                      {point}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </RevealSection>

          <RevealSection style={{ transitionDelay: "0.2s" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <div className="cn-form-row" style={{ display: "flex", gap: "0.85rem" }}>
                {/* 이메일 입력 */}
                <div style={{ flex: 1, position: "relative" }}>
                  <label htmlFor="email-input" className="sr-only">이메일 주소</label>
                  <input
                    id="email-input"
                    type="email"
                    placeholder="이메일 주소 (결과 수신용)"
                    value={emailValue}
                    onChange={e => setEmailValue(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.85rem 1.25rem",
                      borderRadius: "0.85rem",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "#ffffff",
                      outline: "none",
                      fontSize: "1rem",
                      transition: "all 0.3s ease",
                      boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)"
                    }}
                    onFocus={e => {
                      e.currentTarget.style.borderColor = "rgba(96,165,250,0.4)";
                      e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    }}
                    onBlur={e => {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                      e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    }}
                  />
                </div>
                {/* 파일 내용 선택 */}
                <div style={{ flex: 1 }}>
                  <label htmlFor="file-type-select" className="sr-only">파일 내용 선택</label>
                  <select
                    id="file-type-select"
                    value={fileType}
                    onChange={e => setFileType(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.85rem 1.25rem",
                      borderRadius: "0.85rem",
                      background: "rgba(15,23,42,0.8)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "#ffffff",
                      outline: "none",
                      fontSize: "1rem",
                      cursor: "pointer",
                      appearance: "none",
                      backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2360a5fa' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 1rem center",
                      backgroundSize: "1.2rem",
                      transition: "all 0.3s ease"
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = "rgba(96,165,250,0.4)"}
                    onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
                  >
                    <option value="" disabled>파일 내용 선택</option>
                    <option value="brain-mra-tof">Brain MRA: TOF</option>
                    <option value="mri-dwi-adc">MRI: DWI &amp; ADC</option>
                    <option value="carotid-mra-tof">Carotid MRA: TOF</option>
                    <option value="brain-ct-axial">Brain CT: axial</option>
                    <option value="brain-cta-source">Brain CTA: source</option>
                  </select>
                </div>
              </div>

              {/* 분석 요청하기 버튼 */}
              <button style={{
                padding: "0.9rem",
                borderRadius: "1rem",
                background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "1.05rem",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 10px 25px -5px rgba(59,130,246,0.5), 0 8px 10px -6px rgba(139,92,246,0.3)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                letterSpacing: "0.05em"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 20px 30px -5px rgba(59,130,246,0.6), 0 15px 15px -6px rgba(139,92,246,0.4)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 25px -5px rgba(59,130,246,0.5), 0 8px 10px -6px rgba(139,92,246,0.3)";
              }}
              onClick={handleAnalysisSubmit}
              >
                {submitState === "loading" ? "전송 중..." : "분석 요청하기"}
              </button>

              {submitState === "success" && (
                <div style={{ marginTop: "1rem", padding: "0.9rem 1.2rem", borderRadius: "0.75rem", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.4)", color: "#4ade80", fontSize: "0.95rem", fontWeight: 600 }}>
                  ✓ 분석 의뢰가 성공적으로 접수되었습니다. 결과는 입력하신 이메일로 발송됩니다.
                </div>
              )}
              {submitState === "error" && (
                <div style={{ marginTop: "1rem", padding: "0.9rem 1.2rem", borderRadius: "0.75rem", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.4)", color: "#f87171", fontSize: "0.95rem", fontWeight: 600 }}>
                  ✕ 전송에 실패했습니다. 잠시 후 다시 시도해주세요.
                </div>
              )}

              {/* 분석 요청 카운터 */}
              <div
                className="cn-request-meta-row"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: "0.45rem",
                  marginTop: "1.2rem",
                  flexWrap: "nowrap",
                  width: "100%",
                  minWidth: 0,
                }}
              >
                <div className="cn-request-meta-count-wrap" style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
                  <span
                    className="cn-request-count-pill"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      height: "2.28rem",
                      whiteSpace: "nowrap",
                      padding: "0 0.9rem",
                      borderRadius: "2rem",
                      background: "rgba(59,130,246,0.08)",
                      border: "1px solid rgba(59,130,246,0.3)",
                      color: "#60a5fa",
                      fontSize: "0.9rem",
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      lineHeight: 1,
                      letterSpacing: "0.06em",
                      textShadow: "0 0 12px rgba(96,165,250,0.4)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
                    }}
                  >
                    <span style={{
                      display: "inline-block",
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "#60a5fa",
                      marginRight: "0.75rem",
                      boxShadow: "0 0 8px #60a5fa"
                    }} />
                    ANALYSIS REQUEST: {String(requestCount).padStart(4, '0')}
                  </span>
                </div>

                <div className="cn-request-meta-actions" style={{ display: "flex", gap: "0.28rem", flexWrap: "nowrap", flex: 1, minWidth: 0 }}>
                  {([
                    { label: "DICOM 파일 추출 방법", key: "dicom" as const },
                    { label: "분석영상 확인방법", key: "analysis" as const },
                  ] as const).map(({ label, key }) => {
                    const isActive = selectedPdf === key;
                    return (
                      <button
                        key={key}
                        className="cn-request-help-btn"
                        onClick={() => setSelectedPdf(isActive ? null : key)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flex: 1,
                          minWidth: 0,
                          height: "2.7rem",
                          gap: "0.35rem",
                          padding: "0 1rem",
                          borderRadius: "0.7rem",
                          background: isActive ? "rgba(96,165,250,0.2)" : "rgba(96,165,250,0.07)",
                          border: `1px solid ${isActive ? "rgba(96,165,250,0.6)" : "rgba(96,165,250,0.25)"}`,
                          color: isActive ? "#bfdbfe" : "#93c5fd",
                          fontSize: "0.88rem",
                          fontWeight: 600,
                          lineHeight: 1,
                          fontFamily: "'HYGraphic', sans-serif",
                          whiteSpace: "nowrap",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={e => {
                          if (!isActive) {
                            e.currentTarget.style.background = "rgba(96,165,250,0.15)";
                            e.currentTarget.style.borderColor = "rgba(96,165,250,0.5)";
                          }
                        }}
                        onMouseLeave={e => {
                          if (!isActive) {
                            e.currentTarget.style.background = "rgba(96,165,250,0.07)";
                            e.currentTarget.style.borderColor = "rgba(96,165,250,0.25)";
                          }
                        }}
                      >
                        {key === "analysis" ? (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                          </svg>
                        ) : (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                          </svg>
                        )}
                        <span>{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </RevealSection>
        </div>

        {/* 우측 뉴런 장식 */}
        <div style={{ flex: 1, height: "500px", position: "relative" }}>
          <NeuralSynapseVisual mode="dense" color="192, 132, 252" opacity={0.9} />
        </div>

      </div>

      {/* PDF 팝업 모달 */}
      {selectedPdf && (
        <PdfModal
          src={selectedPdf === "analysis" ? "/analysis-guide.pdf" : "/dicom-guide.pdf"}
          title={selectedPdf === "analysis" ? "분석영상 확인방법" : "DICOM 파일 추출 방법"}
          onClose={() => setSelectedPdf(null)}
        />
      )}
    </section>
  );
}
