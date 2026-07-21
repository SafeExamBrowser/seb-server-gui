import type { Ref } from "vue";

import type { ApplyBackendErrorsResult } from "@/services/errors/formErrorMapping.ts";
import type { AppError } from "@/services/errors/types.ts";
import { notify } from "@/services/notifications/notify.ts";

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
    } catch (thrown) {
        const result = applyErrors(thrown);
        if (!result?.fullyHandled) {
            notify.serverError(result?.appError ?? error.value, {
                contextLabel,
                onlyMessages: result?.unhandledMessages,
            });
        }
        return undefined;
    }
}
