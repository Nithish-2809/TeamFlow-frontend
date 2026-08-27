import { create } from "zustand";
import boardPageApi from "../api/boardPage.api";
import {
  getBoardLists,
  createList,
  renameList,
  deleteList,
  reorderLists,
} from "../api/list.api";
import {
  getListTasks,
  createTask,
  updateTask,
  deleteTask,
  reorderTasks,
} from "../api/task.api";
import { useAuthStore } from "../store/auth.store";

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
        getBoardLists(token, boardId),
      ]);

      // Step 3: Only fetch pending members if user is admin
      let pendingMembersData = { pendingMembers: [] };
      if (boardDetails.isAdmin) {
        try {
          pendingMembersData = await boardPageApi.getPendingMembers(
            token,
            boardId,
          );
        } catch (error) {
          // If 403, user is not actually admin or endpoint is restricted - that's OK
          if (error.response?.status !== 403) {
            console.error("Error fetching pending members:", error);
          }
        }
      }

      const lists = listsRes.lists || [];
      const tasksByList = {};

      // Step 4: Fetch tasks per list
      await Promise.all(
        lists.map(async (list) => {
          try {
            const res = await getListTasks(token, boardId, list._id);
            tasksByList[list._id] = res.tasks || [];
          } catch (error) {
            console.error(`Error fetching tasks for list ${list._id}:`, error);
            tasksByList[list._id] = [];
          }
        }),
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
      console.error("Error in fetchBoardData:", err);
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
        (m) => m.userId.toString() !== userId.toString(),
      ),
    }));
  },

  rejectMember: async (boardId, userId) => {
    const token = useAuthStore.getState().token;

    await boardPageApi.rejectMember(token, boardId, userId);

    set((state) => ({
      pendingMembers: state.pendingMembers.filter(
        (m) => m.userId.toString() !== userId.toString(),
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
  // LISTS ACTIONS
  // =========================

  createList: async (boardId, name) => {
    const token = useAuthStore.getState().token;

    try {
      const response = await createList(token, boardId, name);

      // Add the new list to state
      set((state) => ({
        lists: [...state.lists, response.list],
        tasksByList: {
          ...state.tasksByList,
          [response.list._id]: [],
        },
      }));

      return response;
    } catch (error) {
      console.error("Error creating list:", error);
      throw error;
    }
  },

  renameList: async (boardId, listId, name) => {
    const token = useAuthStore.getState().token;

    try {
      const response = await renameList(token, boardId, listId, name);

      // Update the list in state
      set((state) => ({
        lists: state.lists.map((list) =>
          list._id === listId ? { ...list, name: response.list.name } : list,
        ),
      }));

      return response;
    } catch (error) {
      console.error("Error renaming list:", error);
      throw error;
    }
  },

  deleteList: async (boardId, listId) => {
    const token = useAuthStore.getState().token;

    try {
      await deleteList(token, boardId, listId);

      // Remove the list and its tasks from state
      set((state) => {
        const newTasksByList = { ...state.tasksByList };
        delete newTasksByList[listId];

        return {
          lists: state.lists.filter((list) => list._id !== listId),
          tasksByList: newTasksByList,
        };
      });
    } catch (error) {
      console.error("Error deleting list:", error);
      throw error;
    }
  },

  reorderLists: async (boardId, orderedListIds) => {
    const token = useAuthStore.getState().token;

    try {
      await reorderLists(token, boardId, orderedListIds);

      // Reorder lists in state
      set((state) => {
        const listsMap = new Map(state.lists.map((list) => [list._id, list]));
        const reorderedLists = orderedListIds
          .map((id) => listsMap.get(id))
          .filter(Boolean);

        return { lists: reorderedLists };
      });
    } catch (error) {
      console.error("Error reordering lists:", error);
      throw error;
    }
  },

  refreshLists: async (boardId) => {
    const token = useAuthStore.getState().token;
    const res = await getBoardLists(token, boardId);
    set({ lists: res.lists || [] });
  },

  // =========================
  // SOCKET-DRIVEN STATE UPDATES (no API calls — applies data
  // already broadcast by the server for list:* events)
  // =========================

  applyListCreated: (list) => {
    set((state) => {
      if (state.lists.some((l) => l._id === list._id)) return state;
      return {
        lists: [...state.lists, list],
        tasksByList: {
          ...state.tasksByList,
          [list._id]: state.tasksByList[list._id] || [],
        },
      };
    });
  },

  applyListRenamed: (listId, newName) => {
    set((state) => ({
      lists: state.lists.map((list) =>
        list._id === listId ? { ...list, name: newName } : list,
      ),
    }));
  },

  applyListDeleted: (listId) => {
    set((state) => {
      const newTasksByList = { ...state.tasksByList };
      delete newTasksByList[listId];

      return {
        lists: state.lists.filter((list) => list._id !== listId),
        tasksByList: newTasksByList,
      };
    });
  },

  applyListsReordered: (orderedListIds) => {
    set((state) => {
      const listsMap = new Map(state.lists.map((list) => [list._id, list]));
      const reorderedLists = orderedListIds
        .map((id) => listsMap.get(id))
        .filter(Boolean);

      return { lists: reorderedLists };
    });
  },

  applyTaskCreated: (listId, task) => {
    set((state) => {
      const existing = state.tasksByList[listId] || [];
      if (existing.some((t) => t._id === task._id)) return state;
      return {
        tasksByList: {
          ...state.tasksByList,
          [listId]: [...existing, task],
        },
      };
    });
  },

  applyTaskUpdated: (listId, task) => {
    set((state) => ({
      tasksByList: {
        ...state.tasksByList,
        [listId]: (state.tasksByList[listId] || []).map((t) =>
          t._id === task._id ? { ...t, ...task } : t,
        ),
      },
    }));
  },

  applyTaskDeleted: (listId, taskId) => {
    set((state) => ({
      tasksByList: {
        ...state.tasksByList,
        [listId]: (state.tasksByList[listId] || []).filter(
          (t) => t._id !== taskId,
        ),
      },
    }));
  },

  applyTasksReordered: (listId, orderedTaskIds) => {
    set((state) => {
      const tasksMap = new Map(
        (state.tasksByList[listId] || []).map((t) => [t._id, t]),
      );
      const reordered = orderedTaskIds
        .map((id) => tasksMap.get(id))
        .filter(Boolean);
      return {
        tasksByList: {
          ...state.tasksByList,
          [listId]: reordered,
        },
      };
    });
  },

  // =========================
  // TASKS ACTIONS
  // =========================

  createTask: async (boardId, listId, taskData) => {
    const token = useAuthStore.getState().token;

    try {
      const response = await createTask(token, boardId, listId, taskData);

      // Add the new task to state
      set((state) => ({
        tasksByList: {
          ...state.tasksByList,
          [listId]: [...(state.tasksByList[listId] || []), response.task],
        },
      }));

      return response;
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  },

  updateTask: async (boardId, listId, taskId, taskData) => {
    const token = useAuthStore.getState().token;

    try {
      const response = await updateTask(
        token,
        boardId,
        listId,
        taskId,
        taskData,
      );

      // Update the task in state
      set((state) => ({
        tasksByList: {
          ...state.tasksByList,
          [listId]: (state.tasksByList[listId] || []).map((task) =>
            task._id === taskId ? { ...task, ...response.task } : task,
          ),
        },
      }));

      return response;
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  },

  deleteTask: async (boardId, listId, taskId) => {
    const token = useAuthStore.getState().token;

    try {
      await deleteTask(token, boardId, listId, taskId);

      // Remove the task from state
      set((state) => ({
        tasksByList: {
          ...state.tasksByList,
          [listId]: (state.tasksByList[listId] || []).filter(
            (task) => task._id !== taskId,
          ),
        },
      }));
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  },

  renameBoard: (newName) => {
    set((state) => ({
      boardDetails: state.boardDetails
        ? { ...state.boardDetails, name: newName }
        : state.boardDetails,
    }));
  },

  reorderTasks: async (boardId, listId, orderedTaskIds) => {
    const token = useAuthStore.getState().token;

    try {
      await reorderTasks(token, boardId, listId, orderedTaskIds);

      // Reorder tasks in state
      set((state) => {
        const tasksMap = new Map(
          (state.tasksByList[listId] || []).map((task) => [task._id, task]),
        );
        const reorderedTasks = orderedTaskIds
          .map((id) => tasksMap.get(id))
          .filter(Boolean);

        return {
          tasksByList: {
            ...state.tasksByList,
            [listId]: reorderedTasks,
          },
        };
      });
    } catch (error) {
      console.error("Error reordering tasks:", error);
      throw error;
    }
  },

  refreshTasks: async (boardId, listId) => {
    const token = useAuthStore.getState().token;

    const res = await getListTasks(token, boardId, listId);

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