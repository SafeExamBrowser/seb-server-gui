import type {
    AssessmentTool,
    AssessmentToolsResponse,
} from "@/models/seb-server/assessmentTool.ts";
import * as apiService from "@/services/apiService";

// Cross-domain assessment-tool (LMS setup) lookups still consumed by the not-yet-migrated
// exam / exam-template domains. Kept on the legacy apiService boundary until those domains
// migrate (directive principle 8); the assessment-tool domain's own surface uses the
// generated SDK via assessmentToolService.ts.
const baseUrl = "/lms-setup" as const;

const ALL_TOOLS_PAGE_SIZE = 500;

export const getAssessmentToolsActive =
    async (): Promise<AssessmentToolsResponse> =>
        (
            await apiService.getRequest({
                url: baseUrl + "/active",
                options: {
                    _authType: "seb",
                    params: { page_size: ALL_TOOLS_PAGE_SIZE },
                },
            })
        ).data;

export const getAssessmentTool = async (id: number): Promise<AssessmentTool> =>
    (
        await apiService.getRequest({
            url: `${baseUrl}/${id}`,
            options: { _authType: "seb" },
        })
    ).data;
