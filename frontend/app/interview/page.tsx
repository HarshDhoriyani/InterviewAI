'use client';

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useInterview } from "@/hooks/useInterview";
import { useTimer } from "@/hooks/useTimer";
import { useSpeech } from "@/hooks/useSpeech";
import InterviewPanel from "@/components/InterviewPanel";
import CodeEditor from "@/components/CodeEditor";
import TranscriptPanel from "@/components/TranscriptPanel";
import Timer from "@/components/Timer";
import type { EvaluationResponse } from "@/services/api";
import toast from "react-hot-toast";

type Stage = "setup" | "active" | "results";

const TOPICS = [
  { value: "arrays",          label: "Arrays & Hashing"     },
  { value: "two-pointers",    label: "Two Pointers"          },
  { value: "sliding-window",  label: "Sliding Window"        },
  { value: "trees",           label: "Trees & Graphs"        },
  { value: "dynamic-prog",    label: "Dynamic Programming"   },
  { value: "system-design",   label: "System Design"         },
];

const DIFFICULTIES = [
  { value: "easy",   label: "Easy",   color: "#34d399" },
  { value: "medium", label: "Medium", color: "#d4a843" },
  { value: "hard",   label: "Hard",   color: "#f87171" },
] as const;

function InterviewFlow() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [stage,       setStage]       = useState<Stage>("setup");
  const [topic,       setTopic]       = useState(searchParams.get("topic") || "arrays");
  const [difficulty,  setDifficulty]  = useState<"easy" | "medium" | "hard">(
    (searchParams.get("difficulty") as any) || "medium"
  );
  const [code,        setCode]        = useState("");
  const [language,    setLanguage]    = useState("javascript");
  const [explanation, setExplanation] = useState("");
  const [layout,      setLayout]      = useState<"split" | "code">("split");

  // NEW: track whether speech panel is open in the active stage
  const [speechOpen,  setSpeechOpen]  = useState(false);

  const {
    session, question, evaluation, explanationResult,
    isStarting, isSubmittingCode, isSubmittingExplanation,
    isConnected, startInterview, submitCode, submitExplanation, reset,
  } = useInterview();

  const { time, isRunning, start, pause } = useTimer();

  // NEW: speech hook for live narration during active interview
  const { isRecording, transcript, isSupported, toggleRecording, clearTranscript } = useSpeech();

  // Auth guard
  useEffect(() => {
    if (!authLoading && !isAuthenticated) window.location.replace("/auth");
  }, [authLoading, isAuthenticated]);

  // Timer management
  useEffect(() => {
    if (stage === "active") start();
    else pause();
  }, [stage]);

  // NEW: keyboard shortcut — Ctrl/Cmd+Enter submits code
  useEffect(() => {
    if (stage !== "active") return;
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        if (code.trim() && !isSubmittingCode) handleSubmitCode();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [stage, code, isSubmittingCode]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0908] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#d4a843] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!isAuthenticated) return null;

  const handleStart = async () => {
    const ok = await startInterview({ topic, difficulty });
    if (ok) setStage("active");
  };

  const handleSubmitCode = async () => {
    if (!code.trim()) return;
    // If speech was recording, stop it first
    if (isRecording) toggleRecording();
    const result = await submitCode(code, language);
    if (result) {
      // Pre-fill explanation from speech transcript if available
      if (transcript.trim()) setExplanation(transcript.trim());
      setStage("results");
    }
  };

  const handleReset = () => {
    reset();
    clearTranscript();
    setCode("");
    setExplanation("");
    setSpeechOpen(false);
    setStage("setup");
  };

  // NEW: copy score to clipboard
  const handleCopyScore = () => {
    if (!evaluation) return;
    const text = [
      `InterviewAI Result`,
      `Total: ${evaluation.totalScore}/100`,
      `Correctness: ${evaluation.correctnessScore}`,
      `Efficiency: ${evaluation.efficiencyScore}`,
      `Quality: ${evaluation.qualityScore}`,
      `Edge Cases: ${evaluation.edgeCaseScore}`,
      `Complexity: ${evaluation.estimatedComplexity}`,
    ].join("\n");
    navigator.clipboard.writeText(text).then(() => toast.success("Score copied!"));
  };

  // ── SETUP ─────────────────────────────────────────────────────────────────
  if (stage === "setup") {
    return (
      <div className="min-h-screen bg-[#0a0908] flex items-center justify-center px-6">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(212,168,67,0.04), transparent 70%)" }} />

        <div className="relative z-10 w-full max-w-md" style={{ animation: "fadeUp 0.5s ease forwards" }}>
          <Link href="/dashboard"
            className="flex items-center gap-2 text-[#635a51] hover:text-[#958d80] transition-colors mb-8 text-[13px]">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to dashboard
          </Link>

          <h1 className="font-display text-[32px] font-600 text-white mb-2">Start Interview</h1>
          <p className="text-[14px] text-[#635a51] mb-8">Choose your topic and difficulty</p>

          <div className="space-y-6">
            {/* Topic */}
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#635a51] mb-3">Topic</label>
              <div className="grid grid-cols-2 gap-2">
                {TOPICS.map((t) => (
                  <button key={t.value} onClick={() => setTopic(t.value)}
                    className={`py-2.5 px-3 rounded-xl border text-[12px] font-medium text-left transition-all ${
                      topic === t.value
                        ? "border-[rgba(212,168,67,0.4)] bg-[rgba(212,168,67,0.08)] text-[#d4a843]"
                        : "border-[rgba(255,255,255,0.06)] bg-[#111009] text-[#635a51] hover:text-[#958d80] hover:border-[rgba(255,255,255,0.1)]"
                    }`}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#635a51] mb-3">Difficulty</label>
              <div className="grid grid-cols-3 gap-2">
                {DIFFICULTIES.map((d) => (
                  <button key={d.value} onClick={() => setDifficulty(d.value)}
                    className={`py-2.5 rounded-xl border text-[13px] font-medium transition-all ${
                      difficulty === d.value
                        ? "border-[rgba(212,168,67,0.4)] bg-[rgba(212,168,67,0.08)]"
                        : "border-[rgba(255,255,255,0.06)] bg-[#111009] text-[#635a51] hover:text-[#958d80]"
                    }`}
                    style={{ color: difficulty === d.value ? d.color : undefined }}>
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="p-4 rounded-xl"
              style={{ background: "#111009", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="font-display text-[18px] font-600 text-[#d4a843] capitalize">
                    {TOPICS.find(t => t.value === topic)?.label ?? topic}
                  </div>
                  <div className="text-[10px] text-[#504942] uppercase tracking-wide mt-0.5">Topic</div>
                </div>
                <div>
                  <div className="font-display text-[18px] font-600 capitalize"
                    style={{ color: DIFFICULTIES.find(d => d.value === difficulty)?.color }}>
                    {difficulty}
                  </div>
                  <div className="text-[10px] text-[#504942] uppercase tracking-wide mt-0.5">Difficulty</div>
                </div>
              </div>
            </div>

            {/* NEW: reminder hint */}
            <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl"
              style={{ background: "rgba(212,168,67,0.05)", border: "1px solid rgba(212,168,67,0.1)" }}>
              <span className="text-[14px] flex-shrink-0">💡</span>
              <p className="text-[12px] text-[#635a51] leading-relaxed">
                During the interview you can narrate your thinking with the mic button — your speech will pre-fill the explanation box when you submit.
              </p>
            </div>

            <button onClick={handleStart} disabled={isStarting}
              className="w-full py-3.5 rounded-xl font-medium text-[14px] text-[#0a0908] flex items-center justify-center gap-2.5 hover:brightness-110 transition-all disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #e8c97a, #d4a843)" }}>
              {isStarting
                ? <span className="w-4 h-4 border-2 border-[#0a0908] border-t-transparent rounded-full animate-spin" />
                : <>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M6.5 5.5l4 2.5-4 2.5V5.5z" fill="currentColor"/>
                    </svg>
                    Begin Interview
                  </>
              }
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── RESULTS ───────────────────────────────────────────────────────────────
  if (stage === "results" && evaluation) {
    return (
      <div className="min-h-screen bg-[#0a0908] text-[#d1cdc4] flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl" style={{ animation: "fadeUp 0.5s ease forwards" }}>
          <div className="p-8 rounded-2xl mb-4"
            style={{ background: "#111009", border: "1px solid rgba(212,168,67,0.15)" }}>

            <div className="text-center mb-8">
              <div className="font-mono text-[11px] text-[#635a51] uppercase tracking-widest mb-3">Session Complete</div>
              <div className="font-display leading-none text-[80px] font-600"
                style={{
                  color: evaluation.totalScore >= 80 ? "#34d399"
                       : evaluation.totalScore >= 60 ? "#d4a843" : "#f87171",
                }}>
                {evaluation.totalScore}
              </div>
              <div className="text-[13px] text-[#635a51]">Total Score / 100</div>

              {/* NEW: score label */}
              <div className="mt-3 inline-block px-3 py-1 rounded-full text-[12px] font-medium"
                style={{
                  background: evaluation.totalScore >= 80
                    ? "rgba(52,211,153,0.1)" : evaluation.totalScore >= 60
                    ? "rgba(212,168,67,0.1)" : "rgba(248,113,113,0.1)",
                  color: evaluation.totalScore >= 80 ? "#34d399"
                       : evaluation.totalScore >= 60 ? "#d4a843" : "#f87171",
                  border: `1px solid ${evaluation.totalScore >= 80 ? "rgba(52,211,153,0.25)"
                    : evaluation.totalScore >= 60 ? "rgba(212,168,67,0.25)" : "rgba(248,113,113,0.25)"}`,
                }}>
                {evaluation.totalScore >= 80 ? "Strong pass 🎉"
                  : evaluation.totalScore >= 60 ? "Borderline — review feedback"
                  : "Needs work — check the tips below"}
              </div>
            </div>

            {/* Score breakdown (unchanged) */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { label: "Correctness",  value: evaluation.correctnessScore },
                { label: "Efficiency",   value: evaluation.efficiencyScore  },
                { label: "Code Quality", value: evaluation.qualityScore     },
                { label: "Edge Cases",   value: evaluation.edgeCaseScore    },
              ].map((s) => (
                <div key={s.label} className="p-3 rounded-xl"
                  style={{ background: "#18160f", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <div className="text-[10px] text-[#635a51] uppercase tracking-wide mb-2">{s.label}</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-[#201e15] rounded-full overflow-hidden">
                      <div className="h-full rounded-full"
                        style={{ width: `${s.value}%`, background: "linear-gradient(90deg, #d4a843, #e8c97a)" }} />
                    </div>
                    <span className="font-mono text-[12px] text-[#d4a843]">{s.value}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Complexity (unchanged) */}
            <div className="p-3 rounded-xl mb-4"
              style={{ background: "rgba(212,168,67,0.05)", border: "1px solid rgba(212,168,67,0.12)" }}>
              <div className="text-[10px] text-[#635a51] uppercase tracking-wide mb-1">Complexity</div>
              <div className="font-mono text-[13px] text-[#d4a843]">{evaluation.estimatedComplexity}</div>
            </div>

            {/* Feedback (unchanged) */}
            <div className="p-4 rounded-xl mb-5"
              style={{ background: "#18160f", border: "1px solid rgba(255,255,255,0.04)" }}>
              <div className="text-[10px] text-[#635a51] uppercase tracking-wide mb-2">AI Feedback</div>
              <p className="text-[13px] text-[#958d80] leading-relaxed">{evaluation.feedback}</p>
            </div>

            {/* Explanation (unchanged) */}
            {!explanationResult ? (
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-[#635a51] mb-2">
                  Add verbal explanation (optional)
                </label>
                <textarea value={explanation} onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Walk through your solution approach..."
                  className="w-full px-4 py-3 rounded-xl text-[13px] text-[#d1cdc4] placeholder:text-[#504942] resize-none focus:outline-none"
                  style={{
                    background: "#111009",
                    border: "1px solid rgba(255,255,255,0.06)",
                    minHeight: "80px",
                    fontFamily: "var(--font-sora)",
                  }} />
                {/* NEW: show speech hint if transcript was captured */}
                {transcript.trim() && explanation === transcript.trim() && (
                  <p className="text-[11px] text-[#635a51] mt-1.5">
                    ✓ Pre-filled from your narration — edit freely
                  </p>
                )}
                <button onClick={() => submitExplanation(explanation)}
                  disabled={!explanation.trim() || isSubmittingExplanation}
                  className="mt-2 w-full py-2.5 rounded-xl text-[13px] font-medium text-[#d4a843] border border-[rgba(212,168,67,0.25)] hover:bg-[rgba(212,168,67,0.08)] disabled:opacity-40 transition-all">
                  {isSubmittingExplanation ? "Evaluating..." : "Submit Explanation"}
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-xl"
                style={{ background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.2)" }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] text-emerald-400 uppercase tracking-wide">Explanation Score</span>
                  <span className="font-display text-[20px] font-600 text-emerald-400">{explanationResult.explanationScore}</span>
                </div>
                <p className="text-[13px] text-[#7a7167]">{explanationResult.feedback}</p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button onClick={handleReset}
              className="flex-1 py-3 rounded-xl text-[13px] font-medium text-[#958d80] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.12)] transition-all">
              Try Another
            </button>
            {/* NEW: copy score button */}
            <button onClick={handleCopyScore}
              className="px-4 py-3 rounded-xl text-[13px] font-medium text-[#635a51] border border-[rgba(255,255,255,0.08)] hover:text-[#d4a843] hover:border-[rgba(212,168,67,0.25)] transition-all"
              title="Copy score to clipboard">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="4" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M4 4V2.5A1.5 1.5 0 015.5 1h7A1.5 1.5 0 0114 2.5v7A1.5 1.5 0 0112.5 11H11"
                  stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
            </button>
            <Link href="/dashboard"
              className="flex-1 py-3 rounded-xl text-[13px] font-medium text-[#0a0908] text-center hover:brightness-110 transition-all"
              style={{ background: "linear-gradient(135deg, #e8c97a, #d4a843)" }}>
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── ACTIVE INTERVIEW ──────────────────────────────────────────────────────
  return (
    <div className="h-screen bg-[#0a0908] text-[#d1cdc4] flex flex-col overflow-hidden">

      {/* Top bar */}
      <header className="h-12 border-b border-[rgba(255,255,255,0.04)] flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={handleReset} className="text-[#635a51] hover:text-[#958d80] transition-colors">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="w-px h-4 bg-[rgba(255,255,255,0.06)]" />
          <span className="text-[12px] text-[#958d80] capitalize">
            {TOPICS.find(t => t.value === topic)?.label ?? topic}
          </span>
          <span className="text-[#504942]">·</span>
          <span className="text-[12px] font-medium capitalize"
            style={{ color: DIFFICULTIES.find(d => d.value === difficulty)?.color }}>
            {difficulty}
          </span>
          {isConnected && (
            <>
              <span className="text-[#504942]">·</span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[11px] text-emerald-500">Live</span>
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Timer time={time} isRunning={isRunning} onToggle={isRunning ? pause : start} />

          {/* NEW: mic toggle button */}
          {isSupported && (
            <button onClick={() => { toggleRecording(); if (!speechOpen) setSpeechOpen(true); }}
              title={isRecording ? "Stop narration" : "Narrate your thinking"}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all"
              style={{
                background: isRecording ? "rgba(239,68,68,0.08)" : "#18160f",
                borderColor: isRecording ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.06)",
              }}>
              {isRecording ? (
                <>
                  <span className="recording-dot" style={{ width: 6, height: 6 }} />
                  <span className="text-[11px] text-red-400 font-medium">Recording</span>
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-[#635a51]">
                    <rect x="4" y="1" width="4" height="7" rx="2" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M2 6c0 2.21 1.79 4 4 4s4-1.79 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    <path d="M6 10v1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                  <span className="text-[11px] text-[#635a51]">Narrate</span>
                </>
              )}
            </button>
          )}

          <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: "#18160f" }}>
            {(["split", "code"] as const).map((l) => (
              <button key={l} onClick={() => setLayout(l)}
                className={`px-2.5 py-1 rounded-md text-[11px] capitalize transition-all ${
                  layout === l ? "bg-[rgba(212,168,67,0.15)] text-[#d4a843]" : "text-[#635a51] hover:text-[#958d80]"
                }`}>
                {l}
              </button>
            ))}
          </div>

          <button onClick={handleSubmitCode}
            disabled={!code.trim() || isSubmittingCode}
            title="Submit (⌘ Enter)"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-[#0a0908] disabled:opacity-50 hover:brightness-110 transition-all"
            style={{ background: "linear-gradient(135deg, #e8c97a, #d4a843)" }}>
            {isSubmittingCode
              ? <span className="w-3 h-3 border border-[#0a0908] border-t-transparent rounded-full animate-spin" />
              : "Submit"
            }
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {layout === "split" && (
          <div className="w-1/2 border-r border-[rgba(255,255,255,0.04)] overflow-hidden">
            <InterviewPanel question={question} />
          </div>
        )}
        <div className={`${layout === "split" ? "w-1/2" : "flex-1"} flex flex-col overflow-hidden`}>
          <div className="flex-1 overflow-hidden">
            <CodeEditor
              sessionId={session?._id || null}
              starterCode={question?.starterCode || ""}
              onCodeChange={(c, l) => { setCode(c); setLanguage(l); }}
            />
          </div>
          {/* NEW: live transcript panel — shown only when speech panel is open */}
          {speechOpen && (
            <div className="flex-shrink-0">
              <TranscriptPanel transcript={transcript} isLive={isRecording} />
              {/* close/clear strip */}
              <div className="flex items-center justify-between px-4 py-2 bg-[#0d0c08] border-t border-[rgba(255,255,255,0.04)]">
                <button onClick={clearTranscript}
                  className="text-[11px] text-[#504942] hover:text-[#635a51] transition-colors">
                  Clear transcript
                </button>
                <button onClick={() => setSpeechOpen(false)}
                  className="text-[11px] text-[#504942] hover:text-[#635a51] transition-colors">
                  Hide
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div className="h-7 border-t border-[rgba(255,255,255,0.04)] flex items-center px-4 gap-4 flex-shrink-0"
        style={{ background: "#0d0c08" }}>
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? "bg-emerald-500" : "bg-[#635a51]"}`} />
          <span className="text-[10px] text-[#504942]">{isConnected ? "Connected" : "Offline"}</span>
        </div>
        {session && (
          <span className="text-[10px] text-[#504942] font-mono">
            Session · {session._id.slice(-6)}
          </span>
        )}
        {/* NEW: keyboard shortcut hint */}
        <span className="text-[10px] text-[#504942] ml-auto hidden sm:block">
          ⌘ Enter to submit
        </span>
      </div>
    </div>
  );
}

export default function InterviewPage() {
  return <Suspense><InterviewFlow /></Suspense>;
}