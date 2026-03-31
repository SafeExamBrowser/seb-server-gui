<template>
    <BasicSettingsPage :title="$t('titles.userAccounts')">
        <template #ActionButton>
            <AddButton
                text="userAccount.userAccountPage.addUserContext"
                :route="CREATE_USER_ACCOUNTS_ROUTE"
            />
            <AddButton
                text="userAccount.userAccountPage.addUserContext"
                :route="'/user-account/create'"
            />
        </template>

        <template #PanelMain>
            <v-col>
                <v-row class="align-start">
                    <v-col cols="12" md="5">
                        <SearchSection
                            :store="userAccountStore"
                            search-text="userAccount.userAccountPage.filters.searchField"
                            @search="onSearch"
                            @clear="onClearSearch"
                        />
                    </v-col>

                    <v-col cols="12" md="7">
                        <SettingsFilters
                            v-if="filtersReady"
                            :key="filtersRenderKey"
                            v-model="selectedFilters"
                            :filters="filters"
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

                        <div v-else-if="statusError">
                            {{ statusError }}
                        </div>

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
                                :route="USER_ACCOUNTS_ROUTE"
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
import AddButton from "@/components/views/seb-server/settings-navigation/widgets/AddButton.vue";
import {
    CREATE_USER_ACCOUNTS_ROUTE,
    USER_ACCOUNTS_ROUTE,
} from "@/utils/constants.ts";
import SearchSection from "@/components/views/seb-server/settings-navigation/components/SearchSection.vue";
import SettingsFilters from "@/components/views/seb-server/settings-navigation/components/SettingsFilters.vue";
import SettingsTable from "@/components/views/seb-server/settings-navigation/components/SettingsTable/SettingsTable.vue";

import { useUserAccountsStore } from "@/components/views/seb-server/settings-navigation/user-account/userAccounts/store/userAccountsStore.ts";
import { useUserAccounts } from "@/components/views/seb-server/settings-navigation/user-account/api/useUserAccounts.ts";
import { useToggleUserAccountStatus } from "@/components/views/seb-server/settings-navigation/user-account/api/useToggleUserAccountStatus.ts";
import { useUserAccountsTableHeaders } from "@/components/views/seb-server/settings-navigation/user-account/userAccounts/composables/useUserAccountsTableHeaders.ts";
import { useServerSettingsTable } from "@/components/views/seb-server/settings-navigation/components/SettingsTable/composables/useServerSettingsTable.ts";
import { useSettingsTableFilters } from "@/components/views/seb-server/settings-navigation/components/SettingsTable/composables/useSettingsTableFilters.ts";
import { useSettingsTableCellFormatters } from "@/components/views/seb-server/settings-navigation/components/SettingsTable/composables/useSettingsTableCellFormatters.ts";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import type { UserAccountResponse } from "@/models/userAccount";
import { useDeleteUserAccount } from "@/components/views/seb-server/settings-navigation/user-account/api/useDeleteUserAccount.ts";

const userAccountStore = useUserAccountsStore();
const userAccountsTableHeaders = useUserAccountsTableHeaders();

const tableData = ref<UserAccountResponse>();

const {
    selectedFilters,
    options,
    totalItems,
    loadItems,
    onSearch,
    onClearSearch,
} = useServerSettingsTable(
    userAccountStore,
    tableData,
    async () => {
        await fetchUserAccounts();
    },
    undefined,
    {
        status: null,
        institutionId: null,
    },
);

const searchField = computed(() => userAccountStore.searchField ?? null);

const selectedStatus = computed(
    () => (selectedFilters.value.status as string | null) ?? null,
);

const selectedInstitutionId = computed(
    () => (selectedFilters.value.institutionId as string | null) ?? null,
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
    (newValue) => {
        tableData.value = newValue;
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

const { filters, filtersReady, filtersRenderKey } = useSettingsTableFilters({
    headers: userAccountsTableHeaders,
    translationPrefix: "userAccount.userAccountPage",
});

const { cellFormatters } = useSettingsTableCellFormatters({
    headers: userAccountsTableHeaders,
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
