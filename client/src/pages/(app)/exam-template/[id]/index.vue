<template>
    <LoadingFallbackComponent :loading="loading" :errors="errors">
        <GridPage
            v-if="examTemplateId !== undefined"
            :title="title"
            :bread-crumb="breadCrumb"
        >
            <template #basicSettings><BoxBasicSettings /></template>
            <template #sebSettings><BoxSebSettings /></template>
            <template #indicators>
                <BoxIndicators :exam-template-id="examTemplateId" />
            </template>
            <template #supervisors><BoxSupervisors /></template>
            <template #screenProctoringSettings>
                <BoxScreenProctoringSettings />
            </template>
            <template #groups><BoxGroups /></template>
        </GridPage>
    </LoadingFallbackComponent>
</template>

<script setup lang="ts">
import GridPage from "@/components/layout/pages/GridPage.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import { useExamTemplateDetailPage } from "./composables/useExamTemplateDetailPage.ts";
import BoxBasicSettings from "./components/BoxBasicSettings.vue";
import BoxSebSettings from "./components/BoxSebSettings.vue";
import BoxIndicators from "./components/BoxIndicators.vue";
import BoxSupervisors from "./components/BoxSupervisors.vue";
import BoxScreenProctoringSettings from "./components/BoxScreenProctoringSettings.vue";
import BoxGroups from "./components/BoxGroups.vue";

const { examTemplateId, title, breadCrumb, errors, loading } =
    useExamTemplateDetailPage();
</script>
