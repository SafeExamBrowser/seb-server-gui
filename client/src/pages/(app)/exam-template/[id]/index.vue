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
        <template #PanelMain> Main content: {{ examTemplateId }} </template>
    </BasicPage>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import BasicPage from "@/components/layout/pages/BasicPage.vue";

const route = useRoute();
const examTemplateId = route.params.id;
</script>
