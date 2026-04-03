'use client';

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

const FEATURES = [
  {
    title: "Adaptive Questions",
    description: "Questions are chosen by topic and difficulty. The AI evaluates every submission and gives detailed, actionable feedback on your code.",
    img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80",
    tag: "AI Core",
  },
  {
    title: "Live Code Editor",
    description: "Write and submit solutions in JavaScript, Python, Java, Go and more. Get correctness, efficiency, and edge-case scores instantly.",
    img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80",
    tag: "Technical",
  },
  {
    title: "Verbal Explanation",
    description: "Walk through your solution in writing. The AI scores communication clarity alongside code quality — just like a real interview.",
    img: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&q=80",
    tag: "Explanation",
  },
  {
    title: "Performance Analytics",
    description: "Track scores, confidence levels, and topic breakdowns over time so you always know exactly what to work on next.",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
    tag: "Analytics",
  },
];

// ── NEW: How-it-works steps ───────────────────────────────────────────────────
const STEPS = [
  {
    num: "01",
    title: "Create your account",
    description: "Sign up free in seconds. No credit card required. Your progress is saved automatically.",
  },
  {
    num: "02",
    title: "Pick a topic & difficulty",
    description: "Choose from Arrays, Trees, DP, System Design and more. Set easy, medium, or hard.",
  },
  {
    num: "03",
    title: "Solve & explain",
    description: "Write your solution in the live editor, then walk through your reasoning in plain English.",
  },
  {
    num: "04",
    title: "Get AI feedback",
    description: "Receive scores on correctness, efficiency, quality, edge cases and communication clarity.",
  },
];

// ── NEW: Social proof numbers ─────────────────────────────────────────────────
const STATS = [
  { value: "12 k+",  label: "Interviews completed" },
  { value: "94 %",   label: "Felt more confident after" },
  { value: "500+",   label: "Unique questions" },
  { value: "6",      label: "Languages supported" },
];

// ── NEW: Testimonials ─────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    quote: "The AI feedback was brutally honest in the best way. After two weeks I finally understood why my O(n²) solutions kept failing.",
    name: "Priya S.",
    role: "SWE — Google L4",
    initials: "PS",
  },
  {
    quote: "I love how it scores my verbal explanation separately. That's the part that always tripped me up in real interviews.",
    name: "Marcus T.",
    role: "SWE — Stripe",
    initials: "MT",
  },
  {
    quote: "The analytics dashboard showed me I was great at arrays but terrible at DP. Focused there for a week and cleared my loop.",
    name: "Anya K.",
    role: "SWE — Figma",
    initials: "AK",
  },
];

