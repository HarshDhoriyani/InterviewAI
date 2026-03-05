'use client';

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useInterview } from "@/hooks/useInterview";
import { useTimer } from "@/hooks/useTimer";
import InterviewPanel from "@/components/InterviewPanel";
import CodeEditor from "@/components/CodeEditor";
import Timer from "@/components/Timer";
import type { EvaluationResponse } from "@/services/api";

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

  const {
    session, question, evaluation, explanationResult,
    isStarting, isSubmittingCode, isSubmittingExplanation,
    isConnected, startInterview, submitCode, submitExplanation, reset,
  } = useInterview();

  const { time, isRunning, start, pause } = useTimer();

  // ── Auth guard — wait for isLoading before redirecting ──────────────────
  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.replace("/auth");
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (stage === "active") start();
    else pause();
  }, [stage]);

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
    const result = await submitCode(code, language);
    if (result) setStage("results");
  };

  const handleReset = () => {
    reset();
    setCode("");
    setExplanation("");
    setStage("setup");
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
            </div>

            {/* Score breakdown */}
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

            {/* Complexity */}
            <div className="p-3 rounded-xl mb-4"
              style={{ background: "rgba(212,168,67,0.05)", border: "1px solid rgba(212,168,67,0.12)" }}>
              <div className="text-[10px] text-[#635a51] uppercase tracking-wide mb-1">Complexity</div>
              <div className="font-mono text-[13px] text-[#d4a843]">{evaluation.estimatedComplexity}</div>
            </div>

            {/* Feedback */}
            <div className="p-4 rounded-xl mb-5"
              style={{ background: "#18160f", border: "1px solid rgba(255,255,255,0.04)" }}>
              <div className="text-[10px] text-[#635a51] uppercase tracking-wide mb-2">AI Feedback</div>
              <p className="text-[13px] text-[#958d80] leading-relaxed">{evaluation.feedback}</p>
            </div>

            {/* Explanation */}
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
        <div className={layout === "split" ? "w-1/2" : "flex-1"}>
          <CodeEditor
            sessionId={session?._id || null}
            starterCode={question?.starterCode || ""}
            onCodeChange={(c, l) => { setCode(c); setLanguage(l); }}
          />
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
          <span className="text-[10px] text-[#504942] font-mono ml-auto">
            Session · {session._id.slice(-6)}
          </span>
        )}
      </div>
    </div>
  );
}

export default function InterviewPage() {
  return <Suspense><InterviewFlow /></Suspense>;
}