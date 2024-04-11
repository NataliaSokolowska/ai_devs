import { create } from "zustand";
import {
  connectWithOpenApiWithFilteredInformation,
  fetchTaskData,
  submitAnswer,
} from "./utils";
import { GPT_3_5_TURBO, TASK_NAME_03_02_SCRAPER } from "./utils.constants";

interface OpenApiTaskState {
  isLoading: boolean;
  errorMessage: string;
  performTask: () => Promise<void>;
}

const useOpenApiTaskStore = create<OpenApiTaskState>((set) => ({
  isLoading: false,
  errorMessage: "",
  performTask: async () => {
    set(() => ({ isLoading: true, errorMessage: "" }));
    try {
      const { token, task } = await fetchTaskData(TASK_NAME_03_02_SCRAPER);
      const systemInfo = `check this article ${task.input} and answer the question. answer briefly.`;
      const question = task.question;

      const response = await connectWithOpenApiWithFilteredInformation(
        systemInfo,
        question,
        GPT_3_5_TURBO
      );
      await submitAnswer(token, response);
    } catch (error) {
      console.error("Error performing OpenAPI task:", error);
      set(() => ({ isLoading: false, errorMessage: "Error performing task" }));
    } finally {
      set(() => ({ isLoading: false }));
    }
  },
}));

export default useOpenApiTaskStore;
