import { ref, watch } from "vue";
import { useUserAccountStore } from "@/stores/authentication/userAccountStore";
import { useInstitutionNameMap } from "@/composables/useInstitutionNameMap";
import { getInstitutionLogo } from "@/services/seb-server/institutionService";

export function useInstitutionBranding() {
    const userAccountStore = useUserAccountStore();
    const { institutions, fetchInstitutions } = useInstitutionNameMap();

    const institutionName = ref("");
    const institutionLogo = ref<string | null>(null);
    const loadedInstitutionName = ref<string | null>(null);

    watch(
        () => userAccountStore.userAccount?.institutionId,
        async (institutionId) => {
            if (institutionId == null) {
                institutionName.value = "";
                institutionLogo.value = null;
                loadedInstitutionName.value = null;
                return;
            }

            await fetchInstitutions();

            const matchedInstitution = institutions.value.find(
                (institution) => institution.modelId === String(institutionId),
            );

            if (matchedInstitution == null) {
                institutionName.value = "";
                institutionLogo.value = null;
                loadedInstitutionName.value = null;
                return;
            }

            institutionName.value = matchedInstitution.name;

            if (loadedInstitutionName.value === matchedInstitution.name) {
                return;
            }

            try {
                const logoBase64 = await getInstitutionLogo(
                    matchedInstitution.name,
                );
                institutionLogo.value = logoBase64
                    ? `data:image/png;base64,${logoBase64}`
                    : null;
                loadedInstitutionName.value = matchedInstitution.name;
            } catch {
                institutionLogo.value = null;
                loadedInstitutionName.value = null;
            }
        },
        { immediate: true },
    );

    return {
        institutionName,
        institutionLogo,
    };
}
