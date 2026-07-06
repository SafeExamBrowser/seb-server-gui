import { computed } from "vue";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { getInstitutionsQueryKey } from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import {
    activateInstitution,
    deactivateInstitution,
} from "@/services/seb-server/institutionService.ts";
import { entityProcessingReportToAppError } from "@/services/errors/toAppError.ts";
import type { AppError } from "@/services/errors/types.ts";
import type { InstitutionPage } from "@/models/institution.ts";
import type { EntityProcessingReport } from "@/api/seb-server/generated/hey-api/types.gen.ts";

const listKey = () => getInstitutionsQueryKey({ client: heySebServerClient });

const flipActiveInList =
    (modelId: string, isActive: boolean) =>
    (page: InstitutionPage | undefined): InstitutionPage | undefined =>
        page
            ? {
                  ...page,
                  content: page.content?.map((institution) =>
                      String(institution.id) === modelId
                          ? { ...institution, active: isActive }
                          : institution,
                  ),
              }
            : page;

const throwOnReportErrors = async (
    report: Promise<EntityProcessingReport>,
): Promise<EntityProcessingReport> => {
    const resolved = await report;
    const reportError = entityProcessingReportToAppError(resolved);
    if (reportError) {
        throw reportError;
    }
    return resolved;
};

export const useToggleInstitutionStatusMutation = () => {
    const queryClient = useQueryClient();

    const activate = useMutation<
        EntityProcessingReport,
        AppError | Error,
        string
    >({
        mutationFn: (modelId: string) =>
            throwOnReportErrors(activateInstitution(modelId)),
        onSuccess: (_data, modelId) => {
            queryClient.setQueriesData<InstitutionPage>(
                { queryKey: listKey() },
                flipActiveInList(modelId, true),
            );
            void queryClient.invalidateQueries({ queryKey: listKey() });
        },
    });

    const deactivate = useMutation<
        EntityProcessingReport,
        AppError | Error,
        string
    >({
        mutationFn: (modelId: string) =>
            throwOnReportErrors(deactivateInstitution(modelId)),
        onSuccess: (_data, modelId) => {
            queryClient.setQueriesData<InstitutionPage>(
                { queryKey: listKey() },
                flipActiveInList(modelId, false),
            );
            void queryClient.invalidateQueries({ queryKey: listKey() });
        },
    });

    const changeInstitutionStatus = (
        modelId: string,
        isCurrentlyActive: boolean,
    ) => {
        activate.reset();
        deactivate.reset();
        const mutation = isCurrentlyActive ? deactivate : activate;
        return mutation.mutateAsync(modelId);
    };

    return {
        changeInstitutionStatus,
        isPending: computed(
            () => activate.isPending.value || deactivate.isPending.value,
        ),
        error: computed(
            () => activate.error.value ?? deactivate.error.value ?? undefined,
        ),
    };
};
