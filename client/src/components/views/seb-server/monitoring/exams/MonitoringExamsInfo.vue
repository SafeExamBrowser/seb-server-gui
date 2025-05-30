<template>

    <v-row>
        <v-col>
            <v-sheet elevation="4" class="rounded-lg pl-4 pt-3 pr-4">

                <!------------title row------------->
                <v-row>
                    <v-col>
                        <div class="primary-text-color text-h5 font-weight-bold">
                            {{translate('monitoringExams.info.runningExams')}}
                        </div>
                    </v-col>
                </v-row>

                <!------------form------------->
                <v-row>
                    <v-spacer></v-spacer>

                    <v-col cols="4">
                        <v-form
                            @keyup.enter="loadMonitoringListItemsCaller()"
                            @keyup.esc="clearForm()">
                            <!------------search field------------->
                            <v-row align="center"> 
                                <v-col>
                                    {{translate("monitoringExams.info.search")}}
                                </v-col>
                                <v-col cols="9">
                                    <v-text-field
                                        single-line
                                        hide-details
                                        v-model="monitoringStore.searchField"
                                        type="text"
                                        append-inner-icon="mdi-magnify"
                                        density="compact"
                                        :placeholder="translate('monitoringExams.info.searchPlaceholder')"
                                        variant="outlined">
                                    </v-text-field>
                                </v-col>
                            </v-row>

                            <!------------start date------------->
                            <v-row align="center">
                                <v-col> 
                                    {{translate('monitoringExams.info.start')}}
                                </v-col>
                                <v-col cols="9" >
                                    <v-date-input 
                                        single-line
                                        hide-details
                                        v-model="datepicker"
                                        density="compact"
                                        variant="outlined"
                                        placeholder="dd.MM.yyyy"
                                        display-date-format="dd.MM.yyyy"
                                        input-format="dd.MM.yyyy"
                                        prepend-icon=""
                                        append-inner-icon="mdi-calendar">
                                    </v-date-input>
                                </v-col>
                            </v-row>

                            <!------------Buttons------------->
                            <v-row>
                                <v-col align="right">
                                    <v-btn 
                                        rounded="sm" 
                                        color="black" 
                                        variant="outlined"
                                        @click="clearForm()">
                                        {{translate("general.cancelButton")}}
                                    </v-btn>

                                    <v-btn 
                                        rounded="sm" 
                                        color="primary" 
                                        variant="flat" 
                                        class="ml-2"
                                        @click="loadMonitoringListItemsCaller()">
                                        {{translate("general.searchButton")}}
                                    </v-btn>

                                </v-col>
                            </v-row>
                        </v-form>
                    </v-col>

                    <!------------filters------------->
                    <v-col cols="4" class="ml-16">
                        <div class="primary-text-color text-subtitle-1">
                            {{translate('monitoringExams.info.filter')}}
                        </div>

                        <!------------type------------->
                        <div>
                            <v-chip 
                                v-for="filter in typeFilters"
                                :key="filter.value"

                                :variant="monitoringStore.activeTypeFilter == filter.value ? 'flat' : 'tonal'"
                                size="small" 
                                class="mr-2 mt-2"
                                @click="filter.eventFunction(filter.value)">
                                {{filter.name}}
                            </v-chip>
                        </div>

                        <!------------status------------->
                        <div>
                            <v-chip
                                v-for="filter in statusFilters"
                                :key="filter.value"

                                :variant="monitoringStore.activeStatusFilter == filter.value ? 'flat' : 'tonal'"
                                size="small"
                                class="mr-2 mt-2"
                                :color="filter.color"
                                @click="filter.eventFunction(filter.value)">
                                {{filter.name}}
                            </v-chip>
                        </div>
                    </v-col>

                    <v-spacer></v-spacer>
                </v-row>

            </v-sheet>
        </v-col>
    </v-row>

</template>

<script setup lang="ts">
    import {useMonitoringStore} from "@/stores/seb-server/monitoringStore";
    import { ExamStatusEnum, ExamTypeEnum } from "@/models/seb-server/examFiltersEnum";
    import * as generalUtils from "@/utils/generalUtils";
    import { VDateInput } from "vuetify/labs/VDateInput";
    import * as timeUtils from "@/utils/timeUtils";
    import {translate} from "@/utils/generalUtils";
    import { useI18n } from "vue-i18n";

    //i18n
    const i18n = useI18n();

    //stores
    const monitoringStore = useMonitoringStore();

    //datepicker
    const datepicker = ref();

    //emits - call loadMonitoringListItemsCaller in parent
    const emit = defineEmits<{
        loadMonitoringListItemsCaller: any;
    }>();

    //filters exam type
    const typeFilters: {name: string, value: ExamTypeEnum, eventFunction: (filter: ExamTypeEnum) => void}[] = [
        {name: translate(ExamTypeEnum.BYOD), value: ExamTypeEnum.BYOD, eventFunction: setActiveTypeFilter},
        {name: translate(ExamTypeEnum.MANAGED), value: ExamTypeEnum.MANAGED, eventFunction: setActiveTypeFilter},
        {name: translate(ExamTypeEnum.VDI), value: ExamTypeEnum.VDI, eventFunction: setActiveTypeFilter},
        {name: translate(ExamTypeEnum.UNDEFINED), value: ExamTypeEnum.UNDEFINED, eventFunction: setActiveTypeFilter}
    ];

    //filters exam status
    const statusFilters: {name: string, value: ExamStatusEnum, color: string, eventFunction: (filter: ExamStatusEnum) => void}[] = [
        {name: translate(ExamStatusEnum.RUNNING), value: ExamStatusEnum.RUNNING, color: generalUtils.getExamStatusFilterColor(ExamStatusEnum.RUNNING), eventFunction: setActiveStatusFilter},
        {name: translate(ExamStatusEnum.TEST_RUN), value: ExamStatusEnum.TEST_RUN, color: generalUtils.getExamStatusFilterColor(ExamStatusEnum.TEST_RUN), eventFunction: setActiveStatusFilter}
    ];

    function loadMonitoringListItemsCaller(){ 
        if(datepicker != null && datepicker.value != null){
            monitoringStore.startDate = datepicker.value.getTime();
        }

        emit("loadMonitoringListItemsCaller");
    }

    function clearForm(){
        monitoringStore.searchField = "";

        datepicker.value = null;
        monitoringStore.startDate = null;
        
        loadMonitoringListItemsCaller();
    }

    function setActiveTypeFilter(filter: ExamTypeEnum){
        if(monitoringStore.activeTypeFilter == filter){
            monitoringStore.activeTypeFilter = null;
            loadMonitoringListItemsCaller();
            return;
        }

        monitoringStore.activeTypeFilter = filter;
        loadMonitoringListItemsCaller();
    }

    function setActiveStatusFilter(filter: ExamStatusEnum){
        if(monitoringStore.activeStatusFilter == filter){
            monitoringStore.activeStatusFilter = null;
            loadMonitoringListItemsCaller();
            return;
        }

        monitoringStore.activeStatusFilter = filter;
        loadMonitoringListItemsCaller();
    }


</script>

<style scoped>


</style>