import { NextRequest, NextResponse } from "next/server";
import { incrementAnalysisRequestCount } from "@/lib/analysisRequestCount";
import { createMailTransporter } from "@/lib/mailer";
import { createSignedDownloadUrl } from "@/lib/cloudStorage";

export const runtime = "nodejs";
export const maxDuration = 60;

const ANALYSIS_RECIPIENT_EMAIL = "kkimsion@hanmail.net";
const DEFAULT_BUCKET = "clarus-n.firebasestorage.app";

type StorageFileInfo = {
  objectPath: string;
  fileName: string;
  bucket?: string;
  size?: number;
};

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    email?: string;
    fileType?: string;
    storageFiles?: StorageFileInfo[];
  };

  const { email, fileType, storageFiles } = body;

  if (!email || !fileType || !storageFiles?.length) {
    return NextResponse.json(
      { error: "필수 항목이 누락되었습니다." },
      { status: 400 }
    );
  }

  const bucket = process.env.STORAGE_BUCKET?.trim() || DEFAULT_BUCKET;

  // 파일별 서명된 다운로드 URL 생성 (7일 유효)
  const fileLinksHtml = storageFiles
    .map((f) => {
      let downloadUrl = "";
      try {
        downloadUrl = createSignedDownloadUrl({
          bucket: f.bucket || bucket,
          objectPath: f.objectPath,
        });
      } catch {
        downloadUrl = "";
      }

      const sizeStr = f.size
        ? `${(f.size / 1024 / 1024).toFixed(2)} MB`
        : "";

      return `
        <tr>
          <td style="padding: 8px 0; color: #64748b; vertical-align: top; width: 140px;">첨부 파일</td>
          <td style="padding: 8px 0; color: #0f172a;">
            <strong>${f.fileName}</strong>${sizeStr ? ` <span style="color:#64748b;font-size:13px;">(${sizeStr})</span>` : ""}<br/>
            ${
              downloadUrl
                ? `<a href="${downloadUrl}" target="_blank" rel="noreferrer"
                     style="color: #2563eb; text-decoration: underline; font-size: 14px;">
                     파일 다운로드 (7일 유효)
                   </a>`
                : `<span style="color:#64748b;font-size:13px;">경로: ${f.objectPath}</span>`
            }
          </td>
        </tr>`;
    })
    .join("");

  const transporter = createMailTransporter();

  const MAIL_TIMEOUT_MS = 25_000;
  try {
    await Promise.race([
      transporter.sendMail({
      from: `"CLARUS-N 분석 의뢰" <${process.env.MAIL_USER}>`,
      to: ANALYSIS_RECIPIENT_EMAIL,
      subject: `[CLARUS-N 분석 의뢰] ${fileType} - ${storageFiles[0].fileName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f8fafc; border-radius: 12px;">
          <h2 style="color: #1e40af; margin-bottom: 8px;">CLARUS-N 연구용 데이터 AI 분석 의뢰</h2>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin-bottom: 24px;" />
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #64748b; width: 140px;">결과 수신 이메일</td>
              <td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b;">파일 내용</td>
              <td style="padding: 8px 0; color: #0f172a;">${fileType}</td>
            </tr>
            ${fileLinksHtml}
          </table>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
          <p style="color: #64748b; font-size: 14px;">
            위 링크에서 파일을 다운로드하세요 (링크는 7일간 유효합니다).<br/>
            분석 완료 후 결과를 위 이메일로 발송해 드립니다.
          </p>
        </div>
      `,
      replyTo: email,
    }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("메일 발송 시간 초과 (25s)")), MAIL_TIMEOUT_MS)
      ),
    ]);
  } catch (err) {
    console.error("[analysis API error]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }

  try {
    const count = await incrementAnalysisRequestCount();
    return NextResponse.json({ ok: true, count });
  } catch (err) {
    console.error("[analysis count increment error]", err);
    return NextResponse.json({ ok: true });
  }
}
