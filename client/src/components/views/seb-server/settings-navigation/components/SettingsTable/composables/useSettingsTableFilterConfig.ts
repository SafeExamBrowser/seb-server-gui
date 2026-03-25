import { computed, watch, type ComputedRef, type Ref } from "vue";
import type { SettingsTableHeader } from "@/components/views/seb-server/settings-navigation/components/SettingsTable/settingsTableTypes";
import { useInstitutionNameMap } from "@/components/views/seb-server/settings-navigation/components/SettingsTable/composables/useInstitutionNameMap.ts";
import { useSettingsFilters } from "@/components/views/seb-server/settings-navigation/components/SettingsTable/composables/useSettingsFilters.ts";

type UseSettingsTableFilterConfigParams = {
    headers: Ref<SettingsTableHeader[]> | ComputedRef<SettingsTableHeader[]>;
    translationPrefix: string;
};

type TableItem = Record<string, unknown>;
type CellFormatter = (value: unknown, item: TableItem) => string;

export function useSettingsTableFilterConfig(
    params: UseSettingsTableFilterConfigParams,
) {
    const hasInstitutionColumn = computed(() =>
        params.headers.value.some((header) => header.key === "institutionId"),
    );

    const {
        fetchInstitutions,
        getInstitutionName,
        institutionFilterOptions,
        loading,
        error,
    } = useInstitutionNameMap();

    watch(
        hasInstitutionColumn,
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

    const cellFormatters = computed<Record<string, CellFormatter>>(() => {
        const result: Record<string, CellFormatter> = {};

        if (hasInstitutionColumn.value) {
            result.institutionId = (value: unknown) =>
                getInstitutionName(value);
        }

        return result;
    });

    return {
        filters,
        cellFormatters,
        loading,
        error,
    };
}
