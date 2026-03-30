<template>
    <BasicSettingsPage :title="$t('titles.certificates')">
        <template #ActionButton>
            <AddButton
                text="certificates.addCertificate"
                :route="CERTIFICATES_ROUTE"
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
                    <v-col cols="12" md="7"> </v-col>
                </v-row>

                <v-row>
                    <v-col>
                        <div v-if="error">
                            {{ error }}
                        </div>

                        <div v-else-if="deleteError">
                            {{ deleteError }}
                        </div>

                        <div v-else-if="formattersError">
                            {{ formattersError }}
                        </div>

                        <SettingsTable
                            :headers="certificatesTableHeaders"
                            :items="data?.content ?? []"
                            :total-items="totalItems"
                            :page-count="pageCount"
                            :items-per-page="options.itemsPerPage"
                            :options="options"
                            :loading="
                                loading || deleteLoading || formattersLoading
                            "
                            item-identifier-key="alias"
                            translation-key-prefix="certificates"
                            :cell-formatters="cellFormatters"
                            @update:options="loadItems"
                            :editable="false"
                            :status-changeable="false"
                            @delete="removeCertificateFromItem"
                        />
                    </v-col>
                </v-row>
            </v-col>
        </template>
    </BasicSettingsPage>
</template>

<script setup lang="ts">
import BasicSettingsPage from "@/components/layout/pages/BasicSettingsPage.vue";
import AddButton from "@/components/views/seb-server/settings-navigation/widgets/AddButton.vue";
import { CERTIFICATES_ROUTE } from "@/utils/constants.ts";
import SearchSection from "@/components/views/seb-server/settings-navigation/components/SearchSection.vue";
import SettingsTable from "@/components/views/seb-server/settings-navigation/components/SettingsTable/SettingsTable.vue";
import { useCertificatesStore } from "@/components/views/seb-server/settings-navigation/certificate/certificates/store/certificatesStore.ts";
import { useCertificatesTableHeaders } from "@/components/views/seb-server/settings-navigation/certificate/certificates/composables/useCertificateTableHeaders.ts";
import { useCertificates } from "@/components/views/seb-server/settings-navigation/certificate/certificates/api/useCertificates.ts";
import { computed, watch } from "vue";
import { useServerSettingsTable } from "@/components/views/seb-server/settings-navigation/components/SettingsTable/composables/useServerSettingsTable.ts";
import { useDeleteCertificate } from "@/components/views/seb-server/settings-navigation/certificate/certificates/api/useDeleteCertificate.ts";
import { useSettingsTableCellFormatters } from "@/components/views/seb-server/settings-navigation/components/SettingsTable/composables/useSettingsTableCellFormatters.ts";

const certificatesStore = useCertificatesStore();
const certificatesTableHeaders = useCertificatesTableHeaders();

const { data, loading, error, fetchCertificates } = useCertificates();
const pageCount = computed(() => data.value?.number_of_pages ?? 0);

const {
    removeCertificateFromItem,
    loading: deleteLoading,
    error: deleteError,
} = useDeleteCertificate(data);

const {
    selectedFilters,
    options,
    totalItems,
    loadItems,
    onSearch,
    onClearSearch,
} = useServerSettingsTable(
    certificatesStore,
    data,
    async ({ options, searchField }) => {
        await fetchCertificates(options, searchField);
    },
    undefined,
);

const {
    cellFormatters,
    loading: formattersLoading,
    error: formattersError,
} = useSettingsTableCellFormatters({
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
