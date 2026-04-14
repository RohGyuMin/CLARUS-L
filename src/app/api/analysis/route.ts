import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { incrementAnalysisRequestCount } from "@/lib/analysisRequestCount";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const email = formData.get("email") as string;
  const fileType = formData.get("fileType") as string;

  if (!file || !email || !fileType) {
    return NextResponse.json({ error: "필수 항목이 누락되었습니다." }, { status: 400 });
  }

  if (file.size > 25 * 1024 * 1024) {
    return NextResponse.json({ error: "파일 크기는 25MB 이하여야 합니다." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"CLARUS-N 분석 의뢰" <${process.env.MAIL_USER}>`,
      to: "kkimsion@hanmail.net",
      subject: `[CLARUS-N 분석 의뢰] ${fileType} - ${file.name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f8fafc; border-radius: 12px;">
          <h2 style="color: #1e40af; margin-bottom: 8px;">CLARUS-N 연구용 데이터 AI 분석 의뢰</h2>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin-bottom: 24px;" />
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #64748b; width: 140px;">결과 수신 이메일</td><td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${email}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">파일 내용</td><td style="padding: 8px 0; color: #0f172a;">${fileType}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">파일명</td><td style="padding: 8px 0; color: #0f172a;">${file.name}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">파일 크기</td><td style="padding: 8px 0; color: #0f172a;">${(file.size / 1024 / 1024).toFixed(2)} MB</td></tr>
          </table>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
          <p style="color: #64748b; font-size: 14px;">첨부 파일을 확인해주세요. 분석 완료 후 위 이메일로 결과를 발송해 드립니다.</p>
        </div>
      `,
      attachments: [{ filename: file.name, content: buffer }],
      replyTo: email,
    });
  } catch (err) {
    console.error("[analysis API error]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }

  try {
    const count = await incrementAnalysisRequestCount();
    return NextResponse.json({ ok: true, count });
  } catch (err) {
    console.error("[analysis count increment error]", err);
    // Email send succeeded; return ok without blocking the client flow.
    return NextResponse.json({ ok: true });
  }
}
