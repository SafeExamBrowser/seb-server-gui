import {
    expect,
    type Locator,
    type Page,
    type Response,
} from "@playwright/test";
import { selectVuetifyOptionByName } from "../../utils/helpers";
import {
    expectNoRequest,
    expectRequestSucceeded,
    waitForResponse,
} from "../../utils/networkAssertions";

export class PlaywrightConnectionConfigurationEditPage {
    readonly page: Page;

    // identity / header
    readonly container: Locator;
    readonly title: Locator;
    readonly statusChip: Locator;
    readonly createdAtText: Locator;
    readonly lastUpdatedText: Locator;

    // fields
    readonly nameInput: Locator;
    readonly configurationPurposeSelect: Locator;
    readonly configurationPasswordInput: Locator;
    readonly confirmConfigurationPasswordInput: Locator;
    readonly encryptWithCertificateSelect: Locator;
    readonly pingIntervalInput: Locator;

    // toggles
    readonly asymmetricOnlyEncryptionToggle: Locator;
    readonly withFallbackToggle: Locator;

    // fallback section
    readonly fallbackSection: Locator;
    readonly fallbackStartUrlInput: Locator;
    readonly connectionAttemptsInput: Locator;
    readonly fallbackIntervalInput: Locator;
    readonly connectionTimeoutInput: Locator;
    readonly fallbackPasswordInput: Locator;
    readonly confirmFallbackPasswordInput: Locator;
    readonly quitPasswordInput: Locator;
    readonly confirmQuitPasswordInput: Locator;

    // buttons
    readonly backButton: Locator;
    readonly saveButton: Locator;

    // toasts
    readonly toast: Locator;
    readonly toastText: Locator;

    private readonly editUrlRegex = /\/client_configuration(?:\/|$|\?)/i;

    constructor(page: Page) {
        this.page = page;

        this.container = page.getByTestId(
            "connectionConfigurationEdit-form-sheet",
        );
        this.title = page.getByTestId("connectionConfigurationEdit-title-text");
        this.statusChip = page.getByTestId(
            "connectionConfigurationEdit-status-chip",
        );
        this.createdAtText = page.getByTestId(
            "connectionConfigurationEdit-createdAt-text",
        );
        this.lastUpdatedText = page.getByTestId(
            "connectionConfigurationEdit-lastUpdated-text",
        );

        this.nameInput = page
            .getByTestId("connectionConfigurationEdit-name-input")
            .getByRole("textbox");

        this.configurationPurposeSelect = page.getByTestId(
            "connectionConfigurationEdit-configurationPurpose-select",
        );

        this.configurationPasswordInput = page
            .getByTestId(
                "connectionConfigurationEdit-configurationPassword-input",
            )
            .getByRole("textbox");

        this.confirmConfigurationPasswordInput = page
            .getByTestId(
                "connectionConfigurationEdit-confirmConfigurationPassword-input",
            )
            .getByRole("textbox");

        this.encryptWithCertificateSelect = page.getByTestId(
            "connectionConfigurationEdit-encryptWithCertificate-select",
        );

        this.pingIntervalInput = page
            .getByTestId("connectionConfigurationEdit-pingInterval-input")
            .getByRole("spinbutton");

        this.asymmetricOnlyEncryptionToggle = page.getByTestId(
            "connectionConfigurationEdit-asymmetricOnlyEncryption-toggle",
        );

        this.withFallbackToggle = page.getByTestId(
            "connectionConfigurationEdit-withFallback-toggle",
        );

        this.fallbackSection = page.getByTestId(
            "connectionConfigurationEdit-fallback-section",
        );

        this.fallbackStartUrlInput = page
            .getByTestId("connectionConfigurationEdit-fallbackStartUrl-input")
            .getByRole("textbox");

        this.connectionAttemptsInput = page
            .getByTestId("connectionConfigurationEdit-connectionAttempts-input")
            .getByRole("spinbutton");

        this.fallbackIntervalInput = page
            .getByTestId("connectionConfigurationEdit-fallbackInterval-input")
            .getByRole("spinbutton");

        this.connectionTimeoutInput = page
            .getByTestId("connectionConfigurationEdit-connectionTimeout-input")
            .getByRole("spinbutton");

        this.fallbackPasswordInput = page
            .getByTestId("connectionConfigurationEdit-fallbackPassword-input")
            .getByRole("textbox");

        this.confirmFallbackPasswordInput = page
            .getByTestId(
                "connectionConfigurationEdit-confirmFallbackPassword-input",
            )
            .getByRole("textbox");

        this.quitPasswordInput = page
            .getByTestId("connectionConfigurationEdit-quitPassword-input")
            .getByRole("textbox");

        this.confirmQuitPasswordInput = page
            .getByTestId(
                "connectionConfigurationEdit-confirmQuitPassword-input",
            )
            .getByRole("textbox");

        this.backButton = page.getByTestId(
            "connectionConfigurationEdit-back-button",
        );
        this.saveButton = page.getByTestId(
            "connectionConfigurationEdit-save-button",
        );

        this.toast = page.locator(".toast-item[role='alert']");
        this.toastText = this.toast.locator(".toast-text");
    }

