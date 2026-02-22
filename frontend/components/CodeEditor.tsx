"use client";
import { Editor } from "@monaco-editor/react";
import { useState, useEffect } from "react";
import { api } from "@/services/api";

export default function CodeEditor({ onSubmit, sessionId }: any) {
    const [code, setCode] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            if (code.trim()) {
                api(
                    "/snapshot",
                    "POST",
                    { sessionId, code },
                );
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [code]);

    return (
        <div>
            <Editor 
                height="400px"
                defaultLanguage="javascript"
                value={code}
                onChange={(value) => setCode(value || "")}
            />
            <button onClick={() => onSubmit(code)}>Submit</button>
        </div>
    );
}