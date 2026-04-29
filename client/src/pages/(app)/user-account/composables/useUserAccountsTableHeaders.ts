import { computed, watch } from "vue";
import { translate } from "@/utils/generalUtils.ts";
import { useShowInstitutionColumn } from "@/composables/useShowInstitutionColumn.ts";
import { useInstitutionNameMap } from "@/composables/useInstitutionNameMap.ts";
import type {
    TableHeader,
    CellFormatter,
} from "@/components/widgets/entity-table/types.ts";

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
                title: translate(
                    "userAccount.userAccountPage.userAccountTableHeaders.tableHeaderInstitution",
                ),
                key: "institutionId",
                width: "6%",
                sortable: true,
            });
        }

        base.push(
            {
                title: translate(
                    "userAccount.userAccountPage.userAccountTableHeaders.tableHeaderSurname",
                ),
                key: "surname",
                width: "8%",
                sortable: true,
            },
            {
                title: translate(
                    "userAccount.userAccountPage.userAccountTableHeaders.tableHeaderName",
                ),
                key: "name",
                width: "8%",
                sortable: true,
            },
            {
                title: translate(
                    "userAccount.userAccountPage.userAccountTableHeaders.tableHeaderUsername",
                ),
                key: "username",
                width: "8%",
                sortable: true,
            },
            {
                title: translate(
                    "userAccount.userAccountPage.userAccountTableHeaders.tableHeaderEmail",
                ),
                key: "email",
                width: "12%",
                sortable: true,
            },
            {
                title: translate(
                    "userAccount.userAccountPage.userAccountTableHeaders.tableHeaderStatus",
                ),
                key: "active",
                width: "6%",
                sortable: false,
            },
        );

        return base;
    });

    const cellFormatters: Record<string, CellFormatter> = {
        institutionId: (value) => getInstitutionName(value),
    };

    return { headers, cellFormatters };
}
