<template>
    <v-dialog v-model="model" max-width="420">
        <v-card rounded="lg" :data-testid="rootTestId">
            <v-card-title
                class="text-title-large font-weight-bold"
                :data-testid="titleTestId"
            >
                {{
                    active
                        ? $t(
                              `${translationKeyPrefix}.statusDialog.deactivateTitle`,
                          )
                        : $t(
                              `${translationKeyPrefix}.statusDialog.activateTitle`,
                          )
                }}
            </v-card-title>

            <v-card-text :data-testid="textTestId">
                {{
                    active
                        ? $t(
                              `${translationKeyPrefix}.statusDialog.deactivateText`,
                          )
                        : $t(
                              `${translationKeyPrefix}.statusDialog.activateText`,
                          )
                }}
            </v-card-text>

            <v-card-actions class="justify-end">
                <v-btn
                    variant="text"
                    :data-testid="cancelTestId"
                    @click="model = false"
                >
                    {{ $t("general.cancelButton") }}
                </v-btn>

                <v-btn
                    :color="active ? 'error' : 'success'"
                    variant="flat"
                    :data-testid="confirmTestId"
                    @click="emit('confirm')"
                >
                    {{
                        active
                            ? $t(
                                  `${translationKeyPrefix}.statusDialog.deactivateAction`,
                              )
                            : $t(
                                  `${translationKeyPrefix}.statusDialog.activateAction`,
                              )
                    }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { computed } from "vue";

const model = defineModel<boolean>({ required: true });
//@Todo Andrei : CreateConfirmActionDialog
const props = withDefaults(
    defineProps<{
        active: boolean;
        translationKeyPrefix: string;
        dataTestId?: string;
    }>(),
    { dataTestId: undefined },
);

const emit = defineEmits<{
    confirm: [];
}>();

const rootTestId = computed(() =>
    props.dataTestId ? `${props.dataTestId}-status-dialog` : undefined,
);
const titleTestId = computed(() =>
    props.dataTestId ? `${props.dataTestId}-status-dialog-title` : undefined,
);
const textTestId = computed(() =>
    props.dataTestId ? `${props.dataTestId}-status-dialog-text` : undefined,
);
const cancelTestId = computed(() =>
    props.dataTestId ? `${props.dataTestId}-status-cancel-button` : undefined,
);
const confirmTestId = computed(() =>
    props.dataTestId ? `${props.dataTestId}-status-confirm-button` : undefined,
);
</script>
