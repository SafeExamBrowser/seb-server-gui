import { defineStore } from "pinia";
import { computed, ref } from "vue";
import {
    ClientGroup,
    ClientGroupTransient,
} from "@/components/views/seb-server/template/exam/components/stepClientGroup/types";
import { useScreenProctoringStore } from "@/components/views/seb-server/template/exam/composables/store/useScreenProctoringStore";

const initialState = {
    isScreenProctoringFormReady: false,
    groups: [],
};

export const getEmptyClientGroup = (): ClientGroupTransient => ({
    id: crypto.getRandomValues(new Uint32Array(1))[0], // random ID, for FE use only (when submitting to BE, the BE will generate the real ID)
    screenProctoringEnabled: false,
});

export const useStepClientGroupStore = defineStore("stepClientGroup", () => {
    const screenProctoringStore = useScreenProctoringStore();

    const isScreenProctoringFormReady = ref(
        initialState.isScreenProctoringFormReady,
    );
    const groups = ref<ClientGroup[]>(initialState.groups);

    const $reset = () => {
        isScreenProctoringFormReady.value =
            initialState.isScreenProctoringFormReady;
        groups.value = initialState.groups;
    };

    const createGroup = (group: ClientGroup) => {
        groups.value.push(group);
    };

    const updateGroup = (updatedGroup: ClientGroup) => {
        groups.value = groups.value.map((existingGroup) =>
            existingGroup.id === updatedGroup.id ? updatedGroup : existingGroup,
        );
    };

    const deleteGroup = (group: ClientGroup) => {
        groups.value = groups.value.filter((g) => g.id !== group.id);
    };

    const isReady = computed(() => {
        if (!screenProctoringStore.enabled) {
            // without screen proctoring being enabled on the examTemplate, there are no restrictions (groups are optional)
            return true;
        }

        if (screenProctoringStore.collectionStrategy === "APPLY_SEB_GROUPS") {
            // if the collection strategy is APPLY_SEB_GROUPS, there must be at least one group with screen proctoring enabled
            return groups.value.some((group) => group.screenProctoringEnabled);
        }

        // in any other case, it depends on the form being ready
        return isScreenProctoringFormReady.value;
    });

    return {
        isScreenProctoringFormReady,
        isReady,
        groups,
        createGroup,
        updateGroup,
        deleteGroup,
        $reset,
    };
});
