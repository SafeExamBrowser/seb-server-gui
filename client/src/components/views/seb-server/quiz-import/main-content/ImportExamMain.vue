<template>

    <v-data-table-server
        item-value="quiz_id" 
        @update:options="loadItems"
        :hover="true"
        :loading="isLoading"
        :loading-text="translate('general.loadingText')"
        :items="quizzes?.content"
        :items-length="totalItems"
        :items-per-page="tableUtils.calcDefaultItemsPerPage(totalItems)"
        :items-per-page-options="tableUtils.calcItemsPerPage(totalItems)"
        :headers="quizzesTableHeaders">

        <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort}">
            <TableHeaders
                :columns="columns"
                :is-sorted="isSorted"
                :get-sort-icon="getSortIcon"
                :toggle-sort="toggleSort"
                :header-refs-prop="quizzesTableHeadersRef">
            </TableHeaders>
        </template>

        <template v-slot:item="{item}">
            <tr 
                tabindex="0"
                @keyup.enter="onTableRowClick(item)"
                @click="onTableRowClick(item)"
                class="on-row-hover" 
                :class="[quizImportStore.selectedQuiz?.quiz_id == item.quiz_id ? 'selected-row' : '']">

                <td>{{ item.quiz_name }}</td>
                <td>{{ timeUtils.formatIsoDateToFullDate(item.quiz_start_time) }}</td>
                <td>{{ timeUtils.formatIsoDateToFullDate(item.quiz_end_time) }}</td>
            </tr>
        </template>

    </v-data-table-server>

</template>


<script setup lang="ts">
    import * as quizImportWizardViewService from "@/services/seb-server/component-services/quizImportWizardViewService";
    import * as tableUtils from "@/utils/table/tableUtils";
    import * as timeUtils from "@/utils/timeUtils";
    import TableHeaders from "@/utils/table/TableHeaders.vue";
    import {useQuizImportStore} from "@/stores/seb-server/quizImportStore";
    import {storeToRefs} from "pinia";
    import {translate} from "@/utils/generalUtils";
    import {wait} from "@/utils/generalUtils";

    //stores
    const quizImportStore = useQuizImportStore();
    const quizImportStoreRef = storeToRefs(quizImportStore);

    //items
    const quizzes = ref<Quizzes>();

    //table - pagination, item size, search
    const isLoading = ref<boolean>(false);
    const totalItems = ref<number>(15);

    //table
    const isOnLoad = ref<boolean>(true);
    const defaultSort: {key: string, order: string}[] = [{key: 'quiz_start_time', order: 'desc'}];
    const quizzesTableHeadersRef = ref<any[]>();
    const quizzesTableHeaders = ref([
        {title: translate("quizImportWizard.examMain.tableHeaderName"), key: "quiz_name", width: "60%"},
        {title: translate("quizImportWizard.examMain.tableHeaderStart"), key: "quiz_start_time", width: "20%"},
        {title: translate("quizImportWizard.examMain.tableHeaderEnd"), key: "quiz_end_time", width: "20%"},
    ]);    
    
    defineExpose({
        loadItems
    });

    //=======================events & watchers=======================
    watch(quizImportStoreRef.selectedAssessmentTool, () => {
        if(quizImportStore.currentPagingOptions == null){
            return;
        }

        console.log("********* selectedAssessmentTool" );

        loadItems(quizImportStore.currentPagingOptions);
    });

    //workaround es the method with "defineExpose" does not work
    watch(quizImportStoreRef.loadExamItemsCaller, () => {
        if(quizImportStore.currentPagingOptions == null){
            return;
        }

        if(quizImportStore.currentPagingOptions.itemsPerPage == 0){
            quizImportStore.currentPagingOptions.itemsPerPage = 10; 
        }

        console.log("********* loadExamItemsCaller" );

        loadItems(quizImportStore.currentPagingOptions);
    });


    function onTableRowClick(quiz: Quiz){
        if(quiz.quiz_id == quizImportStore.selectedQuiz?.quiz_id){
            quizImportStore.selectedQuiz = null;
            return;
        }

        quizImportStore.selectedQuiz = quiz;
    }

    let fetching = false;

    //=======================data fetching===================
    async function loadItems(serverTablePaging: ServerTablePaging){
        // if it is already loading skip call
        if (fetching) {
            return;
        }
        fetching = true;

        // clear the table first
        if (quizzes.value) {
            quizzes.value.content = [];
        }
        
        quizImportStore.currentPagingOptions = serverTablePaging;
        isLoading.value = true;
        

        //current solution to default sort the table
        //sort-by in data-table-server tag breaks the sorting as the headers are in a seperate component
        if(isOnLoad.value){
            serverTablePaging.sortBy = defaultSort;
        }

        let startTimestamp: number | null = null;
        if(quizImportStore.startTimestamp != null){
            startTimestamp = quizImportStore.startTimestamp;
        }

        let assessmentToolId: string | null = null;

        if(quizImportStore.selectedAssessmentTool != null){
            assessmentToolId = quizImportStore.selectedAssessmentTool.toString();
        }

        const optionalParGetQuizzes: OptionalParGetQuizzes = tableUtils.assignQuizSelectPagingOptions
        (
            serverTablePaging, 
            quizImportStore.searchField, 
            startTimestamp,
            assessmentToolId,
            quizImportStore.forceNewSearch,
        );

        // reset forceNewSearch once we have applied it
        quizImportStore.forceNewSearch = false;

        let quizzesResponse: Quizzes | null = await quizImportWizardViewService.getQuizzes(optionalParGetQuizzes);

        if(quizzesResponse == null){
            finishFatching();
            return;
        }

        // check if fetch is complete, if not ping until fetch is finished or breaker_count
        let allQuizzes = quizzesResponse.complete;
        quizzes.value = quizzesResponse;
        totalItems.value = quizzes.value.number_of_pages * quizzes.value.page_size;
        optionalParGetQuizzes.force_new_search = false;
        let breaker_count = 0;

        while (!allQuizzes && breaker_count < 30) {
            await wait(3000);
            quizzesResponse = await quizImportWizardViewService.getQuizzes(optionalParGetQuizzes);
            if(quizzesResponse == null){ 
                finishFatching();
                return;
            }
            quizzes.value = quizzesResponse;
            totalItems.value = quizzes.value.number_of_pages * quizzes.value.page_size;
            allQuizzes = quizzesResponse.complete;
            breaker_count++;
        }

        finishFatching();
    }

    function finishFatching() {
        isOnLoad.value = false;
        isLoading.value = false;
        fetching = false;
    }
    //======================================================

    
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

