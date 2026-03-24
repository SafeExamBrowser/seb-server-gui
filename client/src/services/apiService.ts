import axios, { AxiosRequestConfig } from "axios";
import { merge } from "lodash";
import { useAuthStore } from "@/composables/store/useAuthStore";
import { useLogout } from "@/composables/useLogout";
import { AuthType } from "./types";

declare module "axios" {
    interface AxiosRequestConfig {
        _authType?: AuthType;
    }
}

const api = axios.create({
    baseURL: "/api",
});

type RequestWithDataParams<T> = {
    url: string;
    data?: T;
    options?: AxiosRequestConfig;
    authType?: AuthType;
};

let tokenRefreshPromise: Promise<void> | undefined = undefined;

export const setTokenRefreshPromise = (promise: Promise<void> | undefined) =>
    (tokenRefreshPromise = promise);

api.interceptors.request.use(async (config) => {
    const authType = config._authType ?? ("none" satisfies AuthType);

    if (authType === "none") {
        return config;
    }

    if (tokenRefreshPromise) {
        // wait for the token refresh to complete
        await tokenRefreshPromise.catch(() => {});
    }

    // set correct Authorization header
    const authStore = useAuthStore();
    const authToken =
        authType === "sps" ? authStore.spAccessToken : authStore.sebAccessToken;

    if (!authToken) {
        throw new Error(`No token found for auth type: ${authType}`);
    }

    config.headers.Authorization = `Bearer ${authToken}`;

    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error?.response?.status !== 401) {
            return Promise.reject(error);
        }

        // if a request is unauthorized, properly log out the user (clean up store etc.) and reject the promise
        await useLogout().logout(true);

        return Promise.reject(error);
    },
);

const getRequestUrl = (url: string, authType: AuthType): string => {
    return `${authType === "sps" ? "/sps" : ""}${url}`;
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
    const defaultOptions: AxiosRequestConfig = {
        _authType: authType,
        headers: {
            Accept: "application/json",
        },
    };

    return api.get(
        getRequestUrl(url, authType),
        merge({}, defaultOptions, options),
    );
};

export const postRequest = <T>({
    url,
    data,
    options,
    authType = "seb",
}: RequestWithDataParams<T>) => {
    const defaultOptions: AxiosRequestConfig = {
        _authType: authType,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
        },
    };

    return api.post(
        getRequestUrl(url, authType),
        data ?? null,
        merge({}, defaultOptions, options),
    );
};

export const putRequest = <T>({
    url,
    data,
    options,
    authType = "seb",
}: RequestWithDataParams<T>) => {
    const defaultOptions: AxiosRequestConfig = {
        _authType: authType,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    };

    return api.put(
        getRequestUrl(url, authType),
        data ?? null,
        merge({}, defaultOptions, options),
    );
};

export const patchRequest = <T>({
    url,
    data,
    options,
    authType = "seb",
}: RequestWithDataParams<T>) => {
    const defaultOptions: AxiosRequestConfig = {
        _authType: authType,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    };

    return api.patch(
        getRequestUrl(url, authType),
        data ?? null,
        merge({}, defaultOptions, options),
    );
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
    return api.delete(getRequestUrl(url, authType), {
        _authType: authType,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
        },
        data: data ?? null,
    });
};
