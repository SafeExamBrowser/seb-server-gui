import { computed, Ref } from "vue";
import i18n from "@/i18n";

import { FormField } from "@/components/widgets/formBuilder/types";
import { CertUploadItem } from "@/components/views/seb-server/certificate/certificates/types";

export const useCertUploadForm = ({
    onSuccess: onSuccess,
}: {
    onSuccess: () => void;
}) => {
    const getEmptyItem = (): CertUploadItem => ({
        file: null,
        password: "",
    });

    const getFormFields = (item: Ref<CertUploadItem>): FormField[] => {
        const password = computed<string | undefined>({
            get: () => item.value.password,
            set: (value) => {
                item.value = { ...item.value, password: value ?? "" };
            },
        });

        return [
            // TODO @alain: add file field once FormBuilder supports it
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
