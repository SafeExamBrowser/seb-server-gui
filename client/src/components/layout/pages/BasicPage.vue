<template>
    <div class="fill-height d-flex flex-column">
        <PageHeader
            :title="title"
            :bread-crumb="breadCrumb"
            :data-test-id="dataTestId"
        />
        <v-expand-transition>
            <div v-if="$slots.PanelTop" class="flex-grow-0 flex-shrink-0 pa-2">
                <v-card elevation="2" rounded="lg">
                    <slot name="PanelTop"></slot>
                </v-card>
            </div>
        </v-expand-transition>
        <v-row class="flex-grow-1 flex-shrink-1" :style="{ minHeight: 0 }">
            <v-col :cols="$slots.PanelAside ? 9 : 12" class="h-100 pa-2">
                <v-card
                    elevation="2"
                    rounded="lg"
                    class="h-100 overflow-y-auto"
                >
                    <slot name="PanelMain"></slot>
                </v-card>
            </v-col>
            <v-col v-if="$slots.PanelAside" cols="3" class="h-100 pa-2">
                <v-card
                    elevation="2"
                    rounded="lg"
                    class="h-100 overflow-y-auto"
                >
                    <slot name="PanelAside"></slot>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script setup lang="ts">
import PageHeader from "@/components/layout/pages/components/PageHeader.vue";
import { BreadCrumbItem } from "@/components/widgets/breadCrumb/types";

withDefaults(
    defineProps<{
        title: string;
        breadCrumb?: BreadCrumbItem[];
        dataTestId?: string;
    }>(),
    { breadCrumb: undefined, dataTestId: undefined },
);
</script>
