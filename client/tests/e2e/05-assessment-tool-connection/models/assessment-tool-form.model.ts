import { type Locator, type Page } from "@playwright/test";

import {
    ASSESSMENT_TOOL_FIELD,
    assessmentToolFormConfig,
} from "@/pages/(app)/assessment-tool/assessmentToolFormConfig.ts";

import {
    type FormFieldSpec,
    FormPageModel,
} from "../../shared/page-models/model-pages/form-page.model";

export type AuthMode = "token" | "client";

// The create/edit form is split across three FormBuilders that namespace their fields under
// their own base test-id (`<prefix>-main-form` / `-auth-form` / `-proxy-form`), plus an
// auth-mode v-btn-toggle and the proxy toggle that are NOT FormBuilder fields. The auth-form
// only mounts the fields for the active auth mode.
export function assessmentToolFields(prefix: string): FormFieldSpec[] {
    const mainForm = `${prefix}-${assessmentToolFormConfig.mainFormSuffix}`;
    const authForm = `${prefix}-${assessmentToolFormConfig.authFormSuffix}`;
    const proxyForm = `${prefix}-${assessmentToolFormConfig.proxyFormSuffix}`;
    return [
        {
            name: ASSESSMENT_TOOL_FIELD.institutionId,
            type: "select",
            formTestId: mainForm,
        },
        {
            name: ASSESSMENT_TOOL_FIELD.name,
            type: "text",
            formTestId: mainForm,
        },
        {
            name: ASSESSMENT_TOOL_FIELD.lmsType,
            type: "select",
            formTestId: mainForm,
        },
        {
            name: ASSESSMENT_TOOL_FIELD.lmsUrl,
            type: "text",
            formTestId: mainForm,
        },
        {
            name: ASSESSMENT_TOOL_FIELD.accessToken,
            type: "password",
            formTestId: authForm,
        },
        {
            name: ASSESSMENT_TOOL_FIELD.lmsClientname,
            type: "text",
            formTestId: authForm,
        },
        {
            name: ASSESSMENT_TOOL_FIELD.lmsClientsecret,
            type: "password",
            formTestId: authForm,
        },
        {
            name: ASSESSMENT_TOOL_FIELD.proxyHost,
            type: "text",
            formTestId: proxyForm,
        },
        {
            name: ASSESSMENT_TOOL_FIELD.proxyPort,
            type: "text",
            formTestId: proxyForm,
        },
        {
            name: ASSESSMENT_TOOL_FIELD.proxyUsername,
            type: "text",
            formTestId: proxyForm,
        },
        {
            name: ASSESSMENT_TOOL_FIELD.proxyPassword,
            type: "password",
            formTestId: proxyForm,
        },
    ];
}

export type AssessmentToolMainInput = {
    name: string;
    // The LMS-type select's option text (e.g. "Testing" for MOCKUP).
    lmsType: string;
    lmsUrl: string;
};

export type AssessmentToolProxyInput = {
    proxyHost: string;
    proxyPort?: string;
    proxyUsername?: string;
    proxyPassword?: string;
};

export class AssessmentToolFormModel extends FormPageModel {
    readonly proxySwitch: Locator;

    constructor(page: Page, prefix: string, route: string) {
        super(page, {
            route,
            testPrefix: prefix,
            fields: assessmentToolFields(prefix),
        });
        // The proxy v-switch renders a role="checkbox" input; target it via the row wrapper
        // (the data-testid on the v-switch itself lands on the input, so a nested role lookup
        // there would find nothing).
        this.proxySwitch = page
            .getByTestId(`${prefix}-proxy-row`)
            .getByRole("checkbox");
    }

    authModeButton(mode: AuthMode): Locator {
        return this.page.getByTestId(
            `${this.config.testPrefix}-authMode-${mode}-button`,
        );
    }

    async selectAuthMode(mode: AuthMode) {
        await this.authModeButton(mode).click();
    }

    // The proxy FormBuilder only mounts once this switch is on; enabling it reveals the
    // fields registered under the `<prefix>-proxy-form` base.
    async enableProxy() {
        await this.proxySwitch.click();
        await this.field(ASSESSMENT_TOOL_FIELD.proxyHost).expectVisible();
    }

    async fillMain(input: AssessmentToolMainInput) {
        await this.field(ASSESSMENT_TOOL_FIELD.name).set(input.name);
        await this.field(ASSESSMENT_TOOL_FIELD.lmsType).set(input.lmsType);
        await this.field(ASSESSMENT_TOOL_FIELD.lmsUrl).set(input.lmsUrl);
    }

    async fillAuthToken(accessToken: string) {
        await this.selectAuthMode("token");
        await this.field(ASSESSMENT_TOOL_FIELD.accessToken).set(accessToken);
    }

    async fillAuthClient(input: { username: string; password: string }) {
        await this.selectAuthMode("client");
        await this.field(ASSESSMENT_TOOL_FIELD.lmsClientname).set(
            input.username,
        );
        await this.field(ASSESSMENT_TOOL_FIELD.lmsClientsecret).set(
            input.password,
        );
    }

    async fillProxy(input: AssessmentToolProxyInput) {
        await this.field(ASSESSMENT_TOOL_FIELD.proxyHost).set(input.proxyHost);
        if (input.proxyPort !== undefined) {
            await this.field(ASSESSMENT_TOOL_FIELD.proxyPort).set(
                input.proxyPort,
            );
        }
        if (input.proxyUsername !== undefined) {
            await this.field(ASSESSMENT_TOOL_FIELD.proxyUsername).set(
                input.proxyUsername,
            );
        }
        if (input.proxyPassword !== undefined) {
            await this.field(ASSESSMENT_TOOL_FIELD.proxyPassword).set(
                input.proxyPassword,
            );
        }
    }
}
