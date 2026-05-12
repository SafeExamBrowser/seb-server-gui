import { ref, watch, effectScope } from "vue";
import { useCurrentUser } from "./useCurrentUser";
import { getInstitutionById } from "@/services/seb-server/institutionService";

const institutionName = ref("");
const institutionLogo = ref<string>();
const loadedInstitutionId = ref<number>();
let initialized = false;

async function loadInstitution(institutionId: number | undefined) {
    if (institutionId === undefined) {
        institutionName.value = "";
        institutionLogo.value = undefined;
        loadedInstitutionId.value = undefined;
        return;
    }

    const numericId = Number(institutionId);

    try {
        const institution = await getInstitutionById(numericId);
        institutionName.value = institution.name;
        institutionLogo.value = institution.logoImage;
        loadedInstitutionId.value = numericId;
    } catch {
        institutionName.value = "";
        institutionLogo.value = undefined;
        loadedInstitutionId.value = undefined;
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
                    institutionId === undefined
                        ? undefined
                        : Number(institutionId);
                if (
                    numericId !== undefined &&
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
