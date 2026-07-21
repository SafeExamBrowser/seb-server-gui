import { GroupObject, GroupUuid } from "@/models/screen-proctoring/group";
import {
    OptionalParGroupByUuid,
    OptionalParGroups,
} from "@/models/screen-proctoring/optionalParamters";
import * as apiService from "@/services/apiService";

const baseUrl = "/sps/proctoring/group" as const;

export const getGroups = async (
    optionalParameters?: OptionalParGroups,
): Promise<GroupObject> =>
    (
        await apiService.getRequest({
            url: baseUrl,
            options: {
                _authType: "sps",
                params: optionalParameters,
            },
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
                _authType: "sps",
                params: optionalParameters,
            },
        })
    ).data;
