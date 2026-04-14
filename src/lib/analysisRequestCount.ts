import { Redis } from "@upstash/redis";

const DEFAULT_ANALYSIS_REQUEST_COUNT = 231;
const ANALYSIS_COUNT_KEY = "analysis:count";

const kvUrl = (process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL)?.trim();
const kvToken = (process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN)?.trim();

let redisClient: Redis | null | undefined;
let memoryFallbackCount = DEFAULT_ANALYSIS_REQUEST_COUNT;
let loggedMissingKvConfig = false;

function getRedisClient() {
  if (redisClient !== undefined) {
    return redisClient;
  }

  if (!kvUrl || !kvToken) {
    redisClient = null;
    if (!loggedMissingKvConfig) {
      console.warn(
        "[analysis count] KV is not configured. Set KV_REST_API_URL/KV_REST_API_TOKEN (or UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN). Falling back to in-memory count."
      );
      loggedMissingKvConfig = true;
    }
    return redisClient;
  }

  redisClient = new Redis({ url: kvUrl, token: kvToken });
  return redisClient;
}

async function ensureInitialized(redis: Redis) {
  await redis.setnx(ANALYSIS_COUNT_KEY, DEFAULT_ANALYSIS_REQUEST_COUNT);
}

function normalizeCount(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.floor(value);
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return Math.floor(parsed);
    }
  }

  return null;
}

export async function getAnalysisRequestCount() {
  const redis = getRedisClient();
  if (!redis) return memoryFallbackCount;

  try {
    await ensureInitialized(redis);
    const value = await redis.get<string | number>(ANALYSIS_COUNT_KEY);
    const count = normalizeCount(value);
    if (count !== null) {
      memoryFallbackCount = count;
      return count;
    }
  } catch (err) {
    console.error("[analysis count] failed to load from KV:", err);
  }

  return memoryFallbackCount;
}

export async function incrementAnalysisRequestCount() {
  const redis = getRedisClient();

  if (!redis) {
    memoryFallbackCount += 1;
    return memoryFallbackCount;
  }

  try {
    await ensureInitialized(redis);
    const value = await redis.incr(ANALYSIS_COUNT_KEY);
    const count = normalizeCount(value);

    if (count !== null) {
      memoryFallbackCount = count;
      return count;
    }
  } catch (err) {
    console.error("[analysis count] failed to increment in KV:", err);
  }

  memoryFallbackCount += 1;
  return memoryFallbackCount;
}
