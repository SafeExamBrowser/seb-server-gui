import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { computed } from "vue";

import { getSebClientConfigsQueryKey } from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import type { EntityProcessingReport } from "@/api/seb-server/generated/hey-api/types.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import type { ConnectionConfigurationPage } from "@/models/connectionConfiguration.ts";
import { entityProcessingReportToAppError } from "@/services/errors/toAppError.ts";
import type { AppError } from "@/services/errors/types.ts";
import {
    activateConnectionConfiguration,
    deactivateConnectionConfiguration,
} from "@/services/seb-server/connectionConfigurationService.ts";

const listKey = () =>
    getSebClientConfigsQueryKey({ client: heySebServerClient });

const flipActiveInList =
    (modelId: string, isActive: boolean) =>
    (
        page: ConnectionConfigurationPage | undefined,
    ): ConnectionConfigurationPage | undefined =>
        page
            ? {
                  ...page,
                  content: page.content?.map((config) =>
                      String(config.id) === modelId
                          ? { ...config, active: isActive }
                          : config,
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

export const useToggleConnectionConfigurationStatusMutation = () => {
    const queryClient = useQueryClient();

    const activate = useMutation<
        EntityProcessingReport,
        AppError | Error,
        string
    >({
        mutationFn: (modelId: string) =>
            throwOnReportErrors(activateConnectionConfiguration(modelId)),
        onSuccess: (_data, modelId) => {
            queryClient.setQueriesData<ConnectionConfigurationPage>(
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
            throwOnReportErrors(deactivateConnectionConfiguration(modelId)),
        onSuccess: (_data, modelId) => {
            queryClient.setQueriesData<ConnectionConfigurationPage>(
                { queryKey: listKey() },
                flipActiveInList(modelId, false),
            );
            void queryClient.invalidateQueries({ queryKey: listKey() });
        },
    });

    const changeConnectionConfigurationStatus = (
        modelId: string,
        isCurrentlyActive: boolean,
    ) => {
        activate.reset();
        deactivate.reset();
        const mutation = isCurrentlyActive ? deactivate : activate;
        return mutation.mutateAsync(modelId);
    };

    return {
        changeConnectionConfigurationStatus,
        isPending: computed(
            () => activate.isPending.value || deactivate.isPending.value,
        ),
        error: computed(
            () => activate.error.value ?? deactivate.error.value ?? undefined,
        ),
    };
};
