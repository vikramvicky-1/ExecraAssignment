import { create } from "zustand";
import api from "@/lib/axios";
import socket from "@/lib/socket";

const useProjectStore = create((set, get) => {
  // Helper to sort projects (Featured first, then by date)
  const sortProjects = (list) => {
    return [...list].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      // @ts-ignore
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  };

  // Socket listeners
  socket.on("projectCreated", (project) => {
    set((state) => ({
      projects: sortProjects([project, ...state.projects]),
    }));
  });

  socket.on("projectUpdated", (updatedProject) => {
    set((state) => {
      const updatedList = state.projects.map((p) =>
        p._id === updatedProject._id ? updatedProject : p,
      );
      return { projects: sortProjects(updatedList) };
    });
  });

  socket.on("projectDeleted", (id) => {
    set((state) => ({
      projects: state.projects.filter((p) => p._id !== id),
    }));
  });

  return {
    projects: [],
    isLoading: false,
    error: null,

    fetchProjects: async () => {
      set({ isLoading: true });
      try {
        const response = await api.get("/projects");
        set({ projects: response.data, isLoading: false });
      } catch (error) {
        set({ error: error.message, isLoading: false });
      }
    },

    addProject: async (formData) => {
      set({ isLoading: true });
      try {
        const response = await api.post("/projects", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        // State will be updated via socket, but we can do it here too for responsiveness
        return { success: true, project: response.data };
      } catch (error) {
        const message =
          error.response?.data?.message || "Failed to add project";
        set({ error: message, isLoading: false });
        return { success: false, message };
      }
    },

    updateProject: async (id, formData) => {
      set({ isLoading: true });
      try {
        const response = await api.put(`/projects/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        return { success: true, project: response.data };
      } catch (error) {
        const message =
          error.response?.data?.message || "Failed to update project";
        set({ error: message, isLoading: false });
        return { success: false, message };
      }
    },

    deleteProject: async (id) => {
      set({ isLoading: true });
      try {
        await api.delete(`/projects/${id}`);
        return { success: true };
      } catch (error) {
        const message =
          error.response?.data?.message || "Failed to delete project";
        set({ error: message, isLoading: false });
        return { success: false, message };
      }
    },
  };
});

export default useProjectStore;
