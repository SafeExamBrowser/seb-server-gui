import { defineStore } from "pinia";
import { ref } from "vue";
import { UserAccount } from "@/models/userAccount";

export const useUserAccountStore = defineStore("account", () => {
    const userAccount = ref<UserAccount | null>();
    const isEditMode = ref<boolean>();
    const isAccountSelected = ref<boolean>(false);
    const selectedAccountId = ref<number>();

    function setUserTimeZone(userTimeZone: string) {
        localStorage.setItem("userTimeZone", userTimeZone);
    }

    function getUserTimeZone(): string {
        const userTimeZone: string | null =
            localStorage.getItem("userTimeZone");
        if (userTimeZone == null) {
            return "UTC";
        }
        return userTimeZone;
    }

    return {
        userAccount,
        isEditMode,
        isAccountSelected,
        selectedAccountId,
        setUserTimeZone,
        getUserTimeZone,
    };
});
