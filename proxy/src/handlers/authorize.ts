import http from "http";
import type { Env } from "../utils/env.js";
import { logError, logRequest } from "../utils/logger.js";
import { tokenResultSchema } from "./types.js";
import type { FetchTokensResult } from "./types.js";

const ERROR_PREFIX = "authorize";
const SEB_SERVER_NAME = "SEB Server";
const SPS_SERVER_NAME = "SPS Server";

const sendJsonResponse = (
  res: http.ServerResponse,
  status: number,
  data: unknown,
) => {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
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

const fetchToken = async ({
  serverName,
  baseURL,
  username,
  password,
  method,
  contentType,
  body,
}: {
  serverName: string;
  baseURL: URL;
  username: string;
  password: string;
  method: string;
  contentType: string;
  body: string;
}) => {
  try {
    return await fetch(new URL("/oauth/token", baseURL), {
      method,
      headers: {
        "Content-Type": contentType,
        Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
      },
      body,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`${serverName}: ${message}`);
  }
};

const fetchTokensFromBothServers = async (
  env: Env,
  requestData: { method: string; contentType: string; body: string },
): Promise<FetchTokensResult> => {
  const [sebServerResponse, proctorServerResponse] = await Promise.all([
    fetchToken({
      serverName: SEB_SERVER_NAME,
      baseURL: new URL(env.SEB_SERVER_URL),
      username: env.SEB_SERVER_USERNAME,
      password: env.SEB_SERVER_PASSWORD,
      ...requestData,
    }),
    fetchToken({
      serverName: SPS_SERVER_NAME,
      baseURL: new URL(env.PROCTOR_SERVER_URL),
      username: env.PROCTOR_SERVER_USERNAME,
      password: env.PROCTOR_SERVER_PASSWORD,
      ...requestData,
    }),
  ]);

  if (!sebServerResponse.ok || !proctorServerResponse.ok) {
    const errors: string[] = [];

    if (!sebServerResponse.ok) {
      errors.push(
        `${SEB_SERVER_NAME}: ${sebServerResponse.status} ${sebServerResponse.statusText}`,
      );
    }

    if (!proctorServerResponse.ok) {
      errors.push(
        `${SPS_SERVER_NAME}: ${proctorServerResponse.status} ${proctorServerResponse.statusText}`,
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
      errors.push(`${SEB_SERVER_NAME} token validation failed`);
    }

    if (!proctorTokenResult.success) {
      errors.push(`${SPS_SERVER_NAME} token validation failed`);
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
  const sebTokenUrl = new URL("/oauth/token", env.SEB_SERVER_URL);
  const proctorTokenUrl = new URL("/oauth/token", env.PROCTOR_SERVER_URL);
  const requestData = await parseRequest(req);

  if (!requestData) {
    logRequest({ method: req.method, url: sebTokenUrl, statusCode: 400 });
    logRequest({ method: req.method, url: proctorTokenUrl, statusCode: 400 });
    sendJsonResponse(res, 400, {
      error: "Invalid request",
    });

    return;
  }

  try {
    const result = await fetchTokensFromBothServers(env, requestData);

    if (result.status === "auth_error") {
      logRequest({ method: req.method, url: sebTokenUrl, statusCode: 401 });
      logRequest({ method: req.method, url: proctorTokenUrl, statusCode: 401 });
      sendJsonResponse(res, 401, {
        error: "Authorization failed",
        details: result.errors,
      });

      return;
    }

    logRequest({ method: req.method, url: sebTokenUrl, statusCode: 200 });
    logRequest({ method: req.method, url: proctorTokenUrl, statusCode: 200 });
    sendJsonResponse(res, 200, result.data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logError(ERROR_PREFIX, `Unexpected error: ${message}`);

    logRequest({ method: req.method, url: sebTokenUrl, statusCode: 500 });
    logRequest({ method: req.method, url: proctorTokenUrl, statusCode: 500 });
    sendJsonResponse(res, 500, {
      error: "A technical error occurred",
    });
  }
};
