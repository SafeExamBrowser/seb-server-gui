import fs from "node:fs";
import path from "node:path";
import { logInfo } from "../utils/logger.js";

export type KnowledgeEntry = {
  key: string;
  text: string;
  source: "messages.properties" | "en.json";
};

type ScoredEntry = KnowledgeEntry & {
  keyTokens: Set<string>;
  textTokens: string[];
};

const tokenize = (value: string) =>
  value
    .toLowerCase()
    .split(/[^a-z]+/)
    .filter((token) => token.length > 2);

const stripHtml = (value: string) =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

const parseMessagesProperties = (content: string): KnowledgeEntry[] => {
  const entries: KnowledgeEntry[] = [];
  // join trailing-backslash line continuations before parsing key=value pairs
  const lines = content.replace(/\\\r?\n\s*/g, "").split(/\r?\n/);
  for (const line of lines) {
    if (line.startsWith("#") || line.startsWith("!")) {
      continue;
    }
    const separator = line.indexOf("=");
    if (separator <= 0) {
      continue;
    }
    const key = line.slice(0, separator).trim();
    const text = stripHtml(line.slice(separator + 1));
    if (text.length === 0) {
      continue;
    }
    entries.push({ key, text, source: "messages.properties" });
  }
  return entries;
};

const flattenJson = (
  value: unknown,
  prefix: string,
  entries: KnowledgeEntry[],
) => {
  if (typeof value === "string") {
    const text = stripHtml(value);
    if (prefix.length > 0 && !prefix.includes("-------") && text.length > 0) {
      entries.push({ key: prefix, text, source: "en.json" });
    }
    return;
  }
  if (typeof value !== "object" || value === null) {
    return;
  }
  for (const [childKey, childValue] of Object.entries(value)) {
    const childPrefix = prefix.length > 0 ? `${prefix}.${childKey}` : childKey;
    flattenJson(childValue, childPrefix, entries);
  }
};

const readFileIfPresent = (filePath: string) => {
  if (!fs.existsSync(filePath)) {
    logInfo(`assistant knowledge: ${filePath} not found, skipping`);
    return undefined;
  }
  return fs.readFileSync(filePath, "utf8");
};

const loadEntries = (): ScoredEntry[] => {
  const entries: KnowledgeEntry[] = [];

  const properties = readFileIfPresent(
    path.resolve("data/messages.properties"),
  );
  if (properties !== undefined) {
    entries.push(...parseMessagesProperties(properties));
  }

  const enJson = readFileIfPresent(
    path.resolve("../client/src/i18n/locales/en.json"),
  );
  if (enJson !== undefined) {
    flattenJson(JSON.parse(enJson), "", entries);
  }

  logInfo(`assistant knowledge: loaded ${entries.length} entries`);

  return entries.map((entry) => ({
    ...entry,
    keyTokens: new Set(tokenize(entry.key)),
    textTokens: tokenize(entry.text),
  }));
};

let cachedEntries: ScoredEntry[] | undefined;

const allEntries = () => {
  cachedEntries = cachedEntries ?? loadEntries();
  return cachedEntries;
};

export const knownKeys = () => new Set(allEntries().map((entry) => entry.key));

export const selectEntries = (question: string, limit = 40) => {
  const questionTerms = [...new Set(tokenize(question))];

  const scored = allEntries()
    .map((entry) => {
      let score = 0;
      for (const term of questionTerms) {
        if (entry.keyTokens.has(term)) {
          score += 3;
        }
        for (const token of entry.textTokens) {
          if (token === term) {
            score += 1;
          }
        }
      }
      return { entry, score };
    })
    .filter((candidate) => candidate.score > 0);

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((candidate) => ({
    key: candidate.entry.key,
    text: candidate.entry.text,
    source: candidate.entry.source,
  }));
};
