import * as tableUtils from "@/utils/table/tableUtils";
import { ConnectionConfigurations } from "@/models/seb-server/connectionConfiguration.ts";
import { getConnectionConfigurations } from "@/services/seb-server/connectionConfigurationService.ts";
import { ref } from "vue";
import type { ServerTablePaging } from "@/models/types.ts";

export const useConnectionConfigurations = () => {
    const data = ref<ConnectionConfigurations>();
    const loading = ref(false);
    const error = ref<string>();

    const fetchConnectionConfigurations = async (
        paging: ServerTablePaging,
        searchField: string | null,
        selectedStatus: string | null,
        selectedInstitutionId: string | null,
    ) => {
        loading.value = true;
        error.value = undefined;

        try {
            const response = await getConnectionConfigurations(
                tableUtils.assignConnectionConfigurationSelectPagingOptions(
                    paging,
                    searchField,
                    selectedStatus,
                    selectedInstitutionId,
                ),
            );

            if (!response) {
                throw new Error("Failed to fetch connection configurations");
            }

            data.value = response;
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
        fetchConnectionConfigurations,
    };
};