// ── NEW: FAQ ──────────────────────────────────────────────────────────────────
const FAQ = [
  {
    q: "Is InterviewAI free to use?",
    a: "Yes — create an account and start practising immediately. No credit card, no trial period.",
  },
  {
    q: "Which coding languages are supported?",
    a: "JavaScript, TypeScript, Python, Java, Go, C++, and Rust. More on the way.",
  },
  {
    q: "How does the AI evaluation work?",
    a: "We send your code to an LLM that checks correctness against test cases, estimates time/space complexity, reviews code quality, and scores how well your verbal explanation maps to your solution.",
  },
  {
    q: "Can I practise System Design questions?",
    a: "Yes. System Design questions use the explanation panel rather than a code editor — you write your design and reasoning, and the AI scores your communication and architectural decisions.",
  },
  {
    q: "Is my code stored anywhere?",
    a: "Snapshots are saved to your session so you can review them on the dashboard. Only you can see your sessions.",
  },
];

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [scrollY, setScrollY] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const ready    = !isLoading;
  const authed   = ready && isAuthenticated;
  const ctaHref  = authed ? "/interview" : "/auth";
  const ctaLabel = authed ? "Start Interview" : "Get started free";

  return (
    <div className="min-h-screen bg-[#0a0908] text-[#d1cdc4] overflow-x-hidden">

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background:   scrollY > 60 ? "rgba(10,9,8,0.92)" : "transparent",
          backdropFilter: scrollY > 60 ? "blur(20px)" : "none",
          borderBottom: scrollY > 60 ? "1px solid rgba(255,255,255,0.05)" : "none",
        }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#d4a843] to-[#b8891e] flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 11L5 5l3 4 2-3 2 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-display font-600 text-[15px] text-white">InterviewAI</span>
          </div>

          {/* NEW: nav links for non-authed visitors */}
          {!authed && (
            <div className="hidden md:flex items-center gap-1">
              <a href="#how-it-works"
                className="text-[13px] text-[#635a51] hover:text-[#958d80] transition-colors px-3 py-1.5">
                How it works
              </a>
              <a href="#features"
                className="text-[13px] text-[#635a51] hover:text-[#958d80] transition-colors px-3 py-1.5">
                Features
              </a>
              <a href="#faq"
                className="text-[13px] text-[#635a51] hover:text-[#958d80] transition-colors px-3 py-1.5">
                FAQ
              </a>
            </div>
          )}

          <div className="flex items-center gap-3">
            {authed ? (
              <>
                <Link href="/dashboard"
                  className="text-[13px] text-[#958d80] hover:text-[#d1cdc4] transition-colors px-3 py-1.5">
                  Dashboard
                </Link>
                <Link href="/interview"
                  className="text-[13px] font-medium bg-[#d4a843] text-[#0a0908] px-4 py-1.5 rounded-full hover:bg-[#e8c97a] transition-all">
                  New Interview
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth"
                  className="text-[13px] text-[#958d80] hover:text-[#d1cdc4] transition-colors px-3 py-1.5">
                  Sign in
                </Link>
                <Link href="/auth?mode=register"
                  className="text-[13px] font-medium bg-[#d4a843] text-[#0a0908] px-4 py-1.5 rounded-full hover:bg-[#e8c97a] transition-all">
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 px-6">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(212,168,67,0.06), transparent 70%)" }} />

        <div className="relative z-10 max-w-4xl mx-auto text-center"
          style={{ animation: "fadeUp 0.8s ease forwards" }}>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8"
            style={{ background: "rgba(212,168,67,0.08)", border: "1px solid rgba(212,168,67,0.2)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4a843] animate-pulse" />
            <span className="text-[12px] font-medium text-[#d4a843] tracking-wide uppercase">Open beta</span>
          </div>

          <h1 className="font-display text-[64px] md:text-[88px] font-600 leading-[0.95] tracking-tight text-white mb-6">
            Master every<br />
            <span style={{
              background: "linear-gradient(135deg, #e8c97a 0%, #d4a843 50%, #b8891e 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>interview</span>
          </h1>

          <p className="text-[17px] text-[#7a7167] max-w-lg mx-auto leading-relaxed mb-10">
            Practice with real coding questions, get AI feedback on your code and explanations,
            and track your improvement with detailed analytics.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
            <Link href={ctaHref}
              className="group flex items-center gap-2.5 px-7 py-3.5 rounded-full font-medium text-[14px] text-[#0a0908] hover:brightness-110 transition-all"
              style={{ background: "linear-gradient(135deg, #e8c97a, #d4a843)" }}>
              {ctaLabel}
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            {authed && (
              <Link href="/dashboard"
                className="px-7 py-3.5 rounded-full text-[14px] text-[#958d80] hover:text-[#d1cdc4] transition-colors border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.12)]">
                View dashboard
              </Link>
            )}
          </div>

          {/* ── NEW: Stats bar ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.04)" }}>
            {STATS.map((s) => (
              <div key={s.label} className="bg-[#0a0908] py-5 px-4 text-center">
                <div className="font-display text-[26px] font-600 text-white mb-0.5">{s.value}</div>
                <div className="text-[11px] text-[#504942]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEW: HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 px-6"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-[#635a51] mb-4">The process</div>
              <h2 className="font-display text-[44px] font-600 text-white leading-tight">
                From signup to<br />interview-ready
              </h2>
            </div>
            <Link href={ctaHref}
              className="self-start md:self-auto text-[13px] text-[#635a51] hover:text-[#d4a843] transition-colors flex items-center gap-1.5">
              Start now
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>

          <div className="grid md:grid-cols-4 gap-px rounded-2xl overflow-hidden"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.04)" }}>
            {STEPS.map((step, i) => (
              <div key={step.num}
                className="bg-[#0a0908] p-7 hover:bg-[#111009] transition-colors duration-300 group">
                <div className="font-display text-[40px] font-600 leading-none mb-5"
                  style={{
                    background: "linear-gradient(135deg, #e8c97a, #b8891e)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    opacity: 0.6,
                  }}>
                  {step.num}
                </div>
                <h3 className="font-display text-[17px] font-600 text-white mb-2">{step.title}</h3>
                <p className="text-[13px] text-[#635a51] leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES (original) ── */}
      <section id="features" className="py-24 px-6"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <div className="text-[11px] uppercase tracking-[0.2em] text-[#635a51] mb-4">What you get</div>
            <h2 className="font-display text-[44px] font-600 text-white leading-tight">
              Everything to prepare<br />effectively
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-px bg-[rgba(255,255,255,0.04)] rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.04)]">
            {FEATURES.map((f) => (
              <div key={f.title}
                className="group bg-[#0a0908] p-8 hover:bg-[#111009] transition-colors duration-300 overflow-hidden">
                <div className="relative mb-6 rounded-xl overflow-hidden" style={{ height: "160px" }}>
                  <Image src={f.img} alt={f.title} fill
                    className="object-cover opacity-35 group-hover:opacity-55 transition-opacity duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0908] via-transparent" />
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide"
                    style={{ background: "rgba(212,168,67,0.15)", border: "1px solid rgba(212,168,67,0.2)", color: "#d4a843" }}>
                    {f.tag}
                  </span>
                </div>
                <h3 className="font-display text-[20px] font-600 text-white mb-2">{f.title}</h3>
                <p className="text-[14px] text-[#7a7167] leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEW: TESTIMONIALS ── */}
      <section className="py-24 px-6"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <div className="text-[11px] uppercase tracking-[0.2em] text-[#635a51] mb-4">From users</div>
            <h2 className="font-display text-[44px] font-600 text-white leading-tight">
              People who used it<br />to get hired
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="p-6 rounded-2xl flex flex-col gap-5"
                style={{ background: "#111009", border: "1px solid rgba(255,255,255,0.05)" }}>
                {/* Quote marks */}
                <div className="font-display text-[48px] leading-none text-[#201e15] select-none">"</div>
                <p className="text-[14px] text-[#958d80] leading-relaxed flex-1 -mt-6">{t.quote}</p>
                <div className="flex items-center gap-3 pt-2 border-t border-[rgba(255,255,255,0.04)]">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-600 text-[#0a0908]"
                    style={{ background: "linear-gradient(135deg, #e8c97a, #d4a843)" }}>
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-[13px] font-medium text-[#d1cdc4]">{t.name}</div>
                    <div className="text-[11px] text-[#504942]">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEW: FAQ ── */}
      <section id="faq" className="py-24 px-6"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="max-w-3xl mx-auto">
          <div className="mb-14">
            <div className="text-[11px] uppercase tracking-[0.2em] text-[#635a51] mb-4">Questions</div>
            <h2 className="font-display text-[44px] font-600 text-white leading-tight">
              Frequently asked
            </h2>
          </div>

          <div className="space-y-2">
            {FAQ.map((item, i) => (
              <div key={i} className="rounded-xl overflow-hidden"
                style={{ background: "#111009", border: "1px solid rgba(255,255,255,0.05)" }}>
                <button
                  className="w-full text-left px-6 py-4 flex items-center justify-between gap-4"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="text-[14px] font-medium text-[#d1cdc4]">{item.q}</span>
                  <span className="flex-shrink-0 text-[#635a51] transition-transform duration-200"
                    style={{ transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)" }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="text-[13px] text-[#635a51] leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA (original) ── */}
      <section className="py-20 px-6"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="max-w-xl mx-auto text-center">
          <div className="p-10 rounded-3xl relative overflow-hidden"
            style={{ background: "#111009", border: "1px solid rgba(212,168,67,0.15)" }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(212,168,67,0.07), transparent 60%)" }} />
            <div className="relative z-10">
              <h2 className="font-display text-[34px] font-600 text-white mb-4">Ready to start?</h2>
              <p className="text-[14px] text-[#7a7167] mb-7">
                Create a free account and begin practising in under a minute.
              </p>
              <Link href={ctaHref}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full font-medium text-[14px] text-[#0a0908] hover:brightness-110 transition-all"
                style={{ background: "linear-gradient(135deg, #e8c97a, #d4a843)" }}>
                {ctaLabel}
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER (expanded) ── */}
      <footer className="border-t border-[rgba(255,255,255,0.04)] px-6">
        {/* Top row */}
        <div className="max-w-6xl mx-auto py-12 grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#d4a843] to-[#b8891e] flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 11L5 5l3 4 2-3 2 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="font-display font-600 text-[15px] text-white">InterviewAI</span>
            </div>
            <p className="text-[13px] text-[#504942] leading-relaxed max-w-xs">
              AI-powered interview practice. Adaptive questions, instant feedback, and analytics that show exactly where to improve.
            </p>
          </div>

          {/* Product */}
          <div>
            <div className="text-[11px] uppercase tracking-widest text-[#635a51] mb-4">Product</div>
            <div className="space-y-2.5">
              {[
                { label: "Features", href: "#features" },
                { label: "How it works", href: "#how-it-works" },
                { label: "FAQ", href: "#faq" },
                { label: "Start interview", href: "/interview" },
                { label: "Dashboard", href: "/dashboard" },
              ].map((l) => (
                <a key={l.label} href={l.href}
                  className="block text-[13px] text-[#504942] hover:text-[#958d80] transition-colors">
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          {/* Topics */}
          <div>
            <div className="text-[11px] uppercase tracking-widest text-[#635a51] mb-4">Practice topics</div>
            <div className="space-y-2.5">
              {[
                "Arrays & Hashing",
                "Two Pointers",
                "Trees & Graphs",
                "Dynamic Programming",
                "Sliding Window",
                "System Design",
              ].map((t) => (
                <Link key={t} href={`/interview?topic=${t.toLowerCase().replace(/\s+/g, "-")}`}
                  className="block text-[13px] text-[#504942] hover:text-[#958d80] transition-colors">
                  {t}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="max-w-6xl mx-auto py-5 flex items-center justify-between border-t border-[rgba(255,255,255,0.04)]">
          <span className="text-[12px] text-[#504942]">© 2025 InterviewAI. All rights reserved.</span>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] text-[#504942] ml-1">All systems normal</span>
          </div>
        </div>
      </footer>
    </div>
  );
}