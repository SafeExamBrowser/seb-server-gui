import { ref, onMounted } from "vue";

type SebClientTemplate = {
    id: string;
    name: string;
};

export const useSebClientTemplates = () => {
    const data = ref<SebClientTemplate[]>();
    const loading = ref(false);
    const error = ref<string>();

    const fetchData = async () => {
        loading.value = true;

        try {
            // TODO @alain: fetch real data here, once I figure out, which API to use
            await new Promise((resolve) => setTimeout(resolve, 2000));

            data.value = [
                { id: "id-1", name: "SEB Client Template 1" },
                { id: "id-2", name: "SEB Client Template 2" },
                { id: "id-3", name: "SEB Client Template 3" },
            ];
        } catch (err) {
            error.value = err instanceof Error ? err.message : "Unknown error";
        } finally {
            loading.value = false;
        }
    };

    onMounted(fetchData);

    return { data, loading, error };
};
