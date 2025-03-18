<template>

    <v-row>
        <v-col>
            <v-sheet elevation="4" class="rounded-lg pa-8">

                <!------------title row------------->
                <v-row>
                    <v-col>
                        <div class="primary-text-color text-h5 font-weight-bold">
                            Select Exam
                        </div>
                    </v-col>
                </v-row>
                <!----------------------------------->

                <v-row>
                    <v-spacer></v-spacer>

                    <v-col cols="4">
                        <v-form
                            @keyup.enter="loadExamItemsCaller()"
                            @keyup.esc="clearForm()">
                            <!------------search field------------->
                            <v-row align="center"> 
                                <v-col>
                                    Search:
                                </v-col>
                                <v-col cols="9">
                                    <v-text-field
                                        single-line
                                        hide-details
                                        v-model="examStore.searchField"
                                        type="text"
                                        append-inner-icon="mdi-magnify"
                                        density="compact"
                                        placeholder="Search Exams"
                                        variant="outlined">
                                    </v-text-field>
                                </v-col>
                            </v-row>
                            <!----------------------------------->

                            <!------------start date------------->
                            <v-row align="center">
                                <v-col> 
                                    Start:
                                </v-col>
                                <v-col cols="9" >
                                    <v-date-input 
                                        single-line
                                        hide-details
                                        v-model="datepicker"
                                        density="compact"
                                        variant="outlined"
                                        placeholder="DD.MM.YYYY"
                                        prepend-icon=""
                                        append-inner-icon="mdi-calendar">
                                    </v-date-input>
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
                                        Cancel
                                    </v-btn>

                                    <v-btn 
                                        rounded="sm" 
                                        color="primary" 
                                        variant="flat" 
                                        class="ml-2"
                                        @click="loadExamItemsCaller()">
                                        Search
                                    </v-btn>

                                </v-col>
                            </v-row>
                            <!----------------------------------->
                        </v-form>

                    </v-col>

                    <v-col cols="4" class="ml-16">
                        <v-row>
                            <v-col>
                                <div class="primary-text-color text-subtitle-1">
                                    Filter
                                </div>
                                <div>
                                    <v-chip 
                                        v-for="filter in typeFilters"
                                        :key="filter.value"

                                        :variant="examStore.activeTypeFilter == filter.value ? 'flat' : 'tonal'"
                                        size="small" 
                                        class="mr-2 mt-2"
                                        @click="filter.eventFunction(filter.value)">
                                        {{filter.name}}
                                    </v-chip>
                                </div>
                                <div>
                                    <v-chip 
                                        v-for="filter in statusFilters"
                                        :key="filter.value"

                                        :variant="examStore.activeStatusFilter == filter.value ? 'flat' : 'tonal'"
                                        size="small" 
                                        class="mr-2 mt-2"
                                        :color="filter.color"
                                        @click="filter.eventFunction(filter.value)">
                                        {{filter.name}}
                                    </v-chip>
                                </div>
                            </v-col>
                        </v-row>
                    </v-col>

                    <v-spacer></v-spacer>
                </v-row>

            </v-sheet>
        </v-col>
    </v-row>

</template>

<script setup lang="ts">
    import {useExamStore} from "@/stores/examStore";
    import { ExamStatusEnum, ExamTypeEnum } from "@/models/examFiltersEnum";
    import * as generalUtils from "@/utils/generalUtils";
    import { VDateInput } from "vuetify/labs/VDateInput";
    import * as timeUtils from "@/utils/timeUtils";


    //stores
    const examStore = useExamStore();

    //datepicker
    const datepicker = ref();

    //emits - call loadExamItemsCaller in parent
    const emit = defineEmits<{
        loadExamItemsCaller: any;
    }>();

    //filters exam type
    const typeFilters: {name: string, value: ExamTypeEnum, eventFunction: (filter: ExamTypeEnum) => void}[] = [
        {name: "BYOD", value: ExamTypeEnum.BYOD, eventFunction: setActiveTypeFilter},
        {name: "Managed Devices", value: ExamTypeEnum.MANAGED, eventFunction: setActiveTypeFilter},
        {name: "VDI (Virtual Desktop Infrastructure)", value: ExamTypeEnum.VDI, eventFunction: setActiveTypeFilter},
        {name: "Not Defined", value: ExamTypeEnum.UNDEFINED, eventFunction: setActiveTypeFilter}
    ];

    //filters exam status
    const statusFilters: {name: string, value: ExamStatusEnum, color: string, eventFunction: (filter: ExamStatusEnum) => void}[] = [
        {name: "Up Coming", value: ExamStatusEnum.UP_COMING, color: generalUtils.getExamStatusFilterColor(ExamStatusEnum.UP_COMING), eventFunction: setActiveStatusFilter},
        {name: "Test Run", value: ExamStatusEnum.TEST_RUN, color: generalUtils.getExamStatusFilterColor(ExamStatusEnum.TEST_RUN), eventFunction: setActiveStatusFilter},
        {name: "Running", value: ExamStatusEnum.RUNNING, color: generalUtils.getExamStatusFilterColor(ExamStatusEnum.RUNNING), eventFunction: setActiveStatusFilter},
        {name: "Finished", value: ExamStatusEnum.FINISHED, color: generalUtils.getExamStatusFilterColor(ExamStatusEnum.FINISHED), eventFunction: setActiveStatusFilter},
        {name: "Archived", value: ExamStatusEnum.ARCHIVED, color: generalUtils.getExamStatusFilterColor(ExamStatusEnum.ARCHIVED), eventFunction: setActiveStatusFilter}
    ];

    function loadExamItemsCaller(){ 
        if(datepicker != null && datepicker.value != null){
            examStore.startDate = datepicker.value.getTime();
        }

        emit("loadExamItemsCaller");
    }

    function clearForm(){
        examStore.searchField = "";

        datepicker.value = null;
        examStore.startDate = null;
        
        loadExamItemsCaller();
    }

    function setActiveTypeFilter(filter: ExamTypeEnum){
        if(examStore.activeTypeFilter == filter){
            examStore.activeTypeFilter = null;
            loadExamItemsCaller();
            return;
        }

        examStore.activeTypeFilter = filter;
        loadExamItemsCaller();
    }

    function setActiveStatusFilter(filter: ExamStatusEnum){
        if(examStore.activeStatusFilter == filter){
            examStore.activeStatusFilter = null;
            loadExamItemsCaller();
            return;
        }

        examStore.activeStatusFilter = filter;
        loadExamItemsCaller();
    }

</script>

<style scoped>


</style>