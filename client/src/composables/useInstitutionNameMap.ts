import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { computed, ref } from "vue";

import { getInstitutionInfoQueryKey } from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import { toAppErrorOrUndefined } from "@/services/errors/toAppError.ts";
import { getInstitutions } from "@/services/seb-server/institutionInfoService.ts";

const queryKey = getInstitutionInfoQueryKey({ client: heySebServerClient });

export const useInstitutionNameMap = () => {
    const queryClient = useQueryClient();
    const requested = ref(false);

    const query = useQuery({
        queryKey,
        queryFn: () => getInstitutions(),
        enabled: requested,
    });

    const institutions = computed(() => query.data.value ?? []);

    const institutionIdToNameMap = computed(() => {
        const map = new Map<string, string>();

        institutions.value.forEach((institution) => {
            map.set(String(institution.modelId), institution.name);
        });

        return map;
    });

    const fetchInstitutions = async () => {
        requested.value = true;

        try {
            await queryClient.ensureQueryData({
                queryKey,
                queryFn: () => getInstitutions(),
            });
        } catch {
            /* surfaced via the query error below */
        }
    };

    const getInstitutionName = (id: unknown): string => {
        if (id === null || id === undefined) {
            return "";
        }

        return institutionIdToNameMap.value.get(String(id)) ?? String(id);
    };

    return {
        institutions,
        loading: query.isLoading,
        error: computed(() => toAppErrorOrUndefined(query.error.value)),
        fetchInstitutions,
        getInstitutionName,
    };
};
