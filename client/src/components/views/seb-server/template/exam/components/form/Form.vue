<!-- TODO @alain: this could become a generally reusable component, it's not limited to the exam template -->
<template>
    <v-form class="w-100 w-md-50" @submit.prevent>
        <v-container fluid class="pa-0">
            <v-row
                v-for="field in fields"
                :key="field.name"
                :field="field"
                dense
            >
                <v-col>
                    <v-text-field
                        v-if="field.type === 'text'"
                        v-model="field.model.value"
                        v-bind="getBaseProperties(field)"
                    >
                    </v-text-field>
                    <v-textarea
                        v-else-if="field.type === 'textarea'"
                        v-model="field.model.value"
                        v-bind="getBaseProperties(field)"
                        :rows="4"
                    >
                    </v-textarea>
                    <v-select
                        v-else-if="field.type === 'select'"
                        v-model="field.model.value"
                        v-bind="getBaseProperties(field)"
                        :items="field.options"
                        item-title="text"
                        item-value="value"
                    >
                    </v-select>
                </v-col>
            </v-row>
        </v-container>
    </v-form>
</template>

<script setup lang="ts">
import { FormField, FormFieldBaseProperties } from "./types";

const getBaseProperties = (field: FormField): FormFieldBaseProperties => {
    return {
        label: `${field.label}${field.required ? " *" : ""}`,
        placeholder: field.placeholder,
        required: field.required ?? false,
        density: "compact" as const,
        variant: "outlined" as const,
    };
};

defineProps<{
    fields: FormField[];
}>();
</script>
