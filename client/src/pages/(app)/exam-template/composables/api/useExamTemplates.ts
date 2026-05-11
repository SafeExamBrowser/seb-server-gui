import type { Ref } from "vue";
import { useFetch } from "@/composables/useFetch.ts";
import type { ServerTablePaging } from "@/models/types.ts";
import type { SortOrder } from "@/services/types.ts";
import { getExamTemplates } from "@/services/seb-server/examTemplateService.ts";

const toSortOrder = (
    sortBy: ServerTablePaging["sortBy"],
): SortOrder | undefined => {
    const first = sortBy[0];

    if (!first) {
        return undefined;
    }

    if (first.order !== "asc" && first.order !== "desc") {
        return undefined;
    }

    return { key: first.key, order: first.order };
};

export const useExamTemplates = (
    paging: Readonly<Ref<ServerTablePaging>>,
    searchQuery: Readonly<Ref<string | null>>,
    examType: Readonly<Ref<string | null>>,
) => {
    return useFetch(() =>
        getExamTemplates({
            basicListParams: {
                pageNumber: paging.value.page,
                pageSize: paging.value.itemsPerPage,
                sortOrder: toSortOrder(paging.value.sortBy),
            },
            name: searchQuery.value ?? undefined,
            examType: examType.value ?? undefined,
        }),
    );
};
