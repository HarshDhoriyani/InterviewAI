import { authAPI, type User } from "./api";

const TOKEN_KEY = "token";
const USER_KEY = "user";

export const authService = {
  async login(email: string, password: string): Promise<{ user: User; token: string}> {
    const { data } = await authAPI.login(email, password);

    const token = data.token;
    const user = data.user;

    this._persist(token, user);

    return { user, token };
  },

  async register(name: string, email: string, password: string): Promise<{ user: User; token: string}> {
    const { data } = await authAPI.register(name, email, password);

    const token = data.token;
    const user = data.user;

    this._persist(token, user);

    return { user, token };
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.location.replace("/auth");
  },

  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  _extractUser(data: any): User {
    const u = data.user || data;
    return {
      _id: u._id || u.id || "",
      name: u.name || "",
      email: u.email || "",
      createdAt: u.createdAt || new Date().toISOString(),
    } as User;
  },

  _persist(token: string, user: User) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
};

export default authService;