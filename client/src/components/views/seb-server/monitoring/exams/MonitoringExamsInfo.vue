<template>
    <!-- Breadcrumb and Title-->
    <v-row dense>
        <v-col cols="12" md="10" class="pl-5">
            <div class="path-text" style="visibility: hidden;">
                <span
                    class="link"
                    @click="navigateTo(constants.MONITORING_ROUTE)"
                >
                    {{ translate("titles.monitoring") }}
                </span>
                &nbsp;>&nbsp;
            </div>
        </v-col>
        <v-col cols="12" md="10" class="pl-10">

            <div class="primary-text-color text-h4 font-weight-bold ">
                {{ translate('monitoringExams.info.runningExams') }}
            </div>
        </v-col>

        <v-col cols="12" md="2" class="pl-10 ">
        </v-col>
    </v-row>

    <!-- Sheet Section -->
    <v-row class="">
        <v-col cols="12" class="">
            <v-sheet class="rounded-lg pa-4" elevation="4"
                     @keyup="handleKeyUp"
            >
                <!-- Search Titles -->
                <v-row dense>
                    <v-col cols="12" md="6">
                        <div class="text-subtitle-1 font-weight-medium mb-2">
                            {{ translate("monitoringExams.info.examNameSearchPlaceholder") }}
                        </div>
                    </v-col>
                    <v-col cols="12" md="3">
                        <div class="text-subtitle-1 font-weight-medium mb-2">
                            {{ translate("monitoringExams.info.examStartSearchPlaceholder") }}
                        </div>
                    </v-col>
                </v-row>
                <v-row dense>

                    <!-- Search Input -->
                    <v-col cols="12" md="6">
                        <v-text-field
                            v-model="monitoringStore.searchField"
                            single-line
                            hide-details
                            density="compact"
                            variant="outlined"
                            append-inner-icon="mdi-magnify"
                            :placeholder="translate('monitoringExams.info.examName')"
                        >
                            <template #label>
                                {{ translate("monitoringExams.info.examName") }}
                            </template>
                        </v-text-field>
                    </v-col>

                    <!-- Start Date Picker -->
                    <v-col cols="12" md="3">
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
                            append-inner-icon="mdi-calendar"
                            class="ml-3">
                            <template #label>
                                {{ translate("monitoringExams.info.examStart") }}
                            </template>
                        </v-date-input>
                    </v-col>

                    <!-- Buttons -->
                    <v-col cols="12" md="3">
                        <v-row>
                            <v-col cols="4">
                            </v-col>
                            <v-col cols="4" class="pl-0">
                                <v-btn
                                    block
                                    color="primary"
                                    variant="flat"
                                    class="rounded"
                                    @click="loadMonitoringListItemsCaller()"
                                >
                                    {{ translate("general.searchButton") }}
                                </v-btn>
                            </v-col>
                            <v-col cols="4" class="pl-0">
                                <v-btn
                                    block
                                    color="black"
                                    variant="outlined"
                                    class="rounded ml-0"
                                    @click="clearForm()"
                                >
                                    {{ translate("general.cancelButton") }}
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-col>


                    <!-- Filters -->
                    <v-col cols="12" class="pt-4">
                        <!-- Type Filters -->
                        <v-row>
                            <v-col cols="12" sm="3" md="6" lg="6" xl="4" xxl="3">
                                <div class="text-subtitle-2 font-weight-medium ">
                                    {{ translate("monitoringExams.info.examType") }}
                                </div>
                                <v-chip
                                    v-for="filter in typeFilters"
                                    :key="filter.value"
                                    :variant="monitoringStore.activeTypeFilter === filter.value ? 'flat' : 'tonal'"
                                    size="small"
                                    class="mr-2 mt-2"
                                    @click="filter.eventFunction(filter.value)"
                                >
                                    {{ filter.name }}
                                </v-chip>
                            </v-col>

                            <!-- Exam State Filters -->
                            <v-col cols="12" sm="9" md="6" lg="5" xl="4" xxl="2">
                                <div class="text-subtitle-2 font-weight-medium">
                                    {{ translate("monitoringExams.info.examState") }}
                                </div>

                                <v-chip
                                    v-for="filter in statusFilters"
                                    :key="filter.value"
                                    :variant="monitoringStore.activeStatusFilter === filter.value ? 'flat' : 'tonal'"
                                    :color="filter.color"
                                    size="small"
                                    class="mr-2 mt-2"
                                    @click="filter.eventFunction(filter.value)"
                                >
                                    {{ filter.name }}
                                </v-chip>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </v-sheet>
        </v-col>
    </v-row>
