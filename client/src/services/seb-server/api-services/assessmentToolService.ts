import * as newApiService from "@/services/newApiService";
import * as apiService from "@/services/apiService";
import { StorageItemEnum } from "@/models/StorageItemEnum";
import {
    AssessmentTool,
    AssessmentToolsResponse,
    CreateAssessmentToolPar,
    OptionalParGetAssessmentTool,
    UpdateAssessmentToolPar,
} from "@/models/seb-server/assessmentTool";
const baseUrl = "/lms-setup" as const;

const assessmentToolUrl: string = "/assessment-tools";

export async function getAssessmentToolsActive(): Promise<AssessmentToolsResponse> {
    const url: string = assessmentToolUrl + "/active";
    return (
        await apiService.api.get(url, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
        })
    ).data;
}

export async function getAssessmentTool(id: number): Promise<AssessmentTool> {
    const url: string = "/get-assessment-tool/" + id;
    return (
        await apiService.api.get(url, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
        })
    ).data;
}

export const getAssessmentTools = async (
    optionalParameters?: OptionalParGetAssessmentTool,
): Promise<AssessmentToolsResponse> =>
    (await newApiService.getRequest(baseUrl, { params: optionalParameters }))
        .data;

export const activateAssessmentTool = async (
    assessmentToolId: string,
): Promise<AssessmentTool> =>
    (
        await newApiService.postRequest(
            `${baseUrl}/${assessmentToolId}/active`,
            {},
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            },
        )
    ).data;

export const deactivateAssessmentTool = async (
    assessmentToolId: string,
): Promise<AssessmentTool> =>
    (
        await newApiService.postRequest(
            `${baseUrl}/${assessmentToolId}/inactive`,
            {},
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            },
        )
    ).data;

export async function deleteAssessmentTool(
    assessmentToolId: string,
): Promise<undefined | null> {
    return (
        await apiService.api.delete(
            assessmentToolUrl + "/" + assessmentToolId,
            { headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN) },
        )
    ).data;
}

export async function createAssessmentTool(
    assessmentTool: CreateAssessmentToolPar,
): Promise<AssessmentTool> {
    return (
        await apiService.api.post(assessmentToolUrl, assessmentTool, {
            headers: apiService.getPostHeaders(StorageItemEnum.ACCESS_TOKEN),
        })
    ).data;
}

export async function editAssessmentTool(
    assessmentTool: UpdateAssessmentToolPar,
): Promise<AssessmentTool> {
    return (
        await apiService.api.put(assessmentToolUrl, assessmentTool, {
            headers: apiService.getPutHeaders(StorageItemEnum.ACCESS_TOKEN),
        })
    ).data;
}
