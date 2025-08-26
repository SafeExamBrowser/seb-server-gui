<template>
    <div class="text-white text-h5 font-weight-black ml-10 mt-5 ">
        {{ translate("titles.settings") }}
    </div>
    <v-row class="mt-10 w-98 h-100">
        <SettingsNavigation/>

        <!-- Main Component -->
        <v-col elevation="4" cols="9" class="bg-white rounded-lg mb-3">
            <!-- Title and Add User Button -->
            <v-row class="d-flex align-center justify-space-between px-6 pt-6">
                <div class="text-primary text-h5 font-weight-bold">
                    {{ translate("titles.certificates") }}
                </div>
                <div class="d-flex align-center cursor-pointer add-user-container"
                     @click="uploadDialog = true">
                        <span class="text-primary font-weight-medium mr-2">
                            {{ translate("certificates.addCertificate") }}
                        </span>
                    <div class="add-user-icon d-flex align-center justify-center">
                        <v-icon size="28">mdi-plus</v-icon>
                    </div>
                </div>
            </v-row>

            <v-divider class="custom-divider mx-6 my-4 mt-7"/>
            <v-sheet>

                <!-- Search and filters row -->
                <v-row class="px-6 pt-4 d-flex flex-wrap align-start">
                    <!-- Search field -->
                    <v-col cols="5" md="5" class="pa-0 mb-4 ">
                        <div class="text-caption text-grey-darken-1 mt-1 mb-1">
                            {{ translate("certificates.filters.searchTitle") }}
                        </div>
                        <v-text-field
                            v-model="certificateStore.searchField"
                            :placeholder="translate('certificates.filters.searchField')"
                            variant="outlined"
                            density="comfortable"
                            type="text"
                            class="search-input"
                            hide-details
                            @keydown.enter="onSearch"
                            @keydown.esc="onClearSearch"
                        >
                            <template #append-inner>
                                <v-icon class="search-icon" @click="onSearch">mdi-magnify</v-icon>
                            </template>
                        </v-text-field>

                        <div class="d-flex justify-end w-90 mt-5">
                            <v-btn
                                rounded="sm"
                                color="black"
                                variant="outlined"
                                @click="onClearSearch()"
                            >
                                {{ translate("general.cancelButton") }}
                            </v-btn>

                            <v-btn
                                rounded="sm"
                                color="primary"
                                variant="flat"
                                class="ml-2"
                                @click="onSearch()"
                            >
                                {{ translate("general.searchButton") }}
                            </v-btn>
                        </div>
                    </v-col>
                </v-row>

                <!-- Data Table Definition-->
                <v-sheet class="rounded-lg mt-10">
                    <v-data-table-server
                        v-model:options="options"
                        @update:options="loadItems"
                        :hover="true"
                        :loading="isLoading"
                        :loading-text="translate('general.loading')"
                        :items="certificates?.content"
                        :items-length="totalItems"
                        :items-per-page="5"
                        :items-per-page-options="tableUtils.calcItemsPerPage(totalItems)"
                        :headers="certificatesTableHeaders"
                        style="min-height:35vh"
                    >

                        <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort }">
                            <TableHeaders
                                :columns="columns"
                                :is-sorted="isSorted"
                                :get-sort-icon="getSortIcon"
                                :toggle-sort="toggleSort"
                                :header-refs-prop="certificateTableHeadersRef"
                            />
                        </template>

                        <template v-slot:item="{ item }">
                            <tr
                                :class="[
                                    selectedCertificate?.id === item.id ? 'selected-row' : '',
                                    'row-clickable'
                                ]"
                            >
                                <!-- Column Definition -->
                                <td class="text-primary">{{ item.alias }}</td>
                                <td class="text-primary">{{
                                        timeUtils.formatIsoToReadableDateTime(item.validityFrom)
                                    }}
                                </td>
                                <td class="text-primary">{{
                                        timeUtils.formatIsoToReadableDateTime(item.validityTo)
                                    }}
                                </td>
                                <td class="text-primary">{{ formatCertTypes(item.certType) }}</td>

                                <td class="icon-cell">
                                    <div class="d-flex align-center justify-end h-100">
                                        <v-icon
                                            icon="mdi-delete"
                                            class="action-icon"
                                            @click.stop="openDeleteDialog(item)"
                                        />

                                    </div>
                                </td>
                            </tr>
                        </template>
                    </v-data-table-server>

                    <!-- Delete User Account Dialog -->
                    <v-dialog v-model="deleteDialog" max-width="500">
                        <v-card>
                            <v-card-title class="text-h6 font-weight-bold">
                                {{
                                    translate("certificates.deleteCertificateContext.title")
                                }}
                            </v-card-title>
                            <v-card-text>
                                {{
                                    translate("certificates.deleteCertificateContext.informationPart1")
                                }}
                                <strong>{{ certificateToDelete?.alias }} </strong>
                                {{
                                    translate("certificates.deleteCertificateContext.informationPart3")
                                }}
                            </v-card-text>
                            <v-card-actions class="justify-end">
                                <v-btn text @click="deleteDialog = false">{{
                                        translate("general.cancelButton")
                                    }}
                                </v-btn>
                                <v-btn color="red" text @click="confirmDelete">{{ translate("general.deleteButton") }}
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>

                </v-sheet>
            </v-sheet>
            <AddCertificateDialog
                v-model="uploadDialog"
                @imported="onCertificateImported"
            />
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import {ref, computed, onMounted, onBeforeUnmount} from "vue";
import {useAppBarStore, useLayoutStore} from "@/stores/store";
import {useI18n} from "vue-i18n";
import {translate} from "@/utils/generalUtils";
import * as tableUtils from "@/utils/table/tableUtils";
import TableHeaders from "@/utils/table/TableHeaders.vue";
import * as certificateViewService from "@/services/seb-server/component-services/certificateViewService";
import {useCertificateStore} from "@/stores/seb-server/certificateStore";
import * as timeUtils from "@/utils/timeUtils";
import {CertificateTypeEnum} from "@/models/seb-server/certificateTypeEnum";

