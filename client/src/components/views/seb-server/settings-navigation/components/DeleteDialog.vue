<template>
    <v-dialog v-model="model" max-width="500">
        <v-card>
            <v-card-title class="text-h6 font-weight-bold">
                Delete item
            </v-card-title>

            <v-card-text>
                Are you sure you want to delete this item?

                <div class="mt-4 text-primary font-weight-medium">
                    {{ targetRoute }}
                </div>
            </v-card-text>

            <v-card-actions class="justify-end">
                <v-btn variant="text" @click="model = false">
                    {{ $t("general.cancelButton") }}
                </v-btn>

                <v-btn color="red" variant="text" @click="emit('confirm')">
                    {{ $t("general.deleteButton") }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
const model = defineModel<boolean>({ required: true });

defineProps<{
    targetRoute: string;
}>();

const emit = defineEmits<{
    confirm: [];
}>();
</script>
