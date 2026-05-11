<template>
    <v-input
        :model-value="model"
        :rules="standardProperties.rules"
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

            <v-file-upload
                v-model="uploadFile"
                :accept="acceptAttr"
                :disabled="standardProperties.disabled"
                :hide-browse="false"
                :title="$t('general.formFields.image.dropTitle')"
                :subtitle="effectiveHint"
                scrim="primary"
                clearable
                inset-file-list
                show-size
                data-testid="formFieldImage-upload"
                density="compact"
                @update:model-value="onUploadChange"
            />
        </div>
    </v-input>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import i18n from "@/i18n";
import { FormFieldBaseProperties } from "../types";

const model = defineModel<File | string | undefined>();

const props = withDefaults(
    defineProps<{
        standardProperties: FormFieldBaseProperties;
        acceptExtensions?: string[];
        hint?: string;
    }>(),
    {
        acceptExtensions: () => [".png", ".jpg", ".jpeg", ".svg"],
        hint: undefined,
    },
);

const acceptAttr = computed(() => props.acceptExtensions.join(","));

const effectiveHint = computed(
    () =>
        props.hint ??
        i18n.global.t("general.formFields.image.hint", {
            types: props.acceptExtensions.join(", "),
        }),
);

const uploadFile = ref<File | undefined>(
    model.value instanceof File ? model.value : undefined,
);

watch(
    () => model.value,
    (newVal) => {
        uploadFile.value = newVal instanceof File ? newVal : undefined;
    },
);

const onUploadChange = (file: File | File[] | null | undefined) => {
    const next = Array.isArray(file) ? file[0] : (file ?? undefined);
    if (next) {
        model.value = next;
    } else if (model.value instanceof File) {
        model.value = undefined;
    }
};

const objectUrl = ref<string | undefined>();
watch(
    () => (model.value instanceof File ? model.value : undefined),
    (file, _, onCleanup) => {
        if (!file) {
            objectUrl.value = undefined;
            return;
        }
        const url = URL.createObjectURL(file);
        objectUrl.value = url;
        onCleanup(() => URL.revokeObjectURL(url));
    },
    { immediate: true },
);
</script>
