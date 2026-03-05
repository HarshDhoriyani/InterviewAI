'use client';

import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Cell,
} from "recharts";
import type { DifficultyStat } from "@/services/api";

interface Props {
  data?: DifficultyStat[];
}

// Fallback demo data when API data is empty
const DEMO_DATA: DifficultyStat[] = [
  { difficulty: "easy",   averageScore: 82, attempts: 12 },
  { difficulty: "medium", averageScore: 71, attempts: 8  },
  { difficulty: "hard",   averageScore: 58, attempts: 4  },
];

const COLOR_MAP: Record<string, string> = {
  easy:   "#34d399",
  medium: "#d4a843",
  hard:   "#f87171",
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as DifficultyStat;
  return (
    <div className="px-3 py-2 rounded-xl text-[12px]"
      style={{ background: "#201e15", border: "1px solid rgba(212,168,67,0.2)" }}>
      <div className="text-[#635a51] capitalize mb-1">{label}</div>
      <div className="text-[#d1cdc4]">Avg Score: <span className="text-[#d4a843] font-medium">{d.averageScore?.toFixed(0)}</span></div>
      <div className="text-[#635a51]">Attempts: {d.attempts}</div>
    </div>
  );
};

export default function PerformanceChart({ data }: Props) {
  const chartData = data && data.length > 0 ? data : DEMO_DATA;

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
        <XAxis
          dataKey="difficulty"
          tick={{ fill: "#504942", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => v.charAt(0).toUpperCase() + v.slice(1)}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fill: "#504942", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
        <Bar dataKey="averageScore" radius={[6, 6, 0, 0]}>
          {chartData.map((entry, i) => (
            <Cell
              key={i}
              fill={COLOR_MAP[entry.difficulty] || "#d4a843"}
              fillOpacity={0.8}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}