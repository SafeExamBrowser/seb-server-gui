import * as apiService from "@/services/apiService";
import { ConfigurationTemplateName } from "@/models/seb-server/configurationNode";

const baseUrl = "/configuration-node" as const;

export const getConfigurationTemplateNamesActive = async (): Promise<
    ConfigurationTemplateName[]
> =>
    (
        await apiService.getRequest({
            url: `${baseUrl}/names`,
            options: {
                params: { type: "TEMPLATE", active: "true" },
            },
        })
    ).data;
