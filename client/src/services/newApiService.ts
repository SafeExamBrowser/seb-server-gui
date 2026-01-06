// TODO @alain: this will eventually replace the apiService.ts file

import axios from "axios";
import * as ENV from "@/config/envConfig";
import { useAuthStore } from "@/stores/authentication/authenticationStore";
import { StorageItemEnum } from "@/models/StorageItemEnum";

const api = axios.create({
    baseURL: `${ENV.SERVER_URL}:${3002}`, // TODO @alain: don't hardcode port (this is the port of the new proxy server)
});

export const get = (url: string) => {
    const authStore = useAuthStore();

    return api.get(url, {
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${authStore.getStorageItem(StorageItemEnum.ACCESS_TOKEN)}`,
            "Content-Type": "application/json",
        },
    });
};
