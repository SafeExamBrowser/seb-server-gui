import { type Ref } from "vue";

import { Exam } from "@/models/seb-server/exam.ts";
import { GUIAction } from "@/services/ability.ts";

import { useExamActionDisabled } from "./useExamActionDisabled.ts";

export const useSebSettings = (exam: Ref<Exam | undefined>) => {
    const editDisabled = useExamActionDisabled(
        exam,
        GUIAction.EDIT_SEB_SETTINGS,
    );

    return {
        editDisabled,
    };
};
