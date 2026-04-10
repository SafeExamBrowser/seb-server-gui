import { computed, watch } from "vue";
import { translate } from "@/utils/generalUtils";
import { useInstitutionNameMap } from "@/components/views/seb-server/settings-navigation/components/SettingsTable/composables/useInstitutionNameMap";
import { useShowInstitutionColumn } from "@/components/views/seb-server/settings-navigation/components/SettingsTable/composables/useShowInstitutionColumn";
import type { FilterSectionDef } from "./filterTypes";

export const INSTITUTION_FILTER_KEY = "institutionId";

export function useInstitutionFilterSection(translationPrefix: string) {
    const showInstitution = useShowInstitutionColumn();
    const { institutions, fetchInstitutions } = useInstitutionNameMap();

    // Watch instead of a bare void call: if userAccount isn't set yet when the
    // component first renders (e.g. hard refresh before beforeEach resolves),
    // showInstitution starts false and the watch re-fires the fetch the moment
    // it becomes true. hasFetched inside the singleton prevents duplicate calls.
    watch(
        showInstitution,
        (isAdmin) => {
            if (isAdmin) void fetchInstitutions();
        },
        { immediate: true },
    );

    const section = computed<FilterSectionDef | null>(() => {
        if (!showInstitution.value) return null;

        return {
            key: INSTITUTION_FILTER_KEY,
            title: translate(`${translationPrefix}.filters.institutionFilter`),
            // Options are reactive: empty while fetching, populated once resolved.
            options: institutions.value.map((inst) => ({
                value: String(inst.modelId),
                label: inst.name,
            })),
        };
    });

    return { section };
}
