<template>

    <v-row v-if="isInfoExpanded">
        <v-col>
            <v-sheet elevation="4" class="rounded-lg pl-4 pt-3 pr-4">

                <!------------title row------------->
                <v-row>
                    <v-col>
                        <div class="primary-text-color text-h5 font-weight-bold">
                            Client List
                        </div>
                    </v-col>
                </v-row>
                <!----------------------------------->

                <v-row>
                    <v-spacer></v-spacer>

                    <v-col cols="4">
                        <v-form
                            @keyup.enter="loadmonitoringListItemsCaller()"
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
                            <!----------------------------------->

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
                                        @click="loadmonitoringListItemsCaller()">
                                        {{translate("general.searchButton")}}
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
                                    Groups
                                </div>
                                <div>
                                    <v-chip 
                                        v-for="clientGroup in monitoringStore.clientGroups?.content"
                                        :key="clientGroup.id"
                                        :variant="monitoringStore.clientGroupFilters.includes(clientGroup.id!) ? 'flat' : 'tonal'"
                                        size="small" 
                                        class="mr-2 mt-2"
                                        @click="monitoringStore.cultivateClientGroupFilter(clientGroup.id!)">
                                        {{clientGroup.name}}
                                    </v-chip>
                                </div>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-spacer></v-spacer>

                    <v-col class="d-flex flex-column">
                        <div class="d-flex justify-end mt-auto">
                            <v-icon 
                                variant="flat" 
                                icon="mdi-chevron-up"
                                @click="isInfoExpanded = !isInfoExpanded">
                            </v-icon>
                        </div>
                    </v-col>
                    <!-- <v-spacer></v-spacer> -->
                </v-row>

            </v-sheet>
        </v-col>
    </v-row>

    <v-row v-else>
        <v-col>
            <v-sheet elevation="4" class="rounded-lg pl-4 pt-3 pr-4">
                <v-row>
                    <v-col>
                        <div class="primary-text-color text-h5 font-weight-bold">
                            Client List
                        </div>
                    </v-col>
                    <v-col class="d-flex flex-column">
                        <div class="d-flex justify-end mt-auto">
                            <v-icon 
                                variant="flat" 
                                icon="mdi-chevron-down"
                                @click="isInfoExpanded = !isInfoExpanded">
                            </v-icon>
                        </div>
                    </v-col>
                </v-row>
            </v-sheet>
        </v-col>
    </v-row>

</template>

<script setup lang="ts">
    import {useMonitoringStore} from "@/stores/monitoringStore";
    import { ExamStatusEnum, ExamTypeEnum } from "@/models/examFiltersEnum";
    import * as generalUtils from "@/utils/generalUtils";
    import { VDateInput } from "vuetify/labs/VDateInput";
    import * as timeUtils from "@/utils/timeUtils";
    import {translate} from "@/utils/generalUtils";
    import { useI18n } from "vue-i18n";
    import {ConnectionStatusEnum} from "@/models/connectionStatusEnum";


    //i18n
    const i18n = useI18n();

    //info panel (whole component)
    const isInfoExpanded = ref<boolean>(true);

    //stores
    const monitoringStore = useMonitoringStore();

    //datepicker
    const datepicker = ref();

    //emits - call loadmonitoringListItemsCaller in parent
    const emit = defineEmits<{
        loadmonitoringListItemsCaller: any;
    }>();

    //filters exam type
    const typeFilters: {name: string, value: ExamTypeEnum, eventFunction: (filter: ExamTypeEnum) => void}[] = [
        {name: translate(ExamTypeEnum.BYOD), value: ExamTypeEnum.BYOD, eventFunction: setActiveTypeFilter},
        {name: translate(ExamTypeEnum.MANAGED), value: ExamTypeEnum.MANAGED, eventFunction: setActiveTypeFilter},
        {name: translate(ExamTypeEnum.VDI), value: ExamTypeEnum.VDI, eventFunction: setActiveTypeFilter},
        {name: translate(ExamTypeEnum.UNDEFINED), value: ExamTypeEnum.UNDEFINED, eventFunction: setActiveTypeFilter}
    ];

    function loadmonitoringListItemsCaller(){ 
        if(datepicker != null && datepicker.value != null){
            monitoringStore.startDate = datepicker.value.getTime();
        }

        emit("loadmonitoringListItemsCaller");
    }

    function clearForm(){
        monitoringStore.searchField = "";

        datepicker.value = null;
        monitoringStore.startDate = null;
        
        loadmonitoringListItemsCaller();
    }

    function setActiveTypeFilter(filter: ExamTypeEnum){
        // if(monitoringStore.activeTypeFilter == filter){
        //     monitoringStore.activeTypeFilter = null;
        //     loadmonitoringListItemsCaller();
        //     return;
        // }

        // monitoringStore.activeTypeFilter = filter;
        // loadmonitoringListItemsCaller();
    }


</script>

<style scoped>


</style>