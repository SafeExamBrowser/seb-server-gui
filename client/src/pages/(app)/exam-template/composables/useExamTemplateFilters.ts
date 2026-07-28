import { computed } from "vue";

import type { FilterSectionDef } from "@/components/widgets/filters/filterTypes.ts";
import i18n from "@/i18n";
import { ExamTypeEnum } from "@/models/seb-server/examFiltersEnum.ts";

export const EXAM_TYPE_FILTER_KEY = "examType";

export const useExamTemplateFilters = () => {
    return computed<FilterSectionDef[]>(() => [
        {
            key: EXAM_TYPE_FILTER_KEY,
            title: i18n.global.t("examTemplateList.info.examType"),
            options: Object.values(ExamTypeEnum).map((value) => ({
                value,
                label: i18n.global.t(value),
            })),
        },
    ]);
};
