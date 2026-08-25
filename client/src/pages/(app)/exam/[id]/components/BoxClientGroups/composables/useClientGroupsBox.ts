import { computed, type Ref } from "vue";

import { ClientGroupsTableDeps } from "@/components/widgets/clientGroupsTable/types.ts";
import { useFetch } from "@/composables/useFetch.ts";
import { useMutation } from "@/composables/useMutation.ts";
import i18n from "@/i18n";
import { ClientGroupEnum } from "@/models/seb-server/clientGroupEnum.ts";
import { Exam } from "@/models/seb-server/exam.ts";
import {
    ClientGroup,
    ClientGroupExisting,
} from "@/models/seb-server/examTemplate.ts";
import {
    parseExamClientGroup,
    toExamClientGroup,
} from "@/pages/(app)/exam/[id]/components/BoxClientGroups/utils/examClientGroupAdapters.ts";
import { useExamActionAccess } from "@/pages/(app)/exam/[id]/composables/useExamActionAccess.ts";
import { GUIAction } from "@/services/ability.ts";
import { notify } from "@/services/notifications/notify.ts";
import * as clientGroupService from "@/services/seb-server/clientGroupService.ts";
import { getScreenProctoringForExam } from "@/utils/clientGroup.ts";

export const useClientGroupsBox = (
    examId: number,
    exam: Ref<Exam | undefined>,
    refetchExam: () => Promise<void>,
) => {
    const groupsFetch = useFetch(
        () => clientGroupService.getClientGroups(String(examId)),
        { immediate: true },
    );

    // the backend-managed collecting group is represented by the widget's own
    // synthetic fallback row, so a wire row of that type is excluded, not parsed
    const clientGroups = computed(() =>
        (groupsFetch.data.value?.content ?? [])
            .filter((group) => group.type !== ClientGroupEnum.SP_FALLBACK_GROUP)
            .map(parseExamClientGroup)
            .filter((group) => group !== undefined),
    );

    const { hidden: editHidden, disabled: editDisabled } = useExamActionAccess(
        exam,
        GUIAction.EDIT_CLIENT_GROUPS,
    );

    const screenProctoring = computed(() =>
        getScreenProctoringForExam(exam.value?.additionalAttributes),
    );

    // group changes also mutate backend-derived screen proctoring attributes
    // (groups selection, fallback name), so refetch the exam as well
    const refetchAll = async () => {
        await Promise.all([groupsFetch.fetchData(), refetchExam()]);
    };

    const createItem = async (group: ClientGroup) => {
        await clientGroupService.createClientGroup(
            toExamClientGroup(examId, group),
        );
        await refetchAll();
    };

    const updateItem = async (group: ClientGroupExisting) => {
        // full-entity PUT: carry over the wire-only fields the strict schema
        // strips, so they survive the update
        const original = groupsFetch.data.value?.content.find(
            (wireGroup) => wireGroup.id === group.id,
        );

        await clientGroupService.updateClientGroup({
            color: original?.color,
            icon: original?.icon,
            ...toExamClientGroup(examId, group),
        });
        await refetchAll();
    };

    const deleteMutation = useMutation((clientGroupId: number) =>
        clientGroupService.deleteClientGroup(String(clientGroupId)),
    );

    const deleteItem = async (group: ClientGroupExisting) => {
        await deleteMutation.mutateData(group.id);

        if (deleteMutation.error.value) {
            notify.serverError(deleteMutation.error.value, {
                titleOverride: i18n.global.t(
                    "examDetail.boxes.clientGroups.errors.deleteFailed",
                ),
            });

            return;
        }

        await refetchAll();
    };

    const tableDeps: ClientGroupsTableDeps = {
        clientGroups,
        screenProctoring: {
            enabled: computed(() => screenProctoring.value.enabled),
            collectionStrategy: computed(
                () => screenProctoring.value.collectionStrategy,
            ),
            fallbackGroupName: computed(
                () => screenProctoring.value.fallbackGroupName,
            ),
        },
        access: {
            hidden: editHidden,
            disabled: editDisabled,
        },
        createItem,
        updateItem,
        deleteItem,
        confirmDelete: true,
    };

    // only the initial load may swap the table for the loading/error fallback;
    // background refetches after a mutation must not tear down the box
    const initialLoad = computed(() => groupsFetch.data.value === undefined);

    return {
        tableDeps,
        loading: computed(() => groupsFetch.loading.value && initialLoad.value),
        error: computed(() =>
            initialLoad.value ? groupsFetch.error.value : undefined,
        ),
    };
};
