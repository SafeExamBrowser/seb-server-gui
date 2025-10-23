import axios, { AxiosResponse } from "axios";
import * as ENV from "@/config/envConfig";
import { useLoadingStore } from "@/stores/store";
// import * as apiService from "@/services/apiService";
import { useAuthStore } from "@/stores/authentication/authenticationStore";
import { StorageItemEnum } from "@/models/StorageItemEnum";
import { JwtTokenResponse, Token } from "@/models/tokenModel";

let loadingTimeout: ReturnType<typeof setTimeout> | null = null;
let loadingEndTimeout: ReturnType<typeof setTimeout> | null = null;

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    token_type?: string;
    expires_in?: number;
}
function setLoginTimeouts() {
    const loadingStore = useLoadingStore();

    loadingTimeout = setTimeout(() => {
        loadingStore.isLoading = true;
    }, 500);

    loadingEndTimeout = setTimeout(() => {
        resetLoadingState();
        loadingStore.isTimeout = true;
    }, 10000);
}

function resetLoadingState() {
    const loadingStore = useLoadingStore();

    if (loadingTimeout) clearTimeout(loadingTimeout);
    if (loadingEndTimeout) clearTimeout(loadingEndTimeout);

    loadingTimeout = null;
    loadingEndTimeout = null;

    loadingStore.isLoading = false;
}

// ---- API ------------------------------------------------------

export async function login(
    username: string,
    password: string,
    isSpLogin: boolean,
): Promise<AuthResponse> {
    const loadingStore = useLoadingStore();

    try {
        const base = ENV.SERVER_URL + ENV.SERVER_PORT;
        const url = isSpLogin ? `${base}/sp-authorize` : `${base}/authorize`;

        loadingStore.isTimeout = false;
        setLoginTimeouts();

        const response: AxiosResponse<AuthResponse> = await axios.post(url, {
            username,
            password,
        });

        if (response.status === 200) {
            resetLoadingState();
            return response.data;
        }
        resetLoadingState();
        throw new Error(`Login failed with status ${response.status}`);
    } catch (error) {
        resetLoadingState();
        throw error;
    }
}

export async function refresh(isSpRefresh: boolean): Promise<Token | null> {
    const authStore = useAuthStore();

    let url: string = ENV.SERVER_URL + ENV.SERVER_PORT + "/refresh";
    let refreshTokenString: string = StorageItemEnum.REFRESH_TOKEN;

    if (isSpRefresh) {
        url = ENV.SERVER_URL + ENV.SERVER_PORT + "/sp-refresh";
        refreshTokenString = StorageItemEnum.SP_REFRESH_TOKEN;
    }

    const headers = {
        Authorization: "Bearer " + authStore.getStorageItem(refreshTokenString),
    };

    const response: AxiosResponse<Token> = await axios.post(
        url,
        {},
        { headers },
    );

    return response.data;
}

export async function verifyJwt(token: string): Promise<JwtTokenResponse> {
    const url: string = ENV.SERVER_URL + ENV.SERVER_PORT + "/jwttoken/verify";

    const response = await axios.post(url, { token });

    if (response.status === 200) {
        return response.data;
    } else {
        return response.data;
    }
}

// TODO integrate log out -> backend provides endpoint?
// export async function logLogout() {
//     try {
//         const url: string = "useraccount/logLogout";
//         await apiService.api.post(url, {
//             headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
//         });
//     } catch (error) {
//         throw error;
//     }
// }
