<template>
    <div style="visibility: hidden">placeholder</div>
    <v-form 
        class="form-container"
        @keyup.enter="searchSessions()"
        @keyup.esc="clearForm()">

            <!------------Exam Name------------->
            <v-row align="center">
                <v-col cols="4">
                    {{ $t('searchForm.examName') }}:
                </v-col>
                <v-col cols="8">
                    <v-text-field
                        single-line
                        hide-details
                        density="compact"
                        variant="outlined"
                        v-model="examNameField"
                        :aria-label="$t('searchForm.examName')"
                    ></v-text-field>
                </v-col>
            </v-row>
            <!----------------------------------->

            <!------------Group Name------------->
            <v-row align="center">
                <v-col cols="4">
                    {{ $t('searchForm.groupName') }}:
                </v-col>
                <v-col cols="8">
                    <v-text-field
                        single-line
                        hide-details
                        density="compact"
                        variant="outlined"
                        v-model="groupNameField"
                        :aria-label="$t('searchForm.groupName')"
                    ></v-text-field>
                </v-col>
            </v-row>
            <!----------------------------------->

            <!------------Login- / Machinename"------------->
            <v-row>
                <v-col>
                    <v-expansion-panels>
                        <v-expansion-panel
                            :title="$t('searchForm.loginMachineTitle')">
                            <v-expansion-panel-text>

                                <!------------Login Name------------->
                                <v-row align="center">
                                    <v-col cols="4">
                                        {{ $t('searchForm.loginName') }}:
                                    </v-col>
                                    <v-col cols="8">
                                        <v-text-field
                                            single-line
                                            hide-details
                                            density="compact"
                                            variant="outlined"
                                            v-model="loginNameField"
                                            :aria-label="$t('searchForm.loginName')">
                                        </v-text-field>
                                    </v-col>
                                </v-row>
                                <!----------------------------------->

                                <!------------IP-Address------------->
                                <v-row align="center">
                                    <v-col cols="4">
                                        {{ $t('searchForm.ipAddress') }}:
                                    </v-col>
                                    <v-col cols="8">
                                        <v-text-field
                                            single-line
                                            hide-details
                                            density="compact"
                                            variant="outlined"
                                            v-model="ipAddressField"
                                            :aria-label="$t('searchForm.ipAddress')">
                                        </v-text-field>
                                    </v-col>
                                </v-row>
                                <!----------------------------------->

                                <!------------Machine Name------------->
                                <v-row align="center">
                                    <v-col cols="4">
                                    {{ $t('searchForm.machineName') }}:
                                    </v-col>
                                    <v-col cols="8">
                                        <v-text-field
                                            single-line
                                            hide-details
                                            density="compact"
                                            variant="outlined"
                                            v-model="machineNameField"
                                            :aria-label="$t('searchForm.machineName')">
                                        </v-text-field>
                                    </v-col>
                                </v-row>
                                <!----------------------------------->

                            </v-expansion-panel-text>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-col>
            </v-row>
            <!----------------------------------->

            <!------------Metadata------------->
            <v-row>
                <v-col>
                    <v-expansion-panels>
                        <v-expansion-panel
                        :title="$t('searchForm.metadataTitle')">
                            <v-expansion-panel-text>

                                <!------------Metatdata: Focused Application------------->
                                <v-row align="center">
                                    <v-col cols="4">
                                        {{ spConstants.APPLICATION_METADATA }}:
                                    </v-col>
                                    <v-col cols="8">
                                        <v-text-field
                                            single-line
                                            hide-details
                                            density="compact"
                                            variant="outlined"
                                            v-model="metadataApplicationField"
                                            :aria-label="spConstants.APPLICATION_METADATA">
                                        </v-text-field>
                                    </v-col>
                                </v-row>
                                <!----------------------------------->

                                <!------------Metatdata: SEB-Broswer Title------------->
                                <v-row align="center">
                                    <v-col cols="4">
                                        {{spConstants.SEB_BROWSER_TITLE_METADATA}}:
                                    </v-col>
                                    <v-col cols="8">
                                        <v-text-field
                                            single-line
                                            hide-details
                                            density="compact"
                                            variant="outlined"
                                            v-model="metadataBrowserTitleField"
                                            :aria-label="spConstants.SEB_BROWSER_TITLE_METADATA">
                                        </v-text-field>
                                    </v-col>
                                </v-row>
                                <!----------------------------------->

                                <!------------Metatdata: Activity Details------------->
                                <v-row align="center">
                                    <v-col cols="4">
                                        {{ spConstants.ACTIVITY_DETAILS_METADATA }}:
                                    </v-col>
                                    <v-col cols="8">
                                        <v-text-field
                                            single-line
                                            hide-details
                                            density="compact"
                                            variant="outlined"
                                            v-model="metadataActivityDetailsField"
                                            :aria-label="spConstants.ACTIVITY_DETAILS_METADATA">
                                        </v-text-field>
                                    </v-col>
                                </v-row>
                                <!----------------------------------->

                                <!------------Metatdata: Focused Window------------->
                                <v-row align="center">
                                    <v-col cols="4">
                                        {{ spConstants.WINDOW_TITLE_METADATA }}:
                                    </v-col>
                                    <v-col cols="8">
                                        <v-text-field
                                            single-line
                                            hide-details
                                            density="compact"
                                            variant="outlined"
                                            v-model="metadataWindowTitleField"
                                            :aria-label="spConstants.WINDOW_TITLE_METADATA">
                                        </v-text-field>
                                    </v-col>
                                </v-row>
                                <!----------------------------------->

                            </v-expansion-panel-text>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-col>
            </v-row>
            <!----------------------------------->

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
                        @click="searchSessions()">
                        {{ $t('searchForm.search') }}
                    </v-btn>

                </v-col>
            </v-row>
            <!----------------------------------->
    </v-form>
