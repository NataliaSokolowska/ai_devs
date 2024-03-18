import { ANSWER_URL, POST_URL, TASK_URL } from "./Config.constants";

export interface ResponseInterface {
  result: {
    code: number;
    msg: string;
    note: string;
  };
  answer: string;
}

const getToken = async (taskName: string) => {
  const API_KEY = import.meta.env.VITE_API_KEY;
  const response = await fetch(`${POST_URL}/${taskName}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ apikey: API_KEY }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`);
  }

  const data = await response.json();
  return data.token;
};

const getTask = async (token: string) => {
  const response = await fetch(`${TASK_URL}/${token}`);
  const task = await response.json();
  return task;
};

const handleTaskResponse = (taskResponse: Record<string, never>) => {
  if (taskResponse.cookie) {
    return taskResponse.cookie;
  }

  return "";
};

const submitAnswer = async (token: string, answer: string) => {
  const response = await fetch(`${ANSWER_URL}/${token}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ answer }),
  });

  const result = await response.json();
  return result;
};

export const run = async (taskName: string): Promise<ResponseInterface> => {
  try {
    const token = await getToken(taskName);
    const task = await getTask(token);
    const answer = handleTaskResponse(task);
    const result = await submitAnswer(token, answer);
    return { result, answer };
  } catch (error) {
    console.error("Something is wrong:", error);
    return {
      result: {
        code: 0,
        msg: "Something is wrong",
        note: "Check the console for more information",
      },
      answer: "",
    };
  }
};
