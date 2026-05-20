import { computed } from "vue";
import { translate } from "@/utils/generalUtils.ts";
import { useInstitutionFilterSection } from "@/components/widgets/filters/useInstitutionFilterSection.ts";
import type { FilterSectionDef } from "@/components/widgets/filters/filterTypes.ts";
import { LMSTypeEnum } from "@/models/seb-server/assessmentToolEnums.ts";
import { getStatusFilterSection } from "@/components/widgets/filters/statusFilterSection.ts";

const TRANSLATION_PREFIX = "assessmentToolConnections.list";

export const LMS_TYPE_FILTER_KEY = "selectedType";

export function useAssessmentToolsFilters() {
    const { section: institutionSection } =
        useInstitutionFilterSection(TRANSLATION_PREFIX);

    const lmsTypeSection: FilterSectionDef = {
        key: LMS_TYPE_FILTER_KEY,
        title: translate(`${TRANSLATION_PREFIX}.filters.typeFilter`),
        options: Object.values(LMSTypeEnum).map((type) => ({
            value: type,
            label: translate(`assessmentToolConnections.lmsTypes.${type}`),
        })),
    };

    return computed<FilterSectionDef[]>(() => {
        const sections: FilterSectionDef[] = [
            getStatusFilterSection(TRANSLATION_PREFIX),
        ];

        if (institutionSection.value) {
            sections.push(institutionSection.value);
        }

        sections.push(lmsTypeSection);

        return sections;
    });
}
