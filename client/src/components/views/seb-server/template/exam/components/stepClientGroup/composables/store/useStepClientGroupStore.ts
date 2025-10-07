import { defineStore } from "pinia";
import { ref } from "vue";
import { ClientGroup } from "@/components/views/seb-server/template/exam/components/stepClientGroup/types";

const initialState = {
    isReady: false,
    groups: [],
};

export const useStepClientGroupStore = defineStore("stepClientGroup", () => {
    const isReady = ref(initialState.isReady);
    const groups = ref<ClientGroup[]>(initialState.groups);

    const $reset = () => {
        isReady.value = initialState.isReady;
        groups.value = initialState.groups;
    };

    const addGroup = (group: ClientGroup) => {
        groups.value.push(group);
    };

    const deleteGroup = (group: ClientGroup) => {
        groups.value = groups.value.filter((g) => g.name !== group.name);
    };

    return {
        isReady,
        groups,
        addGroup,
        deleteGroup,
        $reset,
    };
});
