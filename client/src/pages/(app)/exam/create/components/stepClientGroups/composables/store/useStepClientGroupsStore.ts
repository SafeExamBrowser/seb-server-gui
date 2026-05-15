import { defineStore } from "pinia";
import { ref } from "vue";
import { ClientGroup } from "@/models/seb-server/clientGroup.ts";

const getInitialState = () => ({
    selectedClientGroups: [],
});

export const useStepClientGroupsStore = defineStore(
    "createExam_stepClientGroups",
    () => {
        const selectedClientGroups = ref<ClientGroup[]>(
            getInitialState().selectedClientGroups,
        );

        const $reset = () => {
            selectedClientGroups.value = getInitialState().selectedClientGroups;
        };

        return {
            selectedClientGroups,
            $reset,
        };
    },
);
