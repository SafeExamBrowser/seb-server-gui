<template>
    <v-row>
        <v-col>
            <v-data-table
                class="rounded-lg elevation-4"
                :headers="headers"
                item-value="item.name"
                :items="groups"
                :items-per-page="tableUtils.calcDefaultItemsPerPage(groups)"
                :items-per-page-options="tableUtils.calcItemsPerPage(groups)"
                :sort-by="[{ key: 'exam.startTime', order: 'desc' }]"
            >
                <template
                    #headers="{ columns, isSorted, getSortIcon, toggleSort }"
                >
                    <!-- @addAddtionalExamHeaders="addAddtionalExamHeaders"
                    @removeAddtionalExamHeaders="removeAddtionalExamHeaders" -->
                    <TableHeaders
                        :columns="columns"
                        :get-sort-icon="getSortIcon"
                        :header-refs-prop="headerRefs"
                        :is-sorted="isSorted"
                        :toggle-sort="toggleSort"
                    >
                    </TableHeaders>
                </template>

                <template #item.exam.name="{ item }">
                    <th>
                        <div
                            v-if="
                                item.exam.name != '' && item.exam.name != null
                            "
                        >
                            <v-chip :color="getExamNameColor(item)">
                                {{ item.exam.name }}
                            </v-chip>
                        </div>
                    </th>
                </template>

                <template #item.exam.startTime="{ item }">
                    <td>
                        <div>
                            {{
                                timeUtils.formatTimestampToFullDate(
                                    item.exam.startTime,
                                )
                            }}
                        </div>
                    </td>
                </template>

                <template #item.exam.endTime="{ item }">
                    <td>
                        <div>
                            {{
                                timeUtils.formatTimestampToFullDate(
                                    item.exam.endTime,
                                )
                            }}
                        </div>
                    </td>
                </template>

                <template #item.terminationTime="{ item }">
                    <td>
                        <div>
                            {{
                                timeUtils.formatTimestampToFullDate(
                                    item.terminationTime,
                                )
                            }}
                        </div>
                    </td>
                </template>

                <template #item.name="{ item, index, internalItem }">
                    <td>
                        <div
                            role="button"
                            tabindex="0"
                            @keydown="
                                tableUtils.handleTabKeyEvent(
                                    $event,
                                    'navigate',
                                    internalItem.index,
                                    {
                                        path: linkService.getGalleryViewLink(
                                            item.uuid,
                                        ),
                                    },
                                )
                            "
                        >
                            <router-link
                                class="default-color"
                                :to="linkService.getGalleryViewLink(item.uuid)"
                                >{{ item.name }}</router-link
                            >
                        </div>
                    </td>
                </template>
            </v-data-table>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { onBeforeMount, onUnmounted, ref, watch } from "vue";
import * as examsOverviewViewService from "@/services/screen-proctoring/component-services/examsOverviewViewService";
import { useAppBarStore, useTableStore } from "@/stores/store";
import * as timeUtils from "@/utils/timeUtils";
import * as tableUtils from "@/utils/table/tableUtils";
import TableHeaders from "@/utils/table/TableHeaders.vue";
import { storeToRefs } from "pinia";
import * as linkService from "@/services/screen-proctoring/component-services/linkService";
import * as spConstants from "@/utils/sp-constants";
import * as authenticationService from "@/services/authenticationService";

// stores
const appBarStore = useAppBarStore();
const appBarStoreRef = storeToRefs(appBarStore);
const tableStore = useTableStore();

// table
const groups = ref<Group[]>();
const headerRefs = ref<any[]>();
const headers = ref([
    { title: "Exam", key: "exam.name", width: "25%" },
    { title: "Exam Start-Time", key: "exam.startTime", width: "25%" },
    { title: "Exam End-Time", key: "exam.endTime", width: "25%" },
    { title: "Group", key: "name", width: "25%" },
]);

// error handling
const errorAvailable = ref<boolean>();

onBeforeMount(async () => {
    appBarStore.title = "Running Exams";
    await getGroups();
});

onUnmounted(() => {
    // tableStore.isExamExpand = false;
});

watch(appBarStoreRef.examOverviewShowPastExams, async () => {
    await getGroups();
});

watch(appBarStoreRef.examOverviewShowUpcomingExams, async () => {
    await getGroups();
});

async function getGroups() {
    errorAvailable.value = false;

    const groupsResponse: GroupObject | null =
        await examsOverviewViewService.getGroups({
            pageSize: 500,
            includePastExams: appBarStore.examOverviewShowPastExams,
            includeUpcomingExams: appBarStore.examOverviewShowUpcomingExams,
        });

    if (groupsResponse == null) {
        errorAvailable.value = true;
        return;
    }

    groups.value = groupsResponse.content;
}

// function getGalleryViewLink(index: number) {
//     if(groups.value != null){
//         return spConstants.GALLERY_VIEW_ROUTE + "/" + groups.value[index].uuid;
//     }

//     return "";
// }

function getExamNameColor(group: Group): string {
    if (group.terminationTime != null) {
        return "red";
    }

    if (group.exam.startTime > Date.now()) {
        return "orange";
    }

    return "green";
}

// function addAddtionalExamHeaders(){
//     tableStore.isExamExpand = true;

//     headers.value.splice(2, 0, {title: "Exam End-Time", key: "exam.endTime", width: "8%"});
//     headers.value.splice(3, 0, {title: "Group Termination-Time", key: "terminationTime", width: "8%"});
// }

// function removeAddtionalExamHeaders(){
//     tableStore.isExamExpand = false;

//     headers.value.splice(2, 2);
// }
</script>

<style scoped>
.default-color {
    color: #2196f3;
}
</style>
