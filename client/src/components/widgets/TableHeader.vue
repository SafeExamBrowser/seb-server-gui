<template>
    <v-container fluid class="ma-0 pa-0 pb-3 border-b-md">
        <v-row>
            <v-col>
                <SectionSubtitle :name="label" :level="headingLevel" />
            </v-col>
            <v-col cols="auto">
                <slot></slot>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { VCol, VContainer, VRow } from "vuetify/components";

import SectionSubtitle from "@/components/widgets/SectionSubtitle.vue";
import type { HeadingLevel } from "@/components/widgets/types";

defineProps<{
    label: string;
    headingLevel?: HeadingLevel;
}>();
</script>