const appBarStore = useAppBarStore();
const layoutStore = useLayoutStore();
const certificateStore = useCertificateStore();


// UI State
const deleteDialog = ref(false);
const certificateToDelete = ref<Certificate | null>(null);
const isLoading = ref<boolean>(true);
const deleteSuccess = ref(false);
const deletedName = ref("");
const totalItems = ref<number>(0);
const selectedCertificate = ref<Certificate | null>(null);
const uploadDialog = ref(false);


const options = ref({
    page: 1,
    itemsPerPage: 5,
    sortBy: [{key: "name", order: "asc"}],
});


//search string
const searchQuery = ref("");
// API response

const certificates = ref<CertificatesResponse>();
const certificateTableHeadersRef = ref<any[]>();


onMounted(async () => {
    appBarStore.title = translate("titles.certificate");
    layoutStore.setBlueBackground(true);
    await loadItems(options.value);
});

onBeforeUnmount(() => {
    layoutStore.setBlueBackground(false);
});

defineExpose({loadItems});


// Table header config
const certificatesTableHeaders = computed(() => {
    const headers = [];

    headers.push(
        {
            title: translate("certificates.certificateTableHeaders.tableHeaderAlias"),
            key: "alias",
            width: "20%",
            sortable: true
        },
        {
            title: translate("certificates.certificateTableHeaders.tableHeaderValidFrom"),
            key: "validityFrom",
            width: "20%",
            sortable: false
        },
        {
            title: translate("certificates.certificateTableHeaders.tableHeaderValidTo"),
            key: "validityTo",
            width: "20%",
            sortable: false
        },
        {
            title: translate("certificates.certificateTableHeaders.tableHeaderTypes"),
            key: "certType",
            width: "15%",
            sortable: false
        },
        {title: "", key: "certificateLink", width: "1%"}
    );

    return headers;
});


async function loadItems(serverTablePaging: ServerTablePaging) {
    certificateStore.currentPagingOptions = serverTablePaging;
    isLoading.value = true;

    const optionalParams = tableUtils.assignCertificateSelectPagingOptions(
        serverTablePaging,
        certificateStore.searchField && certificateStore.searchField.trim() !== ""
            ? certificateStore.searchField.trim()
            : null
    );


    const response = await certificateViewService.getCertificates(optionalParams);

    isLoading.value = false;
    if (!response) return;

    totalItems.value = (response.number_of_pages ?? 1) * (response.page_size ?? (response.content?.length ?? 0));
    certificates.value = response;

}

