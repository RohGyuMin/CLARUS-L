import { NextResponse } from "next/server";
import { createSign } from "crypto";

// 무단 호출 방지: SETUP_SECRET 환경변수와 일치해야 실행됩니다.
// 예) curl -X POST https://your-domain/api/setup/cors -H "x-setup-secret: YOUR_SECRET"

async function getAccessToken(): Promise<string> {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON이 설정되지 않았습니다.");
  const sa = JSON.parse(raw) as { client_email: string; private_key: string };

  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
  const claims = Buffer.from(
    JSON.stringify({
      iss: sa.client_email,
      scope: "https://www.googleapis.com/auth/cloud-platform",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    })
  ).toString("base64url");

  const signingInput = `${header}.${claims}`;
  const signer = createSign("RSA-SHA256");
  signer.update(signingInput);
  const sig = signer.sign(sa.private_key).toString("base64url");

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${signingInput}.${sig}`,
    }),
  });
  const json = (await res.json()) as { access_token?: string };
  if (!json.access_token) throw new Error(`토큰 발급 실패: ${JSON.stringify(json)}`);
  return json.access_token;
}

export async function POST(request: Request) {
  const secret = process.env.SETUP_SECRET;
  if (secret) {
    const provided = request.headers.get("x-setup-secret");
    if (provided !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const bucket = process.env.STORAGE_BUCKET || "clarus-n.firebasestorage.app";
    const token = await getAccessToken();

    const corsConfig = [
      {
        origin: ["*"],
        method: ["GET", "PUT", "POST", "HEAD", "OPTIONS"],
        responseHeader: [
          "Content-Type",
          "Content-Range",
          "Content-Length",
          "X-Goog-Upload-Offset",
          "X-Goog-Upload-Status",
          "X-Goog-Upload-Command",
          "X-Goog-Upload-URL",
        ],
        maxAgeSeconds: 3600,
      },
    ];

    const res = await fetch(
      `https://storage.googleapis.com/storage/v1/b/${encodeURIComponent(bucket)}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cors: corsConfig }),
      }
    );

    const text = await res.text();
    if (!res.ok) {
      return NextResponse.json(
        { error: `CORS 설정 실패 (${res.status})`, detail: text },
        { status: 500 }
      );
    }

    const result = JSON.parse(text) as { cors?: unknown };
    return NextResponse.json({ ok: true, bucket, cors: result.cors });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}
