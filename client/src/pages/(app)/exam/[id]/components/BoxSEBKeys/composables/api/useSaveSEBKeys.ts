import { useMutation } from "@tanstack/vue-query";
import { Ref } from "vue";

import { Exam } from "@/models/seb-server/exam";
import { SEBKeys } from "@/models/seb-server/sebKeys";
import * as examService from "@/services/seb-server/examService.ts";
import { getSEBKeys } from "@/services/seb-server/examService.ts";

export const useSaveSEBKeys = (sebKeysRef: Ref<SEBKeys | undefined>) => {
    return useMutation({
        mutationFn: (body: SEBKeys) => examService.updateSEBKeys(body),
        onSuccess: async (exam: Exam) => {
            const newKeys = await getSEBKeys(String(exam.id));
            sebKeysRef.value = newKeys;
        },
    });
};
