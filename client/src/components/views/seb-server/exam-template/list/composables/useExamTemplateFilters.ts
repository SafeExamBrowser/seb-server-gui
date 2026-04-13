import { translate } from "@/utils/generalUtils";
import type { FilterSectionDef } from "@/components/blocks/filters/filterTypes";
import { ExamTypeEnum } from "@/models/seb-server/examFiltersEnum";

export const EXAM_TYPE_FILTER_KEY = "examType";

export function useExamTemplateFilters(): FilterSectionDef[] {
    return [
        {
            key: EXAM_TYPE_FILTER_KEY,
            title: translate("examTemplateList.info.examType"),
            options: Object.values(ExamTypeEnum).map((value) => ({
                value,
                label: translate(value),
            })),
        },
    ];
}
