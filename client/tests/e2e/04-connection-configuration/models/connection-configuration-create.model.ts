import { type Page } from "@playwright/test";
import { connectionConfigurationFormConfig } from "@/pages/(app)/connection-configuration/connectionConfigurationFormConfig.ts";
import {
    ConnectionConfigurationFormModel,
    type ConnectionConfigurationMainInput,
} from "./connection-configuration-form.model";

// The create POST and the list GET share the `/client_configuration` path, so any route or
// wait built on this regex MUST be guarded by method (`POST`).
export const CONNECTION_CONFIG_CREATE_REQUEST =
    /\/client_configuration(?:$|\?)/i;

export class ConnectionConfigurationCreateModel extends ConnectionConfigurationFormModel {
    constructor(page: Page) {
        super(
            page,
            connectionConfigurationFormConfig.createTestPrefix,
            connectionConfigurationFormConfig.createRoute,
        );
    }

    async fillForm(input: ConnectionConfigurationMainInput) {
        await this.fillMain(input);
    }
}
