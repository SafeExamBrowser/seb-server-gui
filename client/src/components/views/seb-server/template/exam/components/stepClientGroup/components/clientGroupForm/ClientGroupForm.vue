<template>
    <FormBuilder v-model="isValid" :fields="formFields" />
</template>

<script setup lang="ts">
import { useFormFields } from "./composables/useFormFields";
import { ClientGroupTransient } from "@/components/views/seb-server/template/exam/components/stepClientGroup/types";
import FormBuilder from "@/components/widgets/formBuilder/FormBuilder.vue";

const model = defineModel<ClientGroupTransient>({ required: true });

const { isValid, formFields } = useFormFields(model);
</script>
