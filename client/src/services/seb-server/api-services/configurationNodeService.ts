import * as apiService from "@/services/apiService";
import { StorageItemEnum } from "@/models/StorageItemEnum";

const baseUrl = "/configuration-node";

export async function getConfigurationTemplateNamesActive(): Promise<
    ConfigurationTemplateName[]
> {
    const url: string = baseUrl + "/names";
    return (
        await apiService.api.get(url, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
            params: { type: "TEMPLATE", active: "true" },
        })
    ).data;
}
