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

export const setCorsHeaders = (
  res: http.ServerResponse,
  allowedOrigin: string,
): http.ServerResponse => {
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  );

  // TODO @alain: allow additional headers only for the respective endpoints?
  res.setHeader(
    "Access-Control-Allow-Headers",
    `Content-Type, Authorization, ${ALLOWED_HEADERS_CERTIFICATE.join(", ")}, ${ALLOWED_HEADERS_MONITORING.join(", ")}`,
  );

  return res;
};
