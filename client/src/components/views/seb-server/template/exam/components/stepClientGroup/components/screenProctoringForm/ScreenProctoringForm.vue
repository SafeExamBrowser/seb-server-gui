<template>
    <Form :fields="formFields" />
</template>

<script setup lang="ts">
import { useFormFields } from "./composables/useFormFields";

const { formFields } = useFormFields();
</script>
