import { ScreenProctoringCollectionStrategy } from "@/components/views/seb-server/template/exam/types";
import { defineStore } from "pinia";
import { ref } from "vue";

const initialState = {
    enabled: true, // TODO @alain: remove debug (should be false)
    collectionStrategy: undefined,
};

export const useScreenProctoringStore = defineStore("screenProctoring", () => {
    const enabled = ref<boolean>(initialState.enabled);

    const collectionStrategy = ref<ScreenProctoringCollectionStrategy>();

    const $reset = () => {
        enabled.value = initialState.enabled;
        collectionStrategy.value = initialState.collectionStrategy;
    };

    return {
        enabled,
        collectionStrategy,
        $reset,
    };
});
