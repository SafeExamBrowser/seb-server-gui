<template>
    <div class="text-h6 my-7">
        <h3 class="title-inherit-styling">Screenshots</h3>
    </div>

    <v-data-table
        show-expand
        item-value="timelineScreenshotDataList[0].timestamp"
        class="elevation-5 mb-7"
        theme="tableTheme"
        :sort-by="[{key: 'timestamp', order: 'asc'}]"
        :expanded="expandedItems"
        :items-per-page="tableUtils.calcDefaultItemsPerPage(timelineSearchResult?.timelineGroupDataList)" 
        :items-per-page-options="tableUtils.calcItemsPerPage(timelineSearchResult?.timelineGroupDataList)"
        :headers="screenshotTableHeaders" 
        :items="timelineSearchResult?.timelineGroupDataList">

        <!------------headers------------>
        <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort }">
            <TableHeaders
                :columns="columns"
                :is-sorted="isSorted"
                :get-sort-icon="getSortIcon"
                :toggle-sort="toggleSort"
                :header-refs-prop="screenshotTableHeadersRef">
            </TableHeaders>
        </template>

        <template v-slot:item.timestamp="{internalItem}">
            <td>
                <div>
                    {{timeUtils.formatTimestampToTime(internalItem.columns.timestamp)}}
                </div>
            </td>
        </template>

        <template v-slot:item.groupName="{item}">
            <td>
                <div>
                    {{item.groupName}} ({{ item.timelineScreenshotDataList.length }})
                </div>
            </td>
        </template>

        <template v-slot:item.proctoringViewLink="{internalItem}">
            <v-btn 
                @click="searchViewService.openProctoringView(timelineSearchResult!.sessionUUID, internalItem.columns.timestamp)" 
                variant="text" 
                icon="mdi-video">
            </v-btn>
        </template>
        <!-------------------------------->


        <!------------content------------>
        <template v-slot:item.data-table-expand="{internalItem, item, isExpanded, toggleExpand}">
            <v-btn 
                v-if="item.timelineScreenshotDataList.length > 1"
                tabindex="0" 
                variant="text" 
                @keydown.native.enter="toggleExpand(internalItem)"
                @keydown.native.space="toggleExpand(internalItem)"
                @click="toggleExpand(internalItem)"
                :icon="isExpanded(internalItem) ? 'mdi-chevron-up' : 'mdi-chevron-down'" >
            </v-btn>
        </template>
                    
        <template v-slot:expanded-row="{ columns, item, index }">

            <template v-for="screenshot in groupingUtils.groupScreenshotsByMetadata(item.timelineScreenshotDataList, true)!">
                <tr>
                    <td>
                        {{ timeUtils.formatTimestampToTime(screenshot.timelineScreenshotDataList[0].timestamp)}}
                    </td>

                    <td>
                    </td>
                    
                    <td>
                        {{ screenshot.timelineScreenshotDataList[0].metaData.screenProctoringMetadataBrowser }}
                    </td>

                    <td>
                        {{ screenshot.timelineScreenshotDataList[0].metaData.screenProctoringMetadataUserAction }}
                    </td>

                    <td>
                        {{ screenshot.timelineScreenshotDataList[0].metaData.screenProctoringMetadataWindowTitle }}
                    </td>

                    <td>
                        <v-btn 
                            @click="searchViewService.openProctoringView(timelineSearchResult!.sessionUUID, screenshot.timelineScreenshotDataList[0].timestamp.toString())" 
                            variant="text" 
                            icon="mdi-video">
                        </v-btn>
                    </td>

                    <td>
                    </td>
                </tr>

            </template>
            <tr class="last-border"></tr>

        </template>
        <!-------------------------------->

    </v-data-table>
</template>

<script setup lang="ts">
    import { ref, watch, onBeforeMount } from "vue";
    import * as timeUtils from "@/utils/timeUtils";
    import * as tableUtils from "@/utils/table/tableUtils";
    import * as searchViewService from "@/services/screen-proctoring/component-services/searchViewService";
    import * as groupingUtils from "@/utils/groupingUtils";
    import TableHeaders from "@/utils/table/TableHeaders.vue";
    import * as spConstants from "@/utils/sp-constants";

    const props = defineProps<{
        timelineSearchResult: any
    }>();

    const timelineSearchResult = ref<SearchTimeline>();

    //table
    const expandedItems = ref<string[]>([]);
    const screenshotTableHeadersRef = ref<any[]>();
    const screenshotTableHeaders = ref([
        {title: "Capture-Time", key: "timestamp", value: "timelineScreenshotDataList[0].timestamp", width: "10%"},
        {title: spConstants.APPLICATION_METADATA, key: "groupName", width: "15%"},

        {title: spConstants.SEB_BROWSER_TITLE_METADATA, key: "browserTitle", value: "timelineScreenshotDataList[0].metaData.screenProctoringMetadataBrowser"},
        {title: spConstants.ACTIVITY_DETAILS_METADATA, key: "activityDetails", value: "timelineScreenshotDataList[0].metaData.screenProctoringMetadataUserAction"},
        {title: spConstants.WINDOW_TITLE_METADATA, key: "windowTitle", value: "timelineScreenshotDataList[0].metaData.screenProctoringMetadataWindowTitle"},

        {title: "Video", key: "proctoringViewLink", width: "1%"},
        {title: "", key: "data-table-expand"}
    ]);

    onBeforeMount(() => {
        timelineSearchResult.value = props.timelineSearchResult;
    });

    watch(timelineSearchResult, (newList) => {
        if(newList == null){
            return;
        }

        expandedItems.value = newList?.timelineGroupDataList.map(item => item.timelineScreenshotDataList[0].timestamp.toString());
    });

</script>

<style scoped>
    /* .v-table .v-table__wrapper > table > tbody > tr:not(:last-child) > td, .v-table .v-table__wrapper > table > tbody > tr:not(:last-child) > th {
        border-bottom: none !important;
    } */

    .v-table .v-table__wrapper > table > tbody > tr:not(:last-child) > td {
        border-bottom: none !important;
    }

    .last-border{
        border-bottom: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
    } 
</style>