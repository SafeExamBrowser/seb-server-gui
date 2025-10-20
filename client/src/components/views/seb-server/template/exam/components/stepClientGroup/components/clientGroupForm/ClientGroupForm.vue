<template>
    <FormBuilder :fields="formFields" />
</template>

<script setup lang="ts">
import { useFormFields } from "./composables/useFormFields";
import { ClientGroup } from "@/components/views/seb-server/template/exam/components/stepClientGroup/types";
import FormBuilder from "@/components/widgets/formBuilder/FormBuilder.vue";

const model = defineModel<ClientGroup>({ required: true });

const { formFields } = useFormFields(model);
</script>
