<template>
    <CreateExamStepper :create-with-u-r-l="store.initStore(false)" />
</template>

<script setup lang="ts">
import CreateExamStepper from "@/pages/(app)/exam/create/components/CreateExamStepper.vue";
import { useCreateExamStore } from "@/pages/(app)/exam/create/composables/store/useCreateExamStore";

const store = useCreateExamStore();
</script>
