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
                    :get-form-fields="getFormFields"
                    :get-item="getEmptyItem"
                    :on-submit="handleUploadCertificate"
                />
            </div>
        </template>

        <template #PanelLeft>
            <SearchBar
                v-model="searchInputValue"
                :applied-search="searchField"
                search-text="certificates.filters.searchField"
                :filter-sections="[]"
                :filter-values="{}"
                :data-test-id="dataTestId"
                @search="onSearch"
                @clear="onClearSearch"
                @clear-filters="onClearSearch"
            />
        </template>

        <template #PanelMain>
            <FilterControlsRow
                :open="filtersOpen"
                :pills="activePills"
                :data-test-id="dataTestId"
                @toggle="filtersOpen = !filtersOpen"
                @remove="onRemovePill"
                @clear-all="onClearSearch"
            />
            <LoadingFallbackComponent
                :loading="false"
                :errors="error ? [error] : []"
            >
                <EntityTable
                    class="px-2 pt-2"
                    :headers="certificatesTableHeaders"
                    :items="tableData?.content ?? []"
                    :page-count="pageCount"
                    :items-per-page="options.itemsPerPage"
                    :options="options"
                    :loading="loading || deleteLoading"
                    :cell-formatters="cellFormatters"
                    :actions="tableActions"
                    :data-test-id="dataTestId"
                    item-key="alias"
                    @update:options="loadItems"
                />
            </LoadingFallbackComponent>
        </template>
    </BasicPage>

    <DeleteConfirmDialog
        v-model="deleteDialogOpen"
        :detail-text="deleteDetailText"
        translation-key-prefix="certificates"
        @confirm="confirmDelete"
    />
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import BasicPage from "@/components/layout/pages/BasicPage.vue";
import SettingsNavigation from "@/components/widgets/navigation/SettingsNavigation.vue";
import SearchBar from "@/components/widgets/searches/SearchBar.vue";
import EntityTable from "@/components/widgets/entity-table/EntityTable.vue";
import FilterControlsRow from "@/components/widgets/filters/FilterControlsRow.vue";
import { useListFilterPanel } from "@/components/widgets/filters/useListFilterPanel.ts";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import DeleteConfirmDialog from "@/components/widgets/confirmDialog/DeleteConfirmDialog.vue";
import FormDialog from "@/components/widgets/formDialog/FormDialog.vue";
import { useCertificatesTableHeaders } from "@/pages/(app)/certificate/composables/useCertificateTableHeaders.ts";
import { useCertificatesTableActions } from "@/pages/(app)/certificate/composables/useCertificatesTableActions.ts";
import { useCertificates } from "@/pages/(app)/certificate/composables/api/useCertificates.ts";
import { useUrlTableState } from "@/components/widgets/entity-table/composables/useUrlTableState.ts";
import { useDeleteCertificate } from "@/pages/(app)/certificate/composables/api/useDeleteCertificate.ts";
import { useCertificateCreateForm } from "@/pages/(app)/certificate/composables/useCertificateCreateForm.ts";
import { notify } from "@/services/notifications/notify.ts";
import type { CertificatesResponse } from "@/models/seb-server/certificate.ts";
import type { TableItem } from "@/components/widgets/entity-table/types.ts";

definePage({
    meta: {
        titleKey: "titles.certificates",
        pageTestId: "certificates-page",
        isPageBlue: true,
    },
});

const dataTestId = "certificates";

const { headers: certificatesTableHeaders, cellFormatters } =
    useCertificatesTableHeaders();

const tableData = ref<CertificatesResponse>();

const {
    searchInputValue,
    searchField,
    options,
    loadItems,
    onSearch,
    onClearSearch,
} = useUrlTableState(async () => {
    await fetchCertificates();
});

const { filtersOpen, activePills, onRemovePill } = useListFilterPanel({
    search: { applied: searchField, clear: onClearSearch },
});

const {
    data: fetchedData,
    loading,
    error,
    fetchData: fetchCertificates,
} = useCertificates(options, searchField);

watch(
    fetchedData,
    (newValue) => {
        tableData.value = newValue;
    },
    { immediate: true },
);

const pageCount = computed(() => tableData.value?.number_of_pages ?? 0);

const {
    removeCertificateFromItem,
    error: deleteError,
    loading: deleteLoading,
} = useDeleteCertificate();

const { getEmptyItem, getFormFields, handleUploadCertificate } =
    useCertificateCreateForm({ onSuccess: onCertificateUpload });

function onCertificateUpload(): void {
    loadItems();
}

const deleteTarget = ref<TableItem | null>(null);
const deleteDialogOpen = ref(false);

const deleteDetailText = computed(() => {
    if (!deleteTarget.value) return "";
    return String(deleteTarget.value.alias ?? "");
});

function openDeleteDialog(item: TableItem) {
    deleteTarget.value = item;
    deleteDialogOpen.value = true;
}

async function confirmDelete() {
    const item = deleteTarget.value;
    if (!item) return;
    await removeCertificateFromItem(item);
    deleteDialogOpen.value = false;
    if (deleteError.value) {
        notify.serverError(deleteError.value, { contextLabel: "certificate" });
        return;
    }
    const alias = item.alias;
    if (typeof alias === "string" && tableData.value?.content) {
        tableData.value.content = tableData.value.content.filter(
            (certificate) => certificate.alias !== alias,
        );
    }
}

const tableActions = useCertificatesTableActions({
    onDelete: (item) => openDeleteDialog(item),
});
</script>
