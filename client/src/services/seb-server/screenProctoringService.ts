import * as apiService from "@/services/apiService";

import { Exam } from "@/models/seb-server/exam";

export const applyScreenProctoringGroups = async (
    id: string,
    spsSEBGroupsSelection: string,
): Promise<Exam | null> =>
    (
        await apiService.postRequest({
            url: `/exam/${id}/screen-proctoring/apply-groups`,
            data: { spsSEBGroupsSelection },
        })
    ).data;

export const activateScreenProctoring = async (
    id: string,
    enableScreenProctoring: boolean,
): Promise<Exam | null> =>
    (
        await apiService.postRequest({
            url: `/exam/${id}/screen-proctoring/activation`,
            data: {},
            options: { params: { enableScreenProctoring } },
        })
    ).data;
