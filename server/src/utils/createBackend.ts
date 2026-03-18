import { createProxyServer } from "http-proxy-3";
import { logRequest } from "./logger.js";
import type { Request, Response } from "express";

const prepareProxyRequest = ({
  req,
  defaultUrlPrefix,
  basicAuthUsername,
  basicAuthPassword,
}: {
  req: Request;
  defaultUrlPrefix: string;
  basicAuthUsername: string;
  basicAuthPassword: string;
}) => {
  if (req.url === "/oauth/token") {
    // /oauth/token requests are secured with basic auth
    req.headers.authorization = `Basic ${Buffer.from(`${basicAuthUsername}:${basicAuthPassword}`).toString("base64")}`;
    return req;
  }

  // all other requests are prefixed with the default url
  req.url = `${defaultUrlPrefix}${req.path}`;
  return req;
};

export const createBackend = ({
  baseUrl,
  defaultUrlPrefix,
  basicAuthUsername,
  basicAuthPassword,
}: {
  baseUrl: string;
  defaultUrlPrefix: string;
  basicAuthUsername: string;
  basicAuthPassword: string;
}) => {
  const proxy = createProxyServer({
    target: baseUrl,
  });

  proxy.on("proxyRes", (proxyRes, req) => {
    logRequest({
      method: req.method,
      url: `${baseUrl}${req.url ?? "/"}`,
      statusCode: proxyRes.statusCode,
    });
  });

  return {
    handleRequest: (req: Request, res: Response) => {
      proxy.web(
        prepareProxyRequest({
          req,
          defaultUrlPrefix: defaultUrlPrefix,
          basicAuthUsername: basicAuthUsername,
          basicAuthPassword: basicAuthPassword,
        }),
        res,
      );
    },
  };
};
