import type { Env } from "../utils/env.js";
import { logError, logInfo } from "../utils/logger.js";
import { selectEntries, type KnowledgeEntry } from "./knowledge.js";
import {
  formatRunningExams,
  listRunningExams,
  type LookupResult,
} from "./sebServerLookup.js";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type ChatContext = {
  pageTestId?: string;
  pageTitle?: string;
  roles?: string[];
};

export type ChatRequest = {
  messages: ChatMessage[];
  context?: ChatContext;
};

export type ChatResponse = {
  answer: string;
  sources: string[];
  guide?: string;
  calls: string[];
};

const GUIDE_MARKER = /\[\[guide:([a-z-]+)\]\]/g;
const SOURCE_MARKER = /\[\[source:([^\]]+)\]\]/g;

// Extracts [[guide:…]] / [[source:…]] markers and verbatim entry keys from a
// raw model (or mock) answer and strips the markers from the shown text.
export const parseRawAnswer = (
  raw: string,
  offeredKeys: string[],
): Pick<ChatResponse, "answer" | "sources" | "guide"> => {
  const sources = new Set<string>();
  let guide: string | undefined;

  for (const match of raw.matchAll(GUIDE_MARKER)) {
    guide = guide ?? match[1];
  }
  for (const match of raw.matchAll(SOURCE_MARKER)) {
    sources.add(match[1].trim());
  }

  const answer = raw
    .replace(GUIDE_MARKER, "")
    .replace(SOURCE_MARKER, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  for (const key of offeredKeys) {
    if (answer.includes(key)) {
      sources.add(key);
    }
  }

  return { answer, sources: [...sources], ...(guide ? { guide } : {}) };
};

const buildSystemPrompt = (
  entries: KnowledgeEntry[],
  context?: ChatContext,
) => {
  const contextLine =
    context === undefined
      ? ""
      : `\nThe user is currently on the page "${context.pageTitle ?? context.pageTestId ?? "unknown"}" with the roles: ${(context.roles ?? []).join(", ") || "unknown"}.`;

  const entryLines = entries
    .map((entry) => `- ${entry.key}: ${entry.text}`)
    .join("\n");

  return [
    "You are the assistant inside the SEB Server administration GUI.",
    "Answer questions about SEB Server and its settings ONLY from the help-text entries below and from tool results.",
    "If the entries and tool results do not contain the answer, say that you do not know.",
    "Cite every help-text entry you used with a marker of the form [[source:ENTRY_KEY]] at the end of your answer.",
    "When the user asks how to create an exam, add the marker [[guide:create-exam]] on its own line.",
    "Use the list_running_exams tool when the user asks which exams are running.",
    "Answer in short plain text. No markdown.",
    contextLine,
    "",
    "Help-text entries:",
    entryLines,
  ].join("\n");
};

// --- deterministic mock answers (used by AI_MOCK=true, model fallback and the e2e specs)

const mockAnswer = async (
  env: Env,
  question: string,
  entries: KnowledgeEntry[],
  authorization?: string,
): Promise<{ raw: string; calls: string[] }> => {
  const normalized = question.toLowerCase();

  if (normalized.includes("quit password")) {
    return {
      raw: [
        "The quit password protects leaving the exam: if it is set, a SEB user must enter it to be able to quit SEB.",
        "It mirrors the Quit Password from the SEB settings, so supervisors can end sessions without students quitting on their own.",
        "[[source:sebserver.exam.form.quitpwd.tooltip]]",
        "[[source:sebserver.clientconfig.form.hashedQuitPassword.tooltip]]",
      ].join("\n"),
      calls: [],
    };
  }

  if (normalized.includes("running")) {
    const lookup = await listRunningExams(env, authorization);
    return { raw: formatRunningExams(lookup), calls: lookup.calls };
  }

  if (normalized.includes("create an exam")) {
    return {
      raw: [
        "To create an exam you import a quiz from a connected assessment tool: open Exams, start the preparation wizard, pick the quiz and follow the steps.",
        "I can walk you through it on the page.",
        "[[guide:create-exam]]",
      ].join("\n"),
      calls: [],
    };
  }

  const top = entries.slice(0, 3);
  if (top.length === 0) {
    return {
      raw: "I do not know. I could not find any matching SEB Server help texts for your question.",
      calls: [],
    };
  }
  return {
    raw: [
      "I found these help texts that match your question:",
      ...top.map((entry) => `- ${entry.key}: ${entry.text}`),
    ].join("\n"),
    calls: [],
  };
};

// --- OpenAI-compatible model call with the single list_running_exams tool

type ModelMessage =
  | { role: "system" | "user" | "assistant"; content: string }
  | { role: "assistant"; content: string | undefined; tool_calls: unknown[] }
  | { role: "tool"; content: string; tool_call_id: string };

type ToolCall = {
  id: string;
  function?: { name?: string };
};

type CompletionResponse = {
  choices?: {
    message?: {
      content?: string;
      tool_calls?: ToolCall[];
    };
  }[];
};

const completionRequest = async (
  env: Env,
  messages: ModelMessage[],
): Promise<CompletionResponse> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (env.AI_API_KEY !== undefined) {
    headers.Authorization = `Bearer ${env.AI_API_KEY}`;
  }

  const response = await fetch(`${env.AI_API_BASE_URL}/chat/completions`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: env.AI_MODEL,
      messages,
      tools: [
        {
          type: "function",
          function: {
            name: "list_running_exams",
            description:
              "Lists the exams of the logged-in user that are running right now, including per-exam SEB client connection states.",
            parameters: { type: "object", properties: {} },
          },
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`model endpoint answered ${response.status}`);
  }
  return (await response.json()) as CompletionResponse;
};

const modelAnswer = async (
  env: Env,
  request: ChatRequest,
  entries: KnowledgeEntry[],
  authorization?: string,
): Promise<{ raw: string; calls: string[] }> => {
  const messages: ModelMessage[] = [
    { role: "system", content: buildSystemPrompt(entries, request.context) },
    ...request.messages.slice(-6),
  ];

  const calls: string[] = [];
  const first = await completionRequest(env, messages);
  const firstMessage = first.choices?.[0]?.message;

  const toolCalls = firstMessage?.tool_calls ?? [];
  if (toolCalls.length === 0) {
    return { raw: firstMessage?.content ?? "", calls };
  }

  messages.push({
    role: "assistant",
    content: firstMessage?.content,
    tool_calls: toolCalls,
  });

  for (const toolCall of toolCalls) {
    let result: LookupResult | { error: string };
    if (toolCall.function?.name === "list_running_exams") {
      try {
        result = await listRunningExams(env, authorization);
        calls.push(...result.calls);
      } catch (error) {
        result = { error: String(error) };
      }
    } else {
      result = { error: `unknown tool ${toolCall.function?.name}` };
    }
    messages.push({
      role: "tool",
      content: JSON.stringify(result),
      tool_call_id: toolCall.id,
    });
  }

  const second = await completionRequest(env, messages);
  return { raw: second.choices?.[0]?.message?.content ?? "", calls };
};

export const answerChat = async (
  env: Env,
  request: ChatRequest,
  authorization?: string,
): Promise<ChatResponse> => {
  const question = request.messages.at(-1)?.content ?? "";
  const entries = selectEntries(question);
  const offeredKeys = entries.map((entry) => entry.key);

  let raw: { raw: string; calls: string[] };
  if (env.AI_MOCK || env.AI_API_BASE_URL === undefined) {
    raw = await mockAnswer(env, question, entries, authorization);
  } else {
    try {
      raw = await modelAnswer(env, request, entries, authorization);
    } catch (error) {
      logError(`assistant: model call failed (${String(error)}), using mock`);
      raw = await mockAnswer(env, question, entries, authorization);
    }
  }

  logInfo(`assistant: answered "${question.slice(0, 80)}"`);
  return { ...parseRawAnswer(raw.raw, offeredKeys), calls: raw.calls };
};
