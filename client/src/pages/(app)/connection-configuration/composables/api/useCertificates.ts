import { computed, ref } from "vue";

import type { GetCertificatesData } from "@/api/seb-server/generated/hey-api/types.gen.ts";
import i18n from "@/i18n";
import { useCertificatesQuery } from "@/pages/(app)/certificate/api/useCertificatesQuery.ts";

export const useCertificates = () => {
    const uploadOption = {
        label: i18n.global.t("certificates.createDialog.addButtonTitle"),
        value: "__UPLOAD__",
    };

    const query = ref<GetCertificatesData["query"]>({
        page_number: 1,
        page_size: 500,
    });
    const { data, isFetching, refetch } = useCertificatesQuery(query);

    const certificateItems = computed(() => {
        const certs = (data.value?.content ?? []).map((cert) => ({
            label: cert.alias,
            value: cert.alias,
        }));
        return [uploadOption, ...certs];
    });

    const hasRealCerts = () => certificateItems.value.length > 1;

    const loadCertificates = async () => {
        await refetch();
    };

    return {
        certificateItems,
        loading: isFetching,
        loadCertificates,
        hasRealCerts,
    };
};
