import { ScreenProctoringCollectionStrategy } from "@/components/views/seb-server/template/exam/types";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

const getInitialState = () => ({
    enabled: false,
    collectionStrategy: undefined,
});

export const useScreenProctoringStore = defineStore("screenProctoring", () => {
    const enabled = ref<boolean>(getInitialState().enabled);

    const collectionStrategy = ref<ScreenProctoringCollectionStrategy>();

    const screenProctoringAllowedForGroups = computed<boolean>(
        () => enabled.value && collectionStrategy.value !== "EXAM",
    );

    const $reset = () => {
        enabled.value = getInitialState().enabled;
        collectionStrategy.value = getInitialState().collectionStrategy;
    };

    return {
        enabled,
        collectionStrategy,
        screenProctoringAllowedForGroups,
        $reset,
    };
});
