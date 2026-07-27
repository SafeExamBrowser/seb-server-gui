import { computed, type Ref } from "vue";

import { Exam } from "@/models/seb-server/exam.ts";
import { GUIAction, useAbilities } from "@/services/ability.ts";

export const useExamActionDisabled = (
    exam: Ref<Exam | undefined>,
    action: GUIAction,
) => {
    const ability = useAbilities();

    return computed(() => !ability.canDoExamAction(action, exam.value ?? null));
};
