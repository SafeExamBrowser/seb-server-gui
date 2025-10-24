import * as groupService from "@/services/screen-proctoring/api-services/groupService";
import { OptionalParGroups } from "@/models/screen-proctoring/optionalParamters";
import { GroupObject } from "@/models/screen-proctoring/group";

//= ============api==============
export async function getGroups(
    optionalParameters?: OptionalParGroups,
): Promise<GroupObject | null> {
    try {
        return await groupService.getGroups(optionalParameters);
    } catch {
        return null;
    }
}
