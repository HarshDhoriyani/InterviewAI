'use client';

import type { Question } from "@/services/api";

interface Props {
  question: Question | null;
}

export default function InterviewPanel({ question }: Props) {
  if (!question) {
    return (
      <div className="flex flex-col h-full bg-[#0a0908] items-center justify-center">
        <div className="w-5 h-5 border-2 border-[#d4a843] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-[13px] text-[#635a51]">Loading question...</p>
      </div>
    );
  }

  const difficultyColor =
    question.difficulty === "easy"   ? "#34d399" :
    question.difficulty === "hard"   ? "#f87171" : "#d4a843";

  return (
    <div className="flex flex-col h-full bg-[#0a0908] overflow-auto">

      {/* Header */}
      <div className="flex-shrink-0 p-5 border-b border-[rgba(255,255,255,0.04)]">
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-[10px] font-medium uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{ background: "rgba(212,168,67,0.12)", border: "1px solid rgba(212,168,67,0.2)", color: "#d4a843" }}>
            {question.topic}
          </span>
          <span className="text-[10px] font-medium uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{
              background: `${difficultyColor}18`,
              border: `1px solid ${difficultyColor}33`,
              color: difficultyColor,
            }}>
            {question.difficulty}
          </span>
        </div>

        <h2 className="font-display text-[20px] font-600 text-white mb-3 leading-snug">
          {question.title}
        </h2>
        <p className="text-[14px] text-[#958d80] leading-relaxed">{question.description}</p>
      </div>

      {/* Test Cases */}
      {question.testCases?.length > 0 && (
        <div className="flex-shrink-0 p-5 border-b border-[rgba(255,255,255,0.04)]">
          <div className="text-[11px] uppercase tracking-widest text-[#635a51] mb-3">Test Cases</div>
          <div className="space-y-2">
            {question.testCases.slice(0, 3).map((tc, i) => (
              <div key={i} className="p-3 rounded-xl"
                style={{ background: "#111009", border: "1px solid rgba(255,255,255,0.04)" }}>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-[10px] text-[#504942] uppercase tracking-wide mb-1">Input</div>
                    <code className="text-[12px] font-mono text-[#d4a843] break-all">{tc.input}</code>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#504942] uppercase tracking-wide mb-1">Expected</div>
                    <code className="text-[12px] font-mono text-emerald-400 break-all">{tc.expectedOutput}</code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hints */}
      <div className="flex-1 p-5">
        <div className="text-[11px] uppercase tracking-widest text-[#635a51] mb-3">Approach</div>
        <div className="space-y-2">
          {[
            "Understand the problem and clarify constraints",
            "Think through edge cases before coding",
            "Start with brute force, then optimise",
            "Analyse time and space complexity",
          ].map((hint, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center mt-0.5"
                style={{ background: "rgba(212,168,67,0.12)", border: "1px solid rgba(212,168,67,0.2)" }}>
                <span className="text-[9px] font-mono text-[#d4a843]">{i + 1}</span>
              </span>
              <span className="text-[13px] text-[#7a7167] leading-relaxed">{hint}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}