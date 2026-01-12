import * as newApiService from "@/services/newApiService";
import { ConfigurationTemplateName } from "@/models/seb-server/configurationNode";

const baseUrl = "/configuration-node";

export const getConfigurationTemplateNamesActive = async (): Promise<
    ConfigurationTemplateName[]
> =>
    (
        await newApiService.get(`${baseUrl}/names`, {
            params: { type: "TEMPLATE", active: "true" },
        })
    ).data;
