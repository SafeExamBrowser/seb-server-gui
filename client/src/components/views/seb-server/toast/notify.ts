import {
    type AlertInput,
    useNotificationsStore,
} from "@/stores/seb-server/notificationstore";

import type { BackendErrorArray } from "@/components/views/seb-server/toast/backendError";

import i18n from "@/i18n";

import {
    buildBodyLines,
    dynamicTitle,
} from "@/components/views/seb-server/toast/backendBodyBuilder";
import { Composer } from "vue-i18n";

const { t } = ("global" in i18n ? i18n.global : i18n) as Composer;

type RawHttpError = unknown;

export interface BackendNotifyOptions {
    contextLabel?: string;
    dedupeKey?: string;
    splitToasts?: boolean;
    titleOverride?: string;

    actionLabel?: AlertInput["actionLabel"];
    onAction?: AlertInput["onAction"];
    duration?: AlertInput["duration"];
}

type PossibleHttpError = {
    isAxiosError?: boolean;
    response?: { status?: number; data?: unknown };
    config?: { data?: unknown; url?: string; method?: string };
    status?: number;
    code?: number;
    data?: unknown;
    payload?: unknown;
    requestBody?: unknown;
    sentBody?: unknown;
    url?: string;
    path?: string;
    method?: string;
};

function extractErrorParts(err: RawHttpError): {
    status?: number;
    payload?: unknown;
    sentBody?: unknown;
    url?: string;
    method?: string;
} {
    const anyErr = err as PossibleHttpError;

    if (anyErr?.isAxiosError) {
        return {
            status: anyErr.response?.status,
            payload: anyErr.response?.data,
            sentBody: anyErr.config?.data,
            url: anyErr.config?.url,
            method: anyErr.config?.method?.toUpperCase?.(),
        };
    }

    if (typeof anyErr === "object" && anyErr !== null) {
        const status = anyErr.status ?? anyErr.code;
        const payload = anyErr.data ?? anyErr.payload ?? anyErr.response;
        const sentBody = anyErr.requestBody ?? anyErr.sentBody;
        const url = anyErr.url ?? anyErr.path;
        const method = anyErr.method?.toUpperCase?.();
        if (status || payload)
            return { status, payload, sentBody, url, method };
    }

    if (Array.isArray(err)) return { payload: err };

    return {};
}

function backendTitle(
    status?: number,
    contextLabel?: string,
    override?: string,
    extras?: { method?: string; firstAttr?: string; url?: string },
): string {
    if (override) return override;

    const rawPath = contextLabel || extras?.url || "";
    const pathOnly = rawPath
        .toString()
        .replace(/^https?:\/\/[^/]+/i, "")
        .split("?")[0]
        .replace(/^\/+/, "");

    const method = (extras?.method || "").toLowerCase();
    const firstAttr = extras?.firstAttr;

    const candidates = [
        pathOnly && method ? `errors.backend.title.${pathOnly}.${method}` : "",
        pathOnly ? `errors.backend.title.${pathOnly}` : "",
        firstAttr && method
            ? `errors.backend.title.${firstAttr}.${method}`
            : "",
        firstAttr ? `errors.backend.title.${firstAttr}` : "",
    ].filter(Boolean);

    for (const k of candidates) {
        if (t(k) !== k) return t(k);
    }

    if (firstAttr) return dynamicTitle(extras?.method, firstAttr);
    if (pathOnly) {
        const entityFromPath = pathOnly.split("/")[0];
        return dynamicTitle(extras?.method, entityFromPath);
    }

    // final fallback: HTTP status text
    const statusKey = status ? `errors.backend.http.${status}` : "";
    return status && t(statusKey) !== statusKey
        ? t(statusKey)
        : t("errors.backend.http.500");
}

// ---------- public facade ----------
function store() {
    return useNotificationsStore();
}

export const notify = {
    success(title: string, text?: string, opts?: Partial<AlertInput>) {
        return store().success(title, text, opts);
    },
    info(title: string, text?: string, opts?: Partial<AlertInput>) {
        return store().info(title, text, opts);
    },
    warning(title: string, text?: string, opts?: Partial<AlertInput>) {
        return store().warning(title, text, opts);
    },
    clientError(title: string, text?: string, opts?: Partial<AlertInput>) {
        return store().clientError(title, text, opts);
    },

    serverError(err: RawHttpError, opts: BackendNotifyOptions = {}) {
        const n = store();
        const { status, payload, url, method } = extractErrorParts(err);

        const items: BackendErrorArray = Array.isArray(payload)
            ? (payload as BackendErrorArray)
            : [];
        const lines: string[] = [];
        const fieldErrors: Record<string, string[]> = {};

        if (items.length) {
            for (const it of items) {
                const built = buildBodyLines(it);
                const text = built.join("\n");
                lines.push(text);

                const field = it.details || (it.attributes?.[1] ?? "");
                if (field) (fieldErrors[field] ||= []).push(text);
            }
        } else {
            lines.push(
                t("errors.backend.fallbackLine", {
                    systemMessage: "Unexpected error",
                    details: status ?? "",
                }),
            );
        }

        const firstAttr = items[0]?.attributes?.[0];
        const title = backendTitle(
            status,
            opts.contextLabel,
            opts.titleOverride,
            { method, url, firstAttr },
        );

        if (opts.splitToasts) {
            lines.forEach((text, idx) =>
                n.serverError(title, text, {
                    dedupeKey: opts.dedupeKey
                        ? `${opts.dedupeKey}:${idx}`
                        : undefined,
                    duration: opts.duration ?? 10000,
                    actionLabel: opts.actionLabel,
                    onAction: opts.onAction,
                }),
            );
        } else {
            n.serverError(title, lines.join("\n\n"), {
                dedupeKey: opts.dedupeKey,
                duration: opts.duration ?? 10000,
                actionLabel: opts.actionLabel,
                onAction: opts.onAction,
            });
        }

        return { status, messages: lines, fieldErrors, raw: payload };
    },
};
