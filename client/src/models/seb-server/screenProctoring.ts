export const SCREEN_PROCTORING_COLLECTION_STRATEGY = [
    "EXAM",
    "APPLY_SEB_GROUPS",
] as const;

export type ScreenProctoringCollectionStrategy =
    (typeof SCREEN_PROCTORING_COLLECTION_STRATEGY)[number];

export const isScreenProctoringAllowedForGroups = (
    enabled: boolean,
    strategy?: ScreenProctoringCollectionStrategy,
) => enabled && strategy !== "EXAM";

export type ScreenProctoringSettings = {
    id?: number;
    enableScreenProctoring?: boolean;
    spsServiceURL?: string;
    spsAPIKey?: string;
    spsAPISecret?: string;
    spsAccountId?: string;
    spsAccountPassword?: string;
    spsCollectingStrategy?: string;
    spsCollectingGroupName?: string;
    spsCollectingGroupSize?: number;
    spsSEBGroupsSelection?: string;
    bundled?: boolean;
    changeStrategyConfirm?: boolean;
};
