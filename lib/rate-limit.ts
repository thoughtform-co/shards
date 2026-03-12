type RateLimitOptions = {
  max: number;
  windowMs: number;
};

type RateLimitRecord = {
  count: number;
  resetAt: number;
};

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

declare global {
  var __shardsRateLimitStore: Map<string, RateLimitRecord> | undefined;
}

function getStore() {
  if (!globalThis.__shardsRateLimitStore) {
    globalThis.__shardsRateLimitStore = new Map<string, RateLimitRecord>();
  }

  return globalThis.__shardsRateLimitStore;
}

export function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip") ?? "unknown";
}

export function checkRateLimit(
  key: string,
  { max, windowMs }: RateLimitOptions,
): RateLimitResult {
  const store = getStore();
  const now = Date.now();
  const current = store.get(key);

  if (!current || now > current.resetAt) {
    const nextRecord = {
      count: 1,
      resetAt: now + windowMs,
    };

    store.set(key, nextRecord);

    return {
      allowed: true,
      remaining: max - 1,
      resetAt: nextRecord.resetAt,
    };
  }

  current.count += 1;
  store.set(key, current);

  return {
    allowed: current.count <= max,
    remaining: Math.max(0, max - current.count),
    resetAt: current.resetAt,
  };
}
