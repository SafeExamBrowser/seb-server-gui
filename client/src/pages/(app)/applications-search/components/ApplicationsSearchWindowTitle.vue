<template>
    <div class="text-body-2 font-weight-medium text-medium-emphasis mb-4">
        {{ $t("applicationsSearch.totalScreenshots") }}:
        <span class="font-weight-bold text-high-emphasis">
            {{ metadataWindows?.totalAmount }}
        </span>
    </div>

    <v-data-iterator
        :items="metadataWindowsObjectList"
        :items-per-page="pageSize"
        :search="search"
    >
        <template #header>
            <v-text-field
                v-model="search"
                class="mb-4"
                clearable
                density="comfortable"
                hide-details
                :placeholder="$t('applicationsSearch.searchWindowTitles')"
                prepend-inner-icon="mdi-magnify"
                :style="{ maxWidth: '320px' }"
                variant="solo-filled"
                flat
            />
        </template>

        <template #default="{ items }">
            <v-expansion-panels v-model="panels" multiple>
                <v-expansion-panel
                    v-for="metadataWindow in items"
                    :key="metadataWindow.raw.title"
                    class="rounded-lg mb-2"
                    :value="metadataWindow.raw.title"
                >
                    <v-expansion-panel-title class="font-weight-bold">
                        <v-icon
                            start
                            icon="mdi-image-outline"
                            color="primary"
                            size="small"
                        />
                        {{ metadataWindow.raw.title }}
                    </v-expansion-panel-title>

                    <v-expansion-panel-text>
                        <ApplicationsSearchUserList
                            :group-ids="groupIds"
                            :metadata-app="metadataApp"
                            :metadata-window="metadataWindow.raw.title"
                        />
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
                />

                <div class="mx-2">
                    {{ $t("applicationsSearch.pageOf", { page, pageCount }) }}
                </div>

                <v-btn
                    class="mx-2"
                    density="comfortable"
                    :disabled="page >= pageCount"
                    icon="mdi-arrow-right"
                    rounded
                    variant="tonal"
                    @click="nextPage"
                />

                <div class="mx-2">
                    {{ $t("applicationsSearch.itemsPerPage") }}
                </div>

                <v-text-field
                    v-model.number="pageSize"
                    class="mx-2 centered-text-input"
                    density="compact"
                    hide-details
                    min="1"
                    :style="{ maxWidth: '70px' }"
                    type="number"
                    variant="outlined"
                />
            </div>
        </template>
    </v-data-iterator>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from "vue";

import { DistinctMetadataWindowForExamRecord } from "@/models/screen-proctoring/applicationSearch";
import { getDistinctMetadataWindowForExam } from "@/services/screen-proctoring/applicationsSearchService.ts";
import * as generalUtils from "@/utils/generalUtils";

import ApplicationsSearchUserList from "./ApplicationsSearchUserList.vue";

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
        await getDistinctMetadataWindowForExam(
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
