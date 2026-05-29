/* global URL, process */

import { readFile, writeFile } from "node:fs/promises";

const ADMIN_API_PREFIX = "/admin-api/v1";

const USER_ACCOUNT_OPERATIONS = new Map([
    ["/register", new Set(["post"])],
    ["/useraccount", new Set(["get", "post", "put"])],
    ["/useraccount/me", new Set(["get"])],
    ["/useraccount/password", new Set(["put"])],
    ["/useraccount/supervisors", new Set(["get"])],
    ["/useraccount/logout", new Set(["post"])],
    ["/useraccount/{modelId}", new Set(["get", "delete"])],
    ["/useraccount/{modelId}/active", new Set(["post"])],
    ["/useraccount/{modelId}/inactive", new Set(["post"])],
]);

const OPERATION_ID_FALLBACKS = {
    "get /useraccount": "getUserAccounts",
    "put /useraccount": "editUserAccount",
    "post /useraccount": "createUserAccount",
    "get /useraccount/{modelId}": "getUserAccountById",
    "delete /useraccount/{modelId}": "deleteUserAccount",
    "post /useraccount/{modelId}/active": "activateUserAccount",
    "post /useraccount/{modelId}/inactive": "deactivateUserAccount",
    "get /useraccount/supervisors": "getSupervisorNames",
    "post /useraccount/logout": "logUserAccountLogout",
};

const USER_ACCOUNT_FILTER_PARAMETERS = [
    {
        name: "surname",
        in: "query",
        required: false,
        schema: { type: "string" },
    },
    {
        name: "active",
        in: "query",
        required: false,
        schema: { type: "string" },
    },
];

const ALWAYS_INCLUDED_SCHEMAS = ["APIMessage"];

const HTTP_METHODS = new Set([
    "delete",
    "get",
    "head",
    "options",
    "patch",
    "post",
    "put",
    "trace",
]);

const clone = (value) => JSON.parse(JSON.stringify(value));

const normalizeSchema = (value) => {
    if (Array.isArray(value)) {
        value.forEach(normalizeSchema);
        return value;
    }

    if (value === null || typeof value !== "object") {
        return value;
    }

    if (value.type === "integer" && value.format === "int64") {
        delete value.format;
    }

    if (value.type === "array" && value.items) {
        delete value.anyOf;
        delete value.oneOf;
    }

    Object.values(value).forEach(normalizeSchema);
    return value;
};

const withoutAdminPrefix = (path) =>
    path.startsWith(ADMIN_API_PREFIX)
        ? path.slice(ADMIN_API_PREFIX.length) || "/"
        : path;

const isSelectedOperation = (path, method) =>
    USER_ACCOUNT_OPERATIONS.get(path)?.has(method) === true;

const schemaForParameter = (parameter) => {
    if (parameter.name === "institutionId") {
        return { type: "integer" };
    }

    if (parameter.in === "path" || parameter.name === "modelId") {
        return { type: "string" };
    }

    return { type: "string" };
};

const normalizeParameter = (parameter) => {
    if (parameter.name === "formParams" || parameter.name === "filterCriteria") {
        return undefined;
    }

    const normalized = clone(parameter);
    if (normalized.in === "path") {
        normalized.required = true;
    }

    if (!normalized.schema && !normalized.content) {
        normalized.schema = schemaForParameter(normalized);
    }

    return normalizeSchema(normalized);
};

const mergeParameter = (parameters, parameter) => {
    const index = parameters.findIndex(
        (existing) =>
            existing.name === parameter.name && existing.in === parameter.in,
    );

    if (index >= 0) {
        parameters[index] = {
            ...parameters[index],
            ...parameter,
        };
        return;
    }

    parameters.push(parameter);
};

const normalizeOperation = (path, method, operation) => {
    const normalized = clone(operation);
    delete normalized.security;

    const fallbackOperationId =
        OPERATION_ID_FALLBACKS[`${method} ${path}`] ??
        OPERATION_ID_FALLBACKS[`${method} ${withoutAdminPrefix(path)}`];

    if (fallbackOperationId) {
        normalized.operationId = fallbackOperationId;
    }

    const parameters = (normalized.parameters ?? [])
        .map(normalizeParameter)
        .filter(Boolean);

    if (path === "/useraccount" && method === "get") {
        USER_ACCOUNT_FILTER_PARAMETERS.forEach((parameter) =>
            mergeParameter(parameters, parameter),
        );
    }

    if (parameters.length > 0) {
        normalized.parameters = parameters;
    } else {
        delete normalized.parameters;
    }

    return normalizeSchema(normalized);
};

