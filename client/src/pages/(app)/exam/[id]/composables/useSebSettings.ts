import { computed, type Ref } from "vue";

import { Exam } from "@/models/seb-server/exam.ts";
import { GUIAction, useAbilities } from "@/services/ability.ts";

export const useSebSettings = (exam: Ref<Exam | undefined>) => {
    const ability = useAbilities();

    const editDisabled = computed(
        () =>
            !ability.canDoExamAction(
                GUIAction.EDIT_SEB_SETTINGS,
                exam.value ?? null,
            ),
    );

    return {
        editDisabled,
    };
};