    async expectVisible() {
        await expect(this.container).toBeVisible();
        await expect(this.title).toBeVisible();
    }

    async expectStillOnEditPage(id: string | number) {
        await expect(this.page).toHaveURL(
            new RegExp(`/connection-configurations/${id}(?:$|[?#])`, "i"),
            { timeout: 10_000 },
        );
    }

    async expectRedirectToConnectionConfigurations() {
        await expect(this.page).toHaveURL(
            /\/connection-configurations(?:$|[?#])/i,
            { timeout: 10_000 },
        );
    }

    async expectFormLoaded(expected: { name: string }) {
        await expect(this.nameInput).toHaveValue(expected.name, {
            timeout: 10_000,
        });
    }

    async selectConfigurationPurpose(name: string) {
        await selectVuetifyOptionByName(
            this.page,
            this.configurationPurposeSelect,
            name,
        );
    }

    async selectEncryptWithCertificate(name: string) {
        await selectVuetifyOptionByName(
            this.page,
            this.encryptWithCertificateSelect,
            name,
        );
    }

    async fillName(value: string) {
        await this.nameInput.fill(value);
    }

    async fillConfigurationPassword(value: string) {
        await this.configurationPasswordInput.fill(value);
    }

    async fillConfirmConfigurationPassword(value: string) {
        await this.confirmConfigurationPasswordInput.fill(value);
    }

    async fillPingInterval(value: number) {
        await this.pingIntervalInput.fill(String(value));
    }

    async fillPingIntervalRaw(value: string) {
        await this.pingIntervalInput.fill(value);
    }

    async blurPingInterval() {
        await this.pingIntervalInput.blur();
    }

    async clearPingInterval() {
        await this.pingIntervalInput.fill("");
        await this.pingIntervalInput.blur();
    }

    async toggleAsymmetricOnlyEncryption(force?: boolean) {
        if (typeof force === "boolean") {
            const input = this.asymmetricOnlyEncryptionToggle.locator("input");
            const checked = await input.isChecked();
            if (checked !== force) {
                await this.asymmetricOnlyEncryptionToggle.click();
            }
            return;
        }
        await this.asymmetricOnlyEncryptionToggle.click();
    }

    async toggleWithFallback(force?: boolean) {
        if (typeof force === "boolean") {
            const input = this.withFallbackToggle.locator("input");
            const checked = await input.isChecked();
            if (checked !== force) {
                await this.withFallbackToggle.click();
            }
        } else {
            await this.withFallbackToggle.click();
        }

        if (force === true) {
            await expect(this.fallbackSection).toBeVisible();
        }

        if (force === false) {
            await expect(this.fallbackSection).toBeHidden();
        }
    }

    async fillFallbackStartUrl(value: string) {
        await this.fallbackStartUrlInput.fill(value);
    }

    async blurFallbackStartUrl() {
        await this.fallbackStartUrlInput.blur();
    }

    async fillConnectionAttempts(value: number) {
        await this.connectionAttemptsInput.fill(String(value));
    }

    async fillFallbackInterval(value: number) {
        await this.fallbackIntervalInput.fill(String(value));
    }

    async fillConnectionTimeout(value: number) {
        await this.connectionTimeoutInput.fill(String(value));
    }

    async clearConnectionAttempts() {
        await this.connectionAttemptsInput.fill("");
        await this.connectionAttemptsInput.blur();
    }

    async clearFallbackInterval() {
        await this.fallbackIntervalInput.fill("");
        await this.fallbackIntervalInput.blur();
    }

    async clearConnectionTimeout() {
        await this.connectionTimeoutInput.fill("");
        await this.connectionTimeoutInput.blur();
    }

    async clearFallbackNumericFields() {
        await this.clearConnectionAttempts();
        await this.clearFallbackInterval();
        await this.clearConnectionTimeout();
    }

    async fillFallbackPassword(value: string) {
        await this.fallbackPasswordInput.fill(value);
    }

    async fillConfirmFallbackPassword(value: string) {
        await this.confirmFallbackPasswordInput.fill(value);
    }

    async fillQuitPassword(value: string) {
        await this.quitPasswordInput.fill(value);
    }

    async fillConfirmQuitPassword(value: string) {
        await this.confirmQuitPasswordInput.fill(value);
    }

    async toggleStatusChip() {
        await this.statusChip.click();
    }

    async expectStatusChipActive() {
        await expect(this.statusChip).toContainText(/active/i);
    }

    async expectStatusChipInactive() {
        await expect(this.statusChip).toContainText(/inactive/i);
    }

    async submitSaveChanges() {
        await this.saveButton.click();
    }

    async clickBack() {
        await this.backButton.click();
    }

    async fillEditForm(params: {
        name?: string;
        configurationPurposeName?: string;
        pingInterval?: number;
        encryptWithCertificateName?: string;
        asymmetricOnlyEncryption?: boolean;
        withFallback?: boolean;
        configurationPassword?: string;
        confirmConfigurationPassword?: string;
        fallbackStartUrl?: string;
        connectionAttempts?: number;
        fallbackInterval?: number;
        connectionTimeout?: number;
        fallbackPassword?: string;
        confirmFallbackPassword?: string;
        quitPassword?: string;
        confirmQuitPassword?: string;
    }) {
        if (params.name !== undefined) await this.fillName(params.name);
        if (params.configurationPurposeName)
            await this.selectConfigurationPurpose(
                params.configurationPurposeName,
            );
        if (params.pingInterval !== undefined)
            await this.fillPingInterval(params.pingInterval);

        if (params.encryptWithCertificateName) {
            await this.selectEncryptWithCertificate(
                params.encryptWithCertificateName,
            );
        }

        if (params.configurationPassword !== undefined) {
            await this.fillConfigurationPassword(params.configurationPassword);
        }

        if (params.confirmConfigurationPassword !== undefined) {
            await this.fillConfirmConfigurationPassword(
                params.confirmConfigurationPassword,
            );
        }

        if (params.asymmetricOnlyEncryption !== undefined) {
            await this.toggleAsymmetricOnlyEncryption(
                params.asymmetricOnlyEncryption,
            );
        }

        if (params.withFallback !== undefined) {
            await this.toggleWithFallback(params.withFallback);
        }

        if (params.withFallback) {
            if (params.fallbackStartUrl !== undefined)
                await this.fillFallbackStartUrl(params.fallbackStartUrl);
            if (params.connectionAttempts !== undefined)
                await this.fillConnectionAttempts(params.connectionAttempts);
            if (params.fallbackInterval !== undefined)
                await this.fillFallbackInterval(params.fallbackInterval);
            if (params.connectionTimeout !== undefined)
                await this.fillConnectionTimeout(params.connectionTimeout);
            if (params.fallbackPassword !== undefined)
                await this.fillFallbackPassword(params.fallbackPassword);
            if (params.confirmFallbackPassword !== undefined)
                await this.fillConfirmFallbackPassword(
                    params.confirmFallbackPassword,
                );
            if (params.quitPassword !== undefined)
                await this.fillQuitPassword(params.quitPassword);
            if (params.confirmQuitPassword !== undefined)
                await this.fillConfirmQuitPassword(params.confirmQuitPassword);
        }
    }

    private fieldError(testId: string, text: string) {
        const field = this.page.getByTestId(testId);
        return field.locator(".v-messages__message").filter({ hasText: text });
    }

    async expectFieldError(testId: string, text: string) {
        await expect(this.fieldError(testId, text).first()).toBeVisible({
            timeout: 5_000,
        });
    }

    async expectRequiredFieldErrors(errors: {
        name?: string;
        configurationPurpose?: string;
        pingInterval?: string;
    }) {
        if (errors.name) {
            await this.expectFieldError(
                "connectionConfigurationEdit-name-input",
                errors.name,
            );
        }
        if (errors.configurationPurpose) {
            await this.expectFieldError(
                "connectionConfigurationEdit-configurationPurpose-select",
                errors.configurationPurpose,
            );
        }
        if (errors.pingInterval) {
            await this.expectFieldError(
                "connectionConfigurationEdit-pingInterval-input",
                errors.pingInterval,
            );
        }
    }

    async expectFallbackRequiredFieldErrors(errors: {
        fallbackStartUrl?: string;
        connectionAttempts?: string;
        fallbackInterval?: string;
        connectionTimeout?: string;
    }) {
        if (errors.fallbackStartUrl) {
            await this.expectFieldError(
                "connectionConfigurationEdit-fallbackStartUrl-input",
                errors.fallbackStartUrl,
            );
        }
        if (errors.connectionAttempts) {
            await this.expectFieldError(
                "connectionConfigurationEdit-connectionAttempts-input",
                errors.connectionAttempts,
            );
        }
        if (errors.fallbackInterval) {
            await this.expectFieldError(
                "connectionConfigurationEdit-fallbackInterval-input",
                errors.fallbackInterval,
            );
        }
        if (errors.connectionTimeout) {
            await this.expectFieldError(
                "connectionConfigurationEdit-connectionTimeout-input",
                errors.connectionTimeout,
            );
        }
    }

    async expectErrorToast(contains: string[]) {
        await expect(this.toast).toBeVisible();
        for (const part of contains) {
            await expect(this.toastText).toContainText(part);
        }
    }

    async expectEditRequestSucceeded(action: () => Promise<void>) {
        await expectRequestSucceeded({
            page: this.page,
            method: "PUT",
            urlRegex: this.editUrlRegex,
            action,
            expectedStatus: 200,
        });
    }

    async captureEditResponse(action: () => Promise<void>): Promise<Response> {
        const respPromise = waitForResponse(
            this.page,
            "PUT",
            this.editUrlRegex,
        );
        await action();
        return await respPromise;
    }

    async expectNoEditRequest(action: () => Promise<void>) {
        await expectNoRequest({
            page: this.page,
            method: "PUT",
            urlRegex: this.editUrlRegex,
            action,
            settleMs: 300,
        });
    }

    async expectEditRequestFailed(params: {
        action: () => Promise<void>;
        expectedStatus?: number;
        expectedStatuses?: number[];
    }) {
        const expectedStatuses = params.expectedStatuses ?? [
            params.expectedStatus ?? 400,
        ];

        const resp = await this.captureEditResponse(params.action);

        expect(expectedStatuses).toContain(resp.status());
        expect(resp.ok()).toBeFalsy();

        return resp;
    }
}
