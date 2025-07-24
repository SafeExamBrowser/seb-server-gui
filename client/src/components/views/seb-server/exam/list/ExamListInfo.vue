<template>
    <!-- Breadcrumb & Title -->
    <v-row dense>
        <v-col cols="12" md="10" class="pl-5">
            <div class="path-text" style="visibility: hidden;">
                <span
                    class="link"
                    @click="navigateTo(constants.EXAM_ROUTE)"
                >
                    {{ translate("titles.exams") }}
                </span>
                &nbsp;>&nbsp;
            </div>
        </v-col>

        <v-col cols="12" md="10" class="pl-10">
            <div class="primary-text-color text-h4 font-weight-bold">
                {{ translate('examList.info.selectExam') }}
            </div>
        </v-col>

        <v-col cols="12" md="2" class="pl-10"></v-col>
    </v-row>

    <!-- Sheet Section -->
    <v-row>
        <v-col cols="12">
            <v-sheet class="rounded-lg pa-4" elevation="4" @keyup.enter="loadExamItemsCaller()"
                     @keyup.esc="clearForm()">
                <!-- Labels Row -->
                <v-row dense>
                    <v-col cols="12" md="6">
                        <div class="text-subtitle-1 font-weight-medium mb-2">
                            {{ translate("examList.info.examNameSearchPlaceholder") }}
                        </div>
                    </v-col>
                    <v-col cols="12" md="3">
                        <div class="text-subtitle-1 font-weight-medium mb-2">
                            {{ translate("examList.info.examStartSearchPlaceholder") }}
                        </div>
                    </v-col>
                </v-row>

                <!-- Inputs and Buttons -->
                <v-row dense>
                    <!-- Search Input -->
                    <v-col cols="12" md="6">
                        <v-text-field
                            v-model="examStore.searchField"
                            single-line
                            hide-details
                            density="compact"
                            variant="outlined"
                            append-inner-icon="mdi-magnify"
                            :placeholder="translate('examList.info.examName')"
                        >
                            <template #label>
                                {{ translate("examList.info.examName") }}
                            </template>
                        </v-text-field>
                    </v-col>

                    <!-- Date Picker -->
                    <v-col cols="12" md="3">
                        <v-date-input
                            v-model="datepicker"
                            single-line
                            hide-details
                            density="compact"
                            variant="outlined"
                            placeholder="dd.MM.yyyy"
                            display-date-format="dd.MM.yyyy"
                            input-format="dd.MM.yyyy"
                            prepend-icon=""
                            append-inner-icon="mdi-calendar"
                            class="ml-3"
                        >
                            <template #label>
                                {{ translate("examList.info.examStart") }}
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
                                    @click="loadExamItemsCaller()"
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

                    <!-- Filters Section -->
                    <v-col cols="12" class="pt-4">
                        <v-row>
                            <!-- Type Filters -->
                            <v-col cols="12" sm="3" md="6" lg="6" xl="4" xxl="3">
                                <div class="text-subtitle-2 font-weight-medium">
                                    {{ translate("examList.info.examType") }}
                                </div>
                                <v-chip
                                    v-for="filter in typeFilters"
                                    :key="filter.value"
                                    :variant="examStore.activeTypeFilter === filter.value ? 'flat' : 'tonal'"
                                    size="small"
                                    class="mr-2 mt-2"
                                    @click="filter.eventFunction(filter.value)"
                                >
                                    {{ filter.name }}
                                </v-chip>
                            </v-col>

                            <!-- Status Filters -->
                            <v-col cols="12" sm="9" md="6" lg="5" xl="4" xxl="2">
                                <div class="text-subtitle-2 font-weight-medium">
                                    {{ translate("examList.info.examState") }}
                                </div>
                                <v-chip
                                    v-for="filter in statusFilters"
                                    :key="filter.value"
                                    :variant="examStore.activeStatusFilter === filter.value ? 'flat' : 'tonal'"
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
import {useExamStore} from "@/stores/seb-server/examStore";
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
const examStore = useExamStore();

//datepicker
const datepicker = ref();

//emits - call loadExamItemsCaller in parent
const emit = defineEmits<{
    loadExamItemsCaller: any;
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
        name: translate(ExamStatusEnum.UP_COMING),
        value: ExamStatusEnum.UP_COMING,
        color: generalUtils.getExamStatusFilterColor(ExamStatusEnum.UP_COMING),
        eventFunction: setActiveStatusFilter
    },
    {
        name: translate(ExamStatusEnum.TEST_RUN),
        value: ExamStatusEnum.TEST_RUN,
        color: generalUtils.getExamStatusFilterColor(ExamStatusEnum.TEST_RUN),
        eventFunction: setActiveStatusFilter
    },
    {
        name: translate(ExamStatusEnum.RUNNING),
        value: ExamStatusEnum.RUNNING,
        color: generalUtils.getExamStatusFilterColor(ExamStatusEnum.RUNNING),
        eventFunction: setActiveStatusFilter
    },
    {
        name: translate(ExamStatusEnum.FINISHED),
        value: ExamStatusEnum.FINISHED,
        color: generalUtils.getExamStatusFilterColor(ExamStatusEnum.FINISHED),
        eventFunction: setActiveStatusFilter
    },
    {
        name: translate(ExamStatusEnum.ARCHIVED),
        value: ExamStatusEnum.ARCHIVED,
        color: generalUtils.getExamStatusFilterColor(ExamStatusEnum.ARCHIVED),
        eventFunction: setActiveStatusFilter
    }
];

function loadExamItemsCaller() {
    if (datepicker != null && datepicker.value != null) {
        examStore.startDate = datepicker.value.getTime();
    }

    emit("loadExamItemsCaller");
}

function clearForm() {
    examStore.searchField = "";

    datepicker.value = null;
    examStore.startDate = null;

    loadExamItemsCaller();
}

function setActiveTypeFilter(filter: ExamTypeEnum) {
    if (examStore.activeTypeFilter == filter) {
        examStore.activeTypeFilter = null;
        loadExamItemsCaller();
        return;
    }

    examStore.activeTypeFilter = filter;
    loadExamItemsCaller();
}

function setActiveStatusFilter(filter: ExamStatusEnum) {
    if (examStore.activeStatusFilter == filter) {
        examStore.activeStatusFilter = null;
        loadExamItemsCaller();
        return;
    }

    examStore.activeStatusFilter = filter;
    loadExamItemsCaller();
}

</script>

<style scoped>

.link {
    color: black;
    cursor: pointer;
}

.link-color {
    color: #215CAF;
    cursor: pointer;
}

</style>
