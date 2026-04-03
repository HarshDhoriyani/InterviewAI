'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useSessions } from "@/hooks/useSessions";
import PerformanceChart from "@/components/PerformanceChart";
import RadarChart from "@/components/RadarChart";

interface StoredUser { _id: string; name: string; email: string; }

const diffColor = (d: string) =>
  d === "easy" ? "#34d399" : d === "hard" ? "#f87171" : "#d4a843";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7)  return `${d}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function DashboardPage() {
  const [user,    setUser]    = useState<StoredUser | null>(null);
  const [checked, setChecked] = useState(false);

  const { analytics, isLoading: analyticsLoading, error: analyticsError, refetch: refetchAnalytics } = useAnalytics();
  const { sessions, isLoading: sessionsLoading, streak, refetch: refetchSessions } = useSessions();

  // Read auth directly from localStorage — no AuthContext timing issues
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { window.location.replace("/auth"); return; }
    try {
      const raw = localStorage.getItem("user");
      setUser(raw ? JSON.parse(raw) : { _id: "", name: "User", email: "" });
    } catch {
      setUser({ _id: "", name: "User", email: "" });
    }
    setChecked(true);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.replace("/auth");
  };

  if (!checked) return <Spinner />;

  const completedSessions = sessions.filter(s => s.status === "completed");

  return (
    <div className="min-h-screen bg-[#0a0908] text-[#d1cdc4] flex">

      {/* ── SIDEBAR ── */}
      <aside className="w-16 md:w-56 flex-shrink-0 border-r border-[rgba(255,255,255,0.04)] flex flex-col">
        <div className="h-16 flex items-center px-4 border-b border-[rgba(255,255,255,0.04)]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#d4a843] to-[#b8891e] flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 11L5 5l3 4 2-3 2 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-display font-600 text-[14px] text-white hidden md:block">InterviewAI</span>
          </div>
        </div>
        <nav className="flex-1 py-4 px-2">
          <NavItem icon={<GridIcon />} label="Dashboard" href="/dashboard" active />
          <NavItem icon={<PlayIcon />} label="Interview"  href="/interview" />
        </nav>
        <div className="p-3 border-t border-[rgba(255,255,255,0.04)]">
          <div className="flex items-center gap-2.5 px-2 py-2">
            <div className="w-7 h-7 rounded-full bg-[#201e15] border border-[rgba(255,255,255,0.06)] flex items-center justify-center flex-shrink-0">
              <span className="text-[12px] font-medium text-[#d4a843]">{user?.name?.[0]?.toUpperCase() ?? "U"}</span>
            </div>
            <div className="hidden md:block flex-1 min-w-0">
              <div className="text-[12px] font-medium text-[#d1cdc4] truncate">{user?.name}</div>
              <div className="text-[10px] text-[#504942] truncate">{user?.email}</div>
            </div>
          </div>
          <button onClick={logout}
            className="hidden md:flex w-full items-center gap-2 px-3 py-2 rounded-lg text-[12px] text-[#635a51] hover:text-red-400 hover:bg-red-400/10 transition-all mt-1">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M5 2H2.5A1.5 1.5 0 001 3.5v6A1.5 1.5 0 002.5 11H5M9 9l3-3-3-3M12 6.5H5"
                stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Sign out
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="flex-1 overflow-auto">

        {/* Header */}
        <div className="h-16 border-b border-[rgba(255,255,255,0.04)] flex items-center justify-between px-6">
          <div>
            <h1 className="font-display text-[20px] font-600 text-white">Dashboard</h1>
            <p className="text-[12px] text-[#635a51]">Welcome back, {user?.name?.split(" ")[0]}</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Real streak from sessions */}
            {streak > 0 && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{ background: "rgba(212,168,67,0.08)", border: "1px solid rgba(212,168,67,0.18)" }}>
                <span className="text-[14px]">🔥</span>
                <span className="text-[12px] font-medium text-[#d4a843]">{streak} day streak</span>
              </div>
            )}
            <Link href="/interview"
              className="flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium text-[#0a0908] hover:brightness-110 transition-all"
              style={{ background: "linear-gradient(135deg, #e8c97a, #d4a843)" }}>
              <PlayIcon size={13} />
              <span className="hidden sm:block">New Interview</span>
            </Link>
          </div>
        </div>

        <div className="p-6 max-w-6xl">

          {/* Analytics error */}
          {analyticsError && (
            <div className="mb-5 p-4 rounded-xl flex items-center justify-between"
              style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)" }}>
              <span className="text-[13px] text-red-400">{analyticsError}</span>
              <button onClick={refetchAnalytics}
                className="text-[12px] text-red-400 border border-red-400/25 px-3 py-1 rounded-lg hover:bg-red-400/10 transition-all">
                Retry
              </button>
            </div>
          )}

          {/* ── KPI Cards — real data from analytics API ── */}
          {analyticsLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-28 rounded-2xl shimmer" style={{ border: "1px solid rgba(255,255,255,0.04)" }} />
              ))}
            </div>
          ) : analytics ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Avg Score",     value: analytics.averageScore != null ? Math.round(analytics.averageScore).toString() : "—",  unit: "/100"    },
                { label: "Interviews",    value: analytics.totalInterviews != null ? analytics.totalInterviews.toString() : "—",         unit: "total"   },
                { label: "Confidence",    value: analytics.confidenceScore != null ? Math.round(analytics.confidenceScore).toString() : "—", unit: "/100" },
                { label: "Topics",        value: analytics.topicStats?.length ? analytics.topicStats.length.toString() : "0",            unit: "covered" },
              ].map((kpi) => (
                <div key={kpi.label} className="p-5 rounded-2xl"
                  style={{ background: "#111009", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="flex items-end gap-1 mb-1">
                    <span className="font-display text-[30px] font-600 text-white leading-none">{kpi.value}</span>
                    <span className="text-[12px] text-[#635a51] mb-0.5">{kpi.unit}</span>
                  </div>
                  <div className="text-[11px] text-[#635a51] uppercase tracking-wide">{kpi.label}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mb-6 p-8 rounded-2xl text-center"
              style={{ background: "#111009", border: "1px solid rgba(255,255,255,0.05)" }}>
              <p className="text-[14px] text-[#635a51] mb-4">No interview data yet. Complete your first session to see stats here.</p>
              <Link href="/interview"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-medium text-[#0a0908] hover:brightness-110 transition-all"
                style={{ background: "linear-gradient(135deg, #e8c97a, #d4a843)" }}>
                Start first interview →
              </Link>
            </div>
          )}

          {/* ── Charts — real data ── */}
          {analytics && (
            <div className="grid lg:grid-cols-3 gap-4 mb-6">
              <div className="lg:col-span-2 p-5 rounded-2xl"
                style={{ background: "#111009", border: "1px solid rgba(255,255,255,0.05)" }}>
                <h3 className="font-display text-[15px] font-600 text-white mb-4">Score by Difficulty</h3>
                <PerformanceChart data={analytics.difficultyStats} />
              </div>
              <div className="p-5 rounded-2xl"
                style={{ background: "#111009", border: "1px solid rgba(255,255,255,0.05)" }}>
                <h3 className="font-display text-[15px] font-600 text-white mb-4">Topic Breakdown</h3>
                <RadarChart data={analytics.topicStats} />
              </div>
            </div>
          )}

          {/* ── Difficulty pills — real data ── */}
          {analytics?.difficultyStats && analytics.difficultyStats.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mb-6">
              {analytics.difficultyStats.map((d) => (
                <div key={d.difficulty} className="p-4 rounded-2xl flex items-center gap-3"
                  style={{ background: "#111009", border: `1px solid ${diffColor(d.difficulty)}22` }}>
                  <div className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: diffColor(d.difficulty), boxShadow: `0 0 6px ${diffColor(d.difficulty)}88` }} />
                  <div>
                    <div className="text-[11px] capitalize" style={{ color: diffColor(d.difficulty) }}>{d.difficulty}</div>
                    <div className="font-display text-[20px] font-600 text-white leading-tight">{Math.round(d.averageScore)}</div>
                    <div className="text-[10px] text-[#504942]">{d.attempts} attempts</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Recent Sessions — real data ── */}
          {sessionsLoading ? (
            <div className="rounded-2xl overflow-hidden mb-6"
              style={{ background: "#111009", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="px-5 py-4 border-b border-[rgba(255,255,255,0.04)]">
                <div className="h-4 w-40 rounded shimmer" />
              </div>
              {[1,2,3].map(i => (
                <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-[rgba(255,255,255,0.04)]">
                  <div className="flex-1 h-3 rounded shimmer" />
                  <div className="w-12 h-3 rounded shimmer" />
                </div>
              ))}
            </div>
          ) : completedSessions.length > 0 ? (
            <div className="rounded-2xl overflow-hidden mb-6"
              style={{ background: "#111009", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="px-5 py-4 border-b border-[rgba(255,255,255,0.04)] flex items-center justify-between">
                <h3 className="font-display text-[15px] font-600 text-white">Recent Sessions</h3>
                <span className="text-[11px] text-[#504942]">{completedSessions.length} total</span>
              </div>
              <div className="divide-y divide-[rgba(255,255,255,0.04)]">
                {completedSessions.slice(0, 8).map((s) => (
                  <div key={s._id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#18160f] transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium text-[#d1cdc4] truncate mb-1">
                        {s.question?.title || s.topic || "Interview Session"}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-medium capitalize px-1.5 py-0.5 rounded"
                          style={{
                            background: `${diffColor(s.difficulty)}18`,
                            border: `1px solid ${diffColor(s.difficulty)}33`,
                            color: diffColor(s.difficulty),
                          }}>
                          {s.difficulty || s.question?.difficulty || "—"}
                        </span>
                        <span className="text-[11px] text-[#504942]">{s.topic || s.question?.topic}</span>
                        <span className="text-[11px] text-[#504942]">· {timeAgo(s.startedAt)}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-display text-[18px] font-600"
                        style={{ color: s.score >= 80 ? "#34d399" : s.score >= 60 ? "#d4a843" : "#f87171" }}>
                        {s.score}
                      </div>
                      <div className="text-[10px] text-[#504942]">/100</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : !sessionsLoading && (
            <div className="mb-6 p-6 rounded-2xl text-center"
              style={{ background: "#111009", border: "1px solid rgba(255,255,255,0.05)" }}>
              <p className="text-[13px] text-[#635a51]">No completed sessions yet.</p>
            </div>
          )}

          {/* ── Topic table — real data ── */}
          {analytics?.topicStats && analytics.topicStats.length > 0 && (
            <div className="rounded-2xl overflow-hidden mb-6"
              style={{ background: "#111009", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="px-5 py-4 border-b border-[rgba(255,255,255,0.04)]">
                <h3 className="font-display text-[15px] font-600 text-white">Performance by Topic</h3>
              </div>
              <div className="divide-y divide-[rgba(255,255,255,0.04)]">
                {analytics.topicStats.map((t) => (
                  <div key={t.topic} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#18160f] transition-colors group">
                    <div className="flex-1">
                      <div className="text-[13px] font-medium text-[#d1cdc4] capitalize mb-1.5">{t.topic}</div>
                      <div className="h-1.5 bg-[#201e15] rounded-full overflow-hidden">
                        <div className="h-full rounded-full"
                          style={{ width: `${Math.min(t.averageScore, 100)}%`, background: "linear-gradient(90deg, #d4a843, #e8c97a)", transition: "width 0.7s ease" }} />
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 flex items-center gap-3">
                      <div>
                        <div className="font-display text-[18px] font-600 text-[#d4a843]">{Math.round(t.averageScore)}</div>
                        <div className="text-[10px] text-[#504942]">{t.attempts} attempts</div>
                      </div>
                      <Link href={`/interview?topic=${t.topic.toLowerCase().replace(/\s+/g, "-")}`}
                        className="opacity-0 group-hover:opacity-100 transition-opacity px-2.5 py-1 rounded-lg text-[11px] text-[#d4a843] border border-[rgba(212,168,67,0.25)] hover:bg-[rgba(212,168,67,0.08)]">
                        Practice
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Quick Start ── */}
          <div className="p-5 rounded-2xl mb-6"
            style={{ background: "#111009", border: "1px solid rgba(255,255,255,0.05)" }}>
            <h3 className="font-display text-[15px] font-600 text-white mb-4">Quick Start</h3>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { topic: "arrays",        label: "Arrays & Hashing",    difficulty: "easy",   color: "#34d399", img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&q=80" },
                { topic: "dynamic-prog",  label: "Dynamic Programming", difficulty: "medium", color: "#d4a843", img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=200&q=80" },
                { topic: "system-design", label: "System Design",       difficulty: "hard",   color: "#f87171", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=200&q=80" },
              ].map((q) => (
                <Link key={q.topic} href={`/interview?topic=${q.topic}&difficulty=${q.difficulty}`}
                  className="flex items-center gap-3 p-3 rounded-xl border border-transparent hover:border-[rgba(212,168,67,0.15)] hover:bg-[#18160f] transition-all group">
                  <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={q.img} alt={q.label} width={40} height={40}
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                  </div>
                  <div>
                    <div className="text-[13px] font-medium text-[#d1cdc4]">{q.label}</div>
                    <div className="text-[11px] font-medium capitalize" style={{ color: q.color }}>{q.difficulty}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* ── Tips ── */}
          <div className="p-5 rounded-2xl"
            style={{ background: "#111009", border: "1px solid rgba(255,255,255,0.05)" }}>
            <h3 className="font-display text-[15px] font-600 text-white mb-4">Interview tips</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { icon: "💬", title: "Think out loud", body: "Interviewers value your thought process as much as the final answer. Use the explanation panel every session." },
                { icon: "⏱",  title: "Time yourself",  body: "Most coding rounds are 45 min. Practising under the timer builds the right instincts." },
                { icon: "🔁", title: "Revisit weak topics", body: "Check your Radar chart. Any topic below 65 is high-leverage — a few focused sessions moves it fast." },
                { icon: "📈", title: "Aim for 80+", body: "Scores above 80 on the AI evaluator correlate well with passing real technical screens." },
              ].map((tip) => (
                <div key={tip.title} className="flex gap-3 p-4 rounded-xl"
                  style={{ background: "#18160f", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <span className="text-[20px] flex-shrink-0 leading-none mt-0.5">{tip.icon}</span>
                  <div>
                    <div className="text-[13px] font-medium text-[#d1cdc4] mb-1">{tip.title}</div>
                    <div className="text-[12px] text-[#635a51] leading-relaxed">{tip.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

function Spinner() {
  return (
    <div className="min-h-screen bg-[#0a0908] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-[#d4a843] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function NavItem({ icon, label, href, active = false }: {
  icon: React.ReactNode; label: string; href: string; active?: boolean;
}) {
  return (
    <Link href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all duration-200 ${
        active ? "bg-[rgba(212,168,67,0.1)] text-[#d4a843]" : "text-[#635a51] hover:text-[#958d80] hover:bg-[#111009]"
      }`}>
      <span className="flex-shrink-0">{icon}</span>
      <span className="text-[13px] font-medium hidden md:block">{label}</span>
    </Link>
  );
}

function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}

function PlayIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M6.5 5.5l4 2.5-4 2.5V5.5z" fill="currentColor"/>
    </svg>
  );
}