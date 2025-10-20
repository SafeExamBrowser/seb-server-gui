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
    name: "",
    id: crypto.getRandomValues(new Uint32Array(1))[0], // random ID, for FE use only (when submitting to BE, the BE will generate the real ID)
    isValid: false,
});

export const useStepClientGroupStore = defineStore("stepClientGroup", () => {
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
        return useScreenProctoringStore().enabled
            ? isScreenProctoringFormReady.value
            : true;
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
