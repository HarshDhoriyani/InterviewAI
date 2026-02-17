"use client";
import { Editor } from "@monaco-editor/react";
import { useState } from "react";

interface CodeEditorProps {
    onSubmit: (code: string) => Promise<void>;
}

export default function CodeEditor({ onSubmit }: CodeEditorProps) {
    const [code, setCode] = useState("");

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