<template>Exam Template Detail: {{ examTemplateId }}</template>

<script setup lang="ts">
// TODO @alain: implement
import { useRoute } from "vue-router";

const route = useRoute();
const examTemplateId = route.params.examTemplateId;
</script>
