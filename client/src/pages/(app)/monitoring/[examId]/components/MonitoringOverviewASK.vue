<template>
    <v-row>
        <!-- ASK keys -->
        <v-col cols="12">
            <v-card
                :hover="true"
                :ripple="false"
                class="rounded-lg px-2 py-2 d-flex align-center justify-space-between"
                variant="flat"
                style="background-color: #f0f0f0"
                @click="openAskDialog()"
            >
                <div class="d-flex align-center">
                    <!-- Icon Box -->
                    <div
                        class="mr-3 d-flex align-center justify-center"
                        style="
                            width: 52px;
                            height: 52px;
                            border-radius: 10px;
                            padding: 8px;
                            background-color: #f0f0f0;
                        "
                    >
                        <v-icon color="#000000" size="28">
                            mdi-shield-key-outline
                        </v-icon>
                    </div>

                    <div>
                        <div
                            class="text-body-medium font-weight-bold text-grey-darken-1"
                        >
                            {{ translate("monitoringOverview.ask.askKey") }}
                        </div>
                        <div class="font-weight-bold text-body-large">
                            {{ translate("monitoringOverview.ask.askKeyInfo") }}
                        </div>
                    </div>
                </div>

                <v-avatar color="#bdbdbd" size="45">
                    <span class="text-white text-body-large font-weight-bold">
                        {{ askKeyCount }}
                    </span>
                </v-avatar>
            </v-card>
        </v-col>
    </v-row>

    <v-dialog v-model="askDialog" max-width="1200">
        <AskDialog
            :app-signature-keys="appSignatureKeys"
            @close-ask-dialog="closeAskDialog"
        />
    </v-dialog>
</template>

<script setup lang="ts">
import { useMonitoringStore } from "@/stores/seb-server/monitoringStore.ts";
import { translate } from "@/utils/generalUtils.ts";
import AskDialog from "../components/dialogs/AskDialog.vue";
import { ref, computed } from "vue";
import { AppSignatureKeysWithGrantValues } from "@/models/seb-server/appSignatureKey.ts";

// stores
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

<style scoped></style>
