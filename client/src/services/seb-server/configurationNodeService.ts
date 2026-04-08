import * as apiService from "@/services/apiService";
import {
    ConfigurationTemplateName,
    ConfigurationTemplateKey,
} from "@/models/seb-server/configurationNode";

const baseUrl = "/configuration-node" as const;

export const getConfigurationTemplateNamesActive = async (): Promise<
    ConfigurationTemplateName[]
> =>
    (
        await apiService.getRequest({
            url: `${baseUrl}/names`,
            options: {
                _authType: "seb",
                params: { type: "TEMPLATE", active: "true" },
            },
        })
    ).data;

export const getConfigurationTemplateName = async (
    id: string,
): Promise<ConfigurationTemplateKey> =>
    (
        await apiService.getRequest({
            url: `${baseUrl}/${id}`,
            options: {
                _authType: "seb",
                params: {},
            },
        })
    ).data;
