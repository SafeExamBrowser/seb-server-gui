<template>
    <v-card>
        <v-toolbar color="transparent">
            <v-toolbar-title
                class="text-h6"
                :text="getTitle()"
            ></v-toolbar-title>
            <template #append>
                <v-btn
                    icon="mdi-close"
                    @click="emit('closeInstructionConfirmDialog')"
                ></v-btn>
            </template>
        </v-toolbar>

        <v-card-text>
            <!------------description------------->
            <v-row>
                <v-col>
                    {{ getDescription() }}
                </v-col>
            </v-row>

            <!------------question confirm text (only for quit)------------->
            <v-row v-if="instructionType == InstructionEnum.SEB_QUIT">
                <v-col class="font-weight-bold">
                    {{ getQuestionConfirmText() }}
                </v-col>
            </v-row>

            <!------------lock msg text field (only for lock)------------->
            <v-row
                v-if="instructionType == InstructionEnum.SEB_FORCE_LOCK_SCREEN"
            >
                <v-col>
                    <v-textarea
                        v-model="lockScreenText"
                        label="Lock Message"
                    ></v-textarea>
                </v-col>
            </v-row>

            <!------------buttons------------->
            <v-row>
                <v-col align="right">
                    <v-btn
                        color="black"
                        rounded="sm"
                        variant="outlined"
                        @click="emit('closeInstructionConfirmDialog')"
                    >
                        {{
                            translate(
                                "monitoringDialog.instructionConfirm.cancel",
                            )
                        }}
                    </v-btn>

                    <v-btn
                        class="ml-2"
                        color="error"
                        rounded="sm"
                        variant="flat"
                        @click="
                            isCancelInstruction
                                ? cancelClients()
                                : registerInstruction()
                        "
                    >
                        {{ getButtonText() }}
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { InstructionEnum } from "@/models/seb-server/instructionEnum";
import * as monitoringViewService from "@/services/seb-server/component-services/monitoringViewService";
import { translate } from "@/utils/generalUtils";
import { useRoute } from "vue-router";
import { ref } from "vue";
import { ClientInstruction } from "@/models/seb-server/clientInstruction";

// exam
const examId = useRoute().params.examId.toString();

// emits
const emit = defineEmits<{
    (e: "closeInstructionConfirmDialog"): void;
}>();

// props
const props = defineProps<{
    instructionType: InstructionEnum | null;
    isCancelInstruction?: boolean;
    connectionTokens: string;
}>();

// lock screen text
const lockScreenText = ref<string>("");

function getTitle(): string {
    if (props.instructionType === InstructionEnum.SEB_FORCE_LOCK_SCREEN) {
        return translate("monitoringDialog.instructionConfirm.lockSeb");
    }

    if (props.instructionType === InstructionEnum.SEB_QUIT) {
        return translate("monitoringDialog.instructionConfirm.quitSeb");
    }

    if (props.isCancelInstruction) {
        return translate("monitoringDialog.instructionConfirm.cancelSeb");
    }

    return "";
}

function getDescription(): string {
    if (props.instructionType === InstructionEnum.SEB_FORCE_LOCK_SCREEN) {
        return translate("monitoringDialog.instructionConfirm.lockAction");
    }

    if (props.instructionType === InstructionEnum.SEB_QUIT) {
        return translate("monitoringDialog.instructionConfirm.quitAction");
    }

    if (props.isCancelInstruction) {
        return translate("monitoringDialog.instructionConfirm.cancelAction");
    }

    return "";
}

function getQuestionConfirmText(): string {
    if (props.instructionType === InstructionEnum.SEB_QUIT) {
        return translate("monitoringDialog.instructionConfirm.quitQuestion");
    }

    return "";
}

function getButtonText(): string {
    if (props.instructionType === InstructionEnum.SEB_FORCE_LOCK_SCREEN) {
        return translate("monitoringDialog.instructionConfirm.lock");
    }

    if (props.instructionType === InstructionEnum.SEB_QUIT) {
        return translate("monitoringDialog.instructionConfirm.quit");
    }

    if (props.isCancelInstruction) {
        return translate("monitoringDialog.instructionConfirm.markCancel");
    }

    return "";
}

//= ================client instructions===================
async function registerInstruction() {
    if (props.instructionType == null) {
        return;
    }

    // create object
    const clientInstruction: ClientInstruction = {
        examId: parseInt(examId),
        connectionToken: props.connectionTokens,
        type: props.instructionType,
    };

    // add optional lock msg
    if (props.instructionType === InstructionEnum.SEB_FORCE_LOCK_SCREEN) {
        clientInstruction.attributes = {
            message: lockScreenText.value,
        };
    }

    // send instruction
    await monitoringViewService.registerInstruction(examId, clientInstruction);
    emit("closeInstructionConfirmDialog");
}

async function cancelClients() {
    if (!props.isCancelInstruction) {
        return;
    }

    // send disable (calcel) inctruction
    monitoringViewService.disableConnections(examId, props.connectionTokens);

    emit("closeInstructionConfirmDialog");
}
</script>

<style scoped></style>
