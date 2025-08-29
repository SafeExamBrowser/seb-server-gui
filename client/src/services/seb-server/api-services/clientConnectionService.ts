import * as apiService from "@/services/apiService";
import {StorageItemEnum} from "@/models/StorageItemEnum";

const url = "/seb-client-connection"
const listEndpoint = url + "/list";

export async function getClientConnectionList(
    modelIds: number[] | string
): Promise<SebClientConnection[]> {
    const value = Array.isArray(modelIds)
        ? modelIds.join(",")
        : String(modelIds).replace(/\s+/g, "");

    return (
        await apiService.api.get(listEndpoint, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
            params: { modelIds: value },
        })
    ).data;
}
