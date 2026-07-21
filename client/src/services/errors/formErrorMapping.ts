import { FIELD_VALIDATION_CODE } from "@/services/errors/apiMessage.ts";
import { getBackendFieldErrorText } from "@/services/errors/backendErrorText.ts";
import { toAppError } from "@/services/errors/toAppError.ts";
import type {
    APIMessage,
    AppError,
    BackendFieldAliasMap,
    BackendFieldErrorMap,
} from "@/services/errors/types.ts";

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

export type BackendErrorForm = {
    setBackendErrors: (errors: BackendFieldErrorMap) => void;
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

export function applyBackendFieldErrors(
    error: unknown,
    options: {
        aliases?: BackendFieldAliasMap;
        forms: { form: BackendErrorForm | undefined; fields: string[] }[];
    },
): ApplyBackendErrorsResult {
    const allowedFields = options.forms.flatMap((group) => group.fields);
    const result = buildBackendFieldErrorMap(error, {
        aliases: options.aliases,
        allowedFields,
    });

    for (const group of options.forms) {
        const groupMap: BackendFieldErrorMap = {};
        for (const fieldName of group.fields) {
            const messages = result.fieldErrors[fieldName];
            if (messages && messages.length > 0) {
                groupMap[fieldName] = messages;
            }
        }
        group.form?.setBackendErrors(groupMap);
    }

    return {
        fullyHandled: hasOnlyHandledFieldErrors(result),
        appError: result.appError,
        unhandledMessages: result.unhandledMessages,
    };
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
        (message) => message.messageCode === FIELD_VALIDATION_CODE,
    );
    return !hasUnhandledFieldValidation;
}
