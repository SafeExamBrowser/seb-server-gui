import ProxyServer, { createProxyServer } from "http-proxy-3";
import http from "http";
import { handleAuthorize } from "./handlers/authorize";
import { setCorsHeaders } from "./utils/cors";
import { parseEnv } from "./utils/env";
import { logInfo, logRequest } from "./utils/logger";

const env = parseEnv();
const API_PREFIX_REGEX = /^\/api(?=\/|$|\?)/;

const sebProxy = createProxyServer({
  target: `${env.SEB_SERVER_URL}:${env.SEB_SERVER_PORT}/admin-api/v1`,
});

const proctorProxy = createProxyServer({
  target: `${env.PROCTOR_SERVER_URL}:${env.PROCTOR_SERVER_PORT}/admin-api/v1`,
});

const addProxyHandlers = (proxy: ProxyServer) => {
  proxy.on("proxyRes", (proxyRes, req, res) => {
    setCorsHeaders(res, env.PROXY_ALLOWED_ORIGIN, req);
    logRequest(req, proxyRes.statusCode);
  });
};

addProxyHandlers(sebProxy);
addProxyHandlers(proctorProxy);

const hasApiPrefix = (requestUrl?: string) => {
  return requestUrl != null && API_PREFIX_REGEX.test(requestUrl);
};

const stripApiPrefix = (requestUrl?: string) => {
  if (requestUrl == null) {
    return requestUrl;
  }

  const strippedUrl = requestUrl.replace(API_PREFIX_REGEX, "");
  return strippedUrl === "" ? "/" : strippedUrl;
};

const server = http.createServer((req, res) => {
  if (!hasApiPrefix(req.url)) {
    throw new Error(
      "Invalid proxy route. All requests must start with '/api'!",
    );
    // TODO @alain: here we will serve static files in prod
  }

  // normalize incoming api calls from the client (/api/* -> /*)
  req.url = stripApiPrefix(req.url);

  // handle preflight OPTIONS requests directly
  if (req.method === "OPTIONS") {
    setCorsHeaders(res, env.PROXY_ALLOWED_ORIGIN, req);
    res.writeHead(204);
    res.end();
    logRequest(req, 204);
    return;
  }

  // handle authorize requests
  if (req.url === "/authorize") {
    handleAuthorize(req, res, env);
    return;
  }

  // forward all other requests
  (req.url?.startsWith("/proctoring") ? proctorProxy : sebProxy).web(req, res);
});

server.listen(env.PROXY_PORT, () => {
  logInfo(`Proxy server running on port ${env.PROXY_PORT}`);
});
