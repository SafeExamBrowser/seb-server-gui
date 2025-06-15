import { defineStore } from "pinia";
import { navigateTo } from "@/router/navigation";
import * as userAccountViewService from "@/services/seb-server/component-services/userAccountViewService";
import * as constants from "@/utils/constants";
import * as authenticationService from "@/services/authenticationService";


//--------------------app bar-----------------------------//
export const useAppBarStore = defineStore("appBar", () => {
    const previousTitle = ref<string>("");
    const title = ref<string>("Example Title");


    const examOverviewShowPastExams = ref<boolean>(false);
    const examOverviewShowUpcomingExams = ref<boolean>(false);

    const galleryGridSize = ref<GridSize>({
        title: "3x3",
        value: 3
    });
    const galleryIsNameEnabled = ref<boolean>(true);
    const galleryIsIpEnabled = ref<boolean>(false);
    const galleryIsMetadataEnabled = ref<boolean>(false);
    const galleryCurrentPage = ref<number>(1);
    const galleryMaxPages = ref<number>(1);
    const galleryLiveSessions = ref<number>(0)
    const galleryAmountOfSessions = ref<number>(0);
    const galleryDescription = ref<string>("");
    const galleryIsNameSortAsc = ref<boolean>(true);

    return {
        previousTitle,
        title,
        examOverviewShowPastExams,
        examOverviewShowUpcomingExams,
        galleryGridSize, 
        galleryIsNameEnabled, 
        galleryIsIpEnabled, 
        galleryIsMetadataEnabled, 
        galleryCurrentPage, 
        galleryMaxPages, 
        galleryLiveSessions,
        galleryAmountOfSessions,
        galleryDescription,
        galleryIsNameSortAsc
    };
});


//--------------------navigation-----------------------------//
export const useNavigationStore = defineStore("navigation", () => {
    const isNavigationOverviewOpen = ref<boolean>(false);

    return {
        isNavigationOverviewOpen
    };
});


//----------------------authentication---------------------------//
// export const useAuthStore = defineStore("auth", () => {
//     const redirectRoute: string = "";

//     async function login(accessTokenString: string, refreshTokenString: string) {
//         setAccessToken(StorageItemEnum.ACCESS_TOKEN, accessTokenString);
//         setRefreshToken("refreshToken", refreshTokenString);

//         await userAccountViewService.setPersonalUserAccount();

//         if (useAuthStore().redirectRoute == "") {
//             navigateTo(constants.HOME_PAGE_ROUTE);
//         } else {
//             let route: string = useAuthStore().redirectRoute;
//             let subPath: string | null = import.meta.env.VITE_SUB_PATH;

//             if (subPath != null && route.includes(subPath)) {
//                 route = route.replace(subPath, "");
//             }

//             navigateTo(route);
//         }
//     }

//     async function loginSP(accessTokenString: string, refreshTokenString: string) {
//         setAccessToken(StorageItemEnum.SP_ACCESS_TOKEN, accessTokenString);
//         setRefreshToken("spRefreshToken", refreshTokenString);

//         // await userAccountViewService.setPersonalUserAccount();

//         // if (useAuthStore().redirectRoute == "") {
//         //     navigateTo(constants.HOME_PAGE_ROUTE);
//         // } else {
//         //     let route: string = useAuthStore().redirectRoute;
//         //     let subPath: string | null = import.meta.env.VITE_SUB_PATH;

//         //     if (subPath != null && route.includes(subPath)) {
//         //         route = route.replace(subPath, "");
//         //     }

//         //     navigateTo(route);
//         // }
//     }

//     async function loginWithJwt(accessTokenString: string, refreshTokenString: string, redirect: string) {
//         setAccessToken(StorageItemEnum.SP_ACCESS_TOKEN, accessTokenString);
//         setRefreshToken("spRefreshToken", refreshTokenString);

//         navigateTo(redirect);

//         await userAccountViewService.setPersonalUserAccount();
//     }

//     async function logout() {
//         //   await authenticationService.logLogout();

//         setAccessToken(StorageItemEnum.ACCESS_TOKEN, "");
//         setRefreshToken("refreshToken", "");
//         useUserAccountStore().setUserTimeZone("");
//         useUserAccountStore().userAccount = null;

//         navigateTo(constants.DEFAULT_ROUTE);
//     }

//     function setAccessToken(type: string, accessTokenString: string) {
//         localStorage.setItem(type, accessTokenString);
//     }

//     function getStorageItem(type: string,): string {
//         const accessToken: string | null = localStorage.getItem(type);
//         if (accessToken == null) { return type; }
//         return accessToken;
//     }

//     function setRefreshToken(type: string, refreshTokenString: string) {
//         localStorage.setItem(type, refreshTokenString);
//     }

//     function getStorageItem(type: string): string {
//         const refreshToken: string | null = localStorage.getItem(type);
//         if (refreshToken == null) { return type; }
//         return refreshToken;
//     }

//     return { redirectRoute, login, loginSP, loginWithJwt, logout, setAccessToken, getStorageItem, setRefreshToken, getStorageItem };
// });


//---------------------account----------------------------//
// export const useUserAccountStore = defineStore("account", () => {
//     const userAccount = ref<UserAccount | null>();
//     const isEditMode = ref<boolean>();
//     const isAccountSelected = ref<boolean>(false);
//     const selectedAccountId = ref<number>();

//     function setUserTimeZone(userTimeZone: string){
//         localStorage.setItem("userTimeZone", userTimeZone);
//     }

//     function getUserTimeZone(): string{
//         const userTimeZone: string | null = localStorage.getItem("userTimeZone");
//         if (userTimeZone == null) { return "UTC"; }
//         return userTimeZone;
//     }

//     return { userAccount, isEditMode, isAccountSelected, selectedAccountId, setUserTimeZone, getUserTimeZone };
// });


//----------------------loading---------------------------//
export const useLoadingStore = defineStore("loading", () => {
    const skipLoading = ref<boolean>(false);
    const isLoading = ref<boolean>(false);
    const isTimeout = ref<boolean>(false);

    return { skipLoading, isLoading, isTimeout };
});


//----------------------sp exams overview---------------------------//
export const useTableStore = defineStore("table", () => {
    const isIndicatorsExpanded = ref<boolean>(false);
    const isIndicatorExpandButtonDisabled = ref<boolean>(false);

    const isIpDisplayList = ref<{day: string, isIp: boolean}[]>([]);
  
    return {isIndicatorsExpanded, isIpDisplayList, isIndicatorExpandButtonDisabled};
});


//----------------------gallery view---------------------------//
export const useGalleryStore = defineStore("gallery", () => {
    const focusedImageIndexes = ref<boolean[]>([]);
  
    return {focusedImageIndexes};
});