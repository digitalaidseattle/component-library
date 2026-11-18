// @vitest-environment jsdom
import { renderHook, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useCachedResource } from "./CacheFactory";

describe("useCachedResource", () => {
  it("1. fetches data and manages loading state", async () => {
    const mockFetcher = vi.fn().mockResolvedValue(["Art", "Music"]);

    const { result } = renderHook(() =>
      useCachedResource({
        key: "test-fetch-1",
        fetcher: mockFetcher,
      })
    );

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(["Art", "Music"]);
    expect(mockFetcher).toHaveBeenCalledTimes(1);
  });

  it("2. deduplicates requests across components and uses cached data", async () => {
    const mockFetcher = vi.fn().mockResolvedValue(["Art", "Music"]);

    const hookA = renderHook(() =>
      useCachedResource({ key: "test-dedup-2", fetcher: mockFetcher })
    );

    const hookB = renderHook(() =>
      useCachedResource({ key: "test-dedup-2", fetcher: mockFetcher })
    );

    await waitFor(() => {
      expect(hookA.result.current.loading).toBe(false);
      expect(hookB.result.current.loading).toBe(false);
    });

    expect(mockFetcher).toHaveBeenCalledTimes(1);
    expect(hookA.result.current.data).toEqual(["Art", "Music"]);
    expect(hookB.result.current.data).toEqual(["Art", "Music"]);
  });

  it("3. does NOT re-fetch on parent re-renders with new inline fetcher references", async () => {
    const mockFetcher = vi.fn().mockResolvedValue("data");

    const { rerender } = renderHook(
      ({ count }) =>
        useCachedResource({
          key: "test-ref-stability-3",
          fetcher: () => mockFetcher(count),
        }),
      { initialProps: { count: 1 } }
    );

    await waitFor(() => expect(mockFetcher).toHaveBeenCalledTimes(1));

    // Force re-renders with fresh function references
    rerender({ count: 2 });
    rerender({ count: 3 });

    expect(mockFetcher).toHaveBeenCalledTimes(1);
  });

  it("4. clears failed promises so retries can succeed", async () => {
    const failingFetcher = vi
      .fn()
      .mockRejectedValueOnce(new Error("Network Error"))
      .mockResolvedValueOnce(["Recovered Data"]);

    const { result } = renderHook(() =>
      useCachedResource({
        key: "test-error-retry-4",
        fetcher: failingFetcher,
      })
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error?.message).toBe("Network Error");

    await act(async () => {
      await result.current.refresh();
    });

    await waitFor(() => expect(result.current.data).toEqual(["Recovered Data"]));
    expect(result.current.error).toBeNull();
    expect(failingFetcher).toHaveBeenCalledTimes(2);
  });

  it("5. respects TTL expiration", async () => {
    let now = 1000000;
    const dateSpy = vi.spyOn(Date, "now").mockImplementation(() => now);

    const mockFetcher = vi
      .fn()
      .mockResolvedValueOnce("first")
      .mockResolvedValueOnce("second");

    // First mount
    const hook1 = renderHook(() =>
      useCachedResource({
        key: "test-ttl-5",
        fetcher: mockFetcher,
        ttl: 1000,
      })
    );

    await waitFor(() => expect(hook1.result.current.data).toBe("first"));
    hook1.unmount();

    // Advance virtual clock past the 1000ms TTL
    now += 1500;

    // Second mount (e.g. user revisited the page/component)
    const hook2 = renderHook(() =>
      useCachedResource({
        key: "test-ttl-5",
        fetcher: mockFetcher,
        ttl: 1000,
      })
    );

    await waitFor(() => expect(hook2.result.current.data).toBe("second"));
    expect(mockFetcher).toHaveBeenCalledTimes(2);

    dateSpy.mockRestore();
  });
});