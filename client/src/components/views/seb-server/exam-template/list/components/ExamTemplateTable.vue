<template>
    <v-data-table :headers="headers" :items="items"></v-data-table>
</template>

<script setup lang="ts">
import { ExamTemplate } from "@/models/seb-server/examTemplate";
import { DataTableHeader } from "vuetify";

defineProps<{
    items: ExamTemplate[];
    headers: DataTableHeader<ExamTemplate>[];
}>();
</script>
