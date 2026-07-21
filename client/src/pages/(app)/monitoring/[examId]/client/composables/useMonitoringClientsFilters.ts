import { computed } from "vue";
import { useRoute } from "vue-router";

import type { TableFilters } from "@/components/widgets/entity-table/types.ts";
import type {
    FilterOption,
    FilterSectionDef,
} from "@/components/widgets/filters/filterTypes.ts";
import { parseFilterValues } from "@/components/widgets/filters/filterValues.ts";
import { MonitoringHeaderEnum } from "@/models/seb-server/monitoringEnums.ts";
import * as useMonitoringNavigation from "@/pages/(app)/monitoring/[examId]/composables/useMonitoringNavigation.ts";
import { useMonitoringStore } from "@/stores/seb-server/monitoringStore.ts";
import { translate } from "@/utils/generalUtils.ts";
import { getConnectionStatusColor } from "@/utils/monitoringUtils.ts";

const FILTER_KEYS = [
    MonitoringHeaderEnum.SHOW_CLIENT_GROUPS,
    MonitoringHeaderEnum.SHOW_STATES,
    MonitoringHeaderEnum.SHOW_NOTIFCATION,
    MonitoringHeaderEnum.SHOW_INDICATORS,
];

export function useMonitoringClientsFilters() {
    const route = useRoute();
    const monitoringStore = useMonitoringStore();

    const filterValues = computed<TableFilters>(() => {
        const values: TableFilters = {};
        for (const filterKey of FILTER_KEYS) {
            const queryValue = route.query[filterKey];
            values[filterKey] =
                typeof queryValue === "string" ? queryValue : undefined;
        }
        return values;
    });

    const filterSections = computed<FilterSectionDef[]>(() => [
        {
            key: MonitoringHeaderEnum.SHOW_CLIENT_GROUPS,
            title: translate("monitoringClients.info.groups"),
            options: buildClientGroupOptions(),
            multiple: true,
            testIdSuffix: "groups",
        },
        {
            key: MonitoringHeaderEnum.SHOW_STATES,
            title: translate("monitoringClients.info.clientStates"),
            options: buildClientStateOptions(),
            multiple: true,
            testIdSuffix: "states",
        },
        {
            key: MonitoringHeaderEnum.SHOW_NOTIFCATION,
            title: translate("monitoringClients.info.notifications"),
            options: buildNotificationOptions(),
            multiple: true,
            testIdSuffix: "notifications",
        },
        {
            key: MonitoringHeaderEnum.SHOW_INDICATORS,
            title: translate("monitoringClients.info.indicators"),
            options: buildIndicatorOptions(),
            multiple: true,
            testIdSuffix: "indicators",
        },
    ]);

    function buildClientGroupOptions(): FilterOption[] {
        const clientGroups =
            monitoringStore.monitoringOverviewData?.clientGroups ?? [];

        return clientGroups.map((clientGroup) => ({
            value: clientGroup.id.toString(),
            label: clientGroup.name,
        }));
    }

    // mirrors the previous chip visibility rules: hide the whole section
    // while there are no connections at all, and hide states without
    // connections unless the state is currently part of the filter query
    function buildClientStateOptions(): FilterOption[] {
        const clientStates =
            monitoringStore.monitoringOverviewData?.clientStates;
        if (clientStates == null || clientStates.total === 0) {
            return [];
        }

        const selectedStates = parseFilterValues(
            filterValues.value[MonitoringHeaderEnum.SHOW_STATES],
        );

        return Object.entries(clientStates)
            .filter(
                ([state, amount]) =>
                    state !== "total" &&
                    (amount !== 0 || selectedStates.includes(state)),
            )
            .map(([state, amount]) => ({
                value: state,
                label: translate(state),
                color: getConnectionStatusColor(state),
                count: amount,
            }));
    }

    function buildNotificationOptions(): FilterOption[] {
        const notifications =
            monitoringStore.monitoringOverviewData?.notifications ?? {};

        return Object.keys(notifications)
            .filter((notification) => notification !== "total")
            .map((notification) => ({
                value: notification,
                label: translate(notification),
            }));
    }

    function buildIndicatorOptions(): FilterOption[] {
        const indicators =
            monitoringStore.monitoringOverviewData?.indicators ?? {};

        return Object.keys(indicators).map((indicator) => ({
            value: indicator,
            label: translate(indicator),
        }));
    }

    // FiltersBar and the pill row both change exactly one option per update,
    // so the single toggled value can be derived by diffing and delegated to
    // the existing query param toggle in useMonitoringNavigation
    function applyFilterValues(next: TableFilters) {
        for (const filterKey of FILTER_KEYS) {
            const currentValues = parseFilterValues(
                filterValues.value[filterKey],
            );
            const nextValues = parseFilterValues(next[filterKey]);

            const toggledValue =
                nextValues.find((value) => !currentValues.includes(value)) ??
                currentValues.find((value) => !nextValues.includes(value));

            if (toggledValue !== undefined) {
                useMonitoringNavigation.applyFilter(
                    route.query,
                    filterKey,
                    toggledValue,
                );
                return;
            }
        }
    }

    function clearAllFilters() {
        useMonitoringNavigation.applyShowAllFilter();
    }

    return {
        filterValues,
        filterSections,
        applyFilterValues,
        clearAllFilters,
    };
}
