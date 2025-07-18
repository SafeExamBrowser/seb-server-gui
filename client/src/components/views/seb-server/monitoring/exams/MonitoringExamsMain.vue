<template>
    <v-row>
        <v-col>

            <v-sheet 
                elevation="4"
                class="rounded-lg pa-8">

                <v-data-table-server
                    item-value="id" 
                    @update:options="loadItems"
                    :hover="true"
                    :loading="isLoading"
                    :loading-text="translate('general.loadingText')"
                    :items="exams?.content"
                    :items-length="totalItems"
                    :items-per-page="tableUtils.calcDefaultItemsPerPage(totalItems)"
                    :items-per-page-options="tableUtils.calcItemsPerPage(totalItems)"
                    :headers="examsTableHeaders">

                    <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort}">
                        <TableHeaders
                            :columns="columns"
                            :is-sorted="isSorted"
                            :get-sort-icon="getSortIcon"
                            :toggle-sort="toggleSort"
                            :header-refs-prop="examsTableHeadersRef">
                        </TableHeaders>
                    </template>

                    <template v-slot:item="{item}">
                        <tr 
                            @click="onTableRowClick(item)"
                            class="on-row-hover"
                            :class="[selectedExam?.id == item.id ? 'selected-row' : '']">

                            <td>{{ item.quizName }}</td>
                            <td>{{ timeUtils.formatIsoDateToFullDate(item.quizStartTime) }}</td>
                            <td>{{ timeUtils.formatIsoDateToFullDate(item.quizEndTime) }}</td>
                            <td>
                                <v-chip 
                                    variant="tonal"
                                    size="small">
                                    {{ translate(generalUtils.findEnumValue(ExamTypeEnum, item.type)) }}
                                </v-chip>
                            </td>
                            <td>
                                <v-chip 
                                    variant="tonal"
                                    size="small"
                                    :color="generalUtils.getExamStatusFilterColor(generalUtils.findEnumValue(ExamStatusEnum, item.status))">
                                    {{ translate(generalUtils.findEnumValue(ExamStatusEnum, item.status)) }}
                                </v-chip>
                            </td>
                            <td align="right">
                                <v-icon 
                                    class="mr-6"
                                    icon="mdi-chevron-right"
                                    style="font-size: 30px;"
                                    @click="navigateTo(constants.MONITORING_OVERVIEW_ROUTE + '/' + item.id.toString())">
                                </v-icon>
                            </td>
                        </tr>
                    </template>

                </v-data-table-server>
                
            </v-sheet>

        </v-col>
    </v-row>
</template>



<script setup lang="ts">
    import * as examViewService from "@/services/seb-server/component-services/examViewService";
    import * as tableUtils from "@/utils/table/tableUtils";
    import * as timeUtils from "@/utils/timeUtils";
    import * as generalUtils from "@/utils/generalUtils";
    import TableHeaders from "@/utils/table/TableHeaders.vue";
    import {navigateTo} from "@/router/navigation";
    import * as constants from "@/utils/constants";
    import { ExamStatusEnum, ExamTypeEnum } from "@/models/seb-server/examFiltersEnum";
    import {translate} from "@/utils/generalUtils";
    import { useMonitoringStore } from "@/stores/seb-server/monitoringStore";

    //stores
    const monitoringStore = useMonitoringStore();

    //items
    const selectedExam = ref<Exam | null>();
    const exams = ref<Exams>();

    //table - pagination, item size, search
    const isLoading = ref<boolean>(true);
    const totalItems = ref<number>(15);

    //table
    const isOnLoad = ref<boolean>(true);
    const defaultSort: {key: string, order: string}[] = [{key: 'quizStartTime', order: 'desc'}];
    const examsTableHeadersRef = ref<any[]>();
    const examsTableHeaders = ref([
        {title: translate("monitoringExams.main.tableHeaderName"), key: "quizName", width: "30%"},
        {title: translate("monitoringExams.main.tableHeaderStart"), key: "quizStartTime", width: "20%"},
        {title: translate("monitoringExams.main.tableHeaderEnd"), key: "quizEndTime", width: "20%"},
        {title: translate("monitoringExams.main.tableHeaderType"), key: "type", sortable: false, width: "12.5%"},
        {title: translate("monitoringExams.main.tableHeaderStatus"), key: "status", sortable: false, width: "12.5%"},
        {title: "", key: "examLink", width: "5%"},
    ]);    
    
    defineExpose({
        loadItems
    });

    //=======================events & watchers=======================
    function onTableRowClick(exam: Exam){
        if(exam.id == selectedExam.value?.id){
            selectedExam.value = null;
            return;
        }

        selectedExam.value = exam;
    }

    //=======================data fetching===================
    async function loadItems(serverTablePaging: ServerTablePaging){
        monitoringStore.currentPagingOptions = serverTablePaging;
        isLoading.value = true;

        //current solution to default sort the table
        //sort-by in data-table-server txag breaks the sorting as the headers are in a seperate component
        if(isOnLoad.value){
            serverTablePaging.sortBy = defaultSort;
        }

        let startTimestamp: number | null = null;
        if(monitoringStore.startDate != null){
            startTimestamp = monitoringStore.startDate;
        }

        let activeStatusFilter: ExamStatusEnum | string | null = null;
        if(monitoringStore.activeStatusFilter == null){
            activeStatusFilter = generalUtils.createStringCommaList([ExamStatusEnum.RUNNING, ExamStatusEnum.TEST_RUN])
        }else{
            activeStatusFilter = monitoringStore.activeStatusFilter;
        }

        const optionalParGetExams: OptionalParGetExams = tableUtils.assignExamSelectPagingOptions
        (
            serverTablePaging, 
            monitoringStore.searchField, 
            startTimestamp,
            monitoringStore.activeTypeFilter,
            activeStatusFilter
        );

        const examsResponse: Exams | null = await examViewService.getExamsForMonitoring(optionalParGetExams);

        if(examsResponse == null){
            isLoading.value = false;
            return;
        }

        exams.value = examsResponse;
        totalItems.value = exams.value.number_of_pages * exams.value.page_size;

        isOnLoad.value = false;
        isLoading.value = false;
    }

</script>


<style scoped>

    .on-row-hover:hover{
        background: #e4e4e4 !important;
        cursor: pointer;
    }

    .selected-row {
        background-color: #e4e4e4 !important;
    }

</style>