// Search + clear search
function onSearch() {
    searchQuery.value = certificateStore.searchField?.trim().toLowerCase() ?? "";
    options.value.page = 1;
    loadItems(options.value);
}

function onClearSearch() {
    certificateStore.searchField = "";
    searchQuery.value = "";
    options.value.page = 1;
    loadItems(options.value);
}


//dialogs and logic
//delete
function openDeleteDialog(certificate: Certificate) {
    certificateToDelete.value = certificate;
    deleteDialog.value = true;
}

async function confirmDelete() {

    if (certificateToDelete.value) {

        const response = await certificateViewService.deleteCertificate(certificateToDelete.value.alias);
        if (response !== null) {
            deletedName.value = certificateToDelete.value.alias;
            deleteSuccess.value = true;
            setTimeout(() => {
                deleteSuccess.value = false;
            }, 2500);
            await loadItems(options.value);
        }
    }
    deleteDialog.value = false;
    certificateToDelete.value = null;
}

function formatCertTypes(types?: CertificateTypeEnum[] | null): string {
    if (!types || types.length === 0) return "";
    return types.map((t) => CERT_TYPE_LABELS[t]).join(" | ");
}

const CERT_TYPE_LABELS: Record<CertificateTypeEnum, string> = {
    [CertificateTypeEnum.UNKNOWN]: translate("certificates.types.UNKNOWN"),
    [CertificateTypeEnum.DIGITAL_SIGNATURE]: translate("certificates.types.DIGITAL_SIGNATURE"),
    [CertificateTypeEnum.DATA_ENCIPHERMENT]: translate("certificates.types.DATA_ENCIPHERMENT"),
    [CertificateTypeEnum.DATA_ENCIPHERMENT_PRIVATE_KEY]: translate("certificates.types.DATA_ENCIPHERMENT_PRIVATE_KEY"),
    [CertificateTypeEnum.KEY_CERT_SIGN]: translate("certificates.types.KEY_CERT_SIGN"),
};

async function onCertificateImported(cert: { id: string; name: string }) {
    await loadItems(options.value);
}


</script>

<style scoped>

.status-chip {
    min-width: 4.7rem;
    max-width: 6.5rem;
    display: inline-flex;
    justify-content: center;
    align-items: center;
}

.nav-hover:hover {
    color: #215caf;
}


.w-98 {
    width: 98% !important;
}

.w-90 {
    width: 90% !important;
}

.custom-divider {
    background-color: #DCDCDC !important;
    height: 1px;
    width: 100%;
}

.add-user-container {
    font-size: 1rem;
    gap: 0.5rem;
}

.add-user-icon {
    border: 2px solid #1976d2;
    border-radius: 999px;
    width: 2.25rem;
    height: 2.25rem;
    color: #1976d2;
}

.search-input {
    width: 100%;
    max-width: 90%;
}

.search-icon {
    color: #757575;
    cursor: pointer;
}

.search-input :deep(.v-field--focused) {
    border-color: #215caf !important;
}

.search-input :deep(input::placeholder) {
    color: #215caf !important;
    opacity: 1 !important;
}

.search-input :deep(.v-icon) {
    transition: color 0.3s ease;
}

.search-input.v-input.v-input--focused :deep(.v-icon) {
    color: #215caf !important;
}

.filter-chip {
    padding: 0.25rem 0.7rem;
    background-color: #f0f0f0;
    font-size: 0.75rem;
    font-weight: 500;
    color: #757575;
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
    transition: all 0.2s ease-in-out;
    margin: 0.1em;
}


.icon-cell {
    vertical-align: middle !important;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    height: 64px;
}

.action-icon {
    color: #757575;
    cursor: pointer;
    transition: color 0.2s ease, background-color 0.2s ease;
    padding: 0.5rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
}

.status-select-chip ::v-deep(.v-select__slot) {
    padding: 0 !important;
}

.status-select-chip ::v-deep(.v-field__control) {
    background: none !important;
    box-shadow: none !important;
    border-bottom: none !important;
}

.action-icon:hover {
    color: #215caf;
    background-color: rgba(33, 92, 175, 0.1);
}

.row-clickable {
    cursor: pointer;
    transition: background-color 0.15s ease-in-out;
}

.row-clickable:hover {
    background-color: rgba(33, 92, 175, 0.06);
}


</style>
