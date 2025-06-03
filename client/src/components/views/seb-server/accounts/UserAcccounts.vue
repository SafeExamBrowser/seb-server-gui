<template>
    <v-row>
        <v-col>
            <v-sheet elevation="4" class="rounded-lg pa-8">
                <v-data-table-server
                    item-value="id"
                    @update:options="loadItems"
                    :hover="true"
                    :loading="isLoading"
                    :loading-text="translate('general.loadingText')"
                    :items="userAccounts?.content"
                    :items-length="totalItems"
                    :items-per-page="userAccounts?.page_size || 10"
                    :items-per-page-options="tableUtils.calcItemsPerPage(totalItems)"
                    :headers="userAccountsTableHeaders"
                >
                    <!-- Custom header slot to wire up sorting icons, etc. -->
                    <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort }">
                        <TableHeaders
                            :columns="columns"
                            :is-sorted="isSorted"
                            :get-sort-icon="getSortIcon"
                            :toggle-sort="toggleSort"
                            :header-refs-prop="userAccountsTableHeadersRef"
                        />
                    </template>

                    <!-- Each row: clicking highlights/selects, chevron‐icon navigates to detail -->
                    <template v-slot:item="{ item }">
                        <tr
                            @click="onRowClick(item)"
                            class="on-row-hover"
                            :class="[selectedUserAccount?.id === item.id ? 'selected-row' : '']"
                        >
                            <td>{{ item.name }}</td>
                            <td>{{ item.surname }}</td>
                            <td>{{ item.username }}</td>
                            <td>{{ item.email }}</td>
                            <td>{{ item.userRoles }}</td>
                            <td>{{ item.active }}</td>
                            <td align="right">
                                <v-icon
                                    class="mr-6"
                                    icon="mdi-chevron-right"
                                    style="font-size: 30px;"
                                    @click.stop="navigateTo(constants.USER_ACCOUNT_DETAIL_ROUTE + '/' + item.id.toString())"
                                ></v-icon>
                            </td>
                        </tr>
                    </template>
                </v-data-table-server>
            </v-sheet>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
    import { ref, onMounted, onBeforeUnmount } from 'vue';
    import { useAppBarStore, useLayoutStore } from '@/stores/store';
    import { translate } from '@/utils/generalUtils';
    import * as tableUtils from '@/utils/table/tableUtils';
    import * as timeUtils from '@/utils/timeUtils';
    import TableHeaders from '@/utils/table/TableHeaders.vue';
    import { navigateTo } from '@/router/navigation';
    import * as constants from '@/utils/constants';
    import { useI18n } from 'vue-i18n';

    import * as userAccountViewService from '@/services/seb-server/component-services/userAccountViewService';
    import { useUserAccountStore } from '@/stores/seb-server/userAccountStore';
    import type { UserAccount, UserAccountResponse } from '@/models/userAccount';
    import {USER_ACCOUNT_DETAIL_ROUTE} from "@/utils/constants";
    import {assignUserAccountSelectPagingOptions} from "@/utils/table/tableUtils";

    //
    // —— Set up “global” / layout stores
    //
    const appBarStore = useAppBarStore();
    const layoutStore = useLayoutStore();
    const i18n = useI18n(); // if you need to translate text

    //
    // —— Our Pinia store and reactive state
    //
    const userAccountStore = useUserAccountStore();
    const selectedUserAccount = ref<UserAccount | null>(null);
    const userAccounts = ref<UserAccountResponse>();

    const isLoading = ref<boolean>(true);
    const totalItems = ref<number>(10);

    //
    // —— Table sorting / paging state
    //
    const isOnLoad = ref<boolean>(true);
    const defaultSort: { key: string; order: string }[] = [{ key: 'name', order: 'desc' }];
    const userAccountsTableHeadersRef = ref<any[]>();
    const userAccountsTableHeaders = ref([
        {
            title: translate('userAccountList.main.tableHeaderName'),
            key: 'name',
            width: '20%',
            sortable: true
        },
        {
            title: translate('userAccountList.main.tableHeaderSurname'),
            key: 'surname',
            width: '20%',
            sortable: true
        },
        {
            title: translate('userAccountList.main.tableHeaderUsername'),
            key: 'username',
            width: '15%',
            sortable: true
        },
        {
            title: translate('userAccountList.main.tableHeaderEmail'),
            key: 'email',
            width: '25%',
            sortable: true
        },
        {
            title: translate('userAccountList.main.tableHeaderRoles'),
            key: 'userRoles',
            width: '10%',
            sortable: false

        },
        {
            title: translate('userAccountList.main.tableHeaderStatus'),
            key: 'status',
            width: '10%',
            sortable: false
        },
        {
            title: '',
            key: 'userAccountLink',
            width: '5%',
        },
    ]);

    defineExpose({
        loadItems,
    });

    //
    // —— Lifecycle hooks to set the AppBar title, background, etc.
    //
    onBeforeUnmount(() => {
        layoutStore.setBlueBackground(false);
    });
    onMounted(() => {
        appBarStore.title = translate('titles.userAccounts');
        layoutStore.setBlueBackground(true);
    });

    //
    // —— When you click on a row, toggle selection and update store.selectedUserAccount
    //
    function onRowClick(account: UserAccount) {
        if (account.id === selectedUserAccount.value?.id) {
            selectedUserAccount.value = null;
            userAccountStore.clearSelectedValues();
            return;
        }
        selectedUserAccount.value = account;
        userAccountStore.selectedUserAccount = account;
    }

    //
    // —— Fetching / paging logic exactly parallels ExamListMain.vue but calls getUserAccounts
    //
    async function loadItems(serverTablePaging: ServerTablePaging) {
        console.log('Total items calculated:', totalItems.value);

        // 1) Save the paging options into Pinia so other components (e.g. detail) can read them
        userAccountStore.currentPagingOptions = serverTablePaging;
        isLoading.value = true;

        // 2) On first load, force default sort
        if (!serverTablePaging.sortBy || serverTablePaging.sortBy.length === 0) {
            serverTablePaging.sortBy = defaultSort;
        }


        // 3) If you kept startDate in store for creationDate‐filtering:
        let startTimestamp: number | null = null;
        if (userAccountStore.startDate != null) {
            startTimestamp = userAccountStore.startDate;
        }

        // 4) Build “optionalParams” exactly as your exam table did.
        //    You might have a generic helper like tableUtils.assignGenericPagingOptions(...)
        //    that takes (serverTablePaging, searchField, startTimestamp).
        //    If not, just do the same pattern you used in assignExamSelectPagingOptions,
        //    but remove type/status filters. For now let’s assume you have:
        //      tableUtils.assignGenericPagingOptions(paging, search, date)
        const optionalParams = tableUtils.assignUserAccountSelectPagingOptions(
            serverTablePaging,
            userAccountStore.searchField,
            startTimestamp
        );

        // 5) Call your service
        const response: UserAccountResponse | null = await userAccountViewService.getUserAccounts(optionalParams);
        if (response == null) {
            isLoading.value = false;
            return;
        }

        // 6) Copy the response into local state, and update totalItems
        userAccounts.value = response;
        totalItems.value = response.page_size * response.number_of_pages;

        isOnLoad.value = false;
        isLoading.value = false;
    }
</script>

<style scoped>
    .on-row-hover:hover {
        background: #e4e4e4 !important;
        cursor: pointer;
    }

    .selected-row {
    }
</style>
