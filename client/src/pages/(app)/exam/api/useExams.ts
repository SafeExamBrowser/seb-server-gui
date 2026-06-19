import type { Ref } from "vue";
import { useFetch } from "@/composables/useFetch.ts";
import type { Exams } from "@/models/seb-server/exam.ts";
import { getExams } from "@/services/seb-server/examService.ts";
import * as tableUtils from "@/utils/table/tableUtils.ts";
import type { ServerTablePaging } from "@/models/types.ts";

export const useExams = (
    paging: Readonly<Ref<ServerTablePaging>>,
    searchField: Readonly<Ref<string | undefined>>,
    startTimestamp: Readonly<Ref<number | null>>,
    selectedType: Readonly<Ref<string | undefined>>,
    selectedStatus: Readonly<Ref<string | undefined>>,
) => {
    return useFetch<Exams>(() => {
        const params = tableUtils.assignExamSelectPagingOptions(
            paging.value,
            searchField.value,
            startTimestamp.value,
            selectedType.value,
            selectedStatus.value,
        );
        params.active = "true";
        return getExams(params);
    });
};
