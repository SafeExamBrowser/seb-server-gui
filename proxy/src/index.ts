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

const sebTarget = new URL("/admin-api/v1", env.SEB_SERVER_URL);
const proctorTarget = new URL("/admin-api/v1", env.PROCTOR_SERVER_URL);

const sebProxy = createProxyServer({
  target: sebTarget,
});

const proctorProxy = createProxyServer({
  target: proctorTarget,
});

const addProxyHandlers = (proxy: ProxyServer, targetBase: URL) => {
  proxy.on("proxyRes", (proxyRes, req) => {
    logRequest({
      method: req.method,
      url: new URL(req.url ?? "/", targetBase),
      statusCode: proxyRes.statusCode,
    });
  });
};

addProxyHandlers(sebProxy, sebTarget);
addProxyHandlers(proctorProxy, proctorTarget);

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
