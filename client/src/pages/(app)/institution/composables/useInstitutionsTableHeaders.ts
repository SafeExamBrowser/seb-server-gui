import { computed } from "vue";

import type { TableHeader } from "@/components/widgets/entity-table/types.ts";
import { INSTITUTION_COLUMN } from "@/pages/(app)/institution/institutionListConfig.ts";
import { translate } from "@/utils/generalUtils.ts";

export function useInstitutionsTableHeaders() {
    const headers = computed<TableHeader[]>(() => [
        {
            title: translate("institutions.list.tableHeaders.logoImage"),
            key: INSTITUTION_COLUMN.logoImage,
            width: "12%",
            sortable: false,
        },
        {
            title: translate("institutions.list.tableHeaders.name"),
            key: INSTITUTION_COLUMN.name,
            width: "30%",
            sortable: true,
        },
        {
            title: translate("institutions.list.tableHeaders.urlSuffix"),
            key: INSTITUTION_COLUMN.urlSuffix,
            width: "33%",
            sortable: false,
        },
        {
            title: translate("institutions.list.tableHeaders.active"),
            key: INSTITUTION_COLUMN.active,
            width: "10%",
            sortable: false,
        },
    ]);

    return { headers };
}
