```vue
<template>
    <div class="text-white text-h5 font-weight-black ml-10 mt-5">
        {{ translate("titles.settings") }}
    </div>
    <v-row class="mt-10 w-98 h-100">
        <SettingsNavigation />

        <!-- Main Component -->
        <v-col class="bg-white rounded-lg mb-3" cols="9" elevation="4">
            <!-- Title and Add User Button -->
            <v-row class="d-flex align-center justify-space-between px-6 pt-6">
                <div
                    class="text-primary text-h5 font-weight-bold"
                    data-testid="connectionConfigurations-title-text"
                >
                    {{ translate("titles.connectionConfigurations") }}
                </div>

                <div
                    class="d-flex align-center cursor-pointer add-user-container"
                    data-testid="connectionConfigurations-addConnectionConfiguration-button"
                    @click="
                        navigateTo(
                            constants.CREATE_CONNECTION_CONFIGURATION_ROUTE,
                        )
                    "
                >
                    <span class="text-primary font-weight-medium mr-2">
                        {{
                            translate(
                                "connectionConfigurations.connectionConfigurationsPage.addConnectionConfiguration",
                            )
                        }}
                    </span>

                    <div
                        class="add-user-icon d-flex align-center justify-center"
                    >
                        <v-icon size="28">mdi-plus</v-icon>
                    </div>
                </div>
            </v-row>
            <v-divider class="custom-divider mx-6 my-4 mt-7" />
            <v-sheet>
                <!-- Search and filters row -->
                <v-row
                    class="px-6 pt-4 d-flex flex-wrap align-start"
                    data-testid="connectionConfigurations-filters-container"
                >
                    <!-- Search field -->
                    <v-col class="pa-0 mb-4" cols="5" md="5">
                        <div class="text-caption text-grey-darken-1 mt-1 mb-1">
                            {{
                                translate(
                                    "connectionConfigurations.connectionConfigurationsPage.filters.searchTitle",
                                )
                            }}
                        </div>
                        <v-text-field
                            v-model="connectionConfigurationStore.searchField"
                            class="search-input"
                            data-testid="connectionConfigurations-search-input"
                            density="comfortable"
                            hide-details
                            :placeholder="
                                translate(
                                    'connectionConfigurations.connectionConfigurationsPage.filters.searchField',
                                )
                            "
                            type="text"
                            variant="outlined"
                            @keydown.enter="onSearch"
                            @keydown.esc="onClearSearch"
                        >
                            <template #append-inner>
                                <v-icon
                                    class="search-icon"
                                    data-testid="connectionConfigurations-search-submit-icon"
                                    @click="onSearch"
                                >
                                    mdi-magnify
                                </v-icon>
                            </template>
                        </v-text-field>

                        <div class="d-flex justify-end w-90 mt-5">
                            <v-btn
                                color="black"
                                data-testid="connectionConfigurations-search-cancel-button"
                                rounded="sm"
                                variant="outlined"
                                @click="onClearSearch()"
                            >
                                {{ translate("general.cancelButton") }}
                            </v-btn>

                            <v-btn
                                class="ml-2"
                                color="primary"
                                data-testid="connectionConfigurations-search-button"
                                rounded="sm"
                                variant="flat"
                                @click="onSearch()"
                            >
                                {{ translate("general.searchButton") }}
                            </v-btn>
                        </div>
                    </v-col>
                    <!-- Status Filters -->
                    <v-col cols="7">
                        <v-row dense>
                            <v-col class="pa-0 mb-2" cols="3">
                                <div
                                    class="text-caption text-grey-darken-1 mb-1"
                                >
                                    {{
                                        translate(
                                            "connectionConfigurations.connectionConfigurationsPage.filters.statusFilter",
                                        )
                                    }}
                                </div>
                                <div
                                    class="d-flex flex-wrap gap-2"
                                    data-testid="connectionConfigurations-statusFilter-container"
                                >
                                    <v-chip
                                        v-for="status in statuses"
                                        :key="status.value"
                                        class="mr-2 mt-2"
                                        :class="[
                                            'filter-chip',
                                            selectedStatus === status.value &&
                                                'filter-chip-selected',
                                        ]"
                                        :data-testid="`connectionConfigurations-statusFilter-chip-${status.value}`"
                                        size="small"
                                        @click="
                                            selectedStatus =
                                                selectedStatus === status.value
                                                    ? null
                                                    : status.value
                                        "
                                    >
                                        {{ status.label }}
                                    </v-chip>
                                </div>
                            </v-col>
                            <v-col
                                v-if="institutions.length > 0"
                                class="pa-0 mb-2"
                                cols="4"
                            >
                                <div
                                    class="text-caption text-grey-darken-1 mb-1"
                                >
                                    {{
                                        translate(
                                            "connectionConfigurations.connectionConfigurationsPage.filters.institutionFilter",
                                        )
                                    }}
                                </div>
                                <div
                                    class="d-flex flex-wrap gap-2"
                                    data-testid="connectionConfigurations-institutionFilter-container"
                                >
                                    <v-chip
                                        v-for="institution in institutions"
                                        :key="institution.modelId"
                                        class="mr-2 mt-2"
                                        :class="[
                                            'filter-chip',
                                            selectedInstitutionId ===
                                                institution.modelId &&
                                                'filter-chip-selected',
                                        ]"
                                        :data-testid="`connectionConfigurations-institutionFilter-chip-${institution.modelId}`"
                                        size="small"
                                        @click="
                                            selectedInstitutionId =
                                                selectedInstitutionId ===
                                                institution.modelId
                                                    ? null
                                                    : institution.modelId
                                        "
                                    >
                                        {{ institution.name }}
                                    </v-chip>
                                </div>
                            </v-col>

                            <v-spacer />
                        </v-row>
                    </v-col>
                </v-row>

                <!-- Data Table Definition-->
                <v-sheet class="rounded-lg mt-10">
                    <v-data-table-server
                        v-model:options="options"
                        data-testid="connectionConfigurations-table"
                        :headers="connectionConfigurationTableHeaders"
                        :hover="true"
                        :items="connectionConfigurations?.content"
                        :items-length="totalItems"
                        :items-per-page="5"
                        :items-per-page-options="
                            tableUtils.calcItemsPerPage(totalItems)
                        "
                        :loading="isLoading"
                        :loading-text="translate('general.loading')"
                        style="min-height: 35vh"
                        @update:options="loadItems"
                    >
                        <template
                            #headers="{
                                columns,
                                isSorted,
                                getSortIcon,
                                toggleSort,
                            }"
                        >
                            <TableHeaders
                                :columns="columns"
                                data-testid="connectionConfigurations-tableHeaders-component"
                                :get-sort-icon="getSortIcon"
                                :header-refs-prop="
                                    connectionConfigurationTableHeadersRef
                                "
                                :is-sorted="isSorted"
                                :toggle-sort="toggleSort"
                            />
                        </template>

                        <template #item="{ item }">
                            <tr
                                :class="[
                                    selectedConnectionConfiguration?.id ===
                                    item.id
                                        ? 'selected-row'
                                        : '',
                                    'row-clickable',
                                ]"
                                :data-testid="`connectionConfigurations-row-${item.id}`"
                                @click="goToDetails(item)"
                            >
                                <!-- Column Definition -->
                                <td class="text-primary">
                                    {{
                                        getInstitutionName(
                                            item.institutionId,
                                        ) || item.institutionId
                                    }}
                                </td>
                                <td class="text-primary">{{ item.name }}</td>
                                <td class="text-primary">
                                    {{
                                        timeUtils.formatIsoToReadableDateTime(
                                            item.date,
                                        )
                                    }}
                                </td>

                                <td>
                                    <v-chip
                                        class="text-white font-weight-medium status-chip cursor-pointer"
                                        :color="item.active ? 'green' : 'red'"
                                        :data-testid="`connectionConfigurations-status-chip-${item.id}`"
                                        size="small"
                                        @click.stop="openStatusDialog(item)"
                                    >
                                        {{
                                            item.active
                                                ? translate(
                                                      "connectionConfigurations.connectionConfigurationsPage.filters.activeSelector",
                                                  )
                                                : translate(
                                                      "connectionConfigurations.connectionConfigurationsPage.filters.inactiveSelector",
                                                  )
                                        }}
                                    </v-chip>
                                </td>
                                <td class="icon-cell">
                                    <div
                                        class="d-flex align-center justify-end h-100"
                                    >
                                        <v-icon
                                            class="action-icon mr-2 cursor-pointer"
                                            :data-testid="`connectionConfigurations-edit-button-${item.id}`"
                                            :icon="'mdi-pencil'"
                                            @click.stop="goToDetails(item)"
                                        ></v-icon>

                                        <v-icon
                                            class="action-icon"
                                            :data-testid="`connectionConfigurations-delete-button-${item.id}`"
                                            icon="mdi-delete"
                                            @click.stop="openDeleteDialog(item)"
                                        />
                                    </div>
                                </td>
                            </tr>
                        </template>
                    </v-data-table-server>

                    <!-- Delete Dialog -->
                    <v-dialog
                        v-model="deleteDialog"
                        data-testid="connectionConfigurations-deleteDialog-dialog"
                        max-width="500"
                    >
                        <v-card>
                            <v-card-title class="text-h6 font-weight-bold">
                                {{
                                    translate(
                                        "connectionConfigurations.connectionConfigurationsPage.deleteConnectionConfigurationContext.title",
                                    )
                                }}
                            </v-card-title>
                            <v-card-text>
                                {{
                                    translate(
                                        "connectionConfigurations.connectionConfigurationsPage.deleteConnectionConfigurationContext.informationPart1",
                                    )
                                }}
                                <strong>{{
                                    connectionConfigurationToDelete?.name
                                }}</strong>
                                {{
                                    translate(
                                        "connectionConfigurations.connectionConfigurationsPage.deleteConnectionConfigurationContext.informationPart3",
                                    )
                                }}
                            </v-card-text>
                            <v-card-actions class="justify-end">
                                <v-btn
                                    data-testid="connectionConfigurations-deleteDialog-cancel-button"
                                    variant="text"
                                    @click="deleteDialog = false"
                                >
                                    {{ translate("general.cancelButton") }}
                                </v-btn>
                                <v-btn
                                    color="red"
                                    data-testid="connectionConfigurations-deleteDialog-confirm-button"
                                    variant="text"
                                    @click="confirmDelete"
                                >
                                    {{ translate("general.deleteButton") }}
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>

                    <!-- Change Status Dialog -->
                    <v-dialog
                        v-model="statusDialog"
                        data-testid="connectionConfigurations-statusDialog-dialog"
                        max-width="500"
                    >
                        <v-card>
                            <v-card-title
                                class="text-h6 font-weight-bold"
                                data-testid="connectionConfigurations-statusDialog-title"
                            >
                                {{ statusDialogTitle }}
                            </v-card-title>
                            <v-card-text
                                data-testid="connectionConfigurations-statusDialog-message"
                            >
                                {{ statusDialogMessage }}
                            </v-card-text>
                            <v-card-actions class="justify-end">
                                <v-btn
                                    data-testid="connectionConfigurations-statusDialog-cancel-button"
                                    variant="text"
                                    @click="statusDialog = false"
                                >
                                    {{ translate("general.cancelButton") }}
                                </v-btn>
                                <v-btn
                                    :color="
                                        statusDialogConnectionConfiguration?.active
                                            ? 'red'
                                            : 'green'
                                    "
                                    data-testid="connectionConfigurations-statusDialog-confirm-button"
                                    variant="text"
                                    @click="confirmStatusChange"
                                >
                                    {{ statusDialogButtonLabel }}
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-sheet>
            </v-sheet>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useAppBarStore, useLayoutStore } from "@/stores/store";
import { useI18n } from "vue-i18n";
import { translate } from "@/utils/generalUtils";
import * as tableUtils from "@/utils/table/tableUtils";
import TableHeaders from "@/utils/table/TableHeaders.vue";
import * as connectionConfigurationViewService from "@/services/seb-server/component-services/connectionConfigurationViewService";
import * as timeUtils from "@/utils/timeUtils";

import { navigateTo } from "@/router/navigation";
import * as constants from "@/utils/constants";
import { getInstitutions } from "@/services/seb-server/component-services/registerAccountViewService";
import { useConnectionConfigurationStore } from "@/stores/seb-server/connectionConfigurationStore";
import { ServerTablePaging } from "@/models/types";

const appBarStore = useAppBarStore();
const layoutStore = useLayoutStore();
const i18n = useI18n();
const connectionConfigurationStore = useConnectionConfigurationStore();

// UI State
const selectedStatus = ref<string | null>(null);
const selectedConnectionConfiguration = ref<ConnectionConfiguration | null>(
    null,
);
const selectedInstitutionId = ref<string | null>(null);
const deleteDialog = ref(false);
const connectionConfigurationToDelete = ref<ConnectionConfiguration | null>(
    null,
);
const isLoading = ref<boolean>(true);
const deleteSuccess = ref(false);
const deletedName = ref("");
const totalItems = ref<number>(0);

const options = ref({
    page: 1,
    itemsPerPage: 5,
    sortBy: [{ key: "name", order: "asc" }],
});

const statuses = [
    {
        value: "Active",
        label: translate(
            "connectionConfigurations.connectionConfigurationsPage.filters.activeSelector",
        ),
    },
    {
        value: "Inactive",
        label: translate(
            "connectionConfigurations.connectionConfigurationsPage.filters.inactiveSelector",
        ),
    },
];
const institutions = ref<Institution[]>([]);

const statusDialog = ref(false);
const statusDialogConnectionConfiguration = ref<ConnectionConfiguration | null>(
    null,
);

// search string
const searchQuery = ref("");
// API response
const connectionConfigurations = ref<ConnectionConfigurations>();

const connectionConfigurationTableHeadersRef = ref<any[]>();

onMounted(async () => {
    appBarStore.title = translate("titles.connectionConfigurations");
    layoutStore.setBlueBackground(true);

    const result = await getInstitutions();
    if (result && result.length > 0) {
        institutions.value = result;
    }

    await loadItems(options.value);
});

const institutionIdToNameMap = computed(() => {
    const map = new Map<string, string>();
    institutions.value.forEach((inst) => {
        map.set(inst.modelId, inst.name);
    });
    return map;
});

onBeforeUnmount(() => {
    layoutStore.setBlueBackground(false);
});

defineExpose({ loadItems });

// Table header config
const connectionConfigurationTableHeaders = computed(() => {
    const headers = [];

    headers.push(
        {
            title: translate(
                "connectionConfigurations.connectionConfigurationsPage.connectionConfigurationsTableHeaders.tableHeaderInstitution",
            ),
            key: "institutionName",
            width: "20%",
            sortable: true,
        },
        {
            title: translate(
                "connectionConfigurations.connectionConfigurationsPage.connectionConfigurationsTableHeaders.tableHeaderName",
            ),
            key: "name",
            width: "20%",
            sortable: true,
        },
        {
            title: translate(
                "connectionConfigurations.connectionConfigurationsPage.connectionConfigurationsTableHeaders.tableHeaderCreationDate",
            ),
            key: "date",
            width: "20%",
            sortable: true,
        },
        {
            title: translate(
                "connectionConfigurations.connectionConfigurationsPage.connectionConfigurationsTableHeaders.tableHeaderStatus",
            ),
            key: "active",
            width: "15%",
            sortable: false,
        },
        { title: "", key: "connectionConfigurationLink", width: "1%" },
    );

    return headers;
});

// update status
async function onStatusChange(
    connectionConfiguration: ConnectionConfiguration,
    newStatus: string,
) {
    if (newStatus === "Active" && !connectionConfiguration.active) {
        await connectionConfigurationViewService.activateConnectionConfiguration(
            connectionConfiguration.id.toString(),
        );
    } else if (newStatus === "Inactive" && connectionConfiguration.active) {
        await connectionConfigurationViewService.deactivateConnectionConfiguration(
            connectionConfiguration.id.toString(),
        );
    }
    await loadItems(options.value);
}

const statusDialogTitle = computed(() => {
    if (!statusDialogConnectionConfiguration.value) return "";
    return i18n.t(
        statusDialogConnectionConfiguration.value.active
            ? "connectionConfigurations.connectionConfigurationsPage.changeConnectionConfigurationStatusContext.deactivateTitle"
            : "connectionConfigurations.connectionConfigurationsPage.changeConnectionConfigurationStatusContext.activateTitle",
    );
});

const statusDialogMessage = computed(() => {
    if (!statusDialogConnectionConfiguration.value) return "";
    return i18n.t(
        statusDialogConnectionConfiguration.value.active
            ? "connectionConfigurations.connectionConfigurationsPage.changeConnectionConfigurationStatusContext.deactivateMessage"
            : "connectionConfigurations.connectionConfigurationsPage.changeConnectionConfigurationStatusContext.activateMessage",
        {
            name: statusDialogConnectionConfiguration.value.name,
        },
    );
});

const statusDialogButtonLabel = computed(() => {
    if (!statusDialogConnectionConfiguration.value) return "";
    return translate(
        statusDialogConnectionConfiguration.value.active
            ? "connectionConfigurations.connectionConfigurationsPage.changeConnectionConfigurationStatusContext.buttons.deactivate"
            : "connectionConfigurations.connectionConfigurationsPage.changeConnectionConfigurationStatusContext.buttons.activate",
    );
});

async function loadItems(serverTablePaging: ServerTablePaging) {
    connectionConfigurationStore.currentPagingOptions = serverTablePaging;
    isLoading.value = true;

    const optionalParams =
        tableUtils.assignConnectionConfigurationSelectPagingOptions(
            serverTablePaging,
            selectedStatus.value,
            selectedInstitutionId.value,
            connectionConfigurationStore.searchField &&
                connectionConfigurationStore.searchField.trim() !== ""
                ? connectionConfigurationStore.searchField.trim()
                : null,
        );

    const response =
        await connectionConfigurationViewService.getConnectionConfigurations(
            optionalParams,
        );

    isLoading.value = false;
    if (!response) return;

    totalItems.value =
        (response.number_of_pages ?? 1) *
        (response.page_size ?? response.content?.length ?? 0);
    connectionConfigurations.value = response;
}

const getInstitutionName = (id: string | number | null | undefined) =>
    (id != null ? institutionIdToNameMap.value.get(String(id)) : "") ?? "";

// Search + clear search
function onSearch() {
    searchQuery.value =
        connectionConfigurationStore.searchField?.trim().toLowerCase() ?? "";
    options.value.page = 1;
    loadItems(options.value);
}
function onClearSearch() {
    connectionConfigurationStore.searchField = "";
    searchQuery.value = "";
    selectedStatus.value = null;
    selectedInstitutionId.value = null;
    options.value.page = 1;
    loadItems(options.value);
}

// dialogs and logic
// delete
function openDeleteDialog(connectionConfiguration: ConnectionConfiguration) {
    connectionConfigurationToDelete.value = connectionConfiguration;
    deleteDialog.value = true;
}

async function confirmDelete() {
    if (connectionConfigurationToDelete.value) {
        const response =
            await connectionConfigurationViewService.deleteConnectionConfiguration(
                connectionConfigurationToDelete.value.id.toString(),
            );
        if (response !== null) {
            deletedName.value = connectionConfigurationToDelete.value.name;
            deleteSuccess.value = true;
            setTimeout(() => {
                deleteSuccess.value = false;
            }, 2500);
            await loadItems(options.value);
        }
    }
    deleteDialog.value = false;
    connectionConfigurationToDelete.value = null;
}

// status
function openStatusDialog(connectionConfiguration: ConnectionConfiguration) {
    statusDialogConnectionConfiguration.value = connectionConfiguration;
    statusDialog.value = true;
}

async function confirmStatusChange() {
    if (!statusDialogConnectionConfiguration.value) return;

    const newStatus = statusDialogConnectionConfiguration.value.active
        ? "Inactive"
        : "Active";
    await onStatusChange(statusDialogConnectionConfiguration.value, newStatus);

    statusDialog.value = false;
    statusDialogConnectionConfiguration.value = null;
}

function goToDetails(item: ConnectionConfiguration) {
    navigateTo(`${constants.CONNECTION_CONFIGURATIONS_ROUTE}/${item.id}`);
}

watch([selectedStatus, selectedInstitutionId], () => {
    options.value.page = 1;
    loadItems(options.value);
});
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
    background-color: #dcdcdc !important;
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
    transition:
        color 0.2s ease,
        background-color 0.2s ease;
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

.filter-chip-selected {
    background-color: #215caf !important;
    color: white !important;
}
</style>
