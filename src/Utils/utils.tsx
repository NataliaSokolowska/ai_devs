import { FunctionCalling } from "../FourthWeek/01/Knowledge.interface";
import {
  ANSWER_URL,
  API_KEY,
  GPT_4_TURBO,
  LANGUAGE_PL,
  OPEAN_API_CHAT_URL,
  OPEAN_API_MODERATION_URL,
  OPEN_API_AUDIO_TO_TEXT_WHISPER,
  OPEN_API_EMBEDING_ADA_002_URL,
  OPEN_API_KEY,
  POST_URL,
  TASK_URL,
} from "./utils.constants";
import {
  AppError,
  BlogPostOutline,
  ErrorType,
  GetTaskResponse,
  ModerationResult,
  ResponseInterface,
  TaskResponse,
} from "./utils.interfaces";

const getToken = async (taskName: string) => {
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

const createError = (
  message: string,
  type: ErrorType,
  statusCode?: number
): AppError => {
  return { type, message, statusCode: statusCode || null };
};

const getTask = async (
  token: string,
  attempt = 1
): Promise<GetTaskResponse> => {
  try {
    const response = await fetch(`${TASK_URL}/${token}`, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });
    const task = await response.json();

    if (!response.ok) {
      throw createError(
        `HTTP error! status: ${response.status}`,
        "HttpError",
        response.status
      );
    }
    return task;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw createError(
          "Przekroczono czas oczekiwania na odpowiedź",
          "TimeoutError"
        );
      } else if (attempt <= 3) {
        console.log("Ponawianie próby...");
        return getTask(token, attempt + 1);
      } else {
        throw createError(
          "Nie udało się pobrać zadania po 3 próbach",
          "NetworkError"
        );
      }
    } else {
      throw error;
    }
  }
};

const moderationResponse = async (taskResponses: string[]) => {
  const responses = await Promise.all(
    taskResponses.map(async (task) => {
      const response = await fetch(OPEAN_API_MODERATION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPEN_API_KEY}`,
        },
        body: JSON.stringify({
          input: task,
        }),
      });

      const data = await response.json();

      const results = data.results.map((result: ModerationResult) =>
        result.flagged ? 1 : 0
      );

      return results.length > 0 ? results[0] : 0;
    })
  );
  return responses;
};

const validateAndFormatResponse = (content: string) => {
  content = content.replace(/\n/g, " ");

  if (!content.trim().endsWith(".")) {
    content += ". ";
  }
  content = JSON.stringify(content);
  content = content.slice(1, -1);

  return content;
};

const createBlogPost = async (blogOutline: BlogPostOutline) => {
  const blogPosts = [];

  for (const section of blogOutline.blog) {
    const response = await fetch(`${OPEAN_API_CHAT_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPEN_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        max_tokens: 150,
        messages: [
          {
            role: "system",
            content: `You are a bloger writing in ${LANGUAGE_PL} language. ${blogOutline.msg}. All paragraph have to start from ${section}. This text have to be formatted as a blog post (without your comments)`,
          },
          {
            role: "user",
            content: section,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    blogPosts.push(validateAndFormatResponse(content));
  }
  return blogPosts;
};

const handleTaskResponse = async (
  taskResponse: TaskResponse | GetTaskResponse
): Promise<string | string[]> => {
  if ("cookie" in taskResponse && taskResponse.cookie) {
    return taskResponse.cookie;
  }

  if ("input" in taskResponse && taskResponse.input) {
    const result = await moderationResponse(taskResponse.input);
    return result;
  }

  if ("blog" in taskResponse && taskResponse.blog) {
    const result = await createBlogPost(taskResponse as BlogPostOutline);
    return result;
  }

  return "";
};

export const submitAnswer = async (
  token: string,
  answer: string | string[] | boolean | Record<string, unknown>
) => {
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

export const fetchTaskData = async (taskName: string) => {
  const token = await getToken(taskName);
  const task = await getTask(token);
  return { task, token };
};

export const run = async (taskName: string): Promise<ResponseInterface> => {
  try {
    const { task, token } = await fetchTaskData(taskName);

    const answer = await handleTaskResponse(task);
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

export const connectWithOpenAi = async () => {
  const response = await fetch(`${OPEAN_API_CHAT_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPEN_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        {
          role: "user",
          content: "Hello!",
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`);
  }

  const data = await response.json();

  return data;
};

export const connectWithOpenApiWithFilteredInformation = async (
  doc: string,
  question: string | undefined,
  modelName: string,
  tools?: boolean,
  toolsData?: FunctionCalling[]
) => {
  const response = await fetch(`${OPEAN_API_CHAT_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPEN_API_KEY}`,
    },
    body: JSON.stringify({
      model: modelName,
      messages: [
        {
          role: "system",
          content: doc,
        },
        {
          role: "user",
          content: question,
        },
      ],
      tools: tools && toolsData,
      tool_choice: "auto",
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`);
  }

  const data = await response.json();
  const answer = data.choices[0].message.content;

  return answer;
};

export const connectWithAda002 = async (inputData: string) => {
  const response = await fetch(`${OPEN_API_EMBEDING_ADA_002_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPEN_API_KEY}`,
    },
    body: JSON.stringify({
      model: "text-embedding-ada-002",
      input: inputData,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`);
  }

  const data = await response.json();
  const answer = data.data[0].embedding;

  return answer;
};

export const connectWithWhisper = async (audioFile: File) => {
  const formData = new FormData();
  formData.append("file", audioFile);
  formData.append("model", "whisper-1");

  const response = await fetch(`${OPEN_API_AUDIO_TO_TEXT_WHISPER}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPEN_API_KEY}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`);
  }

  const data = await response.json();
  console.log(data);
  return data;
};

export const connectWithVision = async (
  imageUrl: string,
  userQuestion: string
) => {
  const response = await fetch(`${OPEAN_API_CHAT_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPEN_API_KEY}`,
    },
    body: JSON.stringify({
      model: GPT_4_TURBO,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: userQuestion,
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
              },
            },
          ],
        },
      ],
      max_tokens: 150,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`);
  }

  const data = await response.json();
  const answer = data.choices[0].message.content;

  return answer;
};
