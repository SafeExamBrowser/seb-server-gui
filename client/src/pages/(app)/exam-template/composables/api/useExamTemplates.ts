import type { Ref } from "vue";
import { useFetch } from "@/composables/useFetch.ts";
import type { TableOptions } from "@/pages/(app)/exam-template/types/types.ts";
import { getExamTemplates } from "@/services/seb-server/examTemplateService.ts";

export const useExamTemplates = (
    paging: Readonly<Ref<TableOptions>>,
    searchQuery: Readonly<Ref<string | undefined>>,
    examType: Readonly<Ref<string | undefined>>,
) => {
    return useFetch(() =>
        getExamTemplates({
            basicListParams: {
                pageNumber: paging.value.page,
                pageSize: paging.value.itemsPerPage,
                sortOrder: paging.value.sortBy[0],
            },
            name: searchQuery.value,
            examType: examType.value,
        }),
    );
};
