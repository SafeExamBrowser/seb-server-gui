<template>
    <v-form
        :id="formId"
        ref="formRef"
        @update:model-value="handleModelValueUpdated"
        @submit.prevent="handleSubmit"
    >
        <FormFields
            :fields="fields"
            :layout="layout"
            :backend-errors="backendErrors"
            :data-test-id="fieldTestIdBase"
            @clear-backend-error="clearBackendErrors"
        />
    </v-form>
</template>

<script setup lang="ts">
import { computed, ref, useAttrs } from "vue";
import { VForm } from "vuetify/components";
import { FormFieldsComponentProps } from "./types";
import type { BackendFieldErrorMap } from "@/services/errors/types.ts";
import FormFields from "./components/FormFields.vue";

const isValid = defineModel<boolean | null>();
const formRef = ref<InstanceType<typeof VForm>>();

const attrs = useAttrs();
const fieldTestIdBase = computed(() => {
    const value = attrs["data-testid"];
    return typeof value === "string" ? value : undefined;
});

const backendErrors = ref<BackendFieldErrorMap>({});

function setBackendErrors(errors: BackendFieldErrorMap) {
    backendErrors.value = errors;
}

function clearBackendErrors(fieldName?: string) {
    if (!fieldName) {
        backendErrors.value = {};
        return;
    }
    backendErrors.value = Object.fromEntries(
        Object.entries(backendErrors.value).filter(
            ([key]) => key !== fieldName,
        ),
    );
}

function hasBackendErrors() {
    return Object.values(backendErrors.value).some(
        (messages) => messages.length > 0,
    );
}

defineExpose({
    validate: () => formRef.value?.validate(),
    setBackendErrors,
    clearBackendErrors,
    hasBackendErrors,
});

defineProps<
    {
        formId?: string;
    } & FormFieldsComponentProps
>();

const emit = defineEmits<{
    (e: "submit"): void;
}>();

const handleModelValueUpdated = (value: boolean | null) => {
    isValid.value = value;
};

const handleSubmit = async () => {
    emit("submit");
};
</script>
