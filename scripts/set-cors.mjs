/**
 * Firebase Storage 버킷에 CORS 규칙을 설정합니다.
 * 실행: node scripts/set-cors.mjs
 *
 * .env.local 또는 환경변수 GOOGLE_SERVICE_ACCOUNT_JSON, STORAGE_BUCKET 이 필요합니다.
 */

import { createSign } from "crypto";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

// .env.local 로드
const envPath = resolve(process.cwd(), ".env.local");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const [key, ...rest] = line.split("=");
    if (key && rest.length && !process.env[key.trim()]) {
      process.env[key.trim()] = rest.join("=").trim().replace(/^["']|["']$/g, "");
    }
  }
}

const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
if (!raw) {
  console.error("GOOGLE_SERVICE_ACCOUNT_JSON 환경변수가 없습니다.");
  process.exit(1);
}

const sa = JSON.parse(raw);
const bucket = process.env.STORAGE_BUCKET || "clarus-n.firebasestorage.app";

async function getAccessToken() {
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
  const json = await res.json();
  if (!json.access_token) throw new Error(`토큰 발급 실패: ${JSON.stringify(json)}`);
  return json.access_token;
}

async function setCors(token) {
  const cors = [
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
      body: JSON.stringify({ cors }),
    }
  );

  const text = await res.text();
  if (!res.ok) throw new Error(`CORS 설정 실패 (${res.status}): ${text}`);
  const result = JSON.parse(text);
  console.log("✅ CORS 설정 완료:", JSON.stringify(result.cors, null, 2));
}

(async () => {
  try {
    console.log(`버킷: ${bucket}`);
    const token = await getAccessToken();
    await setCors(token);
  } catch (e) {
    console.error("❌ 오류:", e.message);
    process.exit(1);
  }
})();
