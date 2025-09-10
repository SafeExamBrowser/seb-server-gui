import axios, { AxiosResponse } from "axios";
import * as ENV from "@/config/envConfig";
import { useLoadingStore } from "@/stores/store";
import * as apiService from "@/services/apiService";
import { useAuthStore } from "@/stores/authentication/authenticationStore";
import { StorageItemEnum } from "@/models/StorageItemEnum";

let loadingTimeout: NodeJS.Timeout | null = null;
let loadingEndTimeout: NodeJS.Timeout | null = null;

export async function login(
    username: string,
    password: string,
    isSpLogin: boolean,
): Promise<string | any> {
    const loadingStore = useLoadingStore();

    try {
        let url: string = ENV.SERVER_URL + ENV.SERVER_PORT + "/authorize";

        if (isSpLogin) {
            url = ENV.SERVER_URL + ENV.SERVER_PORT + "/sp-authorize";
        }
        console.log(username, password, url);
        // this is implemented for general api-calls in apiService.ts but has to be done explicitly for login as it does not use said service
        setLoginTimeouts();

        const response = await axios.post(url, {
            username,
            password,
        });

        if (response.status === 200) {
            resetLoadingState();
            return response.data;
        }
    } catch (error) {
        resetLoadingState();
        throw error;
    }

    function setLoginTimeouts() {
        loadingTimeout = setTimeout(() => {
            loadingStore.isLoading = true;
        }, 500);
        loadingEndTimeout = setTimeout(() => {
            resetLoadingState();
            loadingStore.isTimeout = true;
        }, 10000);
    }

    function resetLoadingState() {
        if (loadingTimeout) clearTimeout(loadingTimeout);
        if (loadingEndTimeout) clearTimeout(loadingEndTimeout);

        loadingStore.isLoading = false;
    }
}

export async function refresh(isSpRefresh: boolean): Promise<string | any> {
    const authStore = useAuthStore();

    try {
        let url: string = ENV.SERVER_URL + ENV.SERVER_PORT + "/refresh";
        let refreshTokenString: string = StorageItemEnum.REFRESH_TOKEN;

        if (isSpRefresh) {
            url = ENV.SERVER_URL + ENV.SERVER_PORT + "/sp-refresh";
            refreshTokenString = StorageItemEnum.SP_REFRESH_TOKEN;
        }

        const headers = {
            Authorization:
                "Bearer " + authStore.getStorageItem(refreshTokenString),
        };

        const response: AxiosResponse<Token> = await axios.post(
            url,
            {},
            { headers },
        );

        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function verifyJwt(token: string): Promise<string | any> {
    try {
        const url: string =
            ENV.SERVER_URL + ENV.SERVER_PORT + "/jwttoken/verify";

        const response = await axios.post(url, { token });

        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        throw error;
    }
}

export async function logLogout() {
    try {
        const url: string = "useraccount/logLogout";
        await apiService.api.post(url, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
        });
    } catch (error) {
        throw error;
    }
}
