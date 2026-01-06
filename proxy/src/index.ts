import { createProxyServer } from "http-proxy-3";
import http from "http";
import { setCorsHeaders } from "./utils/cors";

const API_PREFIX = "/admin-api/v1";

const PROXY_PORT = process.env.PROXY_PORT;
const PROXY_ALLOWED_ORIGIN = process.env.PROXY_ALLOWED_ORIGIN;

const API_URL = process.env.SEB_SERVER_URL;
const API_PORT = process.env.SEB_SERVER_PORT;
const API_USER = process.env.SEB_SERVER_USERNAME;
const API_PASS = process.env.SEB_SERVER_PASSWORD;

if (
  !PROXY_PORT ||
  !PROXY_ALLOWED_ORIGIN ||
  !API_URL ||
  !API_PORT ||
  !API_USER ||
  !API_PASS
) {
  console.error(
    "Missing required environment variables: PROXY_PORT, PROXY_ALLOWED_ORIGIN, API_URL, API_PORT, API_USER, API_PASS"
  );
  process.exit(1);
}

const proxyConfig = createProxyServer({
  target: `${API_URL}:${API_PORT}${API_PREFIX}`,
  auth: `${API_USER}:${API_PASS}`, // TODO @alain: when exactly is this used? For the authentication request maybe?
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

  // TODO @alain: this should be set by the client already (I'm currently assuming that the API wants this for all GET requests)
  proxyReq.setHeader("Content-Type", "application/x-www-form-urlencoded");
});

proxyConfig.on("proxyRes", (_proxyRes, _req, res) => {
  setCorsHeaders(res, PROXY_ALLOWED_ORIGIN);
});

const server = http.createServer((req, res) => {
  // handle preflight OPTIONS requests directly
  if (req.method === "OPTIONS") {
    setCorsHeaders(res, PROXY_ALLOWED_ORIGIN);
    res.writeHead(204);
    res.end();
    return;
  }

  // forward all other requests
  proxyConfig.web(req, res);
});

server.listen(Number(PROXY_PORT), () => {
  console.log(`Proxy server running on port ${PROXY_PORT}`);
});
