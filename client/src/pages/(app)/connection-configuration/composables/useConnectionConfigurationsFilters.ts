import { computed } from "vue";
import { useInstitutionFilterSection } from "@/components/widgets/filters/useInstitutionFilterSection.ts";
import type { FilterSectionDef } from "@/components/widgets/filters/filterTypes.ts";
import { getStatusFilterSection } from "@/components/widgets/filters/statusFilterSection.ts";

const TRANSLATION_PREFIX =
    "connectionConfigurations.connectionConfigurationsPage";

export function useConnectionConfigurationsFilters() {
    const { section: institutionSection } =
        useInstitutionFilterSection(TRANSLATION_PREFIX);

    return computed<FilterSectionDef[]>(() => {
        const sections: FilterSectionDef[] = [
            getStatusFilterSection(TRANSLATION_PREFIX),
        ];

        if (institutionSection.value) {
            sections.push(institutionSection.value);
        }

        return sections;
    });
}
