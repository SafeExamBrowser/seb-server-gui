<template>
    <div
        :class="[
            'w-100',
            'd-flex',
            layout === 'vertical' ? 'flex-column' : 'flex-row',
            'ga-2',
        ]"
    >
        <div
            v-for="field in fields"
            :key="field.name"
            class="w-100"
            :field="field"
        >
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
            <v-number-input
                v-else-if="field.type === 'number'"
                v-model="field.model.value"
                v-bind="{
                    ...getBaseProperties(field),
                    ...getTextualProperties(field),
                }"
                :min="field.min"
                :max="field.max"
            >
            </v-number-input>
            <FormFieldColor
                v-else-if="field.type === 'color'"
                v-model="field.model.value"
                :standard-properties="{
                    ...getBaseProperties(field),
                    ...getTextualProperties(field),
                }"
            />
            <v-select
                v-else-if="field.type === 'select'"
                v-model="field.model.value"
                v-bind="{
                    ...getBaseProperties(field),
                    ...getTextualProperties(field),
                }"
                :items="field.options"
                item-title="text"
                item-value="value"
                :clearable="!field.required"
            >
            </v-select>
            <v-switch
                v-else-if="field.type === 'switch'"
                v-model="field.model.value"
                v-bind="getBaseProperties(field)"
                color="primary"
            >
            </v-switch>
            <FormFieldCollection
                v-else-if="field.type === 'collection'"
                :label="field.label"
                :field-groups="field.fieldGroups"
                :label-add="field.labelAdd"
                :label-row="field.labelRow"
                @add-item="field.onAddItem()"
                @remove-item="
                    (itemIndex: number) => field.onRemoveItem(itemIndex)
                "
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRules } from "vuetify/labs/rules";
import {
    FormField,
    FormFieldBaseProperties,
    FormFieldTextualProperties,
    FormFieldsComponentProps,
} from "../types";
import { VInput } from "vuetify/components";
import { ref, nextTick, watch } from "vue";
import FormFieldCollection from "./FormFieldCollection.vue";
import FormFieldColor from "./FormFieldColor.vue";

const props = withDefaults(defineProps<FormFieldsComponentProps>(), {
    layout: "vertical" as const,
});

const fieldsRefs = new Map<
    string,
    ReturnType<typeof ref<VInput | undefined>>
>();

// keep fieldsRefs up to date when fields change
watch(
    () => props.fields.map((f) => f.name),
    () => {
        props.fields.forEach((field) => {
            if (!fieldsRefs.has(field.name)) {
                fieldsRefs.set(field.name, ref<VInput | undefined>());
            }
        });
    },
    { immediate: true },
);

const getBaseProperties = (field: FormField): FormFieldBaseProperties => {
    const isRequired = field.type !== "switch" && field.required;

    const fieldRef = fieldsRefs.get(field.name);

    if (!fieldRef) {
        throw new Error(`Field ref not found for field: ${field.name}`);
    }

    return {
        ref: fieldRef,
        label: `${field.label}${isRequired ? " *" : ""}`,
        density: "compact" as const,
        variant: "outlined" as const,
        rules: [
            ...(isRequired ? [useRules().required()] : []),
            ...(field.rules ?? []),
        ],
        hint: field.info || undefined,
        persistentHint: field.info !== undefined,
        "onUpdate:modelValue": () => handleFieldValueUpdated(field.name),
    };
};

const getTextualProperties = (
    field: FormField & {
        type: "text" | "textarea" | "select" | "number" | "color";
    },
): FormFieldTextualProperties => ({
    placeholder: field.placeholder,
});

const handleFieldValueUpdated = async (fieldName: string) => {
    const fieldsToRevalidate = props.fields.filter((field) =>
        field.validationDependsOn?.includes(fieldName),
    );

    nextTick(() => {
        fieldsToRevalidate.forEach((dependentField) => {
            const dependentFieldRef = fieldsRefs.get(dependentField.name);

            if (!dependentFieldRef) {
                throw new Error(
                    `Dependent field ref not found for field: ${dependentField.name}`,
                );
            }

            // `dependentFieldRef` is an array, because of the way the FormBuilder component is implemented (v-if / v-else).
            // This could theoretically bind the same ref to several fields (which we don't do),
            // but Vue can't know this for sure, so it gives us an array.
            const dependentFieldComponent = Array.isArray(
                dependentFieldRef.value,
            )
                ? dependentFieldRef.value[0]
                : dependentFieldRef.value;

            dependentFieldComponent?.validate(true);
        });
    });
};
</script>
