import { ref, onMounted } from "vue";

// TODO @alain: this can become a generic composable that can be used across the project?
// TODO @alain: consider using https://tanstack.com/query/latest/docs/framework/vue/overview for this
export const useFetch = <T>(fetchFunction: () => Promise<T | null>) => {
    const data = ref<T>();
    const loading = ref(false);
    const error = ref<string>();

    const fetchData = async () => {
        loading.value = true;

        try {
            const response = await fetchFunction();

            if (response === null) {
                throw new Error("No data!");
            }

            data.value = response;
        } catch (err) {
            error.value = err instanceof Error ? err.message : "Unknown error";
        } finally {
            loading.value = false;
        }
    };

    onMounted(fetchData);

    return { data, loading, error };
};
