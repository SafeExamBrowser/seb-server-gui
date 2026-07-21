import * as apiService from "@/services/apiService";
import {
    ConfigurationNodeInfo,
    ConfigurationTemplateKey,
    SEBSettingsImport,
    ConfigurationKey,
} from "@/models/seb-server/configurationNode";

const baseUrl = "/configuration-node" as const;

export const getConfigurationNode = async (
    id: string,
): Promise<ConfigurationNodeInfo> =>
    (
        await apiService.getRequest({
            url: `${baseUrl}/${id}`,
            options: {
                _authType: "seb",
                params: {},
            },
        })
    ).data;

export const getConfigurationTemplate = async (
    id: string,
): Promise<ConfigurationTemplateKey> => getConfigurationNode(id);

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

export const exportSEBSettings = async (
    configTemplateId: string,
): Promise<Blob> =>
    (
        await apiService.getRequest({
            url: `${baseUrl}/${configTemplateId}/downloadSettings`,
            options: {
                _authType: "seb",
                responseType: "blob",
                headers: {
                    accept: "application/octet-stream",
                },
            },
        })
    ).data;
