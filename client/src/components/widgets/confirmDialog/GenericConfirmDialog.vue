<template>
    <v-dialog v-model="model" max-width="500">
        <v-card>
            <v-btn
                v-if="props.icon"
                :active="false"
                class="my-1 ma-4 mt-6 rounded-lg overflow-hidden"
                color="primary"
                icon
                size="large"
                variant="flat"
            >
                <v-icon :icon="props.icon"></v-icon>
            </v-btn>

            <v-card-title class="text-title-large font-weight-bold">
                {{ $t(`${translationKeyPrefix}.confirm.title`) }}
            </v-card-title>

            <v-card-text>
                <div v-if="props.subTitle" class="font-weight-bold">
                    {{ props.subTitle }}
                </div>
                {{
                    textProps
                        ? $t(`${translationKeyPrefix}.confirm.text`, textProps)
                        : $t(`${translationKeyPrefix}.confirm.text`)
                }}
            </v-card-text>

            <v-card-actions class="justify-end">
                <v-btn
                    color="primary"
                    class="text-none pa-4 rounded-lg border"
                    variant="text"
                    @click="model = false"
                >
                    {{ $t("general.cancelButton") }}
                </v-btn>

                <v-btn
                    class="text-none bg-primary pa-4 rounded-lg"
                    variant="text"
                    @click="emit('confirm')"
                >
                    {{ $t(`${translationKeyPrefix}.confirm.action`) }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
//@Todo Andrei : CreateConfirmActionDialog
const model = defineModel<boolean>({ required: true });

const props = defineProps<{
    icon?: string;
    subTitle?: string;
    translationKeyPrefix: string;
    textProps?: Record<string, unknown>;
}>();

const emit = defineEmits<{
    confirm: [];
}>();
</script>
