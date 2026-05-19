import axios, { AxiosRequestConfig } from "axios";
import { merge } from "lodash";
import { useAuthStore } from "@/composables/store/useAuthStore";
import { useLogout } from "@/composables/useLogout";
import { toAppError } from "@/services/errors/toAppError.ts";
import { ApiRequest } from "./types";

let tokenRefreshPromise: Promise<void> | undefined = undefined;

const api = axios.create({
    baseURL: "/api",
});

api.interceptors.request.use(async (config) => {
    if (!config._authType) {
        return config;
    }

    if (tokenRefreshPromise) {
        // wait for the token refresh to complete
        await tokenRefreshPromise.catch(() => {});
    }

    // set correct Authorization header
    const authStore = useAuthStore();
    const authToken =
        config._authType === "sps"
            ? authStore.spAccessToken
            : authStore.sebAccessToken;

    if (!authToken) {
        await useLogout().logout(true);
        return Promise.reject(
            new Error(`No token found for auth type: ${config._authType}`),
        );
    }

    config.headers.Authorization = `Bearer ${authToken}`;

    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        // if a request is unauthorized, properly log out the user (clean up store etc.)
        if (error?.response?.status === 401 && error?.config?._authType) {
            await useLogout().logout(true);
        }

        return Promise.reject(toAppError(error));
    },
);

export const setTokenRefreshPromise = (promise: Promise<void> | undefined) =>
    (tokenRefreshPromise = promise);

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
