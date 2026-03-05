import { useCallback, useEffect, useRef } from "react";
import { snapshotAPI } from "@/services/api";
import { wsService, type CodeSnapshotEvent } from "@/services/websocket";

interface UseSnapshotOptions {
  sessionId: string | null;
  intervalMs?: number; // auto-save interval, default 30s
  onRemoteSnapshot?: (data: CodeSnapshotEvent) => void;
}

export function useSnapshot({
  sessionId,
  intervalMs = 30_000,
  onRemoteSnapshot,
}: UseSnapshotOptions) {
  const codeRef     = useRef<string>("");
  const languageRef = useRef<string>("javascript");
  const timerRef    = useRef<NodeJS.Timeout | null>(null);

  // Keep latest code available for the interval
  const updateCode = useCallback((code: string, language: string) => {
    codeRef.current     = code;
    languageRef.current = language;
  }, []);

  // POST /api/snapshot
  const saveSnapshot = useCallback(async (code?: string) => {
    if (!sessionId) return;
    const payload = {
      sessionId,
      code: code ?? codeRef.current,
      timestamp: new Date().toISOString(),
    };
    try {
      await snapshotAPI.save(payload);
      console.log("[Snapshot] Saved");
    } catch (err) {
      console.error("[Snapshot] Save failed:", err);
    }
  }, [sessionId]);

  // Auto-save on interval
  useEffect(() => {
    if (!sessionId) return;
    timerRef.current = setInterval(() => {
      if (codeRef.current) saveSnapshot();
    }, intervalMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [sessionId, intervalMs, saveSnapshot]);

  // Listen for real-time snapshots from WS
  // Backend: io.to(sessionId).emit("code-snapshot", data)
  useEffect(() => {
    if (!onRemoteSnapshot) return;
    wsService.onCodeSnapshot(onRemoteSnapshot);
    return () => wsService.offCodeSnapshot(onRemoteSnapshot);
  }, [onRemoteSnapshot]);

  return { saveSnapshot, updateCode };
}