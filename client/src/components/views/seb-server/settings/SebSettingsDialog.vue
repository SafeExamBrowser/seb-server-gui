<template>
    <v-card class="pa-5" max-width="1200">
        <v-row>
            <v-col>
                <v-row>
                    <v-toolbar color="transparent">
                        <v-toolbar-title
                            class="text-h6"
                            :text="translate(sebSettingsStore.dialogTitle)"
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
                    v-if="
                        sebSettingsStore.activeSEBClientConnection != null &&
                        sebSettingsStore.activeSEBClientConnection > 0
                    "
                    class="ml-5 mr-5"
                >
                    <v-card class="pa-5" color="indigo" variant="elevated">
                        {{ translate("examDetail.main.activeSEBClientsNote") }}
                    </v-card>
                </v-row>

                <SEBSettingsPanel />
            </v-col>
        </v-row>

        <v-row align="end">
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
                    :disabled="sebSettingsStore.readonly"
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
import { translate } from "@/utils/generalUtils";
import { useSEBSettingsStore } from "@/stores/seb-server/sebSettingsStore";
import SEBSettingsPanel from "@/components/views/seb-server/settings/composables/SEBSettingsPanel.vue";

const sebSettingsStore = useSEBSettingsStore();

const emit = defineEmits<{
    (e: "closeSebSettingsDialog", value: boolean): void;
}>();
</script>
