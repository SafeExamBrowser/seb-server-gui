import { useFetch } from "@/composables/useFetch.ts";
import { getConsecutiveExamSelection } from "@/services/seb-server/examService";

export const useConsecutiveExamNames = (id: string) =>
    useFetch(() => getConsecutiveExamSelection(id), { immediate: true });
