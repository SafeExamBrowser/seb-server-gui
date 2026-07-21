import { computed, type Ref, ref } from "vue";

export const useDirtyTracking = <T extends Record<string, unknown>>(
    getCurrent: () => T,
    fileRefs: Ref<File | string | null | undefined>[] = [],
) => {
    const baseline = ref<string>();
    const fileBaseline = ref<(File | string | null | undefined)[]>([]);

    const snapshot = () => {
        baseline.value = JSON.stringify(getCurrent());
        fileBaseline.value = fileRefs.map((r) => r.value);
    };

    const isDirty = computed<boolean>(() => {
        if (baseline.value === undefined) {
            return false;
        }
        if (JSON.stringify(getCurrent()) !== baseline.value) {
            return true;
        }
        return fileRefs.some(
            (ref, index) => ref.value !== fileBaseline.value[index],
        );
    });

    return { isDirty, snapshot };
};
