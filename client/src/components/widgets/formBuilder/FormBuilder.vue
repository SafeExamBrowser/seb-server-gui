<template>
    <v-form
        :id="formId"
        @update:model-value="handleModelValueUpdated"
        @submit.prevent="handleSubmit"
    >
        <FormFields :fields="fields" :layout="layout" />
    </v-form>
</template>

<script setup lang="ts">
import { VForm } from "vuetify/components";
import { FormFieldsComponentProps } from "./types";
import FormFields from "./components/FormFields.vue";

const isValid = defineModel<boolean | null>();

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
