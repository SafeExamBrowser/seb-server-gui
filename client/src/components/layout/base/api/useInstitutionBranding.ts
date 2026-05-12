import { ref, watch } from "vue";
import { useCurrentUser } from "@/components/layout/base/api/useCurrentUser";
import { getInstitutionById } from "@/services/seb-server/institutionService";

export function useInstitutionBranding() {
    const { user } = useCurrentUser();

    const institutionName = ref("");
    const institutionLogo = ref<string | null>(null);
    const loadedInstitutionId = ref<number | null>(null);

    watch(
        () => user.value?.institutionId,
        async (institutionId) => {
            if (institutionId == null) {
                institutionName.value = "";
                institutionLogo.value = null;
                loadedInstitutionId.value = null;
                return;
            }

            const numericId = Number(institutionId);
            if (loadedInstitutionId.value === numericId) {
                return;
            }

            try {
                const institution = await getInstitutionById(numericId);
                institutionName.value = institution.name;
                institutionLogo.value = institution.logoImage ?? null;
                loadedInstitutionId.value = numericId;
            } catch {
                institutionName.value = "";
                institutionLogo.value = null;
                loadedInstitutionId.value = null;
            }
        },
        { immediate: true },
    );

    return {
        institutionName,
        institutionLogo,
    };
}
