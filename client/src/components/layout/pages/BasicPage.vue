<template>
    <div class="fill-height d-flex flex-column">
        <v-row class="flex-grow-0 flex-shrink-0">
            <v-col>
                <BreadCrumb :items="breadCrumb" />
            </v-col>
        </v-row>
        <v-row class="flex-grow-0 flex-shrink-0">
            <v-col>
                <PageTitle
                    class="pl-9"
                    :name="title"
                    :data-test-id="
                        dataTestId ? `${dataTestId}-page-title` : undefined
                    "
                />
            </v-col>
        </v-row>
        <v-row v-if="hasTop" class="flex-grow-0 flex-shrink-0">
            <v-col>
                <v-card elevation="2" rounded="lg">
                    <slot name="PanelTop"></slot>
                </v-card>
            </v-col>
        </v-row>
        <v-row class="flex-grow-1 flex-shrink-1 overflow-y-auto">
            <v-col
                :cols="hasAside ? 9 : 12"
                class="fill-height overflow-y-auto"
            >
                <v-card
                    elevation="2"
                    rounded="lg"
                    class="fill-height overflow-y-auto"
                >
                    <slot name="PanelMain"></slot>
                </v-card>
            </v-col>
            <v-col v-if="hasAside" cols="3" class="fill-height overflow-y-auto">
                <v-card
                    elevation="2"
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
import { computed, useSlots } from "vue";
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

const slots = useSlots();
const hasTop = computed(() => Boolean(slots.PanelTop));
const hasAside = computed(() => Boolean(slots.PanelAside));
</script>
