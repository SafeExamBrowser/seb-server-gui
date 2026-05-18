<template>
    <div class="fill-height d-flex flex-column">
        <PageHeader :title="title" :bread-crumb="breadCrumb" />
        <div class="flex-grow-1 flex-shrink-1 overflow-y-auto pa-2">
            <v-row>
                <v-col v-for="(_, name) in $slots" :key="name" cols="12" md="6">
                    <slot :name="name" />
                </v-col>
            </v-row>
        </div>
    </div>
</template>

<script setup lang="ts">
import PageHeader from "@/components/layout/pages/components/PageHeader.vue";
import { BreadCrumbItem } from "@/components/widgets/breadCrumb/types";

withDefaults(
    defineProps<{
        title: string;
        breadCrumb?: BreadCrumbItem[];
    }>(),
    { breadCrumb: undefined },
);
</script>
