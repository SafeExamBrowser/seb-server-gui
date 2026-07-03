export const STATUS_FILTER = {
    key: "status",
    testIdSuffix: "statusFilter",
    values: ["Active", "Inactive"],
} as const;

export const INSTITUTION_FILTER = {
    key: "institutionId",
    testIdSuffix: "institutionFilter",
} as const;

export const LMS_TYPE_FILTER = {
    key: "selectedType",
    testIdSuffix: "lmsTypeFilter",
} as const;

export type StatusFilterValue = (typeof STATUS_FILTER.values)[number];
