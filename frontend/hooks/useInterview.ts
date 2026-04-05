import { useState, useCallback, useRef } from "react";
import {
  interviewAPI,
  evaluationAPI,
  explanationAPI,
  type Session,
  type Question,
  type EvaluationResponse,
  type ExplanationResponse,
  type StartInterviewPayload,
} from "@/services/api";
import { wsService } from "@/services/websocket";
import toast from "react-hot-toast";

interface UseInterviewReturn {
  // State
  session: Session | null;
  question: Question | null;
  evaluation: EvaluationResponse | null;
  explanationResult: ExplanationResponse | null;
  isStarting: boolean;
  isSubmittingCode: boolean;
  isSubmittingExplanation: boolean;
  isConnected: boolean;

  // Actions
  startInterview: (payload: StartInterviewPayload) => Promise<boolean>;
  submitCode: (code: string, language: string) => Promise<EvaluationResponse | null>;
  submitExplanation: (explanation: string) => Promise<ExplanationResponse | null>;
  reset: () => void;
}

export function useInterview(): UseInterviewReturn {
  const [session,             setSession]             = useState<Session | null>(null);
  const [question,            setQuestion]            = useState<Question | null>(null);
  const [evaluation,          setEvaluation]          = useState<EvaluationResponse | null>(null);
  const [explanationResult,   setExplanationResult]   = useState<ExplanationResponse | null>(null);
  const [isStarting,          setIsStarting]          = useState(false);
  const [isSubmittingCode,    setIsSubmittingCode]    = useState(false);
  const [isSubmittingExp,     setIsSubmittingExp]     = useState(false);
  const [isConnected,         setIsConnected]         = useState(false);

  const sessionRef = useRef<Session | null>(null);

  // ── POST /api/interview/start ────────────────────────────────────────────
  const startInterview = useCallback(async (payload: StartInterviewPayload): Promise<boolean> => {
    setIsStarting(true);
    try {
      const { data } = await interviewAPI.start(payload);
      setSession(data.session);
      setQuestion(data.question);
      sessionRef.current = data.session;
      localStorage.setItem("sessionId", data.session._id);
      setEvaluation(null);
      setExplanationResult(null);

      // Connect WebSocket and join the session room
      // Backend: socket.on("join-session", sessionId => socket.join(sessionId))
      try {
        if (!wsService.isConnected) await wsService.connect();
        wsService.joinSession(data.session._id);
        setIsConnected(true);

        // Listen for real-time code snapshots from other collaborators
        wsService.onCodeSnapshot((snapshot) => {
          console.log("[WS] Code snapshot received:", snapshot);
          // Snapshot events are handled in CodeEditor via the hook's exposed state
        });
      } catch {
        console.warn("[WS] WebSocket unavailable — continuing without real-time sync");
        setIsConnected(false);
      }

      toast.success("Interview session started!");
      return true;
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to start interview";
      toast.error(msg);
      return false;
    } finally {
      setIsStarting(false);
    }
  }, []);

  // ── POST /api/evaluation/submit ──────────────────────────────────────────
  const submitCode = useCallback(async (
    code: string,
    language: string
  ): Promise<EvaluationResponse | null> => {
    const sid = sessionRef.current?._id || localStorage.getItem("sessionId");
    if (!sid) {
      toast.error("No active sessions");
      return null;
    }

    setIsSubmittingCode(true);
    try {
      const { data } = await evaluationAPI.submitCode({
        sessionId: sid,
        code,
        language,
      });
      setEvaluation(data);
      toast.success(`Score: ${data.totalScore}/100`);
      return data;
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Code evaluation failed";
      toast.error(msg);
      return null;
    } finally {
      setIsSubmittingCode(false);
    }
  }, []);

  // ── POST /api/explanation/submit ─────────────────────────────────────────
  const submitExplanation = useCallback(async (
    explanation: string
  ): Promise<ExplanationResponse | null> => {
    const sid = sessionRef.current?._id || localStorage.getItem("sessionId");
    if (!sid) {
      toast.error("No active sessions");
      return null;
    }

    setIsSubmittingExp(true);
    try {
      const { data } = await explanationAPI.submit({ sessionId: sid, explanation });
      setExplanationResult(data);
      toast.success("Explanation submitted!");
      return data;
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Explanation submission failed";
      toast.error(msg);
      return null;
    } finally {
      setIsSubmittingExp(false);
    }
  }, []);

  const reset = useCallback(() => {
    wsService.disconnect();
    setSession(null);
    setQuestion(null);
    setEvaluation(null);
    setExplanationResult(null);
    setIsConnected(false);
    sessionRef.current = null;

    localStorage.removeItem("sessionId");
  }, []);

  return {
    session,
    question,
    evaluation,
    explanationResult,
    isStarting,
    isSubmittingCode,
    isSubmittingExplanation: isSubmittingExp,
    isConnected,
    startInterview,
    submitCode,
    submitExplanation,
    reset,
  };
}