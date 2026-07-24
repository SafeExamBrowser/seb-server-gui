import { computed, Ref } from "vue";

import { FormField } from "@/components/widgets/formBuilder/types.ts";
import { useZodFormRules } from "@/composables/useZodFormRules.ts";
import i18n from "@/i18n";
import { useImportCertificateMutation } from "@/pages/(app)/certificate/api/useImportCertificateMutation.ts";
import { CERTIFICATE_FIELD } from "@/pages/(app)/certificate/certificateFormConfig.ts";
import {
    certificateUploadItemSchema,
    CertificateUploadItemTransient,
    CertKey,
    toCertificateUploadItem,
} from "@/pages/(app)/certificate/types/types.ts";
import {
    applyBackendFieldErrors,
    type BackendErrorForm,
} from "@/services/errors/formErrorMapping.ts";
import { submitWithFormErrors } from "@/services/errors/submitWithFormErrors.ts";
import { toAppErrorOrUndefined } from "@/services/errors/toAppError.ts";

export const useCertificateCreateForm = ({
    onSuccess,
}: {
    onSuccess: (key: CertKey) => void;
}) => {
    const { mutateAsync: uploadCertificate, error: uploadMutationError } =
        useImportCertificateMutation();
    const uploadError = computed(() =>
        toAppErrorOrUndefined(uploadMutationError.value),
    );
    const { isRequired } = useZodFormRules();

    const getEmptyItem = (): CertificateUploadItemTransient => ({
        file: undefined,
        password: "",
    });

    const getFormFields = (
        item: Ref<CertificateUploadItemTransient>,
    ): FormField[] => {
        const file = computed<File | undefined>({
            get: () => item.value.file,
            set: (value) => {
                item.value = { ...item.value, file: value };
            },
        });

        const password = computed<string | undefined>({
            get: () => item.value.password,
            set: (value) => {
                item.value = { ...item.value, password: value ?? "" };
            },
        });

        return [
            {
                type: "file" as const,
                name: CERTIFICATE_FIELD.file,
                model: file,
                label: i18n.global.t(
                    "certificates.createDialog.fields.file.label",
                ),
                hint: i18n.global.t(
                    "certificates.createDialog.fields.file.hint",
                ),
                acceptExtensions: [".p12", ".pfx", ".pem", ".crt", ".cer"],
                icon: "mdi-file-certificate-outline",
                required: isRequired(certificateUploadItemSchema.shape.file),
            },
            {
                type: "password" as const,
                name: CERTIFICATE_FIELD.password,
                model: password,
                label: i18n.global.t(
                    "certificates.createDialog.fields.password.label",
                ),
            },
        ];
    };

    const handleUploadCertificate = async (
        itemTransient: CertificateUploadItemTransient,
        form?: BackendErrorForm,
    ): Promise<boolean> => {
        const item = toCertificateUploadItem(itemTransient);

        const cert = await submitWithFormErrors({
            run: () =>
                uploadCertificate({
                    file: item.file,
                    password: item.password,
                }),
            applyErrors: (err) =>
                applyBackendFieldErrors(err, {
                    forms: [
                        {
                            form,
                            fields: [
                                CERTIFICATE_FIELD.file,
                                CERTIFICATE_FIELD.password,
                            ],
                        },
                    ],
                }),
            error: uploadError,
            contextLabel: "certificate",
        });
        if (!cert) {
            return false;
        }
        onSuccess({ id: cert.alias, name: cert.alias });
        return true;
    };

    return {
        getEmptyItem,
        getFormFields,
        handleUploadCertificate,
    };
};
