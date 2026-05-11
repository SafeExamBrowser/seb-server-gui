import { computed } from "vue";
import type { FilterSectionDef } from "@/components/widgets/filters/filterTypes.ts";
import { getStatusFilterSection } from "@/components/widgets/filters/statusFilterSection.ts";

const TRANSLATION_PREFIX = "institutions.institutionPage";

export function useInstitutionsFilters() {
    return computed<FilterSectionDef[]>(() => [
        getStatusFilterSection(TRANSLATION_PREFIX),
    ]);
}
