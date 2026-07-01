export const INSTITUTION_COLUMN = {
    logoImage: "logoImage",
    name: "name",
    urlSuffix: "urlSuffix",
    active: "active",
} as const;

export const institutionListConfig = {
    testIdBase: "institutions",
    route: "/institution",
    itemKey: "id",
} as const;
