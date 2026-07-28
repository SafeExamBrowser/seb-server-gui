<template>
    <v-dialog v-model="open" height="80vh" max-width="1200">
        <v-card class="pa-5" max-width="1200">
            <v-row>
                <v-col>
                    <v-row>
                        <v-toolbar color="transparent">
                            <v-toolbar-title
                                class="text-title-large"
                                :text="translate(props.dialogTitle)"
                            ></v-toolbar-title>
                            <template #append>
                                <v-btn
                                    icon="mdi-close"
                                    @click="handleCancelClick"
                                ></v-btn>
                            </template>
                        </v-toolbar>
                    </v-row>
                    <v-row
                        v-if="props.activeSEBClientConnection > 0"
                        class="ml-5 mr-5"
                    >
                        <v-card class="pa-5" color="indigo" variant="elevated">
                            {{
                                translate(
                                    "examDetail.main.activeSEBClientsNote",
                                )
                            }}
                        </v-card>
                    </v-row>

                    <SEBSettingsPanel :context="props.context" />
                </v-col>
            </v-row>

            <v-row class="align-end">
                <v-col align="right">
                    <v-btn
                        color="black"
                        rounded="sm"
                        variant="outlined"
                        @click="handleCancelClick"
                    >
                        {{ translate("general.cancelButton") }}
                    </v-btn>

                    <v-btn
                        class="ml-2"
                        color="primary"
                        :disabled="context.readonly"
                        rounded="sm"
                        variant="flat"
                        @click="handleSaveClick"
                    >
                        {{ translate("general.saveButton") }}
                    </v-btn>
                </v-col>
            </v-row>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { watch } from "vue";

import * as sebSettingsService from "@/services/seb-server/sebSettingsService.ts";
import { translate } from "@/utils/generalUtils.ts";

import SEBSettingsPanel from "./components/SEBSettingsPanel.vue";
import { SEBSettingsContext } from "./types.ts";

const props = defineProps<{
    context: SEBSettingsContext;
    dialogTitle: string;
    activeSEBClientConnection: number;
}>();

const open = defineModel<boolean>({ required: true });

let closedByButton = false;

const closeDialog = async (apply: boolean) => {
    closedByButton = true;
    open.value = false;

    if (apply) {
        await sebSettingsService.publish(
            props.context.containerId,
            props.context.isExam,
        );
        return;
    }

    await sebSettingsService.undoChanges(
        props.context.containerId,
        props.context.isExam,
    );
};

const handleCancelClick = () => {
    closeDialog(false);
};

const handleSaveClick = () => {
    closeDialog(true);
};

// closing via esc or backdrop click only updates the model, so treat it as cancel
watch(open, (isOpen) => {
    if (isOpen) {
        closedByButton = false;
        return;
    }

    if (closedByButton) {
        return;
    }

    sebSettingsService.undoChanges(
        props.context.containerId,
        props.context.isExam,
    );
});
</script>
