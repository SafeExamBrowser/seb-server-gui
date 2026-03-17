import * as apiService from "@/services/apiService";
import { ConfigurationTemplateName } from "@/models/seb-server/configurationNode";

const baseUrl = "/configuration-node" as const;

export const getConfigurationTemplateNamesActive = async (): Promise<
    ConfigurationTemplateName[]
> =>
    (
        await apiService.getRequest(`${baseUrl}/names`, {
            params: { type: "TEMPLATE", active: "true" },
        })
    ).data;
