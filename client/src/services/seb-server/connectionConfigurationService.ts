import { heySebServerClient as client } from "@/api/seb-server/http/heySebServerClient.ts";
import {
    activateSebClientConfig as activateSebClientConfigSdk,
    createSebClientConfig as createSebClientConfigSdk,
    deactivateSebClientConfig as deactivateSebClientConfigSdk,
    deleteSebClientConfig as deleteSebClientConfigSdk,
    editSebClientConfig as editSebClientConfigSdk,
    getSebClientConfigById as getSebClientConfigByIdSdk,
    getSebClientConfigs as getSebClientConfigsSdk,
} from "@/api/seb-server/generated/hey-api/sdk.gen.ts";
import {
    connectionConfigurationCreateSchema,
    connectionConfigurationEditSchema,
    connectionConfigurationPageSchema,
    connectionConfigurationSchema,
    type ConnectionConfiguration,
    type ConnectionConfigurationCreateRequest,
    type ConnectionConfigurationEditRequest,
    type ConnectionConfigurationPage,
} from "@/models/connectionConfiguration.ts";
import { decodeWire, encodeWire } from "@/services/errors/wireCodec.ts";
import { zEntityProcessingReport } from "@/api/seb-server/generated/hey-api/zod.gen.ts";
import type {
    EntityProcessingReport,
    GetSebClientConfigsData,
} from "@/api/seb-server/generated/hey-api/types.gen.ts";

export const getConnectionConfigurations = (
    query?: GetSebClientConfigsData["query"],
): Promise<ConnectionConfigurationPage> =>
    getSebClientConfigsSdk({ client, query }).then(({ data }) =>
        decodeWire(connectionConfigurationPageSchema, data),
    );

export const getConnectionConfigurationById = (
    modelId: string,
): Promise<ConnectionConfiguration> =>
    getSebClientConfigByIdSdk({
        client,
        path: { modelId },
    }).then(({ data }) => decodeWire(connectionConfigurationSchema, data));

export const createConnectionConfiguration = (
    body: ConnectionConfigurationCreateRequest,
): Promise<ConnectionConfiguration> =>
    createSebClientConfigSdk({
        client,
        body: encodeWire(connectionConfigurationCreateSchema, body),
    }).then(({ data }) => decodeWire(connectionConfigurationSchema, data));

export const editConnectionConfiguration = (
    body: ConnectionConfigurationEditRequest,
): Promise<ConnectionConfiguration> =>
    editSebClientConfigSdk({
        client,
        body: encodeWire(connectionConfigurationEditSchema, body),
    }).then(({ data }) => decodeWire(connectionConfigurationSchema, data));

export const deleteConnectionConfiguration = (
    modelId: string,
): Promise<EntityProcessingReport> =>
    deleteSebClientConfigSdk({ client, path: { modelId } }).then(({ data }) =>
        decodeWire(zEntityProcessingReport, data),
    );

export const activateConnectionConfiguration = (
    modelId: string,
): Promise<EntityProcessingReport> =>
    activateSebClientConfigSdk({ client, path: { modelId } }).then(({ data }) =>
        decodeWire(zEntityProcessingReport, data),
    );

export const deactivateConnectionConfiguration = (
    modelId: string,
): Promise<EntityProcessingReport> =>
    deactivateSebClientConfigSdk({ client, path: { modelId } }).then(
        ({ data }) => decodeWire(zEntityProcessingReport, data),
    );
