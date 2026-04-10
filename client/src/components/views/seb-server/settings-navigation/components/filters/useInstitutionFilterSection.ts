import { computed, onMounted, ref } from "vue";
import { translate } from "@/utils/generalUtils";
import { getInstitutions } from "@/services/seb-server/institutionService";
import type { Institution } from "@/models/seb-server/institution";
import { useShowInstitutionColumn } from "@/components/views/seb-server/settings-navigation/components/SettingsTable/composables/useShowInstitutionColumn";
import type { FilterSectionDef } from "./filterTypes";

export const INSTITUTION_FILTER_KEY = "institutionId";

export function useInstitutionFilterSection(translationPrefix: string) {
    const showInstitution = useShowInstitutionColumn();
    const institutions = ref<Institution[]>([]);

    onMounted(async () => {
        const data = await getInstitutions();
        institutions.value = data ?? [];
    });

    const section = computed<FilterSectionDef | null>(() => {
        if (!showInstitution.value) return null;
        if (institutions.value.length === 0) return null;

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
