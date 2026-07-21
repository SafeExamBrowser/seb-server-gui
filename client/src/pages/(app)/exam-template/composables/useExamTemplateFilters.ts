import { computed } from "vue";
import { useI18n } from "vue-i18n";

import type { FilterSectionDef } from "@/components/widgets/filters/filterTypes.ts";
import { ExamTypeEnum } from "@/models/seb-server/examFiltersEnum.ts";

export const EXAM_TYPE_FILTER_KEY = "examType";

export const useExamTemplateFilters = () => {
    const { t } = useI18n();

    return computed<FilterSectionDef[]>(() => [
        {
            key: EXAM_TYPE_FILTER_KEY,
            title: t("examTemplateList.info.examType"),
            options: Object.values(ExamTypeEnum).map((value) => ({
                value,
                label: t(value),
            })),
        },
    ]);
};
