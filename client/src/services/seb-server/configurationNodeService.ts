import * as apiService from "@/services/apiService";
import {
    ConfigurationTemplateName,
    ConfigurationTemplateKey,
    SEBSettingsImport,
    ConfigurationKey,
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

export const importSEBSettings = async (
    settingsImport: SEBSettingsImport,
): Promise<ConfigurationKey> =>
    (
        await apiService.postRequest({
            url: `${baseUrl}/${settingsImport.configurationTemplateId}/import`,
            data: settingsImport.file,
            options: {
                _authType: "seb",
                headers: {
                    "Content-Type": "application/octet-stream",
                    importFile: settingsImport.fileName,
                    ...(settingsImport.password
                        ? { importFilePassword: settingsImport.password }
                        : {}),
                    ...(settingsImport.quitPassword
                        ? { quitPassword: settingsImport.quitPassword }
                        : {}),
                },
            },
        })
    ).data;
