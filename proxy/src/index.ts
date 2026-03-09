import express from "express";
import ProxyServer, { createProxyServer } from "http-proxy-3";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { handleAuthorize } from "./handlers/authorize.js";
import { parseEnv } from "./utils/env.js";
import { logInfo, logRequest } from "./utils/logger.js";

const env = parseEnv();
const app = express();

const clientBuildDirectory = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "views",
);

const sebProxy = createProxyServer({
  target: `${env.SEB_SERVER_URL}:${env.SEB_SERVER_PORT}/admin-api/v1`,
});

const proctorProxy = createProxyServer({
  target: `${env.PROCTOR_SERVER_URL}:${env.PROCTOR_SERVER_PORT}/admin-api/v1`,
});

const addProxyHandlers = (proxy: ProxyServer) => {
  proxy.on("proxyRes", (proxyRes, req, res) => {
    logRequest(req, proxyRes.statusCode);
  });
};

addProxyHandlers(sebProxy);
addProxyHandlers(proctorProxy);

// everything that's prefixed with '/api' is proxied to the SEB or Proctor server
app.use("/api", (req, res) => {
  // handle authorize requests
  if (req.path === "/authorize") {
    handleAuthorize(req, res, env);
    return;
  }

  // forward all other requests
  (req.path.startsWith("/proctoring") ? proctorProxy : sebProxy).web(req, res);
});

// serve client if enabled
if (env.SERVE_CLIENT) {
  app.use(express.static(clientBuildDirectory));
  app.get("/*path", (_req, res) => {
    res.sendFile(path.join(clientBuildDirectory, "index.html"));
  });
}

app.listen(env.PROXY_PORT, () => {
  logInfo(`Proxy server running on port ${env.PROXY_PORT}`);
});
