import * as newApiService from "@/services/newApiService";

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

export const activateScreenProctoring = async (
    id: string,
    enableScreenProctoring: boolean,
): Promise<Exam | null> =>
    (
        await newApiService.postRequest(
            `/exam/${id}/screen-proctoring/activation`,
            {},
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                params: { enableScreenProctoring },
            },
        )
    ).data;
