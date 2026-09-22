import { ref } from "vue";

import i18n from "@/i18n";
import {
    getBackendMessageLines,
    getBackendMessageTitle,
    hasUntranslatableContent,
} from "@/services/errors/backendErrorText.ts";
import { formatErrorReport } from "@/services/errors/errorReport.ts";
import { markErrorHandled } from "@/services/errors/handledErrors.ts";
import { toAppError } from "@/services/errors/toAppError.ts";
import { transportErrorDedupeKey } from "@/services/errors/transport.ts";
import type { APIMessage, AppError } from "@/services/errors/types.ts";
import { copyToClipboard } from "@/utils/clipboard.ts";

export type NotificationKind =
    | "success"
    | "info"
    | "warning"
    | "client-error"
    | "server-error";

export type NotificationItem = {
    title?: string;
    text?: string;
    color?: string;
    prependIcon?: string;
    timerColor?: string;
    id: string;
    kind: NotificationKind;
    dedupeKey?: string;
    createdAt: number;
    actionLabel?: string;
    onAction?: () => void;
};

export type NotificationInput = {
    kind: NotificationKind;
    title?: string;
    text?: string;
    dedupeKey?: string;
    actionLabel?: string;
    onAction?: () => void;
};

export type BackendNotifyOptions = {
    contextLabel?: string;
    dedupeKey?: string;
    splitToasts?: boolean;
    titleOverride?: string;
    actionLabel?: string;
    onAction?: () => void;
    duration?: number;
    onlyMessages?: APIMessage[];
};

export type NotifyServerErrorResult = {
    ids: string[];
    title: string;
    lines: string[];
};

const DEDUPE_WINDOW_MS = 4_000;
const HARD_CAP = 20;
const recentDedupeKeys = new Map<string, number>();

export const notificationQueue = ref<NotificationItem[]>([]);

const severityProps: Record<
    NotificationKind,
    { color: string; prependIcon: string }
> = {
    success: { color: "success", prependIcon: "mdi-check-bold" },
    info: { color: "info", prependIcon: "mdi-information-outline" },
    warning: { color: "warning", prependIcon: "mdi-alert" },
    "client-error": { color: "error", prependIcon: "mdi-alert-circle" },
    "server-error": { color: "error", prependIcon: "mdi-alert-circle" },
};

function enqueue(input: NotificationInput): string {
    const id = crypto.randomUUID();
    const now = Date.now();

    if (input.dedupeKey) {
        const last = recentDedupeKeys.get(input.dedupeKey);
        if (last !== undefined && now - last < DEDUPE_WINDOW_MS) {
            return id;
        }
        recentDedupeKeys.set(input.dedupeKey, now);
    }

    const severity = severityProps[input.kind];
    notificationQueue.value.push({
        id,
        kind: input.kind,
        title: input.title,
        text: input.text,
        color: severity.color,
        prependIcon: severity.prependIcon,
        timerColor: severity.color,
        dedupeKey: input.dedupeKey,
        createdAt: now,
        actionLabel: input.actionLabel,
        onAction: input.onAction,
    });

    if (notificationQueue.value.length > HARD_CAP) {
        notificationQueue.value = notificationQueue.value.slice(-HARD_CAP);
    }

    return id;
}

function copyDetailsAction(
    error: AppError,
    opts: BackendNotifyOptions,
): Pick<NotificationInput, "actionLabel" | "onAction"> {
    if (opts.actionLabel || opts.onAction) {
        return { actionLabel: opts.actionLabel, onAction: opts.onAction };
    }
    if (!hasUntranslatableContent(error, opts.onlyMessages)) {
        return {};
    }
    const report = formatErrorReport(error);
    return {
        actionLabel: i18n.global.t("errors.backend.unexpected.copyAction"),
        onAction: () => {
            void copyToClipboard(report).then((copied) => {
                if (!copied) {
                    return;
                }
                enqueue({
                    kind: "success",
                    title: i18n.global.t("errors.backend.unexpected.copied"),
                });
            });
        },
    };
}

function severityForError(error: AppError): NotificationKind {
    if (error.kind === "rate-limit") {
        return "warning";
    }
    if (error.kind === "network") {
        return "server-error";
    }
    const status = error.status;
    if (status && status >= 500) {
        return "server-error";
    }
    if (status && status >= 400) {
        return "client-error";
    }
    return "server-error";
}

export const notify = {
    success(
        title: string,
        text?: string,
        opts?: Partial<NotificationInput>,
    ): string {
        return enqueue({ kind: "success", title, text, ...opts });
    },
    info(
        title: string,
        text?: string,
        opts?: Partial<NotificationInput>,
    ): string {
        return enqueue({ kind: "info", title, text, ...opts });
    },
    warning(
        title: string,
        text?: string,
        opts?: Partial<NotificationInput>,
    ): string {
        return enqueue({ kind: "warning", title, text, ...opts });
    },
    clientError(
        title: string,
        text?: string,
        opts?: Partial<NotificationInput>,
    ): string {
        return enqueue({ kind: "client-error", title, text, ...opts });
    },
    serverError(
        error: unknown,
        opts: BackendNotifyOptions = {},
    ): NotifyServerErrorResult {
        const appError = toAppError(error);
        markErrorHandled(appError);
        const title =
            opts.titleOverride ??
            getBackendMessageTitle(appError, {
                contextLabel: opts.contextLabel,
                method: appError.method,
                onlyMessages: opts.onlyMessages,
            });
        const lines = getBackendMessageLines(appError, opts.onlyMessages);
        const kind = severityForError(appError);
        const action = copyDetailsAction(appError, opts);
        // Transport-class failures (offline / 5xx / rate-limit) share a coarse
        // dedupe key, so the interceptor's toast, its deferred unhandled-error
        // fallback and a page reacting to the same failure collapse into a
        // single notification.
        const dedupeKey = opts.dedupeKey ?? transportErrorDedupeKey(appError);
        const ids: string[] = [];

        if (opts.splitToasts) {
            lines.forEach((line, index) => {
                ids.push(
                    enqueue({
                        kind,
                        title,
                        text: line,
                        dedupeKey: dedupeKey
                            ? `${dedupeKey}:${index}`
                            : undefined,
                        ...action,
                    }),
                );
            });
        } else {
            ids.push(
                enqueue({
                    kind,
                    title,
                    text: lines.join("\n"),
                    dedupeKey,
                    ...action,
                }),
            );
        }

        return { ids, title, lines };
    },
    clearAll(): void {
        notificationQueue.value = [];
        recentDedupeKeys.clear();
    },
};
