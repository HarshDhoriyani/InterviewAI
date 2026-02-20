"use client"

import { useEffect, useState } from "react";
import { api } from "@/services/api";

export default function Dashboard() {
    const [data, setData] = useState<any>(null);
    const token = localStorage.getItem("token") || "";

    useEffect(() => {
        api("/analytics", "GET", null, token).then(setData);
    }, []);

    if (!data) {
        return <p className="p-10 text-gray-500">Loading dashboard...</p>;
    }

    const averageScore = Number(data.averageScore ?? 0);
    const confidenceScore = Number(data.confidenceScore ?? 0);
    const totalInterviews = data.totalInterviews ?? 0;
    const topicStats = Array.isArray(data.topicStats) ? data.topicStats : [];
    const difficultyStats = Array.isArray(data.difficultyStats) ? data.difficultyStats : [];

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50">
            
            {/* Header */}
            <h1 className="text-3xl font-bold text-slate-800">
                Your Interview Dashboard
            </h1>
            <p className="text-slate-500 mt-1">
                Track your growth and interview readiness
            </p>

            {/* Top Stats */}
            <div className="grid m:grid-cols-3 gap-6 mt-10">
                <StatCard 
                    title="Interview Readiness"
                    value={`${Math.round(
                        averageScore * 0.7 + confidenceScore * 0.3
                    )}%`}
                    color="indigo"
                />

                <StatCard 
                    title="Average Score"
                    value={`${Math.round(averageScore)}%`}
                    color="emerald"
                />

                <StatCard 
                    title="Total Interviews"
                    value={totalInterviews}
                    color="amber"
                />
            </div>

            {/* Strengths and Weaknesses */}
            <div className="grid md:grid-cols-2 gap-10 mt-16">

                {/* Topic Strength */}
                <div className="bg-white rounded-2xl shadow-md p-6">
                    <h2 className="text-lg font-semibold text-slate-800">
                        Topic Performance
                    </h2>

                    <div className="mt-4 space-y-4">
                        {topicStats.map((t: any) => (
                            <ProgressRow 
                                key={t.topic}
                                label={t.topic}
                                value={Number(t.averageScore ?? 0)}
                            />
                        ))}
                    </div>
                </div>

                {/* Difficulty */}
                <div className="bg-white rounded-2xl shadow-md p-6">
                    <h2 className="text-lg font-semibold text-slate-800">
                        Difficulty Performance
                    </h2>

                    <div className="mt-4 space-y-3">
                        {difficultyStats.map((d: any) => (
                            <ProgressRow 
                                key={d.difficulty}
                                label={String(d.difficulty).toUpperCase()}
                                value={Number(d.averageScore ?? 0)}
                            />
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

/* ----------- Components ----------- */

function StatCard({
    title,
    value,
    color,
}: {
    title: string,
    value: string | number;
    color: "indigo" | "emerald" | "amber";
}) {
    const colors: any = {
        indigo: "bg-indigo-50 text-indigo-700",
        emerald: "bg-emerald-50 text-emerald-700",
        amber: "bg-amber-50 text-amber-700",
    };

    return (
        <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-slate-500 text-sm">{title}</p>
            <p className={`text-3xl font-bold mt-2 ${colors[color]}`}>
                {value}
            </p>
        </div>
    );
}

function ProgressRow({
    label,
    value,
}: {
    label: string,
    value: number;
}) {
    return (
        <div>
            <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600">{label}</span>
                <span className="font-medium text-slate-700">
                    {Math.round(value)}%
                </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
                <div 
                    className="bg-indigo-500 h-2 rounded-full transition-all"
                    style={{ width: `${value}%` }}
                />
            </div>
        </div>
    );
}