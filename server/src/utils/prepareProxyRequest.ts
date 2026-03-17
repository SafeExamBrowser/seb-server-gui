import type { Request } from "express";

export const prepareProxyRequest = ({
  req,
  defaultUrl,
  basicAuthUsername,
  basicAuthPassword,
}: {
  req: Request;
  defaultUrl: string;
  basicAuthUsername: string;
  basicAuthPassword: string;
}) => {
  if (req.url === "/oauth/token") {
    // /oauth/token requests are secured with basic auth
    req.headers.authorization = `Basic ${Buffer.from(`${basicAuthUsername}:${basicAuthPassword}`).toString("base64")}`;
    return req;
  }

  // all other requests are prefixed with the default url
  req.url = `${defaultUrl}${req.path}`;
  return req;
};
