import type { Ref } from "vue";
import { useFetch } from "@/composables/useFetch.ts";
import type { Exams } from "@/models/seb-server/exam.ts";
import { getExams } from "@/services/seb-server/examService";
import * as tableUtils from "@/utils/table/tableUtils.ts";
import type { ServerTablePaging } from "@/models/types.ts";
import { ExamStatusEnum } from "@/models/seb-server/examFiltersEnum";

export const useArchiveExams = (
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
        if (params.status) {
            // if selected, make sure they are correct (no UP_COMING, TEST_RUN possible)
            if (
                params.status.includes(ExamStatusEnum.UP_COMING) ||
                params.status.includes(ExamStatusEnum.TEST_RUN)
            ) {
                params.status = `${ExamStatusEnum.ARCHIVED},${ExamStatusEnum.FINISHED},${ExamStatusEnum.RUNNING}`;
            }
        } else {
            // if no selection, select all for archive context
            params.status = `${ExamStatusEnum.ARCHIVED},${ExamStatusEnum.FINISHED},${ExamStatusEnum.RUNNING}`;
        }
        return getExams(params);
    });
};
