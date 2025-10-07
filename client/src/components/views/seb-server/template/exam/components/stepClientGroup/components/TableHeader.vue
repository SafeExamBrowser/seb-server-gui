<!-- TODO @alain: this is a reusable component, move it up to the components folder -->
<template>
    <v-container>
        <v-row>
            <v-col class="primary-text-color text-h6">
                {{ label }}
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
