import { computed } from "vue";
import { useInstitutionFilterSection } from "@/components/blocks/filters/useInstitutionFilterSection.ts";
import type { FilterSectionDef } from "@/components/blocks/filters/filterTypes.ts";
import { getStatusFilterSection } from "@/components/blocks/filters/statusFilterSection.ts";

const TRANSLATION_PREFIX = "userAccount.userAccountPage";

export function useUserAccountsFilters() {
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
