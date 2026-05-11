<template>
    <v-file-upload
        :model-value="model ?? undefined"
        :accept="acceptAttr"
        :disabled="standardProperties.disabled"
        :title="dropTitle"
        :subtitle="hint"
        :rules="standardProperties.rules"
        :error-messages="sizeError"
        clearable
        inset-file-list
        show-size
        density="compact"
        data-testid="formFieldImage-upload"
        @update:model-value="onUpdate"
    />
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { FormFieldBaseProperties } from "../types";

const model = defineModel<File | null>({ default: null });

const props = withDefaults(
    defineProps<{
        standardProperties: FormFieldBaseProperties;
        dropTitle: string;
        acceptExtensions?: string[];
        hint?: string;
        maxFileSizeMB?: number;
    }>(),
    {
        acceptExtensions: () => [".png", ".jpg", ".jpeg", ".svg"],
        hint: undefined,
        maxFileSizeMB: 2,
    },
);

const acceptAttr = computed(() => props.acceptExtensions.join(","));
const sizeError = ref<string | undefined>();

const onUpdate = (val: File | File[] | null | undefined) => {
    const file = Array.isArray(val) ? val[0] : val;
    if (file && file.size > props.maxFileSizeMB * 1024 * 1024) {
        sizeError.value = `File exceeds the ${props.maxFileSizeMB} MB limit`;
        model.value = null;
        return;
    }
    sizeError.value = undefined;
    model.value = file ?? null;
};
</script>
