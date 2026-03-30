import { computed } from "vue";
import { translate } from "@/utils/generalUtils";
import {
    SettingsFilterDefinition,
    SettingsFilterOption,
} from "@/models/types.ts";
import type { UseSettingsFiltersParams } from "@/components/views/seb-server/settings-navigation/components/SettingsTable/types.ts";

export function useSettingsFilters(params: UseSettingsFiltersParams) {
    const hasStatusFilter = computed(() =>
        params.headers.value.some((header) => header.key === "active"),
    );

    const hasInstitutionFilter = computed(() =>
        params.headers.value.some((header) => header.key === "institutionId"),
    );

    const statusOptions = computed<SettingsFilterOption[]>(() => [
        {
            value: "Active",
            label: translate(
                `${params.translationPrefix}.filters.activeSelector`,
            ),
        },
        {
            value: "Inactive",
            label: translate(
                `${params.translationPrefix}.filters.inactiveSelector`,
            ),
        },
    ]);

    const filters = computed<SettingsFilterDefinition[]>(() => {
        const result: SettingsFilterDefinition[] = [];

        if (hasStatusFilter.value) {
            result.push({
                key: "status",
                title: translate(
                    `${params.translationPrefix}.filters.statusFilter`,
                ),
                options: statusOptions.value,
            });
        }

        if (
            hasInstitutionFilter.value &&
            params.institutionOptions?.value?.length
        ) {
            result.push({
                key: "institutionId",
                title: translate(
                    `${params.translationPrefix}.filters.institutionFilter`,
                ),
                options: params.institutionOptions.value,
            });
        }

        if (params.customFilters?.value?.length) {
            result.push(...params.customFilters.value);
        }

        return result;
    });

    return {
        filters,
    };
}
