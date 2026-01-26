import { createProxyServer } from "http-proxy-3";
import http from "http";
import { setCorsHeaders } from "./utils/cors";
import { parseEnv } from "./utils/env";
import { logInfo, logRequest } from "./utils/logger";

const API_PREFIX = "/admin-api/v1";
const OAUTH_PREFIX = "/oauth";

const env = parseEnv();

const proxyConfig = createProxyServer({
  target: `${env.SEB_SERVER_URL}:${env.SEB_SERVER_PORT}${API_PREFIX}`,
});

proxyConfig.on("proxyReq", (proxyReq, _req, _res) => {
  if (proxyReq.method === "GET") {
    // TODO @Andreas: remove this, once the sev-server API doesn't require this anymore
    // - Content-Type on GET requests doesn't make sense, because GET requests don't have a body
    // - This leads to the browser filtering the header out if we send it from the client
    // - Our API (seb-server) however requires a Content-Type, even on GET requests, so we manually add it here
    proxyReq.setHeader("Content-Type", "application/x-www-form-urlencoded");
  }
});

proxyConfig.on("proxyRes", (proxyRes, req, res) => {
  setCorsHeaders(res, env.PROXY_ALLOWED_ORIGIN);
  logRequest(req, proxyRes.statusCode);
});

const server = http.createServer((req, res) => {
  // handle preflight OPTIONS requests directly
  if (req.method === "OPTIONS") {
    setCorsHeaders(res, env.PROXY_ALLOWED_ORIGIN);
    res.writeHead(204);
    res.end();
    logRequest(req, 204);
    return;
  }

  // route authorize requests to the oauth token endpoint
  if (req.url === "/authorize") {
    proxyConfig.web(req, res, {
      target: `${env.SEB_SERVER_URL}:${env.SEB_SERVER_PORT}${OAUTH_PREFIX}/token`,
      ignorePath: true, // use the target URL as-is, don't append req.url
      headers: {
        Authorization: `Basic ${Buffer.from(`${env.SEB_SERVER_USERNAME}:${env.SEB_SERVER_PASSWORD}`).toString("base64")}`,
      },
    });

    return;
  }

  // forward all other requests
  proxyConfig.web(req, res);
});

server.listen(env.PROXY_PORT, () => {
  logInfo(`Proxy server running on port ${env.PROXY_PORT}`);
});
