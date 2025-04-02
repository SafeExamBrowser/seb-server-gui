<template>
    <ExamListInfo @loadExamItemsCaller="loadExamItemsCaller"></ExamListInfo>
    <ExamListMain ref="examListMainRef"></ExamListMain>
</template>

<script setup lang="ts">
    import { useAppBarStore } from '@/stores/store';
    import * as constants from "@/utils/constants";
    import ExamListMain from "@/components/views/exam/main-content/ExamListMain.vue";
    import { useExamStore } from '@/stores/examStore';
    import {translate} from "@/utils/generalUtils";

    //stores
    const appBarStore = useAppBarStore();
    const examStore = useExamStore();

    //ref to ExamListMain
    const examListMainRef = ref<InstanceType<typeof ExamListMain> | null>(null);

    onBeforeMount(async () => {
        appBarStore.title = translate("titles.exams");
    });

    //call function in "ExamListMain"
    function loadExamItemsCaller(){
        if(examStore.currentPagingOptions == null){
            return;
        }

        if(examStore.currentPagingOptions.itemsPerPage == 0){
            examStore.currentPagingOptions.itemsPerPage = 10; 
        }

        examListMainRef.value?.loadItems(examStore.currentPagingOptions);
    }


</script>

<style scoped>

</style>