import { computed, ref, watch, type Ref } from "vue";

// Snapshots a serialisable "shape" of a form and exposes an `isDirty` computed
// that flips to true whenever the shape diverges from the last snapshot.
// Pages call `snapshot()` once initial data has been hydrated from the
// backend; the Save button then binds to `!isDirty.value`.
//
// File-typed refs are tracked by reference identity (any newly-attached File
// counts as dirty), since File objects don't serialise meaningfully via
// JSON.
export const useDirtyTracking = <T extends Record<string, unknown>>(
    getCurrent: () => T,
    fileRefs: Ref<File | null | undefined>[] = [],
) => {
    const baseline = ref<string>();
    const fileBaseline = ref<(File | null | undefined)[]>([]);

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

    // Reset isDirty when a fresh snapshot is taken (e.g. after a successful
    // save the page can call snapshot() again to rebaseline).
    watch(baseline, () => {
        // intentional no-op: the reactive read above is enough; this watcher
        // exists to make the dependency explicit for readability.
    });

    return { isDirty, snapshot };
};
