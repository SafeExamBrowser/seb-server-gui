import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import * as authenticationService from "@/services/authenticationService";
import { navigateTo } from "@/router/navigation";
import * as ENV from "@/config/envConfig";
import { useLoadingStore } from "@/stores/store";
import { useAuthStore } from "@/stores/authentication/authenticationStore";
import * as generalUtils from "@/utils/generalUtils";
import { StorageItemEnum } from "@/models/StorageItemEnum";
import { notify } from "@/components/views/seb-server/toast/notify";
import { Token } from "@/models/tokenModel";

export let api: AxiosInstance;

export function createApi() {
    api = axios.create({
        baseURL: ENV.SERVER_URL + ENV.SERVER_PORT,
        headers: getHeaders(StorageItemEnum.ACCESS_TOKEN),
    });
}

declare module "axios" {
    export interface AxiosRequestConfig {
        suppressToast?: boolean;
        toastContext?: string;
        toastDedupeKey?: string;
        _retry?: boolean;
    }
}

export function createApiInterceptor() {
    const authStore = useAuthStore();
    const loadingStore = useLoadingStore();

    let loadingTimer: NodeJS.Timeout | null = null;
    const loadingTimout = 500;
    let requests = 0;
    let loadingEndTimer: NodeJS.Timeout | null = null;

    api.interceptors.request.use(async (config) => {
        const isIgnoredUrl = isUrlIgnorable(config.url);
        if (loadingStore.skipLoading || isIgnoredUrl) {
            return config;
        }

        requests++;
        if (requests === 1) {
            loadingTimer = setTimeout(() => {
                loadingStore.isLoading = true;
            }, loadingTimout);

            const loadingEndTimout = 20000;
            loadingEndTimer = setTimeout(() => {
                resetLoadingState();
            }, loadingEndTimout);
        }
        return config;
    });

    api.interceptors.response.use(
        async (response) => {
            resetLoadingState();
            return response;
        },
        async (error) => {
            resetLoadingState();

            const originalRequest = (error.config ?? {}) as AxiosRequestConfig;

            if (error?.response?.status === 401 && !originalRequest._retry) {
                return handleAuthenticationError(originalRequest);
            }

            const suppress = originalRequest?.suppressToast === true;
            if (!suppress) {
                notify.serverError(error, {
                    contextLabel:
                        originalRequest?.toastContext ??
                        (originalRequest?.url
                            ? `${originalRequest.url}`
                            : "Request"),
                    splitToasts: true,
                    dedupeKey:
                        originalRequest?.toastDedupeKey ??
                        (originalRequest?.url || "request"),
                });
            }

            return Promise.reject(error);
        },
    );

    async function handleAuthenticationError(
        originalRequest: AxiosRequestConfig,
    ) {
        try {
            const response: Token | null =
                await authenticationService.refresh(false);
            if (!response) {
                return;
            }

            authStore.setStorageItem(
                StorageItemEnum.ACCESS_TOKEN,
                response.access_token,
            );
            authStore.setStorageItem(
                StorageItemEnum.REFRESH_TOKEN,
                response.refresh_token,
            );

            if (
                generalUtils.stringToBoolean(
                    authStore.getStorageItem(StorageItemEnum.IS_SP_AVAILABLE),
                )
            ) {
                const spResponse: Token | null =
                    await authenticationService.refresh(true);
                if (!spResponse) {
                    return;
                }

                authStore.setStorageItem(
                    StorageItemEnum.SP_ACCESS_TOKEN,
                    spResponse.access_token,
                );
                authStore.setStorageItem(
                    StorageItemEnum.SP_REFRESH_TOKEN,
                    spResponse.refresh_token,
                );
            }

            originalRequest._retry = true;

            const originalUrl = originalRequest.url;
            originalRequest.headers =
                originalUrl && originalUrl.startsWith("/sp/")
                    ? getHeaders(StorageItemEnum.SP_ACCESS_TOKEN)
                    : getHeaders(StorageItemEnum.ACCESS_TOKEN);

            return api(originalRequest);
        } catch (err) {
            let redirectRoute = "/";
            if (window.location.pathname != null) {
                redirectRoute = window.location.pathname;
            }
            authStore.redirectRoute = redirectRoute;
            navigateTo("/");
            return Promise.reject(err);
        }
    }

    function resetLoadingState() {
        requests--;
        if (requests > 0) return;
        requests = 0;
        if (loadingTimer) clearTimeout(loadingTimer);
        if (loadingEndTimer) clearTimeout(loadingEndTimer);
        loadingTimer = null;
        loadingEndTimer = null;
        loadingStore.isLoading = false;
        loadingStore.skipLoading = false;
    }
}

export function getHeaders(type: string): object {
    const authStore = useAuthStore();

    return {
        accept: "application/json",
        Authorization: "Bearer " + authStore.getStorageItem(type),
        "Content-Type": "application/x-www-form-urlencoded",
    };
}

export function getPostHeaders(type: string): object {
    const authStore = useAuthStore();

    return {
        accept: "application/json",
        Authorization: "Bearer " + authStore.getStorageItem(type),
        "Content-Type": "application/json",
    };
}

export function getPutHeaders(type: string): object {
    const authStore = useAuthStore();

    return {
        accept: "application/json",
        Authorization: "Bearer " + authStore.getStorageItem(type),
        "Content-Type": "application/json",
    };
}

export function throttle<TArgs extends unknown[]>(
    func: (...args: TArgs) => void,
    limit: number,
): (...args: TArgs) => void {
    let lastFunc: ReturnType<typeof setTimeout> | undefined;
    let lastRan: number | undefined;

    return function (...args: TArgs) {
        const now = Date.now();

        if (lastRan === undefined) {
            func(...args);
            lastRan = now;
        } else {
            if (lastFunc) clearTimeout(lastFunc);

            const remaining = Math.max(limit - (now - lastRan), 0);

            lastFunc = setTimeout(() => {
                const elapsed = Date.now() - (lastRan ?? 0);
                if (elapsed >= limit) {
                    func(...args);
                    lastRan = Date.now();
                }
            }, remaining);
        }
    };
}

function getIgnoredUrls(): string[] {
    return [
        "/quiz",
        "/exams",
        "/sp/screenshot/",
        "/sp/screenshot-data/",
        "/sp/screenshot-timestamps/",
        "/sp/search/timeline",
        "/sp/search/sessions",
        "/instruction",
        "/disable-connection",
    ];
}

function isUrlIgnorable(url: string | undefined): boolean {
    if (url == null) {
        return false;
    }

    const ignoredUrls: string[] = getIgnoredUrls();

    // if(url == "/search/sessions/day"){
    //     return false;
    // }

    if (url.endsWith("/fullpage")) {
        return true;
    }

    return ignoredUrls.some((urlFromList) => url.includes(urlFromList));
}

export function createSessionDeleteUrlSuffix(sessionUuids: string[]): string {
    let urlSuffix = "?modelIds=";

    for (let i = 0; i < sessionUuids.length; i++) {
        urlSuffix += sessionUuids[i];

        if (i !== sessionUuids.length - 1) {
            urlSuffix += "&modelIds=";
        }
    }

    return urlSuffix;
}
