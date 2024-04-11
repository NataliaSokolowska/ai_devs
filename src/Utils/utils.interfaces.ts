export interface ResponseInterface {
  result: {
    code: number;
    msg: string;
    note: string;
  };
  answer: string | string[];
}

export type TaskResponse = {
  cookie?: string;
  input?: string[];
  blog?: string[];
};

type ModerationCategory =
  | "sexual"
  | "hate"
  | "harassment"
  | "self-harm"
  | "sexual/minors"
  | "hate/threatening"
  | "violence/graphic"
  | "self-harm/intent"
  | "self-harm/instructions"
  | "harassment/threatening"
  | "violence";

type CategoriesFlagged = Record<ModerationCategory, boolean>;
type CategoryScores = Record<ModerationCategory, number>;

export interface ModerationResult {
  flagged: boolean;
  categories: CategoriesFlagged;
  category_scores: CategoryScores;
}

export type BlogPostOutline = {
  code: number;
  msg: string;
  blog: string[];
};

export type GetTaskResponse = {
  code: number;
  input: string;
  msg: string;
  question: string;
};

export type ErrorType = "HttpError" | "TimeoutError" | "NetworkError";

export interface AppError {
  message: string;
  type: ErrorType;
  statusCode?: number | null;
}
