import axios, { isAxiosError } from "axios";
import { z } from "zod";
import { zApiMessage } from "@/api/seb-server/generated/hey-api/zod.gen.ts";
import type { EntityProcessingReport } from "@/api/seb-server/generated/hey-api/types.gen.ts";
import { FIELD_VALIDATION_CODE } from "@/services/errors/apiMessage.ts";
import type {
    APIMessage,
    AppError,
    BackendFieldError,
} from "@/services/errors/types.ts";

const zApiMessageArray = z.array(zApiMessage);

export function isAppError(error: unknown): error is AppError {
    if (typeof error !== "object" || error === null) {
        return false;
    }
    if (!("kind" in error)) {
        return false;
    }
    const { kind } = error;
    return (
        kind === "backend" ||
        kind === "rate-limit" ||
        kind === "network" ||
        kind === "unknown"
    );
}

export function normalizeAPIMessages(payload: unknown): APIMessage[] {
    const raw = Array.isArray(payload) ? payload : [payload];
    const parsed = zApiMessageArray.safeParse(raw);
    return parsed.success ? parsed.data : [];
}

export function parseBackendFieldError(
    message: APIMessage,
): BackendFieldError | undefined {
    if (message.messageCode !== FIELD_VALIDATION_CODE) {
        return undefined;
    }
    const attributes = message.attributes ?? [];
    if (attributes.length < 3) {
        return undefined;
    }
    return {
        apiMessage: message,
        domain: attributes[0],
        backendField: attributes[1],
        rule: attributes[2],
        ruleParams: attributes.slice(3),
    };
}

function buildBackendAppError(
    messages: APIMessage[],
    context: { status?: number; method?: string; url?: string; raw: unknown },
): AppError {
    const fieldErrors: BackendFieldError[] = [];
    const globalMessages: APIMessage[] = [];
    for (const message of messages) {
        const fieldError = parseBackendFieldError(message);
        if (fieldError) {
            fieldErrors.push(fieldError);
            continue;
        }
        globalMessages.push(message);
    }
    return {
        kind: "backend",
        status: context.status,
        method: context.method,
        url: context.url,
        messages,
        fieldErrors,
        globalMessages,
        raw: context.raw,
    };
}

export function entityProcessingReportToAppError(
    report: EntityProcessingReport,
): AppError | undefined {
    const messages = normalizeAPIMessages(
        report.errors.map((entry) => entry.error_message),
    );
    if (messages.length === 0) {
        return undefined;
    }
    return buildBackendAppError(messages, { raw: report });
}

export function toAppError(error: unknown): AppError {
    if (isAppError(error)) {
        return error;
    }

    if (isAxiosError(error)) {
        const method = error.config?.method?.toUpperCase();
        const url = error.config?.url;
        const response = error.response;

        if (!response) {
            return {
                kind: "network",
                message: error.message || "Network error",
                method,
                url,
                raw: error,
            };
        }

        const status = response.status;
        const data: unknown = response.data;

        if (status === 429 && typeof data === "string") {
            return {
                kind: "rate-limit",
                status: 429,
                code: data,
                method,
                url,
                raw: error,
            };
        }

        const messages = normalizeAPIMessages(data);
        if (messages.length > 0) {
            return buildBackendAppError(messages, {
                status,
                method,
                url,
                raw: error,
            });
        }

        return {
            kind: "unknown",
            message: error.message || `Request failed with status ${status}`,
            status,
            method,
            url,
            raw: error,
        };
    }

    if (error instanceof Error) {
        return {
            kind: "unknown",
            message: error.message,
            raw: error,
        };
    }

    return {
        kind: "unknown",
        message: "Unknown error",
        raw: error,
    };
}

export function toAppErrorOrUndefined(error: unknown): AppError | undefined {
    if (!error || axios.isCancel(error)) {
        return undefined;
    }
    return toAppError(error);
}

export function errorMessageOf(error: unknown): string {
    return appErrorToMessage(toAppError(error));
}

export function appErrorToMessage(error: AppError): string {
    switch (error.kind) {
        case "backend": {
            const parts = error.messages
                .map(
                    (message) =>
                        message.systemMessage ||
                        message.details ||
                        message.messageCode,
                )
                .filter((part): part is string => Boolean(part));
            return parts.length > 0 ? parts.join(" — ") : "Request failed";
        }
        case "rate-limit":
            return "Too many requests. Please try again later.";
        case "network":
        case "unknown":
            return error.message;
    }
}
