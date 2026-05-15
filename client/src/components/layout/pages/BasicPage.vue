<template>
    <div class="fill-height d-flex flex-column">
        <div class="flex-grow-0 flex-shrink-0 pa-2">
            <BreadCrumb :items="breadCrumb" />
        </div>
        <div class="flex-grow-0 flex-shrink-0 pa-2">
            <PageTitle
                :name="title"
                :data-test-id="
                    dataTestId ? `${dataTestId}-page-title` : undefined
                "
            />
        </div>
        <div v-if="$slots.PanelTop" class="flex-grow-0 flex-shrink-0 pa-2">
            <v-card elevation="2" rounded="lg">
                <slot name="PanelTop"></slot>
            </v-card>
        </div>
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
