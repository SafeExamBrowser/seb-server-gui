<template>
    <fieldset class="border-none">
        <v-container class="ma-0 pa-0 pb-3">
            <v-row>
                <v-col>
                    <legend>
                        <SectionSubtitle :name="label" />
                    </legend>
                </v-col>
                <v-col cols="auto">
                    <v-btn
                        icon="mdi-plus-circle-outline"
                        color="primary"
                        variant="text"
                        density="compact"
                        :title="labelAdd"
                        :aria-label="labelAdd"
                        @click="handleAddItemClick"
                    ></v-btn>
                </v-col>
            </v-row>
        </v-container>
        <fieldset
            v-for="(fieldGroup, index) in fieldGroups"
            :key="index"
            class="ma-0 pa-0 pt-6 border-0 border-t-md"
        >
            <legend class="d-sr-only">
                {{ `${labelRow}${index + 1}` }}
            </legend>
            <FormBuilder :fields="fieldGroup" layout="horizontal" />
        </fieldset>
    </fieldset>
</template>

<script setup lang="ts">
import { FormFieldGroup } from "../types";
import FormBuilder from "../FormBuilder.vue";
import SectionSubtitle from "@/components/widgets/SectionSubtitle.vue";

defineProps<{
    label: string;
    labelAdd: string;
    labelRow: string;
    fieldGroups: FormFieldGroup[];
}>();

const emit = defineEmits<{
    (e: "addItem"): void;
}>();

const handleAddItemClick = () => {
    emit("addItem");
};
</script>
