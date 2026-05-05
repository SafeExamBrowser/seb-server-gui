<template>
    <v-btn
        ref="activatorRef"
        class="text-none"
        :disabled="disabled"
        :append-icon="iconActivator"
        :color="colorActivator"
        variant="text"
        density="compact"
        :size="sizeActivator"
        :title="labelActivator"
        :aria-label="labelActivator"
    >
        <span v-if="labelActivatorVisible">
            {{ labelActivator }}
        </span>
    </v-btn>
    <v-dialog
        v-model="isDialogOpen"
        :activator="activatorRef"
        :max-width="useDisplay().thresholds.value.sm"
        :persistent="submitting"
    >
        <v-card :title="labelActivator">
            <template #text>
                <FormBuilder
                    v-model="isValid"
                    :fields="formFields"
                    :form-id="formId"
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
                    @click="handleCancelClick"
                ></v-btn>
                <v-btn
                    type="submit"
                    :form="formId"
                    :text="labelSubmit"
                    :disabled="!isValid || submitting"
                ></v-btn>
            </template>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts" generic="TTransient">
import { computed, ref, watch } from "vue";
import type { Ref, UnwrapRef } from "vue";
import { IconValue } from "vuetify/lib/composables/icons.mjs";
import { useDisplay } from "vuetify";
import FormBuilder from "@/components/widgets/formBuilder/FormBuilder.vue";
import { FormField } from "@/components/widgets/formBuilder/types";

const props = withDefaults(
    defineProps<{
        disabled?: boolean;
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
    }>(),
    {
        disabled: false,
        sizeActivator: undefined,
        labelActivatorVisible: false,
    },
);

const activatorRef = ref<HTMLElement>();
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
        errorMessage.value =
            err instanceof Error && err.message ? err.message : String(err);
    } finally {
        submitting.value = false;
    }
};
</script>
