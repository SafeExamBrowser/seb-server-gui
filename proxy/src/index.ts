import { createProxyServer } from "http-proxy-3";
import http from "http";
import { setCorsHeaders } from "./utils/cors";
import { parseEnv } from "./utils/env";

const API_PREFIX = "/admin-api/v1";

const env = parseEnv();

const proxyConfig = createProxyServer({
  target: `${env.SEB_SERVER_URL}:${env.SEB_SERVER_PORT}${API_PREFIX}`,
  auth: `${env.SEB_SERVER_USERNAME}:${env.SEB_SERVER_PASSWORD}`, // TODO @alain: when exactly is this used? For the authentication request maybe?
});

proxyConfig.on("proxyReq", (proxyReq, req, res) => {
  const authToken = req.headers.authorization;

  if (!authToken) {
    // TODO @alain: is this the correct way to handle this?
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Unauthorized" }));
    return;
  }

  // override auth header (personal access token)
  proxyReq.setHeader("Authorization", authToken);

  // the backend API requires a Content-Type, even on GET request, so we manually add it here
  // TODO @alain: check with Andreas if we should adapt the API to not require this
  proxyReq.setHeader("Content-Type", "application/x-www-form-urlencoded");
});

proxyConfig.on("proxyRes", (_proxyRes, _req, res) => {
  setCorsHeaders(res, env.PROXY_ALLOWED_ORIGIN);
});

const server = http.createServer((req, res) => {
  // handle preflight OPTIONS requests directly
  if (req.method === "OPTIONS") {
    setCorsHeaders(res, env.PROXY_ALLOWED_ORIGIN);
    res.writeHead(204);
    res.end();
    return;
  }

  // forward all other requests
  proxyConfig.web(req, res);
});

server.listen(env.PROXY_PORT, () => {
  console.log(`Proxy server running on port ${env.PROXY_PORT}`);
});