</template>


<script setup lang="ts">
import {useMonitoringStore} from "@/stores/seb-server/monitoringStore";
import {ExamStatusEnum, ExamTypeEnum} from "@/models/seb-server/examFiltersEnum";
import * as generalUtils from "@/utils/generalUtils";
import {VDateInput} from "vuetify/labs/VDateInput";
import {translate} from "@/utils/generalUtils";
import {useI18n} from "vue-i18n";
import {navigateTo} from "@/router/navigation";
import * as constants from "@/utils/constants";


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
const typeFilters: { name: string, value: ExamTypeEnum, eventFunction: (filter: ExamTypeEnum) => void }[] = [
    {name: translate(ExamTypeEnum.BYOD), value: ExamTypeEnum.BYOD, eventFunction: setActiveTypeFilter},
    {name: translate(ExamTypeEnum.MANAGED), value: ExamTypeEnum.MANAGED, eventFunction: setActiveTypeFilter},
    {name: translate(ExamTypeEnum.VDI), value: ExamTypeEnum.VDI, eventFunction: setActiveTypeFilter},
    {name: translate(ExamTypeEnum.UNDEFINED), value: ExamTypeEnum.UNDEFINED, eventFunction: setActiveTypeFilter}
];

//filters exam status
const statusFilters: {
    name: string,
    value: ExamStatusEnum,
    color: string,
    eventFunction: (filter: ExamStatusEnum) => void
}[] = [
    {
        name: translate(ExamStatusEnum.RUNNING),
        value: ExamStatusEnum.RUNNING,
        color: generalUtils.getExamStatusFilterColor(ExamStatusEnum.RUNNING),
        eventFunction: setActiveStatusFilter
    },
    {
        name: translate(ExamStatusEnum.TEST_RUN),
        value: ExamStatusEnum.TEST_RUN,
        color: generalUtils.getExamStatusFilterColor(ExamStatusEnum.TEST_RUN),
        eventFunction: setActiveStatusFilter
    }
];

function loadMonitoringListItemsCaller() {
    if (datepicker != null && datepicker.value != null) {
        monitoringStore.startDate = datepicker.value.getTime();
    }

    emit("loadMonitoringListItemsCaller");
}

function clearForm() {
    monitoringStore.searchField = "";

    datepicker.value = null;
    monitoringStore.startDate = null;

    loadMonitoringListItemsCaller();
}

function setActiveTypeFilter(filter: ExamTypeEnum) {
    if (monitoringStore.activeTypeFilter == filter) {
        monitoringStore.activeTypeFilter = null;
        loadMonitoringListItemsCaller();
        return;
    }

    monitoringStore.activeTypeFilter = filter;
    loadMonitoringListItemsCaller();
}

function setActiveStatusFilter(filter: ExamStatusEnum) {
    if (monitoringStore.activeStatusFilter == filter) {
        monitoringStore.activeStatusFilter = null;
        loadMonitoringListItemsCaller();
        return;
    }

    monitoringStore.activeStatusFilter = filter;
    loadMonitoringListItemsCaller();
}

function handleKeyUp(event: KeyboardEvent) {
    if (event.key === "Enter") {
        loadMonitoringListItemsCaller();
    } else if (event.key === "Escape") {
        clearForm();
    }
}


</script>

<style scoped>

.link {
    color: black;
    cursor: pointer;
}

.link-color {
    color: #215caf;
    cursor: pointer;
}
</style>
