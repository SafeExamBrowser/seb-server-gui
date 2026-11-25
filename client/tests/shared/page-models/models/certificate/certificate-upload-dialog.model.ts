import { type Page } from "@playwright/test";

import { CERTIFICATE_FIELD } from "@/pages/(app)/certificate/certificateFormConfig.ts";

import { FormDialogModel } from "../../widgets/form-dialog.model.ts";
import {
    type FormFieldFile,
    FormFieldModel,
} from "../../widgets/form-field.model.ts";

// Certificates have no create route: the upload is a FormDialog embedded by the certificates
// page and by the connection-configuration forms, owning the two FormBuilder fields plus the
// dialog's own submit/cancel actions.
export class CertificateUploadDialogModel extends FormDialogModel {
    readonly fileField: FormFieldModel;
    readonly passwordField: FormFieldModel;

    constructor(page: Page, testIdBase: string) {
        super(page, testIdBase);
        this.fileField = new FormFieldModel(
            page,
            `${this.formTestId}-field-${CERTIFICATE_FIELD.file}`,
            "file",
        );
        this.passwordField = new FormFieldModel(
            page,
            `${this.formTestId}-field-${CERTIFICATE_FIELD.password}`,
            "password",
        );
    }

    async fill(file: FormFieldFile, password?: string) {
        await this.fileField.setFile(file);
        if (password !== undefined) {
            await this.passwordField.fill(password);
        }
    }
}
