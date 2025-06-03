import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { UserAccount } from '@/models/userAccount';
// (You can add more fields as you need them for the detail page, e.g. roles, messages, etc.)

export const useUserAccountStore = defineStore('userAccount', () => {
    // table
    const searchField = ref<string | null>(null);
    // if you want to filter by creationDate (just like exam used startDate), keep this. Otherwise remove.
    const startDate = ref<number | null>(null);
    const currentPagingOptions = ref<ServerTablePaging>();

    // detail‐page
    const selectedUserAccount = ref<UserAccount | null>(null);
    // e.g. if you want to show messages or other related data on the detail page:
    const importMessages = ref<APIMessage[]>([]);

    function clearSelectedValues() {
        selectedUserAccount.value = null;
        importMessages.value = [];
    }

    return {
        searchField,
        startDate,
        currentPagingOptions,
        selectedUserAccount,
        importMessages,
        clearSelectedValues,
    };
});
