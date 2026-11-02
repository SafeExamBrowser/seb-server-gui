import {
    TIME_RANGE_QUERY_KEYS,
    timeRangeFromQuery,
    timeRangeToQuery,
} from "@/components/widgets/searches/timeRange/timeRangeQuery";
import type { TimeRangeSelection } from "@/components/widgets/searches/timeRange/types";
import type { SearchQueryValues } from "@/components/widgets/searches/types";
import {
    SP_SEARCH_FILTER_KEYS,
    type SpSearchFilters,
    type SpSearchFormState,
} from "@/pages/(app)/sp-search/types";

// The filters use their own key as URL param. `examName` is also how the
// analyze view hands over an exam name to pre-fill the exam filter.
export const SP_SEARCH_QUERY_KEYS = [
    ...SP_SEARCH_FILTER_KEYS,
    ...TIME_RANGE_QUERY_KEYS,
];

const createEmptyFilters = (): SpSearchFilters => ({
    examName: "",
    groupName: "",
    loginName: "",
    ipAddress: "",
    machineName: "",
    metadataApplication: "",
    metadataBrowserTitle: "",
    metadataActivityDetails: "",
    metadataWindowTitle: "",
});

// No time mode is selected initially; the initial search on mount runs
// unbounded and the user opts into "period" or "between".
const createDefaultTimeRange = (): TimeRangeSelection => ({
    mode: undefined,
    periodAmount: 1,
    periodUnit: 2,
    fromDate: undefined,
    fromTime: "00:00",
    toDate: undefined,
    toTime: "23:59",
});

export const createDefaultFormState = (): SpSearchFormState => ({
    filters: createEmptyFilters(),
    timeRange: createDefaultTimeRange(),
});

export function formStateFromQuery(
    values: SearchQueryValues,
): SpSearchFormState {
    const filters = createEmptyFilters();
    for (const key of SP_SEARCH_FILTER_KEYS) {
        filters[key] = values[key] ?? "";
    }

    return {
        filters,
        timeRange: timeRangeFromQuery(values, createDefaultTimeRange()),
    };
}

export function formStateToQuery(state: SpSearchFormState): SearchQueryValues {
    return {
        ...state.filters,
        ...timeRangeToQuery(state.timeRange),
    };
}
