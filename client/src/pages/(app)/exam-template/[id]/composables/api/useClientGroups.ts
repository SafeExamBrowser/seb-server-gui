import { computed, ref } from "vue";

import { useMutation } from "@/composables/useMutation.ts";
import i18n from "@/i18n";
import {
    ClientGroup,
    ClientGroupExisting,
} from "@/models/seb-server/examTemplate.ts";
import { notify } from "@/services/notifications/notify.ts";
import {
    createClientGroup,
    deleteClientGroup,
    updateClientGroup,
} from "@/services/seb-server/examTemplateClientGroupService.ts";

export const useClientGroups = (
    examTemplateId: number,
    initialClientGroups: ClientGroupExisting[],
) => {
    const data = ref<ClientGroupExisting[]>([...initialClientGroups]);

    const deleteMutation = useMutation((clientGroupId: number) =>
        deleteClientGroup(examTemplateId, clientGroupId),
    );

    const clientGroups = computed<ClientGroupExisting[]>(() => data.value);

    const createItem = async (group: ClientGroup) => {
        const created = await createClientGroup(examTemplateId, group);
        data.value = [...data.value, created];
    };

    const updateItem = async (group: ClientGroupExisting) => {
        const updated = await updateClientGroup(examTemplateId, group);
        data.value = data.value.map((existing) =>
            existing.id === updated.id ? updated : existing,
        );
    };

    const deleteItem = async (group: ClientGroupExisting) => {
        await deleteMutation.mutateData(group.id);

        if (deleteMutation.error.value) {
            notify.serverError(deleteMutation.error.value, {
                titleOverride: i18n.global.t(
                    "examTemplateDetail.boxes.groups.errors.deleteFailed",
                ),
            });

            return;
        }

        data.value = data.value.filter((existing) => existing.id !== group.id);
    };

    return {
        clientGroups,
        createItem,
        updateItem,
        deleteItem,
    };
};
