import { io, Socket } from "socket.io-client";

// Backend WebSocket server (same server as REST — port 5000)
const WS_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ─────────────────────────────────────────────────────────────────────────────
//  Events (from backend websocket.js)
//
//  CLIENT  →  SERVER
//    "join-session"   sessionId: string
//
//  SERVER  →  CLIENT
//    "code-snapshot"  { session, code, timestamp, ... }
// ─────────────────────────────────────────────────────────────────────────────

class WebSocketService {
  private socket: Socket | null = null;
  private _sessionId: string | null = null;

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = io(WS_URL, {
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1500,
      });

      this.socket.on("connect", () => {
        console.log("[WS] Connected:", this.socket?.id);
        resolve();
      });

      this.socket.on("connect_error", (err) => {
        console.error("[WS] Connection error:", err.message);
        reject(err);
      });

      this.socket.on("disconnect", (reason) => {
        console.log("[WS] Disconnected:", reason);
      });
    });
  }

  // Emit "join-session" so the server adds this socket to the session room
  // Backend: socket.on("join-session", (sessionId) => socket.join(sessionId))
  joinSession(sessionId: string) {
    this._sessionId = sessionId;
    if (this.socket?.connected) {
      this.socket.emit("join-session", sessionId);
      console.log("[WS] Joined session room:", sessionId);
    } else {
      console.warn("[WS] Not connected — cannot join session");
    }
  }

  // Listen for "code-snapshot" emitted by the backend
  // Backend: io.to(sessionId).emit("code-snapshot", data)
  onCodeSnapshot(cb: (data: CodeSnapshotEvent) => void) {
    this.socket?.on("code-snapshot", cb);
  }

  offCodeSnapshot(cb?: (data: CodeSnapshotEvent) => void) {
    if (cb) this.socket?.off("code-snapshot", cb);
    else this.socket?.off("code-snapshot");
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
    this._sessionId = null;
  }

  get isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  get sessionId(): string | null {
    return this._sessionId;
  }
}

export interface CodeSnapshotEvent {
  session: string;
  code: string;
  timestamp: string;
}

// Singleton
export const wsService = new WebSocketService();
export default wsService;