import { NextRequest, NextResponse } from "next/server";
import { createDriveUploadSession } from "@/lib/googleDrive";

export const runtime = "nodejs";

const DEFAULT_DRIVE_FOLDER_ID = "16j-r6G57AJYSok6vaMdGOTnvFzVTvwUs";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      fileName?: string;
      mimeType?: string;
      fileSize?: number;
    };

    const fileName = body.fileName?.trim();
    const mimeType = body.mimeType?.trim() || "application/octet-stream";
    const fileSize = Number(body.fileSize);
    const folderId =
      process.env.GOOGLE_DRIVE_FOLDER_ID?.trim() || DEFAULT_DRIVE_FOLDER_ID;

    if (!fileName || !Number.isFinite(fileSize) || fileSize <= 0) {
      return NextResponse.json(
        { error: "파일 정보가 누락되었습니다." },
        { status: 400 }
      );
    }

    const uploadUrl = await createDriveUploadSession({
      fileName,
      mimeType,
      fileSize,
      folderId,
    });

    return NextResponse.json({ uploadUrl });
  } catch (error) {
    console.error("[analysis upload-session error]", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
