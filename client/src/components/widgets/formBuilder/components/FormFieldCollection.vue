<template>
    <SectionSubtitle :name="label" />

    <v-btn
        icon="mdi-plus-circle-outline"
        color="primary"
        variant="text"
        density="compact"
        :title="labelAdd"
        :aria-label="labelAdd"
        @click="handleAddItemClick"
    ></v-btn>

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
    labelAdd: string;
    fieldGroups: FormFieldGroup[];
}>();

const emit = defineEmits<{
    (e: "addItem"): void;
}>();

const handleAddItemClick = () => {
    emit("addItem");
};
</script>
