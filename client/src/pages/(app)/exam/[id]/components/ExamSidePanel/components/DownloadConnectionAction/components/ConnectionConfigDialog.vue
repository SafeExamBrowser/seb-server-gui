<template>
    <v-dialog v-model="model" max-width="500">
        <v-card>
            <v-card-title class="text-title-large font-weight-bold">
                {{ $t("examDetail.sidePanel.connectionDialog.title") }}
            </v-card-title>

            <v-card-text>
                {{ $t("examDetail.sidePanel.connectionDialog.text") }}

                <v-select
                    v-model="selectedConnectionId"
                    class="mt-4"
                    density="compact"
                    hide-details
                    item-title="name"
                    item-value="id"
                    :items="connectionConfigurations"
                    variant="outlined"
                />
            </v-card-text>

            <v-card-actions class="justify-end">
                <v-btn variant="text" @click="handleCancel">
                    {{ $t("general.cancelButton") }}
                </v-btn>

                <v-btn
                    color="primary"
                    :disabled="selectedConnectionId === undefined"
                    variant="text"
                    @click="handleConfirm"
                >
                    {{ $t("general.downloadButton") }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

import { ConnectionConfiguration } from "@/models/seb-server/connectionConfiguration.ts";

const model = defineModel<boolean>({ required: true });

const props = defineProps<{
    connectionConfigurations: ConnectionConfiguration[];
}>();

const emit = defineEmits<{
    confirm: [connectionId: number];
}>();

const selectedConnectionId = ref<number>();

watch(
    () => props.connectionConfigurations,
    (configurations) => {
        selectedConnectionId.value = configurations[0]?.id;
    },
    { immediate: true },
);

const handleCancel = () => {
    model.value = false;
};

const handleConfirm = () => {
    if (selectedConnectionId.value === undefined) {
        return;
    }

    model.value = false;
    emit("confirm", selectedConnectionId.value);
};
</script>
