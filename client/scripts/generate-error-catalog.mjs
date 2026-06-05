/* global console, process */
// Generates a typed error-message catalogue from the committed OpenAPI spec, so the
// frontend never re-writes the backend's codes or messages. Source of truth:
//   - components.schemas.ErrorCode  (enum + x-enum-varnames + x-enum-descriptions)
//       -> APIMessage.ErrorMessage:  code -> name + system message
//   - x-field-validation-messages   (root extension)
//       -> messages.properties sebserver.form.validation.fieldError.*: rule -> message
// Run as part of `openapi:refresh` (after the spec is fetched).

import { readFile, writeFile } from "node:fs/promises";

const SPEC =
    process.env.OPENAPI_SPEC ??
    "./src/api/seb-server/openapi/seb-server.openapi.json";
const OUTPUT =
    process.env.ERROR_CATALOG_OUT ??
    "./src/api/seb-server/generated/error-catalog.ts";

const asRecord = (keys, values) =>
    Object.fromEntries(keys.map((key, index) => [key, values[index]]));

const tsObject = (entries) =>
    entries
        .map(
            ([key, value]) =>
                `    ${JSON.stringify(key)}: ${JSON.stringify(value)},`,
        )
        .join("\n");

const spec = JSON.parse(await readFile(SPEC, "utf8"));

const errorCode = spec.components?.schemas?.ErrorCode ?? {};
const codes = errorCode.enum ?? [];
const messages = errorCode["x-enum-descriptions"] ?? [];

const codeToMessage =
    messages.length === codes.length ? asRecord(codes, messages) : {};
const ruleMessages = spec["x-field-validation-messages"] ?? {};

// Record<string, string> (not `as const`): the handler looks these up by the wire
// `messageCode` / rule key, so a plain string-indexed map is what the consumers need.
const file = `// This file is auto-generated from the backend OpenAPI spec by
// scripts/generate-error-catalog.mjs. Do not edit — run \`npm run openapi:refresh\`.

// Backend APIMessage.ErrorMessage: messageCode -> system message.
export const errorCodeMessages: Record<string, string> = {
${tsObject(Object.entries(codeToMessage))}
};

// messages.properties sebserver.form.validation.fieldError.*: rule -> message.
export const fieldValidationMessages: Record<string, string> = {
${tsObject(Object.entries(ruleMessages))}
};
`;

await writeFile(OUTPUT, file);
console.log(
    `error-catalog: ${codes.length} codes, ${Object.keys(ruleMessages).length} field-validation rules -> ${OUTPUT}`,
);
