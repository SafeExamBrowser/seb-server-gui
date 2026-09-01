import { useFetch } from "@/composables/useFetch.ts";
import { getSEBKeys } from "@/services/seb-server/examService";

export const useFetchSEBKeys = (id: string) =>
    useFetch(() => getSEBKeys(id), { immediate: true });