</template>

<script setup lang="ts">
    import { ref, onBeforeMount } from "vue";
    import * as spConstants from "@/utils/sp-constants";
    import VueDatePicker from "@vuepic/vue-datepicker";
    import "@vuepic/vue-datepicker/dist/main.css";
    import * as timeUtils from "@/utils/timeUtils";

    //emits (parent functions)
    const emit = defineEmits<{
        searchSessions: [
            examName: string,
            groupName: string, 
            loginName: string,
            ipAddress: string,
            machineName: string,

            metadataApplication: string,
            metadataBrowserTitle: string,
            metadataActivityDetails: string,
            metadataWindowTitle: string,

            fromTime: string,
            toTime: string,
            pageNumber: number
        ];
        closeAllPanels: any;
    }>();
    
    //form fields
    const groupNameField = ref<string>("");
    const examNameField = ref<string>("");

    const loginNameField = ref<string>("");
    const ipAddressField = ref<string>("");
    const machineNameField = ref<string>("");

    const metadataApplicationField = ref<string>("");
    const metadataBrowserTitleField = ref<string>("");
    const metadataActivityDetailsField = ref<string>("");
    const metadataWindowTitleField = ref<string>("");

    const timePeriodField = ref<number>(1);
    const timePeriodRadio = ref<boolean>(true);
    const timePeriodSelect = ref<number>(2);
    const timeSelectionRadio = ref<boolean>(false);
    const timeSelectionPicker = ref(null);

    onBeforeMount(async () => {
        searchSessions();
    });

    async function searchSessions(){
        emit("closeAllPanels");
        let fromTime: string = "";
        let toTime: string = "";
        if(timePeriodRadio.value) [fromTime, toTime] = timeUtils.calcTimePeriod(timePeriodSelect.value, timePeriodField.value);
        if(timeSelectionRadio.value) [fromTime, toTime] = timeUtils.calcTimeSelection(timeSelectionPicker);

        emit(
        "searchSessions", 
            examNameField.value,
            groupNameField.value, 
            loginNameField.value, 
            ipAddressField.value,
            machineNameField.value, 

            metadataApplicationField.value,
            metadataBrowserTitleField.value, 
            metadataActivityDetailsField.value, 
            metadataWindowTitleField.value, 

            fromTime, 
            toTime,
            1
        );
    }

    function clearForm(){
        examNameField.value = "";
        groupNameField.value = ""; 
        loginNameField.value = "";
        ipAddressField.value = "";
        machineNameField.value = ""; 

        metadataApplicationField.value = ""; 
        metadataBrowserTitleField.value = "";  
        metadataActivityDetailsField.value = ""; 
        metadataWindowTitleField.value = ""; 
        
        timePeriodField.value = 1;
        timePeriodRadio.value = true;
        timePeriodSelect.value = 2;
        timeSelectionRadio.value = false;
        timeSelectionPicker.value = null;

        searchSessions();
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