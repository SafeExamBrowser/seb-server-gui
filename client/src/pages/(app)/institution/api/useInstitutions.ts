import type { Ref } from "vue";
import { useFetch } from "@/composables/useFetch.ts";
import type { InstitutionResponse } from "@/models/seb-server/institution.ts";
import { getInstitutionsAdmin } from "@/services/seb-server/institutionService.ts";
import type { ServerTablePaging } from "@/models/types.ts";
import type { SortOrder } from "@/services/types.ts";

const statusToActiveParam = (
    status: string | undefined,
): string | undefined => {
    if (status === "Active") return "true";
    if (status === "Inactive") return "false";
    return undefined;
};

const toSortOrder = (
    entry: ServerTablePaging["sortBy"][number] | undefined,
): SortOrder | undefined =>
    entry
        ? { key: entry.key, order: entry.order === "desc" ? "desc" : "asc" }
        : undefined;

export const useInstitutions = (
    paging: Readonly<Ref<ServerTablePaging>>,
    searchField: Readonly<Ref<string | undefined>>,
    selectedStatus: Readonly<Ref<string | undefined>>,
) => {
    return useFetch<InstitutionResponse>(() =>
        getInstitutionsAdmin({
            basicListParams: {
                pageNumber: paging.value.page,
                pageSize: paging.value.itemsPerPage,
                sortOrder: toSortOrder(paging.value.sortBy[0]),
            },
            name: searchField.value ?? undefined,
            active: statusToActiveParam(selectedStatus.value),
        }),
    );
};
