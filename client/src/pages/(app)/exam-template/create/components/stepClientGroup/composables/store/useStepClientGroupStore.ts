import { defineStore } from "pinia";
import { ref } from "vue";

import {
    ClientGroup,
    ClientGroupExisting,
    clientGroupExistingSchema,
} from "@/models/seb-server/examTemplate.ts";

const getInitialState = () => ({
    groups: [],
});

export const useStepClientGroupStore = defineStore("stepClientGroup", () => {
    const groups = ref<ClientGroupExisting[]>(getInitialState().groups);

    const $reset = () => {
        groups.value = getInitialState().groups;
    };

    const createGroup = (group: ClientGroup) => {
        groups.value.push(
            clientGroupExistingSchema.parse({
                ...group,
                // random ID, for identification in the store only (when submitting to BE, the BE will generate the real ID)
                id: crypto.getRandomValues(new Uint32Array(1))[0],
            }),
        );
    };

    const updateGroup = (updatedGroup: ClientGroupExisting) => {
        groups.value = groups.value.map((existingGroup) =>
            existingGroup.id === updatedGroup.id ? updatedGroup : existingGroup,
        );
    };

    const deleteGroup = (group: ClientGroupExisting) => {
        groups.value = groups.value.filter((g) => g.id !== group.id);
    };

    return {
        groups,
        createGroup,
        updateGroup,
        deleteGroup,
        $reset,
    };
});
