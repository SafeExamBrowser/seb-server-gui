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
                        <div v-if="loading">Loading user accounts...</div>

                        <div v-else-if="error">
                            {{ error }}
                        </div>

                        <div v-else-if="deleteError">
                            {{ deleteError }}
                        </div>

                        <SettingsTable
                            v-else
                            :headers="userAccountsTableHeaders"
                            :items="data?.content ?? []"
                            :loading="loading || deleteLoading"
                            :route="USER_ACCOUNTS_ROUTE"
                            item-identifier-key="uuid"
                            @delete="onDeleteUserAccount"
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
import type { UserAccount } from "@/models/userAccount";

const userAccountStore = useUserAccountsStore();
const userAccountsTableHeaders = useUserAccountsTableHeaders();

const { data, loading, error } = useUserAccounts();

const {
    removeUserAccount,
    loading: deleteLoading,
    error: deleteError,
} = useDeleteUserAccount();

async function onDeleteUserAccount(item: Record<string, unknown>) {
    const uuid = item.uuid;

    if (typeof uuid !== "string") {
        return;
    }

    const success = await removeUserAccount(uuid);

    if (!success) {
        return;
    }

    if (data.value?.content) {
        data.value.content = data.value.content.filter(
            (user: UserAccount) => user.uuid !== uuid,
        );
    }
}
</script>
