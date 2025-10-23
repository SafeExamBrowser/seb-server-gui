import * as apiService from "@/services/apiService";
import { StorageItemEnum } from "@/models/StorageItemEnum";
import {
    AssessmentTool,
    AssessmentToolsResponse,
    CreateAssessmentToolPar,
    OptionalParGetAssessmentTool,
    UpdateAssessmentToolPar,
} from "@/models/seb-server/assessmentTool";

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

export async function getAssessmentTools(
    optionalParameters?: OptionalParGetAssessmentTool,
): Promise<AssessmentToolsResponse> {
    const url: string = assessmentToolUrl;
    return (
        await apiService.api.get(url, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
            params: { optionalParameters },
        })
    ).data;
}

export async function activateAssessmentTool(
    assessmentToolId: string,
): Promise<AssessmentTool> {
    const url: string = assessmentToolUrl + "/" + assessmentToolId + "/active";
    return (
        await apiService.api.post(url, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
        })
    ).data;
}

export async function deactivateAssessmentTool(
    assessmentToolId: string,
): Promise<AssessmentTool> {
    const url: string =
        assessmentToolUrl + "/" + assessmentToolId + "/inactive";
    return (
        await apiService.api.post(url, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
        })
    ).data;
}

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
