<template>
    <BasicPage
        :title="$t('titles.examTemplate')"
        :bread-crumb="[
            {
                label: $t('titles.examTemplate'),
                link: constants.EXAM_TEMPLATE_ROUTE,
            },
        ]"
    >
        <template #PanelMain>
            TODO: Implement the exam template list.
        </template>
    </BasicPage>
</template>

<script setup lang="ts">
import BasicPage from "@/components/layout/pages/BasicPage.vue";
import * as constants from "@/utils/constants";
</script>
