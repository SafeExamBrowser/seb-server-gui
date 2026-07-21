import { defineStore } from "pinia";
import { computed, ref } from "vue";

import {
    isScreenProctoringAllowedForGroups,
    ScreenProctoringCollectionStrategy,
} from "@/models/seb-server/screenProctoring.ts";

const getInitialState = () => ({
    enabled: false,
    collectionStrategy: undefined,
});

export const useScreenProctoringStore = defineStore("screenProctoring", () => {
    const enabled = ref<boolean>(getInitialState().enabled);

    const collectionStrategy = ref<ScreenProctoringCollectionStrategy>();

    const screenProctoringAllowedForGroups = computed<boolean>(() =>
        isScreenProctoringAllowedForGroups(
            enabled.value,
            collectionStrategy.value,
        ),
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
