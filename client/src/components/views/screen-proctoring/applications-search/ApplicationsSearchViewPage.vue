<template>
    <v-row>
        <v-col>
            <v-sheet 
                elevation="4"
                class="rounded-lg"
                title="Applications">

                <div style="visibility: hidden">placeholder</div>

                <v-form 
                    class="form-container"
                    @keyup.enter="getExamsStarted()"
                    @keyup.esc="clearForm()">

                    <!------------Time Period------------->
                    <v-row align="center">
                        <v-col cols="4">
                            {{ $t('searchForm.period') }}:
                        </v-col>
                        <v-col cols="1">
                            <v-radio    
                                :aria-label="$t('searchForm.period')"
                                v-model="timePeriodRadio" 
                                @click="radioButtonEvent('period')">
                            </v-radio>
                        </v-col>
                        <v-col cols="1">
                            {{ $t('searchForm.last') }}
                        </v-col>
                        <v-col cols="2">
                            <v-text-field
                                hide-details    
                                single-line
                                type="number"
                                density="compact"
                                variant="solo"
                                v-model="timePeriodField"
                                :disabled="!timePeriodRadio"
                                :aria-label="$t('searchForm.last')"> 
                            </v-text-field> 
                        </v-col>
                        <v-col cols="4">
                            <v-select
                                hide-details
                                variant="outlined"  
                                v-model="timePeriodSelect"
                                :items="[
                                    {title: $t('timePeriod.day'), value: 1},
                                    {title: $t('timePeriod.week'), value: 2},
                                    {title: $t('timePeriod.month'), value: 3},
                                    {title: $t('timePeriod.year'), value: 4}
                                ]"   
                                :disabled="!timePeriodRadio">
                            </v-select>
                        </v-col>
                    </v-row>
                    <!----------------------------------->


                    <!------------Time Selection------------->
                    <v-row align="center">
                        <v-col cols="4">
                            {{ $t('searchForm.between') }}:
                        </v-col>
                        <v-col cols="1">
                            <v-radio 
                                :aria-label="$t('searchForm.between')"
                                v-model="timeSelectionRadio" 
                                @click="radioButtonEvent('selection')">
                            </v-radio>
                        </v-col>
                        <v-col cols="7">
                            <VueDatePicker 
                                range
                                format="dd.MM.yyyy HH:mm"
                                v-model="timeSelectionPicker"  
                                :teleport="true"
                                :disabled="!timeSelectionRadio">
                            </VueDatePicker>
                        </v-col>
                    </v-row>
                    <!----------------------------------->

                    <!------------Buttons------------->
                    <v-row>
                        <v-col align="right">
                            <v-btn 
                                rounded="sm" 
                                color="black" 
                                variant="outlined"
                                @click="clearForm()">
                                {{ $t('searchForm.cancel') }}
                            </v-btn>

                            <v-btn 
                                rounded="sm" 
                                color="primary"     
                                variant="flat" 
                                class="ml-2"
                                @click="getExamsStarted()">
                                {{ $t('searchForm.search') }}
                            </v-btn>

                        </v-col>
                    </v-row>
                    <!----------------------------------->

                </v-form>
            </v-sheet>
        </v-col>
    </v-row>

    <v-row v-if="examListAvailable">
        <v-col v-if="noResutsFound">
            <v-sheet 
                elevation="4"
                class="rounded-lg pa-4"
                title="No results match your search criteria">
                <v-row>
                    <v-col align="left" class="text-h6">
                        No results match your search criteria
                    </v-col>
                </v-row>
            </v-sheet>
        </v-col>
        
        <v-col v-else>
            <ApplicationsExamList 
                elevation="4" 
                :exams="examsTable"
                @getGroupIdsForExam="getGroupIdsForExam"
            >
            </ApplicationsExamList>
        </v-col>
    </v-row>


    <template v-if="metadataAvailable">
        <v-sheet 
            v-for="examObject in examObjects"
            elevation="4"
            class="rounded-lg pa-4 mt-4"
            :title="examObject.exam.name">

            <ApplicationsSearchMetadata
                :examObject=examObject
            >
            </ApplicationsSearchMetadata>

        </v-sheet>
    </template>

    <AlertMsg 
        v-if="loadingStore.isTimeout"
        :alertProps="{
            title: 'temp title',
            color: 'error',
            type: 'snackbar',
            textKey: ''
        }">
    </AlertMsg>
