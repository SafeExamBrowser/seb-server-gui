import axios, { AxiosInstance } from "axios";
import * as authenticationService from "@/services/authenticationService";
import {navigateTo} from "@/router/navigation";
import * as ENV from "@/config/envConfig";
import { useLoadingStore, useAuthStore } from "@/stores/store";
import router from "@/router/router";
import { useErrorStore } from "@/stores/seb-server/errorStore";


export let api: AxiosInstance;

export function createApi(){
    api = axios.create({
        baseURL: ENV.SERVER_URL + ENV.SERVER_PORT,
        headers: getHeaders("accessToken")
    });
}

export function createApiInterceptor(){
    const authStore = useAuthStore();
    const loadingStore = useLoadingStore();
    const errorStore = useErrorStore();

    let loadingTimer: NodeJS.Timeout | null = null;
    let loadingTimout: number = 500;
    
    let loadingEndTimer: NodeJS.Timeout | null = null;

    api.interceptors.request.use(async (config) => {
        //check if url does not need loading spinner
        const isIgnoredUrl: boolean = isUrlIgnorable(config.url);
        if(loadingStore.skipLoading || isIgnoredUrl){
            return config;
        }

        //when loading spinner should be displayed
        loadingTimer = setTimeout(() => {
            loadingStore.isLoading = true;
        }, loadingTimout);


        //until when loading spinner should be displayed (timeout)
        let loadingEndTimout: number = 20000;

        loadingEndTimer = setTimeout(() => {
            resetLoadingState();
        }, loadingEndTimout);

        return config;
    });


    api.interceptors.response.use(async response => {
        resetLoadingState();
        return response;

    }, async error => {
        resetLoadingState();

        console.error(error)

        //authentication error
        const originalRequest = error.config;
        if(error.response.status === 401 && !originalRequest._retry){
            await handleAuthenticationError(originalRequest);
            throw error;

        }else{

            //generic error msg
            let errorProps: ErrorProps = {
                color: "error",
                textKey: "api-error",
                timeout: 5000
            }

            if(error.response.data && error.response.data[0].systemMessage){
                //specific error msg
                errorProps.textCustom = error.response.data[0].systemMessage;

                //detailed error msg
                if(error.response.data[0].details){
                    errorProps.textCustom = error.response.data[0].systemMessage;
                    errorProps.details = error.response.data[0].details;
                }
            }

            errorStore.showError(errorProps);

            throw error;
        }

    });
    

    async function handleAuthenticationError(originalRequest: any){
        try{
            const response: Token = await authenticationService.refresh();

            authStore.setAccessToken("accessToken", response.access_token);
            authStore.setRefreshToken("refreshToken", response.refresh_token);

            originalRequest._retry = true;
            originalRequest.headers = getHeaders("accessToken");

            return api(originalRequest);

        }catch(error){

            let redirectRoute: string = "/";
            if(window.location.pathname != null){
                redirectRoute = window.location.pathname;
            }

            authStore.redirectRoute = redirectRoute;
            navigateTo("/");

            throw Promise.reject(error);
        }
    }


    function resetLoadingState(){
        if (loadingTimer) clearTimeout(loadingTimer); 
        if (loadingEndTimer) clearTimeout(loadingEndTimer); 

        loadingStore.isLoading = false;
        loadingStore.skipLoading = false;
    }
}

export function getHeaders(type: string): object{
    const authStore = useAuthStore();

    return {
      "accept": "application/json",
      "Authorization": "Bearer " + authStore.getAccessToken(type),
      "Content-Type": "application/x-www-form-urlencoded"
    };
}

export function getPostHeaders(type: string): object{
    const authStore = useAuthStore();

    return {
      "accept": "application/json",
      "Authorization": "Bearer " + authStore.getAccessToken(type),
      "Content-Type": "application/json"
    };
}

export function throttle<T extends (...args: any[]) => void>(func: T, limit: number): (...args: Parameters<T>) => void {
    let lastFunc: ReturnType<typeof setTimeout>;
    let lastRan: number | undefined;

    return function (...args: Parameters<T>) {
        const now = Date.now();

        if (!lastRan) {
            func(...args);
            lastRan = now;

        } else {
            clearTimeout(lastFunc);

            lastFunc = setTimeout(() => {
                if (now - lastRan! >= limit) {
                    func(...args);
                    lastRan = Date.now();
                }
            }, limit - (now - lastRan));
        }
    };
}

function getIgnoredUrls(): string[]{
    return [
        "/quiz", 
        "/exams",
        "/sp/screenshot/", 
        "/sp/screenshot-data/", 
        "/sp/screenshot-timestamps/", 
        "/sp/search/timeline", 
        "/sp/search/sessions",
        "/monitoring"

    ];
}

function isUrlIgnorable(url: string | undefined): boolean{
    if(url == null){
        return false;
    } 
    
    const ignoredUrls: string[] = getIgnoredUrls();

    // if(url == "/search/sessions/day"){
    //     return false;
    // }

    if(url.endsWith("/fullpage")){
        return true;
    }

    return ignoredUrls.some(urlFromList => url.includes(urlFromList))
}

export function createSessionDeleteUrlSuffix(sessionUuids: string[]): string{
    let urlSuffix = "?modelIds=";

    for(let i = 0; i < sessionUuids.length; i++){
        urlSuffix += sessionUuids[i];

        if(i != sessionUuids.length-1){
            urlSuffix += "&modelIds=";
        }
    }

    return urlSuffix;
}