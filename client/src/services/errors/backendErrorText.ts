import i18n from "@/i18n";
import type {
    APIMessage,
    AppError,
    BackendFieldError,
} from "@/services/errors/types.ts";

const translate = (key: string, params?: Record<string, unknown>): string =>
    i18n.global.t(key, params ?? {});

function translateFirst(
    keys: (string | undefined)[],
    params?: Record<string, unknown>,
): string | undefined {
    for (const key of keys) {
        if (!key) {
            continue;
        }
        const translated = translate(key, params);
        if (translated !== key) {
            return translated;
        }
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

function getObjectLabel(domain?: string): string | undefined {
    if (!domain) {
        return undefined;
    }
    return (
        translateFirst([`errors.backend.objects.${domain}._label`]) ??
        humanize(domain)
    );
}

function getFieldLabel(domain: string | undefined, field: string): string {
    const keys: (string | undefined)[] = [
        domain ? `errors.backend.objects.${domain}.fields.${field}` : undefined,
        `errors.backend.fields.${field}`,
    ];
    return translateFirst(keys) ?? humanize(field);
}

export function getBackendFieldErrorText(error: BackendFieldError): string {
    const { domain, backendField, rule, ruleParams } = error;
    const field = backendField ?? "";
    const fieldLabel = getFieldLabel(domain, field);

    const params: Record<string, unknown> = {
        field: fieldLabel,
        object: getObjectLabel(domain) ?? "",
        rule: rule ?? "",
    };
    ruleParams.forEach((value, index) => {
        params[index] = value;
        params[`param${index}`] = value;
    });

    if (rule) {
        const ruleLeaf = rule.includes(".")
            ? (rule.split(".").pop() ?? rule)
            : rule;
        const ruleText = translateFirst(
            [
                domain
                    ? `errors.backend.objects.${domain}.fields.${field}.rules.${rule}`
                    : undefined,
                domain
                    ? `errors.backend.objects.${domain}.rules.${rule}`
                    : undefined,
                `errors.backend.rules.${rule}`,
                `errors.backend.rules.${ruleLeaf}`,
            ],
            params,
        );
        if (ruleText) {
            return ruleText;
        }
    }

    return translate("errors.backend.fieldFallback", params);
}

function getApiMessageLine(message: APIMessage): string {
    const attributes = message.attributes ?? [];
    if (message.messageCode === "1200" && attributes.length >= 3) {
        return getBackendFieldErrorText({
            apiMessage: message,
            domain: attributes[0],
            backendField: attributes[1],
            rule: attributes[2],
            ruleParams: attributes.slice(3),
        });
    }

    const codeText = translateFirst([
        `errors.backend.code.${message.messageCode}`,
    ]);
    if (codeText) {
        return message.details ? `${codeText} (${message.details})` : codeText;
    }

    return translate("errors.backend.fallbackLine", {
        systemMessage: message.systemMessage ?? "",
        details: message.details ?? "",
    });
}

export function getBackendMessageTitle(
    error: AppError,
    context?: { contextLabel?: string; method?: string },
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
    if (error.kind === "unknown" && error.status !== undefined) {
        const statusTitle = translateFirst([
            `errors.backend.http.${error.status}`,
        ]);
        if (statusTitle) {
            return statusTitle;
        }
    }
    return translate("errors.backend.title.generic");
}

export function getBackendMessageLines(
    error: AppError,
    onlyMessages?: APIMessage[],
): string[] {
    if (error.kind === "backend") {
        const source =
            onlyMessages ??
            (error.globalMessages.length > 0
                ? error.globalMessages
                : error.messages);
        return source.map(getApiMessageLine);
    }
    if (error.kind === "rate-limit") {
        return [translate("errors.backend.rateLimit")];
    }
    return [error.message];
}
