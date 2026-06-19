import { defineStore } from "pinia";
import { computed, ref } from "vue";
import {
    ClientGroup,
    ClientGroupExisting,
    clientGroupExistingSchema,
} from "@/models/seb-server/examTemplate.ts";
import { useScreenProctoringStore } from "@/pages/(app)/exam-template/create/composables/store/useScreenProctoringStore.ts";

const getInitialState = () => ({
    isScreenProctoringFormReady: false,
    groups: [],
});

export const useStepClientGroupStore = defineStore("stepClientGroup", () => {
    const screenProctoringStore = useScreenProctoringStore();

    const isScreenProctoringFormReady = ref(
        getInitialState().isScreenProctoringFormReady,
    );

    const groups = ref<ClientGroupExisting[]>(getInitialState().groups);

    const $reset = () => {
        isScreenProctoringFormReady.value =
            getInitialState().isScreenProctoringFormReady;
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
