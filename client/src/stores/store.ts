import { defineStore } from "pinia";
import {navigateTo} from "@/router/navigation";
import * as userAccountViewService from "@/services/component-services/userAccountViewService";
import * as constants from "@/utils/constants";
import * as authenticationService from "@/services/api-services/authenticationService";

//--------------------app bar-----------------------------//
export const useAppBarStore = defineStore("appBar", () => {
    const previousTitle = ref<string>("");
    const title = ref<string>("Example Title");

    return {
        previousTitle,
        title
    };
});
//-------------------------------------------------//

//--------------------navigation-----------------------------//
export const useNavigationStore = defineStore("navigation", () => {
    const isNavigationOverviewOpen = ref<boolean>(false);

    return {
        isNavigationOverviewOpen
    };
});
//-------------------------------------------------//

//----------------------authentication---------------------------//
export const useAuthStore = defineStore("auth", () => {
    const redirectRoute: string = "";
  
    async function login(accessTokenString: string, refreshTokenString: string){
      setAccessToken(accessTokenString);
      setRefreshToken(refreshTokenString);
  
      await userAccountViewService.setPersonalUserAccount();
  
      if(useAuthStore().redirectRoute == ""){
          navigateTo(constants.HOME_PAGE_ROUTE);
      }else{
          navigateTo(useAuthStore().redirectRoute);
      }
    }
  
    async function loginWithJwt(accessTokenString: string, refershTokenString: string, redirect: string){
      setAccessToken(accessTokenString);
      setRefreshToken(refershTokenString);
  
      navigateTo(redirect);
  
      await userAccountViewService.setPersonalUserAccount();
    }
  
    async function logout(){
    //   await authenticationService.logLogout();
      
      setAccessToken("");
      setRefreshToken("");
      useUserAccountStore().userAccount = null;
  
      navigateTo(constants.DEFAULT_ROUTE);
    }
    
    function setAccessToken(accessTokenString: string){
      localStorage.setItem("accessToken", accessTokenString);
    }
  
    function getAccessToken() : string{
      const accessToken: string | null = localStorage.getItem("accessToken");
      if(accessToken == null){ return "accessToken";}
      return accessToken;
    }
  
    function setRefreshToken(refreshTokenString: string){
      localStorage.setItem("refreshToken", refreshTokenString);
    }
  
    function getRefreshToken() : string{
      const refreshToken: string | null = localStorage.getItem("refreshToken");
      if(refreshToken == null){ return "refreshToken";}
      return refreshToken;
    }
  
    return {redirectRoute, login, loginWithJwt, logout, setAccessToken, getAccessToken, setRefreshToken, getRefreshToken};
});
//-------------------------------------------------//
  
  
//---------------------account----------------------------//
export const useUserAccountStore = defineStore("account", () => {
    const userAccount = ref<UserAccount | null>();
    const isEditMode = ref<boolean>();
    const isAccountSelected = ref<boolean>(false);
    const selectedAccountId = ref<number>();

    return {userAccount, isEditMode, isAccountSelected, selectedAccountId};
});
//-------------------------------------------------//

//----------------------loading---------------------------//
export const useLoadingStore = defineStore("loading", () => {
  const skipLoading = ref<boolean>(false);
  const isLoading = ref<boolean>(false);
  const isTimeout = ref<boolean>(false);

  return {skipLoading, isLoading, isTimeout};
});
//-------------------------------------------------//