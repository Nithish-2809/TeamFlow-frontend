import { create } from "zustand";
import boardPageApi from "../api/boardPage.api";
import { useAuthStore } from "./auth.store";

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
      // Step 1: Fetch board details first to check if user is admin
      const boardDetails = await boardPageApi.getBoardDetails(token, boardId);

      // Step 2: Fetch members and lists
      const [members, listsRes] = await Promise.all([
        boardPageApi.getBoardMembers(token, boardId),
        boardPageApi.getBoardLists(token, boardId),
      ]);

      // Step 3: Only fetch pending members if user is admin
      let pendingMembersData = { pendingMembers: [] };
      if (boardDetails.isAdmin) {
        try {
          pendingMembersData = await boardPageApi.getPendingMembers(token, boardId);
        } catch (error) {
          // If 403, user is not actually admin or endpoint is restricted - that's OK
          if (error.response?.status !== 403) {
            console.error('Error fetching pending members:', error);
          }
        }
      }

      const lists = listsRes.lists || [];
      const tasksByList = {};

      // Step 4: Fetch tasks per list
      await Promise.all(
        lists.map(async (list) => {
          try {
            const res = await boardPageApi.getListTasks(
              token,
              boardId,
              list._id
            );
            tasksByList[list._id] = res.tasks || [];
          } catch (error) {
            console.error(`Error fetching tasks for list ${list._id}:`, error);
            tasksByList[list._id] = [];
          }
        })
      );

      set({
        boardDetails,
        members: members.members || [],
        pendingMembers: pendingMembersData.pendingMembers || [],
        lists,
        tasksByList,
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error('Error in fetchBoardData:', err);
      set({
        error: err.response?.data?.msg || "Failed to load board",
        loading: false,
      });
    }
  },

  // =========================
  // BOARD ACTIONS
  // =========================

  deleteBoard: async (boardId) => {
    const token = useAuthStore.getState().token;
    await boardPageApi.deleteBoard(token, boardId);
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
      boardDetails: {
        ...state.boardDetails,
        isAdmin: false, // Current user loses admin status
      },
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