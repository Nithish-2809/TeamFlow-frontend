import { create } from "zustand";
import boardPageApi from "./boardPage.api";
import { useAuthStore } from "../auth/auth.store";

export const useBoardPageStore = create((set, get) => ({
  // =========================
  // STATE
  // =========================

  boardDetails: null,
  members: [],
  pendingMembers: [],
  lists: [],
  tasksByList: {},

  loading: false,
  error: null,

  // =========================
  // MAIN LOADER
  // =========================

  fetchBoardData: async (boardId) => {
    const token = useAuthStore.getState().token;

    set({ loading: true, error: null });

    try {
      // Fetch board core data first
      const [boardDetails, members, pendingMembers, listsRes] =
        await Promise.all([
          boardPageApi.getBoardDetails(token, boardId),
          boardPageApi.getBoardMembers(token, boardId),
          boardPageApi.getPendingMembers(token, boardId),
          boardPageApi.getBoardLists(token, boardId),
        ]);

      const lists = listsRes.lists || [];
      const tasksByList = {};

      // Fetch tasks per list
      await Promise.all(
        lists.map(async (list) => {
          const res = await boardPageApi.getListTasks(
            token,
            boardId,
            list._id
          );
          tasksByList[list._id] = res.tasks || [];
        })
      );

      set({
        boardDetails,
        members: members.members || [],
        pendingMembers: pendingMembers.pendingMembers || [],
        lists,
        tasksByList,
        loading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.msg || "Failed to load board",
        loading: false,
      });
    }
  },

  // =========================
  // MEMBERS
  // =========================

  sendInvite: async (boardId) => {
    const token = useAuthStore.getState().token;
    return await boardPageApi.inviteToBoard(token, boardId);
  },

  approveMember: async (boardId, userId) => {
    const token = useAuthStore.getState().token;

    const res = await boardPageApi.approveMember(token, boardId, userId);
    const approvedUser = res.member;

    set((state) => ({
      members: [...state.members, approvedUser],
      pendingMembers: state.pendingMembers.filter(
        (m) => m.userId !== approvedUser.userId
      ),
    }));
  },

  rejectMember: async (boardId, userId) => {
    const token = useAuthStore.getState().token;

    await boardPageApi.rejectMember(token, boardId, userId);

    set((state) => ({
      pendingMembers: state.pendingMembers.filter(
        (m) => m.userId !== userId
      ),
    }));
  },

  removeMember: async (boardId, userId) => {
    const token = useAuthStore.getState().token;

    await boardPageApi.removeMember(token, boardId, userId);

    set((state) => ({
      members: state.members.filter((m) => m.userId !== userId),
    }));
  },

  makeBoardAdmin: async (boardId, userId) => {
    const token = useAuthStore.getState().token;

    await boardPageApi.makeBoardAdmin(token, boardId, userId);

    set((state) => ({
      members: state.members.map((m) => ({
        ...m,
        isAdmin: m.userId === userId,
      })),
    }));
  },

  leaveBoard: async (boardId) => {
    const token = useAuthStore.getState().token;
    await boardPageApi.leaveBoard(token, boardId);
  },

  refreshMembers: async (boardId) => {
    const token = useAuthStore.getState().token;
    const res = await boardPageApi.getBoardMembers(token, boardId);
    set({ members: res.members || [] });
  },

  // =========================
  // LISTS
  // =========================

  refreshLists: async (boardId) => {
    const token = useAuthStore.getState().token;
    const res = await boardPageApi.getBoardLists(token, boardId);
    set({ lists: res.lists || [] });
  },

  // =========================
  // TASKS
  // =========================

  refreshTasks: async (boardId, listId) => {
    const token = useAuthStore.getState().token;

    const res = await boardPageApi.getListTasks(
      token,
      boardId,
      listId
    );

    set((state) => ({
      tasksByList: {
        ...state.tasksByList,
        [listId]: res.tasks || [],
      },
    }));
  },

  // =========================
  // RESET
  // =========================

  resetBoardState: () => {
    set({
      boardDetails: null,
      members: [],
      pendingMembers: [],
      lists: [],
      tasksByList: {},
      loading: false,
      error: null,
    });
  },
}));
