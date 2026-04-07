import { onMounted, ref } from "vue";
import { getCertificates } from "@/services/seb-server/certificateService";
import i18n from "@/i18n";

export const useCertificates = () => {
    const uploadOption = {
        label: i18n.global.t(
            "certificates.certificateDialog.uploadCertificate",
        ),
        value: "__UPLOAD__",
    };

    const certificateItems = ref<{ label: string; value: string }[]>([
        uploadOption,
    ]);
    const loading = ref(false);

    async function loadCertificates() {
        loading.value = true;
        try {
            const response = await getCertificates({
                page_number: 1,
                page_size: 500,
            });
            const certAliases: { label: string; value: string }[] =
                response?.content?.map((c: { alias: string }) => ({
                    label: c.alias,
                    value: c.alias,
                })) ?? [];
            certificateItems.value = [uploadOption, ...certAliases];
        } finally {
            loading.value = false;
        }
    }

    const hasRealCerts = () => certificateItems.value.length > 1;

    onMounted(loadCertificates);

    return { certificateItems, loading, loadCertificates, hasRealCerts };
};