</template>



<script setup lang="ts">
    import { ref, onBeforeMount, watch } from "vue";
    import { useAppBarStore, useTableStore, useLoadingStore } from "@/stores/store";
    import VueDatePicker from '@vuepic/vue-datepicker';
    import * as applicationsSearchViewService from "@/services/screen-proctoring/component-services/applicationsSearchViewService";
    import ApplicationsExamList from "./ApplicationsSearchExamList.vue";
    import ApplicationsSearchMetadata from "./ApplicationsSearchMetadata.vue";
    import * as timeUtils from "@/utils/timeUtils";
    import * as generalUtils from "@/utils/generalUtils";


    //store
    const appBarStore = useAppBarStore();
    const tableStore = useTableStore();
    const loadingStore = useLoadingStore();

    //form fields
    const timePeriodField = ref<number>(1);
    const timePeriodRadio = ref<boolean>(true);
    const timePeriodSelect = ref<number>(4);
    const timeSelectionRadio = ref<boolean>(false);
    const timeSelectionPicker = ref(null);

    //error handling
    const examListAvailable = ref<boolean>(false);
    const metadataAvailable = ref<boolean>(false);
    const noResutsFound = ref<boolean>(false);
    const errorAvailable = ref<boolean>();

    //main data
    const examsTable = ref<SPExam[]>([]);
    const examObjects = ref<{
        exam: SPExam, 
        metadataAppList: string[],
        groupIds: number[]
        }[]>([]);


    onBeforeMount(async () => {
        appBarStore.title = "Applications";
        await getExamsStarted();
    });


    //-------------------------------data fetching------------------------------------
    async function getExamsStarted(){
        errorAvailable.value = false;
        noResutsFound.value = false;
        metadataAvailable.value = false;
        examListAvailable.value = false;


        let fromTime: string = "";
        let toTime: string = "";
        if(timePeriodRadio.value) [fromTime, toTime] = timeUtils.calcTimePeriod(timePeriodSelect.value, timePeriodField.value);
        if(timeSelectionRadio.value) [fromTime, toTime] = timeUtils.calcTimeSelection(timeSelectionPicker);

        const examList: SPExam[] | null = await applicationsSearchViewService.getExamsStarted({fromTime: fromTime, toTime: toTime});

        if(examList == null){  
            errorAvailable.value = true;
            return;
        }

        if(examList.length == 0){
            noResutsFound.value = true;
            examListAvailable.value = true;
            return;
        }

        examListAvailable.value = true;
        examsTable.value = examList;
    }

    async function getGroupIdsForExam(selectedExams: SPExam[]){
        examObjects.value.length = 0;
        for(let i = 0; i < selectedExams.length; i++){
            //fetch groupdIds for the selected exams
            const groupIds: number[] | null = await applicationsSearchViewService.getGroupIdsForExam(selectedExams[i].id);
            if(groupIds == null) continue;

            //fetch metadataAppList for the selected exams
            const metadataAppList: string[] | null = await applicationsSearchViewService.getDistinctMetadataAppForExam(generalUtils.createStringIdList(groupIds));
            if(metadataAppList == null) continue;

            examObjects.value.push({
                exam: selectedExams[i],
                metadataAppList: metadataAppList,
                groupIds: groupIds
            });
        }

        loadingStore.isLoading = false;
        metadataAvailable.value = true;
    }
    //--------------------------------------------------------------------------------


    function clearForm(){
        timePeriodField.value = 1;
        timePeriodRadio.value = true;
        timePeriodSelect.value = 2;
        timeSelectionRadio.value = false;
        timeSelectionPicker.value = null;

        getExamsStarted();
    }






    function radioButtonEvent(button: string){
        if(button == "period"){
            timePeriodRadio.value = true;
            timeSelectionRadio.value = false;
        }

        if(button == "selection"){
            timeSelectionRadio.value = true;
            timePeriodRadio.value = false;
        }
    }




    


</script>




<style scoped>


    .form-container{
        padding-left: 20%;
        padding-right: 20%;
    }

</style>