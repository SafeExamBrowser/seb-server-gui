// TODO @alain: this will eventually replace the apiService.ts file

import axios, { AxiosRequestConfig } from "axios";
import { merge } from "lodash";
import * as ENV from "@/config/envConfig";
import { useAuthStore } from "@/stores/authentication/authenticationStore";
import { StorageItemEnum } from "@/models/StorageItemEnum";

const api = axios.create({
    baseURL: `${ENV.SERVER_URL}:${3002}`, // TODO @alain: don't hardcode port (this is the port of the new proxy server)
});

export const getApiForManualRequests = () => api;

export const getRequest = (url: string, options?: AxiosRequestConfig) => {
    const authStore = useAuthStore();

    const defaultOptions: AxiosRequestConfig = {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${authStore.getStorageItem(StorageItemEnum.ACCESS_TOKEN)}`,
        },
    };

    return api.get(url, merge({}, defaultOptions, options));
};

export const postRequest = <T>(
    url: string,
    data?: T,
    options?: AxiosRequestConfig,
) => {
    const authStore = useAuthStore();

    const defaultOptions: AxiosRequestConfig = {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${authStore.getStorageItem(StorageItemEnum.ACCESS_TOKEN)}`,
            "Content-Type": "application/json",
        },
    };

    return api.post(url, data, merge({}, defaultOptions, options));
};

export const putRequest = <T>(
    url: string,
    data?: T,
    options?: AxiosRequestConfig,
) => {
    const authStore = useAuthStore();

    const defaultOptions: AxiosRequestConfig = {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${authStore.getStorageItem(StorageItemEnum.ACCESS_TOKEN)}`,
            "Content-Type": "application/json",
        },
    };

    return api.put(url, data, merge({}, defaultOptions, options));
};

export const deleteRequest = <T>(url: string, data?: T) => {
    const authStore = useAuthStore();

    return api.delete(url, {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${authStore.getStorageItem(StorageItemEnum.ACCESS_TOKEN)}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        data,
    });
};
