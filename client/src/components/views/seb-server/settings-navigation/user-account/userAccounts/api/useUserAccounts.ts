import type { Ref } from "vue";
import { useFetch } from "@/composables/useFetch";
import type { UserAccountResponse } from "@/models/userAccount";
import { getUserAccounts } from "@/services/seb-server/userAccountService";
import * as tableUtils from "@/utils/table/tableUtils";
import type { ServerTablePaging } from "@/models/types";

export const useUserAccounts = (
    paging: Readonly<Ref<ServerTablePaging>>,
    searchField: Readonly<Ref<string | null>>,
    selectedStatus: Readonly<Ref<string | null>>,
    selectedInstitutionId: Readonly<Ref<string | null>>,
) => {
    return useFetch<UserAccountResponse>(() =>
        getUserAccounts(
            tableUtils.assignUserAccountSelectPagingOptions(
                paging.value,
                searchField.value,
                selectedStatus.value,
                selectedInstitutionId.value,
            ),
        ),
    );
};
