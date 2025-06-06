<template>
    <div class="text-white text-h5 font-weight-black ml-10 mt-5 ">
        {{ translate("titles.settings") }}
    </div>
    <v-row class="mt-10 w-98">
        <v-col cols="3" class="pt-0">
            <v-sheet  class="rounded-lg ml-6 w-100 h-100 bg-primary">
                <v-col class="pt-0">
                    <v-divider class="section-divider" />

                    <v-list-item class="px-0 nav-hover">
                        <span class="link-color nav-link">{{ translate("navigation.routeNames.assessmentToolConnections") }}</span>
                    </v-list-item>

                    <v-divider class="section-divider" />

                    <v-list-item class="px-0 nav-hover">
                        <span class="link-color nav-link">{{ translate("navigation.routeNames.connectionConfiguration") }}</span>
                    </v-list-item>

                    <v-divider class="section-divider" />

                    <v-list-item class="px-0 nav-hover">
                        <span class="link-color nav-link">{{ translate("navigation.routeNames.certificates") }}</span>
                    </v-list-item>

                    <v-divider class="section-divider" />

                    <v-list-item class="px-0 nav-hover">
                        <router-link class="link-color nav-link" :to="constants.USER_ACCOUNTS_ROUTE">{{ translate("navigation.routeNames.userAccounts") }}</router-link>
                    </v-list-item>

                    <v-divider class="section-divider" />
                </v-col>

            </v-sheet>
        </v-col>


        <v-col elevation="4" cols="9" class="bg-white rounded-lg mb-3">
            <v-row class="d-flex align-center justify-space-between px-6 pt-6">
                <div class="text-primary text-h5 font-weight-bold">
                    {{ translate("navigation.routeNames.userAccounts") }}
                </div>

                <div class="d-flex align-center cursor-pointer add-user-container"
                     @click="navigateTo(constants.CREATE_USER_ACCOUNTS_ROUTE)"
                >
                    <span class="text-primary font-weight-medium mr-2">Add User Account</span>

                    <div class="add-user-icon d-flex align-center justify-center">
                        <v-icon size="28">mdi-plus</v-icon>
                    </div>
                </div>
            </v-row>

            <v-divider class="custom-divider mx-6 my-4 mt-7" />

            <!-- Search and filters row -->
            <v-row class="px-6 pt-4 d-flex flex-wrap align-start">
                <!-- Search field -->
                <v-col cols="12" md="5" class="pa-0 mb-4">
                    <div class="text-caption text-grey-darken-1 mt-1 mb-1">Search</div>

                    <v-text-field
                        v-model="userAccountStore.searchField"
                        placeholder="Search for Users"
                        variant="outlined"
                        density="comfortable"
                        type="text"
                        class="search-input"
                        hide-details
                    >
                        <template #append-inner>
                            <v-icon class="search-icon" @click="onSearch">mdi-magnify</v-icon>
                        </template>
                    </v-text-field>
                </v-col>

                <!-- Role Filters -->
                <v-col cols="12" md="4" class="pa-0 mb-2">
                    <div class="text-caption text-grey-darken-1 mb-1">Role</div>
                    <div class="d-flex flex-wrap gap-2">
                      <span
                          v-for="role in availableRoles"
                          :key="role"
                          :class="['filter-chip', selectedRoles.includes(role) && 'filter-chip-selected']"
                          @click="toggleRole(role)"
                      >
                        {{ role }}
                      </span>
                    </div>
                </v-col>

                <!-- Status Filters -->
                <v-col cols="12" md="2" class="pa-0 mb-2 ml-10">
                    <div class="text-caption text-grey-darken-1 mb-1">Status</div>
                    <div class="d-flex flex-wrap gap-2">
                        <span
                            v-for="status in ['Active', 'Inactive']"
                            :key="status"
                            :class="['filter-chip', selectedStatus === status && 'filter-chip-selected']"
                            @click="selectedStatus = selectedStatus === status ? null : status"
                        >{{ status }}
                      </span>
                    </div>
                </v-col>
            </v-row>


            <v-row class="px-6 pt-0">
                <v-col cols="12" md="5" class="pa-0 mb-4">
                    <div class="d-flex justify-end w-90" >
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


            <v-sheet  class="rounded-lg mt-10">
                <v-data-table
                    v-model:options="options"
                    :items="filteredUsers"
                    :items-per-page="options.itemsPerPage"
                    :items-per-page-options="[5, 10, 15]"
                    :headers="userAccountsTableHeaders"
                    :loading="isLoading"
                >
                    <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort }">
                        <TableHeaders
                            :columns="columns"
                            :is-sorted="isSorted"
                            :get-sort-icon="getSortIcon"
                            :toggle-sort="toggleSort"
                            :header-refs-prop="userAccountsTableHeadersRef"
                        />
                    </template>

                    <template v-slot:item="{ item }">
                        <tr
                            :class="[selectedUserAccount?.id === item.id ? 'selected-row' : '']"
                        >
                            <td class="text-primary">{{ item.name }}</td>
                            <td class="text-primary">{{ item.surname }}</td>
                            <td class="text-primary">{{ item.username }}</td>
                            <td class="text-primary">{{ item.email }}</td>
                            <td>
                                <div class="role-wrapper">
                                    <span
                                        v-for="role in item.userRoles"
                                        :key="role"
                                        class="role-box-small"
                                    >
                                      {{ role }}
                                    </span>
                                </div>
                            </td>


                            <td>
                                <v-chip
                                    :color="item.active ? 'green' : 'red'"
                                    dark
                                    small
                                    class="text-white font-weight-medium status-chip"
                                >
                                    {{ item.active ? 'Active' : 'Inactive' }}
                                </v-chip>
                            </td>
                            <td class="icon-cell">
                                <div class="d-flex align-center justify-end h-100">
                                    <v-icon
                                        icon="mdi-pencil"
                                        class="action-icon mr-2"
                                        @click.stop="navigateTo(constants.USER_ACCOUNT_DETAIL_ROUTE + '/' + item.uuid)"
                                    ></v-icon>

                                    <v-icon
                                        icon="mdi-delete"
                                        class="action-icon"
                                        @click.stop="openDeleteDialog(item)"
                                    ></v-icon>
                                </div>
                            </td>

                        </tr>
                    </template>
                </v-data-table>
                <v-dialog v-model="deleteDialog" max-width="500">
                    <v-card>
                        <v-card-title class="text-h6 font-weight-bold">
                            Confirm Deletion
                        </v-card-title>
                        <v-card-text>
                            Are you sure you want to delete
                            <strong>{{ userToDelete?.name }} {{ userToDelete?.surname }}</strong>'s account ({{ userToDelete?.username }})?
                        </v-card-text>

                        <v-card-actions class="justify-end">
                            <v-btn text @click="deleteDialog = false">Cancel</v-btn>
                            <v-btn color="red" text @click="confirmDelete">Delete</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-sheet>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
    import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
    import { useAppBarStore, useLayoutStore } from '@/stores/store';
    import { useUserAccountStore } from '@/stores/seb-server/userAccountStore';
    import { useI18n } from 'vue-i18n';
    import { translate } from '@/utils/generalUtils';
    import * as tableUtils from '@/utils/table/tableUtils';
    import TableHeaders from '@/utils/table/TableHeaders.vue';
    import * as userAccountViewService from '@/services/seb-server/component-services/userAccountViewService';
    import { UserRoleEnum } from '@/models/userRoleEnum';
    import { navigateTo } from '@/router/navigation';
    import * as constants from '@/utils/constants';

    const appBarStore = useAppBarStore();
    const layoutStore = useLayoutStore();
    const userAccountStore = useUserAccountStore();
    const i18n = useI18n();

    // UI State
    const selectedRoles = ref<string[]>([]);
    const selectedStatus = ref<string | null>(null);
    const selectedUserAccount = ref<UserAccount | null>(null);
    const deleteDialog = ref(false);
    const userToDelete = ref<UserAccount | null>(null);
    const isLoading = ref<boolean>(true);

    //search string
    const searchQuery = ref('');

    // Role filter list
    const availableRoles = Object.values(UserRoleEnum);

    // API response
    const userAccounts = ref<UserAccountResponse>();

    // Table header config
    const userAccountsTableHeadersRef = ref<any[]>();
    const userAccountsTableHeaders = ref([
        { title: translate('userAccountList.main.tableHeaderName'), key: 'name', width: '10%', sortable: true },
        { title: translate('userAccountList.main.tableHeaderSurname'), key: 'surname', width: '10%', sortable: true },
        { title: translate('userAccountList.main.tableHeaderUsername'), key: 'username', width: '10%', sortable: true },
        { title: translate('userAccountList.main.tableHeaderEmail'), key: 'email', width: '10%', sortable: true },
        { title: translate('userAccountList.main.tableHeaderRoles'), key: 'userRoles', width: '31%', sortable: false },
        { title: translate('userAccountList.main.tableHeaderStatus'), key: 'status', width: '2%', sortable: false },
        { title: '', key: 'userAccountLink', width: '5%' },
    ]);

    const options = ref({
        page: 1,
        itemsPerPage: 5,
        sortBy: [{ key: 'name', order: 'asc' }],
    });

    // Filters + Sorting
    const filteredUsers = computed(() => {
        if (!userAccounts.value?.content) return [];

        let result = [...userAccounts.value.content];

        // Role filter
        if (selectedRoles.value.length > 0) {
            result = result.filter(user =>
                selectedRoles.value.every(role => user.userRoles.includes(role))
            );
        }

        // Status filter
        if (selectedStatus.value) {
            const isActive = selectedStatus.value === 'Active';
            result = result.filter(user => user.active === isActive);
        }

        // Search filter
        const searchTerm = searchQuery.value;
        if (searchQuery) {
            result = result.filter(user =>
                [user.name, user.surname, user.username, user.email]
                    .some(field => field?.toLowerCase().includes(searchTerm))
            );
        }

        //sort
        type SortableKey = keyof Pick<UserAccount, 'name' | 'surname' | 'username' | 'email'>;

        const sort = options.value.sortBy?.[0];
        if (sort && ['name', 'surname', 'username', 'email'].includes(sort.key)) {
            const sortKey = sort.key as SortableKey;
            result.sort((a, b) => {
                const valA = a[sortKey]?.toString().toLowerCase();
                const valB = b[sortKey]?.toString().toLowerCase();
                return sort.order === 'asc'
                    ? valA.localeCompare(valB)
                    : valB.localeCompare(valA);
            });
        }


        return result;
    });

    // Load users with full pagination from backend
    async function loadItems(serverTablePaging: ServerTablePaging) {
        const fetchAllPaging = { ...serverTablePaging, itemsPerPage: 500, page: 1 };
        userAccountStore.currentPagingOptions = serverTablePaging;
        isLoading.value = true;

        const optionalParams = tableUtils.assignUserAccountSelectPagingOptions(fetchAllPaging);
        const response = await userAccountViewService.getUserAccounts(optionalParams);

        if (!response) {
            isLoading.value = false;
            return;
        }

        userAccounts.value = response;
        isLoading.value = false;
    }

    // Search + clear search
    function onSearch() {
        searchQuery.value = userAccountStore.searchField?.trim().toLowerCase() ?? '';
        options.value.page = 1;
    }
    function onClearSearch() {
        userAccountStore.searchField = '';
        searchQuery.value = '';
        selectedRoles.value = [];
        selectedStatus.value = null;
        options.value.page = 1;
    }

    // Role toggle
    function toggleRole(role: string) {
        if (selectedRoles.value.includes(role)) {
            selectedRoles.value = selectedRoles.value.filter(r => r !== role);
        } else {
            selectedRoles.value.push(role);
        }
    }

    // Delete dialog
    function openDeleteDialog(user: UserAccount) {
        userToDelete.value = user;
        deleteDialog.value = true;
    }

    function confirmDelete() {
        if (userToDelete.value) {
            console.log(`Deleted user with id: ${userToDelete.value.uuid}`);
            // TODO: call backend deletion
        }
        deleteDialog.value = false;
        userToDelete.value = null;
    }

    // Lifecycle
    onMounted(() => {
        appBarStore.title = translate('titles.userAccounts');
        layoutStore.setBlueBackground(true);
        loadItems(options.value);
    });

    onBeforeUnmount(() => {
        layoutStore.setBlueBackground(false);
    });

    defineExpose({ loadItems });
