<template>
    <div class="flex-grow-0 flex-shrink-0 pa-2">
        <BreadCrumb :items="breadCrumb" />
    </div>
    <div class="flex-grow-0 flex-shrink-0 pa-2">
        <PageTitle
            :name="title"
            :data-test-id="dataTestId ? `${dataTestId}-page-title` : undefined"
        />
    </div>
</template>

<script setup lang="ts">
import PageTitle from "@/components/widgets/PageTitle.vue";
import { BreadCrumbItem } from "@/components/widgets/breadCrumb/types";
import BreadCrumb from "@/components/widgets/breadCrumb/BreadCrumb.vue";

withDefaults(
    defineProps<{
        title: string;
        breadCrumb?: BreadCrumbItem[];
        dataTestId?: string;
    }>(),
    { breadCrumb: undefined, dataTestId: undefined },
);
</script>
