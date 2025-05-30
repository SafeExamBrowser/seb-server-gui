import * as constants from "../../utils/constants";
import * as apiService from "./api.service";

export async function getInstitutions(): Promise<[object, number]> {
    const { data, status } = await apiService.api.get(constants.ADMIN_INSTITUTION_INFO_ROUTE);
    return [data, status];
}
