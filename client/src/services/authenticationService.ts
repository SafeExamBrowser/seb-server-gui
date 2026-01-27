import * as newApiService from "@/services/newApiService";

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
