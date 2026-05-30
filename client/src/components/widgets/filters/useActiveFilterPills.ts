import { computed, toValue, type MaybeRefOrGetter } from "vue";
import type { FilterOption, FilterSectionDef } from "./filterTypes.ts";

export type ActiveFilterPill = {
    sectionKey: string;
    testIdSuffix: string;
    option: FilterOption;
};

// Derives the list of currently-selected filter options (one per section that
// has a value) so they can be rendered as removable chips.
export function useActiveFilterPills(
    sections: MaybeRefOrGetter<FilterSectionDef[]>,
    filterValues: MaybeRefOrGetter<Record<string, string | null>>,
) {
    return computed<ActiveFilterPill[]>(() => {
        const pills: ActiveFilterPill[] = [];
        for (const section of toValue(sections)) {
            const value = toValue(filterValues)[section.key];
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
        return pills;
    });
}
