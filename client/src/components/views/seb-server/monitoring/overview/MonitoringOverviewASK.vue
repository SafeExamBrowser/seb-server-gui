<template>
    <v-row>
        <!-- ASK keys -->
        <v-col cols="12">

                <v-card
                    class="rounded-lg px-2 py-2 d-flex align-center justify-space-between"
                    variant="flat"
                    :hover="true"
                    :ripple="false"
                    style="background-color: #f0f0f0;"
                    @click="openAskDialog()">


                    <div class="d-flex align-center">
                        <!-- Icon Box -->
                        <div
                            class="mr-3 d-flex align-center justify-center"
                            style="width: 52px; height: 52px; border-radius: 10px; padding: 8px; background-color: #f0f0f0"
                        >
                            <v-icon size="28" color="#000000">
                                mdi-shield-key-outline
                            </v-icon>
                        </div>

                        <div>
                            <div class="text-body-2 font-weight-bold text-grey-darken-1">
                                {{ translate('monitoringOverview.ask.askKey') }}
                            </div>
                            <div class="font-weight-bold text-body-1">
                                {{ translate("monitoringOverview.ask.askKeyInfo") }}
                            </div>
                        </div>
                    </div>

                    <v-avatar size="45" style="background-color: #BDBDBD;">
                        <span class="text-white text-subtitle-1 font-weight-bold">
                            {{ askKeyCount }}
                        </span>
                    </v-avatar>
                </v-card>

        </v-col>
    </v-row>
    <v-dialog v-model="askDialog" max-width="1200">
        <AskDialog
            :appSignatureKeys="appSignatureKeys"
            @closeAskDialog="closeAskDialog"
        />
    </v-dialog>

</template>


<script setup lang="ts">
import {useMonitoringStore} from "@/stores/seb-server/monitoringStore";
import {translate} from "@/utils/generalUtils";
import AskDialog from "@/components/views/seb-server/monitoring/overview/dialogs/AskDialog.vue";

//stores
const monitoringStore = useMonitoringStore();


//ASK key Dialog
const appSignatureKeys = computed<AppSignatureKey[]>(() => monitoringStore.appSignatureKeys ?? []);
const askDialog = ref<boolean>(false);

const askKeyCount = computed(() => appSignatureKeys.value?.length ?? 0);


function openAskDialog(){
    askDialog.value = true;
}
function closeAskDialog(){
    askDialog.value = false;
}

</script>

<style scoped>

</style>
