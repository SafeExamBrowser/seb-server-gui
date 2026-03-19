<template>
    <BasicSettingsPage :title="$t('titles.connectionConfigurations')">
        <template #ActionButton>
            <AddButton
                text="connectionConfigurations.connectionConfigurationsPage.addConnectionConfiguration"
                :route="CREATE_CONNECTION_CONFIGURATION_ROUTE"
            />
        </template>

        <template #PanelMain>
            <v-col>
                <v-row>
                    <SearchSection
                        :store="connectionConfigurationsStore"
                        ,
                        search-text="connectionConfigurations.connectionConfigurationsPage.filters.searchField"
                    />
                </v-row>

                <v-row>
                    <!-- In  here we do the following : import useraccountstableheaders. Call up the table in this html, pass on the headers. We also call up the /getalluseraccounts and store it in user accounts variable and pass it to the table
                     we also need to pass on a couple more things, like the Type of-->

                    <v-row>
                        <v-col>
                            <div v-if="loading">
                                Loading connection configurations...
                            </div>

                            <div v-else-if="error">
                                {{ error }}
                            </div>

                            <v-col>
                                <div v-if="loading">
                                    Loading connection configurations...
                                </div>

                                <div v-else-if="error">
                                    {{ error }}
                                </div>

                                <SettingsTable
                                    v-else
                                    :headers="
                                        connectionConfigurationsTableHeaders
                                    "
                                    :items="data?.content ?? []"
                                    :loading="loading"
                                />
                            </v-col>
                        </v-col>
                    </v-row>
                </v-row>
            </v-col>
        </template>
    </BasicSettingsPage>
</template>

<script setup lang="ts">
import BasicSettingsPage from "@/components/layout/pages/BasicSettingsPage.vue";
import AddButton from "@/components/views/seb-server/settings-navigation/widgets/AddButton.vue";
import { CREATE_CONNECTION_CONFIGURATION_ROUTE } from "@/utils/constants.ts";
import SearchSection from "@/components/views/seb-server/settings-navigation/components/SearchSection.vue";
import { useUserAccounts } from "@/components/views/seb-server/settings-navigation/user-account/userAccounts/api/useUserAccounts.ts";
import SettingsTable from "@/components/views/seb-server/settings-navigation/components/SettingsTable/SettingsTable.vue";
import { useConnectionConfigurationsStore } from "@/components/views/seb-server/settings-navigation/connection-configuration/connection-configurations/store/connectionConfigurationsStore.ts";
import { useConnectionConfigurationsTableHeaders } from "@/components/views/seb-server/settings-navigation/connection-configuration/connection-configurations/composables/useConnectionConfigurationsTableHeaders.ts";

const connectionConfigurationsStore = useConnectionConfigurationsStore();
const connectionConfigurationsTableHeaders =
    useConnectionConfigurationsTableHeaders();

const { data, loading, error } = useUserAccounts();
</script>
