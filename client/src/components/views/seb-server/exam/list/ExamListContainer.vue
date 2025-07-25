<template>
    <v-container
        fluid
        class="d-flex flex-column align-stretch px-0 pa-0"
        style="min-height: 90vh;"
    >
        <!-- Info and Search -->
        <ExamListInfo
            class="flex-grow-0"
            @loadExamItemsCaller="loadExamItemsCaller">
        </ExamListInfo>

        <!-- Table Component -->
        <ExamListMain
            class="flex-grow-1"
            style="min-height: 63vh;"
            ref="examListMainRef">
        </ExamListMain>
    </v-container>

</template>

<script setup lang="ts">
import {useAppBarStore} from '@/stores/store';
import ExamListMain from "@/components/views/seb-server/exam/list/ExamListMain.vue";
import {useExamStore} from '@/stores/seb-server/examStore';
import {translate} from "@/utils/generalUtils";
import MonitoringExamsMain from "@/components/views/seb-server/monitoring/exams/MonitoringExamsMain.vue";

//stores
const appBarStore = useAppBarStore();
const examStore = useExamStore();

//ref to ExamListMain
const examListMainRef = ref<InstanceType<typeof ExamListMain> | null>(null);

onBeforeMount(async () => {
    appBarStore.title = translate("titles.exams");
});

//call function in "ExamListMain"
function loadExamItemsCaller() {
    if (examStore.currentPagingOptions == null) {
        return;
    }

    if (examStore.currentPagingOptions.itemsPerPage == 0) {
        examStore.currentPagingOptions.itemsPerPage = 10;
    }

    examListMainRef.value?.loadItems(examStore.currentPagingOptions);
}


</script>

<style scoped>

</style>
