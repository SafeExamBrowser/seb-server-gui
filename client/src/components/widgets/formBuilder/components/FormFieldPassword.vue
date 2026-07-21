<template>
    <v-text-field
        v-model="model"
        v-bind="standardProperties"
        :type="visible ? 'text' : 'password'"
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append-inner="visible = !visible"
    >
    </v-text-field>
</template>

<script setup lang="ts">
import { ref } from "vue";

import {
    FormFieldBaseProperties,
    FormFieldTextualProperties,
} from "@/components/widgets/formBuilder/types";

const model = defineModel<string | undefined>();

defineProps<{
    standardProperties: FormFieldBaseProperties & FormFieldTextualProperties;
}>();

const visible = ref(false);
</script>
