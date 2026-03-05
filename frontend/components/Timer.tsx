'use client';

interface Props {
  time: number;
  isRunning: boolean;
  onToggle: () => void;
}

function formatTime(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const ss = (s % 60).toString().padStart(2, "0");
  return `${m}:${ss}`;
}

export default function Timer({ time, isRunning, onToggle }: Props) {
  const isWarning  = time > 2400;
  const isCritical = time > 2700;

  return (
    <button onClick={onToggle}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-200"
      style={{
        background: isCritical ? "rgba(239,68,68,0.08)" : isWarning ? "rgba(212,168,67,0.08)" : "#18160f",
        borderColor: isCritical ? "rgba(239,68,68,0.25)" : isWarning ? "rgba(212,168,67,0.2)" : "rgba(255,255,255,0.06)",
      }}>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
        className={isCritical ? "text-red-400" : isWarning ? "text-[#d4a843]" : "text-[#635a51]"}>
        <circle cx="6" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M6 4v2.5l1.5 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M4.5 1.5h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
      <span className={`font-mono text-[13px] font-medium ${
        isCritical ? "text-red-400" : isWarning ? "text-[#d4a843]" : "text-[#958d80]"
      }`}>
        {formatTime(time)}
      </span>
      {!isRunning && <span className="text-[10px] text-[#504942]">paused</span>}
    </button>
  );
}