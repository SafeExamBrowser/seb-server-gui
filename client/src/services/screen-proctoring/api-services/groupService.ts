import * as newApiService from "@/services/newApiService";
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
        await newApiService.getRequest(baseUrl, {
            params: optionalParameters,
        })
    ).data;

export const getGroupByUuid = async (
    uuid: string,
    optionalParameters?: OptionalParGroupByUuid,
): Promise<GroupUuid> =>
    (
        await newApiService.getRequest(`${baseUrl}/${uuid}`, {
            params: optionalParameters,
        })
    ).data;
