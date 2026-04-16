import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { incrementAnalysisRequestCount } from "@/lib/analysisRequestCount";
import { createDrivePermission, uploadFileToDrive } from "@/lib/googleDrive";

export const runtime = "nodejs";

const MAX_ANALYSIS_FILE_SIZE = 500 * 1024 * 1024;
const DEFAULT_DRIVE_FOLDER_ID = "16j-r6G57AJYSok6vaMdGOTnvFzVTvwUs";
const ANALYSIS_RECIPIENT_EMAIL = "kkimsion@hanmail.net";

type UploadedDriveFile = {
  fileId: string;
  fileName: string;
  webViewLink: string;
  mimeType: string;
  size: number;
};

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const files = formData.getAll("file").filter((item): item is File => item instanceof File);
  const email = formData.get("email") as string;
  const fileType = formData.get("fileType") as string;
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID?.trim() || DEFAULT_DRIVE_FOLDER_ID;

  if (files.length === 0 || !email || !fileType) {
    return NextResponse.json({ error: "필수 항목이 누락되었습니다." }, { status: 400 });
  }

  const oversized = files.filter(file => file.size > MAX_ANALYSIS_FILE_SIZE);
  if (oversized.length > 0) {
    return NextResponse.json({ error: "파일 크기는 500MB 이하여야 합니다." }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  try {
    const uploadedFiles: UploadedDriveFile[] = [];

    for (const file of files) {
      const uploaded = await uploadFileToDrive({
        fileName: file.name,
        mimeType: file.type || "application/octet-stream",
        fileSize: file.size,
        folderId,
        content: Buffer.from(await file.arrayBuffer()),
      });

      try {
        await createDrivePermission({
          fileId: uploaded.fileId,
          emailAddress: ANALYSIS_RECIPIENT_EMAIL,
        });
      } catch (error) {
        console.error("[analysis drive permission error]", error);
      }

      uploadedFiles.push(uploaded);
    }

    await transporter.sendMail({
      from: `"CLARUS-N 분석 의뢰" <${process.env.MAIL_USER}>`,
      to: ANALYSIS_RECIPIENT_EMAIL,
      subject: `[CLARUS-N 분석 의뢰] ${fileType} - ${files[0].name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f8fafc; border-radius: 12px;">
          <h2 style="color: #1e40af; margin-bottom: 8px;">CLARUS-N 연구용 데이터 AI 분석 의뢰</h2>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin-bottom: 24px;" />
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #64748b; width: 140px;">결과 수신 이메일</td><td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${email}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">파일 내용</td><td style="padding: 8px 0; color: #0f172a;">${fileType}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">파일명</td><td style="padding: 8px 0; color: #0f172a;">${files.map(file => file.name).join(", ")}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">파일 크기</td><td style="padding: 8px 0; color: #0f172a;">${files.map(file => `${(file.size / 1024 / 1024).toFixed(2)} MB`).join(", ")}</td></tr>
          </table>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
          <p style="color: #64748b; margin-bottom: 8px; font-size: 14px;">Google Drive 링크</p>
          <div style="color: #0f172a; background: #fff; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0;">
            ${uploadedFiles.map(file => `
              <p style="margin: 0 0 12px 0; word-break: break-all;">
                <strong>${file.fileName}</strong><br />
                <a href="${file.webViewLink}" target="_blank" rel="noreferrer" style="color: #2563eb; text-decoration: underline;">Google Drive 파일 열기</a>
              </p>
            `).join("")}
          </div>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
          <p style="color: #64748b; font-size: 14px;">첨부 파일을 확인해주세요. 분석 완료 후 위 이메일로 결과를 발송해 드립니다.</p>
        </div>
      `,
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
