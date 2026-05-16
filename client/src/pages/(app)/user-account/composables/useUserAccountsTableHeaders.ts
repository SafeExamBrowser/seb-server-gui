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
                title: translate("userAccount.list.tableHeaders.institution"),
                key: "institutionId",
                width: "6%",
                sortable: true,
            });
        }

        base.push(
            {
                title: translate("userAccount.list.tableHeaders.surname"),
                key: "surname",
                width: "8%",
                sortable: true,
            },
            {
                title: translate("userAccount.list.tableHeaders.name"),
                key: "name",
                width: "8%",
                sortable: true,
            },
            {
                title: translate("userAccount.list.tableHeaders.username"),
                key: "username",
                width: "8%",
                sortable: true,
            },
            {
                title: translate("userAccount.list.tableHeaders.email"),
                key: "email",
                width: "12%",
                sortable: true,
            },
            {
                title: translate("userAccount.list.tableHeaders.status"),
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
