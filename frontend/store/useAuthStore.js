import { create } from "zustand"
import axios from "axios"

const API_URL = "http://localhost:5000/api/auth"

// Configure axios to send cookies
axios.defaults.withCredentials = true

const useAuthStore = create((set) => ({
  admin: null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password })
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
      await axios.post(`${API_URL}/logout`)
      set({ admin: null })
    } catch (error) {
      console.error("Logout failed:", error)
    }
  },

  checkAuth: async () => {
    set({ isLoading: true })
    try {
      const response = await axios.get(`${API_URL}/profile`)
      set({ admin: response.data, isLoading: false })
    } catch (error) {
      set({ admin: null, isLoading: false })
    }
  }
}))

export default useAuthStore
