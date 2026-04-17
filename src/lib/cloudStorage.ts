import { createSign, createHash } from "crypto";

type ServiceAccount = {
  client_email: string;
  private_key: string;
};

function readServiceAccount(): ServiceAccount {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON이 설정되지 않았습니다.");
  const parsed = JSON.parse(raw) as Partial<ServiceAccount>;
  if (!parsed.client_email || !parsed.private_key)
    throw new Error("서비스 계정에 client_email 또는 private_key가 없습니다.");
  return { client_email: parsed.client_email, private_key: parsed.private_key };
}

async function getAccessToken(serviceAccount: ServiceAccount): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
  const claims = Buffer.from(
    JSON.stringify({
      iss: serviceAccount.client_email,
      scope: "https://www.googleapis.com/auth/devstorage.read_write",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    })
  ).toString("base64url");

  const signingInput = `${header}.${claims}`;
  const signer = createSign("RSA-SHA256");
  signer.update(signingInput);
  const sig = signer.sign(serviceAccount.private_key).toString("base64url");
  const jwt = `${signingInput}.${sig}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  const json = (await res.json()) as { access_token?: string };
  if (!json.access_token) throw new Error("Storage 액세스 토큰 발급 실패");
  return json.access_token;
}

/**
 * Firebase Storage에 대한 resumable upload 세션 URL을 생성합니다.
 * 브라우저가 이 URL로 직접 파일을 PUT하면 됩니다.
 */
export async function createStorageUploadSession({
  bucket,
  objectPath,
  mimeType,
  fileSize,
}: {
  bucket: string;
  objectPath: string;
  mimeType: string;
  fileSize: number;
}): Promise<string> {
  const sa = readServiceAccount();
  const token = await getAccessToken(sa);

  const res = await fetch(
    `https://storage.googleapis.com/upload/storage/v1/b/${encodeURIComponent(bucket)}/o?uploadType=resumable`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json; charset=UTF-8",
        "X-Upload-Content-Type": mimeType,
        "X-Upload-Content-Length": String(fileSize),
      },
      body: JSON.stringify({ name: objectPath }),
    }
  );

  if (!res.ok) {
    throw new Error(`Storage 업로드 세션 생성 실패: ${await res.text()}`);
  }

  const uploadUrl = res.headers.get("location") ?? res.headers.get("Location");
  if (!uploadUrl) throw new Error("Storage 업로드 URL을 받지 못했습니다.");
  return uploadUrl;
}

/**
 * V4 서명 방식으로 브라우저 직접 PUT 업로드용 Signed URL을 생성합니다 (1시간 유효).
 * 인증 정보가 URL에 포함되므로 브라우저에서 직접 업로드 가능.
 */
export function createSignedUploadUrl({
  bucket,
  objectPath,
  mimeType,
  expiresInSeconds = 3600,
}: {
  bucket: string;
  objectPath: string;
  mimeType: string;
  expiresInSeconds?: number;
}): string {
  const sa = readServiceAccount();

  const now = new Date();
  const dateTime = now.toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
  const date = dateTime.slice(0, 8);

  const credentialScope = `${date}/auto/storage/goog4_request`;
  const credential = `${sa.client_email}/${credentialScope}`;
  const host = "storage.googleapis.com";
  const resourcePath = `/${bucket}/${objectPath}`;
  const signedHeaders = "content-type;host";

  const queryParams = new URLSearchParams([
    ["X-Goog-Algorithm", "GOOG4-RSA-SHA256"],
    ["X-Goog-Credential", credential],
    ["X-Goog-Date", dateTime],
    ["X-Goog-Expires", String(expiresInSeconds)],
    ["X-Goog-SignedHeaders", signedHeaders],
  ]);

  const canonicalRequest = [
    "PUT",
    resourcePath,
    queryParams.toString(),
    `content-type:${mimeType}`,
    `host:${host}`,
    "",
    signedHeaders,
    "UNSIGNED-PAYLOAD",
  ].join("\n");

  const requestHash = createHash("sha256").update(canonicalRequest).digest("hex");

  const stringToSign = ["GOOG4-RSA-SHA256", dateTime, credentialScope, requestHash].join("\n");

  const signer = createSign("RSA-SHA256");
  signer.update(stringToSign);
  const signature = signer.sign(sa.private_key, "hex");

  queryParams.append("X-Goog-Signature", signature);

  return `https://${host}${resourcePath}?${queryParams.toString()}`;
}

/**
 * V2 서명 방식으로 Storage 다운로드 URL을 생성합니다 (7일 유효).
 */
export function createSignedDownloadUrl({
  bucket,
  objectPath,
}: {
  bucket: string;
  objectPath: string;
}): string {
  const sa = readServiceAccount();
  const expiration = Math.floor(Date.now() / 1000) + 7 * 24 * 3600; // 7일

  const stringToSign = ["GET", "", "", String(expiration), `/${bucket}/${objectPath}`].join("\n");

  const signer = createSign("RSA-SHA256");
  signer.update(stringToSign);
  const signature = signer.sign(sa.private_key, "base64");

  const params = new URLSearchParams({
    GoogleAccessId: sa.client_email,
    Expires: String(expiration),
    Signature: signature,
  });

  return `https://storage.googleapis.com/${bucket}/${objectPath}?${params.toString()}`;
}
