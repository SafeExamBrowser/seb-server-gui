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
            <LoadingFallbackComponent :loading="isLoading" :error="error">
                <ExamTemplateTable :headers="headers" :items="examTemplates" />
            </LoadingFallbackComponent>
        </template>
    </BasicPage>
</template>

<script setup lang="ts">
import BasicPage from "@/components/layout/pages/BasicPage.vue";
import { useExamTemplates } from "./composables/useExamTemplates";
import { computed, onMounted } from "vue";
import ExamTemplateTable from "./components/ExamTemplateTable.vue";

const {
    data: examTemplatesData,
    loading: isLoading,
    error,
    fetchData,
} = useExamTemplates();

const examTemplates = computed(() => examTemplatesData.value?.content ?? []);

// TODO @alain: translate labels
// TODO @alain: exam type value: use enum translation
// TODO @alain: add correct action content
const headers = computed(() => [
    {
        title: "Name",
        value: "name",
        width: "30%",
    },
    {
        title: "Description",
        value: "description",
        width: "30%",
    },
    {
        title: "Exam Type",
        value: "examType",
        width: "30%",
    },
    {
        title: "Actions",
        value: "actions",
        width: "10%",
    },
]);

onMounted(() => {
    fetchData();
});
</script>
