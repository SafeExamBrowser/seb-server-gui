<template>
    <Form :fields="formFields" />
</template>

<script setup lang="ts">
import { useFormFields } from "@/components/views/seb-server/template/exam/components/stepClientGroup/composables/useFormFields";
import { ClientGroup } from "@/components/views/seb-server/template/exam/components/stepClientGroup/types";

const model = defineModel<ClientGroup>({ required: true });

const { formFields } = useFormFields(model);
</script>
