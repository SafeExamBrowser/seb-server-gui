import { type Locator, type Page } from "@playwright/test";
import {
    CONNECTION_CONFIG_FIELD,
    connectionConfigurationFormConfig,
} from "@/pages/(app)/connection-configuration/connectionConfigurationFormConfig.ts";
import {
    FormPageModel,
    type FormFieldSpec,
} from "../../shared/page-models/model-pages/form-page.model";
import { selectVuetifyOptionByName } from "../../utils/helpers";

// The create/edit form is split across two FormBuilders that namespace their fields under
// their own base test-id (`<prefix>-main-form` / `<prefix>-fallback-form`), plus a raw cert
// v-select and the fallback toggle that are NOT FormBuilder fields.
export function connectionConfigurationFields(prefix: string): FormFieldSpec[] {
    const mainForm = `${prefix}-${connectionConfigurationFormConfig.mainFormSuffix}`;
    const fallbackForm = `${prefix}-${connectionConfigurationFormConfig.fallbackFormSuffix}`;
    return [
        {
            name: CONNECTION_CONFIG_FIELD.name,
            type: "text",
            formTestId: mainForm,
        },
        {
            name: CONNECTION_CONFIG_FIELD.configurationPurpose,
            type: "select",
            formTestId: mainForm,
        },
        {
            name: CONNECTION_CONFIG_FIELD.configurationPassword,
            type: "password",
            formTestId: mainForm,
        },
        {
            name: CONNECTION_CONFIG_FIELD.confirmConfigurationPassword,
            type: "password",
            formTestId: mainForm,
        },
        {
            name: CONNECTION_CONFIG_FIELD.pingInterval,
            type: "number",
            formTestId: mainForm,
        },
        {
            name: CONNECTION_CONFIG_FIELD.asymmetricOnlyEncryption,
            type: "switch",
            formTestId: mainForm,
        },
        {
            name: CONNECTION_CONFIG_FIELD.fallbackStartUrl,
            type: "text",
            formTestId: fallbackForm,
        },
        {
            name: CONNECTION_CONFIG_FIELD.connectionAttempts,
            type: "number",
            formTestId: fallbackForm,
        },
        {
            name: CONNECTION_CONFIG_FIELD.interval,
            type: "number",
            formTestId: fallbackForm,
        },
        {
            name: CONNECTION_CONFIG_FIELD.connectionTimeout,
            type: "number",
            formTestId: fallbackForm,
        },
        {
            name: CONNECTION_CONFIG_FIELD.fallbackPassword,
            type: "password",
            formTestId: fallbackForm,
        },
        {
            name: CONNECTION_CONFIG_FIELD.confirmFallbackPassword,
            type: "password",
            formTestId: fallbackForm,
        },
        {
            name: CONNECTION_CONFIG_FIELD.quitPassword,
            type: "password",
            formTestId: fallbackForm,
        },
        {
            name: CONNECTION_CONFIG_FIELD.confirmQuitPassword,
            type: "password",
            formTestId: fallbackForm,
        },
    ];
}

export type ConnectionConfigurationMainInput = {
    name: string;
    // The purpose select's option text (e.g. "Starting an Exam").
    configurationPurpose: string;
    configurationPassword?: string;
    pingInterval?: string;
    asymmetricOnlyEncryption?: boolean;
};

export type ConnectionConfigurationFallbackInput = {
    fallbackStartUrl: string;
    connectionAttempts?: string;
    interval?: string;
    connectionTimeout?: string;
    fallbackPassword?: string;
    quitPassword?: string;
};

export class ConnectionConfigurationFormModel extends FormPageModel {
    readonly certSelect: Locator;
    readonly fallbackSwitch: Locator;

    constructor(page: Page, prefix: string, route: string) {
        super(page, {
            route,
            testPrefix: prefix,
            fields: connectionConfigurationFields(prefix),
        });
        this.certSelect = page.getByTestId(
            `${prefix}-encryptWithCertificate-select`,
        );
        this.fallbackSwitch = page.getByTestId(`${prefix}-fallback-switch`);
    }

    // The cert picker is a raw v-select (not a FormBuilder field), so it gets its own
    // Vuetify option-select helper rather than the FormFieldModel select flow.
    async selectCertificate(optionText: string) {
        await selectVuetifyOptionByName(this.page, this.certSelect, optionText);
    }

    // The fallback FormBuilder only mounts once this switch is on; enabling it reveals the
    // fields registered under the `<prefix>-fallback-form` base.
    async enableFallback() {
        await this.fallbackSwitch.getByRole("switch").click();
        await this.field(
            CONNECTION_CONFIG_FIELD.fallbackStartUrl,
        ).expectVisible();
    }

    async fillMain(input: ConnectionConfigurationMainInput) {
        await this.field(CONNECTION_CONFIG_FIELD.name).set(input.name);
        await this.field(CONNECTION_CONFIG_FIELD.configurationPurpose).set(
            input.configurationPurpose,
        );
        if (input.pingInterval !== undefined) {
            await this.field(CONNECTION_CONFIG_FIELD.pingInterval).set(
                input.pingInterval,
            );
        }
        if (input.configurationPassword !== undefined) {
            await this.field(CONNECTION_CONFIG_FIELD.configurationPassword).set(
                input.configurationPassword,
            );
            await this.field(
                CONNECTION_CONFIG_FIELD.confirmConfigurationPassword,
            ).set(input.configurationPassword);
        }
        if (input.asymmetricOnlyEncryption) {
            await this.field(
                CONNECTION_CONFIG_FIELD.asymmetricOnlyEncryption,
            ).set("on");
        }
    }

    async fillFallback(input: ConnectionConfigurationFallbackInput) {
        await this.field(CONNECTION_CONFIG_FIELD.fallbackStartUrl).set(
            input.fallbackStartUrl,
        );
        if (input.connectionAttempts !== undefined) {
            await this.field(CONNECTION_CONFIG_FIELD.connectionAttempts).set(
                input.connectionAttempts,
            );
        }
        if (input.interval !== undefined) {
            await this.field(CONNECTION_CONFIG_FIELD.interval).set(
                input.interval,
            );
        }
        if (input.connectionTimeout !== undefined) {
            await this.field(CONNECTION_CONFIG_FIELD.connectionTimeout).set(
                input.connectionTimeout,
            );
        }
        if (input.fallbackPassword !== undefined) {
            await this.field(CONNECTION_CONFIG_FIELD.fallbackPassword).set(
                input.fallbackPassword,
            );
            await this.field(
                CONNECTION_CONFIG_FIELD.confirmFallbackPassword,
            ).set(input.fallbackPassword);
        }
        if (input.quitPassword !== undefined) {
            await this.field(CONNECTION_CONFIG_FIELD.quitPassword).set(
                input.quitPassword,
            );
            await this.field(CONNECTION_CONFIG_FIELD.confirmQuitPassword).set(
                input.quitPassword,
            );
        }
    }
}
