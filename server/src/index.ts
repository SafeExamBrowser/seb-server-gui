import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseEnv } from "./utils/env.js";
import { logInfo } from "./utils/logger.js";
import { createBackend } from "./utils/createBackend.js";

const app = express();
const env = parseEnv();

const sebProxy = createBackend({
  baseUrl: env.SEB_SERVER_URL,
  defaultUrlPrefix: env.SEB_SERVER_DEFAULT_URL,
  basicAuthUsername: env.SEB_SERVER_USERNAME,
  basicAuthPassword: env.SEB_SERVER_PASSWORD,
});

const spsProxy = createBackend({
  baseUrl: env.PROCTOR_SERVER_URL,
  defaultUrlPrefix: env.PROCTOR_SERVER_DEFAULT_URL,
  basicAuthUsername: env.PROCTOR_SERVER_USERNAME,
  basicAuthPassword: env.PROCTOR_SERVER_PASSWORD,
});

// everything that's prefixed with '/api/sps' is proxied to sps
app.use("/api/sps", (req, res) => {
  spsProxy.handleRequest(req, res);
});

// everything else that's prefixed with '/api' is proxied to seb
app.use("/api", (req, res) => {
  sebProxy.handleRequest(req, res);
});

// statically serve client if enabled
if (env.SERVE_CLIENT) {
  const clientBuildDirectory = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "views",
  );

  app.use(express.static(clientBuildDirectory));
  app.get("/*path", (_req, res) => {
    res.sendFile(path.join(clientBuildDirectory, "index.html"));
  });
}

app.listen(env.SERVER_PORT, () => {
  logInfo(`Server running on port ${env.SERVER_PORT}`);
});
