"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    await api("/auth/register", "POST", {
      name,
      email,
      password,
    });

    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-indigo-600">
          Create Account
        </h1>

        <input
          className="w-full border p-2 rounded mb-3"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full border p-2 rounded mb-3"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full border p-2 rounded mb-4"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={register}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded"
        >
          Register
        </button>
      </div>
    </div>
  );
}