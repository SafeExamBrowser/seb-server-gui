import { type Page } from "@playwright/test";
import { assessmentToolFormConfig } from "@/pages/(app)/assessment-tool/assessmentToolFormConfig.ts";
import { AssessmentToolFormModel } from "./assessment-tool-form.model";

// A mocked (not seeded) id used by the hydrate/save/cancel specs, distinct from the seeded
// list ids the read spec relies on.
export const EDIT_TOOL_ID = 9999;

// The edit PUT and the list GET share the `/lms-setup` path, so any route or wait built on
// this regex MUST be guarded by method (`PUT`).
export const ASSESSMENT_TOOL_SAVE_REQUEST = /\/lms-setup(?:$|\?)/i;

export const assessmentToolByIdRequest = (id: string | number) =>
    new RegExp(`/lms-setup/${id}(?:$|\\?)`, "i");

export class AssessmentToolEditModel extends AssessmentToolFormModel {
    constructor(page: Page, id: string | number = EDIT_TOOL_ID) {
        super(
            page,
            assessmentToolFormConfig.editTestPrefix,
            assessmentToolFormConfig.editRoute(id),
        );
    }
}
