import * as apiService from "@/services/apiService";

export const authorize = async (
    userName: string,
    password: string,
): Promise<{
    proctorServer: {
        access_token: string;
        refresh_token: string;
        expires_in: number;
    };
    sebServer: {
        access_token: string;
        refresh_token: string;
        expires_in: number;
    };
}> => {
    const body = new URLSearchParams({
        grant_type: "password",
        username: userName,
        password: password,
    }).toString();

    const [sebServerResponse, proctorServerResponse] = await Promise.all([
        apiService.postRequest({
            url: "/oauth/token",
            data: body,
            authType: "none",
        }),
        apiService.postRequest({
            url: "/sps/oauth/token",
            data: body,
            authType: "none",
        }),
    ]);

    return {
        proctorServer: {
            access_token: proctorServerResponse.data.access_token,
            refresh_token: proctorServerResponse.data.refresh_token,
            expires_in: proctorServerResponse.data.expires_in,
        },
        sebServer: {
            access_token: sebServerResponse.data.access_token,
            refresh_token: sebServerResponse.data.refresh_token,
            expires_in: sebServerResponse.data.expires_in,
        },
    };
};

export const logout = async () => {
    await Promise.all([
        apiService.postRequest({ url: "/useraccount/logout" }),
        apiService.postRequest({ url: "/useraccount/logout", authType: "sps" }),
    ]);
};
