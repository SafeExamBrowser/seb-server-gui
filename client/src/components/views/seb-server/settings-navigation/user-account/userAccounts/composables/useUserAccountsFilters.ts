import { computed } from "vue";
import { statusFilterSection } from "@/components/views/seb-server/settings-navigation/components/filters/statusFilterSection";
import { useInstitutionFilterSection } from "@/components/views/seb-server/settings-navigation/components/filters/useInstitutionFilterSection";
import type { FilterSectionDef } from "@/components/views/seb-server/settings-navigation/components/filters/filterTypes";

const TRANSLATION_PREFIX = "userAccount.userAccountPage";

export function useUserAccountsFilters() {
    const { section: institutionSection } =
        useInstitutionFilterSection(TRANSLATION_PREFIX);

    return computed<FilterSectionDef[]>(() => {
        const sections: FilterSectionDef[] = [
            statusFilterSection(TRANSLATION_PREFIX),
        ];

        if (institutionSection.value) {
            sections.push(institutionSection.value);
        }

        return sections;
    });
}
