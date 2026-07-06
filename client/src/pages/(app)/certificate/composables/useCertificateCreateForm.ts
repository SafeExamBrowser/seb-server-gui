import { computed, Ref } from "vue";
import i18n from "@/i18n";

import { FormField } from "@/components/widgets/formBuilder/types.ts";
import {
    CertificateUploadItemTransient,
    CertKey,
    toCertificateUploadItem,
} from "@/pages/(app)/certificate/types/types.ts";
import { useImportCertificateMutation } from "@/pages/(app)/certificate/api/useImportCertificateMutation.ts";
import { CERTIFICATE_FIELD } from "@/pages/(app)/certificate/certificateFormConfig.ts";
import { toAppErrorOrUndefined } from "@/services/errors/toAppError.ts";
import { notify } from "@/services/notifications/notify.ts";

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
                required: true,
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
    ): Promise<void> => {
        const item = toCertificateUploadItem(itemTransient);

        try {
            const cert = await uploadCertificate({
                file: item.file,
                password: item.password,
            });
            onSuccess({ id: cert.alias, name: cert.alias });
        } catch {
            notify.serverError(uploadError.value, {
                contextLabel: "certificate",
            });
        }
    };

    return {
        getEmptyItem,
        getFormFields,
        handleUploadCertificate,
    };
};
