'use client';

import { useState, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { useSnapshot } from "@/hooks/useSnapshot";
import type { CodeSnapshotEvent } from "@/services/websocket";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const LANGUAGES = ["javascript", "typescript", "python", "java", "go", "cpp", "rust"];

interface Props {
  sessionId: string | null;
  starterCode?: string;
  onCodeChange?: (code: string, language: string) => void;
}

const MONACO_THEME = {
  base: "vs-dark" as const,
  inherit: true,
  rules: [
    { token: "comment",  foreground: "635a51", fontStyle: "italic" },
    { token: "keyword",  foreground: "d4a843" },
    { token: "string",   foreground: "8fbe8f" },
    { token: "number",   foreground: "e8c97a" },
  ],
  colors: {
    "editor.background":                "#0d0c08",
    "editor.foreground":                "#d1cdc4",
    "editor.lineHighlightBackground":   "#18160f",
    "editor.selectionBackground":       "#d4a84330",
    "editorLineNumber.foreground":      "#504942",
    "editorLineNumber.activeForeground":"#d4a843",
    "editorCursor.foreground":          "#d4a843",
  },
};

export default function CodeEditor({ sessionId, starterCode = "", onCodeChange }: Props) {
  const [language, setLanguage] = useState("javascript");
  const [code,     setCode]     = useState(starterCode || "// Write your solution here\n");
  const [fontSize, setFontSize] = useState(13);
  const editorRef = useRef<any>(null);

  // Snapshot: auto-saves every 30s + listens for remote WS snapshots
  const handleRemoteSnapshot = useCallback((data: CodeSnapshotEvent) => {
    // When another client saves a snapshot, we could show a subtle toast
    console.log("[WS] Remote snapshot received for session", data.session);
  }, []);

  const { saveSnapshot, updateCode } = useSnapshot({
    sessionId,
    intervalMs: 30_000,
    onRemoteSnapshot: handleRemoteSnapshot,
  });

  const handleChange = (val: string = "") => {
    setCode(val);
    updateCode(val, language);         // keep snapshot hook in sync
    onCodeChange?.(val, language);
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    onCodeChange?.(code, lang);
  };

  const handleMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    monaco.editor.defineTheme("interview-dark", MONACO_THEME);
    monaco.editor.setTheme("interview-dark");
  };

  const handleManualSnapshot = () => {
    saveSnapshot(code);
  };

  return (
    <div className="flex flex-col h-full bg-[#0d0c08]">

      {/* Toolbar */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-2.5 border-b border-[rgba(255,255,255,0.04)]">
        <div className="flex items-center gap-2">
          {/* Language */}
          <div className="relative">
            <select value={language} onChange={(e) => handleLanguageChange(e.target.value)}
              className="appearance-none bg-[#18160f] border border-[rgba(255,255,255,0.06)] rounded-lg px-3 py-1 text-[12px] text-[#958d80] pr-6 cursor-pointer focus:outline-none">
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
              ))}
            </select>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[#635a51] pointer-events-none text-[10px]">▾</span>
          </div>

          {/* Font size */}
          <div className="flex items-center gap-1">
            <button onClick={() => setFontSize(Math.max(10, fontSize - 1))}
              className="w-6 h-6 flex items-center justify-center rounded text-[#635a51] hover:text-[#958d80] hover:bg-[#18160f] text-[14px]">−</button>
            <span className="text-[10px] text-[#504942] w-5 text-center font-mono">{fontSize}</span>
            <button onClick={() => setFontSize(Math.min(20, fontSize + 1))}
              className="w-6 h-6 flex items-center justify-center rounded text-[#635a51] hover:text-[#958d80] hover:bg-[#18160f] text-[14px]">+</button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Save snapshot — POST /api/snapshot */}
          {sessionId && (
            <button onClick={handleManualSnapshot}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] text-[#635a51] border border-[rgba(255,255,255,0.05)] hover:text-[#d4a843] hover:border-[rgba(212,168,67,0.2)] transition-all">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1v7M3 5l3 3 3-3M1 10h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Save
            </button>
          )}

          <button onClick={() => setCode(starterCode || "// Write your solution here\n")}
            className="px-2.5 py-1.5 rounded-lg text-[11px] text-[#635a51] border border-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.1)] hover:text-[#958d80] transition-all">
            Reset
          </button>
        </div>
      </div>

      {/* Monaco */}
      <div className="flex-1 overflow-hidden">
        <MonacoEditor
          height="100%"
          language={language}
          value={code}
          onChange={handleChange}
          onMount={handleMount}
          theme="interview-dark"
          options={{
            fontSize,
            fontFamily: "JetBrains Mono, Menlo, monospace",
            fontLigatures: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: "on",
            renderLineHighlight: "line",
            tabSize: 4,
            padding: { top: 16, bottom: 16 },
            scrollbar: { verticalScrollbarSize: 4, horizontalScrollbarSize: 4 },
            smoothScrolling: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            bracketPairColorization: { enabled: true },
            wordWrap: "off",
          }}
        />
      </div>
    </div>
  );
}