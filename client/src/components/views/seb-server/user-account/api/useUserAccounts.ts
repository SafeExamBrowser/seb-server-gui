import type { Ref } from "vue";
import { useFetch } from "@/composables/useFetch.ts";
import type { UserAccountResponse } from "@/models/userAccount.ts";
import { getUserAccounts } from "@/services/seb-server/userAccountService.ts";
import * as tableUtils from "@/utils/table/tableUtils.ts";
import type { ServerTablePaging } from "@/models/types.ts";

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
