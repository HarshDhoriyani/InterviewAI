import { authAPI, type User, type AuthResponse } from "./api";

const TOKEN_KEY = "token";
const USER_KEY  = "user";

export const authService = {
  // POST /api/auth/register
  async register(name: string, email: string, password: string): Promise<User> {
    const { data } = await authAPI.register(name, email, password);
    this._persist(data);
    return data.user;
  },

  // POST /api/auth/login
  async login(email: string, password: string): Promise<User> {
    const { data } = await authAPI.login(email, password);
    this._persist(data);
    return data.user;
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.location.href = "/auth";
  },

  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser(): User | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  _persist(data: AuthResponse) {
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  },
};

export default authService;