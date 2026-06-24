import * as apiService from "@/services/apiService";
import {
    AssessmentTool,
    AssessmentToolsResponse,
    AssessmentToolTestResult,
    CreateAssessmentToolPar,
    OptionalParGetAssessmentTool,
    UpdateAssessmentToolPar,
} from "@/models/seb-server/assessmentTool";
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

export const getAssessmentTools = async (
    optionalParameters?: OptionalParGetAssessmentTool,
): Promise<AssessmentToolsResponse> =>
    (
        await apiService.getRequest({
            url: baseUrl,
            options: { _authType: "seb", params: optionalParameters },
        })
    ).data;

export const activateAssessmentTool = async (
    assessmentToolId: string,
): Promise<AssessmentTool> =>
    (
        await apiService.postRequest({
            url: `${baseUrl}/${assessmentToolId}/active`,
            options: { _authType: "seb" },
        })
    ).data;

export const deactivateAssessmentTool = async (
    assessmentToolId: string,
): Promise<AssessmentTool> =>
    (
        await apiService.postRequest({
            url: `${baseUrl}/${assessmentToolId}/inactive`,
            options: { _authType: "seb" },
        })
    ).data;

export const deleteAssessmentTool = async (
    assessmentToolId: string,
): Promise<undefined | null> =>
    (
        await apiService.deleteRequest({
            url: `${baseUrl}/${assessmentToolId}`,
            options: { _authType: "seb" },
        })
    ).data;

export const createAssessmentTool = async (
    assessmentTool: CreateAssessmentToolPar,
): Promise<AssessmentTool> =>
    (
        await apiService.postRequest({
            url: baseUrl,
            data: assessmentTool,
            options: { _authType: "seb" },
        })
    ).data;

export const editAssessmentTool = async (
    assessmentTool: UpdateAssessmentToolPar,
): Promise<AssessmentTool> =>
    (
        await apiService.putRequest({
            url: baseUrl,
            data: assessmentTool,
            options: { _authType: "seb" },
        })
    ).data;

export const testAssessmentTool = async (
    assessmentToolId: string,
): Promise<AssessmentToolTestResult> =>
    (
        await apiService.getRequest({
            url: `${baseUrl}/test/${assessmentToolId}`,
            options: { _authType: "seb" },
        })
    ).data;
