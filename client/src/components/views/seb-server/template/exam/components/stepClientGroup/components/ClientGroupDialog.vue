<template>
    <v-btn
        ref="activatorRef"
        :icon="iconActivator"
        :color="colorActivator"
        variant="text"
        density="compact"
        :size="sizeActivator"
        :title="labelActivator"
        :aria-label="labelActivator"
    ></v-btn>
    <v-dialog
        v-model="isDialogOpen"
        :activator="activatorRef"
        :max-width="useDisplay().thresholds.value.sm"
    >
        <v-card :title="labelActivator">
            <template #text>
                <ClientGroupForm v-model="temporaryClientGroup" />
            </template>
            <template #actions>
                <v-btn :text="labelCancel" @click="handleCancelClick"></v-btn>
                <v-btn
                    :text="labelSubmit"
                    :disabled="!temporaryClientGroup.isValid"
                    @click="handleSubmitClick"
                ></v-btn>
            </template>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { IconValue } from "vuetify/lib/composables/icons.mjs";
import {
    ClientGroup,
    ClientGroupTransient,
    clientGroupTransientToClientGroup,
} from "@/components/views/seb-server/template/exam/components/stepClientGroup/types";
import { useDisplay } from "vuetify";

const props = defineProps<{
    iconActivator: IconValue;
    colorActivator: string;
    sizeActivator?: string;
    labelActivator: string;
    labelCancel: string;
    labelSubmit: string;
    getClientGroup: () => ClientGroupTransient;
}>();

const emit = defineEmits<{
    (e: "submit", clientGroup: ClientGroup): void;
}>();

const activatorRef = ref<HTMLElement>();
const isDialogOpen = ref(false);
const temporaryClientGroup = ref(props.getClientGroup());

watch(isDialogOpen, (newValue) => {
    if (!newValue) {
        // side effect: reset the temporary client group whenever the dialog is closed
        temporaryClientGroup.value = props.getClientGroup();
    }
});

const handleCancelClick = () => {
    isDialogOpen.value = false;
};

const handleSubmitClick = () => {
    const clientGroup = clientGroupTransientToClientGroup(
        temporaryClientGroup.value,
    );
    emit("submit", clientGroup);
    isDialogOpen.value = false;
};
</script>
