<template>
    <StepItem
        :title="$t('createTemplateExam.steps.supervisors.title')"
        :subtitle="$t('createTemplateExam.steps.supervisors.subtitle')"
    >
        <LoadingFallbackComponent
            :loading="loading"
            :errors="error ? [error] : []"
        >
            <!-- TODO @alain: do this properly -->
            <ul>
                <li
                    v-for="supervisor in supervisorNames"
                    :key="supervisor.modelId"
                >
                    {{ supervisor.name }}
                </li>
            </ul>
        </LoadingFallbackComponent>
    </StepItem>
</template>

<script setup lang="ts">
import { useSupervisorNames } from "./composables/api/useSupervisorNames";

const { data: supervisorNames, loading, error } = useSupervisorNames();
</script>
