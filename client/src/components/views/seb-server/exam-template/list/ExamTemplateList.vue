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
                <div
                    v-for="examTemplate in examTemplates"
                    :key="examTemplate.id"
                >
                    {{ examTemplate.name }}
                </div>
            </LoadingFallbackComponent>
        </template>
    </BasicPage>
</template>

<script setup lang="ts">
import BasicPage from "@/components/layout/pages/BasicPage.vue";
import { useExamTemplates } from "./composables/useExamTemplates";
import { computed, onMounted } from "vue";

const {
    data: examTemplatesData,
    loading: isLoading,
    error,
    fetchData,
} = useExamTemplates();

const examTemplates = computed(() => examTemplatesData.value?.content ?? []);

onMounted(() => {
    fetchData();
});
</script>