</script>

<style scoped>
    .on-row-hover:hover {
        background: #e4e4e4 !important;
        cursor: pointer;
    }

    .status-chip{
        min-width: 4.7rem;
        max-width: 6.5rem;
        display: inline-flex;
        justify-content: center;
        align-items: center;    }

    .role-wrapper {
        display: flex;
        flex-wrap: wrap;
        gap: 0.25em;
        min-height: 4em;
        max-height: 4em;
        overflow: hidden;
        align-items: center;
    }

    .role-box-small {
        padding: 0.2em 0.6em;
        background-color: #f0f0f0;
        border-radius: 0.3em;
        font-size: 0.85em;
        font-weight: 400;
        white-space: nowrap;
        color: #757575;
        display: inline-block;
        text-transform: uppercase;
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
            rgba(255, 255, 255, 0.90) 30%,
            rgba(255, 255, 255, 0.86) 40%,
            rgba(255, 255, 255, 0.80) 60%,
            rgba(255, 255, 255, 0.70) 68%,
            rgba(255, 255, 255, 0.60) 75%,
            rgba(255, 255, 255, 0.45) 82%,
            rgba(33, 92, 175, 0.20) 88%,
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
        border-radius: 0.3em;
        font-size: 0.75rem;
        font-weight: 500;
        color: #757575;
        text-transform: uppercase;
        cursor: pointer;
        user-select: none;
        white-space: nowrap;
        transition: all 0.2s ease-in-out;
        margin:0.1em;
    }

    .filter-chip-selected {
        background-color: #1976d2;
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
        transition: color 0.2s ease, background-color 0.2s ease;
        padding: 0.5rem;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 2.25rem;
        height: 2.25rem;
    }

    .action-icon:hover {
        color: #215caf;
        background-color: rgba(33, 92, 175, 0.1);
    }


</style>
