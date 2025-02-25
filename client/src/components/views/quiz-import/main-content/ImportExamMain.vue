<template>

    <v-data-table-server
        item-value="quiz_id" 
        @update:options="loadItems"
        :hover="true"
        :loading="isLoading"
        loading-text="Loading... Please wait"
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
    import * as quizImportWizardViewService from "@/services/component-services/quizImportWizardViewService";
    import * as tableUtils from "@/utils/table/tableUtils";
    import * as timeUtils from "@/utils/timeUtils";
    import TableHeaders from "@/utils/table/TableHeaders.vue";
    import {useQuizImportStore} from "@/stores/quizImportStore";
    import {storeToRefs} from "pinia";

    //stores
    const quizImportStore = useQuizImportStore();
    const quizImportStoreRef = storeToRefs(quizImportStore);


    //items
    const quizzes = ref<Quizzes>();

    //table - pagination, item size, search
    const isLoading = ref<boolean>(true);
    const totalItems = ref<number>(10);

    //table
    const isOnLoad = ref<boolean>(true);
    const defaultSort: {key: string, order: string}[] = [{key: 'quiz_start_time', order: 'desc'}];
    const quizzesTableHeadersRef = ref<any[]>();
    const quizzesTableHeaders = ref([
        {title: "Name", key: "quiz_name", width: "60%"},
        {title: "Start", key: "quiz_start_time", width: "20%"},
        {title: "End", key: "quiz_end_time", width: "20%"},
    ]);    
    
    //error handling
    const errorAvailable = ref<boolean>();


    //=======================events & watchers=======================
    watch(quizImportStoreRef.searchField, () => {
        // console.log(quizImportStoreRef.searchField.value)
    });

    //workaround es the method with "defineExpose" does not work
    watch(quizImportStoreRef.loadExamItemsCaller, () => {
        if(quizImportStore.currentPagingOptions == null){
            return;
        }

        if(quizImportStore.currentPagingOptions.itemsPerPage == 0){
            quizImportStore.currentPagingOptions.itemsPerPage = 10; 
        }

        loadItems(quizImportStore.currentPagingOptions);
    });


    function onTableRowClick(quiz: Quiz){
        if(quiz.quiz_id == quizImportStore.selectedQuiz?.quiz_id){
            quizImportStore.selectedQuiz = null;
            return;
        }

        quizImportStore.selectedQuiz = quiz;
    }

    //=======================data fetching===================
    async function loadItems(serverTablePaging: ServerTablePaging){
        quizImportStore.currentPagingOptions = serverTablePaging;
        isLoading.value = true;

        //current solution to default sort the table
        //sort-by in data-table-server tag breaks the sorting as the headers are in a seperate component
        if(isOnLoad.value){
            serverTablePaging.sortBy = defaultSort;
        }

        let startDate: string | null = null;
        if(quizImportStore.startDate != null){
            startDate = timeUtils.setIsoTimeToZero(quizImportStore.startDate.toISOString());
        }

        const optionalParGetQuizzes: OptionalParGetQuizzes = tableUtils.assignQuizSelectPagingOptions
        (
            serverTablePaging, 
            quizImportStore.searchField, 
            startDate
        );

        const quizzesResponse: Quizzes | null = await quizImportWizardViewService.getQuizzes(optionalParGetQuizzes);

        if(quizzesResponse == null){
            isLoading.value = false;
            return;
        }

        quizzes.value = quizzesResponse;
        totalItems.value = quizzes.value.number_of_pages * quizzes.value.page_size;

        isOnLoad.value = false;
        isLoading.value = false;
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

