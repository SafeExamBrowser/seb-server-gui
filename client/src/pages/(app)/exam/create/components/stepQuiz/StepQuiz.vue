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

        <v-data-table-server
            class="mt-4"
            :headers="headers"
            :items="quizzes?.content ?? []"
            :items-length="totalItems"
            :items-per-page="pageSize"
            :loading="loading"
            :hover="true"
            item-value="quiz_id"
            @update:options="handleOptionsUpdate"
        >
            <template #item="{ item }">
                <tr
                    :class="[
                        'cursor-pointer',
                        store.selectedQuiz?.quiz_id === item.quiz_id
                            ? 'bg-blue-lighten-5'
                            : '',
                    ]"
                    tabindex="0"
                    @click="handleRowClick(item)"
                    @keyup.enter="handleRowClick(item)"
                >
                    <td>{{ item.quiz_name }}</td>
                    <td>
                        {{ formatIsoToReadableDateTime(item.quiz_start_time) }}
                    </td>
                    <td>
                        {{ formatIsoToReadableDateTime(item.quiz_end_time) }}
                    </td>
                </tr>
            </template>
        </v-data-table-server>

        <LoadingFallbackComponent :loading="false" :errors="errors" />
    </StepItem>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { VDateInput } from "vuetify/components";
import StepItem from "@/components/widgets/stepItem/StepItem.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import { useStepQuizStore } from "./composables/store/useStepQuizStore.ts";
import { useStepAssessmentToolStore } from "@/pages/(app)/exam/create/components/stepAssessmentTool/composables/store/useStepAssessmentToolStore.ts";
import { useQuizzes } from "./composables/api/useQuizzes.ts";
import { Quiz } from "@/models/seb-server/quiz.ts";
import { formatIsoToReadableDateTime } from "@/utils/timeUtils.ts";

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

const pageSize = ref(10);
const pageNumber = ref(1);
const searchName = ref("");
const searchDate = ref<Date>();
const totalItems = computed(
    () =>
        (quizzes.value?.number_of_pages ?? 0) *
        (quizzes.value?.page_size ?? pageSize.value),
);

const errors = computed(() =>
    [errorLoading.value].filter((error) => error !== undefined),
);

const DEFAULT_SORT = "-quiz_start_time";

const loadItems = (forceNewSearch = false) => {
    if (assessmentToolStore.selectedAssessmentToolId === undefined) {
        return;
    }

    const force = forceNewSearch || !store.searchInitialized;
    store.searchInitialized = true;

    fetch(
        {
            pageNumber: pageNumber.value,
            pageSize: pageSize.value,
            sort: DEFAULT_SORT,
            name: searchName.value,
            startTimestampMillis: searchDate.value?.getTime(),
            lmsSetupId: assessmentToolStore.selectedAssessmentToolId,
        },
        force,
    );
};

const handleOptionsUpdate = (options: {
    page: number;
    itemsPerPage: number;
}) => {
    pageNumber.value = options.page;
    pageSize.value = options.itemsPerPage;
    loadItems();
};

const triggerSearch = () => {
    pageNumber.value = 1;
    loadItems(true);
};

const clearSearch = () => {
    searchName.value = "";
    searchDate.value = undefined;
    triggerSearch();
};

const handleRowClick = (quiz: Quiz) => {
    if (store.selectedQuiz?.quiz_id === quiz.quiz_id) {
        store.selectedQuiz = undefined;
        return;
    }
    store.selectedQuiz = quiz;
};

watch(
    () => assessmentToolStore.selectedAssessmentToolId,
    () => {
        store.selectedQuiz = undefined;
        loadItems(true);
    },
);
</script>
