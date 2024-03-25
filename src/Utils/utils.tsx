import {
  ANSWER_URL,
  API_KEY,
  LANGUAGE_PL,
  OPEAN_API_CHAT_URL,
  OPEAN_API_MODERATION_URL,
  OPEN_API_KEY,
  POST_URL,
  TASK_URL,
} from "./utils.constants";
import {
  BlogPostOutline,
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

const getTask = async (token: string) => {
  const response = await fetch(`${TASK_URL}/${token}`);
  const task = await response.json();
  return task;
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
  taskResponse: TaskResponse
): Promise<string | string[]> => {
  if (taskResponse.cookie) {
    return taskResponse.cookie;
  }

  if (taskResponse.input) {
    const result = await moderationResponse(taskResponse.input);
    return result;
  }

  if (taskResponse.blog) {
    const result = await createBlogPost(taskResponse as BlogPostOutline);
    return result;
  }

  return "";
};

const submitAnswer = async (token: string, answer: string | string[]) => {
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
