<template>
    <v-card>
        <!-- Toolbar -->
        <v-toolbar color="transparent">
            <v-toolbar-title class="text-h6">App Signature Keys</v-toolbar-title>
            <template v-slot:append>
                <v-btn @click="emit('closeAskDialog')" icon="mdi-close"></v-btn>
            </template>
        </v-toolbar>

        <v-card-text>
            <!-- ASK Key List -->
            <v-expansion-panels multiple>
                <v-expansion-panel
                    v-for="(key, index) in appSignatureKeys"
                    :key="index"
                >
                    <v-expansion-panel-title>
                        <div class="d-flex flex-column">
                            <span class="text-subtitle-1 font-weight-medium">Key: {{ key.keyValue }}</span>
                            <span class="text-caption text-grey-darken-1">
                                  Institution ID: {{ key.institutionId }} |
                                  Exam ID: {{ key.examId }} |
                                  Connections: {{ Object.keys(key.connectionIds).length }}
                            </span>
                        </div>
                    </v-expansion-panel-title>

                    <v-expansion-panel-text>
                        <v-list density="compact">
                            <v-list-item
                                v-for="(name, connectionId) in key.connectionIds"
                                :key="connectionId"
                            >
                                <v-list-item-content>
                                    <v-list-item-title class="font-weight-bold">Connection ID: {{ connectionId }}</v-list-item-title>
                                    <v-list-item-subtitle>Name: {{ name }}</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-expansion-panel-text>
                </v-expansion-panel>
            </v-expansion-panels>
        </v-card-text>

        <!-- Actions -->
        <v-card-actions class="justify-end">
            <v-btn
                rounded="sm"
                color="black"
                variant="outlined"
                @click="emit('closeAskDialog')"
            >
                {{ translate("general.closeButton") }}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup lang="ts">
import { translate } from "@/utils/generalUtils";

defineProps<{
    appSignatureKeys: AppSignatureKey[];
}>();

const emit = defineEmits<{
    closeAskDialog: [];
}>();
</script>
