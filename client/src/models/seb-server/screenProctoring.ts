import i18n from "@/i18n";
import { ExamAttribute } from "@/models/seb-server/examTemplate.ts";

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

type ScreenProctoringExamAttributes = Pick<
    ExamAttribute,
    "enableScreenProctoring" | "spsCollectingGroupName"
>;

export const buildScreenProctoringExamAttributes = (
    enabled: boolean,
): ScreenProctoringExamAttributes => {
    if (!enabled) {
        return {
            enableScreenProctoring: "false",
            spsCollectingGroupName: undefined,
        };
    }

    return {
        enableScreenProctoring: "true",
        spsCollectingGroupName: i18n.global.t(
            "clientGroups.screenProctoringFallbackGroupName",
        ),
    };
};

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
