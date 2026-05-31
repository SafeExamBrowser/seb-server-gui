import { computed } from "vue";
import { translate } from "@/utils/generalUtils.ts";
import type { FilterSectionDef } from "@/components/widgets/filters/filterTypes.ts";
import {
    ExamStatusEnum,
    ExamTypeEnum,
} from "@/models/seb-server/examFiltersEnum.ts";
import { getExamStatusFilterColor } from "@/utils/generalUtils.ts";

export const TYPE_FILTER_KEY = "type";
export const MONITORING_STATUS_FILTER_KEY = "status";

const TRANSLATION_PREFIX = "monitoringExams.info";

export function useMonitoringFilters() {
    return computed<FilterSectionDef[]>(() => [
        {
            key: MONITORING_STATUS_FILTER_KEY,
            title: translate(`${TRANSLATION_PREFIX}.examState`),
            options: [
                {
                    value: ExamStatusEnum.RUNNING,
                    label: translate(ExamStatusEnum.RUNNING),
                    color: getExamStatusFilterColor(ExamStatusEnum.RUNNING),
                },
                {
                    value: ExamStatusEnum.TEST_RUN,
                    label: translate(ExamStatusEnum.TEST_RUN),
                    color: getExamStatusFilterColor(ExamStatusEnum.TEST_RUN),
                },
            ],
        },
        {
            key: TYPE_FILTER_KEY,
            title: translate(`${TRANSLATION_PREFIX}.examType`),
            options: [
                {
                    value: ExamTypeEnum.BYOD,
                    label: translate(ExamTypeEnum.BYOD),
                },
                {
                    value: ExamTypeEnum.MANAGED,
                    label: translate(ExamTypeEnum.MANAGED),
                },
                {
                    value: ExamTypeEnum.VDI,
                    label: translate(ExamTypeEnum.VDI),
                },
                {
                    value: ExamTypeEnum.UNDEFINED,
                    label: translate(ExamTypeEnum.UNDEFINED),
                },
            ],
        },
    ]);
}
