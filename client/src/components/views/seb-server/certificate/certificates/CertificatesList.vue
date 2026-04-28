<template>
    <BasicSettingsPage :title="$t('titles.certificates')">
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

        <template #PanelMain>
            <v-col>
                <SearchBar
                    v-model="searchInputValue"
                    search-text="certificates.filters.searchField"
                    :filter-sections="[]"
                    :filter-values="{}"
                    dense
                    @search="onSearch"
                    @clear="onClearSearch"
                    @clear-filters="onClearSearch"
                />

                <v-row>
                    <v-col>
                        <div v-if="deleteError">
                            {{ deleteError }}
                        </div>
                        <LoadingFallbackComponent
                            :loading="false"
                            :errors="error ? [error] : []"
                        >
                            <EntityTable
                                :headers="certificatesTableHeaders"
                                :items="tableData?.content ?? []"
                                :page-count="pageCount"
                                :items-per-page="options.itemsPerPage"
                                :options="options"
                                :loading="loading || deleteLoading"
                                item-identifier-key="alias"
                                :cell-formatters="cellFormatters"
                                :actions="tableActions"
                                @update:options="loadItems"
                            />
                        </LoadingFallbackComponent>
                    </v-col>
                </v-row>
            </v-col>
        </template>
    </BasicSettingsPage>

    <DeleteConfirmDialog
        v-model="deleteDialogOpen"
        :detail-text="deleteDetailText"
        translation-key-prefix="certificates"
        @confirm="confirmDelete"
    />
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import BasicSettingsPage from "@/components/layout/pages/BasicSettingsPage.vue";
import SearchBar from "@/components/blocks/searches/SearchBar.vue";
import EntityTable from "@/components/blocks/entity-table/EntityTable.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import DeleteConfirmDialog from "@/components/widgets/confirmDialog/DeleteConfirmDialog.vue";
import FormDialog from "@/components/widgets/formDialog/FormDialog.vue";
import { useCertificatesTableHeaders } from "@/components/views/seb-server/certificate/certificates/composables/useCertificateTableHeaders.ts";
import { useCertificatesTableActions } from "@/components/views/seb-server/certificate/certificates/composables/useCertificatesTableActions.ts";
import { useCertificates } from "@/components/views/seb-server/certificate/certificates/composables/api/useCertificates";
import { useUrlTableState } from "@/components/blocks/entity-table/composables/useUrlTableState.ts";
import { useDeleteCertificate } from "@/components/views/seb-server/certificate/certificates/composables/api/useDeleteCertificate";
import { useCertificateCreateForm } from "@/components/views/seb-server/certificate/certificates/composables/useCertificateCreateForm.ts";
import type { CertificatesResponse } from "@/models/seb-server/certificate.ts";
import type { TableItem } from "@/components/blocks/entity-table/types.ts";

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
    loading: deleteLoading,
    error: deleteError,
} = useDeleteCertificate(tableData);

const { getEmptyItem, getFormFields, handleUploadCertificate } =
    useCertificateCreateForm({ onSuccess: loadItems });

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
    if (!deleteTarget.value) return;
    await removeCertificateFromItem(deleteTarget.value);
    deleteDialogOpen.value = false;
}

const tableActions = useCertificatesTableActions({
    onDelete: (item) => openDeleteDialog(item),
});
</script>
