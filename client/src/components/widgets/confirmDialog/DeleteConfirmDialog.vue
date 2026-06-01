<template>
    <v-dialog v-model="model" max-width="500">
        <v-card>
            <v-card-title class="text-title-large font-weight-bold">
                {{ $t(`${translationKeyPrefix}.deleteDialog.title`) }}
            </v-card-title>

            <v-card-text>
                {{ $t(`${translationKeyPrefix}.deleteDialog.text`) }}

                <div
                    v-if="detailText"
                    class="mt-4 text-primary font-weight-medium"
                >
                    {{ detailText }}
                </div>
            </v-card-text>

            <v-card-actions class="justify-end">
                <v-btn variant="text" @click="model = false">
                    {{ $t("general.cancelButton") }}
                </v-btn>

                <v-btn color="error" variant="text" @click="emit('confirm')">
                    {{ $t(`${translationKeyPrefix}.deleteDialog.action`) }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
//@Todo Andrei : CreateConfirmActionDialog
const model = defineModel<boolean>({ required: true });

defineProps<{
    detailText?: string;
    // TODO @andrei: avoid programmatic translation key generation:
    // - this is inflexible (translations need to have a certain shape)
    // - this mmakes it very hard to refactor translation keys (search and replace is impossible)
    // => accept fully translated strings instead
    translationKeyPrefix: string;
}>();

const emit = defineEmits<{
    confirm: [];
}>();
</script>
