import { create } from "zustand"
import api from "@/lib/axios"

// Remove hardcoded URL and global defaults as they are now in the axios instance

const useAuthStore = create((set) => ({
  admin: null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.post("/auth/login", { email, password })
      set({ admin: response.data, isLoading: false })
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || "Login failed"
      set({ error: message, isLoading: false })
      return { success: false, message }
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout")
      set({ admin: null })
    } catch (error) {
      console.error("Logout failed:", error)
    }
  },

  checkAuth: async () => {
    set({ isLoading: true })
    try {
      const response = await api.get("/auth/profile")
      set({ admin: response.data, isLoading: false })
    } catch (error) {
      set({ admin: null, isLoading: false })
    }
  }
}))

export default useAuthStore
