"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/services/api";
import { socket } from "@/services/socket";
import { useTimer } from "@/hooks/useTimer";

import CodeEditor from "@/components/CodeEditor";
import QuestionPanel from "@/components/QuestionPanel";
import ResultPanel from "@/components/ResultPanel";

interface Question {
  title: string;
  description: string;
}

interface Result {
  evaluation: {
    totalScore: number;
    feedback: string;
  };
}

export default function Interview() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [sessionId, setSessionId] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  const seconds = useTimer(); // hook inside component
  const token = localStorage.getItem("token") || "";

  // Start interview
  const startInterview = useCallback(async () => {
    const res = await api(
      "/interview/start",
      "POST",
      { difficulty: "easy" },
      token
    );

    setQuestion(res.question);
    setSessionId(res.sessionId);
  }, [token]);

  // Submit code
  const submitCode = useCallback(
    async (code: string) => {
      const res = await api(
        "/evaluation/submit",
        "POST",
        { sessionId, code, language: "javascript" },
        token
      );
      setResult(res);
    },
    [sessionId, token]
  );

  // Start interview on mount
  useEffect(() => {
    startInterview();
  }, [startInterview]);

  // Join socket session when sessionId is available
  useEffect(() => {
    if (!sessionId) return;

    socket.emit("join-session", sessionId);

    return () => {
      socket.emit("leave-session", sessionId); // optional cleanup
    };
  }, [sessionId]);

  return (
    <div className="grid grid-cols-2 gap-4 p-6">
      <QuestionPanel question={question} />
      <CodeEditor onSubmit={submitCode} />

      {result && <ResultPanel result={result} />}

      {/* Optional timer display */}
      <div className="col-span-2 text-center text-sm text-gray-500">
        Time elapsed: {seconds}s
      </div>
    </div>
  );
}
