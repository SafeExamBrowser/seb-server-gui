import { defineStore } from "pinia";
import type { UserAccount } from "@/models/userAccount";
import { useDateFilterSettingsStore } from "@/components/views/seb-server/settings-navigation/store/useBaseSettingsStore.ts";

export const useUserAccountsStore = defineStore("userAccount", () => {
    return useDateFilterSettingsStore<UserAccount>();
});
