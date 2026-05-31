<template>
    <BasicPage
        :title="$t('titles.certificates')"
        :bread-crumb="[{ label: $t('titles.certificates') }]"
        :data-test-id="dataTestId"
        :panel-left-collapsed="!filtersOpen"
    >
        <template #SubNav>
            <SettingsNavigation />
        </template>

        <template #ActionButton>
            <div class="d-flex justify-end align-center fill-height">
                <FormDialog
                    icon-activator="mdi-plus-circle-outline"
                    color-activator="primary"
                    :label-activator="
                        $t('certificates.createDialog.addButtonTitle')
                    "
                    size-activator="large"
                    label-activator-visible
                    :label-cancel="$t('general.cancelButton')"
                    :label-submit="
                        $t('certificates.createDialog.confirmButtonTitle')
                    "
                    form-id="form-certificate-upload"
                    :get-form-fields="uploadForm.getFormFields"
                    :get-item="uploadForm.getEmptyItem"
                    :on-submit="uploadForm.handleUpload"
                />
            </div>
        </template>

        <template #PanelLeft>
            <SearchBar
                v-model="list.searchInputValue"
                :applied-search="list.searchField"
                search-text="certificates.filters.searchField"
                :filter-sections="[]"
                :filter-values="{}"
                :data-test-id="dataTestId"
                @search="list.onSearch"
                @clear="list.onClearSearch"
                @clear-filters="list.onClearSearch"
            />
        </template>

        <template #PanelMain>
            <FilterControlsRow
                :open="filtersOpen"
                :pills="activePills"
                :data-test-id="dataTestId"
                @toggle="filtersOpen = !filtersOpen"
                @remove="onRemovePill"
                @clear-all="list.onClearSearch"
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
                    :cell-formatters="list.cellFormatters"
                    :actions="list.actions"
                    :data-test-id="dataTestId"
                    item-key="alias"
                    @update:options="list.loadItems"
                />
            </LoadingFallbackComponent>
        </template>
    </BasicPage>

    <DeleteConfirmDialog
        v-model="deleteFlow.dialogOpen"
        :detail-text="deleteFlow.detailText"
        translation-key-prefix="certificates"
        @confirm="deleteFlow.confirm"
    />
</template>

<script setup lang="ts">
import BasicPage from "@/components/layout/pages/BasicPage.vue";
import SettingsNavigation from "@/components/widgets/navigation/SettingsNavigation.vue";
import SearchBar from "@/components/widgets/searches/SearchBar.vue";
import EntityTable from "@/components/widgets/entity-table/EntityTable.vue";
import FilterControlsRow from "@/components/widgets/filters/FilterControlsRow.vue";
import { useListFilterPanel } from "@/components/widgets/filters/useListFilterPanel.ts";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import DeleteConfirmDialog from "@/components/widgets/confirmDialog/DeleteConfirmDialog.vue";
import FormDialog from "@/components/widgets/formDialog/FormDialog.vue";
import { useCertificatesOverview } from "./composables/useCertificatesOverview.ts";

definePage({
    meta: {
        titleKey: "titles.certificates",
        pageTestId: "certificates-page",
        isPageBlue: true,
    },
});

const dataTestId = "certificates";

const { list, deleteFlow, uploadForm } = useCertificatesOverview();

const { filtersOpen, activePills, onRemovePill } = useListFilterPanel({
    search: { applied: () => list.searchField, clear: list.onClearSearch },
});
</script>
