'use client';

interface Props {
  transcript: string;
  isLive?: boolean;
}

export default function TranscriptPanel({ transcript, isLive = false }: Props) {
  if (!transcript) return null;
  const words = transcript.trim().split(" ");
  return (
    <div className="p-4 bg-[#0d0c08] border-t border-[rgba(255,255,255,0.04)]">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] uppercase tracking-widest text-[#635a51]">Transcript</span>
        {isLive && (
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-emerald-500">Live</span>
          </span>
        )}
      </div>
      <p className="text-[12px] text-[#7a7167] leading-relaxed font-mono">
        {words.map((word, i) => (
          <span key={i} className={i === words.length - 1 ? "text-[#d1cdc4]" : ""}>{word} </span>
        ))}
        {isLive && <span className="inline-block w-0.5 h-3 bg-[#d4a843] ml-0.5 animate-pulse" />}
      </p>
    </div>
  );
}