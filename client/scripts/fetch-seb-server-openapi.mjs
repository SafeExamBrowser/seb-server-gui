/* global console, fetch */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { format } from "prettier";
import { parseEnv } from "./env.mjs";

const OPENAPI_URL = parseEnv().SEB_SERVER_OPENAPI_URL;

// Must match the `input` in openapi-ts.config.ts.
const OUTPUT = resolve("src/api/seb-server/openapi/seb-server.openapi.json");

/** Strip every `format: int64` so generated TS uses `number` and Zod uses `z.number()`
 *  instead of drifting between `number` and `bigint`. Safe because all SEB Server ids
 *  fit in JavaScript's 53-bit safe integer range. */
const dropInt64Format = (value) => {
    if (Array.isArray(value)) {
        value.forEach(dropInt64Format);
        return;
    }
    if (value && typeof value === "object") {
        if (value.type === "integer" && value.format === "int64") {
            delete value.format;
        }
        Object.values(value).forEach(dropInt64Format);
    }
};

const response = await fetch(OPENAPI_URL, {
    headers: { Accept: "application/json" },
});

if (!response.ok) {
    throw new Error(
        `Failed to fetch SEB Server OpenAPI from ${OPENAPI_URL}: ${response.status} ${response.statusText}`,
    );
}

const spec = await response.json();
dropInt64Format(spec);

const formatted = await format(JSON.stringify(spec), {
    parser: "json",
    tabWidth: 4,
});

await mkdir(dirname(OUTPUT), { recursive: true });
await writeFile(OUTPUT, formatted);

const operationCount = Object.values(spec.paths ?? {}).reduce(
    (count, pathItem) =>
        count +
        Object.keys(pathItem).filter((method) =>
            ["delete", "get", "patch", "post", "put"].includes(method),
        ).length,
    0,
);

console.log(`Fetched ${OPENAPI_URL}`);
console.log(`Wrote ${OUTPUT} (${operationCount} operations)`);
