<template>
    <slot name="activator" :props="{ onClick: openDialog }">
        <v-btn
            v-if="labelActivatorVisible && labelActivator !== ''"
            class="text-none"
            :disabled="disabled"
            :color="colorActivator"
            variant="text"
            density="compact"
            :title="title"
            :aria-label="labelActivator"
            @click="openDialog"
        >
            <v-icon :icon="iconActivator" :size="sizeActivator" />
            <span class="ml-2">
                {{ labelActivator }}
            </span>
        </v-btn>
        <BoxActionButton
            v-else
            :icon="iconActivator"
            :color="colorActivator"
            :disabled="disabled"
            :label="title !== '' ? title : labelActivator"
            @click="openDialog"
        />
    </slot>
    <v-dialog
        v-model="isDialogOpen"
        :max-width="thresholds.sm"
        :persistent="submitting"
    >
        <v-card
            :title="labelActivator"
            :data-testid="
                dataTestId ? `${dataTestId}-create-dialog` : undefined
            "
        >
            <template #text>
                <FormBuilder
                    v-model="isValid"
                    :fields="formFields"
                    :form-id="formId"
                    :data-testid="
                        dataTestId
                            ? `${dataTestId}-create-dialog-form`
                            : undefined
                    "
                    @submit="handleFormSubmit"
                />
                <v-alert
                    v-if="errorMessage"
                    class="mt-3"
                    type="error"
                    variant="tonal"
                    density="comfortable"
                >
                    {{ errorMessage }}
                </v-alert>
                <v-progress-linear
                    v-if="submitting"
                    class="mt-3"
                    indeterminate
                    rounded
                />
            </template>
            <template #actions>
                <v-btn
                    :text="labelCancel"
                    :disabled="submitting"
                    :data-testid="
                        dataTestId
                            ? `${dataTestId}-create-dialog-cancel-button`
                            : undefined
                    "
                    @click="handleCancelClick"
                ></v-btn>
                <v-btn
                    type="submit"
                    color="primary"
                    :form="formId"
                    :text="labelSubmit"
                    :disabled="!isValid || submitting"
                    :data-testid="
                        dataTestId
                            ? `${dataTestId}-create-dialog-submit-button`
                            : undefined
                    "
                ></v-btn>
            </template>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts" generic="TTransient">
import type { Ref, UnwrapRef } from "vue";
import { computed, ref, watch } from "vue";
import { useDisplay } from "vuetify";
import { IconValue } from "vuetify/lib/composables/icons.mjs";

import BoxActionButton from "@/components/widgets/BoxActionButton.vue";
import FormBuilder from "@/components/widgets/formBuilder/FormBuilder.vue";
import { FormField } from "@/components/widgets/formBuilder/types";
import { errorMessageOf } from "@/services/errors/toAppError.ts";

const props = withDefaults(
    defineProps<{
        disabled?: boolean;
        title?: string;
        iconActivator: IconValue;
        colorActivator: string;
        sizeActivator?: string;
        labelActivator: string;
        labelActivatorVisible?: boolean;
        labelCancel: string;
        labelSubmit: string;
        formId: string;
        getFormFields: (
            item: Ref<UnwrapRef<TTransient>> | Ref<TTransient>,
        ) => FormField[];
        getItem: () => TTransient;
        onSubmit: (item: TTransient) => void | Promise<void>;
        dataTestId?: string;
    }>(),
    {
        title: "",
        disabled: false,
        sizeActivator: undefined,
        labelActivatorVisible: false,
        dataTestId: undefined,
    },
);

const { thresholds: thresholdsRef } = useDisplay();
const thresholds = computed(() => thresholdsRef.value);

const isDialogOpen = ref(false);
const item = ref<TTransient>(props.getItem());
const isValid = ref<boolean>(false);
const submitting = ref<boolean>(false);
const errorMessage = ref<string>("");
const formFields = computed<FormField[]>(() => props.getFormFields(item));

watch(isDialogOpen, (newValue) => {
    if (newValue) {
        item.value = props.getItem();
        isValid.value = false;
        submitting.value = false;
        errorMessage.value = "";
    }
});

const openDialog = () => {
    isDialogOpen.value = true;
};

const handleCancelClick = () => {
    isDialogOpen.value = false;
};

const handleFormSubmit = async () => {
    if (submitting.value) {
        return;
    }

    submitting.value = true;
    errorMessage.value = "";

    try {
        await props.onSubmit(item.value);
        isDialogOpen.value = false;
    } catch (err) {
        errorMessage.value = errorMessageOf(err);
    } finally {
        submitting.value = false;
    }
};
</script>
