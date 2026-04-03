'use client';

import { useState } from "react";

export default function DebugPage() {
  const [result, setResult] = useState<any>(null);
  const [email, setEmail] = useState("test@test.com");
  const [password, setPassword] = useState("test123");
  const [loading, setLoading] = useState(false);

  const testLogin = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      setResult({
        status: res.status,
        ok: res.ok,
        rawData: data,
        hasToken: !!data.token,
        hasUser: !!data.user,
        tokenValue: data.token ? data.token.substring(0, 30) + "..." : "MISSING",
        userValue: data.user || "MISSING - check flat fields below",
        flatFields: {
          _id: data._id,
          id: data.id,
          name: data.name,
          email: data.email,
        },
        localStorage_before: {
          token: localStorage.getItem("token")?.substring(0, 30) + "...",
          user: localStorage.getItem("user"),
        }
      });

      // Now manually persist and show what happens
      if (data.token) {
        localStorage.setItem("token", data.token);
        const user = data.user || { _id: data._id || data.id, name: data.name, email: data.email };
        localStorage.setItem("user", JSON.stringify(user));

        setResult((prev: any) => ({
          ...prev,
          localStorage_after: {
            token: localStorage.getItem("token")?.substring(0, 30) + "...",
            user: localStorage.getItem("user"),
          }
        }));
      }
    } catch (err: any) {
      setResult({ error: err.message, type: "fetch_error" });
    } finally {
      setLoading(false);
    }
  };

  const checkStorage = () => {
    setResult({
      action: "localStorage snapshot",
      token: localStorage.getItem("token"),
      user: localStorage.getItem("user"),
      tokenExists: !!localStorage.getItem("token"),
    });
  };

  const clearStorage = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setResult({ action: "cleared localStorage" });
  };

  return (
    <div style={{ background: "#0a0908", minHeight: "100vh", padding: 32, color: "#d1cdc4", fontFamily: "monospace" }}>
      <h1 style={{ color: "#d4a843", marginBottom: 24, fontSize: 20 }}>🔍 Auth Debug Page</h1>
      <p style={{ color: "#635a51", marginBottom: 24, fontSize: 13 }}>
        This page tests the login API directly and shows exactly what the backend returns.<br/>
        Delete this file after fixing the issue.
      </p>

      <div style={{ marginBottom: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input value={email} onChange={e => setEmail(e.target.value)}
          placeholder="email" style={{ padding: "8px 12px", background: "#111009", border: "1px solid #333", borderRadius: 8, color: "#d1cdc4", fontFamily: "monospace" }} />
        <input value={password} onChange={e => setPassword(e.target.value)}
          placeholder="password" type="password" style={{ padding: "8px 12px", background: "#111009", border: "1px solid #333", borderRadius: 8, color: "#d1cdc4", fontFamily: "monospace" }} />
        <button onClick={testLogin} disabled={loading}
          style={{ padding: "8px 16px", background: "#d4a843", color: "#000", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "monospace", fontWeight: "bold" }}>
          {loading ? "Testing..." : "Test Login API"}
        </button>
        <button onClick={checkStorage}
          style={{ padding: "8px 16px", background: "#18160f", color: "#d4a843", borderRadius: 8, border: "1px solid #d4a84355", cursor: "pointer", fontFamily: "monospace" }}>
          Check localStorage
        </button>
        <button onClick={clearStorage}
          style={{ padding: "8px 16px", background: "#18160f", color: "#f87171", borderRadius: 8, border: "1px solid #f8717155", cursor: "pointer", fontFamily: "monospace" }}>
          Clear localStorage
        </button>
      </div>

      {result && (
        <pre style={{
          background: "#111009", border: "1px solid #333", borderRadius: 12,
          padding: 20, fontSize: 12, lineHeight: 1.7, overflowX: "auto",
          color: "#d1cdc4", whiteSpace: "pre-wrap", wordBreak: "break-all"
        }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}

      <div style={{ marginTop: 32, padding: 16, background: "#111009", borderRadius: 12, border: "1px solid #333" }}>
        <p style={{ color: "#d4a843", marginBottom: 8, fontSize: 13, fontWeight: "bold" }}>What to look for:</p>
        <ul style={{ color: "#635a51", fontSize: 12, lineHeight: 2 }}>
          <li>✅ <strong style={{color:"#d1cdc4"}}>hasToken: true</strong> — backend is returning a token</li>
          <li>✅ <strong style={{color:"#d1cdc4"}}>hasUser: true</strong> — backend returns nested user object</li>
          <li>⚠️ <strong style={{color:"#d1cdc4"}}>hasUser: false but flatFields has _id/name/email</strong> — flat response, needs _extractUser fix</li>
          <li>❌ <strong style={{color:"#d1cdc4"}}>hasToken: false</strong> — backend auth is broken, check your auth controller</li>
          <li>❌ <strong style={{color:"#d1cdc4"}}>status: 400/401/500</strong> — login is failing, check credentials or backend</li>
        </ul>
      </div>
    </div>
  );
}