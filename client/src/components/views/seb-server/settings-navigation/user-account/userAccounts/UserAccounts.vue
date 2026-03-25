<template>
    <BasicSettingsPage :title="$t('titles.userAccounts')">
        <template #ActionButton>
            <AddButton
                text="userAccount.userAccountPage.addUserContext"
                :route="CREATE_USER_ACCOUNTS_ROUTE"
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

                        <SettingsTable
                            :headers="userAccountsTableHeaders"
                            :items="data?.content ?? []"
                            :total-items="totalItems"
                            :page-count="pageCount"
                            :options="options"
                            :items-per-page="options.itemsPerPage"
                            :loading="loading || deleteLoading || statusLoading"
                            :route="USER_ACCOUNTS_ROUTE"
                            item-identifier-key="uuid"
                            translation-key-prefix="userAccount.userAccountPage"
                            @update:options="loadItems"
                            @delete="removeUserAccountFromItem"
                            @status-change="toggleUserAccountStatusFromItem"
                        />
                    </v-col>
                </v-row>
            </v-col>
        </template>
    </BasicSettingsPage>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
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
import { useUserAccounts } from "@/components/views/seb-server/settings-navigation/user-account/userAccounts/api/useUserAccounts.ts";
import { useDeleteUserAccount } from "@/components/views/seb-server/settings-navigation/user-account/userAccounts/api/useDeleteUserAccount.ts";
import { useToggleUserAccountStatus } from "@/components/views/seb-server/settings-navigation/user-account/userAccounts/api/useToggleUserAccountStatus.ts";
import { useUserAccountsTableHeaders } from "@/components/views/seb-server/settings-navigation/user-account/userAccounts/composables/useUserAccountsTableHeaders.ts";

import { useServerSettingsTable } from "@/components/views/seb-server/settings-navigation/components/SettingsTable/composables/useServerSettingsTable.ts";
import { useSettingsFilters } from "@/components/views/seb-server/settings-navigation/components/SettingsTable/composables/useSettingsFilters.ts";

const userAccountStore = useUserAccountsStore();
const userAccountsTableHeaders = useUserAccountsTableHeaders();

const { data, loading, error, fetchUserAccounts } = useUserAccounts();
const pageCount = computed(() => data.value?.number_of_pages ?? 0);

const {
    removeUserAccountFromItem,
    loading: deleteLoading,
    error: deleteError,
} = useDeleteUserAccount(data);

const {
    toggleUserAccountStatusFromItem,
    loading: statusLoading,
    error: statusError,
} = useToggleUserAccountStatus(data);

const {
    selectedFilters,
    options,
    totalItems,
    loadItems,
    onSearch,
    onClearSearch,
} = useServerSettingsTable(
    userAccountStore,
    data,
    async ({ options, searchField, filters }) => {
        await fetchUserAccounts(
            options,
            searchField,
            filters.status,
            filters.institutionId,
        );
    },
    undefined,
    {
        status: null,
        institutionId: null,
    },
);

const { filters } = useSettingsFilters({
    headers: userAccountsTableHeaders,
    translationPrefix: "userAccount.userAccountPage",
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
