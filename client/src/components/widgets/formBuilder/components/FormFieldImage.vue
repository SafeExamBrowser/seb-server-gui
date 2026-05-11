<template>
    <v-input
        :model-value="model"
        :rules="standardProperties.rules"
        :error-messages="sizeError"
        :disabled="standardProperties.disabled"
        hide-details="auto"
    >
        <div class="w-100 d-flex flex-column ga-3">
            <div
                v-if="standardProperties.label"
                class="text-body-2 text-medium-emphasis"
            >
                {{ standardProperties.label }}
            </div>

            <div v-if="previewUrls.length > 0" class="d-flex flex-wrap ga-3">
                <v-card
                    v-for="(url, index) in previewUrls"
                    :key="index"
                    variant="outlined"
                    rounded
                    :data-testid="`formFieldImage-preview-${index}`"
                    :class="previewAspectRatio ? '' : 'flex-grow-1'"
                    :max-width="
                        previewAspectRatio ? PREVIEW_MAX_DIMENSION : undefined
                    "
                >
                    <v-img
                        :src="url"
                        :aspect-ratio="previewAspectRatio"
                        :max-height="PREVIEW_MAX_DIMENSION"
                    />
                    <v-card-actions class="justify-end">
                        <v-btn
                            icon="$clear"
                            density="comfortable"
                            variant="text"
                            :disabled="standardProperties.disabled"
                            :data-testid="`formFieldImage-clear-${index}`"
                            @click="removeAt(index)"
                        />
                    </v-card-actions>
                </v-card>
            </div>

            <v-file-upload
                v-if="!atCapacity"
                :model-value="uploadStaging"
                :accept="acceptAttr"
                :disabled="standardProperties.disabled"
                :title="dropTitle"
                :subtitle="hint"
                :multiple="multiple"
                scrim="primary"
                clearable
                show-size
                data-testid="formFieldImage-upload"
                density="compact"
                @update:model-value="onUploadChange"
            />
        </div>
    </v-input>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, shallowRef, watch } from "vue";
import { FormFieldBaseProperties } from "../types";

const model = defineModel<(File | string)[]>({ default: () => [] });

const props = withDefaults(
    defineProps<{
        standardProperties: FormFieldBaseProperties;
        dropTitle: string;
        acceptExtensions?: string[];
        hint?: string;
        maxFiles?: number;
        maxFileSizeMB?: number;
        previewAspectRatio?: number;
    }>(),
    {
        acceptExtensions: () => [".png", ".jpg", ".jpeg", ".svg"],
        hint: undefined,
        maxFiles: 1,
        maxFileSizeMB: 2,
        previewAspectRatio: undefined,
    },
);

const PREVIEW_MAX_DIMENSION = 300;

const acceptAttr = computed(() => props.acceptExtensions.join(","));

const atCapacity = computed(() => model.value.length >= props.maxFiles);
const remainingSlots = computed(() =>
    Math.max(0, props.maxFiles - model.value.length),
);
const multiple = computed(() => props.maxFiles > 1);

const uploadStaging = ref<File | File[] | undefined>(undefined);
const sizeError = ref<string | undefined>();

const onUploadChange = (val: File | File[] | null | undefined) => {
    if (!val) {
        uploadStaging.value = undefined;
        return;
    }
    const incoming = Array.isArray(val) ? val : [val];
    if (incoming.length === 0) {
        uploadStaging.value = undefined;
        return;
    }
    const maxBytes = props.maxFileSizeMB * 1024 * 1024;
    const tooBig = incoming.filter((f) => f.size > maxBytes);
    const withinLimit = incoming.filter((f) => f.size <= maxBytes);
    sizeError.value =
        tooBig.length > 0
            ? `${tooBig.length === 1 ? "File exceeds" : `${tooBig.length} files exceed`} the ${props.maxFileSizeMB} MB limit`
            : undefined;
    const accepted = withinLimit.slice(0, remainingSlots.value);
    if (accepted.length > 0) {
        model.value = [...model.value, ...accepted];
    }
    uploadStaging.value = undefined;
};

const removeAt = (index: number) => {
    model.value = model.value.filter((_, i) => i !== index);
    sizeError.value = undefined;
};

const fileUrls = shallowRef(new Map<File, string>());

watch(
    () => model.value.filter((v): v is File => v instanceof File),
    (currentFiles) => {
        const currentSet = new Set(currentFiles);
        const newMap = new Map<File, string>();

        for (const [file, url] of fileUrls.value.entries()) {
            if (currentSet.has(file)) {
                newMap.set(file, url);
            } else {
                URL.revokeObjectURL(url);
            }
        }
        for (const file of currentFiles) {
            if (!newMap.has(file)) {
                newMap.set(file, URL.createObjectURL(file));
            }
        }

        fileUrls.value = newMap;
    },
    { immediate: true, deep: true },
);

onBeforeUnmount(() => {
    for (const url of fileUrls.value.values()) {
        URL.revokeObjectURL(url);
    }
});

const previewUrls = computed(() =>
    model.value.map((item) =>
        item instanceof File ? fileUrls.value.get(item) : item,
    ),
);
</script>
