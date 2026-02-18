"use client";

import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#0b1120] to-[#020617] text-white">

            {/* Navbar */}
            <nav className="flex justify-between items-center px-10 py-6">
                <h1 className="text-2xl font-semibold tracking-wide">
                    Interview<span className="text-indigo-400">AI</span>
                </h1>

                <div className="space-x-6">
                    <button
                        onClick={() => router.push("/login")}
                        className="text-gray-300 hover:text-white transition"
                    >
                        Login
                    </button>

                    <button
                        onClick={() => router.push("/register")}
                        className="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-lg transition"
                    >
                        Get Started
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="flex flex-col items-center text-centermt-24 px-6">
                <h2 className="text-5xl font-bold leading-tight max-w-4xl">
                    AI-Powered Mock Interviews
                    <span className="block text-indigo-400 mt-2">
                        That Adapt Like Real FAANG Interviews
                    </span>
                </h2>

                <p className="mt-6 text-gray-400 max-w-2xl text-lg">
                    Practice coding interviews with real-time evaluation, adaptive difficutly, live coding experience, Docker-secured execution, and intelligent feedback.
                </p>

                <div className="mt-10 space-x-4">
                    <button
                        onClick={() => router.push("/interview")}
                        className="bg-indigo-500 hover:bg-indigo-600 px-8 py-3 rounded-xl text-lg font-medium transition"    
                    >
                        Start Interview
                    </button>

                    <button
                        onClick={() => router.push("/dashboard")}
                        className="border border-gray-600 hover:border-indigo-400 px-8 py-3 rounded-xl text-lg transition"
                    >
                        View Dashboard
                    </button>
                </div>
            </section>

            {/* Features Section */}
            <section className="mt-32 px-10 grid md:grid-cols-3 gap-10">
                <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 hover:border-indigo-400 transition">
                    <h3 className="text-xl font-semibold text-indigo-400">
                        Adaptive Difficulty
                    </h3>
                    <p className="mt-4 text-gray-400">
                        Questions dynamically adjust based on your performance and topic weaknesses.  
                    </p>
                </div>

                <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 hover:border-indigo-400 transition">
                    <h3 className="text-xl font-semibold text-indigo-400">
                        Secure Docker Execution
                    </h3>
                    <p className="mt-4 text-gray-400">
                        Code runs inside isolated containers with memory and CPU limits.
                    </p>
                </div>

                <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 hover:border-indigo-400 transition">
                    <h3 className="text-xl font-semibold text-indigo-400">
                        Real-time Evaluation
                    </h3>
                    <p className="mt-4 text-gray-400">
                        Correctness, complexity, code quality, edge cases, and live coding behavir analyzed.
                    </p>
                </div>

            </section>

            {/* Footer */}
            <footer className="mt-32 text-center text-gray-500 py-10 border-t border-white/10">
                © {new Date().getFullYear()} InterviewAI. Built for serious interview preparation.
            </footer>
        </div>
    );
}