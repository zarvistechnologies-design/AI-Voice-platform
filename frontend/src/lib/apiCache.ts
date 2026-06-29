import { getSession } from "@/lib/auth";

type ApiCacheEntry = {
  namespace: string;
  resource: string;
  expiresAt: number;
  promise: Promise<unknown>;
};

const apiCache = new Map<string, ApiCacheEntry>();

function scopedKey(namespace: string, resource: string) {
  const session = getSession();
  if (!session) return "";
  return `${session.id}:${session.organization?.id ?? ""}:${namespace}:${resource}`;
}

export function cachedApiRequest<T>(
  namespace: string,
  resource: string,
  ttlMs: number,
  loader: () => Promise<T>,
) {
  const key = scopedKey(namespace, resource);
  if (!key) return loader();
  const existing = apiCache.get(key);
  if (existing && existing.expiresAt > Date.now()) return existing.promise as Promise<T>;

  const promise = loader().catch((error) => {
    apiCache.delete(key);
    throw error;
  });
  apiCache.set(key, { namespace, resource, expiresAt: Date.now() + ttlMs, promise });
  return promise;
}

export function invalidateApiCache(namespace: string, resourcePrefix = "") {
  for (const [key, entry] of apiCache) {
    if (entry.namespace === namespace && entry.resource.startsWith(resourcePrefix)) {
      apiCache.delete(key);
    }
  }
}
