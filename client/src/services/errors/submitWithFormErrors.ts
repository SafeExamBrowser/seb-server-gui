import type { Ref } from "vue";
import { notify } from "@/services/notifications/notify.ts";
import type { AppError } from "@/services/errors/types.ts";
import type { ApplyBackendErrorsResult } from "@/services/errors/formErrorMapping.ts";

export type SubmitWithFormErrorsOptions<T> = {
    run: () => Promise<T>;
    applyErrors: (error: unknown) => ApplyBackendErrorsResult | undefined;
    error: Readonly<Ref<AppError | undefined>>;
    contextLabel: string;
};

export async function submitWithFormErrors<T>({
    run,
    applyErrors,
    error,
    contextLabel,
}: SubmitWithFormErrorsOptions<T>): Promise<T | undefined> {
    try {
        return await run();
    } catch {
        const result = applyErrors(error.value);
        if (!result?.fullyHandled) {
            notify.serverError(result?.appError ?? error.value, {
                contextLabel,
                onlyMessages: result?.unhandledMessages,
            });
        }
        return undefined;
    }
}
