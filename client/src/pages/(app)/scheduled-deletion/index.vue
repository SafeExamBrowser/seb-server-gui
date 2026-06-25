<template>
    <BasicPage
        :title="$t('titles.scheduled-deletion')"
        :bread-crumb="[{ label: $t('titles.scheduled-deletion') }]"
        :data-test-id="dataTestId"
        :panel-left-collapsed="false"
    >
        <template #PanelLeft>
            <SearchBar
                v-model="list.searchInputValue"
                search-text="examTemplateList.info.nameSearchPlaceholder"
                :enable-text-search="false"
                :filter-sections="list.filterSections"
                :filter-values="list.selectedFilters"
                :data-test-id="dataTestId"
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
            <!-- TODO @andrei: properly display errors, once we have a proper generic error component -->
            <div v-if="deleteFlow.error">
                {{ deleteFlow.error }}
            </div>
            <LoadingFallbackComponent :loading="false" :errors="list.errors">
                <EntityTable
                    class="px-2 pt-2"
                    :headers="list.headers"
                    :items="list.items"
                    :page-count="list.pageCount"
                    :items-per-page="list.options.itemsPerPage"
                    :options="list.options"
                    :loading="list.loading"
                    :detail-route="list.detailRoute"
                    :cell-formatters="list.cellFormatters"
                    :actions="list.actions"
                    :data-test-id="dataTestId"
                    item-key="id"
                    @update:options="list.loadItems"
                >
                    <template #cell-sdName="{ item }">
                        <v-chip size="small" variant="tonal">
                            {{
                                `Report ${formatIsoToReadableDateTime(String(item.dueTime))}`
                            }}
                        </v-chip>
                    </template>
                    <template #cell-status="{ value, formattedValue }">
                        <EnumChip
                            :label="formattedValue"
                            :color="
                                scheduledDeleteStatusColor[
                                    value as ScheduledDeleteStatusEnum
                                ]
                            "
                        />
                    </template>
                </EntityTable>
            </LoadingFallbackComponent>
        </template>
    </BasicPage>
</template>

<script setup lang="ts">
import BasicPage from "@/components/layout/pages/BasicPage.vue";
//import AddButton from "@/components/widgets/AddButton.vue";
import SearchBar from "@/components/widgets/searches/SearchBar.vue";
import EntityTable from "@/components/widgets/entity-table/EntityTable.vue";
import EnumChip from "@/components/widgets/EnumChip.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import FilterControlsRow from "@/components/widgets/filters/FilterControlsRow.vue";
import { useListFilterPanel } from "@/components/widgets/filters/useListFilterPanel.ts";
import { useScheduledDeletionOverview } from "./composables/useScheduledDeletionOverview.ts";
import {
    scheduledDeleteStatusColor,
    ScheduledDeleteStatusEnum,
} from "@/models/seb-server/sheduled-deletion.ts";
import { formatIsoToReadableDateTime } from "@/utils/timeUtils.ts";

definePage({
    meta: {
        titleKey: "titles.schedulete-deletion",
        pageTestId: "schedulete-deletion-page",
    },
});

const dataTestId = "scheduled-deletions";

const { list, deleteFlow } = useScheduledDeletionOverview();

const { filtersOpen, activePills, onRemovePill } = useListFilterPanel({
    //  search: { applied: () => list.searchField, clear: list.onClearSearch },
    filterSections: () => list.filterSections,
    selectedFilters: () => list.selectedFilters,
    setFilters: list.setFilters,
    date: { value: () => list.dateValue, clear: () => list.setDate(null) },
});
</script>
