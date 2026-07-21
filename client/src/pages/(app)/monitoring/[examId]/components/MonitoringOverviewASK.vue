<template>
    <v-card
        ref="launcherRef"
        link
        border
        color="background"
        rounded="lg"
        class="pa-3 d-flex align-center ga-3"
        role="button"
        tabindex="0"
        aria-haspopup="dialog"
        :aria-label="askButtonLabel"
        @click="openAskDialog()"
        @keydown="handleActivate"
    >
        <v-avatar color="surface" size="42" rounded="lg" border>
            <v-icon size="22">mdi-shield-key-outline</v-icon>
        </v-avatar>

        <div class="flex-grow-1">
            <div class="text-body-medium font-weight-bold">
                {{ $t("monitoringOverview.ask.askKey") }}
            </div>
            <div class="text-body-small text-medium-emphasis">
                {{ $t("monitoringOverview.ask.askKeyInfo") }}
            </div>
        </div>

        <v-avatar color="grey" size="34">
            <span class="text-body-medium font-weight-bold text-white">
                {{ askKeyCount }}
            </span>
        </v-avatar>
    </v-card>

    <v-dialog
        v-model="askDialog"
        max-width="1200"
        @after-leave="restoreLauncherFocus"
    >
        <AskDialog
            :app-signature-keys="appSignatureKeys"
            @close-ask-dialog="closeAskDialog"
        />
    </v-dialog>
</template>

<script setup lang="ts">
import { type ComponentPublicInstance, computed, ref } from "vue";
import { useI18n } from "vue-i18n";

import { AppSignatureKeysWithGrantValues } from "@/models/seb-server/appSignatureKey.ts";
import { useMonitoringStore } from "@/stores/seb-server/monitoringStore.ts";

import AskDialog from "./dialogs/AskDialog.vue";

const monitoringStore = useMonitoringStore();
const { t } = useI18n();

const launcherRef = ref<ComponentPublicInstance>();

const appSignatureKeys = computed<AppSignatureKeysWithGrantValues[]>(
    () => monitoringStore.appSignatureKeys ?? [],
);
const askDialog = ref(false);
const askKeyCount = computed(() => appSignatureKeys.value?.length ?? 0);

const askButtonLabel = computed(
    () => `${t("monitoringOverview.ask.askKey")}: ${askKeyCount.value}`,
);

function openAskDialog() {
    askDialog.value = true;
}
function closeAskDialog() {
    askDialog.value = false;
}
// The dialog has no activator, so Vuetify can't restore focus on close.
// Return focus to the launcher card after it finishes closing (also on Esc).
function restoreLauncherFocus() {
    const el = launcherRef.value?.$el;
    if (el instanceof HTMLElement) {
        el.focus();
    }
}
function handleActivate(event: KeyboardEvent) {
    if (event.key !== "Enter" && event.key !== " ") {
        return;
    }
    event.preventDefault();
    openAskDialog();
}
</script>
