<template>
    <v-row>
        <v-col>
            <v-sheet 
                elevation="4"
                class="rounded-lg pa-8">

                <v-expansion-panels 
                    v-model="panels" 
                    multiple>

                    <!------notifications: raise hand panel------->
                    <v-expansion-panel class="rounded-lg">
                        <v-expansion-panel-title class="font-weight-bold">
                            Notifications
                        </v-expansion-panel-title>

                        <v-expansion-panel-text>
                            <v-row justify="center">
                                <v-col cols="12" lg="6">
                                    <v-card v-if="raiseHandNotification != null" elevation="4" class="rounded-lg pa-4" >
                                        <v-row align="center" justify="center">
                                            <v-col cols="1">
                                                <v-icon icon="mdi-hand-back-right"></v-icon>
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
                                                    @click="resolveRaiseHand()">
                                                    Resolve Raise Hand
                                                </v-btn>
                                            </v-col>
                                        </v-row>
                                    </v-card>
        
                                    <div v-else align="center"> 
                                        No notifications available
                                    </div>
                                </v-col>
                            </v-row>
                        </v-expansion-panel-text>
                    </v-expansion-panel>


                    <!------messages------->
                    <v-expansion-panel class="rounded-lg">
                        <v-expansion-panel-title class="font-weight-bold">
                            Messages
                        </v-expansion-panel-title>

                        <v-expansion-panel-text>
                            <v-row justify="center">
                                <v-col cols="12" lg="6">

                                    <template v-if="messages != null">

                                        <v-card v-for="message in messages" elevation="4" class="rounded-lg pa-4" >
                                            <v-row align="center" justify="center">
                                                <v-col cols="1">
                                                    <v-icon icon="mdi-hand-back-right"></v-icon>
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
                                                        @click="resolveLockScreen()">
                                                        Resolve Message
                                                    </v-btn>
                                                </v-col>
                                            </v-row>
                                        </v-card>

                                    </template>
        
                                    <div v-else align="center"> 
                                        No notifications available
                                    </div>
                                </v-col>
                            </v-row>
                        </v-expansion-panel-text>
                    </v-expansion-panel>


                    <!------screen proctoring------->
                    <v-expansion-panel class="rounded-lg">
                        <v-expansion-panel-title class="font-weight-bold">
                            Screen Proctoring
                        </v-expansion-panel-title>

                        <v-expansion-panel-text>
                            <ProctoringViewPage :session-id-prop="connectionToken"></ProctoringViewPage>
                        </v-expansion-panel-text>
                    </v-expansion-panel>


                    <!------logs------->
                    <v-expansion-panel class="rounded-lg">
                        <v-expansion-panel-title class="font-weight-bold">
                            Client Logs
                        </v-expansion-panel-title>

                        <v-expansion-panel-text>
                            test
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                    

                </v-expansion-panels>
            </v-sheet>
        </v-col>
    </v-row>

    
</template>

<script setup lang="ts">
    import { useMonitoringStore } from "@/stores/seb-server/monitoringStore";
    import * as monitoringViewService from "@/services/seb-server/component-services/monitoringViewService";
    import { NotificationEnum } from "@/models/seb-server/monitoringEnums";
    import { useDisplay } from "vuetify";
    import { InstructionEnum } from "@/models/seb-server/instructionEnum";


    //route params
    const examId = useRoute().params.examId.toString();
    const connectionToken = useRoute().params.connectionToken.toString();

    //ui control
    const panels = ref([0, 1]);
    const resolveRaiseHandSent = ref<boolean>(false);
    const resolveLockScreenSent = ref<boolean>(false);

    //stores
    const monitoringStore = useMonitoringStore();

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


    async function resolveRaiseHand(){
        resolveRaiseHandSent.value = true;

        const clientInstruction: ClientInstruction = {
            examId: parseInt(examId),
            connectionToken,
            type: InstructionEnum.NOTIFICATION_CONFIRM,
        }

        //send inctruction
        // monitoringViewService.registerInstruction(examId, clientInstruction);
    }

    async function resolveLockScreen(){
        resolveLockScreenSent.value = true;

        //create object
        const clientInstruction: ClientInstruction = {
            examId: parseInt(examId),
            connectionToken,
            type: InstructionEnum.NOTIFICATION_CONFIRM,
        }

        //send inctruction
        // monitoringViewService.registerInstruction(examId, clientInstruction);
    }





</script>

<style scoped>

</style>