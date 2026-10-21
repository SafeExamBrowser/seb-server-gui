import { watch } from "vue";
import type { LocationQuery, LocationQueryRaw } from "vue-router";
import { useRoute, useRouter } from "vue-router";

import type { SearchQueryValues } from "@/components/widgets/searches/types";

function getQueryValue(query: LocationQuery, key: string): string | undefined {
    const value = query[key];

    if (Array.isArray(value)) {
        return value[0] ?? undefined;
    }

    return value ?? undefined;
}

// Mirrors the submitted search of a search form page into the URL query (the
// counterpart of useUrlTableState for list pages), so reloading or sharing
// the page restores the search. Only `keys` are managed; other params stay.
// Like the list pages, the query is replaced, so searches add no history
// entries.
export function useSearchQuerySync(
    keys: readonly string[],
    onExternalChange: (values: SearchQueryValues) => void,
) {
    const route = useRoute();
    const router = useRouter();
    const routeName = route.name;

    const readValues = (): SearchQueryValues =>
        Object.fromEntries(
            keys.map((key) => [key, getQueryValue(route.query, key)]),
        );

    const fingerprint = (values: SearchQueryValues) =>
        JSON.stringify(keys.map((key) => values[key] || undefined));

    // The managed query as last written or seen by this page; changes that
    // differ from it come from outside (back/forward, a link to this page).
    let syncedFingerprint = fingerprint(readValues());

    async function writeValues(values: SearchQueryValues) {
        const query: LocationQueryRaw = { ...route.query };

        for (const key of keys) {
            query[key] = values[key] || undefined;
        }

        syncedFingerprint = fingerprint(values);
        await router.replace({ query });
    }

    watch(
        () => fingerprint(readValues()),
        (current) => {
            // leaving the page also changes the query; that is no new search
            if (route.name !== routeName || current === syncedFingerprint) {
                return;
            }

            syncedFingerprint = current;
            onExternalChange(readValues());
        },
    );

    return {
        initialValues: readValues(),
        writeValues,
    };
}
