import { useFetch } from "@/composables/useFetch.ts";
import { getExamConfigMapping } from "@/services/seb-server/examService.ts";

export const useExamConfigMapping = (id?: number) =>
    useFetch(
        async () => {
            if (id === undefined) {
                return null;
            }

            return getExamConfigMapping(id);
        },
        { immediate: id !== undefined },
    );
