import * as apiService from "@/services/apiService";

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
        await apiService.postRequest({
            url: "/authorize",
            data: body,
            options: {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            },
            authType: "none",
        })
    ).data;
};

export const logout = async () => {
    await Promise.all([
        apiService.postRequest({ url: "/useraccount/logout" }),
        apiService.postRequest({ url: "/useraccount/logout", authType: "sps" }),
    ]);
};
