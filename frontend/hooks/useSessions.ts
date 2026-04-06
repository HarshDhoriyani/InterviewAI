import { useState, useEffect, useCallback } from "react";
import { api } from "@/services/api";

export interface SessionItem {
    _id: string;
    score: number;
    status: "active" | "completed";
    startedAt: string;
    completedAt?: string;
    difficulty: string;
    topic: string;
    question?: {
        _id: string;
        title: string;
        topic: string;
        difficulty: string;
    };
}

interface UseSessionsReturn {
    sessions: SessionItem[];
    isLoading: boolean;
    error: string | null;
    streak: number;
    refetch: () => void;
}


function calcStreak(sessions: SessionItem[]): number {
    if (!sessions.length) return 0;

    const days = new Set(
        sessions.map((s) => 
            new Date(s.startedAt).toISOString().split("T")[0]
        )
    );

    const sorted = Array.from(days).sort((a, b) => (a > b ? -1 : 1));

    let streak = 0;
    let cursor = new Date();
    cursor.setHours(0, 0, 0, 0);

    for (const day of sorted) {
        const d = new Date(day);
        const diff = Math.round(
            (cursor.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diff <= 1) {
            streak++;
            cursor = d;
        }
        else {
            break;
        }
    }

    return streak;
}

export function useSessions(): UseSessionsReturn {
    const [sessions, setSessions] = useState<SessionItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetch = useCallback(async() => {
        setIsLoading(true);
        setError(null);
        try {
            const { data } = await api.get<{ sessions: SessionItem[] }>("/sessions");
            setSessions(data.sessions || []);
        }
        catch (err: any) {
            console.error("[SESSIONS ERROR]", err?.response || err);

            const msg = err?.response?.data?.message || err?.message || "Failed to load sessions";

            setError(msg);
            
        }
        finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetch(); }, [fetch]);

    return {
        sessions,
        isLoading,
        error,
        streak: calcStreak(sessions),
        refetch: fetch,
    };
}