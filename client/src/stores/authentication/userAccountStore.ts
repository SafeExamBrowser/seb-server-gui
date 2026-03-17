import { defineStore } from "pinia";
import { ref } from "vue";
import { UserAccount } from "@/models/userAccount";

export const useUserAccountStore = defineStore("account", () => {
    const userAccount = ref<UserAccount | null>();

    return {
        userAccount,
    };
});
