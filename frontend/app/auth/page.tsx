'use client';

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

type Mode = "login" | "register";

function AuthForm() {
  const searchParams = useSearchParams();
  const [mode,    setMode]    = useState<Mode>(
    searchParams.get("mode") === "register" ? "register" : "login"
  );
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [password,setPassword]= useState("");
  const [loading, setLoading] = useState(false);
  const [showPw,  setShowPw]  = useState(false);
  const [ready,   setReady]   = useState(false);

  // Refs so handleSubmit always reads the latest input values
  const nameRef     = useRef("");
  const emailRef    = useRef("");
  const passwordRef = useRef("");

  // Check localStorage once on mount — if token exists go straight to dashboard
  useEffect(() => {
    if (localStorage.getItem("token")) {
      window.location.replace("/dashboard");
    } else {
      setReady(true);
    }
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen bg-[#0a0908] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#d4a843] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleSubmit = async () => {
    const currentEmail    = emailRef.current.trim()    || email.trim();
    const currentPassword = passwordRef.current        || password;
    const currentName     = nameRef.current.trim()     || name.trim();

    if (!currentEmail || !currentPassword) { toast.error("Please fill in all fields"); return; }
    if (mode === "register" && !currentName) { toast.error("Name is required"); return; }
    if (currentPassword.length < 6) { toast.error("Password must be at least 6 characters"); return; }

    setLoading(true);

    try {
      const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const url  = `${BASE}/api/auth/${mode === "login" ? "login" : "register"}`;
      const body = mode === "login"
        ? { email: currentEmail, password: currentPassword }
        : { name: currentName, email: currentEmail, password: currentPassword };

      const res = await fetch(url, {
        method:  "POST",
        headers: {
          "Content-Type": "application/json",   // ← critical: tells Express to parse body as JSON
          "Accept":        "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || data.error || `Error ${res.status}`);
        setLoading(false);
        return;
      }

      if (!data.token) {
        toast.error("Server didn't return a token — check auth.controller.js");
        setLoading(false);
        return;
      }

      // Write to localStorage BEFORE navigating
      const userObj = data.user
        ? { _id: data.user._id || data.user.id, name: data.user.name, email: data.user.email }
        : { _id: "", name: name || email, email };

      localStorage.setItem("token", data.token);
      localStorage.setItem("user",  JSON.stringify(userObj));

      // Hard navigation — avoids React/Next.js client-side nav race conditions
      window.location.href = "/dashboard";

    } catch (err: any) {
      toast.error(err.message || "Network error — is the backend running on port 5000?");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0908] flex items-center justify-center px-6">
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
        backgroundSize: "80px 80px",
      }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(212,168,67,0.05), transparent 65%)" }} />

      <div className="relative z-10 w-full max-w-sm" style={{ animation: "fadeUp 0.5s ease forwards" }}>

        <div className="flex items-center gap-2.5 mb-10">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#d4a843] to-[#b8891e] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
              <path d="M2 11L5 5l3 4 2-3 2 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-display font-600 text-[16px] text-white">InterviewAI</span>
        </div>

        <h1 className="font-display text-[32px] font-600 text-white mb-2">
          {mode === "login" ? "Welcome back" : "Create account"}
        </h1>
        <p className="text-[14px] text-[#635a51] mb-8">
          {mode === "login" ? "Sign in to continue your practice" : "Start practising interviews for free"}
        </p>

        <div className="flex p-1 rounded-xl mb-6"
          style={{ background: "#111009", border: "1px solid rgba(255,255,255,0.05)" }}>
          {(["login", "register"] as Mode[]).map((m) => (
            <button key={m} onClick={() => setMode(m)}
              className={`flex-1 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                mode === m ? "bg-[rgba(212,168,67,0.15)] text-[#d4a843]" : "text-[#635a51] hover:text-[#958d80]"
              }`}>
              {m === "login" ? "Sign In" : "Register"}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {mode === "register" && (
            <Field label="Full Name">
              <input type="text" value={name} onChange={e => { setName(e.target.value); nameRef.current = e.target.value; }}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                placeholder="Alex Johnson" className="input-field" />
            </Field>
          )}
          <Field label="Email">
            <input type="email" value={email} onChange={e => { setEmail(e.target.value); emailRef.current = e.target.value; }}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              placeholder="you@example.com" className="input-field" />
          </Field>
          <Field label="Password">
            <div className="relative">
              <input type={showPw ? "text" : "password"} value={password}
                onChange={e => { setPassword(e.target.value); passwordRef.current = e.target.value; }}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                placeholder="Min. 6 characters" className="input-field pr-10" />
              <button type="button" onClick={() => setShowPw(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#635a51] hover:text-[#958d80] transition-colors">
                {showPw
                  ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.3"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3"/><path d="M2 2l12 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                  : <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.3"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3"/></svg>
                }
              </button>
            </div>
          </Field>

          <button onClick={handleSubmit} disabled={loading}
            className="w-full py-3.5 rounded-xl font-medium text-[14px] text-[#0a0908] flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-50 mt-2"
            style={{ background: "linear-gradient(135deg, #e8c97a, #d4a843)" }}>
            {loading
              ? <span className="w-4 h-4 border-2 border-[#0a0908] border-t-transparent rounded-full animate-spin" />
              : mode === "login" ? "Sign In" : "Create Account"
            }
          </button>
        </div>

        <p className="text-center text-[12px] text-[#504942] mt-6">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setMode(m => m === "login" ? "register" : "login")}
            className="text-[#d4a843] hover:text-[#e8c97a] transition-colors">
            {mode === "login" ? "Register" : "Sign in"}
          </button>
        </p>
      </div>

      <style jsx>{`
        .input-field {
          width: 100%;
          padding: 12px 16px;
          background: #111009;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          font-size: 14px;
          color: #d1cdc4;
          outline: none;
          transition: border-color 0.2s;
          font-family: var(--font-sora);
        }
        .input-field::placeholder { color: #504942; }
        .input-field:focus { border-color: rgba(212,168,67,0.4); }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-widest text-[#635a51] mb-2">{label}</label>
      {children}
    </div>
  );
}

export default function AuthPage() {
  return <Suspense><AuthForm /></Suspense>;
}