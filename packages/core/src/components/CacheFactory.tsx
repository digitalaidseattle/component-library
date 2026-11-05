/**
 * CacheFactory.tsx
 * 
 * @2026 Digital Aid Seattle
 */

import { useEffect, useState, useRef, useCallback } from "react";

// ---- Global cache store (shared across all hooks) ----
type CacheEntry<T> = {
  data: T | null;
  promise: Promise<T> | null;
  timestamp: number;
};

const globalCache = new Map<string, CacheEntry<any>>();

type Options<T> = {
  key: string;                    // unique cache key
  fetcher: () => Promise<T>;     // your data loader
  ttl?: number;                   // optional cache expiration (ms)
};

export function useCachedResource<T>({
  key,
  fetcher,
  ttl,
}: Options<T>) {
  const cache = globalCache.get(key) as CacheEntry<T> | undefined;

  const isExpired =
    ttl && cache ? Date.now() - cache.timestamp > ttl : false;

  const [data, setData] = useState<T | null>(
    cache && !isExpired ? cache.data : null
  );
  const [loading, setLoading] = useState(
    !cache || isExpired
  );
  const [error, setError] = useState<Error | null>(null);

  // Fix: Store fetcher in a ref so changes to inline functions don't trigger loops.
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  // Fix: Re-enable mountedRef on remount.
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const load = useCallback(
    async (forceRefresh = false) => {
      let entry = globalCache.get(key) as CacheEntry<T> | undefined;

      const expired =
        ttl && entry ? Date.now() - entry.timestamp > ttl : false;

      if (entry && entry.data && !forceRefresh && !expired) {
        setData(entry.data);
        setLoading(false);
        return;
      }

      if (!entry || forceRefresh || expired) {
        const promise = fetcherRef.current().then((result) => {
          globalCache.set(key, {
            data: result,
            promise: null,
            timestamp: Date.now(),
          });
          return result;
        })
        .catch((err) => {
            // Fix: Clear the failed promise so subsequent attempts can retry.
            const failedEntry = globalCache.get(key);
            if (failedEntry) {
              failedEntry.promise = null;
            }
            throw err;
          });

        entry = {
          data: entry?.data ?? null,
          promise,
          timestamp: entry?.timestamp ?? 0,
        };

        globalCache.set(key, entry);
      }

      setLoading(true);

      try {
        const result = await entry.promise!;
        if (mountedRef.current) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (mountedRef.current) {
          setError(err as Error);
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    },
    // Fix: Fetcher removed from deps: fetcherRef handles updates safely.
    [key, ttl]
  );

  useEffect(() => {
    load();
  }, [load]);

  return {
    data,
    loading,
    error,
    refresh: () => load(true),
  };
}