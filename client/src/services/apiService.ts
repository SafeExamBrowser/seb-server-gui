import axios, { AxiosRequestConfig } from "axios";
import { merge } from "lodash";

import {
    configureApiAxios,
    setTokenRefreshPromise,
} from "@/services/http/configureApiAxios.ts";

import { ApiRequest } from "./types";

export { setTokenRefreshPromise };

const api = configureApiAxios(
    axios.create({
        baseURL: "/api",
    }),
);

export const getRequest = ({
    url,
    options,
}: {
    url: string;
    options?: AxiosRequestConfig;
}) => {
    const defaultOptions: AxiosRequestConfig = {
        headers: {
            Accept: "application/json",
        },
    };

    return api.get(url, merge({}, defaultOptions, options));
};

export const postRequest = <T>({ url, data, options }: ApiRequest<T>) => {
    const defaultOptions: AxiosRequestConfig = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
        },
    };

    return api.post(url, data ?? null, merge({}, defaultOptions, options));
};

export const putRequest = <T>({ url, data, options }: ApiRequest<T>) => {
    const defaultOptions: AxiosRequestConfig = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    };

    return api.put(url, data ?? null, merge({}, defaultOptions, options));
};

export const patchRequest = <T>({ url, data, options }: ApiRequest<T>) => {
    const defaultOptions: AxiosRequestConfig = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    };

    return api.patch(url, data ?? null, merge({}, defaultOptions, options));
};

export const deleteRequest = <T>({ url, data, options }: ApiRequest<T>) => {
    const defaultOptions: AxiosRequestConfig = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
        },
        data: data ?? null,
    };

    return api.delete(url, merge({}, defaultOptions, options));
};
