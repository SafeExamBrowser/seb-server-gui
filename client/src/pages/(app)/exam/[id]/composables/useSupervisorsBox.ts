import { computed, type Ref } from "vue";

import { useSupervisors } from "@/composables/useSupervisors.ts";
import { Exam } from "@/models/seb-server/exam.ts";
import { GUIAction } from "@/services/ability.ts";

import { useExamActionAccess } from "./useExamActionAccess.ts";

export const useSupervisorsBox = (
    exam: Ref<Exam | undefined>,
    updateExam: (patch: Partial<Exam>) => Promise<void>,
) => {
    const { data: supervisors, loading, error } = useSupervisors();

    const availableSupervisors = computed(() => supervisors.value ?? []);

    const selectedSupervisorIds = computed(() => exam.value?.supporter ?? []);

    const { hidden: editHidden, disabled: editDisabled } = useExamActionAccess(
        exam,
        GUIAction.EDIT_SUPERVISORS,
    );

    const handleChange = async (ids: string[]) => {
        await updateExam({ supporter: ids });
    };

    return {
        availableSupervisors,
        selectedSupervisorIds,
        editHidden,
        editDisabled,
        handleChange,
        loading,
        error,
    };
};
