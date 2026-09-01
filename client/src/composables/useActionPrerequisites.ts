import { computed } from "vue";

import { useAssessmentTools } from "@/composables/useAssessmentTools.ts";
import { useClientConfigurationNames } from "@/composables/useClientConfigurationNames.ts";
import { useExamTemplateNames } from "@/composables/useExamTemplateNames.ts";

export enum Prerequisite {
    CONNECTION_CONFIGURATION = "CONNECTION_CONFIGURATION",
    EXAM_TEMPLATE = "EXAM_TEMPLATE",
    ASSESSMENT_TOOL_CONNECTION = "ASSESSMENT_TOOL_CONNECTION",
}

interface PrerequisiteAnswer {
    resolved: boolean;
    met: boolean;
}

// TODO @alain: the homemade `useFetch` sources are normalised into the resolved/met shape by
// hand here; this collapses once `useFetch` is migrated to TanStack Query.
// Only the prerequisites in `scope` are fetched; anything outside it stays
// unresolved forever and therefore counts as met, like every other unknown.
export const useActionPrerequisites = (
    scope: Prerequisite[] = Object.values(Prerequisite),
) => {
    const connectionConfigurations = scope.includes(
        Prerequisite.CONNECTION_CONFIGURATION,
    )
        ? useClientConfigurationNames()
        : undefined;
    const assessmentTools = scope.includes(
        Prerequisite.ASSESSMENT_TOOL_CONNECTION,
    )
        ? useAssessmentTools()
        : undefined;
    // The exam template answer must reflect a template created moments ago on another page, so
    // this observer opts out of the project's default staleness.
    const examTemplates = scope.includes(Prerequisite.EXAM_TEMPLATE)
        ? useExamTemplateNames({ staleTime: 0 })
        : undefined;

    const answers = computed<Record<Prerequisite, PrerequisiteAnswer>>(() => ({
        [Prerequisite.CONNECTION_CONFIGURATION]: {
            resolved: connectionConfigurations?.data.value !== undefined,
            met: (connectionConfigurations?.data.value ?? []).length > 0,
        },
        [Prerequisite.EXAM_TEMPLATE]: {
            resolved: examTemplates?.data.value !== undefined,
            met: (examTemplates?.data.value ?? []).length > 0,
        },
        [Prerequisite.ASSESSMENT_TOOL_CONNECTION]: {
            resolved: assessmentTools?.data.value !== undefined,
            met: (assessmentTools?.data.value?.content ?? []).length > 0,
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
