import type { Metadata } from "next";
import "../styles/globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "InterviewAI — Ace Every Interview",
  description: "AI-powered interview practice with adaptive questions, live code execution, and deep analytics.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.fontshare.com" />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#201e15",
              color: "#d1cdc4",
              border: "1px solid rgba(212,168,67,0.2)",
              fontFamily: "var(--font-sora)",
              fontSize: "13px",
            },
            success: { iconTheme: { primary: "#d4a843", secondary: "#0a0908" } },
            error:   { iconTheme: { primary: "#ef4444", secondary: "#0a0908" } },
          }}
        />
      </body>
    </html>
  );
}