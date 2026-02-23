import * as newApiService from "@/services/newApiService";

import * as apiService from "@/services/apiService";
import { StorageItemEnum } from "@/models/StorageItemEnum";
import { Exam } from "@/models/seb-server/exam";

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
