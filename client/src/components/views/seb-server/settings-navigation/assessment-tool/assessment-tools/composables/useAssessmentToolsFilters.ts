import { computed } from "vue";
import { translate } from "@/utils/generalUtils";
import { statusFilterSection } from "@/components/views/seb-server/settings-navigation/components/filters/statusFilterSection";
import { useInstitutionFilterSection } from "@/components/views/seb-server/settings-navigation/components/filters/useInstitutionFilterSection";
import type { FilterSectionDef } from "@/components/views/seb-server/settings-navigation/components/filters/filterTypes";
import { LMSTypeEnum } from "@/models/seb-server/assessmentToolEnums";

const TRANSLATION_PREFIX = "assessmentToolConnections.assessmentToolsPage";

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
            statusFilterSection(TRANSLATION_PREFIX),
        ];

        if (institutionSection.value) {
            sections.push(institutionSection.value);
        }

        sections.push(lmsTypeSection);

        return sections;
    });
}
