<template>
    <InfoBoxExamList @loadExamItemsCaller="loadExamItemsCaller"></InfoBoxExamList>
    <MainContentExamList ref="mainContentExamListRef"></MainContentExamList>
</template>

<script setup lang="ts">
    import { useAppBarStore } from '@/stores/store';
    import * as constants from "@/utils/constants";
    import MainContentExamList from "@/components/views/exam/main-content/MainContentExamList.vue";
    import { useExamStore } from '@/stores/examStore';

    //stores
    const appBarStore = useAppBarStore();
    const examStore = useExamStore();


    //ref to MainContentExamList
    const mainContentExamListRef = ref<InstanceType<typeof MainContentExamList> | null>(null);

    onBeforeMount(async () => {
        appBarStore.title = constants.EXAMS_TITLE;

    });

    //call function in "MainContentExamList"
    function loadExamItemsCaller(){
        if(examStore.currentPagingOptions == null){
            return;
        }

        if(examStore.currentPagingOptions.itemsPerPage == 0){
            examStore.currentPagingOptions.itemsPerPage = 10; 
        }

        mainContentExamListRef.value?.loadItems(examStore.currentPagingOptions);
    }


</script>

<style scoped>

</style>