<template>
    <v-form
        :id="formId"
        @update:model-value="handleModelValueUpdated"
        @submit.prevent="handleSubmit"
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
                    <FormFieldCollection
                        v-else-if="field.type === 'collection'"
                        :label="field.label"
                        :field-groups="field.fieldGroups"
                        :label-add="field.labelAdd"
                        :label-row="field.labelRow"
                        @add-item="field.onAddItem"
                    />
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
import { VInput } from "vuetify/components";
import { ref, nextTick, watch } from "vue";
import FormFieldCollection from "./components/FormFieldCollection.vue";

const isValid = defineModel<boolean | null>();

const props = defineProps<{
    formId?: string;
    fields: FormField[];
}>();

const emit = defineEmits<{
    (e: "submit"): void;
}>();

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

const handleSubmit = async () => {
    emit("submit");
};
</script>
