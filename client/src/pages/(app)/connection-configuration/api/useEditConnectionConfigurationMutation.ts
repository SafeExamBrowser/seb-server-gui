import { useMutation, useQueryClient } from "@tanstack/vue-query";

import {
    getSebClientConfigByIdQueryKey,
    getSebClientConfigsQueryKey,
} from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import type {
    ConnectionConfiguration,
    ConnectionConfigurationEditRequest,
} from "@/models/connectionConfiguration.ts";
import { editConnectionConfiguration } from "@/services/seb-server/connectionConfigurationService.ts";

export const useEditConnectionConfigurationMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (body: ConnectionConfigurationEditRequest) =>
            editConnectionConfiguration(body),
        onSuccess: (data: ConnectionConfiguration) => {
            queryClient.invalidateQueries({
                queryKey: getSebClientConfigsQueryKey({
                    client: heySebServerClient,
                }),
            });

            queryClient.setQueryData(
                getSebClientConfigByIdQueryKey({
                    client: heySebServerClient,
                    path: { modelId: String(data.id) },
                }),
                data,
            );
        },
    });
};
