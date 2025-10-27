<template>
    <div class="mb-6">
        Total Amount of Screenshots: {{ metadataWindows?.totalAmount }}
    </div>

    <v-data-iterator
        :items="metadataWindowsObjectList"
        :items-per-page="pageSize"
        :search="search"
    >
        <template #header>
            <v-row>
                <v-col cols="2">
                    <v-text-field
                        v-model="search"
                        class="mb-6"
                        clearable
                        density="comfortable"
                        hide-details
                        placeholder="Search"
                        prepend-inner-icon="mdi-magnify"
                        style="max-width: 300px"
                        variant="solo"
                    >
                    </v-text-field>
                </v-col>
                <v-col> </v-col>
            </v-row>
        </template>

        <template #default="{ items }">
            <v-expansion-panels v-model="panels" multiple>
                <v-expansion-panel
                    v-for="metadataWindow in items"
                    :key="metadataWindow.raw.title"
                    class="rounded-lg"
                    :value="metadataWindow.raw.title"
                >
                    <v-expansion-panel-title
                        class="font-weight-bold panel-styling"
                    >
                        {{ metadataWindow.raw.title }}
                    </v-expansion-panel-title>

                    <v-expansion-panel-text class="panel-styling">
                        <ApplicationsSearchUserList
                            :group-ids="groupIds"
                            :metadata-app="metadataApp"
                            :metadata-window="metadataWindow.raw.title"
                        >
                        </ApplicationsSearchUserList>
                    </v-expansion-panel-text>
                </v-expansion-panel>
            </v-expansion-panels>
        </template>

        <template #footer="{ page, pageCount, prevPage, nextPage }">
            <div class="d-flex align-center justify-center pa-4">
                <v-btn
                    density="comfortable"
                    :disabled="page === 1"
                    icon="mdi-arrow-left"
                    rounded
                    variant="tonal"
                    @click="prevPage"
                >
                </v-btn>

                <div class="mx-2">Page {{ page }} of {{ pageCount }}</div>

                <v-btn
                    class="mx-2"
                    density="comfortable"
                    :disabled="page >= pageCount"
                    icon="mdi-arrow-right"
                    rounded
                    variant="tonal"
                    @click="nextPage"
                >
                </v-btn>

                <div class="mx-2">Items per page:</div>

                <v-text-field
                    v-model="pageSize"
                    class="mx-2 centered-text-input"
                    density="compact"
                    hide-details
                    style="max-width: 70px"
                    variant="outlined"
                >
                </v-text-field>
            </div>
        </template>
    </v-data-iterator>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import * as applicationsSearchViewService from "@/services/screen-proctoring/component-services/applicationsSearchViewService";
import * as generalUtils from "@/utils/generalUtils";
import ApplicationsSearchUserList from "./ApplicationsSearchUserList.vue";
import { DistinctMetadataWindowForExamRecord } from "@/models/screen-proctoring/applicationSearch";

// props
const props = defineProps<{
    metadataApp: string;
    groupIds: number[];
}>();

// ui control
const panels = ref<string[]>([]);

// main data
const metadataWindows = ref<DistinctMetadataWindowForExamRecord>();
const metadataWindowsObjectList = ref<{ title: string }[]>([]);

// local search
const search = ref<string>();
const pageSize = ref<number>(50);

onBeforeMount(async () => {
    const metadataWindowsLocal: DistinctMetadataWindowForExamRecord | null =
        await applicationsSearchViewService.getDistinctMetadataWindowForExam(
            generalUtils.createStringCommaList(props.groupIds),
            props.metadataApp,
        );

    if (metadataWindowsLocal == null) {
        // todo: add error handling
        return;
    }

    metadataWindows.value = metadataWindowsLocal;
    createMetadataWindowsObjectList();
});

// v-data-iterator requires items to be stored in an object list
function createMetadataWindowsObjectList() {
    if (metadataWindows.value?.distinctWindowTitles == null) {
        return;
    }

    for (
        let i = 0;
        i < metadataWindows.value?.distinctWindowTitles.length;
        i++
    ) {
        metadataWindowsObjectList.value.push({
            title: metadataWindows.value?.distinctWindowTitles[i],
        });
    }
}
</script>

<style scoped>
.centered-text-input :deep(input) {
    text-align: center;
}
</style>
