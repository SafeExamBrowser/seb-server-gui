import { useFetch } from "@/composables/useFetch";
import { getUserAccounts } from "@/services/seb-server/userAccountService";
import type { UserAccountResponse } from "@/models/userAccount";
import * as tableUtils from "@/utils/table/tableUtils";

export const useUserAccounts = () =>
    useFetch<UserAccountResponse>(() =>
        getUserAccounts(
            tableUtils.assignUserAccountSelectPagingOptions(
                {
                    page: 1,
                    itemsPerPage: 5,
                    sortBy: [{ key: "name", order: "asc" }],
                },
                null,
                null,
                null,
            ),
        ),
    );
