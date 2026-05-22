import { computed, Ref } from "vue";
import i18n from "@/i18n";

import { FormField } from "@/components/widgets/formBuilder/types.ts";
import {
    CertificateUploadItemTransient,
    CertKey,
    toCertificateUploadItem,
} from "@/pages/(app)/certificate/types/types.ts";
import { useCreateCertificate } from "@/pages/(app)/certificate/composables/api/useCreateCertificate.ts";
import { notify } from "@/services/notifications/notify.ts";

export const useCertificateCreateForm = ({
    onSuccess,
}: {
    onSuccess: (key: CertKey) => void;
}) => {
    const {
        data: cert,
        mutateData: uploadCertificate,
        error: uploadError,
    } = useCreateCertificate();

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
                name: "file",
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
                name: "password",
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

        await uploadCertificate({
            file: item.file,
            fileName: item.file.name,
            password: item.password,
        });

        if (uploadError.value) {
            notify.serverError(uploadError.value, {
                contextLabel: "certificate",
            });
            return;
        }

        const createdName =
            cert.value?.alias || item.file.name.replace(/\.[^.]+$/i, "");
        const createdId = cert.value?.alias || createdName;

        onSuccess({ id: createdId, name: createdName });
    };

    return {
        getEmptyItem,
        getFormFields,
        handleUploadCertificate,
    };
};
