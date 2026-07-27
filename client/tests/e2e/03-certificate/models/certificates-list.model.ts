import { expect, type Locator, type Page } from "@playwright/test";

import {
    CERTIFICATE_FIELD,
    certificateFormConfig,
} from "@/pages/(app)/certificate/certificateFormConfig.ts";
import { certificateListConfig } from "@/pages/(app)/certificate/certificateListConfig.ts";

import { TableListPageModel } from "../../shared/page-models/model-pages/table-list-page.model";
import {
    type FormFieldFile,
    FormFieldModel,
} from "../../shared/page-models/widgets/form-field.model";
import type { TableListPageConfig } from "../../shared/types/table-list-page.types";

export type CertificateRow = {
    alias: string;
    validityFrom: string;
    validityTo: string;
    certType: string[];
};

// The create POST, the delete DELETE and the list GET all share the collection path; any
// route or wait built on this regex MUST be guarded by method. Anchored on the API prefix
// because the app route (/certificate) equals the wire path and would match otherwise.
export const CERTIFICATE_API_REQUEST = /\/admin-api\/v1\/certificate(?:\?|$)/i;

const config: TableListPageConfig = {
    route: certificateListConfig.route,
    testIdBase: certificateListConfig.testIdBase,
    listRequest: {
        method: "GET",
        urlRegex: CERTIFICATE_API_REQUEST,
        expectedStatuses: [200, 304],
    },
};

// The upload dialog is part of the list page (there is no create route); it owns the two
// FormBuilder fields plus the dialog's own submit/cancel actions.
export class CertificateUploadDialogModel {
    readonly page: Page;
    readonly root: Locator;
    readonly fileField: FormFieldModel;
    readonly passwordField: FormFieldModel;
    readonly submitButton: Locator;
    readonly cancelButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.root = page.getByTestId(certificateFormConfig.uploadDialogTestId);
        this.fileField = new FormFieldModel(
            page,
            `${certificateFormConfig.uploadFormTestId}-field-${CERTIFICATE_FIELD.file}`,
            "file",
        );
        this.passwordField = new FormFieldModel(
            page,
            `${certificateFormConfig.uploadFormTestId}-field-${CERTIFICATE_FIELD.password}`,
            "password",
        );
        this.submitButton = page.getByTestId(
            certificateFormConfig.uploadSubmitTestId,
        );
        this.cancelButton = page.getByTestId(
            certificateFormConfig.uploadCancelTestId,
        );
    }

    async expectVisible() {
        await expect(this.root).toBeVisible();
    }

    async expectHidden() {
        await expect(this.root).toBeHidden();
    }

    async fill(file: FormFieldFile, password?: string) {
        await this.fileField.setFile(file);
        if (password !== undefined) {
            await this.passwordField.fill(password);
        }
    }

    async submit() {
        await this.submitButton.click();
    }

    async cancel() {
        await this.cancelButton.click();
    }
}

export class CertificatesListModel extends TableListPageModel {
    readonly uploadDialog: CertificateUploadDialogModel;

    constructor(page: Page) {
        super(page, config);
        this.uploadDialog = new CertificateUploadDialogModel(page);
    }

    async openUploadDialog() {
        await this.layout.addButton.click();
        await this.uploadDialog.expectVisible();
    }

    // Certificates are stored as parsed keystore blobs, so the list is mocked:
    // GET /certificate is fulfilled with controlled rows while every other
    // method (e.g. the delete) falls back to spec routes or the mock backend.
    async mockList(content: CertificateRow[], opts: { pages?: number } = {}) {
        await this.page.route(CERTIFICATE_API_REQUEST, async (route) => {
            if (route.request().method() !== "GET") {
                return route.fallback();
            }
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({
                    number_of_pages: opts.pages ?? 1,
                    page_number: 1,
                    page_size: 10,
                    complete: true,
                    content,
                }),
            });
        });
    }

    // Mutation outcome specs serve the list from mutable state the action routes update,
    // so the invalidation-triggered refetch reflects the new backend state.
    async mockListFromState(state: { rows: CertificateRow[] }) {
        await this.page.route(CERTIFICATE_API_REQUEST, async (route) => {
            if (route.request().method() !== "GET") {
                return route.fallback();
            }
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({
                    number_of_pages: 1,
                    page_number: 1,
                    page_size: 10,
                    complete: true,
                    content: state.rows,
                }),
            });
        });
    }
}

export function certificateRows(count: number): CertificateRow[] {
    return Array.from({ length: count }, (_, i) => {
        const n = String(i + 1).padStart(2, "0");
        return {
            alias: `e2e-getall-cert-${n}`,
            validityFrom: "2024-01-01T00:00:00Z",
            validityTo: "2026-01-01T00:00:00Z",
            certType: ["DIGITAL_SIGNATURE"],
        };
    });
}
