import { create } from "zustand"
import { getMyTasks } from "../api/task.api"
import { useAuthStore } from "./auth.store"

export const useMyTasksStore = create((set) => ({
  boards: [],
  loading: false,
  error: null,

  fetchMyTasks: async () => {
    const token = useAuthStore.getState().token
    set({ loading: true, error: null })
    try {
      const res = await getMyTasks(token)
      set({ boards: res.boards || [], loading: false })
    } catch (err) {
      set({
        error: err.response?.data?.msg || "Failed to load your tasks",
        loading: false
      })
    }
  },

  reset: () => set({ boards: [], loading: false, error: null })
}))