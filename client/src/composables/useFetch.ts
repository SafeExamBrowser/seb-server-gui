import { ref, computed } from "vue";
import type { AppError } from "@/services/errors/types.ts";
import { appErrorToMessage, toAppError } from "@/services/errors/toAppError.ts";

// TODO @alain: consider using https://tanstack.com/query/latest/docs/framework/vue/overview for this
export const useFetch = <T>(
    fetchFunction: () => Promise<T | null>,
    options?: { immediate?: boolean },
) => {
    const data = ref<T>();
    const loading = ref(false);
    const error = ref<AppError>();
    const errorMessage = computed(() =>
        error.value ? appErrorToMessage(error.value) : undefined,
    );

    const fetchData = async () => {
        loading.value = true;
        error.value = undefined;

        try {
            const response = await fetchFunction();

            if (response === null) {
                throw new Error("No data!");
            }

            data.value = response;
        } catch (err) {
            error.value = toAppError(err);
        } finally {
            loading.value = false;
        }
    };

    if (options?.immediate) {
        fetchData();
    }

    return {
        data,
        loading,
        error,
        errorMessage,
        fetchData,
    };
};
