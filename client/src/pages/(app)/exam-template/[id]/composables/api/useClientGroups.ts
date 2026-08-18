import { useQueryClient } from "@tanstack/vue-query";

import { getExamTemplateByIdQueryKey } from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
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

export const useClientGroups = (examTemplateId: number) => {
    const queryClient = useQueryClient();

    // group changes also mutate backend-derived template state (e.g. sps flags), so refetch the whole template
    const invalidateExamTemplate = () =>
        queryClient.invalidateQueries({
            queryKey: getExamTemplateByIdQueryKey({
                client: heySebServerClient,
                path: { modelId: String(examTemplateId) },
            }),
        });

    const deleteMutation = useMutation((clientGroupId: number) =>
        deleteClientGroup(examTemplateId, clientGroupId),
    );

    const createItem = async (group: ClientGroup) => {
        await createClientGroup(examTemplateId, group);
        await invalidateExamTemplate();
    };

    const updateItem = async (group: ClientGroupExisting) => {
        await updateClientGroup(examTemplateId, group);
        await invalidateExamTemplate();
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

        await invalidateExamTemplate();
    };

    return {
        createItem,
        updateItem,
        deleteItem,
    };
};
