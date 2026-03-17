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
        await apiService.postRequest(
            "/authorize",
            body,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            },
            false,
        )
    ).data;
};

export const logout = async () => {
    await apiService.postRequest("/useraccount/logout");
    // TODO @alain: also do sps here
};
