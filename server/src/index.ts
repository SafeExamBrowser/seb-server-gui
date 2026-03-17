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

const sebTarget = `${env.SEB_SERVER_URL}${env.SEB_SERVER_DEFAULT_URL}`;
const proctorTarget = `${env.PROCTOR_SERVER_URL}${env.PROCTOR_SERVER_DEFAULT_URL}`;

const sebProxy = createProxyServer({
  target: sebTarget,
});

const proctorProxy = createProxyServer({
  target: proctorTarget,
});

const addProxyHandlers = (proxy: ProxyServer, targetBase: string) => {
  proxy.on("proxyRes", (proxyRes, req) => {
    logRequest({
      method: req.method,
      url: `${targetBase}${req.url ?? "/"}`,
      statusCode: proxyRes.statusCode,
    });
  });
};

addProxyHandlers(sebProxy, sebTarget);
addProxyHandlers(proctorProxy, proctorTarget);

// everything that's prefixed with '/api/sps' is proxied to sps
app.use("/api/sps", (req, res) => {
  proctorProxy.web(req, res);
});

// everything else that's prefixed with '/api' is proxied to seb
app.use("/api", (req, res) => {
  // handle authorize requests
  // TODO @alain: adapt "authorize"
  if (req.path === "/authorize") {
    handleAuthorize(req, res, env);
    return;
  }

  // forward all other requests
  sebProxy.web(req, res);
});

// statically serve client if enabled
if (env.SERVE_CLIENT) {
  app.use(express.static(clientBuildDirectory));
  app.get("/*path", (_req, res) => {
    res.sendFile(path.join(clientBuildDirectory, "index.html"));
  });
}

app.listen(env.SERVER_PORT, () => {
  logInfo(`Server running on port ${env.SERVER_PORT}`);
});
