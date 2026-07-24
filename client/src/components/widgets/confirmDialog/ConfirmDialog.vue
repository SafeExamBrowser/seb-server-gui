<template>
    <v-dialog v-model="model" max-width="500" :persistent="loading">
        <v-card rounded="lg" :data-testid="testIds?.root">
            <v-btn
                v-if="icon"
                :active="false"
                class="my-1 ma-4 mt-6 rounded-lg overflow-hidden"
                color="primary"
                icon
                size="large"
                variant="flat"
            >
                <v-icon :icon="icon"></v-icon>
            </v-btn>

            <v-card-title
                class="text-title-large font-weight-bold"
                :data-testid="testIds?.title"
            >
                {{ title }}
            </v-card-title>

            <v-card-text :data-testid="testIds?.text">
                <div v-if="subTitle" class="font-weight-bold">
                    {{ subTitle }}
                </div>

                {{ text }}

                <div
                    v-if="detailText"
                    class="mt-4 text-primary font-weight-medium"
                >
                    {{ detailText }}
                </div>
            </v-card-text>

            <v-card-actions class="justify-end">
                <v-btn
                    variant="text"
                    :disabled="loading"
                    :data-testid="testIds?.cancel"
                    @click="model = false"
                >
                    {{ cancelLabel ?? $t("general.cancelButton") }}
                </v-btn>

                <v-btn
                    :color="confirmColor"
                    variant="flat"
                    :loading="loading"
                    :data-testid="testIds?.confirm"
                    @click="emit('confirm')"
                >
                    {{ confirmLabel }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
// Single reusable confirm dialog. All confirmation flows (delete, status
// toggle, generic action) render through this so width, corner radius and the
// button hierarchy (text Cancel + flat coloured Confirm) stay consistent.
// Callers pass fully translated strings; the thin Delete/Status/Generic
// wrappers map their translation-key conventions onto these props.
export type ConfirmDialogTestIds = {
    root?: string;
    title?: string;
    text?: string;
    cancel?: string;
    confirm?: string;
};

const model = defineModel<boolean>({ required: true });

withDefaults(
    defineProps<{
        title: string;
        confirmLabel: string;
        text?: string;
        subTitle?: string;
        detailText?: string;
        cancelLabel?: string;
        confirmColor?: string;
        icon?: string;
        loading?: boolean;
        testIds?: ConfirmDialogTestIds;
    }>(),
    {
        text: undefined,
        subTitle: undefined,
        detailText: undefined,
        cancelLabel: undefined,
        confirmColor: "primary",
        icon: undefined,
        loading: false,
        testIds: undefined,
    },
);

const emit = defineEmits<{
    confirm: [];
}>();
</script>
