import http from "http";

const ALLOWED_HEADERS_CERTIFICATE = [
  "importFile",
  "importFilePassword",
] as const;

const ALLOWED_HEADERS_MONITORING = [
  "show-all",
  "show-states",
  "show-client-groups",
  "show-indicators",
  "show-notifications",
] as const;

const requestToUrl = (req: http.IncomingMessage): URL =>
  new URL(req?.url ?? "/", "http://localhost");

export const setCorsHeaders = (
  res: http.ServerResponse,
  allowedOrigin: string,
  req: http.IncomingMessage,
): http.ServerResponse => {
  const pathname = requestToUrl(req).pathname;

  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    [
      "Content-Type",
      "Authorization",
      ...(pathname === "/certificate" ? [...ALLOWED_HEADERS_CERTIFICATE] : []),
      ...(pathname.startsWith("/monitoring/connections/")
        ? [...ALLOWED_HEADERS_MONITORING]
        : []),
    ].join(", "),
  );

  return res;
};
