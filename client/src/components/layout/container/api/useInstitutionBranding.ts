import { ref, watch, effectScope } from "vue";
import { useCurrentUser } from "./useCurrentUser";
import { getInstitutionById } from "@/services/seb-server/institutionService";

const institutionName = ref("");
const institutionLogo = ref<string | null>(null);
const loadedInstitutionId = ref<number | null>(null);
let initialized = false;

async function loadInstitution(institutionId: number | null | undefined) {
    if (institutionId == null) {
        institutionName.value = "";
        institutionLogo.value = null;
        loadedInstitutionId.value = null;
        return;
    }

    const numericId = Number(institutionId);

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
}

async function refetchInstitutionBranding() {
    const { user } = useCurrentUser();
    await loadInstitution(user.value?.institutionId);
}

function initInstitutionBranding() {
    if (initialized) return;
    initialized = true;

    const scope = effectScope(true);
    scope.run(() => {
        const { user } = useCurrentUser();
        watch(
            () => user.value?.institutionId,
            async (institutionId) => {
                const numericId =
                    institutionId == null ? null : Number(institutionId);
                if (
                    numericId != null &&
                    loadedInstitutionId.value === numericId
                ) {
                    return;
                }
                await loadInstitution(numericId);
            },
            { immediate: true },
        );
    });
}

export function useInstitutionBranding() {
    initInstitutionBranding();

    return {
        institutionName,
        institutionLogo,
        refetch: refetchInstitutionBranding,
    };
}
