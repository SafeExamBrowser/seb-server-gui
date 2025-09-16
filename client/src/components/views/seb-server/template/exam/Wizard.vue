<template>
    <!-- TODO: 63vh here is arbitrary (inspired by the ImportWizard). Shouldn't the container in the main layout grow to fill the height so we could do "fill-height" here? -->
    <div style="height: 63vh">
        <BasicPage
            :title="$t('titles.createTemplateExam')"
            :breadcrumb="[
                {
                    label: $t('titles.createTemplate'),
                    link: constants.CREATE_EXAM_TEMPLATE_ROUTE,
                },
                { label: 'First step' }, // TODO: update this depending on the step
            ]"
        >
            <template #PanelMain> Panel Main content </template>
            <template #PanelAside> Panel Aside content </template>
        </BasicPage>
    </div>
</template>

<script setup lang="ts">
import BasicPage from "@/components/layout/pages/BasicPage.vue";
import * as constants from "@/utils/constants";
</script>
