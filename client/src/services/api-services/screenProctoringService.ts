import * as apiService from "@/services/api-services/apiService";

export async function saveScreenProctoringSettings(id: string, screenProctoringSettings: ScreenProctoringSettings): Promise<Exam | null>{
    const url: string = "/exam/" + id + "/screen-proctoring";
    return (await apiService.api.post(url, screenProctoringSettings, {headers: apiService.getPostHeaders()})).data;
}