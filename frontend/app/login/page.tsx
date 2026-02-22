"use client";
import { useState } from "react";
import { api } from "@/services/api";
import { useRouter } from "next/navigation";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const login = async () => {
        await api("/auth/login", "POST", { email, password });
        router.push("/interview");
    };

    return (
        <div className="p-8">
            <input onChange={e => setEmail(e.target.value)} placeholder="Email" />
            <input type="password" onChange={e => setPassword(e.target.value)} placeholder="Password" />
            <button onClick={login}>Login</button>
        </div>
    );
}