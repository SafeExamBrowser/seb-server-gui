// Text filters offered by the search form, in the order their chips appear in
// the controls row.
export const SP_SEARCH_FILTER_KEYS = [
    "examName",
    "groupName",
    "loginName",
    "ipAddress",
    "machineName",
    "metadataApplication",
    "metadataBrowserTitle",
    "metadataActivityDetails",
    "metadataWindowTitle",
] as const;

export type SpSearchFilterKey = (typeof SP_SEARCH_FILTER_KEYS)[number];

export type SpSearchFilters = Record<SpSearchFilterKey, string>;

// Payload emitted by the search form when the user runs a search. `summary` is
// the human readable label shown as the active time-range chip; it is empty
// while no time mode is selected.
export type SpSearchQuery = {
    filters: SpSearchFilters;
    fromTime: string;
    toTime: string;
    summary: string;
};
