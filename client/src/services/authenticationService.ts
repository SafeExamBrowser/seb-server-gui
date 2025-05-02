import axios, { AxiosResponse } from 'axios'
import * as ENV from "@/config/envConfig";
import { useAuthStore, useLoadingStore } from "@/stores/store";
import * as apiService from "@/services/apiService";

let loadingTimeout: NodeJS.Timeout | null = null;
let loadingEndTimeout: NodeJS.Timeout | null = null;

export async function login(username: string, password: string): Promise<string | any> {
    const loadingStore = useLoadingStore();

    try {
        const url: string = ENV.SERVER_URL + ENV.SERVER_PORT + "/authorize";

        //this is implemented for general api-calls in apiService.ts but has to be done explicitly for login as it does not use said service
        setLoginTimeouts();

        const response = await axios.post(url, {
            username,
            password
        });

        if (response.status === 200) {
            resetLoadingState();
            return response.data;
        } 

    } catch (error) {
        resetLoadingState();
        throw error;
    }


    function setLoginTimeouts(){
        loadingTimeout = setTimeout(() => {
            loadingStore.isLoading = true;
        }, 500);
        loadingEndTimeout = setTimeout(() => {
            resetLoadingState();
            loadingStore.isTimeout = true;
        }, 10000);
    }
    
    function resetLoadingState(){
        if (loadingTimeout) clearTimeout(loadingTimeout); 
        if (loadingEndTimeout) clearTimeout(loadingEndTimeout); 
    
        loadingStore.isLoading = false;
    }
}










export async function loginSP(username: string, password: string): Promise<string | any> {
    const loadingStore = useLoadingStore();

    try {
        const url: string = ENV.SERVER_URL + ENV.SERVER_PORT + "/sp-authorize";

        //this is implemented for general api-calls in apiService.ts but has to be done explicitly for login as it does not use said service
        setLoginTimeouts();

        const response = await axios.post(url, {
            username,
            password
        });

        if (response.status === 200) {
            resetLoadingState();
            return response.data;
        } 

    } catch (error) {
        resetLoadingState();
        throw error;
    }


    function setLoginTimeouts(){
        loadingTimeout = setTimeout(() => {
            loadingStore.isLoading = true;
        }, 500);
        loadingEndTimeout = setTimeout(() => {
            resetLoadingState();
            loadingStore.isTimeout = true;
        }, 10000);
    }
    
    function resetLoadingState(){
        if (loadingTimeout) clearTimeout(loadingTimeout); 
        if (loadingEndTimeout) clearTimeout(loadingEndTimeout); 
    
        loadingStore.isLoading = false;
    }
}











export async function verifyJwt(token: string): Promise<string | any> {

  try {
    const url: string = ENV.SERVER_URL + ENV.SERVER_PORT + "/jwttoken/verify";
    
    const response = await axios.post(url, {token});

    if (response.status === 200) {
      return response.data;
    } 

  } catch (error) {
    throw error;
  }
}

export async function refresh(): Promise<string | any>{
  const authStore = useAuthStore();

  try{
    const url: string = ENV.SERVER_URL + ENV.SERVER_PORT + "/refresh";

    const headers = {
      "Authorization": "Bearer " + authStore.getRefreshToken("refreshToken"),
    };
    
    const response: AxiosResponse<Token> = await axios.post(url, {}, {headers: headers});

    return response.data;

  }catch(error){
    throw error;
  }
}

export async function logLogout(){
  try{
    const url: string = "useraccount/logLogout";
    const {data, status}: AxiosResponse = await apiService.api.post(url, {headers: apiService.getHeaders("accessToken")});

  }catch(error){
    throw error;
  }
}