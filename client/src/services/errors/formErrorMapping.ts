import type {
    APIMessage,
    AppError,
    BackendFieldAliasMap,
    BackendFieldErrorMap,
} from "@/services/errors/types.ts";
import { toAppError } from "@/services/errors/toAppError.ts";
import { getBackendFieldErrorText } from "@/services/errors/backendErrorText.ts";

export type BuildBackendFieldErrorMapResult = {
    fieldErrors: BackendFieldErrorMap;
    handledMessages: APIMessage[];
    unhandledMessages: APIMessage[];
    appError: AppError;
};

export type ApplyBackendErrorsResult = {
    fullyHandled: boolean;
    appError: AppError;
    unhandledMessages: APIMessage[];
};

export function buildBackendFieldErrorMap(
    error: unknown,
    options?: {
        aliases?: BackendFieldAliasMap;
        allowedFields?: string[];
    },
): BuildBackendFieldErrorMapResult {
    const appError = toAppError(error);
    const fieldErrors: BackendFieldErrorMap = {};
    const handledMessages: APIMessage[] = [];
    const unhandledMessages: APIMessage[] = [];

    if (appError.kind !== "backend") {
        return { fieldErrors, handledMessages, unhandledMessages, appError };
    }

    const aliases = options?.aliases ?? {};
    const allowedFields = options?.allowedFields;

    for (const fieldError of appError.fieldErrors) {
        const backendField = fieldError.backendField;
        if (!backendField) {
            unhandledMessages.push(fieldError.apiMessage);
            continue;
        }

        const frontendField = aliases[backendField] ?? backendField;
        if (allowedFields && !allowedFields.includes(frontendField)) {
            unhandledMessages.push(fieldError.apiMessage);
            continue;
        }

        const text = getBackendFieldErrorText({
            ...fieldError,
            frontendField,
        });
        const existing = fieldErrors[frontendField] ?? [];
        existing.push(text);
        fieldErrors[frontendField] = existing;
        handledMessages.push(fieldError.apiMessage);
    }

    for (const message of appError.globalMessages) {
        unhandledMessages.push(message);
    }

    return { fieldErrors, handledMessages, unhandledMessages, appError };
}

export function hasOnlyHandledFieldErrors(
    result: BuildBackendFieldErrorMapResult,
): boolean {
    if (result.handledMessages.length === 0) {
        return false;
    }
    if (
        result.appError.kind === "backend" &&
        result.appError.globalMessages.length > 0
    ) {
        return false;
    }
    const hasUnhandledFieldValidation = result.unhandledMessages.some(
        (message) => message.messageCode === "1200",
    );
    return !hasUnhandledFieldValidation;
}
