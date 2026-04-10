import { computed } from "vue";
import { useInstitutionFilterSection } from "@/components/views/seb-server/settings-navigation/components/filters/useInstitutionFilterSection";
import type { FilterSectionDef } from "@/components/views/seb-server/settings-navigation/components/filters/filterTypes";
import { getStatusFilterSection } from "@/components/views/seb-server/settings-navigation/components/filters/statusFilterSection.ts";

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
