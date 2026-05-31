import { computed, ref, toValue, type MaybeRefOrGetter } from "vue";
import type { FilterOption, FilterSectionDef } from "./filterTypes.ts";
import type { TableFilters } from "@/components/widgets/entity-table/types.ts";

export type ActiveFilterPill = {
    sectionKey: string;
    testIdSuffix: string;
    option: FilterOption;
};

// Sentinel section keys so the search term and the date can travel through the
// same "active filter pill" pipeline as the real filter sections and be routed
// back to the right clear action when their pill is removed.
export const SEARCH_PILL_KEY = "__search__";
export const DATE_PILL_KEY = "__date__";

type SearchConfig = {
    // The *applied* search term (what the table is currently filtered by), not
    // the in-progress text in the box.
    applied: MaybeRefOrGetter<string | null | undefined>;
    clear: () => unknown;
};

type DateConfig = {
    value: MaybeRefOrGetter<Date | null | undefined>;
    clear: () => unknown;
    format?: (value: Date) => string;
};

type ListFilterPanelOptions = {
    search: SearchConfig;
    filterSections?: MaybeRefOrGetter<FilterSectionDef[]>;
    selectedFilters?: MaybeRefOrGetter<TableFilters>;
    setFilters?: (filters: TableFilters) => unknown;
    date?: DateConfig;
    initiallyOpen?: boolean;
};

function defaultDateFormat(value: Date) {
    return value.toLocaleDateString();
}

// Owns the shared "filter panel" state for list pages: whether the filter
// sidebar is open and the active filters as removable pills. The agreed model
// treats the search term and the date as filters too, so they render as pills
// alongside the filter sections and feed the same count. Removing a pill routes
// to the matching clear action (search / date / a single filter section).
export function useListFilterPanel(options: ListFilterPanelOptions) {
    const filtersOpen = ref(options.initiallyOpen ?? true);

    const activePills = computed<ActiveFilterPill[]>(() => {
        const pills: ActiveFilterPill[] = [];

        const search = toValue(options.search.applied);
        if (search) {
            pills.push({
                sectionKey: SEARCH_PILL_KEY,
                testIdSuffix: "search",
                option: { value: search, label: search, color: "primary" },
            });
        }

        const filterValues = toValue(options.selectedFilters) ?? {};
        for (const section of toValue(options.filterSections) ?? []) {
            const value = filterValues[section.key];
            if (!value) {
                continue;
            }
            const option = section.options.find((o) => o.value === value);
            if (option) {
                pills.push({
                    sectionKey: section.key,
                    testIdSuffix: section.testIdSuffix ?? section.key,
                    option,
                });
            }
        }

        const date = options.date ? toValue(options.date.value) : undefined;
        if (date) {
            const format = options.date?.format ?? defaultDateFormat;
            pills.push({
                sectionKey: DATE_PILL_KEY,
                testIdSuffix: "date",
                option: {
                    value: String(date.getTime()),
                    label: format(date),
                    color: "primary",
                },
            });
        }

        return pills;
    });

    function onRemovePill(sectionKey: string) {
        if (sectionKey === SEARCH_PILL_KEY) {
            void options.search.clear();
            return;
        }
        if (sectionKey === DATE_PILL_KEY) {
            void options.date?.clear();
            return;
        }
        const current = toValue(options.selectedFilters) ?? {};
        const next: TableFilters = Object.fromEntries(
            Object.entries(current).filter(([key]) => key !== sectionKey),
        );
        void options.setFilters?.(next);
    }

    return { filtersOpen, activePills, onRemovePill };
}
