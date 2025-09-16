import axios, { AxiosInstance } from "axios";
import * as authenticationService from "@/services/authenticationService";
import { navigateTo } from "@/router/navigation";
import * as ENV from "@/config/envConfig";
import { useLoadingStore } from "@/stores/store";
import { useErrorStore } from "@/stores/seb-server/errorStore";
import { useAuthStore } from "@/stores/authentication/authenticationStore";
import * as generalUtils from "@/utils/generalUtils";
import { StorageItemEnum } from "@/models/StorageItemEnum";

export let api: AxiosInstance;

export function createApi() {
    api = axios.create({
        baseURL: ENV.SERVER_URL + ENV.SERVER_PORT,
        headers: getHeaders(StorageItemEnum.ACCESS_TOKEN),
    });
}

export function createApiInterceptor() {
    const authStore = useAuthStore();
    const loadingStore = useLoadingStore();
    const errorStore = useErrorStore();

    let loadingTimer: NodeJS.Timeout | null = null;
    const loadingTimout: number = 500;

    let requests = 0;

    let loadingEndTimer: NodeJS.Timeout | null = null;

    api.interceptors.request.use(async (config) => {
        // check if url does not need loading spinner
        const isIgnoredUrl: boolean = isUrlIgnorable(config.url);
        if (loadingStore.skipLoading || isIgnoredUrl) {
            return config;
        }

        requests++;
        // console.info("************* --> requests: " + requests);
        if (requests > 1) {
            return config;
        }

        // when loading spinner should be displayed
        loadingTimer = setTimeout(() => {
            loadingStore.isLoading = true;
        }, loadingTimout);

        // until when loading spinner should be displayed (timeout)
        const loadingEndTimout: number = 20000;

        loadingEndTimer = setTimeout(() => {
            resetLoadingState();
        }, loadingEndTimout);

        return config;
    });

    api.interceptors.response.use(
        async (response) => {
            // reset loading spinner and return response
            resetLoadingState();
            return response;
        },
        async (error) => {
            resetLoadingState();
            console.error(error);

            // check if error is authentication error
            const originalRequest = error.config;
            if (error.response.status === 401 && !originalRequest._retry) {
                // try to refresh token
                // ok --> refresh token, retries api call and returns data
                // not ok --> redirected to login page
                return handleAuthenticationError(originalRequest);
            } else {
                // generic error msg
                const errorProps: ErrorProps = {
                    color: "error",
                    textKey: "api-error",
                    timeout: 5000,
                };

                if (
                    error.response.data &&
                    error.response.data[0].systemMessage
                ) {
                    // specific error msg
                    errorProps.textCustom =
                        error.response.data[0].systemMessage;

                    // detailed error msg
                    if (error.response.data[0].details) {
                        errorProps.textCustom =
                            error.response.data[0].systemMessage;
                        errorProps.details = error.response.data[0].details;
                    }
                }

                errorStore.showError(errorProps);

                throw error;
            }
        },
    );

    async function handleAuthenticationError(originalRequest: any) {
        try {
            // refreh tokens for seb server
            const response: Token = await authenticationService.refresh(false);
            authStore.setStorageItem(
                StorageItemEnum.ACCESS_TOKEN,
                response.access_token,
            );
            authStore.setStorageItem(
                StorageItemEnum.REFRESH_TOKEN,
                response.refresh_token,
            );

            // refreh tokens for sp-service
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
            originalRequest.headers = getHeaders(StorageItemEnum.ACCESS_TOKEN);

            // set sp access token if url requested sp resource
            const originalUrl: string | null = originalRequest.url;
            if (originalUrl && originalUrl.startsWith("/sp/")) {
                console.log("it got to here");

                originalRequest.headers = getHeaders(
                    StorageItemEnum.SP_ACCESS_TOKEN,
                );
            }

            return api(originalRequest);
        } catch (error) {
            let redirectRoute: string = "/";
            if (window.location.pathname != null) {
                redirectRoute = window.location.pathname;
            }

            authStore.redirectRoute = redirectRoute;
            navigateTo("/");

            throw Promise.reject(error);
        }
    }

    function resetLoadingState() {
        requests--;
        // console.info("************* <-- requests: " + requests);
        if (requests > 0) {
            return;
        }

        requests = 0;
        if (loadingTimer) clearTimeout(loadingTimer);
        if (loadingEndTimer) clearTimeout(loadingEndTimer);

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
