import express from "express";
import fs from "node:fs";
import path from "node:path";
import type { Env } from "../utils/env.js";
import { logError } from "../utils/logger.js";
import { answerChat, type ChatRequest } from "./chat.js";

const FEEDBACK_FILE = path.resolve("assistant-feedback.jsonl");

export const createAssistantRouter = (env: Env) => {
  const router = express.Router();
  router.use(express.json({ limit: "1mb" }));

  // with the feature flag off the routes do not exist
  router.use((_req, res, next) => {
    if (!env.AI_ASSISTANT_ENABLED) {
      res.status(404).end();
      return;
    }
    next();
  });

  router.get("/config", (_req, res) => {
    res.json({ enabled: true });
  });

  router.post("/chat", async (req, res) => {
    const body = req.body as Partial<ChatRequest> | undefined;
    if (body === undefined || !Array.isArray(body.messages)) {
      res.status(400).json({ error: "messages array required" });
      return;
    }
    try {
      const response = await answerChat(
        env,
        { messages: body.messages, context: body.context },
        req.headers.authorization,
      );
      res.json(response);
    } catch (error) {
      logError(`assistant chat failed: ${String(error)}`);
      res.status(500).json({ error: "assistant unavailable" });
    }
  });

  router.post("/feedback", (req, res) => {
    const line = JSON.stringify({
      timestamp: new Date().toISOString(),
      ...req.body,
    });
    try {
      fs.appendFileSync(FEEDBACK_FILE, `${line}\n`);
      res.status(204).end();
    } catch (error) {
      logError(`assistant feedback write failed: ${String(error)}`);
      res.status(500).json({ error: "could not store feedback" });
    }
  });

  return router;
};
