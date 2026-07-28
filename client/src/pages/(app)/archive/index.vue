<template>
    <BasicPage
        :title="$t('titles.archive')"
        :bread-crumb="[{ label: $t('titles.archive') }]"
        :data-test-id="dataTestId"
        :panel-left-collapsed="!filtersOpen"
    >
        <template #PanelLeft>
            <SearchBar
                v-model="list.searchInputValue"
                :applied-search="list.searchField"
                search-text="examList.info.examNameSearchPlaceholder"
                date-title="examList.info.examStartSearchPlaceholder"
                :date-value="list.dateValue"
                :filter-sections="list.filterSections"
                :filter-values="list.selectedFilters"
                :data-test-id="dataTestId"
                :actions="multiSelectionActions"
                @search="list.onSearch"
                @clear="list.onClearSearch"
                @update:date-value="list.setDate"
                @update:filter-values="list.setFilters"
                @clear-filters="list.clearAll"
            />
        </template>
        <template #PanelMain>
            <FilterControlsRow
                :open="filtersOpen"
                :pills="activePills"
                :data-test-id="dataTestId"
                @toggle="filtersOpen = !filtersOpen"
                @remove="onRemovePill"
                @clear-all="list.clearAll"
            />
            <LoadingFallbackComponent
                :loading="archiveMultiFlow.loading"
                :errors="list.errors"
            >
                <TableMultiSelectionControl
                    :multi-selection="list.selection"
                    :clear-selection="clearSelection"
                    data-test-id="archiveSelectControl"
                    :selection-text="$t('examList.selected')"
                />

                <EntityTable
                    class="px-2 pt-2"
                    :headers="list.headers"
                    :items="list.items"
                    :page-count="list.pageCount"
                    :items-per-page="list.options.itemsPerPage"
                    :options="list.options"
                    :loading="list.loading"
                    :cell-formatters="list.cellFormatters"
                    :actions="list.actions"
                    :selection="list.selection"
                    :data-test-id="dataTestId"
                    item-key="id"
                    @update:options="list.loadItems"
                >
                    <template #cell-type="{ formattedValue }">
                        <EnumChip :label="formattedValue" />
                    </template>

                    <template #cell-status="{ item, value, formattedValue }">
                        <EnumChip
                            :label="formattedValue"
                            :color="examStatusColor[value as ExamStatusEnum]"
                        />
                        <v-icon
                            v-if="item.excludeFromDeletion"
                            icon="mdi-delete-off-outline"
                        >
                        </v-icon>
                        <v-tooltip
                            v-if="item.excludeFromDeletion"
                            activator="parent"
                            :aria-label="
                                $t('examList.info.excludeFromDeletion')
                            "
                            location="bottom"
                        >
                            {{ $t("examList.info.excludeFromDeletion") }}
                        </v-tooltip>
                    </template>
                </EntityTable>
            </LoadingFallbackComponent>
        </template>
    </BasicPage>

    <ConfirmDialog
        v-model="archiveFlow.dialogOpen"
        :title="$t('examList.archive.confirm.title')"
        :text="$t('examList.archive.confirm.text')"
        :confirm-label="$t('examList.archive.confirm.action')"
        :sub-title="archiveFlow.target?.quizName as string"
        icon="mdi-archive"
        @confirm="archiveFlow.confirm"
    />
    <ConfirmDialog
        v-model="archiveMultiFlow.dialogOpen"
        :title="$t('examList.archiveAll.confirm.title')"
        :text="$t('examList.archiveAll.confirm.text')"
        :confirm-label="$t('examList.archiveAll.confirm.action')"
        :sub-title="`${list.selection.selectionModel.value.length} exams selected`"
        icon="mdi-archive"
        @confirm="archiveMultiFlow.confirm"
    />
</template>

<script setup lang="ts">
import BasicPage from "@/components/layout/pages/BasicPage.vue";
import ConfirmDialog from "@/components/widgets/confirmDialog/ConfirmDialog.vue";
import TableMultiSelectionControl from "@/components/widgets/entity-table/components/TableMultiSelectionControl.vue";
import EntityTable from "@/components/widgets/entity-table/EntityTable.vue";
import EnumChip from "@/components/widgets/EnumChip.vue";
import FilterControlsRow from "@/components/widgets/filters/FilterControlsRow.vue";
import { useListFilterPanel } from "@/components/widgets/filters/useListFilterPanel.ts";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import SearchBar from "@/components/widgets/searches/SearchBar.vue";
import {
    examStatusColor,
    ExamStatusEnum,
} from "@/models/seb-server/examFiltersEnum.ts";
import { useArchiveOverview } from "@/pages/(app)/archive/composables/useArchiveOverview.ts";

const dataTestId = "archive";

const { list, archiveFlow, archiveMultiFlow, multiSelectionActions } =
    useArchiveOverview();

const { filtersOpen, activePills, onRemovePill } = useListFilterPanel({
    search: { applied: () => list.searchField, clear: list.onClearSearch },
    filterSections: () => list.filterSections,
    selectedFilters: () => list.selectedFilters,
    setFilters: list.setFilters,
    date: { value: () => list.dateValue, clear: () => list.setDate(null) },
});

function clearSelection() {
    list.selection.selectionModel.value = [];
}
</script>
