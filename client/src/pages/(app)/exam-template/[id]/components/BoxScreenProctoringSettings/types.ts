import { ScreenProctoringCollectionStrategy } from "@/models/seb-server/screenProctoring.ts";

export type ScreenProctoringSelection = {
    enabled: boolean;
    collectionStrategy?: ScreenProctoringCollectionStrategy;
};
