<template>
    <BasicPage
        :title="$t('titles.examTemplateList')"
        :bread-crumb="[
            {
                label: $t('titles.examTemplateList'),
            },
        ]"
    >
        <template #PanelTop>
            <div class="d-flex">
                <v-row>
                    <v-col cols="6">TODO: Search Section</v-col>
                    <v-col cols="6">TODO: Filters Section</v-col>
                </v-row>
            </div>
        </template>
        <template #PanelMain>
            <LoadingFallbackComponent :loading="false" :errors="errors">
                <ExamTemplateTable
                    :headers="headers"
                    :items="examTemplates"
                    :items-length="totalItems"
                    :is-loading="isLoading"
                    :sort-by="queryParams.sort ? [queryParams.sort] : []"
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

const {
    examTemplates,
    headers,
    errors,
    totalItems,
    isLoading,
    queryParams,
    handleItemsUpdate,
    handleOptionsUpdate,
} = useExamTemplateList();
</script>
