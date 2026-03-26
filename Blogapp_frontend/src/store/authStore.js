import { create } from "zustand";
import axios from "axios";

export const useAuth = create((set) => ({
  currentUser: null,
  loading: false,         // only for login / logout button spinner
  isCheckingAuth: true,   // only for the initial page-load check
  isAuthenticated: false,
  error: null,

  login: async (userCredObj) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.post(
        "http://localhost:4000/common-api/login",
        userCredObj,
        { withCredentials: true }
      );
      set({
        loading: false,
        isAuthenticated: true,
        currentUser: res.data.payload, // full user object from DB
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
        "http://localhost:4000/common-api/logout",
        { withCredentials: true }
      );
    } catch (err) {
      // ignore API errors — always clear state
    } finally {
      set({ loading: false, isAuthenticated: false, currentUser: null });
    }
  },

  // Called once in RootLayout on mount
  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axios.get(
        "http://localhost:4000/common-api/check-auth",
        { withCredentials: true }
      );
      // payload is the full DB user — firstName, profileImageUrl, _id etc. all present
      set({
        currentUser: res.data.payload,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch {
      // not logged in — perfectly normal on first visit
      set({
        currentUser: null,
        isAuthenticated: false,
        isCheckingAuth: false,
      });
    }
  },
}));