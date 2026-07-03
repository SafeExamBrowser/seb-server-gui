import { type Page } from "@playwright/test";
import { assessmentToolFormConfig } from "@/pages/(app)/assessment-tool/assessmentToolFormConfig.ts";
import {
    AssessmentToolFormModel,
    type AssessmentToolMainInput,
} from "./assessment-tool-form.model";

// The create POST and the list GET share the `/lms-setup` path, so any route or wait built
// on this regex MUST be guarded by method (`POST`).
export const ASSESSMENT_TOOL_CREATE_REQUEST = /\/lms-setup(?:$|\?)/i;

export class AssessmentToolCreateModel extends AssessmentToolFormModel {
    constructor(page: Page) {
        super(
            page,
            assessmentToolFormConfig.createTestPrefix,
            assessmentToolFormConfig.createRoute,
        );
    }

    async fillForm(input: AssessmentToolMainInput) {
        await this.fillMain(input);
    }
}
