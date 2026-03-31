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
                    @update:items="handleItemsUpdate"
                    @update:options="handleOptionsUpdate"
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

const handleOptionsUpdate = () => {
    // TODO @alain: use TableOptions here
    fetchData();
};

const handleItemsUpdate = () => {
    fetchData();
};

const { examTemplates, headers, errors, totalItems, isLoading, fetchData } =
    useExamTemplateList();
</script>
