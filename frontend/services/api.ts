import axios, { AxiosError } from "axios";

// ─────────────────────────────────────────────
//  Base client — backend on port 5000
//  All routes prefixed with /api  (see app.js)
// ─────────────────────────────────────────────
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: { "Content-Type": "application/json" },
  // withCredentials must be false when backend CORS uses wildcard origin "*"
  withCredentials: false,
});

// Attach JWT on every request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global 401 handler
api.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (typeof window !== "undefined") window.location.href = "/auth";
    }
    return Promise.reject(err);
  }
);

// ─────────────────────────────────────────────
//  AUTH  →  /api/auth
//  POST /api/auth/register  { name, email, password }
//  POST /api/auth/login     { email, password }
// ─────────────────────────────────────────────
export const authAPI = {
  register: (name: string, email: string, password: string) =>
    api.post<AuthResponse>("/auth/register", { name, email, password }),

  login: (email: string, password: string) =>
    api.post<AuthResponse>("/auth/login", { email, password }),
};

// ─────────────────────────────────────────────
//  INTERVIEW  →  /api/interview
//  POST /api/interview/start  { topic?, difficulty? }
// ─────────────────────────────────────────────
export const interviewAPI = {
  start: (payload: StartInterviewPayload) =>
    api.post<StartInterviewResponse>("/interview/start", payload),
};

// ─────────────────────────────────────────────
//  EVALUATION  →  /api/evaluation
//  POST /api/evaluation/submit  { sessionId, code, language }
// ─────────────────────────────────────────────
export const evaluationAPI = {
  submitCode: (payload: SubmitCodePayload) =>
    api.post<EvaluationResponse>("/evaluation/submit", payload),
};

// ─────────────────────────────────────────────
//  EXPLANATION  →  /api/explanation
//  POST /api/explanation/submit  { sessionId, explanation }
// ─────────────────────────────────────────────
export const explanationAPI = {
  submit: (payload: SubmitExplanationPayload) =>
    api.post<ExplanationResponse>("/explanation/submit", payload),
};

// ─────────────────────────────────────────────
//  SNAPSHOT  →  /api/snapshot
//  POST /api/snapshot  { sessionId, code, timestamp }
// ─────────────────────────────────────────────
export const snapshotAPI = {
  save: (payload: SaveSnapshotPayload) =>
    api.post<{ message: string }>("/snapshot", payload),
};

// ─────────────────────────────────────────────
//  ANALYTICS  →  /api/analytics
//  GET /api/analytics
// ─────────────────────────────────────────────
export const analyticsAPI = {
  get: () => api.get<AnalyticsResponse>("/analytics"),
};

// ─────────────────────────────────────────────
//  TYPES — mirrored from Mongoose models
// ─────────────────────────────────────────────
export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Question {
  _id: string;
  title: string;
  description: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  starterCode: string;
  testCases: { input: string; expectedOutput: string }[];
}

export interface Session {
  _id: string;
  user: string;
  question: Question;
  status: "active" | "completed";
  score: number;
  startedAt: string;
  completedAt?: string;
  difficulty: string;
  topic: string;
}

export interface StartInterviewPayload {
  topic?: string;
  difficulty?: "easy" | "medium" | "hard";
}

export interface StartInterviewResponse {
  session: Session;
  question: Question;
}

export interface SubmitCodePayload {
  sessionId: string;
  code: string;
  language: string;
}

export interface EvaluationResponse {
  correctnessScore: number;
  efficiencyScore: number;
  totalScore: number;
  feedback: string;
  estimatedComplexity: string;
  qualityScore: number;
  edgeCaseScore: number;
}

export interface SubmitExplanationPayload {
  sessionId: string;
  explanation: string;
}

export interface ExplanationResponse {
  explanationScore: number;
  feedback: string;
}

export interface SaveSnapshotPayload {
  sessionId: string;
  code: string;
  timestamp: string;
}

export interface TopicStat {
  topic: string;
  averageScore: number;
  attempts: number;
}

export interface DifficultyStat {
  difficulty: string;
  averageScore: number;
  attempts: number;
}

export interface AnalyticsResponse {
  _id: string;
  user: string;
  totalInterviews: number;
  averageScore: number;
  topicStats: TopicStat[];
  difficultyStats: DifficultyStat[];
  confidenceScore: number;
  updatedAt: string;
}