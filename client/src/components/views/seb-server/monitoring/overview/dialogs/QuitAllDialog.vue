<template>
    <v-card width="600">
        <v-toolbar color="transparent">
            <v-toolbar-title
                class="text-h6"
                :text="translate('monitoringOverview.quitAll.title')"
            ></v-toolbar-title>
            <template #append>
                <v-btn
                    icon="mdi-close"
                    @click="emit('closeQuitAllDialog', 'NO')"
                ></v-btn>
            </template>
        </v-toolbar>

        <v-card-text class="pl-10">
            <v-row>
                <div>
                    {{ translate("monitoringOverview.quitAll.confirmText1") }}
                </div>
                <div>
                    {{ translate("monitoringOverview.quitAll.confirmText2") }}
                </div>
            </v-row>

            <!------------Input------------->
            <v-row>
                <v-text-field
                    v-model="quitAllConfirmText"
                    class="pa-10"
                    density="compact"
                    variant="outlined"
                    hide-details
                >
                </v-text-field>
            </v-row>

            <!------------Buttons------------->
            <v-row align="center">
                <v-col align="right">
                    <v-btn
                        color="black"
                        rounded="sm"
                        variant="outlined"
                        @click="emit('closeQuitAllDialog', 'NO')"
                    >
                        {{ translate("general.cancelButton") }}
                    </v-btn>

                    <v-btn
                        class="ml-2"
                        color="primary"
                        rounded="sm"
                        variant="flat"
                        @click="emit('closeQuitAllDialog', quitAllConfirmText)"
                    >
                        {{ translate("monitoringOverview.quitAll.doQuit") }}
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { translate } from "@/utils/generalUtils";
import { ref } from "vue";

const emit = defineEmits<{
    (e: "closeQuitAllDialog", value: string): void;
}>();

const quitAllConfirmText = ref<string>("");
</script>
