import * as connectionConfigurationService from "@/services/seb-server/api-services/configurationService";
import {
    ConnectionConfiguration,
    ConnectionConfigurations,
    CreateConnectionConfigurationPar,
    OptionalParGetConnectionConfiguration,
    UpdateConnectionConfigurationPar,
} from "@/models/seb-server/connectionConfiguration";

export async function getConnectionConfiguration(
    id: number,
): Promise<ConnectionConfiguration | null> {
    try {
        return await connectionConfigurationService.getConnectionConfiguration(
            id,
        );
    } catch {
        return null;
    }
}

export async function getConnectionConfigurations(
    optionalParameters?: OptionalParGetConnectionConfiguration,
): Promise<ConnectionConfigurations | null> {
    try {
        return await connectionConfigurationService.getConnectionConfigurations(
            optionalParameters,
        );
    } catch {
        return null;
    }
}

export async function activateConnectionConfiguration(
    id: string,
): Promise<ConnectionConfiguration | null> {
    try {
        return await connectionConfigurationService.activateConnectionConfiguration(
            id,
        );
    } catch {
        return null;
    }
}

export async function deactivateConnectionConfiguration(
    id: string,
): Promise<ConnectionConfiguration | null> {
    try {
        return await connectionConfigurationService.deactivateConnectionConfiguration(
            id,
        );
    } catch {
        return null;
    }
}

export async function deleteConnectionConfiguration(
    id: string,
): Promise<undefined | null> {
    try {
        return await connectionConfigurationService.deleteConnectionConfiguration(
            id,
        );
    } catch {
        return null;
    }
}

export async function createConnectionConfiguration(
    connectionConfigurationPar: CreateConnectionConfigurationPar,
): Promise<ConnectionConfiguration | null> {
    try {
        return await connectionConfigurationService.createConnectionConfiguration(
            connectionConfigurationPar,
        );
    } catch {
        return null;
    }
}

export async function editConnectionConfiguration(
    connectionConfiguration: UpdateConnectionConfigurationPar,
): Promise<ConnectionConfiguration | null> {
    try {
        return await connectionConfigurationService.editConnectionConfiguration(
            connectionConfiguration,
        );
    } catch {
        return null;
    }
}
