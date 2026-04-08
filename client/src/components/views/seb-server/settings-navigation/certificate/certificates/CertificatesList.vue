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
                            search-text="certificates.filters.searchField"
                            :store="certificatesStore"
                            @search="onSearch"
                            @clear="onClearSearch"
                        />
                    </v-col>
                    <v-col cols="12" md="7" />
                </v-row>

                <v-row>
                    <v-col>
                        <div v-if="error">
                            {{ error }}
                        </div>

                        <div v-else-if="deleteError">
                            {{ deleteError }}
                        </div>

                        <SettingsTable
                            :headers="certificatesTableHeaders"
                            :items="tableData?.content ?? []"
                            :total-items="totalItems"
                            :page-count="pageCount"
                            :items-per-page="options.itemsPerPage"
                            :options="options"
                            :loading="loading || deleteLoading"
                            item-identifier-key="alias"
                            translation-key-prefix="certificates"
                            :cell-formatters="cellFormatters"
                            :editable="false"
                            :status-changeable="false"
                            @update:options="loadItems"
                            @delete="removeCertificateFromItem"
                        />
                    </v-col>
                </v-row>
            </v-col>
        </template>
    </BasicSettingsPage>

    <AddCertificateDialog v-model="certDialog" @imported="onCertImported" />
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import BasicSettingsPage from "@/components/layout/pages/BasicSettingsPage.vue";
import AddButton from "@/components/views/seb-server/settings-navigation/widgets/AddButton.vue";
import AddCertificateDialog from "@/components/views/seb-server/certificates/AddCertificateDialog.vue";
import SearchSection from "@/components/views/seb-server/settings-navigation/components/SearchSection.vue";
import SettingsTable from "@/components/views/seb-server/settings-navigation/components/SettingsTable/SettingsTable.vue";
import { useCertificatesStore } from "@/components/views/seb-server/settings-navigation/certificate/certificates/store/certificatesStore.ts";
import { useCertificatesTableHeaders } from "@/components/views/seb-server/settings-navigation/certificate/certificates/composables/useCertificateTableHeaders.ts";
import { useCertificates } from "@/components/views/seb-server/settings-navigation/certificate/certificates/api/useCertificates.ts";
import { useServerSettingsTable } from "@/components/views/seb-server/settings-navigation/components/SettingsTable/composables/useServerSettingsTable.ts";
import { useDeleteCertificate } from "@/components/views/seb-server/settings-navigation/certificate/certificates/api/useDeleteCertificate.ts";
import { useSettingsTableCellFormatters } from "@/components/views/seb-server/settings-navigation/components/SettingsTable/composables/useSettingsTableCellFormatters.ts";
import type { CertificatesResponse } from "@/models/seb-server/certificate";

const certDialog = ref(false);

async function onCertImported() {
    await loadItems();
}

const certificatesStore = useCertificatesStore();
const certificatesTableHeaders = useCertificatesTableHeaders();

const tableData = ref<CertificatesResponse>();

const {
    selectedFilters,
    options,
    totalItems,
    loadItems,
    onSearch,
    onClearSearch,
} = useServerSettingsTable(
    certificatesStore,
    tableData,
    async () => {
        await fetchCertificates();
    },
    undefined,
);

const searchField = computed(() => certificatesStore.searchField ?? null);

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

const { cellFormatters } = useSettingsTableCellFormatters({
    headers: certificatesTableHeaders,
});

watch(
    selectedFilters,
    async () => {
        options.value = {
            ...options.value,
            page: 1,
        };

        await loadItems();
    },
    { deep: true },
);
</script>
