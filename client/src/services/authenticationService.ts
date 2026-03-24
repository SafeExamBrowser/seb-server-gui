import * as apiService from "@/services/apiService";
import { type AuthData, authDataSchema } from "@/services/types";

export const authorize = async ({
    userName,
    password,
}: {
    userName: string;
    password: string;
}): Promise<AuthData> => {
    const body = new URLSearchParams({
        grant_type: "password",
        username: userName,
        password: password,
    }).toString();

    const [sebServerResponse, proctorServerResponse] = await Promise.all([
        apiService.postRequest({
            url: "/oauth/token",
            data: body,
            options: { _authType: "none" },
        }),
        apiService.postRequest({
            url: "/sps/oauth/token",
            data: body,
            options: { _authType: "none" },
        }),
    ]);

    return authDataSchema.parse({
        proctorServer: proctorServerResponse.data,
        sebServer: sebServerResponse.data,
    });
};

export const refresh = async ({
    sebRefreshToken,
    spsRefreshToken,
}: {
    sebRefreshToken: string;
    spsRefreshToken: string;
}): Promise<AuthData> => {
    const [sebServerResponse, proctorServerResponse] = await Promise.all([
        apiService.postRequest({
            url: "/oauth/token",
            data: new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: sebRefreshToken,
            }).toString(),
            options: { _authType: "none" },
        }),
        apiService.postRequest({
            url: "/sps/oauth/token",
            data: new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: spsRefreshToken,
            }).toString(),
            options: { _authType: "none" },
        }),
    ]);

    return authDataSchema.parse({
        proctorServer: proctorServerResponse.data,
        sebServer: sebServerResponse.data,
    });
};

export const logout = async () => {
    await Promise.all([
        apiService.postRequest({ url: "/useraccount/logout" }),
        apiService.postRequest({
            url: "/sps/useraccount/logout",
            options: { _authType: "sps" },
        }),
    ]);
};
