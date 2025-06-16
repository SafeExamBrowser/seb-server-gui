<template>
    <v-card>

        <v-toolbar color="transparent">
            <v-toolbar-title class="text-h6" :text="getTitle()"></v-toolbar-title>
            <template v-slot:append>
                <v-btn @click="emit('closeInstructionConfirmDialog')" icon="mdi-close"></v-btn>
            </template>
        </v-toolbar>

        <v-card-text>

            <!------------description------------->
            <v-row>
                <v-col>
                    {{getDescription()}}
                </v-col>
            </v-row>

            <!------------question confirm text (only for quit)------------->
            <v-row v-if="instructionType == InstructionEnum.SEB_QUIT">
                <v-col class="font-weight-bold">
                    {{getQuestionConfirmText()}}
                </v-col>
            </v-row>

            <!------------lock msg text field (only for lock)------------->
            <v-row v-if="instructionType == InstructionEnum.SEB_FORCE_LOCK_SCREEN">
                <v-col>
                    <v-textarea v-model="lockScreenText" label="Lock Message"></v-textarea>
                </v-col>
            </v-row>


            <!------------buttons------------->
            <v-row>
                <v-col align="right">
                    <v-btn 
                        rounded="sm" 
                        color="black" 
                        variant="outlined"
                        @click="emit('closeInstructionConfirmDialog')">
                        Cancel
                    </v-btn>

                    <v-btn 
                        rounded="sm" 
                        color="error" 
                        variant="flat" 
                        class="ml-2"
                        @click="isCancelInstruction ? cancelClients() : registerInstruction()">
                        {{getButtonText()}}
                    </v-btn>

                </v-col>
            </v-row>
        </v-card-text>
    </v-card> 
</template>


<script setup lang="ts">
    import { InstructionEnum } from "@/models/seb-server/instructionEnum";
    import * as monitoringViewService from "@/services/seb-server/component-services/monitoringViewService";

    //exam
    const examId = useRoute().params.examId.toString();

    //emits
    const emit = defineEmits<{
        closeInstructionConfirmDialog: any,
    }>();

    //props
    const props = defineProps<{
        instructionType: InstructionEnum | null,
        isCancelInstruction?: boolean,
        connectionTokens: string
    }>();

    //lock screen text
    const lockScreenText = ref<string>("");


    function getTitle(): string{
        if(props.instructionType == InstructionEnum.SEB_FORCE_LOCK_SCREEN){
            return "Lock SEB Clients";
        }

        if(props.instructionType == InstructionEnum.SEB_QUIT){
            return "Quit SEB Clients";
        }

        if(props.isCancelInstruction){
            return "Mark Clients as canceled";
        }

        return "";
    }

    function getDescription(): string{
        if(props.instructionType == InstructionEnum.SEB_FORCE_LOCK_SCREEN){
            return "This actions locks all selected SEB clients";
        }

        if(props.instructionType == InstructionEnum.SEB_QUIT){
            return "This actions quits all selected SEB clients";
        }

        if(props.isCancelInstruction){
            return "This actions marks all selected SEB clients as canceled";
        }

        return "";
    }

    function getQuestionConfirmText(): string{
        if(props.instructionType == InstructionEnum.SEB_QUIT){
            return "Are you sure to quit all selected SEB clients?";
        }

        return "";
    }

    function getButtonText(): string{
        if(props.instructionType == InstructionEnum.SEB_FORCE_LOCK_SCREEN){
            return "Lock";
        }

        if(props.instructionType == InstructionEnum.SEB_QUIT){
            return "Quit";
        }

        if(props.isCancelInstruction){
            return "Cancel"
        }
        
        return "";
    }


    //=================client instructions===================
    async function registerInstruction(){
        if(props.instructionType == null){
            return;
        }

        //create object
        const clientInstruction: ClientInstruction = {
            examId: parseInt(examId),
            connectionToken: props.connectionTokens,
            type: props.instructionType,
        }

        //add optional lock msg
        if(props.instructionType == InstructionEnum.SEB_FORCE_LOCK_SCREEN){
            clientInstruction.attributes = {
                "message": lockScreenText.value
            };
        }

        //send inctruction
        monitoringViewService.registerInstruction(examId, clientInstruction);

        emit("closeInstructionConfirmDialog");
    }

    async function cancelClients(){

        console.log("it got here")

        if(!props.isCancelInstruction){
            return;
        }

        //send disable (calcel) inctruction
        monitoringViewService.disableConnections(examId, props.connectionTokens)

        emit("closeInstructionConfirmDialog");
    }

</script>

<style scoped>



</style>