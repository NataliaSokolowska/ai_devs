import { create } from "zustand";
import {
  connectWithOpenApiWithFilteredInformation,
  fetchTaskData,
  submitAnswer,
} from "./utils";
import { GPT_3_5_TURBO } from "./utils.constants";
import { TaskData } from "./utils.interfaces";

interface OpenApiTaskState {
  isLoading: boolean;
  errorMessage: string;
  performTask: (taskName: string, initialSystemData?: string) => Promise<void>;
}

const useOpenApiTaskStore = create<OpenApiTaskState>((set) => ({
  isLoading: false,
  errorMessage: "",
  performTask: async (taskName: string, initialSystemData?: string) => {
    set(() => ({ isLoading: true, errorMessage: "" }));
    try {
      let task: TaskData["task"];
      let token;
      let response: string;
      const accumulatedHints: string[] = [];
      let attempt = 0;
      const maxAttempts = 5;

      while (attempt < maxAttempts) {
        ({ task, token } = await fetchTaskData(taskName));
        const question = task.question ?? task.hint;

        if (question && !accumulatedHints.includes(question)) {
          accumulatedHints.push(question);
        }

        response = await connectWithOpenApiWithFilteredInformation(
          initialSystemData ??
            `check this article ${task.input} and answer the question. answer briefly.`,
          accumulatedHints.join("; "),
          GPT_3_5_TURBO
        );

        if (response !== "nie") {
          const result = await submitAnswer(token, response);
          if (
            result.code === 406 ||
            result.msg === "this is NOT the correct answer"
          ) {
            attempt++;
          } else {
            console.log("Odpowiedź została zaakceptowana.");
            return;
          }
        } else {
          attempt++;
        }
      }
      console.log(
        "Nie udało się uzyskać prawidłowej odpowiedzi po maksymalnej liczbie prób."
      );
    } catch (error) {
      console.error("Error performing OpenAPI task:", error);
      set(() => ({ isLoading: false, errorMessage: "Error performing task" }));
    } finally {
      set(() => ({ isLoading: false }));
    }
  },
}));

export default useOpenApiTaskStore;
