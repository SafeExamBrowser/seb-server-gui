<template>

    <v-data-table-server
        item-value="quiz_id" 
        class="elevation-1"
        @update:options="loadItems"
        :loading="isLoading"
        loading-text="Loading... Please wait"
        :search="search"
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

        <template v-slot:item.quiz_start_time="{item}">
            <td>
                {{ timeUtils.formatIsoDateToFullDate(item.quiz_start_time) }}
                <!-- {{ item.quiz_start_time }} -->
            </td>
        </template>

        <template v-slot:item.quiz_end_time="{item}">
            <td>
                test
            </td>
        </template>

    </v-data-table-server>



</template>


<script setup lang="ts">
    import * as quizViewService from "@/services/component-services/quizViewService";
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
    const search = ref<string>();

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

    //=======================watchers=======================
    watch(quizImportStoreRef.searchField, () => {
        // console.log(quizImportStoreRef.searchField.value)
    });

    //=======================data fetching===================
    async function loadItems(serverTablePaging: ServerTablePaging){
        isLoading.value = true;

        //current solution to default sort the table
        //sort-by in data-table-server tag breaks the sorting as the headers are in a seperate component
        if(isOnLoad.value){
            serverTablePaging.sortBy = defaultSort;
        }

        const optionalParGeneric: OptionalParGeneric = tableUtils.assignQuizSelectPagingOptions(serverTablePaging);

        console.log(optionalParGeneric)

        const quizzesResponse: Quizzes | null = await quizViewService.getQuizzes(optionalParGeneric);

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


</style>

