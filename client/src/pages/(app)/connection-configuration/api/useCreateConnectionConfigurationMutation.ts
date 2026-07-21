import { useMutation, useQueryClient } from "@tanstack/vue-query";

import { getSebClientConfigsQueryKey } from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import type { ConnectionConfigurationCreateRequest } from "@/models/connectionConfiguration.ts";
import { createConnectionConfiguration } from "@/services/seb-server/connectionConfigurationService.ts";

export const useCreateConnectionConfigurationMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (body: ConnectionConfigurationCreateRequest) =>
            createConnectionConfiguration(body),
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: getSebClientConfigsQueryKey({
                    client: heySebServerClient,
                }),
            }),
    });
};
