import { NextRequest, NextResponse } from "next/server";
import { createStorageUploadSession } from "@/lib/cloudStorage";

export const runtime = "nodejs";

const DEFAULT_BUCKET = "clarus-n.appspot.com";

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

    if (!fileName || !Number.isFinite(fileSize) || fileSize <= 0) {
      return NextResponse.json(
        { error: "파일 정보가 누락되었습니다." },
        { status: 400 }
      );
    }

    const bucket = process.env.STORAGE_BUCKET?.trim() || DEFAULT_BUCKET;
    // 파일명에 타임스탬프 추가 (중복 방지)
    const objectPath = `analysis/${Date.now()}_${fileName}`;

    const uploadUrl = await createStorageUploadSession({
      bucket,
      objectPath,
      mimeType,
      fileSize,
    });

    return NextResponse.json({ uploadUrl, objectPath, bucket });
  } catch (error) {
    console.error("[analysis upload-session error]", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
