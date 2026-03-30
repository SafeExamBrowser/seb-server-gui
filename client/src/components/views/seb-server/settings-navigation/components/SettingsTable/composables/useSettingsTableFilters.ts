import { computed, watch, type ComputedRef, type Ref } from "vue";
import type { SettingsTableHeader } from "@/components/views/seb-server/settings-navigation/components/SettingsTable/types.ts";
import { useInstitutionNameMap } from "@/components/views/seb-server/settings-navigation/components/SettingsTable/composables/useInstitutionNameMap.ts";
import { useSettingsFilters } from "@/components/views/seb-server/settings-navigation/components/SettingsTable/composables/useSettingsFilters.ts";

type UseSettingsTableFiltersParams = {
    headers: Ref<SettingsTableHeader[]> | ComputedRef<SettingsTableHeader[]>;
    translationPrefix: string;
};

export function useSettingsTableFilters(params: UseSettingsTableFiltersParams) {
    const hasInstitutionFilter = computed(() =>
        params.headers.value.some((header) => header.key === "institutionId"),
    );

    const {
        fetchInstitutions,
        institutionFilterOptions,
        loading,
        error,
        hasFetched,
    } = useInstitutionNameMap();

    watch(
        hasInstitutionFilter,
        async (enabled) => {
            if (enabled) {
                await fetchInstitutions();
            }
        },
        { immediate: true },
    );

    const { filters } = useSettingsFilters({
        headers: params.headers,
        translationPrefix: params.translationPrefix,
        institutionOptions: institutionFilterOptions,
    });

    const filtersReady = computed(() => {
        if (!hasInstitutionFilter.value) {
            return true;
        }

        return hasFetched.value;
    });

    const filtersRenderKey = computed(() => {
        const institutionOptionsCount = institutionFilterOptions.value.length;

        return [
            params.translationPrefix,
            hasInstitutionFilter.value ? "institution" : "no-institution",
            hasFetched.value ? "loaded" : "loading",
            institutionOptionsCount,
        ].join("-");
    });

    return {
        filters,
        loading,
        error,
        filtersReady,
        filtersRenderKey,
    };
}
