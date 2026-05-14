import { create } from "zustand";
import axios from "axios";

export const useAuth = create((set) => ({
  currentUser: null,
  loading: false,
  isCheckingAuth: true,
  isAuthenticated: false,
  error: null,

  login: async (userCredObj) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/common-api/login`,
        userCredObj,
        { withCredentials: true }
      );
      set({
        loading: false,
        isAuthenticated: true,
        currentUser: res.data.payload,
      });
    } catch (err) {
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error: err.response?.data?.error || "Login failed",
      });
    }
  },

  logout: async () => {
    try {
      set({ loading: true, error: null });
      await axios.get(
        `${import.meta.env.VITE_API_URL}/common-api/logout`,
        { withCredentials: true }
      );
    } catch (err) {
      // ignore API errors — always clear state
    } finally {
      set({ loading: false, isAuthenticated: false, currentUser: null });
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/common-api/check-auth`,
        { withCredentials: true }
      );
      set({
        currentUser: res.data.payload,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch {
      set({
        currentUser: null,
        isAuthenticated: false,
        isCheckingAuth: false,
      });
    }
  },
}));