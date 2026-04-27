<template>
    <v-file-upload
        v-model="model"
        v-bind="standardProperties"
        :accept="acceptExtensions.join(',')"
        :icon="icon"
        clearable
        show-size
    />
</template>

<script setup lang="ts">
import { FormFieldBaseProperties } from "../types";

const model = defineModel<File | undefined>();

defineProps<{
    standardProperties: FormFieldBaseProperties;
    acceptExtensions: string[];
    icon?: string;
}>();
</script>
