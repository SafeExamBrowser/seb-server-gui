<template>
    <BasicPage
        :title="$t('titles.scheduled-deletion')"
        :bread-crumb="[{ label: $t('titles.scheduled-deletion') }]"
        :data-test-id="dataTestId"
        :panel-left-collapsed="!filtersOpen"
    >
        <template #ActionButton>
            <AddButton
                :route="{ name: '/(app)/scheduled-deletion/create/' }"
                :label="$t('scheduledDelete.actions.add')"
                icon="mdi-plus"
                :data-test-id="dataTestId"
            />
        </template>

        <template #PanelLeft>
            <SearchBar
                v-model="list.searchInputValue"
                search-text="scheduledDelete.info.nameSearchPlaceholder"
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
                        <v-chip
                            size="small"
                            variant="tonal"
                            :color="
                                scheduledDeleteStatusColor[
                                    item.state as ScheduledDeleteStatusEnum
                                ]
                            "
                        >
                            {{ getName(item) }}
                        </v-chip>
                    </template>
                    <template #cell-state="{ value, formattedValue }">
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

    <DeleteConfirmDialog
        v-model="deleteFlow.dialogOpen"
        :detail-text="deleteFlow.detailText"
        translation-key-prefix="scheduledDelete.list"
        @confirm="deleteFlow.confirm"
    />
</template>

<script setup lang="ts">
import BasicPage from "@/components/layout/pages/BasicPage.vue";
import AddButton from "@/components/widgets/AddButton.vue";
import DeleteConfirmDialog from "@/components/widgets/confirmDialog/DeleteConfirmDialog.vue";
import EntityTable from "@/components/widgets/entity-table/EntityTable.vue";
import { TableItem } from "@/components/widgets/entity-table/types.ts";
import EnumChip from "@/components/widgets/EnumChip.vue";
import FilterControlsRow from "@/components/widgets/filters/FilterControlsRow.vue";
import { useListFilterPanel } from "@/components/widgets/filters/useListFilterPanel.ts";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import SearchBar from "@/components/widgets/searches/SearchBar.vue";
import {
    scheduledDeleteStatusColor,
    ScheduledDeleteStatusEnum,
} from "@/models/seb-server/scheduled-deletion.ts";
import { formatTimestampToDate } from "@/utils/timeUtils.ts";

import { useScheduledDeletionOverview } from "./composables/useScheduledDeletionOverview.ts";

definePage({
    meta: {
        titleKey: "titles.scheduled-deletion",
        pageTestId: "scheduled-deletion-page",
    },
});

const dataTestId = "scheduled-deletions";

const { list, deleteFlow } = useScheduledDeletionOverview();

const { filtersOpen, activePills, onRemovePill } = useListFilterPanel({
    filterSections: () => list.filterSections,
    selectedFilters: () => list.selectedFilters,
    setFilters: list.setFilters,
    date: { value: () => list.dateValue, clear: () => list.setDate(null) },
});

function getName(item: TableItem): string {
    if (item.state == ScheduledDeleteStatusEnum.PENDING) {
        return `Scheduled Deletion ${formatTimestampToDate(Number(String(item.scheduleTime)))}`;
    }

    return `Report ${formatTimestampToDate(Number(String(item.scheduleTime)))}`;
}
</script>
