import * as apiService from "@/services/apiService";
import { StorageItemEnum } from "@/models/StorageItemEnum";
import {
    OptionalParGroupByUuid,
    OptionalParGroups,
} from "@/models/screen-proctoring/optionalParamters";
import { GroupObject, GroupUuid } from "@/models/screen-proctoring/group";

export async function getGroups(
    optionalParameters?: OptionalParGroups,
): Promise<GroupObject> {
    const url: string = "/sp/group";
    return (
        await apiService.api.get(url, {
            headers: apiService.getHeaders(StorageItemEnum.SP_ACCESS_TOKEN),
            params: { optionalParameters },
        })
    ).data;
}

export async function getGroupByUuid(
    uuid: string,
    optionalParameters?: OptionalParGroupByUuid,
): Promise<GroupUuid> {
    const url: string = "/sp/group/" + uuid;
    return (
        await apiService.api.get(url, {
            headers: apiService.getHeaders(StorageItemEnum.SP_ACCESS_TOKEN),
            params: { optionalParameters },
        })
    ).data;
}
