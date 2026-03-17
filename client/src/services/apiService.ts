import axios, { AxiosRequestConfig } from "axios";
import { merge } from "lodash";
import { useAuthStore } from "@/composables/store/useAuthStore";
import { AuthType } from "./types";

const api = axios.create({
    baseURL: "/api",
});

type RequestWithDataParams<T> = {
    url: string;
    data?: T;
    options?: AxiosRequestConfig;
    authType?: AuthType;
};

const getAuthHeaderValue = (authType: AuthType) => {
    const authStore = useAuthStore();

    if (authType === "none") {
        return undefined;
    }

    if (authType === "sps") {
        return `Bearer ${authStore.spAccessToken}`;
    }

    return `Bearer ${authStore.sebAccessToken}`;
};

export const getRequest = ({
    url,
    options,
    authType = "seb",
}: {
    url: string;
    options?: AxiosRequestConfig;
    authType?: AuthType;
}) => {
    const authHeaderValue = getAuthHeaderValue(authType);
    const defaultOptions: AxiosRequestConfig = {
        headers: {
            Accept: "application/json",
            ...(authHeaderValue ? { Authorization: authHeaderValue } : {}),
        },
    };

    return api.get(url, merge({}, defaultOptions, options));
};

export const postRequest = <T>({
    url,
    data,
    options,
    authType = "seb",
}: RequestWithDataParams<T>) => {
    const authHeaderValue = getAuthHeaderValue(authType);
    const defaultOptions: AxiosRequestConfig = {
        headers: {
            Accept: "application/json",
            ...(authHeaderValue ? { Authorization: authHeaderValue } : {}),
            "Content-Type": "application/x-www-form-urlencoded",
        },
    };

    return api.post(url, data ?? null, merge({}, defaultOptions, options));
};

export const putRequest = <T>({
    url,
    data,
    options,
    authType = "seb",
}: RequestWithDataParams<T>) => {
    const authHeaderValue = getAuthHeaderValue(authType);
    const defaultOptions: AxiosRequestConfig = {
        headers: {
            Accept: "application/json",
            ...(authHeaderValue ? { Authorization: authHeaderValue } : {}),
            "Content-Type": "application/json",
        },
    };

    return api.put(url, data ?? null, merge({}, defaultOptions, options));
};

export const patchRequest = <T>({
    url,
    data,
    options,
    authType = "seb",
}: RequestWithDataParams<T>) => {
    const authHeaderValue = getAuthHeaderValue(authType);
    const defaultOptions: AxiosRequestConfig = {
        headers: {
            Accept: "application/json",
            ...(authHeaderValue ? { Authorization: authHeaderValue } : {}),
            "Content-Type": "application/json",
        },
    };

    return api.patch(url, data ?? null, merge({}, defaultOptions, options));
};

export const deleteRequest = <T>({
    url,
    data,
    authType = "seb",
}: {
    url: string;
    data?: T;
    authType?: AuthType;
}) => {
    const authHeaderValue = getAuthHeaderValue(authType);
    return api.delete(url, {
        headers: {
            Accept: "application/json",
            ...(authHeaderValue ? { Authorization: authHeaderValue } : {}),
            "Content-Type": "application/x-www-form-urlencoded",
        },
        data: data ?? null,
    });
};
