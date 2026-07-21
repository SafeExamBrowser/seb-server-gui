import { computed, watch } from "vue";

import type {
    CellFormatter,
    TableHeader,
} from "@/components/widgets/entity-table/types.ts";
import { useInstitutionNameMap } from "@/composables/useInstitutionNameMap.ts";
import { useShowInstitutionColumn } from "@/composables/useShowInstitutionColumn.ts";
import { USER_ACCOUNT_COLUMN } from "@/pages/(app)/user-account/userAccountListConfig.ts";
import { translate } from "@/utils/generalUtils.ts";

export function useUserAccountsTableHeaders() {
    const showInstitutionColumn = useShowInstitutionColumn();
    const { getInstitutionName, fetchInstitutions } = useInstitutionNameMap();

    watch(
        showInstitutionColumn,
        async (show) => {
            if (show) await fetchInstitutions();
        },
        { immediate: true },
    );

    const headers = computed<TableHeader[]>(() => {
        const base: TableHeader[] = [];

        if (showInstitutionColumn.value) {
            base.push({
                title: translate("userAccount.list.tableHeaders.institution"),
                key: USER_ACCOUNT_COLUMN.institutionId,
                width: "6%",
                sortable: true,
            });
        }

        base.push(
            {
                title: translate("userAccount.list.tableHeaders.surname"),
                key: USER_ACCOUNT_COLUMN.surname,
                width: "8%",
                sortable: true,
            },
            {
                title: translate("userAccount.list.tableHeaders.name"),
                key: USER_ACCOUNT_COLUMN.name,
                width: "8%",
                sortable: true,
            },
            {
                title: translate("userAccount.list.tableHeaders.username"),
                key: USER_ACCOUNT_COLUMN.username,
                width: "8%",
                sortable: true,
            },
            {
                title: translate("userAccount.list.tableHeaders.email"),
                key: USER_ACCOUNT_COLUMN.email,
                width: "12%",
                sortable: true,
            },
            {
                title: translate("userAccount.list.tableHeaders.status"),
                key: USER_ACCOUNT_COLUMN.active,
                width: "6%",
                sortable: false,
            },
        );

        return base;
    });

    const cellFormatters: Record<string, CellFormatter> = {
        [USER_ACCOUNT_COLUMN.institutionId]: (value) =>
            getInstitutionName(value),
    };

    return { headers, cellFormatters };
}
