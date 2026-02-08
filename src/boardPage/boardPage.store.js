import { create } from "zustand"
import boardPageApi from "./boardPage.api"
import { useAuthStore } from "../auth/auth.store"

export const useBoardPageStore = create((set, get) => ({

  // =========================
  // STATE
  // =========================

  boardDetails: null,
  members: [],
  pendingMembers: [],
  lists: [],
  tasks: [],

  loading: false,
  error: null,

  // =========================
  // MAIN LOADER
  // =========================

  fetchBoardData: async (boardId) => {
    const token = useAuthStore.getState().token

    set({ loading: true, error: null })

    try {
      const [
        boardDetails,
        members,
        pendingMembers,
        lists,
        tasks
      ] = await Promise.all([
        boardPageApi.getBoardDetails(token, boardId),
        boardPageApi.getBoardMembers(token, boardId),
        boardPageApi.getPendingMembers(token, boardId),
        boardPageApi.getBoardLists(token, boardId),
        boardPageApi.getBoardTasks(token, boardId),
      ])

      set({
        boardDetails,
        members: members.members || [],
        pendingMembers: pendingMembers.pendingMembers || [],
        lists: lists.lists || [],
        tasks: tasks.tasks || [],
        loading: false
      })

    } catch (err) {
      set({
        error: err.response?.data?.msg || "Failed to load board",
        loading: false
      })
    }
  },

  // =========================
  // REFRESH MEMBERS ONLY
  // =========================

  refreshMembers: async (boardId) => {
    const token = useAuthStore.getState().token

    try {
      const res = await boardPageApi.getBoardMembers(token, boardId)
      set({ members: res.members || [] })
    } catch (err) {
      console.error("Failed to refresh members")
    }
  },

  // =========================
  // REFRESH LISTS
  // =========================

  refreshLists: async (boardId) => {
    const token = useAuthStore.getState().token

    try {
      const res = await boardPageApi.getBoardLists(token, boardId)
      set({ lists: res.lists || [] })
    } catch (err) {
      console.error("Failed to refresh lists")
    }
  },

  // =========================
  // REFRESH TASKS
  // =========================

  refreshTasks: async (boardId) => {
    const token = useAuthStore.getState().token

    try {
      const res = await boardPageApi.getBoardTasks(token, boardId)
      set({ tasks: res.tasks || [] })
    } catch (err) {
      console.error("Failed to refresh tasks")
    }
  },

  // =========================
  // RESET (important when leaving board page)
  // =========================

  resetBoardState: () => {
    set({
      boardDetails: null,
      members: [],
      pendingMembers: [],
      lists: [],
      tasks: [],
      loading: false,
      error: null
    })
  }

}))
