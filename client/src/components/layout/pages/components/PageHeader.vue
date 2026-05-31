<template>
    <div class="flex-shrink-0 pt-6 pb-3">
        <BreadCrumb :items="breadCrumb" />
        <div class="d-flex align-center ga-3 px-6 mt-1">
            <PageTitle
                :name="title"
                :data-test-id="
                    dataTestId ? `${dataTestId}-page-title` : undefined
                "
            />
            <v-spacer />
            <slot name="actions"></slot>
        </div>
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
