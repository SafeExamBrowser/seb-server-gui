import { defineStore } from "pinia";
import { ref } from "vue";
import { ClientGroup } from "@/components/views/seb-server/template/exam/components/stepClientGroup/types";

const initialState = {
    isReady: false,
    groups: [],
};

export const getEmptyClientGroup = (): ClientGroup => ({
    name: "",
    id: crypto.getRandomValues(new Uint32Array(1))[0], // random ID, for FE use only (when submitting to BE, the BE will generate the real ID)
    type: undefined,
});

export const useStepClientGroupStore = defineStore("stepClientGroup", () => {
    const isReady = ref(initialState.isReady);
    const groups = ref<ClientGroup[]>(initialState.groups);

    const $reset = () => {
        isReady.value = initialState.isReady;
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

    return {
        isReady,
        groups,
        createGroup,
        updateGroup,
        deleteGroup,
        $reset,
    };
});
