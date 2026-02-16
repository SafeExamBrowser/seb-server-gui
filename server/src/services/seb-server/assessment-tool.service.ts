import * as apiService from "./api.service";
import * as constants from "../../utils/constants";

export async function getAssessmentTool(token: string, id: string): Promise<[object, number]>{
    const url: string =  constants.LMS_SETUP_ROUTE + "/" + id;
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token)});

    return [data, status];
}


export async function getAssessmentToolsActive(token: string, isActive: {}): Promise<[object, number]>{
    const url: string =  constants.LMS_SETUP_ROUTE + "/" + isActive;
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token)});

    return [data, status];
}

export async function deleteAssessmentTool(token: string, id: string): Promise<[object, number]>{
    const url: string =  constants.LMS_SETUP_ROUTE + "/" + id;
    const {data, status} = await apiService.api.delete(url, {headers: apiService.getHeaders(token)});

    return [data, status];
}


export async function createAssessmentTool(token: string, newAssessmentTool: {}): Promise<[object, number]>{
    const {data, status} = await apiService.api.post(constants.LMS_SETUP_ROUTE, apiService.createUrlEncodedBody(newAssessmentTool), {headers: apiService.getHeaders(token)});
    return [data, status];
}



export async function editAssessmentTool(token: string, editedAssessmentToolPars: {}): Promise<[object, number]> {
    const headers = apiService.getPutHeaders(token);
    const { data, status } = await apiService.api.put(
        constants.LMS_SETUP_ROUTE,
        editedAssessmentToolPars,
        { headers }
    );
    return [data, status];
}