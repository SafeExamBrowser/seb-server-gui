import { computed, ref, toValue, type MaybeRefOrGetter } from "vue";
import type { FilterOption, FilterSectionDef } from "./filterTypes.ts";
import { parseFilterValues, removeFilterValue } from "./filterValues.ts";
import type { TableFilters } from "@/components/widgets/entity-table/types.ts";

export type ActiveFilterPill = {
    sectionKey: string;
    testIdSuffix: string;
    option: FilterOption;
};

export const SEARCH_PILL_KEY = "__search__";
export const DATE_PILL_KEY = "__date__";

type SearchConfig = {
    applied: MaybeRefOrGetter<string | undefined>;
    clear: () => unknown;
};

type DateConfig = {
    value: MaybeRefOrGetter<Date | null | undefined>;
    clear: () => unknown;
    format?: (value: Date) => string;
};

type ListFilterPanelOptions = {
    search?: SearchConfig;
    filterSections?: MaybeRefOrGetter<FilterSectionDef[]>;
    selectedFilters?: MaybeRefOrGetter<TableFilters>;
    setFilters?: (filters: TableFilters) => unknown;
    date?: DateConfig;
    initiallyOpen?: boolean;
};

function defaultDateFormat(value: Date) {
    return value.toLocaleDateString();
}

export function useListFilterPanel(options: ListFilterPanelOptions) {
    const filtersOpen = ref(options.initiallyOpen ?? true);

    const activePills = computed<ActiveFilterPill[]>(() => {
        const pills: ActiveFilterPill[] = [];

        const search = toValue(options.search?.applied);
        if (search) {
            pills.push({
                sectionKey: SEARCH_PILL_KEY,
                testIdSuffix: "search",
                option: { value: search, label: search, color: "primary" },
            });
        }

        const filterValues = toValue(options.selectedFilters) ?? {};
        for (const section of toValue(options.filterSections) ?? []) {
            const selectedValues = parseFilterValues(filterValues[section.key]);
            for (const selectedValue of selectedValues) {
                const option = section.options.find(
                    (o) => o.value === selectedValue,
                );
                if (option) {
                    pills.push({
                        sectionKey: section.key,
                        testIdSuffix: section.testIdSuffix ?? section.key,
                        option,
                    });
                }
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

    function onRemovePill(sectionKey: string, optionValue?: string) {
        if (sectionKey === SEARCH_PILL_KEY) {
            void options.search?.clear();
            return;
        }
        if (sectionKey === DATE_PILL_KEY) {
            void options.date?.clear();
            return;
        }
        const current = toValue(options.selectedFilters) ?? {};
        const next: TableFilters = {
            ...current,
            [sectionKey]:
                optionValue !== undefined
                    ? removeFilterValue(current[sectionKey], optionValue)
                    : undefined,
        };
        void options.setFilters?.(next);
    }

    return { filtersOpen, activePills, onRemovePill };
}
