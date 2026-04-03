const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes        = require("./routes/auth.routes");
const interviewRoutes   = require("./routes/interview.routes");
const evaluationRoutes  = require("./routes/evaluation.routes");
const analyticsRoutes   = require("./routes/analytics.routes");
const snapshotRoutes    = require("./routes/snapshot.routes");
const explanationRoutes = require("./routes/explanation.routes");
const sessionRoutes = require("./routes/sessions.routes");

const app = express();

// ── CORS ─────────────────────────────────────────────────────────────────────
// Allows requests from Next.js dev server (port 3000) and any localhost port.
// Add your production domain here when you deploy.
// const allowedOrigins = [
//   "http://localhost:3000",
//   "http://127.0.0.1:3000",
//   "http://localhost:3001",
// ];

app.use(cors({
  origin: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// Handle preflight requests for all routes
// app.options("/{*path}", cors());

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "InterviewAI Backend Running" });
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/auth",        authRoutes);
app.use("/api/interview",   interviewRoutes);
app.use("/api/evaluation",  evaluationRoutes);
app.use("/api/analytics",   analyticsRoutes);
app.use("/api/snapshot",    snapshotRoutes);
app.use("/api/explanation", explanationRoutes);
app.use("/api/sessions", sessionRoutes);

// // ── Global error handler ──────────────────────────────────────────────────────
// app.use((err, req, res, next) => {
//   console.error("[Error]", err.message);
//   res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
// });

module.exports = app;