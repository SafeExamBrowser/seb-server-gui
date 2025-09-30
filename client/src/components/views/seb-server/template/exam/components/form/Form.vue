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
                        v-bind="{
                            ...getBaseProperties(field),
                            ...getTextualProperties(field),
                        }"
                    >
                    </v-text-field>
                    <v-textarea
                        v-else-if="field.type === 'textarea'"
                        v-model="field.model.value"
                        v-bind="{
                            ...getBaseProperties(field),
                            ...getTextualProperties(field),
                        }"
                        :rows="4"
                    >
                    </v-textarea>
                    <v-select
                        v-else-if="field.type === 'select'"
                        v-model="field.model.value"
                        v-bind="{
                            ...getBaseProperties(field),
                            ...getTextualProperties(field),
                            ...getSelectProperties(field),
                        }"
                    >
                    </v-select>
                    <v-switch
                        v-else-if="field.type === 'switch'"
                        v-model="field.model.value"
                        v-bind="getBaseProperties(field)"
                        color="primary"
                    >
                    </v-switch>
                </v-col>
            </v-row>
        </v-container>
    </v-form>
</template>

<script setup lang="ts">
import {
    FormField,
    FormFieldBaseProperties,
    FormFieldTextualProperties,
} from "./types";

const getBaseProperties = (field: FormField): FormFieldBaseProperties => ({
    label: `${field.label}${field.type !== "switch" && field.required ? " *" : ""}`,
    density: "compact" as const,
    variant: "outlined" as const,
});

const getTextualProperties = (
    field: FormField & { type: "text" | "textarea" | "select" },
): FormFieldTextualProperties => ({
    placeholder: field.placeholder,
    required: field.required,
});

const getSelectProperties = (field: FormField & { type: "select" }) => ({
    items: field.options,
    itemTitle: "text",
    itemValue: "value",
    clearable: !field.required,
});

defineProps<{
    fields: FormField[];
}>();
</script>
