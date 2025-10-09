<template>
    <div
        class="text-white text-h5 font-weight-black ml-10 mt-5"
        data-testid="userAccounts-page-title"
    >
        {{ translate("titles.settings") }}
    </div>

    <v-row class="mt-10 w-98 h-100">
        <SettingsNavigation
            data-testid="userAccounts-settingsNavigation-component"
        />

        <v-col
            class="bg-white rounded-lg mb-3"
            cols="9"
            data-testid="userAccounts-list-container"
            elevation="4"
        >
            <v-row
                class="d-flex align-center justify-space-between px-6 pt-6"
                data-testid="userAccounts-header-row"
            >
                <div
                    class="text-primary text-h5 font-weight-bold"
                    data-testid="userAccounts-title-text"
                >
                    {{ translate("navigation.routeNames.userAccounts") }}
                </div>

                <div
                    class="d-flex align-center cursor-pointer add-user-container"
                    data-testid="userAccounts-addUser-button"
                    @click="navigateTo(constants.CREATE_USER_ACCOUNTS_ROUTE)"
                >
                    <span class="text-primary font-weight-medium mr-2">
                        {{
                            translate(
                                "userAccount.userAccountPage.addUserContext",
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

            <v-divider
                class="custom-divider mx-6 my-4 mt-7"
                data-testid="userAccounts-divider-top"
            />

            <!-- Search and filters row -->
            <v-row
                class="px-6 pt-4 d-flex flex-wrap align-start"
                data-testid="userAccounts-filters-row"
            >
                <!-- Search field -->
                <v-col
                    class="pa-0 mb-4"
                    cols="12"
                    data-testid="userAccounts-search-section"
                    md="5"
                >
                    <div
                        class="text-caption text-grey-darken-1 mt-1 mb-1"
                        data-testid="userAccounts-search-label"
                    >
                        {{
                            translate(
                                "userAccount.userAccountPage.filters.searchTitle",
                            )
                        }}
                    </div>

                    <v-text-field
                        v-model="userAccountStore.searchField"
                        class="search-input"
                        data-testid="userAccounts-search-input"
                        density="comfortable"
                        hide-details
                        :placeholder="
                            translate(
                                'userAccount.userAccountPage.filters.searchField',
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
                                data-testid="userAccounts-searchIcon-button"
                                @click="onSearch"
                                >mdi-magnify</v-icon
                            >
                        </template>
                    </v-text-field>

                    <div
                        class="d-flex justify-end w-90 mt-5"
                        data-testid="userAccounts-search-actions"
                    >
                        <v-btn
                            color="black"
                            data-testid="userAccounts-cancel-button"
                            rounded="sm"
                            variant="outlined"
                            @click="onClearSearch()"
                        >
                            {{ translate("general.cancelButton") }}
                        </v-btn>

                        <v-btn
                            class="ml-2"
                            color="primary"
                            data-testid="userAccounts-search-button"
                            rounded="sm"
                            variant="flat"
                            @click="onSearch()"
                        >
                            {{ translate("general.searchButton") }}
                        </v-btn>
                    </div>
                </v-col>

                <!-- Status Filters -->
                <v-col
                    class="pa-0 mb-2 ml-10"
                    cols="12"
                    data-testid="userAccounts-statusFilter-section"
                    md="2"
                >
                    <div
                        class="text-caption text-grey-darken-1 mb-1"
                        data-testid="userAccounts-statusFilter-label"
                    >
                        {{
                            translate(
                                "userAccount.userAccountPage.filters.statusFilter",
                            )
                        }}
                    </div>
                    <div
                        class="d-flex flex-wrap gap-2"
                        data-testid="userAccounts-statusFilter-chips"
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
                            :data-testid="`userAccounts-statusFilter-chip-${status.value}`"
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

                <!-- Institution Filters -->
                <v-col
                    v-if="showInstitutionColumn && institutions.length > 0"
                    class="pa-0 mb-2 ml-10"
                    cols="12"
                    data-testid="userAccounts-institutionFilter-section"
                    md="4"
                >
                    <div
                        class="text-caption text-grey-darken-1 mb-1"
                        data-testid="userAccounts-institutionFilter-label"
                    >
                        {{
                            translate(
                                "userAccount.userAccountPage.filters.institutionFilter",
                            )
                        }}
                    </div>
                    <div
                        class="d-flex flex-wrap gap-2"
                        data-testid="userAccounts-institutionFilter-chips"
                    >
                        <v-chip
                            v-for="institution in institutions"
                            :key="institution.modelId"
                            class="mr-2 mt-2"
                            :class="[
                                'filter-chip',
                                selectedInstitutionId === institution.modelId &&
                                    'filter-chip-selected',
                            ]"
                            :data-testid="`userAccounts-institutionFilter-chip-${institution.modelId}`"
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
            </v-row>

            <!-- Data Table -->
            <v-sheet
                class="rounded-lg mt-10"
                data-testid="userAccounts-table-section"
            >
                <v-data-table-server
                    v-model:options="options"
                    data-testid="userAccounts-table"
                    :headers="userAccountsTableHeaders"
                    :hover="true"
                    :items="userAccounts?.content"
                    :items-length="totalItems"
                    :items-per-page="5"
                    :items-per-page-options="
                        tableUtils.calcItemsPerPage(totalItems)
                    "
                    :loading="isLoading"
                    :loading-text="translate('general.loading')"
                    :no-data-text="translate('general.noData')"
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
                            data-testid="userAccounts-tableHeaders-component"
                            :get-sort-icon="getSortIcon"
                            :header-refs-prop="userAccountsTableHeadersRef"
                            :is-sorted="isSorted"
                            :toggle-sort="toggleSort"
                        />
                    </template>

                    <template #item="{ item }">
                        <tr
                            :class="[
                                selectedUserAccount?.id === item.id
                                    ? 'selected-row'
                                    : '',
                                'row-clickable',
                            ]"
                            :data-testid="`userAccounts-row-${item.uuid}`"
                            @click="goToDetails(item)"
                        >
                            <td
                                v-if="showInstitutionColumn"
                                class="text-primary"
                                :data-testid="`userAccounts-cell-institution-${item.uuid}`"
                            >
                                {{
                                    getInstitutionName(item.institutionId) ||
                                    item.institutionId
                                }}
                            </td>

                            <td
                                class="text-primary"
                                :data-testid="`userAccounts-cell-surname-${item.uuid}`"
                            >
                                {{ item.surname }}
                            </td>
                            <td
                                class="text-primary"
                                :data-testid="`userAccounts-cell-name-${item.uuid}`"
                            >
                                {{ item.name }}
                            </td>
                            <td
                                class="text-primary"
                                :data-testid="`userAccounts-cell-username-${item.uuid}`"
                            >
                                {{ item.username }}
                            </td>
                            <td
                                class="text-primary"
                                :data-testid="`userAccounts-cell-email-${item.uuid}`"
                            >
                                {{ item.email }}
                            </td>

                            <td
                                :data-testid="`userAccounts-cell-status-${item.uuid}`"
                            >
                                <v-tooltip
                                    v-if="
                                        !hasEditingRights(
                                            item.userRoles as UserRoleEnum[],
                                        )
                                    "
                                    location="top"
                                >
                                    <template #activator="{ props }">
                                        <v-chip
                                            v-bind="props"
                                            class="text-white font-weight-medium status-chip cursor-default opacity-50"
                                            :color="
                                                item.active ? 'green' : 'red'
                                            "
                                            dark
                                            :data-testid="`userAccounts-status-chip-${item.uuid}`"
                                            size="small"
                                        >
                                            {{
                                                item.active
                                                    ? translate(
                                                          "userAccount.userAccountPage.filters.activeSelector",
                                                      )
                                                    : translate(
                                                          "userAccount.userAccountPage.filters.inactiveSelector",
                                                      )
                                            }}
                                        </v-chip>
                                    </template>
                                    <span>{{
                                        translate(
                                            "userAccount.userAccountPage.info.noPermissionEditUser",
                                        )
                                    }}</span>
                                </v-tooltip>

                                <v-chip
                                    v-else
                                    class="text-white font-weight-medium status-chip cursor-pointer"
                                    :color="item.active ? 'green' : 'red'"
                                    dark
                                    :data-testid="`userAccounts-status-chip-${item.uuid}`"
                                    size="small"
                                    @click.stop="openStatusDialog(item)"
                                >
                                    {{
                                        item.active
                                            ? translate(
                                                  "userAccount.userAccountPage.filters.activeSelector",
                                              )
                                            : translate(
                                                  "userAccount.userAccountPage.filters.inactiveSelector",
                                              )
                                    }}
                                </v-chip>
                            </td>

                            <td
                                class="icon-cell"
                                :data-testid="`userAccounts-cell-actions-${item.uuid}`"
                            >
                                <div
                                    class="d-flex align-center justify-end h-100"
                                >
                                    <v-icon
                                        class="action-icon mr-2"
                                        :class="
                                            hasEditingRights(
                                                item.userRoles as UserRoleEnum[],
                                            )
                                                ? ''
                                                : 'cursor-pointer'
                                        "
                                        :data-testid="`userAccounts-edit-icon-${item.uuid}`"
                                        :icon="
                                            hasEditingRights(
                                                item.userRoles as UserRoleEnum[],
                                            )
                                                ? 'mdi-pencil'
                                                : 'mdi-eye'
                                        "
                                        @click.stop="
                                            navigateTo(
                                                `${constants.EDIT_USER_ACCOUNT}/${item.uuid}`,
                                            )
                                        "
                                    ></v-icon>

                                    <v-tooltip
                                        v-if="
                                            !hasEditingRights(
                                                item.userRoles as UserRoleEnum[],
                                            )
                                        "
                                        location="top"
                                    >
                                        <template #activator="{ props }">
                                            <v-icon
                                                class="action-icon cursor-default opacity-50"
                                                v-bind="props"
                                                :data-testid="`userAccounts-delete-icon-disabled-${item.uuid}`"
                                                icon="mdi-delete"
                                            />
                                        </template>
                                        <span>{{
                                            translate(
                                                "userAccount.userAccountPage.info.noPermissionEditUser",
                                            )
                                        }}</span>
                                    </v-tooltip>

                                    <v-icon
                                        v-else
                                        class="action-icon"
                                        :data-testid="`userAccounts-delete-icon-${item.uuid}`"
                                        icon="mdi-delete"
                                        @click.stop="openDeleteDialog(item)"
                                    />
                                </div>
                            </td>
                        </tr>
                    </template>
                </v-data-table-server>

                <!-- Delete User Account Dialog -->
                <v-dialog
                    v-model="deleteDialog"
                    data-testid="userAccounts-delete-dialog"
                    max-width="500"
                >
                    <v-card>
                        <v-card-title
                            class="text-h6 font-weight-bold"
                            data-testid="userAccounts-delete-dialog-title"
                        >
                            {{
                                translate(
                                    "userAccount.userAccountPage.deleteUserAccountContext.title",
                                )
                            }}
                        </v-card-title>
                        <v-card-text
                            data-testid="userAccounts-delete-dialog-text"
                        >
                            {{
                                translate(
                                    "userAccount.userAccountPage.deleteUserAccountContext.informationPart1",
                                )
                            }}
                            <strong
                                >{{ userToDelete?.name }}
                                {{ userToDelete?.surname }}</strong
                            >
                            {{
                                translate(
                                    "userAccount.userAccountPage.deleteUserAccountContext.informationPart2",
                                )
                            }}
                            <strong>{{ userToDelete?.username }}</strong>
                            {{
                                translate(
                                    "userAccount.userAccountPage.deleteUserAccountContext.informationPart3",
                                )
                            }}
                        </v-card-text>
                        <v-card-actions
                            class="justify-end"
                            data-testid="userAccounts-delete-dialog-actions"
                        >
                            <v-btn
                                data-testid="userAccounts-delete-cancel-button"
                                variant="text"
                                @click="deleteDialog = false"
                            >
                                {{ translate("general.cancelButton") }}
                            </v-btn>
                            <v-btn
                                color="red"
                                data-testid="userAccounts-delete-confirm-button"
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
                    data-testid="userAccounts-status-dialog"
                    max-width="500"
                >
                    <v-card>
                        <v-card-title
                            class="text-h6 font-weight-bold"
                            data-testid="userAccounts-status-dialog-title"
                        >
                            {{ statusDialogTitle }}
                        </v-card-title>
                        <v-card-text
                            data-testid="userAccounts-status-dialog-text"
                        >
                            {{ statusDialogMessage }}
                        </v-card-text>
                        <v-card-actions
                            class="justify-end"
                            data-testid="userAccounts-status-dialog-actions"
                        >
                            <v-btn
                                data-testid="userAccounts-status-cancel-button"
                                variant="text"
                                @click="statusDialog = false"
                            >
                                {{ translate("general.cancelButton") }}
                            </v-btn>
                            <v-btn
                                :color="
                                    statusDialogUser?.active ? 'red' : 'green'
                                "
                                data-testid="userAccounts-status-confirm-button"
                                variant="text"
                                @click="confirmStatusChange"
                            >
                                {{ statusDialogButtonLabel }}
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-sheet>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useAppBarStore, useLayoutStore } from "@/stores/store";
import { useUserAccountStore } from "@/stores/seb-server/userAccountStore";
import { useI18n } from "vue-i18n";
import { translate } from "@/utils/generalUtils";
import * as tableUtils from "@/utils/table/tableUtils";
import TableHeaders from "@/utils/table/TableHeaders.vue";
import * as userAccountViewService from "@/services/seb-server/component-services/userAccountViewService";
import { navigateTo } from "@/router/navigation";
import * as constants from "@/utils/constants";
import { useUserAccountStore as useAuthenticatedUserAccountStore } from "@/stores/authentication/authenticationStore";
import { UserRoleEnum } from "@/models/userRoleEnum";
import { getInstitutions } from "@/services/seb-server/component-services/registerAccountViewService";
import { GUIComponent, useAbilities } from "@/services/ability";

const ability = useAbilities();

const authenticatedUserAccountStore = useAuthenticatedUserAccountStore();
const appBarStore = useAppBarStore();
const layoutStore = useLayoutStore();
const userAccountStore = useUserAccountStore();
const i18n = useI18n();

// UI State
const selectedStatus = ref<string | null>(null);
const selectedUserAccount = ref<UserAccount | null>(null);
const selectedInstitutionId = ref<string | null>(null);
const deleteDialog = ref(false);
const userToDelete = ref<UserAccount | null>(null);
const isLoading = ref<boolean>(true);
const deleteSuccess = ref(false);
const deletedUsername = ref("");
const statuses = [
    {
        value: "Active",
        label: translate("userAccount.userAccountPage.filters.activeSelector"),
    },
    {
        value: "Inactive",
        label: translate(
            "userAccount.userAccountPage.filters.inactiveSelector",
        ),
    },
];
const institutions = ref<Institution[]>([]);
const showInstitutionColumn = computed(() => {
    const roles = authenticatedUserAccountStore.userAccount?.userRoles ?? [];
    return roles.includes(UserRoleEnum.SEB_SERVER_ADMIN);
});
const statusDialog = ref(false);
const statusDialogUser = ref<UserAccount | null>(null);
const totalItems = ref<number>(0);

// search string
const searchQuery = ref("");
// API response
const userAccounts = ref<UserAccountResponse>();

onMounted(async () => {
    // check user rights and go back to home if not allowed to view this page
    if (!ability.canView(GUIComponent.UserAccounts)) {
        navigateTo(constants.HOME_PAGE_ROUTE);
        return;
    }

    appBarStore.title = translate("titles.userAccounts");
    layoutStore.setBlueBackground(true);
    if (showInstitutionColumn.value) {
        const result = await getInstitutions();
        if (result && result.length > 0) {
            institutions.value = result;
        }
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
const userAccountsTableHeadersRef = ref<any[]>();

const userAccountsTableHeaders = computed(() => {
    const headers = [];

    if (showInstitutionColumn.value) {
        headers.push({
            title: translate(
                "userAccount.userAccountPage.userAccountTableHeaders.tableHeaderInstitution",
            ),
            key: "institutionName",
            width: "12%",
            sortable: true,
        });
    }

    headers.push(
        {
            title: translate(
                "userAccount.userAccountPage.userAccountTableHeaders.tableHeaderSurname",
            ),
            key: "surname",
            width: "12%",
            sortable: true,
        },
        {
            title: translate(
                "userAccount.userAccountPage.userAccountTableHeaders.tableHeaderName",
            ),
            key: "name",
            width: "10%",
            sortable: true,
        },
        {
            title: translate(
                "userAccount.userAccountPage.userAccountTableHeaders.tableHeaderUsername",
            ),
            key: "username",
            width: "12%",
            sortable: true,
        },
        {
            title: translate(
                "userAccount.userAccountPage.userAccountTableHeaders.tableHeaderEmail",
            ),
            key: "email",
            width: "10%",
            sortable: true,
        },
        {
            title: translate(
                "userAccount.userAccountPage.userAccountTableHeaders.tableHeaderStatus",
            ),
            key: "status",
            width: "2%",
            sortable: false,
        },
        { title: "", key: "userAccountLink", width: "1%" },
    );

    return headers;
});

const options = ref({
    page: 1,
    itemsPerPage: 5,
    sortBy: [{ key: "name", order: "asc" }],
});

// update status
async function onStatusChange(user: UserAccount, newStatus: string) {
    if (newStatus === "Active" && !user.active) {
        await userAccountViewService.activateUserAccount(user.uuid);
    } else if (newStatus === "Inactive" && user.active) {
        await userAccountViewService.deactivateUserAccount(user.uuid);
    }
    await loadItems(options.value);
}

const statusDialogTitle = computed(() => {
    if (!statusDialogUser.value) return "";
    return i18n.t(
        statusDialogUser.value.active
            ? "userAccount.userAccountPage.changeUserAccountStatusContext.deactivateTitle"
            : "userAccount.userAccountPage.changeUserAccountStatusContext.activateTitle",
        { username: statusDialogUser.value.username },
    );
});

const statusDialogMessage = computed(() => {
    if (!statusDialogUser.value) return "";
    return i18n.t(
        statusDialogUser.value.active
            ? "userAccount.userAccountPage.changeUserAccountStatusContext.deactivateMessage"
            : "userAccount.userAccountPage.changeUserAccountStatusContext.activateMessage",
        {
            name: statusDialogUser.value.name,
            surname: statusDialogUser.value.surname,
            username: statusDialogUser.value.username,
        },
    );
});

const statusDialogButtonLabel = computed(() => {
    if (!statusDialogUser.value) return "";
    return translate(
        statusDialogUser.value.active
            ? "userAccount.userAccountPage.changeUserAccountStatusContext.buttons.deactivate"
            : "userAccount.userAccountPage.changeUserAccountStatusContext.buttons.activate",
    );
});

// Load users with full pagination from backend
async function loadItems(serverTablePaging: ServerTablePaging) {
    userAccountStore.currentPagingOptions = serverTablePaging;
    isLoading.value = true;
    const optionalParams = tableUtils.assignUserAccountSelectPagingOptions(
        userAccountStore.currentPagingOptions,
        userAccountStore.searchField,
        selectedStatus.value,
        selectedInstitutionId.value,
    );

    const response =
        await userAccountViewService.getUserAccounts(optionalParams);

    if (!response) {
        isLoading.value = false;
        return;
    }
    totalItems.value =
        (response.number_of_pages ?? 1) *
        (response.page_size ?? response.content?.length ?? 0);
    userAccounts.value = response;
    isLoading.value = false;
}

// Search + clear search
function onSearch() {
    searchQuery.value =
        userAccountStore.searchField?.trim().toLowerCase() ?? "";
    options.value.page = 1;
    loadItems(options.value);
}

function onClearSearch() {
    userAccountStore.searchField = "";
    searchQuery.value = "";
    selectedStatus.value = null;
    selectedInstitutionId.value = null;
    options.value.page = 1;
    loadItems(options.value);
}

const getInstitutionName = (id: string | number | null | undefined) =>
    (id != null ? institutionIdToNameMap.value.get(String(id)) : "") ?? "";

// dialogs and logic
// delete
function openDeleteDialog(user: UserAccount) {
    userToDelete.value = user;
    deleteDialog.value = true;
}

async function confirmDelete() {
    if (userToDelete.value) {
        const response = await userAccountViewService.deleteUserAccount(
            userToDelete.value.uuid,
        );
        if (response !== null) {
            deletedUsername.value = userToDelete.value.username;
            deleteSuccess.value = true;
            setTimeout(() => {
                deleteSuccess.value = false;
            }, 2500);
            await loadItems(options.value);
        }
    }
    deleteDialog.value = false;
    userToDelete.value = null;
}

// status
function openStatusDialog(user: UserAccount) {
    statusDialogUser.value = user;
    statusDialog.value = true;
}
async function confirmStatusChange() {
    if (!statusDialogUser.value) return;

    const newStatus = statusDialogUser.value.active ? "Inactive" : "Active";
    await onStatusChange(statusDialogUser.value, newStatus);

    statusDialog.value = false;
    statusDialogUser.value = null;
}

function hasEditingRights(targetUserRoles: UserRoleEnum[]): boolean {
    const currentUserRoles =
        authenticatedUserAccountStore.userAccount?.userRoles ?? [];

    const isCurrentUserSebAdmin = currentUserRoles.includes(
        UserRoleEnum.SEB_SERVER_ADMIN,
    );
    const isCurrentUserOnlyInstitutional =
        currentUserRoles.includes(UserRoleEnum.INSTITUTIONAL_ADMIN) &&
        !isCurrentUserSebAdmin;
    const isTargetSebAdmin = targetUserRoles.includes(
        UserRoleEnum.SEB_SERVER_ADMIN,
    );

    if (isCurrentUserSebAdmin) return true;
    return !(isCurrentUserOnlyInstitutional && isTargetSebAdmin);
}

function goToDetails(item: UserAccount) {
    navigateTo(`${constants.EDIT_USER_ACCOUNT}/${item.uuid}`);
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

.nav-hover:hover .nav-link {
    color: #215caf;
}

.nav-link {
    transition: color 0.4s ease;
    margin-left: 10px;
}

.nav-hover {
    transition: background 0.4s ease;
    border-radius: 4px;
    background: transparent;
    padding-left: 8px;
    width: 85% !important;
}

.nav-hover:hover {
    background: linear-gradient(
        to right,
        rgba(255, 255, 255, 1) 0%,
        rgba(255, 255, 255, 0.98) 10%,
        rgba(255, 255, 255, 0.96) 20%,
        rgba(255, 255, 255, 0.93) 25%,
        rgba(255, 255, 255, 0.9) 30%,
        rgba(255, 255, 255, 0.86) 40%,
        rgba(255, 255, 255, 0.8) 60%,
        rgba(255, 255, 255, 0.7) 68%,
        rgba(255, 255, 255, 0.6) 75%,
        rgba(255, 255, 255, 0.45) 82%,
        rgba(33, 92, 175, 0.2) 88%,
        rgba(33, 92, 175, 0.12) 92%,
        rgba(33, 92, 175, 0.08) 96%,
        rgba(33, 92, 175, 0.04) 98%,
        rgba(33, 92, 175, 0.01) 99%,
        rgba(33, 92, 175, 0) 100%
    );
}

.link-color {
    color: white;
    text-decoration: none;
}

.section-divider {
    background-color: white !important;
    height: 1px !important;
    opacity: 1 !important;
    width: 85% !important;
}

.success-message-div {
    margin-top: 25.5rem;
    width: 85% !important;
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

/* Fix focused border */
.search-input :deep(.v-field--focused) {
    border-color: #215caf !important;
}

/* Fix focused placeholder */
.search-input :deep(input::placeholder) {
    color: #215caf !important;
    opacity: 1 !important;
}

/* Fix focused icon */
.search-input :deep(.v-icon) {
    transition: color 0.3s ease;
}

.search-input.v-input.v-input--focused :deep(.v-icon) {
    color: #215caf !important;
}

/* Filter chip styles */
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

.filter-chip-selected {
    background-color: #215caf;
    color: white;
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
</style>
