<template>
    <StepItem
        :title="$t('createTemplateExam.steps.supervisors.title')"
        :subtitle="$t('createTemplateExam.steps.supervisors.subtitle')"
    >
        <LoadingFallbackComponent :loading="loading" :errors="errors">
            <SupervisorPicker
                v-if="supervisors"
                v-model="stepSupervisorsStore.selectedSupervisorIds"
                :supervisors="supervisors"
            />
        </LoadingFallbackComponent>
    </StepItem>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useSupervisors } from "./composables/api/useSupervisors";
import { useI18n } from "vue-i18n";
import { useStepSupervisorsStore } from "./composables/store/useStepSupervisorsStore";
import SupervisorPicker from "./components/supervisorPicker/SupervisorPicker.vue";

const { t } = useI18n();
const stepSupervisorsStore = useStepSupervisorsStore();
const { data: supervisors, loading, error: errorLoading } = useSupervisors();

const errors = computed(() => {
    if (loading.value) {
        return undefined;
    }

    return [
        errorLoading.value ? errorLoading.value : undefined,
        supervisors.value && supervisors.value.length <= 1
            ? t("general.noData")
            : undefined,
    ].filter((error) => error !== undefined);
});
</script>
