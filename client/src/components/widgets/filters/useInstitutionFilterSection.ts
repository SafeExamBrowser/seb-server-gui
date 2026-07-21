import { computed } from "vue";

import { INSTITUTION_FILTER } from "@/components/widgets/filters/filterContracts.ts";
import { useInstitutionNameMap } from "@/composables/useInstitutionNameMap.ts";
import { useShowInstitutionColumn } from "@/composables/useShowInstitutionColumn.ts";
import { translate } from "@/utils/generalUtils.ts";

import type { FilterSectionDef } from "./filterTypes.ts";

export const INSTITUTION_FILTER_KEY = INSTITUTION_FILTER.key;

export function useInstitutionFilterSection(translationPrefix: string) {
    const showInstitution = useShowInstitutionColumn();
    const { institutions } = useInstitutionNameMap();

    const section = computed<FilterSectionDef | null>(() => {
        if (!showInstitution.value) return null;

        return {
            key: INSTITUTION_FILTER.key,
            title: translate(`${translationPrefix}.filters.institutionFilter`),
            testIdSuffix: INSTITUTION_FILTER.testIdSuffix,
            options: institutions.value.map((inst) => ({
                value: String(inst.modelId),
                label: inst.name,
            })),
        };
    });

    return { section };
}
