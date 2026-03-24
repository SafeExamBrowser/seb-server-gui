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
                <v-row>
                    <SearchSection
                        :store="userAccountStore"
                        search-text="userAccount.userAccountPage.filters.searchField"
                    />
                </v-row>

                <v-row>
                    <v-col>
                        <!-- TODO @Andrei make these cases be default for the parents container aka basicSettingsPage and only pass the object type -->
                        <div v-if="loading">Loading user accounts...</div>

                        <div v-else-if="error">
                            {{ error }}
                        </div>

                        <div v-else-if="deleteError">
                            {{ deleteError }}
                        </div>

                        <div v-else-if="statusError">
                            {{ statusError }}
                        </div>

                        <SettingsTable
                            v-else
                            :headers="userAccountsTableHeaders"
                            :items="data?.content ?? []"
                            :loading="loading || deleteLoading || statusLoading"
                            :route="USER_ACCOUNTS_ROUTE"
                            item-identifier-key="uuid"
                            translation-key-prefix="userAccount.userAccountPage"
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
import BasicSettingsPage from "@/components/layout/pages/BasicSettingsPage.vue";
import AddButton from "@/components/views/seb-server/settings-navigation/widgets/AddButton.vue";
import {
    CREATE_USER_ACCOUNTS_ROUTE,
    USER_ACCOUNTS_ROUTE,
} from "@/utils/constants.ts";
import SearchSection from "@/components/views/seb-server/settings-navigation/components/SearchSection.vue";
import { useUserAccountsStore } from "@/components/views/seb-server/settings-navigation/user-account/userAccounts/store/userAccountsStore.ts";
import { useUserAccounts } from "@/components/views/seb-server/settings-navigation/user-account/userAccounts/api/useUserAccounts.ts";
import { useDeleteUserAccount } from "@/components/views/seb-server/settings-navigation/user-account/userAccounts/api/useDeleteUserAccount.ts";
import { useUserAccountsTableHeaders } from "@/components/views/seb-server/settings-navigation/user-account/userAccounts/composables/useUserAccountsTableHeaders.ts";
import SettingsTable from "@/components/views/seb-server/settings-navigation/components/SettingsTable/SettingsTable.vue";
import { useToggleUserAccountStatus } from "@/components/views/seb-server/settings-navigation/user-account/userAccounts/api/useToggleUserAccountStatus.ts";

const userAccountStore = useUserAccountsStore();
const userAccountsTableHeaders = useUserAccountsTableHeaders();

const { data, loading, error } = useUserAccounts();

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
</script>
