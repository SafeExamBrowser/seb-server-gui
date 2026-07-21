<template>
    <div class="d-flex flex-column ga-2">
        <span
            v-if="standardProperties.label"
            class="text-body-2 text-medium-emphasis"
        >
            {{ standardProperties.label }}
        </span>

        <template v-if="previewSrc">
            <v-sheet border rounded height="120" class="d-flex overflow-hidden">
                <div class="flex-grow-1 d-flex align-center justify-start pa-3">
                    <v-img
                        :src="previewSrc"
                        :alt="standardProperties.label"
                        max-height="96"
                        max-width="240"
                        data-testid="formFieldImage-preview"
                    />
                </div>

                <v-divider vertical />

                <div class="d-flex flex-column flex-shrink-0">
                    <v-btn
                        variant="text"
                        rounded="0"
                        :title="replaceLabel"
                        :aria-label="replaceLabel"
                        :disabled="standardProperties.disabled"
                        class="flex-grow-1"
                        data-testid="formFieldImage-replace"
                        @click="openPicker"
                    >
                        <v-icon icon="mdi-pencil" />
                    </v-btn>

                    <v-divider />

                    <v-btn
                        variant="text"
                        rounded="0"
                        color="error"
                        :title="removeLabel"
                        :aria-label="removeLabel"
                        :disabled="standardProperties.disabled"
                        class="flex-grow-1"
                        data-testid="formFieldImage-remove"
                        @click="remove"
                    >
                        <v-icon icon="mdi-delete-outline" />
                    </v-btn>
                </div>
            </v-sheet>

            <input
                ref="fileInputRef"
                type="file"
                class="d-none"
                :accept="acceptAttr"
                @change="onPick"
            />

            <div v-if="errorMessages.length" data-testid="formFieldImage-error">
                <div
                    v-for="message in errorMessages"
                    :key="message"
                    class="text-error text-caption px-3"
                >
                    {{ message }}
                </div>
            </div>
        </template>

        <v-file-upload
            v-else
            :accept="acceptAttr"
            :disabled="standardProperties.disabled"
            :title="dropTitle"
            :subtitle="hint"
            :rules="standardProperties.rules"
            :error-messages="errorMessages"
            clearable
            inset-file-list
            show-size
            density="compact"
            data-testid="formFieldImage-upload"
            @update:model-value="onUpdate"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";

import { FormFieldBaseProperties } from "@/components/widgets/formBuilder/types";
import i18n from "@/i18n";

const props = withDefaults(
    defineProps<{
        modelValue?: File | string;
        standardProperties: FormFieldBaseProperties;
        dropTitle: string;
        acceptExtensions?: string[];
        hint?: string;
        maxFileSizeMB?: number;
    }>(),
    {
        modelValue: undefined,
        acceptExtensions: () => [".png", ".jpg", ".jpeg", ".svg"],
        hint: undefined,
        maxFileSizeMB: 2,
    },
);

const emit = defineEmits<{
    "update:modelValue": [File | string | undefined];
}>();

const acceptAttr = computed(() => props.acceptExtensions.join(","));
const validationError = ref<string>();
const fileInputRef = ref<HTMLInputElement>();
const objectUrl = ref<string>();

const hasAcceptedExtension = (file: File): boolean => {
    const lowerName = file.name.toLowerCase();
    return props.acceptExtensions.some((ext) =>
        lowerName.endsWith(ext.toLowerCase()),
    );
};

const replaceLabel = computed(() =>
    i18n.global.t("general.formFields.image.replace"),
);
const removeLabel = computed(() =>
    i18n.global.t("general.formFields.image.remove"),
);

const backendErrors = computed<string[]>(() => {
    const messages = props.standardProperties.errorMessages;
    if (!messages) {
        return [];
    }
    return Array.isArray(messages) ? messages : [messages];
});

const errorMessages = computed(() => [
    ...backendErrors.value,
    ...(validationError.value ? [validationError.value] : []),
]);

watch(
    () => props.modelValue,
    (value) => {
        if (objectUrl.value) {
            URL.revokeObjectURL(objectUrl.value);
            objectUrl.value = undefined;
        }
        if (value instanceof File) {
            objectUrl.value = URL.createObjectURL(value);
        }
    },
    { immediate: true },
);

onBeforeUnmount(() => {
    if (objectUrl.value) {
        URL.revokeObjectURL(objectUrl.value);
    }
});

const previewSrc = computed(() => {
    if (props.modelValue instanceof File) {
        return objectUrl.value;
    }
    if (typeof props.modelValue === "string" && props.modelValue.length > 0) {
        return props.modelValue;
    }
    return undefined;
});

const applyFile = (file: File | undefined) => {
    if (file && !hasAcceptedExtension(file)) {
        validationError.value = i18n.global.t(
            "general.formFields.image.extensionError",
            { types: props.acceptExtensions.join(", ") },
        );
        return;
    }
    if (file && file.size > props.maxFileSizeMB * 1024 * 1024) {
        validationError.value = i18n.global.t(
            "general.formFields.image.sizeError",
            { size: props.maxFileSizeMB },
        );
        return;
    }
    validationError.value = undefined;
    emit("update:modelValue", file ?? undefined);
};

const onUpdate = (value: File | File[] | null | undefined) => {
    const file = Array.isArray(value) ? value[0] : value;
    applyFile(file ?? undefined);
};

const openPicker = () => {
    fileInputRef.value?.click();
};

const onPick = (event: Event) => {
    const input = event.target as HTMLInputElement;
    applyFile(input.files?.[0]);
    input.value = "";
};

const remove = () => {
    validationError.value = undefined;
    emit("update:modelValue", undefined);
};
</script>
