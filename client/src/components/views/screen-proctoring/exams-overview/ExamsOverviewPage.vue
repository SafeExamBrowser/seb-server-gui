<template>

    <v-row>
        <v-col v-if="noRunningExams">
            <v-sheet 
                elevation="4"
                class="rounded-lg pa-4"
                title="No running exams available">
                <v-row>
                    <v-col align="left" class="text-h6">
                        No running exams available
                    </v-col>
                </v-row>
            </v-sheet>
        </v-col>

        <v-col v-else>
            <v-data-table
                item-value="item.name"
                class="rounded-lg elevation-4"
                :sort-by="[{key: 'exam.startTime', order: 'desc'}]"
                :items-per-page="tableUtils.calcDefaultItemsPerPage(groups)"
                :items-per-page-options="tableUtils.calcItemsPerPage(groups)"
                :headers="headers"
                :items="groups">

                <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort }">
                    <!-- @addAddtionalExamHeaders="addAddtionalExamHeaders"
                    @removeAddtionalExamHeaders="removeAddtionalExamHeaders" -->
                    <TableHeaders
                        :columns="columns"
                        :is-sorted="isSorted"
                        :get-sort-icon="getSortIcon"
                        :toggle-sort="toggleSort"
                        :header-refs-prop="headerRefs">
                    </TableHeaders>
                </template>

                <template v-slot:item.exam.name="{item}">
                    <th>
                        <div v-if="item.exam.name != '' && item.exam.name != null">
                            <v-chip :color="getExamNameColor(item)">
                                {{ item.exam.name }}
                            </v-chip>
                        </div>
                    </th>
                </template>

                <template v-slot:item.exam.startTime="{item}">
                    <td>
                        <div>
                            {{timeUtils.formatTimestampToFullDate(item.exam.startTime)}}
                        </div>
                    </td>
                </template>

                <template v-slot:item.exam.endTime="{item}">
                    <td>
                        <div>
                            {{timeUtils.formatTimestampToFullDate(item.exam.endTime)}}
                        </div>
                    </td>
                </template>

                <template v-slot:item.terminationTime="{item}">
                    <td>
                        <div>
                            {{timeUtils.formatTimestampToFullDate(item.terminationTime)}}
                        </div>
                    </td>
                </template>

                <template v-slot:item.name="{item, index, internalItem}">
                    <td>
                        <div 
                            role="button"
                            tabindex="0"
                            @keydown="tableUtils.handleTabKeyEvent($event, 'navigate', internalItem.index, {path: getGalleryViewLink(internalItem.index)})">
                            <router-link class="default-color" :to="getGalleryViewLink(internalItem.index)">{{item.name}}</router-link>
                        </div>
                    </td>
                </template>

            </v-data-table>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
    import { ref, onBeforeMount, onUnmounted, watch } from "vue";
    import * as examsOverviewViewService from "@/services/screen-proctoring/component-services/examsOverviewViewService";
    import { useAppBarStore, useTableStore } from "@/stores/store";
    import * as timeUtils from "@/utils/timeUtils";
    import * as tableUtils from "@/utils/table/tableUtils";
    import TableHeaders from "@/utils/table/TableHeaders.vue";
    import { storeToRefs } from "pinia";
    import * as spConstants from "@/utils/sp-constants";
    import * as authenticationService from "@/services/authenticationService";
    import {useAuthStore } from "@/stores/store";


    //stores
    const appBarStore = useAppBarStore();
    const appBarStoreRef = storeToRefs(appBarStore);
    const tableStore = useTableStore();
    const authStore = useAuthStore();

    //table
    const groups = ref<Group[]>();
    const headerRefs = ref<any[]>();
    const headers = ref([
        {title: "Exam", key: "exam.name", width: "25%"},
        {title: "Exam Start-Time", key: "exam.startTime", width: "25%"},
        {title: "Exam End-Time", key: "exam.endTime", width: "25%"},
        {title: "Group", key: "name", width: "25%"}
    ]);
    const noRunningExams = ref<boolean>(false);

    //error handling
    const errorAvailable = ref<boolean>();


    onBeforeMount(async () => {
        appBarStore.title = "Running Exams";


        const tokenObject: Token = await authenticationService.loginSP("super-admin", "admin");
        authStore.loginSP(tokenObject.access_token, tokenObject.refresh_token);



        await getGroups();
    });

    onUnmounted(() => {
        tableStore.isExamExpand = false;
    });

    watch(appBarStoreRef.examOverviewShowPastExams, async () => {
        await getGroups();
    });

    watch(appBarStoreRef.examOverviewShowUpcomingExams, async () => {
        await getGroups();
    });

    async function getGroups(){
        errorAvailable.value = false;

        const groupsResponse: GroupObject | null = await examsOverviewViewService.getGroups({
            pageSize: 500, 
            includePastExams: appBarStore.examOverviewShowPastExams,
            includeUpcomingExams: appBarStore.examOverviewShowUpcomingExams
        });

        if(groupsResponse == null){
            errorAvailable.value = true;
            return;
        }

        groups.value = groupsResponse.content;
    }

    function getGalleryViewLink(index: number) {
        if(groups.value != null){
            return spConstants.GALLERY_VIEW_ROUTE + "/" + groups.value[index].uuid;
        }

        return "";
    }

    function getExamNameColor(group: Group): string{
        if(group.terminationTime != null){
            return "red";
        }

        if(group.exam.startTime > Date.now()){
            return "orange"
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
        color: #2196F3;
    }

</style>