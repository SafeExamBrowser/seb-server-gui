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
                <v-row>
                    <SearchSection
                        search-text="certificates.filters.searchField"
                        ,
                        :store="certificatesStore"
                    />
                </v-row>

                <v-row>
                    <!-- In  here we do the following : import useraccountstableheaders. Call up the table in this html, pass on the headers. We also call up the /getalluseraccounts and store it in user accounts variable and pass it to the table
                     we also need to pass on a couple more things, like the Type of-->

                    <v-row>
                        <v-col>
                            <div v-if="loading">Loading certificates...</div>

                            <div v-else-if="error">
                                {{ error }}
                            </div>

                            <v-col>
                                <div v-if="loading">Loading certificates..</div>

                                <div v-else-if="error">
                                    {{ error }}
                                </div>

                                <SettingsTable
                                    v-else
                                    :headers="certificatesTableHeaders"
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
import { CERTIFICATES_ROUTE } from "@/utils/constants.ts";
import SearchSection from "@/components/views/seb-server/settings-navigation/components/SearchSection.vue";
import SettingsTable from "@/components/views/seb-server/settings-navigation/components/SettingsTable/SettingsTable.vue";
import { useCertificatesStore } from "@/components/views/seb-server/settings-navigation/certificate/certificates/store/certificatesStore.ts";
import { useCertificatesTableHeaders } from "@/components/views/seb-server/settings-navigation/certificate/certificates/composables/useCertificateTableHeaders.ts";
import { useCertificates } from "@/components/views/seb-server/settings-navigation/certificate/certificates/api/useCertificates.ts";

const certificatesStore = useCertificatesStore();
const certificatesTableHeaders = useCertificatesTableHeaders();

const { data, loading, error } = useCertificates();
</script>
