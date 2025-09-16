import * as groupService from "@/services/screen-proctoring/api-services/groupService";

//= ============api==============
export async function getGroups(
    optionalParameters?: OptionalParGroups,
): Promise<GroupObject | null> {
    try {
        return await groupService.getGroups(optionalParameters);
    } catch (error) {
        return null;
    }
}
