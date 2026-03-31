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
            <LoadingFallbackComponent :loading="isLoading" :errors="errors">
                <ExamTemplateTable
                    :headers="headers"
                    :items="examTemplates"
                    @changed="refetchData"
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

const {
    examTemplates,
    headers,
    loading: isLoading,
    errors,
    refetchData,
} = useExamTemplateList();
</script>
