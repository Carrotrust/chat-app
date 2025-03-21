import { create } from "zustand"
interface User {
  username: string
  email: string
}

interface AuthState {
  token: string | null
  user: User | null
  setToken: (token: string | null) => void
  setUser: (user: User | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("token"), // Load token from localStorage
  user: JSON.parse(localStorage.getItem("user") || "null"), // Load user from localStorage
  setToken: (token) => {
    localStorage.setItem("token", token || "");
    set({ token });
  },
  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ token: null, user: null });
  },
}));
