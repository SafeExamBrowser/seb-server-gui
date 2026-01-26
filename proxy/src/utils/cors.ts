import http from "http";

export const setCorsHeaders = (
  res: http.ServerResponse,
  allowedOrigin: string,
): http.ServerResponse => {
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, importFile, importFilePassword",
  );

  return res;
};