const normalizePathItem = (path, pathItem) => {
    const selectedPathItem = {};

    for (const [key, value] of Object.entries(pathItem)) {
        if (!HTTP_METHODS.has(key)) {
            selectedPathItem[key] = clone(value);
            continue;
        }

        if (!isSelectedOperation(path, key)) {
            continue;
        }

        selectedPathItem[key] = normalizeOperation(path, key, value);
    }

    return selectedPathItem;
};

const collectRefs = (value, refs) => {
    if (Array.isArray(value)) {
        value.forEach((item) => collectRefs(item, refs));
        return;
    }

    if (value === null || typeof value !== "object") {
        return;
    }

    if (
        typeof value.$ref === "string" &&
        value.$ref.startsWith("#/components/")
    ) {
        refs.add(value.$ref);
    }

    Object.values(value).forEach((item) => collectRefs(item, refs));
};

const parseComponentRef = (ref) => {
    const [, , componentType, ...nameParts] = ref.split("/");
    if (!componentType || nameParts.length === 0) {
        return undefined;
    }

    return {
        componentType,
        name: decodeURIComponent(nameParts.join("/")),
    };
};

const copyComponent = (
    sourceComponents,
    selectedSpec,
    componentType,
    name,
    refs,
) => {
    const sourceComponent = sourceComponents?.[componentType]?.[name];
    if (!sourceComponent) {
        return;
    }

    selectedSpec.components ??= {};
    selectedSpec.components[componentType] ??= {};
    if (selectedSpec.components[componentType][name]) {
        return;
    }

    const component = normalizeSchema(clone(sourceComponent));
    selectedSpec.components[componentType][name] = component;
    collectRefs(component, refs);
};

const copyReferencedComponents = (sourceComponents, selectedSpec) => {
    if (!sourceComponents) {
        return;
    }

    const refs = new Set();
    collectRefs(selectedSpec.paths, refs);

    ALWAYS_INCLUDED_SCHEMAS.forEach((schemaName) =>
        copyComponent(
            sourceComponents,
            selectedSpec,
            "schemas",
            schemaName,
            refs,
        ),
    );

    for (const ref of refs) {
        const parsed = parseComponentRef(ref);
        if (!parsed) {
            continue;
        }

        copyComponent(
            sourceComponents,
            selectedSpec,
            parsed.componentType,
            parsed.name,
            refs,
        );
    }

    if (
        selectedSpec.components &&
        Object.keys(selectedSpec.components).length === 0
    ) {
        delete selectedSpec.components;
    }
};

export const transformSebServerSpec = (spec) => {
    const selectedSpec = {
        openapi: spec.openapi,
        info: spec.info,
        servers: [{ url: "" }],
        paths: {},
    };

    for (const [sourcePath, pathItem] of Object.entries(spec.paths ?? {})) {
        const normalizedPath = withoutAdminPrefix(sourcePath);
        if (!USER_ACCOUNT_OPERATIONS.has(normalizedPath)) {
            continue;
        }

        const selectedPathItem = normalizePathItem(normalizedPath, pathItem);
        if (
            Object.keys(selectedPathItem).some((key) => HTTP_METHODS.has(key))
        ) {
            selectedSpec.paths[normalizedPath] = selectedPathItem;
        }
    }

    copyReferencedComponents(spec.components, selectedSpec);
    return selectedSpec;
};

if (process.argv[1] === new URL(import.meta.url).pathname) {
    const [, , inputPath, outputPath] = process.argv;
    if (!inputPath || !outputPath) {
        throw new Error(
            "Usage: node scripts/openapi/transformSebServerSpec.mjs <input> <output>",
        );
    }

    const spec = JSON.parse(await readFile(inputPath, "utf8"));
    const transformed = transformSebServerSpec(spec);
    await writeFile(outputPath, `${JSON.stringify(transformed, null, 2)}\n`);
}
