import { type Page } from "@playwright/test";
import { connectionConfigurationFormConfig } from "@/pages/(app)/connection-configuration/connectionConfigurationFormConfig.ts";
import { ConnectionConfigurationFormModel } from "./connection-configuration-form.model";

// A mocked (not seeded) id used by the hydrate/save/cancel specs, distinct from the seeded
// list ids the read spec relies on.
export const EDIT_CONFIG_ID = 9999;

// The edit PUT and the list GET share the `/client_configuration` path, so any route or wait
// built on this regex MUST be guarded by method (`PUT`).
export const CONNECTION_CONFIG_SAVE_REQUEST = /\/client_configuration(?:$|\?)/i;

export const connectionConfigurationByIdRequest = (id: string | number) =>
    new RegExp(`/client_configuration/${id}(?:$|\\?)`, "i");

export class ConnectionConfigurationEditModel extends ConnectionConfigurationFormModel {
    constructor(page: Page, id: string | number = EDIT_CONFIG_ID) {
        super(
            page,
            connectionConfigurationFormConfig.editTestPrefix,
            connectionConfigurationFormConfig.editRoute(id),
        );
    }
}
