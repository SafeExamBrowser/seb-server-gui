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

                <template #item.name="{ item, internalItem }">
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
                                        route: {
                                            name: '/(app)/gallery_[uuid]_[examId]/',
                                            params: {
                                                uuid: item.uuid,
                                                examId: item.exam.uuid,
                                            },
                                        },
                                    },
                                )
                            "
                        >
                            <RouterLink
                                class="default-color"
                                :to="{
                                    name: '/(app)/gallery_[uuid]_[examId]/',
                                    params: {
                                        uuid: item.uuid,
                                        examId: item.exam.uuid,
                                    },
                                }"
                                >{{ item.name }}</RouterLink
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
import * as groupService from "@/services/screen-proctoring/groupService";
import { useAppBarStore } from "@/stores/store";
import * as timeUtils from "@/utils/timeUtils";
import * as tableUtils from "@/utils/table/tableUtils";
import TableHeaders from "@/utils/table/TableHeaders.vue";
import { storeToRefs } from "pinia";
import { Group, GroupObject } from "@/models/screen-proctoring/group";
import { RouterLink } from "vue-router";

definePage({
    meta: {
        titleKey: "titles.runningExams",
        pageTestId: "running-sp-exams-page",
        layoutContext: "exams-overview",
    },
});

// stores
const appBarStore = useAppBarStore();
const appBarStoreRef = storeToRefs(appBarStore);

// table
const groups = ref<Group[]>();
const headerRefs = ref<unknown[]>([]);
const headers = ref([
    { title: "Exam", key: "exam.name", width: "25%" },
    { title: "Exam Start-Time", key: "exam.startTime", width: "25%" },
    { title: "Exam End-Time", key: "exam.endTime", width: "25%" },
    { title: "Group", key: "name", width: "25%" },
]);

// error handling
const errorAvailable = ref<boolean>();

onBeforeMount(async () => {
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

    const groupsResponse: GroupObject | null = await groupService.getGroups({
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

function getExamNameColor(group: Group): string {
    if (group.terminationTime != null) {
        return "red";
    }

    if (group.exam.startTime > Date.now()) {
        return "orange";
    }

    return "green";
}
</script>

<style scoped>
.default-color {
    color: #2196f3;
}
</style>
