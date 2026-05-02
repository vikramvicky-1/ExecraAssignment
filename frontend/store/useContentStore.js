import { create } from "zustand"
import axios from "axios"
import { io } from "socket.io-client"

const API_URL = "http://localhost:5000/api/content"
const SOCKET_URL = "http://localhost:5000"
axios.defaults.withCredentials = true

// Initialize Socket.io
const socket = io(SOCKET_URL, {
  withCredentials: true
})

const useContentStore = create((set, get) => {
  // Setup socket listeners
  socket.on("contentUpdated", (newContent) => {
    set({ content: newContent })
  })

  socket.on("new_contact", (contact) => {
    const { contacts, unreadCount, playSoundTrigger } = get()
    set({ 
      contacts: [contact, ...contacts],
      unreadCount: unreadCount + 1,
      playSoundTrigger: (playSoundTrigger || 0) + 1
    })
  })

  return {
    content: null,
    contacts: [],
    unreadCount: 0,
    playSoundTrigger: 0,
    isLoading: false,
    isUpdating: false,
    error: null,

    fetchContent: async () => {
      set({ isLoading: true })
      try {
        const response = await axios.get(API_URL)
        set({ content: response.data, isLoading: false })
      } catch (error) {
        set({ error: error.message, isLoading: false })
      }
    },

    updateContent: async (data) => {
      set({ isUpdating: true })
      try {
        const response = await axios.put(API_URL, data)
        set({ content: response.data, isUpdating: false })
        return { success: true }
      } catch (error) {
        const message = error.response?.data?.message || "Update failed"
        set({ error: message, isUpdating: false })
        return { success: false, message }
      }
    },

    // Contact Management
    fetchContacts: async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/contacts")
        const contacts = response.data
        const unreadCount = contacts.filter(c => !c.isRead).length
        set({ contacts, unreadCount })
      } catch (error) {
        console.error("Failed to fetch contacts", error)
      }
    },

    markAsRead: async (id) => {
      try {
        await axios.patch(`http://localhost:5000/api/contacts/${id}/read`)
        const { contacts, unreadCount } = get()
        const updatedContacts = contacts.map(c => 
          c._id === id ? { ...c, isRead: true } : c
        )
        set({ 
          contacts: updatedContacts, 
          unreadCount: Math.max(0, unreadCount - 1) 
        })
      } catch (error) {
        console.error("Failed to mark as read", error)
      }
    },

    deleteContact: async (id) => {
      try {
        await axios.delete(`http://localhost:5000/api/contacts/${id}`)
        const { contacts, unreadCount } = get()
        const contactToDelete = contacts.find(c => c._id === id)
        const updatedContacts = contacts.filter(c => c._id !== id)
        set({ 
          contacts: updatedContacts,
          unreadCount: (!contactToDelete?.isRead) ? Math.max(0, unreadCount - 1) : unreadCount
        })
      } catch (error) {
        console.error("Failed to delete contact", error)
      }
    }
  }
})

export default useContentStore
