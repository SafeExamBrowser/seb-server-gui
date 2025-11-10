<template>
    <v-btn
        ref="activatorRef"
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

<script setup lang="ts">
import { ref, watch } from "vue";
import { IconValue } from "vuetify/lib/composables/icons.mjs";
import { useDisplay } from "vuetify";
import { useFormFields } from "./composables/useFormFields";
import {
    Indicator,
    IndicatorTransient,
    indicatorTransientToIndicator,
} from "@/components/views/seb-server/template/exam/components/stepIndicators/types";

const props = withDefaults(
    defineProps<{
        iconActivator: IconValue;
        colorActivator: string;
        sizeActivator?: string;
        labelActivator: string;
        labelCancel: string;
        labelSubmit: string;
        getIndicator: () => IndicatorTransient;
    }>(),
    {
        sizeActivator: undefined,
    },
);

const emit = defineEmits<{
    (e: "submit", indicator: Indicator): void;
}>();

const activatorRef = ref<HTMLElement>();
const isDialogOpen = ref(false);
const indicatorTransient = ref(props.getIndicator());
const formId = "indicator-form";
const isValid = ref<boolean>(false);
const { formFields } = useFormFields(indicatorTransient);

watch(isDialogOpen, (newValue) => {
    if (!newValue) {
        // side effect: reset the temporary indicator whenever the dialog is closed
        indicatorTransient.value = props.getIndicator();

        // side effect: reset the validation flag whenever the dialog is closed
        isValid.value = false;
    }
});

const handleCancelClick = () => {
    isDialogOpen.value = false;
};

const handleFormSubmit = () => {
    emit("submit", indicatorTransientToIndicator(indicatorTransient.value));
    isDialogOpen.value = false;
};
</script>
