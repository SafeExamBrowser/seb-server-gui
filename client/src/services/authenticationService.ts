import * as newApiService from "@/services/newApiService";
import axios, { AxiosResponse } from "axios";
import * as ENV from "@/config/envConfig";
import { useAuthStore } from "@/stores/authentication/authenticationStore";
import { StorageItemEnum } from "@/models/StorageItemEnum";
import { JwtTokenResponse, Token } from "@/models/tokenModel";

export const authorize = async (
    userName: string,
    password: string,
): Promise<{
    proctorServer: {
        access_token: string;
        refresh_token: string;
    };
    sebServer: {
        access_token: string;
        refresh_token: string;
    };
}> => {
    const body = new URLSearchParams({
        grant_type: "password",
        username: userName,
        password: password,
    }).toString();

    return (
        await newApiService.getApiForManualRequests().post("/authorize", body, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        })
    ).data;
};

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
