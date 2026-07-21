import { watch } from "vue";

import { useFetch } from "@/composables/useFetch.ts";
import { getAssessmentTool } from "@/services/seb-server/assessmentToolInfoService.ts";

export const useAssessmentTool = (lmsSetupId: () => number | undefined) => {
    const fetch = useFetch(async () => {
        const id = lmsSetupId();

        if (id === undefined) {
            return null;
        }

        return getAssessmentTool(id);
    });

    watch(
        lmsSetupId,
        (id) => {
            if (id === undefined) {
                return;
            }

            fetch.fetchData();
        },
        { immediate: true },
    );

    return fetch;
};
