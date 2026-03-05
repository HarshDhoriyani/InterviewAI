import { useState, useCallback, useRef, useEffect } from "react";

export function useTimer(initialSeconds = 0) {
  const [time, setTime]           = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef               = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(() => {
    if (isRunning) return;
    setIsRunning(true);
    intervalRef.current = setInterval(() => setTime((t) => t + 1), 1000);
  }, [isRunning]);

  const pause = useCallback(() => {
    if (!isRunning) return;
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, [isRunning]);

  const reset = useCallback(() => {
    pause();
    setTime(initialSeconds);
  }, [pause, initialSeconds]);

  useEffect(() => () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const formatted = formatTime(time);
  return { time, isRunning, formatted, start, pause, reset };
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}