import { ref } from "vue";

// TODO @alain: consider using https://tanstack.com/query/latest/docs/framework/vue/overview for this
export const useMutation = <TArgs extends unknown[], TResult = void>(
    mutationFunction: (...args: TArgs) => Promise<TResult>,
) => {
    const data = ref<TResult>();
    const loading = ref(false);
    const error = ref<string>();

    const mutateData = async (...args: TArgs) => {
        loading.value = true;
        error.value = undefined;

        try {
            data.value = await mutationFunction(...args);
        } catch (err) {
            error.value = err instanceof Error ? err.message : "Unknown error";
        } finally {
            loading.value = false;
        }
    };

    return {
        data,
        loading,
        error,
        mutateData,
    };
};
