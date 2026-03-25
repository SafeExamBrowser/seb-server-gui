import { computed, type ComputedRef, type Ref } from "vue";
import { translate } from "@/utils/generalUtils";
import {
    SettingsFilterDefinition,
    SettingsFilterOption,
} from "@/models/types.ts";
import type { SettingsTableHeader } from "@/components/views/seb-server/settings-navigation/components/SettingsTable/settingsTableTypes";

type UseSettingsFiltersParams = {
    headers: Ref<SettingsTableHeader[]> | ComputedRef<SettingsTableHeader[]>;
    customFilters?:
        | Ref<SettingsFilterDefinition[]>
        | ComputedRef<SettingsFilterDefinition[]>;
    translationPrefix: string;
};

export function useSettingsFilters(params: UseSettingsFiltersParams) {
    const hasStatusFilter = computed(() =>
        params.headers.value.some((header) => header.key === "active"),
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

        if (params.customFilters?.value?.length) {
            result.push(...params.customFilters.value);
        }

        return result;
    });

    return {
        filters,
    };
}
