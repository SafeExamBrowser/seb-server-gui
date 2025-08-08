import * as constants from "../../utils/constants";
import * as apiService from "./api.service";
import {ADMIN_INSTITUTION_LOGO_ROUTE} from "../../utils/constants";

export async function getInstitutions(): Promise<[object, number]> {
    const { data, status } = await apiService.api.get(constants.ADMIN_INSTITUTION_INFO_ROUTE);
    return [data, status];
}


export async function getInstitutionLogo(suffix: string): Promise<[object, number]> {
    console.log("suffix + " ,suffix);
    const { data, status } = await apiService.api.get(constants.ADMIN_INSTITUTION_LOGO_ROUTE + "/"+ suffix);
    return [data, status];
}