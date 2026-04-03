import { useState, useEffect, useCallback } from "react";
import { analyticsAPI, type AnalyticsResponse } from "@/services/api";

interface UseAnalyticsReturn {
  analytics: AnalyticsResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAnalytics(): UseAnalyticsReturn {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]         = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await analyticsAPI.get();
      setAnalytics(data);
    } catch (err: any) {
      const status = err?.response?.status;

      if (status === 404) {
        setAnalytics(null);
        setError(null);
        return;
      }

      const msg = err?.response?.data?.message || "Failed to load analytics";
      setError(msg);

      console.error("[Analytics]", msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { analytics, isLoading, error, refetch: fetch };
}