import { computed, type Ref } from "vue";

import { Exam } from "@/models/seb-server/exam.ts";
import { GUIAction, useAbilities } from "@/services/ability.ts";

// Privilege hides the control entirely; the exam's status only disables it.
export const useExamActionAccess = (
    exam: Ref<Exam | undefined>,
    action: GUIAction,
) => {
    const ability = useAbilities();

    const hidden = computed(() => !ability.canDo(action));
    const disabled = computed(
        () => !ability.canDoExamAction(action, exam.value ?? null),
    );

    return { hidden, disabled };
};
