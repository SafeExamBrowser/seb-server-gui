<template>
    <SectionSubtitle :name="label" />
    <div v-for="(fieldGroup, index) in fieldGroups" :key="index">
        <FormBuilder :fields="fieldGroup" />
    </div>
</template>

<script setup lang="ts">
import SectionSubtitle from "@/components/widgets/SectionSubtitle.vue";
import { FormFieldGroup } from "../types";
import FormBuilder from "../FormBuilder.vue";

defineProps<{
    label: string;
    fieldGroups: FormFieldGroup[];
}>();
</script>
