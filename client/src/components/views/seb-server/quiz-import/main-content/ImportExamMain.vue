<template>
    <div class="h-100 w-100">
        <v-row>
            <v-col>
                <div class="text-h6 font-weight-bold mb-1">
                    {{ translate("quizImportWizard.examMain.title") }}
                </div>
                <div class="mb-10 text-body-2">
                    {{ translate("quizImportWizard.examMain.description") }}
                </div>

                <v-form
                    @keyup.enter="loadExamItemsCaller()"
                    @keyup.esc="clearForm()"
                >
                    <v-row align="center" class="mt-3" dense>
                        <v-col cols="5" md="5">
                            <div class="text-body-2">
                                {{
                                    translate(
                                        "quizImportWizard.examMain.searchName",
                                    )
                                }}
                            </div>
                        </v-col>
                        <v-col cols="3" md="3">
                            <div class="text-body-2 ml-3">
                                {{
                                    translate(
                                        "quizImportWizard.examMain.filterDate",
                                    )
                                }}
                            </div>
                        </v-col>
                        <v-spacer></v-spacer>
                    </v-row>

                    <v-row align="center" class="mb-6" dense>
                        <!-- Search -->
                        <v-col cols="5" md="5">
                            <v-text-field
                                v-model="quizImportStore.searchField"
                                append-inner-icon="mdi-magnify"
                                density="compact"
                                hide-details
                                :placeholder="
                                    translate(
                                        'quizImportWizard.examMain.examName',
                                    )
                                "
                                single-line
                                variant="outlined"
                            />
                        </v-col>

                        <!-- Date -->
                        <v-col cols="3" md="3">
                            <v-date-input
                                v-model="datepicker"
                                append-inner-icon="mdi-calendar"
                                class="ml-3"
                                label="Date picker HELLOOOOO"
                                density="compact"
                                display-date-format="dd.MM.yyyy"
                                hide-details
                                input-format="dd.MM.yyyy"
                                placeholder="dd.MM.yyyy"
                                prepend-icon=""
                                variant="outlined"
                            >
                            </v-date-input>
                        </v-col>

                        <v-col cols="2">
                            <v-btn
                                block
                                class="rounded"
                                color="primary"
                                variant="flat"
                                @click="loadExamItemsCaller()"
                            >
                                {{ translate("general.searchButton") }}
                            </v-btn>
                        </v-col>
                        <v-col cols="2">
                            <v-btn
                                block
                                class="rounded ml-0"
                                color="black"
                                variant="outlined"
                                @click="clearForm()"
                            >
                                {{ translate("general.cancelButton") }}
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-form>
            </v-col>
        </v-row>

        <v-row>
            <v-col>
                <v-data-table-server
                    class="elevation-1 rounded-lg"
                    :headers="quizzesTableHeaders"
                    :hover="true"
                    item-value="quiz_id"
                    :items="quizzes?.content"
                    :items-length="totalItems"
                    :items-per-page="
                        tableUtils.calcDefaultItemsPerPage(totalItems)
                    "
                    :items-per-page-options="
                        tableUtils.calcItemsPerPage(totalItems)
                    "
                    :loading="isLoading"
                    :loading-text="translate('general.loadingText')"
                    style="min-height: 38vh"
                    @update:options="loadItems"
                >
                    <template
                        #headers="{
                            columns,
                            isSorted,
                            getSortIcon,
                            toggleSort,
                        }"
                    >
                        <TableHeaders
                            :columns="columns"
                            :get-sort-icon="getSortIcon"
                            :header-refs-prop="quizzesTableHeadersRef"
                            :is-sorted="isSorted"
                            :toggle-sort="toggleSort"
                        />
                    </template>

                    <template #item="{ item }">
                        <tr
                            class="on-row-hover"
                            :class="[
                                quizImportStore.selectedQuiz?.quiz_id ===
                                item.quiz_id
                                    ? 'selected-row'
                                    : '',
                            ]"
                            tabindex="0"
                            @click="onTableRowClick(item)"
                            @keyup.enter="onTableRowClick(item)"
                        >
                            <td>{{ item.quiz_name }}</td>
                            <td>
                                {{
                                    timeUtils.formatIsoToReadableDateTime(
                                        item.quiz_start_time,
                                    )
                                }}
                            </td>
                            <td>
                                {{
                                    timeUtils.formatIsoToReadableDateTime(
                                        item.quiz_end_time,
                                    )
                                }}
                            </td>
                        </tr>
                    </template>
                </v-data-table-server>
            </v-col>
        </v-row>
    </div>
</template>

<script setup lang="ts">
import * as quizImportWizardViewService from "@/services/seb-server/component-services/quizImportWizardViewService";
import * as tableUtils from "@/utils/table/tableUtils";
import * as timeUtils from "@/utils/timeUtils";
import TableHeaders from "@/utils/table/TableHeaders.vue";
import { useQuizImportStore } from "@/stores/seb-server/quizImportStore";
import { storeToRefs } from "pinia";
import { translate, wait } from "@/utils/generalUtils";
import { VDateInput } from "vuetify/labs/VDateInput";
import { ref, watch } from "vue";

// stores
const quizImportStore = useQuizImportStore();
const quizImportStoreRef = storeToRefs(quizImportStore);

// items
const quizzes = ref<Quizzes>();

