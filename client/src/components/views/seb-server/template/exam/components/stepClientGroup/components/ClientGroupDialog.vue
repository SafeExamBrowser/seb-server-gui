<template>
    <v-btn
        :icon="iconTrigger"
        :color="colorTrigger"
        variant="text"
        density="compact"
        :size="sizeTrigger"
        :title="labelTrigger"
        :aria-label="labelTrigger"
        @click="handleOpenDialog"
    ></v-btn>
    <v-dialog v-model="dialogOpen" width="auto" @close="handleCancel">
        <v-card :title="labelTrigger">
            <template #text>
                <ClientGroupForm v-model="temporaryClientGroup" />
            </template>
            <template #actions>
                <v-btn :text="labelCancel" @click="handleCancel"></v-btn>
                <v-btn :text="labelSubmit" @click="handleSubmit"></v-btn>
            </template>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { IconValue } from "vuetify/lib/composables/icons.mjs";
import { ClientGroup } from "@/components/views/seb-server/template/exam/components/stepClientGroup/types";

const props = defineProps<{
    iconTrigger: IconValue;
    colorTrigger: string;
    sizeTrigger?: string;
    labelTrigger: string;
    labelCancel: string;
    labelSubmit: string;
    clientGroup: ClientGroup;
}>();

const emit = defineEmits<{
    (e: "submit", clientGroup: ClientGroup): void;
}>();

const dialogOpen = ref(false);
const temporaryClientGroup = ref(props.clientGroup);

const handleOpenDialog = () => {
    dialogOpen.value = true;
};

const handleCancel = () => {
    dialogOpen.value = false;
    temporaryClientGroup.value = props.clientGroup;
};

const handleSubmit = () => {
    emit("submit", temporaryClientGroup.value);
    dialogOpen.value = false;
    temporaryClientGroup.value = props.clientGroup;
};
</script>
