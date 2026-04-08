import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, region, company, job, email, phone, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json({ error: "필수 항목이 누락되었습니다." }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  try {
  await transporter.sendMail({
    from: `"CLARUS-N 문의" <${process.env.MAIL_USER}>`,
    to: "kkimsion@hanmail.net",
    subject: `[CLARUS-N 문의] ${name} (${company ?? ""})`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f8fafc; border-radius: 12px;">
        <h2 style="color: #1e40af; margin-bottom: 8px;">CLARUS-N 온라인 문의</h2>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin-bottom: 24px;" />
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #64748b; width: 120px;">이름</td><td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${name}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;">지역</td><td style="padding: 8px 0; color: #0f172a;">${region ?? "-"}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;">기관/병원명</td><td style="padding: 8px 0; color: #0f172a;">${company ?? "-"}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;">직함</td><td style="padding: 8px 0; color: #0f172a;">${job ?? "-"}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;">이메일</td><td style="padding: 8px 0; color: #0f172a;">${email}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;">연락처</td><td style="padding: 8px 0; color: #0f172a;">${phone ?? "-"}</td></tr>
        </table>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
        <p style="color: #64748b; margin-bottom: 8px; font-size: 14px;">문의 내용</p>
        <p style="color: #0f172a; white-space: pre-wrap; background: #fff; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0;">${message}</p>
      </div>
    `,
    replyTo: email,
  });
  } catch (err) {
    console.error("[contact API error]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
