<template>
    <BasicPage
        :title="$t('titles.examTemplateDetail')"
        :bread-crumb="[
            {
                label: $t('titles.examTemplateList'),
                link: { name: '/(app)/exam-template/' },
            },
            { label: $t('titles.examTemplateDetail') },
        ]"
    >
        <template #PanelMain>
            <LoadingFallbackComponent
                :loading="loading"
                :errors="error ? [error] : undefined"
            >
                <!-- TODO @alain: drop this v-if once LoadingFallbackComponent yields data via a typed scoped slot -->
                <template v-if="data"
                    >Showing exam template: {{ data.name }}</template
                >
            </LoadingFallbackComponent>
        </template>
    </BasicPage>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import BasicPage from "@/components/layout/pages/BasicPage.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import { useExamTemplate } from "./composables/api/useExamTemplate.ts";

const route = useRoute("/(app)/exam-template/[id]/");
const { data, loading, error } = useExamTemplate(route.params.id);
</script>
