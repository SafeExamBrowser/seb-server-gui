<template>
    <v-form
        class="w-100 w-md-50"
        @update:model-value="handleModelValueUpdated"
        @submit.prevent
    >
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
import { VForm } from "vuetify/components";
import { useRules } from "vuetify/labs/rules";
import {
    FormField,
    FormFieldBaseProperties,
    FormFieldTextualProperties,
} from "./types";

const isValid = defineModel<boolean | null>();

defineProps<{
    fields: FormField[];
}>();

const getBaseProperties = (field: FormField): FormFieldBaseProperties => {
    const isRequired = field.type !== "switch" && field.required;

    return {
        label: `${field.label}${isRequired ? " *" : ""}`,
        density: "compact" as const,
        variant: "outlined" as const,
        rules: [
            ...(isRequired ? [useRules().required()] : []),
            ...(field.rules ?? []),
        ],
    };
};

const getTextualProperties = (
    field: FormField & { type: "text" | "textarea" | "select" },
): FormFieldTextualProperties => ({
    placeholder: field.placeholder,
});

const getSelectProperties = (field: FormField & { type: "select" }) => ({
    items: field.options,
    itemTitle: "text",
    itemValue: "value",
    clearable: !field.required,
});

const handleModelValueUpdated = (value: boolean | null) => {
    isValid.value = value;
};
</script>
