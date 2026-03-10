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

export class PlaywrightCreateConnectionConfigurationPage {
    readonly page: Page;

    // Identity
    readonly form: Locator;
    readonly titleText: Locator;
    readonly infoText: Locator;

    // Fields
    readonly nameInput: Locator;
    readonly configurationPurposeSelect: Locator;
    readonly configurationPasswordInput: Locator;
    readonly confirmConfigurationPasswordInput: Locator;
    readonly encryptWithCertificateSelect: Locator;
    readonly pingIntervalInput: Locator;

    // Toggles
    readonly asymmetricOnlyEncryptionToggle: Locator;
    readonly withFallbackToggle: Locator;

    // Fallback section
    readonly fallbackSectionContainer: Locator;
    readonly fallbackStartUrlInput: Locator;
    readonly connectionAttemptsInput: Locator;
    readonly intervalInput: Locator;
    readonly connectionTimeoutInput: Locator;
    readonly fallbackPasswordInput: Locator;
    readonly confirmFallbackPasswordInput: Locator;
    readonly quitPasswordInput: Locator;
    readonly confirmQuitPasswordInput: Locator;

    // Buttons
    readonly saveButton: Locator;
    readonly cancelButton: Locator;

    // Toasts
    readonly toast: Locator;
    readonly toastText: Locator;

    private readonly connectionConfigurationUrlRegex =
        /\/client_configuration(?:\?|$)/i;

    constructor(page: Page) {
        this.page = page;

        this.form = page.getByTestId("connectionConfigurationCreation-form");
        this.titleText = page.getByTestId(
            "connectionConfigurationCreation-title-text",
        );
        this.infoText = page.getByTestId(
            "connectionConfigurationCreation-info-text",
        );

        this.nameInput = page
            .getByTestId("connectionConfigurationCreation-name-input")
            .getByRole("textbox");

        this.configurationPurposeSelect = page.getByTestId(
            "connectionConfigurationCreation-configurationPurpose-select",
        );

        this.configurationPasswordInput = page
            .getByTestId(
                "connectionConfigurationCreation-configurationPassword-input",
            )
            .getByRole("textbox");

        this.confirmConfigurationPasswordInput = page
            .getByTestId(
                "connectionConfigurationCreation-confirmConfigurationPassword-input",
            )
            .getByRole("textbox");

        this.encryptWithCertificateSelect = page.getByTestId(
            "connectionConfigurationCreation-encryptWithCertificate-select",
        );

        this.pingIntervalInput = page
            .getByTestId("connectionConfigurationCreation-pingInterval-input")
            .getByRole("spinbutton");

        this.asymmetricOnlyEncryptionToggle = page.getByTestId(
            "connectionConfigurationCreation-asymmetricOnlyEncryption-toggle",
        );

        this.withFallbackToggle = page.getByTestId(
            "connectionConfigurationCreation-withFallback-toggle",
        );

        this.fallbackSectionContainer = page.getByTestId(
            "connectionConfigurationCreation-fallbackSection-container",
        );

        this.fallbackStartUrlInput = page
            .getByTestId(
                "connectionConfigurationCreation-fallbackStartUrl-input",
            )
            .getByRole("textbox");

        this.connectionAttemptsInput = page
            .getByTestId(
                "connectionConfigurationCreation-connectionAttempts-input",
            )
            .getByRole("spinbutton");

        this.intervalInput = page
            .getByTestId("connectionConfigurationCreation-interval-input")
            .getByRole("spinbutton");

        this.connectionTimeoutInput = page
            .getByTestId(
                "connectionConfigurationCreation-connectionTimeout-input",
            )
            .getByRole("spinbutton");

        this.fallbackPasswordInput = page
            .getByTestId(
                "connectionConfigurationCreation-fallbackPassword-input",
            )
            .getByRole("textbox");

        this.confirmFallbackPasswordInput = page
            .getByTestId(
                "connectionConfigurationCreation-confirmFallbackPassword-input",
            )
            .getByRole("textbox");

        this.quitPasswordInput = page
            .getByTestId("connectionConfigurationCreation-quitPassword-input")
            .getByRole("textbox");

        this.confirmQuitPasswordInput = page
            .getByTestId(
                "connectionConfigurationCreation-confirmQuitPassword-input",
            )
            .getByRole("textbox");

        this.saveButton = page.getByTestId(
            "connectionConfigurationCreation-save-button",
        );
        this.cancelButton = page.getByTestId(
            "connectionConfigurationCreation-cancel-button",
        );

        this.toast = page.locator(".toast-item[role='alert']");
        this.toastText = this.toast.locator(".toast-text");
    }

    async expectVisible() {
        await expect(this.form).toBeVisible();
        await expect(this.titleText).toBeVisible();
    }

