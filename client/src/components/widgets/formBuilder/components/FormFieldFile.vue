<template>
    <v-file-input
        v-model="model"
        v-bind="standardProperties"
        :rules="allValidationRules"
        :accept="acceptExtensions.join(',')"
        :prepend-icon="icon"
        clearable
        show-size
    />
</template>

<script setup lang="ts">
import { FormFieldBaseProperties } from "../types";
import { computed } from "vue";
import { useRules } from "vuetify/labs/rules";

const model = defineModel<File | undefined>();

const props = defineProps<{
    standardProperties: FormFieldBaseProperties;
    acceptExtensions: string[];
    icon?: string;
    clearable: boolean;
}>();

const allValidationRules = computed(() => [
    ...(props.standardProperties.rules ?? []),
    useRules().fileExtension(props.acceptExtensions),
]);
</script>
