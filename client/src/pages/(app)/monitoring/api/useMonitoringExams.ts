import type { Ref } from "vue";

import { useFetch } from "@/composables/useFetch.ts";
import type { Exams } from "@/models/seb-server/exam.ts";
import { ExamStatusEnum } from "@/models/seb-server/examFiltersEnum.ts";
import type { ServerTablePaging } from "@/models/types.ts";
import { getExamsForMonitoring } from "@/services/seb-server/monitoringService.ts";
import { createStringCommaList } from "@/utils/generalUtils.ts";
import * as tableUtils from "@/utils/table/tableUtils.ts";

const DEFAULT_STATUS = createStringCommaList([
    ExamStatusEnum.RUNNING,
    ExamStatusEnum.TEST_RUN,
]);

export const useMonitoringExams = (
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
            selectedStatus.value ?? DEFAULT_STATUS,
        );
        return getExamsForMonitoring(params);
    });
};
