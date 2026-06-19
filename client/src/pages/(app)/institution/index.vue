<template>
    <BasicPage
        :title="$t('titles.institutions')"
        :bread-crumb="[{ label: $t('titles.institutions') }]"
        :data-test-id="dataTestId"
        :panel-left-collapsed="!filtersOpen"
    >
        <template #SubNav>
            <SettingsNavigation />
        </template>

        <template #ActionButton>
            <AddButton
                :route="{ name: '/(app)/institution/create/' }"
                :data-test-id="dataTestId"
            />
        </template>

        <template #PanelLeft>
            <SearchBar
                v-model="list.searchInputValue"
                :applied-search="list.searchField"
                search-text="institutions.list.filters.searchField"
                :filter-sections="list.filterSections"
                :filter-values="list.selectedFilters"
                :data-test-id="dataTestId"
                @search="list.onSearch"
                @clear="list.onClearSearch"
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
                    :actions="list.actions"
                    :data-test-id="dataTestId"
                    item-key="id"
                    @update:options="list.loadItems"
                >
                    <template #cell-logoImage="{ item, rowTestId }">
                        <v-img
                            v-if="logoSrcOf(item)"
                            :src="logoSrcOf(item)"
                            :max-height="40"
                            :max-width="80"
                            :data-test-id="`${rowTestId}-logo`"
                        />
                    </template>
                    <template #cell-active="{ item, rowTestId }">
                        <ActiveStatusChip
                            :active="!!item.active"
                            :data-test-id="`${rowTestId}-status-chip`"
                            @click="statusFlow.openDialog(item)"
                        />
                    </template>
                </EntityTable>
            </LoadingFallbackComponent>
        </template>
    </BasicPage>

    <DeleteConfirmDialog
        v-model="deleteFlow.dialogOpen"
        :detail-text="deleteFlow.detailText"
        translation-key-prefix="institutions.list"
        :data-test-id="dataTestId"
        @confirm="deleteFlow.confirm"
    />

    <StatusConfirmDialog
        v-model="statusFlow.dialogOpen"
        :active="!!statusFlow.target?.active"
        translation-key-prefix="institutions.list"
        :data-test-id="dataTestId"
        @confirm="statusFlow.confirm"
    />
</template>

<script setup lang="ts">
import BasicPage from "@/components/layout/pages/BasicPage.vue";
import SettingsNavigation from "@/components/widgets/navigation/SettingsNavigation.vue";
import SearchBar from "@/components/widgets/searches/SearchBar.vue";
import EntityTable from "@/components/widgets/entity-table/EntityTable.vue";
import FilterControlsRow from "@/components/widgets/filters/FilterControlsRow.vue";
import { useListFilterPanel } from "@/components/widgets/filters/useListFilterPanel.ts";
import ActiveStatusChip from "@/components/widgets/ActiveStatusChip.vue";
import DeleteConfirmDialog from "@/components/widgets/confirmDialog/DeleteConfirmDialog.vue";
import StatusConfirmDialog from "@/components/widgets/confirmDialog/StatusConfirmDialog.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import AddButton from "@/components/widgets/AddButton.vue";
import type { TableItem } from "@/components/widgets/entity-table/types.ts";
import { useInstitutionsOverview } from "./composables/useInstitutionsOverview.ts";

definePage({
    meta: {
        titleKey: "titles.institutions",
        pageTestId: "institutions-page",
        isPageBlue: true,
    },
});

const dataTestId = "institutions";

const { list, deleteFlow, statusFlow } = useInstitutionsOverview();

const { filtersOpen, activePills, onRemovePill } = useListFilterPanel({
    search: { applied: () => list.searchField, clear: list.onClearSearch },
    filterSections: () => list.filterSections,
    selectedFilters: () => list.selectedFilters,
    setFilters: list.setFilters,
});

function logoSrcOf(item: TableItem): string | undefined {
    const logo = item.logoImage;
    return typeof logo === "string" && logo !== "" ? logo : undefined;
}
</script>
