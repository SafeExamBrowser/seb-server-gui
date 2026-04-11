<template>
    <BasicSettingsPage :title="$t('titles.userAccounts')">
        <template #ActionButton>
            <AddButton
                text="userAccount.userAccountPage.addUserContext"
                :route="{ name: 'CreateUserAccount' }"
            />
        </template>

        <template #PanelMain>
            <v-col>
                <v-row class="align-start">
                    <v-col cols="12" md="5">
                        <SearchSection
                            v-model="searchInputValue"
                            search-text="userAccount.userAccountPage.filters.searchField"
                            @search="onSearch"
                            @clear="onClearSearch"
                        />
                    </v-col>

                    <v-col cols="12" md="7">
                        <FiltersBar
                            :model-value="selectedFilters"
                            :sections="filterSections"
                            @update:model-value="setFilters"
                            @clear="resetFilters"
                        />
                    </v-col>
                </v-row>

                <v-row>
                    <v-col>
                        <div v-if="error">{{ error }}</div>
                        <div v-else-if="deleteError">{{ deleteError }}</div>
                        <div v-else-if="statusError">{{ statusError }}</div>

                        <LoadingFallbackComponent :loading="false" :errors="[]">
                            <SettingsTable
                                :headers="userAccountsTableHeaders"
                                :items="tableData?.content ?? []"
                                :total-items="totalItems"
                                :page-count="pageCount"
                                :items-per-page="options.itemsPerPage"
                                :options="options"
                                :loading="
                                    loading || deleteLoading || statusLoading
                                "
                                :detail-route="getRouteName('EditUserAccount')"
                                route-param-key="userUuid"
                                item-identifier-key="uuid"
                                translation-key-prefix="userAccount.userAccountPage"
                                :cell-formatters="cellFormatters"
                                @update:options="loadItems"
                                @delete="removeUserAccountFromItem"
                                @status-change="toggleUserAccountStatusFromItem"
                            />
                        </LoadingFallbackComponent>
                    </v-col>
                </v-row>
            </v-col>
        </template>
    </BasicSettingsPage>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import BasicSettingsPage from "@/components/layout/pages/BasicSettingsPage.vue";
import { getRouteName } from "@/router/routeNames";
import SearchSection from "@/components/views/seb-server/settings-navigation/components/SearchSection.vue";
import FiltersBar from "@/components/views/seb-server/settings-navigation/components/filters/FiltersBar.vue";
import SettingsTable from "@/components/views/seb-server/settings-navigation/components/SettingsTable/SettingsTable.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import { useUrlSettingsTable } from "@/components/views/seb-server/settings-navigation/components/SettingsTable/composables/useUrlSettingsTable.ts";
import { useUserAccountsTableHeaders } from "@/components/views/seb-server/settings-navigation/user-account/user-accounts/composables/useUserAccountsTableHeaders.ts";
import { useUserAccountsFilters } from "@/components/views/seb-server/settings-navigation/user-account/user-accounts/composables/useUserAccountsFilters.ts";
import { STATUS_FILTER_KEY } from "@/components/views/seb-server/settings-navigation/components/filters/statusFilterSection";
import { INSTITUTION_FILTER_KEY } from "@/components/views/seb-server/settings-navigation/components/filters/useInstitutionFilterSection";
import { useUserAccounts } from "@/components/views/seb-server/settings-navigation/user-account/api/useUserAccounts.ts";
import { useDeleteUserAccount } from "@/components/views/seb-server/settings-navigation/user-account/api/useDeleteUserAccount.ts";
import { useToggleUserAccountStatus } from "@/components/views/seb-server/settings-navigation/user-account/api/useToggleUserAccountStatus.ts";
import { useSettingsTableCellFormatters } from "@/components/views/seb-server/settings-navigation/components/SettingsTable/composables/useSettingsTableCellFormatters.ts";
import type { UserAccountResponse } from "@/models/userAccount";
import AddButton from "@/components/widgets/AddButton.vue";

const userAccountsTableHeaders = useUserAccountsTableHeaders();
const filterSections = useUserAccountsFilters();

const tableData = ref<UserAccountResponse>();

const {
    searchInputValue,
    searchField,
    selectedFilters,
    options,
    totalItems,
    loadItems,
    onSearch,
    onClearSearch,
    setFilters,
    resetFilters,
} = useUrlSettingsTable(tableData, async () => {
    await fetchUserAccounts();
}, [STATUS_FILTER_KEY, INSTITUTION_FILTER_KEY]);

const selectedStatus = computed(() => selectedFilters.value.status);
const selectedInstitutionId = computed(
    () => selectedFilters.value.institutionId,
);

const {
    data: fetchedData,
    loading,
    error,
    fetchData: fetchUserAccounts,
} = useUserAccounts(
    options,
    searchField,
    selectedStatus,
    selectedInstitutionId,
);

watch(
    fetchedData,
    (v) => {
        tableData.value = v;
    },
    { immediate: true },
);

const pageCount = computed(() => tableData.value?.number_of_pages ?? 0);

const {
    removeUserAccountFromItem,
    loading: deleteLoading,
    error: deleteError,
} = useDeleteUserAccount(tableData);

const {
    toggleUserAccountStatusFromItem,
    loading: statusLoading,
    error: statusError,
} = useToggleUserAccountStatus(tableData);

const { cellFormatters } = useSettingsTableCellFormatters({
    headers: userAccountsTableHeaders,
});
</script>
