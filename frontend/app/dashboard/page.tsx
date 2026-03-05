'use client';

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useAnalytics } from "@/hooks/useAnalytics";
import PerformanceChart from "@/components/PerformanceChart";
import RadarChart from "@/components/RadarChart";

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const { analytics, isLoading: analyticsLoading, error, refetch } = useAnalytics();
  const router = useRouter();

  // ── Auth guard ─────────────────────────────────────────────────────────────
  // KEY FIX: only redirect after authLoading is false.
  // Without this, isAuthenticated = false during the ~50ms it takes to read
  // localStorage, causing an immediate redirect back to /auth on every load.
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/auth");
    }
  }, [authLoading, isAuthenticated, router]);

  // Waiting for auth hydration — show spinner, not redirect
  if (authLoading) return <Spinner />;

  // Auth check done, not logged in — show nothing while redirect runs
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#0a0908] text-[#d1cdc4] flex">

      {/* SIDEBAR */}
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

        {/* Only real working routes */}
        <nav className="flex-1 py-4 px-2">
          <NavItem icon={<GridIcon />} label="Dashboard" href="/dashboard" active />
          <NavItem icon={<PlayIcon />} label="Interview"  href="/interview" />
        </nav>

        {/* User info + logout */}
        <div className="p-3 border-t border-[rgba(255,255,255,0.04)]">
          <div className="flex items-center gap-2.5 px-2 py-2">
            <div className="w-7 h-7 rounded-full bg-[#201e15] border border-[rgba(255,255,255,0.06)] flex items-center justify-center flex-shrink-0">
              <span className="text-[12px] font-medium text-[#d4a843]">
                {user?.name?.[0]?.toUpperCase() ?? "U"}
              </span>
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

      {/* MAIN */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="h-16 border-b border-[rgba(255,255,255,0.04)] flex items-center justify-between px-6">
          <div>
            <h1 className="font-display text-[20px] font-600 text-white">Dashboard</h1>
            <p className="text-[12px] text-[#635a51]">Welcome back, {user?.name?.split(" ")[0]}</p>
          </div>
          <Link href="/interview"
            className="flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium text-[#0a0908] hover:brightness-110 transition-all"
            style={{ background: "linear-gradient(135deg, #e8c97a, #d4a843)" }}>
            <PlayIcon size={13} />
            <span className="hidden sm:block">New Interview</span>
          </Link>
        </div>

        <div className="p-6 max-w-6xl">

          {/* Error banner */}
          {error && (
            <div className="mb-5 p-4 rounded-xl flex items-center justify-between"
              style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)" }}>
              <span className="text-[13px] text-red-400">{error}</span>
              <button onClick={refetch}
                className="text-[12px] text-red-400 border border-red-400/25 px-3 py-1 rounded-lg hover:bg-red-400/10 transition-all">
                Retry
              </button>
            </div>
          )}

          {/* KPI Cards */}
          {analyticsLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-28 rounded-2xl shimmer"
                  style={{ border: "1px solid rgba(255,255,255,0.04)" }} />
              ))}
            </div>
          ) : analytics && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Avg Score",     value: analytics.averageScore?.toFixed(0) ?? "—",   unit: "/100"   },
                { label: "Interviews",    value: String(analytics.totalInterviews  ?? "—"),    unit: "total"  },
                { label: "Confidence",    value: String(analytics.confidenceScore  ?? "—"),    unit: "/100"   },
                { label: "Topics",        value: String(analytics.topicStats?.length ?? "—"),  unit: "covered"},
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
          )}

          {/* Charts Row */}
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

          {/* Topic table */}
          {analytics && analytics.topicStats && analytics.topicStats.length > 0 && (
            <div className="rounded-2xl overflow-hidden mb-6"
              style={{ background: "#111009", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="px-5 py-4 border-b border-[rgba(255,255,255,0.04)]">
                <h3 className="font-display text-[15px] font-600 text-white">Performance by Topic</h3>
              </div>
              <div className="divide-y divide-[rgba(255,255,255,0.04)]">
                {analytics.topicStats.map((t) => (
                  <div key={t.topic} className="flex items-center gap-4 px-5 py-3.5">
                    <div className="flex-1">
                      <div className="text-[13px] font-medium text-[#d1cdc4] capitalize mb-1.5">{t.topic}</div>
                      <div className="h-1.5 bg-[#201e15] rounded-full overflow-hidden">
                        <div className="h-full rounded-full"
                          style={{
                            width: `${Math.min(t.averageScore, 100)}%`,
                            background: "linear-gradient(90deg, #d4a843, #e8c97a)",
                            transition: "width 0.7s ease",
                          }} />
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-display text-[18px] font-600 text-[#d4a843]">{t.averageScore?.toFixed(0)}</div>
                      <div className="text-[10px] text-[#504942]">{t.attempts} attempts</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick start */}
          <div className="p-5 rounded-2xl"
            style={{ background: "#111009", border: "1px solid rgba(255,255,255,0.05)" }}>
            <h3 className="font-display text-[15px] font-600 text-white mb-4">Quick Start</h3>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { topic: "arrays",        label: "Arrays & Hashing",    difficulty: "easy",   color: "#34d399", img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&q=80" },
                { topic: "dynamic-prog",  label: "Dynamic Programming", difficulty: "medium", color: "#d4a843", img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=200&q=80" },
                { topic: "system-design", label: "System Design",       difficulty: "hard",   color: "#f87171", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=200&q=80" },
              ].map((q) => (
                <Link key={q.topic}
                  href={`/interview?topic=${q.topic}&difficulty=${q.difficulty}`}
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

        </div>
      </main>
    </div>
  );
}

// ── Reusable ──────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <div className="min-h-screen bg-[#0a0908] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-6 h-6 border-2 border-[#d4a843] border-t-transparent rounded-full animate-spin" />
        <span className="text-[12px] text-[#635a51]">Loading...</span>
      </div>
    </div>
  );
}

function NavItem({ icon, label, href, active = false }: {
  icon: React.ReactNode; label: string; href: string; active?: boolean;
}) {
  return (
    <Link href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all duration-200 ${
        active
          ? "bg-[rgba(212,168,67,0.1)] text-[#d4a843]"
          : "text-[#635a51] hover:text-[#958d80] hover:bg-[#111009]"
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