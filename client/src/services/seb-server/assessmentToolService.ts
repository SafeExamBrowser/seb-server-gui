import * as apiService from "@/services/apiService";
import {
    AssessmentTool,
    AssessmentToolsResponse,
    CreateAssessmentToolPar,
    OptionalParGetAssessmentTool,
    UpdateAssessmentToolPar,
} from "@/models/seb-server/assessmentTool";
const baseUrl = "/lms-setup" as const;

export const getAssessmentToolsActive =
    async (): Promise<AssessmentToolsResponse> =>
        (await apiService.getRequest(baseUrl + "/active")).data;

export const getAssessmentTool = async (id: number): Promise<AssessmentTool> =>
    (await apiService.getRequest(`${baseUrl}/${id}`)).data;

export const getAssessmentTools = async (
    optionalParameters?: OptionalParGetAssessmentTool,
): Promise<AssessmentToolsResponse> =>
    (await apiService.getRequest(baseUrl, { params: optionalParameters })).data;

export const activateAssessmentTool = async (
    assessmentToolId: string,
): Promise<AssessmentTool> =>
    (await apiService.postRequest(`${baseUrl}/${assessmentToolId}/active`))
        .data;

export const deactivateAssessmentTool = async (
    assessmentToolId: string,
): Promise<AssessmentTool> =>
    (await apiService.postRequest(`${baseUrl}/${assessmentToolId}/inactive`))
        .data;

export const deleteAssessmentTool = async (
    assessmentToolId: string,
): Promise<undefined | null> =>
    (await apiService.deleteRequest(`${baseUrl}/${assessmentToolId}`)).data;

export const createAssessmentTool = async (
    assessmentTool: CreateAssessmentToolPar,
): Promise<AssessmentTool> =>
    (await apiService.postRequest(baseUrl, assessmentTool)).data;

export const editAssessmentTool = async (
    assessmentTool: UpdateAssessmentToolPar,
): Promise<AssessmentTool> =>
    (await apiService.putRequest(baseUrl, assessmentTool)).data;
