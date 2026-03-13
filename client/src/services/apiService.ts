import axios, { AxiosRequestConfig } from "axios";
import { merge } from "lodash";
import { useAuthStore } from "@/stores/authentication/authenticationStore";
import { StorageItemEnum } from "@/models/StorageItemEnum";

const api = axios.create({
    baseURL: "/api",
});

const getAuthHeaderValueByUrl = (url: string) =>
    `Bearer ${useAuthStore().getStorageItem(url.startsWith("/proctoring") ? StorageItemEnum.SP_ACCESS_TOKEN : StorageItemEnum.ACCESS_TOKEN)}`;

export const getApiForManualRequests = () => api;

export const getRequest = (url: string, options?: AxiosRequestConfig) => {
    const defaultOptions: AxiosRequestConfig = {
        headers: {
            Accept: "application/json",
            Authorization: getAuthHeaderValueByUrl(url),
        },
    };

    return api.get(url, merge({}, defaultOptions, options));
};

export const postRequest = <T>(
    url: string,
    data?: T,
    options?: AxiosRequestConfig,
) => {
    const defaultOptions: AxiosRequestConfig = {
        headers: {
            Accept: "application/json",
            Authorization: getAuthHeaderValueByUrl(url),
            "Content-Type": "application/x-www-form-urlencoded",
        },
    };

    return api.post(url, data ?? null, merge({}, defaultOptions, options));
};

export const putRequest = <T>(
    url: string,
    data?: T,
    options?: AxiosRequestConfig,
) => {
    const defaultOptions: AxiosRequestConfig = {
        headers: {
            Accept: "application/json",
            Authorization: getAuthHeaderValueByUrl(url),
            "Content-Type": "application/json",
        },
    };

    return api.put(url, data ?? null, merge({}, defaultOptions, options));
};

export const patchRequest = <T>(
    url: string,
    data?: T,
    options?: AxiosRequestConfig,
) => {
    const defaultOptions: AxiosRequestConfig = {
        headers: {
            Accept: "application/json",
            Authorization: getAuthHeaderValueByUrl(url),
            "Content-Type": "application/json",
        },
    };

    return api.patch(url, data ?? null, merge({}, defaultOptions, options));
};

export const deleteRequest = <T>(url: string, data?: T) => {
    return api.delete(url, {
        headers: {
            Accept: "application/json",
            Authorization: getAuthHeaderValueByUrl(url),
            "Content-Type": "application/x-www-form-urlencoded",
        },
        data: data ?? null,
    });
};
