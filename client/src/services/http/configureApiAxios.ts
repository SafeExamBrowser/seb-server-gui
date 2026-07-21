import "@/services/types";

import type { AxiosInstance, AxiosRequestConfig } from "axios";

import { useAuthStore } from "@/composables/store/useAuthStore";
import { toAppError } from "@/services/errors/toAppError.ts";
import { transportErrorDedupeKey } from "@/services/errors/transport.ts";
import { notify } from "@/services/notifications/notify.ts";

type AuthType = NonNullable<AxiosRequestConfig["_authType"]>;

type ConfigureApiAxiosOptions = {
    defaultAuthType?: (config: AxiosRequestConfig) => AuthType | undefined;
};

let tokenRefreshPromise: Promise<void> | undefined = undefined;

export const setTokenRefreshPromise = (promise: Promise<void> | undefined) => {
    tokenRefreshPromise = promise;
};

const logout = async (skipServerLogout: boolean) => {
    const { useLogout } = await import("@/composables/useLogout");
    await useLogout().logout(skipServerLogout);
};

export const configureApiAxios = (
    api: AxiosInstance,
    options: ConfigureApiAxiosOptions = {},
) => {
    api.interceptors.request.use(async (config) => {
        const authType = config._authType ?? options.defaultAuthType?.(config);

        if (!authType) {
            return config;
        }

        config._authType = authType;

        if (tokenRefreshPromise) {
            // wait for the token refresh to complete
            await tokenRefreshPromise.catch(() => {});
        }

        // set correct Authorization header
        const authStore = useAuthStore();
        const authToken =
            authType === "sps"
                ? authStore.spAccessToken
                : authStore.sebAccessToken;

        if (!authToken) {
            await logout(true);
            return Promise.reject(
                new Error(`No token found for auth type: ${authType}`),
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
                await logout(true);
            }

            const appError = toAppError(error);
            const transportKey = transportErrorDedupeKey(appError);
            if (transportKey && !error?.config?._skipErrorToast) {
                notify.serverError(appError, { dedupeKey: transportKey });
            }
            return Promise.reject(appError);
        },
    );

    return api;
};
