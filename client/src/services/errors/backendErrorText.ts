import { ErrorCode } from "@/api/seb-server/generated/hey-api/types.gen.ts";
import i18n from "@/i18n";
import { parseBackendFieldError } from "@/services/errors/toAppError.ts";
import type {
    APIMessage,
    AppError,
    BackendFieldError,
} from "@/services/errors/types.ts";

export const ERROR_CODE_NAMES: Record<string, string> = Object.fromEntries(
    Object.entries(ErrorCode).map(([name, code]) => [code, name]),
);

type BackendError = Extract<AppError, { kind: "backend" }>;

const translate = (
    key: string,
    params?: Record<string, unknown> | string[],
): string =>
    Array.isArray(params)
        ? i18n.global.t(key, params)
        : i18n.global.t(key, params ?? {});

function translateFirst(
    keys: (string | undefined)[],
    params?: Record<string, unknown> | string[],
): string | undefined {
    for (const key of keys) {
        if (!key || !i18n.global.te(key)) {
            continue;
        }
        return translate(key, params);
    }
    return undefined;
}

function humanize(value: string): string {
    const spaced = value
        .replace(/[_.]+/g, " ")
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .trim();
    if (!spaced) {
        return value;
    }
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function getFieldLabel(domain: string | undefined, field: string): string {
    const keys: (string | undefined)[] = [
        domain ? `errors.backend.objects.${domain}.fields.${field}` : undefined,
        `errors.backend.fields.${field}`,
    ];
    return translateFirst(keys) ?? humanize(field);
}

// validation rule names contain dots ("email.notunique"), which vue-i18n
// treats as path separators — the keys are stored dash-separated instead.
const validationMessageKey = (rule: string): string =>
    `errors.backend.validation.${rule.replace(/\./g, "-")}`;

function translateBackendFieldError(
    error: BackendFieldError,
): string | undefined {
    const { backendField, rule, ruleParams } = error;
    const field = backendField ?? "";
    const candidates = rule
        ? [`${field}.${rule}`, `${rule}.${ruleParams[0] ?? ""}`, rule]
        : [];
    return translateFirst(
        candidates.map(validationMessageKey),
        error.apiMessage.attributes ?? [],
    );
}

export function getBackendFieldErrorText(error: BackendFieldError): string {
    return (
        translateBackendFieldError(error) ??
        translate("errors.backend.fieldFallback", {
            field: getFieldLabel(error.domain, error.backendField ?? ""),
            rule: error.rule ?? "",
        })
    );
}

function translateApiMessage(message: APIMessage): string | undefined {
    const fieldError = parseBackendFieldError(message);
    if (fieldError) {
        return translateBackendFieldError(fieldError);
    }

    const codeName = ERROR_CODE_NAMES[message.messageCode];
    const codeText = codeName
        ? translateFirst([`errors.backend.codes.${codeName}`])
        : undefined;
    if (!codeText) {
        return undefined;
    }
    return message.details ? `${codeText} (${message.details})` : codeText;
}

export function isApiMessageTranslatable(message: APIMessage): boolean {
    return translateApiMessage(message) !== undefined;
}

function backendMessageSource(
    error: BackendError,
    onlyMessages?: APIMessage[],
): APIMessage[] {
    return (
        onlyMessages ??
        (error.globalMessages.length > 0
            ? error.globalMessages
            : error.messages)
    );
}

export function hasUntranslatableContent(
    error: AppError,
    onlyMessages?: APIMessage[],
): boolean {
    if (error.kind === "backend") {
        return backendMessageSource(error, onlyMessages).some(
            (message) => !isApiMessageTranslatable(message),
        );
    }
    return error.kind === "unknown";
}

function serverStatusTitle(status: number | undefined): string | undefined {
    if (status === undefined || status < 500) {
        return undefined;
    }
    return translateFirst([`errors.backend.http.${status}`]);
}

export function getBackendMessageTitle(
    error: AppError,
    context?: {
        contextLabel?: string;
        method?: string;
        onlyMessages?: APIMessage[];
    },
): string {
    const contextLabel = context?.contextLabel;
    const method = context?.method?.toLowerCase();
    if (contextLabel) {
        const contextTitle = translateFirst([
            method
                ? `errors.backend.title.${contextLabel}.${method}`
                : undefined,
            `errors.backend.title.${contextLabel}`,
        ]);
        if (contextTitle) {
            return contextTitle;
        }
    }

    if (error.kind === "backend") {
        const source = backendMessageSource(error, context?.onlyMessages);
        if (!source.some(isApiMessageTranslatable)) {
            return (
                serverStatusTitle(error.status) ??
                translate("errors.backend.unexpected.title")
            );
        }
        const onlyFieldErrors =
            error.fieldErrors.length > 0 && error.globalMessages.length === 0;
        if (onlyFieldErrors) {
            return translate("errors.backend.title.validation");
        }
        const statusTitle = error.status
            ? translateFirst([`errors.backend.http.${error.status}`])
            : undefined;
        return statusTitle ?? translate("errors.backend.title.generic");
    }
    if (error.kind === "rate-limit") {
        return (
            translateFirst(["errors.backend.http.429"]) ??
            translate("errors.backend.title.generic")
        );
    }
    if (error.kind === "network") {
        return translate("errors.backend.network.title");
    }
    return (
        serverStatusTitle(error.status) ??
        translate("errors.backend.unexpected.title")
    );
}

export function getBackendMessageLines(
    error: AppError,
    onlyMessages?: APIMessage[],
): string[] {
    if (error.kind === "backend") {
        const lines = backendMessageSource(error, onlyMessages).map(
            (message) =>
                translateApiMessage(message) ??
                translate("errors.backend.unexpected.text"),
        );
        return [...new Set(lines)];
    }
    if (error.kind === "rate-limit") {
        return [translate("errors.backend.rateLimit")];
    }
    if (error.kind === "network") {
        return [translate("errors.backend.network.text")];
    }
    return [translate("errors.backend.unexpected.text")];
}
