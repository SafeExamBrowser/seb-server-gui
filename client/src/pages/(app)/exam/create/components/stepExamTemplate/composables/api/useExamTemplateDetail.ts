import { useMutation } from "@tanstack/vue-query";
import { computed } from "vue";

import { toAppErrorOrUndefined } from "@/services/errors/toAppError.ts";
import { getExamTemplateSelectionById } from "@/services/seb-server/examTemplateService.ts";

export const useExamTemplateDetail = () => {
    const { data, isPending, error, mutateAsync } = useMutation({
        mutationFn: (id: string) => getExamTemplateSelectionById(id),
    });

    return {
        data,
        loading: isPending,
        error: computed(() => toAppErrorOrUndefined(error.value)),
        fetch: (id: string) => mutateAsync(id).catch(() => undefined),
    };
};
