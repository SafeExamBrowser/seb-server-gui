<template>
    <BasicPage
        :title="$t('applicationsSearch.title')"
        :bread-crumb="[{ label: $t('applicationsSearch.title') }]"
        :data-test-id="dataTestId"
        :panel-left-collapsed="!filtersOpen"
    >
        <template #PanelLeft>
            <ApplicationsSearchForm
                :data-test-id="dataTestId"
                @search="handleSearch"
                @collapse="filtersOpen = false"
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
                    @click="filtersOpen = !filtersOpen"
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

                <template v-if="search.activeSummary">
                    <v-divider vertical class="align-self-stretch mx-1" />

                    <span
                        class="text-body-small text-medium-emphasis text-uppercase font-weight-medium"
                    >
                        {{ $t("searchForm.active") }}
                    </span>
                    <v-chip
                        color="primary"
                        variant="tonal"
                        class="font-weight-medium"
                        :data-testid="`${dataTestId}-time-pill`"
                    >
                        <v-icon start size="small" icon="mdi-clock-outline" />
                        {{ search.activeSummary }}
                    </v-chip>
                </template>
                <v-chip
                    v-if="search.metadataAvailable"
                    color="primary"
                    variant="tonal"
                    closable
                    class="font-weight-medium"
                    :data-testid="`${dataTestId}-selection-pill`"
                    @click:close="search.changeSelection()"
                >
                    <v-icon
                        start
                        size="small"
                        icon="mdi-file-document-outline"
                    />
                    {{
                        $t("applicationsSearch.examsSelected", {
                            count: search.submittedCount,
                        })
                    }}
                </v-chip>

                <v-spacer />

                <span
                    class="text-body-small text-medium-emphasis font-weight-medium text-no-wrap"
                >
                    {{
                        $t("applicationsSearch.examsStartedInRange", {
                            count: search.examCount,
                        })
                    }}
                </span>
            </div>

            <div class="pa-6">
                <!------------ error ------------->
                <v-alert
                    v-if="search.errorAvailable"
                    type="error"
                    variant="tonal"
                    class="mb-0"
                    :data-testid="`${dataTestId}-error`"
                >
                    {{ $t("applicationsSearch.error") }}
                </v-alert>

                <!------------ no results ------------->
                <div
                    v-else-if="search.noResultsFound"
                    class="text-center py-10"
                    :data-testid="`${dataTestId}-no-results`"
                >
                    <v-icon
                        icon="mdi-image-off-outline"
                        size="40"
                        class="text-disabled mb-2"
                    />
                    <div class="text-subtitle-1 font-weight-bold">
                        {{ $t("applicationsSearch.noResults") }}
                    </div>
                </div>

                <!------------ phase 1: select exams ------------->
                <v-card
                    v-else-if="!search.metadataAvailable"
                    border
                    rounded="lg"
                    :data-testid="`${dataTestId}-exams-card`"
                >
                    <div class="d-flex align-center ga-3 px-5 py-4">
                        <v-icon
                            icon="mdi-file-document-outline"
                            color="primary"
                        />
                        <span class="text-subtitle-1 font-weight-bold">
                            {{ $t("applicationsSearch.selectExams") }}
                        </span>
                        <v-chip size="small" variant="tonal">
                            {{ search.examCount }}
                        </v-chip>
                        <v-spacer />
                        <span
                            v-if="search.selectedCount > 0"
                            class="text-caption text-medium-emphasis font-weight-medium"
                        >
                            {{
                                $t("applicationsSearch.selectedCount", {
                                    count: search.selectedCount,
                                })
                            }}
                        </span>
                    </div>
                    <v-divider />

                    <EntityTable
                        :headers="search.headers"
                        :items="search.items"
                        :page-count="search.pageCount"
                        :items-per-page="search.options.itemsPerPage"
                        :options="search.options"
                        :loading="search.loading"
                        :cell-formatters="search.cellFormatters"
                        :selection="search.selection"
                        :data-test-id="dataTestId"
                        item-key="id"
                        @update:options="search.loadItems"
                    />

                    <v-divider />
                    <div
                        class="d-flex align-center flex-wrap ga-3 px-5 py-3 bg-surface-tint"
                    >
                        <span
                            class="text-caption text-medium-emphasis flex-grow-1"
                        >
                            {{ $t("applicationsSearch.selectHint") }}
                        </span>
                        <v-btn
                            color="primary"
                            variant="flat"
                            class="text-none"
                            :disabled="search.selectedCount === 0"
                            :loading="search.metadataLoading"
                            :data-testid="`${dataTestId}-view-applications-button`"
                            @click="search.viewApplications()"
                        >
                            {{ $t("applicationsSearch.viewApplications")
                            }}<template v-if="search.selectedCount > 0">
                                ({{ search.selectedCount }})</template
                            >
                            <v-icon end icon="mdi-arrow-right" />
                        </v-btn>
                    </div>
                </v-card>

                <!------------ phase 2: application metadata ------------->
                <template v-else>
                    <div class="d-flex align-center flex-wrap ga-4 mb-4">
                        <v-btn
                            variant="outlined"
                            color="primary"
                            class="text-none"
                            :data-testid="`${dataTestId}-change-selection-button`"
                            @click="search.changeSelection()"
                        >
                            <v-icon start icon="mdi-arrow-left" />
                            {{ $t("applicationsSearch.changeSelection") }}
                        </v-btn>
                        <span class="text-body-2 text-medium-emphasis">
                            <v-icon
                                icon="mdi-apps"
                                color="primary"
                                size="small"
                                class="mr-1"
                            />
                            {{ $t("applicationsSearch.applicationMetadata") }} ·
                            {{ search.examObjects.length }}
                        </span>
                    </div>

                    <div
                        v-if="search.examObjects.length === 0"
                        class="text-center py-10"
                        :data-testid="`${dataTestId}-no-metadata`"
                    >
                        <v-icon
                            icon="mdi-image-off-outline"
                            size="40"
                            class="text-disabled mb-2"
                        />
                        <div class="text-subtitle-1 font-weight-bold">
                            {{ $t("applicationsSearch.noMetadata") }}
                        </div>
                    </div>

                    <ApplicationsSearchMetadata
                        v-for="examObject in search.examObjects"
                        :key="examObject.exam.id"
                        class="mb-4"
                        :exam-object="examObject"
                    />
                </template>
            </div>
        </template>
    </BasicPage>
</template>

<script setup lang="ts">
import { ref } from "vue";
import BasicPage from "@/components/layout/pages/BasicPage.vue";
import EntityTable from "@/components/widgets/entity-table/EntityTable.vue";
import ApplicationsSearchForm from "./components/ApplicationsSearchForm.vue";
import ApplicationsSearchMetadata from "./components/ApplicationsSearchMetadata.vue";
import { useApplicationsSearch } from "./composables/useApplicationsSearch";
import type { ApplicationsSearchQuery } from "./types";

definePage({
    meta: {
        titleKey: "titles.spApplications",
        pageTestId: "applications-page",
    },
});

const dataTestId = "applications-search";

const filtersOpen = ref<boolean>(true);
const search = useApplicationsSearch();

async function handleSearch(query: ApplicationsSearchQuery) {
    await search.runSearch(query);
}
</script>
