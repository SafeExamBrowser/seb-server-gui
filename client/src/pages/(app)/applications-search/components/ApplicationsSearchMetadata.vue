<template>
    <v-card border rounded="lg" class="overflow-hidden">
        <!------------ exam header ------------->
        <div
            class="d-flex align-center flex-wrap ga-3 px-5 py-4 bg-blue-lighten-5"
        >
            <span class="text-subtitle-1 font-weight-bold">
                {{ examObject.exam.name }}
            </span>
            <v-spacer />
            <span class="text-body-2 text-medium-emphasis">
                {{
                    timeUtils.formatTimestampToFullDate(
                        examObject.exam.startTime,
                    )
                }}
            </span>
        </div>
        <v-divider />

        <!------------ application accordion ------------->
        <div class="pa-3">
            <v-expansion-panels v-model="panels" multiple>
                <v-expansion-panel
                    v-for="metadataApp in examObject.metadataAppList"
                    :key="metadataApp"
                    class="rounded-lg mb-2"
                    :value="metadataApp"
                >
                    <v-expansion-panel-title class="font-weight-bold">
                        {{ metadataApp }}
                    </v-expansion-panel-title>

                    <v-expansion-panel-text>
                        <ApplicationsSearchWindowTitle
                            :group-ids="examObject.groupIds"
                            :metadata-app="metadataApp"
                        />
                    </v-expansion-panel-text>
                </v-expansion-panel>
            </v-expansion-panels>
        </div>
    </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
    VCard,
    VDivider,
    VExpansionPanel,
    VExpansionPanels,
    VExpansionPanelText,
    VExpansionPanelTitle,
    VSpacer,
} from "vuetify/components";

import type { ExamMetadataObject } from "@/pages/(app)/applications-search/types";
import * as timeUtils from "@/utils/timeUtils";

import ApplicationsSearchWindowTitle from "./ApplicationsSearchWindowTitle.vue";

// props
defineProps<{
    examObject: ExamMetadataObject;
}>();

// ui control
const panels = ref<string[]>([]);
</script>
