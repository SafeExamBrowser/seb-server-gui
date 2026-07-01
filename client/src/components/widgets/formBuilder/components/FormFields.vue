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
            :data-testid="
                dataTestId ? `${dataTestId}-field-${field.name}` : undefined
            "
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
            <FormFieldPassword
                v-else-if="field.type === 'password'"
                v-model="field.model.value"
                :standard-properties="{
                    ...getBaseProperties(field),
                    ...getTextualProperties(field),
                }"
            />
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
                control-variant="split"
                :min="field.min"
                :max="field.max"
            >
                <template v-if="field.unit" #append-inner>
                    <span class="pa-2">{{ field.unit }}</span>
                </template>
            </v-number-input>
            <v-date-input
                v-else-if="field.type === 'date'"
                v-model="field.model.value"
                v-bind="{
                    ...getBaseProperties(field),
                }"
                append-inner-icon="mdi-calendar"
                density="compact"
                display-date-format="dd.MM.yyyy"
                prepend-icon=""
                variant="outlined"
                :max-width="400"
            />
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
            <FormFieldFile
                v-else-if="field.type === 'file'"
                v-model="field.model.value"
                :standard-properties="getBaseProperties(field)"
                :accept-extensions="field.acceptExtensions"
                :icon="field.icon"
                :hint="field.hint"
                :clearable="!field.required"
            />
            <FormFieldImage
                v-else-if="field.type === 'image'"
                v-model="field.model.value"
                :standard-properties="getBaseProperties(field)"
                :drop-title="field.dropTitle"
                :accept-extensions="field.acceptExtensions"
                :hint="field.hint"
                :max-file-size-m-b="field.maxFileSizeMB"
            />
            <FormFieldCollection
                v-else-if="field.type === 'collection'"
                :label="field.label"
                :field-groups="field.fieldGroups"
                :label-add="field.labelAdd"
                :label-row="field.labelRow"
                :backend-errors="props.backendErrors"
                @clear-backend-error="emit('clearBackendError', $event)"
                @add-item="field.onAddItem()"
                @remove-item="
                    (itemIndex: number) => field.onRemoveItem(itemIndex)
                "
            />
            <FormFieldDateTime
                v-else-if="field.type === 'date-time'"
                v-model="field.model.value"
                :standard-properties="getBaseProperties(field)"
            />
            <FormFieldTimeRange
                v-else-if="field.type === 'time-range'"
                v-model="field.model.value"
                :label-from="field.label"
                :label-to="field.label"
                :standard-properties="getBaseProperties(field)"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useValidationRules } from "@/composables/useValidationRules.ts";
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
import FormFieldFile from "./FormFieldFile.vue";
import FormFieldImage from "./FormFieldImage.vue";
import FormFieldPassword from "./FormFieldPassword.vue";
import FormFieldDateTime from "@/components/widgets/formBuilder/components/FormFieldDateTime.vue";
import FormFieldTimeRange from "@/components/widgets/formBuilder/components/FormFieldTimeRange.vue";

const props = withDefaults(
    defineProps<FormFieldsComponentProps & { dataTestId?: string }>(),
    {
        layout: "vertical" as const,
        dataTestId: undefined,
    },
);

const emit = defineEmits<{
    (e: "clearBackendError", fieldName: string): void;
}>();

const validationRules = useValidationRules();

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
            ...(isRequired ? [validationRules.required()] : []),
            ...(field.rules ?? []),
        ],
        hint: field.info || undefined,
        persistentHint: field.info !== undefined,
        disabled: field.disabled,
        errorMessages: props.backendErrors?.[field.name] ?? [],
        "onUpdate:modelValue": () => handleFieldValueUpdated(field.name),
    };
};

const getTextualProperties = (
    field: FormField & {
        type: "text" | "textarea" | "select" | "number" | "color" | "password";
    },
): FormFieldTextualProperties => ({
    placeholder: field.placeholder,
});

const handleFieldValueUpdated = async (fieldName: string) => {
    emit("clearBackendError", fieldName);

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
