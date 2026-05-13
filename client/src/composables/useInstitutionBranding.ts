import { computed, watch } from "vue";
import { useFetch } from "@/composables/useFetch";
import { useCurrentUser } from "@/composables/useCurrentUser";
import { getInstitutionById } from "@/services/seb-server/institutionService";

const { user } = useCurrentUser();

const { data: institution, fetchData: refetch } = useFetch(async () => {
    const id = user.value?.institutionId;
    if (id === undefined) {
        return null;
    }
    return await getInstitutionById(Number(id));
});

const institutionName = computed(() => institution.value?.name ?? "");
const institutionLogo = computed(() => institution.value?.logoImage);

watch(
    () => user.value?.institutionId,
    (id) => {
        if (id === undefined) {
            institution.value = undefined;
            return;
        }
        void refetch();
    },
    { immediate: true },
);

export function useInstitutionBranding() {
    return {
        institutionName,
        institutionLogo,
        refetch,
    };
}
