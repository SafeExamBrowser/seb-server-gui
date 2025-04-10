<template>
    <AlertMsg
        v-if="monitoringStore.isMonitoringDisabled()"
        :alertProps="{
            title: monitoringStore.getMonitoringDisabledWarningText(),
            color: 'warning',
            type: 'alert',
            customText: ''
        }">
    </AlertMsg>

    <v-row v-else>
        <v-col>
            test
        </v-col>
    
    </v-row>


</template>

<script setup lang="ts">
    import { useMonitoringStore } from "@/stores/monitoringStore";
    import { useAppBarStore } from "@/stores/store";
    import {translate} from "@/utils/generalUtils";
    import * as monitoringViewService from "@/services/component-services/monitoringViewService";
    import * as generalUtils from "@/utils/generalUtils";
    import * as examViewService from "@/services/component-services/examViewService";


    //exam
    const examId = useRoute().params.examId.toString();

    //stores
    const monitoringStore = useMonitoringStore();
    const appBarStore = useAppBarStore();



    onBeforeMount(async () => {
        appBarStore.title = translate("titles.monitoring");

        if(monitoringStore.selectedExam == null){
            await getExam();
        }

        console.log(await monitoringViewService.getFullPage(examId));


        console.log(generalUtils.createStringIdList([1504,1455,1456]))

        console.log(await monitoringViewService.getStaticClientData(
            examId, 
            generalUtils.createStringIdList([1504,1455,1456])));


    });


    async function getExam(){
        const examResponse: Exam | null = await examViewService.getExam(examId);

        if(examResponse == null){
            return;
        }

        monitoringStore.selectedExam = examResponse;
    }




</script>

<style scoped>

</style>