    async expectRedirectToConnectionConfigurations() {
        await expect(this.page).toHaveURL(
            /\/connection-configurations(?:$|[?#])/i,
            {
                timeout: 10_000,
            },
        );
    }

    async expectStillOnCreatePage() {
        await expect(this.page).toHaveURL(
            /\/connection-configurations\/create(?:$|[?#])/i,
            {
                timeout: 10_000,
            },
        );
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

    async clearConnectionAttempts() {
        await this.connectionAttemptsInput.fill("");
        await this.connectionAttemptsInput.blur();
    }

    async clearInterval() {
        await this.intervalInput.fill("");
        await this.intervalInput.blur();
    }

    async clearConnectionTimeout() {
        await this.connectionTimeoutInput.fill("");
        await this.connectionTimeoutInput.blur();
    }

    async clearPingInterval() {
        await this.pingIntervalInput.fill("");
        await this.pingIntervalInput.blur();
    }

    async clearFallbackNumericFields() {
        await this.clearConnectionAttempts();
        await this.clearInterval();
        await this.clearConnectionTimeout();
    }

    async blurPingInterval() {
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
            await expect(this.fallbackSectionContainer).toBeVisible();
        }

        if (force === false) {
            await expect(this.fallbackSectionContainer).toBeHidden();
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

    async fillInterval(value: number) {
        await this.intervalInput.fill(String(value));
    }

    async fillConnectionTimeout(value: number) {
        await this.connectionTimeoutInput.fill(String(value));
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

    async submit() {
        await this.saveButton.click();
    }

    async fillForm(params: {
        name: string;
        configurationPurposeName: string;
        pingInterval: number;
        encryptWithCertificateName?: string;
        asymmetricOnlyEncryption?: boolean;
        withFallback?: boolean;
        configurationPassword?: string;
        confirmConfigurationPassword?: string;
        fallbackStartUrl?: string;
        connectionAttempts?: number;
        interval?: number;
        connectionTimeout?: number;
        fallbackPassword?: string;
        confirmFallbackPassword?: string;
        quitPassword?: string;
        confirmQuitPassword?: string;
    }) {
        await this.fillName(params.name);
        await this.selectConfigurationPurpose(params.configurationPurposeName);
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
            if (params.fallbackStartUrl !== undefined) {
                await this.fillFallbackStartUrl(params.fallbackStartUrl);
            }
            if (params.connectionAttempts !== undefined) {
                await this.fillConnectionAttempts(params.connectionAttempts);
            }
            if (params.interval !== undefined) {
                await this.fillInterval(params.interval);
            }
            if (params.connectionTimeout !== undefined) {
                await this.fillConnectionTimeout(params.connectionTimeout);
            }
            if (params.fallbackPassword !== undefined) {
                await this.fillFallbackPassword(params.fallbackPassword);
            }
            if (params.confirmFallbackPassword !== undefined) {
                await this.fillConfirmFallbackPassword(
                    params.confirmFallbackPassword,
                );
            }
            if (params.quitPassword !== undefined) {
                await this.fillQuitPassword(params.quitPassword);
            }
            if (params.confirmQuitPassword !== undefined) {
                await this.fillConfirmQuitPassword(params.confirmQuitPassword);
            }
        }
    }

    private fieldError(testId: string, text: string) {
        const field = this.page.getByTestId(testId);
        return field.locator(".v-messages__message").filter({ hasText: text });
    }

    async expectFieldError(testId: string, text: string) {
        await expect(this.fieldError(testId, text)).toHaveCount(1, {
            timeout: 5000,
        });
    }

    async expectRequiredFieldErrors(errors: {
        name?: string;
        configurationPurpose?: string;
        pingInterval?: string;
    }) {
        if (errors.name) {
            await this.expectFieldError(
                "connectionConfigurationCreation-name-input",
                errors.name,
            );
        }

        if (errors.configurationPurpose) {
            await this.expectFieldError(
                "connectionConfigurationCreation-configurationPurpose-select",
                errors.configurationPurpose,
            );
        }

        if (errors.pingInterval) {
            await this.expectFieldError(
                "connectionConfigurationCreation-pingInterval-input",
                errors.pingInterval,
            );
        }
    }

    async expectFallbackRequiredFieldErrors(errors: {
        fallbackStartUrl?: string;
        connectionAttempts?: string;
        interval?: string;
        connectionTimeout?: string;
    }) {
        if (errors.fallbackStartUrl) {
            await this.expectFieldError(
                "connectionConfigurationCreation-fallbackStartUrl-input",
                errors.fallbackStartUrl,
            );
        }

        if (errors.connectionAttempts) {
            await this.expectFieldError(
                "connectionConfigurationCreation-connectionAttempts-input",
                errors.connectionAttempts,
            );
        }

        if (errors.interval) {
            await this.expectFieldError(
                "connectionConfigurationCreation-interval-input",
                errors.interval,
            );
        }

        if (errors.connectionTimeout) {
            await this.expectFieldError(
                "connectionConfigurationCreation-connectionTimeout-input",
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

    async expectCreateRequestSucceeded(action: () => Promise<void>) {
        await expectRequestSucceeded({
            page: this.page,
            method: "POST",
            urlRegex: this.connectionConfigurationUrlRegex,
            action,
            expectedStatus: 200,
        });
    }

    async captureCreateResponse(
        action: () => Promise<void>,
    ): Promise<Response> {
        const respPromise = waitForResponse(
            this.page,
            "POST",
            this.connectionConfigurationUrlRegex,
        );

        await action();
        return await respPromise;
    }

    async expectNoCreateRequest(action: () => Promise<void>) {
        await expectNoRequest({
            page: this.page,
            method: "POST",
            urlRegex: this.connectionConfigurationUrlRegex,
            action,
            settleMs: 300,
        });
    }
}
