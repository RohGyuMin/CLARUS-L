import { NextResponse } from "next/server";
import { createStorageUploadSession } from "@/lib/cloudStorage";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(request: Request) {
  const url = new URL(request.url);
  const fileName = url.searchParams.get("fileName") || "upload";
  const mimeType = url.searchParams.get("mimeType") || "application/octet-stream";
  const fileSize = parseInt(url.searchParams.get("fileSize") || "0");

  if (!fileSize) {
    return NextResponse.json({ error: "fileSize 파라미터가 필요합니다." }, { status: 400 });
  }

  const bucket = process.env.STORAGE_BUCKET?.trim() || "clarus-n.firebasestorage.app";
  const objectPath = `analysis/${Date.now()}_${fileName}`;

  try {
    const uploadUrl = await createStorageUploadSession({ bucket, objectPath, mimeType, fileSize });

    const gcsRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": mimeType,
        "Content-Length": String(fileSize),
      },
      // @ts-ignore - Node.js fetch 스트리밍 업로드
      body: request.body,
      duplex: "half",
    });

    if (!gcsRes.ok) {
      const errText = await gcsRes.text();
      return NextResponse.json(
        { error: `GCS 업로드 실패 (${gcsRes.status})`, detail: errText.slice(0, 300) },
        { status: 500 }
      );
    }

    return NextResponse.json({ objectPath, bucket });
  } catch (error) {
    console.error("[analysis upload error]", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
