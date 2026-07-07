import * as apiService from "@/services/apiService";
import { type AuthData, authDataSchema, AutoLoginData } from "@/services/types";

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
        }),
        apiService.postRequest({
            url: "/sps/oauth/token",
            data: body,
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
            options: { _skipErrorToast: true },
        }),
        apiService.postRequest({
            url: "/sps/oauth/token",
            data: new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: spsRefreshToken,
            }).toString(),
            options: { _skipErrorToast: true },
        }),
    ]);

    return authDataSchema.parse({
        proctorServer: proctorServerResponse.data,
        sebServer: sebServerResponse.data,
    });
};

export const logout = async () => {
    await Promise.all([
        apiService.postRequest({
            url: "/useraccount/logout",
            options: { _authType: "seb" },
        }),
        apiService.postRequest({
            url: "/sps/useraccount/logout",
            options: { _authType: "sps" },
        }),
    ]);
};

export const verifyOneTimeToken = async (
    token: string,
): Promise<AutoLoginData> => {
    return (
        await apiService.postRequest({
            url: "/oauth/jwttoken/verify",
            options: {
                headers: {
                    "one-time-token-to-verify": token,
                },
                _skipErrorToast: true,
            },
        })
    ).data;
};
