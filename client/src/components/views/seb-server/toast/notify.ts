import {
    useNotificationsStore,
    type AlertInput,
} from "@/stores/seb-server/notificationstore";
import type {
    BackendErrorArray,
    BackendError,
} from "@/components/views/seb-server/toast/backendError";
import i18n from "@/i18n";

const { t } = (i18n as any).global || i18n;

type RawHttpError = unknown;

// Backend error specific type
export interface BackendNotifyOptions {
    // Context label
    contextLabel?: string;
    // deduplication key in case a user for example spams a button
    dedupeKey?: string;
    // Split Toasts or not for an endpoint that might return multiple errors
    splitToasts?: boolean;
    // forces a specific title, otherwise the title is translated based on the error code
    titleOverride?: string;

    //values that normal notifications get
    actionLabel?: AlertInput["actionLabel"];
    onAction?: AlertInput["onAction"];
    duration?: AlertInput["duration"];
}

function extractErrorParts(err: RawHttpError): {
    status?: number;
    payload?: unknown;
    sentBody?: unknown;
} {
    const anyErr = err as any;

    // Axios
    if (anyErr?.isAxiosError) {
        return {
            status: anyErr.response?.status,
            payload: anyErr.response?.data,
            sentBody: anyErr.config?.data,
        };
    }

    if (typeof anyErr === "object" && anyErr !== null) {
        const status = anyErr.status ?? anyErr.code;
        const payload = anyErr.data ?? anyErr.payload ?? anyErr.response;
        const sentBody = anyErr.requestBody ?? anyErr.sentBody;
        if (status || payload) return { status, payload, sentBody };
    }

    if (Array.isArray(err)) return { payload: err };

    return {};
}

function backendLine(item: BackendError): string {
    const attrs = item.attributes ?? [];
    const keyFromAttrs = attrs.length
        ? `errors.backend.${attrs.join(".")}`
        : "";

    if (keyFromAttrs && t(keyFromAttrs) !== keyFromAttrs) {
        return t(keyFromAttrs);
    }

    const keyFromCode = `errors.backend.code.${item.messageCode}`;
    if (t(keyFromCode) !== keyFromCode) {
        return t(keyFromCode);
    }

    return t("errors.backend.fallbackLine", {
        systemMessage: item.systemMessage ?? "Error",
        details: item.details ?? "",
    });
}

function backendTitle(
    status?: number,
    contextLabel?: string,
    override?: string,
): string {
    if (override) return override;

    const statusKey = status ? `errors.backend.http.${status}` : "";
    const statusText =
        status && t(statusKey) !== statusKey
            ? t(statusKey)
            : t("errors.backend.http.500");

    return contextLabel ? `${statusText} — ${contextLabel}` : statusText;
}

// ---------- public facade (use same notify method for all types of alerts) ----------
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
        const { status, payload } = extractErrorParts(err);

        const items: BackendErrorArray = Array.isArray(payload)
            ? (payload as BackendErrorArray)
            : [];
        const lines: string[] = [];
        const fieldErrors: Record<string, string[]> = {};

        if (items.length) {
            for (const it of items) {
                const line = backendLine(it);
                lines.push(line);

                const field = it.details || (it.attributes?.[1] ?? "");
                if (field) (fieldErrors[field] ||= []).push(line);
            }
        } else {
            lines.push(
                t("errors.backend.fallbackLine", {
                    systemMessage: "Unexpected error",
                    details: status ?? "",
                }),
            );
        }

        const title = backendTitle(
            status,
            opts.contextLabel,
            opts.titleOverride,
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
            n.serverError(title, lines.join("\n"), {
                dedupeKey: opts.dedupeKey,
                duration: opts.duration ?? 10000,
                actionLabel: opts.actionLabel,
                onAction: opts.onAction,
            });
        }

        return { status, messages: lines, fieldErrors, raw: payload };
    },
};
