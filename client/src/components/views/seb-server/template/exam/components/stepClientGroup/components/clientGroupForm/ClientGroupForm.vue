<template>
    <FormBuilder
        v-model="isValid"
        :fields="formFields"
        :form-id="formId"
        @submit="handleSubmit"
    />
</template>

<script setup lang="ts">
import { useFormFields } from "./composables/useFormFields";
import { ClientGroupTransient } from "@/components/views/seb-server/template/exam/components/stepClientGroup/types";
import FormBuilder from "@/components/widgets/formBuilder/FormBuilder.vue";

defineProps<{
    formId: string;
}>();

const emit = defineEmits<{
    (e: "submit"): void;
}>();

const model = defineModel<ClientGroupTransient>({ required: true });

const { isValid, formFields } = useFormFields(model);

const handleSubmit = () => {
    emit("submit");
};
</script>
