<!-- TODO @alain: this is a reusable component, move it up to the components folder -->
<template>
    <v-container class="ma-0 pa-0">
        <v-row>
            <v-col>
                <SectionSubtitle :name="label" />
            </v-col>
            <v-col cols="auto">
                <slot></slot>
            </v-col>
        </v-row>
    </v-container>
    <v-divider :thickness="2"></v-divider>
</template>

<script setup lang="ts">
defineProps<{
    label: string;
}>();
</script>
