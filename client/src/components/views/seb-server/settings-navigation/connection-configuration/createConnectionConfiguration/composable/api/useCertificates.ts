import { computed, onMounted } from "vue";
import { useFetch } from "@/composables/useFetch";
import { getCertificates } from "@/services/seb-server/certificateService";
import i18n from "@/i18n";
import type { Certificate } from "@/models/seb-server/certificate";

export const useCertificates = () => {
    const uploadOption = {
        label: i18n.global.t(
            "certificates.certificateDialog.uploadCertificate",
        ),
        value: "__UPLOAD__",
    };

    const { data, loading, error, fetchData } = useFetch(() =>
        getCertificates({ page_number: 1, page_size: 500 }),
    );

    onMounted(fetchData);

    const certificateItems = computed(() => {
        const certs = (data.value?.content ?? []).map((c: Certificate) => ({
            label: c.alias,
            value: c.alias,
        }));
        return [uploadOption, ...certs];
    });

    const hasRealCerts = () => certificateItems.value.length > 1;

    return {
        certificateItems,
        loading,
        error,
        loadCertificates: fetchData,
        hasRealCerts,
    };
};
