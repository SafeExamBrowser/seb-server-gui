import { computed } from "vue";
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { useCurrentUser } from "@/composables/useCurrentUser";
import { getInstitutionById } from "@/services/seb-server/institutionService";

const BRANDING_KEY_ROOT = "institutionBranding";

export function useInstitutionBranding() {
    const queryClient = useQueryClient();
    const { data: user } = useCurrentUser();

    const query = useQuery({
        queryKey: computed(() => [
            BRANDING_KEY_ROOT,
            user.value?.institutionId,
        ]),
        queryFn: () => {
            const id = user.value?.institutionId;
            if (id === undefined) {
                throw new Error("unreachable: enabled guards institutionId");
            }
            return getInstitutionById(Number(id));
        },
        enabled: computed(() => user.value?.institutionId !== undefined),
        staleTime: Infinity,
    });

    return {
        institutionName: computed(() => query.data.value?.name ?? ""),
        institutionLogo: computed(() => query.data.value?.logoImage),
        refetch: () =>
            queryClient.invalidateQueries({ queryKey: [BRANDING_KEY_ROOT] }),
    };
}
