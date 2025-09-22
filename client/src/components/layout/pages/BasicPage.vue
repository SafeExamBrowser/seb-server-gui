<template>
    <div class="fill-height d-flex flex-column">
        <v-row class="flex-grow-0 flex-shrink-0">
            <v-col>
                <Breadcrumb :items="breadcrumb" />
            </v-col>
        </v-row>
        <v-row class="flex-grow-0 flex-shrink-0">
            <v-col>
                <PageTitle :title="title" />
            </v-col>
        </v-row>
        <v-row class="flex-grow-1 flex-shrink-1 overflow-y-auto">
            <v-col cols="9" class="fill-height overflow-y-auto">
                <v-card
                    elevation="4"
                    rounded="lg"
                    class="fill-height overflow-y-auto"
                >
                    <slot name="PanelMain"></slot>
                </v-card>
            </v-col>
            <v-col cols="3" class="fill-height overflow-y-auto">
                <v-card
                    elevation="4"
                    rounded="lg"
                    class="fill-height overflow-y-auto"
                >
                    <slot name="PanelAside"></slot>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script setup lang="ts">
import Breadcrumb from "@/components/widgets/breadcrumb/Breadcrumb.vue";
import PageTitle from "@/components/widgets/PageTitle.vue";
import { BreadcrumbItem } from "@/components/widgets/breadcrumb/types";

defineProps<{
    title: string;
    breadcrumb: BreadcrumbItem[];
}>();
</script>
