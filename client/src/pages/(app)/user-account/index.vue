<template>
    <BasicPage
        :title="$t('titles.userAccounts')"
        :bread-crumb="[{ label: $t('titles.userAccounts') }]"
        :data-test-id="dataTestId"
        :panel-left-collapsed="!filtersOpen"
    >
        <template #SubNav>
            <SettingsNavigation />
        </template>

        <template #ActionButton>
            <AddButton
                :route="{ name: '/(app)/user-account/create/' }"
                :data-test-id="dataTestId"
            />
        </template>

        <template #PanelLeft>
            <SearchBar
                v-model="list.searchInputValue"
                :applied-search="list.searchField"
                search-text="userAccount.list.filters.searchField"
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
                    :cell-formatters="list.cellFormatters"
                    :actions="list.actions"
                    :data-test-id="dataTestId"
                    :item-key="userAccountListConfig.itemKey"
                    @update:options="list.loadItems"
                >
                    <template #cell-active="{ item, rowTestId }">
                        <ActiveStatusChip
                            :active="!!item.active"
                            :disabled="statusFlow.disabled(item)"
                            :tooltip="statusFlow.tooltip(item)"
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
        :title="$t('userAccount.list.deleteDialog.title')"
        :text="$t('userAccount.list.deleteDialog.text')"
        :confirm-label="$t('userAccount.list.deleteDialog.action')"
        :detail-text="deleteFlow.detailText"
        :data-test-id="dataTestId"
        @confirm="deleteFlow.confirm"
    />

    <StatusConfirmDialog
        v-model="statusFlow.dialogOpen"
        :active="!!statusFlow.target?.active"
        :activate="{
            title: $t('userAccount.list.statusDialog.activateTitle'),
            text: $t('userAccount.list.statusDialog.activateText'),
            action: $t('userAccount.list.statusDialog.activateAction'),
        }"
        :deactivate="{
            title: $t('userAccount.list.statusDialog.deactivateTitle'),
            text: $t('userAccount.list.statusDialog.deactivateText'),
            action: $t('userAccount.list.statusDialog.deactivateAction'),
        }"
        :data-test-id="dataTestId"
        @confirm="statusFlow.confirm"
    />
</template>

<script setup lang="ts">
import BasicPage from "@/components/layout/pages/BasicPage.vue";
import ActiveStatusChip from "@/components/widgets/ActiveStatusChip.vue";
import AddButton from "@/components/widgets/AddButton.vue";
import DeleteConfirmDialog from "@/components/widgets/confirmDialog/DeleteConfirmDialog.vue";
import StatusConfirmDialog from "@/components/widgets/confirmDialog/StatusConfirmDialog.vue";
import EntityTable from "@/components/widgets/entity-table/EntityTable.vue";
import FilterControlsRow from "@/components/widgets/filters/FilterControlsRow.vue";
import { useListFilterPanel } from "@/components/widgets/filters/useListFilterPanel.ts";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import SettingsNavigation from "@/components/widgets/navigation/SettingsNavigation.vue";
import SearchBar from "@/components/widgets/searches/SearchBar.vue";

import { useUserAccountsOverview } from "./composables/useUserAccountsOverview.ts";
import { userAccountListConfig } from "./userAccountListConfig.ts";

definePage({
    meta: {
        titleKey: "titles.userAccounts",
        pageTestId: "user-accounts-page",
        isPageBlue: true,
        requiredComponent: "USER_ACCOUNTS",
    },
});

const dataTestId = userAccountListConfig.testIdBase;

const { list, deleteFlow, statusFlow } = useUserAccountsOverview();

const { filtersOpen, activePills, onRemovePill } = useListFilterPanel({
    search: { applied: () => list.searchField, clear: list.onClearSearch },
    filterSections: () => list.filterSections,
    selectedFilters: () => list.selectedFilters,
    setFilters: list.setFilters,
});
</script>
