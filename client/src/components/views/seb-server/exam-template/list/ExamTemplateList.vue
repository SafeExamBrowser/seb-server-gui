<template>
    <BasicPage
        :title="$t('titles.examTemplateList')"
        :bread-crumb="[
            {
                label: $t('titles.examTemplateList'),
            },
        ]"
    >
        <template #PanelMain>
            <LoadingFallbackComponent :loading="false" :errors="errors">
                <ExamTemplateTable
                    :headers="headers"
                    :items="examTemplates"
                    :items-length="totalItems"
                    :is-loading="isLoading"
                    @changed="fetchData"
                    @update:options="fetchData"
                />
            </LoadingFallbackComponent>
        </template>
    </BasicPage>
</template>

<script setup lang="ts">
import BasicPage from "@/components/layout/pages/BasicPage.vue";
import ExamTemplateTable from "./components/ExamTemplateTable.vue";
import { useExamTemplateList } from "./composables/useExamTemplateList";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";

const { examTemplates, headers, errors, totalItems, isLoading, fetchData } =
    useExamTemplateList();
</script>
