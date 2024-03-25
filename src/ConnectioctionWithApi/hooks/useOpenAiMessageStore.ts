import { create } from "zustand";
import { connectWithOpenAi } from "../../Utils/utils";

interface OpenAiMessageState {
  returnMessage: {
    message: {
      role: string;
      content: string;
    };
  };
  isLoading: boolean;
  fetchOpenAiMessage: () => void;
}

const useOpenAiMessageStore = create<OpenAiMessageState>((set) => ({
  returnMessage: {
    message: {
      role: "",
      content: "",
    },
  },
  isLoading: false,

  fetchOpenAiMessage: async () => {
    set({ isLoading: true });
    try {
      const { choices } = await connectWithOpenAi();
      const firstChoice = choices[0];
      if (firstChoice) {
        const { message } = firstChoice;
        set({
          returnMessage: { message },
          isLoading: false,
        });
      }
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },
}));

export default useOpenAiMessageStore;
