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

export const getAssessmentTool = async (id: number): Promise<AssessmentTool> =>
    (await newApiService.getRequest(`${baseUrl}/${id}`)).data;

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

export const deleteAssessmentTool = async (
    assessmentToolId: string,
): Promise<undefined | null> =>
    (await newApiService.deleteRequest(`${baseUrl}/${assessmentToolId}`)).data;

export const createAssessmentTool = async (
    assessmentTool: CreateAssessmentToolPar,
): Promise<AssessmentTool> =>
    (
        await newApiService.postRequest(baseUrl, assessmentTool, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        })
    ).data;

export const editAssessmentTool = async (
    assessmentTool: UpdateAssessmentToolPar,
): Promise<AssessmentTool> =>
    (await newApiService.putRequest(baseUrl, assessmentTool)).data;
