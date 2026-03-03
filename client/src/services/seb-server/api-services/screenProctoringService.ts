import * as apiService from "@/services/apiService";

import { Exam } from "@/models/seb-server/exam";

export const applyScreenProctoringGroups = async (
    id: string,
    spsSEBGroupsSelection: string,
): Promise<Exam | null> =>
    (
        await apiService.postRequest(
            `/exam/${id}/screen-proctoring/apply-groups`,
            { spsSEBGroupsSelection },
        )
    ).data;

export const activateScreenProctoring = async (
    id: string,
    enableScreenProctoring: boolean,
): Promise<Exam | null> =>
    (
        await apiService.postRequest(
            `/exam/${id}/screen-proctoring/activation`,
            {},
            { params: { enableScreenProctoring } },
        )
    ).data;
