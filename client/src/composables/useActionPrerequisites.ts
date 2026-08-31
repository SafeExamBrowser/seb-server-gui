import { computed } from "vue";

import { useClientConfigurationNames } from "@/composables/useClientConfigurationNames.ts";

export enum Prerequisite {
    CONNECTION_CONFIGURATION = "CONNECTION_CONFIGURATION",
}

interface PrerequisiteAnswer {
    resolved: boolean;
    met: boolean;
}

// TODO @alain: the homemade `useFetch` sources are normalised into the resolved/met shape by
// hand here; this collapses once `useFetch` is migrated to TanStack Query.
export const useActionPrerequisites = () => {
    const connectionConfigurations = useClientConfigurationNames();

    const answers = computed<Record<Prerequisite, PrerequisiteAnswer>>(() => ({
        [Prerequisite.CONNECTION_CONFIGURATION]: {
            resolved: connectionConfigurations.data.value !== undefined,
            met: (connectionConfigurations.data.value ?? []).length > 0,
        },
    }));

    const unmet = (requires: Prerequisite[]) =>
        requires.filter((prerequisite) => {
            const answer = answers.value[prerequisite];
            return answer.resolved && !answer.met;
        });

    const isUnmet = (requires: Prerequisite[]) => unmet(requires).length > 0;

    return { isUnmet, unmet };
};
