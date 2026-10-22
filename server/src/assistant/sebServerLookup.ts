import type { Env } from "../utils/env.js";
import { logError } from "../utils/logger.js";

export type RunningExam = {
  id: number;
  name: string;
  startTime?: string;
  endTime?: string;
  clientStates?: Record<string, number>;
};

export type LookupResult = {
  exams: RunningExam[];
  calls: string[];
};

type ExamRow = {
  id?: number;
  quizName?: string;
  quizStartTime?: string;
  quizEndTime?: string;
  status?: string;
};

// "Which of my exams are running right now?" — GET /monitoring with the
// caller's own bearer token, then the per-exam connection overview.
export const listRunningExams = async (
  env: Env,
  authorization?: string,
): Promise<LookupResult> => {
  const baseUrl = `${env.SEB_SERVER_URL}${env.SEB_SERVER_DEFAULT_URL}`;
  const headers: Record<string, string> = {};
  if (authorization !== undefined) {
    headers.Authorization = authorization;
  }

  const calls: string[] = [];
  const monitoringPath = "/monitoring?page_size=50";
  calls.push(`GET ${monitoringPath}`);

  const response = await fetch(`${baseUrl}${monitoringPath}`, { headers });
  if (!response.ok) {
    throw new Error(`GET ${monitoringPath} failed with ${response.status}`);
  }

  const page = (await response.json()) as { content?: ExamRow[] };
  const rows = Array.isArray(page.content) ? page.content : [];
  // /monitoring serves the running exams; rows that carry another status
  // (e.g. from a mocked backend returning everything) are filtered out.
  const runningRows = rows.filter(
    (row) => row.status === undefined || row.status === "RUNNING",
  );

  const exams: RunningExam[] = [];
  for (const row of runningRows) {
    if (row.id === undefined) {
      continue;
    }
    const exam: RunningExam = {
      id: row.id,
      name: row.quizName ?? `Exam ${row.id}`,
      startTime: row.quizStartTime,
      endTime: row.quizEndTime,
    };

    const overviewPath = `/monitoring/overview/${row.id}`;
    calls.push(`GET ${overviewPath}`);
    try {
      const overviewResponse = await fetch(`${baseUrl}${overviewPath}`, {
        headers,
      });
      if (overviewResponse.ok) {
        const overview = (await overviewResponse.json()) as {
          clientStates?: Record<string, number>;
        };
        exam.clientStates = overview.clientStates;
      }
    } catch (error) {
      logError(`assistant lookup: ${overviewPath} failed (${String(error)})`);
    }

    exams.push(exam);
  }

  return { exams, calls };
};

export const formatRunningExams = (result: LookupResult) => {
  if (result.exams.length === 0) {
    return "No exams are running right now.";
  }

  const lines = result.exams.map((exam) => {
    const states = exam.clientStates;
    const connectionSummary =
      states === undefined
        ? "no connection data"
        : `${states.ACTIVE ?? 0} active of ${states.total ?? 0} connected clients`;
    return `- ${exam.name} (${connectionSummary})`;
  });

  return [
    `${result.exams.length} exam(s) are running right now:`,
    ...lines,
  ].join("\n");
};
