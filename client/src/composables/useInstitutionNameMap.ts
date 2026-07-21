import { computed, ref } from "vue";

import type { InstitutionName } from "@/models/institution";
import { getInstitutions } from "@/services/seb-server/institutionInfoService";

const institutions = ref<InstitutionName[]>([]);
const loading = ref(false);
const error = ref<string>();
const hasFetched = ref(false);
const pendingRequest = ref<Promise<void> | null>(null);

export const useInstitutionNameMap = () => {
    const institutionIdToNameMap = computed(() => {
        const map = new Map<string, string>();

        institutions.value.forEach((institution) => {
            map.set(String(institution.modelId), institution.name);
        });

        return map;
    });

    const fetchInstitutions = async () => {
        if (hasFetched.value) {
            return;
        }

        if (pendingRequest.value) {
            return pendingRequest.value;
        }

        loading.value = true;
        error.value = undefined;

        pendingRequest.value = (async () => {
            try {
                const response = await getInstitutions();
                institutions.value = response ?? [];
                hasFetched.value = true;
            } catch (err) {
                error.value =
                    err instanceof Error ? err.message : "Unknown error";
            } finally {
                loading.value = false;
                pendingRequest.value = null;
            }
        })();

        return pendingRequest.value;
    };

    const getInstitutionName = (id: unknown): string => {
        if (id === null || id === undefined) {
            return "";
        }

        return institutionIdToNameMap.value.get(String(id)) ?? String(id);
    };

    return {
        institutions,
        loading,
        error,
        hasFetched,
        fetchInstitutions,
        getInstitutionName,
    };
};
