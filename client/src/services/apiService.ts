import axios, { AxiosInstance } from "axios";
import * as authenticationService from "@/services/authenticationService";
import { navigateTo } from "@/router/navigation";
import * as ENV from "@/config/envConfig";
import { useLoadingStore } from "@/stores/store";
import { useAuthStore } from "@/stores/authentication/authenticationStore";
import * as generalUtils from "@/utils/generalUtils";
import { StorageItemEnum } from "@/models/StorageItemEnum";
import { notify } from "@/components/views/seb-server/toast/notify";

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
            // console.error(error); // keep if you want

            const originalRequest = error.config ?? {};

            // ---- 401 refresh flow (unchanged) ----
            if (error?.response?.status === 401 && !originalRequest._retry) {
                return handleAuthenticationError(originalRequest);
            }

            // ---- toast the backend error via your notify service ----
            // allow opt-out per request
            const suppress = originalRequest?.suppressToast === true;
            if (!suppress) {
                notify.serverError(error, {
                    // show where it happened; fallback to generic if absent
                    contextLabel:
                        originalRequest?.toastContext ??
                        (originalRequest?.url
                            ? `${originalRequest.url}`
                            : "Request"),
                    // split multiple backend errors into separate toasts
                    splitToasts: true,
                    // dedupe by either provided key or url to avoid spam on rapid retries
                    dedupeKey:
                        originalRequest?.toastDedupeKey ??
                        (originalRequest?.url || "request"),
                });
            }

            // keep the rejection so callers can still handle it if needed
            return Promise.reject(error);
        },
    );

    async function handleAuthenticationError(originalRequest: any) {
        try {
            const response: Token = await authenticationService.refresh(false);
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
                const spResponse: Token =
                    await authenticationService.refresh(true);
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

            // choose correct headers based on path
            const originalUrl: string | null = originalRequest.url;
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

export function throttle<T extends (...args: any[]) => void>(
    func: T,
    limit: number,
): (...args: Parameters<T>) => void {
    let lastFunc: ReturnType<typeof setTimeout>;
    let lastRan: number | undefined;

    return function (...args: Parameters<T>) {
        const now = Date.now();

        if (!lastRan) {
            func(...args);
            lastRan = now;
        } else {
            clearTimeout(lastFunc);

            lastFunc = setTimeout(
                () => {
                    if (now - lastRan! >= limit) {
                        func(...args);
                        lastRan = Date.now();
                    }
                },
                limit - (now - lastRan),
            );
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
