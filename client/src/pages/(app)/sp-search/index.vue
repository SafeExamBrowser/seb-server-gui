<template>
    <BasicPage
        :title="$t('spSearch.title')"
        :bread-crumb="[{ label: $t('spSearch.title') }]"
        :data-test-id="dataTestId"
        :panel-left-collapsed="!filtersOpen"
    >
        <template #PanelLeft>
            <SpSearchForm
                ref="searchForm"
                :data-test-id="dataTestId"
                @search="handleSearch"
                @collapse="handleCollapseFilters"
            />
        </template>

        <template #PanelMain>
            <!------------ controls row ------------->
            <div
                class="d-flex align-center flex-wrap ga-2 px-6 pt-4 pb-1"
                :data-testid="`${dataTestId}-controls`"
            >
                <v-btn
                    :variant="filtersOpen ? 'flat' : 'outlined'"
                    :color="filtersOpen ? 'primary' : undefined"
                    class="text-none"
                    :data-testid="`${dataTestId}-toggle-filters-button`"
                    @click="handleToggleFilters"
                >
                    <v-icon
                        start
                        :icon="filtersOpen ? 'mdi-chevron-left' : 'mdi-magnify'"
                    />
                    {{
                        filtersOpen
                            ? $t("searchForm.hideSearch")
                            : $t("searchForm.search")
                    }}
                </v-btn>

                <template v-if="activeChipsAvailable">
                    <v-divider vertical class="align-self-stretch mx-1" />

                    <span
                        class="text-body-small text-medium-emphasis text-uppercase font-weight-medium"
                    >
                        {{ $t("searchForm.active") }}
                    </span>
                    <v-chip
                        v-if="submittedQuery?.summary"
                        color="primary"
                        variant="tonal"
                        class="font-weight-medium"
                        :data-testid="`${dataTestId}-time-pill`"
                    >
                        <v-icon start size="small" icon="mdi-clock-outline" />
                        {{ submittedQuery.summary }}
                    </v-chip>
                    <v-chip
                        v-for="chip in activeFilterChips"
                        :key="chip.key"
                        color="primary"
                        variant="tonal"
                        closable
                        class="font-weight-medium"
                        :data-testid="`${dataTestId}-filter-pill-${chip.key}`"
                        @click:close="handleRemoveFilter(chip.key)"
                    >
                        {{ chip.label }}: {{ chip.value }}
                    </v-chip>
                </template>

                <v-spacer />

                <span
                    v-if="searchResultAvailable && !noResultsFound"
                    class="text-body-small text-medium-emphasis font-weight-medium text-no-wrap"
                >
                    {{
                        $t("spSearch.daysWithSessions", {
                            count: sessionsDays.length,
                        })
                    }}
                </span>
                <v-btn
                    variant="text"
                    class="text-none"
                    :data-testid="`${dataTestId}-sort-button`"
                    @click="handleChangeSortOrder"
                >
                    <v-icon
                        start
                        :icon="
                            isSearchDescending
                                ? 'mdi-arrow-down'
                                : 'mdi-arrow-up'
                        "
                    />
                    {{ $t("spSearch.sortByDate") }}
                </v-btn>
                <v-btn
                    variant="text"
                    class="text-none"
                    :disabled="closeAllPanelsDisabled"
                    :data-testid="`${dataTestId}-collapse-all-button`"
                    @click="handleCloseAllPanels"
                >
                    <v-icon start icon="mdi-unfold-less-horizontal" />
                    {{ $t("spSearch.collapseAll") }}
                </v-btn>
            </div>

            <div class="pa-6">
                <!------------ error ------------->
                <v-alert
                    v-if="errorAvailable"
                    type="error"
                    variant="tonal"
                    :data-testid="`${dataTestId}-error`"
                >
                    {{ $t("spSearch.error") }}
                </v-alert>

                <!------------ no results ------------->
                <div
                    v-else-if="noResultsFound"
                    class="text-center py-10"
                    :data-testid="`${dataTestId}-no-results`"
                >
                    <v-icon
                        icon="mdi-magnify-remove-outline"
                        size="40"
                        class="text-disabled mb-2"
                    />
                    <div class="text-subtitle-1 font-weight-bold">
                        {{ $t("spSearch.noResults") }}
                    </div>
                </div>

                <!------------ results: one panel per day ------------->
                <v-expansion-panels
                    v-else-if="searchResultAvailable && searchParameters"
                    v-model="sessionPanels"
                    multiple
                >
                    <v-expansion-panel
                        v-for="day in sessionsDays"
                        :key="day"
                        :value="'sessionPanel' + day"
                        elevation="0"
                        class="border mb-3"
                        rounded="lg"
                        :data-testid="`${dataTestId}-day-panel`"
                    >
                        <v-expansion-panel-title>
                            <v-icon
                                icon="mdi-calendar-outline"
                                color="primary"
                                class="mr-3"
                            />
                            <span class="font-weight-bold">
                                {{ formatDayTitle(day) }}
                            </span>
                        </v-expansion-panel-title>

                        <v-expansion-panel-text>
                            <SearchSessionTable
                                :day="day"
                                :search-parameters="searchParameters"
                            />
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>
            </div>
        </template>
    </BasicPage>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

import BasicPage from "@/components/layout/pages/BasicPage.vue";
import { OptionalParSearchSessions } from "@/models/screen-proctoring/optionalParamters";
import SearchSessionTable from "@/pages/(app)/sp-search/components/SearchSessionTable.vue";
import SpSearchForm from "@/pages/(app)/sp-search/components/SpSearchForm.vue";
import {
    SP_SEARCH_FILTER_KEYS,
    SpSearchFilterKey,
    SpSearchQuery,
} from "@/pages/(app)/sp-search/types";
import { searchSessionsDay } from "@/services/screen-proctoring/searchService.ts";
import { useTableStore } from "@/stores/store";
import * as spConstants from "@/utils/sp-constants";

