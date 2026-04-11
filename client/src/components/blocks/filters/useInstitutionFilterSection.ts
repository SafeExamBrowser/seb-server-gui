import { computed } from "vue";
import { translate } from "@/utils/generalUtils.ts";
import { useShowInstitutionColumn } from "@/composables/useShowInstitutionColumn.ts";
import type { FilterSectionDef } from "./filterTypes.ts";
import { useInstitutionNameMap } from "@/composables/useInstitutionNameMap.ts";

export const INSTITUTION_FILTER_KEY = "institutionId";

export function useInstitutionFilterSection(translationPrefix: string) {
    const showInstitution = useShowInstitutionColumn();
    const { institutions } = useInstitutionNameMap();

    const section = computed<FilterSectionDef | null>(() => {
        if (!showInstitution.value) return null;

        return {
            key: INSTITUTION_FILTER_KEY,
            title: translate(`${translationPrefix}.filters.institutionFilter`),
            options: institutions.value.map((inst) => ({
                value: String(inst.modelId),
                label: inst.name,
            })),
        };
    });

    return { section };
}
