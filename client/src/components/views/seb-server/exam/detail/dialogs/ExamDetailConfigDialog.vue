<template>
    <v-card>
        <v-toolbar color="transparent">
            <v-toolbar-title
                class="text-h6"
                text="Select Connection Configuration"
            ></v-toolbar-title>
            <template #append>
                <v-btn
                    icon="mdi-close"
                    @click="emit('closeConfigDialog')"
                ></v-btn>
            </template>
        </v-toolbar>

        <v-card-text>
            <v-row>
                <v-col>
                    Please select the Connection Configuration you want to use
                    for starting this exam and click OK to start the download.
                </v-col>
            </v-row>

            <v-row>
                <v-col>
                    <v-select
                        v-model="connectionConfigSelect"
                        density="compact"
                        hide-details
                        item-title="name"
                        item-value="id"
                        :items="props.connectionConfigurations.content"
                        variant="outlined"
                    >
                    </v-select>
                </v-col>
            </v-row>

            <v-row>
                <v-col align="right">
                    <v-btn
                        color="black"
                        rounded="sm"
                        variant="outlined"
                        @click="emit('closeConfigDialog')"
                    >
                        Cancel
                    </v-btn>

                    <v-btn
                        class="ml-2"
                        color="primary"
                        :disabled="connectionConfigSelect == null"
                        rounded="sm"
                        variant="flat"
                        @click="confirmSelection()"
                    >
                        OK
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { useExamStore } from "@/stores/seb-server/examStore";
import * as userAccountViewService from "@/services/seb-server/component-services/userAccountViewService";
import * as tableUtils from "@/utils/table/tableUtils";

// emits
const emit = defineEmits<{
    closeConfigDialog: [];
    downloadExamConfig: [connectionId: string];
}>();

// props
const props = defineProps<{
    connectionConfigurations: ConnectionConfigurations;
}>();

const connectionConfigSelect = ref<number>();

//= ======================events & watchers=======================
function confirmSelection() {
    if (connectionConfigSelect.value != null) {
        emit("downloadExamConfig", connectionConfigSelect.value.toString());
    }
}
</script>

<style scoped></style>
