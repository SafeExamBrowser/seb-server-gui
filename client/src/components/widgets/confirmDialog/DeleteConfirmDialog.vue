<template>
    <v-dialog v-model="model" max-width="500" :persistent="loading">
        <v-card :data-testid="rootTestId">
            <v-card-title
                class="text-title-large font-weight-bold"
                :data-testid="titleTestId"
            >
                {{ $t(`${translationKeyPrefix}.deleteDialog.title`) }}
            </v-card-title>

            <v-card-text :data-testid="textTestId">
                {{ $t(`${translationKeyPrefix}.deleteDialog.text`) }}

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
                    :data-testid="cancelTestId"
                    :disabled="loading"
                    @click="model = false"
                >
                    {{ $t("general.cancelButton") }}
                </v-btn>

                <v-btn
                    color="error"
                    variant="text"
                    :data-testid="confirmTestId"
                    :loading="loading"
                    @click="emit('confirm')"
                >
                    {{ $t(`${translationKeyPrefix}.deleteDialog.action`) }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { computed } from "vue";

//@Todo Andrei : CreateConfirmActionDialog
const model = defineModel<boolean>({ required: true });

const props = withDefaults(
    defineProps<{
        detailText?: string;
        // TODO @andrei: avoid programmatic translation key generation:
        // - this is inflexible (translations need to have a certain shape)
        // - this mmakes it very hard to refactor translation keys (search and replace is impossible)
        // => accept fully translated strings instead
        translationKeyPrefix: string;
        dataTestId?: string;
        loading?: boolean;
    }>(),
    { detailText: undefined, dataTestId: undefined },
);

const emit = defineEmits<{
    confirm: [];
}>();

const rootTestId = computed(() =>
    props.dataTestId ? `${props.dataTestId}-delete-dialog` : undefined,
);
const titleTestId = computed(() =>
    props.dataTestId ? `${props.dataTestId}-delete-dialog-title` : undefined,
);
const textTestId = computed(() =>
    props.dataTestId ? `${props.dataTestId}-delete-dialog-text` : undefined,
);
const cancelTestId = computed(() =>
    props.dataTestId ? `${props.dataTestId}-delete-cancel-button` : undefined,
);
const confirmTestId = computed(() =>
    props.dataTestId ? `${props.dataTestId}-delete-confirm-button` : undefined,
);
</script>
