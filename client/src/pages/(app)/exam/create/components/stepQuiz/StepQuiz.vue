<template>
    <StepItem
        :title="$t('createExam.steps.quiz.title')"
        :subtitle="$t('createExam.steps.quiz.subtitle')"
        :manual-scroll-management="true"
    >
        <v-form @submit.prevent="triggerSearch" @keyup.esc="clearSearch">
            <v-row class="align-center" no-gutters>
                <v-col cols="5">
                    <v-text-field
                        v-model="searchName"
                        :label="$t('createExam.steps.quiz.fields.search.label')"
                        :placeholder="
                            $t(
                                'createExam.steps.quiz.fields.search.placeholder',
                            )
                        "
                        append-inner-icon="mdi-magnify"
                        density="compact"
                        hide-details
                        variant="outlined"
                    />
                </v-col>
                <v-col cols="3" class="pl-3">
                    <v-date-input
                        v-model="searchDate"
                        :label="
                            $t('createExam.steps.quiz.fields.startDate.label')
                        "
                        :placeholder="
                            $t(
                                'createExam.steps.quiz.fields.startDate.placeholder',
                            )
                        "
                        append-inner-icon="mdi-calendar"
                        density="compact"
                        display-date-format="dd.MM.yyyy"
                        hide-details
                        prepend-icon=""
                        variant="outlined"
                    />
                </v-col>
                <v-col cols="2" class="pl-3">
                    <v-btn color="primary" type="submit" variant="flat" block>
                        {{ $t("general.searchButton") }}
                    </v-btn>
                </v-col>
                <v-col cols="2" class="pl-3">
                    <v-btn variant="outlined" block @click="clearSearch">
                        {{ $t("general.cancelButton") }}
                    </v-btn>
                </v-col>
            </v-row>
        </v-form>

        <EntityTable
            class="mt-4"
            :headers="headers"
            :items="quizzes?.content ?? []"
            :page-count="pageCount"
            :options="options"
            :loading="loading"
            :cell-formatters="cellFormatters"
            :single-select="{ activeKey: store.selectedQuiz?.quiz_id }"
            item-key="quiz_id"
            data-test-id="create-exam-quiz"
            @update:options="handleOptionsUpdate"
            @click:row="handleRowClick"
        />

        <LoadingFallbackComponent :loading="false" :errors="errors" />
    </StepItem>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { VDateInput } from "vuetify/components";

import EntityTable from "@/components/widgets/entity-table/EntityTable.vue";
import type { TableItem } from "@/components/widgets/entity-table/types.ts";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import StepItem from "@/components/widgets/stepItem/StepItem.vue";
import type { ServerTablePaging } from "@/models/types.ts";
import { useStepAssessmentToolStore } from "@/pages/(app)/exam/create/components/stepAssessmentTool/composables/store/useStepAssessmentToolStore.ts";
import {
    calendarDateToUtcMillis,
    formatIsoToReadableDateTime,
} from "@/utils/timeUtils.ts";

import { useQuizzes } from "./composables/api/useQuizzes.ts";
import { useStepQuizStore } from "./composables/store/useStepQuizStore.ts";

const { t } = useI18n();
const store = useStepQuizStore();
const assessmentToolStore = useStepAssessmentToolStore();
const { data: quizzes, loading, error: errorLoading, fetch } = useQuizzes();

const headers = computed(() => [
    {
        title: t("createExam.steps.quiz.tableHeaders.name"),
        key: "quiz_name",
        width: "60%",
        sortable: false,
    },
    {
        title: t("createExam.steps.quiz.tableHeaders.start"),
        key: "quiz_start_time",
        width: "20%",
        sortable: false,
    },
    {
        title: t("createExam.steps.quiz.tableHeaders.end"),
        key: "quiz_end_time",
        width: "20%",
        sortable: false,
    },
]);

const formatQuizDateCell = (value: unknown) =>
    typeof value === "string" ? formatIsoToReadableDateTime(value) : "";

const cellFormatters = {
    quiz_start_time: formatQuizDateCell,
    quiz_end_time: formatQuizDateCell,
};

// Quizzes are always sorted by start time (descending); the columns are not
// user-sortable, so this stays fixed and is forwarded to the backend via
// `normaliseBasicListParams` (see `toServerPageQuery` in `useQuizzes`).
const options = ref<ServerTablePaging>({
    page: 1,
    itemsPerPage: 10,
    sortBy: [{ key: "quiz_start_time", order: "desc" }],
});

const searchName = ref("");
const searchDate = ref<Date>();

const pageCount = computed(() => quizzes.value?.number_of_pages ?? 0);

const errors = computed(() =>
    [errorLoading.value].filter((error) => error !== undefined),
);

const loadItems = (forceNewSearch = false) => {
    if (assessmentToolStore.selectedAssessmentToolId === undefined) {
        return;
    }

    const force = forceNewSearch || !store.searchInitialized;
    store.searchInitialized = true;

    fetch(
        options.value,
        {
            name: searchName.value,
            startTimestampMillis: searchDate.value
                ? calendarDateToUtcMillis(searchDate.value)
                : undefined,
            lmsSetupId: assessmentToolStore.selectedAssessmentToolId,
        },
        force,
    );
};

// Paging changes coming from the table footer. The sort order is fixed, so it
// is pinned here regardless of what the table echoes back. A programmatic page
// reset (e.g. on a new search) echoes the unchanged options back through this
// handler, so we ignore no-op updates to avoid a duplicate (and possibly
// non-forced) fetch.
const handleOptionsUpdate = (newOptions: ServerTablePaging) => {
    const next = { ...newOptions, sortBy: options.value.sortBy };

    if (
        next.page === options.value.page &&
        next.itemsPerPage === options.value.itemsPerPage
    ) {
        return;
    }

    options.value = next;
    loadItems();
};

const triggerSearch = () => {
    options.value = { ...options.value, page: 1 };
    loadItems(true);
};

const clearSearch = () => {
    searchName.value = "";
    searchDate.value = undefined;
    triggerSearch();
};

const handleRowClick = (item: TableItem) => {
    const quiz = quizzes.value?.content.find(
        (candidate) => candidate.quiz_id === item.quiz_id,
    );
    if (!quiz) {
        return;
    }

    store.selectedQuiz =
        store.selectedQuiz?.quiz_id === quiz.quiz_id ? undefined : quiz;
};

onMounted(() => {
    loadItems();
});

watch(
    () => assessmentToolStore.selectedAssessmentToolId,
    () => {
        store.selectedQuiz = undefined;
        triggerSearch();
    },
);
</script>
