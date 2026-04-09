import { create } from "zustand";
import api from "../lib/api";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,

  checkAuth: async () => {
    try {
      const res = await api.get("/auth/me");
      // Get token for socket auth
      const tokenRes = await api.get("/auth/token").catch(() => null);
      const token = tokenRes?.data?.token || null;
      set({ user: res.data, isAuthenticated: true, isLoading: false, token });
      if (token) window.__socketToken = token;
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false, token: null });
    }
  },

  login: async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const token = res.data.token;
    window.__socketToken = token;
    set({ user: res.data.user, isAuthenticated: true, token });
    return res.data;
  },

  register: async (name, email, password) => {
    const res = await api.post("/auth/register", { name, email, password });
    const token = res.data.token;
    window.__socketToken = token;
    set({ user: res.data.user, isAuthenticated: true, token });
    return res.data;
  },

  logout: async () => {
    await api.post("/auth/logout");
    window.__socketToken = null;
    set({ user: null, isAuthenticated: false, token: null });
  },
}));
