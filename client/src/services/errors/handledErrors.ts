import { toRaw } from "vue";

import { toAppErrorOrUndefined } from "@/services/errors/toAppError.ts";
import type { AppError } from "@/services/errors/types.ts";

const handledErrors = new WeakSet<AppError>();

export function markErrorHandled(error: unknown): void {
    const appError = toAppErrorOrUndefined(error);
    if (!appError) {
        return;
    }
    handledErrors.add(toRaw(appError));
}

export function isErrorHandled(error: AppError): boolean {
    return handledErrors.has(toRaw(error));
}
