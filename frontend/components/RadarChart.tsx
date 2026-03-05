'use client';

import {
  RadarChart as ReRadar, Radar, PolarGrid,
  PolarAngleAxis, ResponsiveContainer, Tooltip,
} from "recharts";
import type { TopicStat } from "@/services/api";

interface Props {
  data?: TopicStat[];
}

const DEMO_DATA: TopicStat[] = [
  { topic: "Arrays",       averageScore: 78, attempts: 10 },
  { topic: "Trees",        averageScore: 65, attempts: 6  },
  { topic: "DP",           averageScore: 55, attempts: 4  },
  { topic: "Behavioral",   averageScore: 88, attempts: 8  },
  { topic: "System",       averageScore: 60, attempts: 3  },
  { topic: "Graphs",       averageScore: 72, attempts: 5  },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as TopicStat;
  return (
    <div className="px-2.5 py-1.5 rounded-lg text-[11px]"
      style={{ background: "#201e15", border: "1px solid rgba(212,168,67,0.2)" }}>
      <span className="text-[#958d80]">{d.topic}: </span>
      <span className="text-[#d4a843] font-medium">{d.averageScore?.toFixed(0)}</span>
    </div>
  );
};

export default function RadarChart({ data }: Props) {
  // Normalise topic name length for chart labels
  const chartData = (data && data.length > 0 ? data : DEMO_DATA).map((d) => ({
    ...d,
    // Truncate long topic names
    shortTopic: d.topic.length > 10 ? d.topic.slice(0, 9) + "…" : d.topic,
  }));

  return (
    <ResponsiveContainer width="100%" height={180}>
      <ReRadar data={chartData} margin={{ top: 0, right: 10, bottom: 0, left: 10 }}>
        <PolarGrid stroke="rgba(255,255,255,0.06)" />
        <PolarAngleAxis
          dataKey="shortTopic"
          tick={{ fill: "#504942", fontSize: 9 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Radar
          name="Score"
          dataKey="averageScore"
          stroke="#d4a843"
          strokeWidth={1.5}
          fill="rgba(212,168,67,0.1)"
          dot={{ fill: "#d4a843", r: 2.5, strokeWidth: 0 }}
        />
      </ReRadar>
    </ResponsiveContainer>
  );
}