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
                    <SearchSection :store="userAccountStore" />
                </v-row>

                <v-row>
                    <h1>
                        Create a re-usable table component that can handle
                        certificates, user accounts, and....
                    </h1>
                </v-row>
            </v-col>
        </template>
    </BasicSettingsPage>
</template>

<script setup lang="ts">
import BasicSettingsPage from "@/components/layout/pages/BasicSettingsPage.vue";
import AddButton from "@/components/views/seb-server/settings-navigation/widgets/AddButton.vue";
import { CREATE_USER_ACCOUNTS_ROUTE } from "@/utils/constants.ts";
import SearchSection from "@/components/views/seb-server/settings-navigation/components/SearchSection.vue";
import { useUserAccountsStore } from "@/components/views/seb-server/settings-navigation/user-account/userAccounts/store/userAccountsStore.ts";

const userAccountStore = useUserAccountsStore();
</script>
