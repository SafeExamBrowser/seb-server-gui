import { useFetch } from "@/composables/useFetch.ts";
import { getActiveSEBClients } from "@/services/seb-server/sebSettingsService.ts";

// The endpoint answers with null when there is no count for the exam. useFetch
// treats null as an error, so map it to "no clients connected" beforehand.
export const useActiveSebClients = (examId: number) =>
    useFetch(async () => (await getActiveSEBClients(String(examId))) ?? 0, {
        immediate: true,
    });
