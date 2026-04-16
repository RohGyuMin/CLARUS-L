import { createSign } from "crypto";

type ServiceAccountConfig = {
  client_email: string;
  private_key: string;
};

type DriveUploadSessionInput = {
  fileName: string;
  mimeType: string;
  fileSize: number;
  folderId: string;
};

type DriveFileUploadInput = DriveUploadSessionInput & {
  content: Buffer | Uint8Array | ArrayBuffer;
};

type DrivePermissionInput = {
  fileId: string;
  emailAddress: string;
};

const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive";
const TOKEN_URI = "https://oauth2.googleapis.com/token";
const DRIVE_UPLOAD_URI =
  "https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&supportsAllDrives=true&fields=id,name,webViewLink";

function base64UrlEncode(value: Buffer | string) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function readServiceAccountConfig(): ServiceAccountConfig {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

  if (raw) {
    let parsed: Partial<ServiceAccountConfig>;
    try {
      parsed = JSON.parse(raw) as Partial<ServiceAccountConfig>;
    } catch {
      throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON이 올바른 JSON 형식이 아닙니다.");
    }
    if (!parsed.client_email || !parsed.private_key) {
      throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON에 client_email과 private_key가 필요합니다.");
    }
    return {
      client_email: parsed.client_email,
      private_key: parsed.private_key,
    };
  }

  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

  if (clientEmail && privateKey) {
    return { client_email: clientEmail, private_key: privateKey };
  }

  throw new Error(
    "Google Drive 업로드를 위해 GOOGLE_SERVICE_ACCOUNT_JSON 또는 GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL / GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY가 필요합니다."
  );
}

async function getAccessToken() {
  const serviceAccount = readServiceAccountConfig();
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claims = {
    iss: serviceAccount.client_email,
    scope: DRIVE_SCOPE,
    aud: TOKEN_URI,
    iat: now,
    exp: now + 3600,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedClaims = base64UrlEncode(JSON.stringify(claims));
  const signingInput = `${encodedHeader}.${encodedClaims}`;

  const signer = createSign("RSA-SHA256");
  signer.update(signingInput);
  signer.end();
  const signature = signer.sign(serviceAccount.private_key);
  const assertion = `${signingInput}.${base64UrlEncode(signature)}`;

  const tokenRes = await fetch(TOKEN_URI, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });

  if (!tokenRes.ok) {
    throw new Error(`Google OAuth 토큰 발급 실패: ${await tokenRes.text()}`);
  }

  const tokenJson = (await tokenRes.json()) as { access_token?: string };
  if (!tokenJson.access_token) {
    throw new Error("Google OAuth 응답에서 access_token을 받지 못했습니다.");
  }

  return tokenJson.access_token;
}

export async function createDriveUploadSession({
  fileName,
  mimeType,
  fileSize,
  folderId,
}: DriveUploadSessionInput) {
  const accessToken = await getAccessToken();

  const res = await fetch(DRIVE_UPLOAD_URI, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json; charset=UTF-8",
      "X-Upload-Content-Type": mimeType,
      "X-Upload-Content-Length": String(fileSize),
    },
    body: JSON.stringify({
      name: fileName,
      parents: [folderId],
    }),
  });

  if (!res.ok) {
    throw new Error(`Drive 업로드 세션 생성 실패: ${await res.text()}`);
  }

  const uploadUrl = res.headers.get("location") ?? res.headers.get("Location");
  if (!uploadUrl) {
    throw new Error("Drive 업로드 세션 URL을 받지 못했습니다.");
  }

  return uploadUrl;
}

export async function uploadFileToDrive({
  fileName,
  mimeType,
  fileSize,
  folderId,
  content,
}: DriveFileUploadInput) {
  const uploadUrl = await createDriveUploadSession({
    fileName,
    mimeType,
    fileSize,
    folderId,
  });

  const body =
    content instanceof Buffer
      ? content
      : content instanceof ArrayBuffer
        ? Buffer.from(content)
        : Buffer.from(content);

  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": mimeType,
      "Content-Range": `bytes 0-${fileSize - 1}/${fileSize}`,
    },
    body,
  });

  if (!res.ok) {
    throw new Error(`Drive 파일 업로드 실패: ${await res.text()}`);
  }

  const uploadData = (await res.json()) as {
    id?: string;
    name?: string;
    webViewLink?: string;
  };

  if (!uploadData.id) {
    throw new Error("Drive 업로드 결과에서 파일 ID를 받지 못했습니다.");
  }

  return {
    fileId: uploadData.id,
    fileName: uploadData.name ?? fileName,
    webViewLink: uploadData.webViewLink ?? `https://drive.google.com/file/d/${uploadData.id}/view`,
    mimeType,
    size: fileSize,
  };
}

export async function createDrivePermission({ fileId, emailAddress }: DrivePermissionInput) {
  const accessToken = await getAccessToken();

  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions?supportsAllDrives=true`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({
      type: "user",
      role: "reader",
      emailAddress,
    }),
  });

  if (!res.ok) {
    throw new Error(`Drive 권한 부여 실패: ${await res.text()}`);
  }
}
