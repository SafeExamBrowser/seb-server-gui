import * as apiService from "@/services/apiService";
import type {
    AssessmentTool,
    AssessmentToolsResponse,
} from "@/models/seb-server/assessmentTool.ts";

// Cross-domain assessment-tool (LMS setup) lookups still consumed by the not-yet-migrated
// exam / exam-template domains. Kept on the legacy apiService boundary until those domains
// migrate (directive principle 8); the assessment-tool domain's own surface uses the
// generated SDK via assessmentToolService.ts.
const baseUrl = "/lms-setup" as const;

export const getAssessmentToolsActive =
    async (): Promise<AssessmentToolsResponse> =>
        (
            await apiService.getRequest({
                url: baseUrl + "/active",
                options: { _authType: "seb" },
            })
        ).data;

export const getAssessmentTool = async (id: number): Promise<AssessmentTool> =>
    (
        await apiService.getRequest({
            url: `${baseUrl}/${id}`,
            options: { _authType: "seb" },
        })
    ).data;
