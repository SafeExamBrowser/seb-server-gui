import { ref, computed } from "vue";
import type { AppError } from "@/services/errors/types.ts";
import { appErrorToMessage, toAppError } from "@/services/errors/toAppError.ts";

// TODO @alain: consider using https://tanstack.com/query/latest/docs/framework/vue/overview for this
export const useMutation = <TArgs extends unknown[], TResult = void>(
    mutationFunction: (...args: TArgs) => Promise<TResult>,
) => {
    const data = ref<TResult>();
    const loading = ref(false);
    const error = ref<AppError>();
    const errorMessage = computed(() =>
        error.value ? appErrorToMessage(error.value) : undefined,
    );

    const mutateData = async (...args: TArgs): Promise<TResult | undefined> => {
        loading.value = true;
        error.value = undefined;

        try {
            const result = await mutationFunction(...args);
            data.value = result;
            return result;
        } catch (err) {
            error.value = toAppError(err);
            return undefined;
        } finally {
            loading.value = false;
        }
    };

    return {
        data,
        loading,
        error,
        errorMessage,
        mutateData,
    };
};
