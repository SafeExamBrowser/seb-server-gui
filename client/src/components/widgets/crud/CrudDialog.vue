<template>
    <v-btn
        ref="activatorRef"
        :disabled="disabled"
        :icon="iconActivator"
        :color="colorActivator"
        variant="text"
        density="compact"
        :size="sizeActivator"
        :title="labelActivator"
        :aria-label="labelActivator"
    ></v-btn>
    <v-dialog
        v-model="isDialogOpen"
        :activator="activatorRef"
        :max-width="useDisplay().thresholds.value.sm"
    >
        <v-card :title="labelActivator">
            <template #text>
                <FormBuilder
                    v-model="isValid"
                    :fields="formFields"
                    :form-id="formId"
                    @submit="handleFormSubmit"
                />
            </template>
            <template #actions>
                <v-btn :text="labelCancel" @click="handleCancelClick"></v-btn>
                <v-btn
                    type="submit"
                    :form="formId"
                    :text="labelSubmit"
                    :disabled="!isValid"
                ></v-btn>
            </template>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts" generic="T">
import { computed, ref, watch } from "vue";
import { IconValue } from "vuetify/lib/composables/icons.mjs";
import { useDisplay } from "vuetify";
import { FormField } from "@/components/widgets/formBuilder/types";
import { GetFormFields, GetItem } from "./types";

const props = withDefaults(
    defineProps<{
        disabled?: boolean;
        iconActivator: IconValue;
        colorActivator: string;
        sizeActivator?: string;
        labelActivator: string;
        labelCancel: string;
        labelSubmit: string;
        formId: string;
        getFormFields: GetFormFields<T>;
        getItem: GetItem<T>;
    }>(),
    {
        disabled: false,
        sizeActivator: undefined,
    },
);

const emit = defineEmits<{
    (e: "submit", item: T): void;
}>();

const activatorRef = ref<HTMLElement>();
const isDialogOpen = ref(false);
const item = ref<T>(props.getItem());
const isValid = ref<boolean>(false);
const formFields = computed<FormField[]>(() => props.getFormFields(item));

watch(isDialogOpen, (newValue) => {
    if (newValue) {
        // side effects when dialog opens
        item.value = props.getItem();
        isValid.value = false;
    }
});

const handleCancelClick = () => {
    isDialogOpen.value = false;
};

const handleFormSubmit = () => {
    emit("submit", item.value);
    isDialogOpen.value = false;
};
</script>
