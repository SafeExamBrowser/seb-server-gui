<template>
    <v-dialog v-model="model" max-width="420">
        <v-card rounded="lg">
            <v-card-title class="text-h6 font-weight-bold">
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

            <v-card-text>
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
                <v-btn variant="text" @click="model = false">
                    {{ $t("general.cancelButton") }}
                </v-btn>

                <v-btn
                    :color="active ? 'error' : 'success'"
                    variant="flat"
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
const model = defineModel<boolean>({ required: true });
//@Todo Andrei : CreateConfirmActionDialog
defineProps<{
    active: boolean;
    translationKeyPrefix: string;
}>();

const emit = defineEmits<{
    confirm: [];
}>();
</script>
