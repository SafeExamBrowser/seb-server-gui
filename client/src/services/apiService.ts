import axios, { AxiosRequestConfig } from "axios";
import { merge } from "lodash";
import { useAuthStore } from "@/composables/store/useAuthStore";

const api = axios.create({
    baseURL: "/api",
});

const getAuthHeaderValueByUrl = (url: string) => {
    const authStore = useAuthStore();
    if (url.startsWith("/proctoring")) {
        return `Bearer ${authStore.spAccessToken}`;
    }

    return `Bearer ${authStore.sebAccessToken}`;
};

export const getRequest = (
    url: string,
    options?: AxiosRequestConfig,
    includeAuthHeader = true,
) => {
    const defaultOptions: AxiosRequestConfig = {
        headers: {
            Accept: "application/json",
            ...(includeAuthHeader
                ? { Authorization: getAuthHeaderValueByUrl(url) }
                : {}),
        },
    };

    return api.get(url, merge({}, defaultOptions, options));
};

export const postRequest = <T>(
    url: string,
    data?: T,
    options?: AxiosRequestConfig,
    includeAuthHeader = true,
) => {
    const defaultOptions: AxiosRequestConfig = {
        headers: {
            Accept: "application/json",
            ...(includeAuthHeader
                ? { Authorization: getAuthHeaderValueByUrl(url) }
                : {}),
            "Content-Type": "application/x-www-form-urlencoded",
        },
    };

    return api.post(url, data ?? null, merge({}, defaultOptions, options));
};

export const putRequest = <T>(
    url: string,
    data?: T,
    options?: AxiosRequestConfig,
    includeAuthHeader = true,
) => {
    const defaultOptions: AxiosRequestConfig = {
        headers: {
            Accept: "application/json",
            ...(includeAuthHeader
                ? { Authorization: getAuthHeaderValueByUrl(url) }
                : {}),
            "Content-Type": "application/json",
        },
    };

    return api.put(url, data ?? null, merge({}, defaultOptions, options));
};

export const patchRequest = <T>(
    url: string,
    data?: T,
    options?: AxiosRequestConfig,
    includeAuthHeader = true,
) => {
    const defaultOptions: AxiosRequestConfig = {
        headers: {
            Accept: "application/json",
            ...(includeAuthHeader
                ? { Authorization: getAuthHeaderValueByUrl(url) }
                : {}),
            "Content-Type": "application/json",
        },
    };

    return api.patch(url, data ?? null, merge({}, defaultOptions, options));
};

export const deleteRequest = <T>(
    url: string,
    data?: T,
    includeAuthHeader = true,
) => {
    return api.delete(url, {
        headers: {
            Accept: "application/json",
            ...(includeAuthHeader
                ? { Authorization: getAuthHeaderValueByUrl(url) }
                : {}),
            "Content-Type": "application/x-www-form-urlencoded",
        },
        data: data ?? null,
    });
};
