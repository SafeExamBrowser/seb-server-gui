import { computed } from "vue";
import { translate } from "@/utils/generalUtils.ts";
import type { TableHeader } from "@/components/widgets/entity-table/types.ts";

export function useInstitutionsTableHeaders() {
    const headers = computed<TableHeader[]>(() => [
        {
            title: translate("institutions.institutionPage.tableHeaders.name"),
            key: "name",
            width: "30%",
            sortable: true,
        },
        {
            title: translate(
                "institutions.institutionPage.tableHeaders.urlSuffix",
            ),
            key: "urlSuffix",
            width: "25%",
            sortable: false,
        },
        {
            title: translate(
                "institutions.institutionPage.tableHeaders.themeName",
            ),
            key: "themeName",
            width: "20%",
            sortable: false,
        },
        {
            title: translate(
                "institutions.institutionPage.tableHeaders.active",
            ),
            key: "active",
            width: "10%",
            sortable: false,
        },
    ]);

    return { headers };
}
