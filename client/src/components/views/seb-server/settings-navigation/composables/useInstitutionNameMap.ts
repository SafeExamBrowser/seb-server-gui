import { computed, onMounted, ref, watch, type Ref } from "vue";
import type { Institution } from "@/models/seb-server/institution";
import { getInstitutions } from "@/services/seb-server/institutionService";

export const useInstitutionNameMap = (enabled: Ref<boolean>) => {
    const institutions = ref<Institution[]>([]);
    const loading = ref(false);
    const error = ref<string>();
    const hasFetched = ref(false);

    const institutionIdToNameMap = computed(() => {
        const map = new Map<string, string>();

        institutions.value.forEach((institution) => {
            map.set(String(institution.modelId), institution.name);
        });

        return map;
    });

    const fetchInstitutions = async () => {
        if (!enabled.value || hasFetched.value) {
            return;
        }

        loading.value = true;
        error.value = undefined;

        try {
            const response = await getInstitutions();
            institutions.value = response ?? [];
            hasFetched.value = true;
        } catch (err) {
            error.value = err instanceof Error ? err.message : "Unknown error";
        } finally {
            loading.value = false;
        }
    };

    const getInstitutionName = (id: unknown): string => {
        if (id === null || id === undefined) {
            return "";
        }

        return institutionIdToNameMap.value.get(String(id)) ?? String(id);
    };

    onMounted(fetchInstitutions);
    watch(enabled, fetchInstitutions);

    return {
        institutions,
        loading,
        error,
        getInstitutionName,
    };
};
