<template>

    <!-- Raised Hand Popup  -->
    <v-row
        v-if="raiseHandNotification != null"
        elevation="4"
        class="rounded-lg pa-4 raise-hand-row mb-1"
        style="background-color: #FFFFFE; border: 2px solid #205caf;"
    >
        <v-row align="center" justify="center">
            <v-col cols="1">
                <v-icon class="ml-5" icon="mdi-hand-back-right" style="color: #205caf;"></v-icon>
            </v-col>
            <v-col>
                {{ raiseHandNotification.text }}
            </v-col>
            <v-col align="right">
                <v-btn
                    :loading="resolveRaiseHandSent"
                    rounded="sm"
                    color="primary"
                    variant="flat"
                    @click="confirmNotification(raiseHandNotification.id.toString())"
                >
                    {{ translate("monitoringDetails.main.resolveRaiseHand") }}
                </v-btn>
            </v-col>
        </v-row>
    </v-row>

    <!-- Messages -->
    <v-row>
        <v-col cols="12" class="mb-1">
            <template v-if="messages != null">
                <v-row
                    v-for="message in messages"
                    :key="message.id"
                    elevation="4"
                    class="rounded-lg pa-4 message-card"
                    style="background-color: #FFFFFE; border: 2px solid #205caf;"
                >
                    <v-row align="center" justify="center">
                        <v-col cols="1">
                            <v-icon icon="ml-5 mdi-monitor-lock" style="color: #205caf;"></v-icon>
                        </v-col>
                        <v-col>
                            {{ message.text }}
                        </v-col>
                        <v-col align="right">
                            <v-btn
                                :loading="resolveLockScreenSent"
                                rounded="sm"
                                color="primary"
                                variant="flat"
                                @click="confirmNotification(message.id.toString())"
                            >
                                {{ translate("monitoringDetails.main.unlockScreen") }}
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-row>
            </template>

            <div v-else align="center">
                {{ translate("monitoringDetails.main.noNotifications") }}
            </div>
        </v-col>
    </v-row>

    <v-row>
        <v-col>
            <div elevation="4" class="rounded-lg pr-4 pl-4" style="position: relative;">

                <!-- Top-right toggle -->
                <div class="d-flex justify-end mb-2">
                    <v-btn-toggle v-model="currentView" mandatory>
                        <v-btn value="proctoring" color="primary" size="small">
                            {{ translate("monitoringDetails.main.screenProctoring") }}
                        </v-btn>
                        <v-btn value="logs" color="primary" size="small">
                            {{ translate("monitoringDetails.main.clientLogs") }}
                        </v-btn>
                    </v-btn-toggle>
                </div>

                <!-- Proctoring view -->
                <div v-if="currentView === 'proctoring'" class="view-container">
                    <ProctoringViewPage :session-id-prop="connectionToken" />
                </div>

                <!-- Logs view -->
                <div v-else class="view-container">
                    <MonitoringClientLogsContainer>

                    </MonitoringClientLogsContainer>
                </div>

            </div>
        </v-col>
    </v-row>



</template>

<script setup lang="ts">
    import { useMonitoringStore } from "@/stores/seb-server/monitoringStore";
    import * as monitoringViewService from "@/services/seb-server/component-services/monitoringViewService";
    import { NotificationEnum } from "@/models/seb-server/monitoringEnums";
    import { useDisplay } from "vuetify";
    import { InstructionEnum } from "@/models/seb-server/instructionEnum";
    import {translate} from "@/utils/generalUtils";


    //route params
    const examId = useRoute().params.examId.toString();
    const connectionToken = useRoute().params.connectionToken.toString();

    //ui control
    const panels = ref([0, 1]);
    const resolveRaiseHandSent = ref<boolean>(false);
    const resolveLockScreenSent = ref<boolean>(false);

    //stores
    const monitoringStore = useMonitoringStore();

    //display main content
    const currentView = ref<'proctoring' | 'logs'>('proctoring');

    //display
    const {lg} = useDisplay();

    onMounted(() => {
        console.log(lg.value)
    });

    watch(lg, () => {
        console.log(lg.value)
    })


    const raiseHandNotification: ComputedRef<ClientNotification | null> = computed(() => {
        const raiseHand: ClientNotification | undefined = monitoringStore.pendingNotifications.find(item => item.notificationType == NotificationEnum.RAISE_HAND);
        if(raiseHand != null){
            resolveRaiseHandSent.value = false;
            return raiseHand;
        }

        return null;
    });

    const messages: ComputedRef<ClientNotification[] | null> = computed(() => {
        const messages: ClientNotification[] | undefined = monitoringStore.pendingNotifications.filter(item => item.notificationType != NotificationEnum.RAISE_HAND);
        if(messages != null){
            // notificationSent.value = false;
            return messages;
        }

        return null;
    });


    import { nextTick } from "vue";

    watch(raiseHandNotification, (newVal) => {
        if (newVal !== null) {
            scrollToTop();
        }
    });

    // Watch messages
    watch(messages, (newVal) => {
        if (newVal !== null && newVal.length > 0) {
            scrollToTop();
        }
    });

    function scrollToTop() {
        nextTick(() => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    async function confirmNotification(notificationId: string){
        monitoringViewService.confirmNotification(examId, notificationId, connectionToken);
    }



</script>

<style scoped>

</style>
