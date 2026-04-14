<template>
    <BasicSettingsPage :title="$t('titles.certificates')">
        <template #ActionButton>
            <AddButton
                text="certificates.addCertificate"
                @click="certDialog = true"
            />
        </template>

        <template #PanelMain>
            <v-col>
                <v-row class="align-start">
                    <v-col cols="12" md="5">
                        <SearchSection
                            v-model="searchInputValue"
                            search-text="certificates.filters.searchField"
                            @search="onSearch"
                            @clear="onClearSearch"
                        />
                    </v-col>
                </v-row>

                <v-row>
                    <v-col>
                        <div v-if="error">
                            {{ error }}
                        </div>

                        <div v-else-if="deleteError">
                            {{ deleteError }}
                        </div>

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
                    </v-col>
                </v-row>
            </v-col>
        </template>
    </BasicSettingsPage>

    <AddCertificateDialog v-model="certDialog" @imported="onCertImported" />

    <DeleteConfirmDialog
        v-model="deleteDialogOpen"
        translation-key-prefix="certificates"
        @confirm="confirmDelete"
    />
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import BasicSettingsPage from "@/components/layout/pages/BasicSettingsPage.vue";
import SearchSection from "@/components/blocks/searches/SearchSection.vue";
import EntityTable from "@/components/blocks/entity-table/EntityTable.vue";
import DeleteConfirmDialog from "@/components/widgets/confirmDialog/DeleteConfirmDialog.vue";
import { useCertificatesTableHeaders } from "@/components/views/seb-server/certificate/certificates/composables/useCertificateTableHeaders.ts";
import { useCertificatesTableActions } from "@/components/views/seb-server/certificate/certificates/composables/useCertificatesTableActions.ts";
import { useCertificates } from "@/components/views/seb-server/certificate/certificates/api/useCertificates.ts";
import { useUrlTableState } from "@/components/blocks/entity-table/composables/useUrlTableState.ts";
import { useDeleteCertificate } from "@/components/views/seb-server/certificate/certificates/api/useDeleteCertificate.ts";
import { useSebServerCellFormatters } from "@/components/views/seb-server/composables/useSebServerCellFormatters.ts";
import type { CertificatesResponse } from "@/models/seb-server/certificate.ts";
import type { TableItem } from "@/components/blocks/entity-table/types.ts";
import AddCertificateDialog from "@/components/views/seb-server/certificate/certificates/AddCertificateDialog.vue";
import AddButton from "@/components/widgets/AddButton.vue";

const certDialog = ref(false);

async function onCertImported() {
    await loadItems();
}

const certificatesTableHeaders = useCertificatesTableHeaders();

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

const { cellFormatters } = useSebServerCellFormatters(certificatesTableHeaders);

// Dialog state
const deleteTarget = ref<TableItem | null>(null);
const deleteDialogOpen = ref(false);

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
