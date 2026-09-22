import { isErrorHandled } from "@/services/errors/handledErrors.ts";
import { transportErrorDedupeKey } from "@/services/errors/transport.ts";
import type { AppError } from "@/services/errors/types.ts";
import { notify } from "@/services/notifications/notify.ts";

const WRITE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export const UNHANDLED_ERROR_GRACE_MS = 500;

function statusOf(error: AppError): number | undefined {
    return "status" in error ? error.status : undefined;
}

export function needsUnhandledFallback(
    error: AppError,
    skipToast: boolean,
): boolean {
    if (skipToast) {
        return false;
    }
    if (!error.method || !WRITE_METHODS.has(error.method)) {
        return false;
    }
    if (statusOf(error) === 401) {
        return false;
    }
    return transportErrorDedupeKey(error) === undefined;
}

function unhandledDedupeKey(error: AppError): string {
    const status = statusOf(error) ?? "none";
    if (error.kind !== "backend") {
        return `unhandled:${status}`;
    }
    const codes = error.messages.map((message) => message.messageCode);
    return `unhandled:${status}:${codes.join(",")}`;
}

export function scheduleUnhandledErrorToast(error: AppError): void {
    setTimeout(() => {
        if (isErrorHandled(error)) {
            return;
        }
        notify.serverError(error, { dedupeKey: unhandledDedupeKey(error) });
    }, UNHANDLED_ERROR_GRACE_MS);
}
