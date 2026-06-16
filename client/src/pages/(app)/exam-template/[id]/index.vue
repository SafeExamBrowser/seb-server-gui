<template>
    <LoadingFallbackComponent :loading="loading" :errors="errors">
        <GridPage
            v-if="examTemplateId !== undefined"
            :title="title"
            :bread-crumb="breadCrumb"
        >
            <template #basicSettings>
                <BoxBasicSettings
                    :basic-settings="basicSettings"
                    @change="handleBasicSettingsChange"
                />
            </template>
            <template #sebSettings><BoxSebSettings /></template>
            <template #indicators>
                <BoxIndicators
                    :exam-template-id="examTemplateId"
                    :indicators="indicators"
                />
            </template>
            <template #supervisors>
                <BoxSupervisors
                    :available-supervisors="availableSupervisors ?? []"
                    :selected-supervisor-ids="selectedSupervisorIds"
                    @change="handleSupervisorsChange"
                />
            </template>
            <template #screenProctoringSettings>
                <BoxScreenProctoringSettings
                    :enabled="screenProctoring.enabled.value"
                    :collection-strategy="
                        screenProctoring.collectionStrategy.value
                    "
                    @change="handleScreenProctoringChange"
                />
            </template>
            <template #groups>
                <BoxClientGroups
                    :exam-template-id="examTemplateId"
                    :client-groups="clientGroups"
                    :screen-proctoring="screenProctoring"
                />
            </template>
        </GridPage>
    </LoadingFallbackComponent>
</template>

<script setup lang="ts">
import GridPage from "@/components/layout/pages/GridPage.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import { useExamTemplateDetailPage } from "./composables/useExamTemplateDetailPage.ts";
import BoxBasicSettings from "./components/BoxBasicSettings/BoxBasicSettings.vue";
import BoxSebSettings from "./components/BoxSebSettings.vue";
import BoxIndicators from "./components/BoxIndicators.vue";
import BoxSupervisors from "./components/BoxSupervisors.vue";
import BoxScreenProctoringSettings from "./components/BoxScreenProctoringSettings/BoxScreenProctoringSettings.vue";
import BoxClientGroups from "./components/BoxClientGroups.vue";

const {
    examTemplateId,
    title,
    breadCrumb,
    errors,
    loading,
    indicators,
    availableSupervisors,
    selectedSupervisorIds,
    clientGroups,
    screenProctoring,
    basicSettings,
    updateTemplate,
    handleScreenProctoringChange,
    handleBasicSettingsChange,
} = useExamTemplateDetailPage();

const handleSupervisorsChange = (ids: string[]) =>
    updateTemplate({
        supporter: ids,
    });
</script>
