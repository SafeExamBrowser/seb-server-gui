import http from "http";
import { setCorsHeaders } from "../utils/cors";
import { Env } from "../utils/env";
import { logError, logRequest } from "../utils/logger";
import { tokenResultSchema, FetchTokensResult } from "./types";

const OAUTH_PREFIX = "/oauth";
const ERROR_PREFIX = "[authorize]";

const sendJsonResponse = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  origin: string,
  status: number,
  data: unknown,
) => {
  setCorsHeaders(res, origin);
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
  logRequest(req, status);
};

const parseRequest = async (req: http.IncomingMessage) => {
  const method = req.method;

  if (!method) {
    logError(ERROR_PREFIX, "Request validation failed: Missing HTTP method");
    return undefined;
  }

  const contentType = req.headers["content-type"];

  if (!contentType) {
    logError(
      ERROR_PREFIX,
      "Request validation failed: Missing Content-Type header",
    );

    return undefined;
  }

  let body = "";

  for await (const chunk of req) {
    body += chunk;
  }

  if (!body) {
    logError(ERROR_PREFIX, "Request validation failed: Missing request body");

    return undefined;
  }

  return { method, contentType, body };
};

const fetchToken = ({
  url,
  port,
  username,
  password,
  method,
  contentType,
  body,
}: {
  url: string;
  port: number;
  username: string;
  password: string;
  method: string;
  contentType: string;
  body: string;
}) =>
  fetch(`${url}:${port}${OAUTH_PREFIX}/token`, {
    method,
    headers: {
      "Content-Type": contentType,
      Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
    },
    body,
  });

const fetchTokensFromBothServers = async (
  env: Env,
  requestData: { method: string; contentType: string; body: string },
): Promise<FetchTokensResult> => {
  const [sebServerResponse, proctorServerResponse] = await Promise.all([
    fetchToken({
      url: env.SEB_SERVER_URL,
      port: env.SEB_SERVER_PORT,
      username: env.SEB_SERVER_USERNAME,
      password: env.SEB_SERVER_PASSWORD,
      ...requestData,
    }),
    fetchToken({
      url: env.PROCTOR_SERVER_URL,
      port: env.PROCTOR_SERVER_PORT,
      username: env.PROCTOR_SERVER_USERNAME,
      password: env.PROCTOR_SERVER_PASSWORD,
      ...requestData,
    }),
  ]);

  if (!sebServerResponse.ok || !proctorServerResponse.ok) {
    const errors: string[] = [];

    if (!sebServerResponse.ok) {
      errors.push(
        `SEB Server: ${sebServerResponse.status} ${sebServerResponse.statusText}`,
      );
    }

    if (!proctorServerResponse.ok) {
      errors.push(
        `Proctor Server: ${proctorServerResponse.status} ${proctorServerResponse.statusText}`,
      );
    }

    return { status: "auth_error", errors };
  }

  const [sebData, proctorData] = await Promise.all([
    sebServerResponse.json(),
    proctorServerResponse.json(),
  ]);

  const sebTokenResult = tokenResultSchema.safeParse(sebData);
  const proctorTokenResult = tokenResultSchema.safeParse(proctorData);

  if (!sebTokenResult.success || !proctorTokenResult.success) {
    const errors: string[] = [];

    if (!sebTokenResult.success) {
      errors.push("SEB Server token validation failed");
    }

    if (!proctorTokenResult.success) {
      errors.push("Proctor Server token validation failed");
    }

    throw new Error(errors.join(", "));
  }

  return {
    status: "success",
    data: {
      sebServer: sebTokenResult.data,
      proctorServer: proctorTokenResult.data,
    },
  };
};

export const handleAuthorize = async (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  env: Env,
) => {
  const requestData = await parseRequest(req);

  if (!requestData) {
    return sendJsonResponse(req, res, env.PROXY_ALLOWED_ORIGIN, 400, {
      error: "Invalid request",
    });
  }

  try {
    const result = await fetchTokensFromBothServers(env, requestData);

    if (result.status === "auth_error") {
      return sendJsonResponse(req, res, env.PROXY_ALLOWED_ORIGIN, 401, {
        error: "Authorization failed",
        details: result.errors,
      });
    }

    sendJsonResponse(req, res, env.PROXY_ALLOWED_ORIGIN, 200, result.data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logError(ERROR_PREFIX, `Unexpected error: ${message}`);

    sendJsonResponse(req, res, env.PROXY_ALLOWED_ORIGIN, 500, {
      error: "A technical error occurred",
    });
  }
};
