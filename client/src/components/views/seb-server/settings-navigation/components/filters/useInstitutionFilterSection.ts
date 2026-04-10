import { computed } from "vue";
import { translate } from "@/utils/generalUtils";
import { useInstitutionNameMap } from "@/components/views/seb-server/settings-navigation/components/SettingsTable/composables/useInstitutionNameMap";
import { useShowInstitutionColumn } from "@/components/views/seb-server/settings-navigation/components/SettingsTable/composables/useShowInstitutionColumn";
import type { FilterSectionDef } from "./filterTypes";

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
