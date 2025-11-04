import { computed, Ref, ref } from "vue";
import i18n from "@/i18n";
import { UserAccountName } from "@/models/userAccount";

export const usePicker = (
    supervisors: UserAccountName[],
    supervisorIdsSelected: Ref<string[]>,
) => {
    const titleSupervisorsAvailable = computed(() =>
        i18n.global.t(
            "createTemplateExam.steps.supervisors.labelSupervisorsAvailable",
        ),
    );

    const titleSupervisorsSelected = computed(() =>
        i18n.global.t(
            "createTemplateExam.steps.supervisors.labelSupervisorsSelected",
        ),
    );

    const searchText = ref<string | undefined>();

    const clearSearch = () => {
        searchText.value = undefined;
    };

    const supervisorsAvailable = computed(() => {
        const searchTextLowerCase = searchText.value?.toLowerCase() || "";
        return supervisors
            .filter(
                (supervisor) =>
                    !supervisorIdsSelected.value.includes(supervisor.modelId),
            )
            .filter((supervisor) =>
                supervisor.name.toLowerCase().includes(searchTextLowerCase),
            );
    });

    const supervisorsSelected = computed(() =>
        supervisors.filter((supervisor) =>
            supervisorIdsSelected.value.includes(supervisor.modelId),
        ),
    );

    const handleSupervisorSelected = (supervisorId: string) => {
        if (supervisorIdsSelected.value.includes(supervisorId)) {
            throw new Error("Supervisor already selected");
        }

        supervisorIdsSelected.value = [
            ...supervisorIdsSelected.value,
            supervisorId,
        ];
    };

    const handleSupervisorUnselected = (supervisorId: string) => {
        if (!supervisorIdsSelected.value.includes(supervisorId)) {
            throw new Error("Supervisor not selected");
        }

        supervisorIdsSelected.value = [
            ...supervisorIdsSelected.value.filter((id) => id !== supervisorId),
        ];
    };

    return {
        titleSupervisorsAvailable,
        titleSupervisorsSelected,
        supervisorsAvailable,
        supervisorsSelected,
        handleSupervisorSelected,
        handleSupervisorUnselected,
        searchText,
        clearSearch,
    };
};
