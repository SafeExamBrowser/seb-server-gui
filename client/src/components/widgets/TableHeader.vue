<template>
    <v-container class="ma-0 pa-0 pb-3 border-b-md">
        <v-row>
            <v-col>
                <SectionSubtitle :name="label" />
            </v-col>
            <v-col cols="auto">
                <slot></slot>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import SectionSubtitle from "@/components/widgets/SectionSubtitle.vue";

defineProps<{
    label: string;
}>();
</script>
