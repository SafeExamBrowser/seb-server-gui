import * as newApiService from "@/services/newApiService";

import * as apiService from "@/services/apiService";
import { StorageItemEnum } from "@/models/StorageItemEnum";
import { ScreenProctoringSettings } from "@/models/seb-server/screenProctoring";
import { Exam } from "@/models/seb-server/exam";

export async function saveScreenProctoringSettings(
    id: string,
    screenProctoringSettings: ScreenProctoringSettings,
): Promise<Exam | null> {
    const url: string = "/exam/" + id + "/screen-proctoring";
    return (
        await apiService.api.post(url, screenProctoringSettings, {
            headers: apiService.getPostHeaders(StorageItemEnum.ACCESS_TOKEN),
        })
    ).data;
}

export const applyScreenProctoringGroups = async (
    id: string,
    spsSEBGroupsSelection: string,
): Promise<Exam | null> =>
    (
        await newApiService.postRequest(
            `/exam/${id}/screen-proctoring/apply-groups`,
            { spsSEBGroupsSelection },
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            },
        )
    ).data;

export async function activateScreenProctoring(
    id: string,
    enableScreenProctoring: boolean,
): Promise<Exam | null> {
    const url: string = "/exam/" + id + "/screen-proctoring/activation";
    return (
        await apiService.api.post(
            url,
            {},
            {
                headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
                params: { enableScreenProctoring },
            },
        )
    ).data;
}
