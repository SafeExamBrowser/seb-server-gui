import type { Ref } from "vue";
import { useFetch } from "@/composables/useFetch";
import type { TableOptions } from "@/components/views/seb-server/exam-template/list/types";
import { getExamTemplates } from "@/services/seb-server/examTemplateService";

export const useExamTemplates = (
    paging: Readonly<Ref<TableOptions>>,
    searchQuery: Readonly<Ref<string | undefined>>,
    examType: Readonly<Ref<string | undefined>>,
) => {
    return useFetch(() =>
        getExamTemplates({
            pageNumber: paging.value.page,
            pageSize: paging.value.itemsPerPage,
            sort: paging.value.sortBy[0],
            name: searchQuery.value,
            examType: examType.value,
        }),
    );
};
