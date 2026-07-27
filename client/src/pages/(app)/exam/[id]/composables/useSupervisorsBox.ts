import { computed, type Ref } from "vue";

import { useSupervisors } from "@/composables/useSupervisors.ts";
import { Exam } from "@/models/seb-server/exam.ts";
import { GUIAction, useAbilities } from "@/services/ability.ts";

export const useSupervisorsBox = (
    exam: Ref<Exam | undefined>,
    updateExam: (patch: Partial<Exam>) => Promise<void>,
) => {
    const ability = useAbilities();

    const { data: supervisors, loading, error } = useSupervisors();

    const availableSupervisors = computed(() => supervisors.value ?? []);

    const selectedSupervisorIds = computed(() => exam.value?.supporter ?? []);

    const editDisabled = computed(
        () =>
            !ability.canDoExamAction(
                GUIAction.EDIT_SUPERVISORS,
                exam.value ?? null,
            ),
    );

    const handleChange = async (ids: string[]) => {
        await updateExam({ supporter: ids });
    };

    return {
        availableSupervisors,
        selectedSupervisorIds,
        editDisabled,
        handleChange,
        loading,
        error,
    };
};
