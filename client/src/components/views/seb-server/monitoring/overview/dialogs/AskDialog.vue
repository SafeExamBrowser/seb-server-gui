<template>
    <v-card>
        <v-toolbar color="transparent">
            <v-toolbar-title class="text-h6">App Signature Keys</v-toolbar-title>
            <template #append>
                <v-btn @click="emit('closeAskDialog')" icon="mdi-close" />
            </template>
        </v-toolbar>

        <v-card-text>
            <v-expansion-panels multiple>
                <v-expansion-panel v-for="(ask, index) in askEnriched" :key="index">
                    <v-expansion-panel-title>
                        <div class="d-flex flex-column">
              <span class="text-subtitle-1 font-weight-medium">
                Key: {{ ask.keyValue }}
              </span>
                            <span class="text-caption text-grey-darken-1">
                Institution ID: {{ ask.institutionId }} |
                Exam ID: {{ ask.examId }} |
                Connections: {{ ask.entries.length }}
              </span>
                        </div>
                    </v-expansion-panel-title>

                    <v-expansion-panel-text>
                        <v-list density="compact">
                            <v-list-item v-for="entry in ask.entries" :key="entry.id">
                                <v-list-item-content>
                                    <v-list-item-title class="font-weight-bold">
                                        Connection ID: {{ entry.id }}
                                    </v-list-item-title>
                                    <v-list-item-subtitle>
                                        Name: {{ entry.name }}
                                    </v-list-item-subtitle>

                                    <!-- Extra details from SebClientConnection -->
                                    <div v-if="entry.conn" class="mt-1">
                                        <div>Status: {{ entry.conn.status }}</div>

                                        <div>SEB Info: {{ entry.conn.seb_info }}</div>
                                        <div>Client Address: {{ entry.conn.clientAddress }}</div>
                                        <div>Client OS: {{ entry.conn.clientOsName }}</div>
                                        <div>Client Version: {{ entry.conn.clientVersion }}</div>
                                    </div>
                                    <div v-else class="mt-1 text-grey">
                                        (No connection details found)
                                    </div>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-expansion-panel-text>
                </v-expansion-panel>
            </v-expansion-panels>
        </v-card-text>

        <v-card-actions class="justify-end">
            <v-btn rounded="sm" color="black" variant="outlined" @click="emit('closeAskDialog')">
                {{ translate("general.closeButton") }}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useMonitoringStore } from "@/stores/seb-server/monitoringStore";
import { translate } from "@/utils/generalUtils";

const store = useMonitoringStore();
const emit = defineEmits<{ closeAskDialog: [] }>();

const askEnriched = computed(() => {
    const keys = store.appSignatureKeys ?? [];
    const byId = store.clientConnectionsById;

    return keys.map((ask) => {
        const entries = Object.entries(ask.connectionIds ?? {}).map(([idStr, name]) => {
            const id = Number(idStr);
            return { id, name, conn: byId[id] };
        });
        return { ...ask, entries };
    });
});
</script>
