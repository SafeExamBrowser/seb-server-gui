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
            <v-col v-if="$slots.PanelLeft" cols="2" class="h-100 pa-2">
                <slot name="PanelLeft"></slot>
            </v-col>
            <v-col :cols="mainCols" class="h-100 pa-2">
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
import { computed, useSlots } from "vue";
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

const slots = useSlots();

const mainCols = computed(() => {
    let cols = 12;
    if (slots.PanelLeft) {
        cols -= 2;
    }
    if (slots.PanelAside) {
        cols -= 3;
    }
    return cols;
});
</script>
