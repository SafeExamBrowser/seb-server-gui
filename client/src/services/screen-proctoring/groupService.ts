import * as apiService from "@/services/apiService";
import {
    OptionalParGroupByUuid,
    OptionalParGroups,
} from "@/models/screen-proctoring/optionalParamters";
import { GroupObject, GroupUuid } from "@/models/screen-proctoring/group";

const baseUrl = "/proctoring/group" as const;

export const getGroups = async (
    optionalParameters?: OptionalParGroups,
): Promise<GroupObject> =>
    (
        await apiService.getRequest({
            url: baseUrl,
            options: {
                params: optionalParameters,
            },
            authType: "sps",
        })
    ).data;

export const getGroupByUuid = async (
    uuid: string,
    optionalParameters?: OptionalParGroupByUuid,
): Promise<GroupUuid> =>
    (
        await apiService.getRequest({
            url: `${baseUrl}/${uuid}`,
            options: {
                params: optionalParameters,
            },
            authType: "sps",
        })
    ).data;
