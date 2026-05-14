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
        userCredObj
      );

      console.log(res.data);

      // adjust token path if needed after checking console
      const token =
        res.data.token ||
        res.data.payload?.token ||
        res.data.data?.token;

      if (token) {
        localStorage.setItem("token", token);
      }

      set({
        loading: false,
        isAuthenticated: true,
        currentUser: res.data.payload || res.data.user,
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
        `${import.meta.env.VITE_API_URL}/common-api/logout`
      );

    } catch (err) {
      // ignore
    } finally {
      localStorage.removeItem("token");

      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
      });
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true });

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        set({
          currentUser: null,
          isAuthenticated: false,
          isCheckingAuth: false,
        });
        return;
      }

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/common-api/check-auth`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      set({
        currentUser: res.data.payload,
        isAuthenticated: true,
        isCheckingAuth: false,
      });

    } catch {
      localStorage.removeItem("token");

      set({
        currentUser: null,
        isAuthenticated: false,
        isCheckingAuth: false,
      });
    }
  },
}));