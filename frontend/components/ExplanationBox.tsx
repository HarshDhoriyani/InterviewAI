"use client";
import { use, useState } from "react";
import { api } from "@/services/api";


export default function ExplanationBox({ sessionId } : any) {
    const [text, setText] = useState("");
    const token = localStorage.getItem("token") || "";

    const submitExplanation = async () => {
        const res = await api (
            "/explanation/submit",
            "POST",
            { sessionId, explanation: text },
            token
        );

        alert(`Explanation Score: ${res.explanationScore}`);
    };

    return (
        <div className="mt-6">
            <h3 className="text-lg font-semibold">Explain your approach</h3>
            <textarea 
                className="w-full mt-2 p-3 bg-black/30 border border-gray-600 rounded-lg"
                rows={5}
                placeholder="Explain how your solution works..."
                onChange={(e) => setText(e.target.value)}
            />

            <button
                onClick={submitExplanation}
                className="mt-3 bg-indigo-500 px-4 py-2 rounded-lg"
            >
                Submit Explanation
            </button>
        </div>
    );
}