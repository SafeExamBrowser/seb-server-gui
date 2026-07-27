import { useFetch } from "@/composables/useFetch.ts";
import { getExam } from "@/services/seb-server/examService.ts";

export const useExam = (id?: number) =>
    useFetch(() => getExam(String(id)), {
        immediate: id !== undefined,
    });
