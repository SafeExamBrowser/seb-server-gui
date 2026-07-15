import { queryOptions, useQuery } from "@tanstack/vue-query";
import { getCurrentUserGuiAbilitiesQueryKey } from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient";
import { getCurrentUserGuiAbilities } from "@/services/seb-server/guiAbilitiesService";
import { queryClient } from "@/services/http/queryClient";

export const guiAbilitiesQueryOptions = () =>
    queryOptions({
        queryKey: getCurrentUserGuiAbilitiesQueryKey({
            client: heySebServerClient,
        }),
        queryFn: () => getCurrentUserGuiAbilities(),
    });

export const useGuiAbilitiesQuery = () => useQuery(guiAbilitiesQueryOptions());

export function clearGuiAbilities(): void {
    queryClient.removeQueries({
        queryKey: guiAbilitiesQueryOptions().queryKey,
    });
}
