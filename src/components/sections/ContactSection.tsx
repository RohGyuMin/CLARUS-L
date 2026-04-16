"use client";

import React, { useState } from "react";
import { RevealSection } from "@/components/ui/RevealSection";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Divider } from "@/components/ui/Divider";
import NeuralSynapseVisual from "@/components/NeuralSynapseVisual";

export type ContactSectionProps = {
  onOpenPrivacy: () => void;
  privacyAgreed: boolean;
  setPrivacyAgreed: React.Dispatch<React.SetStateAction<boolean>>;
  isCompactLayout: boolean;
};

export function ContactSection({ onOpenPrivacy, privacyAgreed, setPrivacyAgreed, isCompactLayout }: ContactSectionProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isContactIntroEnglish, setIsContactIntroEnglish] = useState(false);
  const [formData, setFormData] = useState({ name: "", region: "", company: "", job: "", email: "", phone: "", message: "" });
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleField = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!privacyAgreed) { alert("개인정보 처리방침에 동의해주세요."); return; }
    if (!formData.name || !formData.email || !formData.message) { alert("이름, 이메일, 문의내용은 필수입니다."); return; }
    setSubmitState("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error();
      setSubmitState("success");
      setFormData({ name: "", region: "", company: "", job: "", email: "", phone: "", message: "" });
      setPrivacyAgreed(false);
    } catch {
      setSubmitState("error");
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('clarusnai@gmail.com');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <section
      id="contact"
      style={{
        minHeight: isCompactLayout ? "auto" : "100vh",
        display: "flex",
        alignItems: isCompactLayout ? "flex-start" : "center",
        paddingTop: isCompactLayout ? "4rem" : undefined,
        paddingBottom: isCompactLayout ? "1.5rem" : undefined,
      }}
    >
      <div className="cn-section-flex" style={{ display: "flex", width: "100%", alignItems: "stretch", gap: isCompactLayout ? "2rem" : "4rem" }}>
        <div style={{ flex: 1, maxWidth: "38rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <RevealSection>
            <SectionLabel>Contact</SectionLabel>
            <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 700, color: "#e2e8f0", lineHeight: 1.2, marginBottom: "1.5rem" }}>
              <span style={{ whiteSpace: "nowrap" }}>Research Collaboration</span><br />
              <span style={{ whiteSpace: "nowrap" }}>& Technical Partnerships</span>
            </h2>
            <Divider />
          </RevealSection>
          <RevealSection style={{ transitionDelay: "0.1s" }}>
            <button
              type="button"
              onClick={() => setIsContactIntroEnglish(prev => !prev)}
              style={{
                color: "#94a3b8",
                lineHeight: 1.85,
                fontSize: "1.05rem",
                fontWeight: 300,
                marginBottom: "2rem",
                background: "none",
                border: "none",
                padding: 0,
                textAlign: "left",
                width: "100%",
                cursor: "pointer",
              }}
              title={isContactIntroEnglish ? "Click to switch to Korean" : "Click to switch to English"}
            >
              {isContactIntroEnglish ? (
                <>
                  Thank you for your interest in <span style={{ color: "#e2e8f0", fontWeight: 700, fontFamily: "var(--font-bernhard)" }}>CLARUS</span><span style={{ color: "#a855f7", fontWeight: 700, fontFamily: "'HYGraphic', sans-serif" }}>-</span><span style={{ color: "#a855f7", fontWeight: 700, fontFamily: "var(--font-bernhard)" }}>N</span>&apos;s AI solutions.<br />
                  We are currently operating a pilot program for research purposes only.<br />
                  Please contact us if you have any questions about research collaboration or technical partnerships.
                </>
              ) : (
                <>
                  <span style={{ color: "#e2e8f0", fontWeight: 700, fontFamily: "var(--font-bernhard)" }}>CLARUS</span><span style={{ color: "#a855f7", fontWeight: 700, fontFamily: "'HYGraphic', sans-serif" }}>-</span><span style={{ color: "#a855f7", fontWeight: 700, fontFamily: "var(--font-bernhard)" }}>N</span>의 다양한 AI solutions에 대해 관심을 주셔서 감사합니다.<br />현재 <span style={{ color: "#e2e8f0", fontWeight: 700, fontFamily: "var(--font-bernhard)" }}>CLARUS</span><span style={{ color: "#a855f7", fontWeight: 700, fontFamily: "'HYGraphic', sans-serif" }}>-</span><span style={{ color: "#a855f7", fontWeight: 700, fontFamily: "var(--font-bernhard)" }}>N</span>는 연구목적의 파일럿 프로그램만 운용중입니다.<br />
                  저희와 연구 협력 및 기술 제휴 등의 궁금한 점이 있으시면 문의해 주세요.
                </>
              )}
            </button>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem", width: "100%", maxWidth: "420px" }}>

              {/* Contact 버튼 */}
              <button
                onClick={() => setIsFormOpen(true)}
                style={{
                  position: "relative",
                  padding: "1.25rem 1.5rem",
                  borderRadius: "1rem",
                  background: "linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(37,99,235,0.3) 100%)",
                  border: "1px solid rgba(96,165,250,0.5)",
                  boxShadow: "0 4px 20px rgba(59,130,246,0.2), inset 0 0 10px rgba(255,255,255,0.05)",
                  backdropFilter: "blur(12px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  textAlign: "left",
                  width: "100%",
                  minHeight: "92px",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 12px 30px rgba(59,130,246,0.35), inset 0 0 15px rgba(255,255,255,0.15)";
                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(59,130,246,0.25) 0%, rgba(37,99,235,0.45) 100%)";
                  e.currentTarget.style.borderColor = "rgba(96,165,250,0.8)";
                  const arrow = e.currentTarget.querySelector('.btn-arrow') as HTMLElement;
                  if (arrow) arrow.style.transform = "translateX(5px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(59,130,246,0.2), inset 0 0 10px rgba(255,255,255,0.05)";
                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(37,99,235,0.3) 100%)";
                  e.currentTarget.style.borderColor = "rgba(96,165,250,0.5)";
                  const arrow = e.currentTarget.querySelector('.btn-arrow') as HTMLElement;
                  if (arrow) arrow.style.transform = "translateX(0)";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                  <div style={{
                    width: "42px", height: "42px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "rgba(255,255,255,0.05)", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.1)"
                  }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ color: "#ffffff", fontSize: "1.3rem", fontWeight: 700, letterSpacing: "0.02em" }}>Contact</span>
                    <span style={{ color: "rgba(147,197,253,0.8)", fontSize: "0.75rem", marginTop: "0.25rem" }}>버튼을 클릭하여 온라인 문의 폼 열기</span>
                  </div>
                </div>
                <div className="btn-arrow" style={{ transition: "transform 0.3s ease", display: "flex", alignItems: "center" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </button>

              {/* 연락처 정보 */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div
                  onClick={handleCopyEmail}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.25rem",
                    padding: "1.25rem 1.5rem",
                    borderRadius: "1rem",
                    background: isCopied ? "rgba(59,130,246,0.15)" : "rgba(30,58,138,0.08)",
                    border: isCopied ? "1px solid rgba(96,165,250,0.6)" : "1px solid rgba(148,163,184,0.1)",
                    backdropFilter: "blur(4px)",
                    cursor: "pointer",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    position: "relative",
                    minHeight: "92px",
                  }}
                  onMouseEnter={e => {
                    if (!isCopied) {
                      e.currentTarget.style.background = "rgba(30,58,138,0.15)";
                      e.currentTarget.style.borderColor = "rgba(148,163,184,0.2)";
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isCopied) {
                      e.currentTarget.style.background = "rgba(30,58,138,0.08)";
                      e.currentTarget.style.borderColor = "rgba(148,163,184,0.1)";
                    }
                  }}
                >
                  <div style={{
                    width: "42px", height: "42px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: isCopied ? "rgba(96,165,250,0.3)" : "rgba(148,163,184,0.1)",
                    borderRadius: "50%", transition: "all 0.3s"
                  }}>
                    {isCopied ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: isCopied ? "#93c5fd" : "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.25rem", fontWeight: isCopied ? 700 : 400 }}>
                      {isCopied ? "COPIED!" : "E-mail"}
                    </div>
                    <div style={{ color: isCopied ? "#ffffff" : "#cbd5e1", fontSize: "1.15rem", fontWeight: isCopied ? 600 : 400, letterSpacing: "0.02em" }}>clarusnai@gmail.com</div>
                  </div>
                  {!isCopied && (
                    <div style={{ position: "absolute", right: "1.5rem", top: "50%", transform: "translateY(-50%)", fontSize: "0.7rem", color: "#475569", opacity: 0.6 }}>
                      Click to Copy
                    </div>
                  )}
                </div>

                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1.25rem",
                  padding: "1.25rem 1.5rem",
                  borderRadius: "1rem",
                  background: "rgba(30,58,138,0.08)",
                  border: "1px solid rgba(148,163,184,0.1)",
                  backdropFilter: "blur(4px)",
                  minHeight: "92px",
                }}>
                  <div style={{
                    width: "42px", height: "42px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "rgba(148,163,184,0.1)", borderRadius: "50%"
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.25rem" }}>Tel</div>
                    <div style={{ color: "#cbd5e1", fontSize: "1.15rem", fontWeight: 400, letterSpacing: "0.05em" }}>+82-2-6956-5338</div>
                  </div>
                </div>
              </div>
            </div>
          </RevealSection>
        </div>

        {/* 우측 영역: Visual 또는 Form */}
        <div style={{ flex: 1, position: "relative", minHeight: "600px", display: "flex", alignItems: "center", transition: "all 0.5s ease" }}>

          {/* Background Visual */}
          <div style={{
            position: "absolute", inset: 0, height: "100%",
            opacity: isFormOpen ? 0.05 : 1,
            transition: "opacity 0.6s ease",
            transform: isFormOpen ? "scale(0.95)" : "scale(1)",
          }}>
            <NeuralSynapseVisual mode="fast" color="96, 165, 250" opacity={0.65} />
          </div>

          {/* Contact Form */}
          <div style={{
            position: "absolute",
            inset: 0,
            opacity: isFormOpen ? 1 : 0,
            pointerEvents: isFormOpen ? "auto" : "none",
            transform: isFormOpen ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
            background: "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(20px)",
            borderRadius: "1.5rem",
            border: "1px solid rgba(96,165,250,0.25)",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5), 0 0 30px rgba(59,130,246,0.15)",
            padding: "2.5rem",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto"
          }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ color: "#e2e8f0", fontSize: "1.75rem", fontWeight: 500, margin: 0, letterSpacing: "0.02em" }}>
                Contact
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                style={{
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                  color: "#94a3b8", cursor: "pointer", padding: "0.5rem", borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s"
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#ffffff"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#94a3b8"; }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Form Description */}
            <div style={{ color: "#94a3b8", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "2rem", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "1.5rem" }}>
              <span style={{ color: "#e2e8f0", fontWeight: 600, fontFamily: "var(--font-bernhard)" }}>CLARUS</span><span style={{ color: "#a855f7", fontWeight: 700, fontFamily: "'HYGraphic', sans-serif" }}>-</span><span style={{ color: "#a855f7", fontWeight: 700, fontFamily: "var(--font-bernhard)" }}>N</span>에 관심 가져주셔서 감사합니다.<br />
              제품에 관한 사항, 기술제휴 및 협력 등의 문의를 남겨주시면 확인 후 빠르게 연락 드리겠습니다.
            </div>

            {/* Form Fields */}
            <form style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }} onSubmit={handleSubmit}>
              {[
                { id: "name", label: "이름 / Name", ph: "ex. 홍길동" },
                { id: "region", label: "지역 / Region", ph: "ex. 서울시 서초구" },
                { id: "company", label: "기관명/병원명 / Organization", ph: "ex. 클라루스엔" },
                { id: "job", label: "직함 / Title", ph: "ex. 신경외과 과장" },
                { id: "email", label: "이메일 / Email", ph: "ex. clarusnai@gmail.com", type: "email" },
                { id: "phone", label: "연락처 / Contact", ph: "ex. 010-****-****", type: "tel" },
              ].map((field) => (
                <div key={field.id} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label htmlFor={field.id} style={{ color: "#cbd5e1", fontSize: "0.85rem", fontWeight: 500 }}>
                    {field.label}
                  </label>
                  <input
                    id={field.id}
                    type={field.type || "text"}
                    placeholder={field.ph}
                    value={formData[field.id as keyof typeof formData]}
                    onChange={handleField(field.id)}
                    style={{
                      width: "100%", padding: "1rem 1.25rem", borderRadius: "0.75rem",
                      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)",
                      color: "#f8fafc", fontSize: "0.95rem", outline: "none", transition: "all 0.3s ease",
                      boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)"
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = "rgba(96,165,250,0.8)"; e.currentTarget.style.background = "rgba(59,130,246,0.08)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.2)"; }}
                    onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.boxShadow = "inset 0 2px 4px rgba(0,0,0,0.2)"; }}
                  />
                </div>
              ))}

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label htmlFor="message" style={{ color: "#cbd5e1", fontSize: "0.85rem", fontWeight: 500 }}>
                  문의내용 / Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleField("message")}
                  style={{
                    width: "100%", padding: "1rem 1.25rem", borderRadius: "0.75rem",
                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)",
                    color: "#f8fafc", fontSize: "0.95rem", outline: "none", resize: "none", transition: "all 0.3s ease",
                    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)"
                  }}
                  placeholder="문의 내용을 입력해 주세요..."
                  onFocus={e => { e.currentTarget.style.borderColor = "rgba(96,165,250,0.8)"; e.currentTarget.style.background = "rgba(59,130,246,0.08)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.2)"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.boxShadow = "inset 0 2px 4px rgba(0,0,0,0.2)"; }}
                />
              </div>

              {/* 개인정보 동의 */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <input type="checkbox" id="privacy-agree" checked={privacyAgreed} onChange={e => setPrivacyAgreed(e.target.checked)} style={{ width: "1rem", height: "1rem", accentColor: "#3b82f6" }} />
                <label htmlFor="privacy-agree" style={{ color: "#94a3b8", fontSize: "0.85rem", lineHeight: 1.5 }}>
                  <button
                    type="button"
                    onClick={onOpenPrivacy}
                    style={{ color: "#60a5fa", textDecoration: "underline", background: "none", border: "none", cursor: "pointer", fontSize: "inherit", padding: 0 }}
                  >
                    개인정보 처리방침
                  </button>에 동의합니다 (필수)
                </label>
              </div>

              {submitState === "success" && (
                <div style={{ padding: "1rem", borderRadius: "0.75rem", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", color: "#86efac", fontSize: "0.95rem", textAlign: "center" }}>
                  문의가 성공적으로 전송되었습니다. 빠른 시일 내에 연락드리겠습니다.
                </div>
              )}
              {submitState === "error" && (
                <div style={{ padding: "1rem", borderRadius: "0.75rem", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5", fontSize: "0.95rem", textAlign: "center" }}>
                  전송에 실패했습니다. 잠시 후 다시 시도해주세요.
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitState === "loading"}
                style={{
                  marginTop: "1rem", width: "100%", padding: "1.1rem", borderRadius: "0.75rem",
                  background: submitState === "loading"
                    ? "rgba(59,130,246,0.4)"
                    : "linear-gradient(135deg, rgba(59,130,246,0.8) 0%, rgba(37,99,235,0.9) 100%)",
                  border: "1px solid rgba(96,165,250,0.5)",
                  color: "white", fontSize: "1.05rem", fontWeight: 600,
                  cursor: submitState === "loading" ? "not-allowed" : "pointer",
                  letterSpacing: "0.05em",
                  boxShadow: "0 4px 15px rgba(37,99,235,0.3)", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                }}
                onMouseEnter={e => { if (submitState !== "loading") { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 25px rgba(37,99,235,0.5)"; } }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 15px rgba(37,99,235,0.3)"; }}
              >
                {submitState === "loading" ? "전송 중... / Submitting..." : "제출하기 / Submit"}
              </button>
            </form>
          </div>
        </div>
      </div>
      {/* 모바일 폼 모달 */}
      {isCompactLayout && isFormOpen && (
        <div
          onClick={() => setIsFormOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
        >
        <div
          onClick={e => e.stopPropagation()}
          style={{
            width: "100%",
            maxWidth: "360px",
            maxHeight: "85vh",
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
            background: "rgba(15, 23, 42, 0.97)",
            border: "1px solid rgba(96,165,250,0.25)",
            borderRadius: "1.25rem",
            boxShadow: "0 25px 60px rgba(0,0,0,0.7), 0 0 30px rgba(59,130,246,0.12)",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexShrink: 0 }}>
            <h3 style={{ color: "#e2e8f0", fontSize: "1.5rem", fontWeight: 500, margin: 0, letterSpacing: "0.02em" }}>
              Contact
            </h3>
            <button
              onClick={() => setIsFormOpen(false)}
              style={{
                background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
                color: "#94a3b8", cursor: "pointer", padding: "0.6rem", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Description */}
          <div style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "1.25rem", flexShrink: 0 }}>
            <span style={{ color: "#e2e8f0", fontWeight: 600, fontFamily: "var(--font-bernhard)" }}>CLARUS</span><span style={{ color: "#a855f7", fontWeight: 700, fontFamily: "'HYGraphic', sans-serif" }}>-</span><span style={{ color: "#a855f7", fontWeight: 700, fontFamily: "var(--font-bernhard)" }}>N</span>에 관심 가져주셔서 감사합니다.<br />
            문의를 남겨주시면 확인 후 빠르게 연락 드리겠습니다.
          </div>

          {/* Form */}
          <form style={{ display: "flex", flexDirection: "column", gap: "1.25rem", flex: 1 }} onSubmit={handleSubmit}>
            {[
              { id: "name", label: "이름 / Name", ph: "ex. 홍길동" },
              { id: "region", label: "지역 / Region", ph: "ex. 서울시 서초구" },
              { id: "company", label: "기관명/병원명 / Organization", ph: "ex. 클라루스엔" },
              { id: "job", label: "직함 / Title", ph: "ex. 신경외과 과장" },
              { id: "email", label: "이메일 / Email", ph: "ex. clarusnai@gmail.com", type: "email" },
              { id: "phone", label: "연락처 / Contact", ph: "ex. 010-****-****", type: "tel" },
            ].map((field) => (
              <div key={`m-${field.id}`} style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label htmlFor={`m-${field.id}`} style={{ color: "#cbd5e1", fontSize: "0.82rem", fontWeight: 500 }}>
                  {field.label}
                </label>
                <input
                  id={`m-${field.id}`}
                  type={field.type || "text"}
                  placeholder={field.ph}
                  value={formData[field.id as keyof typeof formData]}
                  onChange={handleField(field.id)}
                  style={{
                    width: "100%", padding: "0.85rem 1rem", borderRadius: "0.65rem",
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                    color: "#f8fafc", fontSize: "0.95rem", outline: "none",
                  }}
                />
              </div>
            ))}

            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <label htmlFor="m-message" style={{ color: "#cbd5e1", fontSize: "0.82rem", fontWeight: 500 }}>
                문의내용 / Message
              </label>
              <textarea
                id="m-message"
                rows={4}
                value={formData.message}
                onChange={handleField("message")}
                placeholder="문의 내용을 입력해 주세요..."
                style={{
                  width: "100%", padding: "0.85rem 1rem", borderRadius: "0.65rem",
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                  color: "#f8fafc", fontSize: "0.95rem", outline: "none", resize: "none",
                }}
              />
            </div>

            {/* 개인정보 동의 */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <input type="checkbox" id="m-privacy-agree" checked={privacyAgreed} onChange={e => setPrivacyAgreed(e.target.checked)} style={{ width: "1rem", height: "1rem", accentColor: "#3b82f6" }} />
              <label htmlFor="m-privacy-agree" style={{ color: "#94a3b8", fontSize: "0.82rem", lineHeight: 1.5 }}>
                <button
                  type="button"
                  onClick={onOpenPrivacy}
                  style={{ color: "#60a5fa", textDecoration: "underline", background: "none", border: "none", cursor: "pointer", fontSize: "inherit", padding: 0 }}
                >
                  개인정보 처리방침
                </button>에 동의합니다 (필수)
              </label>
            </div>

            {submitState === "success" && (
              <div style={{ padding: "0.85rem", borderRadius: "0.65rem", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", color: "#86efac", fontSize: "0.9rem", textAlign: "center" }}>
                문의가 성공적으로 전송되었습니다. 빠른 시일 내에 연락드리겠습니다.
              </div>
            )}
            {submitState === "error" && (
              <div style={{ padding: "0.85rem", borderRadius: "0.65rem", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5", fontSize: "0.9rem", textAlign: "center" }}>
                전송에 실패했습니다. 잠시 후 다시 시도해주세요.
              </div>
            )}

            <button
              type="submit"
              disabled={submitState === "loading"}
              style={{
                marginTop: "0.5rem", width: "100%", padding: "1rem", borderRadius: "0.65rem",
                background: submitState === "loading"
                  ? "rgba(59,130,246,0.4)"
                  : "linear-gradient(135deg, rgba(59,130,246,0.8) 0%, rgba(37,99,235,0.9) 100%)",
                border: "1px solid rgba(96,165,250,0.5)",
                color: "white", fontSize: "1rem", fontWeight: 600,
                cursor: submitState === "loading" ? "not-allowed" : "pointer",
                letterSpacing: "0.05em",
                marginBottom: "env(safe-area-inset-bottom, 1rem)",
              }}
            >
              {submitState === "loading" ? "전송 중... / Submitting..." : "제출하기 / Submit"}
            </button>
          </form>

          {/* 닫기 버튼 */}
          <button
            type="button"
            onClick={() => setIsFormOpen(false)}
            style={{
              marginTop: "1rem", width: "100%", padding: "0.85rem", borderRadius: "0.65rem",
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              color: "#94a3b8", fontSize: "0.9rem", fontWeight: 500,
              cursor: "pointer", letterSpacing: "0.03em",
            }}
          >
            닫기 / Close
          </button>
        </div>
        </div>
      )}
    </section>
  );
}
