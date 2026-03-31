<template>
    <v-dialog v-model="model" max-width="500">
        <v-card>
            <v-card-title class="text-h6 font-weight-bold">
                {{ $t(`${translationKeyPrefix}.deleteDialog.title`) }}
            </v-card-title>

            <v-card-text>
                {{ $t(`${translationKeyPrefix}.deleteDialog.text`) }}

                <div class="mt-4 text-primary font-weight-medium">
                    {{ targetRoute }}
                </div>
            </v-card-text>

            <v-card-actions class="justify-end">
                <v-btn variant="text" @click="model = false">
                    {{ $t("general.cancelButton") }}
                </v-btn>

                <v-btn color="red" variant="text" @click="emit('confirm')">
                    {{ $t(`${translationKeyPrefix}.deleteDialog.action`) }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
const model = defineModel<boolean>({ required: true });

defineProps<{
    targetRoute: string;
    translationKeyPrefix: string;
}>();

const emit = defineEmits<{
    confirm: [];
}>();
</script>
