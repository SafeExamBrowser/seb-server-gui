import { defineStore } from "pinia";
import { useBaseSettingsStore } from "@/components/views/seb-server/settings-navigation/store/useBaseSettingsStore.ts";
import { Certificate } from "@/models/seb-server/certificate.ts";

export const useCertificatesStore = defineStore("certificate", () => {
    return useBaseSettingsStore<Certificate>();
});
