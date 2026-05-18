<template>
    <BasicPage :title="title" :bread-crumb="breadCrumb">
        <template #PanelMain>
            <LoadingFallbackComponent
                :loading="loading"
                :errors="error ? [error] : undefined"
            >
                <!-- TODO @alain: drop this v-if once LoadingFallbackComponent yields data via a typed scoped slot -->
                <template v-if="examTemplate"
                    >Showing exam template: {{ examTemplate.name }}</template
                >
            </LoadingFallbackComponent>
        </template>
    </BasicPage>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import BasicPage from "@/components/layout/pages/BasicPage.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import { useExamTemplateDetailPage } from "./composables/useExamTemplateDetailPage.ts";

const route = useRoute("/(app)/exam-template/[id]/");
const { examTemplate, loading, error, title, breadCrumb } =
    useExamTemplateDetailPage(route.params.id);
</script>
