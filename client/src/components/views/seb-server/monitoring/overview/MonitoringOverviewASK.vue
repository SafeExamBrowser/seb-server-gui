<template>
    <v-row>
        <!-- ASK keys -->
        <v-col cols="12">
            <v-card
                :hover="true"
                :ripple="false"
                :style="askCardStyle"
                class="rounded-lg px-2 py-2 d-flex align-center justify-space-between"
                variant="flat"
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
                        "
                        :style="askIconBoxStyle"
                    >
                        <v-icon :color="askIconColor" size="28">
                            mdi-shield-key-outline
                        </v-icon>
                    </div>

                    <div>
                        <div
                            class="text-body-2 font-weight-bold text-grey-darken-1"
                        >
                            {{ translate("monitoringOverview.ask.askKey") }}
                        </div>
                        <div class="font-weight-bold text-body-1">
                            {{ translate("monitoringOverview.ask.askKeyInfo") }}
                        </div>
                    </div>
                </div>

                <v-avatar :color="askAvatarColor" size="45">
                    <span class="text-white text-subtitle-1 font-weight-bold">
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
import { useMonitoringStore } from "@/stores/seb-server/monitoringStore";
import { translate } from "@/utils/generalUtils";
import AskDialog from "@/components/views/seb-server/monitoring/overview/dialogs/AskDialog.vue";
import { ref, computed } from "vue";

// stores
const monitoringStore = useMonitoringStore();

// ASK key Dialog
const appSignatureKeys = computed<AppSignatureKeysWithGrantValues[]>(
    () => monitoringStore.appSignatureKeys ?? [],
);
const askDialog = ref<boolean>(false);

const askKeyCount = computed(() => appSignatureKeys.value?.length ?? 0);

const warnBg = "#FFF8E1";
const warnIcon = "#F9A825";
const neutralBg = "#f0f0f0";
const neutralIcon = "#000000";
const neutralAvatar = "#bdbdbd";

function openAskDialog() {
    askDialog.value = true;
}
function closeAskDialog() {
    askDialog.value = false;
}

const hasLowUngradedAsk = computed(() =>
    appSignatureKeys.value.some((ask) => {
        const count = Object.keys(ask.connectionIds ?? {}).length;
        return !ask.tag && count <= 3;
    }),
);
const askCardStyle = computed(() => ({
    backgroundColor: hasLowUngradedAsk.value ? warnBg : neutralBg,
}));

const askIconBoxStyle = computed(() => ({
    width: "52px",
    height: "52px",
    borderRadius: "10px",
    padding: "8px",
    backgroundColor: hasLowUngradedAsk.value ? warnBg : neutralBg,
}));

const askIconColor = computed(() =>
    hasLowUngradedAsk.value ? warnIcon : neutralIcon,
);

const askAvatarColor = computed(() =>
    hasLowUngradedAsk.value ? warnIcon : neutralAvatar,
);
</script>

<style scoped></style>
