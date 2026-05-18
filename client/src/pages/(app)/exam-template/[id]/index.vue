<template>
    <GridPage :title="title" :bread-crumb="breadCrumb">
        <template #basicSettings><BoxBasicSettings /></template>
        <template #sebSettings><BoxSebSettings /></template>
        <template #indicators><BoxIndicators /></template>
        <template #supervisors><BoxSupervisors /></template>
        <template #screenProctoringSettings>
            <BoxScreenProctoringSettings />
        </template>
        <template #groups><BoxGroups /></template>
    </GridPage>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import GridPage from "@/components/layout/pages/GridPage.vue";
import { useExamTemplateDetailPage } from "./composables/useExamTemplateDetailPage.ts";
import BoxBasicSettings from "./components/BoxBasicSettings.vue";
import BoxSebSettings from "./components/BoxSebSettings.vue";
import BoxIndicators from "./components/BoxIndicators.vue";
import BoxSupervisors from "./components/BoxSupervisors.vue";
import BoxScreenProctoringSettings from "./components/BoxScreenProctoringSettings.vue";
import BoxGroups from "./components/BoxGroups.vue";

const route = useRoute("/(app)/exam-template/[id]/");
const { title, breadCrumb } = useExamTemplateDetailPage(route.params.id);
</script>
