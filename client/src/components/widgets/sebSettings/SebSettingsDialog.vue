<template>
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
                                @click="emit('closeSebSettingsDialog', false)"
                            ></v-btn>
                        </template>
                    </v-toolbar>
                </v-row>
                <v-row
                    v-if="props.activeSEBClientConnection > 0"
                    class="ml-5 mr-5"
                >
                    <v-card class="pa-5" color="indigo" variant="elevated">
                        {{ translate("examDetail.main.activeSEBClientsNote") }}
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
                    @click="emit('closeSebSettingsDialog', false)"
                >
                    {{ translate("general.cancelButton") }}
                </v-btn>

                <v-btn
                    class="ml-2"
                    color="primary"
                    :disabled="context.readonly"
                    rounded="sm"
                    variant="flat"
                    @click="emit('closeSebSettingsDialog', true)"
                >
                    {{ translate("general.saveButton") }}
                </v-btn>
            </v-col>
        </v-row>
    </v-card>
</template>

<script setup lang="ts">
import { translate } from "@/utils/generalUtils.ts";

import SEBSettingsPanel from "./components/SEBSettingsPanel.vue";
import { SEBSettingsContext } from "./types.ts";

const props = defineProps<{
    context: SEBSettingsContext;
    dialogTitle: string;
    activeSEBClientConnection: number;
}>();

const emit = defineEmits<{
    (e: "closeSebSettingsDialog", value: boolean): void;
}>();
</script>
