<template>
    <div class="text-h6 my-7">
        <h3 class="title-inherit-styling">Screenshots</h3>
    </div>

    <v-data-table
        class="elevation-5 mb-7"
        :expanded="expandedItems"
        :headers="screenshotTableHeaders"
        item-value="timelineScreenshotDataList[0].timestamp"
        :items="timelineSearchResultRef?.timelineGroupDataList"
        :items-per-page="
            tableUtils.calcDefaultItemsPerPage(
                timelineSearchResultRef?.timelineGroupDataList,
            )
        "
        :items-per-page-options="
            tableUtils.calcItemsPerPage(
                timelineSearchResultRef?.timelineGroupDataList,
            )
        "
        show-expand
        :sort-by="[{ key: 'timestamp', order: 'asc' }]"
        theme="tableTheme"
    >
        <!------------headers------------>
        <template #headers="{ columns, isSorted, getSortIcon, toggleSort }">
            <TableHeaders
                :columns="columns"
                :get-sort-icon="getSortIcon"
                :header-refs-prop="screenshotTableHeadersRef"
                :is-sorted="isSorted"
                :toggle-sort="toggleSort"
            >
            </TableHeaders>
        </template>

        <template #item.timestamp="{ internalItem }">
            <td>
                <div>
                    {{
                        timeUtils.formatTimestampToTime(
                            internalItem.columns.timestamp,
                        )
                    }}
                </div>
            </td>
        </template>

        <template #item.groupName="{ item }">
            <td>
                <div>
                    {{ item.groupName }} ({{
                        item.timelineScreenshotDataList.length
                    }})
                </div>
            </td>
        </template>

        <template #item.proctoringViewLink="{ internalItem }">
            <v-btn
                icon="mdi-video"
                variant="text"
                @click="
                    searchViewService.openProctoringView(
                        timelineSearchResultRef!.sessionUUID,
                        internalItem.columns.timestamp,
                    )
                "
            >
            </v-btn>
        </template>
        <!-------------------------------->

        <!------------content------------>
        <template
            #item.data-table-expand="{
                internalItem,
                item,
                isExpanded,
                toggleExpand,
            }"
        >
            <v-btn
                v-if="item.timelineScreenshotDataList.length > 1"
                :icon="
                    isExpanded(internalItem)
                        ? 'mdi-chevron-up'
                        : 'mdi-chevron-down'
                "
                tabindex="0"
                variant="text"
                @click="toggleExpand(internalItem)"
                @keydown.enter="toggleExpand(internalItem)"
                @keydown.space="toggleExpand(internalItem)"
            >
            </v-btn>
        </template>

        <template #expanded-row="{ item }">
            <tr
                v-for="screenshot in groupingUtils.groupScreenshotsByMetadata(
                    item.timelineScreenshotDataList,
                    true,
                )!"
                :key="screenshot.timelineScreenshotDataList[0].timestamp"
            >
                <td>
                    {{
                        timeUtils.formatTimestampToTime(
                            screenshot.timelineScreenshotDataList[0].timestamp,
                        )
                    }}
                </td>

                <td></td>

                <td>
                    {{
                        screenshot.timelineScreenshotDataList[0].metaData
                            .screenProctoringMetadataBrowser
                    }}
                </td>

                <td>
                    {{
                        screenshot.timelineScreenshotDataList[0].metaData
                            .screenProctoringMetadataUserAction
                    }}
                </td>

                <td>
                    {{
                        screenshot.timelineScreenshotDataList[0].metaData
                            .screenProctoringMetadataWindowTitle
                    }}
                </td>

                <td>
                    <v-btn
                        icon="mdi-video"
                        variant="text"
                        @click="
                            searchViewService.openProctoringView(
                                timelineSearchResultRef!.sessionUUID,
                                screenshot.timelineScreenshotDataList[0].timestamp.toString(),
                            )
                        "
                    >
                    </v-btn>
                </td>

                <td></td>
            </tr>
            <tr class="last-border"></tr>
        </template>
        <!-------------------------------->
    </v-data-table>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watch } from "vue";
import * as timeUtils from "@/utils/timeUtils";
import * as tableUtils from "@/utils/table/tableUtils";
import * as searchViewService from "@/services/screen-proctoring/component-services/searchViewService";
import * as groupingUtils from "@/utils/groupingUtils";
import TableHeaders from "@/utils/table/TableHeaders.vue";
import * as spConstants from "@/utils/sp-constants";
import { SearchTimeline } from "@/models/screen-proctoring/search";

// simple "clickable" for header refs (matches what TableHeaders expects)
type Clickable = { click: () => void };

const props = defineProps<{
    timelineSearchResult: SearchTimeline | null; // ← was any
}>();

const timelineSearchResultRef = ref<SearchTimeline | null>(null);

// table
const expandedItems = ref<string[]>([]);
const screenshotTableHeadersRef = ref<Clickable[] | null>(null); // ← was any[]
const screenshotTableHeaders = ref([
    {
        title: "Capture-Time",
        key: "timestamp",
        value: "timelineScreenshotDataList[0].timestamp",
        width: "10%",
    },
    { title: spConstants.APPLICATION_METADATA, key: "groupName", width: "15%" },
    {
        title: spConstants.SEB_BROWSER_TITLE_METADATA,
        key: "browserTitle",
        value: "timelineScreenshotDataList[0].metaData.screenProctoringMetadataBrowser",
    },
    {
        title: spConstants.ACTIVITY_DETAILS_METADATA,
        key: "activityDetails",
        value: "timelineScreenshotDataList[0].metaData.screenProctoringMetadataUserAction",
    },
    {
        title: spConstants.WINDOW_TITLE_METADATA,
        key: "windowTitle",
        value: "timelineScreenshotDataList[0].metaData.screenProctoringMetadataWindowTitle",
    },
    { title: "Video", key: "proctoringViewLink", width: "1%" },
    { title: "", key: "data-table-expand" },
]);

onBeforeMount(() => {
    timelineSearchResultRef.value = props.timelineSearchResult;
});

watch(timelineSearchResultRef, (newList) => {
    if (!newList) return;
    expandedItems.value = newList.timelineGroupDataList.map((item) =>
        item.timelineScreenshotDataList[0].timestamp.toString(),
    );
});
</script>

<style scoped>
/* .v-table .v-table__wrapper > table > tbody > tr:not(:last-child) > td, .v-table .v-table__wrapper > table > tbody > tr:not(:last-child) > th {
        border-bottom: none !important;
    } */

.v-table .v-table__wrapper > table > tbody > tr:not(:last-child) > td {
    border-bottom: none !important;
}

.last-border {
    border-bottom: thin solid
        rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>
