import { computed, Ref } from "vue";
import i18n from "@/i18n";

import { FormField } from "@/components/widgets/formBuilder/types";
import { CertUploadItem } from "@/components/views/seb-server/certificate/certificates/types";
import { useCreateCertificate } from "@/components/views/seb-server/certificate/certificates/api/useCreateCertificate";

export const useCertificateCreateForm = ({
    onSuccess,
}: {
    onSuccess: () => void;
}) => {
    const { mutateData: uploadCertificate, error: uploadError } =
        useCreateCertificate();

    const getEmptyItem = (): CertUploadItem => ({
        file: undefined,
        password: "",
    });

    const getFormFields = (item: Ref<CertUploadItem>): FormField[] => {
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
                label: i18n.global.t("certificates.upload.dropHere"),
                acceptExtensions: [".p12", ".pfx", ".pem", ".crt", ".cer"],
                icon: "mdi-file-certificate-outline",
                required: true,
            },
            {
                type: "password" as const,
                name: "password",
                model: password,
                label: i18n.global.t("certificates.upload.password"),
            },
        ];
    };

    const handleUploadCertificate = async (
        item: CertUploadItem,
    ): Promise<void> => {
        if (!item.file) {
            // TODO @alain: this shouldn't happen. But maybe do zod validation here?
            // TODO @alain: also, the password itself is required I think. Make sure that this is properly taken care of, including the empty string case.
            throw new Error("File is required!");
        }

        await uploadCertificate({
            file: item.file,
            fileName: item.file.name,
            password: item.password,
        });

        if (uploadError.value) {
            // TODO @alain: proper error handling
            throw new Error(uploadError.value);
        }

        onSuccess();
    };

    return {
        getEmptyItem,
        getFormFields,
        handleUploadCertificate,
    };
};
