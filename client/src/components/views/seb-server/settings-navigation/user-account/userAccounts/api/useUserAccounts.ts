import { ref } from "vue";
import type { UserAccountResponse } from "@/models/userAccount";
import { getUserAccounts } from "@/services/seb-server/userAccountService";
import * as tableUtils from "@/utils/table/tableUtils";
import type { ServerTablePaging } from "@/models/types";
//todo use useFetch

export const useUserAccounts = () => {
    const data = ref<UserAccountResponse>();
    const loading = ref(false);
    const error = ref<string>();

    const fetchUserAccounts = async (
        paging: ServerTablePaging,
        searchField: string | null,
        selectedStatus: string | null,
        selectedInstitutionId: string | null,
    ) => {
        loading.value = true;
        error.value = undefined;

        try {
            const response = await getUserAccounts(
                tableUtils.assignUserAccountSelectPagingOptions(
                    paging,
                    searchField,
                    selectedStatus,
                    selectedInstitutionId,
                ),
            );

            if (!response) {
                throw new Error("Failed to fetch user accounts.");
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
        fetchUserAccounts,
    };
};
