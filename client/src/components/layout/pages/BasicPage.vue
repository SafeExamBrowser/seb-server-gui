<template>
    <div class="fill-height d-flex flex-column">
        <v-row class="flex-grow-0 flex-shrink-0">
            <v-col>
                <BreadCrumb :items="breadCrumb" />
            </v-col>
        </v-row>
        <v-row class="flex-grow-0 flex-shrink-0">
            <v-col>
                <PageTitle class="pl-9" :name="title" />
            </v-col>
        </v-row>
        <v-row class="flex-grow-1 flex-shrink-1 overflow-y-auto">
            <v-col
                :cols="hasAside ? 9 : 12"
                class="fill-height overflow-y-auto"
            >
                <slot name="PanelMain"></slot>
            </v-col>
            <v-col v-if="hasAside" cols="3" class="fill-height overflow-y-auto">
                <slot name="PanelAside"></slot>
            </v-col>
        </v-row>
    </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from "vue";
import PageTitle from "@/components/widgets/PageTitle.vue";
import { BreadCrumbItem } from "@/components/widgets/breadCrumb/types";
import BreadCrumb from "@/components/widgets/breadCrumb/BreadCrumb.vue";

defineProps<{
    title: string;
    breadCrumb: BreadCrumbItem[];
}>();

const slots = useSlots();
const hasAside = computed(() => Boolean(slots.PanelAside));
</script>
