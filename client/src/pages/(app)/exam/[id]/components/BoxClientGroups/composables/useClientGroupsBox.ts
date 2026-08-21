import { useMutation as useTanstackMutation } from "@tanstack/vue-query";
import { computed, type Ref } from "vue";

import { useFetch } from "@/composables/useFetch.ts";
import { useMutation } from "@/composables/useMutation.ts";
import i18n from "@/i18n";
import { ClientGroup } from "@/models/seb-server/clientGroup.ts";
import { Exam } from "@/models/seb-server/exam.ts";
import { ClientGroupExisting } from "@/models/seb-server/examTemplate.ts";
import { templateGroupToClientGroup } from "@/pages/(app)/exam/[id]/components/BoxClientGroups/utils/templateGroupToClientGroup.ts";
import { useExamActionAccess } from "@/pages/(app)/exam/[id]/composables/useExamActionAccess.ts";
import { GUIAction } from "@/services/ability.ts";
import {
    appErrorToMessage,
    isNotFoundError,
    toAppErrorOrUndefined,
} from "@/services/errors/toAppError.ts";
import { notify } from "@/services/notifications/notify.ts";
import * as clientGroupService from "@/services/seb-server/clientGroupService.ts";
import { getExamTemplateSelectionById } from "@/services/seb-server/examTemplateService.ts";

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

    const templateFetch = useTanstackMutation({
        mutationFn: (modelId: string) => getExamTemplateSelectionById(modelId),
    });
    const templateError = computed(() =>
        toAppErrorOrUndefined(templateFetch.error.value),
    );

    // a failed fetch must show the empty state, not the previous template's groups
    const templateGroups = computed(() => {
        if (templateError.value) {
            return [];
        }

        return templateFetch.data.value?.CLIENT_GROUP_TEMPLATES ?? [];
    });

    // A deleted template (404) is a regular empty state, not an error
    const templateNotFound = computed(() =>
        isNotFoundError(templateError.value),
    );

    const templateErrorMessage = computed(() =>
        templateNotFound.value || !templateError.value
            ? undefined
            : appErrorToMessage(templateError.value),
    );

    const loadTemplateGroups = () => {
        const templateId = exam.value?.examTemplateId;

        if (templateId === undefined) {
            return;
        }

        void templateFetch
            .mutateAsync(String(templateId))
            .catch(() => undefined);
    };

    const copyMutation = useMutation((templateGroup: ClientGroupExisting) =>
        clientGroupService.createClientGroup(
            templateGroupToClientGroup(examId, templateGroup),
        ),
    );

    const copyTemplateGroup = async (templateGroup: ClientGroupExisting) => {
        await copyMutation.mutateData(templateGroup);

        if (copyMutation.error.value) {
            notify.serverError(copyMutation.error.value, {
                titleOverride: i18n.global.t(
                    "examDetail.boxes.clientGroups.errors.copyFailed",
                ),
            });

            return;
        }

        await groupsFetch.fetchData();
    };

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
        templateGroups,
        templateLoading: templateFetch.isPending,
        templateErrorMessage,
        loadTemplateGroups,
        copyTemplateGroup,
        copyLoading: copyMutation.loading,
        deleteGroup,
        deleteLoading: deleteMutation.loading,
    };
};
