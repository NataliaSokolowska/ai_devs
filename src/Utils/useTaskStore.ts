import { create } from "zustand";
import { run } from "./utils";
import { ResponseInterface } from "./utils.interfaces";

interface TaskState {
  responses: { [key: string]: ResponseInterface | undefined };
  isLoading: { [key: string]: boolean };
  runTask: (taskName: string) => Promise<void>;
}

const useTaskStore = create<TaskState>((set, get) => ({
  responses: {},
  isLoading: {},
  runTask: async (taskName: string) => {
    if (get().isLoading[taskName]) {
      return;
    }
    set((state) => ({ isLoading: { ...state.isLoading, [taskName]: true } }));
    try {
      const response = await run(taskName);
      set((state) => ({
        responses: { ...state.responses, [taskName]: response },
        isLoading: { ...state.isLoading, [taskName]: false },
      }));
    } catch (error) {
      set((state) => ({
        isLoading: { ...state.isLoading, [taskName]: false },
      }));
      console.error("Error running task:", error);
    }
  },
}));

export default useTaskStore;
