import { computed } from "vue";
import { translate } from "@/utils/generalUtils.ts";
import type { FilterSectionDef } from "@/components/widgets/filters/filterTypes.ts";
import { ExamStatusEnum } from "@/models/seb-server/examFiltersEnum.ts";
import { getExamStatusFilterColor } from "@/utils/generalUtils.ts";
import {
    TYPE_FILTER_KEY,
    EXAM_TYPE_OPTIONS,
    EXAM_STATUS_FILTER_KEY,
    TRANSLATION_PREFIX,
} from "@/pages/(app)/exam/composables/useExamFilters";

export function useAnalyzeTableFilters() {
    return computed<FilterSectionDef[]>(() => [
        {
            key: EXAM_STATUS_FILTER_KEY,
            title: translate(`${TRANSLATION_PREFIX}.examState`),
            options: [
                {
                    value: ExamStatusEnum.FINISHED,
                    label: translate(ExamStatusEnum.FINISHED),
                    color: getExamStatusFilterColor(ExamStatusEnum.FINISHED),
                },
                {
                    value: ExamStatusEnum.ARCHIVED,
                    label: translate(ExamStatusEnum.ARCHIVED),
                    color: getExamStatusFilterColor(ExamStatusEnum.ARCHIVED),
                },
            ],
        },
        {
            key: TYPE_FILTER_KEY,
            title: translate(`${TRANSLATION_PREFIX}.examType`),
            options: EXAM_TYPE_OPTIONS,
            multiple: true,
        },
    ]);
}
