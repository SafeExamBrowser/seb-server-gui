import { computed, type Ref } from "vue";

import { useFetch } from "@/composables/useFetch.ts";
import { useMutation } from "@/composables/useMutation.ts";
import i18n from "@/i18n";
import { ClientGroup } from "@/models/seb-server/clientGroup.ts";
import { Exam } from "@/models/seb-server/exam.ts";
import { useExamActionAccess } from "@/pages/(app)/exam/[id]/composables/useExamActionAccess.ts";
import { GUIAction } from "@/services/ability.ts";
import { notify } from "@/services/notifications/notify.ts";
import * as clientGroupService from "@/services/seb-server/clientGroupService.ts";

export const useClientGroupsBox = (
    examId: number,
    exam: Ref<Exam | undefined>,
) => {
    const groupsFetch = useFetch(
        () => clientGroupService.getClientGroups(String(examId)),
        { immediate: true },
    );

    const clientGroups = computed(() => groupsFetch.data.value?.content ?? []);

    const { hidden: editHidden, disabled: editDisabled } = useExamActionAccess(
        exam,
        GUIAction.EDIT_CLIENT_GROUPS,
    );

    const deleteMutation = useMutation((clientGroupId: number) =>
        clientGroupService.deleteClientGroup(String(clientGroupId)),
    );

    const deleteGroup = async (group: ClientGroup) => {
        if (group.id === undefined) {
            return;
        }

        await deleteMutation.mutateData(group.id);

        if (deleteMutation.error.value) {
            notify.serverError(deleteMutation.error.value, {
                titleOverride: i18n.global.t(
                    "examDetail.boxes.clientGroups.errors.deleteFailed",
                ),
            });

            return;
        }

        await groupsFetch.fetchData();
    };

    return {
        clientGroups,
        loading: groupsFetch.loading,
        error: groupsFetch.error,
        editHidden,
        editDisabled,
        deleteGroup,
        deleteLoading: deleteMutation.loading,
    };
};
