<template>
    <v-card
        variant="outlined"
        rounded="lg"
        hover
        :ripple="false"
        class="pa-3 d-flex align-center ga-3"
        @click="openAskDialog()"
    >
        <div
            class="d-flex align-center justify-center rounded-lg flex-shrink-0 border-thin bg-surface"
            :style="{ width: '42px', height: '42px' }"
        >
            <v-icon size="22">mdi-shield-key-outline</v-icon>
        </div>

        <div class="flex-grow-1" :style="{ minWidth: 0 }">
            <div class="text-body-2 font-weight-bold">
                {{ $t("monitoringOverview.ask.askKey") }}
            </div>
            <div class="text-caption text-medium-emphasis">
                {{ $t("monitoringOverview.ask.askKeyInfo") }}
            </div>
        </div>

        <v-avatar color="grey" size="34">
            <span class="text-white text-body-2 font-weight-bold">
                {{ askKeyCount }}
            </span>
        </v-avatar>
    </v-card>

    <v-dialog v-model="askDialog" max-width="1200">
        <AskDialog
            :app-signature-keys="appSignatureKeys"
            @close-ask-dialog="closeAskDialog"
        />
    </v-dialog>
</template>

<script setup lang="ts">
import { useMonitoringStore } from "@/stores/seb-server/monitoringStore.ts";
import AskDialog from "./dialogs/AskDialog.vue";
import { ref, computed } from "vue";
import { AppSignatureKeysWithGrantValues } from "@/models/seb-server/appSignatureKey.ts";

const monitoringStore = useMonitoringStore();

const appSignatureKeys = computed<AppSignatureKeysWithGrantValues[]>(
    () => monitoringStore.appSignatureKeys ?? [],
);
const askDialog = ref(false);
const askKeyCount = computed(() => appSignatureKeys.value?.length ?? 0);

function openAskDialog() {
    askDialog.value = true;
}
function closeAskDialog() {
    askDialog.value = false;
}
</script>
