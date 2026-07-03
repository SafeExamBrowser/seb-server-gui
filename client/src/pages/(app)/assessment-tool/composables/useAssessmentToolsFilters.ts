import { computed } from "vue";
import { translate } from "@/utils/generalUtils.ts";
import type { FilterSectionDef } from "@/components/widgets/filters/filterTypes.ts";
import { getStatusFilterSection } from "@/components/widgets/filters/statusFilterSection.ts";
import { useInstitutionFilterSection } from "@/components/widgets/filters/useInstitutionFilterSection.ts";
import { LMS_TYPE_FILTER } from "@/components/widgets/filters/filterContracts.ts";
import { LMS_TYPES } from "@/models/assessmentTool.ts";

const TRANSLATION_PREFIX = "assessmentToolConnections.list";

export const LMS_TYPE_FILTER_KEY = LMS_TYPE_FILTER.key;

export function useAssessmentToolsFilters() {
    const { section: institutionSection } =
        useInstitutionFilterSection(TRANSLATION_PREFIX);

    const lmsTypeSection: FilterSectionDef = {
        key: LMS_TYPE_FILTER.key,
        testIdSuffix: LMS_TYPE_FILTER.testIdSuffix,
        title: translate(`${TRANSLATION_PREFIX}.filters.typeFilter`),
        options: LMS_TYPES.map((type) => ({
            value: type,
            label: translate(`assessmentToolConnections.lmsTypes.${type}`),
        })),
    };

    return computed<FilterSectionDef[]>(() => {
        const sections: FilterSectionDef[] = [
            getStatusFilterSection(TRANSLATION_PREFIX),
            lmsTypeSection,
        ];

        if (institutionSection.value) {
            sections.push(institutionSection.value);
        }

        return sections;
    });
}
