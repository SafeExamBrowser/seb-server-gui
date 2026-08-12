import { useMutation } from "@tanstack/vue-query";
import { computed } from "vue";

import { toAppErrorOrUndefined } from "@/services/errors/toAppError.ts";
import { getExamTemplateScreenProctoringSettings } from "@/services/seb-server/examTemplateService.ts";

export const useExamTemplateScreenProctoring = () => {
    const { data, isPending, error, mutateAsync } = useMutation({
        mutationFn: (id: number) => getExamTemplateScreenProctoringSettings(id),
    });

    return {
        data,
        loading: isPending,
        error: computed(() => toAppErrorOrUndefined(error.value)),
        fetch: (id: number) => mutateAsync(id).catch(() => undefined),
    };
};
