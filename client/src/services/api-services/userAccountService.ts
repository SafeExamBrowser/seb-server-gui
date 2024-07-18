import axios, { AxiosResponse } from "axios";
import * as ENV from "@/config/envConfig";
import * as apiService from "@/services/api-services/apiService";

const userAccountUrl: string = "/useraccount";

export async function register(
    name: string,
    surname: string,
    username: string,
    newPassword: string,
    confirmNewPassword: string,
    email?: string,
    timezone?: string,
): Promise<UserAccount | any> {

    try {
        const url: string = ENV.SERVER_URL + ENV.SERVER_PORT + userAccountUrl + "/register";

        const { data, status }: AxiosResponse = await axios.post(url, {
            name,
            surname,
            username,
            newPassword,
            confirmNewPassword,
            email,
            timezone
        });

        if (status === 200) {
            return data;
        }

    } catch (error) {
        throw error;
    }
}

export async function changePassword(
    uuid: string,
    password: string,
    newPassword: string,
    confirmNewPassword: string,
): Promise<UserAccount | any> {
    try {

        const url: string = userAccountUrl + "/changePassword";

        const { data, status }: AxiosResponse = await apiService.api.post(url, { uuid, password, newPassword, confirmNewPassword }, { headers: apiService.getPostHeaders() });

        if (status === 200) {
            return data;
        }

    } catch (error) {
        throw error;
    }
}


export async function getPersonalUserAccount(): Promise<UserAccount | any> {
    try {
        const url: string = userAccountUrl + "/me";
        const { data, status }: AxiosResponse = await apiService.api.get(url, { headers: apiService.getHeaders() });

        if (status === 200) {
            return data;
        }

    } catch (error) {
        throw error;
    }
}

export async function getUserAccountById(accountId: string): Promise<UserAccount | any> {
    try {
        const url: string = userAccountUrl + "/" + accountId;
        const { data, status }: AxiosResponse = await apiService.api.get(url, { headers: apiService.getHeaders() });

        if (status === 200) {
            return data;
        }

    } catch (error) {
        throw error;
    }
}

export async function getUserAccounts(optionalParamters?: OptionalParGeneric): Promise<UserAccountResponse[] | any> {
    try {
        const url: string = userAccountUrl;
        const { data, status }: AxiosResponse = await apiService.api.get(url, { headers: apiService.getHeaders(), params: { optionalParamters } });

        if (status === 200) {
            return data;
        }

    } catch (error) {
        throw error;
    }
}

export async function activateUserAccount(accountId: string): Promise<UserAccount | any> {
    try {
        const url: string = userAccountUrl + "/activate/" + accountId;
        const { data, status }: AxiosResponse = await apiService.api.post(url, { headers: apiService.getHeaders() });

        if (status === 200) {
            return data;
        }

    } catch (error) {
        throw error;
    }
}

export async function deactivateUserAccount(accountId: string): Promise<UserAccount | any> {
    try {
        const url: string = userAccountUrl + "/deactivate/" + accountId;
        const { data, status }: AxiosResponse = await apiService.api.post(url, { headers: apiService.getHeaders() });

        if (status === 200) {
            return data;
        }

    } catch (error) {
        throw error;
    }
}
