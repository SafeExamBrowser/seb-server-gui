import { ref, watch, type Ref } from "vue";

export const usePersistedRef = <T extends string>(
    key: T,
    options?: {
        keyPrefix?: string;
    },
): Ref<string | undefined> => {
    const storageKey = `${options?.keyPrefix ?? ""}${key}`;
    const value = localStorage.getItem(storageKey) ?? undefined;
    const myRef = ref<string | undefined>(value);

    watch(myRef, (newValue) => {
        if (newValue === undefined) {
            localStorage.removeItem(storageKey);
            return;
        }

        localStorage.setItem(storageKey, newValue);
    });

    return myRef;
};
