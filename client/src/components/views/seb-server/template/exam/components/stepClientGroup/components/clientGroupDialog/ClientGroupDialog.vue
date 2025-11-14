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

<script setup lang="ts">
import { ref, watch } from "vue";
import { IconValue } from "vuetify/lib/composables/icons.mjs";
import {
    ClientGroup,
    ClientGroupTransient,
    clientGroupTransientToClientGroup,
} from "@/components/views/seb-server/template/exam/components/stepClientGroup/types";
import { useDisplay } from "vuetify";
import { useFormFields } from "./composables/useFormFields";
import FormBuilder from "@/components/widgets/formBuilder/FormBuilder.vue";

const props = withDefaults(
    defineProps<{
        disabled?: boolean;
        iconActivator: IconValue;
        colorActivator: string;
        sizeActivator?: string;
        labelActivator: string;
        labelCancel: string;
        labelSubmit: string;
        getClientGroup: () => ClientGroupTransient;
    }>(),
    {
        disabled: false,
        sizeActivator: undefined,
    },
);

const emit = defineEmits<{
    (e: "submit", clientGroup: ClientGroup): void;
}>();

const activatorRef = ref<HTMLElement>();
const isDialogOpen = ref(false);
const clientGroupTransient = ref(props.getClientGroup());
const formId = "client-group-form";
const isValid = ref<boolean>(false);
const { formFields } = useFormFields(clientGroupTransient);

watch(isDialogOpen, (newValue) => {
    if (!newValue) {
        // side effect: reset the temporary client group whenever the dialog is closed
        clientGroupTransient.value = props.getClientGroup();

        // side effect: reset the validation flag whenever the dialog is closed
        isValid.value = false;
    }
});

const handleCancelClick = () => {
    isDialogOpen.value = false;
};

const handleFormSubmit = () => {
    emit(
        "submit",
        clientGroupTransientToClientGroup(clientGroupTransient.value),
    );
    isDialogOpen.value = false;
};
</script>
