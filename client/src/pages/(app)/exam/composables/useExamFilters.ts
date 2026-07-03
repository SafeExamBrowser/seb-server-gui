import { computed } from "vue";
import { translate } from "@/utils/generalUtils.ts";
import type {
    FilterOption,
    FilterSectionDef,
} from "@/components/widgets/filters/filterTypes.ts";
import {
    ExamStatusEnum,
    ExamTypeEnum,
} from "@/models/seb-server/examFiltersEnum.ts";
import { getExamStatusFilterColor } from "@/utils/generalUtils.ts";

export const TRANSLATION_PREFIX = "examList.info";
export const TYPE_FILTER_KEY = "type";
export const EXAM_STATUS_FILTER_KEY = "status";
export const EXAM_TYPE_OPTIONS: FilterOption[] = [
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
];

export function useExamFilters() {
    return computed<FilterSectionDef[]>(() => [
        {
            key: EXAM_STATUS_FILTER_KEY,
            title: translate(`${TRANSLATION_PREFIX}.examState`),
            multiple: true,
            options: [
                {
                    value: ExamStatusEnum.UP_COMING,
                    label: translate(ExamStatusEnum.UP_COMING),
                    color: getExamStatusFilterColor(ExamStatusEnum.UP_COMING),
                },
                {
                    value: ExamStatusEnum.TEST_RUN,
                    label: translate(ExamStatusEnum.TEST_RUN),
                    color: getExamStatusFilterColor(ExamStatusEnum.TEST_RUN),
                },
                {
                    value: ExamStatusEnum.RUNNING,
                    label: translate(ExamStatusEnum.RUNNING),
                    color: getExamStatusFilterColor(ExamStatusEnum.RUNNING),
                },
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
