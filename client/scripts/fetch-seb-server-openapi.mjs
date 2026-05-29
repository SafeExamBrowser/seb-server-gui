/* global console, fetch, process */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { format } from "prettier";

import { transformSebServerSpec } from "./openapi/transformSebServerSpec.mjs";

const DEFAULT_OPENAPI_URL = "http://localhost:8080/v3/api-docs";
const OPENAPI_URL = process.env.SEB_SERVER_OPENAPI_URL ?? DEFAULT_OPENAPI_URL;

const RAW_OUTPUT = resolve(
    "src/api/seb-server/openapi/seb-server.openapi.json",
);
const USER_ACCOUNT_OUTPUT = resolve(
    "src/api/seb-server/openapi/seb-server.user-account.openapi.json",
);

const writeJson = async (path, value) => {
    await mkdir(dirname(path), { recursive: true });
    const formatted = await format(JSON.stringify(value), {
        parser: "json",
        tabWidth: 4,
    });
    await writeFile(path, formatted);
};

const response = await fetch(OPENAPI_URL, {
    headers: { Accept: "application/json" },
});

if (!response.ok) {
    throw new Error(
        `Failed to fetch SEB Server OpenAPI from ${OPENAPI_URL}: ${response.status} ${response.statusText}`,
    );
}

const rawSpec = await response.json();
const userAccountSpec = transformSebServerSpec(rawSpec);

await writeJson(RAW_OUTPUT, rawSpec);
await writeJson(USER_ACCOUNT_OUTPUT, userAccountSpec);

const operationCount = Object.values(userAccountSpec.paths).reduce(
    (count, pathItem) =>
        count +
        Object.keys(pathItem).filter((method) =>
            ["delete", "get", "patch", "post", "put"].includes(method),
        ).length,
    0,
);

console.log(`Fetched ${OPENAPI_URL}`);
console.log(`Wrote ${RAW_OUTPUT}`);
console.log(
    `Wrote ${USER_ACCOUNT_OUTPUT} with ${operationCount} User Account operations`,
);
