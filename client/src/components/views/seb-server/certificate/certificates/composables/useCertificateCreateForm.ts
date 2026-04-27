import { computed, Ref } from "vue";
import i18n from "@/i18n";

import { FormField } from "@/components/widgets/formBuilder/types";
import { CertUploadItem } from "@/components/views/seb-server/certificate/certificates/types";

export const useCertificateCreateForm = ({
    onSuccess,
}: {
    onSuccess: () => void;
}) => {
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
        // TODO @alain: call api here instead (see UploadDialog.vue:373-405)
        console.log("TODO @alain: submit data:", item);
        onSuccess();

        // TODO @alain: in case of error, do something like this
        // throw new Error(
        //     "File upload field not yet wired up — coming in next commit",
        // );
    };

    return {
        getEmptyItem,
        getFormFields,
        handleUploadCertificate,
    };
};
