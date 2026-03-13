import { defineStore } from "pinia";
import { ref } from "vue";
import { UserAccount } from "@/models/userAccount";
import { ServerTablePaging } from "@/models/types";
import { APIMessage } from "@/models/seb-server/apiMessages";

export const useUserAccountStore = defineStore("userAccount", () => {
    const searchField = ref<string | null>(null);
    const startDate = ref<number | null>(null);
    const currentPagingOptions = ref<ServerTablePaging>();

    const selectedUserAccount = ref<UserAccount | null>(null);
    const importMessages = ref<APIMessage[]>([]);

    const refreshTrigger = ref(0);

    function triggerRefresh() {
        refreshTrigger.value++;
    }

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
        refreshTrigger,
        triggerRefresh,
        clearSelectedValues,
    };
});
