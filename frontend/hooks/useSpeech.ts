import { useState, useCallback, useRef, useEffect } from "react";
import toast from "react-hot-toast";

export function useSpeech() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript]   = useState("");
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const finalRef       = useRef("");

  useEffect(() => {
    setIsSupported(
      typeof window !== "undefined" &&
      ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
    );
  }, []);

  const startRecording = useCallback(() => {
    if (!isSupported) { toast.error("Speech not supported in this browser"); return; }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = "en-US";
    rec.continuous = true;
    rec.interimResults = true;

    rec.onstart  = () => setIsRecording(true);
    rec.onerror  = (e: any) => {
      if (e.error === "not-allowed") toast.error("Microphone access denied");
      setIsRecording(false);
    };
    rec.onend    = () => setIsRecording(false);
    rec.onresult = (e: any) => {
      let final = finalRef.current;
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript + " ";
      }
      finalRef.current = final;
      setTranscript(final);
    };

    recognitionRef.current = rec;
    rec.start();
  }, [isSupported]);

  const stopRecording = useCallback(() => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  }, []);

  const toggleRecording = useCallback(() => {
    isRecording ? stopRecording() : startRecording();
  }, [isRecording, startRecording, stopRecording]);

  const clearTranscript = useCallback(() => {
    setTranscript("");
    finalRef.current = "";
  }, []);

  useEffect(() => () => recognitionRef.current?.stop(), []);

  return { isRecording, transcript, isSupported, toggleRecording, clearTranscript };
}