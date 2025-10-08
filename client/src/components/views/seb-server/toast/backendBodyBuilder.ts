import i18n from "@/i18n";
import type { BackendError } from "@/components/views/seb-server/toast/backendError";

const { t } = (i18n as any).global || i18n;

function humanize(id?: string) {
    if (!id) return "";
    return id
        .replace(/[-_]+/g, " ")
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (m) => m.toUpperCase());
}

export function parseAttributes(attrs?: string[]) {
    if (!attrs || attrs.length === 0) return {};
    const [entity, field, last] = [attrs[0], attrs[1], attrs[2]];
    const code = last?.split(".").pop();
    return { entity, field, code };
}

function resolveObjectLabel(entity?: string) {
    if (!entity) return "";
    const key = `errors.backend.objects.${entity}._label`;
    return t(key) !== key ? t(key) : humanize(entity);
}

function resolveFieldLabel(entity?: string, field?: string) {
    if (!field) return "";
    if (entity) {
        const scopedKey = `errors.backend.objects.${entity}.${field}`;
        if (t(scopedKey) !== scopedKey) return t(scopedKey);
    }
    const globalKey = `errors.backend.fields.${field}`;
    if (t(globalKey) !== globalKey) return t(globalKey);
    return humanize(field);
}

function lineForRule(code?: string, fieldLabel?: string) {
    if (!code) return "";
    const i18nKey = `errors.backend.rules.${code}`;
    const field = fieldLabel || "Field";
    if (t(i18nKey) !== i18nKey) {
        return t(i18nKey, { field });
    }
    // generic fallbacks
    switch (code) {
        case "notunique":
            return `${field} is already being used.`;
        case "required":
            return `${field} is required.`;
        case "invalid":
            return `${field} is invalid.`;
        case "minlength":
            return `${field} is too short.`;
        case "maxlength":
            return `${field} is too long.`;
        case "pattern":
            return `${field} has an invalid format.`;
        default:
            return `${field}: ${code}`;
    }
}

function codeLine(
    messageCode?: string,
    systemMessage?: string,
    details?: string,
) {
    if (!messageCode) {
        return systemMessage
            ? `${systemMessage}${details ? ` — ${details}` : ""}`
            : details || "Unexpected error";
    }
    const key = `errors.backend.code.${messageCode}`;
    if (t(key) !== key) return t(key);
    if (systemMessage)
        return details ? `${systemMessage} — ${details}` : systemMessage;
    return details || "Unexpected error";
}

export function dynamicTitle(method?: string, entity?: string): string {
    const entityLabel =
        resolveObjectLabel(entity) || humanize(entity) || "Item";
    const m = (method || "").toLowerCase();

    const keyed = (key: string, fallback: string) =>
        t(key, { entity: entityLabel }) !== key
            ? t(key, { entity: entityLabel })
            : fallback;

    switch (m) {
        case "post":
            return `Error ${keyed("errors.backend.title.create", `Creating ${entityLabel}`)}`;
        case "put":
        case "patch":
            return `Error ${keyed("errors.backend.title.update", `Updating ${entityLabel}`)}`;
        case "delete":
            return `Error ${keyed("errors.backend.title.delete", `Deleting ${entityLabel}`)}`;
        case "get":
            return `Error ${keyed("errors.backend.title.fetch", `Fetching ${entityLabel}`)}`;
        default:
            return `Error ${entityLabel}`;
    }
}

export function buildBodyLines(item: BackendError): string[] {
    const first = codeLine(item.messageCode, item.systemMessage, item.details);

    const { entity, field, code } = parseAttributes(item.attributes);
    const fieldLabel = resolveFieldLabel(entity, field);
    const ruleLine = lineForRule(code, fieldLabel);

    if (ruleLine) return [first, ruleLine];

    if (fieldLabel && code) return [first, `${fieldLabel} — ${code}`];
    if (item.attributes?.length) return [first, item.attributes.join(" · ")];
    if (item.details) return [first, item.details];

    return [first];
}