definePage({
    meta: {
        titleKey: "titles.spSearch",
        pageTestId: "sp-search-page",
    },
});

const dataTestId = "sp-search";

const { t, locale } = useI18n();

// error handling
const searchResultAvailable = ref<boolean>(false);
const noResultsFound = ref<boolean>(false);
const errorAvailable = ref<boolean>(false);

// main data
const sessionsDays = ref<string[]>([]);

// ui control
const filtersOpen = ref<boolean>(true);
const isSearchDescending = ref<boolean>(true);
const sessionPanels = ref<string[]>([]);
const closeAllPanelsDisabled = computed(() => sessionPanels.value.length === 0);

// store
const tableStore = useTableStore();

// submitted search
const searchForm = ref<InstanceType<typeof SpSearchForm>>();
const submittedQuery = ref<SpSearchQuery>();
const searchParameters = ref<OptionalParSearchSessions>();

const filterChipLabels = computed<Record<SpSearchFilterKey, string>>(() => ({
    examName: t("searchForm.examName"),
    groupName: t("searchForm.groupName"),
    loginName: t("searchForm.loginName"),
    ipAddress: t("searchForm.ipAddress"),
    machineName: t("searchForm.machineName"),
    metadataApplication: spConstants.APPLICATION_METADATA,
    metadataBrowserTitle: spConstants.SEB_BROWSER_TITLE_METADATA,
    metadataActivityDetails: spConstants.ACTIVITY_DETAILS_METADATA,
    metadataWindowTitle: spConstants.WINDOW_TITLE_METADATA,
}));

const activeFilterChips = computed(() => {
    const query = submittedQuery.value;
    if (!query) {
        return [];
    }

    return SP_SEARCH_FILTER_KEYS.filter((key) => query.filters[key] !== "").map(
        (key) => ({
            key,
            label: filterChipLabels.value[key],
            value: query.filters[key],
        }),
    );
});

const activeChipsAvailable = computed(
    () =>
        Boolean(submittedQuery.value?.summary) ||
        activeFilterChips.value.length > 0,
);

async function handleSearch(query: SpSearchQuery) {
    errorAvailable.value = false;
    noResultsFound.value = false;
    // every new search starts with all day panels collapsed
    sessionPanels.value = [];
    submittedQuery.value = query;

    searchParameters.value = {
        examName: toSearchValue(query.filters.examName),
        groupName: toSearchValue(query.filters.groupName),
        clientName: toSearchValue(query.filters.loginName),
        clientIp: toSearchValue(query.filters.ipAddress),
        clientMachineName: toSearchValue(query.filters.machineName),

        screenProctoringMetadataApplication: toSearchValue(
            query.filters.metadataApplication,
        ),
        screenProctoringMetadataBrowser: toSearchValue(
            query.filters.metadataBrowserTitle,
        ),
        screenProctoringMetadataUserAction: toSearchValue(
            query.filters.metadataActivityDetails,
        ),
        screenProctoringMetadataWindowTitle: toSearchValue(
            query.filters.metadataWindowTitle,
        ),

        fromTime: query.fromTime,
        toTime: query.toTime,
        pageSize: 500,
        pageNumber: 1,
    };

    const sessionSearchResponse: string[] | null = await searchSessionsDay(
        searchParameters.value,
    );

    if (sessionSearchResponse == null) {
        errorAvailable.value = true;
        return;
    }

    sessionsDays.value = sessionSearchResponse;
    searchResultAvailable.value = true;

    if (sessionsDays.value.length === 0) {
        noResultsFound.value = true;
        return;
    }

    registerIpDisplayToggles();
    isSearchDescending.value = true;
}

// Empty inputs become undefined so they are omitted from the API request
// ("no filter").
function toSearchValue(value: string): string | undefined {
    return value === "" ? undefined : value;
}

// SearchSessionTable's Login Name / IP column toggle is tracked per day in the
// table store; make sure every day of this result set has an entry. Days seen
// in an earlier search keep their toggle state.
function registerIpDisplayToggles() {
    for (const day of sessionsDays.value) {
        if (!tableStore.isIpDisplayList.some((entry) => entry.day === day)) {
            tableStore.isIpDisplayList.push({ day, isIp: false });
        }
    }
}

// Removing a chip re-runs the submitted query without that filter. The form
// only has its matching field cleared; other unsubmitted edits stay drafts.
function handleRemoveFilter(key: SpSearchFilterKey) {
    const query = submittedQuery.value;
    if (!query) {
        return;
    }

    searchForm.value?.clearFilter(key);
    handleSearch({
        ...query,
        filters: { ...query.filters, [key]: "" },
    });
}

function handleToggleFilters() {
    filtersOpen.value = !filtersOpen.value;
}

function handleCollapseFilters() {
    filtersOpen.value = false;
}

function handleChangeSortOrder() {
    isSearchDescending.value = !isSearchDescending.value;
    sessionsDays.value.reverse();
}

function handleCloseAllPanels() {
    sessionPanels.value = [];
}

// "2025-06-12" → "Thursday, 12 June 2025" in the active locale.
function formatDayTitle(day: string): string {
    const date = new Date(day);
    if (Number.isNaN(date.getTime())) {
        return day;
    }

    return new Intl.DateTimeFormat(locale.value, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
    }).format(date);
}
</script>
