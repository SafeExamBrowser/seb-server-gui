import { ref, onMounted } from "vue";
import * as examViewService from "@/services/seb-server/component-services/examViewService";

// TODO @alain: consider using https://tanstack.com/query/latest/docs/framework/vue/overview for this
export const useConnectionConfigurations = () => {
    const data = ref<ConnectionConfigurations>();
    const loading = ref(false);
    const error = ref<string>();

    const fetchData = async () => {
        loading.value = true;

        try {
            // TODO @alain: get only active connection configurations and filter by configPurpose "START_EXAM"
            const response =
                await examViewService.getConnectionConfigurations();

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
