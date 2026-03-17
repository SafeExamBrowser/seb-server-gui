import express from "express";
import ProxyServer, { createProxyServer } from "http-proxy-3";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseEnv } from "./utils/env.js";
import { logInfo, logRequest } from "./utils/logger.js";
import { prepareProxyRequest } from "./utils/prepareProxyRequest.js";

const env = parseEnv();
const app = express();

const clientBuildDirectory = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "views",
);

const sebProxy = createProxyServer({
  target: env.SEB_SERVER_URL,
});

const spsProxy = createProxyServer({
  target: env.PROCTOR_SERVER_URL,
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

addProxyHandlers(sebProxy, env.SEB_SERVER_URL);
addProxyHandlers(spsProxy, env.PROCTOR_SERVER_URL);

// everything that's prefixed with '/api/sps' is proxied to sps
app.use("/api/sps", (req, res) => {
  spsProxy.web(
    prepareProxyRequest({
      req,
      defaultUrl: env.PROCTOR_SERVER_DEFAULT_URL,
      basicAuthUsername: env.PROCTOR_SERVER_USERNAME,
      basicAuthPassword: env.PROCTOR_SERVER_PASSWORD,
    }),
    res,
  );
});

// everything else that's prefixed with '/api' is proxied to seb
app.use("/api", (req, res) => {
  sebProxy.web(
    prepareProxyRequest({
      req,
      defaultUrl: env.SEB_SERVER_DEFAULT_URL,
      basicAuthUsername: env.SEB_SERVER_USERNAME,
      basicAuthPassword: env.SEB_SERVER_PASSWORD,
    }),
    res,
  );
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
