<template>
    <SectionSubtitle :name="label" />
    <div v-for="field in fields" :key="field.name">
        <span>{{ field.label }}</span>
    </div>
</template>

<script setup lang="ts">
import SectionSubtitle from "@/components/widgets/SectionSubtitle.vue";
import { FormField } from "../types";

defineProps<{
    label: string;
    fields: FormField[];
}>();
</script>