// table - pagination, item size, search
const isLoading = ref<boolean>(false);
const totalItems = ref<number>(5);

// table
const isOnLoad = ref<boolean>(true);
const defaultSort: { key: string; order: string }[] = [
    { key: "quiz_start_time", order: "desc" },
];
const quizzesTableHeadersRef = ref<any[]>();
const quizzesTableHeaders = ref([
    {
        title: translate("quizImportWizard.examMain.tableHeaderName"),
        key: "quiz_name",
        width: "60%",
    },
    {
        title: translate("quizImportWizard.examMain.tableHeaderStart"),
        key: "quiz_start_time",
        width: "20%",
    },
    {
        title: translate("quizImportWizard.examMain.tableHeaderEnd"),
        key: "quiz_end_time",
        width: "20%",
    },
]);

// emits - call loadExamItemsCaller in parent
defineEmits<{
    loadExamItemsCaller: any;
}>();

// datepicker
const datepicker = ref();

defineExpose({
    loadItems,
});

//= ======================events & watchers=======================
watch(quizImportStoreRef.selectedAssessmentTool, () => {
    if (quizImportStore.currentPagingOptions == null) {
        return;
    }
    loadItems(quizImportStore.currentPagingOptions);
});

// workaround es the method with "defineExpose" does not work
watch(quizImportStoreRef.loadExamItemsCaller, () => {
    if (quizImportStore.currentPagingOptions == null) {
        return;
    }

    if (quizImportStore.currentPagingOptions.itemsPerPage === 0) {
        quizImportStore.currentPagingOptions.itemsPerPage = 10;
    }
    loadItems(quizImportStore.currentPagingOptions);
});

function onTableRowClick(quiz: Quiz) {
    if (quiz.quiz_id === quizImportStore.selectedQuiz?.quiz_id) {
        quizImportStore.selectedQuiz = null;
        return;
    }

    quizImportStore.selectedQuiz = quiz;
}

let fetching = false;

//= ======================data fetching===================
async function loadItems(serverTablePaging: ServerTablePaging) {
    // if it is already loading skip call
    if (fetching) {
        return;
    }
    fetching = true;

    // clear the table first
    if (quizzes.value) {
        quizzes.value.content = [];
    }

    quizImportStore.currentPagingOptions = serverTablePaging;
    isLoading.value = true;

    // current solution to default sort the table
    // sort-by in data-table-server tag breaks the sorting as the headers are in a seperate component
    if (isOnLoad.value) {
        serverTablePaging.sortBy = defaultSort;
    }

    let startTimestamp: number | null = null;
    if (quizImportStore.startTimestamp != null) {
        startTimestamp = quizImportStore.startTimestamp;
    }

    let assessmentToolId: string | null = null;

    if (quizImportStore.selectedAssessmentTool != null) {
        assessmentToolId = quizImportStore.selectedAssessmentTool.toString();
    }

    const optionalParGetQuizzes: OptionalParGetQuizzes =
        tableUtils.assignQuizSelectPagingOptions(
            serverTablePaging,
            quizImportStore.searchField,
            startTimestamp,
            assessmentToolId,
            quizImportStore.forceNewSearch,
        );

    // reset forceNewSearch once we have applied it
    quizImportStore.forceNewSearch = false;

    let quizzesResponse: Quizzes | null =
        await quizImportWizardViewService.getQuizzes(optionalParGetQuizzes);

    if (quizzesResponse == null) {
        finishFatching();
        return;
    }

    // check if fetch is complete, if not ping until fetch is finished or breakerCount
    let allQuizzes = quizzesResponse.complete;
    quizzes.value = quizzesResponse;
    totalItems.value = quizzes.value.number_of_pages * quizzes.value.page_size;
    optionalParGetQuizzes.force_new_search = false;
    let breakerCount = 0;

    while (!allQuizzes && breakerCount < 30) {
        await wait(3000);
        quizzesResponse = await quizImportWizardViewService.getQuizzes(
            optionalParGetQuizzes,
        );
        if (quizzesResponse == null) {
            finishFatching();
            return;
        }
        quizzes.value = quizzesResponse;
        totalItems.value =
            quizzes.value.number_of_pages * quizzes.value.page_size;
        allQuizzes = quizzesResponse.complete;
        breakerCount++;
    }

    finishFatching();
}

function finishFatching() {
    isOnLoad.value = false;
    isLoading.value = false;
    fetching = false;
}

function loadExamItemsCaller() {
    if (datepicker.value != null && datepicker.value != null) {
        quizImportStore.startTimestamp = datepicker.value.getTime();
    }

    quizImportStore.forceNewSearch = true;
    if (quizImportStore.currentPagingOptions != null) {
        loadItems(quizImportStore.currentPagingOptions);
    }
}

function clearForm() {
    quizImportStore.searchField = "";
    datepicker.value = null;
    quizImportStore.startTimestamp = null;
    loadExamItemsCaller();
}

//= =====================================================
</script>

<style scoped>
.on-row-hover:hover {
    background: #e4e4e4 !important;
    cursor: pointer;
}

.selected-row {
    background-color: #e4e4e4 !important;
}

.on-row-hover:hover {
    background-color: #f5f5f5 !important;
    cursor: pointer;
}

.selected-row {
    background-color: #e0f2ff !important;
}
</style>
