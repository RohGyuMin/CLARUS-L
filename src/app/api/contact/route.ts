import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createDrivePermission } from "@/lib/googleDrive";

export const runtime = "nodejs";

type ContactBody = {
  name?: string;
  region?: string;
  company?: string;
  job?: string;
  email?: string;
  phone?: string;
  message?: string;
  driveFile?: {
    fileId?: string;
    fileName?: string;
    webViewLink?: string;
    mimeType?: string;
    size?: number;
  } | null;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as ContactBody;
  const { name, region, company, job, email, phone, message, driveFile } = body;
  const recipientEmail = process.env.CONTACT_RECIPIENT_EMAIL?.trim() || "kkimsion@hanmail.net";
  const senderEmail = "right-heart@hanmail.net";

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

  const safeName = escapeHtml(name);
  const safeRegion = escapeHtml(region ?? "-");
  const safeCompany = escapeHtml(company ?? "-");
  const safeJob = escapeHtml(job ?? "-");
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone ?? "-");
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");
  const subjectName = name.replace(/[\r\n]+/g, " ").trim();
  const subjectCompany = (company ?? "").replace(/[\r\n]+/g, " ").trim();

  let driveLinkBlock = "";
  let drivePermissionFailed = false;

  if (driveFile?.fileId) {
    const driveLink = driveFile.webViewLink?.trim() || `https://drive.google.com/file/d/${driveFile.fileId}/view`;

    try {
      await createDrivePermission({
        fileId: driveFile.fileId,
        emailAddress: recipientEmail,
      });
    } catch (error) {
      console.error("[contact drive permission error]", error);
      drivePermissionFailed = true;
    }

    driveLinkBlock = `
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
      <p style="color: #64748b; margin-bottom: 8px; font-size: 14px;">첨부 파일</p>
      <p style="color: #0f172a; background: #fff; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; word-break: break-all;">
        <strong>${escapeHtml(driveFile.fileName ?? "첨부 파일")}</strong><br />
        <a href="${driveLink}" target="_blank" rel="noreferrer" style="color: #2563eb; text-decoration: underline;">Google Drive 파일 열기</a>
      </p>
      ${drivePermissionFailed ? `
        <p style="color: #b45309; font-size: 13px; margin-top: 8px;">
          파일 업로드는 완료되었지만, 권한 공유는 자동 설정에 실패했습니다. Drive 폴더 공유 상태를 확인해주세요.
        </p>
      ` : ""}
    `;
  }

  try {
    await transporter.sendMail({
      from: `"CLARUS-N 문의" <${senderEmail}>`,
      to: recipientEmail,
      subject: `[CLARUS-N 문의] ${subjectName} (${subjectCompany})`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f8fafc; border-radius: 12px;">
          <h2 style="color: #1e40af; margin-bottom: 8px;">CLARUS-N 온라인 문의</h2>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin-bottom: 24px;" />
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #64748b; width: 120px;">이름</td><td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${safeName}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">지역</td><td style="padding: 8px 0; color: #0f172a;">${safeRegion}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">기관/병원명</td><td style="padding: 8px 0; color: #0f172a;">${safeCompany}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">직함</td><td style="padding: 8px 0; color: #0f172a;">${safeJob}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">이메일</td><td style="padding: 8px 0; color: #0f172a;">${safeEmail}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">연락처</td><td style="padding: 8px 0; color: #0f172a;">${safePhone}</td></tr>
          </table>
          ${driveLinkBlock}
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
          <p style="color: #64748b; margin-bottom: 8px; font-size: 14px;">문의 내용</p>
          <p style="color: #0f172a; white-space: pre-wrap; background: #fff; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0;">${safeMessage}</p>
        </div>
      `,
      replyTo: email,
    });
  } catch (error) {
    console.error("[contact API error]", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
