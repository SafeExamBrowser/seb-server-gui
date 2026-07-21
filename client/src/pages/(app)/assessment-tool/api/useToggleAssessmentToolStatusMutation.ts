import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { computed } from "vue";

import { getLmsSetupsQueryKey } from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import type { EntityProcessingReport } from "@/api/seb-server/generated/hey-api/types.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import type { AssessmentToolPage } from "@/models/assessmentTool.ts";
import { entityProcessingReportToAppError } from "@/services/errors/toAppError.ts";
import type { AppError } from "@/services/errors/types.ts";
import {
    activateAssessmentTool,
    deactivateAssessmentTool,
} from "@/services/seb-server/assessmentToolService.ts";

const listKey = () => getLmsSetupsQueryKey({ client: heySebServerClient });

const flipActiveInList =
    (modelId: string, isActive: boolean) =>
    (page: AssessmentToolPage | undefined): AssessmentToolPage | undefined =>
        page
            ? {
                  ...page,
                  content: page.content?.map((tool) =>
                      String(tool.id) === modelId
                          ? { ...tool, active: isActive }
                          : tool,
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

export const useToggleAssessmentToolStatusMutation = () => {
    const queryClient = useQueryClient();

    const activate = useMutation<
        EntityProcessingReport,
        AppError | Error,
        string
    >({
        mutationFn: (modelId: string) =>
            throwOnReportErrors(activateAssessmentTool(modelId)),
        onSuccess: (_data, modelId) => {
            queryClient.setQueriesData<AssessmentToolPage>(
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
            throwOnReportErrors(deactivateAssessmentTool(modelId)),
        onSuccess: (_data, modelId) => {
            queryClient.setQueriesData<AssessmentToolPage>(
                { queryKey: listKey() },
                flipActiveInList(modelId, false),
            );
            void queryClient.invalidateQueries({ queryKey: listKey() });
        },
    });

    const changeAssessmentToolStatus = (
        modelId: string,
        isCurrentlyActive: boolean,
    ) => {
        activate.reset();
        deactivate.reset();
        const mutation = isCurrentlyActive ? deactivate : activate;
        return mutation.mutateAsync(modelId);
    };

    return {
        changeAssessmentToolStatus,
        isPending: computed(
            () => activate.isPending.value || deactivate.isPending.value,
        ),
        error: computed(
            () => activate.error.value ?? deactivate.error.value ?? undefined,
        ),
    };
};
